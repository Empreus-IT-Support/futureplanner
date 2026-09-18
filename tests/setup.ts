/**
 * Global test setup.
 *
 * Every test starts with `fetch` stubbed to throw. This is a safety net, not a
 * convenience: the suite runs in `prebuild`, which on Vercel means it executes
 * with the production environment loaded — including a live ATLAS_SENDING_KEY.
 * A test that posts a valid enquiry would otherwise make a real call to Atlas
 * from the build machine and could genuinely email the client.
 *
 * That is exactly what happened before this existed. A test asserting the
 * "not configured" path passed locally (no key) and, on Vercel, sailed past it
 * into a real send attempt.
 *
 * Tests that need a network response stub `fetch` themselves with their own
 * mock, which replaces this one for the duration of that test.
 */
import { beforeEach, vi } from 'vitest'

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string | URL | Request) => {
      throw new Error(
        `Tests must not make network calls. Something tried to fetch ${String(url)}. ` +
          'Stub fetch in the test if you need a response.',
      )
    }),
  )
})
