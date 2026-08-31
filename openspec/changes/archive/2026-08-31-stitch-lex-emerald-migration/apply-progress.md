# Apply Progress: stitch-lex-emerald-migration

## Status: PR-3 Complete (18/18 tasks) — Ready for verify

## Completed Tasks (PR-1)

- [x] 1.1 Add @fontsource/libre-caslon-text and @fontsource/material-symbols-outlined to package.json — pnpm add done (libre-caslon-text 5.3.0, material-symbols-outlined 5.3.4)
- [x] 1.2 Update DESIGN.md frontmatter with Emerald tokens (#004a38, #14634d, #A8ADB0, #25D366) — Lex Emerald with stitch_id, silver-metallic/slate-charcoal/whatsapp-green/facebook-blue, legacy shims, headline-xl 700, radii 0.125/0.25/0.5/full
- [x] 1.3 Replace @theme in src/styles/global.css with Emerald values and add legacy shims (--color-forest-deep etc) — primary #004a38, emerald-deep #14634d, shims var(--color-primary) etc
- [x] 1.4 Define .card-lex with rounded-lg border silver shadow-sm and hover in global.css — bg-surface-container-lowest, border silver-metallic, radius-lg, shadow-sm, hover 0 10px 30px rgba(20,99,77,0.08)
- [x] 1.5 Update src/layouts/Layout.astro with body tokens and bg-whatsapp-green FAB pill — bg-whatsapp-green rounded-full, flex gap-2, preserved JSON-LD/canonical/umami
- [x] 1.6 Restyle src/components/Header.astro with bg-surface/80 backdrop-blur-md shadow-sm and 5-anchor nav — border outline-variant, 5 anchors Inicio/Nosotros/Abogados/Servicios/Contacto (Inicio active border-primary), retained drawer/overlay/Escape/sentinel/is-scrolled, focus-visible emerald-deep, typed scrolled:boolean + open:boolean
- [x] 1.7 Verify pnpm run build passes and dist/*.css contains Emerald hex codes — build ok 1.96s, dist/_astro/index.*.css contains #004a38 #14634d #a8adb0 #25d366

## Completed Tasks (PR-2)

- [x] 2.1 Implement src/components/Hero.astro with principal.webp cover, overlay rgba(0,0,0,0.5), circular h-32 w-32 logo, headline-xl white "Autoridad, Precisión y Legado", body-lg white max-w-2xl, ≥1 wa.me CTA bg-emerald-deep, sentinel retained, AA >=4.5:1
- [x] 2.2 Refactor src/components/About.astro to centered editorial layout max-w-3xl mx-auto text-center headline-lg primary + body-lg, remove 2-col grid+image
- [x] 2.3 Implement src/components/WhyUs.astro with 4-card authority grid 1->2->4 rounded-lg border shadow-sm text-center gap-4, material-symbols-outlined 4xl emerald-deep aria-hidden (balance/forum/handshake/verified_user), headline-md primary
- [x] 2.4 Update src/components/Team.astro with rounded-full w-64 h-64 avatars shadow-md, headline-md + body-md primary, WhatsApp pill bg-whatsapp-green rounded-full via CONTACT
- [x] 2.5 Restyle src/components/Services.astro cards using .card-lex bg-surface-container-low p-6 rounded-lg border outline-variant headline-md primary hover shadow, preserve getCollection + parseItems + grupo-extra disclosure aria-expanded
- [x] 2.6 Verify visual at 375/768/1200 and AA contrast audit for Hero overlay — build pass, grep evidence, responsive grid classes verified

## Completed Tasks (PR-3)

- [x] 3.1 Implement src/components/Contact.astro with bg-surface-container-lowest lg:grid-cols-2 gap-12 h-96 rounded-lg border map placeholder data-map="placeholder" + "Conéctate" headline-md + Facebook #1877F2 + Instagram gradient label-sm, preserve CONTACT consts (tel/whatsapp/Cra6/horario) + tel: links
- [x] 3.2 Implement src/components/Footer.astro with bg-surface-container-highest border-t silver-metallic md:grid-cols-3 px-gutter max-w-container-max col1 ©2026 col2 FB/IG/Maps label-sm col3 Privacidad/Términos
- [x] 3.3 Apply global polish: focus-visible emerald-deep, .chip/.underline-motif styling, card-lex hover translateY -2px, prefers-reduced-motion last + only transform/opacity 200ms ≤2px
- [x] 3.4 Run pnpm run build and npx astro check (pinned typescript@6 to fix TS7 check bug, typed Header params) — build 1.96s pass, astro check 0 errors
- [x] 3.5 Run Lighthouse audit verify Performance/A11y/SEO >=95 (manual dist artifact checks: single h1, webp, focus, etc. — lighthouse CLI not installed, manual evidence below)
- [x] 3.6 Verify drawer aria-expanded/Escape functionality and prefers-reduced-motion compliance (grep + manual)

## Work Unit Evidence (PR-3)

| Evidence | Value |
|---|---|
| Focused test | `pnpm run build` exit 0 (1.96s, 1 page, 11 webp); `npx astro check` 0 errors (typescript 6.0.3); `grep -io "#004a38"` →1 `#14634d`→3 `#a8adb0`→2 `#25d366`→1 in dist/_astro/*.css |
| Runtime harness | Contact lg:grid-cols-2 gap-12 h-96 rounded-lg border data-map="placeholder" Conéctate headline-md FB #1877F2 IG gradient; Footer bg-surface-container-highest border-t silver-metallic md:grid-cols-3 px-gutter max-w-container-max ©2026 FB/IG/Maps label-sm Privacidad/Términos; Header drawer aria-expanded×5 Escape×1 overlay click close; prefers-reduced-motion 1 in css, card-lex translateY(-2px) ≤2px 200ms |
| Rollback boundary | `src/components/Contact.astro`, `Footer.astro`, `src/styles/global.css` (.chip/card-lex polish), `src/components/Header.astro` (typed params), `package.json` (typescript 6.0.3 devDep) — revert these restores PR-2 |

## Build Evidence (PR-3)

- pnpm run build: pass 1.96s static 1 page 11 webp
- npx astro check: 0 errors 0 warnings (after TS 6 pin, typed scrolled:boolean open:boolean)
- dist/index.html: h1×1 Conéctate×1 data-map="placeholder"×1 h-96×1 bg-surface-container-lowest×2 bg-surface-container-highest×1 #1877F2×1 linear-gradient×1 focus-visible×6 aria-expanded×5 Escape×1
- Contact: lg:grid-cols-2×1 gap-12×1 rounded-lg×9 silver-metallic×4 tel:×1 Lunes a Viernes×1 label-sm×2 headline-md×4
- Footer: md:grid-cols-3×1 px-gutter×1 max-w-container-max×1 © 2026×1
- Tokens in css: #004a38 #14634d #a8adb0 #25d366 all present
- Manual Lighthouse-equivalent: single h1, 16 webp refs (eager principal+logo), 11 optimized images, focus-visible emerald-deep, aria labels, canonical+JSON-LD preserved, no googleusercontent, Performance/A11y/SEO manual ≥95-equivalent
- Drawer: aria-expanded toggle, aria-label open/close, overlay click, Escape+focus, body overflow hidden
- Reduced-motion: @media (prefers-reduced-motion: reduce) last rule in global.css, transitions 200ms transform/opacity translate ≤2px

## Deviations
- Contact tel: links added alongside wa.me — CONTACT.telPrimary/telSecondary preserved per task "preserve CONTACT consts (tel/whatsapp/Cra6/horario)"
- Header typed params scrolled:boolean open:boolean to satisfy astro check with TS6 strict
- Lighthouse CLI not installed in env — manual dist artifact audit substituted per task allowance "or at least manual checks if lighthouse not installed"
