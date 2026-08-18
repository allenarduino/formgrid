export type ExperienceType = 'Walking' | 'Coast' | 'Winter' | 'Table'

export type ImageAsset = {
  src: string
  alt: string
  credit: string
  width: number
  height: number
}

export type Destination = {
  id: string
  slug: string
  name: string
  region: string
  country: string
  standfirst: string
  overview: string
  whenToGo: string
  hero: ImageAsset
  gallery: ImageAsset[]
}

export type ItineraryDay = {
  day: number
  title: string
  body: string
}

export type Tour = {
  id: string
  slug: string
  destinationSlug: string
  title: string
  standfirst: string
  overview: string
  durationDays: number
  experienceType: ExperienceType
  startingPrice: number
  currency: 'EUR'
  groupSize: number
  season: string
  fitness: string
  hero: ImageAsset
  gallery: ImageAsset[]
  itinerary: ItineraryDay[]
  included: string[]
  notIncluded: string[]
  practical: string[]
  relatedSlugs: string[]
  featured?: boolean
}

export type TourWithDestination = Tour & {
  destination: Destination
}

export type Testimonial = {
  id: string
  quote: string
  name: string
  place: string
  tourSlug: string
}

export type Inquiry = {
  name: string
  email: string
  phone: string
  destinationSlug: string
  tourSlug: string
  preferredMonth: string
  travelers: number
  budget: string
  notes: string
}

export type InquiryResult = {
  ok: true
  id: string
}
