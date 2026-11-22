'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { resolveTranslation, type Dictionary } from '@/i18n';
import type { Locale, ProductMedia } from '@/lib/types';

interface ProductGalleryProps {
  images: ProductMedia[];
  productName: string;
  colorName: string;
  colorHex: string;
  locale: Locale;
  dict: Dictionary;
}

/**
 * Mauri x 105.Store hybrid product gallery:
 * - Desktop: Mauri left vertical thumbnail rail (76x96px) + 105.Store large sticky 4:5 portrait frame
 *   with hover < / > chevrons and floating bottom-left circular zoom trigger (⤢)
 * - Mobile: clean full-width portrait carousel + bottom square thumbnail rail
 * - Lightbox: fullscreen matte-black 2x pan-zoom inspection viewer
 * - Zero leaked photos when a color variant has no studio photography yet
 */
export function ProductGallery({
  images,
  productName,
  colorName,
  colorHex,
  locale,
  dict,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [panOrigin, setPanOrigin] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setActiveIndex(0);
    setZoomed(false);
  }, [images]);

  const safeIndex = images.length > 0 ? Math.min(activeIndex, images.length - 1) : 0;
  const activeImage = images[safeIndex];

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
    setZoomed(false);
  }, [images.length]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setActiveIndex((i) => (i + 1) % images.length);
    setZoomed(false);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
        setZoomed(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxOpen, handlePrev, handleNext]);

  // Strict Neutral Fallback when a color variant has no photos yet
  if (images.length === 0 || !activeImage) {
    return (
      <div className="aspect-[4/5] w-full rounded-[12px] bg-[#F5F5F5] border border-[#E5E5E5] flex flex-col items-center justify-center p-8 text-center">
        <div
          className="w-16 h-16 rounded-full border-2 border-[#111111] mb-5"
          style={{ backgroundColor: colorHex }}
          aria-hidden="true"
        />
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111] mb-2">
          <ImageOff className="w-4 h-4 text-[#666666]" strokeWidth={1.5} />
          <span>{dict.product.fallbackPhotoTitle}</span>
        </div>
        <p className="text-sm text-[#555555] max-w-sm leading-relaxed">
          {dict.product.fallbackPhotoBody.replace('{color}', colorName)}
        </p>
      </div>
    );
  }

  const activeAlt =
    resolveTranslation(activeImage.alt, locale) || `${productName} — ${colorName}`;
  const angleLabel = activeImage.angleLabel
    ? resolveTranslation(activeImage.angleLabel, locale)
    : '';

  return (
    <div className="space-y-3">
      <div className="flex flex-col-reverse lg:flex-row gap-3.5 items-start">
        {/* Left Vertical Thumbnail Rail (Mauri desktop layout; horizontal strip on mobile) */}
        {images.length > 1 && (
          <div
            className="w-full lg:w-[82px] shrink-0 grid grid-cols-5 lg:grid-cols-1 gap-2.5"
            role="list"
            aria-label="Product angles"
          >
            {images.map((img, idx) => {
              const isActive = idx === safeIndex;
              const thumbAlt =
                resolveTranslation(img.alt, locale) ||
                `${productName} angle ${idx + 1}`;
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`${thumbAlt} (${idx + 1})`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative aspect-[4/5] rounded-[8px] overflow-hidden bg-[#F5F5F5] border transition-all ${
                    isActive
                      ? 'border-[#111111] ring-1 ring-[#111111]'
                      : 'border-[#EAEAEA] opacity-70 hover:opacity-100 hover:border-[#999999]'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={thumbAlt}
                    fill
                    sizes="90px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Main 105.Store Sticky Portrait Image Canvas */}
        <div className="group relative flex-1 w-full aspect-[4/5] rounded-[12px] bg-[#F5F5F5] border border-[#EFEFEF] overflow-hidden">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`${activeAlt} — ${dict.product.zoomOpen}`}
            className="w-full h-full relative block cursor-zoom-in"
          >
            <Image
              src={activeImage.url}
              alt={activeAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </button>

          {/* 105.Store Hover Edge Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label={dict.product.prevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/92 hover:bg-white shadow-[0_4px_14px_rgba(0,0,0,0.10)] flex items-center justify-center text-[#111111] lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-250"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label={dict.product.nextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/92 hover:bg-white shadow-[0_4px_14px_rgba(0,0,0,0.10)] flex items-center justify-center text-[#111111] lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-250"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.6} />
              </button>
            </>
          )}

          {/* 105.Store Floating Bottom-Left Zoom Button + Angle/Counter Pill */}
          <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={dict.product.zoomOpen}
              title={dict.product.zoomOpen}
              className="w-10 h-10 rounded-full bg-white/95 hover:bg-[#111111] text-[#111111] hover:text-white shadow-[0_4px_14px_rgba(0,0,0,0.10)] flex items-center justify-center transition-colors"
            >
              <Maximize2 className="w-4 h-4" strokeWidth={1.7} />
            </button>
            {angleLabel && (
              <span className="px-3 py-1.5 rounded-full bg-white/92 backdrop-blur-xs text-[11px] font-medium text-[#111111]">
                {angleLabel}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <span className="pointer-events-none absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-full bg-black/75 text-white text-[11px] font-semibold tabular-nums">
              {safeIndex + 1} / {images.length}
            </span>
          )}
        </div>
      </div>

      {/* Fullscreen Matte-Black 2x Pan-Zoom Lightbox (portaled to document.body above sticky header) */}
      {lightboxOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] bg-[#0B0B0B] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} — ${colorName}`}
          >
            <div className="px-4 sm:px-6 py-4 flex items-center justify-between text-white border-b border-white/15">
              <div className="min-w-0">
                <p className="font-display text-lg font-bold truncate">
                  {productName}
                </p>
                <p className="text-xs text-[#A8A8A8]">
                  {colorName} · {safeIndex + 1} / {images.length}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setZoomed((z) => !z);
                    setPanOrigin({ x: 50, y: 50 });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  {zoomed ? (
                    <>
                      <ZoomOut className="w-4 h-4" strokeWidth={1.6} />
                      <span>{dict.product.zoomOut}</span>
                    </>
                  ) : (
                    <>
                      <ZoomIn className="w-4 h-4" strokeWidth={1.6} />
                      <span>{dict.product.zoomIn}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxOpen(false);
                    setZoomed(false);
                  }}
                  aria-label={dict.product.zoomClose}
                  className="p-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.6} />
                </button>
              </div>
            </div>

            <div
              className="flex-1 relative overflow-hidden flex items-center justify-center p-4 sm:p-8"
              onMouseMove={(e) => {
                if (!zoomed) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setPanOrigin({
                  x: Math.max(0, Math.min(100, x)),
                  y: Math.max(0, Math.min(100, y)),
                });
              }}
            >
              <div
                onClick={() => setZoomed((z) => !z)}
                className={`relative w-full h-full max-w-4xl max-h-[78vh] transition-transform duration-300 ${
                  zoomed ? 'cursor-zoom-out scale-[2]' : 'cursor-zoom-in scale-100'
                }`}
                style={{
                  transformOrigin: `${panOrigin.x}% ${panOrigin.y}%`,
                }}
              >
                <Image
                  src={activeImage.url}
                  alt={activeAlt}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label={dict.product.prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-[#111111] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" strokeWidth={1.6} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label={dict.product.nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-[#111111] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" strokeWidth={1.6} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="px-4 py-3 border-t border-white/15 flex justify-center gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => {
                      setActiveIndex(idx);
                      setZoomed(false);
                    }}
                    className={`relative w-14 h-14 rounded-[8px] overflow-hidden border-2 shrink-0 ${
                      idx === safeIndex
                        ? 'border-white'
                        : 'border-transparent opacity-55 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={resolveTranslation(img.alt, locale) || productName}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
