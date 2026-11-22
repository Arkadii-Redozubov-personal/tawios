import { DEFAULT_LOCALE } from '@/i18n/config';
import { resolveTranslation } from '@/i18n';
import { CATALOG_SEED } from '@/server/data/catalog-seed';
import { CURRENCIES_SEED, PLN_CURRENCY } from '@/server/data/currencies-seed';
import type {
  CurrencyConfig,
  Locale,
  Product,
  ProductMedia,
  ProductVariant,
} from '@/lib/types';

export function getPublishedProducts(
  source: Product[] = CATALOG_SEED
): Product[] {
  return source.filter((p) => p.status === 'published');
}

export function getFeaturedProducts(
  source: Product[] = CATALOG_SEED
): Product[] {
  return getPublishedProducts(source)
    .filter((p) => typeof p.featuredOrder === 'number')
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}

export function getProductBySlug(
  slug: string,
  source: Product[] = CATALOG_SEED
): Product | undefined {
  return source.find((p) => p.slug === slug);
}

/**
 * Resolves the active variant for a product safely.
 * Returns only the images assigned directly to that variant — NEVER images from another color (FR-05 / TC-04).
 */
export function resolveProductVariant(
  product: Product,
  requestedVariantId?: string
): { variant: ProductVariant; images: ProductMedia[] } {
  const variant =
    product.variants.find((v) => v.id === requestedVariantId) ??
    product.variants[0]!;
  return {
    variant,
    images: variant.images,
  };
}

export function getLocalizedProductCopy(
  product: Product,
  locale: Locale,
  fallbackLocale: Locale = DEFAULT_LOCALE
) {
  return {
    name: resolveTranslation(product.name, locale, fallbackLocale),
    shortDescription: resolveTranslation(
      product.shortDescription,
      locale,
      fallbackLocale
    ),
    description: resolveTranslation(
      product.description,
      locale,
      fallbackLocale
    ),
    seoTitle: resolveTranslation(
      product.seoTitle ?? product.name,
      locale,
      fallbackLocale
    ),
    seoDescription: resolveTranslation(
      product.seoDescription ?? product.shortDescription,
      locale,
      fallbackLocale
    ),
  };
}

export function getActiveCurrencies(
  source: CurrencyConfig[] = CURRENCIES_SEED
): CurrencyConfig[] {
  return source.filter((c) => c.active);
}

export function resolveCurrencyByCode(
  code: string | undefined,
  source: CurrencyConfig[] = CURRENCIES_SEED
): CurrencyConfig {
  const upper = code?.toUpperCase();
  return (
    source.find((c) => c.code === upper && c.active) ??
    source.find((c) => c.isBase) ??
    PLN_CURRENCY
  );
}

