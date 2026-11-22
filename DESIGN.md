# Design System — TAWIOS

## Architectural Direction

TAWIOS blends the warm editorial polish, tactile card hover choreography, and utility ergonomics of **105.Store** (`105store.com.ua`) with the calm minimalism, frosted overlays, and inline expanding language switcher of **Mauri Cosmetics** (`mauri-cosmetics.com`), plus **Bagllet**'s 2D standing silhouette schematic — anchored strictly to the client's 5-tone **Tourmaline Brand Palette** (`public/images/brand/tawios-palette.webp`).

- **Soft-Editorial Geometry**: `10px` rounded corners (`rounded-[10px]`) on studio photography, category tiles, macro textures, and product galleries, paired with tactile full-pill (`rounded-full`) CTAs, social pills, and utility controls.
- **Borderless Product Cards with 105.Store Hover Choreography**: Cards float directly on crisp gallery white (`#FFFFFF`) with secondary-angle crossfade + smooth `1.6s cubic-bezier(0.16, 1, 0.3, 1)` zoom (`scale(1.09)`), floating top-right Wishlist Heart (`translate3d` slide-in on hover, stays pinned in Tourmaline Plum when liked), and bottom slide-up Quick-Add bar with vertical text → ShoppingBag icon swap.
- **Committed Color Blocking**: Brand tones structure full architectural bands (`#5B5A42` Olive Moss, `#DFE5EC` Mist Blue-Grey, `#EFE0E8` Blush Mauve, `#7B4D61` Tourmaline Plum, `#344E4F` / `#1D2B2C` Deep Slate Pine).

## Brand Palette

| Token | Hex | Role & Contrast Pairing |
|---|---|---|
| `--bg-canvas` | `#FFFFFF` | Primary gallery background (`#182223` ink) |
| `--bg-surface-soft` | `#F7F8FA` | Subtle utility surfaces, pillars strip, FAQ/drawer footer |
| `--bg-mist-soft` | `#EDF0F4` | Studio photo ground, cart & summary cards |
| `--brand-mist` | `#C3CCD6` | Mist Blue-Grey — hairlines & silhouette section (`#DFE5EC` band) |
| `--brand-blush` | `#D8B3C7` | Blush Mauve — text selection, sticky/consultation CTAs (`#EFE0E8` Workshops & Wishlist bands) |
| `--brand-plum` | `#A06E83` | Tourmaline Plum — active navigation underlines (`#7B4D61` accessible dark plum for liked hearts, badges & hover CTA) |
| `--brand-olive` | `#7F7D5E` | Olive Moss — craft & material split (`#5B5A42` ground with `#FFFFFF` ink; `#ECECE3` tile ground) |
| `--brand-pine` | `#344E4F` | Deep Slate Pine — primary CTAs, quick-add bar, consultation band, `#1D2B2C` top bar & footer |
| `--ink-primary` | `#182223` | High-contrast pine-charcoal typography |
| `--ink-secondary` | `#485859` | Tinted slate secondary text |

## Typography

Loaded via `next/font/google` with full `latin`, `latin-ext` (Polish), and `cyrillic` (Ukrainian) support:

- **Display (`--font-display`)**: `Bona Nova` (400, 700, italic), tracking `-0.015em` — echoes the sculpted serif `TAWIOS` wordmark.
- **Body & UI (`--font-sans`)**: `Manrope` (400, 500, 600, 700), crisp tracked uppercase navigation, pill CTAs, and `.tabular-nums` on all prices and order summaries.

## Key Page & Component Patterns

- **Two-Tier Header (`DemoBanner.tsx` + `Header.tsx` + `SearchDropdown.tsx`)**:
  - **Top Utility Bar**: `52px` Deep Slate Pine (`#1D2B2C`) bar with translucent rounded social pill (`Instagram`, `Contact`, `Workshops`), `@_tawios_` + `DEMO · PLN` note, and right-aligned utility links (`About`, `Workshops`, `Delivery & Payment`, `Returns`, `Contact`, `Admin Demo` pill).
  - **Sticky Main Header**: Compacts smoothly on scroll (`82px → 68px`) with dead-center `TAWIOS` wordmark, 3 clean left nav links, and right utility cluster: **Mauri inline horizontally expanding Globe language pill** (`UK` / `EN` / `PL` / `DE` expanding leftward into open whitespace), Currency Switcher (`PLN ▾`), Customer Profile (`/[locale]/account`), floating Live Search dropdown, Wishlist Heart (`/[locale]/wishlist`), and Shopping Bag opening the frosted-blur `CartDrawer`.
- **Homepage Sections (`HomeView.tsx`)**: Dual-panel editorial Hero with pill CTAs + Mauri flat-bar pagination → 3-pillar craft strip → 5 visual Category cards → 4-col Featured Models with multi-angle hover crossfade → Olive Moss Material & Tourmaline Palette split → Mist Blue-Grey 2D Silhouette Studio → Blush Mauve Workshops band → Mauri 2-column FAQ accordion → `@_tawios_` Instagram gallery → Deep Slate Pine bespoke consultation form.
- **Catalog, Wishlist, Account & PDP**:
  - Catalog supports `?category=` URL sync and desktop 3-col / 4-col density toggle.
  - Wishlist (`/[locale]/wishlist`) preserves selected colorways with 1-click Move to Bag.
  - Customer Profile (`/[locale]/account`) offers an optional local DEMO profile (auto-filling Checkout without blocking guest orders), saved items, and demo order snapshots.
  - PDP includes 105.Store Prev/Grid/Next model arrows, 1+2 rounded photo stack with `2×` opaque Lightbox, `56×56px` photo swatches, Wishlist Heart toggle, 2D Silhouette (`168 cm ref.`), hairline accordions, Related Models, Recently Viewed, and sticky bottom Quick-Buy bar.
- **Architectural Dark Footer (`Footer.tsx`)**: Crowned with the 5-color Tourmaline brand ribbon over `#1D2B2C` pine with hairline vertical column dividers, social pill, customer links, legal templates, and planned launch payment badges.
