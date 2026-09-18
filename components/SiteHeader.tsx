'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { IconArrow } from './Icons'

const links = [
  { href: '/#about', label: 'About', match: '/', section: 'about' },
  { href: '/services', label: 'Services', match: '/services' },
  { href: '/#team', label: 'Our team', match: '/', section: 'team' },
  { href: '/#documents', label: 'Documents', match: '/', section: 'documents' },
  { href: '/contact', label: 'Contact', match: '/contact' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  /** Home page only: which section is currently in view. */
  const [spySection, setSpySection] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  const onContact = pathname === '/contact'
  const onHome = pathname === '/'

  // Condense the header once the page has moved off the top.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 12)
    }
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  // Scrollspy for the home page's in-page links.
  useEffect(() => {
    if (!onHome) return

    const ids = links.map((l) => l.section).filter(Boolean) as string[]
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // The entry nearest the top of the viewport wins.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setSpySection(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    for (const s of sections) observer.observe(s)
    return () => observer.disconnect()
  }, [onHome, pathname])

  // Close the mobile menu on Escape, and when focus leaves it.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Only whole-page destinations may claim aria-current. The hash links point
  // at sections of the home page, so they get a visual active state instead.
  const isCurrentPage = (l: (typeof links)[number]) =>
    !l.href.includes('#') && pathname === l.match

  // Derived rather than reset in an effect, so leaving the home page simply
  // stops any section from being active.
  const activeSection = onHome ? spySection : null

  const isActiveSection = (l: (typeof links)[number]) =>
    l.section !== undefined && activeSection === l.section

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap header-inner">
        <Link className="logo" href="/" onClick={() => setOpen(false)}>
          Future <span>Planner</span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="bars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {open ? 'Close' : 'Menu'}
        </button>

        <nav
          className={`nav${open ? ' is-open' : ''}`}
          id="primary-nav"
          aria-label="Primary"
          ref={navRef}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isActiveSection(l) ? 'is-active' : undefined}
              aria-current={isCurrentPage(l) ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {onContact ? (
          <a className="btn btn--outline btn--sm" href="#enquiry">
            Send an enquiry
            <IconArrow className="arrow" size={13} />
          </a>
        ) : (
          <Link className="btn btn--outline btn--sm" href="/contact">
            Contact us
            <IconArrow className="arrow" size={13} />
          </Link>
        )}
      </div>
    </header>
  )
}
