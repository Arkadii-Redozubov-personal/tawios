'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Heart, ImageOff, ShoppingBag } from 'lucide-react';
import { resolveTranslation, type Dictionary } from '@/i18n';
import type { Locale, Product } from '@/lib/types';
import { PriceDisplay } from '@/components/PriceDisplay';
import { useStore } from '@/components/StoreProvider';

interface ProductCardProps {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  initialVariantId?: string;
}

/**
 * Monochrome editorial product card (105.Store hover choreography x Mauri baseline alignment):
 * - Soft 10px portrait frame on clean #F7F7F7 ground
 * - Hover 2nd-angle crossfade + 1.6s smooth exponential zoom (scale 1.09)
 * - Floating top-right Wishlist Heart (slides in on hover; stays pinned solid black when liked)
 * - Slide-up bottom matte black Quick-Add bar with vertical text -> ShoppingBag icon swap
 */
export function ProductCard({
  product,
  locale,
  dict,
  initialVariantId,
}: ProductCardProps) {
  const { addToCart, setCartOpen, toggleWishlist, isWishlisted } = useStore();
  const [selectedVariantId, setSelectedVariantId] = useState(
    initialVariantId && product.variants.some((v) => v.id === initialVariantId)
      ? initialVariantId
      : product.variants[0]?.id ?? ''
  );
  const [heartPop, setHeartPop] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    product.variants[0];

  const primaryImage = activeVariant?.images[0];
  const secondaryImage = activeVariant?.images[1];
  const name = resolveTranslation(product.name, locale);
  const colorName = activeVariant
    ? resolveTranslation(activeVariant.colorName, locale)
    : '';
  const productHref = activeVariant
    ? `/${locale}/product/${product.slug}?color=${encodeURIComponent(activeVariant.id)}`
    : `/${locale}/product/${product.slug}`;

  const liked = activeVariant ? isWishlisted(product.id, activeVariant.id) : false;

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!activeVariant) return;
    toggleWishlist(product.id, activeVariant.id);
    setHeartPop(true);
    window.setTimeout(() => setHeartPop(false), 400);
  }

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!activeVariant) return;
    addToCart(product.id, product.slug, activeVariant.id, 1);
    setJustAdded(true);
    setCartOpen(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <article className="group flex flex-col h-full">
      <div className="relative aspect-[4/5] rounded-[10px] bg-[#F5F5F5] overflow-hidden">
        <Link href={productHref} className="block w-full h-full relative">
          {primaryImage ? (
            <>
              <Image
                src={primaryImage.url}
                alt={resolveTranslation(primaryImage.alt, locale) || name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover tawios-zoom-media ${
                  secondaryImage
                    ? 'group-hover:opacity-0'
                    : 'tawios-zoom-target'
                }`}
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage.url}
                  alt={resolveTranslation(secondaryImage.alt, locale) || name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover opacity-0 group-hover:opacity-100 tawios-zoom-media tawios-zoom-target"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center bg-[#F5F5F5] gap-3">
              <span
                className="w-10 h-10 rounded-full border border-[#111111]"
                style={{ backgroundColor: activeVariant?.colorHex ?? '#999999' }}
              />
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#555555]">
                <ImageOff className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span>{dict.product.fallbackPhotoTitle}</span>
              </div>
            </div>
          )}

          {activeVariant?.madeToOrder && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#111111] text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
              {dict.shop.madeToOrderShort}
            </span>
          )}
        </Link>

        {/* Top-Right Floating Wishlist Heart */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-pressed={liked}
          aria-label={liked ? dict.shop.removeFromWishlist : dict.shop.addToWishlist}
          title={liked ? dict.shop.removeFromWishlist : dict.shop.addToWishlist}
          className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-[0_3px_12px_rgba(0,0,0,0.10)] flex items-center justify-center transition-all duration-300 ease-out ${
            liked
              ? 'opacity-100 translate-x-0 text-[#111111]'
              : 'opacity-100 lg:opacity-0 lg:translate-x-5 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 text-[#111111] hover:text-[#555555]'
          }`}
        >
          <Heart
            className={`w-[17px] h-[17px] transition-colors ${
              liked ? 'fill-[#111111] text-[#111111]' : ''
            } ${heartPop ? 'tawios-heart-pop' : ''}`}
            strokeWidth={1.7}
          />
        </button>

        {/* Desktop Slide-Up Matte Black Quick-Add Bar with vertical text -> ShoppingBag icon swap */}
        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`${dict.shop.quickAdd}: ${name}`}
          className="hidden lg:flex group/bar absolute inset-x-0 bottom-0 z-20 h-11 bg-[#111111]/92 hover:bg-[#000000] text-white items-center justify-center overflow-hidden translate-y-[104%] group-hover:translate-y-0 focus-visible:translate-y-0 transition-transform duration-300 ease-out"
        >
          {justAdded ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]">
              <Check className="w-4 h-4 text-white" strokeWidth={2.2} />
              <span>{dict.shop.addedShort}</span>
            </span>
          ) : (
            <span className="relative h-full w-full flex items-center justify-center overflow-hidden">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-250 ease-out group-hover/bar:-translate-y-full group-hover/bar:opacity-0">
                {dict.shop.quickAdd}
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center translate-y-full opacity-0 transition-all duration-250 ease-out group-hover/bar:translate-y-0 group-hover/bar:opacity-100"
              >
                <ShoppingBag className="w-[18px] h-[18px] text-white" strokeWidth={1.8} />
              </span>
            </span>
          )}
        </button>

        {/* Mobile Floating Quick-Add Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`${dict.shop.quickAdd}: ${name}`}
          className="lg:hidden absolute bottom-3 right-3 z-20 w-9 h-9 rounded-full bg-[#111111]/92 hover:bg-[#000000] text-white shadow-[0_3px_12px_rgba(0,0,0,0.18)] flex items-center justify-center transition-colors"
        >
          {justAdded ? (
            <Check className="w-4 h-4 text-white" strokeWidth={2.2} />
          ) : (
            <ShoppingBag className="w-4 h-4" strokeWidth={1.7} />
          )}
        </button>
      </div>

      {/* Monochrome Caption Stack with Mauri-aligned bottom baseline */}
      <div className="pt-3.5 flex-1 flex flex-col">
        <Link href={productHref} className="block min-w-0">
          <h3 className="font-sans text-sm sm:text-[15px] font-semibold text-[#111111] group-hover:text-[#555555] transition-colors leading-snug">
            {name}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-[#666666] truncate">{colorName}</p>

        <div className="mt-auto pt-2.5 flex items-center justify-between gap-2">
          <PriceDisplay
            basePricePln={product.basePricePln}
            locale={locale}
            dict={dict}
            size="sm"
          />

          {/* Tactile Circular Color Swatches */}
          <div className="flex flex-wrap items-center gap-1.5">
            {product.variants.map((variant) => {
              const isSelected = variant.id === activeVariant?.id;
              const vName = resolveTranslation(variant.colorName, locale);
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantId(variant.id)}
                  aria-label={vName}
                  aria-pressed={isSelected}
                  title={vName}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    isSelected
                      ? 'ring-1 ring-[#111111] ring-offset-2 border-[#111111] scale-105'
                      : 'border-[#CCCCCC] hover:border-[#111111]'
                  }`}
                  style={{ backgroundColor: variant.colorHex }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
