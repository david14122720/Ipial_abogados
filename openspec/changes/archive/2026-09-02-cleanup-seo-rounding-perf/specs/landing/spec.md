# Delta for landing

## ADDED Requirements

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

## MODIFIED Requirements

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
