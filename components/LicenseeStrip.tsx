import { licenseeStrip } from '@/data/compliance'

/**
 * The licensing relationship, given the visual weight of a statement rather
 * than a disclaimer. Wording is prescribed — see data/compliance.ts.
 */
export default function LicenseeStrip() {
  return (
    <div className="licensee-strip">
      <div className="wrap">
        <p>
          {licenseeStrip.before}
          <strong>{licenseeStrip.emphasis}</strong>
        </p>
      </div>
    </div>
  )
}
