# Proposal: stitch-lex-emerald-migration

## Intent

100% migration Lex Imperial → Stitch Lex Emerald (`8756458185519766468`/`88e2c76`). User ES: *"usa ese diseño para cambiar por completo... adáptalo a Astro y Tailwind y React"*. Imperial lacks authority for labor/criminal defense; Emerald (`#004a38`/`#14634d`) delivers trust/legacy. Stack Astro 7.2.9+Tailwind 4.3.3+React 19 islands, static.

## Scope

### In Scope
- `@theme` Emerald: `#004a38`/`#14634D`/`#A8ADB0`/`#25D366`, radii `0.125/0.25/0.5`, headline-xl 48/56 700, Libre Caslon 700 + Material Symbols
- Shell: `Layout`+FAB pill, `Header` `bg-surface/80 backdrop-blur-md shadow-sm` (Inicio/Nosotros/Abogados/Servicios/Contacto) keep drawer/sentinel
- 7 sections: Hero cover+overlay+Icon, About `max-w-3xl`, WhyUs 3→4 cards, Team `rounded-full`+pill, Services cards, Contact map+social, Footer 3-col

### Out of Scope
- Dark mode, invented content, schema changes, IA coupling (hybrid keep), new deps beyond fontsource

## Capabilities

### New Capabilities
- None — reskin.

### Modified Capabilities
- `landing`: tokens, hero, header, services board, team, why-us, contact/footer, motion/shadows — delta spec.

## Approach

**Auto-chain stacked-to-main, 400-line budget → 3 PRs (~700–800 lines)**

- **PR-1 ~250 Shell:** `global.css` `@theme`+shims, `DESIGN.md`, `Layout`+`Header`, fonts, `pnpm build`
- **PR-2 ~350 Sections:** Hero/About/WhyUs/Team/Services (keep collections+`grupo-extra`)
- **PR-3 ~200 Polish:** Contact/Footer, `.card-lex`, focus `emerald-deep`, Lighthouse `astro check`

Perf: `astro:assets` eager/lazy, zero client JS. Signature: `1px silver+shadow-sm+hover` only.

## Affected Areas

| Area | Impact | Desc |
|------|--------|------|
| `src/styles/global.css` | Modified | `@theme` swap |
| `src/layouts/Layout.astro` | Modified | Tokens, FAB |
| `src/components/Header.astro` | Modified | Stitch nav |
| `src/components/Hero.astro` | Modified | Cover+overlay |
| `src/components/About.astro` | Modified | Centered |
| `src/components/WhyUs.astro` | Modified | 4 cards |
| `src/components/Team.astro` | Modified | Circular+pill |
| `src/components/Services.astro` | Modified | Card restyle |
| `src/components/Contact.astro` | Modified | Map+social |
| `src/components/Footer.astro` | Modified | 3-col |
| `DESIGN.md` | Modified | Tokens |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Token alias drift | High | Grep+shims |
| `franco↔penal` break | Med | Build gate |
| Hero AA contrast | Med | Overlay audit |
| Drawer lost | Med | Merge not replace |

## Rollback Plan

`git revert <PR-commit>` reverse order (PR-3→PR-1), `pnpm run build`+`astro check` pass, restore `global.css`/`DESIGN.md`. Static rebuild only, no DB.

## Dependencies

- Stitch `8756458185519766468`/`88e2c76`, `@fontsource` self-hosted, `src/consts.ts`+`content.config.ts` unchanged

## Success Criteria

- [ ] Emerald tokens in built CSS match Stitch
- [ ] 7 sections match Stitch at 375/768/1200
- [ ] `pnpm build`+`astro check` pass, no invented content, `astro:assets` webp
- [ ] AA contrast, focus-visible, reduced-motion, Lighthouse ≥95, drawer intact

## Product Questions Answered
- **Problem:** Imperial generic → weak trust for high-stakes legal choice; Emerald = authority.
- **Users:** Workers/employers/pensioners/defendants scanning single page for credibility.
- **Impact:** Brand/CTA clarity only; no workflow break; single-page anchors preserved; long grupos via disclosure.
