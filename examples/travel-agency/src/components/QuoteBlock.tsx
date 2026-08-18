import type { Testimonial } from '@/data/types'

export function QuoteBlock({ quotes }: { quotes: Testimonial[] }) {
  return (
    <div className="quotes">
      {quotes.map((item) => (
        <blockquote key={item.id} cite={`/tours/${item.tourSlug}`}>
          <p>{item.quote}</p>
          <footer>
            {item.name}, {item.place}
          </footer>
        </blockquote>
      ))}
    </div>
  )
}
