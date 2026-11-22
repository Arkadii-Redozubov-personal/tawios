import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tawios.example';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/uk/admin', '/en/admin', '/pl/admin', '/de/admin'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

