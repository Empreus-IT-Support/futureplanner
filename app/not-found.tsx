import Link from 'next/link'

import { IconArrow } from '@/components/Icons'

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1>That page isn&rsquo;t here</h1>
        <hr className="rule-gold" />
        <p>
          The page you were after has moved or never existed. If you were looking for one of our
          disclosure documents, they are all on the home page.
        </p>
        <div className="notfound-actions">
          <Link className="btn btn--primary" href="/">
            Home
            <IconArrow className="arrow" />
          </Link>
          <Link className="btn btn--outline" href="/contact">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}
