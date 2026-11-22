import { resolveTranslation } from '@/i18n';
import { convertFromPln } from '@/lib/currency';
import type { CheckoutOrderInput } from '@/lib/validation';
import { CATALOG_SEED } from '@/server/data/catalog-seed';
import { CURRENCIES_SEED } from '@/server/data/currencies-seed';
import type {
  CurrencyConfig,
  DemoOrder,
  OrderItemSnapshot,
  Product,
} from '@/lib/types';

export interface CreateOrderResult {
  ok: true;
  order: DemoOrder;
}

export interface CreateOrderError {
  ok: false;
  code: 'INVALID_ITEM' | 'UNPUBLISHED_PRODUCT';
  message: string;
}

/**
 * Calculates order totals strictly on the server from authoritative PLN base prices
 * (Technical Specification v1.2, Section 12.2 & TC-08). Any client-supplied price is ignored.
 */
export function createDemoOrderSnapshot(
  input: CheckoutOrderInput,
  catalog: Product[] = CATALOG_SEED,
  currencies: CurrencyConfig[] = CURRENCIES_SEED
): CreateOrderResult | CreateOrderError {
  const snapshots: OrderItemSnapshot[] = [];

  for (const line of input.items) {
    const product = catalog.find((p) => p.id === line.productId);
    if (!product) {
      return {
        ok: false,
        code: 'INVALID_ITEM',
        message: `Unknown product id: ${line.productId}`,
      };
    }
    if (product.status !== 'published') {
      return {
        ok: false,
        code: 'UNPUBLISHED_PRODUCT',
        message: `Product ${product.slug} is not published`,
      };
    }
    const variant = product.variants.find((v) => v.id === line.variantId);
    if (!variant || !variant.available) {
      return {
        ok: false,
        code: 'INVALID_ITEM',
        message: `Unavailable variant ${line.variantId} for ${product.slug}`,
      };
    }

    const unitPricePln = product.basePricePln;
    const lineTotalPln = unitPricePln * line.quantity;

    snapshots.push({
      productId: product.id,
      slug: product.slug,
      variantId: variant.id,
      sku: variant.sku,
      productName: resolveTranslation(product.name, input.locale),
      colorName: resolveTranslation(variant.colorName, input.locale),
      colorHex: variant.colorHex,
      unitPricePln,
      quantity: line.quantity,
      lineTotalPln,
      imageUrl: variant.images[0]?.url,
    });
  }

  const baseTotalPln = snapshots.reduce((sum, s) => sum + s.lineTotalPln, 0);

  const upperCurrency = input.displayCurrency.toUpperCase();
  const matchedCurrency = currencies.find(
    (c) => c.code === upperCurrency && c.active
  );

  let displayTotal = baseTotalPln;
  let resolvedCurrencyCode = 'PLN';

  if (matchedCurrency) {
    displayTotal = convertFromPln(baseTotalPln, matchedCurrency);
    resolvedCurrencyCode = matchedCurrency.code;
  } else if (input.displayRateHint && upperCurrency !== 'PLN') {
    displayTotal = Math.round(baseTotalPln * input.displayRateHint);
    resolvedCurrencyCode = upperCurrency;
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const nowIso = new Date().toISOString();

  const order: DemoOrder = {
    id: `ord-${Date.now()}-${randomSuffix}`,
    orderNumber: `TW-DEMO-${randomSuffix}`,
    createdAt: nowIso,
    orderMode: input.orderMode,
    paymentMethodDemo:
      input.orderMode === 'online_demo'
        ? (input.paymentMethodDemo ?? 'card')
        : undefined,
    locale: input.locale,
    customer: {
      fullName: input.customer.fullName,
      email: input.customer.email,
      phone: input.customer.phone,
      country: input.customer.country,
      city: input.customer.city,
      postalCode: input.customer.postalCode,
      address: input.customer.address,
      comment: input.customer.comment,
    },
    items: snapshots,
    baseTotalPln,
    settlementCurrency: 'PLN',
    displayCurrency: resolvedCurrencyCode,
    displayTotal,
    paymentStatus:
      input.orderMode === 'online_demo'
        ? 'demo_simulated_authorized'
        : 'demo_unpaid',
    fulfillmentStatus: 'demo_new',
    demoMode: true,
  };

  return { ok: true, order };
}

