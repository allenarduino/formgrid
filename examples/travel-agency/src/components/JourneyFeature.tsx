import Link from 'next/link'
import type { TourWithDestination } from '@/data/types'
import { FactStrip, formatPrice } from './FactStrip'
import { Photo } from './Photo'

export function JourneyFeature({ tour }: { tour: TourWithDestination }) {
  return (
    <article className="wrap band">
      <p className="kicker">This November</p>
      <div className="split split-wide">
        <figure style={{ margin: 0 }}>
          <Photo image={tour.hero} frame="wide" />
          <figcaption className="caption">
            {tour.destination.name}. Photograph: {tour.hero.credit}
          </figcaption>
        </figure>
        <div>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
            {tour.title}
          </h2>
          <p style={{ margin: '1rem 0 1.25rem', color: 'var(--ink-soft)' }}>{tour.standfirst}</p>
          <FactStrip tour={tour} />
          <p style={{ marginTop: '1.25rem' }}>
            <Link className="btn" href={`/tours/${tour.slug}`}>
              Read the week
            </Link>
          </p>
          <p className="caption">{formatPrice(tour.startingPrice)}, excluding flights</p>
        </div>
      </div>
    </article>
  )
}
