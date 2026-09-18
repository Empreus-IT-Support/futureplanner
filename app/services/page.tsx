import type { Metadata } from 'next'
import Link from 'next/link'

import { IconArrow } from '@/components/Icons'
import ServiceCards from '@/components/ServiceCards'
import { exclusions, services } from '@/data/services'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Retirement and superannuation, investment advice, personal and business insurance, SMSFs, ' +
    'estate planning and aged care advice from Future Planner.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return (
    <>
      <section className="section">
        <div className="wrap">
          <div className="section-head section-head--split" data-reveal>
            <p className="eyebrow">What we do</p>
            <h1>Services</h1>
            <hr className="rule-gold" />
            <p className="lede">
              These are the areas our advisers are authorised to provide advice in. Which of them
              is relevant depends entirely on where you&rsquo;re up to — most first conversations
              start with one and end up touching two or three.
            </p>
          </div>

          <ServiceCards items={services} variant="detail" />

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
