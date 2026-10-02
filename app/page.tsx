import Image from 'next/image'
import Link from 'next/link'

import CtaBand from '@/components/CtaBand'

import DocumentList from '@/components/DocumentList'
import Hero from '@/components/Hero'
import { IconArrow } from '@/components/Icons'
import LackOfIndependence from '@/components/LackOfIndependence'
import LicenseeStrip from '@/components/LicenseeStrip'
import ServiceCards from '@/components/ServiceCards'
import Stats from '@/components/Stats'
import TeamGrid from '@/components/TeamGrid'
import { featuredServices } from '@/data/services'
import { heroImage } from '@/data/site'

export default function HomePage() {
  return (
    <>
      <Hero />
      <LicenseeStrip />

      <section className="section">
        <div className="wrap">
          <Stats />
        </div>
      </section>

      <section className="section" id="services">
        <div className="wrap">
          <div className="section-head section-head--split" data-reveal>
            <p className="eyebrow">What we do</p>
            <h2>Services</h2>
            <hr className="rule-gold" />
            <p>
              Advice across the areas we&rsquo;re authorised to provide, matched to what
              you&rsquo;re actually trying to sort out.
            </p>
          </div>

          <ServiceCards items={featuredServices()} variant="summary" />

          <p className="after-cards" data-reveal>
            <Link className="link-arrow" href="/services">
              See all services
              <IconArrow size={15} />
            </Link>
          </p>
        </div>
      </section>

      <section className="section section--tint" id="about">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Who we are</p>
            <h2>About Future Planner</h2>
            <hr className="rule-gold" />
          </div>

          <div className="about-grid">
            {/*
              Client-supplied replacement for the whole section, given as four
              finished paragraphs. It was explicitly not to be edited sentence
              by sentence, so please replace it wholesale if it changes again.

              Two things to hold to here. The point about how long the team has
              worked together is made once, by "who have worked together
              before" in the last paragraph, and must not be restated as a
              separate sentence. And the service area is Australia only:
              nothing on this site may suggest the firm advises clients living
              overseas.
            */}
            <div className="about-copy" data-reveal="left">
              <p>
                Future Planner was established in May 2026, but we didn&rsquo;t start from
                scratch. Graeme Davy has been advising clients since 2002, across large
                institutions, a specialist planning firm and one of Australia&rsquo;s biggest
                industry super funds, and Andrew Koulouris has been advising since 2001,
                including fifteen years running his own practice on the Gold Coast.
              </p>
              <p>
                We built the firm to be broad rather than narrow. Financial advice tends to find
                people who already have substantial assets behind them, and plenty of people who
                would benefit from a plan don&rsquo;t fit that description. We work with clients at
                different stages and of different means &mdash; someone sorting out their super
                properly for the first time, a business owner working out what personal insurance
                is required to protect their wealth, a couple trying to picture what retirement
                looks like in numbers rather than in vague terms.
              </p>
              <p>
                We have offices at Southport on the Gold Coast, in Canberra, and in Mount Isa, and
                we work with clients right across Australia. If you&rsquo;re not near one of our
                offices, a video meeting works just as well. All you need is an internet
                connection.
              </p>
              <p>
                We intend to grow, and we&rsquo;d rather be straightforward about what that means.
                We&rsquo;re new, but we&rsquo;re not starting small &mdash; two advisers and a full
                support team from day one who have worked together before. What we can offer now is
                the time to understand a situation properly before recommending anything, advice
                explained in language you can repeat to someone else, and a clear answer when the
                honest answer is that you don&rsquo;t need to change what you&rsquo;re doing.
              </p>
            </div>

            {heroImage && (
              <figure className="about-figure" data-reveal="right">
                <Image
                  src={heroImage.src}
                  alt=""
                  width={heroImage.width}
                  height={heroImage.height}
                  sizes="(max-width: 900px) 100vw, 40vw"
                  aria-hidden="true"
                />
                <figcaption>
                  <strong>Head office</strong>
                  Southport Central Tower 3, on the Gold Coast. We also meet clients in Canberra,
                  in Mount Isa, and by video anywhere in Australia.
                </figcaption>
              </figure>
            )}
          </div>

          {/* Prescribed disclosure. Stays here, in reading flow, never revealed
              on scroll and never collapsed. */}
          <LackOfIndependence />
        </div>
      </section>

      <section className="section" id="team">
        <div className="wrap">
          {/* The handover copy here read "Six of us across three offices, plus
              remote administration support." Dropped: the stats band already
              says 6 in the team and 3 offices, so in the split head it landed
              as an orphan line repeating a figure the reader just passed. One
              line to restore if the client wants it back. */}
          <div className="section-head" data-reveal>
            <p className="eyebrow">The team</p>
            <h2>Meet the team</h2>
            <hr className="rule-gold" />
          </div>

          <TeamGrid />
        </div>
      </section>

      <section className="section section--tint" id="documents">
        <div className="wrap">
          <div className="section-head section-head--split" data-reveal>
            <p className="eyebrow">Important documents</p>
            <h2>Our disclosure documents</h2>
            <hr className="rule-gold" />
            <p>Free to read, no sign-up. Each opens in a new tab.</p>
          </div>

          <DocumentList />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
