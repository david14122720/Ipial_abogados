# landing Specification

## Purpose

Single-page landing (hero, about, services, team, why-us, contact, location). Baseline for hero visibility, fluid typography, scrollspy nav, mobile drawer, and sober hover system.

## Requirements

### Requirement: Hero Veil and Scrim Visibility

The system MUST render hero veil at `opacity 0.14` (cap 0.12–0.16) with scrim `from #f9f9f9/10 to #f9f9f9 85%`. It MUST keep `pt-32`, responsive `min-h`, and `px-6` without overflow. Contrast MUST pass WCAG AA (`axe`).

#### Scenario: Hero veil visible with scrim
- GIVEN hero section is rendered
- WHEN user views hero on desktop
- THEN image is perceptible at 0.14 opacity with gradient scrim and text contrast passes axe

#### Scenario: Mobile viewport no overflow
- GIVEN viewport is 320px wide
- WHEN hero renders with pt-32 and min-h
- THEN no horizontal overflow and scrim fully covers image edge

#### Scenario: Veil cap enforced
- GIVEN veil opacity tries to exceed bounds
- WHEN rendered
- THEN opacity is clamped between 0.12 and 0.16

### Requirement: Fluid Typography Scale

The system MUST define fluid tokens via `clamp()` in `global.css` and apply `text-wrap: balance` to hero headings. H1 MUST use `--text-hero: clamp(1.9rem,5.2vw,3.25rem)`, description `clamp(1.05rem,1.6vw,1.18rem)`, `tracking -0.015em`.

#### Scenario: Smooth scaling across breakpoints
- GIVEN H1 uses clamp token
- WHEN viewport resizes 320→1280px
- THEN font scales continuously without 32→48px jump and no overflow at 320px

#### Scenario: Balance wrapping
- GIVEN H1 text wraps to two lines
- WHEN rendered at 375px
- THEN lines are balanced and `overflow-wrap: break-word` prevents clip

### Requirement: Navigation Scrollspy

The system MUST track active nav via `IntersectionObserver` (`rootMargin "-80px 0px -55% 0px"`, `threshold [0,0.5,1]`). Active link MUST set `aria-current="page"` and animate underline `::after scaleX 0→1`. Offset MUST use `header.clientHeight` + `ResizeObserver`. SSR fallback MUST show first link active.

#### Scenario: Active section updates on scroll
- GIVEN user scrolls to #servicios
- WHEN section enters top-third viewport
- THEN nav highlights Servicios with aria-current and underline scaleX 1

#### Scenario: Header resize recalculates offset
- GIVEN header height changes on resize or font load
- WHEN ResizeObserver fires
- THEN rootMargin updates to new clientHeight and active state remains accurate

#### Scenario: Missing id fails gracefully
- GIVEN a section lacks id (e.g., why-us)
- WHEN observer initializes
- THEN only registered sections are observed and no error is thrown

### Requirement: Mobile Navigation Drawer

The system MUST provide a React island drawer via `client:media="(max-width:768px)"` (no desktop JS). Drawer MUST support hamburger `aria-expanded`, overlay/anchor/`Esc` close, focus trap, and body lock.

#### Scenario: Open and close via overlay
- GIVEN drawer is closed on mobile
- WHEN user taps hamburger then taps overlay
- THEN drawer opens with aria-expanded true and closes on overlay with focus returned

#### Scenario: Keyboard accessible
- GIVEN drawer is open
- WHEN user presses Esc or tabs beyond bounds
- THEN drawer closes on Esc and focus cycles within trap

#### Scenario: Desktop hydration skipped
- GIVEN viewport is >768px
- WHEN page loads
- THEN MobileMenu island does not hydrate and hamburger is hidden

### Requirement: Hover and Motion System

Cards MUST lift `-2px` with shadow `0 12px 28px` on hover, `duration-200 ease-out`. Nav MUST animate underline `scaleX`; buttons transition 200ms. All MUST respect `prefers-reduced-motion` and expose `focus-visible` rings.

#### Scenario: Card hover lift
- GIVEN user hovers a service card
- WHEN pointer enters
- THEN card translates -2px and shadow appears within 200ms

#### Scenario: Reduced motion disables animation
- GIVEN user prefers reduced motion
- WHEN hover or scrollspy would animate
- THEN transforms and transitions are disabled and state changes instantly

#### Scenario: Keyboard focus visible
- GIVEN user tabs to nav link or CTA
- WHEN element receives focus
- THEN focus-visible ring is shown and underline animates on focus
