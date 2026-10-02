/**
 * The client's 24 September review decisions.
 *
 * Everything here was decided deliberately, and several items carry a reason
 * the wording alone does not show. Nothing in the build currently fails if a
 * later copy pass quietly undoes one of them, which is exactly the kind of
 * change nobody notices in a diff.
 *
 * These are not style checks. They exist so that reversing one of these
 * decisions is a conscious act with a conversation attached.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import HomePage from '@/app/page'
import ServicesPage from '@/app/services/page'
import {
  exclusions,
  investmentRisk,
  services,
  servicesIntro,
  whatElseWeDo,
} from '@/data/services'
import { contactHours, offices } from '@/data/site'

const byId = (id: string) => {
  const s = services.find((x) => x.id === id)
  if (!s) throw new Error(`no service with id ${id}`)
  return s
}

const allServiceCopy = services.map((s) => `${s.title} ${s.summary} ${s.detail}`).join(' ')

describe('round one, item 15 — the investment risk statement', () => {
  it('is the confirmed wording, unchanged', () => {
    expect(investmentRisk).toBe(
      'Investment returns are not guaranteed. The value of investments can fall as well as ' +
        'rise, and past performance is not a reliable indicator of future performance.',
    )
  })

  it('is off the Investment advice card', () => {
    // It applies to superannuation as well, so attaching it to one service
    // understates where it applies.
    expect(byId('investment').detail).not.toContain('not guaranteed')
    expect(byId('investment').summary).not.toContain('not guaranteed')
  })

  it('is on the page, below the cards and above "What else we do"', () => {
    // Relocated, not deleted. Risk has to be presented alongside benefit, so
    // it stays on the page that describes the benefit.
    const html = renderToStaticMarkup(<ServicesPage />)
    const lastCard = html.lastIndexOf(byId('debt-management').detail)
    const risk = html.indexOf(investmentRisk)

    expect(risk).toBeGreaterThan(-1)
    expect(risk).toBeGreaterThan(lastCard)
    expect(risk).toBeLessThan(html.indexOf('What else we do'))
  })

  it('is not inside a card, a footnote or a disclosure', () => {
    const html = renderToStaticMarkup(<ServicesPage />)
    const before = html.slice(0, html.indexOf(investmentRisk))

    expect(before.lastIndexOf('<p class="risk-note"')).toBeGreaterThan(before.lastIndexOf('<article'))
    expect(html).not.toContain('<details')
    expect(before.lastIndexOf('<small')).toBe(-1)
  })
})

describe('round one, items 19 and 20 — section order', () => {
  it('puts "What else we do" before the exclusions', () => {
    const html = renderToStaticMarkup(<ServicesPage />)
    expect(html.indexOf(whatElseWeDo)).toBeLessThan(html.indexOf(exclusions))
  })

  it('keeps the point about working alongside other professionals', () => {
    // Moved out of the Estate planning card rather than dropped.
    expect(whatElseWeDo).toContain('accountant, solicitor and mortgage broker')
    expect(byId('estate-planning').detail).not.toContain('solicitor')
  })
})

describe('round one, item 11 — the services intro', () => {
  it('carries the property sentence exactly as supplied', () => {
    // AVALONFS does not advise on property. Shortening this to "property
    // included" or similar would misstate the licence.
    expect(servicesIntro).toContain(
      'We don’t advise on property, but where you own it we take it into account in your ' +
        'overall position.',
    )
  })

  it('sits above the first card', () => {
    const html = renderToStaticMarkup(<ServicesPage />)
    const firstCard = html.indexOf(byId('superannuation-retirement').detail)
    expect(html.indexOf(servicesIntro)).toBeLessThan(firstCard)
  })
})

describe('round one, items 12 to 18 — the service cards', () => {
  it('leads with superannuation', () => {
    expect(services[0].title).toBe('Superannuation and retirement')
  })

  it('says contribution strategies, plural', () => {
    const s = byId('superannuation-retirement')
    expect(s.summary).toContain('Contribution strategies')
    expect(`${s.summary} ${s.detail}`).not.toContain('Contribution strategy')
  })

  it('ends the superannuation card at "once you stop working"', () => {
    expect(byId('superannuation-retirement').detail.trimEnd()).toMatch(/once you stop working\.$/)
    expect(allServiceCopy).not.toContain('Suits anyone')
  })

  it('has no aged care anywhere', () => {
    // Not accredited for it.
    expect(services.map((s) => s.id)).not.toContain('aged-care')
    expect(allServiceCopy.toLowerCase()).not.toContain('aged care')
  })

  it('has cash flow and debt management as two separate cards', () => {
    expect(byId('cash-flow').title).toBe('Cash flow and budgeting')
    expect(byId('debt-management').title).toBe('Debt management')
  })

  it('models rather than projects or forecasts', () => {
    // A projection reads as a prediction of what will happen.
    for (const id of ['cash-flow', 'debt-management']) {
      const copy = `${byId(id).summary} ${byId(id).detail}`.toLowerCase()
      expect(copy).toContain('model')
      expect(copy).not.toContain('project')
      expect(copy).not.toContain('forecast')
    }
  })

  it('keeps the no-credit-advice sentence on the debt card', () => {
    // AVALONFS provides no credit assistance other than margin loans and
    // gearing, so the card has to say what is and is not on offer.
    expect(byId('debt-management').detail).toContain(
      'We don’t arrange loans or provide credit advice',
    )
  })
})

describe('rounds one and two — the supplied hero and About copy', () => {
  const html = renderToStaticMarkup(<HomePage />)

  it('uses the supplied hero paragraphs', () => {
    expect(html).toContain(
      'We help people understand their circumstances and make decisions with confidence.',
    )
    expect(html).toContain(
      'Personal financial advice for individuals, families, professionals and business ' +
        'owners',
    )
    expect(html).toContain(
      'Offices on the Gold Coast, in Canberra and Mount Isa, and video meetings anywhere in ' +
        'Australia.',
    )
  })

  it('keeps the hero short, with the advice areas left on the services page', () => {
    const hero = html.slice(0, html.indexOf('id="services"'))
    expect(hero).not.toContain('Commonly, advice will be in the areas of')
  })

  it('uses the supplied About paragraphs', () => {
    expect(html).toContain('Future Planner was established in May 2026, but we didn’t start from')
    expect(html).toContain('We built the firm to be broad rather than narrow.')
    expect(html).toContain('what personal insurance is required to protect their wealth')
    expect(html).toContain('we work with clients right across Australia')
  })

  it('makes the point about the team having worked together once only', () => {
    const about = html.slice(html.indexOf('id="about"'), html.indexOf('id="team"'))
    expect(about.match(/worked together/g)).toHaveLength(1)
  })
})

describe('the service area is Australia only', () => {
  it('claims no clients living outside Australia', () => {
    const html = (
      renderToStaticMarkup(<HomePage />) + renderToStaticMarkup(<ServicesPage />)
    ).toLowerCase()

    for (const claim of [
      'anywhere in the world',
      'international clients',
      'clients overseas',
      'worldwide',
      'expat',
    ]) {
      expect(html).not.toContain(claim)
    }
  })
})

describe('round one, items 23 to 25 — the offices', () => {
  it('names the offices without "Financial Planner"', () => {
    expect(offices.map((o) => o.name)).toEqual(['Gold Coast', 'Canberra', 'Mount Isa'])
  })

  it('shows no weekday opening hours against any address', () => {
    // No office is staffed across the week, and no adviser is permanently
    // based in Mount Isa.
    for (const o of offices) {
      expect(o.availability).toBe('By appointment')
      expect(JSON.stringify(o)).not.toMatch(/Monday to Friday/)
    }
  })

  it('states general contact times once, for the practice rather than a place', () => {
    expect(contactHours).toBe(
      'Contact us by phone or email Monday to Friday, 8:30am – 5:00pm (AEST)',
    )
  })
})

/**
 * Second review round, 2 October 2026. Same reasoning as above: each of these
 * reverses cleanly and silently, and several carry a reason the wording does
 * not show on its own.
 */
