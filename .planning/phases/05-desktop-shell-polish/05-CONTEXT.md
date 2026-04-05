# Phase 5: Desktop Shell and Polish - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

The app-launcher metaphor is completed for both Windows themes: desktop icons open section content as overlay windows on the desktop (not page navigation), with History API URL updates and keyboard accessibility. The retro theme is unaffected — it keeps its current page navigation. The theme switcher gets visible focus states and full keyboard navigation. This phase delivers client-side JS for overlay windows, focus trap, History API integration, and keyboard accessibility polish across all themes.

</domain>

<decisions>
## Implementation Decisions

### Overlay Window Behavior
- **D-01:** Overlay windows fetch page content via JS — Astro pages serve static HTML, fetch the page, extract `.window-content`, render in a themed overlay div on the desktop
- **D-02:** Keep page navigation as fallback — icons navigate normally if JS fails; with JS, click is intercepted to show overlay. Progressive enhancement.
- **D-03:** Update URL with History API (pushState to /about, /work, /contact) — back button closes overlay, direct URL access loads the full page normally
- **D-04:** Overlays are dismissible via click outside, Escape key, or close button in title bar

### Keyboard Accessibility
- **D-05:** Theme switcher: Tab to reach dialog trigger, Enter to open, arrow keys between theme options, Escape to close — standard dialog keyboard pattern (native `<dialog>` handles most of this)
- **D-06:** Desktop icons are keyboard-navigable with Tab and visible focus ring — `tabindex="0"` and `:focus-visible` styles on icon grid items
- **D-07:** Overlay windows trap focus when open — standard modal accessibility pattern, focus returns to trigger element on close

### Cross-Theme Polish
- **D-08:** Theme switcher position is consistent per theme — palette icon (retro), Options menu (win31), right-click (win95) are already theme-specific access points; no changes needed
- **D-09:** No animation when switching themes — instant switch matches authentic OS feel
- **D-10:** No extra visual indicator of current theme — the entire visual chrome IS the indicator

### Claude's Discretion
- Overlay window positioning and sizing (centered, max-width, scrollable content area)
- Focus trap implementation approach (manual JS or use a lightweight library)
- How overlay content is extracted from fetched pages (querySelector strategy)
- History API popstate handler implementation details
- How to handle overlay state during View Transitions
- Desktop icon focus ring styling per theme (consistent or theme-specific)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Window.astro`: Has variant props for retro/win31/win95 — overlay can reuse window chrome markup
- `ThemeDialog.astro`: Uses native `<dialog>` with `showModal()` — good pattern to follow for overlay
- `ProgramManager.astro`: Win31 desktop icons with inline SVG pixel art
- `Win95Desktop.astro`: Win95 desktop icons with contextmenu handler
- `Taskbar.astro`: Has `astro:after-swap` handler pattern for View Transitions

### Established Patterns
- Theme-specific CSS via `[data-theme="..."]` selectors
- CSS display toggle for theme-specific layouts
- `window.openThemeDialog()` global function pattern
- View Transitions with `astro:after-swap` event handlers
- Anti-flash inline script in BaseHead.astro

### Integration Points
- `ProgramManager.astro` icon links: intercept click events for overlay in win31 theme
- `Win95Desktop.astro` icon links: intercept click events for overlay in win95 theme
- `index.astro`: Overlay container needs to be added to the page
- `global.css`: Overlay window styles, focus ring styles, keyboard accessibility styles
- `BaseHead.astro` or a new client script: Overlay JS logic

</code_context>

<specifics>
## Specific Ideas

- Overlay should feel like opening a window on the desktop — content appears in a themed window overlaid on the icons/desktop background
- The window should use the same chrome as subpage windows (win31 flat gray, win95 beveled)
- Progressive enhancement is key — the site works without JS (page navigation), JS adds the overlay experience
- Focus trap should handle Tab and Shift+Tab cycling within the overlay

</specifics>

<deferred>
## Deferred Ideas

- Draggable/resizable overlay windows — Out of Scope per REQUIREMENTS.md
- Multiple simultaneous overlay windows — Out of Scope
- Minimize to taskbar — Future enhancement
- Theme-specific cursor styles — THEME-02 in future requirements
- Transition animations between themes — D-09 explicitly deferred

</deferred>

---

*Phase: 05-desktop-shell-polish*
*Context gathered: 2026-04-04*
