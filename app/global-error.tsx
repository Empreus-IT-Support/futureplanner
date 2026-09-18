'use client'

import { useEffect } from 'react'

import { footerDisclosure, generalAdviceWarning } from '@/data/compliance'
import { site } from '@/data/site'

import './globals.css'

/**
 * Root-level error boundary.
 *
 * This only renders when the root layout itself has failed, which means it
 * replaces the whole document — no header, no footer, and none of the
 * compliance blocks the layout normally guarantees.
 *
 * So they are carried here by hand. The README is explicit that the general
 * advice warning appears on every page and goes on any page added later, and
 * an error page is still a page the public can land on. The footer disclosure
 * comes with it for the same reason.
 *
 * Styling is kept to inline rules and the imported stylesheet's tokens: the
 * font variables live on the <html> element the failed layout would have
 * rendered, so the display face is not available here.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(`[app] root layout failed${error.digest ? ` (digest ${error.digest})` : ''}`)
  }, [error])

  return (
    <html lang="en-AU">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Arial, sans-serif' }}>
        <main
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: 'clamp(48px, 10vw, 96px) 24px 32px',
            color: '#0C1A2E',
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#C8A43E',
              marginBottom: 14,
            }}
          >
            Future Planner
          </p>
          <h1 style={{ fontSize: 32, lineHeight: 1.2, marginBottom: 12 }}>
            The site is temporarily unavailable
          </h1>
          <hr
            style={{ width: 44, height: 2, background: '#C8A43E', border: 0, margin: '18px 0 24px' }}
          />
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#3C5064', marginBottom: 16 }}>
            Sorry — something has gone wrong at our end. Please try again shortly. If you need to
            reach us in the meantime, call <a href={`tel:${site.phoneHref}`}>{site.phone}</a> or
            email <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#3C5064' }}>
            {/* Deliberately a plain anchor, not next/link. The root layout has
                failed, so the router may be broken too; a full document
                request is what actually recovers, and a client-side navigation
                could fail in the same way that got us here. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">Return to the home page</a>
          </p>
        </main>

        {/* Required on every page — carried by hand because the layout that
            normally renders these has failed. */}
        <div style={{ background: '#F8F6F1', borderTop: '1px solid rgba(12,26,46,0.10)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px' }}>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: '#3C5064', margin: 0 }}>
              <strong style={{ color: '#0C1A2E' }}>General advice warning.</strong>{' '}
              {generalAdviceWarning}
            </p>
          </div>
        </div>

        <footer style={{ background: '#0C1A2E', color: 'rgba(255,255,255,0.64)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '30px 24px' }}>
            <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0 }}>
              <span style={{ color: 'rgba(255,255,255,0.88)', display: 'block', marginBottom: 10 }}>
                {footerDisclosure.entity}
              </span>
              {footerDisclosure.body}
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
