/**
 * Services. These are the areas the advisers are authorised to advise in.
 *
 * Nothing tax- or accounting-related belongs here. Watch for it creeping back
 * in through phrases like "tax-effective".
 *
 * Several sentences below are doing compliance work and were called out
 * individually by the client. Where a note says so, the wording is fixed.
 */

export type Service = {
  id: string
  title: string
  /** Short form used in the home page summary. */
  summary: string
  /** Full form used on the services page. */
  detail: string
  /** Shown in the three-card summary on the home page. */
  featured: boolean
}

export const services: Service[] = [
  {
    id: 'superannuation-retirement',
    title: 'Superannuation and retirement',
    summary:
      'Contribution strategies, transition to retirement, and planning how your super will ' +
      'actually pay you when you stop working.',
    detail:
      'Contribution strategies, consolidating accounts, transition to retirement, and working ' +
      'out how your super will actually pay you once you stop working.',
    featured: true,
  },
  {
    id: 'investment',
    title: 'Investment advice',
    summary:
      'Building and reviewing a portfolio that matches your goals, your timeframe and how ' +
      'much risk you can genuinely live with.',
    // The risk sentence that used to close this card now sits beneath the whole
    // grid as investmentRisk, because it applies to superannuation too.
    detail:
      'Building and reviewing a portfolio matched to your goals, your timeframe and the level ' +
      'of risk you can genuinely live with.',
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
    // The sentence about working alongside your solicitor moved to whatElseWeDo.
    detail:
      'How your superannuation, insurance and investments are structured to pass on the way ' +
      'you intend.',
    featured: false,
  },
  {
    id: 'cash-flow',
    title: 'Cash flow and budgeting',
    summary:
      'Understanding where your money actually goes, and building a structure that lets you ' +
      'save deliberately.',
    // "model", never "project" or "forecast": modelling scenarios is what the
    // firm does, a projection reads as a prediction of what will happen.
    detail:
      'Understanding where your money actually goes, and building a structure that lets you ' +
      'save deliberately rather than saving whatever happens to be left at the end of the ' +
      'month. We can model different scenarios so you can see the effect of a decision before ' +
      'you commit to it.',
    featured: false,
  },
  {
    id: 'debt-management',
    title: 'Debt management',
    summary:
      'Working out which debts to tackle in what order, and how repayments sit alongside ' +
      'everything else.',
    // The closing sentence is required: AVALONFS does not provide credit
    // assistance or lending advice other than margin loans and gearing, so the
    // card has to be clear about what is and is not being offered. Keep
    // "model" here too.
    detail:
      'Working out which debts to tackle in what order, and how repayments sit alongside ' +
      'everything else you are trying to do. We can model the effect of different repayment ' +
      'approaches over time. We don’t arrange loans or provide credit advice — where ' +
      'borrowing is involved we work alongside your mortgage broker.',
    featured: false,
  },
]

export const featuredServices = () => services.filter((s) => s.featured)

/**
 * Sits under the Services heading, above the cards. Moved down out of the hero,
 * which is deliberately short.
 *
 * The property sentence is not optional and must not be shortened to
 * "property included" or similar: AVALONFS does not provide property or real
 * estate advice, and this states the position accurately.
 */
export const servicesIntro =
  'Commonly, advice will be in the areas of superannuation, retirement, investment outside of ' +
  'super, cash flow, insurance and estate planning. We don’t advise on property, but where you ' +
  'own it we take it into account in your overall position.'

/**
 * Risk statement, directly beneath the service cards.
 *
 * It used to close the Investment advice card, but it applies to
 * superannuation as well, so it sat oddly under one service. Risk has to be
 * presented alongside benefit, so this is body text in normal page styling —
 * not small print, not greyed out, and never inside a collapsed panel.
 */
export const investmentRisk =
  'Investment returns are not guaranteed. The value of investments can fall as well as rise, ' +
  'and past performance is not a reliable indicator of future performance.'

/**
 * Sits after the cards and the risk statement, and BEFORE the exclusions.
 * Carries the "we work alongside rather than replace" point that used to close
 * the Estate planning card.
 */
export const whatElseWeDo =
  'Most people’s financial lives already involve other professionals. We work alongside your ' +
  'accountant, solicitor and mortgage broker rather than replacing them — we don’t provide ' +
  'tax, legal or lending advice — and between us we work out how it all fits within your ' +
  'broader financial plan.'

/**
 * The exclusions list. This is a scope statement, not marketing copy — it is
 * what AVALONFS does not authorise advice on. Keep tax and accounting on it,
 * and keep this section below "What else we do".
 */
export const exclusions =
  'AVALONFS does not provide advice on crypto currencies, currency or foreign exchange ' +
  'trading, derivatives, tax, accounting, legal matters, general insurance, real estate or ' +
  'property, or lending other than margin loans and gearing. If you need one of those, ' +
  'we’ll tell you plainly rather than stretching to cover it.'
