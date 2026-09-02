---
tokens:
  forest-deep: "#04170f"
  surface: "#08211a"
  surface-container-lowest: "#0a241c"
  surface-container-low: "#0d2b21"
  surface-container: "#123228"
  teal-accent: "#2aa88c"
  teal-accent-light: "#4fd1ae"
  on-surface: "#f0f4f2"
  on-surface-variant: "#b8c6c0"
  outline-variant: "#223b31"
  text-on-dark: "#eef4f1"
radii:
  sm: 0.125rem
  DEFAULT: 0.125rem
  lg: 0.25rem
  xl: 0.5rem
  full: 0.75rem
  pill: 9999px
shadows:
  card: "0 1px 2px rgba(0,0,0,0.25)"
  card-hover: "0 12px 32px rgba(0,0,0,0.45)"
typography:
  headline-xl: "clamp(2.25rem, 6vw, 3.5rem)"
  display-lg: "clamp(2.25rem, 6vw, 3.5rem)"
  headline-lg: "clamp(1.75rem, 4vw, 2.5rem)"
  body-lg: "clamp(1.0625rem, 1.8vw, 1.25rem)"
motion:
  reveal: "opacity 600ms ease, transform 600ms ease + --reveal-delay 100/200/300/400ms"
  interaction: "transform/opacity 200-250ms"
  parallax: "translateY scrollY*0.15 capped 40px, disabled <768px"
  reduced: "prefers-reduced-motion: reduce -> is-visible instantly, transition none"
  allowed: "transform, opacity only — no layout shift"
performance:
  content-visibility: "auto with contain-intrinsic-size auto 600px, #inicio visible"
---

# Ipial Abogados — Dark Obsidian (Forest Deep)

Forest Deep base `#04170f` / surface `#08211a` — boutique legal, high-contrast dark.

## @theme

All tokens in `src/styles/global.css` `@theme`. No light `surface #f8f9f9` or `primary #004a38` as surface/text.

## Motion

`Layout.astro` IO threshold 0.15 rootMargin -40px observes `[data-reveal]` → `.reveal.is-visible`. Parallax vanilla rAF, 40px cap, `will-change: transform`, `prefers-reduced-motion` guard.
