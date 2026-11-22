'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { resolveTranslation, type Dictionary } from '@/i18n';
import { buildCheckoutTotals, formatDisplayPrice } from '@/lib/currency';
import { useStore } from '@/components/StoreProvider';
import type { Locale } from '@/lib/types';

export function CartPageView({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const {
    products,
    cart,
    updateCartQty,
    removeFromCart,
    activeCurrency,
    plnCurrency,
  } = useStore();

  const resolvedItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (!product || !variant) return null;
      return {
        ...item,
        product,
        variant,
        unitPricePln: product.basePricePln,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const totals = buildCheckoutTotals(
    resolvedItems,
    activeCurrency,
    plnCurrency,
    locale,
    dict.currency.approxPrefix
  );

  return (
    <div className="bg-white">
      <div className="bg-[#FAFAFA] border-b border-[#EAEAEA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#111111]">
            {dict.cart.title}
          </h1>
          <p className="mt-2 text-sm text-[#555555]">{dict.cart.demoNote}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {resolvedItems.length === 0 ? (
          <div className="py-16 px-6 rounded-[14px] bg-[#FAFAFA] border border-[#EAEAEA] text-center space-y-4">
            <ShoppingBag
              className="w-10 h-10 mx-auto text-[#111111]"
              strokeWidth={1.4}
            />
            <h2 className="font-display text-2xl font-bold text-[#111111]">
              {dict.cart.emptyTitle}
            </h2>
            <p className="text-sm text-[#555555] max-w-md mx-auto">
              {dict.cart.emptySubtitle}
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 divide-y divide-[#EAEAEA] border-y border-[#EAEAEA]">
              {resolvedItems.map((row) => {
                const name = resolveTranslation(row.product.name, locale);
                const colorName = resolveTranslation(row.variant.colorName, locale);
                const img = row.variant.images[0];
                const lineDisplay = formatDisplayPrice(
                  row.unitPricePln * row.quantity,
                  activeCurrency,
                  locale,
                  dict.currency.approxPrefix
                );

                return (
                  <div
                    key={`${row.productId}-${row.variantId}`}
                    className="flex gap-4 py-5 bg-white"
                  >
                    <div className="w-24 h-28 rounded-[10px] bg-[#F5F5F5] overflow-hidden shrink-0 flex items-center justify-center">
                      {img ? (
                        <Image
                          src={img.url}
                          alt={resolveTranslation(img.alt, locale) || name}
                          width={96}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span
                          className="w-10 h-10 rounded-full border border-[#111111]"
                          style={{ backgroundColor: row.variant.colorHex }}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/${locale}/product/${row.product.slug}?color=${row.variantId}`}
                            className="font-display text-lg font-bold text-[#111111] hover:text-[#555555]"
                          >
                            {name}
                          </Link>
                          <p className="text-xs text-[#666666] flex items-center gap-1.5 mt-1">
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: row.variant.colorHex }}
                            />
                            <span>
                              {dict.cart.colorLabel} {colorName}
                            </span>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(row.productId, row.variantId)}
                          aria-label={dict.cart.remove}
                          className="p-1.5 rounded-full text-[#666666] hover:text-[#111111] hover:bg-[#F4F4F4]"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-3">
                        <div className="inline-flex items-center rounded-full border border-[#E0E0E0]">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQty(row.productId, row.variantId, row.quantity - 1)
                            }
                            disabled={row.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="p-2 text-[#111111] disabled:opacity-35"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-semibold tabular-nums">
                            {row.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQty(row.productId, row.variantId, row.quantity + 1)
                            }
                            disabled={row.quantity >= 10}
                            aria-label="Increase quantity"
                            className="p-2 text-[#111111] disabled:opacity-35"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-base font-semibold text-[#111111] tabular-nums">
                          {lineDisplay.formatted}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="lg:col-span-5 rounded-[14px] bg-[#FAFAFA] border border-[#EAEAEA] p-6 space-y-5">
              <h2 className="font-display text-2xl font-bold text-[#111111]">
                {dict.checkout.summaryTitle}
              </h2>

              <div className="space-y-2.5 text-sm tabular-nums border-b border-[#EAEAEA] pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#555555]">{dict.currency.exactPlnLabel}</span>
                  <span className="text-lg font-bold text-[#111111]">
                    {totals.settlementFormatted}
                  </span>
                </div>
                {totals.isConvertedEstimate && (
                  <div className="flex items-center justify-between text-xs text-[#666666]">
                    <span>{dict.currency.estimatedDisplayLabel}</span>
                    <span className="font-semibold text-[#111111]">
                      {totals.displayFormatted}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-[#555555] leading-relaxed">
                {dict.currency.approxNote}
              </p>

              <div className="space-y-2.5">
                <Link
                  href={`/${locale}/checkout`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                >
                  <span>{dict.cart.checkoutBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/${locale}/shop`}
                  className="w-full block py-3 rounded-full border border-[#111111] bg-white hover:bg-[#F4F4F4] text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition-colors"
                >
                  {dict.cart.continueShopping}
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
