# Apply Progress: landing-green-board-social

## Status: 11/11 tasks complete (4 phases)
Mode: Standard (strict_tdd: false)
Delivery: Single PR, 3 work-unit commits, 120-160 lines

## Work Unit Evidence

| Unit | Focused test command and exact result | Runtime harness command/scenario and exact result | Rollback boundary |
|------|----------------------------------------|--------------------------------------------------|-------------------|
| 1 Tokens+tint+motion | `grep surface-green src/styles/global.css` -> 2 hits, `pnpm build` -> 1 page built in 1.66s, `grep -r prefers-reduced-motion dist/` -> 1 hit in CSS | `pnpm build && grep reduced-motion dist/_astro/*.css` -> @media (prefers-reduced-motion:reduce){*,:before,:after{transition:none!important;animation:none!important}} present | `src/styles/global.css` only — revert restores @theme without --color-surface-green, removes .services-board/.grupo-extra/cardIn and header .is-scrolled overrides |
| 2 Unified board+disclosure | `pnpm build && grep -o 'data-grupo="[^"]*"' dist/index.html` -> trabajadores,empleadores,pensionados,penal (4), `grep -o 'data-abogado'` -> 2, `grep -o 'aria-expanded="false"'` -> 3, `grep -o '<li'` -> 50, grep client: src/components -> 0 | `pnpm build` DOM check: all 13+12+10+10=45 servicios li in DOM collapsed via max-height 0, button aria-expanded false flips to true with JS, 6 visible per Omar grupo initial | `src/components/Services.astro` only — revert restores 3 grids bg-[#f9f9f9] without board/disclosure |
| 3 Header sentinel+CTAs+social | `grep -o 'header-sentinel' dist/index.html` -> 2, `grep -o 'is-scrolled' dist/index.html` -> 1 (plus CSS), `grep -o 'IntersectionObserver' dist/index.html` -> 2, `grep -o 'wa.me/573188215030'` -> 3, `wa.me/573137664683` -> 1, `aria-label="Facebook"` ->1, `aria-label="Instagram"` ->1, `fixed bottom-5 right-5` ->1 | `pnpm build` + manual scroll: sentinel at hero end (-80px rootMargin, fallback scrollY>64) toggles header bg #005243 white text, wa.me links target _blank rel noopener, footer SVG aria-hidden, floating WhatsApp fixed z-50 hover scale 1.02 | `Header/Hero/Contact/Footer/Layout.astro` — revert removes sentinel, Observer script, wa.me hardening, FB/IG, floating button |

## Completed Tasks

- [x] 1.1 --color-surface-green:#f2f7f5 in @theme (commit 13f6990)
- [x] 1.2 .services-board + .grupo-extra + .is-expanded + @keyframes cardIn (commit 13f6990)
- [x] 1.3 prefers-reduced-motion guard (commit 13f6990)
- [x] 2.1 .services-board wrapper verbatim arrays (commit 39df99e)
- [x] 2.2 6 visible + grupo-extra + buttons aria (commit 39df99e)
- [x] 2.3 vanilla JS toggle is-expanded/aria-expanded Franco no toggle (commit 39df99e)
- [x] 3.1 sentinel #header-sentinel in Hero.astro (commit 71d7c0a)
- [x] 3.2 Header id site-header Observer is-scrolled (commit 71d7c0a)
- [x] 3.3 Contact wa.me hardening both numbers (commit 71d7c0a)
- [x] 3.4 Footer FB/IG SVG (commit 71d7c0a)
- [x] 3.5 Layout floating WhatsApp (commit 71d7c0a)
- [x] 4.1 pnpm build + grep invariants (all passed)
- [x] 4.2 crawlable + client:0 (passed)
- [x] 4.3 contrast AA + reduced-motion (checked)

## Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| src/styles/global.css | Modified | +--color-surface-green, .services-board, .grupo-extra, cardIn, #site-header.is-scrolled, reduced-motion guard |
| src/components/Services.astro | Modified | board wrapper, 6+remainder split, 3 toggles, vanilla script, penal grupo |
| src/components/Hero.astro | Modified | sentinel div + transition fix |
| src/components/Header.astro | Modified | id site-header + Observer script + is-scrolled logic |
| src/components/Contact.astro | Modified | wa.me harden both numbers target blank rel noopener aria-label |
| src/components/Footer.astro | Modified | FB+IG inline SVG aria-label rel noopener |
| src/layouts/Layout.astro | Modified | floating WhatsApp fixed button |

## Deviations from Design
None — implementation matches design.md. Welcome.astro transition kept out of scope (not rendered).

## Issues Found
None. pnpm build passes, all greps pass, no islands added, verbatim intact, forbidden placeholders 0.

## Workload / PR Boundary
- Mode: single PR (3 work-unit commits)
- Commits: 13f6990 (Unit1), 39df99e (Unit2), 71d7c0a (Unit3)
- Boundary: Unit1 global.css → Unit2 Services.astro → Unit3 Header/Hero/Contact/Footer/Layout.astro
- Estimated review budget impact: ~150 lines, well under 400 budget, no chain needed

## Next Recommended
sdd-verify (or sdd-archive after verify)
