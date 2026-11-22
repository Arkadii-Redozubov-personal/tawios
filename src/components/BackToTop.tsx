'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

/**
 * 105.Store-inspired minimalist monochrome floating scroll-to-top pill button.
 * Automatically floats cleanly above the sticky quick-buy bar on product detail pages.
 */
export function BackToTop() {
  const pathname = usePathname() || '';
  const [visible, setVisible] = useState(false);

  const isProductPage = pathname.includes('/product/');

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 640);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className={`fixed right-5 z-20 w-11 h-11 rounded-full bg-white hover:bg-[#111111] text-[#111111] hover:text-white border border-[#E0E0E0] hover:border-[#111111] shadow-[0_6px_20px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all duration-250 ${
        isProductPage ? 'bottom-20' : 'bottom-6'
      }`}
    >
      <ArrowUp className="w-4 h-4" strokeWidth={1.8} />
    </button>
  );
}
