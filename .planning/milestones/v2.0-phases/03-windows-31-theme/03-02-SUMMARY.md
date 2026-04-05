---
phase: 03-windows-31-theme
plan: 02
subsystem: ui
tags: [astro, win31, program-manager, pixel-art, theme, menu-bar]

# Dependency graph
requires:
  - phase: 03-windows-31-theme
    provides: W95FA font, win31 CSS tokens, Window.astro variant prop, all component override rules
provides:
  - ProgramManager.astro component with menu bar and 32x32 pixel art icon grid
  - index.astro retro-layout / program-manager CSS toggle wiring
  - Win31 chrome buttons on about, work, contact subpages
  - Options menu item triggering theme dialog via openThemeDialog()
affects: [04-windows-95-theme, 05-desktop-shell-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [CSS display toggle for theme-specific layouts, inline SVG pixel art icons]

key-files:
  created:
    - src/components/ProgramManager.astro
  modified:
    - src/pages/index.astro
    - src/pages/about.astro
    - src/pages/work.astro
    - src/pages/contact.astro
    - src/styles/global.css

key-decisions:
  - "ProgramManager.astro uses inline SVG pixel art (not external images) for zero-dependency icons"
  - "Menu bar uses :focus-within CSS for dropdown, no JavaScript"
  - "Subpage chrome buttons are default-hidden via CSS, shown only under [data-theme='win31']"

patterns-established:
  - "Theme-specific layout toggle: render both layouts, CSS display:none/flex toggles visibility based on data-theme"
  - "Inline SVG pixel art: 32x32 viewBox with crisp-edges rendering for retro icons"

requirements-completed: [WIN31-04, WIN31-01]

# Metrics
duration: 3min
completed: 2026-04-04
---

# Phase 03 Plan 02: ProgramManager & Subpage Win31 Chrome Summary

**Program Manager window with menu bar and 32x32 pixel art icons on home page, win31 chrome buttons on all subpages, CSS display toggle between retro and win31 layouts**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-04T00:00:00Z
- **Completed:** 2026-04-04T00:03:00Z
- **Tasks:** 3 (2 auto + 1 human-verify)
- **Files modified:** 6

## Accomplishments
- ProgramManager.astro component with Win 3.1 window chrome, menu bar (File, Options, Window, Help), and icon grid with About/Work/Contact pixel art icons
- Options menu dropdown with "Change Theme..." triggering window.openThemeDialog()
- index.astro wired with retro-layout wrapper and ProgramManager sibling for CSS theme toggle
- Subpages (about, work, contact) updated with win31 chrome buttons (control box, decorative arrows) hidden by default
- Human visual verification passed — complete Win 3.1 theme approved

## Task Commits

All code was implemented during Plan 01 execution (commits f9fdb0a, 75116ef and prior). Plan 02 tasks verified the code was complete and conducted human visual verification.

1. **Task 1: Create ProgramManager.astro and wire into index.astro** - (pre-existing in c1b9007)
2. **Task 2: Update subpages with win31 title bar chrome buttons** - (pre-existing in c1b9007)
3. **Task 3: Verify complete Windows 3.1 theme visually** - Human verification passed ✓

## Files Created/Modified
- `src/components/ProgramManager.astro` - Win 3.1 Program Manager with menu bar and pixel art icon grid
- `src/pages/index.astro` - Retro-layout wrapper + ProgramManager component for theme toggle
- `src/pages/about.astro` - Win31 chrome buttons in title bar (default hidden)
- `src/pages/work.astro` - Win31 chrome buttons in title bar (default hidden)
- `src/pages/contact.astro` - Win31 chrome via Window.astro variant prop
- `src/styles/global.css` - Default-hidden rules for win31-titlebar-left/right

## Decisions Made
None - followed plan as specified. All code was already implemented during Plan 01.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - all code from Plan 01 satisfied Plan 02 acceptance criteria.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Complete Windows 3.1 theme functional and human-verified
- Ready for Phase 04 (Windows 95 Theme) — 98.css integration, beveled chrome, taskbar
- Win31 variant prop pattern established for Window.astro, reusable for win95 variant

---
*Phase: 03-windows-31-theme*
*Completed: 2026-04-04*
