# Proposal: cleanup-seo-rounding-perf

## Intent

Address visual artifacts (double borders), remove dead code/assets to improve performance, soften the "hard" UI radii for a more professional yet approachable feel, and implement critical SEO/Social metadata and conversion optimizations.

## Scope

### In Scope
- **Visual Fix**: Remove redundant `border-b` from `Hero.astro` to fix double-line artifact with `About.astro`.
- **Dead Code/Asset Cleanup**: Delete 6 unused assets in `src/assets/`, remove dead `ServiceExplorer.tsx` island, and uninstall `@fontsource/libre-caslon-text`.
- **Radii Softening**: Bump `--radius` (0.125rem $\rightarrow$ 0.25rem) and `--radius-lg` (0.25rem $\rightarrow$ 0.5rem). Update Services, WhyUs, and Contact components to use `rounded-lg`.
- **Favicon Optimization**: Replace massive 370k `favicon.ico` with optimized rounded `favicon.png` and `apple-touch-icon.png`.
- **Conversion**: Update `CONTACT.waPrimaryHref` in `consts.ts` to include a default `?text=` encoded message.
- **SEO**: Add OG tags, Twitter cards, and `theme-color` to `Layout.astro`. Integrate `@astrojs/sitemap`.

### Out of Scope
- Database changes, Framer Motion integration, new content creation, or changes to `Forest Deep` palette.
- Refactoring `MobileDrawer` (remains a React island).

## Capabilities

### Modified Capabilities
- `landing`: Updated visual tokens (radii), SEO metadata, and conversion links.

## Approach

Surgical, minimal-risk implementation split into 6 independent work units (~180 lines total). Single PR.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/Hero.astro` | Modified | Remove `border-b` |
| `src/assets/` | Removed | 6 dead assets deleted |
| `src/components/islands/ServiceExplorer.tsx` | Removed | Dead React component deleted |
| `package.json` | Modified | Remove dead font dep; add `@astrojs/sitemap` |
| `src/styles/global.css` | Modified | Update `--radius` and `--radius-lg` tokens |
| `src/components/{Services,WhyUs,Contact}.astro` | Modified | Update `rounded` $\rightarrow$ `rounded-lg` |
| `public/` | New/Mod | Optimized rounded favicons, `sitemap.xml` |
| `src/layouts/Layout.astro` | Modified | Update favicon links, add OG/Twitter tags |
| `src/consts.ts` | Modified | Update `waPrimaryHref` with default message |
| `astro.config.mjs` | Modified | Add sitemap integration |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Favicon Alpha | Low | Verify rounded PNGs have clean transparency |
| OG Content | Med | Use placeholder image until final social asset is provided |
| Radii Regression | Low | Visual QA across all card components |
| Canonical URL | Med | Use `SITE.canonical` constant; verify final domain |

## Rollback Plan

Single `git revert` of the merge commit.

## Dependencies

- Astro 7.2.9, Tailwind 4, React 19, `@astrojs/sitemap`.

## Success Criteria

- [ ] Double border between Hero and About is gone.
- [ ] Dead assets and `ServiceExplorer.tsx` are deleted.
- [ ] Rounded favicon variants present and linked.
- [ ] Radii are visibly softer (0.25rem/0.5rem).
- [ ] WhatsApp link opens with default message.
- [ ] OG tags, Twitter cards, and sitemap are present in build.
- [ ] Project builds without errors.
