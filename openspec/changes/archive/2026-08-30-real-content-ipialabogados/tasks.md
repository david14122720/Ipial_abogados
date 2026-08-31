# Tasks: Real Content — Ipialabogados.md as Single Source

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 285–330 code (~510 inc. Ipialabogados.md) |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR (2 work units sequential) |
| Delivery strategy | auto-chain |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Source + taxonomy guard | PR 1 | `pnpm run build` | N/A — no UI, schema only | Revert `Ipialabogados.md`, `src/content.config.ts`, `src/content/**` |
| 2 | Verbatim Services/Team + docs + invariants | PR 1 | `pnpm run build && grep -c "Derecho Civil" dist/index.html` | `pnpm run dev` → check `/#servicios` + `/#abogados` 320/1200px | Revert `Services.astro`, `Team.astro`, `README.md`, `Layout.astro` |

> auto-chain: if >400 slice Unit1→PR1, Unit2→PR2 (base PR1).

## Phase 1: Foundation — Source & Schema

- [x] 1.1 Track `Ipialabogados.md` — `git add Ipialabogados.md` + `git ls-files | grep Ipialabogados.md` ==1
- [x] 1.2 Harden `src/content.config.ts` — enums `grupo: trabajadores|empleadores|pensionados|penal`, `abogado: omar|franco`, `specialty: Laboral…|Penal…` + `.refine(franco↔penal)`, header `// Taxonomía: Ipialabogados.md §2-§4`
- [x] 1.3 Clean `src/content/**` — delete `servicios/derecho-civil.md`; replace `abogados/abogado-*.md` with `omar-enrique.md`/`franco-miller.md` per strict schema or delete

## Phase 2: Core Implementation — Verbatim Rewrite

- [x] 2.1 Rewrite `src/components/Services.astro` — delete 5 generic; 4 `as const` verbatim `// §3.1` (16), `// §3.2` (11), `// §3.3` (8), `// §4` (11); render Omar `h3` + 3× `div[data-grupo] h4 ul>li` + Franco `div[data-abogado=franco] h3 ul>li`; keep `py-20 bg-[#f9f9f9] max-w-[1200px]`
- [x] 2.2 Fix `src/components/Team.astro` — 2 cards verbatim §2: `Omar Enrique Ipial Ipial — Especialista en Derecho Laboral y Seguridad Social`, `Franco Miller Ipial Ipial — Especialista en Derecho Penal y Procesal Penal`; remove generic `Abogado Especialista` + bios `resolución estratégica…`/`asesoría corporativa…`
- [x] 2.3 Update docs/meta — `src/layouts/Layout.astro` description → `laboral y seguridad social, penal y procesal penal`; `README.md` add `Fuente canónica: Ipialabogados.md (225 líneas) — §3/§4`

## Phase 3: Verification — Build + Grep Invariants

- [x] 3.1 Build gate — `pnpm run build` + `astro check` pass (validates 1.2 enums)
- [x] 3.2 Omar segregation — headings `Para trabajadores|empleadores|pensionados` in order, each ≥1 li; `Cobro de incapacidades…` only `data-grupo=trabajadores`, `Asesoría en manejo…` only `empleadores`; check `Derechos de petición|Acciones de tutela|Demandas por despidos sin justa causa` verbatim
- [x] 3.3 Franco attribution — `Servicios de Derecho Penal` + `Representación judicial…|Sustitución de medidas…|Traslados a resguardos indígenas` verbatim; `Reliquidaciones pensionales` ∉ Franco, `Representación de víctimas` ∉ Omar
- [x] 3.4 Team + no placeholders — names/specialties exact case/accents; `grep -c "resolución estratégica\|asesoría corporativa" dist/index.html` ==0
- [x] 3.5 No invented services — `grep -R "Derecho Civil\|Familia\|Administrativo y Disciplinario" dist/ src/content/` ==0; invented specialty fails build via 1.2
- [x] 3.6 Traceability — `git ls-files` shows `Ipialabogados.md`; `grep -R "fuente canónica\|canonical source" README.md` ==1; spot-check 2 items/group vs §3/§4 checklist
