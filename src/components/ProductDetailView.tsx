'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  ImageOff,
  LayoutGrid,
  Minus,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import { resolveTranslation, type Dictionary } from '@/i18n';
import { resolveProductVariant } from '@/server/services/catalog-service';
import { formatDisplayPrice } from '@/lib/currency';
import type { Locale } from '@/lib/types';
import { useStore } from '@/components/StoreProvider';
import { PriceDisplay } from '@/components/PriceDisplay';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductCard } from '@/components/ProductCard';
import { RevealCard } from '@/components/RevealCard';

interface ProductDetailViewProps {
  slug: string;
  locale: Locale;
  dict: Dictionary;
  initialColorId?: string;
  initialView?: string;
}

/**
 * Monochrome PDP blending 105.Store + Mauri Cosmetics:
 * - Top breadcrumb + 105.Store Prev / Catalog Grid / Next controls
 * - Sticky Left Gallery (Mauri vertical thumbnails + 105.Store portrait main frame & hover arrows)
 * - Right Buy Box (Mauri stock/SKU row, crisp title, 105.Store photo swatches,
 *   Mauri single-row price + borderless stepper, dual CTAs + Wishlist heart, hairline accordions)
 * - No 2D silhouette widget, no public DEMO/Admin links
 * - Below fold: Related 4-col grid + 105.Store 3-col horizontal Recently Viewed mini-cards
 */
