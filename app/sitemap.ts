import type { MetadataRoute } from 'next'

import { site } from '@/data/site'

/**
 * The four public routes. Disclosure documents are deliberately left out —
 * they are versioned PDFs that get replaced, and a stale sitemap entry
 * pointing at a superseded FSG is worse than no entry.
 */
const routes = [
  { path: '', priority: 1 },
  { path: '/services', priority: 0.8 },
  { path: '/contact', priority: 0.8 },
  { path: '/complaints', priority: 0.5 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: r.priority,
  }))
}
