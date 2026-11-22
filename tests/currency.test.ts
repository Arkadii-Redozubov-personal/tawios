import { describe, expect, it } from 'vitest';
import {
  applyRounding,
  buildCheckoutTotals,
  convertFromPln,
  formatDisplayPrice,
} from '@/lib/currency';
import { CURRENCIES_SEED, PLN_CURRENCY } from '@/server/data/currencies-seed';

describe('Currency conversion & PLN base separation (TC-20)', () => {
  it('never alters PLN base currency regardless of rate', () => {
    expect(convertFromPln(420, PLN_CURRENCY)).toBe(420);
  });

  it('applies configurable rounding rules cleanly', () => {
    expect(applyRounding(97.43, 'whole')).toBe(97);
    expect(applyRounding(4389, 'nearest5')).toBe(4390);
    expect(applyRounding(97.436, 'exact')).toBe(97.44);
  });

  it('marks converted display prices as approximate and preserves PLN settlement at checkout', () => {
    const eur = CURRENCIES_SEED.find((c) => c.code === 'EUR')!;
    const display = formatDisplayPrice(420, eur, 'en', '≈');
    expect(display.isConvertedEstimate).toBe(true);
    expect(display.formatted.startsWith('≈')).toBe(true);

    const totals = buildCheckoutTotals(
      [
        { unitPricePln: 420, quantity: 1 },
        { unitPricePln: 190, quantity: 2 },
      ],
      eur,
      PLN_CURRENCY,
      'pl',
      '≈'
    );

    expect(totals.baseTotalPln).toBe(800);
    expect(totals.settlementCurrency).toBe('PLN');
    expect(totals.displayCurrency).toBe('EUR');
    expect(totals.isConvertedEstimate).toBe(true);
  });
});

