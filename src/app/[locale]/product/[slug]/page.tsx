import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE, isValidLocale } from '@/i18n/config';
import { getDictionary, resolveTranslation } from '@/i18n';
import { CATALOG_SEED } from '@/server/data/catalog-seed';
import { getLocalizedProductCopy, getProductBySlug } from '@/server/services/catalog-service';
import { ProductDetailView } from '@/components/ProductDetailView';

export async function generateStaticParams() {
  return CATALOG_SEED.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const copy = getLocalizedProductCopy(product, locale);
  const pageTitle = copy.seoTitle.includes('TAWIOS')
    ? copy.seoTitle
    : `${copy.seoTitle} — TAWIOS`;
  return {
    title: pageTitle,
    description: copy.seoDescription,
    alternates: {
      canonical: `/${locale}/product/${slug}`,
      languages: {
        uk: `/uk/product/${slug}`,
        en: `/en/product/${slug}`,
        pl: `/pl/product/${slug}`,
        de: `/de/product/${slug}`,
      },
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ color?: string; view?: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const { color, view } = await searchParams;
  const dict = getDictionary(locale);

  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const copy = getLocalizedProductCopy(product, locale);
  const firstImage = product.variants[0]?.images[0]?.url;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: copy.name,
    description: copy.shortDescription,
    brand: {
      '@type': 'Brand',
      name: 'TAWIOS',
    },
    image: firstImage ? [firstImage] : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PLN',
      price: String(product.basePricePln),
      availability: 'https://schema.org/InStock',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: resolveTranslation({ [locale]: dict.product.breadcrumbHome }, locale),
        item: `/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: resolveTranslation({ [locale]: dict.product.breadcrumbShop }, locale),
        item: `/${locale}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: copy.name,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbLd]) }}
      />
      <ProductDetailView
        slug={slug}
        locale={locale}
        dict={dict}
        initialColorId={color}
        initialView={view}
      />
    </>
  );
}

