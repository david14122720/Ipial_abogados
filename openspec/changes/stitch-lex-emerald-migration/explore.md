# Exploration: stitch-lex-emerald-migration

> Adapt Stitch project 8756458185519766468 (Landing Page Ipial Abogados — Lex Emerald) to the current Astro 7.2.9 + Tailwind 4.3.3 + React 19 stack. Full redesign replacing Lex Imperial.

## 1. Intent

- **Ask (Spanish):** "usa ese diseño para cambiar por completo el diseño de la pagina actual vamos a migrar a ese diseño que hice en stitch adaptalo a astro y tailwind y react que usa este proyecto"
- **Scope:** 100% visual migration — tokens, layout grid, all 7 sections — while preserving: content collections (`servicios`/`abogados`), `CONTACT`/`SITE` constants, static-first build, SEO (JSON-LD, canonical), a11y, perf (astro:assets webp).
- **Source of truth for sections:** Stitch main screen `88e2c76be1af4440a2746cf43c4133c3` — Landing Page con Hero Background (2560×6994). Single source HTML fetched via `googleusercontent` + project `designTheme.designMd`.

## 2. Stitch Design Mapping (Lex Emerald)

**Design system name:** Lex Emerald — `customColor #14634d`, `ROUND_FOUR`, Light, Fidelity. Fonts: **Libre Caslon Text** (headlines) + **Hanken Grotesk** (body/label) via Google Fonts + Material Symbols Outlined.

**Tokens (selected, from `project.designTheme.namedColors` + `designMd`):**

| Token | Lex Imperial (current) | Lex Emerald (Stitch) | Delta |
|---|---|---|---|
| `primary` | `#00261b` | `#004a38` | Lighter, more saturated emerald |
| `primary-container` | `#0b3d2e` | `#14634d` | Brighter; used for CTA/hover |
| `secondary` | `#5e5e5e` | `#5a5f62` | Nearly identical |
| `outline` | `#717974` | `#6f7974` | Minimal |
| `on-surface-variant` | `#414944` | `#3f4944` | Minimal |
| `surface-tint` | `#396756` | `#1e6a54` | Emerald tint |
| **New:** `emerald-deep` | — | `#14634D` | Primary for cards/borders |
| **New:** `silver-metallic` | (`platinum-silver #B8B9BA`) | `#A8ADB0` | Renamed, slightly darker |
| **New:** `slate-charcoal` | (`charcoal-text #2C3E50`) | `#2C3333` | Warmer |
| **New:** `whatsapp-green` | — | `#25D366` | Pill FAB |
| **New:** `facebook-blue` | — | `#1877F2` | Social |
| `rounded` | sm 0.125 DEFAULT 0.25 md 0.375 lg 0.5 | Stitch HTML: DEFAULT 0.125 lg 0.25 xl 0.5 full 0.75 | **LG shrinks** — cards change feel |

**Typography:** Same families but weight bumps: `headline-xl 48/56 -0.02em 700` (new, Imperial was display-lg 48/56 600), `headline-lg 32/40 600`, `headline-lg-mobile 28/36 600`, `headline-md 24/32 600`, `body-lg 18/28 400`, `body-md 16/24 400`, `label-md 14/20 600 0.05em`. Imperial already matches closely — swap is mechanical.

**Spacing:** `container-max 1200px`, `gutter 24px`, `section-gap 80px`, `stack-sm 8 / md 16 / lg 32`, `margin-mobile 16px`. Imperial uses `gutter 24`, `section-padding 80`, `container-max 1200` — identical intent.

**Brand narrative:** Emerald authority — brushed steel / deep marble / leather-bound volumes. Corporate Modernism + Minimalism. Tonal layering + 1px Silver Metallic borders + `0 10px 30px rgba(20,99,77,0.08)` hover.

**Layout observed (Stitch HTML, top→bottom):**

