'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Instagram, Mail, User } from 'lucide-react';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/lib/types';
import { TawiosLogo } from '@/components/TawiosLogo';
import { useStore } from '@/components/StoreProvider';

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Exact 105.Store matte black (#000000) 3-column asymmetric footer:
 * - Col 1 (~42%): larger inverted white TAWIOS wordmark + manifesto + #1C1C1C social icon pill (no standalone handle text)
 * - Col 2 (~25%): КЛІЄНТАМ uppercase heading + muted clean links
 * - Full-height vertical hairline (rgba(255,255,255,0.14)) dividing Col 2 and Col 3
 * - Col 3 (~33%): КОНТАКТИ + Poland location + worldwide shipping + explicit `Instagram: @_tawios_` link
 * - Bottom copyright bar with legal links on the right
 */
export function Footer({ locale, dict }: FooterProps) {
  const { storeSettings } = useStore();

  return (
    <footer className="bg-[#000000] text-white border-t border-white/14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Column 1: Brand Statement + Social Pill */}
          <div className="lg:col-span-5 py-12 sm:py-16 lg:pr-10 space-y-6">
            <TawiosLogo inverted className="text-3xl sm:text-[36px] tracking-[0.22em]" />
            <p className="text-sm sm:text-[15px] text-white/90 leading-relaxed max-w-sm">
              {dict.footer.statement}
            </p>
            <div className="pt-1">
              <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full bg-[#1C1C1C]">
                <a
                  href={storeSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram ${storeSettings.instagramHandle}`}
                  className="text-white hover:text-[#BDBDBD] transition-colors"
                >
                  <Instagram className="w-[18px] h-[18px]" strokeWidth={1.7} />
                </a>
                <Link
                  href={`/${locale}/contact`}
                  aria-label={dict.nav.contact}
                  className="text-white hover:text-[#BDBDBD] transition-colors"
                >
                  <Mail className="w-[18px] h-[18px]" strokeWidth={1.7} />
                </Link>
                <Link
                  href={`/${locale}/wishlist`}
                  aria-label={dict.nav.wishlist}
                  className="text-white hover:text-[#BDBDBD] transition-colors"
                >
                  <Heart className="w-[17px] h-[17px]" strokeWidth={1.7} />
                </Link>
                <Link
                  href={`/${locale}/account`}
                  aria-label={dict.nav.account}
                  className="text-white hover:text-[#BDBDBD] transition-colors"
                >
                  <User className="w-[17px] h-[17px]" strokeWidth={1.7} />
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: For Clients */}
          <div className="lg:col-span-3 py-10 lg:py-16 lg:px-8 border-t lg:border-t-0 border-white/12">
            <h2 className="text-[13px] font-medium uppercase tracking-[0.16em] text-[#D4D4D4] mb-6 font-sans">
              {dict.footer.navigationTitle}
            </h2>
            <ul className="space-y-3.5 text-sm text-[#9E9E9E]">
              <li>
                <Link href={`/${locale}/shop`} className="hover:text-white transition-colors">
                  {dict.nav.shop}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/workshops`} className="hover:text-white transition-colors">
                  {dict.nav.workshops}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="hover:text-white transition-colors">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/delivery-returns`} className="hover:text-white transition-colors">
                  {dict.footer.legalLinks.delivery}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/account`} className="hover:text-white transition-colors">
                  {dict.nav.account}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contacts — separated by full-height vertical hairline */}
          <div className="lg:col-span-4 py-10 lg:py-16 lg:pl-10 border-t lg:border-t-0 lg:border-l border-white/14 space-y-6">
            <h2 className="text-[13px] font-medium uppercase tracking-[0.16em] text-[#D4D4D4] font-sans">
              {dict.footer.connectTitle}
            </h2>

            <div className="space-y-2 text-sm text-[#9E9E9E]">
              <p className="text-white font-medium">{dict.contact.studioLocationValue}</p>
              <p>{dict.contact.hoursValue}</p>
              <a
                href={storeSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white/90 hover:text-white underline underline-offset-4 pt-1"
              >
                Instagram: {storeSettings.instagramHandle}
              </a>
            </div>

            <div className="pt-2 space-y-1.5">
              <p className="text-[15px] text-white leading-snug">
                {dict.footer.atelierMotto}
              </p>
              <p className="text-xs text-[#8C8C8C]">
                {dict.footer.plannedPaymentsLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Bar */}
        <div className="py-6 border-t border-white/14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[13px] text-[#9A9A9A]">
          <p>{dict.footer.copyright}</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href={`/${locale}/legal/terms`} className="hover:text-white transition-colors">
              {dict.footer.legalLinks.terms}
            </Link>
            <Link href={`/${locale}/legal/privacy`} className="hover:text-white transition-colors">
              {dict.footer.legalLinks.privacy}
            </Link>
            <Link href={`/${locale}/legal/cookies`} className="hover:text-white transition-colors">
              {dict.footer.legalLinks.cookies}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
