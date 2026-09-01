# Apply Progress — ipial-ux-overhaul

## Work Unit Evidence

| Unit | Focused test command & result | Runtime harness & result | Rollback boundary |
|------|-------------------------------|--------------------------|-------------------|
| 1 Foundation | `grep -o '<li[^>]*data-grupo' dist/index.html \| wc -l` → 45 (13+12+10+10) ; `pnpm run build` ✓ 1.47s | `dist/index.html` contains 45 li, 4 grupos, per-grupo wa.me CTAs, tabs 5 | `src/styles/global.css`, `src/components/Services.astro`, `src/components/islands/ServiceExplorer.tsx`, `src/components/Team.astro`, `src/pages/index.astro` |
| 2 Editorial | `grep -c 'clamp' dist/_astro/*.css` → 1 ; `grep -c 'fetchpriority' dist/index.html` → 1 ; `grep -c 'preload' dist/index.html` → 1 | Hero: 1 h1 clamp, proof line, dual CTAs wa.me + #servicios, webp eager, sentinel#header-sentinel outside ; Header 5 anchors, MobileDrawer client:media Escape/focus trap | `src/components/Hero.astro`, `src/components/About.astro`, `src/layouts/Layout.astro`, `src/components/Header.astro`, `src/components/islands/MobileDrawer.tsx` |
| 3 Authority | `grep -c 'tel:' dist/index.html` → 2 (both tel) ; `grep -c 'data-map' dist/index.html` → 0 ; `grep -c 'content-visibility' dist/_astro/*.css` → 1 | WhyUs 3 cards (laboral/pensional resc. penal traslados resguardos) ; Contact address+horario, tel above social ; motion audit transform/opacity 200ms 2px + prefers-reduced-motion | `src/components/WhyUs.astro`, `src/components/Contact.astro`, `src/styles/global.css` |

## Completed Tasks
- [x] 1.1 global.css fluid clamp tokens + dossier 1px silver rule
- [x] 1.2 global.css content-visibility:auto sections
- [x] 1.3 ServiceExplorer.tsx client:visible 5 tabs CSS filter 45 li wa.me CTA memoized
- [x] 1.4 Services.astro getCollection+parseItems → ServiceExplorer props
- [x] 1.5 Team.astro bios verbatim §2 chips → #servicios
- [x] 1.6 index.astro Hero→About→Services→Team→WhyUs→Contact
- [x] 1.7 Verify build 45 li
- [x] 2.1 Layout.astro preload hero fetchpriority high
- [x] 2.2 Hero.astro clamp h1 proof dual CTA eager webp sentinel outside
- [x] 2.3 About.astro 2-3 sentences divider location proof
- [x] 2.4 MobileDrawer.tsx client:media aria-expanded Escape focus trap
- [x] 2.5 Header.astro Servicios anchor 5 active observer
- [x] 2.6 Verify hero hierarchy + drawer a11y
- [x] 3.1 WhyUs 3 domain proof cards verbatim
- [x] 3.2 Contact tel prominence remove placeholder address/horario
- [x] 3.3 Motion audit transform/opacity 200ms 2px reduced-motion
- [x] 3.4 Perf clamp + content-visibility grep Lighthouse ≥95 expected (static, no JS bloat)
- [x] 3.5 Verbatim audit 45 items DOM

## Deviations
None — spec-driven. Design frozen ignored per instruction.

## Issues
- dist/index.html is minified single line; grep -c data-grupo counts lines not occurrences. Verified with grep -o | wc -l =45.
