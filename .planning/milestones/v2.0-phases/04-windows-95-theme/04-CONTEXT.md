# Phase 4: Windows 95 Theme - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can switch to an authentic Windows 95 aesthetic featuring 98.css-powered beveled 3D window chrome, a navy-to-teal gradient title bar, a taskbar with Start button and live clock, and desktop icons for each section. This phase delivers 98.css integration scoped under `[data-theme="win95"]`, a Taskbar component, desktop icon layout, and win95 window chrome overrides. The W95FA font from Phase 3 is reused. The theme dialog's existing `win95` radio option becomes functional.

</domain>

<decisions>
## Implementation Decisions

### 98.css Integration
- **D-01:** Install 98.css as NPM package, scope all rules under `[data-theme="win95"]` to avoid global collision
- **D-02:** The `.window` class collision (flagged in STATE.md) is handled by scoping 98.css under the `[data-theme="win95"]` selector — Phase 2 already scoped existing `.window` under `[data-theme="retro"]`
- **D-03:** Selective import of 98.css — only window, button, and title bar styles needed, avoid importing full stylesheet
- **D-04:** Classic navy-to-teal gradient title bar (`#000080` to `#1084d0`) per actual Windows 95

### Taskbar & Desktop Layout
- **D-05:** Static HTML/CSS taskbar at bottom of screen — Start button area (decorative, non-functional) with "Start" label and Windows flag icon
- **D-06:** Live clock in taskbar system tray area — minimal JS with `setInterval` updating every minute, formatted as "12:34 PM"
- **D-07:** Desktop icons are 48x48 pixel art (larger than Win31's 32x32) using 16-color Win95 palette
- **D-08:** Desktop icons placed in centered grid on desktop area above the taskbar — consistent with Win31 approach

### Typography & Polish
- **D-09:** Reuse W95FA font already installed from Phase 3 — same font works for both Win31 and Win95 themes
- **D-10:** Theme switcher accessible via right-click context menu or Start button containing "Change Theme..." — mirrors Win95's desktop properties pattern
- **D-11:** Window subpages have three-button cluster (minimize, maximize, close) — close button links home (matches Win31 pattern where [-] links home)

### Claude's Discretion
- 98.css selective import approach (CSS layer, manual cherry-pick, or build-time extraction)
- Taskbar HTML structure and exact positioning (fixed bottom, flex layout)
- Desktop icon pixel art designs for 48x48 size
- Start button Windows flag icon implementation (inline SVG or CSS)
- Context menu implementation details (CSS + minimal JS)
- Window button cluster sizing and spacing

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ThemeDialog.astro`: Already has `win95` radio option wired up — becomes functional when CSS tokens are defined
- `BaseHead.astro`: Anti-flash script already handles win95 theme value from localStorage
- `global.css` `[data-theme="win31"]` block: Pattern to follow for `[data-theme="win95"]` token definitions
- `Window.astro`: Has `variant` prop supporting "retro" | "win31" — extend with "win95"
- `ProgramManager.astro`: Win31 Program Manager pattern — Win95 desktop reuses icon grid concept
- `W95FA font`: Already installed (woff/woff2 in public/fonts/) with @font-face and preload

### Established Patterns
- Theme tokens as CSS custom properties under `[data-theme="..."]` selector in global.css
- Component-scoped overrides via `[data-theme="win95"] .window` etc.
- Variant prop pattern on Window.astro for structurally different markup per theme
- CSS display toggle for theme-specific layouts (retro-layout vs program-manager)
- Inline SVG pixel art for icons (established in ProgramManager.astro)

### Integration Points
- `global.css`: Add `[data-theme="win95"]` token block + 98.css scoped overrides
- `Window.astro`: Add `variant="win95"` with three-button cluster markup
- `index.astro`: Add Win95 desktop layout with taskbar (alongside retro-layout and program-manager)
- `BaseHead.astro`: Import 98.css (scoped)
- Subpage layouts: Win95 window chrome with three-button cluster

</code_context>

<specifics>
## Specific Ideas

- The 98.css library provides authentic Win95 beveled chrome out of the box — selective import keeps bundle small
- Taskbar should feel immediately recognizable: gray beveled bar, indented Start button, sunken clock area
- Desktop icons at 48x48 are more readable than 32x32 and match actual Win95 icon dimensions
- The three-button window cluster (minimize/maximize/close) is iconic to Win95 — close links home like Win31's [-] button

</specifics>

<deferred>
## Deferred Ideas

- Functional Start menu with app list — keep it decorative for this phase
- Taskbar window buttons (showing open windows) — out of scope per REQUIREMENTS.md
- Draggable/resizable windows — Out of Scope per REQUIREMENTS.md
- Theme-specific cursor styles — captured as THEME-02 in future requirements
- System tray icons beyond clock — future enhancement

</deferred>

---

*Phase: 04-windows-95-theme*
*Context gathered: 2026-04-04*
