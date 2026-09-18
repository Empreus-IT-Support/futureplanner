/**
 * Build guard.
 *
 * Runs before every build but only ever fails in one situation: the site is
 * being made publicly indexable while a disclosure document is missing.
 *
 * The reasoning is narrow on purpose. Preview deploys are useful precisely
 * because the PDFs are not in yet, so those must keep working. But a live,
 * indexable AFSL site whose Financial Services Guide link returns 404 is not a
 * cosmetic problem, and it is exactly the kind of thing that slips through
 * when a deploy is one click.
 *
 * Run automatically via the prebuild script.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const goingLive = process.env.SITE_INDEXABLE === 'true'

const files = [...readFileSync(join(ROOT, 'data/site.ts'), 'utf8').matchAll(/file: '([^']+\.pdf)'/g)].map(
  (m) => m[1],
)

const missing = files.filter((f) => !existsSync(join(ROOT, 'public', 'docs', f)))

if (missing.length === 0) {
  console.log('check:deployable — all disclosure documents present.')
  process.exit(0)
}

if (!goingLive) {
  console.log(
    `check:deployable — ${missing.length} disclosure document(s) missing. Allowed: this build ` +
      'is not indexable (SITE_INDEXABLE is not "true"), so it is a preview.',
  )
  process.exit(0)
}

console.error('\nRefusing to build an indexable site with missing disclosure documents:\n')
for (const f of missing) console.error(`  public/docs/${f}`)
console.error(
  '\nThese links would 404 on a live site. The Financial Services Guide is not optional,\n' +
    'and neither is the Adviser Profile — FSG v6.2 states that page 11 is missing from\n' +
    'downloaded copies, so the annexure is what makes the FSG complete.\n\n' +
    'Add the PDFs, or unset SITE_INDEXABLE to deploy this as a preview.\n',
)
process.exit(1)
