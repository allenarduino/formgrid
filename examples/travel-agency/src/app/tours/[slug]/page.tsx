import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FactStrip, formatPrice } from '@/components/FactStrip'
import { ImageGallery } from '@/components/ImageGallery'
import { Itinerary } from '@/components/Itinerary'
import { Photo } from '@/components/Photo'
import { getRelatedTours, getTour, getTours } from '@/lib/formgrid/queries'
import { site } from '@/lib/site'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return getTours().map((tour) => ({ slug: tour.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const tour = getTour(params.slug)
  if (!tour) return { title: 'Tour' }
  return {
    title: `${tour.title}, ${tour.durationDays} days`,
    description: tour.standfirst,
    alternates: { canonical: `/tours/${tour.slug}` },
    openGraph: {
      title: `${tour.title} · Marram`,
      description: tour.standfirst,
      images: [{ url: tour.hero.src, alt: tour.hero.alt }],
    },
  }
}

export default function TourPage({ params }: Props) {
  const tour = getTour(params.slug)
  if (!tour) notFound()
  const related = getRelatedTours(tour.slug)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.standfirst,
    touristType: tour.experienceType,
    offers: {
      '@type': 'Offer',
      priceCurrency: tour.currency,
      price: tour.startingPrice,
      url: `${site.url}/tours/${tour.slug}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <figure className="detail-hero">
        <Photo image={tour.hero} frame="detail" priority zoom={false} />
        <figcaption className="wrap caption" style={{ paddingTop: '0.75rem' }}>
          {tour.destination.name}, {tour.destination.region}. Photograph: {tour.hero.credit}
        </figcaption>
      </figure>

      <article className="wrap band">
        <p className="kicker">
          <Link href={`/destinations/${tour.destination.slug}`}>{tour.destination.country}</Link>
          {' · '}
          {tour.experienceType}
        </p>
        <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', maxWidth: '16ch' }}>
          {tour.title}
        </h1>
        <p className="lede" style={{ margin: '1rem 0 1.5rem' }}>
          {tour.standfirst}
        </p>
        <FactStrip tour={tour} />
        <p className="essay" style={{ marginTop: '2rem' }}>
          {tour.overview}
        </p>
        <p style={{ marginTop: '1.5rem' }}>
          <Link className="btn" href={`/plan?tour=${tour.slug}`}>
            Request a place
          </Link>
        </p>
      </article>

      <section className="wrap band">
        <p className="kicker">The days</p>
        <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
          Itinerary
        </h2>
        <Itinerary days={tour.itinerary} />
      </section>

      <section className="wrap band">
        <div className="two-col">
          <div>
            <p className="kicker">Included</p>
            <ul>
              {tour.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kicker">Not included</p>
            <ul>
              {tour.notIncluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="caption" style={{ marginTop: '1.25rem' }}>
          {formatPrice(tour.startingPrice)} per person. Fitness: {tour.fitness}
        </p>
      </section>

      <section className="wrap band">
        <p className="kicker">Along the way</p>
        <ImageGallery images={tour.gallery} />
      </section>

      <section className="wrap band">
        <p className="kicker">Before you pack</p>
        <ul className="steps">
          {tour.practical.map((item, index) => (
            <li key={item}>
              <span className="num">{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 ? (
        <section className="wrap band">
          <p className="kicker">Also this year</p>
          <div className="related">
            {related.map((item) => (
              <Link key={item.id} href={`/tours/${item.slug}`}>
                <Photo image={item.hero} frame="related" />
                <p className="kicker">
                  {item.destination.name} · {item.durationDays} days
                </p>
                <h2>{item.title}</h2>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="band band-field">
        <div className="wrap">
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            If this week is the one, write to the house.
          </h2>
          <p style={{ marginTop: '1.25rem' }}>
            <Link className="btn" href={`/plan?tour=${tour.slug}`}>
              Request a place
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
