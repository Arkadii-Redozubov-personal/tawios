import type { MetadataRoute } from 'next';
import { LOCALES } from '@/i18n/config';
import { getPublishedProducts } from '@/server/services/catalog-service';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tawios.example';
  const products = getPublishedProducts();
  const staticPaths = ['', '/shop', '/workshops', '/about', '/contact'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of staticPaths) {
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.8,
      });
    }
    for (const product of products) {
      entries.push({
        url: `${baseUrl}/${locale}/product/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  return entries;
}

