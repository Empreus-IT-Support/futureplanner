/**
 * The team, as a repeatable content type — people can be added or removed
 * without a code change.
 *
 * Wording is supplied and approved by the client (FuturePlanner_Staff_Profiles,
 * 29 September 2026) and checked by each person. Do not shorten, expand or
 * tidy it, and in particular:
 *
 * - **Qualifications appear exactly as supplied.** Only the two advisers list
 *   any, and only they carry an adviser number and register link. That is how
 *   a visitor tells at a glance who actually provides the advice.
 * - **Role titles are doing compliance work.** "Financial Adviser" belongs to
 *   Graeme and Andrew only. Nothing in a support profile may be reworded in a
 *   way that implies advice.
 * - **No tax or accounting services.** Andrew's accounting background is
 *   background, never an offer.
 * - **Reporting lines are deliberately absent.** Who supports which adviser is
 *   left out because that structure may change.
 *
 * PHOTOGRAPHS
 * -----------
 * The client confirmed on 29 September 2026 that launch is with written
 * profiles only: none are needed and none are outstanding from us. They will
 * arrive later as one batch with the signed consent forms.
 *
 * So `photo` stays optional per person, and where there is none the profile
 * shows an initial tile rather than a silhouette or generic avatar — the
 * client asked specifically for no placeholder person.
 */

export type Member = {
  id: string
  name: string
  /** Compliance-bearing. See the note above before changing any of these. */
  role: string
  /** Shown after the role. Support staff without a fixed office omit it. */
  location?: string
  /** Supplied copy, one entry per paragraph. */
  paragraphs: string[]
  /** Advisers only, verbatim. */
  qualifications?: string[]
  asicAdviserNumber?: string
  email?: string
  phone?: string
  phoneHref?: string
  /** Portrait 4:5, 1200x1500 minimum. Absent until the batch arrives. */
  photo?: { src: string; alt: string } | null
  /**
   * Whether this profile is published.
   *
   * It gated the whole section while we had no approved copy. The client has
   * since supplied and approved all six, so they publish. Keep the flag: it is
   * what lets one person be withheld or withdrawn without a code change, and
   * the tests prove the mechanism still works.
   */
  consent: boolean
}

export const ADVISERS_REGISTER =
  'https://moneysmart.gov.au/financial-advice/financial-advisers-register'

