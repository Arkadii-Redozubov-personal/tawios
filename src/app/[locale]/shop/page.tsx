import React from 'react';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { ShopCatalogView } from '@/components/ShopCatalogView';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return {
    title: `${dict.shop.title} — TAWIOS`,
    description: dict.shop.subtitle,
    alternates: {
      canonical: `/${locale}/shop`,
      languages: {
        uk: '/uk/shop',
        en: '/en/shop',
        pl: '/pl/shop',
        de: '/de/shop',
      },
    },
  };
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale: raw } = await params;
  const { category } = await searchParams;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return (
    <ShopCatalogView
      locale={locale}
      dict={dict}
      initialCategory={category}
    />
  );
}
