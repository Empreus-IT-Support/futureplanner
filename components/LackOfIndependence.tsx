import { lackOfIndependence } from '@/data/compliance'

/**
 * ===========================================================================
 * PRESCRIBED DISCLOSURE — AVALONFS FSG v6.2, page 2.
 * ===========================================================================
 * Formatting is prescribed: a visible box, a bold heading containing the
 * required phrase, font size no smaller than the surrounding body text, and
 * never a footnote.
 *
 * Do not reword it, move it to the footer, or collapse it into an accordion.
 * It belongs in the About section of the home page, in normal reading flow.
 */
export default function LackOfIndependence() {
  return (
    <section className="not-independent" aria-labelledby="lack-of-independence">
      <h3 id="lack-of-independence">{lackOfIndependence.heading}</h3>
      <p>{lackOfIndependence.body}</p>
    </section>
  )
}
