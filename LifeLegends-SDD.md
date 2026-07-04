# LifeLegends — Software Design Document & Technical Architecture

Version 1.0 · Pre-implementation (Phase 0)
Status: **Awaiting approval — no code has been written**

---

## 1. Reference Analysis

Derived directly from the attached mockup (10 panels). This is the single source of truth for visual decisions; nothing below deviates from it.

| Panel | Governing pattern |
|---|---|
| 1. Hero | Full-bleed near-black background, oversized sculptural portrait as focal art, huge serif-leaning display headline ("LEGENDS NEVER DIE") left-aligned, small gold eyebrow label above it, single gold-outline CTA, faint page-index ("02 / 03") bottom-left, "scroll to explore" micro-label bottom-center |
| 2. Category grid | 4-up image cards, dark gradient overlay bottom-third for label legibility, gold eyebrow ("EXPLORE"), category name + count, pill "VIEW ALL" CTA centered below |
| 3. Biography page | Two-column: left = title block (role tags, name, dates, tagline, description, two pill buttons), right = large portrait bleeding off-canvas with ambient light-arc behind it; sticky right-side timeline nav (TIMELINE/EARLY LIFE/ACHIEVEMENTS/…); stat strip (700+ Patents / 300+ Inventions / 26 Countries / ∞ Impact) below the fold with vertical divider rules |
| 4. Timeline | Horizontal beaded timeline, alternating date labels above/below the line, gold active node, thin waveform/sparkline motif underneath, centered pill CTA |
| 5. Search | Full-screen overlay, radial nebula art behind a centered oversized question ("Who are you looking for?"), pill input with ⌘K hint, "Popular searches" chip row |
| 6. Cards | Portrait-crop cards, gold border + glow on the active/hover card, category chip top-left, name + role, circular arrow affordance bottom-right |
| 7. Admin | Dark sidebar (icon + label nav, active item gold-highlighted), greeting header, 4-stat card row with delta chips, one line chart card + one list card side by side |
| 8. Mobile | Same visual language compressed to single column, bottom tab bar, stacked category list, condensed bio hero |
| 9. Loading | Centered wordmark with tracked-out letterspacing, thin progress bar + percentage, swirling nebula backdrop |
| 10. Footer | 5-column dark footer, small logo + one-line mission, link columns, newsletter input+button, social row, legal line |

**Palette (tokens derived from pixel sampling, finalized in §3):** near-black base, two purples (deep indigo glow, brighter violet accent), one gold/amber accent, off-white text, muted gray-blue secondary text.

**Typography feel:** display type is a high-contrast serif or serif-adjacent grotesk with wide tracking on labels; body/UI type is a clean geometric sans. No exact typeface is visible at mockup resolution, so §4 proposes free, license-safe faces matching the same proportions.

---

## 2. Product Scope

### 2.1 Confirmed pages
Home · Biography (dynamic) · Category listing · Search (overlay, not a routed page) · About · Contact · Privacy Policy · 404 · Admin Login · Admin Dashboard (+ sub-views: Biographies, Categories, Media, Timeline, Quotes, Users, Analytics, Settings, per panel 7)

### 2.2 Explicit non-goals (v1)
- No user accounts / comments / social login for public visitors (not shown in reference)
- No multi-language i18n (not requested)
- No payments/monetization
- No native app — PWA only

### 2.3 Content model (drives Supabase schema in §7)
A **Legend** (biography) has: name, slug, role tags, era (birth/death), tagline, summary, long-form body (rich text), hero portrait, gallery images, stat blocks (label+value+icon), timeline events (year, title, description), quotes (text, optional context), sources/citations, category (one primary, optional secondary), status (draft/published), SEO fields (meta title/description/OG image), view count, featured flag, created/updated timestamps.

A **Category** has: name, slug, icon/cover image, description, legend count (derived).

---

## 3. Design Token System

All values below are the literal implementation tokens — nothing is left to per-component guessing.

