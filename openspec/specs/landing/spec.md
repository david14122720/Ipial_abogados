# Landing Page Specification

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
`global.css` `@theme` MUST retain `clamp()` for `headline-xl/display-lg/headline-lg/body-lg`, 1px `outline-variant`, Dark Forest Deep palette (`forest-deep #04170f`/`surface #08211a`/`surface-container #0a241c→#1c4234`/`teal-accent #2aa88c`/`teal-accent-light #4fd1ae`/`on-surface #f0f4f2`/`on-surface-variant #b8c6c0`/`outline-variant #223b31`, `text-on-dark #eef4f1`, radii `0.25/0.5/0.5/full`, shadows `rgba(0,0,0,0.45)`, `content-visibility: auto`). Light `surface #f8f9f9`/Emerald `primary #004a38` SHALL NOT appear. `--text-label-sm` MUST be `clamp(0.8125rem, 1vw, 0.875rem)` floor 13px; `--text-body-md` MUST stay `clamp(1rem,1.4vw,1.125rem)`. Radii MUST be `--radius-sm 0.125rem`, `--radius 0.25rem`, `--radius-lg 0.5rem`, `--radius-xl 0.5rem`, `--radius-full 0.75rem`, `--radius-pill 9999px`. `Services.astro`, `WhyUs.astro`, `Contact.astro` cards/map MUST use `rounded-lg`; `rounded-full`/`rounded-pill` avatars/FAB/pills MUST stay unchanged. Professional softness, not playful.
(Previously: `--radius 0.125rem`, `--radius-lg 0.25rem`; cards used `rounded`)

#### Scenario: Radius tokens softened
- GIVEN `global.css` + `dist/*.css`
- WHEN grepping `@theme`
- THEN `--radius: 0.25rem` and `--radius-lg: 0.5rem` present, no `0.125rem` for `--radius`

#### Scenario: Cards use rounded-lg, pills untouched
- GIVEN `Services.astro`, `WhyUs.astro`, `Contact.astro` source
- WHEN grepping `rounded`
- THEN card/map containers contain `rounded-lg`, avatars/FAB still `rounded-full`, zero `rounded-sm` on Contact CTA (now `rounded` or `rounded-lg`)

#### Scenario: Label-sm bump retained
- GIVEN `global.css`
- WHEN grepping `@theme`
- THEN `--text-label-sm: clamp(0.8125rem` present

### Requirement: Hero-About Single Divider
The system MUST render exactly one divider between `#inicio` and `#quienes-somos`. `Hero.astro` `#inicio` MUST NOT contain `border-b` nor `border-platinum-silver`; `About.astro` `#quienes-somos` MUST retain `border-t border-platinum-silver` (or `border-outline-variant`). The interface MUST NOT show a double/thick line at that seam.

#### Scenario: No double border
- GIVEN `Hero.astro` and `About.astro` source
- WHEN grepping class attributes
- THEN `Hero.astro` has zero `border-b`, `About.astro` has one `border-t`

#### Scenario: Visual seam is single line
- GIVEN `dist/index.html` after build
- WHEN counting computed borders between `#inicio` and `#quienes-somos`
- THEN exactly one 1px border exists at the junction

### Requirement: Dead Code Purge + Perf
The system MUST NOT contain `src/assets/astro.svg`, `src/assets/background.svg`, `src/assets/logo.jpeg`, `src/assets/logo.webp`, `src/assets/principal.jpeg`, `src/assets/principal.jpg`; MUST NOT contain `src/components/islands/ServiceExplorer.tsx`; MUST NOT declare `@fontsource/libre-caslon-text` in `package.json` dependencies.

#### Scenario: Dead assets absent
- GIVEN `src/assets/` after change
- WHEN listing files
- THEN none of the six dead assets exists

#### Scenario: Dead island and font removed
- GIVEN `src/components/islands/` and `package.json`
- WHEN checking filesystem and deps
- THEN `ServiceExplorer.tsx` absent and `libre-caslon-text` not in `dependencies`

### Requirement: Favicon Rounded Set
The system MUST provide `public/favicon.ico` as optimized fallback, `public/favicon.png` ~48×48 rounded with transparency, and `public/apple-touch-icon.png` 180×180 rounded. `Layout.astro` MUST link `rel="icon" href="/favicon.png" type="image/png" sizes` and `rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180"`.

#### Scenario: Rounded icons present and linked
- GIVEN `public/` and `Layout.astro` head
- WHEN inspecting files and `<link>` tags
- THEN both PNGs exist, ico <100KB, links have correct `type`/`sizes`

#### Scenario: No stale ico-only reference
- GIVEN `dist/index.html`
- WHEN parsing head
- THEN no `apple-touch-icon` pointing to `.ico`

### Requirement: WhatsApp Default Message
`src/consts.ts` `CONTACT.waPrimaryHref` MUST return `https://wa.me/<number>?text=<encodeURIComponent(message)>` where message is `Hola, me gustaría recibir asesoría jurídica. ¿Podemos agendar una consulta?` or semantically equivalent. FAB in `Layout.astro` and CTA in `Contact.astro` MUST use `CONTACT.waPrimaryHref`.

#### Scenario: Href includes encoded text
- GIVEN `src/consts.ts`
- WHEN reading `waPrimaryHref` getter
- THEN value contains `?text=` and `encodeURIComponent`

#### Scenario: CTAs use canonical href
- GIVEN `dist/index.html` FAB and `#contacto` CTA
- WHEN reading `href`
- THEN both contain `wa.me/573188215030?text=`

### Requirement: SEO Social + Sitemap
`Layout.astro` MUST emit `og:title`, `og:description`, `og:url`, `og:type`, `og:image` (if asset exists), `twitter:card`, `theme-color`, and `<link rel="canonical" href>` matching `SITE.canonical`. `astro.config.mjs` MUST integrate `@astrojs/sitemap` generating `dist/sitemap.xml`; `public/robots.txt` MUST contain `Allow: /` and reference sitemap; JSON-LD `LegalService` MUST be retained.

#### Scenario: Social meta present
- GIVEN `dist/index.html` head
- WHEN parsing meta
- THEN all og/twitter/theme-color/canonical tags present with non-empty content

#### Scenario: Sitemap generated
- GIVEN `pnpm run build`
- WHEN checking `dist/sitemap.xml` and `dist/robots.txt`
- THEN sitemap exists with `<url><loc>`, robots contains `Allow: /`


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