1. **Nav** — `fixed bg-surface/80 backdrop-blur-md border-b outline-variant shadow-sm px-gutter py-4 max-w-container-max`. Left logo `h-10`, right 5 links (`Inicio` active border-b-2 primary, others `on-surface-variant` → primary hover). Hidden `md:flex`.
2. **Hero** — `pt-32 pb-section-gap px-gutter bg-surface-container-lowest` with inline `background-image: linear-gradient(rgba(0,0,0,0.5)...), url(...)`, `cover center blur(4px)`. Center stack: icon `h-32 w-32 rounded-full shadow-sm` + `headline-xl` white "Autoridad, Precisión y Legado" + `body-lg` white max-w-2xl + (Stitch has no CTA; current has dual CTA — must reconcile).
3. **Sobre Nosotros** (`#about`) — `py-section-gap px-gutter bg-surface`, centered `headline-lg primary` + `body-lg on-surface-variant max-w-3xl`.
4. **¿Por qué elegirnos?** (`#why-us`) — `bg-surface-container-low`, `headline-lg primary` + 4-col grid (`1→2→4`): cards `bg-surface-container-lowest p-6 rounded-lg border outline-variant shadow-sm text-center gap-4` with `material-symbols-outlined 4xl emerald-deep` (balance, forum, handshake, verified_user) + `headline-md primary` + `body-md on-surface-variant`. Current has 3 cards (no shadow, no Material Symbols).
5. **Nuestros Abogados** (`#lawyers`) — gap-24, each lawyer `lg:grid-cols-12 gap-8`: `col-span-4` avatar centered `w-64 h-64 rounded-full bg-surface-variant shadow-md` (placeholder person) + name `headline-md on-surface` + specialty `body-md primary` + WhatsApp pill `bg-whatsapp-green rounded-full`. Right `col-span-8`: Omar 3 cards (trabajadores/empleadores in 2-col, pensionados col-span-2) `bg-surface-container-low p-6 rounded-lg border outline-variant`; Franco single card `p-8 h-full md:grid-cols-2`. Lists use `list-disc pl-5` (Stitch HTML), designMd specifies **checkmark** variant — inconsistency to resolve.
6. **Ubicación y Contacto** (`#contact`) — `bg-surface-container-lowest`, `headline-lg primary` + `lg:grid-cols-2 gap-12`: left `h-96 bg-surface-variant rounded-lg border` map placeholder; right stacked "Conéctate" `headline-md on-surface` + `body-md on-surface-variant` + Facebook `#1877F2` + Instagram gradient buttons.
7. **Footer** — `py-section-gap bg-surface-container-highest border-t border-silver-metallic`, `md:grid-cols-3 gap-stack-lg px-gutter max-w-container-max`: col1 title + copyright, col2 links (Facebook/Instagram/Google Maps `label-sm`), col3 (Privacidad/Términos).

**Assets in Stitch:** remote `lh3.googleusercontent` logo/icon + hero background; local project has `logo.webp`/`principal.webp` (recent webp migration) — must map.

## 3. Current State Mapping

**Stack:** Astro 7.2.9 `output: static` + `@astrojs/react 6` + `@tailwindcss/vite 4.3.3` + React 19, `pnpm`, `Tailwind v4 @theme`, self-hosted `@fontsource eb-garamond+hanken-grotesk`, `astro:assets` Image (widths/sizes webp), `sharp 0.35.4`. No tests (`strict_tdd false`, `runner: none`), `astro check / tsc strict` only, `pnpm run build` required.

**Route:** `src/pages/index.astro` — linear `Layout > Header > main(Hero, About, Services, Team, Contact, WhyUs) > Footer`. Wait actual order: `Hero → About → Services → Team → WhyUs → Contact` + `Footer`. Layout injects JSON-LD LegalService, canonical, umami analytics, floating WhatsApp FAB.

**Component inventory (current vs Stitch):**

