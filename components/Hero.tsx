'use client'

import Image from 'next/image'
import Link from 'next/link'

import { heroImage, offices } from '@/data/site'
import { IconArrow, IconChevronDown } from './Icons'

/**
 * Home page hero.
 *
 * The image slot is empty until a locally hosted file is supplied — see
 * `heroImage` in data/site.ts. The static build hotlinked an interim photo
 * from a third-party CDN, which must not ship. While the slot is empty the
 * figure renders as a designed navy panel with a gold scrim and grid, which is
 * close to how the photograph reads under its overlay anyway.
 *
 * The drifting blooms behind the copy are decorative only and stop entirely
 * under prefers-reduced-motion.
 */
export default function Hero() {
  const toServices = () => {
    const target = document.getElementById('services')
    if (!target) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <section className="hero">
      <div className="hero-aura" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 data-reveal>
            Advice that fits the life you&rsquo;re actually <em>building</em>.
          </h1>
          <p data-reveal style={{ "--reveal-delay": "110ms" } as React.CSSProperties}>
            Personal financial advice for families, professionals and business owners —
            retirement, investment, insurance and estate planning, explained in plain English.
            Offices on the Gold Coast, in Canberra and Mount Isa, and video meetings anywhere in
            Australia.
          </p>
          <div className="hero-actions" data-reveal style={{ "--reveal-delay": "220ms" } as React.CSSProperties}>
            <Link className="btn btn--primary" href="/contact">
              Contact us
              <IconArrow className="arrow" />
            </Link>
            <Link className="btn btn--outline" href="/services">
              Our services
            </Link>
          </div>

          <button
            type="button"
            className="scroll-cue"
            onClick={toServices}
            data-reveal
            style={{ "--reveal-delay": "320ms" } as React.CSSProperties}
          >
            <IconChevronDown size={15} />
            What we do
          </button>
        </div>

        <div
          className={`hero-figure${heroImage ? "" : " hero-figure--empty"}`}
          data-reveal="scale" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          {heroImage ? (
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              width={heroImage.width}
              height={heroImage.height}
              /* Without sizes the browser assumes 100vw and pulls the 3840px
                 variant onto a phone. The figure is full width below 900px and
                 a little under half the shell above it. */
              sizes="(max-width: 900px) 100vw, 46vw"
              priority
            />
          ) : null}

          <div className="hero-panel">
            <p className="title">Where we are</p>
            <ul>
              {offices.map((o, i) => (
                <li
                  key={o.id}
                  data-reveal
                  style={{ "--reveal-delay": `${450 + i * 120}ms` } as React.CSSProperties}
                >
                  {o.short}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
