import { footerDisclosure } from '@/data/compliance'
import { licensee, offices, site } from '@/data/site'
import { publishedTeam } from '@/data/team'

/**
 * JSON-LD for the organisation and its three offices.
 *
 * Two rules this must keep to:
 *
 * 1. It only ever restates what is already visible on the page. Structured
 *    data that says more than the page does is exactly the kind of thing that
 *    gets a financial services site in trouble, and it is easy to miss because
 *    nobody reads it.
 *
 * 2. It respects the consent gate. People come from publishedTeam(), not from
 *    the raw team list, so an unconsented name cannot leak into markup that
 *    search engines read even though the visible page withholds it. Right now
 *    that array is empty, which is correct.
 *
 * No aggregateRating, no review and no priceRange: we have no basis for any of
 * them, and inventing them would be a fabricated claim.
 */
export default function StructuredData() {
  const people = publishedTeam()

  const locations = offices.map((office) => ({
    '@type': 'FinancialService',
    '@id': `${site.url}/contact#${office.id}`,
    name: `${site.legalName} — ${office.short}`,
    url: `${site.url}/contact#${office.id}`,
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: office.lines.filter((l) => !l.startsWith('Postal:')).join(', '),
      addressCountry: 'AU',
    },
    openingHours: 'Mo-Fr 08:30-17:00',
  }))

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': `${site.url}#organisation`,
    name: site.legalName,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    areaServed: { '@type': 'Country', name: 'Australia' },
    // The licensing relationship, which is the load-bearing fact about this
    // firm and is stated on every page of the site.
    parentOrganization: {
      '@type': 'Organization',
      name: 'AVALONFS Pty Ltd',
      identifier: 'AFSL 437518',
    },
    disambiguatingDescription: footerDisclosure.entity,
    location: locations,
    // Empty until written consent is recorded. See data/team.ts.
    ...(people.length > 0
      ? {
          employee: people.map((m) => ({
            '@type': 'Person',
            name: m.name,
            jobTitle: m.role,
            ...(m.email ? { email: m.email } : {}),
          })),
        }
      : {}),
    publishingPrinciples: `${site.url}/complaints`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: site.phone,
      email: site.email,
      areaServed: 'AU',
      availableLanguage: 'en-AU',
    },
    // Complaints are handled by the licensee, not by Future Planner.
    slogan: undefined,
    knowsAbout: [
      'Retirement and superannuation advice',
      'Investment advice',
      'Personal and business insurance',
      'Self-managed super funds',
      'Estate planning',
      'Aged care financial advice',
    ],
    additionalProperty: {
      '@type': 'PropertyValue',
      name: 'Complaints',
      value: `Handled by ${licensee.afsl}. AFCA is the external dispute resolution scheme.`,
    },
  }

  return (
    <script
      type="application/ld+json"
      // The input is an object literal built above, not user content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
