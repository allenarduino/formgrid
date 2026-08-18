import type { Metadata } from 'next'
import Link from 'next/link'
import { getHouse } from '@/lib/formgrid/queries'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Marram studio in Alcântara, Lisbon. Planning desk in Edinburgh. Write via the journey form.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  const house = getHouse()

  return (
    <section className="wrap band">
      <p className="kicker">Studio</p>
      <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', maxWidth: '16ch' }}>
        Alcântara, Lisbon.
      </h1>
      <div className="two-col" style={{ marginTop: 'var(--space-5)' }}>
        <div>
          <p className="kicker">Address</p>
          <p>
            {house.studio}
            <br />
            {house.desk}
          </p>
          <p style={{ marginTop: '1.25rem' }}>
            {house.hours}
            <br />
            <a href={`mailto:${house.email}`}>{house.email}</a>
            <br />
            <a href={`tel:${house.phone.replace(/\s/g, '')}`}>{house.phone}</a>
          </p>
        </div>
        <div>
          <p className="kicker">Planning</p>
          <p style={{ color: 'var(--ink-soft)' }}>
            The studio is not a drop-in shop. If you want a week, use the form.
          </p>
          <p style={{ marginTop: '1.25rem' }}>
            <Link className="btn" href="/plan">
              Plan a journey
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
