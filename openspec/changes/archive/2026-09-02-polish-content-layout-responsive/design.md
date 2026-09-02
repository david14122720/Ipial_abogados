# Design: polish-content-layout-responsive

## Technical Approach

Minimal polish across 6 files (~90 lines). Implements proposal Approach A: About becomes single-column editorial, Header loses subtitle + gains `backdrop-blur-lg`, Team avatars grow and bios drop, nav/DOM reorders to `Inicio→Quiénes somos→Abogados→Servicios→Por qué→Contacto` with Team before WhyUs, and `label-sm` floor rises 12→13px. Retains Forest Deep palette, `astro:assets`, `content-visibility:auto`, and `prefers-reduced-motion` guard. No new content; verbatim arrays preserved. Static Astro 95%.

Covers deltas: About Single-Column, Header Sticky, Design Tokens, Team Cards, Page Order (`specs/landing/spec.md`).

## Architecture Decisions

### Decision: About 2-col → centered

| Option | Tradeoff | Decision |
|---|---|---|
| Hide image via CSS | Dead import, CLS risk | Rejected |
| Delete import+column, `max-w-3xl mx-auto text-center` | Clean DOM, fixes 320px overflow | **Chosen** |
| New image | Invents content (out-of-scope) | Rejected |

**Rationale**: Removes `import principal`/`Image`, eliminates bytes/layout shift; keep `data-reveal`, `h2 text-headline-lg text-on-surface [text-wrap:balance]`, `px-gutter`.

### Decision: Header blur + wordmark

| Option | Tradeoff | Decision |
|---|---|---|
| `blur-md` keep | Subtle but below request | Rejected |
| `blur-lg` (16px) | Frost on `bg-surface/90` without mud | **Chosen** |
| `blur-xl` | Heavy on dark, cost | Rejected |

**Rationale**: Delete `Firma Jurídica Boutique` span, keep `flex-col` wordmark `Ipial Abogados tracking-tight`, retain `sticky top-0 z-50 #site-header` + `.is-scrolled` JS.

### Decision: Team avatars + bios

| Option | Tradeoff | Decision |
|---|---|---|
| `w-56 md:w-64` | Too tall on 320 | Rejected |
| `w-48 h-48 md:w-56 md:h-56 rounded-full` | Fits 375–1200, `object-cover` | **Chosen** |
| Keep bios | Violates minimal-card spec | Rejected |

**Rationale**: Update both cards; Omar keeps `Image widths [160,192,384]`, Franco initials unchanged; remove `p.text-body-md.text-secondary` bios, keep `h3` name + `p specialty text-teal-accent-light`; grid `1→2`.

### Decision: Token scope

| Option | Tradeoff | Decision |
|---|---|---|
| Bump full label scale | Blast radius (chips/checks) | Rejected |
| Only `--text-label-sm` `0.75→0.8125rem` | Targeted 13px floor | **Chosen** |
| Inline overrides | Breaks token system | Rejected |

**Rationale**: `clamp(0.8125rem,1.1vw,0.875rem)` keeps fluid `1.1vw`; audit other `clamp()` untouched.

### Decision: Nav order coupling

| Option | Tradeoff | Decision |
|---|---|---|
| Header only | Drawer/DOM mismatch | Rejected |
| Header + MobileDrawer LINKS + DOM | Atomic, matches `index.astro` | **Chosen** |

**Rationale**: 6 hrefs `#inicio,#quienes-somos,#abogados,#servicios,#porque-elegirnos,#contacto`; `index.astro` swaps Team before WhyUs so `indexOf(#abogados)<indexOf(#porque-elegirnos)`.

## Data Flow

Static build, no runtime change.

```
global.css (@theme) → Tailwind → dist/*.css
*.astro → Astro build → dist/index.html (centered About, reordered)
MobileDrawer.tsx (client:media) → JS bundle (aria-expanded, Escape, focus trap)
assets/*.webp → astro:assets (hero fetchpriority:high retained)
```

`is-scrolled` via existing sentinel/scrollY>64; `content-visibility:auto` offscreen.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/components/About.astro` | Modify | Remove `Image`+`principal` import, delete image grid/column, wrap copy in `max-w-3xl mx-auto text-center`, keep `data-reveal`, checklist `ul` |
| `src/components/Header.astro` | Modify | Delete subtitle span, `backdrop-blur-md→lg`, reorder 6 nav anchors to spec order, keep `sticky top-0 z-50` |
| `src/components/Team.astro` | Modify | Avatars `w-40→w-48 md:w-48→md:w-56`, remove 2 bio `<p>`, keep `h3`+specialty, grid `1→2` |
| `src/pages/index.astro` | Modify | Swap Team/WhyUs → `Hero→About→Team→Services→WhyUs→Contact`, reorder imports |
| `src/components/islands/MobileDrawer.tsx` | Modify | Reorder `LINKS` to 6 items matching Header |
| `src/styles/global.css` | Modify | `--text-label-sm: clamp(0.8125rem,1.1vw,0.875rem)`; retain tokens, `content-visibility`, reduced-motion last |

No create/delete. `WhyUs.astro`/`Services.astro` untouched.

## Interfaces / Contracts

No new APIs. Contracts retained:

```ts
const LINKS: { href: `#${string}`; label: string }[] = [
  { href: "#inicio", label: "Inicio" },
  { href: "#quienes-somos", label: "Quiénes somos" },
  { href: "#abogados", label: "Abogados" },
  { href: "#servicios", label: "Servicios" },
  { href: "#porque-elegirnos", label: "Por qué elegirnos" },
  { href: "#contacto", label: "Contacto" },
];
// Header anchors mirror LINKS; --text-label-sm: clamp(0.8125rem,1.1vw,0.875rem)
```

IDs unchanged: `#site-header`, `#quienes-somos`, `#abogados`, etc.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Build | `pnpm run build` + `astro check` | No broken import, section order |
| Static | Grep `dist/` | No About `principal`, blur `lg`, label-sm `0.8125rem`, avatars `w-48` |
| Visual | 320/375/428/768/1200 | No overflow, 1→2 cols at 768 |
| A11y | Drawer `aria-expanded`, Escape, focus | Manual + reduced-motion instant |

No runner (`testing.runner: none`); build+grep+manual.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process integration. Pure static polish; island isolated via `client:media`.

## Migration / Rollout

No migration. Single PR ~90 lines; rollback `git revert`. No flag, no data change.

## Open Questions

- [ ] Visual QA `blur-lg` on `bg-surface/90` — fallback `md` if muddy
- [ ] Audit `.chip`/`label-sm` usages after floor bump
