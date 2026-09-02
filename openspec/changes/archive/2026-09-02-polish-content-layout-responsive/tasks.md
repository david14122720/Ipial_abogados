# Tasks: polish-content-layout-responsive

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 90-120 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | single PR |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Visual & Structural Polish | PR 1 | `pnpm run build` | Manual visual check 320px-1200px | All affected files |

## Phase 1: Foundation & Typography

- [x] 1.1 Update `--text-label-sm` floor from `0.75rem` to `0.8125rem` in `src/styles/global.css`
  - Test: `grep "clamp(0.8125rem" src/styles/global.css`

## Phase 2: Header & Navigation Reorder

- [x] 2.1 Remove "Firma Jurídica Boutique" subtitle and update blur to `backdrop-blur-lg` in `src/components/Header.astro`
  - Test: `grep "backdrop-blur-lg" src/components/Header.astro`
- [x] 2.2 Reorder navigation anchors in `src/components/Header.astro` to: Inicio $\rightarrow$ Quiénes somos $\rightarrow$ Abogados $\rightarrow$ Servicios $\rightarrow$ Por qué $\rightarrow$ Contacto
- [x] 2.3 Reorder `LINKS` array in `src/components/islands/MobileDrawer.tsx` to match Header order
  - Test: `grep "LINKS" src/components/islands/MobileDrawer.tsx`

## Phase 3: Content Layout Polish

- [x] 3.1 Remove `principal.webp` import and image column in `src/components/About.astro`; center align copy with `max-w-3xl mx-auto text-center`
  - Test: `grep -v "principal.webp" src/components/About.astro`
- [x] 3.2 Increase Team avatars to `w-48 h-48 md:w-56 md:h-56` and remove bio paragraphs in `src/components/Team.astro`
  - Test: `grep "w-48 h-48 md:w-56 md:h-56" src/components/Team.astro`
- [x] 3.3 Swap `Team` and `WhyUs` component order in `src/pages/index.astro`
  - Test: `grep -A 10 "<Team" src/pages/index.astro | grep -B 10 "<WhyUs"` (Verify Team is above WhyUs)

## Phase 4: Verification

- [x] 4.1 Run `pnpm run build` to verify no broken imports or build errors
- [x] 4.2 Verify `dist/index.html` section order: `#abogados` appears before `#porque-elegirnos`
- [x] 4.3 Manual Visual Check: Verify `label-sm` readability on 320px viewport
- [x] 4.4 Manual Visual Check: Verify Header `backdrop-blur-lg` does not look muddy on dark surface
- [x] 4.5 Manual Visual Check: Verify Team avatars fit in viewport on 320px without overflow
