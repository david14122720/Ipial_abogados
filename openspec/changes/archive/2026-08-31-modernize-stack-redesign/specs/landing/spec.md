# Delta for landing — modernize-stack-redesign

## ADDED Requirements

### Requirement: Hero Dual CTA + Eyebrow + Optimized Background
The system MUST render `#inicio` with `label-md` uppercase eyebrow above sole h1 `display-lg` 48/56 EB Garamond 600, primary CTA `wa.me/573188215030` and secondary `#servicios`, plus `principal.jpeg` via `astro:assets` webp eager `fetchpriority="high"`.

#### Scenario: Hero hierarchy
- GIVEN `dist/index.html` `#inicio`
- WHEN inspecting hero
- THEN one h1+eyebrow, both CTAs with correct hrefs

#### Scenario: Background optimized
- GIVEN `Hero.astro` + `dist/_astro/principal.*.webp`
- WHEN checking output
- THEN `astro:assets` present, webp `fetchpriority="high"`

### Requirement: Header Sticky with Accessible Drawer
The system MUST provide sticky `#site-header` toggling `.is-scrolled` via sentinel `IntersectionObserver`/`scrollY>64`. Desktop nav MUST be 5 anchors. Mobile button MUST have `aria-expanded`/`aria-controls`/`focus-visible` and toggle drawer without reload.

#### Scenario: Scroll transition
- GIVEN sentinel at `#inicio`
- WHEN scrolling past hero
- THEN `.is-scrolled` applied, links ≥4.5:1 contrast

#### Scenario: Drawer accessible
- GIVEN viewport 375px closed
- WHEN activating menu button
- THEN `aria-expanded` false→true, drawer visible, focus-visible preserved

### Requirement: Design Tokens @theme Complete
`global.css` `@theme` MUST define Lex Imperial: `surface-container-{lowest,low,container,high,highest}` (#fff/#f3f4f4/#edeeee/#e7e8e8/#e1e3e3), `outline-variant` #c0c8c3, spacing 4px (24/40/80/1200), radii 0.125/0.25/0.375/0.5, `display-lg` 48/56 EB Garamond 600, `headline-lg` 32/40, `body-lg` 18/28 Hanken, `label-md` 14/20 600 0.05em.

#### Scenario: Tokens in build
- GIVEN `global.css` + `dist/*.css`
- WHEN grepping vs DESIGN.md
- THEN all tokens present with exact values

### Requirement: Services Collection Migration with §6 Guard
The system MUST use `getCollection('servicios')` sorted by `order`, schema `grupo` (trabajadores|empleadores|pensionados|penal)+`abogado` (omar|franco)+zod `franco↔penal` refine. Disclosure MUST keep all `<li>` in DOM, `Leer más` per grupo (`aria-expanded`, 6 initially). Verbatim §3-§4.

#### Scenario: Guard rejects cross-attribution
- GIVEN invalid `grupo: trabajadores, abogado: franco`
- WHEN `pnpm run build`
- THEN build fails with "§6 cross-attribution"

#### Scenario: Disclosure crawlable
- GIVEN `dist/index.html` `#servicios`
- WHEN parsing `data-grupo`
- THEN all `<li>` in DOM, button `aria-expanded` toggles without removal

### Requirement: Team Distinct Cards + Placeholder Discipline
`#abogados` MUST show Omar "Laboral y Seguridad Social" and Franco "Penal y Procesal Penal" verbatim §2. Missing bio/photo MUST use disclosed placeholder, MUST NOT invent years/awards.

#### Scenario: Cards verbatim
- GIVEN `#abogados`
- WHEN reading headings
- THEN both name+specialty exact, no generic placeholder

### Requirement: Contact, Ubicación and Footer
`#contacto` MUST have tel 3188215030/3137664683 (`tel:`+`wa.me`), email, dirección, horario; `#ubicacion` `data-map="placeholder"`; footer MUST have logo, 5 links, contact recap, FB/IG SVG, copyright 2026, privacy note.

#### Scenario: Contact/footer checklist
- GIVEN `dist/index.html`
- WHEN inspecting `#contacto`, `#ubicacion`, footer
- THEN all contacts, placeholder, 6 footer elements present

### Requirement: Perf/A11y/SEO Foundation
The system MUST use `astro:assets` `<Image>` for principal/logo (webp, hero eager else lazy), remove `libre-caslon-text`+`manrope`, emit JSON-LD `LegalService`+`PostalAddress`, serve `robots.txt`, keep single h1 + `focus-visible`.

#### Scenario: Artifacts valid
- GIVEN `dist/` after build
- WHEN checking webp, fonts, JSON-LD, axe
- THEN webp exists, dead fonts absent, JSON-LD valid, one h1, focus-visible

## MODIFIED Requirements

### Requirement: Soft Green Tint → Full Surface Scale
The system MUST extend tint to full `surface-container-*` per DESIGN.md on `#servicios`; primary unchanged.
(Previously: single `--color-surface-green` only)

#### Scenario: Full scale applied
- GIVEN `global.css` + `dist/index.html`
- WHEN grepping `surface-container`
- THEN five levels correct, `#servicios` tinted not #f9f9f9

### Requirement: Unified Board → Collection-Driven
The system MUST keep unified board, `data-grupo`/`data-abogado` segregation and crawlable disclosure, now via `getCollection`+`order`+§6 guard; hard-coded dup removed.
(Previously: hard-coded arrays only)

#### Scenario: Board unified after migration
- GIVEN `dist/index.html` after migration
- WHEN inspecting `#servicios`
- THEN one wrapper with 4 `data-grupo` + 2 `data-abogado`, all `<li>` in DOM

## REMOVED Requirements

### Requirement: Welcome.astro Dead Code
(Reason: unused starter, violates single-page invariant) (Migration: delete file)

### Requirement: Dead Font Packages libre-caslon-text + manrope
(Reason: bloat; canonical are EB Garamond + Hanken Grotesk) (Migration: remove from package.json/global.css)

## RENAMED Requirements

### Requirement: Green Header On-Scroll → Header Sticky with Accessible Mobile Drawer
(Reason: expanded to full sticky+drawer+focus-visible) (Migration: update spec/test refs; `is-scrolled` unchanged)
