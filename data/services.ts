/**
 * Services. These are the areas the advisers are authorised to advise in.
 *
 * Nothing tax- or accounting-related belongs here. Watch for it creeping back
 * in through phrases like "tax-effective".
 */

export type Service = {
  id: string
  title: string
  /** Short form used in the home page summary. */
  summary: string
  /** Full form used on the services page. */
  detail: string
  featured: boolean
}

export const services: Service[] = [
  {
    id: 'retirement',
    title: 'Retirement & superannuation',
    summary:
      'Contribution strategy, transition to retirement, and planning how your super will ' +
      'actually pay you when you stop working.',
    detail:
      'Contribution strategy, consolidating accounts, transition to retirement, and working ' +
      'out how your super will actually pay you once you stop working. Suits anyone from ' +
      'someone tidying up three old accounts to someone within a few years of finishing up.',
    featured: true,
  },
  {
    id: 'investment',
    title: 'Investment advice',
    summary:
      'Building and reviewing a portfolio that matches your goals, your timeframe and how ' +
      'much risk you can genuinely live with.',
    detail:
      'Building and reviewing a portfolio matched to your goals, your timeframe and the level ' +
      'of risk you can genuinely live with. Investment returns are not guaranteed and the ' +
      'value of investments can fall as well as rise.',
    featured: true,
  },
  {
    id: 'insurance',
    title: 'Personal & business insurance',
    summary:
      'Life, TPD, trauma and income protection — working out what you need covered, and what ' +
      'you can stop paying for.',
    detail:
      'Life, TPD, trauma and income protection, plus business expense, key person and ' +
      'shareholder cover. Working out what genuinely needs protecting, what it costs, and ' +
      'what you can stop paying for.',
    featured: true,
  },
  {
    id: 'smsf',
    title: 'Self-managed super funds',
    summary:
      'Advice on whether an SMSF suits your circumstances, and on running one you already have.',
    detail:
      'Advice on whether an SMSF suits your circumstances, and on running one you already ' +
      'have. An SMSF brings real responsibilities as a trustee, and it doesn’t suit ' +
      'everyone — part of this conversation is establishing whether it suits you.',
    featured: false,
  },
  {
    id: 'estate-planning',
    title: 'Estate planning & asset protection',
    summary:
      'How your superannuation, insurance and investments are structured to pass on the way ' +
      'you intend.',
    detail:
      'How your superannuation, insurance and investments are structured to pass on the way ' +
      'you intend. We work alongside your solicitor rather than replacing them — we don’t ' +
      'provide legal advice.',
    featured: false,
  },
  {
    id: 'aged-care',
    title: 'Aged care',
    summary:
      'Working through the financial side of a move into aged care, usually under time pressure.',
    detail:
      'Working through the financial side of a move into aged care, usually under time ' +
      'pressure and often for a parent rather than yourself. What the fees mean, and how the ' +
      'decisions interact with the family home and pension entitlements.',
    featured: false,
  },
]

export const featuredServices = () => services.filter((s) => s.featured)

/**
 * The exclusions list. This is a scope statement, not marketing copy — it is
 * what AVALONFS does not authorise advice on. Keep tax and accounting on it.
 */
export const exclusions =
  'AVALONFS does not provide advice on crypto currencies, currency or foreign exchange ' +
  'trading, derivatives, tax, accounting, legal matters, general insurance, real estate or ' +
  'property, or lending other than margin loans and gearing. If you need one of those, ' +
  'we’ll tell you plainly rather than stretching to cover it.'
