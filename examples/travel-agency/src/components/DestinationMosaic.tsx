import Link from 'next/link'
import type { Destination } from '@/data/types'
import { Photo } from './Photo'

const frames = ['mosaic-wide', 'mosaic-tall', 'mosaic-tall', 'mosaic-wide', 'mosaic-mid', 'mosaic-mid'] as const

export function DestinationMosaic({ destinations }: { destinations: Destination[] }) {
  return (
    <div className="mosaic">
      {destinations.map((destination, index) => (
        <Link key={destination.id} className="mosaic-item" href={`/destinations/${destination.slug}`}>
          <Photo image={destination.hero} frame={frames[index] ?? 'mosaic-mid'} />
          <p className="kicker">
            {destination.country} · {destination.region}
          </p>
          <h2>{destination.name}</h2>
          <p className="caption">{destination.standfirst}</p>
        </Link>
      ))}
    </div>
  )
}
