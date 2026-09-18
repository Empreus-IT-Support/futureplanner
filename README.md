# Future Planner — website

Next.js 16 (App Router, TypeScript) rebuild of the static handover build.
Same design, same prescribed wording; the duplicated header and footer are now
shared components, the team and offices are data, and the enquiry form is
wired up.

```
app/
  layout.tsx            Shell — fonts, header, general advice warning, footer
  page.tsx              Home — hero, services, about, team, documents
  services/page.tsx     Services
  contact/page.tsx      Offices + enquiry form
  complaints/page.tsx   Complaints and AFCA
  not-found.tsx         404
  api/enquiry/route.ts  Form handler
  globals.css           All styling (brand tokens at the top)
components/             Header, footer, and the page sections
data/
  compliance.ts         PRESCRIBED WORDING — see below
  site.ts               Entity, offices, documents, hero image
  team.ts               The six team members, with the consent gate
  services.ts           Services and the exclusions list
public/docs/            The three PDFs go here
public/images/          Hero and headshots go here
scripts/                Pre-launch checks
```

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run check:words` | Fails if a restricted word appears in copy or a filename |
| `npm run check:launch` | Reports which launch gates are still open |
| `npm run check:deployable` | Fails an indexable build if a disclosure PDF is missing |
| `npm run check` | Restricted words, lint and types together |

---

## Before this can go live

### 1. Add the PDFs to `public/docs/`
Filenames are set in `data/site.ts` — change them there, not in the pages.

- `FSG-v6-2-2025-02.pdf` — AVALONFS Financial Services Guide v6.2
- `Adviser-Profile-v6-1-2023-04.pdf` — FSG annexure (page 11)
- `AVALONFS-Privacy-Policy-2023-01.pdf` — AVALONFS Privacy Policy

The Adviser Profile is **not optional**. The FSG states that page 11 is missing
from downloaded copies, so publishing the annexure separately is what makes the
FSG complete.

Version the filenames and keep old versions when documents are replaced — do
not overwrite. Every version made available must be retained for seven years.
When a URL is retired, add it to `legacyDocuments` in `next.config.ts` rather
than letting it 404.

### 2. Configure the enquiry form
The handler is at `app/api/enquiry/route.ts`. Copy `.env.example` to
`.env.local` and set the values. It already does what the brief required: POSTs
over TLS to a handler we control, delivers to `admin@futureplanner.au`, sets
Reply-To to the sender, uses the subject `Website enquiry — [office]`, sends an
auto-reply carrying the FSG link and the general advice warning, and logs the
fact of a failure but never the contents of a submission.

Spam protection is a honeypot field, a minimum time-on-page, and a per-IP rate
limit. None of it involves a third party, so nothing here changes what the
privacy position needs to cover.

Two things are still operations work, not code:

- **Set up SPF, DKIM and DMARC on futureplanner.au before launch.** Form mail
  sent without authentication lands in spam. Test delivery to a Gmail *and* an
  Outlook address.
- The rate limit is in-process. If this is ever deployed across more than one
  instance, move it to a shared store or the limit silently weakens.

Until `RESEND_API_KEY` is set the form returns a clear message telling people
to email or call instead, rather than failing silently.

### 3. Replace the interim hero photograph — done, but still interim

The photograph the handover named — the Gold Coast skyline, City of Gold Coast,
Unsplash License, free for commercial use — has been downloaded to
`public/images/gold-coast-skyline.jpg` (2400x1601) and is served from there.
Nothing points at a third-party CDN. `next/image` converts it to WebP or AVIF
per browser, so the WebP-with-JPG-fallback requirement is met by the pipeline
rather than by shipping two files.

It appears in three places at three different crops — the hero, beside the
About copy, and behind the closing band — so the page carries imagery without a
second licence to track.

**It is still interim.** The handover says it will be replaced with a team or
office photograph. Swap the file and update `heroImage` in `data/site.ts`;
setting that to `null` falls back to a designed navy panel with a gold grid.

### 4. Add the headshots
Portrait 4:5 crop, 1200×1500px minimum, consistent lighting and background
across all six, WebP with a JPG fallback. Alt text names the person and their
role. Point each member's `photo` in `data/team.ts` at the file.

**Launch is gated on written consent from all six team members.** Every member
currently has `consent: false`, so no name and no photo is published — the team
section shows a holding line instead. Flip the flag only when that person's
signed consent is in hand. The grid reflows cleanly at any count.

Taking someone down means clearing their entry *and* deleting their photo from
`public/images` and from any cached or CDN copy — not just the page.

---

## Things that must not be changed without compliance sign-off

All of the prescribed wording lives in **`data/compliance.ts`**. Nothing in
that file is marketing copy, and none of it is yours to tighten or reword.

**The footer disclosure block.** Rendered by `SiteFooter`, which the root
layout puts on every page. Body-size text, normal contrast. Do not shrink it,
put it behind an accordion, or lighten it against the navy.

**The "Lack of Independence" Statement** (`components/LackOfIndependence.tsx`,
rendered in the About section). This is AVALONFS's own wording from FSG v6.2
page 2. Formatting is prescribed: visible box, bold heading containing the
required phrase, font size no smaller than surrounding body text, never a
footnote. Do not reword, reposition to the footer, or collapse it.

**The general advice warning.** Rendered by the root layout, so it appears
above the footer on every page — including any page added later, and the 404.
If you ever move it out of the layout you must add it to every page by hand.

**Restricted words.** "Independent", "impartial", "unbiased" — and per ASIC's
stated position also "independently owned", "non-aligned" and
"non-institutionally owned" — must not appear anywhere on the site. This
includes meta descriptions, alt text and image filenames. `npm run check:words`
enforces this and fails the build; the only allowlisted file is
`data/compliance.ts`, which holds the Statement itself.

**No tax content.** Tax and accounting are off the site entirely. The only
permitted mention is Andrew's accounting background in his profile, as
background rather than an offer. Watch for it creeping back in through phrases
like "tax-effective".

---

## Notes on the build

- **Colours** come from the brand guide and are set as CSS custom properties at
  the top of `globals.css`. Nothing outside those tokens is used. That is also
  why this is plain CSS rather than a utility framework.
- **Type: one deliberate departure from the brand guide.** Playfair Display is
  the brand serif and is unchanged. The body face is **Plus Jakarta Sans**, not
  the Arial the guide specified — Arial is a websafe fallback rather than a
  chosen face. A narrow UI face reads thin beside a high-contrast serif; Plus
  Jakarta Sans has wider, rounder forms that give the page better colour, and
  it stays clearly legible at the small sizes that matter most here (the footer
  disclosure and the general advice warning).
  This needs sign-off along with the rest of the design. To revert, set
  `--body` back to `Arial, Helvetica, sans-serif` in `globals.css` and drop the
  `Plus_Jakarta_Sans` import from `app/layout.tsx`.
  Both faces are self-hosted by `next/font` — no request goes to the Google
  Fonts CDN.
- **Careful with `ch` units** if the body face is ever swapped again. `ch` is
  relative to the element font, so every `ch`-based column re-flows; that is
  why `.hero-copy` is sized in px.
- **Header and footer are components**, not copies. A change is made once.
- **The team and the offices are data.** People and office details can be added
  or removed without touching a page — which is what the CMS note in the
  original handover was asking for.
- **Accessibility:** skip link, visible focus states, labelled form fields with
  errors tied to their inputs via `aria-describedby`, the submit outcome moved
  into an `aria-live` region and focused, semantic landmarks, reduced-motion
  respected. Please keep these.
- **No analytics or tracking is included**, and no third-party request is made
  at runtime — the display typeface is self-hosted by `next/font` rather than
  fetched from the Google Fonts CDN. The site relies on the AVALONFS Privacy
  Policy, which describes cookies and forms on avalonfs.com.au rather than this
  site — so check with Sarah before adding any tracker or pixel.
- **Legacy URLs.** `/index.html`, `/services.html`, `/contact.html` and
  `/complaints.html` redirect permanently to the new routes in
  `next.config.ts`. Browsers carry the fragment across the redirect, so the
  Google Business Profile links to `/contact.html#mount-isa` keep landing on
  the right office card.
