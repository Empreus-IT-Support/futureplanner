import { generalAdviceWarning } from '@/data/compliance'

/**
 * General advice warning. Rendered by the root layout so that it sits above
 * the footer on EVERY page, including any route added later. If you ever move
 * it out of the layout you must add it to every page by hand.
 *
 * It is an <aside> rather than a bare <div> because it sits outside main,
 * header and footer — without a landmark it is content belonging to no region,
 * which axe flags and which makes it awkward to reach for anyone navigating by
 * landmark. That matters more than usual on a block people are meant to find.
 */
export default function AdviceWarning() {
  return (
    <aside className="advice-warning" aria-label="General advice warning">
      <div className="wrap">
        <p>
          <strong>General advice warning.</strong> {generalAdviceWarning}
        </p>
      </div>
    </aside>
  )
}
