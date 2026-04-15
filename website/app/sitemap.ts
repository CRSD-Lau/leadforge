import type { MetadataRoute } from 'next'

const BASE = 'https://leadforge-ai.ca'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/process`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
  ]
}
