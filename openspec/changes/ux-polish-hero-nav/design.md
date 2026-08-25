# Design: UX Polish — Hero, Navigation & Hover System

## Technical Approach

Balanced islands on Astro 7.2.4 static-first shell. Hero veil corrected via `<img>` cover `opacity-[0.14]` + Tailwind gradient scrim (`from-[#f9f9f9]/10 to-[#f9f9f9] 85%`) with `loading="eager"` + `fetchpriority="high"` for LCP. Fluid type via `@theme` `clamp()` tokens consumed in `Hero.astro`. Navigation state via two focused React 19 islands (zero desktop hydration for drawer) — `NavSpy.tsx` drives `aria-current` + `scaleX` underline; `MobileMenu.tsx` provides `client:media` drawer. Hover motif stitches `underline-motif`, card lift, and button transitions under one `duration-200` + `prefers-reduced-motion` guard. Maps to spec Requirements: Hero Veil, Fluid Typography, Scrollspy, Drawer, Hover/Motion.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice |
|---|---|---|---|
| Hero image technique | `div background-image` vs `<img> cover` vs `astro:assets Image` | `div` invisible at 0.07, not preloadable; `astro:assets` out-of-scope per proposal | **`<img>` absolute cover** `object-cover object-[50%_35%] opacity-[0.14]` + `loading="eager"` `fetchpriority="high"` `decoding="async"`; `Layout.astro` adds `<link rel="preload" as="image">` |
| Fluid type | Hardcoded `text-[32px] md:text-[48px]` vs CSS `clamp()` tokens | Hardcoded cliff 32→48px fails 320px | **`@theme --text-hero: clamp(1.9rem,5.2vw,3.25rem)`** + `--text-hero-desc: clamp(1.05rem,1.6vw,1.18rem)` in `global.css`; `text-wrap:balance` + `overflow-wrap:break-word` + `tracking:-0.015em` |
| Scrollspy | CSS `:target`/`scroll-timeline` vs `IntersectionObserver` island | CSS-only misses scroll tracking, 78% support | **`NavSpy.tsx` island** `rootMargin "-80px 0px -55% 0px"` `threshold [0,0.5,1]` + `ResizeObserver` on `header.clientHeight` |
| Mobile drawer hydration | `client:load` always vs `client:media` vs `client:idle` | `load` wastes desktop JS | **`client:media="(max-width:768px)"`** — zero bytes >768px; `aria-expanded`, focus trap, `Esc`/overlay/anchor close, body lock `overflow:hidden` + scrollbar-gutter compensation |
| Hover/motion | scattered `transition-colors` vs orchestrated system | scattered feels templated | **System**: nav `::after scaleX 0→1 duration-200 ease-out`, cards `hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(26,28,28,0.08)]`, buttons `transition-colors duration-200`; global `@media (prefers-reduced-motion:reduce) { * { transition:none !important; animation:none !important } }` |

## Data Flow

```
Scroll/Resize ──→ NavSpy.tsx (IO + ResizeObserver)
       │                │ aria-current="page" + scaleX class
       │                ▼
Header.astro ──→ desktop nav links (SSR fallback: Inicio active)
       │
       └──→ MobileMenu.tsx ──→ drawer state (open/close)
                │ trap focus, body lock, Esc/overlay
                └──→ anchor click ──→ close + focus return

Hero.astro: <img> veil 0.14 + gradient scrim ──→ LCP (eager + preload)
global.css @theme tokens ──→ Hero H1/desc clamp + Services/Team/WhyUs cards ──→ hover/motion
```

