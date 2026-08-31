# Design: modernize-stack-redesign

## Technical Approach

Tokens-first revitalization: complete Lex Imperial `@theme` from DESIGN.md frontmatter, migrate hardcode → collections, fix P0 UI debt, harden perf/a11y/SEO. Three ≤300-line chained PRs (A→B→C), each revertible via `git revert` + `pnpm run build`.

Maps to proposal Phase A/B/C and spec `landing` delta.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice |
|---|---|---|---|
| Token truth | DESIGN.md frontmatter vs partial `global.css` | Frontmatter canonical; `global.css` drift | **Frontmatter wins** — every `@theme` var traces to §colors/typography/rounded/spacing; remove `--color-surface-green` → `surface-container-*` |
| Fonts | 4 @fontsource vs 2 canonical | Bundle bloat | **Keep `eb-garamond`+`hanken-grotesk`**; remove `libre-caslon-text`+`manrope` |
| Header drawer | React island vs Astro vanilla | Island adds JS | **Astro vanilla** — `aria-expanded`/`aria-controls` + `#mobile-drawer`, `focus-visible` |
| Services data | Hardcode vs `getCollection` | Hardcode duplicates §6 risk | **`getCollection('servicios')`+ zod refine** `franco↔penal`, `order` sort, keep all `<li>` in DOM |
| Images | `/public` raw vs `astro:assets` | Raw skips webp/eager | **`astro:assets` `<Image>`** for `principal.jpeg`/`logo.jpeg` (webp, hero eager `fetchpriority="high"`) |
| Stack | Patch 7.2.4→7.2.9 vs major | Major risks Tailwind v4 break | **Patch only** — `pnpm update astro@7.2.9`, Node 22, verify `allowBuilds` |

## Data Flow

```
DESIGN.md ──→ global.css @theme ──→ components (CSS vars)
Ipialabogados.md §3-§6 ──→ servicios/*.md ──→ content.config.ts refine ──→ Services.astro getCollection → data-grupo/abogado
src/assets/principal.jpeg ──→ astro:assets Image ──→ Hero eager / Team lazy webp
sentinel inside #inicio ──→ IntersectionObserver / scrollY>64 ──→ #site-header.is-scrolled
Layout.astro ──→ JSON-LD LegalService + robots.txt + focus-visible
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/styles/global.css` | Modify | Complete `@theme`: surface-container-lowest→highest (#fff/#f3f4f4/#edeeee/#e7e8e8/#e1e3e3), outline-variant #c0c8c3, forest-deep/platinum-silver/teal-accent/charcoal-text, display-lg 48/56 -0.02em, headline-lg 32/40, body-lg 18/28, label-md 14/20 600 0.05em, spacing 4/24/40/80/1200, radii 0.125/0.25/0.375/0.5; remove dead font imports |
| `package.json` | Modify | Astro 7.2.9, remove 2 dead fonts |
| `astro.config.mjs` | Modify | `image` sharp, `prefetch:true`, keep `inlineStylesheets:auto` |
| `src/components/Hero.astro` | Modify | Eyebrow label-md uppercase 0.05em, sole h1 display-lg, dual CTA wa.me + #servicios, Image bg eager, sentinel inside #inicio |
| `src/components/Header.astro` | Modify | Sticky is-scrolled, sentinel consumer, drawer `aria-expanded`/`aria-controls` + #mobile-drawer 5 links |
| `src/components/Services.astro` | Modify | Delete dup 160-251, `getCollection` sorted order, retain data-grupo/abogado + crawlable disclosure |
| `src/content/servicios/*.md` | Create | 4 groups verbatim §3-§4 with grupo/abogado/order |
| `src/content.config.ts` | Modify | Keep refine (§6), ensure order default |
| `src/components/Team.astro` | Modify | Distinct Omar/Franco cards, Image webp lazy, no invented bios |
| `src/components/Contact.astro` | Modify | tel/wa.me 3188215030/3137664683, email, address, horario, data-map placeholder |
| `src/components/Footer.astro` | Modify | Logo Image, 5 links, contact recap, FB/IG, copyright 2026 |
| `src/components/Welcome.astro` | Delete | Dead code |
| `src/layouts/Layout.astro` | Modify | JSON-LD LegalService+PostalAddress, single h1, focus-visible |
| `public/robots.txt` | Verify | Health |
| `pnpm-workspace.yaml` | Verify | allowBuilds esbuild |

## Interfaces / Contracts

```ts
// content.config.ts — canonical
z.object({grupo:z.enum(["trabajadores","empleadores","pensionados","penal"]),
  abogado:z.enum(["omar","franco"]),order:z.number().default(0)})
 .refine(v=>(v.abogado==="franco")===(v.grupo==="penal"),{message:"§6 cross-attribution"})
// Hero: #inicio = eyebrow label-md + h1 display-lg 48/56 + 2 CTAs; Image fetchpriority="high" eager
// Header: sentinel inside #inicio → IntersectionObserver rootMargin -80px else scrollY>64 → is-scrolled
// Services: (await getCollection("servicios")).sort((a,b)=>a.data.order-b.data.order); all <li> in DOM
```

## Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Build | `astro check` + `pnpm run build` per PR | Must pass; zod rejects §6 |
| Grep | tokens/drawer/CTAs/copyright/fonts | `grep dist/*.css dist/index.html` |
| Visual | dist diff, Lighthouse ≥90 | Build compare spot-check |
| A11y | focus-visible, h1→h2, nav | axe / Lighthouse a11y |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

1. **PR A (P0+Tokens)**: dedup Services, Hero fix, drawer+sentinel, @theme complete, Astro patch+font purge, delete Welcome, build check.
2. **PR B (Content+Perf+A11y)**: servicios collections, getCollection migration, astro:assets Image, focus-visible/aria, h1, JSON-LD, robots.txt.
3. **PR C (Signature)**: Lex Imperial dividers/whitespace 40/24/80, underline-motif, spacing audit, Lighthouse.
- `auto-chain stacked-to-main` (fallback feature-branch chain). **Rollback**: `git revert` per PR; Phase B fallback to hardcode; `pnpm run build` + redeploy.

## Open Questions

- [ ] Canonical photos/bios Omar/Franco or disclosed placeholder?
- [ ] Map provider or address-only Phase B?
- [ ] WhatsApp numbers confirmed → centralize `src/consts.ts`?
