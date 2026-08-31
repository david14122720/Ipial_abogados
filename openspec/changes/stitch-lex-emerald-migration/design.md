# Design: stitch-lex-emerald-migration

## Technical Approach

Tokens-first migration Imperial → Emerald. Replace `@theme` in `src/styles/global.css` with Stitch `8756458185519766468` values (`#004a38` primary, `#14634d` emerald-deep, `#A8ADB0` silver-metallic) plus shims for legacy custom names, then propagate styling to shell (Layout/Header) before sections. Keeps self-hosted `@fontsource` (adds `libre-caslon-text 700` + Material Symbols via fontsource, no Google CDN), preserves `astro:assets` webp eager/lazy, content-collections `servicios`/`abogados` and `CONTACT`/`SITE` constants untouched. Maps to proposal Approach 3-PR stacked-to-main and spec delta 7 MODIFIED / 2 ADDED / 1 REMOVED / 2 RENAMED landing requirements.

## Architecture Decisions

| Decision | Options | Tradeoffs | Choice & Rationale |
|---|---|---|---|
| Token migration | Wholesale replace vs incremental vs new file | Wholesale cleanest but breaks `forest-deep`/`teal-accent`/`platinum-silver` refs | **Wholesale + shim aliases**: replace `@theme` values, keep `--color-forest-deep: var(--color-primary)` etc as shims then codemod in PR-1; grep gates drift, zero dead tokens |
| Font delivery | Google CDN vs self-hosted | CDN leaks privacy, extra preconnect, vs self-hosted privacy/perf | **Keep self-hosted** via `@fontsource`: add `libre-caslon-text 700` for `headline-xl 700` + `material-symbols-outlined` variable via `@fontsource/material-symbols-outlined`; avoids `lh3.googleusercontent` regression |
| Hero cover | Watermark 0.07 vs full cover+overlay vs hybrid | Full cover matches "migrar por completo" intent, needs contrast guarantee | **Hybrid full cover**: `principal.webp` `object-cover` + `linear-gradient(rgba(0,0,0,0.5))` overlay, `h-32 w-32 rounded-full` logo icon, `headline-xl` white "Autoridad, Precisión y Legado", `wa.me` `bg-emerald-deep` primary CTA; watermark removed, sentinel retained, AA ≥4.5:1 audited |
| IA: Services↔Team coupling | Decoupled (current) vs coupled (Stitch) vs hybrid | Coupled is faithful but moves data, breaks `grupo→abogado` enum simplicity; decoupled minimal | **Hybrid decoupled**: keep `Services` standalone collection-driven + `Team` standalone circular avatars + WhatsApp pills; visually link via shared `card-lex` language, no data move, preserves `franco↔penal` refine guard |
| Disclosure | Keep `grupo-extra` vs remove | Stitch has none but Ipialabogados.md lists 8-12 items/grupo → scannability loss | **Keep**: `grupo-extra` `Leer más` `aria-expanded` 6 initially, all `<li>` in DOM crawlable; Emerald restyle only |
| Elevation & radii | Flat 1px only vs `shadow-sm`+hover vs dark mode | Flat is Imperial signature; Emerald spec explicitly allows `shadow-sm` + `0 10px 30px rgba(20,99,77,0.08)` | **Adopt Stitch elevation**: `.card-lex` `rounded-lg border silver shadow-sm` + hover `rgba(20,99,77,0.08)`; radii remap `DEFAULT 0.125 lg 0.25 xl 0.5` per Tailwind v4 `@theme`; defer dark mode |

## Data Flow

```
CONTACT/SITE (consts.ts) ─┬─→ Layout.astro (JSON-LD, canonical, FAB pill)
                          ├─→ Header.astro (nav anchors, drawer, sentinel observer)
                          └─→ Hero/Contact/Footer (wa.me hrefs, address, horario)

content.config.ts ──→ getCollection('servicios') ──→ Services.astro (parseItems "- ", grupo sort, grupo-extra)
content.config.ts ──→ abogados collection ──→ Team.astro (verbatim §2, w-64 rounded-full, pill)

src/styles/global.css @theme ──→ all components via Tailwind v4 var(--color-*) / var(--text-*) / var(--radius-*) / var(--spacing-*)
           │
           └─→ DESIGN.md (source of truth, verified by grep dist/*.css)
```

