import Image from 'next/image'
import Link from 'next/link'

import { heroImage } from '@/data/site'
import { IconArrow } from './Icons'

/**
 * Full-bleed closing band.
 *
 * Reuses the one licensed photograph at a different crop under a heavy navy
 * wash, so the page gets a second piece of imagery without a second licence to
 * track. The copy restates the "first conversation" line already on the
 * services page — no new claim is made here.
 */
export default function CtaBand() {
  return (
    <section className="band">
      {heroImage && (
        <Image
          src={heroImage.src}
          alt=""
          width={heroImage.width}
          height={heroImage.height}
          sizes="100vw"
          aria-hidden="true"
        />
      )}

      <div className="wrap">
        <div className="band-inner" data-reveal>
          <p className="eyebrow">Where to start</p>
          <h2>A first conversation costs nothing</h2>
          <hr className="rule-gold" />
          <p>
            It carries no obligation, and it&rsquo;s mostly us asking questions — what you&rsquo;re
            trying to sort out, what&rsquo;s already in place, and whether we&rsquo;re the right
            people to help.
          </p>
          <div className="hero-actions band-actions">
            <Link className="btn btn--primary" href="/contact">
              Contact us
              <IconArrow className="arrow" />
            </Link>
            <Link className="btn btn--outline" href="/services">
              Our services
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
