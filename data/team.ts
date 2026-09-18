/**
 * The team, as a repeatable content type — people can be added or removed
 * without a code change.
 *
 * CONSENT GATE
 * ------------
 * Launch is gated on written consent from all six team members. No name and no
 * photo may be published before that person's consent has been returned, so
 * `consent` starts false for everyone. Flip it to true only when the signed
 * consent is in hand; the grid reflows cleanly at any count.
 *
 * Removing someone: set `consent` to false (or delete the entry). Taking a
 * person down must also clear their photo from /public/images and from any
 * cached or CDN copy — not just from this file.
 */

export type Member = {
  id: string
  name: string
  role: string
  bio: string
  credentials?: string[]
  asicAdviserNumber?: string
  email?: string
  phone?: string
  phoneHref?: string
  /** Portrait 4:5, 1200x1500 minimum, consistent lighting across all six. */
  photo?: { src: string; alt: string } | null
  /** Written consent returned. Nothing renders until this is true. */
  consent: boolean
}

export const ADVISERS_REGISTER =
  'https://moneysmart.gov.au/financial-advice/financial-advisers-register'

export const team: Member[] = [
  {
    id: 'graeme-davy',
    name: 'Graeme Davy',
    role: 'Director & Financial Adviser',
    bio:
      'Advising clients since 2002, across large institutions, a specialist planning firm ' +
      'and one of Australia’s largest industry super funds. Focused on setting people up ' +
      'early enough to enjoy a comfortable retirement. Based in Canberra.',
    credentials: [
      'Certified Financial Planner',
      'Bachelor of Business (Finance)',
      'Diploma of Financial Planning',
    ],
    asicAdviserNumber: '1000299',
    email: 'gd@futureplanner.au',
    phone: '07 3063 3788',
    phoneHref: '+61730633788',
    photo: null,
    consent: false,
  },
  {
    id: 'andrew-koulouris',
    name: 'Andrew Koulouris',
    role: 'Financial Adviser',
    // Accounting background is retained as background only, never as an offer.
    // Tax and accounting are otherwise off the site entirely.
    bio:
      'Advises on self-managed super, superannuation, portfolio construction, personal and ' +
      'business insurance, estate planning and retirement. Came to financial planning from ' +
      'an accounting background. Based at Southport.',
    credentials: ['Advanced Diploma of Financial Services (Financial Planning)'],
    asicAdviserNumber: '249603',
    email: 'ak@futureplanner.au',
    phone: '07 3063 3786',
    phoneHref: '+61730633786',
    photo: null,
    consent: false,
  },
  {
    id: 'sarah-keating',
    name: 'Sarah Keating',
    role: 'Practice Manager',
    bio:
      'Oversees day-to-day operations and leads the administration team across all three ' +
      'offices, and works with the director on the firm’s management and regulatory ' +
      'obligations. Based on the Gold Coast.',
    email: 'sk@futureplanner.au',
    photo: null,
    consent: false,
  },
  {
    id: 'alaura-keating',
    name: 'Alaura Keating',
    role: 'Client Liaison Officer',
    bio:
      'First point of contact for clients — appointments, paperwork and progress updates ' +
      'between meetings, and support to the practice manager. Based in Mount Isa.',
    email: 'aj@futureplanner.au',
    photo: null,
    consent: false,
  },
  {
    id: 'maria-tuazon',
    name: 'Maria Tuazon',
    role: 'Administration · Remote',
    bio:
      'Processes applications and documentation, and follows up super funds, insurers and ' +
      'platforms to get things actioned. Works remotely from the Philippines.',
    photo: null,
    consent: false,
  },
  {
    id: 'reinalyn-oyando',
    name: 'Reinalyn Oyando',
    role: 'Administration · Remote',
    bio:
      'Processes applications and documentation, and follows up super funds, insurers and ' +
      'platforms to get things actioned. Works remotely from the Philippines.',
    photo: null,
    consent: false,
  },
]

/**
 * Only people whose written consent has been returned.
 *
 * DESIGN PREVIEW ESCAPE HATCH
 * ---------------------------
 * Setting NEXT_PUBLIC_PREVIEW_TEAM=true renders every profile so the team
 * layout can be reviewed before the consents are back. It is deliberately
 * ignored in a production build, so it cannot publish anybody by accident —
 * shipping real profiles still means setting consent: true above.
 */
export const publishedTeam = () => {
  const previewing =
    process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_PREVIEW_TEAM === 'true'

  return previewing ? team : team.filter((m) => m.consent)
}

/** True when profiles are only on screen because of the preview flag. */
export const isTeamPreview = () =>
  process.env.NODE_ENV !== 'production' &&
  process.env.NEXT_PUBLIC_PREVIEW_TEAM === 'true' &&
  team.some((m) => !m.consent)
