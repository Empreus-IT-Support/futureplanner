import Image from 'next/image'

import { ADVISERS_REGISTER, isTeamPreview, publishedTeam } from '@/data/team'
import { IconAlert } from './Icons'

/**
 * Team grid.
 *
 * Only renders people whose written consent has been returned. Adding or
 * removing someone is a data change in data/team.ts, never a code change.
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
            Each person&rsquo;s profile and photograph goes up once their written consent is back.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Development only. A production build ignores the preview flag, so this
          can never reach the live site — it is here purely so a flagged-on
          preview is not mistaken for published profiles. */}
      {preview && (
        <p className="preview-badge">
          <IconAlert size={14} />
          Preview — consent not recorded
        </p>
      )}

      <div className="team-grid">
        {members.map((m, i) => (
          <article
            className="member"
            key={m.id}
            data-reveal
            style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
          >
            <div className="member-photo">
              {m.photo ? (
                <Image src={m.photo.src} alt={m.photo.alt} width={1200} height={1500} />
              ) : (
                /* Monogram placeholder. Honest about being a placeholder, and
                   a good deal less drab than the word "Headshot" six times. */
                <span className="member-monogram" aria-hidden="true">
                  {m.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
              )}
            </div>

            <h3>{m.name}</h3>
            <p className="role">{m.role}</p>
            <p>{m.bio}</p>

            {(m.credentials || m.asicAdviserNumber || m.email) && (
              <p className="member-meta">
                {m.credentials && (
                  <>
                    {m.credentials.join(' · ')}
                    <br />
                  </>
                )}

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
          </article>
        ))}
      </div>
    </>
  )
}