export const team: Member[] = [
  {
    id: 'graeme-davy',
    name: 'Graeme Davy',
    role: 'Director & Financial Adviser',
    location: 'Canberra',
    paragraphs: [
      'Graeme has been advising clients since 2002, across large institutions, industry super funds and in small business.',
      'He is focused on setting people up early enough to enjoy a comfortable retirement, then managing that position and helping clients feel confident about their financial future.',
      'He reads investment history books from time to time, and has a library of them.',
      'Outside of work, Graeme runs and tolerates the gym. His favourite sports are cricket, Australian Rules football and American football, and his sometime hobbies include guitar (never practised enough), checking out breweries and their range of dark beers, and collecting whisky.',
      'Left in the same place too long, he starts looking to travel, for work or otherwise — usually somewhere he has been before and liked, with England still on the list.',
    ],
    qualifications: [
      'Certified Financial Planner',
      'Bachelor of Business (Finance), Charles Sturt University',
      'Diploma of Financial Planning',
      'Member, Financial Advice Association Australia (FAAA)',
    ],
    asicAdviserNumber: '1000299',
    email: 'gd@futureplanner.au',
    phone: '07 3063 3788',
    phoneHref: '+61730633788',
    photo: null,
    consent: true,
  },
  {
    id: 'andrew-koulouris',
    name: 'Andrew Koulouris',
    role: 'Financial Adviser',
    location: 'Gold Coast',
    paragraphs: [
      'Andrew has been advising clients since 2001. He ran his own financial advice practice on the Gold Coast for 15 years, and has since worked with a large accounting firm on financial planning compliance, remediation and compensation matters — the work of putting things right when advice has gone wrong.',
      'He came to advice from an accounting and business management background, and advises on self-managed super, superannuation, portfolio construction, personal and business insurance, estate planning and retirement. He is based at Southport.',
      'Outside of work, Andrew walks his dog Sally most days and follows the NRL. Living on the Gold Coast, he enjoys spending time exploring the local beaches and hinterland, as well as getting out for the occasional bike ride. He also values spending time with his adult children and keeping up with their lives.',
    ],
    qualifications: [
      'Associate Diploma of Business (Accounting)',
      'Advanced Diploma of Financial Services (Financial Planning)',
      'Self-Managed Superannuation Funds, Tribeca',
      'Margin Lending, Kaplan',
      'Member, Financial Advice Association Australia (FAAA)',
    ],
    asicAdviserNumber: '249603',
    email: 'ak@futureplanner.au',
    phone: '07 3063 3786',
    phoneHref: '+61730633786',
    photo: null,
    consent: true,
  },
  {
    id: 'sarah-keating',
    name: 'Sarah Keating',
    role: 'Practice Manager',
    location: 'Gold Coast',
    paragraphs: [
      'Sarah has worked in financial services for five years, the last three and a half as a practice manager. She runs the firm’s day-to-day operations and leads the administration team across all three offices.',
      'She also works with Graeme on the business itself — the systems, processes and record-keeping that sit behind the advice, and the firm’s obligations as an authorised representative.',
      'Outside of work, Sarah trains at the gym and hikes, usually with a waterfall somewhere at the end of it. She is about to start travelling overseas in her time off.',
    ],
    email: 'sk@futureplanner.au',
    photo: null,
    consent: true,
  },
  {
    id: 'alaura-keating',
    name: 'Alaura Keating',
    role: 'Client Liaison Officer',
    location: 'Mount Isa',
    paragraphs: [
      'Alaura is the first person most clients hear from. She looks after appointments, follows up paperwork, and keeps clients across where things are up to between meetings.',
      'She joined the team on work experience, stayed on casually while she finished school, and was offered a full-time role when she completed it. Two years on, she is based at the Mount Isa office and works with clients across all three locations.',
      'Outside of work, Alaura is usually outdoors. She camps whenever she gets the chance, spends her weekends with friends, and shares the rest of her time with her dog.',
    ],
    email: 'aj@futureplanner.au',
    photo: null,
    consent: true,
  },
  {
    id: 'reinalyn-oyando',
    name: 'Reinalyn Oyando',
    role: 'Administration',
    paragraphs: [
      'Rein has been with the team for five years, since before Future Planner took its current form. She supports the team with day-to-day administration and provides general support across the business. She speaks with clients, answers calls, and follows up with providers to obtain the documents and information we need.',
      'She also helps maintain and update client information, processes investment-related requests, prepares documentation, and keeps client investment records accurate and up to date.',
      'Outside of work, Rein enjoys catching up with friends over a good cup of coffee. She recently bought a new car and has been enjoying taking it out for drives around town. On her days off she stays active — running, cardio, and the gym at least twice a week, which she finds a good way to keep fit and clear her head. At this stage she is focused on building her career and finding a balance between work, personal growth and enjoying life.',
    ],
    photo: null,
    consent: true,
  },
  {
    id: 'maria-tuazon',
    name: 'Maria Tuazon',
    role: 'Administration',
    paragraphs: [
      'Maria joined the team two years ago. She speaks with clients, taking incoming calls and making outgoing ones, prepares applications and documentation, and follows up super funds, insurers and platforms to get things actioned.',
      'With a careful and organised approach to her work, Maria takes pride in being a dependable part of the team. She enjoys working behind the scenes and supporting the team with day-to-day administrative tasks, helping ensure things run smoothly so the team can focus on delivering quality service to their clients.',
      'Outside of work, Maria enjoys spending time with her family, travelling, and discovering new places and experiences.',
    ],
    photo: null,
    consent: true,
  },
]

/**
 * Only people whose profile is published.
 *
 * DESIGN PREVIEW ESCAPE HATCH
 * ---------------------------
 * NEXT_PUBLIC_PREVIEW_TEAM=true renders every profile regardless, so the
 * layout can be reviewed. A production build ignores it, so it cannot publish
 * anyone by accident.
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
