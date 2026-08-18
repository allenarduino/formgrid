import type { MetadataRoute } from 'next'
import { getDestinations, getTours } from '@/lib/formgrid/queries'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/tours', '/destinations', '/about', '/plan', '/contact'].map((path) => ({
    url: `${site.url}${path || '/'}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.7,
  }))

  const destinations = getDestinations().map((destination) => ({
    url: `${site.url}/destinations/${destination.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const tours = getTours().map((tour) => ({
    url: `${site.url}/tours/${tour.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...destinations, ...tours]
}
