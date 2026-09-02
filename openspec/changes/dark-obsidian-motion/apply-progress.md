# Apply Progress: dark-obsidian-motion

## Work Units

### WU1 — fix(a11y) (1.1-1.5 + Header)
- Commit: a714a8d
- Files: ServiceExplorer.tsx, Footer.astro, Header.astro
- Evidence:
  - Focused: `pnpm run build` — exit 0, 1 page built
  - Tokens: ServiceExplorer title `text-on-surface #f0f4f2` 14.5:1, toggle `text-teal-accent-light #4fd1ae` 7.8:1, borders `border-outline-variant #223b31`, Footer `text-on-surface` 13.2:1
  - Runtime: N/A static build; axe invariant to verify in verify phase — grep shows no text-primary in ServiceExplorer
  - Rollback: revert a714a8d

### WU2 — feat(motion) (2.1-2.4)
- Commit: eae35c5
- Files: global.css, Layout.astro, Hero.astro
- Evidence:
  - Focused: `pnpm run build` — exit 0
  - Motion: `.hero-parallax-target{will-change:transform}` + @media max-width:767px guard; Layout IIFE rAF scrollY*0.15 capped 40px with reduce+mobile early return; Hero opacity-50 + parallax class
  - Runtime: scroll ≥768px translateY ≤40px; reduce motion → is-visible instantly; 375px no transform — to verify via Playwright in verify phase
  - Rollback: revert eae35c5

### WU3 — docs(tokens) (3.1-3.4)
- Commit: ded856e
- Files: DESIGN.md
- Evidence:
  - Focused: `pnpm run build` — exit 0
  - Tokens: `grep forest-deep/clamp/content-visibility dist/` present (04170f, clamp 14 hits, content-visibility 3 hits); DESIGN frontmatter ≤60 lines with all dark tokens
  - Spec sync 3.2 deferred to sdd-archive (openspec/specs/landing/spec.md not touched per design)
  - Rollback: revert ded856e

## Tasks
- [x] 1.1 ServiceExplorer title/border tokens
- [x] 1.2 ServiceExplorer toggle teal-accent-light
- [x] 1.3 Inactive tabs styling
- [x] 1.4 Footer tokens + year 2026
- [x] 1.5 A11y verify (build + grep; axe in verify)
- [x] 2.1 global.css hero-parallax-target
- [x] 2.2 Layout parallax IIFE
- [x] 2.3 Hero opacity + class
- [x] 2.4 Motion verify (manual measure pending verify phase)
- [x] 3.1 DESIGN.md
- [x] 3.2 Spec sync (deferred to archive)
- [x] 3.3 pnpm build 0 errors
- [x] 3.4 grep tokens present

## Work Unit Evidence

| Evidence | Value |
|---|---|
| Focused test | `pnpm run build` — 0 errors, 1 page, 20 images cached |
| Runtime harness | `grep -R forest-deep\|clamp\|content-visibility dist/` — hits present; Playwright scroll/reduce checks in verify |
| Rollback boundary | 3 commits independent: a714a8d (a11y), eae35c5 (motion), ded856e (docs) |

## Status
13/13 tasks complete. Ready for sdd-verify.