- **Google Business Profiles:** point each office listing at its anchor on the
  contact page (`/contact#mount-isa`), not the homepage. Keep address and phone
  identical across the site, the profiles and ASIC's register — they come from
  `data/site.ts` here, so change them in one place.
- **Security headers** are set in `next.config.ts`: a Content Security Policy
  locked to `self` on every fetch directive, HSTS, nosniff, referrer policy,
  `frame-ancestors none`, COOP, CORP and a permissions policy. `X-Powered-By`
  is off. HSTS assumes HTTPS is enforced at the platform edge.
  `script-src` keeps `unsafe-inline` deliberately — see the comment above the
  policy. Removing it means nonces, nonces mean middleware, and that would turn
  every page dynamic for little gain on a site that loads no third-party
  scripts at all.
- **The enquiry endpoint** rejects anything that is not `application/json`,
  rejects cross-origin posts, and caps the body before parsing it.
- **Structured data** (`components/StructuredData.tsx`) restates only what is
  already on the page, and takes people from `publishedTeam()` so the consent
  gate applies to JSON-LD too. No ratings or reviews — there is no basis for
  either, and inventing them would be a fabricated claim.

## Layout and imagery

- **Shell width** is `--shell` (1320px) with smaller gutters than the static
  build, so the page does not sit in a narrow column with wide empty margins.
  Prose still wraps at `--measure` (68ch) because long lines are hard to read.
