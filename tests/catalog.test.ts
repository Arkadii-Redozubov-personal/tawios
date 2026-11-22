import { describe, expect, it } from 'vitest';
import { resolveTranslation } from '@/i18n';
import { CATALOG_SEED } from '@/server/data/catalog-seed';
import {
  getProductBySlug,
  resolveProductVariant,
} from '@/server/services/catalog-service';

describe('Catalog variants, gallery integrity, and i18n fallbacks (TC-02..04, TC-18, TC-19)', () => {
  it('switches photo gallery strictly to the selected color variant', () => {
    const bag = getProductBySlug('quilted-flap-bag', CATALOG_SEED)!;
    const plum = resolveProductVariant(bag, 'deep-plum');
    const floral = resolveProductVariant(bag, 'lilac-floral');

    expect(plum.images).toHaveLength(1);
    expect(plum.images[0]?.url).toContain('plum');

    expect(floral.images).toHaveLength(2);
    expect(floral.images.every((img) => img.url.includes('floral'))).toBe(true);
  });

  it('never leaks photos from another color when a variant has no photos yet (TC-04)', () => {
    const saddle = getProductBySlug('colorblock-saddle-bag', CATALOG_SEED)!;
    const pendingOlive = resolveProductVariant(saddle, 'olive-moss-pending');

    expect(pendingOlive.variant.id).toBe('olive-moss-pending');
    expect(pendingOlive.images).toHaveLength(0);
  });

  it('falls back safely when one translation locale is omitted (TC-18)', () => {
    const partialText = { uk: 'Щільна бавовна' };
    expect(resolveTranslation(partialText, 'de')).toBe('Щільна бавовна');
    expect(resolveTranslation(partialText, 'pl')).toBe('Щільна бавовна');
  });
});

