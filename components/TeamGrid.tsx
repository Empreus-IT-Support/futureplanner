import Image from 'next/image'

import { ADVISERS_REGISTER, isTeamPreview, publishedTeam } from '@/data/team'
import { IconAlert } from './Icons'

/**
 * The team section.
 *
 * Laid out as stacked profiles rather than a card grid: the supplied copy runs
 * to three or five paragraphs a person, which a three-across grid cannot hold
 * without either truncating it or producing very tall, thin columns.
 *
 * Where a person has no photograph the tile shows their initials. The client
 * asked specifically for no silhouette or generic avatar, and the same tile
 * becomes the photo frame when the batch arrives — nothing else changes.
 *
 * Only the advisers show qualifications, an adviser number and a register
 * link. That asymmetry is deliberate and compliance-bearing: it is how a
 * visitor tells at a glance who provides the advice. See data/team.ts.
 */
export default function TeamGrid() {
  const members = publishedTeam()
  const preview = isTeamPreview()

  if (members.length === 0) {
    return (
      <div className="team-pending">
        <IconAlert size={22} />
        <div>
          <h3>Profiles are published as consent is returned</h3>
          <p>
            Each person&rsquo;s profile goes up once their written consent is back.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {preview && (
        <p className="preview-badge">
          <IconAlert size={14} />
          Preview — consent not recorded
        </p>
      )}

      <div className="team-list">
        {members.map((m, i) => (
          <article
            className="member"
            key={m.id}
            id={m.id}
            data-reveal
            style={{ '--reveal-delay': `${Math.min(i, 2) * 70}ms` } as React.CSSProperties}
          >
            <div className="member-aside">
              <div className={`member-photo${m.photo ? '' : ' member-photo--initials'}`}>
                {m.photo ? (
                  <Image src={m.photo.src} alt={m.photo.alt} width={1200} height={1500} />
                ) : (
                  <span aria-hidden="true">
                    {m.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </span>
                )}
              </div>
            </div>

            <div className="member-body">
              <h3>{m.name}</h3>
              <p className="role">
                {m.role}
                {m.location ? ` · ${m.location}` : ''}
              </p>

              {m.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}

              {m.qualifications && (
                <div className="member-quals">
                  <h4>Qualifications</h4>
                  <ul>
                    {m.qualifications.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(m.asicAdviserNumber || m.email) && (
                <p className="member-meta">
                  {m.asicAdviserNumber && (
                    <>
                      ASIC Adviser No. {m.asicAdviserNumber} ·{' '}
                      <a href={ADVISERS_REGISTER} target="_blank" rel="noopener">
                        Financial Advisers Register
                      </a>
                      <br />
                    </>
                  )}
                  {m.email && <a href={`mailto:${m.email}`}>{m.email}</a>}
                  {m.email && m.phone && ' · '}
                  {m.phone && <a href={`tel:${m.phoneHref}`}>{m.phone}</a>}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
