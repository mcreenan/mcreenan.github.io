---
phase: 05-desktop-shell-polish
plan: 01
subsystem: desktop-overlay
tags: [overlay, fetch, history-api, focus-trap, accessibility]
dependency_graph:
  requires: [04-02]
  provides: [overlay-window-system]
  affects: [src/pages/index.astro, src/styles/global.css]
tech_stack:
  added: []
  patterns: [dual-chrome-overlay, content-fetch-cache, history-pushState, focus-trap]
key_files:
  created: []
  modified:
    - src/pages/index.astro
    - src/styles/global.css
decisions:
  - Dual-chrome approach for overlay — both win31 and win95 markup present, CSS toggles visibility by theme
  - Static title lookup map instead of DOM selector extraction — avoids fragility
  - Content fetched from same-origin static pages and cached in Map
  - Focus trap cycles Tab/Shift+Tab within overlay focusable elements
metrics:
  duration: 1m
  completed: "2026-04-04"
  tasks: 2
  files: 2
---

# Phase 05 Plan 01: Desktop Overlay System Summary

Desktop overlay window system with dual-chrome markup, content fetch via DOMParser with Map cache, History API URL sync, focus trap, and four dismissal methods (Escape, close button, backdrop click, back button).

## Completed Tasks

| # | Task | Commit | Key Changes |
|---|------|--------|-------------|
| 1 | Add overlay container markup and CSS styles | 73de4d1 | Dual-chrome overlay div in index.astro; overlay positioning, backdrop, theme-gated visibility in global.css |
| 2 | Implement overlay controller JS | 3b04550 | ~120 lines of bundled JS: fetch+cache, pushState/popstate, focus trap, all dismissal methods, retro theme gate |

## Implementation Details

### Overlay Container (Task 1)
- Added `#overlay-window` div with `role="dialog"` `aria-modal="true"` and `hidden` attribute
- Contains two chrome variants: `.overlay-chrome-win31` (flat gray window) and `.overlay-chrome-win95` (beveled 98.css window)
- Both contain `.overlay-title` and `.overlay-body` elements populated by JS
- CSS: fixed positioning, z-index 100 (below taskbar at 9999), flex centering
- Win95 variant clears taskbar with `bottom: 28px`
- Theme-gated visibility: `[data-theme="win31"]` shows win31 chrome, `[data-theme="win95"]` shows win95 chrome

### Overlay Controller (Task 2)
- Click handlers on `.pm-icon` and `.win95-icon` with `preventDefault` + `stopPropagation`
- Content fetched via `fetch()` + `DOMParser`, extracting `.window-content` innerHTML
- Results cached in `Map<string, { title, html }>` to avoid re-fetching
- Title lookup via static map: `{ '/about': 'About Me', '/work': 'Work', '/contact': 'Contact' }`
- `history.pushState({ overlayUrl }, '', url)` on open; `history.back()` on user-initiated close
- `popstate` handler calls `closeOverlay(true)` to avoid double history.back()
- Focus trap: Tab/Shift+Tab cycle within overlay focusable elements
- Focus returns to trigger icon on close
- Retro theme gate: `initDesktopOverlay()` returns early if theme is not win31/win95
- `astro:after-swap` listener reinitializes overlay system for View Transitions

## Decisions Made

1. **Dual-chrome overlay** — Both win31 and win95 markup rendered, CSS toggles visibility. Simpler than runtime DOM generation.
2. **Static title map** — `TITLE_MAP` avoids fragile DOM selector extraction from fetched pages.
3. **Module-scoped cache** — `contentCache` Map persists across overlay opens within same page session, cleared on View Transition swap.
4. **Focus to close button** — On overlay open, focus moves to the close button in the visible chrome variant.

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

All files exist, all commits verified.