| Current file | Current role | Stitch equivalent | Fit |
|---|---|---|---|
| `Layout.astro` (49 lines) | html shell + JSON-LD + FAB | Stitch has `<body bg-background font-body-lg>` + nav inline | Keep shell; adopt Stitch body tokens; FAB → Stitch pill WhatsApp style |
| `Header.astro` (83 lines) | fixed header `bg-surface/95 backdrop-blur border outline-variant/30` + desktop nav 5 links + mobile drawer+overlay+IntersectionObserver | Stitch nav `bg-surface/80 backdrop-blur-md shadow-sm` 5 links (Inicio, Sobre Nosotros, Abogados, Servicios, Contacto — order differs) | Adapt: align link order/labels, unify backdrop opacity, retain drawer logic (Stitch has no mobile drawer HTML) |
| `Hero.astro` (34 lines) | `min-h-[78vh] bg-surface` + watermark `principal.webp opacity-[0.07] grayscale` + eyebrow "Firma..." `label-md primary` + `display-lg` "Ipial_abogados: Excelencia..." + body + dual CTA (WhatsApp `bg-forest-deep→teal` + secondary outline) + `#header-sentinel` | Hero background-cover `linear-gradient + url` + centered Icon `rounded-full` + `headline-xl` "Autoridad, Precisión..." + single body | Major rework: new background treatment, headline copy, icon, remove dual CTA or preserve as secondary enhancement; sentinel can stay |
| `About.astro` (22 lines) | `grid md:grid-cols-2 gap-12` text + `h-96 principal.webp grayscale` | Centered paragraph `max-w-3xl` no image | Replace layout; decide image retention (objetivo requires "Sobre" concise professionalism — image optional) |
| `Services.astro` (111 lines) | Content-collections driven, `grupo` parsing (`- ` lines), progressive disclosure "Leer más/menos" `grupo-extra` + `is-expanded`, `omarGrupos 3-col`, penal single | Hardcoded 5+4+3 + 9 items, no disclosure, cards `bg-surface-container-low` | Keep collection-driven logic (canonical §6), restyle cards to Stitch `rounded-lg` + Emerald left accent vs current `border-b` list; keep or drop disclosure UX (recommend keep for long lists) |
| `Team.astro` (32 lines) | `md:grid-cols-2 gap-6` 2 cards `flex sm:flex-row` avatar `w-32 h-32 rounded-sm` principal.webp | Inside `#lawyers` with services coupled: `w-64 rounded-full` avatar + WhatsApp pill + service cards coupled | Major IA shift: Stitch couples lawyers↔services (Omar/Franco sections own their servicios). Current decouples (Services then Team). Decide IA — recommend hybrid: keep Services as standalone but style avatars circular + WhatsApp pills |
| `WhyUs.astro` (24 lines) | `md:grid-cols-3 gap-6` 3 cards minimal `p-6 text-left` inline SVG (3 icons), no borders | `md:grid-cols-2 lg:grid-cols-4 gap-8` 4 cards `rounded-lg border shadow-sm text-center` Material Symbols (4 icons) | Add 4th card ("Ética y Transparencia"), swap SVGs for Material Symbols, add cards frame |
| `Contact.astro` (43 lines) | `md:grid-cols-2` left info list (Dirección, WhatsApp `waPrimaryHref/waSecondaryHref`, Horario) + CTA `bg-primary`, right `data-map placeholder` | `#contact` Ubicación y Contacto: left map placeholder, right social CTA (Facebook/Instagram) | Preserve contact semantics (tel/whatsapp links from `consts.ts`), add social buttons, keep map placeholder |
| `Footer.astro` (19 lines) | `bg-surface-container-low border-t platinum-silver py-10 flex-col center` + logo text + 3 links + 2 social SVGs + ©2026 | `bg-surface-container-highest border-t silver-metallic py-section-gap grid md:grid-cols-3` + title + 3+2 links | Restyle to 3-col grid, swap border color, keep CONTACT links |
| `global.css` (195 lines) | `@theme` with Lex Imperial tokens, radii, spacing, `.container-lex`, `.card-lex`, `.underline-motif`, `.section-divider`, `.grupo-extra`, `#site-header.is-scrolled` | Lex Emerald tokens above | Full `@theme` swap, radii remap, update `.chip/.card-lex/.section-divider` colors |

