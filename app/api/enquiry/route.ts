import { NextResponse } from 'next/server'

import { enquiryOffices, site } from '@/data/site'

/**
 * Enquiry handler.
 *
 * Requirements this satisfies (see README):
 *   · POST over TLS to a handler we control — same origin, no third party
 *   · delivered to admin@futureplanner.au
 *   · Reply-To set to the sender
 *   · subject line "Website enquiry — [office]"
 *   · auto-reply carrying the FSG link and the general advice warning — now
 *     composed in Atlas rather than here, see the send call below
 *   · spam protection with no third-party tracking (honeypot + timing + rate
 *     limit), so nothing here needs the AVALONFS Privacy Policy extended
 *   · no plain-text logging of submissions — see `logFailure` below
 *
 * Still an operations task, not a code one: SPF, DKIM and DMARC must be
 * configured on futureplanner.au before launch, and delivery tested to both a
 * Gmail and an Outlook address. Unauthenticated form mail lands in spam.
 */

export const runtime = 'nodejs'

const TO = process.env.ENQUIRY_TO ?? site.email
/**
 * Atlas only accepts a registered sending address and rejects any other with
 * a 403. Its own integration example and its error reference both name
 * DoNotReply@ as the address to send as, so that is the default here.
 *
 * Accepts either a bare address or "Name <addr>" — Atlas wants the bare
 * address, so it is extracted below.
 *
 * The visitor's address goes in reply_to and never in from: sending as a
 * domain Atlas is not authorised for fails DMARC and the mail is binned.
 */
const FROM = process.env.ENQUIRY_FROM ?? 'DoNotReply@futureplanner.au'
const ATLAS_KEY = process.env.ATLAS_SENDING_KEY

/** "Future Planner <info@futureplanner.au>" -> "info@futureplanner.au" */
const bareAddress = (value: string) => value.match(/<([^>]+)>/)?.[1]?.trim() ?? value.trim()

/** Bots submit near-instantly. People take longer than this to fill a form. */
const MIN_ELAPSED_MS = 3_000
const MAX_FIELD = 5_000
/** Whole-payload ceiling. The form sends a few hundred bytes in practice. */
const MAX_BODY_BYTES = 32_000

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Per-IP rate limit, in memory. Good enough for a low-volume brochure site on
 * a single instance. If this is ever deployed across several instances, move
 * it to a shared store — the limit silently weakens otherwise.
 */
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 10
const MAX_TRACKED_IPS = 5_000
const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()

  // Drop IPs whose window has fully expired, so the map cannot grow without
  // bound on a long-running instance.
  if (hits.size > MAX_TRACKED_IPS) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
    }
  }

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)

  // Check before recording. Recording first meant every blocked retry pushed a
  // fresh timestamp, so anyone who kept trying stayed locked out indefinitely
  // even after the original window had passed — the opposite of what a
  // one-hour limit should do.
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent)
    return true
  }

  recent.push(now)
  hits.set(ip, recent)
  return false
}

/**
 * Log the fact of a failure, never its contents. Enquiry bodies can carry
 * personal and health information, and must not end up in plain-text logs.
 */
function logFailure(stage: string, detail?: string) {
  console.error(`[enquiry] ${stage}${detail ? `: ${detail}` : ''}`)
}

/** Strip CR/LF so user input cannot inject extra mail headers. */
function headerSafe(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

/**
 * What Atlas means by each status, from the error reference on the key page.
 * Logging the meaning alongside the code saves looking it up, and these are
 * the four that actually recur.
 */
const ATLAS_STATUS: Record<number, string> = {
  400: 'a required field is missing, or reply_to is not a valid address',
  401: 'the key is wrong or has been revoked',
  403: 'the from address is not permitted, or a recipient is not on the allowed list',
  404: 'the sending domain is verified but not linked in Azure yet',
  429: 'rate limited by Atlas',
  503: 'the sending key is not ready — check the reason field, e.g. DomainNotLinked',
}

/** Carries the provider's status and body so callers can log what is safe. */
class SendError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
  ) {
    super(`mail provider returned ${status}`)
  }
}

/**
 * Send through Atlas.
 *
 * Atlas holds the provider credentials; the key here only works for one domain
 * and only for the recipients allowlisted against it, so a leaked key cannot
 * be used to send anywhere else. That allowlist is why the auto-reply below is
 * best-effort: the enquirer's address cannot be known in advance, so it may
 * legitimately be refused.
 */
