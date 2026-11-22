'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, FileText, Users, Video } from 'lucide-react';
import type { Dictionary } from '@/i18n';
import { RevealCard } from '@/components/RevealCard';

export function WorkshopsView({ dict }: { dict: Dictionary }) {
  const [email, setEmail] = useState('');
  const [preferredFormat, setPreferredFormat] = useState<'video' | 'pdf' | 'live'>('video');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const icons = [Video, FileText, Users];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(dict.checkout.errors.email);
      return;
    }
    setError('');
    setSubmitted(true);
  }

  return (
    <div className="bg-white">
      {/* Clean Monochrome Editorial Header */}
      <div className="bg-[#FAFAFA] border-b border-[#EAEAEA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#111111] text-white text-[11px] font-semibold uppercase tracking-[0.14em]">
              {dict.workshops.statusBadge}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#111111] leading-tight">
              {dict.workshops.title}
            </h1>
            <p className="text-base text-[#555555] leading-relaxed">
              {dict.workshops.subtitle}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-[12px] bg-white border border-[#EAEAEA] overflow-hidden">
              <Image
                src="/images/editorial/atelier-sewing.webp"
                alt="TAWIOS sewing machine and textile craft"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
        <section className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111111]">
              {dict.workshops.formatsTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#555555]">
              {dict.workshops.formatsIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dict.workshops.formats.map((fmt, idx) => {
              const Icon = icons[idx] ?? Video;
              return (
                <RevealCard key={fmt.title} index={idx} columns={3} direction="left">
                  <div className="h-full rounded-[12px] bg-[#FAFAFA] border border-[#EAEAEA] p-6 flex flex-col justify-between gap-5">
                    <div className="space-y-3">
                      <div className="w-11 h-11 rounded-full bg-white border border-[#E0E0E0] flex items-center justify-center text-[#111111]">
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-display text-xl font-bold text-[#111111]">
                        {fmt.title}
                      </h3>
                      <p className="text-sm text-[#555555] leading-relaxed">
                        {fmt.description}
                      </p>
                    </div>
                    <span className="self-start px-3.5 py-1 rounded-full bg-white border border-[#EAEAEA] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#555555]">
                      {fmt.tag}
                    </span>
                  </div>
                </RevealCard>
              );
            })}
          </div>
        </section>

        <RevealCard direction="up" delayMs={0} className="h-auto">
        <section className="rounded-[14px] bg-[#0B0B0B] text-white p-6 sm:p-10">
          <div className="max-w-2xl space-y-5">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {dict.workshops.notifyTitle}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#A8A8A8]">
                {dict.workshops.notifySubtitle}
              </p>
            </div>

            {submitted ? (
              <div className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-[#1C1C1C] border border-white/25 text-sm font-semibold text-white">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>{dict.workshops.notifySuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <label
                      htmlFor="ws-email"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#D4D4D4] mb-1.5"
                    >
                      {dict.workshops.notifyEmail} *
                    </label>
                    <input
                      id="ws-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full min-w-0 px-4 py-2.5 rounded-full border border-white/20 bg-[#1C1C1C] text-white text-sm focus:border-white"
                    />
                    {error && (
                      <p className="mt-1 text-xs text-white/85">{error}</p>
                    )}
                  </div>

                  <div className="min-w-0">
                    <label
                      htmlFor="ws-format"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#D4D4D4] mb-1.5"
                    >
                      {dict.workshops.notifyFormat}
                    </label>
                    <select
                      id="ws-format"
                      name="format"
                      value={preferredFormat}
                      onChange={(e) =>
                        setPreferredFormat(e.target.value as 'video' | 'pdf' | 'live')
                      }
                      className="w-full max-w-full min-w-0 px-4 py-2.5 rounded-full border border-white/20 bg-[#1C1C1C] text-white text-sm focus:border-white"
                    >
                      <option value="video">{dict.workshops.formats[0]?.title}</option>
                      <option value="pdf">{dict.workshops.formats[1]?.title}</option>
                      <option value="live">{dict.workshops.formats[2]?.title}</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-white hover:bg-[#E5E5E5] text-[#111111] text-xs font-bold uppercase tracking-[0.16em] transition-colors"
                >
                  {dict.workshops.notifySubmit}
                </button>
              </form>
            )}
          </div>
        </section>
        </RevealCard>
      </div>
    </div>
  );
}
