# Exploration: polish-content-layout-responsive

## Current State

| Area | Current | Issue |
|------|---------|-------|
| **Section order (index.astro)** | Hero → About → Services → WhyUs → Team → Contact | User wants Team BEFORE WhyUs |
| **About.astro image** | 2-col grid: `principal.webp` left + copy right | User wants image REMOVED, copy only |
| **Header subtitle** | `Firma Jurídica Boutique` (uppercase, teal, label-sm) | User wants REMOVED |
| **Header nav order** | Servicios → Quiénes somos → Abogados → Por qué → Contacto | Needs reorder to match new section order |
| **Header blur** | `backdrop-blur-md` (12px) | User wants more blur — consider `backdrop-blur-lg` |
| **Team avatars** | `w-40 h-40` (mobile) / `w-48 h-48` (desktop) | User wants LARGER |
| **Team descriptions** | Full paragraph bios per lawyer | User wants REMOVED — keep name + specialty only |
| **Typography label-sm** | `clamp(0.75rem, 1vw, 0.8125rem)` = 12px floor | Too small on mobile |
| **Typography body-md** | `clamp(1rem, 1.4vw, 1.125rem)` = 16px floor | Acceptable |
| **MobileDrawer LINKS** | Same order as desktop header | Must update to match reorder |
| **Responsiveness** | Mostly responsive, but About 2-col grid may break | Removing image simplifies this |

## Affected Areas

- `src/components/About.astro` — remove image, switch to single-column centered copy
- `src/components/Header.astro` — remove "Firma Jurídica Boutique", reorder nav links, consider stronger blur
- `src/components/Team.astro` — remove description paragraphs, increase avatar sizes
- `src/components/WhyUs.astro` — no changes needed (just moves in order)
- `src/pages/index.astro` — reorder sections: Team before WhyUs
- `src/components/islands/MobileDrawer.tsx` — reorder LINKS array to match new nav order
- `src/styles/global.css` — bump `label-sm` floor from 0.75rem to 0.8125rem

## Approaches

### Approach A: Minimal Per-Request Edits

Do exactly what the user asked, no extra polish:

1. **About.astro**: Remove the `<Image>` import, remove the image column, make the copy section full-width centered
2. **Header.astro**: Delete the `Firma Jurídica Boutique` `<span>`, reorder nav links, change `backdrop-blur-md` → `backdrop-blur-lg`
3. **Team.astro**: Remove the `<p>` description paragraph from each card, increase avatar from `w-40 h-40 md:w-48 md:h-48` → `w-48 h-48 md:w-56 md:h-56`
4. **index.astro**: Swap WhyUs and Team order
5. **MobileDrawer.tsx**: Update LINKS array order
6. **global.css**: Bump `label-sm` from `clamp(0.75rem, 1vw, 0.8125rem)` → `clamp(0.8125rem, 1.1vw, 0.875rem)`

- **Pros**: Exact match to request, minimal diff, low risk
- **Cons**: Doesn't address broader typographic scale if other sizes are also small
- **Effort**: Low (~80-120 lines changed)

### Approach B: Full Typographic + Layout Polish

Go beyond the literal request for comprehensive improvement:

1. Everything in Approach A, PLUS:
2. **global.css**: Bump entire label/body scale by ~10-15%
3. **About.astro**: Center-aligned editorial layout with larger headline
4. **Team.astro**: Full editorial card layout — larger avatars (w-56 h-56 md:w-64 md:h-64), horizontal divider
5. **Header.astro**: `backdrop-blur-xl` (24px) for stronger frosted effect
6. Responsiveness pass: verify all breakpoints

- **Pros**: More polished overall, better readability at all sizes
- **Cons**: Larger diff, more risk, might over-engineer
- **Effort**: Medium (~150-200 lines changed)

## Recommendation

**Approach A (Minimal Per-Request Edits)** — the user's request is specific and actionable. Over-polishing risks breaking the established dark-obsidian design language. The `label-sm` bump is the only "extra" that directly addresses "algunas muy pequeñas."

## Risks

- **About image removal**: `principal.webp` is also used in Hero — import removal is safe
- **Section reorder**: The openspec spec already lists Team before WhyUs — this aligns with spec
- **Header blur**: `backdrop-blur-lg` may look muddy on dark surface — test visually
- **Team avatar sizing**: 224px/256px may push cards tall on mobile — consider w-48 md:w-60 compromise
- **Label-sm bump**: Affects ALL label-sm usage globally — verify checkmarks, chips still look correct

## Skill Resolution

- `frontend-design`: ✅ Loaded
- `work-unit-commits`: ✅ Loaded
- `web-design-guidelines`: ❌ Not found at expected path

## Ready for Proposal

Yes — the request is clear, the edits are scoped, and the approach is straightforward.
