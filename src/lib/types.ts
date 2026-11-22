export const LOCALES = ['uk', 'en', 'pl', 'de'] as const;
export type Locale = (typeof LOCALES)[number];

export type LocalizedText = Partial<Record<Locale, string>>;

export type ProductCategory =
  | 'flap-shoulder'
  | 'sling-belt'
  | 'backpacks'
  | 'crossbody'
  | 'wallets';

export type CarryStyle = 'shoulder' | 'crossbody' | 'hand' | 'back';

export type BagSilhouetteShape =
  | 'flap'
  | 'sling'
  | 'backpack'
  | 'round'
  | 'crescent'
  | 'wallet';

export interface ProductCharacteristic {
  id: string;
  label: LocalizedText;
  value: LocalizedText;
  editable: boolean;
}

export interface ProductMedia {
  id: string;
  url: string;
  alt: LocalizedText;
  angleLabel?: LocalizedText;
  width: number;
  height: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  colorHex: string;
  colorName: LocalizedText;
  available: boolean;
  madeToOrder?: boolean;
  images: ProductMedia[];
}

export interface SilhouetteSpec {
  bagType: BagSilhouetteShape;
  widthRatio: number;
  heightRatio: number;
  defaultCarry: CarryStyle;
  availableCarries: CarryStyle[];
}

export interface Product {
  id: string;
  slug: string;
  category: ProductCategory;
  basePricePln: number;
  isDemoPrice: boolean;
  status: 'published' | 'draft';
  featuredOrder?: number;
  name: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  seoTitle?: LocalizedText;
  seoDescription?: LocalizedText;
  silhouetteSpec: SilhouetteSpec;
  characteristics: ProductCharacteristic[];
  variants: ProductVariant[];
}

export type RoundingRule = 'whole' | 'nearest5' | 'exact';

export interface CurrencyConfig {
  code: string;
  name: LocalizedText;
  symbol: string;
  rateFromPln: number;
  rounding: RoundingRule;
  symbolPosition: 'prefix' | 'suffix';
  decimals: number;
  isBase: boolean;
  isSettlement: boolean;
  active: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  variantId: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  variantId: string;
  addedAt: string;
}

export interface DemoProfile {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  postalCode: string;
  address: string;
}

export type OrderMode = 'request' | 'online_demo';

export interface OrderItemSnapshot {
  productId: string;
  slug: string;
  variantId: string;
  sku: string;
  productName: string;
  colorName: string;
  colorHex: string;
  unitPricePln: number;
  quantity: number;
  lineTotalPln: number;
  imageUrl?: string;
}

export interface DemoOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  orderMode: OrderMode;
  paymentMethodDemo?: 'card' | 'blik' | 'wallet';
  locale: Locale;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    country?: string;
    city?: string;
    postalCode?: string;
    address?: string;
    comment?: string;
  };
  items: OrderItemSnapshot[];
  baseTotalPln: number;
  settlementCurrency: 'PLN';
  displayCurrency: string;
  displayTotal: number;
  paymentStatus: 'demo_unpaid' | 'demo_simulated_authorized';
  fulfillmentStatus:
    | 'demo_new'
    | 'demo_in_review'
    | 'demo_in_progress'
    | 'demo_completed';
  demoMode: true;
}

export interface StoreSettings {
  instagramUrl: string;
  instagramHandle: string;
  instagramFeedMode: 'curated_demo' | 'live_api_ready';
}

