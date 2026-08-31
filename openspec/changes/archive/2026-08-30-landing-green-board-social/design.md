# Design: Landing — Green Board Social

## Technical Approach
Static Astro, zero islands. Four `data-grupo` grids unified in one tinted board (`--color-surface-green #f2f7f5`) preserving every `data-grupo`/`data-abogado` node and verbatim `as const` arrays (Ipialabogados.md §3-§6). Disclosure is vanilla JS (<1KB) per Omar group: 6 visible, remainder in collapsed `max-height` wrapper, `aria-expanded`/`aria-controls`, all `<li>` always in DOM (crawlable, printable). Header `bg-white/95 → #005243` via `IntersectionObserver` sentinel at hero end. Motion only `transform`/`opacity` `duration-200` + global `prefers-reduced-motion` guard. WhatsApp/social are inline SVG anchors.

Maps to proposal and 6 delta reqs; 5 prior landing reqs unchanged.

## Architecture Decisions

| Decision | Options | Tradeoffs | Choice |
|----------|---------|-----------|--------|
| A1 Disclosure | `<details>/<summary>` vs JS `max-height` | `details`: zero JS but un-animatable height cross-browser, marker brittle. JS: 20 LOC, animates, testable `aria-*` | **JS `max-height` per `data-grupo`** — all `<li>` in DOM, no React island (Vercel `bundle-*` avoid), no-JS fallback shows all (no CLS) |
| A2 Header scroll | `scrollY` throttle vs `IntersectionObserver` sentinel | `scrollY` main-thread tick, needs passive+throttle. Observer off-thread, no tick | **Observer sentinel** `#header-sentinel` (`rootMargin:-80px` = `h-20`) + 1-line `scrollY>64` fallback. Toggles `.is-scrolled` |
| A3 Green tint | Paint page vs only board | Full green breaks sobriety (risk Med) | **`--color-surface-green #f2f7f5` in `@theme`**, applied to `.services-board` only. Primary `#005243` unchanged |
| A4 WhatsApp | React island vs static anchors | Island ~120KB for a link | **Static anchors**: `#contacto` + `fixed bottom-5 right-5` float in `Layout.astro` (`wa.me/573188215030`), inline SVG, `aria-label`, `noopener` |
| A5 Footer social | Icon font vs inline SVG | Font = extra request, FOIT, bundle | **Inline SVG FB+IG** in `Footer.astro`, `aria-label`, `rel=noopener`, `href="#"` placeholder |
| A6 Motion | `transition-all` vs allow-list | `all` triggers layout/paint | **Only `transform`/`opacity` 200ms ≤2px** + global reduce guard + `cardIn` stagger 40ms |

## Data Flow

```
Hero#inicio → #header-sentinel → IntersectionObserver → Header.is-scrolled (bg/text swap)
Services.astro (4 arrays verbatim) → #servicios .services-board [--color-surface-green]
  ├─ [data-abogado=omar] → 3×[data-grupo] → button[aria-controls/expanded] → .grupo-extra[.is-expanded]
  └─ [data-abogado=franco] → ul (no toggle)
Contact#contacto → wa.me ×2 | Layout → floating wa.me | Footer → FB/IG
global.css @theme → --color-surface-green → board + motion guard
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modify | Add `--color-surface-green:#f2f7f5` to `@theme`; reduce guard; `.services-board`, `.grupo-extra{max-height:0;opacity:0;overflow:hidden;transition:max-height 200ms,opacity 200ms}` + `.is-expanded`, `@keyframes cardIn` |
| `src/components/Services.astro` | Modify | Wrap Omar+Franco in `.services-board` (`bg-[var(--color-surface-green)]`); per Omar grupo split 6 visible + remainder in `#grupo-{name}.grupo-extra`; add `button[aria-expanded][aria-controls][data-grupo-toggle]`; vanilla `<script>` toggle; Franco no toggle |
| `src/components/Header.astro` | Modify | Add `id="site-header"`; `<script>` Observer (`rootMargin:"-80px 0 0 0"`) + fallback `scrollY>64`; toggle `.is-scrolled` → `bg-[#005243]`/`text-white` (≥7:1) |
| `src/components/Hero.astro` | Modify | Append `<div id="header-sentinel" aria-hidden>` sentinel |
| `src/components/Contact.astro` | Modify | Harden `wa.me` links: `target=_blank rel=noopener noreferrer aria-label`, `duration-200` only |
| `src/components/Footer.astro` | Modify | Add FB+IG inline SVG anchors: `aria-label`, `rel=noopener`, `aria-hidden` on svg, `hover:text-[#005243]` |
| `src/layouts/Layout.astro` | Modify | Add floating WhatsApp `fixed bottom-5 right-5 z-50 bg-[#005243] rounded-full p-4 shadow-lg hover:scale-[1.02] transition-[transform,opacity] duration-200` |

No new/deleted files. ~140 lines (<400).

## Interfaces / Contracts

```css
@theme { --color-surface-green:#f2f7f5; }
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
```

```html
<div data-grupo="trabajadores">
  <ul><!-- 6 li --></ul>
  <div id="grupo-trabajadores" class="grupo-extra"><ul><!-- rest --></ul></div>
  <button aria-expanded="false" aria-controls="grupo-trabajadores" data-grupo-toggle>Leer más</button>
</div>
<header id="site-header"><!-- .is-scrolled → bg-[#005243] --></header>
<a href="https://wa.me/573188215030" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">svg</a>
```

DOM attrs `data-grupo`/`data-abogado` + verbatim `<li>` unchanged.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | `pnpm build` ok; `dist` has 1 `.services-board` wrapping 4 grupos +2 abogados; token + wa.me×2 + FB/IG | `grep -c` in `dist/`; `astro check` |
| DOM/a11y | All `<li>` in DOM collapsed; `aria-expanded` flips; axe no contrast/empty-link | `axe-core` on `dist/`; reduced-motion emu |
| Visual | Tint subtle 2-4%; header white→green at sentinel; only `transform`/`opacity` 200ms | QA + `grep transition` |
| Perf | No island added | `grep "client:" src/components` |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. Static markup + inline vanilla JS only.

## Migration / Rollout

No migration. Static deploy. Rollback `git revert` → `bg-[#f9f9f9]` + grids; verify `pnpm build` + `grep data-grupo`. Coordinate rebase with `ux-polish-hero-nav` (color vs veil disjoint).

## Open Questions

- [ ] Sentinel `rootMargin` if header height changes in parallel change
- [ ] Floating WhatsApp uses `3188215030` primary confirmed; second stays in Contact list
