# Delta for landing

## ADDED Requirements

### Requirement: Unified Services Board with Progressive Disclosure
The system MUST render one visually unified tinted board for `#servicios` while preserving `data-grupo="trabajadores|empleadores|pensionados"` and `data-abogado="omar|franco"`. Arrays in `Services.astro` SHALL stay verbatim Ipialabogados.md §3-§4. All `<li>` MUST remain in DOM (CSS collapse or `<details>`, no removal). Each Omar group MUST expose "Leer más" with `aria-expanded`/`aria-controls`, 6 visible initially.

#### Scenario: Board unified but segregated
- GIVEN `pnpm run build` done
- WHEN inspecting `#servicios` in `dist/index.html`
- THEN one tinted wrapper holds 4 `data-grupo` blocks + 2 `data-abogado` containers with correct headings

#### Scenario: Leer más crawlable + accessible
- GIVEN `dist/index.html`
- WHEN parsing any `data-grupo` toggle
- THEN all verbatim `<li>` exist in DOM, button has `aria-expanded="false"` + `aria-controls`, expanding flips to `true` without DOM removal

### Requirement: WhatsApp CTA
The system MUST expose `https://wa.me/573188215030` and `https://wa.me/573137664683` (3188215030 / 3137664683) in `#contacto` primary button and optional floating button in `Layout.astro` (fixed bottom-right). Links MUST use `target="_blank"` `rel="noopener noreferrer"` and `aria-label`.

#### Scenario: Contact WhatsApp links present
- GIVEN `dist/index.html`
- WHEN grepping `wa.me/573188215030` and `wa.me/573137664683`
- THEN both exist inside `#contacto` with `target="_blank"` and `rel` containing `noopener`

#### Scenario: Floating button accessible
- GIVEN `dist/index.html`
- WHEN locating floating WhatsApp anchor
- THEN it has `aria-label` WhatsApp, SVG, `wa.me` href and `noopener`

### Requirement: Social Icons in Footer
The system MUST render Facebook + Instagram inline SVGs in `Footer.astro` with `aria-label="Facebook"`/`"Instagram"`, `rel="noopener noreferrer"`, `aria-hidden="true"` on SVG, and configurable placeholder `href` (`#` or external URL).

#### Scenario: Footer icons accessible
- GIVEN `dist/index.html`
- WHEN inspecting `footer`
- THEN two anchors with `aria-label` Facebook/Instagram each contain `<svg>` and `rel` includes `noopener`

#### Scenario: Placeholder hrefs not broken
- GIVEN `Footer.astro` source
- WHEN reading social anchor `href`
- THEN placeholder is `#` or valid URL, axe reports no empty-link violation

### Requirement: Soft Green Surface Tint
The system MUST define `--color-surface-green: #f2f7f5` (2-4% green over `#f9f9f9`) in `src/styles/global.css` `@theme` and apply to `#servicios` background. Primary `#005243` MUST stay unchanged; sobriety MUST be preserved.

#### Scenario: Tint token applied
- GIVEN `global.css` + `dist/index.html`
- WHEN grepping `--color-surface-green` / `#f2f7f5`
- THEN token in `@theme` and `#servicios` bg is tint not pure `#f9f9f9`

#### Scenario: Sobriety preserved
- GIVEN built page rendered
- WHEN visual check vs `#005243` palette
- THEN tint is subtle (2-4%), no saturated green, elegant aesthetic retained

### Requirement: Green Header On-Scroll
The system MUST transition `Header.astro` from `bg-white/95` in hero to `bg-[#005243]` with `.is-scrolled` when hero sentinel exits (`IntersectionObserver` or `scrollY>64`). Text MUST switch to white with AA contrast ≥4.5:1 (target 7:1).

#### Scenario: Header turns green after hero
- GIVEN page at `/#inicio` with sentinel
- WHEN scrolling past hero / mocking `scrollY>64`
- THEN `header` gains `.is-scrolled` + `bg-[#005243]`, grep finds `IntersectionObserver` or `scrollY` + `is-scrolled`

#### Scenario: Contrast AA passes
- GIVEN header in `.is-scrolled`
- WHEN running `axe` color-contrast
- THEN no violation for header links (≥4.5:1)

### Requirement: Subtle Motion with Reduced-Motion Guard
The system MUST animate only `transform`/`opacity` at `duration-200` ≤2px; ALL motion SHALL be wrapped in `@media (prefers-reduced-motion: reduce) { * { transition:none !important; animation:none !important } }` in `global.css`.

#### Scenario: Motion uses only transform/opacity
- GIVEN `global.css` + built CSS in `dist/`
- WHEN grepping `transition`
- THEN only `transform`/`opacity` with `200ms` and ≤2px displacement

#### Scenario: Reduced-motion disables animation
- GIVEN `global.css` contains `prefers-reduced-motion: reduce`
- WHEN emulating reduced-motion
- THEN no transition/animation runs (verifiable via grep + manual test)
