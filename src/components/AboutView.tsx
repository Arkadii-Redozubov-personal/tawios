'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, CheckCircle2, MoreVertical } from 'lucide-react';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/lib/types';
import { useStore } from '@/components/StoreProvider';
import { InstagramSection } from '@/components/InstagramSection';
import { RevealCard } from '@/components/RevealCard';

interface AboutViewProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * 105.Store-inspired 6-band monochrome editorial About Us page populated with
 * authentic verified TAWIOS brand facts from @_tawios_:
 * 1. Asymmetric Hero with staggered 2-photo composition, outline watermark & scroll cue
 * 2. Full-bleed darkened interlude + flush-bottom Instagram mockup card
 * 3. Founder & Materials narrative + asymmetric 3-photo triptych + evolution prose
 * 4. 3-column diagonal-symmetry magazine collage + two editorial value callouts
 * 5. Seamless pure-black Instagram gallery band
 * 6. Dark split bespoke consultation form separated by architectural hairlines
 */
export function AboutView({ locale, dict }: AboutViewProps) {
  const { storeSettings } = useStore();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  function handleConsultSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || contact.trim().length < 4) {
      setError(dict.checkout.validationHeading);
      return;
    }
    setError('');
    setSent(true);
  }

  return (
    <div className="bg-white overflow-x-clip">
      {/* BAND 1 — 105.Store Asymmetric Editorial Hero */}
      <section className="relative bg-white pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-28 overflow-hidden">
        {/* Subtle hollow outline watermark behind hero photography */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute inset-x-0 top-[54%] -translate-y-1/2 max-w-7xl mx-auto px-8 pointer-events-none select-none z-0"
        >
          <p className="tawios-outline-watermark font-sans font-bold text-[86px] xl:text-[104px] leading-none tracking-[0.04em] uppercase whitespace-nowrap">
            {dict.about.watermarkTop}
          </p>
          <p className="tawios-outline-watermark font-sans font-bold text-[86px] xl:text-[104px] leading-none tracking-[0.04em] uppercase text-right mt-14 whitespace-nowrap">
            {dict.about.watermarkBottom}
          </p>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
            {/* Left Copy Column (~42%) */}
            <div className="lg:col-span-5 pt-2 lg:pt-10 space-y-6 lg:space-y-8">
              <p className="text-sm sm:text-[15px] text-[#888888] font-normal">
                {dict.about.eyebrow}
              </p>

              <h1 className="font-sans text-5xl sm:text-6xl lg:text-[4.2rem] font-light tracking-[0.06em] text-[#111111] leading-none">
                {dict.about.title}
              </h1>

              <p className="text-sm sm:text-[15px] text-[#555555] leading-[1.7] max-w-sm lg:ml-16">
                {dict.about.subtitle}
              </p>

              <div className="pt-2 lg:pt-12 lg:ml-12">
                <a
                  href="#about-story"
                  aria-label={dict.about.scrollAria}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white transition-colors duration-250"
                >
                  <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
                </a>
              </div>
            </div>

            {/* Center Lower Staggered Portrait (~29%) */}
            <div className="lg:col-span-3 lg:mt-24">
              <div className="relative aspect-[3/4] rounded-[10px] overflow-hidden bg-[#F5F5F5]">
                <Image
                  src="/images/products/quilted-flap-black-studio.webp"
                  alt="TAWIOS black quilted flap bag with gold turn-lock clasp"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 28vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Higher Staggered Portrait (~29%) */}
            <div className="lg:col-span-4">
              <div className="relative aspect-[3/4] rounded-[10px] overflow-hidden bg-[#F5F5F5]">
                <Image
                  src="/images/products/suede-sling-silver-editorial.webp"
                  alt="TAWIOS mist silver suede-feel sling bag styled in editorial setting"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 32vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BAND 2 — Full-Bleed Dark-Overlay Interlude + Flush-Bottom Instagram Card */}
      <section className="relative w-full bg-[#141414] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/editorial/tassel-detail.webp"
            alt="TAWIOS handmade hardware and textile atelier mood"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/62 to-black/48"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 lg:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
            {/* Left Manifesto & CTA */}
            <RevealCard
              direction="up"
              delayMs={0}
              className="lg:col-span-6 h-auto pb-12 sm:pb-16 lg:pb-20 space-y-8"
            >
              <p className="text-sm sm:text-[15px] text-white/90 leading-[1.7] max-w-md">
                {dict.about.bannerManifesto}
              </p>

              <div className="space-y-3 pt-2">
                <h2 className="font-sans text-3xl sm:text-4xl lg:text-[2.6rem] font-medium text-white leading-[1.15] tracking-[-0.015em]">
                  {dict.about.bannerTitle}
                </h2>
                <p className="text-sm sm:text-base text-white/75">
                  {dict.about.bannerSubtitle}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href={`/${locale}/shop`}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white text-white hover:bg-white hover:text-[#111111] text-sm font-medium transition-colors duration-250"
                >
                  <span>{dict.about.bannerCta}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
                </Link>
              </div>
            </RevealCard>

            {/* Right Floating White Instagram Post Card — Flush to Bottom Edge */}
            <RevealCard
              direction="up"
              delayMs={130}
              className="lg:col-span-6 h-auto flex justify-center lg:justify-end"
            >
              <a
                href={storeSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full max-w-[440px] bg-white rounded-t-[14px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
              >
                <div className="px-4 py-3 flex items-center justify-between border-b border-[#EFEFEF]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full border border-[#111111] bg-[#FAFAFA] flex items-center justify-center font-display text-[9px] font-bold tracking-[0.06em] text-[#111111]">
                      TW
                    </span>
                    <span className="text-xs font-semibold text-[#111111]">
                      {storeSettings.instagramHandle}
                    </span>
                  </div>
                  <MoreVertical className="w-4 h-4 text-[#555555]" strokeWidth={1.6} />
                </div>
                <div className="relative aspect-[4/3.6] bg-[#F5F5F5] overflow-hidden">
                  <Image
                    src="/images/products/quilted-flap-plum-studio.webp"
                    alt="TAWIOS deep plum quilted velvet bag in studio"
                    fill
                    sizes="(max-width: 1024px) 100vw, 440px"
                    className="object-cover tawios-zoom-media tawios-zoom-target"
                  />
                </div>
              </a>
            </RevealCard>
          </div>
        </div>
      </section>

      {/* BAND 3 — Founder, Craft & Materials Narrative + Asymmetric 3-Photo Triptych */}
      <section id="about-story" className="py-16 sm:py-24 bg-white overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
          {/* Offset 2-Column Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <RevealCard direction="up" delayMs={0} className="lg:col-span-4 h-auto">
              <h2 className="font-sans text-[15px] sm:text-base font-semibold text-[#111111]">
                {dict.about.storyEyebrow}
              </h2>
            </RevealCard>

            <RevealCard
              direction="up"
              delayMs={100}
              className="lg:col-span-6 h-auto space-y-5 text-sm sm:text-[15px] text-[#555555] leading-[1.72]"
            >
              <p>{dict.about.storyBody1}</p>
              <p>{dict.about.storyBody2}</p>
              <p>{dict.about.storyBody3}</p>
            </RevealCard>
          </div>

          {/* Asymmetric 3-Photo Strip (105.Store ratio ~ 4 : 5 : 3) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
            <RevealCard
              index={0}
              columns={3}
              direction="left"
              className="md:col-span-4 h-auto"
            >
              <div className="relative h-[280px] sm:h-[360px] lg:h-[400px] rounded-[12px] overflow-hidden bg-[#F5F5F5]">
                <Image
                  src="/images/editorial/atelier-sewing.webp"
                  alt="TAWIOS handmade sewing process on studio machine"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </RevealCard>

            <RevealCard
              index={1}
              columns={3}
              direction="left"
              className="md:col-span-5 h-auto"
            >
              <div className="relative h-[280px] sm:h-[360px] lg:h-[400px] rounded-[12px] overflow-hidden bg-[#F5F5F5]">
                <Image
                  src="/images/products/quilted-flap-houndstooth-detail.webp"
                  alt="Close-up of TAWIOS woven upholstery fabric and metal chain hardware"
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </RevealCard>

            <RevealCard
              index={2}
              columns={3}
              direction="left"
              className="md:col-span-3 h-auto"
            >
              <div className="relative h-[280px] sm:h-[360px] lg:h-[400px] rounded-[12px] overflow-hidden bg-[#F5F5F5]">
                <Image
                  src="/images/editorial/beaded-craft.webp"
                  alt="Handmade beaded piece symbolizing TAWIOS origins"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
            </RevealCard>
          </div>

          {/* Centered Evolution Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <RevealCard
              direction="up"
              delayMs={0}
              className="lg:col-start-5 lg:col-span-6 h-auto space-y-5 text-sm sm:text-[15px] text-[#555555] leading-[1.72]"
            >
              <p>{dict.about.evolutionBody1}</p>
              <p>{dict.about.evolutionBody2}</p>
            </RevealCard>
          </div>
        </div>
      </section>

      {/* BAND 4 — 3-Column Diagonal-Symmetry Magazine Collage + Value Callouts */}
      <section className="pb-20 sm:pb-28 bg-white overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-7 items-stretch">
            {/* Left Column: Square Studio Top + Callout 1 Bottom */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-8">
              <RevealCard direction="left" delayMs={0} className="h-auto">
                <div className="relative aspect-square rounded-[10px] overflow-hidden bg-[#F5F5F5]">
                  <Image
                    src="/images/products/suede-sling-terracotta-studio.webp"
                    alt="TAWIOS terracotta suede-feel sling bag studio view"
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </RevealCard>

              <RevealCard direction="up" delayMs={80} className="h-auto space-y-2.5">
                <h3 className="font-sans text-[15px] sm:text-base font-semibold text-[#111111]">
                  {dict.about.callout1Title}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {dict.about.callout1Body}
                </p>
              </RevealCard>
            </div>

            {/* Center Column: Full-Height Tall Anchor Portrait */}
            <RevealCard
              direction="up"
              delayMs={60}
              className="lg:col-span-6 h-full"
            >
              <div className="relative w-full h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[580px] rounded-[12px] overflow-hidden bg-[#F5F5F5]">
                <Image
                  src="/images/products/dome-backpack-sand-shoulder.webp"
                  alt="TAWIOS handmade sand textile backpack worn on shoulder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </RevealCard>

            {/* Right Column: Callout 2 Top + Studio Image Bottom (Mirror Symmetry) */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-8">
              <RevealCard direction="up" delayMs={100} className="h-auto space-y-2.5">
                <h3 className="font-sans text-[15px] sm:text-base font-semibold text-[#111111]">
                  {dict.about.callout2Title}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {dict.about.callout2Body}
                </p>
              </RevealCard>

              <RevealCard direction="right" delayMs={140} className="h-auto">
                <div className="relative aspect-[4/3.6] rounded-[10px] overflow-hidden bg-[#F5F5F5]">
                  <Image
                    src="/images/products/boucle-sling-black-studio.webp"
                    alt="TAWIOS black textured bouclé sling bag studio view"
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </RevealCard>
            </div>
          </div>
        </div>
      </section>

      {/* BAND 5 — Seamless Dark Instagram Strip */}
      <InstagramSection dict={dict} />

      {/* BAND 6 — 105.Store Dark Split Consultation Form */}
      <section className="bg-[#000000] text-white py-16 sm:py-24 border-t border-white/14 overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <RevealCard direction="left" delayMs={0} className="lg:col-span-5 h-auto">
              <div className="relative aspect-[4/4.6] rounded-[12px] overflow-hidden bg-[#141414]">
                <Image
                  src="/images/products/ring-backpack-navy-studio.webp"
                  alt="TAWIOS navy velvet and check woven backpack"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </RevealCard>

            <RevealCard
              direction="up"
              delayMs={120}
              className="lg:col-span-7 h-auto space-y-6"
            >
              <p className="text-sm text-[#8C8C8C]">{dict.about.consultEyebrow}</p>

              <h2 className="font-sans text-3xl sm:text-4xl font-medium text-white leading-[1.2] tracking-[-0.015em] max-w-xl">
                {dict.about.consultTitle}
              </h2>

              <div className="space-y-1 text-sm sm:text-[15px] text-[#C8C8C8] max-w-lg">
                <p className="text-white font-medium">{dict.about.consultLead}</p>
                <p>{dict.about.consultBody}</p>
              </div>

              {sent ? (
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-[#1C1C1C] border border-white/25 text-sm font-semibold text-white">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span>{dict.about.consultSuccess}</span>
                </div>
              ) : (
                <form
                  onSubmit={handleConsultSubmit}
                  noValidate
                  className="space-y-3.5 max-w-xl pt-2"
                >
                  {error && (
                    <p className="text-xs font-semibold text-white/85">{error}</p>
                  )}

                  <input
                    id="about-consult-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={dict.about.consultNamePlaceholder}
                    aria-label={dict.about.consultNamePlaceholder}
                    className="w-full px-5 py-3.5 rounded-full bg-[#202020] border border-transparent focus:border-white/50 text-white placeholder:text-[#8C8C8C] text-sm focus:outline-none transition-colors"
                  />

                  <input
                    id="about-consult-contact"
                    name="contact"
                    type="text"
                    autoComplete="email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={dict.about.consultContactPlaceholder}
                    aria-label={dict.about.consultContactPlaceholder}
                    className="w-full px-5 py-3.5 rounded-full bg-[#202020] border border-transparent focus:border-white/50 text-white placeholder:text-[#8C8C8C] text-sm focus:outline-none transition-colors"
                  />

                  <textarea
                    id="about-consult-comment"
                    name="comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={dict.about.consultCommentPlaceholder}
                    aria-label={dict.about.consultCommentPlaceholder}
                    className="w-full px-5 py-3.5 rounded-[18px] bg-[#202020] border border-transparent focus:border-white/50 text-white placeholder:text-[#8C8C8C] text-sm focus:outline-none transition-colors resize-none"
                  />

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white text-white hover:bg-white hover:text-[#111111] text-sm font-medium transition-colors duration-250"
                    >
                      <span>{dict.about.consultSubmit}</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
                    </button>
                  </div>
                </form>
              )}
            </RevealCard>
          </div>
        </div>
      </section>
    </div>
  );
}

