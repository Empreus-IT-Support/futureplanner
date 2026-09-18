/**
 * Site-wide facts: entity details, offices, disclosure documents and the
 * prescribed compliance wording.
 *
 * Address and phone details must stay identical here, on the Google Business
 * Profiles and on ASIC's register. Change them in one place only.
 */

export const site = {
  name: 'Future Planner',
  legalName: 'Future Planner Pty Ltd',
  url: 'https://futureplanner.au',
  email: 'admin@futureplanner.au',
  phone: '07 3063 3789',
  phoneHref: '+61730633789',
} as const

/**
 * Hero image.
 *
 * This is the photo the handover named — City of Gold Coast, Unsplash License,
 * free for commercial use — downloaded and served from /public/images rather
 * than hotlinked from a third-party CDN. next/image converts it to WebP or
 * AVIF per browser, so the WebP-with-JPG-fallback requirement is met by the
 * pipeline rather than by shipping two files.
 *
 * It is still interim: it will be replaced by a team or office photograph.
 * Set this to null to fall back to the designed navy panel.
 *
 * Filenames must not contain restricted words. See RESTRICTED_WORDS below.
 */
export const heroImage: { src: string; alt: string; width: number; height: number } | null = {
  src: "/images/gold-coast-skyline.jpg",
  alt: "The Gold Coast skyline at sunrise, seen from the beach at Surfers Paradise",
  width: 2400,
  height: 1601,
}

export type Office = {
  id: string
  /** Full heading, written for search as well as for people. */
  name: string
  /** Short label for compact places like the hero panel. */
  short: string
  tag: string
  lines: string[]
  hours: string
  /** Rendered under the address. Either an adviser link or a plain note. */
  adviser?: { name: string }
  note?: string
}

/**
 * Offices. Google Business Profile listings should point at this page anchor
 * — /contact#mount-isa — not at the homepage.
 */
export const offices: Office[] = [
  {
    id: 'gold-coast',
    name: 'Gold Coast Financial Planner',
    short: 'Gold Coast',
    tag: 'Head office',
    lines: [
      'Suite 30701, Level 7',
      'Southport Central Tower 3',
      '9 Lawson Street, Southport QLD 4215',
      'Postal: PO Box 929, Southport BC QLD 4215',
    ],
    hours: 'Monday to Friday, 8:30am – 5:00pm (AEST)',
    adviser: { name: 'Andrew Koulouris' },
  },
  {
    id: 'canberra',
    name: 'Canberra Financial Planner',
    short: 'Canberra',
    tag: 'Office',
    lines: ['7/146 Scollay Street', 'Greenway ACT 2900'],
    hours: 'Monday to Friday, 8:30am – 5:00pm (Canberra time, AEST/AEDT)',
    adviser: { name: 'Graeme Davy' },
  },
  {
    id: 'mount-isa',
    name: 'Mount Isa',
    short: 'Mount Isa',
    tag: 'Office',
    lines: ['Isa House, Suite 14', '118 Camooweal Street', 'Mount Isa QLD 4825'],
    hours: 'Monday to Friday, 8:30am – 5:00pm (AEST)',
    note:
      'Our Client Liaison Officer is based here. No adviser is permanently based in ' +
      'Mount Isa — advice is provided by video, or in person when an adviser is visiting.',
  },
]

/** Short address lines used in the footer. */
export const footerOffices = [
  {
    label: 'Gold Coast',
    address: 'Suite 30701, Level 7, Southport Central Tower 3, 9 Lawson Street, Southport QLD 4215',
  },
  { label: 'Canberra', address: '7/146 Scollay Street, Greenway ACT 2900' },
  { label: 'Mount Isa', address: 'Isa House, Suite 14, 118 Camooweal Street, Mount Isa QLD 4825' },
]

