'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AlertTriangle,
  Check,
  ExternalLink,
  ImageOff,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { LOCALE_META, LOCALES } from '@/i18n/config';
import { resolveTranslation, type Dictionary } from '@/i18n';
import { formatCurrencyAmount } from '@/lib/currency';
import { CurrencyConfigSchema } from '@/lib/validation';
import type {
  CurrencyConfig,
  DemoOrder,
  Locale,
  ProductCharacteristic,
  RoundingRule,
} from '@/lib/types';
import { useStore } from '@/components/StoreProvider';

type AdminTab = 'products' | 'variants' | 'currencies' | 'orders' | 'settings';

interface AdminDemoViewProps {
  locale: Locale;
  dict: Dictionary;
  initialTab?: string;
  initialProductId?: string;
}

export function AdminDemoView({
  locale,
  dict,
  initialTab,
  initialProductId,
}: AdminDemoViewProps) {
  const {
    products,
    currencies,
    plnCurrency,
    orders,
    storeSettings,
    updateProduct,
    addCharacteristic,
    updateCharacteristic,
    removeCharacteristic,
    addProductVariant,
    updateProductVariant,
    upsertCurrency,
    updateOrderStatus,
    updateStoreSettings,
    resetDemoData,
  } = useStore();

  const validTabs: AdminTab[] = [
    'products',
    'variants',
    'currencies',
    'orders',
    'settings',
  ];
  const [activeTab, setActiveTab] = useState<AdminTab>(
    validTabs.includes(initialTab as AdminTab)
      ? (initialTab as AdminTab)
      : 'products'
  );
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products.some((p) => p.id === initialProductId)
      ? (initialProductId as string)
      : (products[0]?.id ?? '')
  );
  const [editLocale, setEditLocale] = useState<Locale>(locale);
  const [savedFlag, setSavedFlag] = useState(false);

  const [newCharLabel, setNewCharLabel] = useState('');
  const [newCharValue, setNewCharValue] = useState('');

  const [newVarName, setNewVarName] = useState('');
  const [newVarHex, setNewVarHex] = useState('#7F7D5E');
  const [newVarSku, setNewVarSku] = useState('');
  const [newVarImg, setNewVarImg] = useState('');

  const [newCurrCode, setNewCurrCode] = useState('');
  const [newCurrSymbol, setNewCurrSymbol] = useState('');
  const [newCurrRate, setNewCurrRate] = useState('');
  const [newCurrPos, setNewCurrPos] = useState<'prefix' | 'suffix'>('prefix');
  const [currError, setCurrError] = useState('');

  const [orderSearch, setOrderSearch] = useState('');

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) ?? products[0];

  function flashSaved() {
    setSavedFlag(true);
    setTimeout(() => setSavedFlag(false), 2200);
  }

  function handleAddCharacteristic(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct || !newCharLabel.trim() || !newCharValue.trim()) return;
    const item: ProductCharacteristic = {
      id: `char-${Date.now()}`,
      label: { [editLocale]: newCharLabel.trim() },
      value: { [editLocale]: newCharValue.trim() },
      editable: true,
    };
    addCharacteristic(selectedProduct.id, item);
    setNewCharLabel('');
    setNewCharValue('');
    flashSaved();
  }

  function handleAddVariant(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct || !newVarName.trim()) return;
    const slugified = newVarName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const id = `${slugified || 'color'}-${Date.now().toString().slice(-4)}`;
    const imgUrl = newVarImg.trim();

    addProductVariant(selectedProduct.id, {
      id,
      sku: newVarSku.trim() || `TW-${Date.now().toString().slice(-5)}`,
      colorHex: newVarHex,
      colorName: { [editLocale]: newVarName.trim() },
      available: true,
      madeToOrder: imgUrl.length === 0,
      images: imgUrl
        ? [
            {
              id: `img-${Date.now()}`,
              url: imgUrl,
              alt: {
                [editLocale]: `${resolveTranslation(selectedProduct.name, editLocale)} — ${newVarName.trim()}`,
              },
              width: 1200,
              height: 1600,
            },
          ]
        : [],
    });

    setNewVarName('');
    setNewVarSku('');
    setNewVarImg('');
    flashSaved();
  }

  function handleAddCurrency(e: React.FormEvent) {
    e.preventDefault();
    const rateNum = Number(newCurrRate);
    const parsed = CurrencyConfigSchema.safeParse({
      code: newCurrCode,
      symbol: newCurrSymbol,
      rateFromPln: rateNum,
      rounding: 'whole',
      symbolPosition: newCurrPos,
      active: true,
    });
    if (!parsed.success) {
      setCurrError('Code (3 uppercase letters, e.g. GBP), symbol & positive rate required.');
      return;
    }
    setCurrError('');
    const newCurrency: CurrencyConfig = {
      code: parsed.data.code,
      symbol: parsed.data.symbol,
      rateFromPln: parsed.data.rateFromPln,
      rounding: parsed.data.rounding,
      symbolPosition: parsed.data.symbolPosition,
      decimals: 2,
      name: { [locale]: parsed.data.code },
      isBase: false,
      isSettlement: false,
      active: true,
    };
    upsertCurrency(newCurrency);
    setNewCurrCode('');
    setNewCurrSymbol('');
    setNewCurrRate('');
    flashSaved();
  }

  const filteredOrders = orders.filter((ord) => {
    if (!orderSearch.trim()) return true;
    const q = orderSearch.trim().toLowerCase();
    return (
      ord.orderNumber.toLowerCase().includes(q) ||
      ord.customer.fullName.toLowerCase().includes(q) ||
      ord.customer.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-[#F7F7F7] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white border border-[#E5E5E5] p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#111111]">
              {dict.admin.title}
            </h1>
            <p className="text-sm text-[#666666]">{dict.admin.subtitle}</p>
            <p className="text-xs font-semibold text-[#111111]">
              {dict.admin.demoPersistenceNote}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {savedFlag && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#111111] text-white text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>{dict.admin.savedToast}</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                resetDemoData();
                flashSaved();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#111111] bg-white hover:bg-[#F0F0F0] text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{dict.admin.resetDemoBtn}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist">
          {validTabs.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] border transition-colors ${
                  active
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111]'
                }`}
              >
                {dict.admin.tabs[tab]}
              </button>
            );
          })}
        </div>

        {activeTab === 'products' && selectedProduct && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <aside className="lg:col-span-4 bg-white border border-[#E5E5E5] p-4 space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#666666] px-2 pb-2">
                {dict.admin.selectProduct}
              </p>
              {products.map((prod) => {
                const active = prod.id === selectedProduct.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`w-full px-3.5 py-2.5 text-left text-sm flex items-center justify-between gap-2 transition-colors ${
                      active
                        ? 'bg-[#111111] text-white font-semibold'
                        : 'hover:bg-[#F7F7F7] text-[#111111]'
                    }`}
                  >
                    <span className="truncate">
                      {resolveTranslation(prod.name, locale)}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 shrink-0 tabular-nums ${
                        prod.status === 'published'
                          ? active
                            ? 'bg-white/20 text-white'
                            : 'bg-[#F7F7F7] text-[#111111]'
                          : 'bg-[#E5E5E5] text-[#111111]'
                      }`}
                    >
                      {prod.basePricePln} zł
                    </span>
                  </button>
                );
              })}
            </aside>

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-[#E5E5E5] p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#666666]">
                      {dict.admin.editLocale}:
                    </span>
                    <div className="inline-flex bg-[#F7F7F7] p-1 border border-[#E5E5E5]">
                      {LOCALES.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setEditLocale(loc)}
                          className={`px-3 py-1 text-xs font-semibold transition-colors ${
                            editLocale === loc
                              ? 'bg-[#111111] text-white'
                              : 'text-[#666666] hover:text-[#111111]'
                          }`}
                        >
                          {LOCALE_META[loc].shortCode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/product/${selectedProduct.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] hover:text-[#333333] underline underline-offset-4"
                  >
                    <span>{dict.admin.viewLiveProduct}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="admin-prod-name"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                    >
                      {dict.admin.fieldName} ({LOCALE_META[editLocale].shortCode})
                    </label>
                    <input
                      id="admin-prod-name"
                      name="productName"
                      type="text"
                      value={selectedProduct.name[editLocale] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateProduct(selectedProduct.id, (prev) => ({
                          ...prev,
                          name: { ...prev.name, [editLocale]: val },
                        }));
                        flashSaved();
                      }}
                      className="w-full px-4 py-2.5 rounded-[8px] border border-[#E5E5E5] text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="admin-prod-price"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                    >
                      {dict.admin.fieldBasePrice}
                    </label>
                    <input
                      id="admin-prod-price"
                      name="basePricePln"
                      type="number"
                      min={1}
                      max={100000}
                      value={selectedProduct.basePricePln}
                      onChange={(e) => {
                        const num = Math.max(1, Number(e.target.value) || 1);
                        updateProduct(selectedProduct.id, (prev) => ({
                          ...prev,
                          basePricePln: num,
                        }));
                        flashSaved();
                      }}
                      className="w-full px-4 py-2.5 rounded-[8px] border border-[#E5E5E5] text-sm tabular-nums"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="admin-prod-status"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                    >
                      {dict.admin.fieldStatus}
                    </label>
                    <select
                      id="admin-prod-status"
                      name="productStatus"
                      value={selectedProduct.status}
                      onChange={(e) => {
                        const nextStatus = e.target.value as 'published' | 'draft';
                        updateProduct(selectedProduct.id, (prev) => ({
                          ...prev,
                          status: nextStatus,
                        }));
                        flashSaved();
                      }}
                      className="w-full px-4 py-2.5 rounded-[8px] border border-[#E5E5E5] text-sm bg-white"
                    >
                      <option value="published">{dict.admin.statusPublished}</option>
                      <option value="draft">{dict.admin.statusDraft}</option>
                    </select>
                  </div>

                  {selectedProduct.status === 'draft' && (
                    <div className="sm:col-span-2 rounded-[8px] bg-[#F5F5F5] border border-[#333333] p-3 flex items-center gap-2 text-xs text-[#111111]">
                      <AlertTriangle className="w-4 h-4 text-[#333333] shrink-0" />
                      <span>{dict.admin.unpublishWarning}</span>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="admin-prod-short-desc"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                    >
                      {dict.admin.fieldShortDesc} ({LOCALE_META[editLocale].shortCode})
                    </label>
                    <input
                      id="admin-prod-short-desc"
                      name="shortDescription"
                      type="text"
                      value={selectedProduct.shortDescription[editLocale] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateProduct(selectedProduct.id, (prev) => ({
                          ...prev,
                          shortDescription: {
                            ...prev.shortDescription,
                            [editLocale]: val,
                          },
                        }));
                        flashSaved();
                      }}
                      className="w-full px-4 py-2.5 rounded-[8px] border border-[#E5E5E5] text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="admin-prod-desc"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                    >
                      {dict.admin.fieldDesc} ({LOCALE_META[editLocale].shortCode})
                    </label>
                    <textarea
                      id="admin-prod-desc"
                      name="description"
                      rows={3}
                      value={selectedProduct.description[editLocale] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateProduct(selectedProduct.id, (prev) => ({
                          ...prev,
                          description: {
                            ...prev.description,
                            [editLocale]: val,
                          },
                        }));
                        flashSaved();
                      }}
                      className="w-full px-4 py-2.5 rounded-[8px] border border-[#E5E5E5] text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E5E5E5] p-6 space-y-5">
                <h2 className="font-display text-xl font-bold text-[#111111]">
                  {dict.admin.characteristicsHeading}
                </h2>

                <div className="space-y-3">
                  {selectedProduct.characteristics.map((char) => (
                    <div
                      key={char.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center p-3 bg-[#F7F7F7] border border-[#E5E5E5]"
                    >
                      <input
                        id={`char-label-${char.id}`}
                        name={`charLabel_${char.id}`}
                        type="text"
                        aria-label="Characteristic label"
                        value={
                          char.label[editLocale] ??
                          resolveTranslation(char.label, editLocale)
                        }
                        onChange={(e) => {
                          updateCharacteristic(selectedProduct.id, char.id, {
                            ...char,
                            label: { ...char.label, [editLocale]: e.target.value },
                          });
                          flashSaved();
                        }}
                        className="sm:col-span-4 px-3 py-2 rounded-[6px] border border-[#E5E5E5] bg-white text-xs font-semibold"
                      />
                      <input
                        id={`char-value-${char.id}`}
                        name={`charValue_${char.id}`}
                        type="text"
                        aria-label="Characteristic value"
                        value={
                          char.value[editLocale] ??
                          resolveTranslation(char.value, editLocale)
                        }
                        onChange={(e) => {
                          updateCharacteristic(selectedProduct.id, char.id, {
                            ...char,
                            value: { ...char.value, [editLocale]: e.target.value },
                          });
                          flashSaved();
                        }}
                        className="sm:col-span-7 px-3 py-2 rounded-[6px] border border-[#E5E5E5] bg-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          removeCharacteristic(selectedProduct.id, char.id);
                          flashSaved();
                        }}
                        aria-label={dict.admin.deleteBtn}
                        className="sm:col-span-1 p-2 text-[#666666] hover:text-[#333333] hover:bg-white flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleAddCharacteristic}
                  className="pt-4 border-t border-[#E5E5E5] grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                >
                  <input
                    id="admin-new-char-label"
                    name="newCharLabel"
                    type="text"
                    aria-label={dict.admin.characteristicLabelPlaceholder}
                    value={newCharLabel}
                    onChange={(e) => setNewCharLabel(e.target.value)}
                    placeholder={dict.admin.characteristicLabelPlaceholder}
                    className="sm:col-span-4 px-3.5 py-2.5 rounded-[8px] border border-[#E5E5E5] text-xs"
                  />
                  <input
                    id="admin-new-char-value"
                    name="newCharValue"
                    type="text"
                    aria-label={dict.admin.characteristicValuePlaceholder}
                    value={newCharValue}
                    onChange={(e) => setNewCharValue(e.target.value)}
                    placeholder={dict.admin.characteristicValuePlaceholder}
                    className="sm:col-span-5 px-3.5 py-2.5 rounded-[8px] border border-[#E5E5E5] text-xs"
                  />
                  <button
                    type="submit"
                    className="sm:col-span-3 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.12em] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{dict.admin.characteristicsAdd}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'variants' && selectedProduct && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E5E5] p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <label
                  htmlFor="var-product-select"
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]"
                >
                  {dict.admin.selectProduct}:
                </label>
                <select
                  id="var-product-select"
                  value={selectedProduct.id}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="px-4 py-2 border border-[#111111] text-sm font-semibold bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {resolveTranslation(p.name, locale)}
                    </option>
                  ))}
                </select>
              </div>

              <Link
                href={`/${locale}/product/${selectedProduct.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] hover:text-[#333333] underline underline-offset-4"
              >
                <span>{dict.admin.viewLiveProduct}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {selectedProduct.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="bg-white border border-[#E5E5E5] p-5 space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-6 h-6 border border-[#111111] shrink-0"
                        style={{ backgroundColor: variant.colorHex }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#111111] truncate">
                          {resolveTranslation(variant.colorName, locale)}
                        </p>
                        <p className="text-xs text-[#666666] tabular-nums">
                          {variant.sku} · {variant.images.length} photos
                        </p>
                      </div>
                    </div>
                  </div>

                  {variant.images.length === 0 ? (
                    <div className="p-4 bg-[#F7F7F7] border border-[#E5E5E5] flex items-center gap-2 text-xs text-[#666666]">
                      <ImageOff className="w-4 h-4 shrink-0" />
                      <span>{dict.product.fallbackPhotoTitle}</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {variant.images.map((img) => (
                        <div
                          key={img.id}
                          className="relative w-16 h-20 overflow-hidden border border-[#E5E5E5] bg-[#F7F7F7] group"
                        >
                          <Image
                            src={img.url}
                            alt={resolveTranslation(img.alt, locale) || variant.sku}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            aria-label="Remove image"
                            onClick={() => {
                              updateProductVariant(
                                selectedProduct.id,
                                variant.id,
                                (prev) => ({
                                  ...prev,
                                  images: prev.images.filter(
                                    (i) => i.id !== img.id
                                  ),
                                })
                              );
                              flashSaved();
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-white text-[#111111] text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAddVariant}
              className="bg-white border border-[#E5E5E5] p-6 space-y-4"
            >
              <h2 className="font-display text-lg font-bold text-[#111111]">
                {dict.admin.variantsAddTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <input
                  type="text"
                  value={newVarName}
                  onChange={(e) => setNewVarName(e.target.value)}
                  placeholder={dict.admin.variantNamePlaceholder}
                  className="sm:col-span-4 px-3.5 py-2.5 border border-[#E5E5E5] text-xs"
                />
                <input
                  type="color"
                  aria-label="Color hex"
                  value={newVarHex}
                  onChange={(e) => setNewVarHex(e.target.value)}
                  className="sm:col-span-1 h-10 w-full border border-[#E5E5E5] cursor-pointer"
                />
                <input
                  type="text"
                  value={newVarSku}
                  onChange={(e) => setNewVarSku(e.target.value)}
                  placeholder={dict.admin.variantSkuPlaceholder}
                  className="sm:col-span-2 px-3.5 py-2.5 border border-[#E5E5E5] text-xs"
                />
                <input
                  type="text"
                  value={newVarImg}
                  onChange={(e) => setNewVarImg(e.target.value)}
                  placeholder={dict.admin.variantImagePlaceholder}
                  className="sm:col-span-3 px-3.5 py-2.5 border border-[#E5E5E5] text-xs"
                />
                <button
                  type="submit"
                  className="sm:col-span-2 inline-flex items-center justify-center gap-1 px-4 py-2.5 bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.12em] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{dict.admin.variantAddBtn}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'currencies' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
              <div>
                <h2 className="font-display text-xl font-bold text-[#111111]">
                  {dict.admin.currenciesTitle}
                </h2>
                <p className="mt-1 text-sm text-[#666666]">
                  {dict.admin.currenciesBaseNotice}
                </p>
              </div>

              <div className="space-y-3">
                {currencies.map((curr) => (
                  <div
                    key={curr.code}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-4 bg-[#F7F7F7] border border-[#E5E5E5]"
                  >
                    <div className="sm:col-span-3">
                      <p className="text-sm font-bold text-[#111111]">
                        {curr.code} ({curr.symbol})
                      </p>
                      <p className="text-xs text-[#666666]">
                        {curr.isBase ? 'Base & Settlement Currency' : 'Display Currency'}
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-[#666666] mb-1">
                        Rate per 1 PLN
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        min="0.001"
                        disabled={curr.isBase}
                        value={curr.rateFromPln}
                        onChange={(e) => {
                          const rate = Number(e.target.value);
                          if (rate > 0) {
                            upsertCurrency({ ...curr, rateFromPln: rate });
                            flashSaved();
                          }
                        }}
                        className="w-full px-3 py-2 border border-[#E5E5E5] bg-white disabled:opacity-60 text-xs tabular-nums"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-[#666666] mb-1">
                        Rounding
                      </label>
                      <select
                        disabled={curr.isBase}
                        value={curr.rounding}
                        onChange={(e) => {
                          upsertCurrency({
                            ...curr,
                            rounding: e.target.value as RoundingRule,
                          });
                          flashSaved();
                        }}
                        className="w-full px-3 py-2 border border-[#E5E5E5] bg-white disabled:opacity-60 text-xs"
                      >
                        <option value="whole">Whole number</option>
                        <option value="nearest5">Nearest 5</option>
                        <option value="exact">2 decimals</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3 flex items-center justify-end gap-2">
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#111111] cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={curr.isBase}
                          checked={curr.active}
                          onChange={(e) => {
                            upsertCurrency({ ...curr, active: e.target.checked });
                            flashSaved();
                          }}
                          className="w-4 h-4 accent-[#111111]"
                        />
                        <span>Active</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleAddCurrency}
              className="bg-white border border-[#E5E5E5] p-6 space-y-4"
            >
              <h3 className="font-display text-lg font-bold text-[#111111]">
                {dict.admin.currenciesAddTitle}
              </h3>
              {currError && (
                <p className="text-xs font-semibold text-[#333333]">
                  {currError}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <input
                  type="text"
                  maxLength={3}
                  value={newCurrCode}
                  onChange={(e) => setNewCurrCode(e.target.value.toUpperCase())}
                  placeholder={dict.admin.currencyCodePlaceholder}
                  className="sm:col-span-3 px-3.5 py-2.5 border border-[#E5E5E5] text-xs uppercase"
                />
                <input
                  type="text"
                  maxLength={4}
                  value={newCurrSymbol}
                  onChange={(e) => setNewCurrSymbol(e.target.value)}
                  placeholder={dict.admin.currencySymbolPlaceholder}
                  className="sm:col-span-2 px-3.5 py-2.5 border border-[#E5E5E5] text-xs"
                />
                <input
                  type="number"
                  step="0.001"
                  value={newCurrRate}
                  onChange={(e) => setNewCurrRate(e.target.value)}
                  placeholder={dict.admin.currencyRatePlaceholder}
                  className="sm:col-span-3 px-3.5 py-2.5 border border-[#E5E5E5] text-xs"
                />
                <select
                  value={newCurrPos}
                  onChange={(e) =>
                    setNewCurrPos(e.target.value as 'prefix' | 'suffix')
                  }
                  className="sm:col-span-2 px-3 py-2.5 border border-[#E5E5E5] text-xs bg-white"
                >
                  <option value="prefix">Prefix (£80)</option>
                  <option value="suffix">Suffix (80 zł)</option>
                </select>
                <button
                  type="submit"
                  className="sm:col-span-2 px-4 py-2.5 bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.12em] transition-colors"
                >
                  {dict.admin.currencyAddBtn}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-[#111111]">
                  {dict.admin.tabs.orders} ({orders.length})
                </h2>
                <p className="mt-1 text-xs text-[#666666]">
                  {dict.admin.ordersPaymentSeparatedNote}
                </p>
              </div>

              <input
                type="search"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="TW-DEMO-..."
                aria-label="Search demo orders"
                className="px-4 py-2 border border-[#E5E5E5] text-xs w-full sm:w-56"
              />
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-8 bg-[#F7F7F7] border border-[#E5E5E5] text-center space-y-3">
                <p className="text-sm text-[#666666]">{dict.admin.ordersEmpty}</p>
                <Link
                  href={`/${locale}/shop`}
                  className="inline-block px-6 py-2.5 bg-[#111111] text-white text-xs font-semibold uppercase tracking-[0.14em]"
                >
                  {dict.cart.goToShop}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#F7F7F7] border border-[#E5E5E5] p-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E5E5]">
                      <div>
                        <p className="text-sm font-bold text-[#111111] tabular-nums">
                          {ord.orderNumber} · {ord.customer.fullName}
                        </p>
                        <p className="text-xs text-[#666666]">
                          {ord.customer.email} · {ord.customer.phone}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-white border border-[#E5E5E5] text-xs font-semibold text-[#111111]">
                          Payment: {ord.paymentStatus}
                        </span>
                        <select
                          aria-label="Fulfillment status"
                          value={ord.fulfillmentStatus}
                          onChange={(e) =>
                            updateOrderStatus(
                              ord.id,
                              e.target.value as DemoOrder['fulfillmentStatus']
                            )
                          }
                          className="px-3 py-1 bg-white border border-[#111111] text-xs font-semibold text-[#111111]"
                        >
                          <option value="demo_new">New (Demo)</option>
                          <option value="demo_in_review">In Review</option>
                          <option value="demo_in_progress">Sewing in Progress</option>
                          <option value="demo_completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {ord.items.map((it) => (
                        <div
                          key={`${it.productId}-${it.variantId}`}
                          className="flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 border border-[#111111]/40"
                              style={{ backgroundColor: it.colorHex }}
                            />
                            <strong>{it.productName}</strong> ({it.colorName}) ×{' '}
                            {it.quantity}
                          </span>
                          <span className="font-semibold tabular-nums">
                            {formatCurrencyAmount(it.lineTotalPln, plnCurrency, locale)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between font-bold text-sm tabular-nums">
                        <span>
                          Settlement: {ord.settlementCurrency} (Display:{' '}
                          {ord.displayCurrency})
                        </span>
                        <span>
                          {formatCurrencyAmount(ord.baseTotalPln, plnCurrency, locale)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-5 max-w-3xl">
            <h2 className="font-display text-xl font-bold text-[#111111]">
              {dict.admin.tabs.settings}
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="st-ig"
                  className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                >
                  {dict.admin.instagramSettingLabel}
                </label>
                <input
                  id="st-ig"
                  type="url"
                  value={storeSettings.instagramUrl}
                  onChange={(e) => {
                    updateStoreSettings({ instagramUrl: e.target.value });
                    flashSaved();
                  }}
                  className="w-full px-4 py-2.5 border border-[#E5E5E5] text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="st-ig-mode"
                  className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                >
                  {dict.admin.instagramModeLabel}
                </label>
                <select
                  id="st-ig-mode"
                  value={storeSettings.instagramFeedMode}
                  onChange={(e) => {
                    updateStoreSettings({
                      instagramFeedMode: e.target.value as
                        | 'curated_demo'
                        | 'live_api_ready',
                    });
                    flashSaved();
                  }}
                  className="w-full px-4 py-2.5 border border-[#E5E5E5] text-sm bg-white"
                >
                  <option value="curated_demo">
                    {dict.admin.instagramModeCurated}
                  </option>
                  <option value="live_api_ready">
                    {dict.admin.instagramModeApi}
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
