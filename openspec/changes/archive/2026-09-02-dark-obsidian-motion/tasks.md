# Tasks: Dark Obsidian Motion

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~150 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Low

## Phase 1: A11y Fixes (Contrast Compliance)

- [x] 1.1 Update `src/components/islands/ServiceExplorer.tsx`: Replace `text-primary` with `text-on-surface` for titles and `border-platinum-silver` with `border-outline-variant` for borders.
- [x] 1.2 Update `src/components/islands/ServiceExplorer.tsx`: Replace `text-primary` with `text-teal-accent-light` for the "Leer más" toggle.
- [x] 1.3 Update `src/components/islands/ServiceExplorer.tsx`: Set inactive tabs to `bg-surface-container-lowest`, `text-on-surface-variant`, and `border-outline-variant`.
- [x] 1.4 Update `src/components/Footer.astro`: Replace `text-on-primary` with `text-on-surface` for title, `hover:on-primary` with `hover:text-teal-accent-light`, and update year to 2026.
- [x] 1.5 Verify A11y: Run `axe` check on `#servicios` and `footer` $\to$ all text nodes $\ge$ 4.5:1.

## Phase 2: Motion Implementation (Disciplined Reveal & Parallax)

- [x] 2.1 Update `src/styles/global.css`: Add `.hero-parallax-target { will-change: transform }` and a media query to set `transform: none !important` for widths $< 768\text{px}$.
- [x] 2.2 Update `src/layouts/Layout.astro`: Implement vanilla JS parallax IIFE using `requestAnimationFrame`, `scrollY * 0.15` clamped to $40\text{px}$, with early returns for `prefers-reduced-motion` and mobile.
- [x] 2.3 Update `src/components/Hero.astro`: Change image opacity from `opacity-40` to `opacity-50` and add the `hero-parallax-target` class.
- [x] 2.4 Verify Motion: Scroll $\ge 768\text{px}$ and measure `translateY \le 40\text{px}$; emulate `prefers-reduced-motion: reduce` $\to$ verify animations are disabled.

## Phase 3: Docs & Verification

- [x] 3.1 Create `DESIGN.md`: Write lightweight frontmatter token reference including Forest Deep palette, radii, shadows, and motion constraints.
- [x] 3.2 Update `openspec/specs/landing/spec.md`: Sync token references from Light Emerald to Dark Obsidian.
- [x] 3.3 Verify Build: Run `pnpm run build` $\to$ 0 errors.
- [x] 3.4 Verify Tokens: `grep -R "forest-deep\|clamp\|content-visibility" dist/` to confirm theme assets are present.
