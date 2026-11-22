# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated-via-spec: Next.js (App Router) + TypeScript (strict) + Tailwind CSS modular monolith (without Shopify/SaaS e-commerce builders, per Technical Specification v1.2).

## Users

1. **Shoppers & Workshop Visitors** across Ukraine, Poland, Germany, Ireland, and wider EU looking for author-sewn non-leather textile bags, clear color-by-color galleries, relative scale on a human figure, transparent pricing, and low-friction ordering.
2. **Founder / Owner-Maker** (based in Dublin, Ireland; preparing to relaunch sales & future workshops) needing an intuitive non-technical Admin panel to update bag models, verified characteristics, color variants, photos, translations, and currency rates independently.

## Product Purpose

Deliver a multilingual, minimalist custom e-commerce DEMO storefront for **TAWIOS** demonstrating the visual concept, 4-language switching (`UK`, `EN`, `PL`, `DE`), `PLN` base currency with transparent display currency conversion, color-linked multi-angle photo galleries with lightbox zoom, 2D silhouette proportion preview, short guest order/checkout simulation, separate Workshops preview, Instagram `@_tawios_` integration, and interactive Admin CMS capabilities.

## Positioning

Author-crafted, small-batch **non-leather textile bags** designed and sewn by hand — where tactile quilted velvet, suede-feel textiles, bouclé, houndstooth weave, and botanical tapestries replace mass-produced leather, paired with transparent `PLN` pricing and direct maker accountability.

## Operating Context

- Current deliverable is an interactive **DEMO storefront** without live payment gateway capture or production database persistence; demo actions are clearly labeled as simulations.
- Base & settlement currency is strictly **PLN (Polish Złoty)**; additional display currencies (`EUR`, `USD`, `UAH`, extensible via Admin) show indicative conversions without masking actual settlement currency at checkout.
- Official Instagram account: `https://www.instagram.com/_tawios_/`.

## Capabilities and Constraints

- **Languages confirmed**: Ukrainian (`uk`), English (`en`), Polish (`pl`), German (`de`). Language switcher must be prominent immediately on entry (globe icon + explicit language codes) across desktop and mobile.
- **No invented product specs**: Characteristics display strictly what is confirmed by materials/photos (craftsmanship, observable textile type, visible hardware/closures, visible carry straps). No fabricated dimensions in cm, weight, fabric percentages, or care instructions.
- **Strict variant photo integrity**: Selecting a color switches gallery and silhouette color strictly to that variant's photos; a variant without photos renders a neutral studio placeholder rather than showing another color's photo.
- **Open client confirmations (explicitly unresolved)**: final pricelist (`basePricePln` values are indicative demo figures), default launch locale, exact dimensions/weights per model, final order workflow preference (Order Request vs instant Online Payment / BLIK / Stripe / Mollie), shipping countries & tariff matrix, and final Workshop format (video/PDF/live/in-person).

## Brand Commitments

- Brand name & wordmark: **TAWIOS** (`media_1795215702233_15ee6038.jpg`).
- Tourmaline brand palette (`img/WhatsApp Image 2026-11-20 at 2.36.02 p.m..jpeg`): Mist Grey-Blue `#C3CCD6`, Blush Mauve `#D8B3C7`, Tourmaline Plum `#A06E83`, Olive Moss `#7F7D5E`, Deep Slate Pine `#344E4F` paired with clean gallery white `#FFFFFF` and cool studio stone `#F2F4F6`.
- Visual minimalism so the bags remain the focal center, never competing with noisy UI chrome.

## Evidence on Hand

- 44 brand, editorial, and bag photographs in `/Users/arkady/Documents/tawios/img/` + uploaded brand logo & Tourmaline palette board, converted cleanly into `public/images/`.
- Full call transcript (`Griffith College 3`) & Technical Specification v1.2 (`handmade_bags_technical_specification (1).pdf`).
- Reference links for UX inspiration: `global.bagllet.com` (silhouette guide), `105store.com.ua` (clean product-forward grid), `helenaatelier.com` (multi-section storefront & footer clarity), MAURI mobile header screenshot (globe language dropdown).
- Absences not to fabricate: live reviews/ratings, real shipping rates, confirmed garment-level cm measurements, workshop schedules/videos, live Instagram API feed tokens.

## Product Principles

1. **Bags Lead Every Viewport**: Clean gallery grounds and generous spacing keep textile textures and silhouettes center stage.
2. **Honest & Transparent by Default**: Never fabricate missing specs, never pass demo checkout or converted estimate currencies off as live charges or final settlement currencies.
3. **Zero-Friction Multilingual Access**: All four confirmed languages (`UK`, `EN`, `PL`, `DE`) and currency conversion remain effortless from the very first glance on any screen size.
4. **Owner Autonomy**: Every characteristic, color variant, photo assignment, and currency conversion rate is cleanly editable in Admin without code edits.
5. **Custom Modularity**: Built as clean, typed TypeScript modules ready to swap demo storage for PostgreSQL/Prisma + chosen PSP webhooks in MVP Phase 2.

## Accessibility & Inclusion

- Target WCAG 2.2 AA contrast (`≥ 4.5:1` body, `≥ 3:1` headings/controls).
- Full keyboard navigation, visible focus states, screen-reader labels, and color swatches always paired with explicit text names.
- Respect `prefers-reduced-motion`.

