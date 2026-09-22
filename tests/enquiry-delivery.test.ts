/**
 * Delivery behaviour, with a mail key configured.
 *
 * The module reads ATLAS_SENDING_KEY at import time, so each case sets the
 * environment and then imports a fresh copy.
 *
 * The acknowledgement to the enquirer is no longer sent from here. Atlas keys
 * are allowlisted to fixed recipients, and the auto-reply is the one message a
 * key may send outside that list — so Atlas holds the wording and the site
 * just sets auto_reply. One call now, not two.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const ORIGIN = 'https://futureplanner.au'

function request(body: Record<string, unknown> = {}) {
  return new Request(`${ORIGIN}/api/enquiry`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      host: 'futureplanner.au',
      origin: ORIGIN,
      'x-forwarded-for': `198.51.100.${Math.floor(Math.random() * 250) + 1}`,
    },
    body: JSON.stringify({
      name: 'Test Person',
      email: 'enquirer@example.com',
      office: 'Canberra',
      message: 'Please get in touch.',
      company: '',
      elapsedMs: 9000,
      ...body,
    }),
  })
}

async function loadRoute() {
  vi.resetModules()
  vi.stubEnv('ATLAS_SENDING_KEY', 'atl_test_key_not_real')
  vi.stubEnv('ENQUIRY_TO', 'admin@futureplanner.au')
  vi.stubEnv('ENQUIRY_FROM', 'Future Planner <DoNotReply@futureplanner.au>')
  return import('@/app/api/enquiry/route')
}

describe('delivery through Atlas', () => {
  let calls: { url: string; body: Record<string, unknown>; auth: string | null }[] = []

  beforeEach(() => {
    calls = []
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  const mockFetch = (responder: (n: number) => Response) => {
    let n = 0
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init: RequestInit) => {
        calls.push({
          url: String(url),
          body: JSON.parse(String(init.body)),
          auth: new Headers(init.headers).get('authorization'),
        })
        return responder(++n)
      }),
    )
  }

  it('posts the enquiry to Atlas with the registered from address', async () => {
    mockFetch(() => new Response('{}', { status: 200 }))
    const { POST } = await loadRoute()

    const res = await POST(request())
    expect(res.status).toBe(200)

    expect(calls[0].url).toBe('https://atlascontrol.io/api/email/send')
    expect(calls[0].auth).toBe('Bearer atl_test_key_not_real')
    // Atlas wants a bare address; the display-name form must be unwrapped.
    expect(calls[0].body.from).toBe('DoNotReply@futureplanner.au')
    expect(calls[0].body.to).toEqual(['admin@futureplanner.au'])
    expect(calls[0].body.reply_to).toBe('enquirer@example.com')
    expect(calls[0].body.subject).toBe('Website enquiry — Canberra')
  })

  it('asks Atlas to send the acknowledgement, in one call not two', async () => {
    mockFetch(() => new Response('{}', { status: 200 }))
    const { POST } = await loadRoute()
    await POST(request())

    // auto_reply plus reply_to is what triggers Atlas's acknowledgement. The
    // wording lives in Atlas, not here: the key is allowlisted to fixed
    // recipients and this is the only message it may send to an address
    // outside that list, so a stolen key cannot alter what it says.
    //
    // NOTE: that means the FSG link and the general advice warning are no
    // longer assertable from this repo. They are configured in the Auto-reply
    // panel on the key, and are verified there rather than by these tests.
    expect(calls).toHaveLength(1)
    expect(calls[0].body.auto_reply).toBe(true)
    expect(calls[0].body.reply_to).toBe('enquirer@example.com')
  })

  it('reports failure when the enquiry cannot be sent', async () => {
    mockFetch(() => new Response('{}', { status: 500 }))
    const { POST } = await loadRoute()

    const res = await POST(request())
    expect(res.status).toBe(502)
    expect(calls).toHaveLength(1)
  })
})

describe('rate limiting', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('does not extend the lockout when a blocked caller keeps retrying', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 })))
    const { POST } = await loadRoute()

    const from = (ip: string) =>
      new Request(`${ORIGIN}/api/enquiry`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          host: 'futureplanner.au',
          origin: ORIGIN,
          'x-forwarded-for': ip,
        },
        body: JSON.stringify({
          name: 'Test',
          email: 'a@example.com',
          office: 'Canberra',
          message: 'hello',
          company: '',
          elapsedMs: 9000,
        }),
      })

    const ip = '192.0.2.99'
    const codes: number[] = []
    // MAX_PER_WINDOW is 10; go well past it.
    for (let i = 0; i < 16; i += 1) codes.push((await POST(from(ip))).status)

    expect(codes.filter((c) => c === 429).length).toBeGreaterThan(0)

    // Blocked attempts must not be recorded. If they were, the stored window
    // would keep growing and the caller would never get back in.
    const blockedAfter = codes.slice(10)
    expect(blockedAfter.every((c) => c === 429)).toBe(true)

    // A different address is unaffected.
    expect((await POST(from('192.0.2.100'))).status).toBe(200)
  })
})