describe('round two, items 1 and 2 — the insurance card', () => {
  it('is headed Personal insurance, with no mention of business insurance', () => {
    // The firm does not provide business insurance, and the old heading could
    // be read as though it did.
    expect(byId('insurance').title).toBe('Personal insurance')
    for (const s of services) {
      expect(s.title.toLowerCase()).not.toContain('business insurance')
    }
  })

  it('still covers business owners, in the card text rather than the heading', () => {
    expect(byId('insurance').detail).toContain('business expense, key person and')
    expect(byId('insurance').detail).toContain('for business owners')
  })

  it('says funding buy-sell agreements rather than shareholder cover', () => {
    // The same thing, named as what it actually is.
    expect(byId('insurance').detail).toContain('funding buy-sell agreements')
    expect(allServiceCopy.toLowerCase()).not.toContain('shareholder cover')
  })
})

describe('round two, item 3 — the SMSF card', () => {
  it('offers setting one up, running one, or both', () => {
    // "and" alone read as though both were required.
    for (const copy of [byId('smsf').summary, byId('smsf').detail]) {
      expect(copy).toContain('and/or on running one you already have')
    }
  })
})

describe('round two, item 4 — the debt management card', () => {
  it('drops the mortgage broker clause', () => {
    // Already said in "What else we do", so repeating it here duplicated it.
    expect(byId('debt-management').detail).not.toContain('mortgage broker')
    expect(whatElseWeDo).toContain('mortgage broker')
  })

  it('keeps the no-credit-advice sentence and ends on it', () => {
    // Only half the sentence came out. A card headed Debt management has to
    // say plainly that no finance is being arranged, or the heading reads as
    // an offer to arrange it. Removing this with the broker clause would be
    // the easy mistake.
    expect(byId('debt-management').detail.trimEnd()).toMatch(
      /We don’t arrange loans or provide credit advice\.$/,
    )
  })
})

describe('round two, item 7 — the closing line of the exclusions', () => {
  it('is the shorter referral sentence', () => {
    expect(exclusions.trimEnd()).toMatch(
      /If you need the services of another professional, we’ll tell you\.$/,
    )
    expect(exclusions).not.toContain('stretching to cover it')
  })

  it('leaves the list of excluded services untouched', () => {
    for (const excluded of [
      'crypto currencies',
      'currency or foreign exchange trading',
      'derivatives',
      'tax',
      'accounting',
      'legal matters',
      'general insurance',
      'real estate or property',
      'lending other than margin loans and gearing',
    ]) {
      expect(exclusions).toContain(excluded)
    }
  })
})
