# Delta for landing

## ADDED Requirements

### Requirement: About Single-Column Editorial
The system MUST render `#quienes-somos` as `max-w-3xl mx-auto text-center` without image. It MUST NOT import `principal.webp` nor render image column/grid. Headline MUST be `font-headline-lg text-headline-lg text-on-surface [text-wrap:balance]`; body MUST be `font-body-md text-body-md text-charcoal-text [text-wrap:pretty]`; checklist MUST remain. Verbatim "Quiénes somos" copy (boutique, two partners) SHALL be preserved.

#### Scenario: Centered without image
- GIVEN `About.astro` and `dist/index.html#quienes-somos`
- WHEN inspected
- THEN no `import principal`/`<Image>`, container `max-w-3xl mx-auto text-center`, headline `text-on-surface` present

#### Scenario: Mobile 320 and reduced-motion
- GIVEN 320px or `prefers-reduced-motion: reduce`
- WHEN rendering/revealing About
- THEN no overflow, `text-wrap:pretty` holds, `data-reveal` is `is-visible` instantly with no transform

## MODIFIED Requirements

### Requirement: Header Sticky with Accessible Drawer
The system MUST provide sticky `#site-header` `sticky top-0 z-50` with `bg-surface/90 backdrop-blur-lg` and `border-outline-variant`, toggling `.is-scrolled` via sentinel/scrollY>64 (`bg-surface #08211a`, `border-outline-variant #223b31`). Header MUST be text-only wordmark `Ipial Abogados` (`text-on-surface text-headline-md tracking-tight`, no Image) and MUST NOT render `Firma Jurídica Boutique` subtitle (Previously: subtitle `text-teal-accent-light tracking-[0.18em] uppercase` present; blur was `md`). Desktop nav MUST have 6 anchors in order `Inicio→Quiénes somos→Abogados→Servicios→Por qué elegirnos→Contacto` (`#inicio,#quienes-somos,#abogados,#servicios,#porque-elegirnos,#contacto`) (Previously: 5 anchors `Inicio,Nosotros,Servicios,Abogados,Contacto` with Servicios first). Mobile MUST be `MobileDrawer` `client:media` with `aria-expanded`/`Escape` and identical `LINKS` order.

#### Scenario: Wordmark and blur
- GIVEN `#site-header`
- WHEN inspected
- THEN `Ipial Abogados` `text-on-surface` only, no subtitle span, class `backdrop-blur-lg`, `sticky top-0`

#### Scenario: Nav order matches DOM
- GIVEN header nav and `MobileDrawer.tsx` LINKS
- WHEN reading hrefs
- THEN sequence `#inicio,#quienes-somos,#abogados,#servicios,#porque-elegirnos,#contacto` and `aria-expanded` false→true, Escape restores focus

#### Scenario: Scrolled tokens
- GIVEN `#site-header.is-scrolled`
- WHEN computed
- THEN `background #08211a`, `border #223b31`, hover `text-teal-accent-light #4fd1ae`

### Requirement: Design Tokens @theme Complete
`global.css` `@theme` MUST retain `clamp()` for `headline-xl/display-lg/headline-lg/body-lg`, 1px `outline-variant`, Dark Forest Deep palette (`forest-deep #04170f`/`surface #08211a`/`surface-container #0a241c→#1c4234`/`teal-accent #2aa88c`/`teal-accent-light #4fd1ae`/`on-surface #f0f4f2`/`on-surface-variant #b8c6c0`/`outline-variant #223b31`, `text-on-dark #eef4f1`, radii `0.125/0.25/0.5/full`, shadows `rgba(0,0,0,0.45)`, `content-visibility: auto`). Light `surface #f8f9f9`/Emerald `primary #004a38` SHALL NOT appear. `--text-label-sm` MUST be `clamp(0.8125rem, 1vw, 0.875rem)` floor 13px (Previously: `clamp(0.75rem, 1vw, 0.8125rem)` floor 12px); `--text-body-md` MUST stay `clamp(1rem,1.4vw,1.125rem)`.
(Previously: label-sm floor 0.75rem)

#### Scenario: Label-sm bump
- GIVEN `global.css` + `dist/*.css`
- WHEN grepping `@theme`
- THEN `--text-label-sm: clamp(0.8125rem` present, no `clamp(0.75rem` for label-sm, `clamp(` and `text-on-dark` retained

#### Scenario: Mobile readability 320
- GIVEN 320px viewport
- WHEN rendering any `label-sm`
- THEN computed ≥13px, no clipping, ≥4.5:1 on dark retained

### Requirement: Team Distinct Cards + Placeholder Discipline
`#abogados` MUST show Omar `Especialista en Derecho Laboral y Seguridad Social` and Franco `Especialista en Derecho Penal y Procesal Penal` verbatim §2, with only `h3` name (`text-headline-md text-on-surface`) + `p` specialty (`text-label-md text-teal-accent-light uppercase`) and avatar `rounded-full overflow-hidden w-48 h-48 md:w-56 md:h-56 border-4` (Previously: `w-40 h-40 md:w-48 md:h-48` with bios). It MUST NOT render bio `<p class="text-body-md text-secondary">`. Grid MUST be `grid-cols-1 md:grid-cols-2`. Chips to `#servicios` MAY remain; MUST NOT cross-attribute.
(Previously: bios present, avatars w-40/md:w-48)

#### Scenario: Minimal cards
- GIVEN `#abogados` in `dist/index.html`
- WHEN inspected
- THEN 2 cards, avatars `w-48 h-48 md:w-56 md:h-56 rounded-full`, name+specialty exact, zero bio `p`

#### Scenario: Responsive grid
- GIVEN 320px then 768px
- WHEN measuring grid
- THEN 1 col at 320px, 2 cols at ≥768px, avatars in viewport, reduced-motion `scale` disabled via `prefers-reduced-motion`

### Requirement: Page Order and Rendering Performance
The system MUST render `index.astro` with `#abogados` before `#porque-elegirnos`. Order `Hero→About→Team→Services→WhyUs→Contact` (`#inicio→#quienes-somos→#abogados→#servicios→#porque-elegirnos→#contacto`); alternative `Hero→About→Services→Team→WhyUs→Contact` satisfies iff Team before WhyUs (Previously: `inicio,nosotros,servicios,abogados,why-us,contacto` with Services before Team, ambiguous WhyUs/Team). `MobileDrawer` LINKS MUST equal header order and match DOM. `Services` MUST remain. `Layout` MUST preload hero `fetchpriority="high"`; offscreen SHOULD use `content-visibility: auto`.

#### Scenario: Team before WhyUs
- GIVEN `dist/index.html` main children
- WHEN reading ids
- THEN `indexOf(#abogados) < indexOf(#porque-elegirnos)` and hero preload present

#### Scenario: Nav matches sections
- GIVEN header nav + `MobileDrawer` LINKS vs `index.astro` sections
- WHEN compared
- THEN both list 6 hrefs in order `Inicio,Quiénes somos,Abogados,Servicios,Por qué elegirnos,Contacto` and each href has matching section id
