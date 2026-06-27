import { MetadataRoute } from 'next'
import pandas from '@/data/pandas.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://panda-world-one.vercel.app'

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/live`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/pandas`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/bamboo`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/mbti`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/family-tree`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  ]

  const pandaRoutes = pandas.map((panda) => ({
    url: `${baseUrl}/pandas/${panda.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...pandaRoutes]
}
