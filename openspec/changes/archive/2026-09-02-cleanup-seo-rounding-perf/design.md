# Design: cleanup-seo-rounding-perf

## Technical Approach

Single PR, 6 work units, ~180 lines. Fix double border (keep one `border-t`), delete 6 dead assets + `ServiceExplorer.tsx` + dead font, generate rounded favicons via `sharp` (ICO fallback), soften `global.css` radii (`--radius` 0.125→0.25, `--radius-lg` 0.25→0.5) + migrate `Services/WhyUs/Contact` to `rounded-lg`, add `?text=` to `waPrimaryHref`, emit OG/Twitter/theme-color + `@astrojs/sitemap`. Preserves JSON-LD, canonical, hierarchy, `content-visibility` perf.

## Architecture Decisions

| Decision | Options | Tradeoffs | Choice |
|----------|---------|-----------|--------|
| Divider seam | A Hero `border-b` remove / B About `border-t` remove | A keeps section-owns-edge; B couples hero overlay to divider | **A** — delete `border-b` in `Hero.astro`, keep `About.astro border-t outline-variant/20` (1px subtle, dark double = same luminance stacked) |
| Dead code | A delete now / B deprecate | A safe (grep 0 imports + build passes) | **A** — delete 6 assets, `ServiceExplorer.tsx`, `pnpm remove @fontsource/libre-caslon-text` |
| Favicon | A `sharp` round / B copy ICO | A true 48×48 + 180×180 transparent; B <100KB but square | **A primary, B fallback** (sharp in devDeps; fallback: optimize ICO, emit PNG links placeholder) |
| Radii | A tokens only / B tokens+components | A leaves hard `rounded`; B soft professional (0.5) | **B** — `--radius 0.25`, `--radius-lg 0.5`, keep `xl 0.5/full/pill`; `Services/WhyUs/Contact rounded→rounded-lg`, CTA `rounded-sm→rounded-lg`; `card-lex` inherits `var(--radius)` |
| WhatsApp | A getter encode / B hardcode | A single source FAB+Contact | **A** — `get waPrimaryHref(){ return `https://wa.me/${this.whatsappPrimary}?text=${encodeURIComponent('Hola, me gustaría recibir asesoría jurídica. ¿Podemos agendar una consulta?')}` }` |
| SEO/sitemap | A `@astrojs/sitemap` / B manual | A auto-sync with `site` | **A** — `astro.config.mjs` `sitemap()` + `Layout.astro og:* twitter:* theme-color #08211a` (image fallback `principal.webp`) |

## Data Flow

```
consts.ts (CONTACT/SITE)─┬→ Layout head (canonical/OG/Twitter/theme/favicons/JSON-LD)
                         ├→ Contact CTA + FAB (waPrimaryHref)
astro.config site ───────┴→ sitemap→dist/sitemap.xml→robots Sitemap
global.css radii → card-lex/Services/WhyUs/Contact → dist CSS
public/favicon.* → Layout links → dist head
Hero/About borders → build → single 1px seam
```
`pnpm build` (Astro 7.2.9 static + Tailwind Vite) tree-shakes deleted island/assets.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/Hero.astro` | Modify | Remove `border-b border-platinum-silver` |
| `src/components/About.astro` | Modify | Keep `border-t border-outline-variant` |
| `src/assets/astro.svg, background.svg, logo.jpeg, logo.webp, principal.jpeg, principal.jpg` | Delete | 6 dead assets |
| `src/components/islands/ServiceExplorer.tsx` | Delete | Dead island |
| `package.json` | Modify | Remove `libre-caslon-text`, add `@astrojs/sitemap` |
| `astro.config.mjs` | Modify | Add `sitemap()` integration, keep `site` canonical |
| `src/styles/global.css` | Modify | `--radius 0.25`, `--radius-lg 0.5` (keep xl/full/pill) |
| `src/components/Services.astro` | Modify | `rounded→rounded-lg` cards |
| `src/components/WhyUs.astro` | Modify | `rounded→rounded-lg` cards |
| `src/components/Contact.astro` | Modify | `rounded→rounded-lg` map, `rounded-sm→rounded-lg` CTA |
| `src/consts.ts` | Modify | `waPrimaryHref` adds `?text=` encode |
| `src/layouts/Layout.astro` | Modify | Favicon links (png 48 + ico fallback + apple 180), `og:* twitter:* theme-color` |
| `public/favicon.png` | Create | 48×48 rounded |
| `public/apple-touch-icon.png` | Create | 180×180 rounded |
| `public/favicon.ico` | Modify | Optimize <100KB |
| `public/robots.txt` | Modify | Add `Sitemap: /sitemap.xml` |

## Interfaces / Contracts

```ts
// consts.ts
get waPrimaryHref(): `https://wa.me/${string}?text=${string}`
SITE.canonical: string
// astro.config.mjs
import sitemap from '@astrojs/sitemap';
defineConfig({ site: SITE.canonical, integrations: [react(), sitemap()] })
```
```html
<link rel="icon" href="/favicon.png" type="image/png" sizes="48x48" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
<meta property="og:title|og:description|og:url|og:type|og:image" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#08211a" />
```
```css
--radius-sm:0.125rem; --radius:0.25rem; --radius-lg:0.5rem; --radius-xl:0.5rem; --radius-full:0.75rem; --radius-pill:9999px;
```

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Build | `pnpm build` passes | Build static 1 page |
| Grep | Hero no `border-b`, About has `border-t`, no dead files/font, `waPrimaryHref` has `?text=` | `grep` + `ls` |
| Output | Head OG/Twitter/theme/canonical/JSON-LD, sitemap+robots, favicon links+sizes | Parse `dist/index.html`, `dist/sitemap.xml`, `robots.txt` |
| Visual | Single seam, softer radii, pills/FAB unchanged | QA + Lighthouse (favicon <100KB) |

No test runner; verifier is `pnpm build` + grep invariants.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. Favicon `sharp` is build-time transform, not runtime shell.

## Migration / Rollout

No migration. Single PR revertible via `git revert`. Verify `dist` invariants + Lighthouse, swap `SITE.canonical` when real domain lands. OG image fallback `principal.webp` until 1200×630 final.

## Open Questions

- [ ] Final canonical domain?
- [ ] OG image final 1200×630 or keep `principal.webp`?
- [ ] Favicon rounded alpha clean (sharp mask check)?
