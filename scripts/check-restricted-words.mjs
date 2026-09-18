/**
 * Fails the build if a restricted word appears in site copy.
 *
 * "Independent", "impartial" and "unbiased" are restricted by statute, and per
 * ASIC's stated position so are "independently owned", "non-aligned" and
 * "non-institutionally owned". They must not appear anywhere on the site —
 * including meta descriptions, alt text and image filenames.
 *
 * Matching is done on normalised text: lowercased, with every run of
 * non-letters collapsed to a single space. That catches "Non-Aligned",
 * "non aligned" and "NON_ALIGNED" alike, and avoids brittle escaping.
 *
 * Run: npm run check:words
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SCAN_DIRS = ['app', 'components', 'data', 'public']
const SCAN_EXT = /\.(tsx?|jsx?|css|md|html|json|txt)$/

const WORDS = [
  'independent',
  'impartial',
  'unbiased',
  'independently owned',
  'non aligned',
  'non institutionally owned',
]

/**
 * Files holding AVALONFS's own prescribed wording, or the definition of this
 * list itself. These are the only places a restricted word may legitimately
 * appear, and they are not to be edited without compliance sign-off.
 */
const ALLOWED_FILES = new Set([
  join('data', 'compliance.ts'),
  join('data', 'site.ts'),
])

/**
 * Code identifiers that contain a restricted word but render nothing. Both
 * belong to the Lack of Independence box itself.
 */
const IDENTIFIERS = [/not-independent/gi, /notIndependent/g]

/** Lowercase, and collapse every run of non-letters to one space. */
const normalise = (s) => ' ' + s.toLowerCase().replace(/[^a-z]+/g, ' ').trim() + ' '

function walk(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const entry of entries) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const findings = []

for (const dirName of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dirName))) {
    const rel = relative(ROOT, file)

    // Image and document filenames are copy too.
    const relNorm = normalise(rel)
    for (const word of WORDS) {
      if (relNorm.includes(' ' + word + ' ')) {
        findings.push({ rel, line: 0, word, text: '(filename)' })
      }
    }

    if (!SCAN_EXT.test(file) || ALLOWED_FILES.has(rel)) continue

    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .forEach((raw, i) => {
        let line = raw
        for (const id of IDENTIFIERS) line = line.replace(id, ' ')
        const text = normalise(line)
        for (const word of WORDS) {
          if (text.includes(' ' + word + ' ')) {
            findings.push({ rel, line: i + 1, word, text: raw.trim() })
          }
        }
      })
  }
}

if (findings.length > 0) {
  console.error('\nRestricted words found. These must not appear on the site:\n')
  for (const f of findings) {
    console.error(`  ${f.rel}:${f.line}  "${f.word}"`)
    console.error(`    ${f.text.slice(0, 120)}`)
  }
  console.error('\nIf this is AVALONFS prescribed wording, it belongs in data/compliance.ts.\n')
  process.exit(1)
}

console.log('check:words — clean, no restricted words in site copy.')
