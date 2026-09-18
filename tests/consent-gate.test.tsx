/**
 * The consent gate.
 *
 * Launch is gated on written consent from all six team members: no name and no
 * photograph may be published before that person's consent is returned.
 *
 * The failure mode this guards against is quiet. Nothing throws if a future
 * refactor reads the raw `team` array instead of `publishedTeam()` — the site
 * simply starts publishing six real people's names, email addresses and ASIC
 * adviser numbers without their consent, and no build step complains. These
 * tests assert on rendered output rather than on the helper, so they fail
 * whichever way that mistake is made.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import StructuredData from '@/components/StructuredData'
import TeamGrid from '@/components/TeamGrid'
import { isTeamPreview, publishedTeam, team } from '@/data/team'

/** Strings that must never reach the page while consent is outstanding. */
const identifying = (m: (typeof team)[number]) =>
  [m.name, m.email, m.phone, m.asicAdviserNumber].filter(Boolean) as string[]

const withoutConsent = () => team.filter((m) => !m.consent)

describe('publishedTeam()', () => {
  it('returns nobody while no consent is recorded', () => {
    // If this fails because consents have genuinely been returned, that is
    // fine — but then the fixtures below need revisiting too.
    expect(team.every((m) => !m.consent)).toBe(true)
    expect(publishedTeam()).toHaveLength(0)
  })

  it('returns only members whose consent is recorded', () => {
    const consented = team.filter((m) => m.consent)
    expect(publishedTeam().map((m) => m.id)).toEqual(consented.map((m) => m.id))
  })
})

describe('rendered output while consent is outstanding', () => {
  it('TeamGrid publishes no name, email, phone or ASIC number', () => {
    const html = renderToStaticMarkup(<TeamGrid />)

    for (const member of withoutConsent()) {
      for (const value of identifying(member)) {
        expect(html, `TeamGrid leaked "${value}" for ${member.name}`).not.toContain(value)
      }
    }
  })

  it('TeamGrid still renders the holding state, so the section is not simply broken', () => {
    const html = renderToStaticMarkup(<TeamGrid />)
    expect(html).toContain('consent')
  })

  it('StructuredData publishes no identifying detail either', () => {
    // Structured data is the easier place to leak: it is invisible on the
    // page, so a mistake here would not be caught by looking at the site.
    const html = renderToStaticMarkup(<StructuredData />)

    for (const member of withoutConsent()) {
      for (const value of identifying(member)) {
        expect(html, `StructuredData leaked "${value}" for ${member.name}`).not.toContain(value)
      }
    }
  })

  it('StructuredData emits no employee block at all', () => {
    const html = renderToStaticMarkup(<StructuredData />)
    expect(html).not.toContain('"employee"')
  })
})

describe('the preview flag', () => {
  /**
   * These assert the logic in publishedTeam(), which reads the environment at
   * call time. Note that Next inlines NEXT_PUBLIC_* at build time, so this
   * covers the decision rather than the bundling — the real production
   * behaviour was verified separately against an actual `next build` and
   * `next start`, which emitted no profile data at all.
   */
  it('is ignored in a production build, whatever it is set to', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_PREVIEW_TEAM', 'true')

    expect(publishedTeam()).toHaveLength(0)
    expect(isTeamPreview()).toBe(false)
  })

  it('only opens up for the exact string "true"', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_PREVIEW_TEAM', 'yes')

    expect(publishedTeam()).toHaveLength(0)
  })

  it('does open up in development when set exactly, so the layout stays reviewable', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_PREVIEW_TEAM', 'true')

    expect(publishedTeam()).toHaveLength(team.length)
    expect(isTeamPreview()).toBe(true)
  })
})