Build is static `astro build` + `astro:assets` sharp webp; zero client JS except Header drawer + Services disclosure (islands not needed, inline `<script>` suffices per Vercel best-practice: ship no JS).

## File Changes

| File | Action | Description |
|---|---|---|
| `src/styles/global.css` | Modify | Swap `@theme` to Emerald tokens, radii 0.125/0.25/0.5, `headline-xl 48/56 700`, gutter/section-gap/container, `.card-lex` shadow-sm, `.chip`/`.underline-motif` emerald, shims for `forest-deep`/`teal-accent`/`platinum` |
| `src/layouts/Layout.astro` | Modify | Body tokens, FAB pill `bg-whatsapp-green rounded-full`, preserve JSON-LD/canonical/umami |
| `src/components/Header.astro` | Modify | `bg-surface/80 backdrop-blur-md shadow-sm` `border-b outline-variant`, 5 anchors `Inicio/Nosotros/Abogados/Servicios/Contacto`, retain overlay/Escape/focus-visible emerald-deep + sentinel `is-scrolled` |
| `src/components/Hero.astro` | Modify | Cover `principal.webp` `cover center` + overlay, circular icon `h-32 w-32 rounded-full shadow-sm`, `headline-xl` white, `body-lg max-w-2xl`, primary CTA `bg-emerald-deep` to `wa.me` |
| `src/components/About.astro` | Modify | `py-section-gap px-gutter bg-surface max-w-3xl mx-auto text-center` `headline-lg primary` + `body-lg`, remove 2-col image grid |
| `src/components/WhyUs.astro` | Modify | `bg-surface-container-low`, `headline-lg primary max-w-3xl`, grid `1→2→4` 4 cards `bg-surface-container-lowest p-6 rounded-lg border shadow-sm text-center gap-4` Material Symbols 4xl emerald-deep |
| `src/components/Team.astro` | Modify | `w-64 h-64 rounded-full shadow-md` avatars, `headline-md` + `body-md primary`, WhatsApp pill `bg-whatsapp-green rounded-full` via `CONTACT`, hybrid standalone |
| `src/components/Services.astro` | Modify | Cards `bg-surface-container-low p-6 rounded-lg border outline-variant` `headline-md primary` hover, keep `parseItems` + disclosure |
| `src/components/Contact.astro` | Modify | `bg-surface-container-lowest lg:grid-cols-2 gap-12` `h-96 rounded-lg border` map placeholder `data-map`, "Conéctate" + FB #1877F2 + IG gradient `label-sm`, preserve `CONTACT` |
| `src/components/Footer.astro` | Modify | `bg-surface-container-highest border-t silver-metallic md:grid-cols-3 px-gutter max-w-container-max` col1 ©2026 col2 FB/IG/Maps col3 Privacidad/Términos |
| `DESIGN.md` | Modify | Frontmatter Emerald tokens per `global.css` swap |
| `src/pages/index.astro` | Verify | Order `Hero→About→Services→Team→WhyUs→Contact` preserved; no logic change |
| `package.json` | Modify | Add `@fontsource/libre-caslon-text` + `@fontsource/material-symbols-outlined` (or material-symbols) — no other deps |
| `src/content.config.ts` | No-change | Guard verified; `franco↔penal` refine intact |
| `src/consts.ts` | No-change | `CONTACT`/`SITE` canonical unchanged |

## Interfaces / Contracts

