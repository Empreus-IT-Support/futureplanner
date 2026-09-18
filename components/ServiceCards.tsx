import type { Service } from '@/data/services'
import { IconDocument, serviceIcons } from './Icons'

export default function ServiceCards({
  items,
  variant,
}: {
  items: Service[]
  /** 'summary' is the short home page copy, 'detail' the services page copy. */
  variant: 'summary' | 'detail'
}) {
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
            <h3>{s.title}</h3>
            <p>{variant === 'summary' ? s.summary : s.detail}</p>
          </article>
        )
      })}
    </div>
  )
}
