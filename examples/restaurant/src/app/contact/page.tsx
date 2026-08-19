import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactForm } from '@/components/ContactForm'
import { HoursList } from '@/components/HoursList'
import { house } from '@/data/content'

export const metadata: Metadata = {
  title: 'Find us',
  description: 'Ulíng at 14 Creekside, Deptford, London. Hours, phone, and a note to the kitchen.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <section className="wrap band">
      <p className="kicker">Find us</p>
      <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', maxWidth: '14ch' }}>
        14 Creekside, Deptford.
      </h1>

      <div className="two-col" style={{ marginTop: 'var(--space-5)' }}>
        <div>
          <p className="kicker">The unit</p>
          <p>
            {house.street}
            <br />
            {house.locality}
          </p>
          <p style={{ marginTop: '1.25rem' }}>
            <a href={`tel:${house.phone.replace(/\s/g, '')}`}>{house.phone}</a>
            <br />
            <a href={`mailto:${house.email}`}>{house.email}</a>
          </p>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <HoursList />
          </div>
          <p style={{ marginTop: '1.5rem' }}>
            <Link className="btn" href="/reservations">
              Book a table
            </Link>
          </p>
        </div>
        <div>
          <p className="kicker">A note</p>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
            For a table, use the booking form. This box is for everything else: a large group, a
            question about the sheet, a supplier.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
