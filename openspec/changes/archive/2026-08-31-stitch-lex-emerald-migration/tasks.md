# Tasks: stitch-lex-emerald-migration

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 700-800 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Shell) $\rightarrow$ PR 2 (Sections) $\rightarrow$ PR 3 (Polish) |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Shell & Foundation | PR 1 | `pnpm run build && grep "#004a38" dist/*.css` | Header nav & FAB pill | `global.css`, `DESIGN.md`, `Layout`, `Header` |
| 2 | Core Content Sections | PR 2 | `pnpm run build` + Contrast Audit | Hero overlay & Section layouts | Component files in PR 2 |
| 3 | Polish, Contact & A11y | PR 3 | `pnpm run build && npx lighthouse` | Contact map & Footer 3-col | Component files in PR 3 |

## Phase 1: Shell & Foundation (PR-1)

- [x] 1.1 Add `@fontsource/libre-caslon-text` and `@fontsource/material-symbols-outlined` to `package.json`
- [x] 1.2 Update `DESIGN.md` frontmatter with Emerald tokens (`#004a38`, `#14634d`, `#A8ADB0`, `#25D366`)
- [x] 1.3 Replace `@theme` in `src/styles/global.css` with Emerald values and add legacy shims (`--color-forest-deep`, etc.)
- [x] 1.4 Define `.card-lex` with `rounded-lg border silver shadow-sm` and hover state in `src/styles/global.css`
- [x] 1.5 Update `src/layouts/Layout.astro` with body tokens and `bg-whatsapp-green` FAB pill styling
- [x] 1.6 Restyle `src/components/Header.astro` with `bg-surface/80 backdrop-blur-md shadow-sm` and 5-anchor nav
- [x] 1.7 Verify: `pnpm run build` passes and `dist/*.css` contains Emerald hex codes

## Phase 2: Core Implementation (PR-2)

- [x] 2.1 Implement `src/components/Hero.astro` with `principal.webp` cover, overlay, and `headline-xl` white text
- [x] 2.2 Refactor `src/components/About.astro` to centered editorial layout (`max-w-3xl`, remove 2-col grid)
- [x] 2.3 Implement `src/components/WhyUs.astro` with 4-card authority grid and Material Symbols
- [x] 2.4 Update `src/components/Team.astro` with `rounded-full w-64` avatars and `bg-whatsapp-green` pills
- [x] 2.5 Restyle `src/components/Services.astro` cards using `.card-lex` and preserve disclosure logic
- [x] 2.6 Verify: Visual check at 375/768/1200px and AA contrast audit for Hero overlay

## Phase 3: Finishing & Verification (PR-3)

- [x] 3.1 Implement `src/components/Contact.astro` with `bg-surface-container-lowest`, rounded map, and social buttons
- [x] 3.2 Implement `src/components/Footer.astro` with 3-column layout and `silver-metallic` border
- [x] 3.3 Apply global polish: `focus-visible` `emerald-deep` and `.chip`/`.underline-motif` styling
- [x] 3.4 Run `pnpm run build` and `npx astro check` to ensure no build regressions
- [x] 3.5 Run Lighthouse audit to verify Performance/A11y/SEO score $\ge 95$
- [x] 3.6 Verify: Drawer `aria-expanded`/`Escape` functionality and `prefers-reduced-motion` compliance
