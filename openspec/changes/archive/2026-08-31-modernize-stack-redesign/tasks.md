# Tasks: modernize-stack-redesign

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~750-900 (total) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR-A → PR-B → PR-C |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | P0 Fixes & Tokens | PR-A | `pnpm run build` | Visual check: Hero CTA, Drawer, tokens | `global.css`, `Hero.astro`, `Header.astro` |
| 2 | Content Pipeline & A11y | PR-B | `pnpm run build` | `astro check`, verify zod §6 failure | `src/content/**`, `src/content.config.ts` |
| 3 | Signature & Polish | PR-C | `lighthouse` | Lighthouse ≥90, whitespace audit | `global.css` (spacing), component margins |

## Phase 1: PR-A — P0 Fixes & Foundation (Foundation)
*Focus: UI debt, tokens, and stack patching.*

- [x] 1.1 **Astro Patch**: Bump Astro `7.2.4` $\rightarrow$ `7.2.9` and remove `libre-caslon-text` + `manrope` from `package.json`.
- [x] 1.2 **Token Completion**: Update `src/styles/global.css` with complete Lex Imperial `@theme`:
    - Surface scale: `lowest` (#fff) $\rightarrow$ `highest` (#e1e3e3).
    - `outline-variant` (#c0c8c3).
    - Spacing 4px scale (24/40/80/1200).
    - Radii (0.125 $\rightarrow$ 0.5rem).
    - Typography: `display-lg` (48/56), `headline-lg` (32/40), `body-lg` (18/28), `label-md` (14/20).
- [x] 1.3 **Hero P0**: Modify `src/components/Hero.astro`:
    - Add uppercase `label-md` eyebrow.
    - Implement dual CTA: primary `wa.me/573188215030`, secondary `#servicios`.
    - Ensure sole `h1` with `display-lg`.
- [x] 1.4 **Header P0**: Modify `src/components/Header.astro`:
    - Implement vanilla Astro mobile drawer with `aria-expanded` and `aria-controls`.
    - Wire sentinel `IntersectionObserver` in `#inicio` to toggle `.is-scrolled`.
- [x] 1.5 **Cleanup**:
    - Delete `src/components/Welcome.astro`.
    - Update `src/components/Footer.astro` copyright to 2026.
    - Dedup `src/components/Services.astro` (remove lines 160-251).
- [x] 1.6 **Verify A**: `pnpm run build` + `astro check`. Grep `dist/index.html` for `aria-expanded` and copyright.

## Phase 2: PR-B — Content Pipeline, Perf & A11y (Core)
*Focus: Data migration, assets, and semantic structure.*

- [x] 2.1 **Content Schema**: Modify `src/content.config.ts`:
    - Define `servicios` collection with zod schema (`grupo`, `abogado`, `order`).
    - Implement `refine` guard for §6 cross-attribution (`franco` $\leftrightarrow$ `penal`).
- [x] 2.2 **Content Migration**: Create `src/content/servicios/*.md` files for the 4 groups verbatim from `Ipialabogados.md` §3-§4.
- [x] 2.3 **Services Migration**: Update `src/components/Services.astro` to use `getCollection('servicios')` sorted by `order`. Retain `data-grupo`/`data-abogado` and crawlable disclosure.
- [x] 2.4 **Image Optimization**:
    - Migrate `principal.jpeg` and `logo.jpeg` to `src/assets/`.
    - Use `astro:assets` `<Image>` in `Hero.astro` (eager, `fetchpriority="high"`) and `Footer.astro`.
- [x] 2.5 **A11y & SEO**:
    - Update `src/layouts/Layout.astro`: add `focus-visible` styles, implement JSON-LD `LegalService` + `PostalAddress`.
    - Fix heading hierarchy (h1 $\rightarrow$ h2) across components.
    - Verify `public/robots.txt` health.
- [x] 2.6 **Verify B**: `pnpm run build` (ensure zod rejects invalid cross-attribution) + Lighthouse A11y check.

## Phase 3: PR-C — Signature Refinement & Polish (Integration)
*Focus: Visual identity, spacing, and final verification.*

- [x] 3.1 **Signature Elements**: Update `src/styles/global.css` and components:
    - Implement 1px Platinum silver dividers.
    - Add `underline-motif` to section headings.
    - Apply generous whitespace audit (margins 40px, gutters 24px, sections 80px).
- [x] 3.2 **Layout Polish**:
    - Enforce 12-column grid (max 1200px).
    - Refine card styling in `Services.astro` and `Team.astro` using `surface-container-*` tokens.
- [x] 3.3 **Team Refinement**: Update `src/components/Team.astro` with distinct cards for Omar and Franco; ensure no invented bios (use disclosed placeholders).
- [x] 3.4 **Contact Finalization**: Update `src/components/Contact.astro` with confirmed `tel:`/`wa.me` and `data-map="placeholder"`.
- [x] 3.5 **Final Audit**:
    - `pnpm run build` + `astro check`.
    - Lighthouse Performance & A11y $\ge 90$.
    - Final visual diff against `DESIGN.md`.
