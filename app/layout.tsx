import type { Metadata } from 'next'
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'

import AdviceWarning from '@/components/AdviceWarning'
import SiteFooter from '@/components/SiteFooter'
import MotionProvider from '@/components/MotionProvider'
import ScrollUI from '@/components/ScrollUI'
import SiteHeader from '@/components/SiteHeader'
import { site } from '@/data/site'

import './globals.css'

/**
 * Both faces are self-hosted by next/font rather than fetched from the Google
 * Fonts CDN at runtime, so no third-party request is made for type.
 *
 * Playfair Display is the brand serif and stays as the display face.
 *
 * Source Sans 3 replaces Arial for body text. NOTE: Arial came from
 * FuturePlanner_BrandingGuide.html, so this is a deliberate departure from the
 * brand guide and needs sign-off with the rest of the design. It is a one-line
 * revert — see --body in globals.css. Source Sans 3 was chosen for its
 * legibility at small sizes, which matters most for the footer disclosure and
 * the general advice warning.
 */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-display',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-body',
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
    <html lang="en-AU" className={`${playfair.variable} ${sourceSans.variable}`}>
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
