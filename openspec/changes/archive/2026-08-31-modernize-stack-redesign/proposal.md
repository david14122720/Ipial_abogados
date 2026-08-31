# Proposal: modernize-stack-redesign

## Intent

Broken UI + incomplete Lex Imperial design system block trust signal for high-stakes legal clientele. Services.astro duplicates dead code, Hero lacks primary WhatsApp CTA, Header mobile drawer is non-functional, tokens in `global.css` are partial (missing surface-container-*, outline-variant, spacing/radius/typography scales), two dead `@fontsource` packages bloat bundle, and `src/content` collections exist but are unused (content debt vs `Ipialabogados.md` §6). Stack itself is current (Astro 7.2.4, Tailwind v4, React 19) — only patch behind — so effort is tokens-first revitalization, not rewrite.

## Scope

### In Scope
- P0 fixes: dedup `Services.astro` lines 160-251, Hero dual CTA + eyebrow `label-md` uppercase, Header accessible drawer (`aria-expanded`), footer copyright 2026, remove `Welcome.astro` dead code
- `@theme` completion: surface-container-{lowest,low,high,highest}, outline-variant, spacing 4px scale (gutter 24/margin 40/section 80/container 1200), radius 0.25rem, typography display-lg/headline-lg/body-lg per `DESIGN.md`
- Stack patch: Astro 7.2.4→7.2.9, remove `libre-caslon-text` + `manrope`, keep `EB Garamond` + `Hanken Grotesk`
- Content pipeline: `src/content/servicios/*` + `getCollection('servicios')` with zod `zod` guard enforcing §6 franco↔penal cross-attribution; `abogados` collection remains verbatim §2
- Image/perf: `astro:assets` + `<Image>` for `principal.jpeg`/`logo.jpeg` (webp, lazy, `fetchpriority`), audit `inlineStylesheets: auto`
- A11y/SEO: `focus-visible`, nav semantics, h1→h2 hierarchy, JSON-LD `LegalService` + `PostalAddress`, `robots.txt` health

### Out of Scope
- CRM, DB, admin panel, auth, payments
- New service categories beyond `Ipialabogados.md` §3-§4
- Heavy animations/parallax, i18n, blog

## Capabilities

### New Capabilities
- None — revitalization of existing `landing` capability; no new domain.

### Modified Capabilities
- `landing`: refinements preserve `Ipialabogados.md` verbatim invariants (Omar groups, Franco attribution, Team identity) while adding token completeness, image perf, a11y/SEO, and collection-driven content pipeline requirements.

## Approach

Iterative tokens-first, 3 chained PRs (each ≤300 lines, auto-chain `stacked-to-main`):

- **Phase A — P0 + Tokens** (PR #1 → `main`): dedup Services, Hero fix, mobile drawer, copyright, `@theme` + `global.css` completion, Astro patch + font cleanup.
- **Phase B — Content + Perf + A11y/SEO** (PR #2 → PR #1 branch): collections migration + zod guard, `astro:assets`, `focus-visible`/`aria-expanded`, heading hierarchy, JSON-LD, `robots.txt`.
- **Phase C — Signature Refinement** (PR #3 → PR #2 branch): Lex Imperial signature (thin dividers, generous whitespace, `underline-motif`), spacing audit (40/24/80), final `astro check` + `pnpm run build` + Lighthouse spot-check.

Delivery strategy `auto-chain` already cached; stacked-to-main recommended for speed (fallback: feature-branch chain).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/Services.astro` | Modified | Remove dup block, migrate to `getCollection` |
| `src/components/Hero.astro` | Modified | Dual CTA, eyebrow, `astro:assets` bg |
| `src/components/Header.astro` | Modified | Accessible drawer |
| `src/styles/global.css` | Modified | Complete `@theme` tokens, purge dead fonts |
| `astro.config.mjs` / `package.json` | Modified | Astro bump, image config |
| `src/content/**` + `src/content.config.ts` | Modified | Collections + zod guard |
| `src/layouts/Layout.astro` | Modified | JSON-LD, floating WhatsApp |
| `public/` / `nginx.conf` / `Dockerfile` | Verified | Headers/gzip/immutable already solid |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Real bios/photos unavailable for Team | High | Keep §2 verbatim placeholders clearly marked; no invented data |
| WhatsApp number canonical drift | Med | Confirm 3188215030/3137664683; centralize in `src/consts.ts` |
| Map provider choice blocks Contact | Low | Defer embed; keep placeholder + address text |
| Token churn causes visual regression | Med | Phase A isolated; visual diff via `dist/` build check |

## Rollback Plan

Each PR is independently revertible (`git revert`). Phase A revert restores prior `global.css` + `Services.astro` via `dist/` rebuild. Phase B revert falls back to hard-coded arrays (collections additive). No DB/migration — static-only rollback is `pnpm run build` + redeploy.

## Dependencies

- `DESIGN.md` Lex Imperial (canonical tokens), `Ipialabogados.md` §3-§6 (content source), `objetivo.md` (section checklist)

## Success Criteria

- [ ] `pnpm run build` + `astro check` pass on each PR; no `libre-caslon-text`/`manrope` in bundle
- [ ] `dist/index.html` has zero dup Services block, Hero dual CTA, drawer `aria-expanded`, copyright 2026
- [ ] `@theme` covers all Lex Imperial surface/outline/spacing/radius/typography tokens
- [ ] `src/content/servicios` drives Services via `getCollection`; zod rejects cross-attribution (§6)
- [ ] Lighthouse perf/a11y ≥90, JSON-LD `LegalService` validates

## Open Questions

- Canonical photos/bios for Omar/Franco (or keep placeholder with disclosure)?
- Map embed provider (Google OSM) or address-only for Phase B?
- WhatsApp numbers confirmed as primary contacts?
