import React from 'react';
import { DEFAULT_LOCALE, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { CheckoutView } from '@/components/CheckoutView';

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { locale: raw } = await params;
  const { mode } = await searchParams;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return <CheckoutView locale={locale} dict={dict} initialMode={mode} />;
}

