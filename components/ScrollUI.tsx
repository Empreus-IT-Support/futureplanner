'use client'

import { useEffect, useState } from 'react'

import { IconArrowUp } from './Icons'

/**
 * Reading-progress bar and back-to-top control.
 *
 * Both are decorative and additive: neither carries content, and the page is
 * fully usable without them. Scroll work is throttled onto animation frames so
 * it cannot thrash the main thread.
 */
export default function ScrollUI() {
  const [progress, setProgress] = useState(0)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const y = window.scrollY
      setProgress(scrollable > 0 ? Math.min(y / scrollable, 1) : 0)
      setShowTop(y > window.innerHeight * 0.9)
    }

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <>
      <div
        className="scroll-progress"
        style={{ '--progress': progress } as React.CSSProperties}
        aria-hidden="true"
      />
      <button
        type="button"
        className={`to-top${showTop ? ' is-shown' : ''}`}
        onClick={toTop}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
      >
        <IconArrowUp />
      </button>
    </>
  )
}
