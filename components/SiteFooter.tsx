import Link from 'next/link'

import { footerDisclosure } from '@/data/compliance'
import { docHref, documents, footerOffices, site } from '@/data/site'

/**
 * Footer, including the statutory disclosure block.
 *
 * The disclosure is body-size text at normal contrast on every page. Do not
 * shrink it, put it behind an accordion, or lighten it against the navy. See
 * data/compliance.ts.
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-offices">
            <h2>{site.legalName}</h2>
            <address>
              {footerOffices.map((o) => (
                <p key={o.label}>
                  <strong>{o.label}</strong>
                  {o.address}
                </p>
              ))}
              <p>
                <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
                <br />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </address>
          </div>

          <div className="footer-links">
            <h2>Documents</h2>
            {documents.map((d) => (
              <a key={d.file} href={docHref(d.file)} target="_blank" rel="noopener">
                {d.footerTitle}
              </a>
            ))}
            <Link href="/complaints">Complaints</Link>
          </div>

          <div className="footer-links">
            <h2>Site</h2>
            <Link href="/#about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/#team">Our team</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div className="footer-disclosure">
          <span className="entity">{footerDisclosure.entity}</span>
          {footerDisclosure.body}
          <p className="footer-copyright">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
