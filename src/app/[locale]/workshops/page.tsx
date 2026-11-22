import React from 'react';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { WorkshopsView } from '@/components/WorkshopsView';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return {
    title: `${dict.workshops.title} — TAWIOS`,
    description: dict.workshops.subtitle,
    alternates: {
      canonical: `/${locale}/workshops`,
      languages: {
        uk: '/uk/workshops',
        en: '/en/workshops',
        pl: '/pl/workshops',
        de: '/de/workshops',
      },
    },
  };
}

export default async function WorkshopsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return <WorkshopsView dict={dict} />;
}

