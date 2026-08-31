# Proposal: Real Content — Ipialabogados.md as Single Source

## Intent

Landing shows invented services (Civil/Familia etc.) and generic bios. Replace verbatim from `Ipialabogados.md` (225 lines, single authorized source) to restore legal accuracy before visual polish.

## Scope

### In Scope
- Rewrite `Services.astro` (5 generic → Omar: trabajadores/empleadores/pensionados §3 + Franco penal §4)
- Fix `Team.astro`: exact names + specialties verbatim (Omar: Laboral y Seguridad Social; Franco: Penal y Procesal Penal)
- Update `src/content.config.ts` + `src/content/servicios/*`, `src/content/abogados/*` to source taxonomy
- Commit `Ipialabogados.md` (now `??`) as canonical source; document in spec

### Out of Scope
- Hero, nav, scrollspy, drawer, veil, fluid type, hover — owned by `ux-polish-hero-nav`
- Contact/location data, SEO, i18n, rebrand, ViewTransitions
- Backend, DB, form persistence

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `landing`: Enforce Ipialabogados.md fidelity — segregated groups, exact specialties, no invented/cross-attributed services.

## Approach

`Ipialabogados.md` → Astro content + components. Map §3.1/3.2/3.3 to 3 grouped sub-sections (Omar) + §4 to 1 section (Franco). Cards/accordions per §6. 1:1 transcription, no paraphrase expansion. Collections validate taxonomy; `pnpm run build` gates.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `Ipialabogados.md` | Modified | Commit untracked file; mark as source of truth |
| `src/components/Services.astro` | Modified | Rewrite from 5 generic → grouped real services |
| `src/components/Team.astro` | Modified | Exact names/specialties, remove invented bios |
| `src/content.config.ts` | Modified | Schema aligned to segregated groups |
| `src/content/servicios/*`, `src/content/abogados/*` | Modified | Real markdown content |
| `README.md` / `openspec/specs/landing` | Modified | Document source rule |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Mixing Omar/Franco services | High | Enforce §6 invariant; spec scenario per attorney |
| Inventing or paraphrasing beyond scope | High | Verbatim transcription + review against §3–4 checklist |
| Untracked source lost/forgotten | Med | Commit + add to spec Dependencies |
| Collision with `ux-polish-hero-nav` | Med | Rebase; this touches content only, that touches hero/nav |

## Rollback Plan

`git revert <commit>` restores previous Services/Team. No migrations. Verify with `pnpm run build`.

## Dependencies

- `Ipialabogados.md` committed (now `??`)
- `ux-polish-hero-nav` — coordinate merge (same `landing` spec, disjoint files: content vs hero/nav)

## Success Criteria

- [ ] Services groups = §3.1/3.2/3.3 + §4; no Civil/Familia remnants
- [ ] Team shows both full names + exact specialties verbatim
- [ ] No invented/cross-attributed services; 3 groups remain segregated
- [ ] `Ipialabogados.md` tracked + referenced as source
- [ ] `pnpm run build` passes
