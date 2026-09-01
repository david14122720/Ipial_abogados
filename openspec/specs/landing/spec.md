# Landing Page Specification

## Requirements

### Hero Dual CTA + Eyebrow + Optimized Background
The system MUST render `#inicio` with sole `h1` in fluid `clamp()`, dual CTA `wa.me/573188215030` + `#servicios`, proof line `Ipiales · 2 especialistas · Laboral y Seguridad Social + Penal`, and `principal.webp` via `astro:assets` webp eager `fetchpriority="high"`. Sentinel MUST be outside hero wrapper.
#### Scenario: Hero hierarchy
- GIVEN `#inicio`
- WHEN inspecting hero
- THEN one h1 with `clamp()`, proof line present, both CTAs correct
#### Scenario: Background optimized
- GIVEN `Hero.astro` + `dist/_astro/principal.*.webp`
- WHEN checking output
- THEN webp `fetchpriority="high"`, no fixed-px headline as sole value

### Header Sticky with Accessible Drawer
The system MUST provide sticky `#site-header` toggling `.is-scrolled` via sentinel observer/scrollY>64, desktop nav MUST have 5 anchors `Inicio,Nosotros,Servicios,Abogados,Contacto` with active observer, mobile MUST be `MobileDrawer` `client:media` with `aria-expanded`/`Escape` close.
#### Scenario: Servicios anchor
- GIVEN desktop header
- WHEN reading nav
- THEN 5 anchors incl. `href="#servicios"`, active class updates on scroll
#### Scenario: Drawer accessible
- GIVEN 375px drawer closed
- WHEN activating menu
- THEN `aria-expanded` false→true, drawer visible, Escape restores focus

### Design Tokens @theme Complete
`global.css` `@theme` MUST define fluid `clamp()` for `headline-xl/display-lg/headline-lg/body-lg`, dossier 1px silver rule, Emerald `primary #004a38`/`silver #A8ADB0`, radii `0.125/0.25/0.5/full`, `content-visibility: auto`. Fixed `48px/56px` MUST NOT remain sole values.
#### Scenario: Tokens in build
- GIVEN `global.css` + `dist/*.css`
- WHEN grepping `@theme`
- THEN headline tokens contain `clamp(` and `content-visibility: auto` present

### ServiceExplorer Island with Grupo Tabs and Per-Grupo CTA
The system MUST render `ServiceExplorer` `client:visible` in `#servicios` with tabs `Todos|Trabajadores|Empleadores|Pensionados|Penal`, filtering `data-grupo` without DOM removal. Each grupo MUST have disclosure (`Leer más`, `aria-expanded`, 6 initially) and `wa.me/573188215030?text=` CTA per grupo. 45 `<li>` MUST be in DOM: 13 §3.1 + 12 §3.2 + 10 §3.3 + 10 §4.
#### Scenario: Filter and conversion
- GIVEN `#servicios` with 45 `<li>`
- WHEN selecting Pensionados
- THEN only `data-grupo="pensionados"` visible (10 items) and its CTA href contains `wa.me/573188215030?text=`
#### Scenario: Disclosure keeps DOM
- GIVEN trabajadores collapsed (13 items)
- WHEN toggling Leer más / Leer menos
- THEN `aria-expanded` flips, `is-expanded` toggles, total `<li>` stays 45

### Services Collection Migration with §6 Guard
The system MUST use `getCollection('servicios')` sorted by `order`, schema `grupo` (trabajadores|empleadores|pensionados|penal)+`abogado` (omar|franco)+zod `franco↔penal` refine. Disclosure MUST keep all `<li>` in DOM, `Leer más` per grupo (`aria-expanded`, 6 initially). Verbatim §3-§4.
#### Scenario: Guard rejects cross-attribution
- GIVEN invalid `grupo: trabajadores, abogado: franco`
- WHEN `pnpm run build`
- THEN build fails with "§6 cross-attribution"
#### Scenario: Disclosure crawlable
- GIVEN `dist/index.html` `#servicios`
- WHEN parsing `data-grupo`
- THEN all `<li>` in DOM, button `aria-expanded` toggles without removal

