# Delta for landing

## ADDED Requirements

### Requirement: Dark Surface Contrast Compliance

The system MUST meet WCAG AA 4.5:1 for normal text on dark surfaces in ServiceExplorer and Footer. ServiceExplorer SHALL replace failing `text-primary` tokens; Footer SHALL replace `text-on-primary` on `forest-deep`.

| Component | Before FAIL | After PASS | Ratio |
|-----------|-------------|------------|-------|
| GrupoCard title | `text-primary #0d3b2c` on `surface-container-low #0d2b21` | `text-on-surface #f0f4f2` | 14.5:1 |
| GrupoCard border | `border-platinum-silver #8fa3a0` | `border-outline-variant #223b31` | — |
| Toggle button | `text-primary` | `text-teal-accent-light #4fd1ae` | 7.8:1 |
| Inactive tab | `border-platinum-silver` | `border-outline-variant` + `text-on-surface-variant #b8c6c0` on `surface-container-lowest #0a241c` | 8.2:1 |
| Footer title | `text-on-primary #03150e` on `forest-deep #04170f` | `text-on-surface #f0f4f2` | 13.2:1 |

#### Scenario: ServiceExplorer passes AA
- GIVEN `ServiceExplorer.tsx` GrupoCard on `bg-surface-container-low #0d2b21`
- WHEN measuring title `text-on-surface` and toggle `text-teal-accent-light`
- THEN contrast >=4.5:1 and axe reports 0 violations in `#servicios`

#### Scenario: Footer passes AA
- GIVEN `Footer.astro` with `bg-forest-deep #04170f`
- WHEN checking title `text-on-surface` and links `hover:text-teal-accent-light`
- THEN all text nodes >=4.5:1

### Requirement: Scroll Motion System

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

## MODIFIED Requirements

### Requirement: Design Tokens @theme Complete

`global.css` `@theme` MUST define `clamp()` for `headline-xl/display-lg/headline-lg/body-lg`, 1px `outline-variant` rule, Dark Forest Deep palette `forest-deep #04170f` / `surface #08211a` / `surface-container` `#0a241c`→`#1c4234` / `teal-accent #2aa88c` / `teal-accent-light #4fd1ae` / `on-surface #f0f4f2` / `on-surface-variant #b8c6c0` / `outline-variant #223b31`, `text-on-dark #eef4f1`, radii `0.125/0.25/0.5/full`, shadows `rgba(0,0,0,0.45)`, `content-visibility: auto`. Light `surface #f8f9f9` / Emerald `primary #004a38` SHALL NOT appear as surface/text tokens. All surfaces SHALL use dark hierarchy.
(Previously: Emerald `#004a38`/`#A8ADB0` on `surface #f8f9f9`, `rgba(0,38,27,0.10)` shadows)

#### Scenario: Tokens in build
- GIVEN `global.css` + `dist/*.css`
- WHEN grepping `@theme` THEN `forest-deep #04170f`, `surface #08211a`, `teal-accent*`, `on-surface #f0f4f2`, `clamp(` and `content-visibility: auto` present
- AND no `primary #004a38` as surface token

#### Scenario: Dark shadows
- GIVEN `card-lex` hover THEN `box-shadow` uses `rgba(0,0,0,0.45)` not `rgba(0,38,27,0.10)`

### Requirement: Motion and Accessibility Guard

The system MUST animate only `transform`/`opacity` (`200ms` interactions, `600ms` reveal, parallax ≤40px). ALL motion SHALL be wrapped in `@media (prefers-reduced-motion: reduce) { *{transition:none!important;animation:none!important} .reveal{opacity:1!important;transform:none!important} }` and JS SHALL early-return `is-visible` when `matchMedia('(prefers-reduced-motion: reduce)').matches`.
(Previously: only `200ms` ≤2px generic guard without stagger/parallax/scale vocabulary)

#### Scenario: Motion uses only transform/opacity
- GIVEN `global.css` + `dist/*.css` WHEN grepping `transition` THEN only `transform`/`opacity` with `200ms`/`600ms` and parallax ≤40px

#### Scenario: Reduced-motion disables animation
- GIVEN `prefers-reduced-motion: reduce` WHEN emulated THEN no animation, parallax detached, `is-visible` set

### Requirement: Header Sticky with Accessible Drawer

The system MUST provide sticky `#site-header` toggling `.is-scrolled` via sentinel/scrollY>64 with dark tokens (`bg-surface #08211a`, `border-outline-variant #223b31`). Header MUST be text-only wordmark `Ipial Abogados` (`text-on-surface`) + `Firma Jurídica Boutique` (`text-teal-accent-light`, uppercase `tracking-[0.18em]`) with no logo `Image`. Desktop nav MUST have 5 anchors `Inicio,Nosotros,Servicios,Abogados,Contacto`; mobile MUST be `MobileDrawer` `client:media` with `aria-expanded`/`Escape`.
(Previously: logo `Image` from `assets/logo.webp` via `astro:assets`; light `text-forest-deep` tokens)

#### Scenario: Servicios anchor and wordmark
- GIVEN desktop header THEN 5 anchors incl. `href="#servicios"`, active class updates, wordmark without `<img>`

#### Scenario: Drawer accessible
- GIVEN 375px drawer closed WHEN activating menu THEN `aria-expanded` false→true, Escape restores focus

#### Scenario: Header dark tokens after scroll
- GIVEN `#site-header.is-scrolled` THEN `background #08211a`, `border-color #223b31`, hover `text-teal-accent-light #4fd1ae`
