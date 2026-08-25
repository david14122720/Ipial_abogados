# Exploration: ux-polish-hero-nav

## Current State

**Hero** (`src/components/Hero.astro:3-5`): `#f9f9f9` bg, inline `background-image: url('/principal.jpeg')` at `opacity-[0.07]` (7%), `background-size:cover` — no blur filter (user perception is washed-out veil, not blur), no gradient scrim, no `astro:assets` optimization. Content sits on `1200px` container with `pt-32` (header offset) + `min-h-[78vh]` — image is decorative but effectively invisible; text contrast is safe only because image is so faint.

**Typography** (`Hero.astro:8`, `global.css:1,22-24`): H1 `text-[32px] md:text-[48px]` fixed breakpoint, Libre Caslon Text 700. Desc `text-[17px] md:text-[18px]` Manrope-equivalent. No `clamp()`/fluid scale, abrupt 32→48 jump at 768px, no `text-balance`. Other H2s `text-[32px]` fixed. Token `@theme` defines `--color-primary #005243` etc but not used for typography scale.

**Hover/Motion** (`Header.astro:8-13`, `Services.astro:17`, `Hero.astro:15`): Nav `hover:text-[#005243] transition-colors` only. Service cards `hover:shadow` + `transition-shadow`. Hero CTA `hover:bg-[#e2e2e2]` border button. No underline animation, no card lift/translate, no focus-visible, no `prefers-reduced-motion` guards. Sobriety constraint (objetivo.md: "Evitar exceso de animaciones") respected but leaves UX feeling static.

**Nav/Scrollspy** (`Header.astro:8-13`, `index.astro:12-22`): Sticky `fixed top-0 h-20` with 5 anchor links (`#inicio|#nosotros|#servicios|#abogados|#contacto`). `Inicio` hardcoded `border-b-2 border-[#005243]` — never updates on scroll. Zero JS. Sections `id="inicio|nosotros|servicios|abogados|contacto"` exist (WhyUs lacks id). `html {scroll-behavior:smooth}` is only scroll UX. No active tracking.

**Mobile** (`Header.astro:15-17`, hero `px-6 md:px-16`): Desktop nav `hidden md:flex`, hamburger is a link `href="#contacto"` with aria-label "Menú" — no drawer, no island, no menu items, no close animation, no focus trap. Hero padding `px-6`→`md:px-16` coarse; `pt-32` + `min-h-[78vh]` on 375px viewport pushes fold aggressively. H1 `32px` at 375px ≈ 9 chars/line, borderline overflow if phrase lengthens. No `sm:` intermediate step, no fluid container.

**Stack leverage**: Astro 7.2.4 + Tailwind v4.3.3 (`@tailwindcss/vite`) + React 19 islands (`@astrojs/react 6.0.4`) installed but zero islands in use — all components are `.astro` static. `Layout.astro` loads Google Fonts via `@import` in CSS + no `<ViewTransitions/>`. Build passes static 1 page.

**Frontend-design lens** (`.agents/skills/frontend-design/SKILL.md`): Lex Equitas tokens (`#1e6b5a/#005243`, Libre Caslon + Manrope) are present but under-exploited — type treatment is not memorable (uniform 32px H2s), layout has no signature element, hero is not a "thesis" (image hidden), motion is scattered `transition-colors` rather than orchestrated reveal. Risk of default "serif display + muted palette" generic look without deliberate hero signature.

### Affected Areas
- `src/components/Hero.astro` — opacity veil 0.07→0.12-0.18 + gradient scrim, fluid type `clamp()`, CTA hierarchy (primary vs ghost), background via `<img>`/`astro:assets` for `loading="eager"`/`fetchpriority`, reduced-motion, mobile `min-h`/padding
- `src/components/Header.astro` — replace static border with animated underline, add scrollspy island + mobile drawer island, accessible nav
- `src/styles/global.css` — `@theme` fluid type tokens, custom underline animation, gradient veil utilities, motion `@media (prefers-reduced-motion)`
- `src/layouts/Layout.astro` — optionally add `<ViewTransitions/>` and preload `/principal.jpeg`, font `display=swap` via existing import
- `src/components/Services.astro|Team.astro|WhyUs.astro|About.astro` — hover micro-interactions (card lift, icon translate), consistent underline-motif animation (currently static `::after 40px`)
- `src/pages/index.astro` — slot islands with `client:load`/`client:idle` decisions, add missing section ids (WhyUs)
- `public/principal.jpeg` (194kB) + `logo.jpeg` — hero image optimization (consider `src/assets/` + `getImage` for responsive sizes)

