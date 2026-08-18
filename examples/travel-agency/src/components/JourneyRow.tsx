import Link from 'next/link'
import type { TourWithDestination } from '@/data/types'
import { formatPrice } from './FactStrip'
import { Photo } from './Photo'

export function JourneyRow({ tour }: { tour: TourWithDestination }) {
  return (
    <article className="journey-row">
      <Photo image={tour.hero} frame="wide" />
      <div className="journey-row-copy">
        <p className="kicker">
          {tour.destination.country} · {tour.durationDays} days
        </p>
        <h2>
          <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
        </h2>
        <p style={{ margin: '0.85rem 0', color: 'var(--ink-soft)' }}>{tour.standfirst}</p>
        <p className="caption">
          {formatPrice(tour.startingPrice)} · {tour.experienceType}
        </p>
      </div>
    </article>
  )
}
