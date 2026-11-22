# TAWIOS — Author Handmade Textile Bags Storefront (DEMO)

Interactive custom e-commerce DEMO storefront and owner Admin CMS preview built for **TAWIOS** (author handmade non-leather textile bags) according to Technical Specification v1.2 and client visual materials.

## Implemented Architecture & Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript (`strict: true`)
- **Styling**: Custom design system on Tailwind CSS v4 (`src/styles/globals.css`) built directly from TAWIOS brand materials (`#C3CCD6`, `#D8B3C7`, `#A06E83`, `#7F7D5E`, `#344E4F`, `#FFFFFF`, `#F2F4F6`)
- **Typography**: `Bona Nova` (display) & `Manrope` (body/UI with `tabular-nums`) supporting Ukrainian (`uk`), English (`en`), Polish (`pl`), and German (`de`)
- **Validation**: `zod` schemas on client & `/api/v1/*` route handlers
- **Testing**: `vitest` unit/integration tests covering currency separation, variant photo integrity, i18n fallbacks, and server-side PLN pricing
- **MVP Phase 2 Blueprint**:
  - `prisma/schema.prisma` — target PostgreSQL relational schema
  - `infrastructure/` — `Dockerfile`, `docker-compose.yml`, and `Caddyfile` for self-hosted VPS deployment

## Key DEMO Capabilities

1. **4 Confirmed Languages (`UK`, `EN`, `PL`, `DE`)**: Prominent Globe switcher in the header on both desktop and mobile (`/[locale]/...`), preserving equivalent sub-routes and saving locale preference.
2. **Base Currency `PLN` + Extensible Conversion**: `PLN` is locked as base and checkout settlement currency. Users can switch display currencies (`EUR`, `USD`, `UAH`, or new currencies added in Admin) with explicit separation between indicative display totals and actual PLN settlement totals at checkout.
3. **Color-Linked Photo Galleries + Lightbox + 2D Silhouette Concept**: Selecting a color switches strictly to that variant's multi-angle photos (with `2×` lightbox zoom), renders a safe neutral fallback if photos are pending, and provides a 2D proportion preview on a 168 cm reference silhouette.
4. **Verified Product Characteristics + Owner Admin Demo (`/[locale]/admin`)**: Only source-verified attributes are displayed. The interactive Admin Demo lets the owner edit names/descriptions across all 4 languages, add/edit/delete characteristics, add color variants, adjust currency rates/rounding, and inspect demo order snapshots.
5. **Short Guest Checkout Simulation (`/[locale]/checkout`)**: Demonstrates both Scenario A (quick Order Request without address/card) and Scenario B (compact guest Online Checkout preview) with server-side PLN calculation.
6. **Instagram Integration**: Direct brand links and gallery strip linking to `https://www.instagram.com/_tawios_/`.

## Local Development & Verification

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
npm run start
```

## Environment Variables (Production MVP Phase 2)

For future production deployment (none required for DEMO mode):

- `DATABASE_URL` — PostgreSQL connection string for Prisma
- `NEXT_PUBLIC_SITE_URL` — Canonical site origin for `sitemap.xml` and `robots.txt`
- Payment PSP / SMTP secrets — configured on VPS outside source control
