import { LOCALE_META } from '@/i18n/config';
import type { CurrencyConfig, Locale, RoundingRule } from '@/lib/types';

export interface ConvertedPrice {
  amount: number;
  formatted: string;
  currencyCode: string;
  isConvertedEstimate: boolean;
}

export interface CheckoutTotals {
  baseTotalPln: number;
  settlementCurrency: 'PLN';
  settlementFormatted: string;
  displayCurrency: string;
  displayAmount: number;
  displayFormatted: string;
  isConvertedEstimate: boolean;
}

export function applyRounding(value: number, rule: RoundingRule): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  switch (rule) {
    case 'whole':
      return Math.round(value);
    case 'nearest5':
      return Math.round(value / 5) * 5;
    case 'exact':
      return Math.round(value * 100) / 100;
  }
}

export function convertFromPln(
  amountPln: number,
  currency: CurrencyConfig
): number {
  if (currency.isBase || currency.code === 'PLN') {
    return Math.round(amountPln);
  }
  return applyRounding(amountPln * currency.rateFromPln, currency.rounding);
}

export function formatCurrencyAmount(
  amount: number,
  currency: CurrencyConfig,
  locale: Locale
): string {
  const intlLocale = LOCALE_META[locale].intlLocale;
  const fractionDigits = currency.rounding === 'exact' ? currency.decimals : 0;
  const formattedNumber = new Intl.NumberFormat(intlLocale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);

  if (currency.symbolPosition === 'prefix') {
    return `${currency.symbol}${formattedNumber}`;
  }
  return `${formattedNumber} ${currency.symbol}`;
}

export function formatDisplayPrice(
  amountPln: number,
  activeCurrency: CurrencyConfig,
  locale: Locale,
  approxPrefix = '≈'
): ConvertedPrice {
  const isBase = activeCurrency.isBase || activeCurrency.code === 'PLN';
  const converted = convertFromPln(amountPln, activeCurrency);
  const formattedCore = formatCurrencyAmount(converted, activeCurrency, locale);

  return {
    amount: converted,
    formatted: isBase ? formattedCore : `${approxPrefix} ${formattedCore}`,
    currencyCode: activeCurrency.code,
    isConvertedEstimate: !isBase,
  };
}

/**
 * Computes Checkout totals keeping display estimate strictly separated
 * from actual settlement total in base currency PLN.
 */
export function buildCheckoutTotals(
  items: ReadonlyArray<{ unitPricePln: number; quantity: number }>,
  activeCurrency: CurrencyConfig,
  plnCurrency: CurrencyConfig,
  locale: Locale,
  approxPrefix = '≈'
): CheckoutTotals {
  const baseTotalPln = items.reduce(
    (sum, item) => sum + item.unitPricePln * item.quantity,
    0
  );
  const settlementFormatted = formatCurrencyAmount(baseTotalPln, plnCurrency, locale);
  const display = formatDisplayPrice(
    baseTotalPln,
    activeCurrency,
    locale,
    approxPrefix
  );

  return {
    baseTotalPln,
    settlementCurrency: 'PLN',
    settlementFormatted,
    displayCurrency: activeCurrency.code,
    displayAmount: display.amount,
    displayFormatted: display.formatted,
    isConvertedEstimate: display.isConvertedEstimate,
  };
}

