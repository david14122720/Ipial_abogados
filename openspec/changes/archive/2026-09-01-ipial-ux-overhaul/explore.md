# Exploration: ipial-ux-overhaul — Premium Legal Authority UI/UX Overhaul

> Change: `ipial-ux-overhaul` | Stack: Astro 7.2.9 + Tailwind v4 + React 19 islands | Content source: `Ipialabogados.md` (canonical §2–§6), `DESIGN.md` FROZEN
> Date: 2026-09-01 | Verifier: sdd-explore sub-agent

## Executive Summary

Current build is **functional but visually generic** after the Lex→Emerald token migration. The Emerald palette (primary `#004a38`, silver `#A8ADB0`, Hanken+Libre Caslon) is wired but not leveraged for distinctiveness. Biggest UX defects: (a) `src/pages/index.astro` **does not render `Services.astro` at all** — visits the most valuable content (35 Omar + 10 Franco services from `Ipialabogados.md`) only inside `Team.astro` as truncated descriptions, hiding the actual taxonomy; (b) `Team` and `Services` duplicate the same collection with divergent parsing (`description` string vs `parseItems(body)` list) and coupled layout; (c) Hero is a full-bleed image with 50% black overlay + fixed `48px/56px` type — no fluid `clamp()`, no primary CTA, no proof, reads as template.

**Content inventory (Ipialabogados.md is law, §6):**
- **Omar — Derecho Laboral y Seguridad Social** — 3 audience groups: *trabajadores* 13 items (peticiones, tutelas, conciliaciones, disciplinarios, pensionales, prestaciones, incapacidades, estabilidad reforzada, accidentes/enfermedad, fuero sindical, contrato realidad, no pago prestaciones, despido injusto), *empleadores* 12 items (asesoría pensiones/seguridad/laboral, vinculación/desvinculación, contratos+reglamentos internos, disciplinarios, incapacidades, estabilidad, procesos judiciales, capacitaciones), *pensionados* 10 items (reliquidaciones, estudios+actuariales, pensión vejez/sobrevivientes/invalidez, sustituciones, devolución aportes, ineficacia traslado, reconocimiento pensiones).
- **Franco — Penal** — 10 items (representación penal, audiencias preliminares, juicio oral, sustitución medidas, libertad condicional, prisión domiciliaria, devolución vehículos provisional/definitiva, traslados a resguardos indígenas — distinctive —, representación víctimas).
- Constraints: verbatim names/specialties, no cross-attribution, no invented civil/familia areas, keep 3-way split for Omar.