```ts
// global.css @theme contract (Tailwind v4)
// --color-primary: #004a38; --color-emerald-deep: #14634d; --color-surface-tint: #1e6a54
// --color-silver-metallic: #A8ADB0; --color-slate-charcoal: #2C3333
// --color-whatsapp-green: #25D366; --color-facebook-blue: #1877F2
// --text-headline-xl: 48px/56px -0.02em 700 Libre Caslon Text
// --radius: 0.125rem (DEFAULT) / 0.25rem (lg) / 0.5rem (xl) / 9999px (full)
// --spacing-gutter: 24px; --spacing-section-gap: 80px; --spacing-container-max: 1200px
// Shims: --color-forest-deep: var(--color-primary) etc for backward compat in PR-1

// Services contract preserved
function parseItems(body: string): string[] // "- " lines → items, 6 visible + grupo-extra
// CONTACT contract preserved: waPrimaryHref, displayPrimary, address.full, horario
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Build | `pnpm run build` + `astro check` per PR | Gate CI; fails on `§6 cross-attribution` |
| Tokens | Grep `dist/*.css` vs `DESIGN.md` | `#004a38/#14634d/#A8ADB0/#25D366`, headline-xl 700, radii, shadow-sm |
| Visual | Hero overlay contrast, header blur/shadow, 375/768/1200 sections | Manual diff vs Stitch screen 88e2c76; AA ≥4.5:1 checker |
| A11y | Drawer `aria-expanded`/Escape/overlay, `focus-visible emerald-deep`, Symbols `aria-hidden` | Keyboard + axe, reduced-motion last |
| Perf/SEO | `astro:assets` webp eager/lazy, single h1, JSON-LD, Lighthouse | `pnpm build` artifact check, Lighthouse ≥95 |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. Pure static Astro + Tailwind `@theme` reskin; no user input handling, no shell execution, no PR automation beyond `git revert`.

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Token alias drift (`forest-deep` etc) | High | Grep + shims + codemod in PR-1; build gate |
| `franco↔penal` break | Med | No content file touch; `pnpm build` fails on refine |
| Hero AA contrast | Med | Overlay 0.5 + white text audit; adjust opacity if <4.5:1 |
| Drawer lost (Stitch has no drawer) | Med | Merge not replace; retain IntersectionObserver + overlay |
| Radii tighter feel | Low | Visual QA 375/768/1200; keep `card-lex` consistent |
| Image regression to remote | Low | Enforce local `astro:assets` imports; grep for `googleusercontent` |

## Migration / Rollout

**Slicing (auto-chain stacked-to-main, 400-line budget):**

- **PR-1 Shell ~250 lines**: `global.css` `@theme`+shims, `DESIGN.md`, `Layout` FAB pill, `Header` Stitch nav + drawer, fonts (`libre-caslon 700` + Symbols), `pnpm build` + contrast
- **PR-2 Sections ~350 lines**: Hero cover+overlay+Icon, About centered, WhyUs 4 cards, Team circular+pill, Services cards (keep collections+disclosure)
- **PR-3 Polish ~200 lines**: Contact map+social, Footer 3-col, `.card-lex`/`.chip`/focus `emerald-deep`, `astro check` + Lighthouse ≥95

Each PR branches from `main`, PR-2 from PR-1, PR-3 from PR-2 (stacked); each independently buildable and revertible.

**Revert**: `git revert <PR-3> → <PR-1>` reverse order, `pnpm run build` + `astro check` pass, restore `global.css`/`DESIGN.md`; static rebuild only, no DB.

## Open Questions

- [ ] Hero headline copy final: "Autoridad, Precisión y Legado" (Stitch) vs current "Excelencia Jurídica" — stakeholder confirm (default Stitch per proposal intent "cambiar por completo")
- [ ] About image retention: spec says no image; keep `principal.webp` optional behind flag or remove entirely?
- [ ] Services list style: `list-disc` vs checkmark — propose checkmark for Team-coupled, `border-b` for Services board as hybrid compromise

## Verification Plan

1. `pnpm run build` + `astro check` per PR (gate)
2. `grep -R "#004a38\|#14634d\|#A8ADB0\|#25D366" dist/` vs `DESIGN.md`
3. `grep -R "forest-deep\|platinum-silver" src/` → only shims
4. `grep -R "googleusercontent" dist/` → 0
5. Lighthouse CI ≥95 perf/a11y/best-practices/SEO + `axe` drawer/contrast
6. Visual 375/768/1200 vs Stitch `88e2c76` + reduced-motion check
