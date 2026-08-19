import Link from 'next/link'
import { house, hours } from '@/data/content'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Link href="/" className="wordmark">
            Ulíng
          </Link>
          <p className="lede" style={{ marginTop: '1rem', fontSize: '1.05rem' }}>
            {house.tagline}
          </p>
        </div>
        <div>
          <p className="kicker">The unit</p>
          <p>
            {house.street}
            <br />
            {house.locality}
            <br />
            <a href={`tel:${house.phone.replace(/\s/g, '')}`}>{house.phone}</a>
          </p>
          <p style={{ marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
            {hours[0]?.days}: {hours[0]?.service}
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="kicker">Index</p>
          <p>
            <Link href="/menu">Menu</Link>
            <br />
            <Link href="/about">The room</Link>
            <br />
            <Link href="/reservations">Book a table</Link>
            <br />
            <Link href="/contact">Find us</Link>
          </p>
        </nav>
      </div>
      <div className="wrap colophon">
        An example website for Formgrid and Sheetrocket. The kitchen is fictional. The menu is a live
        catalog widget. Tables can later post to a Formgrid endpoint.
      </div>
    </footer>
  )
}
