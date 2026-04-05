---
quick: 260405-cvh
subsystem: ui
tags: [css, retina, high-dpi, zoom, win31, win95]

key-files:
  modified:
    - src/styles/global.css

key-decisions:
  - "Used CSS zoom: 1.5 on themed containers instead of rewriting every pixel value"
  - "Verified scaling interactively with Chrome DevTools MCP"

duration: 20min
completed: 2026-04-05
---

# Quick Task 260405-cvh Summary

**Scaled win31/win95 themes 1.5x using CSS zoom for retina/high-DPI displays**

## Performance

- **Duration:** ~20 min (including iteration on scale factor)
- **Completed:** 2026-04-05
- **Files modified:** 1

## Accomplishments
- Applied `zoom: 1.5` to all win31 and win95 themed containers via 24 lines of CSS
- Scaled Program Manager, Win95 desktop, taskbar, windows, overlays, theme dialogs
- Verified visually using Chrome DevTools MCP screenshots at 1680x817 / DPR 2
- Retro theme untouched

## Approach
Initially tried 4x (too big per user feedback), then 1.75x (too big), then 1.25x (too subtle), landed on 1.5x. Using `zoom` on wrapper containers is cleaner than editing 50+ individual pixel values — all coupled values (taskbar height + padding-bottom offsets, icon SVG + labels) scale together automatically.

## Files Created/Modified
- `src/styles/global.css` - Added 24 lines of zoom rules at end of file

## Commit
- `7c09045` feat(quick-260405-cvh): scale win31/win95 themes 1.5x for retina/high-DPI displays

## Issues Encountered
Three iterations on scale factor due to subjective "right feel":
- 4x: way too big
- 1.75x: way too big
- 1.25x: too subtle
- 1.5x: just right

---
*Quick task: 260405-cvh*
*Completed: 2026-04-05*
