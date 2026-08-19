import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { HoursList, RestaurantJsonLd } from '@/components/HoursList'
import { Photo } from '@/components/Photo'
import { fireCopy, house, photos, seatingNote, story } from '@/data/content'

export const metadata: Metadata = {
  title: { absolute: 'Ulíng: Rice, vinegar, and the menu tonight' },
  description: house.tagline + ' Filipino grill in a former auto shop, Deptford, London.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <RestaurantJsonLd />
      <Hero
        image={photos.hero}
        kicker="Deptford · Filipino grill"
        title="Ulíng"
        lede={house.tagline}
        primary={{ href: '/menu', label: 'See the menu' }}
        secondary={{ href: '/reservations', label: 'Book a table' }}
      />

      <section className="band">
        <div className="wrap split">
          <div>
            <p className="kicker">The kitchen</p>
            <h2 className="display" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)' }}>
              A Manila charcoal kitchen in a Deptford auto shop.
            </h2>
            <p style={{ marginTop: '1.1rem', maxWidth: '38rem', color: 'var(--ink-soft)' }}>{story[0]}</p>
            <p style={{ marginTop: '1.25rem' }}>
              <Link href="/about">The room</Link>
            </p>
          </div>
          <figure style={{ margin: 0 }}>
            <Photo image={photos.intro} frame="portrait" />
            <figcaption className="caption">
              The pit is the whole method. Photograph: {photos.intro.credit}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="band band-soot">
        <div className="wrap split split-reverse">
          <figure style={{ margin: 0 }}>
            <Photo image={photos.fire} frame="wide" />
            <figcaption className="caption">
              Cast iron, not a show pan. Photograph: {photos.fire.credit}
            </figcaption>
          </figure>
          <div>
            <p className="kicker">The fire</p>
            <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3.1rem)' }}>
              Cook over coal. Serve with rice.
            </h2>
            {fireCopy.map((paragraph) => (
              <p key={paragraph} style={{ marginTop: '1.1rem', maxWidth: '36rem' }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap band">
        <div className="hours-grid">
          <div>
            <p className="kicker">Hours</p>
            <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              When the roller door is up.
            </h2>
            <p className="lede" style={{ marginTop: '1rem' }}>
              {seatingNote}
            </p>
          </div>
          <div>
            <HoursList />
            <p className="caption" style={{ marginTop: '1.25rem' }}>
              {house.street}
              <br />
              {house.locality}
            </p>
          </div>
        </div>
      </section>

      <section className="band band-ash">
        <div className="wrap">
          <div className="cta-strip">
            <div>
              <p className="kicker">Catalog</p>
              <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                The menu is a live catalog widget.
              </h2>
              <p className="lede" style={{ marginTop: '1rem' }}>
                When something is gone, it comes off the sheet. Cart is takeaway. Tables are booked
                separately.
              </p>
            </div>
            <Link className="btn" href="/menu">
              See the menu
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap band">
        <div className="cta-strip">
          <div>
            <p className="kicker">Tables</p>
            <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              Twelve seats. Write for one.
            </h2>
            <p className="lede" style={{ marginTop: '1rem' }}>
              Name, a sitting, how many of you. Tom answers.
            </p>
          </div>
          <Link className="btn" href="/reservations">
            Book a table
          </Link>
        </div>
      </section>
    </>
  )
}
