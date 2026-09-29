'use client'

import Image from 'next/image'
import Link from 'next/link'

import { heroImage } from '@/data/site'
import { IconArrow, IconChevronDown } from './Icons'

/**
 * Home page hero.
 *
 * The photograph runs full width behind the copy rather than being boxed into
 * a column. It is a 3:2 landscape aerial, and cropping it into a portrait
 * panel threw away the sky, the beach and the ocean — everything that made it
 * worth using. Full width keeps the composition intact at every breakpoint.
 *
 * Copy sits on a scrim that is heaviest on the left, where the text is, and
 * lifts towards the right so the skyline still reads.
 *
 * The two paragraphs below are client-supplied and were given as a complete
 * replacement for the previous single paragraph. Please don't edit them a
 * sentence at a time. The hero is deliberately short: it says who the firm is
 * for, and the list of advice areas lives above the service cards on
 * /services instead.
 *
 * With `heroImage` set to null this falls back to the navy panel treatment.
 */
export default function Hero() {
  const toServices = () => {
    const target = document.getElementById('services')
    if (!target) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <section className={`hero${heroImage ? '' : ' hero--empty'}`}>
      {heroImage && (
        <div className="hero-media">
          <Image
            src={heroImage.src}
            alt=""
            fill
            sizes="100vw"
            priority
            aria-hidden="true"
          />
        </div>
      )}

      <div className="wrap hero-inner">
        <div className="hero-copy">
          <h1 data-reveal>
            Advice that fits the life you&rsquo;re actually <em>building</em>.
          </h1>
          <p data-reveal style={{ '--reveal-delay': '110ms' } as React.CSSProperties}>
            We provide personal financial advice for individuals, families, professionals and
            business owners &mdash; whether that&rsquo;s a comfortable retirement, funding your
            children&rsquo;s education, getting debt to a manageable level, or building assets
            that fit your plans.
          </p>
          <p data-reveal style={{ '--reveal-delay': '170ms' } as React.CSSProperties}>
            Offices on the Gold Coast, in Canberra and Mount Isa, and video meetings anywhere in
            Australia.
          </p>
          <div
            className="hero-actions"
            data-reveal
            style={{ '--reveal-delay': '260ms' } as React.CSSProperties}
          >
            <Link className="btn btn--gold" href="/contact">
              Contact us
              <IconArrow className="arrow" />
            </Link>
            <Link className="btn btn--ghost" href="/services">
              Our services
            </Link>
          </div>
        </div>

        {/*
          This row used to carry a bulleted list of the three offices and a
          "by video anywhere in Australia" note. The supplied second paragraph
          now says exactly that a few lines above, so the list was the same
          information twice in one viewport and has gone. Restore it from git
          if the client would rather have the list than the sentence.
        */}
        <div className="hero-foot">
          <button
            type="button"
            className="scroll-cue"
            onClick={toServices}
            data-reveal
            style={{ '--reveal-delay': '380ms' } as React.CSSProperties}
          >
            <IconChevronDown size={15} />
            What we do
          </button>
        </div>
      </div>
    </section>
  )
}
