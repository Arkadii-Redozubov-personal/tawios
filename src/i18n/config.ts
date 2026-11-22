import { LOCALES, type Locale } from '@/lib/types';

export { LOCALES };
export const DEFAULT_LOCALE: Locale = 'uk';

export interface LocaleMeta {
  code: Locale;
  shortCode: 'UK' | 'EN' | 'PL' | 'DE';
  nativeName: string;
  intlLocale: string;
  dir: 'ltr';
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  uk: {
    code: 'uk',
    shortCode: 'UK',
    nativeName: 'Українська',
    intlLocale: 'uk-UA',
    dir: 'ltr',
  },
  en: {
    code: 'en',
    shortCode: 'EN',
    nativeName: 'English',
    intlLocale: 'en-GB',
    dir: 'ltr',
  },
  pl: {
    code: 'pl',
    shortCode: 'PL',
    nativeName: 'Polski',
    intlLocale: 'pl-PL',
    dir: 'ltr',
  },
  de: {
    code: 'de',
    shortCode: 'DE',
    nativeName: 'Deutsch',
    intlLocale: 'de-DE',
    dir: 'ltr',
  },
};

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

