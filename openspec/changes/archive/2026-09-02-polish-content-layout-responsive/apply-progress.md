# Apply Progress — polish-content-layout-responsive

- Change: polish-content-layout-responsive
- Mode: Standard (strict_tdd false)
- Commits: 3 work-unit commits on single PR (Low risk ~100 lines)

## Completed Tasks
- [x] 1.1 Update --text-label-sm floor 0.75rem→0.8125rem in src/styles/global.css — clamp(0.8125rem,1.1vw,0.875rem)
- [x] 2.1 Remove Firma Jurídica Boutique subtitle and backdrop-blur-md→lg in Header.astro
- [x] 2.2 Reorder navigation anchors in Header.astro to Inicio→Quiénes somos→Abogados→Servicios→Por qué→Contacto
- [x] 2.3 Reorder LINKS array in MobileDrawer.tsx to match Header order
- [x] 3.1 Remove principal.webp import and image column in About.astro; centered max-w-3xl mx-auto text-center
- [x] 3.2 Increase Team avatars to w-48 h-48 md:w-56 md:h-56 and remove bio paragraphs in Team.astro
- [x] 3.3 Swap Team and WhyUs component order in src/pages/index.astro (Hero→About→Team→Services→WhyUs→Contact)
- [x] 4.1 pnpm run build exit 0
- [x] 4.2 dist/index.html section order indexOf(#abogados) < indexOf(#porque-elegirnos) verified
- [x] 4.3 label-sm readability ≥13px on 320px verified via clamp floor
- [x] 4.4 backdrop-blur-lg visual check retained (forest deep bg-surface/90)
- [x] 4.5 Team avatars 192px mobile fits 320px viewport, grid 1→2

## Work Unit Evidence

| Evidence | Value |
|---|---|
| Focused test command | `pnpm run build` — exit 0, 1 page built in ~1.7s |
| Runtime harness | Static Astro build + grep invariants + node indexOf check — PASS |
| Rollback boundary | 6 files: global.css, Header.astro, MobileDrawer.tsx, About.astro, Team.astro, index.astro — revert 3 commits independently |

### Invariants Grep
- `grep "clamp(0.8125rem" src/styles/global.css` → 1 match
- `grep "principal" src/components/About.astro` → 0 (good)
- `grep "Firma" src/components/Header.astro` → 0 (good)
- `grep "backdrop-blur-lg" src/components/Header.astro` → 1
- `grep "w-48 h-48 md:w-56 md:h-56" src/components/Team.astro` → 2
- `node indexOf check` → abogados 13935 < porque-elegirnos 24951 PASS

## Commits
- d697da9 style(design-tokens): bump label-sm floor to 0.8125rem
- e46b659 feat(header-nav): header wordmark blur-lg and reorder nav plus domain order
- c5a97a3 feat(content): center About without image and enlarge Team avatars

## Deviations
None — implementation matches design.md and spec.md.

## Status
12/12 tasks complete. Ready for verify.
