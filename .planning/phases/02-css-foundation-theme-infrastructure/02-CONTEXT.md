# Phase 2: CSS Foundation and Theme Infrastructure - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Tokenize all hardcoded CSS values into CSS custom properties, wire up theme switching via `data-theme` attribute on `<html>`, build a theme switcher UI, and handle persistence (localStorage) and View Transitions survival. The site must look identical to today after the refactor. No new themes are styled in this phase — only the infrastructure and the "Retro" (current) theme token values.

</domain>

<decisions>
## Implementation Decisions

### Theme switcher placement
- **D-01:** On the home page, the Themes button appears as a fourth button in the nav row alongside About, Work, Contact
- **D-02:** On subpages (about, work, contact), the Themes icon appears as a desktop icon (same pattern as the existing Home icon)
- **D-03:** Both entry points open the same mini dialog

### Theme switcher form factor
- **D-04:** Clicking the Themes button/icon opens a small OS-styled mini dialog window
- **D-05:** Dialog contains radio buttons for each theme with the active theme pre-selected
- **D-06:** Theme applies instantly when a radio option is clicked (live preview) — OK button just closes the dialog
- **D-07:** Dialog is keyboard-accessible (tab to options, arrow keys to switch, Enter/Escape to close)

### CSS tokenization scope
- **D-08:** Full tokenization — all visual properties get tokens: colors, fonts, borders, shadows, scrollbar styles, link colors
- **D-09:** The animated gradient border on the splash screen is retro-only — not tokenized. Other themes will define their own border style via tokens
- **D-10:** Background: use the same teal + pixel-grid background for all themes initially, but tokenize it so it can be swapped per-theme later (background color and pattern as separate tokens)
- **D-11:** Title treatment (the 3D perspective "Matt Creenan" text): theme-specific. Retro keeps the dramatic 3D chrome look. Win 3.1 and Win 95 will define their own title styles in their respective phases

### Theme naming
- **D-12:** Current/default theme: "Retro" (`data-theme="retro"`)
- **D-13:** Windows 3.1 theme: "Win 3.1" (`data-theme="win31"`)
- **D-14:** Windows 95 theme: "Win 95" (`data-theme="win95"`)

### Claude's Discretion
- CSS custom property naming convention (e.g., `--theme-bg-primary` vs `--bg-primary`)
- Token organization (flat vs grouped by component)
- Anti-flash script implementation details
- View Transitions theme persistence mechanism
- Dialog overlay/backdrop behavior
- Loading skeleton or transition effects during theme switch

</decisions>

<specifics>
## Specific Ideas

- The mini dialog should feel like an actual OS dialog — themed to match the current theme's chrome
- "I want it like a settings panel you'd see in the actual OS" — the dialog itself should adapt its appearance to the active theme
- On home page, Themes is a peer of About/Work/Contact in the button grid — same size and style

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Theme infrastructure requirements
- `.planning/REQUIREMENTS.md` — INFRA-01 through INFRA-05 define token, state, persistence, and View Transitions requirements
- `.planning/REQUIREMENTS.md` — SWITCH-01 through SWITCH-03 define switcher accessibility and behavior requirements

### Phase success criteria
- `.planning/ROADMAP.md` §Phase 2 — Five success criteria: no visual regression, persistence without flash, instant switching, active indicator, View Transitions preservation

### Current CSS to tokenize
- `src/styles/global.css` — All hardcoded colors, fonts, borders, shadows that need tokenization
- `src/components/Window.astro` — Window chrome component that themes will restyle
- `src/components/Button.astro` — Button component that themes will restyle
- `src/layouts/Layout.astro` — Contains `<html>` element where `data-theme` attribute goes
- `src/components/BaseHead.astro` — Where anti-flash inline script and font preloads live

### Research flags from STATE.md
- `.planning/STATE.md` §Research Flags — Phase 4 flag about `.window` class collision with 98.css needs consideration during tokenization

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Window.astro`: Already abstracts window chrome — adding theme-aware classes here enables per-theme styling
- `Button.astro`: Abstracts buttons — theme tokens can control border, shadow, background
- `HomeIcon.astro`: Desktop icon pattern exists — Themes desktop icon on subpages follows same pattern
- `Layout.astro`: Owns `<html>` element — natural place for `data-theme` attribute and anti-flash script

### Established Patterns
- Global CSS in `src/styles/global.css` imported via `BaseHead.astro` — tokens go here
- View Transitions via `<ViewTransitions />` in BaseHead — theme must persist across transitions
- Component composition via `<slot />` — dialog component can follow same pattern
- Desktop icons are fixed-position anchors with `.desktop-icon` class

### Integration Points
- `Layout.astro` `<html>` tag: add `data-theme` attribute
- `BaseHead.astro` `<head>`: add anti-flash inline `<script>` before any stylesheets
- `global.css`: refactor all hardcoded values to CSS custom properties under `:root` / `[data-theme]` selectors
- Home page (`index.astro`): add Themes button to nav button grid
- Subpage layout: add Themes desktop icon alongside Home icon

</code_context>

<deferred>
## Deferred Ideas

- Theme-specific cursor styles — captured as THEME-02 in future requirements
- Theme-specific sound effects — captured as THEME-03 in future requirements
- Smooth CSS transition animation between themes — captured as THEME-01 in future requirements
- Theme persistence across sessions noted as nice-to-have in PROJECT.md out-of-scope, but INFRA-04 actually requires it via localStorage — no conflict, it's in scope

</deferred>

---

*Phase: 02-css-foundation-theme-infrastructure*
*Context gathered: 2026-03-21*
