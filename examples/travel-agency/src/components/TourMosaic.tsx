import Link from 'next/link'
import type { TourWithDestination } from '@/data/types'
import { formatPrice } from './FactStrip'
import { Photo } from './Photo'

const frames = ['mosaic-wide', 'mosaic-tall', 'mosaic-tall', 'mosaic-wide', 'mosaic-mid', 'mosaic-mid'] as const

export function TourMosaic({ tours }: { tours: TourWithDestination[] }) {
  return (
    <div className="mosaic">
      {tours.map((tour, index) => (
        <Link key={tour.id} className="mosaic-item" href={`/tours/${tour.slug}`}>
          <Photo image={tour.hero} frame={frames[index] ?? 'mosaic-mid'} delay={index * 70} />
          <p className="kicker">
            {tour.destination.name} · {tour.durationDays} days
          </p>
          <h2>{tour.title}</h2>
          <p className="caption">
            {formatPrice(tour.startingPrice)} · {tour.experienceType}
          </p>
        </Link>
      ))}
    </div>
  )
}
