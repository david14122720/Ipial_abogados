# Proposal: Landing — Green Board Social

## Intent
4 grids saturan; página blanca/fría, header estático, sin WhatsApp/rrss. Unificar en **tablero único con "leer más"**, tint verde, header verde on-scroll y micro-animaciones. Solo presentación — `Ipialabogados.md` §3-§6 verbatim intacto.

## Scope
### In Scope
- `Services.astro`: tablero único; `data-grupo`/`data-abogado` intactos; `leer más` por grupo
- CTA WhatsApp: refuerzo `Contact.astro` + flotante (`wa.me/57...`)
- `Footer.astro`: FB/IG SVG `aria-label` `rel="noopener"`
- Tokens tint verde (`--color-surface-green` `#f2f7f5`) en `global.css`
- `Header.astro`: `bg-white/95` → `bg-[#005243]` on-scroll
- Motion: `duration-200` ≤2px, `prefers-reduced-motion`

### Out of Scope
- Taxonomía/jurídico, `Ipialabogados.md`, `content.config.ts`
- Backend/DB/forms, i18n, SEO profundo
- Hero/nav rework (propio de `ux-polish-hero-nav`) salvo color header

## Capabilities
### New Capabilities
- None
### Modified Capabilities
- `landing`: Presentación visual (tablero, tint, header scroll, CTA/rrss, motion) sin romper invariantes verbatim/segregación.

## Approach
Disclosure leve sin isla pesada. `<details>/<summary>` o CSS+JS mínimo por grupo (6 visibles). `data-grupo` preservado, DOM siempre presente. Tokens `global.css`; header `IntersectionObserver`/`scrollY>64` → `.is-scrolled`. Solo `transform`/`opacity`. WhatsApp reusa `3188215030`/`3137664683`. Alts React island y tabs descartadas (LCP/ocultación).

## Affected Areas
| Area | Impact | Description |
|------|--------|-------------|
| `src/components/Services.astro` | Modified | Tablero único + leer más |
| `src/components/Header.astro` | Modified | Scroll verde + contraste |
| `src/styles/global.css` | Modified | Tint + motion guards |
| `src/components/Contact.astro` | Modified | CTA WhatsApp |
| `src/components/Footer.astro` | Modified | FB/IG icons |
| `src/layouts/Layout.astro` | Modified | Floating WhatsApp opt. |
| `openspec/specs/landing/spec.md` | Modified | Delta visual, 5 reqs intactos |

## Risks
| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Leer más oculta SEO/a11y | High | DOM siempre presente; print expandido; `aria-expanded`; grep `dist/` |
| Verde pierde sobriedad | Med | Tint 2-4%; respeta `#005243`; 3 previews |
| Header ilegible | Med | Blanco ≥7:1; `axe` check |
| Motion molesta | Low | `duration-200` ≤2px; `reduce` desactiva |
| WhatsApp roto | Low | Reusa números reales; valida `wa.me` |
| Colisión `ux-polish-hero-nav` | Med | Rebase disjoint (color vs veil/type) |

## Rollback Plan
`git revert <commit>` restaura `bg-[#f9f9f9]`+grids. Sin migraciones. Verificar `pnpm build` + grep `data-grupo`.

## Dependencies
- `Ipialabogados.md` 224L + `landing/spec.md` 5 reqs
- `archive/2026-08-30-real-content-ipialabogados` no regressar
- `ux-polish-hero-nav` coordinar merge

## Success Criteria
- [ ] Tablero único visual; `data-grupo`/`data-abogado` presentes; leer más crawlable
- [ ] Tint verde visible; tokens en `global.css`
- [ ] Header verde al salir de hero; AA pasa
- [ ] WhatsApp `wa.me/57...` + FB/IG `aria-label` en Footer
- [ ] Motion respeta `prefers-reduced-motion`
- [ ] 5 reqs intactos; `pnpm build` + a11y≥90
