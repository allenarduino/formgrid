import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { JourneyFeature } from '@/components/JourneyFeature'
import { JourneyRow } from '@/components/JourneyRow'
import { Photo } from '@/components/Photo'
import { QuoteBlock } from '@/components/QuoteBlock'
import { getEssay, getFeaturedTour, getHomeTours, getTour, getTestimonials } from '@/lib/formgrid/queries'

const steps = [
  { num: '01', title: 'You write', body: 'A month, a landscape if you have one, how many of you. That is enough.' },
  { num: '02', title: 'We answer', body: 'Within two working days. If the week is wrong, we say so.' },
  { num: '03', title: 'A booklet arrives', body: 'Maps, ferry times, a reading list, posted two weeks before you leave.' },
  { num: '04', title: 'The week holds', body: 'Eight to twelve people. One host. Weather included.' },
]

export const metadata: Metadata = {
  title: { absolute: 'Marram: Small-group weeks in one landscape' },
  description:
    'Independent journeys of seven to fourteen days. Walking, rail, and the table. Lisbon studio.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  const featured = getFeaturedTour()
  const faroe = getTour('faroe-on-foot')
  const rows = getHomeTours()
  const quotes = getTestimonials()
  const essay = getEssay()
  const heroImage = faroe?.hero ?? featured.hero

  return (
    <>
      <Hero
        image={heroImage}
        kicker="Marram · Lisbon"
        title="Eight days in one place, until it starts to make sense."
        lede="Small-group weeks on foot, by rail, and at the table. One landscape. Enough time."
        primary={{ href: '/tours', label: 'See the tours' }}
        secondary={{ href: '/plan', label: 'Request a place' }}
      />
      <JourneyFeature tour={featured} />

      <section className="band band-field">
        <div className="wrap split split-reverse">
          <div>
            <p className="kicker">The house</p>
            <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3.1rem)' }}>
              Named for the grass that holds a dune together.
            </h2>
            <p style={{ marginTop: '1.1rem', maxWidth: '38rem', color: 'var(--ink-soft)' }}>
              Inês Vale and Callum Reed started Marram in 2014 after too many itineraries that treated a
              country as a list. We still post a printed field booklet. We still keep the groups small
              enough that dinner is one table.
            </p>
            <p style={{ marginTop: '1.25rem' }}>
              <Link href="/about">Read the house</Link>
            </p>
          </div>
          <figure style={{ margin: 0 }}>
            <Photo
              image={{
                src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
                alt: 'A quiet library table with books and paper',
                credit: 'Iñaki del Olmo',
                width: 1200,
                height: 1500,
              }}
              frame="portrait"
            />
            <figcaption className="caption">Planning still happens on paper. Photograph: Iñaki del Olmo</figcaption>
          </figure>
        </div>
      </section>

      <section className="wrap band">
        <p className="kicker">This year’s weeks</p>
        <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.5rem' }}>
          Four other landscapes
        </h2>
        {rows.map((tour) => (
          <JourneyRow key={tour.id} tour={tour} />
        ))}
      </section>

      <section className="band band-field">
        <article className="wrap essay">
          <p className="kicker">{essay.kicker}</p>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {essay.title}
          </h2>
          {essay.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
      </section>

      <section className="wrap band">
        <p className="kicker">Method</p>
        <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '1.5rem' }}>
          How a week is made
        </h2>
        <ol className="steps">
          {steps.map((step) => (
            <li key={step.num}>
              <span className="num">{step.num}</span>
              <div>
                <h3>{step.title}</h3>
                <p style={{ color: 'var(--ink-soft)', marginTop: '0.35rem' }}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap band">
        <p className="kicker">Two voices</p>
        <QuoteBlock quotes={quotes} />
      </section>

      <section className="band band-field">
        <div className="wrap">
          <p className="kicker">A place</p>
          <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', maxWidth: '18ch' }}>
            Tell us the month. We’ll suggest the landscape.
          </h2>
          <p style={{ margin: '1.25rem 0' }}>
            <Link className="btn" href="/plan">
              Request a place
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
