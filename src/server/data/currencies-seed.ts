import type { CurrencyConfig } from '@/lib/types';

export const CURRENCIES_SEED: CurrencyConfig[] = [
  {
    code: 'PLN',
    name: {
      uk: 'Польський злотий (базова)',
      en: 'Polish Złoty (Base)',
      pl: 'Polski złoty (bazowa)',
      de: 'Polnischer Złoty (Basis)',
    },
    symbol: 'zł',
    rateFromPln: 1,
    rounding: 'whole',
    symbolPosition: 'suffix',
    decimals: 0,
    isBase: true,
    isSettlement: true,
    active: true,
  },
  {
    code: 'EUR',
    name: {
      uk: 'Євро (орієнтовно)',
      en: 'Euro (estimate)',
      pl: 'Euro (orientacyjnie)',
      de: 'Euro (Richtwert)',
    },
    symbol: '€',
    rateFromPln: 0.232,
    rounding: 'whole',
    symbolPosition: 'prefix',
    decimals: 0,
    isBase: false,
    isSettlement: false,
    active: true,
  },
  {
    code: 'USD',
    name: {
      uk: 'Долар США (орієнтовно)',
      en: 'US Dollar (estimate)',
      pl: 'Dolar USA (orientacyjnie)',
      de: 'US-Dollar (Richtwert)',
    },
    symbol: '$',
    rateFromPln: 0.252,
    rounding: 'whole',
    symbolPosition: 'prefix',
    decimals: 0,
    isBase: false,
    isSettlement: false,
    active: true,
  },
  {
    code: 'UAH',
    name: {
      uk: 'Українська гривня (орієнтовно)',
      en: 'Ukrainian Hryvnia (estimate)',
      pl: 'Hrywna ukraińska (orientacyjnie)',
      de: 'Ukrainische Hrywnja (Richtwert)',
    },
    symbol: '₴',
    rateFromPln: 10.45,
    rounding: 'nearest5',
    symbolPosition: 'suffix',
    decimals: 0,
    isBase: false,
    isSettlement: false,
    active: true,
  },
];

export const PLN_CURRENCY: CurrencyConfig = CURRENCIES_SEED[0]!;

