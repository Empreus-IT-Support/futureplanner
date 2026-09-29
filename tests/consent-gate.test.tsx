/**
 * The consent gate.
 *
 * Originally this held the whole section back: nobody's name, email or ASIC
 * adviser number could be published until their written consent was returned.
 * The client supplied and approved all six profiles on 29 September 2026, so
 * every member now publishes and the gate is open.
 *
 * The gate itself stays, and these tests stay with it, because it is still
 * load-bearing. Photographs have not arrived yet and will come later as a
 * batch with signed consent forms; someone may join, or ask to be taken down,
 * between now and then. Flipping one flag has to be enough to withhold a
 * person completely, including from the structured data.
 *
 * The failure mode is quiet. Nothing throws if a future refactor renders the
 * raw `team` array instead of `publishedTeam()` — a withheld person simply
 * reappears, and no build step complains. So these tests assert on rendered
 * output rather than on the helper, and they withhold a real member to prove
 * it, rather than trusting that the filter is wired up.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import StructuredData from '@/components/StructuredData'
import TeamGrid from '@/components/TeamGrid'
import { isTeamPreview, publishedTeam, team } from '@/data/team'

/** Strings that must never reach the page while someone is withheld. */
const identifying = (m: (typeof team)[number]) =>
  [m.name, m.email, m.phone, m.asicAdviserNumber].filter(Boolean) as string[]

/**
 * Withhold a real member for the duration of a test.
 *
 * Mutating the fixture is deliberate. A synthetic member would only prove that
 * `filter` works; withholding someone who is actually rendered proves that the
 * components go through the gate to get their data.
 */
const consents = team.map((m) => m.consent)
const withhold = (id: string) => {
  const member = team.find((m) => m.id === id)
  if (!member) throw new Error(`no member with id ${id}`)
  member.consent = false
  return member
}

afterEach(() => {
  team.forEach((m, i) => {
    m.consent = consents[i]
  })
  vi.unstubAllEnvs()
})

describe('publishedTeam()', () => {
  it('publishes every member now that consent is recorded', () => {
    expect(team.every((m) => m.consent)).toBe(true)
    expect(publishedTeam()).toHaveLength(team.length)
  })

  it('returns only members whose consent is recorded', () => {
    withhold('graeme-davy')

    const consented = team.filter((m) => m.consent)
    expect(publishedTeam().map((m) => m.id)).toEqual(consented.map((m) => m.id))
    expect(publishedTeam()).toHaveLength(team.length - 1)
  })
})

describe('a withheld member', () => {
  it('has no name, email, phone or ASIC number in TeamGrid', () => {
    // An adviser, because they carry the most identifying detail: an email
    // address, a direct phone number and an adviser number.
    const member = withhold('andrew-koulouris')
    const html = renderToStaticMarkup(<TeamGrid />)

    for (const value of identifying(member)) {
      expect(html, `TeamGrid leaked "${value}" for ${member.name}`).not.toContain(value)
    }
    // The rest of the section carries on regardless.
    expect(html).toContain('Graeme Davy')
  })

  it('has nothing in the structured data either', () => {
    // Structured data is the easier place to leak: it is invisible on the
    // page, so a mistake here would not be caught by looking at the site.
    const member = withhold('sarah-keating')
    const html = renderToStaticMarkup(<StructuredData />)

    for (const value of identifying(member)) {
      expect(html, `StructuredData leaked "${value}" for ${member.name}`).not.toContain(value)
    }
  })

  it('leaves no employee block at all when everyone is withheld', () => {
    for (const m of team) m.consent = false

    expect(renderToStaticMarkup(<StructuredData />)).not.toContain('"employee"')
    // And the section still renders rather than collapsing into nothing.
    expect(renderToStaticMarkup(<TeamGrid />)).toContain('consent')
  })
})

describe('the published team', () => {
  it('names everyone on the page', () => {
    const html = renderToStaticMarkup(<TeamGrid />)
    for (const m of team) expect(html).toContain(m.name)
  })

  it('gives an adviser number only to the advisers', () => {
    const html = renderToStaticMarkup(<TeamGrid />)
    const numbered = team.filter((m) => m.asicAdviserNumber)

    expect(numbered.map((m) => m.id)).toEqual(['graeme-davy', 'andrew-koulouris'])
    for (const m of numbered) expect(html).toContain(m.asicAdviserNumber as string)
  })
})

describe('the preview flag', () => {
  /**
   * These assert the logic in publishedTeam(), which reads the environment at
   * call time. Note that Next inlines NEXT_PUBLIC_* at build time, so this
   * covers the decision rather than the bundling — the real production
   * behaviour was verified separately against an actual `next build` and
   * `next start`.
   */
  it('is ignored in a production build, whatever it is set to', () => {
    withhold('maria-tuazon')
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_PREVIEW_TEAM', 'true')

    expect(publishedTeam()).toHaveLength(team.length - 1)
    expect(isTeamPreview()).toBe(false)
  })

  it('only opens up for the exact string "true"', () => {
    withhold('maria-tuazon')
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_PREVIEW_TEAM', 'yes')

    expect(publishedTeam()).toHaveLength(team.length - 1)
  })

  it('does open up in development when set exactly, so the layout stays reviewable', () => {
    withhold('maria-tuazon')
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_PREVIEW_TEAM', 'true')

    expect(publishedTeam()).toHaveLength(team.length)
    expect(isTeamPreview()).toBe(true)
  })
})