### 3.1 Color
```
--bg-void:        #05050A   /* page base, near-black */
--bg-elevated:     #0D0D16   /* cards, panels */
--bg-glass:        rgba(255,255,255,0.04)   /* glass fill */
--border-glass:    rgba(255,255,255,0.08)
--border-glass-hi: rgba(255,255,255,0.16)   /* hover state */

--accent-gold:      #D4AF6A
--accent-gold-soft: rgba(212,175,106,0.15)
--accent-violet:    #6E5BD6
--accent-violet-glow: rgba(110,91,214,0.35)
--accent-indigo-deep: #2A1F5E

--text-primary:    #F5F3EE
--text-secondary:  #A6A4B5
--text-muted:      #6B6980

--state-success:   #4ADE80
--state-error:     #F87171
```

### 3.2 Typography
```
--font-display: "Fraunces", "Canela", Georgia, serif;   /* headlines, hero */
--font-body:    "General Sans", "Inter", -apple-system, sans-serif; /* body/UI */
--font-label:   "Inter", sans-serif;   /* eyebrow labels, uppercase, tracked +0.12em */

Scale (fluid, clamp-based):
--fs-hero:    clamp(2.75rem, 6vw, 5.5rem)
--fs-h1:      clamp(2rem, 3.5vw, 3.25rem)
--fs-h2:      clamp(1.5rem, 2.2vw, 2.25rem)
--fs-h3:      clamp(1.15rem, 1.5vw, 1.5rem)
--fs-body:    1rem  (1.6 line-height)
--fs-small:   0.875rem
--fs-label:   0.75rem (uppercase, letter-spacing 0.12em)
```
Both faces are free/open-license (Fraunces: SIL OFL via Google Fonts; General Sans: free via Fontshare) — chosen to match the reference's serif-display + clean-grotesk pairing without licensing risk.

### 3.3 Spacing & radius
```
--space unit: 4px base → scale 4/8/12/16/24/32/48/64/96/128
--radius-card: 20px
--radius-pill: 999px
--radius-input: 14px
```

### 3.4 Elevation & glow (the "premium" layer)
```
--shadow-ambient:  0 40px 100px -20px rgba(0,0,0,0.6)
--glow-gold:       0 0 40px rgba(212,175,106,0.25)
--glow-violet:     0 0 80px rgba(110,91,214,0.3)
--glass-blur:      blur(20px)
```
Glass morphism is reserved for: nav bar, search overlay panel, admin sidebar, modal/drawer surfaces. It is **not** used on content cards (reference cards are solid-dark with image, not glassy) — this matches panel 6 exactly rather than over-applying the effect.

### 3.5 Motion tokens
```
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1)
--ease-in-out:    cubic-bezier(0.65, 0, 0.35, 1)
--dur-fast:   150ms
--dur-base:   400ms
--dur-slow:   800ms
--dur-cinematic: 1400ms
```

---

## 4. Component Inventory

Naming convention: `PascalCase` component folders, one component per folder with `index.tsx`, `styles` co-located, optional `animations.ts`.

**Layout:** `SiteHeader`, `SiteFooter`, `MobileTabBar`, `PageTransition`, `CustomCursor` (desktop only, `pointer:fine` gated)

**Hero & storytelling:** `HeroCinematic`, `ScrollProgressBar`, `AmbientBackground` (particles/nebula canvas), `SectionReveal` (wraps any section for scroll-triggered entrance)

**Cards & collections:** `LegendCard`, `CategoryCard`, `FeaturedCarousel`, `TrendingRow`, `CardGrid`

**Biography page:** `BioHero`, `BioStatStrip`, `BioTimelineNav` (sticky scroll-spy), `BioTimeline` (horizontal, reused from home in compact vertical mode on mobile), `BioGallery`, `BioQuoteBlock`, `BioSources`, `RelatedLegends`, `ReadingProgressBar`, `ShareButtons`, `BookmarkButton`, `EstimatedReadTime`

**Search:** `SearchOverlay`, `SearchInput`, `PopularSearchChips`, `SearchResultsGrid`, `KeyboardShortcutHint`

