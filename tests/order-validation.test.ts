import { describe, expect, it } from 'vitest';
import { CheckoutOrderSchema } from '@/lib/validation';
import { createDemoOrderSnapshot } from '@/server/services/order-service';

describe('Order validation & server-side PLN recalculation (TC-06..08)', () => {
  it('rejects empty required fields and invalid item quantities', () => {
    const invalid = CheckoutOrderSchema.safeParse({
      orderMode: 'request',
      locale: 'uk',
      displayCurrency: 'PLN',
      customer: {
        fullName: '',
        email: 'bad-email',
        phone: '12',
      },
      items: [{ productId: 'prod-quilted-flap', variantId: 'deep-plum', quantity: 99 }],
    });

    expect(invalid.success).toBe(false);
  });

  it('requires delivery address in online_demo mode but skips it in request mode', () => {
    const requestOk = CheckoutOrderSchema.safeParse({
      orderMode: 'request',
      locale: 'pl',
      displayCurrency: 'PLN',
      customer: {
        fullName: 'Olena Koval',
        email: 'olena@example.com',
        phone: '+48500100200',
      },
      items: [{ productId: 'prod-quilted-flap', variantId: 'deep-plum', quantity: 1 }],
    });
    expect(requestOk.success).toBe(true);

    const onlineMissingAddress = CheckoutOrderSchema.safeParse({
      orderMode: 'online_demo',
      locale: 'pl',
      displayCurrency: 'PLN',
      customer: {
        fullName: 'Olena Koval',
        email: 'olena@example.com',
        phone: '+48500100200',
      },
      items: [{ productId: 'prod-quilted-flap', variantId: 'deep-plum', quantity: 1 }],
    });
    expect(onlineMissingAddress.success).toBe(false);
  });

  it('computes order totals strictly from authoritative server PLN prices (TC-08)', () => {
    const parsed = CheckoutOrderSchema.parse({
      orderMode: 'online_demo',
      locale: 'en',
      displayCurrency: 'EUR',
      customer: {
        fullName: 'Anna Novak',
        email: 'anna@example.com',
        phone: '+353871234567',
        country: 'Ireland',
        city: 'Dublin',
        postalCode: 'D02 XY12',
        address: '14 Grafton Street',
      },
      items: [{ productId: 'prod-quilted-flap', variantId: 'deep-plum', quantity: 2 }],
    });

    const result = createDemoOrderSnapshot(parsed);
    expect(result.ok).toBe(true);
    if (result.ok) {
      // Authoritative basePricePln for prod-quilted-flap is 420 PLN => 2 * 420 = 840 PLN
      expect(result.order.baseTotalPln).toBe(840);
      expect(result.order.settlementCurrency).toBe('PLN');
      expect(result.order.displayCurrency).toBe('EUR');
      expect(result.order.demoMode).toBe(true);
    }
  });
});

