# Spec — real-content-ipialabogados

> Hybrid concatenated artifact. Domain: `landing`. Source: `Ipialabogados.md` (225 lines). See `specs/landing/spec.md` for delta.

# Delta for landing

## ADDED Requirements

### Requirement: Omar Services Segregated Groups
The system MUST render Omar Enrique Ipial Ipial services as three segregated groups per Ipialabogados.md §3.1/§3.2/§3.3 with headings "Para trabajadores", "Para empleadores", "Para pensionados". Items MUST be verbatim from their section; no item SHALL appear outside its group. Per §6, groups SHALL remain visually distinct (cards/accordions/sections).

#### Scenario: Three groups render with correct headings
- GIVEN landing builds and `/#servicios` renders
- WHEN inspecting Omar container
- THEN headings "Para trabajadores", "Para empleadores", "Para pensionados" appear in order, each with ≥1 item

#### Scenario: No cross-group mixing
- GIVEN `dist/index.html` after `pnpm run build`
- WHEN searching "Cobro de incapacidades ante entidades" (§3.1) and "Asesoría en manejo de incapacidades" (§3.2)
- THEN each string occurs once and inside its correct group only

#### Scenario: Verbatim check subset
- GIVEN trabajadores group rendered
- WHEN comparing items "Derechos de petición", "Acciones de tutela", "Demandas por despidos sin justa causa"
- THEN text matches §3.1 character-for-character (accents, punctuation)

### Requirement: Franco Penal Services Attribution
The system MUST render Franco Miller Ipial Ipial services exclusively from §4 (Derecho Penal y Procesal Penal) under "Servicios de Derecho Penal" and MUST NOT mix any §3 item. Cross-attribution per §6 is prohibited.

#### Scenario: Franco items visible verbatim
- GIVEN `/#servicios` Franco subsection renders
- WHEN checking items "Representación judicial y asesoría en asuntos y procesos penales", "Sustitución de medidas de aseguramiento", "Traslados a resguardos indígenas"
- THEN each is visible verbatim from §4 under Franco header

#### Scenario: No cross-attribution between attorneys
- GIVEN `dist/index.html` after build
- WHEN extracting Omar vs Franco DOM containers
- THEN no §3 string (e.g., "Reliquidaciones pensionales") inside Franco and no §4 string (e.g., "Representación de víctimas") inside Omar

### Requirement: Team Identity Verbatim
The system MUST show Team cards with exact names/specialties verbatim from §2: "Omar Enrique Ipial Ipial" — "Especialista en Derecho Laboral y Seguridad Social" and "Franco Miller Ipial Ipial" — "Especialista en Derecho Penal y Procesal Penal". Generic "Abogado Especialista" and invented bios MUST NOT appear (§6).

#### Scenario: Names and specialties exact
- GIVEN `/#abogados` rendered
- WHEN reading team cards text
- THEN one card equals Omar name+specialty, the other Franco name+specialty, case/accents exact

#### Scenario: No placeholder bios remain
- GIVEN `dist/index.html` after build
- WHEN grep for legacy bios "resolución estratégica de conflictos" or "asesoría corporativa"
- THEN zero matches; descriptions are empty or from §2/§6 only

### Requirement: No Invented Services Invariant
The system MUST NOT render any service/category absent from Ipialabogados.md. Forbidden placeholders "Derecho Civil", "Familia", "Administrativo y Disciplinario" MUST be absent from Services, Team, and `src/content/**`. Extending scope violates §6.

#### Scenario: Forbidden placeholders absent in build
- GIVEN `pnpm run build` succeeds
- WHEN grepping `dist/index.html` and `src/content/**`
- THEN "Derecho Civil", "Familia", "Administrativo y Disciplinario" occur zero times

#### Scenario: Collections enforce allowed taxonomy
- GIVEN `src/content.config.ts` schema
- WHEN build parses `src/content/servicios/*` and `src/content/abogados/*`
- THEN only allowed specialties (Laboral, Seguridad Social, Penal) validate; invented entries fail build

### Requirement: Canonical Source Traceability
The system MUST treat `Ipialabogados.md` (225 lines, fuente canónica) as single source of truth, committed and tracked; `src/content.config.ts`, `src/content/**`, `Services.astro` and `Team.astro` MUST trace to §3/§4/§6. README or spec MUST reference it.

#### Scenario: Source file tracked and referenced
- GIVEN repo at HEAD
- WHEN running `git ls-files | grep Ipialabogados.md` and inspecting README or spec
- THEN file is tracked and docs contain "Ipialabogados.md — fuente canónica" (or "canonical source") with link

#### Scenario: Build matches source checklist
- GIVEN `Ipialabogados.md` as source
- WHEN `pnpm run build` completes and `dist/index.html` is spot-checked (2 items per group)
- THEN Services+Team render matches §3/§4 checklist item-for-item
