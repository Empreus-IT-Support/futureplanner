'use client'

import { useEffect, useRef, useState } from 'react'

import { stats } from '@/data/site'

/**
 * Stats band. Figures count up once, the first time the band is scrolled into
 * view, and land on the real value.
 *
 * The final value is rendered on the server, so the correct figure is in the
 * markup whether or not the script runs — the animation only replaces it on
 * the way up. Reduced motion skips straight to the value.
 */
function useCountUp(target: number | null, from: number, start: boolean) {
  const [value, setValue] = useState<number | null>(target)

  useEffect(() => {
    if (target === null || !start) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const duration = 1400
    const begin = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const t = Math.min((now - begin) / duration, 1)
      if (t >= 1) {
        // Land on the exact target rather than whatever the easing rounds to.
        setValue(target)
        return
      }
      // Ease-out cubic, so it decelerates onto the number.
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(from + (target - from) * eased))
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    // requestAnimationFrame is paused entirely while a tab is backgrounded or
    // otherwise not painting, which would strand the counter on a part-way
    // number — showing "1 Offices" or "1990" instead of the real figure. A
    // timer still fires when throttled, so it guarantees the true value.
    const failsafe = window.setTimeout(() => setValue(target), duration + 400)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(failsafe)
    }
  }, [target, from, start])

  return value
}

function Figure({ stat, start }: { stat: (typeof stats)[number]; start: boolean }) {
  const count = useCountUp(stat.value, stat.from ?? 0, start)

  return (
    <div className="figure">
      {stat.prefix && <span className="suffix">{stat.prefix}</span>}
      <span>{stat.value === null ? stat.display : count}</span>
      {stat.suffix && <span className="suffix">{stat.suffix}</span>}
    </div>
  )
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [start, setStart] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="stats" ref={ref}>
      {stats.map((s, i) => (
        <div
          className="stat"
          key={s.label}
          data-reveal
          style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
        >
          <Figure stat={s} start={start} />
          <p className="label">{s.label}</p>
          <p className="sub">{s.sub}</p>
        </div>
      ))}
    </div>
  )
}
