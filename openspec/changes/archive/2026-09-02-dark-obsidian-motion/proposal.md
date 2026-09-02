# Proposal: Dark Obsidian Motion

## Intent

Transition the landing page to a high-end "Forest Deep" dark theme (#04170f base, #08211a surface) to reduce eye strain and establish a more sophisticated, boutique legal identity. This includes finalizing the existing partial migration, fixing critical accessibility (a11y) contrast failures, and introducing a subtle, disciplined scroll-triggered motion system.

## Scope

### In Scope
- **Token Finalization**: Fix `ServiceExplorer` (contrast ratio ~1.4:1) and `Footer` (contrast ratio ~1.1:1) a11y blockers.
- **Motion Implementation**: Enhance the reveal system with staggered entry, Hero parallax (max 40px displacement), and scale-in effects for team portraits.
- **Technical Constraints**: Transform/opacity only; mandatory `prefers-reduced-motion` guard.
- **Documentation**: Lightweight recreation of `DESIGN.md` for dark theme tokens; update `openspec/specs/landing/spec.md`.
- **Deliverable**: Single PR (<400 lines), split into 3 work units.

### Out of Scope
- Database or CRM modifications.
- External animation libraries (e.g., Framer Motion).
- Heavy parallax or layout-shifting animations.
- Content creation or invention.

## Capabilities

### New Capabilities
- `landing-scroll-motion`: Subtle, performance-optimized scroll reveals and hero parallax.

### Modified Capabilities
- `landing-visual-identity`: Shift from Light Emerald to Dark Obsidian theme tokens.

## Approach

Follow **Approach A** from exploration: Finish the "dirty" dark migration and layer in disciplined motion.
1. **A11y First**: Correct `text-primary` in `ServiceExplorer` and `on-primary` in `Footer`.
2. **Motion Layer**: Leverage existing `IntersectionObserver` in `Layout.astro` to trigger staggered CSS transitions. Add a lightweight vanilla JS scroll listener for Hero parallax (disabled on mobile <768px).
3. **Doc Sync**: Update `DESIGN.md` and landing specs to reflect the new palette.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modified | Token fixes, motion CSS, and parallax definitions |
| `src/components/islands/ServiceExplorer.tsx` | Modified | Fix high-severity a11y contrast blockers |
| `src/components/Footer.astro` | Modified | Fix low-contrast text tokens |
| `src/layouts/Layout.astro` | Modified | Enhance reveal script for stagger and hero parallax |
| `src/components/Hero.astro` | Modified | Opacity adjustment and parallax target classes |
| `openspec/specs/landing/spec.md` | Modified | Update token references to Dark Obsidian |
| `DESIGN.md` | New | Recreate as a lightweight token reference |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Scroll jank | Low | Use `will-change: transform` and `requestAnimationFrame` |
| Mobile disorientation | Medium | Disable parallax effects below 768px |
| Contrast regression | Low | Final WCAG AA check using computed styles |

## Rollback Plan

1. `git revert <commit-hash>`
2. `pnpm run build` to verify state recovery.

## Dependencies

- Astro 7.2.9
- Tailwind v4
- React 19

## Success Criteria

- [ ] `ServiceExplorer` and `Footer` pass WCAG AA contrast (min 4.5:1).
- [ ] Hero parallax and staggered reveals active without layout shift.
- [ ] `prefers-reduced-motion: reduce` disables all animations.
- [ ] `pnpm run build` passes without errors.
- [ ] `DESIGN.md` reflects current dark palette.
