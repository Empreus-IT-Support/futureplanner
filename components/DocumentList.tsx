import { docHref, documents } from '@/data/site'
import { IconDocument } from './Icons'

/**
 * Disclosure documents. Free to read, no sign-up, each opens in a new tab.
 *
 * The Adviser Profile is not optional — FSG v6.2 states that page 11 is
 * missing from downloaded copies, so publishing the annexure separately is
 * what makes the FSG complete.
 */
export default function DocumentList() {
  return (
    <div className="doc-list">
      {documents.map((d, i) => (
        <a
          className="doc"
          key={d.file}
          href={docHref(d.file)}
          target="_blank"
          rel="noopener"
          data-reveal
          style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
        >
          <span className="doc-head">
            <strong>{d.title}</strong>
            <IconDocument className="doc-icon" />
          </span>
          <span>{d.blurb}</span>
          <span className="meta">{d.meta}</span>
        </a>
      ))}
    </div>
  )
}