async function send(payload: {
  to: string[]
  subject: string
  text: string
  reply_to?: string
  /** Asks Atlas to send its own acknowledgement to the reply_to address. */
  auto_reply?: boolean
}) {
  const res = await fetch('https://atlascontrol.io/api/email/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ATLAS_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: bareAddress(FROM), ...payload }),
  })

  if (!res.ok) {
    // Keep the provider's explanation. Whether it is safe to log depends on
    // which send failed, so that decision is left to the caller: the office
    // notification goes to our own configured address, but the auto-reply goes
    // to a member of the public.
    const body = await res.text().catch(() => '')
    throw new SendError(res.status, body.slice(0, 300))
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many enquiries from this connection. Please try again later.' },
      { status: 429 },
    )
  }

  // Only accept what the form actually sends. A JSON content type cannot be
  // set by a plain cross-site form post, so this alone turns away the simplest
  // kind of drive-by submission.
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported content type.' }, { status: 415 })
  }

  // Same-origin only. The form lives on this site; nothing else has business
  // posting to it. Requests with no Origin header at all (curl, some privacy
  // tooling) still pass, and the honeypot and timing checks still apply.
  const origin = request.headers.get('origin')
  if (origin) {
    const host = request.headers.get('host')
    let originHost: string | null = null
    try {
      originHost = new URL(origin).host
    } catch {
      originHost = null
    }
    if (!originHost || !host || originHost !== host) {
      logFailure('cross-origin post rejected')
      return NextResponse.json({ error: 'Request rejected.' }, { status: 403 })
    }
  }

  // Refuse an oversized payload rather than buffering it and validating after.
  const declared = Number(request.headers.get('content-length') ?? '0')
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'That message is too long to send.' }, { status: 413 })
  }

  let body: Record<string, unknown>
  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'That message is too long to send.' }, { status: 413 })
    }
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('payload is not an object')
    }
    body = parsed as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }

  const str = (key: string) => (typeof body[key] === 'string' ? (body[key] as string).trim() : '')

  const name = str('name')
  const email = str('email')
  const phone = str('phone')
  const message = str('message')
  const officeRaw = str('office')
  const office = (enquiryOffices as readonly string[]).includes(officeRaw)
    ? officeRaw
    : enquiryOffices[0]

  // Honeypot filled, or submitted too fast to be a person. Accept silently so
  // a bot gets no signal about why it failed.
  const elapsed = typeof body.elapsedMs === 'number' ? body.elapsedMs : Number.MAX_SAFE_INTEGER
  if (str('company') !== '' || elapsed < MIN_ELAPSED_MS) {
    return NextResponse.json({ ok: true })
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Please complete the required fields.' }, { status: 400 })
  }
  if (!EMAIL.test(email)) {
    return NextResponse.json({ error: 'That email address does not look right.' }, { status: 400 })
  }
  if (name.length > MAX_FIELD || message.length > MAX_FIELD || phone.length > 100) {
    return NextResponse.json({ error: 'That message is too long to send.' }, { status: 400 })
  }

  if (!ATLAS_KEY) {
    logFailure('not configured', 'ATLAS_SENDING_KEY is missing')
    return NextResponse.json(
      { error: 'The enquiry form is not configured yet. Please email or call us instead.' },
      { status: 503 },
    )
  }

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    ...(phone ? [`Phone: ${phone}`] : []),
    `Preferred office: ${office}`,
    '',
    'Message:',
    message,
  ]

  try {
    // The enquiry to the office, and — via auto_reply — Atlas's acknowledgement
    // to the person who sent it.
    //
    // The acknowledgement is deliberately NOT composed here. The key is
    // allowlisted to a fixed set of recipients, and the auto-reply is the one
    // message it may send to an address outside that list. Atlas therefore
    // holds the wording itself: a stolen key can ask for it to be sent, but
    // cannot change what it says.
    //
    // That is also where the FSG link and the general advice warning live, so
    // the handover's auto-reply requirement is met in Atlas rather than in
    // this file. If the acknowledgement ever stops arriving, check the
    // Auto-reply panel on the key before looking here.
    await send({
      to: [TO],
      reply_to: headerSafe(email),
      subject: `Website enquiry — ${headerSafe(office)}`,
      text: lines.join('\n'),
      auto_reply: true,
    })
  } catch (err) {
    logFailure(
      'enquiry send failed',
      err instanceof SendError
        ? `${err.status} (${ATLAS_STATUS[err.status] ?? 'unrecognised status'}) ${err.body}`
        : undefined,
    )
    return NextResponse.json(
      { error: 'We could not send your enquiry just now. Please email or call us instead.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
