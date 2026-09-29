import type { Metadata } from 'next'
import Link from 'next/link'

import { IconArrow } from '@/components/Icons'
import ServiceCards from '@/components/ServiceCards'
import {
  exclusions,
  investmentRisk,
  services,
  servicesIntro,
  whatElseWeDo,
} from '@/data/services'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Superannuation and retirement, investment advice, personal and business insurance, SMSFs, ' +
    'estate planning, cash flow and debt management advice from Future Planner.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return (
    <>
      <section className="section">
        <div className="wrap">
          {/*
            The intro paragraph is the advice-areas list moved down out of the
            hero. It sits under the heading and above the cards, and the
            property sentence in it is fixed wording — see data/services.ts.
          */}
          <div className="section-head section-head--split" data-reveal>
            <p className="eyebrow">What we do</p>
            <h1>Services</h1>
            <hr className="rule-gold" />
            <p className="lede">{servicesIntro}</p>
          </div>

          <ServiceCards items={services} variant="detail" headingLevel={2} />

          {/*
            Risk statement. Sits under the whole grid rather than on one card,
            because it applies to superannuation as much as to investments.
            Full-strength body text on purpose: it is not small print.
          */}
          <p className="risk-note" data-reveal>
            {investmentRisk}
          </p>

          <div className="section-head section-head--split section-head--spaced" data-reveal>
            <h2>What else we do</h2>
            <hr className="rule-gold" />
            <p>{whatElseWeDo}</p>
          </div>

          {/* Order matters: the exclusions follow "What else we do", never precede it. */}
          <div className="section-head section-head--split section-head--spaced" data-reveal>
            <h2>What we don&rsquo;t do</h2>
            <hr className="rule-gold" />
            <p>{exclusions}</p>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <div className="section-head section-head--split section-head--tight" data-reveal>
            <h2>Where to start</h2>
            <hr className="rule-gold" />
            <p>
              A first conversation costs nothing and carries no obligation. It&rsquo;s mostly us
              asking questions — what you&rsquo;re trying to sort out, what&rsquo;s already in
              place, and whether we&rsquo;re the right people to help.
            </p>
          </div>

          <div data-reveal>
            <Link className="btn btn--primary" href="/contact">
              Contact us
              <IconArrow className="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