### Team Distinct Cards + Placeholder Discipline
`#abogados` MUST show Omar `Especialista en Derecho Laboral y Seguridad Social` and Franco `Especialista en Derecho Penal y Procesal Penal` verbatim §2, bios only, no duplication. Each MUST show chips linking to `#servicios` anchors. MUST NOT cross-attribute or invent areas.
#### Scenario: Cards decoupled
- GIVEN `#abogados`
- WHEN reading headings
- THEN both name+specialty exact, zero service description cards, chips href to `#servicios`

### WhyUs Three Domain Proof Points
The system MUST render `#why-us` as exactly 3 cards for laboral/pensional/penal (not generic). Each MUST reference verbatim services (e.g. pensional → reliquidaciones/actuariales; penal → resguardos indígenas).
#### Scenario: Three proof cards
- GIVEN `dist/index.html` `#why-us`
- WHEN counting cards
- THEN exactly 3, each mentions its domain verbatim

### Contact, Ubicación and Footer
`#contacto` MUST expose `tel:+573188215030`/`tel:+573137664683` above social, `wa.me` links, address `Cra 6 No.2-36, Ipiales - Nariño` + horario `Lunes a Viernes 8AM-6PM`. `data-map="placeholder"` MUST be removed. Footer keeps logo/recap/copyright 2026.
#### Scenario: Contact checklist
- GIVEN `dist/index.html` `#contacto`
- WHEN inspecting contacts
- THEN both `tel:` visible before social, placeholder absent, address+horario present

### Page Order and Rendering Performance
The system MUST render `index.astro` order `Hero→About→Services→Team→WhyUs→Contact` with `Services` present. `Layout` MUST preload hero `fetchpriority="high"`; offscreen SHOULD use `content-visibility: auto`.
#### Scenario: Order and preload
- GIVEN `dist/index.html` main children
- WHEN reading ids in order
- THEN sequence `inicio,nosotros,servicios,abogados,why-us,contacto` and hero preload present

### Perf/A11y/SEO Foundation
The system MUST use `astro:assets` `<Image>` for principal/logo (webp, hero eager else lazy), remove `libre-caslon-text`+`manrope`, emit JSON-LD `LegalService`+`PostalAddress`, serve `robots.txt`, keep single h1 + `focus-visible`.
#### Scenario: Artifacts valid
- GIVEN `dist/` after build
- WHEN checking webp, fonts, JSON-LD, axe
- THEN webp exists, dead fonts absent, JSON-LD valid, one h1, focus-visible

### Unified Board Implementation
The system MUST keep unified board, `data-grupo`/`data-abogado` segregation and crawlable disclosure, now via `getCollection`+`order`+§6 guard; hard-coded dup removed.
#### Scenario: Board unified after migration
- GIVEN `dist/index.html` after migration
- WHEN inspecting `#servicios`
- THEN one wrapper with 4 `data-grupo` + 2 `data-abogado`, all `<li>` in DOM

### Motion and Accessibility Guard
The system MUST animate only `transform`/`opacity` at `duration-200` ≤2px; ALL motion SHALL be wrapped in `@media (prefers-reduced-motion: reduce) { * { transition:none !important; animation:none !important } }` in `global.css`.
#### Scenario: Motion uses only transform/opacity
- GIVEN `global.css` + built CSS in `dist/`
- WHEN grepping `transition`
- THEN only `transform`/`opacity` with `200ms` and ≤2px displacement
#### Scenario: Reduced-motion disables animation
- GIVEN `global.css` contains `prefers-reduced-motion: reduce`
- WHEN emulating reduced-motion
- THEN no transition/animation runs (verifiable via grep + manual test)
