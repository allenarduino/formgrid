import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TourIndex } from '@/components/TourIndex'
import { getTours } from '@/lib/formgrid/queries'

export const metadata: Metadata = {
  title: 'Tours',
  description:
    'Small-group weeks in the Faroes, Extremadura, the Nakasendo, Harris, Oaxaca, and the Albanian coast.',
  alternates: { canonical: '/tours' },
}

export default function ToursPage() {
  const tours = getTours()

  return (
    <section className="wrap band">
      <p className="kicker">Index</p>
      <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', maxWidth: '14ch' }}>
        Weeks, not countries.
      </h1>
      <p className="lede" style={{ marginTop: '1rem' }}>
        Six departures. Eight to ten people. One landscape each. Prices are per person, sharing, and
        exclude flights.
      </p>
      <Suspense fallback={null}>
        <TourIndex tours={tours} />
      </Suspense>
    </section>
  )
}
