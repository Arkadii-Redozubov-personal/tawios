'use client';

import React from 'react';
import { formatCurrencyAmount, formatDisplayPrice } from '@/lib/currency';
import { useStore } from '@/components/StoreProvider';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/lib/types';

interface PriceDisplayProps {
  basePricePln: number;
  locale: Locale;
  dict: Dictionary;
  size?: 'sm' | 'md' | 'lg';
  showBaseClarification?: boolean;
}

export function PriceDisplay({
  basePricePln,
  locale,
  dict,
  size = 'md',
  showBaseClarification = false,
}: PriceDisplayProps) {
  const { activeCurrency, plnCurrency } = useStore();
  const display = formatDisplayPrice(
    basePricePln,
    activeCurrency,
    locale,
    dict.currency.approxPrefix
  );
  const plnFormatted = formatCurrencyAmount(basePricePln, plnCurrency, locale);

  const sizeClass =
    size === 'lg'
      ? 'text-2xl sm:text-3xl font-semibold'
      : size === 'sm'
        ? 'text-sm font-semibold'
        : 'text-base font-semibold';

  return (
    <div className="tabular-nums">
      <span className={`${sizeClass} text-[#111111]`}>{display.formatted}</span>
      {showBaseClarification && display.isConvertedEstimate && (
        <span className="block text-xs text-[#666666] mt-0.5">
          {dict.currency.baseCaption}:{' '}
          <strong className="font-semibold text-[#111111]">{plnFormatted}</strong>{' '}
          ({dict.currency.approxNote})
        </span>
      )}
    </div>
  );
}
