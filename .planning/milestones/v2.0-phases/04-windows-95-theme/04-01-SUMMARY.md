---
phase: 04-windows-95-theme
plan: 01
subsystem: ui
tags: [98.css, win95, css-tokens, window-chrome, astro-components]

# Dependency graph
requires:
  - phase: 02-css-foundation-theme-infrastructure
    provides: CSS token system with [data-theme] scoping pattern
  - phase: 03-windows-31-theme
    provides: W95FA font files and @font-face declaration, Window.astro variant pattern
provides:
  - 98.css installed as dependency
  - Complete [data-theme="win95"] CSS token block with all custom properties
  - Cherry-picked 98.css window chrome, title bar, button bevel rules scoped under win95
  - Window.astro variant="win95" with 98.css markup and three-button title bar
affects: [04-02-PLAN, win95-desktop, win95-taskbar]

# Tech tracking
tech-stack:
  added: [98.css v0.1.21]
  patterns: [98.css cherry-pick scoping, conditional component markup by variant]

key-files:
  created: []
  modified:
    - src/styles/global.css
    - src/components/Window.astro
    - package.json
    - bun.lock

key-decisions:
  - "Cherry-picked 98.css selectors into scoped [data-theme='win95'] block rather than importing full stylesheet globally"
  - "Button bevel scoped to .button class (not bare button element) to avoid styling theme dialog buttons too broadly"
  - "Win95 Window.astro uses completely separate markup branch with 98.css class names (.title-bar, .window-body) instead of retro/win31 names"

patterns-established:
  - "98.css cherry-pick: copy only needed selectors from dist, prefix with [data-theme='win95']"
  - "Win95 Window variant: conditional rendering with different markup structure, not just CSS overrides"

requirements-completed: [WIN95-01, WIN95-02, WIN95-03]

# Metrics
duration: 3min
completed: 2026-04-05
---

# Phase 4 Plan 1: Win95 CSS Foundation Summary

**98.css cherry-picked into [data-theme="win95"] scope with beveled window chrome, button styles, W95FA font tokens, and Window.astro win95 variant using 98.css markup structure**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-05T00:22:15Z
- **Completed:** 2026-04-05T00:25:14Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Installed 98.css v0.1.21 and cherry-picked window, title bar, button, and control button SVG icon rules scoped under [data-theme="win95"]
- Created complete win95 CSS token block (23 scoped selectors) matching retro/win31 custom property pattern
- Extended Window.astro with variant="win95" rendering 98.css markup with three-button title bar cluster (minimize, maximize, close)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install 98.css and create [data-theme="win95"] CSS block** - `2f8fbaf` (feat)
2. **Task 2: Extend Window.astro with variant="win95" branch** - `ac3d8d0` (feat)

## Files Created/Modified
- `package.json` - Added 98.css v0.1.21 dependency
- `bun.lock` - Updated lockfile with 98.css
- `src/styles/global.css` - Added [data-theme="win95"] token block and all cherry-picked 98.css rules (window chrome, title bar gradient, button bevel, splash screen, theme dialog, headshot, os-title overrides)
- `src/components/Window.astro` - Added variant="win95" conditional branch with 98.css class names and three-button title bar

## Decisions Made
- Cherry-picked 98.css selectors into scoped block rather than global import (full 98.css sets :root variables and body styles that break retro/win31 themes)
- Button bevel scoped to .button class not bare button element to avoid styling theme dialog buttons
- Win95 close button uses onclick="window.location='/'" instead of anchor tag to preserve 98.css button[aria-label="Close"] selector matching for SVG icon

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Win95 CSS foundation complete with all tokens and scoped 98.css rules
- Window.astro ready for use with variant="win95" in pages
- Plan 02 can build Win95Desktop.astro and Taskbar.astro components on top of this foundation

## Self-Check: PASSED

All files exist, all commits verified, SUMMARY created.

---
*Phase: 04-windows-95-theme*
*Completed: 2026-04-05*