export function ProductDetailView({
  slug,
  locale,
  dict,
  initialColorId,
}: ProductDetailViewProps) {
  const router = useRouter();
  const {
    products,
    activeCurrency,
    addToCart,
    setCartOpen,
    toggleWishlist,
    isWishlisted,
    recentlyViewed,
    trackViewedProduct,
  } = useStore();
  const buyBoxRef = useRef<HTMLDivElement>(null);

  const published = products.filter((p) => p.status === 'published');
  const product = products.find((p) => p.slug === slug);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    initialColorId || product?.variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [heartPop, setHeartPop] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const [openSpecs, setOpenSpecs] = useState(true);
  const [openCraft, setOpenCraft] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);

  useEffect(() => {
    if (product?.slug) {
      trackViewedProduct(product.slug);
    }
  }, [product?.slug, trackViewedProduct]);

  useEffect(() => {
    if (initialColorId && product?.variants.some((v) => v.id === initialColorId)) {
      setSelectedVariantId(initialColorId);
    }
  }, [initialColorId, product]);

  useEffect(() => {
    function onScroll() {
      if (!buyBoxRef.current) return;
      const rect = buyBoxRef.current.getBoundingClientRect();
      setShowStickyBar(rect.bottom < 80);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-[#111111]">
          {dict.shop.emptyTitle}
        </h1>
        <Link
          href={`/${locale}/shop`}
          className="inline-block px-7 py-3 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
        >
          {dict.cart.goToShop}
        </Link>
      </div>
    );
  }

  const { variant, images } = resolveProductVariant(product, selectedVariantId);
  const name = resolveTranslation(product.name, locale);
  const shortDescription = resolveTranslation(product.shortDescription, locale);
  const description = resolveTranslation(product.description, locale);
  const colorName = resolveTranslation(variant.colorName, locale);
  const primaryImage = images[0];
  const liked = isWishlisted(product.id, variant.id);

  const currentIdx = published.findIndex((p) => p.id === product.id);
  const prevModel =
    currentIdx >= 0
      ? published[(currentIdx - 1 + published.length) % published.length]
      : undefined;
  const nextModel =
    currentIdx >= 0 ? published[(currentIdx + 1) % published.length] : undefined;

  const relatedProducts = published
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const recentlyViewedProducts = recentlyViewed
    .filter((s) => s !== product.slug)
    .map((s) => published.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  function handleSelectColor(variantId: string) {
    setSelectedVariantId(variantId);
    setJustAdded(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('color', variantId);
      window.history.replaceState({}, '', url.toString());
    }
  }

  function handleAddToBag() {
    if (!product) return;
    addToCart(product.id, product.slug, variant.id, quantity);
    setJustAdded(true);
    setCartOpen(true);
  }

  function handleToggleWishlist() {
    if (!product) return;
    toggleWishlist(product.id, variant.id);
    setHeartPop(true);
    window.setTimeout(() => setHeartPop(false), 400);
  }

  function handleQuickRequest() {
    if (!product) return;
    addToCart(product.id, product.slug, variant.id, quantity);
    router.push(`/${locale}/checkout?mode=request`);
  }

  return (
    <div className="bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-9">
        {/* Top Breadcrumb + 105.Store Prev / Grid / Next Model Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center justify-between gap-4 text-[12px] text-[#777777]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Link href={`/${locale}`} className="hover:text-[#111111] transition-colors">
              {dict.product.breadcrumbHome}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${locale}/shop`} className="hover:text-[#111111] transition-colors">
              {dict.product.breadcrumbShop}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#111111] font-semibold truncate">{name}</span>
          </div>

          <div className="inline-flex items-center gap-1 rounded-full border border-[#E5E5E5] bg-[#FAFAFA] p-0.5 shrink-0">
            {prevModel && (
              <Link
                href={`/${locale}/product/${prevModel.slug}`}
                aria-label={`${dict.product.prevModel}: ${resolveTranslation(prevModel.name, locale)}`}
                title={resolveTranslation(prevModel.name, locale)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#111111] hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.7} />
              </Link>
            )}
            <Link
              href={`/${locale}/shop`}
              aria-label={dict.product.backToCatalog}
              title={dict.product.backToCatalog}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#111111] hover:bg-white transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.7} />
            </Link>
            {nextModel && (
              <Link
                href={`/${locale}/product/${nextModel.slug}`}
                aria-label={`${dict.product.nextModel}: ${resolveTranslation(nextModel.name, locale)}`}
                title={resolveTranslation(nextModel.name, locale)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#111111] hover:bg-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.7} />
              </Link>
            )}
          </div>
        </nav>

        {/* Main 54 / 46 Hybrid Split (Sticky Left Gallery + Clean Right Buy Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left 7 Cols: Sticky Gallery (Mauri Vertical Thumbs + 105.Store Portrait Frame) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <ProductGallery
              images={images}
              productName={name}
              colorName={colorName}
              colorHex={variant.colorHex}
              locale={locale}
              dict={dict}
            />
          </div>

          {/* Right 5 Cols: Mauri Clean Hierarchy x 105.Store Swatches & Wishlist */}
          <div className="lg:col-span-5 space-y-6">
            <div ref={buyBoxRef} className="space-y-6">
              {/* Mauri Top Meta Row: Availability Left | SKU Right */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-[#2D6A4F]">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.2} aria-hidden="true" />
                  <span>
                    {variant.madeToOrder
                      ? dict.product.availabilityMadeToOrder
                      : dict.product.availabilityInStock}
                  </span>
                </span>
                <span className="text-[#8C8C8C] tabular-nums">
                  SKU: {variant.sku}
                </span>
              </div>

              {/* Title + Short Editorial Subtitle */}
              <div className="space-y-2.5 pb-5 border-b border-[#EAEAEA]">
                <h1 className="font-display text-3xl sm:text-[2.25rem] font-bold text-[#111111] leading-[1.12]">
                  {name}
                </h1>
                <p className="text-sm text-[#555555] leading-relaxed">
                  {shortDescription}
                </p>
              </div>

              {/* 105.Store Tactile Real-Photo Color Swatches */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#111111]">
                  {dict.product.selectedColorPrefix}{' '}
                  <span className="font-normal text-[#555555] ml-1">
                    {colorName}
                  </span>
                </p>

                <div
                  className="flex flex-wrap gap-2.5"
                  role="radiogroup"
                  aria-label={dict.product.colorSelectLabel}
                >
                  {product.variants.map((v) => {
                    const active = v.id === variant.id;
                    const vLabel = resolveTranslation(v.colorName, locale);
                    const thumb = v.images[0];
                    return (
                      <button
                        key={v.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-label={vLabel}
                        title={vLabel}
                        onClick={() => handleSelectColor(v.id)}
                        className={`relative w-[54px] h-[54px] rounded-[8px] bg-[#F5F5F5] overflow-hidden transition-all flex items-center justify-center ${
                          active
                            ? 'ring-2 ring-[#111111] ring-offset-2 border border-[#111111]'
                            : 'border border-[#E2E2E2] hover:border-[#111111]'
                        }`}
                      >
                        {thumb ? (
                          <Image
                            src={thumb.url}
                            alt={vLabel}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <span
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: v.colorHex }}
                          >
                            <ImageOff
                              className="w-4 h-4 text-white/85"
                              strokeWidth={1.5}
                            />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mauri Single-Row Price (Left) + Minimal Inline Quantity Stepper (Right) */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <PriceDisplay
                  basePricePln={product.basePricePln}
                  locale={locale}
                  dict={dict}
                  size="lg"
                  showBaseClarification
                />

                <div className="inline-flex items-center gap-1 rounded-full bg-[#F7F7F7] border border-[#E8E8E8] px-1 py-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#111111] hover:bg-white disabled:opacity-35 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm font-semibold tabular-nums text-[#111111]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    aria-label="Increase quantity"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#111111] hover:bg-white disabled:opacity-35 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mauri Dual Action Row + 105.Store Wishlist Heart */}
              <div className="space-y-3">
                <div className="flex items-stretch gap-2.5">
                  <button
                    type="button"
                    onClick={handleAddToBag}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" strokeWidth={2} />
                        <span>{dict.product.addedToast}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" strokeWidth={1.7} />
                        <span>{dict.product.addToBag}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-pressed={liked}
                    aria-label={liked ? dict.shop.removeFromWishlist : dict.shop.addToWishlist}
                    title={liked ? dict.product.inWishlist : dict.product.saveToWishlist}
                    className={`w-[52px] rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      liked
                        ? 'border-[#111111] bg-[#F4F4F4] text-[#111111]'
                        : 'border-[#E0E0E0] bg-white hover:border-[#111111] text-[#111111]'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        liked ? 'fill-[#111111] text-[#111111]' : ''
                      } ${heartPop ? 'tawios-heart-pop' : ''}`}
                      strokeWidth={1.7}
                    />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleQuickRequest}
                  className="w-full py-3.5 rounded-full border border-[#111111] bg-white hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                >
                  {dict.product.quickRequest}
                </button>
              </div>
            </div>

            {/* Clean Hairline Collapsible Accordions (Mauri FAQ discipline + 105.Store Spec Table) */}
            <div className="border-t border-[#EAEAEA] divide-y divide-[#EAEAEA]">
              {/* 1. Characteristics */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenSpecs((v) => !v)}
                  aria-expanded={openSpecs}
                  className="w-full py-4 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#111111]"
                >
                  <span>{dict.product.specsTitle}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#111111] transition-transform ${
                      openSpecs ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openSpecs && (
                  <div className="pb-5 space-y-3">
                    {product.characteristics.length === 0 ? (
                      <p className="text-sm text-[#555555]">
                        {dict.product.specsEmpty}
                      </p>
                    ) : (
                      <dl className="divide-y divide-[#F2F2F2] border-t border-[#F2F2F2]">
                        {product.characteristics.map((char) => (
                          <div
                            key={char.id}
                            className="py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-3 text-xs sm:text-sm"
                          >
                            <dt className="sm:col-span-5 font-semibold text-[#111111]">
                              {resolveTranslation(char.label, locale)}
                            </dt>
                            <dd className="sm:col-span-7 text-[#555555] sm:text-right">
                              {resolveTranslation(char.value, locale)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <p className="text-[11px] text-[#777777] leading-snug pt-1">
                      {dict.product.specsNotice}
                    </p>
                  </div>
                )}
              </div>

              {/* 2. Description & Materials */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenCraft((v) => !v)}
                  aria-expanded={openCraft}
                  className="w-full py-4 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#111111]"
                >
                  <span>{dict.product.accordionCraft}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#111111] transition-transform ${
                      openCraft ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openCraft && (
                  <p className="pb-5 text-sm text-[#555555] leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {/* 3. Delivery, Payment & Currency */}
              <div className="border-b border-[#EAEAEA]">
                <button
                  type="button"
                  onClick={() => setOpenOrder((v) => !v)}
                  aria-expanded={openOrder}
                  className="w-full py-4 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#111111]"
                >
                  <span>{dict.product.accordionOrder}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#111111] transition-transform ${
                      openOrder ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openOrder && (
                  <div className="pb-5 space-y-2 text-xs text-[#555555] leading-relaxed">
                    <p>{dict.currency.approxNote}</p>
                    <p>{dict.demo.indicativePriceHint}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Models (105.Store short black underline rule + 4-Col Grid) */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#EAEAEA]">
            <div className="mb-8 space-y-2.5">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111111]">
                {dict.product.relatedTitle}
              </h2>
              <div className="w-9 h-[2px] bg-[#111111]" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
              {relatedProducts.map((rel, idx) => (
                <RevealCard key={rel.id} index={idx} columns={4}>
                  <ProductCard
                    product={rel}
                    locale={locale}
                    dict={dict}
                  />
                </RevealCard>
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed (Exact 105.Store 3-Column Compact Horizontal Mini-Cards) */}
        {recentlyViewedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#EAEAEA]">
            <div className="mb-7 space-y-2.5">
              <h2 className="font-display text-2xl font-bold text-[#111111]">
                {dict.product.recentlyViewedTitle}
              </h2>
              <div className="w-9 h-[2px] bg-[#111111]" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentlyViewedProducts.map((recent) => {
                const firstVar = recent.variants[0];
                const recentImg = firstVar?.images[0];
                const recentName = resolveTranslation(recent.name, locale);
                const recentColor = firstVar
                  ? resolveTranslation(firstVar.colorName, locale)
                  : '';
                const recentPrice = formatDisplayPrice(
                  recent.basePricePln,
                  activeCurrency,
                  locale,
                  dict.currency.approxPrefix
                );

                return (
                  <Link
                    key={recent.id}
                    href={`/${locale}/product/${recent.slug}`}
                    className="group flex items-center gap-4 p-3 rounded-[10px] bg-[#FAFAFA] hover:bg-[#F2F2F2] border border-[#EFEFEF] transition-colors"
                  >
                    <div className="relative w-[84px] h-[100px] rounded-[8px] overflow-hidden bg-white shrink-0">
                      {recentImg ? (
                        <Image
                          src={recentImg.url}
                          alt={recentName}
                          fill
                          sizes="90px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span
                          className="block w-full h-full"
                          style={{ backgroundColor: firstVar?.colorHex ?? '#E5E5E5' }}
                        />
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-[#111111] group-hover:text-[#555555] line-clamp-2 transition-colors">
                        {recentName}
                      </p>
                      <p className="text-xs text-[#666666] truncate">
                        {recentColor}
                      </p>
                      <p className="text-sm font-bold text-[#111111] pt-1 tabular-nums">
                        {recentPrice.formatted}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Matte Black Sticky Bottom Quick-Buy Bar */}
      {showStickyBar && (
        <div className="fixed inset-x-0 bottom-0 z-30 bg-[#0B0B0B]/95 backdrop-blur-md text-white border-t border-white/12 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {primaryImage && (
                <div className="relative w-10 h-12 rounded-[6px] overflow-hidden bg-white shrink-0 hidden sm:block">
                  <Image
                    src={primaryImage.url}
                    alt={name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-display text-sm sm:text-base font-bold truncate">
                  {name}
                </p>
                <p className="text-xs text-[#A8A8A8] truncate">{colorName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <select
                aria-label={dict.product.colorSelectLabel}
                value={variant.id}
                onChange={(e) => handleSelectColor(e.target.value)}
                className="hidden md:block px-3.5 py-2 rounded-full bg-[#1C1C1C] border border-white/20 text-xs text-white max-w-[260px]"
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id} className="text-[#111111]">
                    {resolveTranslation(v.colorName, locale)}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddToBag}
                className="px-6 sm:px-7 py-2.5 rounded-full bg-white hover:bg-[#E5E5E5] text-[#111111] text-xs font-bold uppercase tracking-[0.16em] transition-colors"
              >
                {dict.product.stickyAdd}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
