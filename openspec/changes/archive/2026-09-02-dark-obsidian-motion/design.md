# Design: Dark Obsidian Motion

## Technical Approach

Finish 90% complete Forest Deep migration (Approach A): fix two WCAG AA blockers via token swaps, then layer disciplined motion on existing `Layout.astro` reveal system. Sequence: `ServiceExplorer`/`Footer` contrast → `global.css` motion CSS → `Layout.astro` IO enhancement + vanilla parallax → `Hero` opacity tuning → lightweight `DESIGN.md`. Keep Astro 95% static, React island minimal (`client:visible` only), `astro:assets` webp, verbatim `servicios`/`abogados` arrays. `global.css` dark `@theme` and `rgba(0,0,0,0.45)` shadows are 90% done — confirm, not rebuild.

## Architecture Decisions

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Token swap `text-primary→on-surface`, `border-platinum-silver→outline-variant` vs new classes | New classes add indirection; swap is grep-verifiable, matches `@theme` | **Swap in JSX only** — `#0d3b2c→#f0f4f2` titles, `#223b31` borders, `#4fd1ae` toggles |
| Extend `Layout.astro` IO vs new island / Framer Motion | New lib +30-50kB, breaks static-first | **Enhance vanilla IO** — `threshold 0.15, rootMargin 0px 0px -40px 0px`, `data-reveal-delay`→`--reveal-delay`, `rAF`+`will-change` |
| `scroll-timeline` vs JS `translateY` | CSS lacks Safari, no 40px cap | **Vanilla JS ≤40px** — `matchMedia(reduce)` early return, `innerWidth<768` guard, `passive`+`rAF` |
| Hero `opacity-40` vs `0.50` | 0.40 empty, 0.60 loses overlay | **0.50** + `hero-parallax-target`, `will-change` only ≥768px |
| Full `DESIGN.md` vs lightweight tokens | 187-line doc deleted intentionally | **Lightweight frontmatter** — palette+`@theme`+motion, ≤60 lines |

## Data Flow

```
Scroll/IO → Layout.astro vanilla script → DOM
  ├─ IO(0.15/-40px) observes [data-reveal] → add .is-visible → .reveal 600ms + --reveal-delay
  ├─ reduce? → .is-visible instantly, skip listeners
  └─ Parallax ≥768px: scroll(passive+rAF) → translateY clamp 40px on .hero-parallax-target

ServiceExplorer(client:visible) → Tabs(Todos|4 grupos) → GrupoCard×4 display:none/block
  └─ disclosure aria-expanded 6→all + wa.me CTA per grupo (verbatim titles)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modify | Confirm `@theme` Forest Deep + radii `0.125/0.25/0.5/full` + `rgba(0,0,0,0.45)` done; add `.hero-parallax-target{will-change:transform}`, `@media(max-width:767px){transform:none}`, keep `.reveal` 600ms + delay vars, `reduce` last |
| `src/components/islands/ServiceExplorer.tsx` | Modify | `GrupoCard`: `border-platinum-silver→outline-variant`, `text-primary→on-surface` title, toggle `→teal-accent-light`; tabs inactive `→outline-variant`+`on-surface-variant` on `surface-container-lowest`, hover `teal-accent`; keep `memo`/`useState`, verbatim `grupos` |
| `src/components/Footer.astro` | Modify | `text-on-primary #03150e→on-surface #f0f4f2` title, `hover:on-primary→teal-accent-light`, `border-platinum-silver/20→outline-variant/20`, year 2024→2026 |
| `src/layouts/Layout.astro` | Modify | Keep sentinel/header; enhance reveal delay mapping; add IIFE: `if(reduce||<768) return` then `scroll+rAF` parallax on `.hero-parallax-target` `translateY(scrollY*0.15)` capped 40px |
| `src/components/Hero.astro` | Modify | `opacity-40→opacity-50`, add `hero-parallax-target` to `Image`, keep `astro:assets` `widths`/`fetchpriority="high"`/grayscale |
| `DESIGN.md` | Create | Token frontmatter: `forest-deep #04170f`, `surface #08211a`, `teal #2aa88c/#4fd1ae`, `on-surface #f0f4f2`, `outline #223b31`, radii/shadows/motion |
| `openspec/specs/landing/spec.md` | Modify | Via `sdd-archive` only |

## Interfaces / Contracts

```ts
type GrupoPayload = { grupo:"trabajadores"|"empleadores"|"pensionados"|"penal"; title:string; items:string[] }
// Reveal: [data-reveal][data-reveal-delay="100|200|300"] → .reveal → .is-visible (opacity 0→1, translateY 16px→0)
// Parallax: .hero-parallax-target → style.transform = `translateY(${clamp(y*0.15,0,40)}px)`
```

```css
.hero-parallax-target{will-change:transform}
@media(max-width:767px){.hero-parallax-target{transform:none!important;will-change:auto}}
.reveal{opacity:0;transform:translateY(16px);transition:opacity 600ms ease,transform 600ms ease;transition-delay:var(--reveal-delay,0ms);will-change:opacity,transform}
.reveal.is-visible{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important}.reveal{opacity:1!important;transform:none!important}html{scroll-behavior:auto}}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|--------------|----------|
| Build | `pnpm run build`, webp, clamp, `content-visibility` | `build && grep -R "clamp\|forest-deep" dist/` |
| A11y | AA 4.5:1 ServiceExplorer/Footer | axe `#servicios`+footer, computed contrast `#f0f4f2`/`#0d2b21` 14.5:1 |
| Motion | Stagger 100ms, 40px cap, reduce, mobile | Scroll ≥768px, measure `translateY≤40px`, emulate reduce→`is-visible`, 375px no parallax |
| Perf | `transform`/`opacity` only, CLS 0 | grep `transition` only 200/600ms, no `width`/`height` |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration. Single PR <400 lines, `auto-chain`: (1) ServiceExplorer a11y, (2) Footer+Hero+global.css, (3) Layout parallax+DESIGN.md. Rollback `git revert && pnpm run build`. Motion behind `prefers-reduced-motion` and `768px`.

## Open Questions

- [ ] Deprecate `text-primary #0d3b2c` as surface text entirely?
- [ ] Team avatar `scale(1.03)` on reveal vs hover-only to avoid CLS?
