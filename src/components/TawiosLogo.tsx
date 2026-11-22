import React from 'react';

interface TawiosLogoProps {
  className?: string;
  inverted?: boolean;
}

/**
 * Typographic wordmark faithful to the tall sculpted serif TAWIOS emblem
 * supplied by the brand owner.
 */
export function TawiosLogo({ className = '', inverted = false }: TawiosLogoProps) {
  return (
    <span
      className={`inline-flex items-center select-none font-display font-bold tracking-[0.14em] uppercase ${
        inverted ? 'text-white' : 'text-[#111111]'
      } ${className}`}
      style={{
        fontStretch: 'condensed',
        lineHeight: 1,
      }}
    >
      TAWIOS
    </span>
  );
}