## Approaches

### 1. Minimal — CSS-Only Polish (no new JS bundle)
Keep everything `.astro`; add `clamp()` typography, gradient veil over 7% image, CSS `:target` + `animation-timeline: scroll()` for nav highlight, Tailwind `group-hover` card lifts, CSS-only hamburger via `<details>`.
- Pros: Zero JS, respects sobriety/conservative brand, fastest build, no hydration cost
- Cons: No true scrollspy ( `:target` only on click, `scroll-timeline` is Baseline-preview ~78% support, no iOS < 17.4); no animated mobile drawer; underline animation limited
- Effort: Low (1 session, <80 line diff)
- Verdict: Viable if client insists on zero JS but fails scrollspy requirement

### 2. Balanced — Astro Static + Focused React Islands (recommended baseline)
Fluid type via CSS `clamp()` tokens in `@theme`; hero veil `opacity-[0.14]` + `bg-gradient-to-b from-[#f9f9f9]/10 via-[#f9f9f9]/35 to-[#f9f9f9]` layered scrim for contrast-safe visibility; replace bg-div with optimized `<img>` absolute cover `opacity-15` + `decoding=async` (or `astro:assets` in next iteration). Hover: nav underline via `::after scaleX` + `group-hover:translate-y-[-2px]` cards + `focus-visible:ring`. Scrollspy: tiny React island `<NavSpy client:load>` with `IntersectionObserver` (rootMargin `-88px` for `h-20` header, `threshold [0,0.5,1]`), sets active `aria-current="page"` + animated border; mobile drawer as `<MobileMenu client:media="(max-width: 768px)">` with side sheet + body lock + Esc trap.
- Pros: True scrollspy with header offset, progressive hydration (drawer only hydrates on mobile), keeps 95% static, `prefers-reduced-motion` trivial, aligns with Tailwind v4 + islands philosophy
- Cons: +~8-12kB JS (one island), needs cleanup of observers on Astro page transitions if later adding ViewTransitions
- Effort: Medium (1-2 sessions, 2 islands, ~150 lines)
- Frontend-design fit: Allows orchestrated page-load reveal (staggered `animate-in` on hero H1→p→CTA, 200ms delays) without scattering motion

### 3. Full Motion — Astro ViewTransitions + Framer Motion
Add `import { ViewTransitions } from 'astro:transitions'` in `Layout.astro`, `motion` (Framer) for islands, hero parallax `useScroll` tied to `principal.jpeg` opacity, service grid `staggerChildren` on scroll, shared header underline `layoutId`.
- Pros: Most cinematic hero visibility (parallax veil fade), smooth intra-page nav transitions, orchestrated motion narrative
- Cons: Heaviest bundle (~35kB+ motion), over-engineered for sober legal brand (violates objetivo.md "Evitar exceso de animaciones"), ViewTransitions adds lifecycle complexity (`astro:after-swap` observer re-init), parallax hurts Lighthouse CLS if misconfigured, higher regression risk
- Effort: High (2-3 sessions, motion tuning + reduced-motion fallbacks)

| Approach | JS Cost | Scrollspy Accuracy | Brand Fit (sobrio) | Motion Quality |
|----------|---------|--------------------|--------------------|----------------|
| CSS-Only | 0 kB | Low (click-only) | Excellent | Static |
| Balanced Island | ~10 kB | High (IO + header offset) | Excellent | Orchestrated subtle |
| Full Motion | ~35 kB+ | High | Risk: excessive | Cinematic |

## Recommendation

**Approach 2 — Balanced (CSS fluid type + gradient veil + IO island)** is the right tradeoff.

