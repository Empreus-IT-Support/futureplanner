/**
 * Reports on the launch gates that code cannot satisfy by itself.
 *
 * Informational — it does not fail the build. Run it before any go-live
 * conversation so nothing on the checklist gets assumed.
 *
 * Run: npm run check:launch
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (p) => readFileSync(join(ROOT, p), 'utf8')

const ok = (m) => console.log(`  [ok]      ${m}`)
const todo = (m) => console.log(`  [pending] ${m}`)

console.log('\nFuture Planner — launch readiness\n')

// 1. Disclosure documents.
console.log('Disclosure documents')
const docSource = read('data/site.ts')
const files = [...docSource.matchAll(/file: '([^']+\.pdf)'/g)].map((m) => m[1])
for (const f of files) {
  if (existsSync(join(ROOT, 'public', 'docs', f))) ok(`public/docs/${f}`)
  else todo(`public/docs/${f} is missing — the link will 404`)
}

// 2. Team consent.
console.log('\nTeam consent')
const teamSource = read('data/team.ts')
const entries = [...teamSource.matchAll(/name: '([^']+)',\s*\n\s*role:/g)].map((m) => m[1])
const consents = [...teamSource.matchAll(/consent: (true|false)/g)].map((m) => m[1] === 'true')
entries.forEach((name, i) => {
  if (consents[i]) ok(`${name} — consent recorded, profile published`)
  else todo(`${name} — no consent recorded, profile withheld`)
})
if (consents.some((c) => !c)) {
  console.log('      Nothing publishes until consent is flipped in data/team.ts.')
}

// 3. Hero image.
console.log('\nHero image')
if (/^export const heroImage[^=]*=\s*null/m.test(docSource)) {
  todo('no local hero image set — the hero renders as the navy panel')
} else {
  ok('hero image configured')
}

// 4. Form delivery.
console.log('\nEnquiry form')
if (process.env.RESEND_API_KEY) ok('mail provider key present in this environment')
else todo('RESEND_API_KEY not set — the form returns 503 and tells people to email instead')
console.log('  [manual]  SPF, DKIM and DMARC on futureplanner.au')
console.log('  [manual]  delivery tested to a Gmail and an Outlook address')

// 5. Sign-off.
console.log('\nSign-off')
console.log('  [manual]  AVALONFS has approved the finished site')
console.log('  [manual]  HTTPS enforced, HSTS on, admin access behind MFA')
console.log('')
