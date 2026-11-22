'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, Instagram } from 'lucide-react';
import type { Dictionary } from '@/i18n';
import { useStore } from '@/components/StoreProvider';

const INSTAGRAM_PREVIEW_IMAGES = [
  '/images/products/quilted-flap-black-studio.webp',
  '/images/products/suede-sling-terracotta-studio.webp',
  '/images/products/dome-backpack-sand-seated.webp',
  '/images/products/crescent-hobo-steps.webp',
  '/images/products/belt-bag-cobalt-detail.webp',
  '/images/editorial/beaded-craft.webp',
];

/**
 * 105.Store-inspired matte dark Instagram gallery strip transitioning cleanly into the dark footer.
 */
export function InstagramSection({ dict }: { dict: Dictionary }) {
  const { storeSettings } = useStore();

  return (
    <section className="py-16 sm:py-20 bg-[#0B0B0B] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-9">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              {dict.home.instagramTitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A8A8A8]">
              {dict.home.instagramText}
            </p>
          </div>
          <a
            href={storeSettings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 self-start md:self-auto px-7 py-3 rounded-full border border-white/80 text-white hover:bg-white hover:text-[#111111] text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
          >
            <Instagram className="w-4 h-4" strokeWidth={1.7} />
            <span>{dict.home.instagramCta}</span>
            <ArrowUpRight className="w-4 h-4" strokeWidth={1.7} />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INSTAGRAM_PREVIEW_IMAGES.map((src, idx) => (
            <a
              key={src}
              href={storeSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-[10px] overflow-hidden bg-[#1C1C1C]"
            >
              <Image
                src={src}
                alt={dict.home.instagramTileAlts[idx] ?? 'TAWIOS Instagram'}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover tawios-zoom-media tawios-zoom-target"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center">
                <Instagram
                  className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  strokeWidth={1.6}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
