import type { Service } from '@/data/services'
import { IconDocument, serviceIcons } from './Icons'

export default function ServiceCards({
  items,
  variant,
  headingLevel = 3,
}: {
  items: Service[]
  /** 'summary' is the short home page copy, 'detail' the services page copy. */
  variant: 'summary' | 'detail'
  /**
   * On the home page these cards sit beneath a section h2, so h3 is correct.
   * On /services they are the top-level content under the page h1, where an h3
   * skips a level. Heading order is not decoration — it is how someone using a
   * screen reader builds a picture of the page.
   */
  headingLevel?: 2 | 3
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <div className="card-grid">
      {items.map((s, i) => {
        const Icon = serviceIcons[s.id] ?? IconDocument
        return (
          <article
            className="card"
            key={s.id}
            data-reveal
            style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
          >
            <span className="card-icon" aria-hidden="true">
              <Icon />
            </span>
            <Heading>{s.title}</Heading>
            <p>{variant === 'summary' ? s.summary : s.detail}</p>
          </article>
        )
      })}
    </div>
  )
}
