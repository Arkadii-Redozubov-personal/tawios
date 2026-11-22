import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, LOCALE_META, LOCALES } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { DemoBanner } from '@/components/DemoBanner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { LocaleHtmlSync } from '@/components/LocaleHtmlSync';
import { BackToTop } from '@/components/BackToTop';

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        uk: '/uk',
        en: '/en',
        pl: '/pl',
        de: '/de',
      },
    },
    openGraph: {
      title: dict.meta.homeTitle,
      description: dict.meta.homeDescription,
      locale: LOCALE_META[locale].intlLocale,
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);

  return (
    <div lang={locale} className="min-h-screen flex flex-col">
      <LocaleHtmlSync locale={locale} />
      <DemoBanner locale={locale} dict={dict} />
      <Header locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict} />
      <CartDrawer locale={locale} dict={dict} />
      <BackToTop />
    </div>
  );
}

