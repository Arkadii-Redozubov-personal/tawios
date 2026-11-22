'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { resolveTranslation, type Dictionary } from '@/i18n';
import type { Locale } from '@/lib/types';
import { useStore } from '@/components/StoreProvider';
import { PriceDisplay } from '@/components/PriceDisplay';
import { RevealCard } from '@/components/RevealCard';

export function WishlistView({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const {
    products,
    wishlist,
    removeFromWishlist,
    clearWishlist,
    addToCart,
    setCartOpen,
  } = useStore();

  const resolvedWishlist = wishlist
    .map((entry) => {
      const product = products.find(
        (p) => p.id === entry.productId && p.status === 'published'
      );
      const variant =
        product?.variants.find((v) => v.id === entry.variantId) ??
        product?.variants[0];
      if (!product || !variant) return null;
      return { entry, product, variant };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="bg-white">
      <div className="bg-[#FAFAFA] border-b border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#111111]">
              {dict.wishlist.title}
            </h1>
            <p className="text-sm sm:text-base text-[#555555]">
              {dict.wishlist.subtitle}
            </p>
          </div>
          {resolvedWishlist.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="self-start sm:self-auto px-5 py-2.5 rounded-full border border-[#111111] bg-white hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
            >
              {dict.wishlist.clearAll}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {resolvedWishlist.length === 0 ? (
          <div className="max-w-lg mx-auto py-14 px-6 rounded-[14px] bg-[#FAFAFA] border border-[#EAEAEA] text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-white border border-[#EAEAEA] flex items-center justify-center">
              <Heart className="w-7 h-7 text-[#111111]" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#111111]">
              {dict.wishlist.emptyTitle}
            </h2>
            <p className="text-sm text-[#555555] leading-relaxed">
              {dict.wishlist.emptySubtitle}
            </p>
            <Link
              href={`/${locale}/shop`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
            >
              <span>{dict.cart.goToShop}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resolvedWishlist.map(({ entry, product, variant }, idx) => {
              const name = resolveTranslation(product.name, locale);
              const colorName = resolveTranslation(variant.colorName, locale);
              const img = variant.images[0];
              const href = `/${locale}/product/${product.slug}?color=${encodeURIComponent(variant.id)}`;

              return (
                <RevealCard
                  key={`${entry.productId}-${entry.variantId}`}
                  index={idx}
                  columns={4}
                  direction="left"
                  speed="fast"
                >
                  <article className="group flex flex-col h-full">
                  <div className="relative aspect-[4/5] rounded-[10px] overflow-hidden bg-[#F5F5F5]">
                    <Link href={href} className="block w-full h-full relative">
                      {img ? (
                        <Image
                          src={img.url}
                          alt={resolveTranslation(img.alt, locale) || name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover tawios-zoom-media tawios-zoom-target"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span
                            className="w-12 h-12 rounded-full border border-[#111111]"
                            style={{ backgroundColor: variant.colorHex }}
                          />
                        </div>
                      )}
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFromWishlist(entry.productId, entry.variantId)}
                      aria-label={dict.shop.removeFromWishlist}
                      title={dict.shop.removeFromWishlist}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center text-[#111111] hover:text-[#555555] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.7} />
                    </button>
                  </div>

                  <div className="pt-3.5 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <Link
                        href={href}
                        className="font-sans text-[15px] font-semibold text-[#111111] hover:text-[#555555] transition-colors block"
                      >
                        {name}
                      </Link>
                      <p className="text-xs text-[#666666] flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: variant.colorHex }}
                        />
                        <span className="truncate">{colorName}</span>
                      </p>
                      <div className="pt-1">
                        <PriceDisplay
                          basePricePln={product.basePricePln}
                          locale={locale}
                          dict={dict}
                          size="sm"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product.id, product.slug, variant.id, 1);
                        setCartOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.8} />
                      <span>{dict.wishlist.moveToBag}</span>
                    </button>
                  </div>
                </article>
                </RevealCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
