import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Photo } from '@/components/Photo'
import { formatPrice } from '@/components/FactStrip'
import { getDestination, getDestinations, getToursForDestination } from '@/lib/formgrid/queries'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return getDestinations().map((destination) => ({ slug: destination.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const destination = getDestination(params.slug)
  if (!destination) return { title: 'Destination' }
  return {
    title: `${destination.name}, ${destination.country}`,
    description: destination.standfirst,
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: {
      title: `${destination.name} · Marram`,
      description: destination.standfirst,
      images: [{ url: destination.hero.src, alt: destination.hero.alt }],
    },
  }
}

export default function DestinationPage({ params }: Props) {
  const destination = getDestination(params.slug)
  if (!destination) notFound()
  const tours = getToursForDestination(destination.slug)

  return (
    <>
      <figure className="detail-hero">
        <Photo image={destination.hero} frame="detail" priority zoom={false} />
        <figcaption className="wrap caption" style={{ paddingTop: '0.75rem' }}>
          {destination.region}. Photograph: {destination.hero.credit}
        </figcaption>
      </figure>

      <article className="wrap band">
        <p className="kicker">
          {destination.country} · {destination.region}
        </p>
        <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', maxWidth: '14ch' }}>
          {destination.name}
        </h1>
        <p className="lede" style={{ margin: '1rem 0 1.5rem' }}>
          {destination.standfirst}
        </p>
        <div className="essay">
          <p>{destination.overview}</p>
          <p>{destination.whenToGo}</p>
        </div>
      </article>

      <section className="wrap band">
        <p className="kicker">Weeks here</p>
        <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1.5rem' }}>
          How we go
        </h2>
        {tours.map((tour) => (
          <article key={tour.id} className="journey-row">
            <Photo image={tour.hero} frame="wide" />
            <div className="journey-row-copy">
              <p className="kicker">
                {tour.durationDays} days · {tour.season}
              </p>
              <h2>
                <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
              </h2>
              <p style={{ margin: '0.85rem 0', color: 'var(--ink-soft)' }}>{tour.standfirst}</p>
              <p className="caption">{formatPrice(tour.startingPrice)}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
