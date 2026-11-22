import { DEFAULT_LOCALE, isValidLocale } from '@/i18n/config';
import { LOCALES, type Locale, type LocalizedText } from '@/lib/types';
import { uk, type Dictionary } from '@/i18n/dictionaries/uk';
import { en } from '@/i18n/dictionaries/en';
import { pl } from '@/i18n/dictionaries/pl';
import { de } from '@/i18n/dictionaries/de';

const DICTIONARIES: Record<Locale, Dictionary> = { uk, en, pl, de };

export type { Dictionary };

export function getDictionary(locale: string): Dictionary {
  if (isValidLocale(locale)) {
    return DICTIONARIES[locale];
  }
  return DICTIONARIES[DEFAULT_LOCALE];
}

/**
 * Resolves a localized text map cleanly without ever returning an empty/blank
 * value when at least one fallback translation exists (TC-18).
 */
export function resolveTranslation(
  text: LocalizedText | undefined,
  locale: Locale,
  fallbackLocale: Locale = DEFAULT_LOCALE
): string {
  if (!text) return '';
  const direct = text[locale]?.trim();
  if (direct) return direct;
  const fallback = text[fallbackLocale]?.trim();
  if (fallback) return fallback;
  for (const loc of LOCALES) {
    const candidate = text[loc]?.trim();
    if (candidate) return candidate;
  }
  return '';
}

/**
 * Replaces path locale prefix safely while keeping sub-routes and query strings.
 */
export function buildLocalizedPath(
  pathname: string,
  targetLocale: Locale,
  search = ''
): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0] ?? '')) {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }
  const basePath = `/${segments.join('/')}`;
  return search ? `${basePath}?${search}` : basePath;
}

