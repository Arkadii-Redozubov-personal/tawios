'use client';

import React, { useEffect, useRef, useState } from 'react';

export type RevealDirection = 'left' | 'up' | 'right';
export type RevealSpeed = 'default' | 'fast';

interface RevealCardProps {
  children: React.ReactNode;
  index?: number;
  columns?: number;
  staggerMs?: number;
  delayMs?: number;
  direction?: RevealDirection;
  speed?: RevealSpeed;
  className?: string;
}

/**
 * Silky scroll-triggered reveal using IntersectionObserver + GPU-composited translate3d & opacity.
 * - `direction="left"` glides gently left-to-right with subtle column stagger
 * - `direction="up"` lifts smoothly upward (ideal for section headings, editorial text, FAQ, forms)
 * - `direction="right"` glides softly from right (ideal for right-hand split media)
 * - `speed="fast"` uses snappy 450ms reveal, 50ms stagger, and eager viewport trigger (ideal for product cards)
 */
export function RevealCard({
  children,
  index = 0,
  columns = 4,
  staggerMs,
  delayMs,
  direction = 'left',
  speed = 'default',
  className = '',
}: RevealCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeDelayMs, setActiveDelayMs] = useState(0);
  const resolvedStaggerMs = staggerMs ?? (speed === 'fast' ? 50 : 110);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const computeDelay = () => {
      if (typeof delayMs === 'number') return delayMs;
      const width = typeof window !== 'undefined' ? window.innerWidth : 1440;
      const effectiveColumns =
        width < 640
          ? Math.min(columns, 2)
          : width < 1024
            ? Math.min(columns, 3)
            : columns;
      return (index % Math.max(1, effectiveColumns)) * resolvedStaggerMs;
    };

    if (typeof IntersectionObserver === 'undefined') {
      setActiveDelayMs(0);
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            setActiveDelayMs(entry.boundingClientRect.top < 0 ? 0 : computeDelay());
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: speed === 'fast' ? 0.01 : 0.06,
        rootMargin: speed === 'fast' ? '0px 0px -8px 0px' : '0px 0px -48px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [columns, delayMs, index, resolvedStaggerMs, speed]);

  const hiddenClass =
    direction === 'up'
      ? 'tawios-reveal-hidden-up'
      : direction === 'right'
        ? 'tawios-reveal-hidden-right'
        : 'tawios-reveal-hidden-left';

  const hasExplicitHeight = /\bh-/.test(className);
  const revealSpeedClass =
    speed === 'fast' ? 'tawios-reveal-fast' : 'tawios-reveal';

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${activeDelayMs}ms` : '0ms' }}
      className={`${hasExplicitHeight ? '' : 'h-full '}${revealSpeedClass} ${
        visible ? 'tawios-reveal-visible' : hiddenClass
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}
