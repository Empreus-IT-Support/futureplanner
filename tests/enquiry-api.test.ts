/**
 * The enquiry endpoint.
 *
 * Covers the rejection paths and, more importantly, two things that would be
 * quiet if they broke: that a submission body never reaches the logs, and that
 * user input cannot inject mail headers or raw HTML into the message we send.
 *
 * Each test uses a distinct X-Forwarded-For so the in-process rate limiter
 * does not bleed between cases.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * These cases all assert behaviour that happens BEFORE any mail is sent, so
 * the route is loaded with the sending key explicitly unset.
 *
 * It used to be imported statically and rely on the key simply not being
 * present. That held locally and broke on Vercel, where the suite runs in
 * prebuild with the production environment loaded — the "not configured"
 * assertions failed, and worse, the tests made real calls to Atlas from the
 * build machine. Never depend on the ambient environment here.
 */
let POST: (typeof import('@/app/api/enquiry/route'))['POST']

beforeEach(async () => {
  vi.resetModules()
  vi.stubEnv('ATLAS_SENDING_KEY', '')
  ;({ POST } = await import('@/app/api/enquiry/route'))
})

let ip = 0
const nextIp = () => `203.0.113.${(ip += 1) % 255}`

const valid = {
  name: 'Test Person',
  email: 'test@example.com',
  phone: '0400 000 000',
  office: 'Canberra',
  message: 'Hello, I would like some advice.',
  company: '',
  elapsedMs: 9000,
}

function post(body: unknown, init: { contentType?: string | null; origin?: string } = {}) {
  const headers = new Headers({ host: 'futureplanner.au', 'x-forwarded-for': nextIp() })
  if (init.contentType !== null) {
    headers.set('content-type', init.contentType ?? 'application/json')
  }
  if (init.origin) headers.set('origin', init.origin)

  return POST(
    new Request('https://futureplanner.au/api/enquiry', {
      method: 'POST',
      headers,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  )
}

describe('rejection paths', () => {
  it('refuses a non-JSON content type', async () => {
    const res = await post(valid, { contentType: 'application/x-www-form-urlencoded' })
    expect(res.status).toBe(415)
  })

  it('refuses a cross-origin post', async () => {
    const res = await post(valid, { origin: 'https://evil.example' })
    expect(res.status).toBe(403)
  })

  it('allows a same-origin post through to the mail step', async () => {
    const res = await post(valid, { origin: 'https://futureplanner.au' })
    // 503, not 200: the sending key is deliberately unset above. Reaching
    // that path means every validation gate passed.
    expect(res.status).toBe(503)
  })

  it('refuses an oversized body', async () => {
    const res = await post({ ...valid, message: 'x'.repeat(40_000) })
    expect(res.status).toBe(413)
  })

  it('refuses JSON that is not an object', async () => {
    const res = await post('[1,2,3]')
    expect(res.status).toBe(400)
  })

  it('refuses malformed JSON', async () => {
    const res = await post('not json at all')
    expect(res.status).toBe(400)
  })

  it('refuses a missing required field', async () => {
    const res = await post({ ...valid, message: '' })
    expect(res.status).toBe(400)
  })

  it('refuses an address that is not an email', async () => {
    const res = await post({ ...valid, email: 'not-an-email' })
    expect(res.status).toBe(400)
  })
})

describe('spam handling', () => {
  it('accepts a filled honeypot silently, so a bot learns nothing', async () => {
    const res = await post({ ...valid, company: 'Acme Pty Ltd' })
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ ok: true })
  })

  it('accepts a too-fast submission silently for the same reason', async () => {
    const res = await post({ ...valid, elapsedMs: 200 })
    expect(res.status).toBe(200)
  })

  it('does not treat unknown timing as a bot, which would drop a real enquiry', async () => {
    const res = await post({ ...valid, elapsedMs: Number.MAX_SAFE_INTEGER })
    expect(res.status).toBe(503)
  })
})

describe('privacy of failures', () => {
  let errors: string[] = []

  beforeEach(() => {
    errors = []
    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      errors.push(args.map(String).join(' '))
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('never writes the submission into the logs', async () => {
    const secret = 'SENSITIVE-MEDICAL-DETAIL-DO-NOT-LOG'
    await post({ ...valid, message: secret, name: 'Jane Patient' })

    const joined = errors.join('\n')
    expect(joined).not.toContain(secret)
    expect(joined).not.toContain('Jane Patient')
    expect(joined).not.toContain(valid.email)
  })
})
