'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RevealCardProps {
  children: React.ReactNode;
  index?: number;
  columns?: number;
  className?: string;
}

/**
 * Smooth scroll-triggered entrance moving gently left-to-right with subtle
 * column stagger as cards enter the viewport.
 */
export function RevealCard({
  children,
  index = 0,
  columns = 4,
  className = '',
}: RevealCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -24px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const staggerMs = (index % columns) * 90;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${staggerMs}ms` : '0ms' }}
      className={`h-full transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
      } ${className}`}
    >
      {children}
    </div>
  );
}

