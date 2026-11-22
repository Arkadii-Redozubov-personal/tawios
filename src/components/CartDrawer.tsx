'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { resolveTranslation, type Dictionary } from '@/i18n';
import { buildCheckoutTotals, formatDisplayPrice } from '@/lib/currency';
import { useStore } from '@/components/StoreProvider';
import type { Locale } from '@/lib/types';

interface CartDrawerProps {
  locale: Locale;
  dict: Dictionary;
}

export function CartDrawer({ locale, dict }: CartDrawerProps) {
  const {
    products,
    cart,
    isCartOpen,
    setCartOpen,
    updateCartQty,
    removeFromCart,
    activeCurrency,
    plnCurrency,
  } = useStore();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isCartOpen) setCartOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isCartOpen, setCartOpen]);

  if (!isCartOpen) return null;

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
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={dict.cart.drawerTitle}
    >
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[6px]"
        onClick={() => setCartOpen(false)}
      />
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl border-l border-[#EAEAEA] flex flex-col">
        <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#111111]" strokeWidth={1.6} />
            <h2 className="font-display text-xl font-bold text-[#111111]">
              {dict.cart.drawerTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label={dict.nav.menuClose}
            className="p-2 rounded-full text-[#111111] hover:bg-[#F4F4F4] transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.6} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {resolvedItems.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F4F4F4] flex items-center justify-center">
                <ShoppingBag
                  className="w-7 h-7 text-[#666666]"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-display text-xl text-[#111111]">
                {dict.cart.emptyTitle}
              </h3>
              <p className="text-sm text-[#555555] max-w-xs mx-auto">
                {dict.cart.emptySubtitle}
              </p>
              <Link
                href={`/${locale}/shop`}
                onClick={() => setCartOpen(false)}
                className="inline-block px-7 py-3 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
              >
                {dict.cart.goToShop}
              </Link>
            </div>
          ) : (
            resolvedItems.map((row) => {
              const name = resolveTranslation(row.product.name, locale);
              const colorName = resolveTranslation(row.variant.colorName, locale);
              const primaryImage = row.variant.images[0];
              const lineDisplay = formatDisplayPrice(
                row.unitPricePln * row.quantity,
                activeCurrency,
                locale,
                dict.currency.approxPrefix
              );

              return (
                <div
                  key={`${row.productId}-${row.variantId}`}
                  className="flex gap-4 pb-5 border-b border-[#F0F0F0]"
                >
                  <div className="w-20 h-24 rounded-[10px] bg-[#F5F5F5] overflow-hidden shrink-0 flex items-center justify-center">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={resolveTranslation(primaryImage.alt, locale) || name}
                        width={80}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="w-8 h-8 rounded-full border border-[#111111]"
                        style={{ backgroundColor: row.variant.colorHex }}
                        aria-label={colorName}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/${locale}/product/${row.product.slug}?color=${row.variantId}`}
                        onClick={() => setCartOpen(false)}
                        className="font-semibold text-sm text-[#111111] hover:text-[#555555] line-clamp-2 transition-colors"
                      >
                        {name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(row.productId, row.variantId)}
                        aria-label={dict.cart.remove}
                        className="p-1.5 rounded-full text-[#666666] hover:text-[#111111] hover:bg-[#F4F4F4] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.6} />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-[#666666]">
                      <span
                        className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: row.variant.colorHex }}
                      />
                      <span className="truncate">{colorName}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-[#E0E0E0] bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty(
                              row.productId,
                              row.variantId,
                              row.quantity - 1
                            )
                          }
                          disabled={row.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="p-1.5 text-[#111111] disabled:opacity-35"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold tabular-nums">
                          {row.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty(
                              row.productId,
                              row.variantId,
                              row.quantity + 1
                            )
                          }
                          disabled={row.quantity >= 10}
                          aria-label="Increase quantity"
                          className="p-1.5 text-[#111111] disabled:opacity-35"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-[#111111] tabular-nums">
                        {lineDisplay.formatted}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {resolvedItems.length > 0 && (
          <div className="p-6 border-t border-[#EAEAEA] bg-[#FAFAFA] space-y-4">
            <p className="text-xs text-[#666666]">{dict.cart.demoNote}</p>
            <div className="space-y-1.5 tabular-nums">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#555555]">{dict.cart.subtotalPln}</span>
                <span className="font-bold text-[#111111] text-base">
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

            <div className="grid grid-cols-1 gap-2.5">
              <Link
                href={`/${locale}/checkout`}
                onClick={() => setCartOpen(false)}
                className="w-full py-3.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] text-center transition-colors"
              >
                {dict.cart.checkoutBtn}
              </Link>
              <Link
                href={`/${locale}/cart`}
                onClick={() => setCartOpen(false)}
                className="w-full py-3 rounded-full border border-[#111111] bg-white hover:bg-[#F4F4F4] text-[#111111] text-xs font-semibold uppercase tracking-[0.14em] text-center transition-colors"
              >
                {dict.cart.title}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
