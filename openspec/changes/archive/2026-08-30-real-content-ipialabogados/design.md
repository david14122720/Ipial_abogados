# Design: Real Content — Ipialabogados.md as Single Source

## Technical Approach

Replace 5 invented categories with verbatim `Ipialabogados.md` §3/§4. Static Astro: typed `as const` arrays in `Services.astro` → `ul>li` card grids (no JS island) + verbatim `Team.astro` fix. Commit `Ipialabogados.md` (225 lines) as canonical source; `content.config.ts` strict enums gate taxonomy; `pnpm build` + `grep` enforces §6. No hero/nav — disjoint from `ux-polish-hero-nav`.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice |
|---|---|---|---|
| Services grouping | 5 cards / tabs / accordions / static groups | Tabs/accordions hide content behind JS; generic cards violate §6 | **Static groups**: `#servicios` → Omar 3 (`Para trabajadores`/`empleadores`/`pensionados`) + Franco `Servicios de Derecho Penal`; all visible no JS |
| Rendering | single grid / per-group grid / plain ul | Single grid loses segregation; plain ul weak | **Per-group card grid**: `ul grid-cols-1 sm:grid-cols-2 gap-3`; `li bg-white border border-[#bec9c4]/30 rounded-lg p-4 border-l-2 border-l-[#005243]` |
| Content source | `getCollection()` vs hard-coded arrays | Collections need 40+ md files, drift risk | **Hard-coded arrays in Services.astro** with `// §3.1` trace; single-file audit. Collections only as taxonomy guard |
| Team fix | collections vs hard-coded | Overkill for 2 fixed cards | **Hard-coded 2 cards** verbatim §2; remove generic `Abogado Especialista` + bios |
| Schema | `z.string()` vs enum | Loose allows `Derecho Civil` re-entry | **Strict enums**: `grupo`/`abogado`/`specialty` + refine `franco↔penal`; build fails on invented |
| Traceability | README vs code vs both | README invisible in review | **Both**: `// Fuente: Ipialabogados.md §X` + `README` canonical line |
| A11y/responsive | divs / details+JS / semantic | Divs break SR; details adds JS | **Semantic**: `h2→h3→h4` + `ul>li`; `md:grid-cols-2`; 320px no overflow |

## Data Flow

```
Ipialabogados.md §3.1/3.2/3.3/§4 ──verbatim──→ Services.astro arrays ──map──→ ul>li grids (SSR static)
Ipialabogados.md §2 ──→ Team.astro attorneys[] ──→ #abogados cards verbatim
content.config.ts enums ──→ astro check/build gate
README + // § comments ──→ traceability audit
```

Gate: `pnpm run build && grep dist/index.html` — zero invented strings, headings present.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `Ipialabogados.md` | Modify (git add) | Commit untracked canonical source |
| `src/components/Services.astro` | Modify | Delete 5-item array/grid. 4 `as const` arrays verbatim §3.1/3.2/3.3/§4. Render Omar 3×`h4+ul` + Franco `h3+ul`; keep `py-20 bg-[#f9f9f9] max-w-[1200px]` + `underline-motif` |
| `src/components/Team.astro` | Modify | Verbatim specialties §2; remove bios `resolución estratégica…` / `asesoría corporativa…` |
| `src/content.config.ts` | Modify | Strict enums `grupo`/`abogado`/`specialty`; header `// Taxonomía: Ipialabogados.md §2-§4` |
| `src/content/servicios/derecho-civil.md` | Delete | Invented placeholder |
| `src/content/abogados/abogado-*.md` | Modify | Replace with `omar-…`/`franco-…` or delete; align to strict schema |
| `README.md` | Modify | Add `Fuente canónica: Ipialabogados.md (225 líneas) — §3/§4` |
| `src/layouts/Layout.astro` | Modify | Meta `description`: `civil, familia…` → `laboral y seguridad social, penal y procesal penal` |

## Interfaces / Contracts

```ts
// Services.astro — verbatim static contract
const omarTrabajadores = ["Derechos de petición.", "Acciones de tutela.", /* … §3.1 */] as const;
const omarEmpleadores  = [/* … §3.2 verbatim */] as const;
const omarPensionados  = [/* … §3.3 verbatim */] as const;
const francoPenal      = ["Representación judicial y asesoría en asuntos y procesos penales.", /* … §4 */] as const;

// content.config.ts
const servicios = defineCollection({ schema: z.object({
  title: z.string(), grupo: z.enum(["trabajadores","empleadores","pensionados","penal"]),
  abogado: z.enum(["omar","franco"]), order: z.number().default(0),
}).refine(v=> (v.abogado==="franco")===(v.grupo==="penal"), {message:"§6 cross-attribution"}) });
const abogados = defineCollection({ schema: z.object({
  name: z.enum(["Omar Enrique Ipial Ipial","Franco Miller Ipial Ipial"]),
  specialty: z.enum(["Especialista en Derecho Laboral y Seguridad Social","Especialista en Derecho Penal y Procesal Penal"]),
})});
```

DOM: `#servicios [data-grupo="trabajadores"] h4="Para trabajadores"` → `ul>li`; `data-abogado="franco" h3="Servicios de Derecho Penal"`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | `astro check` + `pnpm build` | `build_command` gate |
| Invariants | `grep -c "Derecho Civil\|Familia\|Administrativo" dist/index.html` ==0; headings + specialties exact | `pnpm build && grep` |
| Segregation | `Cobro de incapacidades…` only `trabajadores`; `Asesoría en manejo…` only `empleadores` | container grep + 2/group spot-check |
| A11y | `h2→h3→h4` + `ul>li`, 320px no overflow | axe + viewport matrix |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. Pure static content.

## Migration / Rollout

One commit, content-only, no overlap with `ux-polish-hero-nav` (that touches hero/nav, this touches services/team). Order: add `Ipialabogados.md` → `Services/Team` → `content.config` → `README/Layout`. Rollback `git revert`. Gate `pnpm build`.

## Open Questions

- [ ] Keep `src/content/**` stubs aligned to strict schema or delete entirely (hard-coded is source) — confirm owner
- [ ] `/principal.jpeg` reused for both attorneys — keep until real photos supplied
