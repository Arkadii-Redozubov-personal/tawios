'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid2X2, LayoutGrid } from 'lucide-react';
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
  const { products } = useStore();
  const [category, setCategory] = useState<'all' | ProductCategory>(
    isValidCategory(initialCategory) ? initialCategory : 'all'
  );
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [columns, setColumns] = useState<3 | 4>(4);

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
    <div className="bg-white">
      {/* Clean Monochrome Page Header */}
      <div className="bg-[#FAFAFA] border-b border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
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
              <RevealCard key={product.id} index={idx} columns={columns}>
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
    </div>
  );
}