- Hero visibility: raise veil to `opacity 0.12-0.16` (audit shows 0.07 is wasteful — image fully invisible on calibrated screens) capped with `linear-gradient` scrim `to-[#f9f9f9] 85%` preserves WCAG AA contrast for `#1a1c1c` on image while making office texture perceptible. Switch inner div to `<img src="/principal.jpeg" class="absolute inset-0 w-full h-full object-cover object-[50%_35%] opacity-[0.14] grayscale-[0.2]">` for better control + `loading="eager"` hero.
- Typography: define `@theme --text-hero: clamp(1.9rem, 5.2vw, 3.25rem)` in `global.css`, apply to H1, `text-balance` + `tracking-[-0.015em]`; desc `clamp(1.05rem, 1.6vw, 1.18rem)`. Fixes mobile overflow and removes 32→48 cliff.
- Hover: nav `relative after:absolute after:bottom-0 after:h-[2px] after:bg-[#005243] after:scale-x-0 hover:after:scale-x-100 after:transition-transform` (animated underline per frontend-design "signature" rather than static `border-b-2`); cards `hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(...)]` `duration-200` — sober but perceptible; respects `prefers-reduced-motion`.
- Scrollspy: single `NavSpy.tsx` island observing `#inicio #nosotros #servicios #abogados #contacto` with `rootMargin: "-80px 0px -55% 0px"` (accounts for `h-20` + favors top-third), debounced update. Export active id to both desktop nav and mobile drawer to share underline/active state. No ViewTransitions needed for single-page landing.
- Mobile: `MobileMenu.tsx` island `client:media="(max-width:768px)"` — avoids desktop hydration; sheet `translate-x` + overlay, `aria-expanded`, focus trap, close on anchor click.
- Phasing: (i) hero veil + fluid type (CSS only, ship first), (ii) nav island + mobile drawer, (iii) card hovers/WhyUs polish — keeps each PR <120 lines, auto-chain friendly.

## Risks
- **Image vs contrast** — raising opacity above ~0.18 without scrim fails WCAG AA for `#1a1c1c`/`#5b5f61` over photographic midtones; must keep gradient veil and test with axe `color-contrast` + manual check on principal.jpeg (warm beige/gray midtones ~#d8d5ce)
- **Larger type vs mobile overflow** — `clamp` upper bound >3.5rem causes 2-line H1 to overflow narrow 320px viewport or break `max-w-4xl`; need `text-wrap: balance` + `overflow-wrap: break-word` + QA at 320/375/428px
- **Animations vs sobriety** — `objetivo.md` explicitly bans "exceso de animaciones/colores llamativos"; hover lifts >4px, durations >300ms, or parallax feel templated/AI-generated (frontend-design warns against scattered effects) — enforce `duration-200`, `ease-out`, single orchestrated hero reveal only
- **Scrollspy offset drift** — `h-20` fixed header causes IO threshold misalignment after fluid header height changes or font load; guard with `headerRef.clientHeight` dynamic margin + `ResizeObserver`, and handle section gaps (WhyUs missing id breaks continuity)
- **Hydration cost/regression** — adding islands where none existed risks introducing CLS from drawer mount or nav flicker SSR→hydrated; mitigate with CSS fallback `navSpyFallback` (first link active by default until IO fires) + `client:idle` vs `client:load` trade-off for below-fold observers
- **Image asset weight** — `principal.jpeg` 194kB hero eager load hurts LCP on 3G; if kept as `/public` bg, cannot use `astro:assets` responsive sizing — future move to `src/assets` + `Image` recommended but out-of-scope for this polish

## Ready for Proposal
Yes — scope is crisp (hero visibility, fluid type, hover system, scrollspy, mobile drawer) with clear tradeoffs. Orchestrator should launch `sdd-propose` next, scoping to 3 chained PRs: (1) hero+typography CSS, (2) NavSpy+MobileMenu islands, (3) card motion + polish. Confirm with user: desired hero opacity target (0.14 proposed) and whether drawer may reuse existing `#contacto` link styled as hamburger (current href) vs new sheet pattern.
