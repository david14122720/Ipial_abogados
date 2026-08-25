# Proposal: UX Polish — Hero, Navigation & Hover System

## Intent

Hero 7% invisible, type jumps 32→48px, nav active stale, hamburger dead, hover static. Deliver: 0.14 veil+scrim, fluid `clamp()` type, underline + card lift, IO scrollspy, drawer.

## Scope

### In Scope
- Hero veil 0.07→0.14 + gradient scrim
- Fluid type `clamp()` in `global.css` + `text-balance`
- Hover: `::after scaleX` underline, `hover:-translate-y-1` + shadow, `focus-visible`, `prefers-reduced-motion`
- `NavSpy.tsx` IO scrollspy (`aria-current`)
- `MobileMenu.tsx` drawer (`client:media`, Esc/trap/overlay)
- Fix WhyUs `id`, hero `pt-32`/`min-h` + `px-6` for 320/375/428px

### Out of Scope
- `astro:assets` responsive images
- ViewTransitions / Framer Motion / parallax
- Content or `content.config.ts`
- Rebrand, i18n, SEO

## Capabilities

### New Capabilities
- `landing`: Landing page (hero, type, hover, scrollspy, drawer). No spec; creates baseline.

### Modified Capabilities
- None

## Approach

Balanced islands — 95% static, ~10kB JS (exploration §2).

- Type: `--text-hero: clamp(1.9rem,5.2vw,3.25rem)` in `global.css` → Hero.
- Veil: `<img>` cover `opacity-[0.14]` + gradient `from-[#f9f9f9]/10 to-[#f9f9f9]` 85%, cap 0.12–0.16.
- Scrollspy: `rootMargin "-80px 0px -55% 0px"`, `threshold [0,0.5,1]`, dynamic `header.clientHeight` + ResizeObserver; SSR fallback.
- Drawer: `client:media="(max-width:768px)"`, `aria-expanded`, trap, close on anchor/overlay/Esc.
- Hover: `duration-200`, ≤2px lift.
- Phasing: 3 PRs — (1) veil+type, (2) islands, (3) polish.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/Hero.astro` | Modified | Veil 0.14+scrim, clamp type |
| `src/components/Header.astro` | Modified | Underline, island slots |
| `src/styles/global.css` | Modified | Fluid tokens, motion guards |
| `src/layouts/Layout.astro` | Modified | Preload hero |
| `src/components/NavSpy.tsx` | New | IO scrollspy |
| `src/components/MobileMenu.tsx` | New | Drawer island |
| `src/components/Services.astro`, `Team.astro`, `WhyUs.astro` | Modified | Card lift |
| `src/pages/index.astro` | Modified | Island slots, WhyUs id |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Veil >0.18 fails WCAG AA | Med | Cap 0.14 + scrim; axe check |
| clamp overflow 320px | Med | balance + QA 320/375/428 |
| Animations too flashy | Low | duration-200, ≤2px |
| IO offset drift | Med | clientHeight + ResizeObserver |
| CLS from islands | Low | SSR fallback; client:media |

## Rollback Plan

Revert 3 PRs reverse (3→1); removal restores static `.astro`. No migrations. Check `npm run build`.

## Dependencies

None. Uses Astro 7.2.4, Tailwind v4.3.3, React 19 islands (installed).

## Success Criteria

- [ ] Hero visible 0.14+scrim; axe contrast passes
- [ ] H1 `clamp()` no overflow 320/375/428
- [ ] Nav underline + IO active (`aria-current`)
- [ ] Drawer works (hamburger/overlay/Esc/trap); no desktop JS
- [ ] Cards hover lift + shadow; reduced-motion disables
- [ ] Build passes; no LCP/CLS regression
