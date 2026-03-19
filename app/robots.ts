import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/employer/', '/student/', '/account/', '/api/', '/auth/'],
    },
    sitemap: 'https://www.internpick.com/sitemap.xml',
  }
}
