# Delta for landing

## MODIFIED Requirements

### Requirement: Design Tokens @theme Complete
The system MUST define Emerald `@theme` in `global.css`: `primary #004a38`, `emerald-deep #14634d`, `surface-tint #1e6a54`, `silver-metallic #A8ADB0`, `slate-charcoal #2C3333`, `whatsapp-green #25D366`, `facebook-blue #1877F2`, radii `0.125/0.25/0.5/full`, `headline-xl 48/56 700 Libre Caslon`, `gutter 24/section-gap 80/container 1200`, `card-lex` `rounded-lg border silver shadow-sm` hover `rgba(20,99,77,0.08)`. Legacy `forest-deep/teal-accent/platinum` MUST shim; CSS MUST match Stitch `8756458185519766468`.
(Previously: Imperial #00261b, md 0.375)

#### Scenario: Tokens
- GIVEN `global.css` + `dist/*.css`
- WHEN grepping vs `DESIGN.md`
- THEN #004a38/#14634d/#A8ADB0/#25D366, headline-xl 700, radii 0.125/0.25/0.5, card shadow-sm present

### Requirement: Hero Dual CTA + Eyebrow + Optimized Background
The system MUST render `#inicio` cover `principal.webp` `astro:assets` `cover center` webp eager `fetchpriority="high"` + `rgba(0,0,0,0.5)` overlay, centered `h-32 w-32 rounded-full shadow-sm` logo + h1 `headline-xl` white "Autoridad, Precisión y Legado" + `body-lg` white `max-w-2xl`, ≥1 CTA `wa.me/573188215030` `bg-emerald-deep` (dual MAY keep secondary `#servicios`), sentinel retained, AA ≥4.5:1.
(Previously: watermark 0.07 + eyebrow + display-lg "Ipial_abogados: Excelencia...")

#### Scenario: Hero
- GIVEN `#inicio`
- WHEN inspecting
- THEN one h1 headline-xl white + circular icon + overlay + wa.me CTA

### Requirement: Header Sticky with Accessible Drawer
The system MUST provide `#site-header` `bg-surface/80 backdrop-blur-md shadow-sm border-b outline-variant` with sentinel `IntersectionObserver` `is-scrolled` Emerald variant. Nav MUST be 5 anchors `Inicio/Nosotros/Abogados/Servicios/Contacto` (`Inicio` active `border-b-2 primary`), `md:flex`. Mobile MUST keep `aria-expanded`/`aria-controls`, overlay, `Escape`, `focus-visible` emerald-deep, ≥4.5:1.
(Previously: bg-surface/95 no blur/shadow/order guarantee)

#### Scenario: Drawer
- GIVEN 375px closed
- WHEN toggle then Escape
- THEN aria-expanded toggles, overlay visible, Escape closes

### Requirement: Services Collection Migration with §6 Guard
The system MUST keep `getCollection('servicios')` `order` sorted, `grupo` trabajadores|empleadores|pensionados|penal + `abogado` omar|franco + `franco↔penal` refine; cards `bg-surface-container-low p-6 rounded-lg border outline-variant` `headline-md primary` hover `0 10px 30px rgba(20,99,77,0.08)`. All `<li>` MUST stay in DOM; `grupo-extra` `Leer más` `aria-expanded` (6 initially). Verbatim §3-§4.
(Previously: transparent board)

#### Scenario: Guard
- GIVEN invalid combo
- WHEN `pnpm run build`
- THEN fails "§6 cross-attribution"; `<li>` remain crawlable

### Requirement: Team Distinct Cards + Placeholder Discipline
`#abogados` MUST show Omar "Laboral y Seguridad Social" and Franco "Penal y Procesal Penal" verbatim §2, `w-64 h-64 rounded-full shadow-md` avatars, `headline-md` + `body-md primary`, WhatsApp pill `bg-whatsapp-green rounded-full` to `wa.me` from `CONTACT`, standalone hybrid, no invented years.
(Previously: w-32 rounded-sm no pill)

#### Scenario: Team
- GIVEN `#abogados`
- WHEN reading
- THEN exact names + rounded-full w-64 + pills

### Requirement: Contact, Ubicación and Footer
`#contacto` MUST be `bg-surface-container-lowest lg:grid-cols-2 gap-12`: `h-96 rounded-lg border` map `data-map="placeholder"` + "Conéctate" `headline-md` + Facebook #1877F2 + Instagram gradient `label-sm`. Contacts tel/email/Cra 6/horario from `consts.ts` MUST remain. Footer `bg-surface-container-highest border-t silver-metallic md:grid-cols-3 px-gutter max-w-container-max` col1 ©2026 col2 FB/IG/Maps col3 Privacidad/Términos.
(Previously: flex-col footer no rounded map)

#### Scenario: Contact/footer
- GIVEN `dist/index.html`
- WHEN inspecting
- THEN h-96 rounded-lg + social buttons + 3-col silver footer

### Requirement: Perf/A11y/SEO Foundation
The system MUST use `astro:assets` webp eager/lazy, Libre Caslon 700 + Hanken + Symbols `aria-hidden`, `focus-visible emerald-deep`, `prefers-reduced-motion` last + only `transform/opacity 200ms ≤2px`, single h1, JSON-LD, `robots.txt`, AA, Lighthouse ≥95.
(Previously: EB Garamond only)

#### Scenario: Artifacts
- GIVEN `dist/` after build
- WHEN checking
- THEN webp, 700+Symbols, one h1, focus emerald-deep, ≥95

## ADDED Requirements

### Requirement: WhyUs Four-Card Authority Grid
The system MUST render `#why-us` `bg-surface-container-low` `headline-lg primary max-w-3xl` + 4 cards `grid 1→2→4` `bg-surface-container-lowest p-6 rounded-lg border shadow-sm text-center gap-4` `material-symbols-outlined 4xl emerald-deep aria-hidden` (balance/forum/handshake/verified_user) `headline-md primary` + `body-md on-surface-variant`.

#### Scenario: Four cards
- GIVEN `#why-us`
- WHEN counting
- THEN 4 rounded-lg shadow-sm text-center with 4 Symbols

### Requirement: About Centered Editorial
The system MUST render `#about` `py-section-gap px-gutter bg-surface max-w-3xl mx-auto text-center` `headline-lg primary` + `body-lg on-surface-variant` single column, no image.
(Previously: 2-col with image)

#### Scenario: About
- GIVEN `#about`
- WHEN measuring
- THEN max-w-3xl centered, no grid

## REMOVED Requirements

### Requirement: Unified Board Implementation
(Reason: subsumed by Services Collection Migration) (Migration: reference Services Collection Migration)

## RENAMED Requirements

### Requirement: Hero Dual CTA + Eyebrow + Optimized Background → Hero Cover with Authority Headline
(Reason: Stitch cover+overlay+circular+headline-xl) (Migration: update refs)

### Requirement: Design Tokens @theme Complete → Lex Emerald Design Tokens @theme
(Reason: Imperial→Emerald) (Migration: DESIGN.md)
