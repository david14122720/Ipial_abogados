# Tasks: ipial-ux-overhaul — Premium Legal Authority Overhaul

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 350 - 500 |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Tokens/Services/Team) → PR 2 (Hero/About/Header) → PR 3 (WhyUs/Contact/Polish) |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Foundation: Tokens, canonical Services, decoupled Team | PR 1 | `grep -c data-grupo dist/index.html` | Verify 45 items in DOM | `global.css`, `Services.astro`, `ServiceExplorer.tsx`, `Team.astro` |
| 2 | Editorial: Hero, About, and Accessible Header/Drawer | PR 2 | `grep -E "clamp\(|fetchpriority" dist/index.html` | MobileDrawer a11y (Escape/Focus) | `Hero.astro`, `About.astro`, `Header.astro`, `MobileDrawer.tsx`, `Layout.astro` |
| 3 | Authority: WhyUs, Contact, and Perf Polish | PR 3 | `npm run build && lighthouse` | Verify 3 WhyUs cards + tel prominence | `WhyUs.astro`, `Contact.astro` |

## Phase 1: Foundation (Tokens, Services & Team)

- [x] 1.1 Update `src/styles/global.css`: Define fluid `clamp()` tokens in `@theme` for headlines/body and implement 1px silver dossier rule.
- [x] 1.2 Update `src/styles/global.css`: Add `content-visibility: auto` to section wrappers to optimize offscreen rendering.
- [x] 1.3 Create `src/components/islands/ServiceExplorer.tsx`: React island (`client:visible`) with 5 tabs, CSS-based filtering (preserving 45 `<li>`), 6 initial disclosures, and per-grupo `wa.me` CTAs.
- [x] 1.4 Refactor `src/components/Services.astro`: Implement canonical shell using `getCollection` + `parseItems` to pass data to `ServiceExplorer`.
- [x] 1.5 Refactor `src/components/Team.astro`: Decouple to bios only verbatim §2, remove description cards, and add chips linking to `#servicios`.
- [x] 1.6 Modify `src/pages/index.astro`: Reorder sections to `Hero`→`About`→`Services`→`Team`→`WhyUs`→`Contact` and include `Services`.
- [x] 1.7 Verify: Build passes and `grep -c data-grupo dist/index.html` returns 45.

## Phase 2: Editorial (Hero, About & Header)

- [x] 2.1 Modify `src/layouts/Layout.astro`: Add preload for hero image with `fetchpriority="high"`.
- [x] 2.2 Overhaul `src/components/Hero.astro`: Apply fluid `clamp()` to h1, add proof line and dual CTAs (`wa.me` + `#servicios`), use eager webp via `astro:assets`, and move sentinel outside wrapper.
- [x] 2.3 Update `src/components/About.astro`: Tighten copy to 2-3 sentences + divider + location proof.
- [x] 2.4 Create `src/components/islands/MobileDrawer.tsx`: React island (`client:media`) with `aria-expanded` state, Escape key closure, and focus restoration.
- [x] 2.5 Update `src/components/Header.astro`: Add `Servicios` anchor and update `IntersectionObserver` to handle 5-anchor active state.
- [x] 2.6 Verify: Hero hierarchy (h1 + 2 CTAs) and MobileDrawer a11y in browser.

## Phase 3: Authority & Polish (WhyUs, Contact & Performance)

- [x] 3.1 Update `src/components/WhyUs.astro`: Replace generic cards with 3 domain-specific proof cards (laboral/pensional/penal) using verbatim service references.
- [x] 3.2 Update `src/components/Contact.astro`: Promote `tel:` links above social, remove `data-map="placeholder"`, and render address/horario.
- [x] 3.3 Motion Audit: Verify all animations use only `transform`/`opacity`, are $\le$ 200ms / 2px, and respect `prefers-reduced-motion`.
- [x] 3.4 Performance Check: Run Lighthouse to verify score $\ge$ 95 and grep final CSS for `clamp()` and `content-visibility`.
- [x] 3.5 Final Verbatim Audit: Confirm all 45 service items from §3-§4 are present in the DOM.
