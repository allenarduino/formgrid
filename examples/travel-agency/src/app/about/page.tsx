import type { Metadata } from 'next'
import Link from 'next/link'
import { Photo } from '@/components/Photo'
import { getHouse } from '@/lib/formgrid/queries'

export const metadata: Metadata = {
  title: 'The House',
  description:
    'Marram was founded in Lisbon in 2014 by Inês Vale and Callum Reed. Small groups, printed booklets, one landscape at a time.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  const house = getHouse()

  return (
    <>
      <section className="wrap band">
        <p className="kicker">Since {house.founded}</p>
        <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', maxWidth: '16ch' }}>
          A house, not a catalogue.
        </h1>
      </section>

      <section className="wrap split split-reverse" style={{ paddingBottom: 'var(--space-6)' }}>
        <div className="essay">
          {house.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <figure style={{ margin: 0 }}>
          <Photo
            image={{
              src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80',
              alt: 'Open books and papers on a wooden table',
              credit: 'Ben White',
              width: 1200,
              height: 800,
            }}
            frame="wide"
          />
          <figcaption className="caption">The booklet still goes in the post. Photograph: Ben White</figcaption>
        </figure>
      </section>

      <section className="band band-field">
        <div className="wrap two-col">
          {house.founders.map((person) => (
            <article key={person.name}>
              <p className="kicker">{person.role}</p>
              <h2 className="display" style={{ fontSize: '2rem' }}>
                {person.name}
              </h2>
              <p style={{ marginTop: '0.85rem', color: 'var(--ink-soft)' }}>{person.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap band">
        <p className="kicker">Studio</p>
        <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', maxWidth: '20ch' }}>
          {house.studio}
        </h2>
        <p className="lede" style={{ marginTop: '1rem' }}>
          {house.desk} Visits are by arrangement.
        </p>
        <p style={{ marginTop: '1.5rem' }}>
          <Link className="btn" href="/plan">
            Write to the house
          </Link>
        </p>
      </section>
    </>
  )
}
