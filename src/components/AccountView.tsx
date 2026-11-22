'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Heart,
  Package,
  ShoppingBag,
  User,
} from 'lucide-react';
import { LOCALE_META, LOCALES } from '@/i18n/config';
import { buildLocalizedPath, resolveTranslation, type Dictionary } from '@/i18n';
import { formatCurrencyAmount } from '@/lib/currency';
import type { Locale } from '@/lib/types';
import { useStore } from '@/components/StoreProvider';

type AccountTab = 'profile' | 'wishlist' | 'orders';

export function AccountView({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const router = useRouter();
  const {
    products,
    wishlist,
    orders,
    demoProfile,
    updateDemoProfile,
    activeCurrencies,
    activeCurrency,
    plnCurrency,
    setActiveCurrencyCode,
    addToCart,
    setCartOpen,
    removeFromWishlist,
  } = useStore();

  const [tab, setTab] = useState<AccountTab>('profile');
  const [fullName, setFullName] = useState(demoProfile.fullName);
  const [email, setEmail] = useState(demoProfile.email);
  const [phone, setPhone] = useState(demoProfile.phone);
  const [country, setCountry] = useState(demoProfile.country);
  const [city, setCity] = useState(demoProfile.city);
  const [postalCode, setPostalCode] = useState(demoProfile.postalCode);
  const [address, setAddress] = useState(demoProfile.address);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setFullName(demoProfile.fullName);
    setEmail(demoProfile.email);
    setPhone(demoProfile.phone);
    setCountry(demoProfile.country);
    setCity(demoProfile.city);
    setPostalCode(demoProfile.postalCode);
    setAddress(demoProfile.address);
  }, [demoProfile]);

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

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    updateDemoProfile({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: country.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      address: address.trim(),
    });
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 3500);
  }

  return (
    <div className="bg-white">
      {/* Clean Monochrome Header */}
      <div className="bg-[#FAFAFA] border-b border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-2.5">
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#111111]">
            {dict.account.title}
          </h1>
          <p className="text-sm sm:text-base text-[#555555] max-w-3xl">
            {dict.account.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: Clean Tabs & Preferences (Zero Admin Shortcut) */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="rounded-[12px] border border-[#EAEAEA] bg-[#FAFAFA] p-2 space-y-1">
              {(
                [
                  { id: 'profile', label: dict.account.tabProfile, icon: User, count: null },
                  {
                    id: 'wishlist',
                    label: dict.account.tabWishlist,
                    icon: Heart,
                    count: resolvedWishlist.length,
                  },
                  {
                    id: 'orders',
                    label: dict.account.tabOrders,
                    icon: Package,
                    count: orders.length,
                  },
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    aria-pressed={active}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-[10px] text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-[#111111] text-white'
                        : 'text-[#111111] hover:bg-white'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Icon className="w-4 h-4" strokeWidth={1.7} />
                      <span>{item.label}</span>
                    </span>
                    {item.count !== null && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs tabular-nums ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-[#E8E8E8] text-[#111111]'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="rounded-[12px] border border-[#EAEAEA] bg-white p-5 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#666666]">
                {dict.account.preferencesTitle}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {LOCALES.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => router.push(buildLocalizedPath(`/${locale}/account`, loc))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      loc === locale
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#111111] border-[#E0E0E0] hover:border-[#111111]'
                    }`}
                  >
                    {LOCALE_META[loc].shortCode}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#F0F0F0]">
                {activeCurrencies.map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => setActiveCurrencyCode(curr.code)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border tabular-nums transition-colors ${
                      curr.code === activeCurrency.code
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#111111] border-[#E0E0E0] hover:border-[#111111]'
                    }`}
                  >
                    {curr.code} ({curr.symbol})
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <div className="lg:col-span-8">
            {tab === 'profile' && (
              <div className="rounded-[14px] border border-[#EAEAEA] bg-white p-6 sm:p-8 space-y-6">
                <div className="space-y-1.5 border-b border-[#F0F0F0] pb-4">
                  <h2 className="font-display text-2xl font-bold text-[#111111]">
                    {dict.account.tabProfile}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#555555]">
                    {dict.account.guestNote}
                  </p>
                </div>

                {savedNotice && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-[10px] bg-[#F5F5F5] border border-[#111111] text-xs sm:text-sm font-semibold text-[#111111]">
                    <CheckCircle2 className="w-4 h-4 text-[#111111] shrink-0" />
                    <span>{dict.account.savedMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="prof-name"
                        className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                      >
                        {dict.checkout.fieldFullName}
                      </label>
                      <input
                        id="prof-name"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="prof-email"
                        className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                      >
                        {dict.checkout.fieldEmail}
                      </label>
                      <input
                        id="prof-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="prof-phone"
                        className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                      >
                        {dict.checkout.fieldPhone}
                      </label>
                      <input
                        id="prof-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="prof-country"
                        className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                      >
                        {dict.checkout.fieldCountry}
                      </label>
                      <input
                        id="prof-country"
                        name="country"
                        type="text"
                        autoComplete="country-name"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="prof-city"
                        className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                      >
                        {dict.checkout.fieldCity}
                      </label>
                      <input
                        id="prof-city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="prof-postal"
                        className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                      >
                        {dict.checkout.fieldPostalCode}
                      </label>
                      <input
                        id="prof-postal"
                        name="postalCode"
                        type="text"
                        autoComplete="postal-code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="prof-address"
                        className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                      >
                        {dict.checkout.fieldAddress}
                      </label>
                      <input
                        id="prof-address"
                        name="address"
                        type="text"
                        autoComplete="street-address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                    >
                      {dict.account.saveProfile}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {tab === 'wishlist' && (
              <div className="rounded-[14px] border border-[#EAEAEA] bg-white p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-[#F0F0F0] pb-4">
                  <h2 className="font-display text-2xl font-bold text-[#111111]">
                    {dict.wishlist.title}
                  </h2>
                  <Link
                    href={`/${locale}/wishlist`}
                    className="text-xs font-semibold text-[#111111] hover:text-[#555555] underline underline-offset-4"
                  >
                    {dict.home.featuredAction}
                  </Link>
                </div>

                {resolvedWishlist.length === 0 ? (
                  <div className="py-10 text-center space-y-3">
                    <Heart className="w-8 h-8 mx-auto text-[#666666]" strokeWidth={1.5} />
                    <p className="text-sm font-semibold text-[#111111]">
                      {dict.wishlist.emptyTitle}
                    </p>
                    <p className="text-xs text-[#555555] max-w-sm mx-auto">
                      {dict.wishlist.emptySubtitle}
                    </p>
                    <Link
                      href={`/${locale}/shop`}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                    >
                      <span>{dict.cart.goToShop}</span>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F0F0F0]">
                    {resolvedWishlist.map(({ entry, product, variant }) => {
                      const img = variant.images[0];
                      const name = resolveTranslation(product.name, locale);
                      const colorName = resolveTranslation(variant.colorName, locale);
                      return (
                        <div
                          key={`${entry.productId}-${entry.variantId}`}
                          className="py-4 first:pt-0 last:pb-0 flex items-center gap-4"
                        >
                          <div className="relative w-16 h-20 rounded-[8px] overflow-hidden bg-[#F5F5F5] shrink-0">
                            {img ? (
                              <Image
                                src={img.url}
                                alt={name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <span
                                className="block w-full h-full"
                                style={{ backgroundColor: variant.colorHex }}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/${locale}/product/${product.slug}?color=${encodeURIComponent(variant.id)}`}
                              className="font-semibold text-sm text-[#111111] hover:text-[#555555] truncate block"
                            >
                              {name}
                            </Link>
                            <p className="text-xs text-[#666666] truncate mt-0.5">
                              {colorName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                addToCart(product.id, product.slug, variant.id, 1);
                                setCartOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold transition-colors"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{dict.wishlist.moveToBag}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                removeFromWishlist(entry.productId, entry.variantId)
                              }
                              className="px-3 py-2 rounded-full border border-[#E0E0E0] hover:border-[#111111] text-xs font-medium text-[#555555] hover:text-[#111111] transition-colors"
                            >
                              {dict.cart.remove}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {tab === 'orders' && (
              <div className="rounded-[14px] border border-[#EAEAEA] bg-white p-6 sm:p-8 space-y-6">
                <h2 className="font-display text-2xl font-bold text-[#111111] border-b border-[#F0F0F0] pb-4">
                  {dict.account.tabOrders}
                </h2>

                {orders.length === 0 ? (
                  <div className="py-10 text-center space-y-3">
                    <Package className="w-8 h-8 mx-auto text-[#666666]" strokeWidth={1.5} />
                    <p className="text-sm font-semibold text-[#111111]">
                      {dict.account.noOrdersTitle}
                    </p>
                    <p className="text-xs text-[#555555] max-w-sm mx-auto">
                      {dict.account.noOrdersSubtitle}
                    </p>
                    <Link
                      href={`/${locale}/shop`}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                    >
                      <span>{dict.cart.goToShop}</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-[12px] border border-[#EAEAEA] bg-[#FAFAFA] p-5 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EAEAEA]">
                          <div>
                            <p className="text-sm font-bold text-[#111111] tabular-nums">
                              {order.orderNumber}
                            </p>
                            <p className="text-xs text-[#666666]">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-[#111111] text-white text-[11px] font-semibold uppercase tracking-[0.12em]">
                            {order.fulfillmentStatus}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={`${item.productId}-${item.variantId}`}
                              className="flex items-center justify-between text-xs sm:text-sm"
                            >
                              <span className="text-[#111111]">
                                {item.productName} ({item.colorName}) × {item.quantity}
                              </span>
                              <span className="font-semibold text-[#111111] tabular-nums">
                                {formatCurrencyAmount(item.lineTotalPln, plnCurrency, locale)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-[#EAEAEA] flex items-center justify-between text-sm font-bold text-[#111111] tabular-nums">
                          <span>{dict.currency.exactPlnLabel}</span>
                          <span>
                            {formatCurrencyAmount(order.baseTotalPln, plnCurrency, locale)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