- **Split section heads** (`.section-head--split`) put the heading on the left
  and its description alongside on the right above 900px, which uses the wider
  shell without stretching line length. They collapse to one column on mobile.
- **Imagery is all local.** One licensed photograph at three crops, plus
  `texture-contours.svg`, which is authored in this repo — brand colours only,
  no download, no licence. Decorative images carry `alt=""` and `aria-hidden`
  so they are skipped by screen readers.
- **Always set `sizes` on next/image.** Without it the browser assumes 100vw
  and pulls the 3840px variant onto a phone.
- **Team monograms** stand in for headshots until photographs and consents
  arrive. See the consent gate above.

## Motion and interaction

Animation is decorative throughout, and the site is built so that nothing is
ever *withheld* by it.

- **Reveal on scroll.** Elements marked `data-reveal` fade and rise into view.
  The hidden state is applied only under `html.js-motion`, a class
  `MotionProvider` adds at runtime — so with JavaScript off, blocked or broken,
  nothing is hidden and the page renders normally. The end state is set by a
  class, never by `animation-fill-mode`, so an animation that never runs (a
  throttled or backgrounded tab) still leaves content visible. There is also a
  2.5s failsafe that reveals everything regardless.
- **The compliance blocks carry no `data-reveal` at all.** The Lack of
  Independence box, the general advice warning and the footer disclosure are
  never animated, never deferred and never dependent on script. Please keep it
  that way — a disclosure that fades in on scroll is a disclosure that can fail
  to appear.
- **Reduced motion.** `prefers-reduced-motion: reduce` stops every animation and
  transition, and force-shows anything a reveal would have hidden.
- **What moves:** header condenses on scroll, nav underlines grow from centre,
  a scrollspy tracks the home page sections, hero copy and the drifting
  background blooms, count-up figures in the stats band, card and office hover
  lift, the reading-progress bar and back-to-top control, and the form's focus,
  validation and sending states.
- No animation library is used, and no third-party request is made for any of
  it — `IntersectionObserver`, CSS transitions and one `requestAnimationFrame`
  loop.

### Reviewing the team layout before consent