**Forms/interaction:** `MagneticButton`, `NewsletterForm`, `ContactForm`, `PillTabs`, `FilterBar`

**Admin:** `AdminSidebar`, `AdminStatCard`, `AdminChartCard` (views-over-time), `AdminListCard` (recent biographies), `LegendEditor` (rich text + image upload + SEO fields + draft/publish toggle), `CategoryManager`, `MediaLibrary`, `AdminAuthGate`

**System:** `LoadingSequence` (cinematic boot screen), `Toast`, `Modal`, `ErrorBoundary`, `SEOHead` (meta/JSON-LD injector), `SkipToContent`

---

## 5. Motion System

One centralized animation registry (`/lib/motion/`) — no ad-hoc GSAP calls scattered through components.

- **`useScrollReveal(ref, variant)`** — wraps GSAP ScrollTrigger; variants: `fade-up`, `fade-scale`, `clip-reveal`, `stagger-children`. Every section on Home/Bio calls this instead of hand-rolled triggers.
- **`useMagnetic(ref, strength)`** — pointer-follow transform for CTA buttons, capped strength, auto-disabled on touch devices.
- **`useParallax(ref, depth)`** — mouse-parallax for hero art layers (portrait, light-arc, particles each get a different depth value for the "floating layers" effect from panel 1/3).
- **Lenis** instance created once at app root, exposed via context so any component can `lenis.scrollTo()` (used by timeline nav, footer anchors).
- **Page transitions**: shared-element style — outgoing page fades+scales down (`dur-base`), incoming fades+rises (`dur-base`, staggered 80ms after). No full white/black flash.
- **Loading sequence**: on cold load only (sessionStorage flag prevents repeat on internal navigation) — wordmark tracking-in, progress bar 0→100 tied to actual asset-preload promise (not fake timer), then clip-path wipe reveal of Home hero.
- **Reduced motion**: a single `MotionProvider` reads `prefers-reduced-motion`; when true, all of the above hooks short-circuit to instant `opacity/transform` end-states — no component needs its own check.
- **Adaptive quality**: a lightweight device-capability check (`navigator.hardwareConcurrency`, connection type, and a one-time rAF frame-time probe) sets a `low | mid | high` tier in context. Particles/ambient canvas render 0/40%/100% particle count by tier; blur effects drop to a cheaper box-shadow fallback on `low`.

---

## 6. Accessibility Strategy

- Semantic landmarks (`header`/`nav`/`main`/`footer`/`aside` for sticky timeline nav) on every page.
- All custom interactive components (`PillTabs`, `SearchOverlay`, `MagneticButton`) built on native `<button>`/`<a>`/`<input>` primitives — never `div onClick`.
- Visible focus ring token (`--focus-ring: 2px solid var(--accent-gold)`, offset 2px) applied globally, never suppressed.
- Custom cursor is decorative-only and fully disabled under `prefers-reduced-motion` and on any non-`pointer:fine` device; default cursor remains active underneath at all times so nothing depends on it.
- Color contrast: `--text-secondary` on `--bg-void` checked ≥ 4.5:1; gold-on-dark CTA text uses `--bg-void` text on `--accent-gold` fill (not gold-on-dark) to guarantee AA.
- `SearchOverlay` traps focus, closes on `Escape`, restores focus to the trigger on close.
- All images require `alt`; portrait/gallery images use descriptive alt (name + context), decorative background art uses `alt=""`.

---

## 7. Technical Architecture

### 7.1 Stack
Next.js (App Router) · TypeScript · CSS with design-token custom properties (no Tailwind, no component-template library, per your "no templates" rule — utility classes are hand-authored per §3) · GSAP + ScrollTrigger · Lenis · Supabase (Postgres + Auth + Storage) · Vercel-style edge deployment target · next-pwa for offline/manifest.