**Recommendation: Approach B — Conversion-focused Editorial with React Filter Islands (with A's typography restraint).** Rationale: Omar's 35-item taxonomy *demands* progressive disclosure + audience filtering — static cards without JS will bury conversion. One restrained React island (`Disclosure` + `FilterTabs` with `client:visible` / `client:media` patterns) preserves static-first while unlocking WhatsApp CTA proximity per group. Distinctiveness comes from penal-vs-laboral editorial framing (not generic 4-card "why us"), fluid type, and a single signature (dossier/rule motif).

## Current State

### Tech
- Astro `output: static`, `compressHTML: true`, `inlineStylesheets: auto` — good. `Layout.astro` injects JSON-LD `LegalService`, canonical, Umami. Header mobile drawer + scroll observer are inline `<script>` (no island yet — correct for critical UI but could be island-ified).
- Tailwind v4 via `@tailwindcss/vite`, `@theme` tokens in `global.css` — 30+ color tokens, radii, text scales. **Pain: all type sizes are fixed px** (`--text-headline-xl: 48px` etc.) — no `clamp()`, no fluid scale, breaks on mobile/broad screens.
- Content Collections `servicios`/`abogados` with Zod `grupo ∈ {trabajadores,empleadores,pensionados,penal}` cross-refined to `abogado ∈ {omar,franco}` — solid (§6 guard). Four MD files with bullet bodies parsed two ways.
- Assets: `logo.webp`, `principal.webp` via `astro:assets` (`widths`, `format: webp`, `loading: eager/lazy`) — correct but hero doesn't use `fetchpriority` on image prop consistently, no `getImage` for art-direction.

### Visual Hierarchy / Design Debt
- **Hero** (`Hero.astro`): `min-h-[78vh]` + `rgba(0,0,0,0.5)` overlay, centered serif `Autoridad, Precisión y Legado`, one paragraph, **zero CTAs** (objetivo.md required primary "Contactar" + secondary "Servicios" — missing). Sentinel for header scroll is inside hero (coupling). Not editorial — template overlay.
- **About**: `max-w-3xl mx-auto text-center` — two paragraphs, no divider, no proof, no anchor to Ipiales/ Nariño positioning.
- **Team vs Services**: `index.astro` renders `Team` (shows each `servicios` entry as `description` — a single sentence per grupo, not the bullet list) and **omits `Services.astro`** (which correctly renders the bullet list with `Leer más` disclosure). Visitor never sees the 45 real services. This is the **#1 conversion blocker**.
- **WhyUs**: 4 generic cards (Autoridad/Atención/Ética/Confianza) with `material-symbols-outlined` — reads templated per `frontend-design` anti-pattern #1 (warm/ generic stats). Icons are the only distinctiveness — not tied to penal/laboral vernacular (dossier, folio, seal, tribunal).
- **Contact**: correct `CONTACT` constants, WhatsApp + Facebook/Instagram gradient, map is a placeholder div — no embed, no `tel:` prominence.
- **Footer**: 3-col, correct.
- **Global.css**: Emerald tokens wired, but `card-lex`, `underline-motif`, `section-divider` are flat; no design signature (dossier edge, rule, folio number) that would make the page unmistakably "bufete nariñense".

### A11y / Performance / Conversion
- A11y: focus-visible present, header `aria-expanded`/`aria-controls` good, but hero image `alt=""` (decorative OK) but no skip-link, no `prefers-reduced-motion` beyond global kill, WhyUs icons lack `aria-label`.
- Perf: `sharp` present — good. But missing: ViewTransitions, `content-visibility` for long service lists, no resource hints. JS is two inline scripts (header + Services toggle with `max-height: 2000px` hack — brittle).
- Conversion: FAB WhatsApp `fixed bottom-5 right-5` is global but **no contextual CTA per attorney/grupo**; Hero has none — first viewport does not convert. No sticky CTA on scroll.

## Affected Areas

- `src/pages/index.astro` — must add `Services.astro` to render tree, reorder sections (Hero → Proof/About → Services → Team → WhyUs → Contact), optional `ViewTransitions`.
- `src/components/Hero.astro` — overhaul: editorial layout, fluid type, dual CTA (WhatsApp primary + anchor to Servicios), proof line (Ipiales · 2 especialistas · Laboral+Penal), sentinel decouple.
- `src/components/Services.astro` — becomes canonical services surface; needs audience tabs/filter, progressive disclosure per grupo, anchor IDs, per-grupo WhatsApp CTA, dedup vs Team.
- `src/components/Team.astro` — decouple from services list; becomes attorney authority surface (credentials, specialties, portrait) — remove service cards or reduce to specialty chips + link to Services anchor.
- `src/components/About.astro` — tighten to 2–3 sentences + location proof + divider motif.
- `src/components/WhyUs.astro` — reframe to 3 proof points tied to brief (e.g. Trámite pensional sin rodeo · Defensa penal en territorio · Domicilio Ipiales) or keep 4 but with dossier visuals.
- `src/components/Header.astro` — add Servicios anchor, active-section observer, optional React island `MobileDrawer` (`client:media`).
- `src/components/Contact.astro` — map embed or `tel:` prominence, remove placeholder, add horario + address schema.
- `src/layouts/Layout.astro` — add fluid type `<style>` or move to `global.css`, optional `ClientRouter` for ViewTransitions, preload hero image.
- `src/styles/global.css` — add `@theme` fluid tokens (`clamp()`), container query setup, signature motif (dossier rule, folio), `content-visibility`, motion guard refinement.
- `src/content/servicios/*.md` + `src/content/abogados/*.md` + `src/content.config.ts` — no schema change, but frontmatter `title` must map to `Ipialabogados.md §3.1–§4` headings verbatim (audit in proposal).
- `src/consts.ts`, `astro.config.mjs` — add `isotipo`/`og:image` if hero direction needs it; verify `site` canonical.
- `src/assets/*`, `public/*` — hero art-direction may need `principal` crop variants; favicon already SVG.

## Approaches

### A) Editorial Premium Minimal — Static disclosure only
- **What:** Zero new React. Services as three Omar dossier columns + one Franco penal folio, native `<details>/<summary>` disclosure (no JS). Typography does the heavy lifting: fluid `clamp(28px, 6vw, 56px)` serif, generous whitespace, hairline silver rules, folio números (01 trabajadores etc.). Signature: left dossier edge / folia.
- **Pros:** Minimum JS (Lighthouse 100, minimal client bundle), pure Astro semantics, easiest review slice (<400 LOC). Fits `frontend-design` "minimal needs precision" dictum. No hydration risk.
- **Cons:** No audience filtering — 35 Omar items visible at once even collapsed is heavy; no per-grupo CTA filtering; `<details>` styling across browsers is fiddly; penal's 10 items need different visual weight — static layout can't adapt.
- **Effort:** Low–Medium | **Astro:** static only | **Tailwind:** `@theme` fluid tokens + `@container` | **React:** none
- **Vercel rules:** N/A (no islands) — `bundle-*` automatically satisfied.

### B) Conversion-Focused with React Filter Islands (Recommended)
- **What:** Keep static shell; add **one** React island `ServiceExplorer` (`client:visible` or `client:media="(min-width:768px)"`) that renders audience tabs (Todos / Trabajadores / Empleadores / Pensionados + Penal as separate folio), search/filter by keyword (e.g. "pensión", "tutela"), progressive disclosure (`Leer más` → expand rest), and per-grupo WhatsApp CTA (`wa.me` with `?text=` prefill per grupo). Team becomes authority bios + links to filtered Services anchor (`#servicios=trabajadores`). Header drawer becomes `MobileDrawer` island (`client:media`). Motion: orchestrated load (hero → rule draw 200ms) with `prefers-reduced-motion` guard.
- **Pros:** Solves 35-item taxonomy without infinite scroll; conversion proximity (CTA next to the service the visitor filtered); preserves static-first — island hydrates only when visible / on interaction. Signature: filter tabs as dossier tabs + penal folio in ochre/emerald contrast.
- **Cons:** Adds React bundle (~35–45kb gz) for islands — must guard with `bundle-dynamic-imports`, `rerender-memo`, avoid barrel imports. More proposal/spec surface.
- **Effort:** Medium | **Astro:** islands with `client:visible` | **Tailwind:** `@theme` fluid + container queries for tab overflow | **React:** 2–3 small islands only
- **Vercel rules:** `bundle-dynamic-imports` for island, `bundle-barrel-imports` (direct imports from `react`), `rerender-memo` for list items, `rendering-content-visibility` for long lists.

### C) Archive/Grid with Progressive Disclosure + Dedicated `/servicios` Route
- **What:** Split services onto `src/pages/servicios/index.astro` (archive) + `src/pages/servicios/[grupo].astro` static paths per `grupo`; index landing shows teaser (6 per grupo) with "Ver todos →" to archive. Archive has same filter island as B but on dedicated page, enabling SEO (`/servicios/trabajadores` etc.) and `astro:assets` per-grupo imagery.
- **Pros:** Best SEO (indexed per audience), cleanest landing (less scroll), scales if bufete adds areas later.
- **Cons:** Breaks "single landing" brief (objetivo.md: single-page landing), adds routing complexity, needs `getStaticPaths` + canonical/ OG per page, review budget exceeds 400 lines; over-engineered for 4 grupos + 10 penal items. Risks content duplication between landing teaser and archive.
- **Effort:** High | **Astro:** `getStaticPaths`, content collections on two pages | **Tailwind/React:** as B plus route transitions
- **Vercel rules:** `server-cache-react` if collections grow, but current 4 entries don't need it.

## Recommendation

**Approach B — Conversion-Focused Editorial with React Filter Islands**, blending A's typographic restraint:

- **Design thesis (per `frontend-design`):** Subject is *expediente nariñense* (dossier) — not generic "legal authority". Audience: high-stakes trabajador/empleador/pensionado + penal defendant in Ipiales/Nariño. Page's single job: **convert to WhatsApp in <60s**. Hero signature: dossier tab + rule motif (silver 1px) + folio `01/02/03/P` numbers encoding the real taxonomy — not decoration.
- **Typography:** Pair stays — **Libre Caslon Text 700** display (restrained, headlines only) + **Hanken Grotesk** body/utility — but scale becomes fluid: `--text-headline-xl: clamp(2rem, 5vw, 3rem)` etc., with `text-wrap: balance` on hero. No third family.
- **Palette:** Keep Emerald tokens — Emerald `#004a38/#14634d` + Silver `#A8ADB0` + Surface — with motion of *one* accent only on filter active/CTA hover (`translate ≤2px`, `opacity`, no shadow avalanche). Discriminate via concentration (as migration did), not new hues.
- **Structure:** Hero (proof + dual CTA) → Sobre (1 paragraph + divider) → Servicios (tab island, canonical) → Abogados (authority, no duplicated lists) → Por qué (3 proof cards tied to penal/laboral, not generic) → Contacto (map or `tel:` prominence + horario). FAB stays as fallback.
- **React islands (minimal, per `vercel-react-best-practices`):** `MobileDrawer` (`client:media`), `ServiceExplorer` (`client:visible`) — both dynamic-imported, direct imports, memoized list rows, `content-visibility: auto` for offscreen grupos.
- **Why not A/C:** A can't handle 35→45 items without filtering — it's honest minimal that fails conversion. C violates single-landing brief and doubles review surface for marginal SEO gain (can add `/servicios/[grupo]` later as follow-up change).

## Risks

- **Content fidelity (§6):** Any rewording of `title`/`items` beyond `Ipialabogados.md` bullets is a spec violation — need verbatim audit in proposal/spec deltas.
- **Team↔Services decoupling breakage:** `Team.astro` currently *is* the services surface — removing its cards without adding `Services.astro` to `index.astro` would regress to zero services visible (already the case today — must fix atomically).
- **Bundle bloat:** React islands without `bundle-*` discipline will regress Lighthouse; cap at 2 islands, no state library, no icon barrel.
- **Motion overreach:** `frontend-design` warns orchestrated > scattered — limit to hero rule draw + tab indicator + card `translateY(≤2px)`, respect `prefers-reduced-motion`.
- **Map placeholder:** Contact map is fake — either embed OSM/Google with lazy load or remove div and promote `tel:`/address. Placeholder harms trust for "autoridad".
- **Photography:** Single `principal.webp` used for both abogados + hero — needs distinct crops or neutral fallback; don't ship same face twice as "two lawyers".
- **Review budget:** B at ~350–380 lines fits 400 LOC chain; must split tokens (global.css) + islands + section reorder into two vertical slices if needed.

## Ready for Proposal

**Yes.** Clear content source (Ipialabogados.md §2–§6), stack constraints, and taxonomy volume justify B. Orchestrator should tell user:

> Exploración completa. Recomendación: **enfoque conversión con islas React mínimas** (filtro por audiencia + disclosure progresivo) sobre base editorial Emerald — preserva estático, maximiza conversión WhatsApp. Siguientes pasos: propuesta SDD con alcance, decisiones y criterios de aceptación; luego spec/diseño/tasks en cadena. Riesgo principal: Team↔Services acoplado y Services ausente del index — se corrige en el primer slice. ¿Aprobamos propuesta?

## Skill Resolution

- `frontend-design`: Distinctiveness ← dossier/folio signature tied to expediente nariñense (not cream/acid-green/broadsheet defaults); typography ← fluid `clamp()` + Hanken/Caslon pairing with restraint; structure ← folio numbers encode grupo order; motion ← 200ms `transform/opacity` only, ≤2px; copy ← from `Ipialabogados.md` verbatim, no invented areas.
- `vercel-react-best-practices`: Islands use `client:visible`/`client:media`, `bundle-dynamic-imports` + `bundle-barrel-imports`, `rerender-memo` for rows, `rendering-content-visibility` for lists, no waterfall islands.

## References

- `Ipialabogados.md` §1–§7 (canonical — counts above manually recontado)
- `objetivo.md` (landing single-page, hero dual CTA, SEO/perf constraints)
- `src/pages/index.astro`, `src/components/*.astro` (7 components), `src/layouts/Layout.astro`, `src/styles/global.css`, `src/content.config.ts`, `src/consts.ts`, `astro.config.mjs`, `package.json`
- `src/content/servicios/{trabajadores,empleadores,pensionados,penal}.md` + `src/content/abogados/*.md`
- `openspec/config.yaml`, `openspec/changes/ipial-ux-overhaul/*`
- Previous change `stitch-lex-emerald-migration@01dac63` — Emerald migration DONE (18/18)

---
*Artifact also persisted to Engram topic_key `sdd/ipial-ux-overhaul/explore` (hybrid store).*
