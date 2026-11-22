'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Mail, Sparkles } from 'lucide-react';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/lib/types';
import { useStore } from '@/components/StoreProvider';

interface DemoBannerProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * 105.Store-inspired matte black (#000000) Top Utility Bar:
 * - Left: #1C1C1C pill capsule with white monochrome social/atelier icons (no handle text)
 * - Right: clean horizontal store info links
 */
export function DemoBanner({ locale, dict }: DemoBannerProps) {
  const { storeSettings } = useStore();

  const rightLinks = [
    { href: `/${locale}/about`, label: dict.topBar.about },
    { href: `/${locale}/workshops`, label: dict.topBar.workshops },
    { href: `/${locale}/legal/delivery-returns`, label: dict.topBar.delivery },
    { href: `/${locale}/legal/terms`, label: dict.topBar.returns },
    { href: `/${locale}/contact`, label: dict.topBar.contact },
  ];

  return (
    <div
      role="region"
      aria-label="Store utility navigation"
      className="bg-[#000000] text-white border-b border-white/10"
    >
      {/* Desktop Top Utility Bar */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-6 lg:px-8 h-[52px] items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="inline-flex items-center gap-3.5 px-4 py-1.5 rounded-full bg-[#1C1C1C]">
            <a
              href={storeSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${storeSettings.instagramHandle}`}
              title={`Instagram ${storeSettings.instagramHandle}`}
              className="text-white hover:text-[#BDBDBD] transition-colors duration-200"
            >
              <Instagram className="w-[17px] h-[17px]" strokeWidth={1.7} />
            </a>
            <Link
              href={`/${locale}/contact`}
              aria-label={dict.topBar.contact}
              title={dict.topBar.contact}
              className="text-white hover:text-[#BDBDBD] transition-colors duration-200"
            >
              <Mail className="w-[17px] h-[17px]" strokeWidth={1.7} />
            </Link>
            <Link
              href={`/${locale}/workshops`}
              aria-label={dict.topBar.workshops}
              title={dict.topBar.workshops}
              className="text-white hover:text-[#BDBDBD] transition-colors duration-200"
            >
              <Sparkles className="w-[16px] h-[16px]" strokeWidth={1.7} />
            </Link>
          </div>
        </div>

        <nav
          aria-label="Utility navigation"
          className="flex items-center gap-7 shrink-0"
        >
          {rightLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Slim Utility Strip */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 min-h-9 py-1.5 flex items-center justify-between gap-3 text-[11px]">
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#1C1C1C]">
          <a
            href={storeSettings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${storeSettings.instagramHandle}`}
            className="text-white hover:text-[#CCCCCC]"
          >
            <Instagram className="w-3.5 h-3.5" strokeWidth={1.7} aria-hidden="true" />
          </a>
          <Link
            href={`/${locale}/contact`}
            aria-label={dict.topBar.contact}
            className="text-white hover:text-[#CCCCCC]"
          >
            <Mail className="w-3.5 h-3.5" strokeWidth={1.7} aria-hidden="true" />
          </Link>
        </div>
        <span className="text-[#A8A8A8] truncate">{dict.topBar.atelierCaption}</span>
      </div>
    </div>
  );
}
