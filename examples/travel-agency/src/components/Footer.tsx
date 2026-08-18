import Link from 'next/link'
import { getHouse } from '@/lib/formgrid/queries'

export function Footer() {
  const house = getHouse()

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Link href="/" className="wordmark">
            Marram
          </Link>
          <p className="lede" style={{ marginTop: '1rem', fontSize: '1rem' }}>
            Small-group weeks in one landscape. Walking, rail, and the table.
          </p>
        </div>
        <div>
          <p className="kicker">Studio</p>
          <p>
            {house.studio}
            <br />
            {house.hours}
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="kicker">Index</p>
          <p>
            <Link href="/tours">Tours</Link>
            <br />
            <Link href="/destinations">Destinations</Link>
            <br />
            <Link href="/about">The House</Link>
            <br />
            <Link href="/plan">Plan a journey</Link>
            <br />
            <Link href="/contact">Contact</Link>
          </p>
        </nav>
      </div>
      <div className="wrap colophon">
        An example website for Formgrid. The house is fictional. Inquiries can later post to a Formgrid
        endpoint.
      </div>
    </footer>
  )
}
