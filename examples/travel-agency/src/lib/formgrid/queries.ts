import { destinations, essay, house, testimonials, tours } from '../../data/mock-data'
import type { Destination, Testimonial, TourWithDestination } from '../../data/types'

function withDestination(tour: (typeof tours)[number]): TourWithDestination {
  const destination = destinations.find((item) => item.slug === tour.destinationSlug)
  if (!destination) {
    throw new Error(`Missing destination ${tour.destinationSlug}`)
  }
  return { ...tour, destination }
}

export function getDestinations(): Destination[] {
  return destinations
}

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((item) => item.slug === slug)
}

export function getTours(): TourWithDestination[] {
  return tours.map(withDestination)
}

export function getTour(slug: string): TourWithDestination | undefined {
  const tour = tours.find((item) => item.slug === slug)
  return tour ? withDestination(tour) : undefined
}

export function getFeaturedTour(): TourWithDestination {
  const featured = tours.find((item) => item.featured) ?? tours[0]!
  return withDestination(featured)
}

export function getHomeTours(): TourWithDestination[] {
  return tours
    .filter((item) => !item.featured && item.slug !== 'faroe-on-foot')
    .slice(0, 4)
    .map(withDestination)
}

export function getToursForDestination(slug: string): TourWithDestination[] {
  return tours.filter((item) => item.destinationSlug === slug).map(withDestination)
}

export function getRelatedTours(slug: string): TourWithDestination[] {
  const current = getTour(slug)
  if (!current) return []
  return current.relatedSlugs
    .map((related) => getTour(related))
    .filter((item): item is TourWithDestination => Boolean(item))
}

export function getTestimonials(): Testimonial[] {
  return testimonials
}

export function getHouse() {
  return house
}

export function getEssay() {
  return essay
}
