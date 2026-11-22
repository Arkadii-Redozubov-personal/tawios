'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Globe,
  Leaf,
  Scissors,
} from 'lucide-react';
import type { Dictionary } from '@/i18n';
import type { Locale, ProductCategory } from '@/lib/types';
import { useStore } from '@/components/StoreProvider';
import { ProductCard } from '@/components/ProductCard';
import { InstagramSection } from '@/components/InstagramSection';
import { RevealCard } from '@/components/RevealCard';

// Single full-bleed editorial image per slide with smooth auto-crossfade
const HERO_CAMPAIGN_LOOKS = [
  {
    slug: 'quilted-flap-bag',
    image: '/images/products/quilted-flap-black-studio.webp',
    alt: 'TAWIOS midnight black quilted flap bag with gold clasp',
    objectPosition: 'object-[68%_center] sm:object-center',
  },
  {
    slug: 'suede-sling-bag',
    image: '/images/products/suede-sling-silver-editorial.webp',
    alt: 'TAWIOS mist silver suede-feel sling bag styled on dark charcoal armchair',
    objectPosition: 'object-center',
  },
  {
    slug: 'dome-backpack-sand',
    image: '/images/products/dome-backpack-sand-seated.webp',
    alt: 'TAWIOS sand textile dome backpack lifestyle editorial',
    objectPosition: 'object-[center_35%]',
  },
];

const CATEGORY_CARDS: Array<{
  category: ProductCategory;
  image: string;
}> = [
  {
    category: 'flap-shoulder',
    image: '/images/products/quilted-flap-plum-studio.webp',
  },
  {
    category: 'sling-belt',
    image: '/images/products/suede-sling-terracotta-studio.webp',
  },
  {
    category: 'backpacks',
    image: '/images/products/ring-backpack-navy-studio.webp',
  },
  {
    category: 'crossbody',
    image: '/images/products/round-bag-slate-studio.webp',
  },
  {
    category: 'wallets',
    image: '/images/products/wallet-rose-studio.webp',
  },
];

// Neutral-tone studio colorways for clean visual cohesion across homepage bestsellers
const FEATURED_DEFAULT_VARIANTS: Record<string, string> = {
  'quilted-flap-bag': 'midnight-black',
  'suede-sling-bag': 'mist-silver',
  'ring-flap-backpack': 'navy-velvet',
  'round-crossbody-bag': 'slate-blue',
};

const MATERIAL_IMAGES = [
  '/images/products/quilted-flap-black-studio.webp',
  '/images/products/quilted-flap-houndstooth-detail.webp',
  '/images/products/boucle-sling-grey-detail.webp',
  '/images/editorial/beaded-craft.webp',
];

