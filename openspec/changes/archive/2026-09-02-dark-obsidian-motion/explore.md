# Exploration: Dark Obsidian Motion

## Status: Ready for Proposal

---

## Current State

### What Exists (Dirty, Uncommitted)
The working tree has a **substantial partial dark theme migration** — not a stub:

1. **global.css**: Full Material Design 3 dark surface hierarchy with `@theme` tokens. Base `#04170f` (forest deep), surface `#08211a`, elevated surfaces up to `#1c4234`. Teal accent brightened to `#2aa88c` / `#4fd1ae`. Fixed light tokens `text-on-dark` / `text-on-dark-soft` for hero/overlays. All hover shadows darkened from `rgba(0,38,27,0.10)` to `rgba(0,0,0,0.45)`.

2. **All 7 components updated**: `text-forest-deep` → `text-on-surface`, `bg-white` → `bg-surface`, `border-platinum-silver` → `border-outline-variant`, `text-teal-accent` → `text-teal-accent-light` in headers/specialties. Logo removed from Header → text-only "Ipial Abogados" + "Firma Jurídica Boutique".

3. **Build passes**: `pnpm run build` succeeds in ~2.1s, no errors.

4. **Motion system exists**: `data-reveal` attributes on sections + `IntersectionObserver` script in `Layout.astro` + `.reveal` CSS classes with `opacity/transform` transitions. `prefers-reduced-motion: reduce` guard present at end of global.css.

5. **DESIGN.md deleted** — was 187-line design reference, removed in this dirty state.

### What's Missing or Broken

