import { generalAdviceWarning } from '@/data/compliance'

/**
 * General advice warning. Rendered by the root layout so that it sits above
 * the footer on EVERY page, including any route added later. If you ever move
 * it out of the layout you must add it to every page by hand.
 */
export default function AdviceWarning() {
  return (
    <div className="advice-warning">
      <div className="wrap">
        <p>
          <strong>General advice warning.</strong> {generalAdviceWarning}
        </p>
      </div>
    </div>
  )
}
