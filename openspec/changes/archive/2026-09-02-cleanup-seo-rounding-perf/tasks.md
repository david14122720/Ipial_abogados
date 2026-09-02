# Tasks: cleanup-seo-rounding-perf

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 150-180 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | single PR |
| Delivery strategy | auto-chain |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Dead code purge | PR 1 | `ls src/assets/` | N/A | `src/assets/`, `src/components/islands/ServiceExplorer.tsx` |
| 2 | Visual seam fix | PR 1 | `grep "border-b" src/components/Hero.astro` | `pnpm build` | `src/components/Hero.astro` |
| 3 | Soften radii | PR 1 | `grep "0.25rem" src/styles/global.css` | `pnpm build` | `src/styles/global.css`, `src/components/{Services,WhyUs,Contact}.astro` |
| 4 | Favicons | PR 1 | `ls public/favicon.png` | `pnpm build` | `public/favicon.*`, `src/layouts/Layout.astro` |
| 5 | WhatsApp msg | PR 1 | `grep "text=" src/consts.ts` | `pnpm build` | `src/consts.ts` |
| 6 | SEO & Sitemap | PR 1 | `grep "og:title" src/layouts/Layout.astro` | `pnpm build` | `src/layouts/Layout.astro`, `astro.config.mjs`, `public/robots.txt` |

## Phase 1: Foundation (Dead Code Purge)

- [x] 1.1 Delete dead assets: `src/assets/astro.svg`, `src/assets/background.svg`, `src/assets/logo.jpeg`, `src/assets/logo.webp`, `src/assets/principal.jpeg`, `src/assets/principal.jpg`
- [x] 1.2 Delete dead React island: `src/components/islands/ServiceExplorer.tsx`
- [x] 1.3 Uninstall dead font: `pnpm remove @fontsource/libre-caslon-text`
- [x] 1.4 Verify: `ls src/assets/` (check absence) and `pnpm build`

## Phase 2: Visual Seam & Radii

- [x] 2.1 Remove `border-b border-platinum-silver` from `src/components/Hero.astro`
- [x] 2.2 Update `--radius` (0.125rem $\rightarrow$ 0.25rem) and `--radius-lg` (0.25rem $\rightarrow$ 0.5rem) in `src/styles/global.css`
- [x] 2.3 Update `src/components/Services.astro` cards: `rounded` $\rightarrow$ `rounded-lg`
- [x] 2.4 Update `src/components/WhyUs.astro` cards: `rounded` $\rightarrow$ `rounded-lg`
- [x] 2.5 Update `src/components/Contact.astro` map: `rounded` $\rightarrow$ `rounded-lg` and CTA: `rounded-sm` $\rightarrow$ `rounded-lg`
- [x] 2.6 Verify: `grep -v "border-b" src/components/Hero.astro` and `pnpm build`

## Phase 3: Favicons & WhatsApp

- [x] 3.1 Generate `public/favicon.png` (48x48 rounded) and `public/apple-touch-icon.png` (180x180 rounded) via `sharp`
- [x] 3.2 Optimize `public/favicon.ico` to be <100KB
- [x] 3.3 Update `src/layouts/Layout.astro` with `<link>` tags for `favicon.png` (48x48) and `apple-touch-icon.png` (180x180)
- [x] 3.4 Update `src/consts.ts` `waPrimaryHref` getter to include `?text=` with encoded message: "Hola, me gustaría recibir asesoría jurídica. ¿Podemos agendar una consulta?"
- [x] 3.5 Verify: `ls public/favicon.png` and `grep "text=" src/consts.ts`

## Phase 4: SEO & Sitemap

- [x] 4.1 Add OG tags (`og:title`, `og:description`, `og:url`, `og:type`, `og:image`), Twitter cards, and `theme-color` (#08211a) to `src/layouts/Layout.astro`
- [x] 4.2 Install sitemap: `pnpm add @astrojs/sitemap`
- [x] 4.3 Add `sitemap()` integration to `astro.config.mjs`
- [x] 4.4 Update `public/robots.txt` to include `Sitemap: /sitemap.xml`
- [x] 4.5 Final Verify: `pnpm build` then check `dist/sitemap.xml` and `dist/index.html` for meta tags
