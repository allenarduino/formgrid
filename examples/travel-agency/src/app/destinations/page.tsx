import type { Metadata } from 'next'
import { DestinationMosaic } from '@/components/DestinationMosaic'
import { getDestinations } from '@/lib/formgrid/queries'

export const metadata: Metadata = {
  title: 'Destinations',
  description:
    'Six landscapes Marram returns to: the Faroes, Extremadura, the Nakasendo, Harris, Oaxaca, and the Albanian coast.',
  alternates: { canonical: '/destinations' },
}

export default function DestinationsPage() {
  const destinations = getDestinations()

  return (
    <section className="wrap band">
      <p className="kicker">Landscapes</p>
      <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', maxWidth: '14ch' }}>
        Places we stay with.
      </h1>
      <p className="lede" style={{ marginTop: '1rem', marginBottom: '2.5rem' }}>
        Not a list of countries. The regions we know well enough to plan a week without padding.
      </p>
      <DestinationMosaic destinations={destinations} />
    </section>
  )
}
