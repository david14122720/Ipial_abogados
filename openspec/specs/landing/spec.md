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
The system MUST provide sticky `#site-header` toggling `.is-scrolled` via sentinel/scrollY>64 with dark tokens (`bg-surface #08211a`, `border-outline-variant #223b31`). Header MUST be text-only wordmark `Ipial Abogados` (`text-on-surface`) + `Firma Jurídica Boutique` (`text-teal-accent-light`, uppercase `tracking-[0.18em]`) with no logo `Image`. Desktop nav MUST have 5 anchors `Inicio,Nosotros,Servicios,Abogados,Contacto`; mobile MUST be `MobileDrawer` `client:media` with `aria-expanded`/`Escape`.
#### Scenario: Servicios anchor and wordmark
- GIVEN desktop header THEN 5 anchors incl. `href="#servicios"`, active class updates, wordmark without `<img>`
#### Scenario: Drawer accessible
- GIVEN 375px drawer closed WHEN activating menu THEN `aria-expanded` false→true, Escape restores focus
#### Scenario: Header dark tokens after scroll
- GIVEN `#site-header.is-scrolled` THEN `background #08211a`, `border-color #223b31`, hover `text-teal-accent-light #4fd1ae`

### Design Tokens @theme Complete
`global.css` `@theme` MUST define `clamp()` for `headline-xl/display-lg/headline-lg/body-lg`, 1px `outline-variant` rule, Dark Forest Deep palette `forest-deep #04170f` / `surface #08211a` / `surface-container` `#0a241c`→`#1c4234` / `teal-accent #2aa88c` / `teal-accent-light #4fd1ae` / `on-surface #f0f4f2` / `on-surface-variant #b8c6c0` / `outline-variant #223b31`, `text-on-dark #eef4f1`, radii `0.125/0.25/0.5/full`, shadows `rgba(0,0,0,0.45)`, `content-visibility: auto`. Light `surface #f8f9f9` / Emerald `primary #004a38` SHALL NOT appear as surface/text tokens. All surfaces SHALL use dark hierarchy.
#### Scenario: Tokens in build
- GIVEN `global.css` + `dist/*.css`
- WHEN grepping `@theme` THEN `forest-deep #04170f`, `surface #08211a`, `teal-accent*`, `on-surface #f0f4f2`, `clamp(` and `content-visibility: auto` present
- AND no `primary #004a38` as surface token
#### Scenario: Dark shadows
- GIVEN `card-lex` hover THEN `box-shadow` uses `rgba(0,0,0,0.45)` not `rgba(0,38,27,0.10)`

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

### Dark Surface Contrast Compliance
The system MUST meet WCAG AA 4.5:1 for normal text on dark surfaces in ServiceExplorer and Footer. ServiceExplorer SHALL replace failing `text-primary` tokens; Footer SHALL replace `text-on-primary` on `forest-deep`.
#### Scenario: ServiceExplorer passes AA
- GIVEN `ServiceExplorer.tsx` GrupoCard on `bg-surface-container-low #0d2b21`
- WHEN measuring title `text-on-surface` and toggle `text-teal-accent-light`
- THEN contrast >=4.5:1 and axe reports 0 violations in `#servicios`
#### Scenario: Footer passes AA
- GIVEN `Footer.astro` with `bg-forest-deep #04170f`
- WHEN checking title `text-on-surface` and links `hover:text-teal-accent-light`
- THEN all text nodes >=4.5:1

### Perf/A11y/SEO Foundation
The system MUST use `astro:assets` `<Image>` for principal/logo (webp, hero eager else lazy), remove `libre-caslon-text`+`manrope`, emit JSON-LD `LegalService`+`PostalAddress`, serve `robots.txt`, keep single h1 + `focus-visible`.
#### Scenario: Artifacts valid
- GIVEN `dist/` after build
- WHEN checking webp, fonts, JSON-LD, axe
- THEN webp exists, dead fonts absent, JSON-LD valid, one h1, focus-visible

### Scroll Motion System
The system MUST provide scroll motion using only `transform`/`opacity`. Stagger, parallax, scale SHALL respect `prefers-reduced-motion: reduce`; parallax SHALL be disabled <768px.
#### Scenario: Staggered reveal
- GIVEN elements with `data-reveal` + `data-reveal-delay="100|200|300|400"` observed by `IntersectionObserver` threshold 0.15
- WHEN element enters viewport
- THEN `reveal`→`is-visible` animates `opacity 0→1` + `translateY(16px)→0` with `var(--reveal-delay)`
#### Scenario: Hero parallax capped 40px
- GIVEN Hero parallax target with `requestAnimationFrame` + `will-change: transform`
- WHEN scrolling >=768px THEN `translateY` ≤40px; WHEN <768px THEN no transform
#### Scenario: Team scale-in
- GIVEN `#abogados` portraits in `.team-avatar`
- WHEN revealed/hovered THEN `scale(1.03→1.0)` + `opacity` only, no layout shift
#### Scenario: Reduced-motion kills all motion
- GIVEN `prefers-reduced-motion: reduce`
- WHEN loading/scrolling THEN `data-reveal` is `is-visible` instantly, `transition:none`, parallax not attached

### Unified Board Implementation
The system MUST keep unified board, `data-grupo`/`data-abogado` segregation and crawlable disclosure, now via `getCollection`+`order`+§6 guard; hard-coded dup removed.
#### Scenario: Board unified after migration
- GIVEN `dist/index.html` after migration
- WHEN inspecting `#servicios`
- THEN one wrapper with 4 `data-grupo` + 2 `data-abogado`, all `<li>` in DOM

### Motion and Accessibility Guard
The system MUST animate only `transform`/`opacity` (`200ms` interactions, `600ms` reveal, parallax ≤40px). ALL motion SHALL be wrapped in `@media (prefers-reduced-motion: reduce) { *{transition:none!important;animation:none!important} .reveal{opacity:1!important;transform:none!important} }` and JS SHALL early-return `is-visible` when `matchMedia('(prefers-reduced-motion: reduce)').matches`.
#### Scenario: Motion uses only transform/opacity
- GIVEN `global.css` + `dist/*.css` WHEN grepping `transition` THEN only `transform`/`opacity` with `200ms`/`600ms` and parallax ≤40px
#### Scenario: Reduced-motion disables animation
- GIVEN `prefers-reduced-motion: reduce` WHEN emulated THEN no animation, parallax detached, `is-visible` set
