import type { Metadata } from 'next'

import { licensee } from '@/data/site'

export const metadata: Metadata = {
  title: 'Complaints',
  description:
    'How to make a complaint. Advice is provided under the licence of AVALONFS Pty Ltd, so ' +
    'complaints are handled by AVALONFS, with AFCA available as the external scheme.',
  alternates: { canonical: '/complaints' },
}

export default function ComplaintsPage() {
  return (
    <>
      <section className="section">
        <div className="wrap">
          <div className="section-head section-head--split" data-reveal>
            <p className="eyebrow">Complaints</p>
            <h1>If something isn&rsquo;t right</h1>
            <hr className="rule-gold" />
            <p className="lede">
              Advice is provided under the licence of AVALONFS Pty Ltd, so complaints are handled
              by AVALONFS. Here&rsquo;s what happens and how long it takes.
            </p>
          </div>

          <ol className="steps" data-reveal>
            <li>
              <h3>Contact the Compliance Officer at AVALONFS</h3>
              <p>
                Get in touch using the details below. Your complaint will be acknowledged within
                24 hours, or one business day.
              </p>
            </li>
            <li>
              <h3>You&rsquo;ll receive a written response within 30 days</h3>
              <p>
                A response letter will be prepared and issued to you setting out the complaint,
                your rights, any proposed solutions, and the further avenues available to you if
                you don&rsquo;t accept the resolution proposed.
              </p>
            </li>
            <li>
              <h3>If you&rsquo;re not satisfied, you can go to AFCA</h3>
              <p>
                The Australian Financial Complaints Authority provides external complaint
                resolution at no cost to consumers. AVALONFS is a member, and you can lodge a
                complaint with AFCA directly at{' '}
                <a href="https://www.afca.org.au" target="_blank" rel="noopener">
                  afca.org.au
                </a>
                .
              </p>
            </li>
          </ol>

          <div className="contact-block" data-reveal>
            <h3>AVALONFS Pty Ltd</h3>
            <address>
              <a href={`tel:${licensee.compliancePhoneHref}`}>{licensee.compliancePhone}</a>
              <br />
              <a href={`mailto:${licensee.complianceEmail}`}>{licensee.complianceEmail}</a>
              <br />
              {licensee.address}
            </address>
          </div>

          <div className="section-head section-head--split section-head--spaced" data-reveal>
            <h2>Other options</h2>
            <hr className="rule-gold" />
            <p>
              The Australian Securities and Investments Commission (ASIC) has a free-call Infoline
              on <a href="tel:1300300630">1300 300 630</a>, which you can use to find out about any
              further rights you may have.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <div className="section-head section-head--split section-head--flush" data-reveal>
            <h2>Compensation arrangements</h2>
            <hr className="rule-gold" />
            <p>
              AVALONFS and its advisers hold professional indemnity insurance covering both
              AVALONFS and its advisers, including advisers who are no longer authorised by
              AVALONFS but were at the time the advice was given. These arrangements meet the
              requirements of the Corporations Act.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
