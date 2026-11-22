import React from 'react';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { ContactView } from '@/components/ContactView';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: `${dict.contact.title} — TAWIOS`,
    description: dict.contact.subtitle,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        uk: '/uk/contact',
        en: '/en/contact',
        pl: '/pl/contact',
        de: '/de/contact',
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return <ContactView dict={dict} />;
}

