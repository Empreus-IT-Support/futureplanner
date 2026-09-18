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

      <section className="section section--dark">
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
            <div className="about-copy" data-reveal="left">
              <p>
                Future Planner was established in May 2026. The firm is new — the advice behind it
                isn&rsquo;t. Graeme Davy has been advising clients since 2002, across large
                institutions, a specialist planning firm and one of Australia&rsquo;s biggest
                industry super funds, and Andrew Koulouris came to financial planning from an
                accounting background.
              </p>
              <p>
                We built the firm to be broad rather than narrow. Financial advice tends to find
                people who already have substantial assets behind them, and plenty of people who
                would benefit from a plan don&rsquo;t fit that description. We work with clients at
                different stages and of different means — someone sorting out their super properly
                for the first time, a business owner working out what insurance actually needs to
                cover, a couple trying to picture what retirement looks like in numbers rather than
                in vague terms.
              </p>
              <p>
                We have offices at Southport on the Gold Coast, in Canberra, and in Mount Isa, and
                we meet clients elsewhere in Australia by video. Distance shouldn&rsquo;t decide
                whether someone can get advice, and for a lot of the country it still does.
              </p>
              <p>
                We intend to grow, and we&rsquo;d rather be straightforward about what that means.
                We&rsquo;re a small firm at the start of things. What we can offer now is the time
                to understand a situation properly before recommending anything, advice explained
                in language you can repeat to someone else, and a clear answer when the honest
                answer is that you don&rsquo;t need to change what you&rsquo;re doing.
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
          <div className="section-head section-head--split" data-reveal>
            <p className="eyebrow">The team</p>
            <h2>Meet the team</h2>
            <hr className="rule-gold" />
            <p>Six of us across three offices, plus remote administration support.</p>
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
