'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';
import { resolveTranslation, type Dictionary } from '@/i18n';
import { buildCheckoutTotals, formatCurrencyAmount } from '@/lib/currency';
import type { DemoOrder, Locale, OrderMode } from '@/lib/types';
import { useStore } from '@/components/StoreProvider';

interface CheckoutViewProps {
  locale: Locale;
  dict: Dictionary;
  initialMode?: string;
}

export function CheckoutView({
  locale,
  dict,
  initialMode,
}: CheckoutViewProps) {
  const {
    products,
    cart,
    clearCart,
    recordDemoOrder,
    demoProfile,
    activeCurrency,
    plnCurrency,
  } = useStore();

  const [orderMode, setOrderMode] = useState<OrderMode>(
    initialMode === 'request' ? 'request' : 'online_demo'
  );
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'blik' | 'wallet'>(
    'card'
  );

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!fullName && demoProfile.fullName) setFullName(demoProfile.fullName);
    if (!email && demoProfile.email) setEmail(demoProfile.email);
    if (!phone && demoProfile.phone) setPhone(demoProfile.phone);
    if (!country && demoProfile.country) setCountry(demoProfile.country);
    if (!city && demoProfile.city) setCity(demoProfile.city);
    if (!postalCode && demoProfile.postalCode) setPostalCode(demoProfile.postalCode);
    if (!address && demoProfile.address) setAddress(demoProfile.address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoProfile]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<DemoOrder | null>(null);

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

  function validateForm(): Record<string, string> {
    const next: Record<string, string> = {};
    if (resolvedItems.length === 0) {
      next.cart = dict.checkout.errors.emptyCart;
    }
    if (fullName.trim().length < 2) {
      next.fullName = dict.checkout.errors.fullName;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = dict.checkout.errors.email;
    }
    if (phone.trim().length < 4) {
      next.phone = dict.checkout.errors.phone;
    }
    if (orderMode === 'online_demo') {
      if (country.trim().length < 2) next.country = dict.checkout.errors.country;
      if (city.trim().length < 2) next.city = dict.checkout.errors.city;
      if (postalCode.trim().length < 2) next.postalCode = dict.checkout.errors.postalCode;
      if (address.trim().length < 4) next.address = dict.checkout.errors.address;
    }
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const fieldErrors = validateForm();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderMode,
          locale,
          displayCurrency: activeCurrency.code,
          displayRateHint: activeCurrency.rateFromPln,
          paymentMethodDemo: orderMode === 'online_demo' ? paymentMethod : undefined,
          customer: {
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            country: orderMode === 'online_demo' ? country.trim() : undefined,
            city: orderMode === 'online_demo' ? city.trim() : undefined,
            postalCode: orderMode === 'online_demo' ? postalCode.trim() : undefined,
            address: orderMode === 'online_demo' ? address.trim() : undefined,
            comment: comment.trim() || undefined,
          },
          items: resolvedItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        order?: DemoOrder;
      };

      if (response.ok && data.ok && data.order) {
        recordDemoOrder(data.order);
        clearCart();
        setCompletedOrder(data.order);
      } else {
        setErrors({ form: dict.checkout.validationHeading });
      }
    } catch {
      setErrors({ form: dict.checkout.validationHeading });
    } finally {
      setSubmitting(false);
    }
  }

  if (completedOrder) {
    return (
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="rounded-[14px] bg-[#FAFAFA] border border-[#EAEAEA] p-6 sm:p-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111] text-white text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-white shrink-0" />
              <span>{dict.checkout.successBadge}</span>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-7 h-7 text-[#111111] shrink-0 mt-0.5" />
              <div>
                <h1 className="font-display text-3xl font-bold text-[#111111]">
                  {dict.checkout.successTitle}
                </h1>
                <p className="mt-1 text-sm font-semibold text-[#555555] tabular-nums">
                  {dict.checkout.successOrderNumber} {completedOrder.orderNumber}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#555555] leading-relaxed">
              {dict.checkout.successDetails}
            </p>

            <div className="rounded-[10px] bg-white border border-[#EAEAEA] p-4 space-y-3">
              {completedOrder.items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div>
                    <p className="font-semibold text-[#111111]">
                      {item.productName} × {item.quantity}
                    </p>
                    <p className="text-xs text-[#666666] flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span>{item.colorName}</span>
                    </p>
                  </div>
                  <span className="font-semibold tabular-nums">
                    {formatCurrencyAmount(item.lineTotalPln, plnCurrency, locale)}
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-sm font-bold tabular-nums">
                <span>{dict.currency.exactPlnLabel}</span>
                <span>
                  {formatCurrencyAmount(completedOrder.baseTotalPln, plnCurrency, locale)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={`/${locale}/account`}
                className="px-7 py-3.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
              >
                {dict.checkout.viewInAdmin}
              </Link>
              <Link
                href={`/${locale}/shop`}
                className="px-7 py-3.5 rounded-full border border-[#111111] bg-white hover:bg-[#F4F4F4] text-[#111111] text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
              >
                {dict.checkout.backToShop}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="bg-[#FAFAFA] border-b border-[#EAEAEA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-3">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#111111]">
            {dict.checkout.title}
          </h1>
          <p className="text-sm text-[#555555] max-w-2xl">
            {dict.checkout.demoNoticeBody}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-2.5">
              <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#111111]">
                {dict.checkout.modeLabel}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderMode('request')}
                  aria-pressed={orderMode === 'request'}
                  className={`p-4 rounded-[10px] border text-left text-xs sm:text-sm font-semibold transition-colors ${
                    orderMode === 'request'
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#111111] border-[#E0E0E0] hover:border-[#111111]'
                  }`}
                >
                  {dict.checkout.modeRequest}
                </button>
                <button
                  type="button"
                  onClick={() => setOrderMode('online_demo')}
                  aria-pressed={orderMode === 'online_demo'}
                  className={`p-4 rounded-[10px] border text-left text-xs sm:text-sm font-semibold transition-colors ${
                    orderMode === 'online_demo'
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#111111] border-[#E0E0E0] hover:border-[#111111]'
                  }`}
                >
                  {dict.checkout.modeOnlineDemo}
                </button>
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <div
                role="alert"
                className="rounded-[10px] bg-[#F7F7F7] border border-[#111111] p-4 text-xs sm:text-sm text-[#111111] space-y-1"
              >
                <div className="flex items-center gap-2 font-semibold text-[#111111]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{dict.checkout.validationHeading}</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 text-[#555555]">
                  {Object.values(errors).map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="co-fullname"
                  className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                >
                  {dict.checkout.fieldFullName} *
                </label>
                <input
                  id="co-fullname"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-[#111111] font-medium">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="co-email"
                  className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                >
                  {dict.checkout.fieldEmail} *
                </label>
                <input
                  id="co-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-[#111111] font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="co-phone"
                  className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                >
                  {dict.checkout.fieldPhone} *
                </label>
                <input
                  id="co-phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-[#111111] font-medium">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {orderMode === 'online_demo' && (
              <div className="space-y-4 pt-3 border-t border-[#EAEAEA]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="co-country"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                    >
                      {dict.checkout.fieldCountry} *
                    </label>
                    <input
                      id="co-country"
                      name="country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="co-city"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                    >
                      {dict.checkout.fieldCity} *
                    </label>
                    <input
                      id="co-city"
                      name="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="co-postal"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                    >
                      {dict.checkout.fieldPostalCode} *
                    </label>
                    <input
                      id="co-postal"
                      name="postalCode"
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="co-address"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                    >
                      {dict.checkout.fieldAddress} *
                    </label>
                    <input
                      id="co-address"
                      name="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]">
                    {dict.checkout.paymentMethodLabel}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      [
                        ['card', dict.checkout.paymentCard],
                        ['blik', dict.checkout.paymentBlik],
                        ['wallet', dict.checkout.paymentWallet],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPaymentMethod(id)}
                        aria-pressed={paymentMethod === id}
                        className={`px-3.5 py-3 rounded-[10px] border text-left text-xs font-medium flex items-start gap-2 transition-colors ${
                          paymentMethod === id
                            ? 'border-[#111111] bg-[#F5F5F5] text-[#111111] ring-1 ring-[#111111]'
                            : 'border-[#E0E0E0] bg-white text-[#555555]'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 shrink-0 text-[#111111] mt-0.5" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="co-comment"
                className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
              >
                {dict.checkout.fieldComment}
              </label>
              <textarea
                id="co-comment"
                name="comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm focus:border-[#111111]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#111111] hover:bg-[#333333] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-[0.18em] transition-colors"
            >
              {submitting
                ? dict.checkout.submitting
                : orderMode === 'request'
                  ? dict.checkout.submitRequest
                  : dict.checkout.submitOnlineDemo}
            </button>
          </form>

          <aside className="lg:col-span-5 rounded-[14px] bg-[#FAFAFA] border border-[#EAEAEA] p-6 space-y-5">
            <h2 className="font-display text-2xl font-bold text-[#111111]">
              {dict.checkout.summaryTitle}
            </h2>

            {resolvedItems.length === 0 ? (
              <div className="space-y-3 text-sm text-[#555555]">
                <p>{dict.cart.emptyTitle}</p>
                <Link
                  href={`/${locale}/shop`}
                  className="inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] underline underline-offset-4"
                >
                  {dict.cart.goToShop}
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3 divide-y divide-[#EAEAEA]">
                  {resolvedItems.map((row) => (
                    <div
                      key={`${row.productId}-${row.variantId}`}
                      className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#111111] truncate">
                          {resolveTranslation(row.product.name, locale)} ×{' '}
                          {row.quantity}
                        </p>
                        <p className="text-xs text-[#666666] flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: row.variant.colorHex }}
                          />
                          <span className="truncate">
                            {resolveTranslation(row.variant.colorName, locale)}
                          </span>
                        </p>
                      </div>
                      <span className="font-semibold text-[#111111] tabular-nums shrink-0">
                        {formatCurrencyAmount(
                          row.unitPricePln * row.quantity,
                          plnCurrency,
                          locale
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="rounded-[10px] bg-white border border-[#EAEAEA] p-4 space-y-2.5 tabular-nums">
                  {totals.isConvertedEstimate && (
                    <div className="flex items-center justify-between text-xs text-[#666666]">
                      <span>{dict.currency.estimatedDisplayLabel}</span>
                      <span className="font-semibold text-[#111111]">
                        {totals.displayFormatted} ({totals.displayCurrency})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm font-bold text-[#111111] pt-1 border-t border-[#F0F0F0]">
                    <span>{dict.currency.exactPlnLabel}</span>
                    <span className="text-lg text-[#111111]">
                      {totals.settlementFormatted}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#666666] leading-snug pt-1">
                    {dict.currency.settlementLabel}:{' '}
                    <strong className="text-[#111111]">PLN</strong>.{' '}
                    {dict.currency.approxNote}
                  </p>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
