'use client'

import { useEffect, useRef, useState } from 'react'

import { collectionNotice } from '@/data/compliance'
import { docHref, documents, enquiryOffices } from '@/data/site'
import { IconAlert, IconArrow, IconCheck } from './Icons'

type Errors = Partial<Record<'name' | 'email' | 'message', string>>
type Status = { kind: 'idle' | 'sending' } | { kind: 'ok' } | { kind: 'error'; message: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_MESSAGE = 5000

export default function EnquiryForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [messageLength, setMessageLength] = useState(0)
  const statusRef = useRef<HTMLDivElement>(null)

  // Submissions made within a few seconds of load are almost always bots.
  const mountedAt = useRef<number | null>(null)
  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  const privacyPolicy = documents.find((d) => d.title === 'Privacy Policy')!

  // Move focus to the outcome so it is not missed by keyboard or screen reader.
  useEffect(() => {
    if (status.kind === 'ok' || status.kind === 'error') statusRef.current?.focus()
  }, [status])

  /** Clear a field's error as soon as the person starts fixing it. */
  const clearError = (field: keyof Errors) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      office: String(data.get('office') ?? ''),
      message: String(data.get('message') ?? '').trim(),
      // Honeypot and elapsed time. Neither involves a third-party service.
      company: String(data.get('company') ?? ''),
      // Unknown timing must not read as a bot, or a real enquiry is dropped.
      elapsedMs:
        mountedAt.current === null ? Number.MAX_SAFE_INTEGER : Date.now() - mountedAt.current,
    }

    const next: Errors = {}
    if (!payload.name) next.name = 'Please tell us your name.'
    if (!payload.email) next.email = 'Please give us an email address so we can reply.'
    else if (!EMAIL.test(payload.email)) next.email = 'That email address does not look right.'
    if (!payload.message) next.message = 'Please tell us briefly what you are after.'

    setErrors(next)
    if (Object.keys(next).length > 0) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }

    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? 'Something went wrong.')
      }

      form.reset()
      setMessageLength(0)
      setStatus({ kind: 'ok' })
    } catch (err) {
      setStatus({
        kind: 'error',
        message:
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong sending your enquiry.',
      })
    }
  }

  const sending = status.kind === 'sending'

  return (
    <>
      {/* Announced to screen readers, and focused, when the outcome changes. */}
      <div aria-live="polite" tabIndex={-1} ref={statusRef}>
        {status.kind === 'ok' && (
          <div className="form-status form-status--ok">
            <IconCheck size={19} />
            <div>
              <p>
                <strong>Thanks — your enquiry has been sent.</strong> We&rsquo;ll be in touch.
              </p>
              <p>
                A confirmation is on its way to your inbox with a copy of our Financial Services
                Guide.
              </p>
            </div>
          </div>
        )}
        {status.kind === 'error' && (
          <div className="form-status form-status--error">
            <IconAlert size={19} />
            <div>
              <p>
                <strong>Your enquiry did not send.</strong> {status.message}
              </p>
              <p>
                You can also email us at{' '}
                <a href="mailto:admin@futureplanner.au">admin@futureplanner.au</a> or call{' '}
                <a href="tel:+61730633789">07 3063 3789</a>.
              </p>
            </div>
          </div>
        )}
      </div>

      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'name-error' : undefined}
            onInput={() => clearError('name')}
          />
          {errors.name && (
            <span className="field-error" id="name-error">
              <IconAlert size={15} />
              {errors.name}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            onInput={() => clearError('email')}
          />
          {errors.email && (
            <span className="field-error" id="email-error">
              <IconAlert size={15} />
              {errors.email}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="phone">
            Phone <span className="optional">(optional)</span>
          </label>
          <input type="tel" id="phone" name="phone" autoComplete="tel" />
        </div>

        <div className="field">
          <label htmlFor="office">Preferred office</label>
          <select id="office" name="office" defaultValue={enquiryOffices[0]}>
            {enquiryOffices.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="message">How can we help?</label>
          {messageLength > MAX_MESSAGE * 0.8 && (
            <span className="field-count" aria-hidden="true">
              {messageLength} / {MAX_MESSAGE}
            </span>
          )}
          <textarea
            id="message"
            name="message"
            required
            maxLength={MAX_MESSAGE}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'message-error' : undefined}
            onInput={(e) => {
              setMessageLength(e.currentTarget.value.length)
              clearError('message')
            }}
          />
          {errors.message && (
            <span className="field-error" id="message-error">
              <IconAlert size={15} />
              {errors.message}
            </span>
          )}
        </div>

        {/* Honeypot. Hidden from people, left for bots. Not tabbable, not
            announced, and it involves no third-party script or tracking. */}
        <div className="hp" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="collection-notice">
          <p>
            {collectionNotice.before}
            <a href={docHref(privacyPolicy.file)} target="_blank" rel="noopener">
              {collectionNotice.linkText}
            </a>
            {collectionNotice.after}
          </p>
        </div>

        <button className="btn btn--primary" type="submit" disabled={sending}>
          {sending ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Sending
            </>
          ) : (
            <>
              Send enquiry
              <IconArrow className="arrow" />
            </>
          )}
        </button>
      </form>
    </>
  )
}
