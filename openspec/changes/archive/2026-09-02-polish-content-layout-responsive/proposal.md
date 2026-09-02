# Proposal: polish-content-layout-responsive

## Intent

Perform targeted visual and structural polish to improve readability and information architecture. The change addresses specific user feedback regarding typography size on mobile, removes redundant branding/imagery, and aligns the section order with the intended professional flow.

## Scope

### In Scope
- Remove `principal.webp` image from `About.astro` and center copy.
- Remove "Firma Jurídica Boutique" subtitle from `Header.astro`.
- Increase Header menu blur (`backdrop-blur-md` $\rightarrow$ `lg`).
- Reorder navigation in `Header.astro` and `MobileDrawer.tsx` to match section order.
- Increase Team avatar sizes (`w-40/48` $\rightarrow$ `w-48/56`) and remove bio paragraphs.
- Reorder sections in `index.astro`: Team before WhyUs.
- Bump `label-sm` floor from 12px (0.75rem) to 13px (0.8125rem) in `global.css`.

### Out of Scope
- Database modifications.
- New content invention.
- Addition of Framer Motion.
- Changes to Forest Deep color tokens or `astro:assets` formats.
- Modification of verbatim content arrays.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `landing`: Visual polish and information architecture reordering.

## Approach

Minimal per-request edits targeting approximately 100 lines:
1. **About**: Remove image import/column; center-align copy.
2. **Header**: Delete subtitle span; update blur to `lg`; reorder nav links (Inicio $\rightarrow$ Quiénes somos $\rightarrow$ Abogados $\rightarrow$ Servicios $\rightarrow$ Por qué $\rightarrow$ Contacto).
3. **Team**: Update avatar classes to `w-48 h-48 md:w-56 md:h-56`; remove description `<p>` tags.
4. **Index**: Swap `WhyUs` and `Team` component order.
5. **MobileDrawer**: Update `LINKS` array to match new navigation order.
6. **Global CSS**: Update `--text-label-sm` clamp floor to `0.8125rem`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/About.astro` | Modified | Image removed, layout centered |
| `src/components/Header.astro` | Modified | Subtitle removed, blur increased, nav reordered |
| `src/components/Team.astro` | Modified | Avatars enlarged, bios removed |
| `src/pages/index.astro` | Modified | Component order swapped |
| `src/components/islands/MobileDrawer.tsx` | Modified | Links array reordered |
| `src/styles/global.css` | Modified | `label-sm` size bumped |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Header blur looks muddy on dark surface | Low | Visual verification; fallback to `md` if needed |
| Avatars too tall on small mobile | Low | Verify height against viewport; adjust to `w-40` if intrusive |
| `label-sm` bump affects chips/checkmarks | Low | Global audit of `label-sm` usage during verification |

## Rollback Plan

Perform `git revert` of the specific implementation commits.

## Dependencies

- Astro 7.2.9
- Tailwind 4
- React 19

## Success Criteria

- [ ] `About.astro` is single-column and centered without the image.
- [ ] Header lacks subtitle and uses `backdrop-blur-lg`.
- [ ] Navigation order (Desktop & Mobile) matches: Inicio $\rightarrow$ Quiénes somos $\rightarrow$ Abogados $\rightarrow$ Servicios $\rightarrow$ Por qué $\rightarrow$ Contacto.
- [ ] Team section appears before WhyUs in the DOM.
- [ ] Team avatars are visibly larger and bios are gone.
- [ ] `label-sm` text is $\ge 13\text{px}$ on mobile.
