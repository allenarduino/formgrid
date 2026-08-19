import { house, hours } from '@/data/content'
import { site } from '@/lib/site'

export function RestaurantJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: house.name,
    description: site.description,
    url: site.url,
    telephone: house.phone,
    email: house.email,
    servesCuisine: house.cuisine,
    address: {
      '@type': 'PostalAddress',
      streetAddress: house.street,
      addressLocality: 'London',
      addressRegion: 'Greater London',
      postalCode: 'SE8 4SA',
      addressCountry: 'GB',
    },
    hasMenu: `${site.url}/menu`,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday'],
        opens: '12:00',
        closes: '14:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday'],
        opens: '18:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday'],
        opens: '12:00',
        closes: '15:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday'],
        opens: '18:00',
        closes: '22:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '12:00',
        closes: '16:00',
      },
    ],
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}

export function HoursList() {
  return (
    <ul className="hours-list">
      {hours.map((row) => (
        <li key={row.days}>
          <span>{row.days}</span>
          <span>{row.service}</span>
        </li>
      ))}
    </ul>
  )
}
