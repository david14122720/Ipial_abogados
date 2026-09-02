# Exploration: cleanup-seo-rounding-perf

## Area 1: Ugly Line Between Hero and About

### Current State
- **Hero.astro** (line 5): `border-b border-platinum-silver` — bottom border on Hero section
- **About.astro** (line 3): `border-t border-platinum-silver` — top border on About section
- Both sections have `bg-surface` background (About) and Hero has dark overlay image
- **Result**: Two 1px platinum-silver borders stacked back-to-back = visible double-line artifact, especially ugly in dark theme where both borders sit on the same surface color creating a thick/separated line effect

### Affected Areas
- `src/components/Hero.astro` — remove `border-b border-platinum-silver`
- `src/components/About.astro` — keep `border-t border-platinum-silver` (or vice versa, pick one)

---

## Area 2: Dead Code + Performance Cleanup

### Current State — Dead Assets
| Asset | Size | Used? |
|-------|------|-------|
| `src/assets/astro.svg` | 2.9KB | ❌ Never imported |
| `src/assets/background.svg` | 1.4KB | ❌ Never imported |
| `src/assets/logo.jpeg` | 32KB | ❌ Never imported |
| `src/assets/logo.webp` | 10KB | ❌ Never imported |
| `src/assets/principal.jpeg` | 194KB | ❌ Never imported |
| `src/assets/principal.jpg` | 626KB | ❌ Never imported |

### Current State — Dead Code
- **ServiceExplorer.tsx**: Full React island component (139 lines) — **never imported** by any page or component. Completely dead.
- **`@fontsource/libre-caslon-text`** in package.json dependencies — never imported in global.css or anywhere else.

### Current State — Performance
- All `astro:assets` Image components already use `format="webp"`, `quality={75}`, proper `widths` and `sizes` — good.
- `section[id]` has `content-visibility: auto` with `contain-intrinsic-size: auto 600px` — good offscreen perf.
- `#inicio` explicitly set to `content-visibility: visible` — correct for hero.
- Inline scripts in Layout.astro are small and non-blocking (reveal observer, parallax, header scroll).
- React islands: MobileDrawer (104 lines, conditional `client:media`) + ServiceExplorer (139 lines, **dead**). Removing ServiceExplorer eliminates a React bundle chunk entirely.

### Affected Areas
- `src/assets/astro.svg` — delete
- `src/assets/background.svg` — delete
- `src/assets/logo.jpeg` — delete
- `src/assets/logo.webp` — delete
- `src/assets/principal.jpeg` — delete
- `src/assets/principal.jpg` — delete
- `src/components/islands/ServiceExplorer.tsx` — delete (never imported)
- `package.json` — remove `@fontsource/libre-caslon-text` dependency

---

## Area 3: Favicon 370k Square

### Current State
- `public/favicon.ico`: 370,070 bytes — MS Windows icon resource with **6 icons** (256x256 + 128x128 etc), 32 bits/pixel
- Layout.astro references: `<link rel="icon" href="/favicon.ico" sizes="any" />` and `<link rel="apple-touch-icon" href="/favicon.ico" />`
- **Problems**: (1) 370k is massive for a favicon; (2) square shape — no rounded variant for Apple touch icon; (3) apple-touch-icon should be 180x180 PNG, not an ICO file

### Affected Areas
- `public/favicon.ico` — keep as fallback but replace with optimized version
- `public/` — add `favicon.png` (rounded, ~48x48) and `apple-touch-icon.png` (180x180 rounded)
- `src/layouts/Layout.astro` — update `<link>` tags to reference new icons

---

## Area 4: Hard Radii Audit

### Current State — Radii System (global.css lines 99-105)
```
--radius-sm: 0.125rem  (2px)
--radius:     0.125rem  (2px) ← DEFAULT
--radius-lg:  0.25rem   (4px)
--radius-xl:  0.5rem    (8px)
--radius-full: 0.75rem (12px)
--radius-pill: 9999px
```

