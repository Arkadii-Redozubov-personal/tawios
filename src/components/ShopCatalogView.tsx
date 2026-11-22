'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Grid2X2, Instagram, LayoutGrid } from 'lucide-react';
import type { Dictionary } from '@/i18n';
import type { Locale, ProductCategory } from '@/lib/types';
import { useStore } from '@/components/StoreProvider';
import { ProductCard } from '@/components/ProductCard';
import { RevealCard } from '@/components/RevealCard';

const CATEGORY_ORDER: Array<'all' | ProductCategory> = [
  'all',
  'flap-shoulder',
  'sling-belt',
  'backpacks',
  'crossbody',
  'wallets',
];

type SortOption = 'featured' | 'price-asc' | 'price-desc';

function isValidCategory(val?: string): val is ProductCategory {
  return (
    val === 'flap-shoulder' ||
    val === 'sling-belt' ||
    val === 'backpacks' ||
    val === 'crossbody' ||
    val === 'wallets'
  );
}

export function ShopCatalogView({
  locale,
  dict,
  initialCategory,
}: {
  locale: Locale;
  dict: Dictionary;
  initialCategory?: string;
}) {
  const router = useRouter();
  const { products, storeSettings } = useStore();
  const [category, setCategory] = useState<'all' | ProductCategory>(
    isValidCategory(initialCategory) ? initialCategory : 'all'
  );
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [columns, setColumns] = useState<3 | 4>(4);

  // Made-to-order inquiry state (105.Store /shop/ custom sewing section)
  const [customName, setCustomName] = useState('');
  const [customContact, setCustomContact] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [customComment, setCustomComment] = useState('');
  const [customError, setCustomError] = useState('');
  const [customSent, setCustomSent] = useState(false);

  const customFormReady =
    customName.trim().length >= 2 && customContact.trim().length >= 4;

  function handleCustomOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customFormReady) {
      setCustomError(dict.checkout.validationHeading);
      return;
    }
    setCustomError('');
    setCustomSent(true);
  }

  useEffect(() => {
    if (isValidCategory(initialCategory)) {
      setCategory(initialCategory);
    } else if (!initialCategory) {
      setCategory('all');
    }
  }, [initialCategory]);

  function handleSelectCategory(next: 'all' | ProductCategory) {
    setCategory(next);
    const nextUrl =
      next === 'all' ? `/${locale}/shop` : `/${locale}/shop?category=${next}`;
    router.replace(nextUrl, { scroll: false });
  }

  const published = useMemo(
    () => products.filter((p) => p.status === 'published'),
    [products]
  );

  const filtered = useMemo(() => {
    const list =
      category === 'all'
        ? [...published]
        : published.filter((p) => p.category === category);

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.basePricePln - b.basePricePln);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.basePricePln - a.basePricePln);
    } else {
      list.sort(
        (a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99)
      );
    }
    return list;
  }, [published, category, sortBy]);

  return (
    <div className="bg-white overflow-x-clip">
      {/* Clean Background-Free Page Header */}
      <div className="bg-white border-b border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 sm:pt-11 sm:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#111111]">
              {dict.shop.title}
            </h1>
            <p className="text-sm sm:text-base text-[#555555]">
              {dict.shop.subtitle}
            </p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#555555] tabular-nums shrink-0">
            {filtered.length}{' '}
            {(() => {
              const mod10 = filtered.length % 10;
              const mod100 = filtered.length % 100;
              if (mod10 === 1 && mod100 !== 11) return dict.shop.countSingle;
              if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
                return dict.shop.countFew;
              }
              return dict.shop.countPlural;
            })()}
          </p>
        </div>
      </div>

      {/* Category Filter Bar + 3/4-Col Switcher & Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-3.5">
          <div
            className="flex flex-wrap gap-x-4 xl:gap-x-5 gap-y-2"
            role="tablist"
            aria-label={dict.shop.title}
          >
            {CATEGORY_ORDER.map((cat) => {
              const active = cat === category;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectCategory(cat)}
                  className={`pb-2 text-[11px] font-semibold uppercase tracking-[0.11em] whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? 'text-[#111111] border-[#111111]'
                      : 'text-[#666666] border-transparent hover:text-[#111111]'
                  }`}
                >
                  {dict.categories[cat]}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 self-start xl:self-auto">
            <div
              className="hidden lg:inline-flex items-center rounded-full border border-[#E0E0E0] p-0.5 bg-white"
              role="group"
              aria-label={dict.shop.gridColumnsLabel}
            >
              <button
                type="button"
                onClick={() => setColumns(3)}
                aria-pressed={columns === 3}
                title="3 columns"
                className={`p-1.5 rounded-full transition-colors ${
                  columns === 3
                    ? 'bg-[#111111] text-white'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <Grid2X2 className="w-3.5 h-3.5" strokeWidth={1.7} />
              </button>
              <button
                type="button"
                onClick={() => setColumns(4)}
                aria-pressed={columns === 4}
                title="4 columns"
                className={`p-1.5 rounded-full transition-colors ${
                  columns === 4
                    ? 'bg-[#111111] text-white'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.7} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="catalog-sort"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666666] whitespace-nowrap"
              >
                {dict.shop.sortLabel}:
              </label>
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3.5 py-1.5 rounded-full border border-[#E0E0E0] bg-white text-xs font-medium text-[#111111] focus:border-[#111111]"
              >
                <option value="featured">{dict.shop.sortFeatured}</option>
                <option value="price-asc">{dict.shop.sortPriceAsc}</option>
                <option value="price-desc">{dict.shop.sortPriceDesc}</option>
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-4 rounded-[12px] bg-[#FAFAFA] border border-[#EAEAEA]">
            <p className="font-display text-xl text-[#111111]">
              {dict.shop.emptyTitle}
            </p>
            <button
              type="button"
              onClick={() => handleSelectCategory('all')}
              className="px-7 py-3 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
            >
              {dict.shop.emptyReset}
            </button>
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 gap-x-5 gap-y-10 ${
              columns === 3 ? 'lg:grid-cols-3 lg:gap-x-7' : 'lg:grid-cols-4'
            }`}
          >
            {filtered.map((product, idx) => (
              <RevealCard key={product.id} index={idx} columns={columns} speed="fast">
                <ProductCard
                  product={product}
                  locale={locale}
                  dict={dict}
                />
              </RevealCard>
            ))}
          </div>
        )}
      </div>

      {/* 105.Store-Style Made-to-Order Section ("Не всі моделі завжди є в наявності — і це нормально") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left Column: Elevated Pure-White Editorial Photo Card */}
          <RevealCard direction="left" delayMs={0} className="h-auto">
            <div className="bg-white rounded-[16px] p-3.5 sm:p-4 pb-6 sm:pb-8 shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-[#F2F2F2]">
              <div className="relative aspect-[4/4.6] rounded-[11px] overflow-hidden bg-[#F5F5F5]">
                <Image
                  src="/images/products/quilted-flap-black-studio.webp"
                  alt="TAWIOS handmade black quilted bag with gold clasp"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
              <div className="pt-5 sm:pt-6 px-3 text-center space-y-2">
                <p className="text-sm sm:text-[15px] text-[#7A7A7A]">
                  {dict.shop.customOrder.cardLine1}
                </p>
                <p className="text-[15px] sm:text-base font-bold uppercase tracking-[0.04em] text-[#111111]">
                  {dict.shop.customOrder.cardLine2}
                </p>
              </div>
            </div>
          </RevealCard>

          {/* Right Column: Copy, Direct Instagram Contact & Borderless Soft-Fill Form */}
          <RevealCard direction="up" delayMs={110} className="h-auto space-y-5 lg:pt-2">
            <p className="text-sm sm:text-[15px] text-[#888888]">
              {dict.shop.customOrder.eyebrow}
            </p>

            <h2 className="font-sans font-normal text-[26px] sm:text-[32px] leading-[1.24] tracking-[-0.015em] text-[#111111]">
              {dict.shop.customOrder.title}
            </h2>

            <p className="text-sm sm:text-[15px] text-[#4A4A4A] leading-[1.6]">
              {dict.shop.customOrder.body1}
            </p>

            <p className="text-sm sm:text-[15px] font-medium text-[#222222] leading-[1.6]">
              {dict.shop.customOrder.body2}
            </p>

            <div className="pt-1">
              <a
                href={storeSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 group"
              >
                <span className="w-8 h-8 rounded-full bg-[#111111] group-hover:bg-[#333333] text-white flex items-center justify-center transition-colors shrink-0">
                  <Instagram className="w-4 h-4" strokeWidth={1.7} />
                </span>
                <span className="text-sm sm:text-[15px] font-medium text-[#111111] group-hover:text-[#555555] transition-colors">
                  {storeSettings.instagramHandle}
                </span>
              </a>
            </div>

            {customSent ? (
              <div className="pt-2">
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-[18px] bg-[#F5F5F5] border border-[#111111] text-sm font-medium text-[#111111]">
                  <CheckCircle2 className="w-5 h-5 text-[#111111] shrink-0" />
                  <span>{dict.shop.customOrder.success}</span>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleCustomOrderSubmit}
                noValidate
                className="space-y-3 pt-1"
              >
                {customError && (
                  <p className="text-xs font-semibold text-[#111111]">
                    {customError}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    id="shop-custom-name"
                    name="customName"
                    type="text"
                    autoComplete="name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={dict.shop.customOrder.namePlaceholder}
                    aria-label={dict.shop.customOrder.namePlaceholder}
                    className="w-full h-12 px-5 rounded-full bg-[#F5F5F5] text-sm text-[#111111] placeholder:text-[#9A9A9A] focus:bg-[#EFEFEF] focus:outline-none transition-colors"
                  />
                  <input
                    id="shop-custom-contact"
                    name="customContact"
                    type="text"
                    autoComplete="email"
                    value={customContact}
                    onChange={(e) => setCustomContact(e.target.value)}
                    placeholder={dict.shop.customOrder.contactPlaceholder}
                    aria-label={dict.shop.customOrder.contactPlaceholder}
                    className="w-full h-12 px-5 rounded-full bg-[#F5F5F5] text-sm text-[#111111] placeholder:text-[#9A9A9A] focus:bg-[#EFEFEF] focus:outline-none transition-colors"
                  />
                </div>

                <input
                  id="shop-custom-model"
                  name="customModel"
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder={dict.shop.customOrder.modelPlaceholder}
                  aria-label={dict.shop.customOrder.modelPlaceholder}
                  className="w-full h-12 px-5 rounded-full bg-[#F5F5F5] text-sm text-[#111111] placeholder:text-[#9A9A9A] focus:bg-[#EFEFEF] focus:outline-none transition-colors"
                />

                <textarea
                  id="shop-custom-comment"
                  name="customComment"
                  rows={3}
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  placeholder={dict.shop.customOrder.commentPlaceholder}
                  aria-label={dict.shop.customOrder.commentPlaceholder}
                  className="w-full px-5 py-3.5 rounded-[18px] bg-[#F5F5F5] text-sm text-[#111111] placeholder:text-[#9A9A9A] focus:bg-[#EFEFEF] focus:outline-none transition-colors resize-y"
                />

                <div className="pt-1">
                  <button
                    type="submit"
                    className={`w-full sm:w-[340px] h-[54px] px-7 rounded-full inline-flex items-center justify-center gap-2.5 text-sm font-medium border transition-colors duration-250 ${
                      customFormReady
                        ? 'bg-[#111111] border-[#111111] text-white hover:bg-white hover:text-[#111111]'
                        : 'bg-[#696969] border-[#696969] text-white hover:bg-white hover:text-[#111111] hover:border-[#D4D4D4]'
                    }`}
                  >
                    <span>{dict.shop.customOrder.submit}</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={1.7} />
                  </button>
                </div>
              </form>
            )}
          </RevealCard>
        </div>
      </section>
    </div>
  );
}
