# Proposal: ipial-ux-overhaul — Premium Legal Authority Overhaul

## Intent

Trabajadores/empleadores/pensionados + penal users decide trust in <60s. Services hidden (`Services.astro` absent from `index.astro`), Team↔Services coupled, hero fixed-px zero CTAs → generic template, broken WhatsApp conversion. Restore editorial authority + conversion proximity, verbatim §6.

## Scope

### In Scope
- `Hero` — editorial, fluid `clamp()`, dual CTA (`wa.me`+`#servicios`), proof line, sentinel decouple
- `About` — 2–3 sentences + divider + location
- `Services` — canonical + `ServiceExplorer` island (`client:visible`, grupo tabs, disclosure, per-grupo CTA)
- `Team` — bios only verbatim §2 + chips → Services anchors
- `WhyUs` — 3 proof points (laboral/pensional/penal)
- `Contact` — `tel:` prominence, drop placeholder map, horario/address
- `Header` — Servicios anchor + observer, `MobileDrawer` (`client:media`)
- `global.css`/`Layout` — fluid `@theme` tokens, dossier rule, `content-visibility`, hero preload
- `index.astro` — Hero→About→Services→Team→WhyUs→Contact

### Out of Scope
- `content.config.ts`/`servicios`/`abogados`; `consts.ts` CONTACT/SITE; routes `/servicios/[grupo]`; invented areas/cross-attribution; DESIGN.md frozen

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `landing`: hero/fluid, services island, team decoupled, WhyUs/contact/header/tokens — delta spec required

## Approach

Approach B (Editorial + islands) + A restraint. Static-first, ≤2 islands, dynamic imports, memoized rows.

**Auto-chain 3 slices (<400 LOC):**
1. **Tokens+Services+Team (atomic)** — `clamp()`+rule; add Services to index; strip Team. Fixes #1 blocker.
2. **Hero+About+Header** — editorial hero + `fetchpriority`, About tighten, Header anchor/observer.
3. **WhyUs+Contact+polish** — 3 cards, tel/map, `content-visibility`, motion audit.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/index.astro` | Modified | Add Services, reorder |
| `src/components/Hero.astro` | Modified | Editorial + fluid + CTA |
| `src/components/Services.astro` | Modified | Canonical + island |
| `src/components/Team.astro` | Modified | Bios/chips only |
| `src/components/WhyUs.astro` | Modified | 3 proof points |
| `src/components/Contact.astro` | Modified | tel/map/horario |
| `src/components/Header.astro` | Modified | Anchor + observer |
| `src/styles/global.css` | Modified | Fluid tokens + rule |
| `src/layouts/Layout.astro` | Modified | Preload |
| `src/components/islands/*` | New | `ServiceExplorer`, `MobileDrawer` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Team/Services atomic breakage | High | Slice 1 together + build check |
| Bundle bloat (>45kb) | Med | Dynamic import, no barrel, `client:visible` |
| §6 fidelity violation | Med | Verbatim audit §3–§4 in spec |
| Motion overreach | Low | `transform`/`opacity` 200ms ≤2px + reduced-motion |

## Rollback Plan

Each slice `git revert` on its PR. Slice 1 restores Team+index (no worse than HEAD). Slices 2/3 revert markup. No schema to unwind. Chain retargets via rebase.

## Dependencies

- `stitch-lex-emerald-migration` DONE; `Ipialabogados.md` §2–§6 frozen; Astro 7.2.9 + Tailwind v4 + React 19

## Success Criteria

- [ ] Build passes; 45 items verbatim §3–§4 in DOM (`data-grupo`, disclosure keeps `<li>`)
- [ ] Hero: `wa.me/573188215030`+`#servicios`, `clamp()`, proof line, single h1, Lighthouse ≥95
- [ ] Team verbatim §2 no dup lists; WhyUs = 3 domain-tied points
- [ ] Contact: `tel:` + address/horario; placeholder removed or lazy embed
- [ ] Motion only `transform`/`opacity` 200ms ≤2px; respects `prefers-reduced-motion`
