'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Scroll-reveal driver.
 *
 * The CSS hides [data-reveal] elements only while `html.js-motion` is set, and
 * this component sets that class at runtime. So with JavaScript disabled or
 * broken, nothing is hidden and the whole page renders normally — which is the
 * reason the compliance blocks were safe to leave in normal flow.
 *
 * It also honours prefers-reduced-motion by not adding the class at all, and
 * re-scans after a route change.
 */
export default function MotionProvider() {
  const pathname = usePathname()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reduced.matches) {
      document.documentElement.classList.remove('js-motion')
      return
    }

    document.documentElement.classList.add('js-motion')

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const revealAll = () => targets.forEach((el) => el.classList.add('is-visible'))

    // If the browser has no IntersectionObserver, show everything rather than
    // leaving it hidden behind an effect that will never fire.
    if (typeof IntersectionObserver === 'undefined') {
      revealAll()
      return
    }

    // Anything already on screen at mount is shown immediately, so the first
    // viewport never animates in late.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )

    for (const el of targets) observer.observe(el)

    // Backstop. Nothing on this site is allowed to stay invisible because an
    // animation did not run — a throttled tab, a stalled observer, anything.
    const failsafe = window.setTimeout(revealAll, 2500)

    // The gold swash under the hero's emphasised word draws after the headline
    // has settled.
    const swash = document.querySelector<HTMLElement>('.hero h1 em')
    const swashTimer = window.setTimeout(() => swash?.classList.add('is-drawn'), 120)

    return () => {
      observer.disconnect()
      window.clearTimeout(swashTimer)
      window.clearTimeout(failsafe)
    }
  }, [pathname])

  return null
}
