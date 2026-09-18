import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'

import AdviceWarning from '@/components/AdviceWarning'
import SiteFooter from '@/components/SiteFooter'
import MotionProvider from '@/components/MotionProvider'
import ScrollUI from '@/components/ScrollUI'
import SiteHeader from '@/components/SiteHeader'
import { site } from '@/data/site'

import './globals.css'

/**
 * Playfair Display, self-hosted by next/font rather than fetched from the
 * Google Fonts CDN at runtime. The body typeface is a system stack and needs
 * no download. No third-party request is made for type.
 */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Future Planner — Financial advice on the Gold Coast, Canberra and Mount Isa',
    template: '%s — Future Planner',
  },
  description:
    'Future Planner provides personal financial advice from offices on the Gold Coast, in ' +
    'Canberra and Mount Isa, and by video across Australia.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: site.name,
    url: site.url,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={playfair.variable}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>

        <MotionProvider />
        <ScrollUI />

        <SiteHeader />

        <main id="main">{children}</main>

        {/* Required on every page. Rendered here so new routes inherit it. */}
        <AdviceWarning />

        <SiteFooter />
      </body>
    </html>
  )
}
