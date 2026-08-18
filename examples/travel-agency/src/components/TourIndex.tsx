'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { ExperienceType, TourWithDestination } from '@/data/types'
import { TourMosaic } from '@/components/TourMosaic'

const filters: Array<'All' | ExperienceType> = ['All', 'Walking', 'Coast', 'Winter', 'Table']

export function TourIndex({ tours }: { tours: TourWithDestination[] }) {
  const searchParams = useSearchParams()
  const type = searchParams?.get('type')
  const selected = filters.includes(type as ExperienceType) ? (type as ExperienceType) : 'All'
  const visible = selected === 'All' ? tours : tours.filter((tour) => tour.experienceType === selected)

  return (
    <>
      <nav className="filters" aria-label="Filter by kind">
        {filters.map((item) => (
          <Link
            key={item}
            href={item === 'All' ? '/tours' : `/tours?type=${item}`}
            aria-current={selected === item ? 'page' : undefined}
          >
            {item}
          </Link>
        ))}
      </nav>
      <TourMosaic tours={visible} />
    </>
  )
}
