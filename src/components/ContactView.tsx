'use client';

import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Instagram, MapPin, Scissors } from 'lucide-react';
import type { Dictionary } from '@/i18n';
import { useStore } from '@/components/StoreProvider';

export function ContactView({ dict }: { dict: Dictionary }) {
  const { storeSettings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError(dict.checkout.errors.fullName);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(dict.checkout.errors.email);
      return;
    }
    if (message.trim().length < 5) {
      setError(dict.checkout.validationHeading);
      return;
    }
    setError('');
    setSent(true);
  }

  return (
    <div className="bg-white">
      <div className="bg-[#FAFAFA] border-b border-[#EAEAEA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-3">
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#111111]">
            {dict.contact.title}
          </h1>
          <p className="text-base text-[#555555] max-w-2xl">
            {dict.contact.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-5">
            <a
              href={storeSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-[14px] bg-[#0B0B0B] hover:bg-[#1C1C1C] text-white p-6 space-y-3 transition-colors"
            >
              <div className="flex items-center justify-between">
                <Instagram className="w-6 h-6 text-white" strokeWidth={1.6} />
                <ArrowUpRight className="w-5 h-5" strokeWidth={1.6} />
              </div>
              <h2 className="font-display text-2xl font-bold">
                {dict.contact.instagramCardTitle}
              </h2>
              <p className="text-sm text-[#BDBDBD]">
                {dict.contact.instagramCardBody}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
                {storeSettings.instagramHandle}
              </p>
            </a>

            <div className="rounded-[14px] bg-[#FAFAFA] border border-[#EAEAEA] p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#111111] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]">
                    {dict.contact.studioLocationLabel}
                  </p>
                  <p className="text-sm text-[#555555] mt-0.5">
                    {dict.contact.studioLocationValue}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-[#EAEAEA]">
                <Scissors className="w-5 h-5 text-[#111111] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]">
                    {dict.contact.hoursLabel}
                  </p>
                  <p className="text-sm text-[#555555] mt-0.5">
                    {dict.contact.hoursValue}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-[14px] bg-[#FAFAFA] border border-[#EAEAEA] p-6 sm:p-8 space-y-5">
            <h2 className="font-display text-2xl font-bold text-[#111111]">
              {dict.contact.formTitle}
            </h2>

            {sent ? (
              <div className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-white border border-[#111111] text-sm font-semibold text-[#111111]">
                <CheckCircle2 className="w-5 h-5 text-[#111111]" />
                <span>{dict.contact.formSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {error && (
                  <p className="text-xs font-semibold text-[#111111]">{error}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="ct-name"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                    >
                      {dict.contact.formName} *
                    </label>
                    <input
                      id="ct-name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] bg-white text-sm focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ct-email"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                    >
                      {dict.contact.formEmail} *
                    </label>
                    <input
                      id="ct-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] bg-white text-sm focus:border-[#111111]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="ct-msg"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] mb-1.5"
                  >
                    {dict.contact.formMessage} *
                  </label>
                  <textarea
                    id="ct-msg"
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-[10px] border border-[#E0E0E0] bg-white text-sm focus:border-[#111111]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                >
                  {dict.contact.formSubmit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
