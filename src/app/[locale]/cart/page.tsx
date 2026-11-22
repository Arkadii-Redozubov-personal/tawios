import React from 'react';
import { DEFAULT_LOCALE, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { CartPageView } from '@/components/CartPageView';

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return <CartPageView locale={locale} dict={dict} />;
}

