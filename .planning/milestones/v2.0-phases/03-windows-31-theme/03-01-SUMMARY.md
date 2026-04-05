---
phase: 03-windows-31-theme
plan: 01
subsystem: ui
tags: [css, fonts, win31, theme, bitmap-font, w95fa]

# Dependency graph
requires:
  - phase: 02-css-foundation-theme-infrastructure
    provides: CSS token system, data-theme attribute, theme switcher UI
provides:
  - W95FA bitmap font files (woff, woff2)
  - Complete [data-theme="win31"] CSS token block (35 custom properties)
  - Win31 component overrides (window, titlebar, buttons, scrollbars, headshot, theme dialog)
  - Program Manager, menu bar, and icon grid CSS rules
  - Window.astro variant prop for win31 title bar chrome
  - Font preload in BaseHead.astro
affects: [03-02, 04-windows-95-theme]

# Tech tracking
tech-stack:
  added: [W95FA bitmap font]
  patterns: [data-theme selector scoping for win31, variant prop pattern for component theming]

key-files:
  created:
    - public/fonts/w95fa.woff
    - public/fonts/w95fa.woff2
  modified:
    - src/styles/global.css
    - src/components/BaseHead.astro
    - src/components/Window.astro

key-decisions:
  - "W95FA font sourced from verkcuos/w95fa GitHub repo (OFL licensed), OTF converted to WOFF via fonttools"
  - "Win31 title bar uses same .window-titlebar class as retro, with CSS overrides for flat navy styling"
  - "[-] chrome button is functional home link on contentWindow pages, decorative span otherwise"

patterns-established:
  - "Variant prop pattern: components accept variant='retro'|'win31' to render structurally different markup"
  - "Win31 CSS overrides: use [data-theme='win31'] prefix, flat styling with no gradients/shadows/transforms"

requirements-completed: [WIN31-01, WIN31-02, WIN31-03]

# Metrics
duration: 3min
completed: 2026-03-22
---

# Phase 03 Plan 01: Win 3.1 CSS Foundation Summary

**W95FA bitmap font, complete win31 CSS token block with 41 selectors, and Window.astro variant prop for authentic Win 3.1 flat gray chrome**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-22T03:43:28Z
- **Completed:** 2026-03-22T03:46:23Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Added W95FA bitmap font files (woff/woff2) and @font-face declaration with font-display: swap
- Defined complete [data-theme="win31"] CSS token block with 35 custom properties covering colors, typography, borders, shadows, and backgrounds
- Added 41 win31-scoped component override rules covering window chrome, title bars, buttons, scrollbars, theme dialog, program manager, menu bar, and icon grid
- Added variant prop to Window.astro enabling structurally different win31 title bar with decorative chrome buttons

## Task Commits

Each task was committed atomically:

1. **Task 1: Add W95FA font files, @font-face, font preload, and complete win31 CSS** - `f9fdb0a` (feat)
2. **Task 2: Add variant prop to Window.astro for Win 3.1 title bar chrome** - `75116ef` (feat)

## Files Created/Modified
- `public/fonts/w95fa.woff` - W95FA bitmap font in WOFF format (9.7KB)
- `public/fonts/w95fa.woff2` - W95FA bitmap font in WOFF2 format (7.9KB)
- `src/styles/global.css` - @font-face declaration, win31 token block, all component overrides
- `src/components/BaseHead.astro` - W95FA font preload link
- `src/components/Window.astro` - variant prop with win31 title bar conditional rendering

## Decisions Made
- W95FA font sourced from verkcuos/w95fa GitHub repo (OFL-licensed); OTF converted to WOFF via Python fonttools since only woff2 was available in repo
- Win31 title bar reuses .window-titlebar class so CSS overrides apply automatically (navy background, 18px height, margin:0)
- [-] chrome button is a functional `<a href="/">` home link on contentWindow pages per D-14, decorative `<span>` with aria-hidden on non-content pages per D-09

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- CDNFonts blocked by Cloudflare challenge page; resolved by sourcing font from verkcuos/w95fa GitHub repository and converting OTF to WOFF using fonttools

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Complete win31 CSS foundation ready for Plan 02 (ProgramManager component and page wiring)
- All token values, component overrides, menu bar, icon grid, and chrome button styles are in place
- Window.astro accepts variant="win31" for use by ProgramManager and themed pages

## Self-Check: PASSED

- FOUND: public/fonts/w95fa.woff
- FOUND: public/fonts/w95fa.woff2
- FOUND: f9fdb0a (Task 1 commit)
- FOUND: 75116ef (Task 2 commit)

---
*Phase: 03-windows-31-theme*
*Completed: 2026-03-22*
