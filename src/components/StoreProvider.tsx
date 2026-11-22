'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CATALOG_SEED, STORE_SETTINGS_SEED } from '@/server/data/catalog-seed';
import { CURRENCIES_SEED, PLN_CURRENCY } from '@/server/data/currencies-seed';
import type {
  CartItem,
  CurrencyConfig,
  DemoOrder,
  DemoProfile,
  Product,
  ProductCharacteristic,
  ProductVariant,
  StoreSettings,
  WishlistItem,
} from '@/lib/types';

const STORAGE_KEY = 'tawios_demo_store_v1';

const EMPTY_PROFILE: DemoProfile = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  postalCode: '',
  address: '',
};

interface PersistedState {
  products?: Product[];
  currencies?: CurrencyConfig[];
  activeCurrencyCode?: string;
  cart?: CartItem[];
  wishlist?: WishlistItem[];
  recentlyViewed?: string[];
  demoProfile?: DemoProfile;
  orders?: DemoOrder[];
  storeSettings?: StoreSettings;
  bannerDismissed?: boolean;
}

interface StoreContextValue {
  products: Product[];
  currencies: CurrencyConfig[];
  activeCurrencies: CurrencyConfig[];
  activeCurrency: CurrencyConfig;
  plnCurrency: CurrencyConfig;
  cart: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  wishlist: WishlistItem[];
  wishlistCount: number;
  recentlyViewed: string[];
  demoProfile: DemoProfile;
  orders: DemoOrder[];
  storeSettings: StoreSettings;
  bannerDismissed: boolean;
  isHydrated: boolean;
  setActiveCurrencyCode: (code: string) => void;
  setCartOpen: (open: boolean) => void;
  dismissBanner: () => void;
  addToCart: (productId: string, slug: string, variantId: string, qty?: number) => void;
  updateCartQty: (productId: string, variantId: string, qty: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string, variantId: string) => boolean;
  isWishlisted: (productId: string, variantId?: string) => boolean;
  removeFromWishlist: (productId: string, variantId: string) => void;
  clearWishlist: () => void;
  trackViewedProduct: (slug: string) => void;
  updateDemoProfile: (patch: Partial<DemoProfile>) => void;
  recordDemoOrder: (order: DemoOrder) => void;
  updateOrderStatus: (
    orderId: string,
    status: DemoOrder['fulfillmentStatus']
  ) => void;
  updateProduct: (productId: string, updater: (prev: Product) => Product) => void;
  addCharacteristic: (productId: string, char: ProductCharacteristic) => void;
  updateCharacteristic: (
    productId: string,
    charId: string,
    char: ProductCharacteristic
  ) => void;
  removeCharacteristic: (productId: string, charId: string) => void;
  addProductVariant: (productId: string, variant: ProductVariant) => void;
  updateProductVariant: (
    productId: string,
    variantId: string,
    updater: (prev: ProductVariant) => ProductVariant
  ) => void;
  upsertCurrency: (currency: CurrencyConfig) => void;
  updateStoreSettings: (patch: Partial<StoreSettings>) => void;
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(CATALOG_SEED);
  const [currencies, setCurrencies] = useState<CurrencyConfig[]>(CURRENCIES_SEED);
  const [activeCurrencyCode, setActiveCurrencyCodeState] = useState<string>('PLN');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [demoProfile, setDemoProfile] = useState<DemoProfile>(EMPTY_PROFILE);
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [storeSettings, setStoreSettings] =
    useState<StoreSettings>(STORE_SETTINGS_SEED);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        if (Array.isArray(parsed.products) && parsed.products.length > 0) {
          setProducts(parsed.products);
        }
        if (Array.isArray(parsed.currencies) && parsed.currencies.length > 0) {
          setCurrencies(parsed.currencies);
        }
        if (typeof parsed.activeCurrencyCode === 'string') {
          setActiveCurrencyCodeState(parsed.activeCurrencyCode);
        }
        if (Array.isArray(parsed.cart)) {
          setCart(parsed.cart);
        }
        if (Array.isArray(parsed.wishlist)) {
          setWishlist(parsed.wishlist);
        }
        if (Array.isArray(parsed.recentlyViewed)) {
          setRecentlyViewed(parsed.recentlyViewed.slice(0, 8));
        }
        if (parsed.demoProfile && typeof parsed.demoProfile === 'object') {
          setDemoProfile({ ...EMPTY_PROFILE, ...parsed.demoProfile });
        }
        if (Array.isArray(parsed.orders)) {
          setOrders(parsed.orders);
        }
        if (parsed.storeSettings) {
          setStoreSettings(parsed.storeSettings);
        }
        if (typeof parsed.bannerDismissed === 'boolean') {
          setBannerDismissed(parsed.bannerDismissed);
        }
      }
    } catch {
      // Ignore corrupted localStorage and fall back to seed data
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      const payload: PersistedState = {
        products,
        currencies,
        activeCurrencyCode,
        cart,
        wishlist,
        recentlyViewed,
        demoProfile,
        orders,
        storeSettings,
        bannerDismissed,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [
    isHydrated,
    products,
    currencies,
    activeCurrencyCode,
    cart,
    wishlist,
    recentlyViewed,
    demoProfile,
    orders,
    storeSettings,
    bannerDismissed,
  ]);

  const activeCurrencies = useMemo(
    () => currencies.filter((c) => c.active),
    [currencies]
  );

  const plnCurrency = useMemo(
    () => currencies.find((c) => c.isBase || c.code === 'PLN') ?? PLN_CURRENCY,
    [currencies]
  );

  const activeCurrency = useMemo(
    () =>
      activeCurrencies.find((c) => c.code === activeCurrencyCode) ?? plnCurrency,
    [activeCurrencies, activeCurrencyCode, plnCurrency]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const wishlistCount = wishlist.length;

  const setActiveCurrencyCode = useCallback((code: string) => {
    setActiveCurrencyCodeState(code.toUpperCase());
  }, []);

  const dismissBanner = useCallback(() => setBannerDismissed(true), []);

  const addToCart = useCallback(
    (productId: string, slug: string, variantId: string, qty = 1) => {
      const safeQty = Math.min(10, Math.max(1, Math.round(qty)));
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (i) => i.productId === productId && i.variantId === variantId
        );
        if (existingIndex >= 0) {
          return prev.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: Math.min(10, item.quantity + safeQty) }
              : item
          );
        }
        return [...prev, { productId, slug, variantId, quantity: safeQty }];
      });
    },
    []
  );

  const updateCartQty = useCallback(
    (productId: string, variantId: string, qty: number) => {
      if (!Number.isFinite(qty) || qty < 1) return;
      const safeQty = Math.min(10, Math.floor(qty));
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: safeQty }
            : item
        )
      );
    },
    []
  );

  const removeFromCart = useCallback((productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (productId: string, variantId: string): boolean => {
      let added = false;
      setWishlist((prev) => {
        const exists = prev.some(
          (item) => item.productId === productId && item.variantId === variantId
        );
        if (exists) {
          added = false;
          return prev.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          );
        }
        added = true;
        return [
          { productId, variantId, addedAt: new Date().toISOString() },
          ...prev,
        ];
      });
      return added;
    },
    []
  );

  const isWishlisted = useCallback(
    (productId: string, variantId?: string): boolean => {
      if (variantId) {
        return wishlist.some(
          (item) => item.productId === productId && item.variantId === variantId
        );
      }
      return wishlist.some((item) => item.productId === productId);
    },
    [wishlist]
  );

  const removeFromWishlist = useCallback((productId: string, variantId: string) => {
    setWishlist((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      )
    );
  }, []);

  const clearWishlist = useCallback(() => setWishlist([]), []);

  const trackViewedProduct = useCallback((slug: string) => {
    if (!slug) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, 8);
    });
  }, []);

  const updateDemoProfile = useCallback((patch: Partial<DemoProfile>) => {
    setDemoProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const recordDemoOrder = useCallback((order: DemoOrder) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback(
    (orderId: string, status: DemoOrder['fulfillmentStatus']) => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, fulfillmentStatus: status } : ord
        )
      );
    },
    []
  );

  const updateProduct = useCallback(
    (productId: string, updater: (prev: Product) => Product) => {
      setProducts((prev) =>
        prev.map((prod) => (prod.id === productId ? updater(prod) : prod))
      );
    },
    []
  );

  const addCharacteristic = useCallback(
    (productId: string, char: ProductCharacteristic) => {
      updateProduct(productId, (p) => ({
        ...p,
        characteristics: [...p.characteristics, char],
      }));
    },
    [updateProduct]
  );

  const updateCharacteristic = useCallback(
    (productId: string, charId: string, char: ProductCharacteristic) => {
      updateProduct(productId, (p) => ({
        ...p,
        characteristics: p.characteristics.map((c) =>
          c.id === charId ? char : c
        ),
      }));
    },
    [updateProduct]
  );

  const removeCharacteristic = useCallback(
    (productId: string, charId: string) => {
      updateProduct(productId, (p) => ({
        ...p,
        characteristics: p.characteristics.filter((c) => c.id !== charId),
      }));
    },
    [updateProduct]
  );

  const addProductVariant = useCallback(
    (productId: string, variant: ProductVariant) => {
      updateProduct(productId, (p) => ({
        ...p,
        variants: [...p.variants, variant],
      }));
    },
    [updateProduct]
  );

  const updateProductVariant = useCallback(
    (
      productId: string,
      variantId: string,
      updater: (prev: ProductVariant) => ProductVariant
    ) => {
      updateProduct(productId, (p) => ({
        ...p,
        variants: p.variants.map((v) =>
          v.id === variantId ? updater(v) : v
        ),
      }));
    },
    [updateProduct]
  );

  const upsertCurrency = useCallback((currency: CurrencyConfig) => {
    setCurrencies((prev) => {
      const code = currency.code.toUpperCase();
      const exists = prev.some((c) => c.code === code);
      if (exists) {
        return prev.map((c) => {
          if (c.code !== code) return c;
          // Base PLN stays locked as base & settlement currency
          if (c.isBase) {
            return { ...c, active: true, rateFromPln: 1 };
          }
          return { ...currency, code };
        });
      }
      return [...prev, { ...currency, code }];
    });
  }, []);

  const updateStoreSettings = useCallback((patch: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDemoData = useCallback(() => {
    setProducts(CATALOG_SEED);
    setCurrencies(CURRENCIES_SEED);
    setActiveCurrencyCodeState('PLN');
    setCart([]);
    setWishlist([]);
    setRecentlyViewed([]);
    setDemoProfile(EMPTY_PROFILE);
    setOrders([]);
    setStoreSettings(STORE_SETTINGS_SEED);
    setBannerDismissed(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      products,
      currencies,
      activeCurrencies,
      activeCurrency,
      plnCurrency,
      cart,
      cartCount,
      isCartOpen,
      wishlist,
      wishlistCount,
      recentlyViewed,
      demoProfile,
      orders,
      storeSettings,
      bannerDismissed,
      isHydrated,
      setActiveCurrencyCode,
      setCartOpen,
      dismissBanner,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      removeFromWishlist,
      clearWishlist,
      trackViewedProduct,
      updateDemoProfile,
      recordDemoOrder,
      updateOrderStatus,
      updateProduct,
      addCharacteristic,
      updateCharacteristic,
      removeCharacteristic,
      addProductVariant,
      updateProductVariant,
      upsertCurrency,
      updateStoreSettings,
      resetDemoData,
    }),
    [
      products,
      currencies,
      activeCurrencies,
      activeCurrency,
      plnCurrency,
      cart,
      cartCount,
      isCartOpen,
      wishlist,
      wishlistCount,
      recentlyViewed,
      demoProfile,
      orders,
      storeSettings,
      bannerDismissed,
      isHydrated,
      setActiveCurrencyCode,
      dismissBanner,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      removeFromWishlist,
      clearWishlist,
      trackViewedProduct,
      updateDemoProfile,
      recordDemoOrder,
      updateOrderStatus,
      updateProduct,
      addCharacteristic,
      updateCharacteristic,
      removeCharacteristic,
      addProductVariant,
      updateProductVariant,
      upsertCurrency,
      updateStoreSettings,
      resetDemoData,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
