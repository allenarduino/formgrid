import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/menu', '/about', '/reservations', '/contact'].map((path) => ({
    url: `${site.url}${path || '/'}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : path === '/menu' ? 0.9 : 0.7,
  }))
}