| Issue | Severity | Detail |
|-------|----------|--------|
| **ServiceExplorer dark tokens** | HIGH | `GrupoCard` uses `text-primary` (#0d3b2c) on `bg-surface-container-low` (#0d2b21) — contrast ratio ~1.4:1, FAILS WCAG AA. Buttons use `bg-primary text-white` which works but borders use `border-platinum-silver` (#8fa3a0) instead of `border-outline-variant`. |
| **No scroll motion** | MEDIUM | User specifically asked "anima un poquito el recorrido de la pagina al bajar". The reveal system exists but only fires once per element. No parallax, no staggered section entry, no subtle scroll-linked effects. |
| **Footer uses `on-primary`** | LOW | Footer uses `text-on-primary` (#03150e) which is near-black on `bg-forest-deep` (#04170f) — extremely low contrast (~1.1:1). Should use `text-on-surface` or `text-platinum-silver`. |
| **Hero image opacity too low** | LOW | `opacity-40` + `grayscale` + dark overlay may make the office photo feel empty rather than atmospheric. Consider `opacity-50` or `opacity-45`. |
| **Missing openspec change dir** | NONE | `openspec/changes/dark-obsidian-motion/` didn't exist — now created. |
| **No motion design doc** | MEDIUM | No specification for what "subtle scroll motion" means in this context. Need to define motion vocabulary. |

### A11y Contrast Audit

| Pair | Ratio | WCAG AA | Status |
|------|-------|---------|--------|
| on-surface (#f0f4f2) on surface (#08211a) | ~14.5:1 | 4.5:1 | ✅ Pass |
| charcoal-text (#dfe4e1) on surface (#08211a) | ~12.8:1 | 4.5:1 | ✅ Pass |
| on-surface-variant (#b8c6c0) on surface (#08211a) | ~8.2:1 | 4.5:1 | ✅ Pass |
| teal-accent (#2aa88c) on surface (#08211a) | ~4.3:1 | 3:1 (large) | ⚠️ Border-only |
| teal-accent-light (#4fd1ae) on surface (#08211a) | ~7.8:1 | 4.5:1 | ✅ Pass |
| **text-primary (#0d3b2c) on surface-container-low (#0d2b21)** | **~1.4:1** | 4.5:1 | ❌ FAIL |
| on-primary (#03150e) on forest-deep (#04170f) | ~1.1:1 | 4.5:1 | ❌ FAIL |
| text-on-dark (#eef4f1) on forest-deep (#04170f) | ~13.2:1 | 4.5:1 | ✅ Pass |

**Critical**: ServiceExplorer's `text-primary` and Footer's `on-primary` are the two blocking a11y failures.

---

## Affected Areas

- `src/styles/global.css` — token fixes, motion CSS additions, potential Hero gradient tuning
- `src/components/islands/ServiceExplorer.tsx` — fix dark token usage (HIGH priority)
- `src/components/Footer.astro` — fix `on-primary` → proper dark token
- `src/layouts/Layout.astro` — enhance reveal script or add scroll motion JS
- `src/components/Hero.astro` — possible opacity adjustment
- `DESIGN.md` — needs recreation for dark theme documentation

---

## Approaches

### Approach A: Finish Dirty Dark + Add Subtle Scroll Motion

Complete the existing migration, fix a11y failures, and add lightweight scroll motion.

- **Pros**: Builds on ~90% complete work, minimal new code, preserves existing patterns
- **Cons**: Design doc (DESIGN.md) needs recreation, motion vocabulary undefined
- **Effort**: Low-Medium (~150 lines changed)

**Motion spec for this approach**:
- Section entry: existing `data-reveal` system with stagger delays (already in place)
- Hero: subtle parallax via CSS `transform: translateY()` on scroll — max 40px displacement, opacity transition 0→1
- Cards: stagger entry with 100ms increments via `data-reveal-delay` (already in place)
- All motion: `transform`/`opacity` only, `prefers-reduced-motion` guard (already in place)
- NO JavaScript scroll listeners beyond existing IntersectionObserver — use CSS `scroll-timeline` or lightweight vanilla JS

### Approach B: Full Obsidian Design System + Motion

Recreate DESIGN.md with comprehensive dark design system, add motion vocabulary, possibly add a new React island for scroll-linked parallax.

- **Pros**: Complete documentation, professional design system artifact
- **Cons**: Higher effort, DESIGN.md deletion was intentional (user may not want it back), motion island adds JS bundle
- **Effort**: Medium-High (~300+ lines)

### Approach C: Lightweight Dark-Only Without Motion

Just fix the a11y failures and ship the dark theme without any scroll motion additions.

- **Pros**: Fastest, minimal risk, addresses user's primary pain point (eye strain)
- **Cons**: Ignores user's explicit request for scroll animation, feels incomplete
- **Effort**: Low (~50 lines)

---

## Recommendation

**Approach A** — Finish the dirty dark + add subtle scroll motion.

Rationale:
1. The existing dark token work is solid and 90% complete. The two a11y failures (ServiceExplorer, Footer) are quick fixes.
2. The user explicitly asked for scroll animation — skipping it would feel incomplete.
3. The reveal system already exists and works. Enhancing it (stagger, hero parallax, smooth section transitions) requires minimal new code.
4. The frontend-design skill says: "Leverage motion deliberately... an orchestrated moment usually lands harder than scattered effects."
5. Keep it to transform/opacity only, no layout thrashing, no JS framework overhead — pure CSS + minimal vanilla JS.

**Recommended motion vocabulary**:
- Hero: parallax (translateY on scroll, max 40px, opacity 0.4→0.6)
- Section headings: existing reveal with stagger
- Service cards: stagger entry (already in place via data-reveal-delay)
- WhyUs cards: stagger entry (already in place)
- Team portraits: scale-in (1.03→1.0 on reveal)
- Contact form: slide-in from right
- All: `prefers-reduced-motion: reduce` kills everything instantly (already in CSS)

---

## Risks

1. **Scroll motion performance**: Parallax on scroll can cause jank on low-end devices. Mitigate: use `will-change: transform` on parallax elements, keep displacement under 40px, use `requestAnimationFrame` throttle.
2. **Hero parallax on mobile**: May feel disorienting on small screens. Mitigate: disable parallax below 768px via media query.
3. **ServiceExplorer tokens**: The `text-primary` on dark background is a critical a11y blocker. Must fix before any deployment.
4. **Footer contrast**: `on-primary` on forest-deep is nearly invisible. Quick fix but important.
5. **DESIGN.md deletion**: If recreated, must reflect dark theme, not the old light Emerald system. Consider making it lighter — token reference only, not full spec.
6. **openspec spec drift**: The existing `openspec/specs/landing/spec.md` references `primary #004a38` (Emerald) — needs update for dark theme tokens.

---

## Skill Resolution

| Skill | Status | Notes |
|-------|--------|-------|
| frontend-design | ✅ Loaded | Informed motion vocabulary and restraint principles |
| web-design-guidelines | ❌ Not found | Path didn't exist at `.claude/skills/` — proceed without |
| vercel-react-best-practices | ❌ Not found | Path didn't exist at `.config/opencode/skills/` — proceed without |
| work-unit-commits | ✅ Loaded | Guides commit splitting for the changes below |

---

## Artifacts

- `openspec/changes/dark-obsidian-motion/explore.md` — this file
- Engram topic: `sdd/dark-obsidian-motion/explore`

---

## Next Recommended

1. **sdd-propose** — Create change proposal with Approach A scope
2. **sdd-spec** — Write delta spec for dark theme completion + motion vocabulary
3. **sdd-design** — Technical design for ServiceExplorer token fix + scroll motion implementation
4. **sdd-tasks** — Break into work units following work-unit-commits guidelines

Estimated task breakdown for implementation:
- Task 1: Fix ServiceExplorer dark tokens (a11y critical)
- Task 2: Fix Footer dark tokens
- Task 3: Enhance reveal system with stagger + hero parallax
- Task 4: Recreate DESIGN.md for dark theme (optional, lightweight)
- Task 5: Update openspec/specs/landing/spec.md for dark tokens