### 7.2 Rendering strategy
- Home, Category, About: ISR (revalidate on publish webhook)
- Biography pages: SSG at build + on-demand ISR per slug (new legend → single revalidate call, not full rebuild)
- Search: client-rendered overlay, hits a Postgres full-text search RPC (`search_legends`) via Supabase edge function — no separate search service needed at this scale
- Admin: fully client-rendered behind auth, no SEO concerns

### 7.3 Folder architecture
```
/app
  /(public)/page.tsx                → Home
  /(public)/legends/[slug]/page.tsx → Biography
  /(public)/categories/[slug]/page.tsx
  /(public)/about, /contact, /privacy
  /(admin)/admin/login
  /(admin)/admin/dashboard
  /(admin)/admin/legends/[id]/edit
  /(admin)/admin/categories
  /(admin)/admin/media
  api/ (route handlers: revalidate webhook, contact form, newsletter)
/components/{layout,hero,cards,bio,search,forms,admin,system}
/lib/motion/        → hooks from §5
/lib/supabase/       → typed client, server client, RPC wrappers
/lib/seo/            → metadata + JSON-LD builders
/styles/tokens.css   → §3 as literal CSS custom properties
/public/             → static, manifest.json, icons
```

### 7.4 Supabase schema (core tables)
`legends` (see §2.3 fields), `categories`, `timeline_events` (fk legend_id), `quotes` (fk legend_id), `gallery_images` (fk legend_id, storage path), `admin_users` (Supabase Auth, role column), `page_views` (legend_id, date, count — for analytics card). Row-Level Security: public read on `status = 'published'` rows only; all writes require authenticated admin role.

### 7.5 Error handling
- `ErrorBoundary` per route segment (Next.js `error.tsx`) with on-brand fallback (not a raw stack trace)
- Supabase calls wrapped in a typed `Result<T>` helper — components render explicit empty/error states, never silently fail
- 404 page is a designed panel (not default Next 404), still on-brand per reference language

### 7.6 Performance budget
- JS shipped to first paint on Home: target < 170KB gzipped (GSAP core + ScrollTrigger loaded, plugins like MorphSVG excluded unless used)
- LCP element (hero portrait) preloaded via `<link rel=preload>`, served AVIF/WebP with responsive `srcset`
- Ambient/particle canvas paused via `IntersectionObserver` when off-screen and on tab blur
- Route-based code splitting by default (App Router); Admin bundle never ships to public pages

### 7.7 Security
- Admin routes gated server-side (middleware checks Supabase session, not just client redirect)
- RLS as the real boundary, not an assumption — API routes never use the service key from a client-reachable path
- Contact/newsletter forms rate-limited + honeypot field
- CSP headers set; no inline scripts except the unavoidable Next hydration payload

### 7.8 SEO architecture
- `SEOHead` builds per-page: title, meta description, canonical, OG (image = legend hero portrait or default), Twitter card
- JSON-LD: `Person` schema per biography (name, birth/death, description, image, sameAs from sources), `BreadcrumbList` on every nested page, `WebSite` + `Organization` on root layout, `FAQPage` only where an actual FAQ exists (About page)
- `sitemap.xml` generated from published legends + static routes; `robots.txt` disallows `/admin`

### 7.9 Future scalability notes
- Search RPC can be swapped for a dedicated search service (Meilisearch/Algolia) without touching UI — `SearchOverlay` only knows about one query function
- Category/legend schema supports multi-category via join table if v2 needs it (v1 uses single primary category per reference)
- i18n can be added later via Next's built-in routing without restructuring components, since no copy is hardcoded outside `content/` — though not built now

---

## 8. Open Questions For You

1. **Copy/content**: real legends & bios, or should I seed placeholder content (Einstein, Tesla, etc., matching the mockup) for the prototype phase?
2. **Auth for admin**: email/password via Supabase, or would you want magic-link only?
3. Confirm the two type faces (Fraunces + General Sans) are acceptable, or you have specific fonts in mind.

Once you approve this document (or send edits), I'll start **Phase 1: Project architecture + folder structure**, then move through the phases in order as specified.