**Content collections:** `src/content.config.ts` — `servicios {title, description, icon, grupo: trabajadores|empleadores|pensionados|penal, abogado: omar|franco, order}` + refine franco↔penal, `abogados {name enum 2, specialty enum 2, order}`. Must not break. `Ipialabogados.md §6` cross-attribution guard is critical.

**Design spec:** `DESIGN.md` = Lex Imperial (Forest Deep #0B3D2E, Platinum Silver, Teal Accent, EB Garamond 48/32/24 + Hanken Grotesk 18/16/14, spacing 80/24/1200). `objetivo.md` = landing single-page 7 sections + nav anchors + responsive + perf + no invented data. `src/consts.ts` canonical CONTACT (2 whatsapps, E.164 tel, display, address Cra 6..., horario) + SITE canonical/title/description.

**Images:** `src/assets/logo.webp, principal.webp` already migrated to `astro:assets` with eager/lazy + widths/sizes — reuse for Stitch logo/icon/hero background (convert Stitch remote URLs to local assets).

**Ops:** `openspec/config.yaml` → hybrid, auto-chain, review_budget 400 lines. Archived changes show prior tailwind migration. `astro.config.mjs` site `ipialabogados.example.com`, `compressHTML true`, `inlineStylesheets auto`.

## 4. Gaps / Alternatives

| Decision | Options | Tradeoffs |
|---|---|---|
| **A. Token migration** | 1. Wholesale `@theme` replace with Stitch values. 2. Incremental override. 3. New `lex-emerald.css` + import | 1 is cleanest — Imperial→Emerald delta is small but pervasive (primary shifts). Risk: missed references (`forest-deep`, `teal-accent`, `charcoal-text` custom names) — need grep & remap to Emerald names. Recommend 1 + alias shims. Effort Medium. |
| **B. Typography** | Keep `@fontsource` self-hosted (current) vs switch to Stitch Google Fonts + Material Symbols | Self-hosted is better for perf/privacy (no googleusercontent). Keep `@fontsource` but add `libre-caslon-text` weight 700 (Emerald headline-xl 700) and Material Symbols via `@fontsource` or local. Effort Low. |
| **C. Hero** | 1. Full Stitch hero (background-cover image + overlay + Icon). 2. Hybrid (keep principal.webp but cover + overlay). 3. Minimal (no background) | 1 matches intent "migrar por completo" but requires choosing hero image (use `principal.webp` as cover). 2 balances brand image reuse. Recommend 1 with local principal.webp cover + gradient overlay, add Icon from logo.webp circular. |
| **D. IA: Services↔Lawyers coupling** | 1. Keep current decoupled (Services then Team). 2. Adopt Stitch coupling (each lawyer owns their services). 3. Hybrid (Team cards + Services board but visually linked) | Stitch coupling violates `content.config.ts` grupo enum reuse — but data already supports it (grupo→abogado mapping). 2 is more faithful but bigger refactor. 1 is minimal. Recommend 3: keep collection-driven Services, restyle Team avatars circular + add WhatsApp pills, add anchor grouping without moving data. |
| **E. Progressive disclosure** | Keep `grupo-extra`/`Leer más` vs remove (Stitch has none) | Keep: Ipialabogados.md services lists are long (8-12 items per grupo). Stitch example truncates (5 each). Disclosure preserves a11y + scannability. Recommend keep. |
| **F. Lists** | Stitch `list-disc pl-5` vs designMd "checkmark icon" vs current `border-b` rows | Current `border-b` rows are more editorial (Lex Imperial signature). Stitch cards use discs. DesignMd checkmarks reinforce "problem solved". Pick one consistently — recommend checkmarks for Team-coupled cards (Stitch Md) and keep border-b for Services board if hybrid. |
| **G. Shadows vs flat** | Stitch uses `shadow-sm` on cards; Imperial uses `1px border no shadow` | Stitch explicitly allows `shadow-sm` + `0 10px 30px rgba(20,99,77,0.08)` hover. Adding shadows is the signature Emerald elevation — adopt. |
| **H. Dark mode** | Stitch HTML has `dark:` variants (`dark:bg-inverse-surface`) | Current has no dark mode. Adding dark mode doubles token scope. Recommend defer — file as follow-up, keep light only. |
| **I. Radii** | Stitch DEFAULT 0.125 lg 0.25 xl 0.5 — current DEFAULT 0.25 lg 0.5 | Remap will make cards/buttons slightly tighter. Need visual QA. |
| **J. Build pipeline** | Keep `@tailwindcss/vite` (current 4.3.3) compatible with `@theme` tokens | No change — verify Stitch tokens compile under Tailwind v4 `@theme`. |

## 5. Risks

- **Scope >400 lines (will need chaining):** Full `@theme` + 7 components + Layout + assets = ~500–700 lines touched. Must chain as stacked PRs to main (per preflight `stacked-to-main`). Draft slicing below.
- **Token alias drift:** Custom names `forest-deep`/`teal-accent`/`charcoal-text` used in `global.css` + components (`bg-forest-deep`, `hover:bg-teal-accent`). Wholesale swap without grep will break build or leave dead tokens. Mitigate with grep + alias or codemod.
- **Content-collections integrity:** Breaking `grupo` enum or `franco↔penal` refine will fail build. Any IA change must keep `src/content/servicios/*.md` untouched; Services.astro parsing (`parseItems` on `- ` lines) is fragile — test after styling.
- **Image regression:** Recent `logo.webp/principal.webp` migration (1a36015) must not regress to remote lh3 URLs. Stitch uses remote URLs — replace with local `astro:assets` imports + widths/sizes + eager/lazy as before.
- **a11y/perf:** Stitch hero overlay `rgba(0,0,0,0.5)` + white text needs contrast check (WCAG AA). Material Symbols require aria-hidden. Backdrop-blur can be costly on low-end mobiles — keep `backdrop-blur` but test.
- **SEO/canonical:** Layout JSON-LD + canonical must survive — verify after migration.
- **No tests:** `strict_tdd false`, no runner. Only guard is `pnpm run build` + `astro check` — manual visual QA + Lighthouse needed.
- **Header drawer:** Stitch HTML has no mobile drawer; current drawer + overlay + `aria-expanded` + Escape handling must be preserved — merge, don't replace.
- **Hybrid persistence contract:** Must write `explore.md` + `mem_save topic_key sdd/stitch-lex-emerald-migration/explore` (capture_prompt:false). Already hybrid mode.

## 6. Recommended Slicing (3 PRs, stacked to main, each ≤400 lines)

**PR-1 — Tokens & Layout Shell (foundation, ~250 lines)**
- Update `src/styles/global.css` `@theme` to Lex Emerald (primary #004a38, emerald-deep, silver-metallic, whatsapp-green, facebook-blue, radii remap, spacing stack-*). Keep aliases for removed Imperial custom names or codemod usages.
- Update `DESIGN.md` frontmatter to Lex Emerald (or new file if convention keeps history).
- Adapt `src/layouts/Layout.astro` body tokens + keep FAB but style as pill `bg-whatsapp-green rounded-full` per Emerald.
- Adapt `src/components/Header.astro` to Stitch nav styling (backdrop `bg-surface/80`, `shadow-sm`, link order: Inicio → Nosotros → Abogados → Servicios → Contacto) while retaining drawer/overlay/IntersectionObserver + `is-scrolled` → emerald variant.
- Add `libre-caslon-text 700` + Material Symbols (self-hosted or google fonts with preconnect).
- Verify `pnpm run build` + contrast.
- *Why first:* unblocks all section styling; low risk to content.

**PR-2 — Sections (hero, about, why-us, team, services restyle, ~350 lines)**
- `Hero.astro`: cover background `principal.webp` + gradient overlay + circular logo Icon + `headline-xl` "Autoridad, Precisión y Legado" (or keep current headline as prop — confirm copy), white text, decide CTA: preserve dual CTA styled as Emerald primary/secondary or drop per Stitch (recommend preserve but restyle).
- `About.astro`: centered paragraph variant (remove side image or keep as optional — confirm with stakeholder).
- `WhyUs.astro`: 3→4 cards, `rounded-lg border outline-variant shadow-sm text-center`, Material Symbols icons, `emerald-deep`.
- `Team.astro`: circular avatars `w-64 rounded-full`, WhatsApp pills `bg-whatsapp-green`, decouple vs couple decision (recommend hybrid — keep Team standalone, add pills, no service move).
- `Services.astro`: restyle to `bg-surface-container-low p-6 rounded-lg border` cards, `headline-md primary` + border-b header, retain collection-driven + `grupo-extra` disclosure, fix lists to Emerald style (checkmark vs border-b — pick one).
- *Why second:* visual core; depends on PR-1 tokens.

**PR-3 — Contact, Footer, Polish & a11y (final, ~200 lines)**
- `Contact.astro`: `bg-surface-container-lowest` + map placeholder `h-96 rounded-lg` + right social stack (Facebook `#1877F2`, Instagram gradient) + preserve `CONTACT` links/tel/whatsapp.
- `Footer.astro`: `bg-surface-container-highest border-t silver-metallic py-section-gap grid md:grid-cols-3` + 3+2 links, label-sm styling.
- Global polish: `.card-lex`/`.section-divider`/`.chip` color updates, hover `0 10px 30px rgba(20,99,77,0.08)`, reduced-motion guard already last.
- a11y: focus-visible `outline emerald-deep`, aria for Material Symbols, contrast audit, lighthouse, `astro check`.
- Update `openspec/specs` if needed (landing spec delta).
- *Why last:* final QA + perf; smallest blast radius.

**Alternative if reviewer prefers 2 PRs:** Merge PR-2+PR-3 but still ≤400 requires careful line budget — 3 is safer.

## 7. What to Keep / What to Replace

- **Keep:** `src/consts.ts`, `src/content.config.ts`, `astro.config.mjs` (output static), `package.json` (no new deps except maybe Material Symbols fontsource), `src/assets/logo.webp & principal.webp`, Layout JSON-LD/canonical/umami, Services collection logic + progressive disclosure, Header drawer JS, reduced-motion guard, `pnpm run build` pipeline.
- **Replace:** `global.css @theme` values, `DESIGN.md` frontmatter, Hero/About/WhyUs/Team/Contact/Footer markup & styling, Header nav link order/styling, card/list/border treatments.

## 8. Verification Before Proposal

- [ ] `pnpm run build` passes on each PR
- [ ] Visual diff: hero overlay contrast WCAG AA (white on rgba(0,0,0,0.5)+cover)
- [ ] No content invented (names/specialties verbatim Ipialabogados.md §2)
- [ ] Content collections still validate (`franco↔penal` refine)
- [ ] Images via `astro:assets` (no remote lh3 in final)
- [ ] Mobile drawer + sentinel scroll + reduced-motion intact
- [ ] Lighthouse perf ≥95, a11y ≥95

## 9. Ready for Proposal

**Yes.** Clear intent, bounded scope, low content risk, high visual delta. Requires stacked chain (3 PRs) due to line budget. Next step is `sdd-propose` to formalize `proposal.md` + `spec delta` for `stitch-lex-emerald-migration`.

---
*Generated by sdd-explore. Sources: Stitch project 8756458185519766468 (designTheme + screen 88e2c76), src/*, DESIGN.md, objetivo.md, Ipialabogados.md, openspec/config.yaml.*
