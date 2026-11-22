import React from 'react';
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';

const LEGAL_SLUGS = ['privacy', 'cookies', 'terms', 'delivery-returns'] as const;

export async function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  if (!(LEGAL_SLUGS as readonly string[]).includes(slug)) {
    notFound();
  }
  const dict = getDictionary(locale);

  const titleMap: Record<string, string> = {
    privacy: dict.footer.legalLinks.privacy,
    cookies: dict.footer.legalLinks.cookies,
    terms: dict.footer.legalLinks.terms,
    'delivery-returns': dict.footer.legalLinks.delivery,
  };

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-[0.14em]">
          {dict.legal.draftBadge}
        </span>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#111111]">
          {titleMap[slug]}
        </h1>

        <div className="rounded-[12px] bg-[#FAFAFA] border border-[#EAEAEA] p-6 text-sm sm:text-base text-[#555555] leading-relaxed">
          {dict.legal.placeholderNotice}
        </div>
      </div>
    </div>
  );
}
