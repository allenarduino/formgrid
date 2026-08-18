import type { TourWithDestination } from '@/data/types'

const currency = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export function formatPrice(value: number) {
  return `From ${currency.format(value)}`
}

export function FactStrip({ tour }: { tour: TourWithDestination }) {
  return (
    <p className="fact-strip">
      <span>{tour.durationDays} days</span>
      <span>Group of {tour.groupSize}</span>
      <span>{formatPrice(tour.startingPrice)}</span>
      <span>{tour.season}</span>
      <span>{tour.experienceType}</span>
    </p>
  )
}