SSR fallback: `NavSpy` renders first link `aria-current="page"` before IO fires; `MobileMenu` renders hamburger hidden `md:hidden` placeholder, `client:media` prevents desktop hydration → no CLS.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modify | Add `@theme --text-hero/--text-hero-desc`, `text-wrap:balance`, nav `::after scaleX` utility, card lift `hover:-translate-y-1`, `prefers-reduced-motion`, `focus-visible:ring` |
| `src/components/Hero.astro` | Modify | Replace `div background-image opacity-[0.07]` with `<img>` cover `opacity-[0.14] grayscale-[0.08]`, gradient scrim overlay, apply `text-[--text-hero]` `text-balance`, `px-6`/`pt-32` keep, `min-h-[78vh]` → responsive `min-h-[68vh] md:min-h-[78vh]` |
| `src/components/Header.astro` | Modify | Swap static `border-b-2` for `relative after:scaleX` links, slot `<NavSpy>` desktop + `<MobileMenu>` hamburger islands, `data-header` hook for `clientHeight` |
| `src/components/NavSpy.tsx` | Create | React island: `sections: string[]`, IO `rootMargin` from header height, `ResizeObserver`, `activeId` state, SSR fallback, cleanup on unmount/`astro:after-swap` |
| `src/components/MobileMenu.tsx` | Create | React island `client:media`: `open` state, portal drawer + overlay, focus trap (first/last sentinel), `Esc`/overlay/anchor close, `aria-expanded`, body `overflow:hidden` lock |
| `src/layouts/Layout.astro` | Modify | `<link rel="preload" as="image" href="/principal.jpeg" fetchpriority="high">` for LCP |
| `src/pages/index.astro` | Modify | Pass `sections` prop to islands, add `id="por-que"` to `WhyUs.astro` wrapper (was missing) |
| `src/components/Services.astro` | Modify | Cards: `hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(26,28,28,0.08)] duration-200 ease-out` |
| `src/components/Team.astro` | Modify | Same card lift + `group-hover` image `grayscale-0` 200ms |
| `src/components/WhyUs.astro` | Modify | Add `id="por-que"`, card hover lift consistent |

## Interfaces / Contracts

```ts
// src/components/NavSpy.tsx
type NavSpyProps = { sections: string[]; headerSelector?: string };
type ActiveId = string; // e.g. "inicio" | "servicios"
// Behavior: IO rootMargin `${-headerHeight}px 0px -55% 0px`, threshold [0,0.5,1]
// On intersection: setActiveId(topmost visible); renders <nav> children clone with aria-current + class `after:scale-x-100`

// src/components/MobileMenu.tsx
type MobileMenuProps = { sections: { id: string; label: string }[] };
// State: open: boolean; effects: body.style.overflow, focus trap, keydown Esc
// Hydration: client:media="(max-width:768px)" — no JS >768px
```

```css
/* src/styles/global.css — Tailwind v4 tokens */
@theme {
  --text-hero: clamp(1.9rem, 5.2vw, 3.25rem);
  --text-hero-desc: clamp(1.05rem, 1.6vw, 1.18rem);
  --shadow-card-lift: 0 12px 28px rgba(26,28,28,0.08);
}
```

```astro
---
// Header.astro island slots
import NavSpy from './NavSpy.tsx';
import MobileMenu from './MobileMenu.tsx';
const sections = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'abogados', label: 'Abogados' },
  { id: 'por-que', label: 'Por qué' },
  { id: 'contacto', label: 'Contacto' },
];
---
<NavSpy sections={sections.map(s=>s.id)} client:load />
<MobileMenu sections={sections} client:media="(max-width:768px)" />
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | `astro check` + `pnpm run build` no regression, LCP eager | `build_command` in `config.yaml` |
| A11y | axe `color-contrast` on hero 0.14+scrim, `aria-current`, `focus-visible` | `axe-core` manual run, tab/Shift+Tab trap |
| Visual QA | clamp no overflow at 320/375/428, card lift 200ms, underline scaleX | Viewport matrix in Chrome DevTools |
| Interaction | IO active on `#servicios` top-third, ResizeObserver recalc, drawer overlay/Esc/anchor close, body lock | Manual scroll/resize/font-load; no JS framework tests (runner none per config) |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. Pure frontend Astro/React islands + CSS.

## Migration / Rollout

3 chained PRs (auto-chain):
1. `feat(hero): veil 0.14 + fluid clamp` — `global.css` tokens + `Hero.astro` + `Layout.astro` preload.
2. `feat(nav): NavSpy + MobileMenu islands` — `NavSpy.tsx`, `MobileMenu.tsx`, `Header.astro`, `WhyUs` id fix.
3. `feat(hover): card lift + underline motif + reduced-motion` — `Services/Team/WhyUs` polish.

Rollback: revert 3→1; static `.astro` restored. No migrations. Each PR <120 lines, `pnpm run build` gate.

## Open Questions

- [ ] Section order final? Proposal includes `#por-que` (WhyUs) between Abogados/Contacto — confirm nav label/id mapping before PR2.
- [ ] `principal.jpeg` stays in `/public` vs future `src/assets` + `astro:assets` optimization — deferred per Out-of-Scope.
```

