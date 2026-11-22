import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DEFAULT_LOCALE, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { InstagramSection } from '@/components/InstagramSection';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: `${dict.about.title} — TAWIOS`,
    description: dict.about.subtitle,
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        uk: '/uk/about',
        en: '/en/about',
        pl: '/pl/about',
        de: '/de/about',
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return (
    <>
      <div className="bg-white">
        <div className="bg-[#FAFAFA] border-b border-[#EAEAEA]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-4">
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#111111]">
              {dict.about.title}
            </h1>
            <p className="text-base sm:text-lg text-[#555555] leading-relaxed max-w-3xl">
              {dict.about.subtitle}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111111]">
                {dict.about.storyHeading}
              </h2>
              <p className="text-base text-[#555555] leading-relaxed">
                {dict.about.storyBody1}
              </p>
              <p className="text-base text-[#555555] leading-relaxed">
                {dict.about.storyBody2}
              </p>
              <Link
                href={`/${locale}/shop`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
              >
                <span>{dict.home.ctaShop}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-[12px] overflow-hidden bg-[#F5F5F5]">
                <Image
                  src="/images/editorial/atelier-sewing.webp"
                  alt="Sewing process in TAWIOS atelier"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <InstagramSection dict={dict} />
    </>
  );
}