### Components Using Radii
| Component | Current | Hard? | Suggestion |
|-----------|---------|-------|------------|
| `.card-lex` (card class) | `border-radius: var(--radius)` = 0.125rem | ✅ Very hard | → `var(--radius-xl)` (0.5rem) |
| Service cards (`Services.astro`) | Tailwind `rounded` = 0.25rem | ✅ Hard | → `rounded-lg` (0.5rem) |
| WhyUs cards (`WhyUs.astro`) | Tailwind `rounded` = 0.25rem | ✅ Hard | → `rounded-lg` (0.5rem) |
| `.img-hover-zoom` | `border-radius: var(--radius)` = 0.125rem | ✅ Very hard | → `var(--radius-xl)` (0.5rem) |
| Contact.astro map container | `rounded` = 0.25rem | Medium | → `rounded-lg` |
| WhatsApp FAB (Layout.astro) | `rounded-full` | ✅ Good | Keep |
| Team avatars | `rounded-full` | ✅ Good | Keep |
| Chips | `border-radius: var(--radius-full)` | ✅ Good | Keep |
| Contact CTA button | `rounded-sm` | ✅ Very hard | → `rounded` or `rounded-md` |

### Recommendation
Bump `--radius` default from 0.125rem → 0.25rem, `--radius-lg` from 0.25rem → 0.5rem. Keep `--radius-xl` at 0.5rem (or bump to 0.75rem). This gives a softer dark-theme feel without losing the sharp legal aesthetic. Components using Tailwind `rounded` → `rounded-lg`.

### Affected Areas
- `src/styles/global.css` — update radius tokens
- `src/components/Services.astro` — `rounded` → `rounded-lg`
- `src/components/WhyUs.astro` — `rounded` → `rounded-lg`
- `src/components/Contact.astro` — `rounded` → `rounded-lg` on map, `rounded-sm` → `rounded` on CTA

---

## Area 5: WhatsApp Default Message

### Current State
- `src/consts.ts` line 5: `get waPrimaryHref() { return `https://wa.me/${this.whatsappPrimary}`; }`
- No `?text=` parameter — user lands on empty WhatsApp chat
- ServiceExplorer.tsx (dead code) HAS the pattern: `https://wa.me/573188215030?text=${encodeURIComponent(title)}` — but it's never used
- WhatsApp FAB in Layout.astro and Contact.astro CTA both use `CONTACT.waPrimaryHref` — no default message

### Recommendation
Add a default message like: `"Hola, me gustaría recibir asesoría jurídica. ¿Podemos agendar una consulta?"` via `?text=` with `encodeURIComponent()`.

### Affected Areas
- `src/consts.ts` — update `waPrimaryHref` getter to include `?text=` parameter

---

## Area 6: SEO Audit

### Current State
| SEO Element | Status | Notes |
|-------------|--------|-------|
| `<title>` | ✅ Present | "Ipial Abogados — Excelencia Jurídica y Compromiso Humano" |
| `<meta description>` | ✅ Present | Good length, mentions key terms |
| `<link rel="canonical">` | ✅ Present | Points to example.com (placeholder) |
| `<html lang="es">` | ✅ Present | Correct |
| JSON-LD LegalService | ✅ Present | name, description, url, address, telephone, areaServed |
| OG tags (og:title, og:description, og:image, og:url) | ❌ **MISSING** | No OpenGraph meta tags at all |
| Twitter Card tags | ❌ **MISSING** | No twitter:card, twitter:title, etc. |
| `<h1>` | ✅ Present | Single h1 in Hero — correct |
| `<h2>` hierarchy | ✅ Present | About, Team, Services, WhyUs, Contact all have h2 |
| `alt` on images | ✅ Present | All Image components have alt text |
| `robots.txt` | ✅ Present | `Allow: /` |
| `sitemap.xml` | ❌ **MISSING** | No sitemap in public/ or generated |
| `<meta name="generator">` | ✅ Present | Astro generator |
| Semantic sections | ✅ Good | All sections have `id` attributes, proper nesting |
| `<main>` wrapper | ✅ Present | index.astro wraps content in `<main>` |
| `<nav>` | ✅ Present | Header.astro uses `<nav>` |
| Internal linking | ✅ Good | Anchor-based nav with section IDs |
| Favicon | ⚠️ ICO only | No PNG/WebP apple-touch-icon |

