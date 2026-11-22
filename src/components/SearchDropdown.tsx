'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import { resolveTranslation, type Dictionary } from '@/i18n';
import { formatDisplayPrice } from '@/lib/currency';
import type { Locale } from '@/lib/types';
import { useStore } from '@/components/StoreProvider';

interface SearchDropdownProps {
  locale: Locale;
  dict: Dictionary;
  query: string;
  onQueryChange: (val: string) => void;
  onClose: () => void;
}

export function SearchDropdown({
  locale,
  dict,
  query,
  onQueryChange,
  onClose,
}: SearchDropdownProps) {
  const { products, activeCurrency } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const published = useMemo(
    () => products.filter((p) => p.status === 'published'),
    [products]
  );

  const trimmed = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!trimmed) {
      return published
        .slice()
        .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
        .slice(0, 4);
    }

    return published
      .filter((product) => {
        const localizedFields = [
          ...Object.values(product.name),
          ...Object.values(product.shortDescription),
          dict.categories[product.category],
          ...product.variants.flatMap((v) => Object.values(v.colorName)),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return localizedFields.includes(trimmed);
      })
      .slice(0, 6);
  }, [published, trimmed, dict.categories]);

  return (
    <div
      role="dialog"
      aria-label={dict.nav.search}
      className="tawios-fade-down absolute right-0 top-full mt-2 w-[min(92vw,390px)] bg-white border border-[#E5E5E5] rounded-[14px] shadow-[0_18px_48px_rgba(0,0,0,0.12)] overflow-hidden z-50"
    >
      <div className="p-3.5 border-b border-[#EAEAEA] bg-[#FAFAFA]">
        <div className="relative flex items-center">
          <Search
            className="w-4 h-4 text-[#666666] absolute left-3.5 pointer-events-none"
            strokeWidth={1.7}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id="header-search-input"
            name="search"
            type="text"
            role="searchbox"
            autoComplete="off"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={dict.nav.searchPlaceholder}
            aria-label={dict.nav.searchPlaceholder}
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#E0E0E0] rounded-full text-sm text-[#111111] placeholder:text-[#8C8C8C] focus:border-[#111111] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label={dict.nav.menuClose}
              className="absolute right-3 p-1 text-[#666666] hover:text-[#111111]"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F0F0F0]">
        <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666666] bg-white">
          {trimmed ? dict.nav.searchResultsHint : dict.home.featuredTitle}
        </div>

        {matches.length === 0 ? (
          <div className="px-4 py-8 text-center space-y-3">
            <p className="text-sm text-[#555555]">{dict.nav.searchEmpty}</p>
            <Link
              href={`/${locale}/shop`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] hover:text-[#555555] underline underline-offset-4"
            >
              <span>{dict.nav.searchViewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          matches.map((product) => {
            const firstVariant = product.variants[0];
            const img = firstVariant?.images[0];
            const name = resolveTranslation(product.name, locale);
            const colorName = firstVariant
              ? resolveTranslation(firstVariant.colorName, locale)
              : '';
            const price = formatDisplayPrice(
              product.basePricePln,
              activeCurrency,
              locale,
              dict.currency.approxPrefix
            );

            return (
              <Link
                key={product.id}
                href={`/${locale}/product/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-3.5 px-4 py-3 hover:bg-[#FAFAFA] transition-colors group"
              >
                <div className="relative w-[56px] h-[68px] rounded-[8px] bg-[#F5F5F5] overflow-hidden shrink-0">
                  {img ? (
                    <Image
                      src={img.url}
                      alt={name}
                      fill
                      sizes="60px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span
                      className="block w-full h-full"
                      style={{ backgroundColor: firstVariant?.colorHex ?? '#E5E5E5' }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111111] group-hover:text-[#555555] truncate transition-colors">
                    {name}
                  </p>
                  <p className="text-xs text-[#666666] flex items-center gap-1.5 mt-0.5 truncate">
                    {firstVariant && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: firstVariant.colorHex }}
                      />
                    )}
                    <span className="truncate">{colorName}</span>
                  </p>
                  <p className="text-xs font-bold text-[#111111] mt-1 tabular-nums">
                    {price.formatted}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="px-4 py-3 bg-[#FAFAFA] border-t border-[#EAEAEA] flex items-center justify-between">
        <Link
          href={`/${locale}/shop`}
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] hover:text-[#555555] transition-colors"
        >
          <span>{dict.nav.searchViewAll}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <span className="text-[11px] text-[#666666] tabular-nums">
          {published.length} {dict.shop.countPlural}
        </span>
      </div>
    </div>
  );
}
