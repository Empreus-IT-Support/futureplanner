'use client'

import Image from 'next/image'
import Link from 'next/link'

import { heroImage, offices } from '@/data/site'
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
            Personal financial advice for families, professionals and business owners —
            retirement, investment, insurance and estate planning, explained in plain English.
          </p>
          <div
            className="hero-actions"
            data-reveal
            style={{ '--reveal-delay': '220ms' } as React.CSSProperties}
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

        <div className="hero-foot">
          <ul className="hero-offices">
            {offices.map((o, i) => (
              <li
                key={o.id}
                data-reveal
                style={{ '--reveal-delay': `${380 + i * 110}ms` } as React.CSSProperties}
              >
                {o.short}
              </li>
            ))}
            <li
              className="hero-offices__note"
              data-reveal
              style={{ '--reveal-delay': '710ms' } as React.CSSProperties}
            >
              and by video anywhere in Australia
            </li>
          </ul>

          <button
            type="button"
            className="scroll-cue"
            onClick={toServices}
            data-reveal
            style={{ '--reveal-delay': '780ms' } as React.CSSProperties}
          >
            <IconChevronDown size={15} />
            What we do
          </button>
        </div>
      </div>
    </section>
  )
}
