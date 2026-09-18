'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { IconArrow } from '@/components/Icons'
import { site } from '@/data/site'

/**
 * Route-level error boundary.
 *
 * This renders inside the root layout, so the header, the general advice
 * warning and the footer disclosure are all still present — only the page
 * content is replaced.
 *
 * It deliberately gives people a way to reach the firm that does not depend on
 * whatever just broke: the phone number and the inbox, not the enquiry form.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Digest only. The message can carry request detail, and nothing from a
    // visitor's session belongs in a log. See the enquiry route for the same
    // reasoning.
    console.error(`[page] render failed${error.digest ? ` (digest ${error.digest})` : ''}`)
  }, [error])

  return (
    <section className="section notfound">
      <div className="wrap">
        <p className="eyebrow">Something went wrong</p>
        <h1>This page didn&rsquo;t load</h1>
        <hr className="rule-gold" />
        <p>
          Sorry — something failed at our end. Trying again often clears it. If it doesn&rsquo;t,
          please call us on <a href={`tel:${site.phoneHref}`}>{site.phone}</a> or email{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a> and we&rsquo;ll help directly.
        </p>
        <div className="notfound-actions">
          <button className="btn btn--primary" type="button" onClick={reset}>
            Try again
            <IconArrow className="arrow" />
          </button>
          <Link className="btn btn--outline" href="/">
            Home
          </Link>
        </div>
      </div>
    </section>
  )
}
