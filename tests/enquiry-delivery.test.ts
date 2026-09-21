/**
 * Delivery behaviour, with a mail key configured.
 *
 * The module reads ATLAS_SENDING_KEY at import time, so each case sets the
 * environment and then imports a fresh copy.
 *
 * The case that matters most is the second one. Atlas keys are allowlisted to
 * a fixed set of recipients, and an enquirer's address cannot be on that list
 * in advance — so the auto-reply may be refused by design. When that happens
 * the enquiry has still reached the office, and telling the visitor it failed
 * would make them send it again.
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

  it('still reports success when the auto-reply is refused', async () => {
    // First send succeeds, second is rejected as a non-allowlisted recipient.
    mockFetch((n) => new Response('{}', { status: n === 1 ? 200 : 403 }))
    const { POST } = await loadRoute()

    const res = await POST(request())
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ ok: true })
    expect(calls).toHaveLength(2)
  })

  it('reports failure when the enquiry itself cannot be sent', async () => {
    mockFetch(() => new Response('{}', { status: 500 }))
    const { POST } = await loadRoute()

    const res = await POST(request())
    expect(res.status).toBe(502)
    // The auto-reply is not attempted if the enquiry never got through.
    expect(calls).toHaveLength(1)
  })

  it('carries the FSG link and the advice warning in the auto-reply', async () => {
    mockFetch(() => new Response('{}', { status: 200 }))
    const { POST } = await loadRoute()
    await POST(request())

    const autoReply = String(calls[1].body.text)
    expect(autoReply).toContain('/docs/FSG-v6-2-2025-02.pdf')
    expect(autoReply).toContain('General advice warning.')
    expect(calls[1].body.to).toEqual(['enquirer@example.com'])
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
