import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BookingForm } from '@/components/BookingForm'
import { getDestinations, getTours } from '@/lib/formgrid/queries'

export const metadata: Metadata = {
  title: 'Plan a journey',
  description: 'Write to Marram with a month and a landscape. We reply within two working days.',
  alternates: { canonical: '/plan' },
  robots: { index: true, follow: true },
}

export default function PlanPage() {
  return (
    <section className="wrap band">
      <div className="split">
        <div>
          <p className="kicker">A note to the house</p>
          <h1 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}>
            Tell us the month.
          </h1>
          <p className="lede" style={{ margin: '1rem 0 2rem' }}>
            We read every request. Someone writes back within two working days. If a week is full, we
            say so plainly.
          </p>
          <Suspense fallback={null}>
            <BookingForm destinations={getDestinations()} tours={getTours()} />
          </Suspense>
        </div>
        <aside>
          <p className="kicker">What happens next</p>
          <p style={{ color: 'var(--ink-soft)' }}>
            Your note is posted to a Formgrid-shaped endpoint from the browser. In production it
            becomes a lead: email to the house, a record in the dashboard, follow-up from Inês or
            Callum.
          </p>
          <p className="caption" style={{ marginTop: '1.5rem' }}>
            Set <code>NEXT_PUBLIC_FORMGRID_ENDPOINT</code> to a live Formgrid form URL to send for
            real.
          </p>
        </aside>
      </div>
    </section>
  )
}
