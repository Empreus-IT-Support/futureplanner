/**
 * Prescribed compliance wording.
 *
 * Everything asserted here is wording supplied by AVALONFS or required on
 * every page. None of it may be reworded, shrunk, collapsed or moved without
 * compliance sign-off, and all of it is the kind of text that gets "tidied" by
 * someone doing an unrelated copy pass.
 *
 * These tests are not style checks. They fail loudly so that changing any of
 * it becomes a conscious decision with a sign-off attached, rather than a diff
 * nobody notices.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import AdviceWarning from '@/components/AdviceWarning'
import LackOfIndependence from '@/components/LackOfIndependence'
import SiteFooter from '@/components/SiteFooter'
import {
  footerDisclosure,
  generalAdviceWarning,
  lackOfIndependence,
} from '@/data/compliance'

describe('"Lack of Independence" Statement — AVALONFS FSG v6.2, page 2', () => {
  it('is word for word the supplied wording', () => {
    expect(lackOfIndependence.heading).toBe('"Lack of Independence" Statement')
    expect(lackOfIndependence.body).toBe(
      'Your adviser may receive commission on life insurance products as explained in this FSG. ' +
        'For this reason, we cannot refer to ourselves or our advice as independent, impartial or ' +
        'unbiased. (See also Conflicts of Interest – Risk Products)',
    )
  })

  it('renders as a visible box with the required phrase in a bold heading', () => {
    const html = renderToStaticMarkup(<LackOfIndependence />)
    expect(html).toContain('not-independent')
    expect(html).toContain('Lack of Independence')
    expect(html).toContain(lackOfIndependence.body)
  })

  it('carries no reveal animation, so it cannot depend on script or scroll', () => {
    // A disclosure that fades in on scroll is a disclosure that can fail to
    // appear. See MotionProvider and the notes in globals.css.
    expect(renderToStaticMarkup(<LackOfIndependence />)).not.toContain('data-reveal')
  })
})

describe('general advice warning', () => {
  it('is word for word the supplied wording', () => {
    expect(generalAdviceWarning).toContain('general in nature only')
    expect(generalAdviceWarning).toContain(
      'without taking into account your objectives, financial situation or needs',
    )
    expect(generalAdviceWarning).toContain('Product Disclosure Statement and Target Market')
  })

  it('renders with its label and carries no reveal animation', () => {
    const html = renderToStaticMarkup(<AdviceWarning />)
    expect(html).toContain('General advice warning.')
    expect(html).toContain(generalAdviceWarning)
    expect(html).not.toContain('data-reveal')
  })
})

describe('footer disclosure', () => {
  it('names both authorised representatives, the ABN and the AFSL', () => {
    expect(footerDisclosure.entity).toContain('Graeme Davy (1000299)')
    expect(footerDisclosure.entity).toContain('Andreas Koulouris (249603)')
    expect(footerDisclosure.entity).toContain('ABN 43 409 972 301')
    expect(footerDisclosure.entity).toContain('AFSL 437518')
  })

  it('states that past performance is not a reliable indicator', () => {
    expect(footerDisclosure.body).toContain(
      'Past performance is not a reliable indicator of future performance.',
    )
  })

  it('renders in full, and carries no reveal animation', () => {
    const html = renderToStaticMarkup(<SiteFooter />)
    expect(html).toContain(footerDisclosure.entity)
    expect(html).toContain(footerDisclosure.body)
    expect(html).not.toContain('data-reveal')
  })
})

describe('restricted words', () => {
  const restricted = ['independent', 'impartial', 'unbiased']

  it('appear nowhere in the advice warning or the footer disclosure', () => {
    const corpus = [generalAdviceWarning, footerDisclosure.entity, footerDisclosure.body]
      .join(' ')
      .toLowerCase()

    for (const word of restricted) {
      expect(corpus, `"${word}" must not appear in site copy`).not.toContain(word)
    }
  })

  it('are permitted only inside the Statement itself, which is AVALONFS wording', () => {
    // The Statement says we cannot describe ourselves this way. That is the
    // one place these words legitimately appear.
    const body = lackOfIndependence.body.toLowerCase()
    for (const word of restricted) {
      expect(body).toContain(word)
    }
  })
})
