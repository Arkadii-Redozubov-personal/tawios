import { z } from 'zod';
import { LOCALES } from '@/lib/types';

export const CheckoutOrderItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
});

export const CheckoutOrderSchema = z
  .object({
    orderMode: z.enum(['request', 'online_demo']),
    locale: z.enum(LOCALES),
    displayCurrency: z.string().trim().min(3).max(5),
    paymentMethodDemo: z.enum(['card', 'blik', 'wallet']).optional(),
    customer: z.object({
      fullName: z.string().trim().min(2).max(120),
      email: z.string().trim().email().max(180),
      phone: z.string().trim().min(4).max(60),
      country: z.string().trim().max(80).optional(),
      city: z.string().trim().max(80).optional(),
      postalCode: z.string().trim().max(24).optional(),
      address: z.string().trim().max(200).optional(),
      comment: z.string().trim().max(500).optional(),
    }),
    items: z.array(CheckoutOrderItemSchema).min(1).max(25),
    // Accept optional client-rate hints only as display metadata; price is NEVER trusted from client
    displayRateHint: z.number().positive().max(1000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.orderMode === 'online_demo') {
      if (!data.customer.country || data.customer.country.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customer', 'country'],
          message: 'country_required',
        });
      }
      if (!data.customer.city || data.customer.city.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customer', 'city'],
          message: 'city_required',
        });
      }
      if (!data.customer.postalCode || data.customer.postalCode.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customer', 'postalCode'],
          message: 'postalCode_required',
        });
      }
      if (!data.customer.address || data.customer.address.trim().length < 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customer', 'address'],
          message: 'address_required',
        });
      }
    }
  });

export const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  message: z.string().trim().min(5).max(1000),
});

export const WorkshopWaitlistSchema = z.object({
  email: z.string().trim().email().max(180),
  preferredFormat: z.enum(['video', 'pdf', 'live']),
});

export const ProductCharacteristicSchema = z.object({
  id: z.string().min(1),
  label: z.object({
    uk: z.string().trim().min(1),
    en: z.string().trim().optional(),
    pl: z.string().trim().optional(),
    de: z.string().trim().optional(),
  }),
  value: z.object({
    uk: z.string().trim().min(1),
    en: z.string().trim().optional(),
    pl: z.string().trim().optional(),
    de: z.string().trim().optional(),
  }),
  editable: z.boolean().default(true),
});

export const CurrencyConfigSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/),
  symbol: z.string().trim().min(1).max(6),
  rateFromPln: z.number().positive().max(10000),
  rounding: z.enum(['whole', 'nearest5', 'exact']),
  symbolPosition: z.enum(['prefix', 'suffix']).default('suffix'),
  active: z.boolean().default(true),
});

export type CheckoutOrderInput = z.infer<typeof CheckoutOrderSchema>;

