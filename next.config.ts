import type { NextConfig } from 'next'

/**
 * Redirects from the retired static build.
 *
 * The Google Business Profile listings point at /contact.html#mount-isa and
 * the like. Browsers carry the fragment across a 301, so those listings keep
 * landing on the right office card without being re-pointed. Keep these in
 * place — the rule is redirect, never 404.
 */
const legacyPages = [
  { source: '/index.html', destination: '/', permanent: true },
  { source: '/services.html', destination: '/services', permanent: true },
  { source: '/contact.html', destination: '/contact', permanent: true },
  { source: '/complaints.html', destination: '/complaints', permanent: true },
]

/**
 * Superseded document URLs go here as documents are versioned.
 *
 * Old versions must be retained for seven years, so the retired file stays in
 * /public/docs and keeps working. Add a redirect here only when a URL is being
 * retired outright rather than superseded.
 *
 * Example, once FSG v6.3 replaces v6.2:
 *   { source: '/docs/FSG-v6-2-2025-02.pdf',
 *     destination: '/docs/FSG-v6-3-2026-02.pdf', permanent: true },
 */
const legacyDocuments: typeof legacyPages = []

/**
 * Security headers. HSTS assumes HTTPS is enforced at the platform edge, which
 * is a launch checklist item.
 */
/**
 * Content Security Policy.
 *
 * The site loads nothing from a third party: type is self-hosted by next/font,
 * images are local, and there is no analytics, pixel or embed. So every fetch
 * directive locks to 'self', which is the part that matters — it stops an
 * injected script reaching an external origin, and stops data being sent to
 * one.
 *
 * script-src carries 'unsafe-inline' as a deliberate compromise. The App
 * Router inlines its bootstrap and RSC payload as script tags; removing the
 * allowance means nonces, nonces mean middleware, and middleware would make
 * every page dynamic — giving up static generation on a four-page brochure
 * site. Residual risk is low: nothing renders user-supplied content as HTML,
 * and the only dangerouslySetInnerHTML is the JSON-LD block, whose input is an
 * object we construct.
 *
 * If a tracker or embed is ever approved, widen this deliberately rather than
 * reaching for a wildcard — and check with Sarah first, per the README.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // frame-ancestors above supersedes this; kept for browsers predating CSP
  // level 2. DENY rather than SAMEORIGIN — nothing here is meant to be framed.
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  // No analytics, pixels or trackers are loaded. Check with Sarah before
  // adding any, and widen this policy deliberately if one is ever approved.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()',
  },
]

const nextConfig: NextConfig = {
  // Do not advertise the framework and its version to every visitor.
  poweredByHeader: false,
  async redirects() {
    return [...legacyPages, ...legacyDocuments]
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