/** Options offered in the enquiry form's office select. */
export const enquiryOffices = ['Gold Coast', 'Canberra', 'Mount Isa', 'Video meeting'] as const
export type EnquiryOffice = (typeof enquiryOffices)[number]

/**
 * Disclosure documents.
 *
 * Version the filenames and keep old versions when a document is replaced —
 * never overwrite. Every version made available must be retained for seven
 * years, and retired URLs get a redirect in next.config.ts rather than a 404.
 *
 * The Adviser Profile is not optional: FSG v6.2 states that page 11 is missing
 * from downloaded copies, so publishing the annexure separately is what makes
 * the FSG complete.
 */
export const documents = [
  {
    file: 'FSG-v6-2-2025-02.pdf',
    title: 'Financial Services Guide',
    footerTitle: 'Financial Services Guide (PDF)',
    blurb:
      'What AVALONFS is licensed to provide, how advisers are paid, and how complaints are handled.',
    meta: 'PDF · Version 6.2, 1 February 2025',
  },
  {
    file: 'Adviser-Profile-v6-1-2023-04.pdf',
    title: 'Adviser Profile',
    footerTitle: 'Adviser Profile (PDF)',
    blurb: "The FSG annexure covering your adviser's authorisations, qualifications and experience.",
    meta: 'PDF · Version 6.1, 1 April 2023',
  },
  {
    file: 'AVALONFS-Privacy-Policy-2023-01.pdf',
    title: 'Privacy Policy',
    footerTitle: 'Privacy Policy (PDF)',
    blurb: 'How AVALONFS collects, holds, uses and discloses your personal information.',
    meta: 'PDF · January 2023',
  },
] as const

export const docHref = (file: string) => `/docs/${file}`
/** The FSG link, needed by the enquiry auto-reply. */
export const fsgUrl = `${site.url}${docHref(documents[0].file)}`

export const licensee = {
  afsl: 'AVALONFS Pty Ltd, AFSL 437518',
  abn: 'ABN 43 162 297 298',
  compliancePhone: '1800 681 438',
  compliancePhoneHref: '1800681438',
  complianceEmail: 'admin@avalonfs.com.au',
  address: 'Suite 12, Blaxland House, 5–7 Ross Street, Parramatta NSW 2150',
}

/**
 * Words that must not appear anywhere on the site — including meta
 * descriptions, alt text and image filenames. ASIC's stated position extends
 * the statutory terms to the three compound phrases below.
 *
 * The single permitted occurrence is inside the "Lack of Independence"
 * Statement itself, which is AVALONFS's own prescribed wording. That file is
 * allowlisted in scripts/check-restricted-words.mjs.
 */
export const RESTRICTED_WORDS = [
  'independent',
  'impartial',
  'unbiased',
  'independently owned',
  'non-aligned',
  'non-institutionally owned',
] as const

/**
 * Figures for the home page stats band.
 *
 * Every one of these restates something already stated elsewhere on the site —
 * three offices, six people, Graeme advising since 2002, and a first
 * conversation at no cost. Nothing here is a new claim, and nothing here is a
 * performance or outcome figure. Do not add one: past performance claims and
 * anything implying a result belong nowhere on this site.
 */
export type Stat = {
  /** Numeric target for the count-up, or null to render `display` as-is. */
  value: number | null
  /** Where the count starts, so a year ticks rather than counting from zero. */
  from?: number
  prefix?: string
  suffix?: string
  display?: string
  label: string
  sub: string
}

export const stats: Stat[] = [
  {
    value: 3,
    label: 'Offices',
    sub: 'Gold Coast, Canberra and Mount Isa',
  },
  {
    value: 6,
    label: 'In the team',
    sub: 'Advisers and support staff',
  },
  {
    value: 2002,
    from: 1988,
    label: 'Advising since',
    sub: 'Where the experience behind the firm starts',
  },
  {
    value: null,
    display: '$0',
    label: 'First conversation',
    sub: 'No cost, and no obligation',
  },
]
