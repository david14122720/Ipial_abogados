# Design: ipial-ux-overhaul — Premium Legal Authority Overhaul

## Technical Approach

Tokens-first Editorial+islands (B with A restraint). `@theme` sets `clamp()`+dossier rule; all sections derive. `ServiceExplorer` (`client:visible`) makes 45-item taxonomy convertible without DOM removal; rest static Astro. ≤2 islands, ≤45kb. S1 Services+Team atomic, S2 hero, S3 proof/contact.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice & Rationale |
|----------|---------|----------|-------------------|
| Fluid tokens | Fixed 48/56px vs `clamp()` | Fixed simple, breaks mobile; clamp fluid, needs tuning | **clamp()** — 4 scales `clamp(2rem,5vw,3rem)` etc. Values-only change in existing `@theme`; satisfies `clamp(` grep + Lighthouse ≥95 |
| ServiceExplorer | Static `<details>` vs React island | Static 0 JS, no filter/CTA | **Island `client:visible`** — tabs 5, filter via CSS visibility (DOM kept, 45 `<li>`), disclosure `aria-expanded`/`is-expanded` 6 init, per-grupo `wa.me?text=` CTA. `client:visible` defers hydration; static can't filter 35 Omar items |
| Team↔Services decouple | Keep coupled vs split | Coupled duplicates source; split risks empty Team | **Atomic split Slice 1** — `Services.astro` canonical (`getCollection`+`parseItems(body)`→props); `Team.astro` bios verbatim §2 + chips `href="#servicios"` + `wa.me`. Same PR so never 0 services visible |
| Hero editorial | Overlay `rgba(0,0,0,0.5)` 0 CTAs vs editorial | Overlay generic 0 conversion | **Editorial** — `astro:assets` webp eager `fetchpriority="high"`, proof `Ipiales · 2 especialistas · Laboral y Seguridad Social + Penal`, dual CTA `wa.me/573188215030` + `#servicios`, single h1 `clamp()`, sentinel outside hero |
| Motion/signature | Scattered anim vs dossier rule | Scattered = AI template | **Dossier rule** — 1px silver `section-divider` + folio `01/02/03/P`. Motion only `transform`/`opacity` 200ms ≤2px, `prefers-reduced-motion` guard already in `global.css` |
| Contact map | Placeholder vs embed vs remove | Embed adds JS/privacy; placeholder harms trust | **Remove `data-map="placeholder"`** — promote `tel:+573188215030`/`tel:+573137664683` above social, keep `wa.me`, render `address.full`+`horario` verbatim |

## Data Flow

```
Ipialabogados.md §2-§6 → content.config.ts (zod grupo↔abogado) → servicios/*.md, abogados/*.md
        ↓ getCollection("servicios") [build-time]
        ├─→ Services.astro byGrupo Map → props {grupo,title,items: string[]} → ServiceExplorer.tsx (client:visible)
        │   → tabs/filter/disclosure/CTA → DOM 45 <li data-grupo> (visibility CSS, not removal)
        ├─→ Team.astro (abogados + servicios→ bios + chips #servicios)
        └─→ index.astro Hero→About→Services→Team→WhyUs→Contact (inicio,nosotros,servicios,abogados,why-us,contacto)
CONTACT/SITE (consts.ts) → Hero/Contact wa.me+tel + Layout JSON-LD; @theme tokens → all sections; astro:assets → Hero eager + Team lazy + Layout preload
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modify | 4 fixed text → `clamp()`, dossier 1px rule, `content-visibility: auto`, keep motion guard |
| `src/layouts/Layout.astro` | Modify | Preload hero image `fetchpriority="high"` for LCP |
| `src/pages/index.astro` | Modify | Add `Services`, reorder Hero→About→Services→Team→WhyUs→Contact |
| `src/components/Hero.astro` | Modify | Editorial: h1 `clamp()`+proof+dual CTA, `Image` webp eager, remove overlay, sentinel outside |
| `src/components/About.astro` | Modify | 2–3 sentences + divider + location proof |
| `src/components/Services.astro` | Modify | Keep `byGrupo`+`parseItems`, shell `#servicios` → island props, remove inline toggle script |
| `src/components/islands/ServiceExplorer.tsx` | Create | `client:visible`: 5 tabs, CSS filter, disclosure 6 init, per-grupo `wa.me?text=`, memoized rows |
| `src/components/Team.astro` | Modify | Bios verbatim §2, remove description cards, add chips `#servicios`, lazy Image |
| `src/components/WhyUs.astro` | Modify | 4 generic → 3 domain cards (laboral/pensional/penal, reliquidaciones/actuariales/resguardos) |
| `src/components/Contact.astro` | Modify | `tel:` above social, remove placeholder, render address+horario |
| `src/components/Header.astro` | Modify | 5th anchor `Servicios`, `IntersectionObserver` active, sentinel fallback `scrollY>64` |
| `src/components/islands/MobileDrawer.tsx` | Create | `client:media` drawer `aria-expanded`/`Escape`/focus-restore + overlay |

## Interfaces / Contracts

```ts
type Grupo = "trabajadores"|"empleadores"|"pensionados"|"penal";
type GrupoPayload = { grupo: Grupo; title: string; items: string[]; abogado: "omar"|"franco" };
 // DOM: <li data-grupo=Grupo> ×45 always; <button aria-expanded data-grupo-toggle aria-controls="grupo-{grupo}">; panel .is-expanded
 // CTA: `https://wa.me/573188215030?text=${encodeURIComponent(title)}`
 // Tokens: --text-headline-xl/display-lg/headline-lg/body-lg must contain clamp(; radii 0.125/0.25/0.5/full; content-visibility: auto
```

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Build | 45 `<li>` 13/12/10/10 | `grep -c data-grupo dist/index.html` |
| DOM | Order + hero h1+2 CTAs+proof+webp | `dist/index.html` asserts per slice |
| Interaction | Tabs keep DOM, disclosure flip, drawer Escape | Vitest island unit + 375px a11y |
| Perf | Lighthouse ≥95, clamp + content-visibility | `grep clamp`/`content-visibility` on CSS |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, or executable-file boundary. Static Astro only.

## Migration / Rollout

3 slices <400 LOC, `git revert` per slice. Slice 1 atomic (Tokens+Services+Team). Slice 2 depends on 1. Slice 3 polish. No schema migration; `content.config.ts` frozen.

## Open Questions

- [ ] Hero crop single `principal.webp` vs neutral fallback — deferred to polish
- [ ] WhyUs verbatim wording stakeholder confirm (spec already encodes)

## Performance Considerations

`astro:assets` webp q75 + `widths`; hero `fetchpriority="high"`+preload (LCP); offscreen `content-visibility:auto`; islands `client:visible`/`client:media`, no barrels; memoized rows; motion `transform/opacity` 200ms ≤2px.
