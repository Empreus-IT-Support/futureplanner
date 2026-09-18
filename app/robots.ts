import type { MetadataRoute } from 'next'

import { site } from '@/data/site'

/**
 * Indexing is OFF unless SITE_INDEXABLE is explicitly set to "true".
 *
 * The default is deliberate. Until AVALONFS has approved the site and the six
 * written consents are in, nothing here should be discoverable — a name or a
 * photograph picked up by a crawler is published whether or not the page is
 * later changed, and search caches outlive the page.
 *
 * Flip SITE_INDEXABLE to "true" in the Vercel project at launch, not before.
 * `npm run check:launch` reports the current state.
 */
export const indexable = process.env.SITE_INDEXABLE === 'true'

export default function robots(): MetadataRoute.Robots {
  if (!indexable) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