export function HomeView({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { products } = useStore();
  const [heroIndex, setHeroIndex] = useState(0);
  const [instantSlide, setInstantSlide] = useState(false);
  const [timerCycle, setTimerCycle] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Bespoke shade consultation form state
  const [consultName, setConsultName] = useState('');
  const [consultContact, setConsultContact] = useState('');
  const [consultNote, setConsultNote] = useState('');
  const [consultError, setConsultError] = useState('');
  const [consultSent, setConsultSent] = useState(false);

  // Smooth automatic crossfade every 5.5s (resets cleanly whenever user clicks a bar)
  useEffect(() => {
    const id = window.setInterval(() => {
      setInstantSlide(false);
      setHeroIndex((prev) => (prev + 1) % HERO_CAMPAIGN_LOOKS.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [timerCycle]);

  function handleSelectHeroSlide(idx: number) {
    setInstantSlide(true);
    setHeroIndex(idx);
    setTimerCycle((c) => c + 1);
  }

  const published = products.filter((p) => p.status === 'published');
  const featured = published
    .filter((p) => typeof p.featuredOrder === 'number')
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
    .slice(0, 4);

  const pillarIcons = [Leaf, Scissors, Globe];

  function handleConsultSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (consultName.trim().length < 2 || consultContact.trim().length < 4) {
      setConsultError(dict.checkout.validationHeading);
      return;
    }
    setConsultError('');
    setConsultSent(true);
  }

  return (
    <>
      {/* 1. Single-Image Full-Bleed Monochrome Editorial Hero with Smooth Auto-Crossfade */}
      <section className="relative w-full min-h-[580px] lg:min-h-[76vh] bg-[#0D0D0D] overflow-hidden flex items-end">
        <div className="absolute inset-0">
          {HERO_CAMPAIGN_LOOKS.map((look, idx) => {
            const isActive = idx === heroIndex;
            return (
              <div
                key={look.slug}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity ease-in-out ${
                  instantSlide ? 'duration-200' : 'duration-1000'
                } ${isActive ? 'opacity-100 z-[1]' : 'opacity-0 z-0'}`}
              >
                <Image
                  src={look.image}
                  alt={look.alt}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className={`object-cover ${look.objectPosition}`}
                />
              </div>
            );
          })}
          {/* Clean monochrome atmospheric scrims */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[2] bg-gradient-to-t from-black/78 via-black/30 to-black/10"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[2] bg-gradient-to-r from-black/68 via-black/28 to-transparent"
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 sm:pb-14 flex flex-col gap-10">
          <div className="max-w-xl space-y-5">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.65rem] font-bold text-white leading-[1.06] tracking-[-0.02em]">
              {dict.home.heroTitle}
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-lg">
              {dict.home.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/${locale}/shop`}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white hover:bg-[#EAEAEA] text-[#111111] text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-250"
              >
                <span>{dict.home.ctaShop}</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.7} />
              </Link>
              <Link
                href={`/${locale}/workshops`}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-white/80 bg-black/25 backdrop-blur-xs text-white hover:bg-white hover:text-[#111111] text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-250"
              >
                <span>{dict.home.ctaWorkshops}</span>
              </Link>
            </div>
          </div>

          {/* Mauri Flat-Bar Pagination (click switches slide immediately) */}
          <div className="flex items-center justify-center gap-4 pt-1" role="tablist" aria-label="Hero slides">
            {HERO_CAMPAIGN_LOOKS.map((look, idx) => {
              const active = idx === heroIndex;
              return (
                <button
                  key={look.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`${idx + 1} / ${HERO_CAMPAIGN_LOOKS.length}`}
                  onClick={() => handleSelectHeroSlide(idx)}
                  className="py-2 px-1 cursor-pointer group/dot"
                >
                  <span
                    className={`block h-[3px] rounded-full transition-all duration-300 ${
                      active
                        ? 'w-12 bg-white'
                        : 'w-9 bg-white/35 group-hover/dot:bg-white/75'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Bestsellers / Featured Models Grid with Smooth Scroll Reveal */}
      <section className="py-16 sm:py-22 bg-white overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard direction="up" delayMs={0} className="h-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EAEAEA]">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111]">
                {dict.home.featuredTitle}
              </h2>
              <Link
                href={`/${locale}/shop`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors self-start sm:self-auto"
              >
                <span>{dict.home.featuredAction}</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.7} />
              </Link>
            </div>
          </RevealCard>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {featured.map((product, idx) => (
              <RevealCard
                key={product.id}
                index={idx}
                columns={4}
                direction="left"
                speed="fast"
              >
                <ProductCard
                  product={product}
                  locale={locale}
                  dict={dict}
                  initialVariantId={FEATURED_DEFAULT_VARIANTS[product.slug]}
                />
              </RevealCard>
            ))}
          </div>

          <RevealCard direction="up" delayMs={120} className="h-auto mt-12 text-center">
            <Link
              href={`/${locale}/shop`}
              className="inline-flex items-center gap-2.5 px-9 py-3.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.18em] transition-colors"
            >
              <span>{dict.home.ctaShop}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.7} />
            </Link>
          </RevealCard>
        </div>
      </section>

      {/* 3. Visual Category Cards Strip with Left-to-Right Scroll Reveal */}
      <section className="py-16 sm:py-20 bg-[#F7F7F7] border-y border-[#EAEAEA] overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard direction="up" delayMs={0} className="h-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111]">
                {dict.home.categoriesTitle}
              </h2>
              <Link
                href={`/${locale}/shop`}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#111111] hover:text-[#666666] transition-colors self-start sm:self-auto"
              >
                <span>{dict.home.categoriesAction}</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.7} />
              </Link>
            </div>
          </RevealCard>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {CATEGORY_CARDS.map((card, idx) => (
              <RevealCard key={card.category} index={idx} columns={5} staggerMs={95} direction="left">
                <Link
                  href={`/${locale}/shop?category=${card.category}`}
                  className="group relative aspect-[3/4] rounded-[10px] overflow-hidden bg-[#EDEDED] block"
                >
                  <Image
                    src={card.image}
                    alt={dict.categories[card.category]}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover tawios-zoom-media tawios-zoom-target"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                  />
                  <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-1.5 px-3 py-2 rounded-[14px] bg-white/95 backdrop-blur-xs group-hover:bg-[#111111] group-hover:text-white text-[#111111] transition-colors duration-250">
                    <span className="text-[11px] font-semibold leading-tight">
                      {dict.categories[card.category]}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                  </div>
                </Link>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Monochrome Editorial Brand Story + 3 Hairline Pillars + 4 Texture Row */}
      <section className="py-16 sm:py-22 bg-white overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <RevealCard direction="left" delayMs={0} className="lg:col-span-6 h-auto">
              <div className="relative aspect-[4/3] rounded-[10px] overflow-hidden bg-[#F5F5F5]">
                <Image
                  src="/images/editorial/atelier-sewing.webp"
                  alt="TAWIOS handmade textile bag sewing atelier"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </RevealCard>

            <RevealCard direction="up" delayMs={130} className="lg:col-span-6 h-auto">
              <div className="space-y-6">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] leading-tight">
                  {dict.home.atelierTitle}
                </h2>
                <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
                  {dict.home.atelierText}
                </p>
                <Link
                  href={`/${locale}/about`}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#111111] hover:text-[#555555] underline underline-offset-8 transition-colors"
                >
                  <span>{dict.home.atelierMore}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.7} />
                </Link>
              </div>
            </RevealCard>
          </div>

          {/* Architectural Hairline-Divided 3 Craft Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-y border-[#EAEAEA] divide-y md:divide-y-0 md:divide-x divide-[#EAEAEA]">
            {dict.home.pillars.map((pillar, idx) => {
              const Icon = pillarIcons[idx] ?? Leaf;
              return (
                <RevealCard
                  key={pillar.title}
                  index={idx}
                  columns={3}
                  staggerMs={120}
                  direction="left"
                >
                  <div className="py-8 md:px-8 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full border border-[#E0E0E0] flex items-center justify-center text-[#111111] shrink-0">
                      <Icon className="w-5 h-5" strokeWidth={1.4} />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-sans text-sm sm:text-[15px] font-bold text-[#111111]">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                        {pillar.body}
                      </p>
                    </div>
                  </div>
                </RevealCard>
              );
            })}
          </div>

          {/* 4-Column Macro Textile Textures Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {dict.home.materialTiles.map((tile, idx) => (
              <RevealCard key={tile.title} index={idx} columns={4} direction="left">
                <div className="group flex flex-col">
                  <div className="relative aspect-[4/3] rounded-[10px] bg-[#F5F5F5] overflow-hidden">
                    <Image
                      src={MATERIAL_IMAGES[idx]!}
                      alt={tile.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover tawios-zoom-media tawios-zoom-target"
                    />
                  </div>
                  <div className="pt-3">
                    <p className="text-xs sm:text-sm font-semibold text-[#111111]">
                      {tile.title}
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#666666] mt-0.5">
                      {tile.subtitle}
                    </p>
                  </div>
                </div>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Minimalist Monochrome Workshops Editorial Band */}
      <section className="py-16 sm:py-20 bg-[#F7F7F7] border-y border-[#EAEAEA] overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <RevealCard direction="up" delayMs={0} className="lg:col-span-6 h-auto">
              <div className="space-y-5">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111]">
                  {dict.home.workshopsBandTitle}
                </h2>
                <p className="text-sm sm:text-base text-[#555555] leading-relaxed max-w-xl">
                  {dict.home.workshopsBandText}
                </p>
                <Link
                  href={`/${locale}/workshops`}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                >
                  <span>{dict.home.workshopsBandCta}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.7} />
                </Link>
              </div>
            </RevealCard>

            <RevealCard direction="right" delayMs={130} className="lg:col-span-6 h-auto">
              <div className="relative aspect-[4/3] rounded-[10px] overflow-hidden bg-white">
                <Image
                  src="/images/editorial/tassel-detail.webp"
                  alt="Hardware and textile bag crafting details"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
            </RevealCard>
          </div>
        </div>
      </section>

      {/* 6. Mauri-Style Minimalist 2-Column FAQ Accordion */}
      <section className="py-16 sm:py-22 bg-white overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <RevealCard direction="up" delayMs={0} className="lg:col-span-5 h-auto">
              <div className="space-y-5">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] leading-tight">
                  {dict.home.faqTitle}
                </h2>
                <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
                  {dict.home.faqSubtitle}
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                >
                  <span>{dict.home.faqCta}</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.7} />
                </Link>
              </div>
            </RevealCard>

            <div className="lg:col-span-7 border-t border-[#EAEAEA] divide-y divide-[#EAEAEA]">
              {dict.home.faqItems.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <RevealCard
                    key={item.q}
                    direction="up"
                    delayMs={idx * 80}
                    className="h-auto"
                  >
                    <div>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full py-5 flex items-center justify-between gap-4 text-left group"
                      >
                        <span className="text-sm sm:text-base font-semibold text-[#111111] group-hover:text-[#555555] transition-colors">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#111111] shrink-0 transition-transform duration-250 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          strokeWidth={1.6}
                        />
                      </button>
                      {isOpen && (
                        <p className="pb-5 pr-8 text-sm text-[#555555] leading-relaxed">
                          {item.a}
                        </p>
                      )}
                    </div>
                  </RevealCard>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 7. 105.Store Dark Instagram Gallery */}
      <InstagramSection dict={dict} />

      {/* 8. 105.Store Dark Monochrome Consultation Inquiry Band */}
      <section className="bg-[#0B0B0B] text-white py-14 sm:py-16 border-t border-white/12 overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <RevealCard direction="up" delayMs={0} className="lg:col-span-5 h-auto">
            <div className="space-y-3">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
                {dict.home.consultTitle}
              </h2>
              <p className="text-sm text-[#A8A8A8] leading-relaxed">
                {dict.home.consultSubtitle}
              </p>
            </div>
          </RevealCard>

          <RevealCard direction="up" delayMs={120} className="lg:col-span-7 h-auto">
            {consultSent ? (
              <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-[#1C1C1C] border border-white/25 text-sm font-semibold text-white">
                <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                <span>{dict.home.consultSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} noValidate className="space-y-3">
                {consultError && (
                  <p className="text-xs font-semibold text-white/85">
                    {consultError}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    id="consult-name"
                    name="consultName"
                    type="text"
                    autoComplete="name"
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    placeholder={dict.home.consultPlaceholderName}
                    aria-label={dict.home.consultPlaceholderName}
                    className="px-5 py-3 rounded-full bg-[#1C1C1C] border border-white/18 text-white placeholder:text-[#9A9A9A] text-sm focus:border-white focus:outline-none"
                  />
                  <input
                    id="consult-contact"
                    name="consultContact"
                    type="text"
                    autoComplete="email"
                    value={consultContact}
                    onChange={(e) => setConsultContact(e.target.value)}
                    placeholder={dict.home.consultPlaceholderContact}
                    aria-label={dict.home.consultPlaceholderContact}
                    className="px-5 py-3 rounded-full bg-[#1C1C1C] border border-white/18 text-white placeholder:text-[#9A9A9A] text-sm focus:border-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="consult-note"
                    name="consultNote"
                    type="text"
                    value={consultNote}
                    onChange={(e) => setConsultNote(e.target.value)}
                    placeholder={dict.home.consultPlaceholderNote}
                    aria-label={dict.home.consultPlaceholderNote}
                    className="flex-1 px-5 py-3 rounded-full bg-[#1C1C1C] border border-white/18 text-white placeholder:text-[#9A9A9A] text-sm focus:border-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-full bg-white hover:bg-[#E5E5E5] text-[#111111] text-xs font-bold uppercase tracking-[0.16em] transition-colors shrink-0"
                  >
                    {dict.home.consultSubmit}
                  </button>
                </div>
              </form>
            )}
          </RevealCard>
        </div>
      </section>
    </>
  );
}
