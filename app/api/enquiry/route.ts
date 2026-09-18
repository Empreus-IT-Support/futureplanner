import { NextResponse } from 'next/server'

import { generalAdviceWarning } from '@/data/compliance'
import { enquiryOffices, fsgUrl, site } from '@/data/site'

/**
 * Enquiry handler.
 *
 * Requirements this satisfies (see README):
 *   · POST over TLS to a handler we control — same origin, no third party
 *   · delivered to admin@futureplanner.au
 *   · Reply-To set to the sender
 *   · subject line "Website enquiry — [office]"
 *   · auto-reply carrying the FSG link and the general advice warning
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
const FROM = process.env.ENQUIRY_FROM ?? 'Future Planner website <noreply@futureplanner.au>'
const RESEND_KEY = process.env.RESEND_API_KEY

/** Bots submit near-instantly. People take longer than this to fill a form. */
const MIN_ELAPSED_MS = 3_000
const MAX_FIELD = 5_000

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
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

/**
 * Log the fact of a failure, never its contents. Enquiry bodies can carry
 * personal and health information, and must not end up in plain-text logs.
 */
function logFailure(stage: string, detail?: string) {
  console.error(`[enquiry] ${stage}${detail ? `: ${detail}` : ''}`)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Strip CR/LF so user input cannot inject extra mail headers. */
function headerSafe(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

async function send(payload: Record<string, unknown>) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    // Status only. The response body can echo the recipient address back.
    throw new Error(`mail provider returned ${res.status}`)
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

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
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

  if (!RESEND_KEY) {
    logFailure('not configured', 'RESEND_API_KEY is missing')
    return NextResponse.json(
      { error: 'The enquiry form is not configured yet. Please email or call us instead.' },
      { status: 503 },
    )
  }

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    office: escapeHtml(office),
    message: escapeHtml(message).replace(/\n/g, '<br>'),
  }

  try {
    // 1. The enquiry itself, to the office inbox.
    await send({
      from: FROM,
      to: [TO],
      reply_to: headerSafe(email),
      subject: `Website enquiry — ${headerSafe(office)}`,
      html: `
        <p><strong>Name:</strong> ${safe.name}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        ${safe.phone ? `<p><strong>Phone:</strong> ${safe.phone}</p>` : ''}
        <p><strong>Preferred office:</strong> ${safe.office}</p>
        <p><strong>Message:</strong><br>${safe.message}</p>
      `,
    })

    // 2. Auto-reply. Must carry the FSG link and the general advice warning.
    await send({
      from: FROM,
      to: [headerSafe(email)],
      reply_to: TO,
      subject: 'We have received your enquiry — Future Planner',
      html: `
        <p>Hello ${safe.name},</p>
        <p>Thanks for getting in touch. We have received your enquiry and someone will
           respond shortly.</p>
        <p>Our Financial Services Guide sets out what AVALONFS is licensed to provide, how
           advisers are paid and how complaints are handled. You can read it here:
           <a href="${fsgUrl}">${fsgUrl}</a></p>
        <p style="font-size:14px;color:#3C5064">
          <strong>General advice warning.</strong> ${escapeHtml(generalAdviceWarning)}
        </p>
        <p style="font-size:13px;color:#3C5064">
          ${site.legalName} · <a href="tel:${site.phoneHref}">${site.phone}</a> ·
          <a href="mailto:${site.email}">${site.email}</a>
        </p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Never log the enquiry body. Stage and provider status only.
    logFailure('send failed', err instanceof Error ? err.message : undefined)
    return NextResponse.json(
      { error: 'We could not send your enquiry just now. Please email or call us instead.' },
      { status: 502 },
    )
  }
}