### Affected Areas
- `src/layouts/Layout.astro` — add OG meta tags, Twitter Card tags
- `public/` — add `sitemap.xml` (Astro can generate via `@astrojs/sitemap`)
- `public/` — add proper favicon set (favicon.png, apple-touch-icon.png)
- `src/consts.ts` — canonical is `example.com` placeholder (needs real URL)

---

## Approaches

### Approach 1: Minimal Targeted Fixes
Fix each issue surgically without changing the design system:

1. Remove `border-b` from Hero (keep About's `border-t`) — 1 line change
2. Delete 6 dead assets + ServiceExplorer.tsx + libre-caslon-text dep — ~5 min
3. Generate rounded favicon PNG + apple-touch-icon from existing ICO — add 2 files, update Layout links
4. Bump `--radius` and `--radius-lg` tokens in global.css — 2 line changes + component `rounded` → `rounded-lg`
5. Add `?text=` to WhatsApp URL in consts.ts — 1 line change
6. Add OG + Twitter meta tags to Layout.astro — ~8 lines
7. Add `@astrojs/sitemap` integration — 1 dep + config change

**Pros**: Surgical, fast, minimal risk, each fix is independently deployable
**Cons**: Doesn't address the "hard radii on cards" holistically (each card uses different Tailwind classes)

**Effort**: ~2-3 hours

### Approach 2: Comprehensive Design Token Cleanup
Full pass through the design system:

1. Everything in Approach 1, plus:
2. Unify card styles: create a single `card-lex` utility that all cards use (Services, WhyUs, Contact map) instead of ad-hoc Tailwind classes
3. Standardize all `rounded` usage to reference the token system
4. Add `@astrojs/sitemap` with proper config for Astro static output
5. Audit and potentially add structured data for LegalService `sameAs` (social profiles)
6. Add `<meta name="theme-color">` for mobile browser chrome
7. Consider removing React dependency entirely if MobileDrawer can be pure Astro (currently 104 lines React for a drawer — could be Astro + vanilla JS)

**Pros**: Cleaner long-term, single source of truth for card styling, better maintainability
**Cons**: Larger diff, touches more files, higher risk of visual regression

**Effort**: ~4-6 hours

---

## Recommendation

**Approach 1 (Minimal Targeted)** — this is a cleanup change, not a redesign. Each fix is independently valuable and the diff stays under 400 lines. The card unification can be a follow-up change.

---

## Risks

1. **Favicon generation**: Converting 370k ICO to rounded PNG requires tooling (ImageMagick/Sharp). The ICO may not have clean alpha for rounding.
2. **OG image**: No og:image exists — need a real social preview image (1200x630). This is a content dependency, not just code.
3. **Canonical URL**: Currently `example.com` placeholder — changing it requires knowing the real deployed domain.
4. **Radii regression**: Bumping tokens changes every card globally — visual QA needed.
5. **ServiceExplorer deletion**: Safe (never imported), but verify no dynamic import or lazy load exists.

---

## Skill Resolution

| Skill | Applicable? | How Used |
|-------|-------------|----------|
| frontend-design | ✅ | Radii audit, visual design decisions for dark theme softness |
| programmatic-seo | ✅ | SEO audit: OG tags, sitemap, JSON-LD, heading hierarchy |
| work-unit-commits | ✅ | Each area = separate commit (borders, dead code, favicon, radii, whatsapp, SEO) |
| web-design-guidelines | ❌ | Skill not found (file missing) |
| vercel-react-best-practices | ❌ | Skill not found (file missing) |

---

## Ready for Proposal

**Yes** — all 6 areas are well-defined with specific file-level changes identified. Ready to create the proposal with 6 work units:
1. Fix double border (Hero/About)
2. Delete dead code (assets + ServiceExplorer + dead dep)
3. Favicon optimization + rounded variants
4. Soften radii tokens + component updates
5. WhatsApp default message
6. SEO: OG tags, Twitter cards, sitemap
