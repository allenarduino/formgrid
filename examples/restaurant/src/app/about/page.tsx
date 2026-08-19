import type { Metadata } from 'next'
import Link from 'next/link'
import { Photo } from '@/components/Photo'
import { founders, house, photos, story } from '@/data/content'

export const metadata: Metadata = {
  title: 'The room',
  description:
    'Ulíng is a Manila charcoal kitchen in a former auto shop on Creekside, Deptford. Liza Santos on the fire. Tom Reeve on the room.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <section className="wrap band">
        <p className="kicker">Since {house.founded}</p>
        <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', maxWidth: '14ch' }}>
          The unit still smells of oil when it rains.
        </h1>
      </section>

      <section className="wrap split split-reverse" style={{ paddingBottom: 'var(--space-6)' }}>
        <div className="essay">
          {story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <figure style={{ margin: 0 }}>
          <Photo image={photos.room} frame="wide" />
          <figcaption className="caption">
            Close tables, low light. Photograph: {photos.room.credit}
          </figcaption>
        </figure>
      </section>

      <section className="band band-soot">
        <div className="wrap two-col">
          {founders.map((person) => (
            <article key={person.name}>
              <p className="kicker">{person.role}</p>
              <h2 className="display" style={{ fontSize: '2rem' }}>
                {person.name}
              </h2>
              <p style={{ marginTop: '0.85rem' }}>{person.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap band">
        <div className="split">
          <div>
            <p className="kicker">Deptford</p>
            <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', maxWidth: '16ch' }}>
              Creekside, not a destination temple.
            </h2>
            <p className="lede" style={{ marginTop: '1rem' }}>
              Come for the menu and a table, or take bags home. We are a neighbourhood fire.
            </p>
            <p style={{ marginTop: '1.5rem' }}>
              <Link className="btn" href="/reservations">
                Book a table
              </Link>
            </p>
          </div>
          <figure style={{ margin: 0 }}>
            <Photo image={photos.rice} frame="square" />
            <figcaption className="caption">Rice is not optional. Photograph: {photos.rice.credit}</figcaption>
          </figure>
        </div>
      </section>
    </>
  )
}
