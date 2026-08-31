# Tasks: Landing — Green Board Social

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 120–160 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR (3 work-unit commits) |
| Delivery strategy | auto-chain |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Tokens + tint + motion | PR 1 | `grep surface-green src/styles/global.css && pnpm build` | `pnpm build && grep reduced-motion dist/` | `global.css` only |
| 2 | Unified board + disclosure | PR 1 | `pnpm build && grep -c data-grupo dist/index.html` | `pnpm dev` → Leer más toggle, 6 visible, DOM intact | `Services.astro` only |
| 3 | Header + sentinel + CTAs + social | PR 1 | `grep -c 'is-scrolled\|sentinel' dist/index.html` | `pnpm dev` → scroll header #005243, check wa.me + FB/IG | `Header/Hero/Contact/Footer/Layout.astro` |

## Phase 1: Foundation — Tokens & Motion (global.css)

- [x] 1.1 Add `--color-surface-green:#f2f7f5` to `@theme` in `src/styles/global.css`; keep `#005243`
- [x] 1.2 Add `.services-board` + `.grupo-extra{max-height:0;opacity:0;overflow:hidden;transition:200ms}` + `.is-expanded` + `@keyframes cardIn` (transform/opacity, 40ms stagger)
- [x] 1.3 Add guard `@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}`

## Phase 2: Core — Unified Board + Disclosure (Services.astro)

- [x] 2.1 Wrap Omar+Franco in `.services-board` tint div; keep 4 `as const` arrays verbatim (§3.1-§4)
- [x] 2.2 Per Omar grupo: 6 visible `<li>` + rest in `#grupo-{name}.grupo-extra`; add `button[data-grupo-toggle][aria-expanded][aria-controls]`
- [x] 2.3 Add vanilla `<script>` toggling `.is-expanded` + `aria-expanded`; Franco no toggle; all `<li>` stay in DOM

## Phase 3: Integration — Header Scroll + CTAs + Social

- [x] 3.1 Append sentinel `div#header-sentinel[aria-hidden]` at end of `src/components/Hero.astro`
- [x] 3.2 Update `src/components/Header.astro`: `id="site-header"` + Observer `rootMargin:"-80px 0 0 0"` + fallback `scrollY>64` → `.is-scrolled` `bg-[#005243]`/`text-white`; no layout shift (h-20 fixed)
- [x] 3.3 Harden `src/components/Contact.astro`: both `wa.me/573188215030|573137664683` with `target _blank rel noopener aria-label`, `duration-200` only
- [x] 3.4 Add FB+IG inline SVG to `src/components/Footer.astro`: `aria-label`, `rel noopener`, `aria-hidden` svg, `href="#"`, `hover:text-[#005243]`
- [x] 3.5 Add floating WhatsApp to `src/layouts/Layout.astro`: `fixed bottom-5 right-5 z-50 bg-[#005243] rounded-full p-4 shadow-lg hover:scale-[1.02] transition-[transform,opacity] duration-200`

## Phase 4: Verification — Build, Invariants & a11y

- [x] 4.1 `pnpm build && npx astro check`; grep `dist/index.html`: 1× `.services-board` with 4× `data-grupo` +2× `data-abogado`, token `#f2f7f5`, wa.me×2, FB/IG, `is-scrolled`
- [x] 4.2 Verify crawlable: all `<li>` in DOM collapsed; Leer más flips `aria-expanded`; `grep client: src/components`=0
- [x] 4.3 axe contrast on `.is-scrolled` (≥4.5:1, target 7:1) + empty-link check; emulate `prefers-reduced-motion` disables
