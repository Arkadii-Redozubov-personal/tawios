'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  Globe,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { LOCALE_META, LOCALES } from '@/i18n/config';
import { buildLocalizedPath, type Dictionary } from '@/i18n';
import type { Locale } from '@/lib/types';
import { TawiosLogo } from '@/components/TawiosLogo';
import { useStore } from '@/components/StoreProvider';
import { SearchDropdown } from '@/components/SearchDropdown';

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Monochrome hybrid header fusing 105.Store's centered-logo sticky bar & utility icons
 * with Mauri's inline horizontally expanding Globe language switcher pill.
 * Zero public admin links or DEMO badges.
 */
export function Header({ locale, dict }: HeaderProps) {
  const pathname = usePathname() || `/${locale}`;
  const router = useRouter();
  const {
    activeCurrencies,
    activeCurrency,
    setActiveCurrencyCode,
    cartCount,
    wishlistCount,
    setCartOpen,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [langHover, setLangHover] = useState(false);
  const [langPinned, setLangPinned] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const langExpanded = langHover || langPinned;

  const desktopLangRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 36);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (desktopLangRef.current && !desktopLangRef.current.contains(target)) {
        setLangPinned(false);
      }
      if (mobileLangRef.current && !mobileLangRef.current.contains(target)) {
        setMobileLangOpen(false);
      }
      if (currRef.current && !currRef.current.contains(target)) {
        setCurrOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setLangPinned(false);
        setLangHover(false);
        setMobileLangOpen(false);
        setCurrOpen(false);
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileLangOpen(false);
    setCurrOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  function switchLocale(target: Locale) {
    setLangPinned(false);
    setLangHover(false);
    setMobileLangOpen(false);
    setMobileMenuOpen(false);
    try {
      document.cookie = `tawios_locale=${target};path=/;max-age=31536000;SameSite=Lax`;
      window.localStorage.setItem('tawios_locale', target);
    } catch {
      // ignore storage errors
    }
    const query =
      typeof window !== 'undefined'
        ? window.location.search.replace(/^\?/, '')
        : '';
    router.push(buildLocalizedPath(pathname, target, query));
  }

  const desktopNavItems = [
    { href: `/${locale}`, label: dict.nav.home, exact: true },
    { href: `/${locale}/shop`, label: dict.nav.shop, exact: false },
    { href: `/${locale}/workshops`, label: dict.nav.workshops, exact: false },
    { href: `/${locale}/about`, label: dict.topBar.about, exact: false },
  ];

  const mobileNavItems = [
    { href: `/${locale}/shop`, label: dict.nav.shop },
    { href: `/${locale}/workshops`, label: dict.nav.workshops },
    { href: `/${locale}/about`, label: dict.topBar.about },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const otherLocales = LOCALES.filter((l) => l !== locale);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-250 border-b ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-[#EAEAEA] shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
          : 'bg-white border-[#EAEAEA]'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 transition-all duration-250 ${
          isScrolled ? 'h-15 sm:h-[68px]' : 'h-15 sm:h-[82px]'
        }`}
      >
        {/* LEFT CLUSTER */}
        <div className="flex items-center justify-start gap-1.5 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(true);
              setMobileLangOpen(false);
              setCurrOpen(false);
              setSearchOpen(false);
            }}
            aria-label={dict.nav.menuOpen}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-1.5 -ml-1 rounded-full text-[#111111] hover:bg-[#F4F4F4] transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" strokeWidth={1.6} />
          </button>

          {/* Mobile & Tablet Compact Globe Language Switcher */}
          <div className="lg:hidden relative shrink-0" ref={mobileLangRef}>
            <button
              type="button"
              onClick={() => {
                setMobileLangOpen((v) => !v);
                setCurrOpen(false);
                setSearchOpen(false);
              }}
              aria-haspopup="listbox"
              aria-expanded={mobileLangOpen}
              aria-label={dict.nav.languageLabel}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[#111111] bg-white text-[#111111] text-[11px] font-semibold tracking-[0.08em] uppercase"
            >
              <Globe className="w-3.5 h-3.5 text-[#111111]" strokeWidth={1.7} aria-hidden="true" />
              <span>{LOCALE_META[locale].shortCode}</span>
              <ChevronDown
                className={`w-2.5 h-2.5 text-[#555555] transition-transform ${
                  mobileLangOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>

            {mobileLangOpen && (
              <div
                role="listbox"
                aria-label={dict.nav.languageLabel}
                className="tawios-fade-down absolute left-0 mt-1.5 w-44 bg-white border border-[#E5E5E5] rounded-[12px] shadow-lg py-1.5 z-50 overflow-hidden"
              >
                {LOCALES.map((loc) => {
                  const meta = LOCALE_META[loc];
                  const active = loc === locale;
                  return (
                    <button
                      key={loc}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => switchLocale(loc)}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                        active
                          ? 'bg-[#F4F4F4] text-[#111111] font-bold'
                          : 'text-[#111111] hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <span>{meta.nativeName}</span>
                      <span className="font-semibold tracking-[0.12em] text-[#555555]">
                        {meta.shortCode}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Primary Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-5 xl:gap-7">
            {desktopNavItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[13px] font-semibold uppercase tracking-[0.13em] transition-colors duration-200 whitespace-nowrap py-1 border-b-2 ${
                    isActive
                      ? 'text-[#111111] border-[#111111]'
                      : 'text-[#111111] border-transparent hover:text-[#666666]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* CENTER: Prominent Dead-Center TAWIOS Wordmark */}
        <Link
          href={`/${locale}`}
          aria-label={dict.nav.homeAria}
          className="flex items-center justify-center shrink-0"
        >
          <TawiosLogo
            className={`transition-all duration-250 tracking-[0.16em] sm:tracking-[0.22em] ${
              isScrolled
                ? 'text-[22px] sm:text-[29px] lg:text-[33px]'
                : 'text-[23px] sm:text-[32px] lg:text-[39px]'
            }`}
          />
        </Link>

        {/* RIGHT CLUSTER */}
        <div className="flex items-center justify-end gap-0.5 sm:gap-2">
          {/* Desktop Mauri Inline Horizontally Expanding Globe Language Pill */}
          <div
            ref={desktopLangRef}
            className="hidden lg:flex items-center"
            onMouseEnter={() => setLangHover(true)}
            onMouseLeave={() => setLangHover(false)}
          >
            <div
              role="group"
              aria-label={dict.nav.languageLabel}
              className={`h-9 rounded-full flex items-center bg-white border px-3 transition-all duration-300 ${
                langExpanded
                  ? 'border-[#111111] shadow-[0_6px_20px_rgba(0,0,0,0.06)]'
                  : 'border-[#E0E0E0] hover:border-[#111111]'
              }`}
            >
              <button
                type="button"
                onClick={() => setLangPinned((v) => !v)}
                aria-expanded={langExpanded}
                aria-label={dict.nav.languageLabel}
                className="inline-flex items-center gap-1.5 text-[#111111] shrink-0 focus:outline-none"
              >
                <Globe className="w-[15px] h-[15px] text-[#111111]" strokeWidth={1.6} aria-hidden="true" />
                <span className="text-[12px] font-bold tracking-[0.1em] uppercase border-b border-[#111111] leading-tight">
                  {LOCALE_META[locale].shortCode}
                </span>
              </button>

              <div
                className={`flex items-center overflow-hidden transition-all duration-400 ease-out ${
                  langExpanded
                    ? 'max-w-[140px] opacity-100 ml-2.5 gap-2.5'
                    : 'max-w-0 opacity-0 ml-0 gap-0 pointer-events-none'
                }`}
                aria-hidden={!langExpanded}
              >
                {otherLocales.map((loc) => {
                  const meta = LOCALE_META[loc];
                  return (
                    <button
                      key={loc}
                      type="button"
                      tabIndex={langExpanded ? 0 : -1}
                      onClick={() => switchLocale(loc)}
                      title={meta.nativeName}
                      className="text-[12px] font-medium tracking-[0.1em] uppercase text-[#666666] hover:text-[#111111] whitespace-nowrap transition-colors py-0.5"
                    >
                      {meta.shortCode}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Currency Pill (md+ desktop; inside Mobile Drawer on phones) */}
          <div className="hidden md:block relative" ref={currRef}>
            <button
              type="button"
              onClick={() => {
                setCurrOpen((v) => !v);
                setSearchOpen(false);
                setMobileLangOpen(false);
              }}
              aria-haspopup="listbox"
              aria-expanded={currOpen}
              aria-label={dict.nav.currencyLabel}
              className="inline-flex items-center gap-1 h-9 px-3 rounded-full border border-[#E0E0E0] bg-white hover:border-[#111111] text-[#111111] text-xs font-semibold tracking-wider tabular-nums transition-colors"
            >
              <span>{activeCurrency.code}</span>
              <ChevronDown
                className={`w-3 h-3 text-[#666666] transition-transform ${
                  currOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>

            {currOpen && (
              <div
                role="listbox"
                aria-label={dict.nav.currencyLabel}
                className="tawios-fade-down absolute right-0 mt-2 w-64 bg-white border border-[#E5E5E5] rounded-[14px] shadow-[0_14px_36px_rgba(0,0,0,0.10)] py-2 z-50 overflow-hidden"
              >
                {activeCurrencies.map((curr) => {
                  const isSelected = curr.code === activeCurrency.code;
                  return (
                    <button
                      key={curr.code}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setActiveCurrencyCode(curr.code);
                        setCurrOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#F4F4F4] text-[#111111] font-bold'
                          : 'text-[#111111] hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <span>
                        {curr.code} · {curr.symbol}
                      </span>
                      <span className="text-[11px] text-[#666666] truncate ml-2">
                        {curr.isBase ? 'PLN Base' : `1 PLN ≈ ${curr.rateFromPln}`}
                      </span>
                    </button>
                  );
                })}
                <div className="mt-1 pt-2.5 px-4 border-t border-[#EAEAEA] text-[11px] text-[#666666] leading-snug">
                  {dict.currency.baseCaption}
                </div>
              </div>
            )}
          </div>

          {/* Account / Profile Icon */}
          <Link
            href={`/${locale}/account`}
            aria-label={dict.nav.account}
            title={dict.nav.account}
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full text-[#111111] hover:bg-[#F4F4F4] transition-colors"
          >
            <User className="w-[19px] h-[19px]" strokeWidth={1.6} aria-hidden="true" />
          </Link>

          {/* Live Search Button + Dropdown */}
          <div className="relative" ref={searchRef}>
            <button
              type="button"
              onClick={() => {
                setSearchOpen((v) => !v);
                setCurrOpen(false);
                setMobileLangOpen(false);
              }}
              aria-expanded={searchOpen}
              aria-label={dict.nav.search}
              title={dict.nav.search}
              className={`inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-colors ${
                searchOpen
                  ? 'bg-[#111111] text-white'
                  : 'text-[#111111] hover:bg-[#F4F4F4]'
              }`}
            >
              {searchOpen ? (
                <X className="w-[18px] h-[18px]" strokeWidth={1.7} aria-hidden="true" />
              ) : (
                <Search className="w-[18px] sm:w-[19px] h-[18px] sm:h-[19px]" strokeWidth={1.6} aria-hidden="true" />
              )}
            </button>

            {searchOpen && (
              <SearchDropdown
                locale={locale}
                dict={dict}
                query={searchQuery}
                onQueryChange={setSearchQuery}
                onClose={() => setSearchOpen(false)}
              />
            )}
          </div>

          {/* Wishlist Heart (badge renders only when count > 0) */}
          <Link
            href={`/${locale}/wishlist`}
            aria-label={`${dict.nav.wishlist} (${wishlistCount})`}
            title={dict.nav.wishlist}
            className="relative inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-[#111111] hover:bg-[#F4F4F4] transition-colors"
          >
            <Heart
              className={`w-[18px] sm:w-[19px] h-[18px] sm:h-[19px] transition-colors ${
                wishlistCount > 0 ? 'fill-[#111111]' : ''
              }`}
              strokeWidth={1.6}
              aria-hidden="true"
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center tabular-nums leading-none">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Bag (badge renders only when count > 0) */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`${dict.nav.cart} (${cartCount})`}
            title={dict.nav.cart}
            className="relative inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-[#111111] hover:bg-[#F4F4F4] transition-colors"
          >
            <ShoppingBag className="w-[18px] sm:w-[19px] h-[18px] sm:h-[19px]" strokeWidth={1.6} aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center tabular-nums leading-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer portaled to document.body so header backdrop-blur never traps fixed positioning */}
      {mobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[90] lg:hidden flex"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-[4px]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-80 max-w-[86vw] bg-white h-[100dvh] shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
                  <Link
                    href={`/${locale}`}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label={dict.nav.homeAria}
                  >
                    <TawiosLogo className="text-xl tracking-[0.2em]" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label={dict.nav.menuClose}
                    className="p-2 -mr-2 rounded-full text-[#111111] hover:bg-[#F4F4F4] transition-colors"
                  >
                    <X className="w-5 h-5" strokeWidth={1.6} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/${locale}/account`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-[#F4F4F4] hover:bg-[#EAEAEA] text-xs font-semibold text-[#111111] transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#111111]" strokeWidth={1.7} />
                    <span>{dict.nav.account}</span>
                  </Link>
                  <Link
                    href={`/${locale}/wishlist`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-[#F4F4F4] hover:bg-[#EAEAEA] text-xs font-semibold text-[#111111] transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#111111]" strokeWidth={1.7} />
                    <span>
                      {dict.nav.wishlist}
                      {wishlistCount > 0 ? ` (${wishlistCount})` : ''}
                    </span>
                  </Link>
                </div>

                <nav
                  aria-label="Mobile navigation"
                  className="flex flex-col divide-y divide-[#F0F0F0]"
                >
                  <Link
                    href={`/${locale}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#111111] hover:text-[#666666] transition-colors"
                  >
                    {dict.nav.home}
                  </Link>
                  {mobileNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#111111] hover:text-[#666666] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href={`/${locale}/legal/delivery-returns`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3.5 text-xs font-medium text-[#666666] hover:text-[#111111] transition-colors"
                  >
                    {dict.topBar.delivery}
                  </Link>
                </nav>
              </div>

              <div className="pt-5 mt-5 border-t border-[#EAEAEA] space-y-4">
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#666666]">
                    {dict.nav.currencyLabel}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCurrencies.map((curr) => {
                      const selected = curr.code === activeCurrency.code;
                      return (
                        <button
                          key={curr.code}
                          type="button"
                          onClick={() => setActiveCurrencyCode(curr.code)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border tabular-nums transition-colors ${
                            selected
                              ? 'bg-[#111111] text-white border-[#111111]'
                              : 'bg-white text-[#111111] border-[#E0E0E0] hover:border-[#111111]'
                          }`}
                        >
                          {curr.code} {curr.symbol}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#666666]">
                    {dict.nav.languageLabel}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {LOCALES.map((loc) => {
                      const meta = LOCALE_META[loc];
                      const active = loc === locale;
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => switchLocale(loc)}
                          className={`px-3 py-2 rounded-full text-xs font-semibold border transition-colors ${
                            active
                              ? 'bg-[#111111] text-white border-[#111111]'
                              : 'bg-white text-[#111111] border-[#E0E0E0] hover:border-[#111111]'
                          }`}
                        >
                          {meta.shortCode} · {meta.nativeName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
