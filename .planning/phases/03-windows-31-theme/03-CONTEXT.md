# Phase 3: Windows 3.1 Theme - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can switch to an authentic Windows 3.1 aesthetic with flat gray chrome, solid navy title bars, period-accurate bitmap fonts, and a Program Manager-style desktop. Clicking section icons navigates to subpages rendered in Win 3.1 window chrome. This phase delivers CSS token overrides under `[data-theme="win31"]`, pixel art icon assets, a bitmap font, and the Program Manager layout component. No new application logic beyond the menu bar dropdown for theme switching.

</domain>

<decisions>
## Implementation Decisions

### Program Manager layout
- **D-01:** Flat icon grid inside a single Program Manager window — no nested group sub-windows
- **D-02:** About, Work, and Contact appear as 32x32 pixel art icons in the 16-color Win 3.1 palette
- **D-03:** Program Manager has a menu bar with File, Options, Window, Help labels
- **D-04:** Only the Options menu is functional — it contains a "Change Theme..." item that opens the existing theme dialog
- **D-05:** File, Window, and Help labels are visual-only (not clickable)
- **D-06:** Menu bar appears only on the Program Manager (home page), not on subpage windows

### Icon navigation
- **D-07:** Clicking a Program Manager icon navigates to the corresponding page URL (e.g., /about) — same routing as other themes
- **D-08:** No overlay/SPA window behavior in this phase — that's Phase 5 territory

### Window chrome
- **D-09:** Title bars have a control menu box [-] on the left and minimize/maximize arrow buttons on the right — all visual-only (decorative)
- **D-10:** Flat gray chrome with thick black outer border, solid navy (#000080) title bars, white title text
- **D-11:** No beveling or gradients anywhere — strictly flat Win 3.1 aesthetic

### Subpage windows
- **D-12:** Subpages (About, Work, Contact) render as centered floating windows with visible desktop background behind them
- **D-13:** Subpage windows have Win 3.1 title bars but no menu bar
- **D-14:** Home navigation via both: a desktop icon visible on the background AND a close/minimize button on the title bar that navigates home

### Typography
- **D-15:** UI elements (title bars, buttons, labels, menu bar) use an MS Sans Serif web font clone (WOFF file, ~20KB)
- **D-16:** Body/content text also uses the same bitmap font — fully immersive Win 3.1 experience
- **D-17:** Fallback: graceful degradation to Arial/sans-serif if the WOFF fails to load (font-display: swap)
- **D-18:** Home page title ("Matt Creenan") styled like a Win 3.1 title bar — navy background, white bitmap text

### Desktop and color palette
- **D-19:** Desktop background uses the same teal + pixel-grid pattern as the retro theme (shared via existing CSS tokens)
- **D-20:** Chrome uses exact Win 3.1 system colors: #C0C0C0 (silver gray), #000080 (navy), #FFFFFF (white text), #808080 (dark gray borders)
- **D-21:** Links use Win 3.1 Help-style green underlined text for period-authentic hyperlink appearance
- **D-22:** Scrollbars styled to match Win 3.1 — flat gray with black arrow buttons and flat gray thumb (CSS scrollbar styling)

### Claude's Discretion
- Pixel art icon creation approach (inline SVG, CSS sprites, or static image files)
- MS Sans Serif WOFF source selection and licensing verification
- Menu bar dropdown implementation details (CSS-only vs minimal JS)
- Exact spacing, padding, and sizing of window chrome elements
- How the floating window centers on various screen sizes
- Scrollbar CSS compatibility approach across browsers

</decisions>

<specifics>
## Specific Ideas

- Program Manager should feel immediately recognizable to anyone who used Windows 3.1 — the flat gray, navy title bars, and bitmap font are the key signals
- The menu bar "Options > Change Theme..." mirrors how you'd actually change settings in a Win 3.1 app
- Title treatment for "Matt Creenan" as a title bar is a nice touch — makes the name feel like part of the OS chrome
- Icons should be hand-crafted 32x32 pixel art in the authentic 16-color palette, not generic emoji or CSS approximations

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Windows 3.1 theme requirements
- `.planning/REQUIREMENTS.md` — WIN31-01 through WIN31-04 define chrome, buttons, font, and Program Manager requirements

### Phase success criteria
- `.planning/ROADMAP.md` §Phase 3 — Four success criteria: flat gray chrome with navy title bars, Win3.1 button style, bitmap font on UI labels, Program Manager with icon groups

### Theme infrastructure (Phase 2 foundation)
- `.planning/phases/02-css-foundation-theme-infrastructure/02-CONTEXT.md` — All Phase 2 decisions including token architecture, theme switcher dialog, naming conventions
- `src/styles/global.css` — Current CSS tokens under `[data-theme="retro"]` that Phase 3 mirrors with win31 values
- `src/components/Window.astro` — Window chrome component to restyle
- `src/components/Button.astro` — Button component to restyle
- `src/components/ThemeDialog.astro` — Theme dialog already has win31 radio option wired up
- `src/components/BaseHead.astro` — Anti-flash script and font preload location

### Research flags from STATE.md
- `.planning/STATE.md` §Research Flags — "Win3.1 bitmap font fallback behavior across browsers/OS not fully confirmed"

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ThemeDialog.astro`: Already has win31 radio option — no dialog changes needed
- `BaseHead.astro`: Anti-flash script already handles win31 theme value from localStorage
- `global.css` `[data-theme="retro"]` block: Pattern to follow for `[data-theme="win31"]` token definitions
- `Window.astro`: Slot-based composition — chrome restyling is purely CSS
- `Button.astro`: Token-driven styling — win31 tokens will override border, shadow, background
- `HomeIcon.astro`: Desktop icon pattern for subpage home navigation

### Established Patterns
- Theme tokens defined as CSS custom properties under `[data-theme="..."]` selector in global.css
- Component-scoped styles via `[data-theme="win31"] .window` etc.
- Font preloading via `<link rel="preload">` in BaseHead.astro
- Google Fonts loaded via CSS import in BaseHead — bitmap font can follow similar or use local WOFF

### Integration Points
- `global.css`: Add `[data-theme="win31"]` token block with all color, font, border, shadow overrides
- `global.css`: Add win31-specific component rules (`.window`, `.button`, menu bar, Program Manager)
- `BaseHead.astro`: Add WOFF font preload for MS Sans Serif clone
- `index.astro`: Conditionally render Program Manager layout when win31 theme active (or new component)
- Subpage layouts: Win31 floating window positioning distinct from retro fixed positioning

</code_context>

<deferred>
## Deferred Ideas

- Opening sections as overlay windows on the desktop without navigation — Phase 5 (SHELL-02)
- Draggable/resizable windows — Out of Scope per REQUIREMENTS.md
- Functional File/Window/Help menus with real actions — could be a future enhancement but not in scope
- Win 3.1 specific cursor styles — captured as THEME-02 in future requirements

</deferred>

---

*Phase: 03-windows-31-theme*
*Context gathered: 2026-03-21*
