---
phase: 02-css-foundation-theme-infrastructure
plan: 01
subsystem: css-tokens
tags: [css-custom-properties, theming, tokenization, data-theme]
dependency_graph:
  requires: []
  provides: [css-token-foundation, data-theme-attribute]
  affects: [src/styles/global.css, src/layouts/Layout.astro, src/pages/index.astro]
tech_stack:
  added: []
  patterns: [css-custom-properties-under-data-theme-selector, window-class-scoping]
key_files:
  created: []
  modified:
    - src/styles/global.css
    - src/layouts/Layout.astro
    - src/pages/index.astro
decisions:
  - "Scoped .window under [data-theme='retro'] to prevent Phase 4 collision with 98.css (pre-emptive fix per STATE.md research flag)"
  - "Kept @keyframes borderGradient hardcoded as retro-only per D-09; not tokenized"
  - "Body transparent rgba anchors (rgba(0,128,128,0)) left as-is — structural gradient anchors, not theme colors"
metrics:
  duration: "~2 minutes"
  completed: "2026-03-22"
  tasks_completed: 2
  files_modified: 3
---

# Phase 02 Plan 01: CSS Token Foundation Summary

CSS custom property tokenization of global.css with 46 var() references and [data-theme="retro"] SSG default on html elements.

## What Was Built

Refactored `src/styles/global.css` to replace all hardcoded visual values (colors, fonts, borders, shadows, scrollbar styles) with CSS custom property references. Added a `[data-theme="retro"]` token definition block at the top of the file containing 35 custom property definitions. Added `data-theme="retro"` attribute to the `<html>` element in both `Layout.astro` and `index.astro` as the SSG fallback value.

## Tasks Completed

### Task 1: Define CSS custom property tokens and refactor global.css

- Added `[data-theme="retro"]` block with 35 CSS custom property definitions covering all color, typography, border, shadow, and background tokens
- Replaced 46 hardcoded values with `var(--token-name)` references throughout all CSS rules
- Scoped `.window { background-color }` under `[data-theme="retro"] .window` to prevent Phase 4 collision with 98.css
- Kept `@keyframes borderGradient` hardcoded per decision D-09 (retro-only animated gradient border)
- Build: PASS

**Commit:** `671dde1`

### Task 2: Add data-theme attribute to html elements

- `src/layouts/Layout.astro`: `<html lang="en">` → `<html lang="en" data-theme="retro">`
- `src/pages/index.astro`: `<html lang="en">` → `<html lang="en" data-theme="retro">`
- Both files carry the SSG fallback — anti-flash script (Plan 02) will override on client before paint
- Build: PASS

**Commit:** `3c0b734`

## Verification Results

| Check | Result |
|-------|--------|
| var() reference count | 46 (required: 25+) |
| [data-theme="retro"] block present | PASS |
| #008080 not leaked outside token block | PASS |
| .window scoped under [data-theme="retro"] | PASS (line 71) |
| @keyframes borderGradient hardcoded | PASS |
| data-theme="retro" in Layout.astro | PASS |
| data-theme="retro" in index.astro | PASS |
| bun run build | PASS (4 pages built) |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all token references are wired to real CSS custom property definitions. The `[data-theme="retro"]` block is complete and all `var(--*)` references resolve at runtime.

## Decisions Made

1. **Scoped .window under [data-theme="retro"]** — Pre-emptively fixed the Phase 4 collision risk flagged in STATE.md research flags. No HTML changes needed; CSS cascade applies when `<html>` carries `data-theme="retro"`.

2. **Kept @keyframes borderGradient hardcoded** — Per decision D-09, the animated gradient border on `.splash-screen` is retro-only. Colors in `@keyframes borderGradient` (`#2E0854`, `#5B2D90`, `#2962FF`, `#000000`) are intentionally not tokenized.

3. **Left rgba(0,128,128,0) anchors as-is** — The body `background-image` uses `rgba(0,128,128,0)` as transparent anchors in the linear-gradient fade. These are structural "transparent teal" values, not opaque color values — they define gradient transition points and cannot meaningfully be tokenized without breaking the gradient effect.

## Self-Check: PASSED

Files exist:
- FOUND: src/styles/global.css
- FOUND: src/layouts/Layout.astro
- FOUND: src/pages/index.astro

Commits exist:
- FOUND: 671dde1 (tokenize global.css)
- FOUND: 3c0b734 (add data-theme attribute)
