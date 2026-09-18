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
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // No analytics, pixels or trackers are loaded. Check with Sarah before
  // adding any, and widen this policy deliberately if one is ever approved.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
]

const nextConfig: NextConfig = {
  async redirects() {
    return [...legacyPages, ...legacyDocuments]
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
