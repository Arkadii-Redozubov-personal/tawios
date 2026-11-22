'use client';

import React, { useState } from 'react';
import type { Dictionary } from '@/i18n';
import type { CarryStyle, SilhouetteSpec } from '@/lib/types';

interface SilhouetteVisualizerProps {
  spec: SilhouetteSpec;
  productName: string;
  colorName: string;
  colorHex: string;
  dict: Dictionary;
}

/**
 * Clean white schematic card displaying proportional bag scale
 * on a minimal standing female silhouette (168 cm reference).
 */
export function SilhouetteVisualizer({
  spec,
  productName,
  colorName,
  colorHex,
  dict,
}: SilhouetteVisualizerProps) {
  const [carry, setCarry] = useState<CarryStyle>(spec.defaultCarry);

  const activeCarry = spec.availableCarries.includes(carry)
    ? carry
    : spec.defaultCarry;

  const bagW = Math.round(spec.widthRatio * 200);
  const bagH = Math.round(spec.heightRatio * 230);

  const anchors: Record<CarryStyle, { x: number; y: number; strapPath: string }> = {
    shoulder: {
      x: 184 - bagW / 2,
      y: 205,
      strapPath: `M177,114 C180,152 183,182 184,205`,
    },
    crossbody: {
      x: 170 - bagW / 2,
      y: 222,
      strapPath: `M128,113 Q152,168 ${170},222`,
    },
    hand: {
      x: 196 - bagW / 2,
      y: 248,
      strapPath: `M194,230 L196,248`,
    },
    back: {
      x: 152 - bagW / 2,
      y: 138,
      strapPath: `M132,113 L134,148 M172,113 L170,148`,
    },
  };

  const pos = anchors[activeCarry];

  function renderBagShape() {
    const { x, y } = pos;
    switch (spec.bagType) {
      case 'round': {
        const r = Math.max(bagW, bagH) / 2;
        const cx = x + bagW / 2;
        const cy = y + bagH / 2;
        return (
          <g>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={colorHex}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <circle
              cx={cx}
              cy={cy}
              r={r - 4}
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.4"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
          </g>
        );
      }
      case 'crescent': {
        return (
          <path
            d={`M ${x} ${y + 6} Q ${x + bagW / 2} ${y + bagH * 0.42} ${x + bagW} ${y + 6} L ${x + bagW * 0.92} ${y + bagH * 0.72} Q ${x + bagW / 2} ${y + bagH * 1.15} ${x + bagW * 0.08} ${y + bagH * 0.72} Z`}
            fill={colorHex}
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        );
      }
      case 'sling': {
        return (
          <path
            d={`M ${x} ${y} L ${x + bagW} ${y} L ${x + bagW * 0.84} ${y + bagH * 0.85} Q ${x + bagW / 2} ${y + bagH * 1.1} ${x + bagW * 0.16} ${y + bagH * 0.85} Z`}
            fill={colorHex}
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        );
      }
      case 'backpack': {
        return (
          <g>
            <rect
              x={x}
              y={y}
              width={bagW}
              height={bagH}
              rx={bagW * 0.3}
              ry={bagW * 0.22}
              fill={colorHex}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <line
              x1={x + 5}
              y1={y + bagH * 0.52}
              x2={x + bagW - 5}
              y2={y + bagH * 0.52}
              stroke="#FFFFFF"
              strokeOpacity="0.45"
              strokeWidth="1.2"
            />
          </g>
        );
      }
      case 'wallet': {
        return (
          <rect
            x={x}
            y={y}
            width={bagW}
            height={bagH}
            rx={3}
            fill={colorHex}
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        );
      }
      case 'flap':
      default: {
        return (
          <g>
            <rect
              x={x}
              y={y}
              width={bagW}
              height={bagH}
              rx={3}
              fill={colorHex}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <path
              d={`M ${x} ${y + 6} L ${x} ${y + bagH * 0.55} Q ${x + bagW / 2} ${y + bagH * 0.65} ${x + bagW} ${y + bagH * 0.55} L ${x + bagW} ${y + 6} Z`}
              fill={colorHex}
              stroke="#FFFFFF"
              strokeOpacity="0.55"
              strokeWidth="1"
            />
            <rect
              x={x + bagW / 2 - 3}
              y={y + bagH * 0.52}
              width={6}
              height={6}
              fill="#FFFFFF"
            />
          </g>
        );
      }
    }
  }

  return (
    <div className="bg-white rounded-[12px] border border-[#DCE2E8] p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EDF0F4]">
        <div>
          <p className="text-sm font-semibold text-[#182223]">{productName}</p>
          <p className="text-xs text-[#485859] flex items-center gap-1.5 mt-0.5">
            <span
              className="w-3 h-3 rounded-full border border-[#344E4F]/30 inline-block"
              style={{ backgroundColor: colorHex }}
            />
            <span>{colorName}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {spec.availableCarries.map((style) => {
            const active = style === activeCarry;
            return (
              <button
                key={style}
                type="button"
                onClick={() => setCarry(style)}
                aria-pressed={active}
                className={`px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em] border transition-colors ${
                  active
                    ? 'bg-[#344E4F] text-white border-[#344E4F]'
                    : 'bg-white text-[#182223] border-[#C3CCD6] hover:border-[#344E4F]'
                }`}
              >
                {dict.product.carryStyles[style]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pure White Technical Schematic Frame */}
      <div className="bg-white py-2 flex items-center justify-center">
        <svg
          viewBox="0 0 320 440"
          className="w-full max-w-[270px] h-auto"
          role="img"
          aria-label={`${productName} (${colorName}) on 168 cm silhouette`}
        >
          <line
            x1="44"
            y1="38"
            x2="44"
            y2="412"
            stroke="#344E4F"
            strokeWidth="0.9"
            strokeDasharray="3 3"
          />
          <line x1="38" y1="38" x2="50" y2="38" stroke="#182223" strokeWidth="1" />
          <line x1="38" y1="412" x2="50" y2="412" stroke="#182223" strokeWidth="1" />
          <text
            x="24"
            y="225"
            textAnchor="middle"
            transform="rotate(-90 24 225)"
            fill="#485859"
            fontSize="10"
            fontFamily="sans-serif"
            letterSpacing="1"
          >
            168 cm ref.
          </text>

          <line x1="82" y1="412" x2="238" y2="412" stroke="#C3CCD6" strokeWidth="1" />

          <g fill="#121416">
            <ellipse cx="152" cy="60" rx="16" ry="21" />
            <path d="M145,78 L159,78 L161,98 L143,98 Z" />
            <path d="M122,102 C133,96 171,96 182,102 L191,115 C195,123 197,145 198,175 L201,234 L191,236 L186,178 L182,135 L176,172 L180,210 C183,225 182,242 178,256 L172,330 L170,406 L158,406 L157,330 L153,262 L149,330 L146,406 L134,406 L132,330 L126,256 C122,242 121,225 124,210 L128,172 L122,135 L118,178 L113,236 L103,234 L106,175 C107,145 109,123 113,115 Z" />
          </g>

          <path
            d={pos.strapPath}
            fill="none"
            stroke={colorHex === '#1D1F21' || colorHex === '#25272A' ? '#7F7D5E' : colorHex}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {renderBagShape()}
        </svg>
      </div>

      <p className="text-xs text-[#485859] leading-relaxed border-t border-[#EDF0F4] pt-3">
        {dict.product.silhouetteCaption}
      </p>
    </div>
  );
}
