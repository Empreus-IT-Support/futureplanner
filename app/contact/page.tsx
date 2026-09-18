import type { Metadata } from 'next'
import Link from 'next/link'

import EnquiryForm from '@/components/EnquiryForm'
import { IconArrow, IconClock } from '@/components/Icons'
import { docHref, documents, offices, site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Future Planner on the Gold Coast, in Canberra or Mount Isa, or arrange a video ' +
    'meeting from anywhere in Australia.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <section className="section">
        <div className="wrap">
          <div className="section-head section-head--split" data-reveal>
            <p className="eyebrow">Where we are</p>
            <h1>Contact us</h1>
            <hr className="rule-gold" />
            <p className="lede">
              Three offices, and video meetings for clients anywhere else in Australia.
            </p>
          </div>

          {/* Each office has a stable anchor. Google Business Profile listings
              point at /contact#mount-isa and the like, never the homepage.
              :target styling highlights whichever card was linked to. */}
          <div className="office-grid">
            {offices.map((o, i) => (
              <article
                className="office"
                id={o.id}
                key={o.id}
                data-reveal
                style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
              >
                <span className="tag">{o.tag}</span>
                <h2>{o.name}</h2>
                <address>
                  {o.lines.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                  <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
                </address>

                <span className="office-hours">
                  <IconClock size={15} />
                  {o.hours}
                </span>

                {o.adviser && (
                  <span className="note">
                    Adviser: <Link href="/#team">{o.adviser.name}</Link>
                  </span>
                )}
                {o.note && <span className="note">{o.note}</span>}
              </article>
            ))}
          </div>

          <div className="contact-block" data-reveal>
            <h3>Not near an office?</h3>
            <p>
              We work with clients across Australia by video meeting and phone, with documents
              signed electronically. Distance doesn&rsquo;t change the advice or how we work — send
              an enquiry and we&rsquo;ll arrange a time that suits your time zone.
            </p>
            <p style={{ marginTop: 18 }}>
              <a className="link-arrow" href="#enquiry">
                Send an enquiry
                <IconArrow size={15} />
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tint" id="enquiry">
        <div className="wrap">
          <div className="section-head section-head--split" data-reveal>
            <p className="eyebrow">Send an enquiry</p>
            <h2>Get in touch</h2>
            <hr className="rule-gold" />
            <p>
              Tell us briefly what you&rsquo;re after and we&rsquo;ll come back to you. Please
              don&rsquo;t include account numbers, tax file numbers or health details in this form.
            </p>
          </div>

          <div className="enquiry-grid">
            <div data-reveal>
              <EnquiryForm />
            </div>

            {/* Direct contact details, so the section uses the width and gives
                people a route that is not the form. Everything here already
                appears elsewhere on the site — no new claim is made. */}
            <aside className="enquiry-aside" data-reveal="right">
              <h3>Rather not use a form?</h3>
              <hr className="rule-gold" />
              <dl>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Office hours</dt>
                  <dd>Monday to Friday, 8:30am &ndash; 5:00pm</dd>
                </div>
                <div>
                  <dt>Before you engage us</dt>
                  <dd>
                    Our{" "}
                    <a href={docHref(documents[0].file)} target="_blank" rel="noopener">
                      Financial Services Guide
                    </a>{" "}
                    sets out what AVALONFS is licensed to provide, how advisers are paid and how
                    complaints are handled.
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
