import React from 'react';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { AdminDemoView } from '@/components/AdminDemoView';

export const metadata: Metadata = {
  title: 'Admin — TAWIOS',
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string; product?: string }>;
}) {
  const { locale: raw } = await params;
  const { tab, product } = await searchParams;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return (
    <AdminDemoView
      locale={locale}
      dict={dict}
      initialTab={tab}
      initialProductId={product}
    />
  );
}