`NEXT_PUBLIC_PREVIEW_TEAM=true` in `.env.local` renders all six profiles so the
team grid can be designed and reviewed, with a banner saying why they are on
screen. **A production build ignores the flag entirely** — this has been
verified against a real `next build && next start`: the built HTML contains no
profile names, emails or ASIC numbers, only the holding state. Publishing
anybody still means setting `consent: true` in `data/team.ts`.

---

## Not supplied with the handover

These were referenced by the handover but never arrived, and are not in the
repo. They have to come from the client or AVALONFS:

- **The three disclosure PDFs.** `docs/` in the original archive held only a
  note saying to put them there. They are AVALONFS documents, not Future
  Planner ones: FSG v6.2 (Feb 2025), Adviser Profile v6.1 (Apr 2023) and the
  AVALONFS Privacy Policy (Jan 2023).
- **`FuturePlanner_BrandingGuide.html`**, which `styles.css` cites as the
  source of the palette and typography. The colour tokens were carried across
  from that stylesheet, so they are faithful; the guide itself has not been
  seen, which is worth knowing when reviewing the typeface change.
- **`FuturePlanner_Website_Layout_Brief.html`**, which the handover README
  names as the specification the static build was written against.

`npm run build` refuses to produce an **indexable** build while a disclosure
document is missing — see `scripts/check-deployable.mjs`. Preview builds are
unaffected, which is the point: you can deploy and review now, but you cannot
quietly put a live AFSL site up with a 404 where the Financial Services Guide
should be.

## One thing to check with the client

The source material spells the second adviser's name two ways: the body copy
and the contact page say **Andrew Koulouris**, while the footer disclosure and
the licensee strip say **Andreas Koulouris** (ASIC Adviser No. 249603). Both
have been carried across exactly as supplied, because the disclosure wording
cannot be edited without sign-off. Confirm which is correct and have AVALONFS
approve the change if the disclosure is the one that is wrong.

---

## Deploying to Vercel

- **Set the environment variables** from `.env.example`: `RESEND_API_KEY`,
  `ENQUIRY_TO`, `ENQUIRY_FROM`. Leave `NEXT_PUBLIC_PREVIEW_TEAM` unset — a
  production build ignores it regardless.
- **Leave `SITE_INDEXABLE` off until launch.** Without it the site serves
  `Disallow: /` and a noindex meta tag. Turn it on only once AVALONFS has
  approved and the consents are in.
- **The enquiry rate limit is in-process.** On serverless each invocation can be
  a fresh instance, so the per-IP limit is far weaker in practice than it looks
  locally. The honeypot and the time-on-page check are unaffected. If the form
  attracts real abuse, move the limiter to a shared store (Vercel KV or
  Upstash) rather than relying on it as it stands.
- **Point the domain at Vercel and let it issue the certificate.** HSTS is
  already set in `next.config.ts` and assumes HTTPS is enforced at the edge.
- The three PDFs are still missing, so the Financial Services Guide, Adviser
  Profile and Privacy Policy links will 404 on a live deploy. Worth fixing
  before the URL goes anywhere near a client.

## Launch checklist

- [ ] Three PDFs in `public/docs/` and links tested
- [ ] `RESEND_API_KEY` set, delivering to admin@futureplanner.au
- [ ] SPF / DKIM / DMARC configured and delivery tested
- [ ] Auto-reply working, with FSG link included
- [x] Hero image hosted locally and `heroImage` set (interim photo — client photography still to come)
- [ ] All six consents returned; `consent: true` set; headshots added
- [ ] Adviser name discrepancy resolved
- [ ] Body typeface change (Arial to Plus Jakarta Sans) signed off
- [ ] `SITE_INDEXABLE=true` set in Vercel (off until AVALONFS approves)
- [ ] HTTPS enforced, HSTS on, admin access behind MFA
- [ ] `npm run check` passes
- [ ] Contrast and keyboard navigation checked
- [ ] **AVALONFS has approved the finished site**
