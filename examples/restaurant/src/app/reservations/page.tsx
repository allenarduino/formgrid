import type { Metadata } from 'next'
import { HoursList } from '@/components/HoursList'
import { ReservationForm } from '@/components/ReservationForm'
import { house, seatingNote } from '@/data/content'

export const metadata: Metadata = {
  title: 'Book a table',
  description: 'Request a table at Ulíng in Deptford. Name, a sitting, how many of you. Tom answers.',
  alternates: { canonical: '/reservations' },
}

export default function ReservationsPage() {
  return (
    <section className="wrap band">
      <div className="split">
        <div>
          <p className="kicker">Tables</p>
          <h1 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}>
            Write for a sitting.
          </h1>
          <p className="lede" style={{ margin: '1rem 0 2rem' }}>
            This is a table, not an order. Food goes through the catalog if you are taking bags home.
          </p>
          <ReservationForm />
        </div>
        <aside>
          <p className="kicker">The room</p>
          <p style={{ color: 'var(--ink-soft)' }}>{seatingNote}</p>
          <p className="caption" style={{ marginTop: '1.5rem' }}>
            {house.street}
            <br />
            {house.locality}
            <br />
            <a href={`tel:${house.phone.replace(/\s/g, '')}`}>{house.phone}</a>
          </p>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <HoursList />
          </div>
          <p className="caption" style={{ marginTop: '1.5rem' }}>
            Set <code>NEXT_PUBLIC_FORMGRID_ENDPOINT</code> to a live Formgrid form URL to send for real.
          </p>
        </aside>
      </div>
    </section>
  )
}
