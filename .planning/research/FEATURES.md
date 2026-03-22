# Feature Research

**Domain:** Switchable OS theme system for personal portfolio static site (Astro)
**Researched:** 2026-03-21
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features a visitor to a retro-OS-themed portfolio expects. Missing these breaks the illusion and makes the theme feel half-finished.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Theme switcher accessible from all pages | If a theme exists, users expect to be able to switch from wherever they are | LOW | Single component in Layout.astro; rendered once globally |
| Windows 95 beveled window chrome | Win95 is the most recognizable retro OS; flat windows would feel wrong | MEDIUM | `box-shadow: inset` with 4-layer bevel; pixel-perfect border spec from 98.css confirmed |
| Windows 95 navy title bar with gradient | The navy-to-teal gradient title bar is the defining Win95 visual signature | LOW | `background: linear-gradient(90deg, #000080, #1084d0)` with white bold text |
| Windows 3.1 flat grey window chrome | Win3.1 is distinctly flat and low-color; adding bevels breaks authenticity | MEDIUM | Solid `#c0c0c0` background, thick `2px solid #000` borders, no box-shadow |
| Windows 3.1 navy title bar (solid, no gradient) | Win3.1 used solid navy `#000080`, not the Win95 gradient — key visual distinction | LOW | Solid `background: #000080`, white text, no close/min/max buttons in v2.0 |
| Period-accurate fonts | Font is the fastest signal of era accuracy; wrong font breaks the illusion immediately | MEDIUM | Win95/98: "Pixelated MS Sans Serif" (from 98.css) or fallback "Arial" at 11px, -webkit-font-smoothing: none; Win3.1: "Fixedsys" or "Courier New" monospace fallback |
| Teal `#008080` desktop background | Both Win3.1 and Win95 used this exact teal as desktop wallpaper — already in the current site | NONE | Already implemented in `global.css` as `background-color: #008080` |
| Desktop icons for section navigation in Windows themes | Program Manager (Win3.1) and desktop icons (Win95) are the standard navigation metaphor for these OSes | HIGH | Replaces the current Button.astro navigation with desktop-icon-style section launchers |
| Content sections render as themed windows | The whole point of the app metaphor is that About/Work/Contact appear as "open apps" | HIGH | Each page renders inside a Window.astro styled per the active theme |
| Current retro theme preserved as default | The existing site already has a personality; preserving it as an option respects existing design investment | LOW | CSS vars refactor should make retro theme identical to current, just var-driven |

### Differentiators (Competitive Advantage)

Features that make this portfolio memorable and worth sharing. Not expected, but create the "send this to a friend" moment.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Windows 95 taskbar with Start button | The taskbar is the single most recognizable Win95 UI element; including it makes the theme feel complete rather than partial | HIGH | Start button, clock, and "active app" label in taskbar; acts as persistent footer navigation |
| Win95 title bar minimize/close button icons | The three control buttons (close is the X, no maximize for portfolio) add authenticity | MEDIUM | Pure CSS button icons using SVG backgrounds (98.css approach) or Unicode approximations |
| Theme-specific window title text | Each page/section has a themed app name ("About Me — Notepad", "My Work — File Manager") that changes per OS | LOW | Simple prop passed to Window.astro; fun detail that rewards theme switching |
| Win3.1 Program Manager icon grid layout | Presenting section icons in a Program Manager-style group window replicates the Win3.1 startup experience | HIGH | Nested MDI-style container; desktop icons inside a "group window" |
| Inactive window title bar (grey) when switching focus | Win95 and Win3.1 both showed inactive windows with `#808080` grey title bars | LOW | CSS `:not(:focus-within)` or a static "active" class on current page window |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Draggable/resizable windows | Authentic OS simulation; "real" windows can be moved | Requires substantial JS (drag, resize, z-index stacking, clamp to viewport). Adds no content value — portfolio content is not benefited by the user dragging windows around. Scope-explosion risk for v2.0 | Render each page as a maximized window filling the desktop area. The OS chrome is present; window management is not. Can be added in v3.0+ if desired |
| Multi-window MDI (multiple windows open simultaneously) | Win3.1 and Win95 supported multiple open apps | Requires tracking open window state in JS, z-index management, and a way to open windows without full page navigation. Architecture complexity doubles | One "app" open at a time (= current page). Desktop icons navigate to new pages. This is simpler and still authentic-feeling |
| Real Start Menu with nested submenus | Win95 Start Menu had program groups and submenus | Full Start Menu implementation is a significant JS feature (keyboard nav, nested flyouts, focus management, accessibility). Disproportionate complexity for a 4-page portfolio | Start button opens a minimal 4-item popup (About, Work, Contact, Home). Flat list, no nesting |
| Win95 wallpaper patterns/screensavers | The teal desktop is already correct; adding animated wallpapers or screensavers would be fun | High animation cost; CSS background patterns can simulate, but animated screensavers waste resources and distract from content | Use the authentic `#008080` solid teal or a subtle tile pattern. No screensaver animation |
| DOS/terminal theme as a fourth theme | Often suggested when retro themes are added | Three themes is already complex; a fourth adds significant CSS and architecture work without validating v2.0 first | Defer to v3.0 after v2.0 themes are shipped and working |
| Font smoothing (anti-aliased pixel fonts) | Looks cleaner on modern displays | Defeats the purpose — pixel fonts require `-webkit-font-smoothing: none` to look authentic. Anti-aliasing blurs the pixel grid and makes "MS Sans Serif" look like a poor Arial clone | Always set `-webkit-font-smoothing: none` and `image-rendering: pixelated` on Windows theme font contexts |
| Theme persistence via localStorage | Nice UX improvement, PROJECT.md marks it as out of scope for v2.0 | Requires the anti-flash inline script pattern, adds complexity to test, and defers shipping themes | Default to retro theme on every load for v2.0. Add persistence in v2.1 with the anti-flash script pattern already documented in ARCHITECTURE.md |

## Windows OS Chrome Specifications

Detailed visual specs for authentic theme recreation. These are the specific values that make each theme feel correct rather than approximate.

### Windows 95 / 98 Chrome (HIGH confidence — verified via 98.css source)

**Colors:**
```css
--surface: #c0c0c0;           /* Window background, button face */
--button-highlight: #ffffff;  /* Top/left edges of raised elements */
--button-face: #dfdfdf;       /* Inner raised face */
--button-shadow: #808080;     /* Bottom/right edges of raised elements */
--window-frame: #0a0a0a;      /* Outer border (near-black) */
--dialog-blue: #000080;       /* Title bar left color (navy) */
--dialog-blue-light: #1084d0; /* Title bar right color (gradient end) */
--dialog-gray: #808080;       /* Inactive title bar left */
--dialog-gray-light: #b5b5b5; /* Inactive title bar right */
--desktop-bg: #008080;        /* Classic Win95 teal desktop */
```

**Beveled border pattern (4-layer box-shadow):**
```css
/* Raised element (button not pressed): */
box-shadow:
  inset -1px -1px #0a0a0a,       /* outer bottom-right */
  inset 1px 1px #ffffff,          /* outer top-left */
  inset -2px -2px #808080,        /* inner bottom-right */
  inset 2px 2px #dfdfdf;          /* inner top-left */

/* Window border (swaps face and highlight): */
box-shadow:
  inset -1px -1px #0a0a0a,
  inset 1px 1px #dfdfdf,
  inset -2px -2px #808080,
  inset 2px 2px #ffffff;
```

**Title bar:**
```css
background: linear-gradient(90deg, #000080, #1084d0);
color: white;
font-weight: bold;
height: ~18px;
padding: 3px 2px 3px 3px;
```

**Font:**
```css
font-family: "Pixelated MS Sans Serif", Arial, sans-serif;
-webkit-font-smoothing: none;
font-size: 11px;
```
Note: 98.css ships the "Pixelated MS Sans Serif" woff/woff2 font files. This is the most authentic option. Fallback to `Arial` at `11px` with smoothing disabled is acceptable.

**Scrollbars:** Segment-style with raised arrow buttons and thumb. 16px wide. Implemented via `::-webkit-scrollbar` pseudo-elements. Authentic 4-layer bevel on all scrollbar parts.

### Windows 3.1 Chrome (MEDIUM confidence — from screenshot analysis and community sources)

Win3.1 is visually simpler than Win95. Key distinctions:

**Colors:**
```css
--surface: #c0c0c0;           /* Same grey as Win95 */
--desktop-bg: #008080;        /* Same teal — or could vary per driver */
--title-bar-active: #000080;  /* Solid navy, NO gradient */
--title-bar-inactive: #808080;/* Solid grey */
--title-bar-text: #ffffff;
--button-face: #c0c0c0;       /* Buttons same color as window surface */
--border: #000000;            /* Thick 2px solid black borders */
```

**Window borders:** Simple `2px solid #000000` — no beveling. Win3.1 predates the Win95 3D bevel effect. At most a minimal 1px highlight/shadow for buttons.

**Buttons:** Flat with a thin border. The 3D bevel effect in Win3.1 buttons was subtle compared to Win95. Single `1px solid` with a basic top-left highlight and bottom-right shadow:
```css
box-shadow: 1px 1px 0 #000000;
border: 1px solid #808080;
background: #c0c0c0;
```

**Title bar:** Solid fill, no gradient. Contains app name text only — no close/minimize/maximize button chrome needed for the portfolio's simplified version. A small icon (optional) on the left.

**Font:** `"Fixedsys"`, `"Courier New"`, or monospace. Win3.1 used bitmap fonts, not TrueType. The "System" bitmap font was the default UI font — no clean web equivalent. "Courier New" or a monospace stack is the closest web-safe approximation. `-webkit-font-smoothing: none` is critical.

**Program Manager:** Win3.1's shell was Program Manager — a root window containing "group windows" (sub-windows with icon grids). For the portfolio, this means: the desktop shows a single "group window" (like a framed panel) containing the 4 section icons (About, Work, Contact, and maybe a "Resume" icon).

### Current Retro Theme (as-built baseline)

- `background-color: #008080` with pixel-grid pattern via `radial-gradient`
- Window: animated border with gradient via `border-image`, `#f0f0f0`-to-`#a8a8a8` gradient background
- Title: large typographic treatment (clamp 42–115px), gradient text, 3D perspective transform
- Buttons: 96x96px squares with offset box-shadow and hover lift animation
- Font: "Courier New" monospace
- Desktop icon: positioned top-left, teal hover background

This theme's visual identity is intentionally distinct from authentic Win3.1/Win95 — it is a modern artistic interpretation. Preserving it requires no changes once the CSS vars refactor is complete.

## Feature Dependencies

```
[CSS vars refactor of global.css]
    └──required by──> [Win3.1 theme CSS]
    └──required by──> [Win95 theme CSS]
    └──required by──> [ThemeSwitcher JS works with CSS]

[Win3.1 theme CSS]
    └──required by──> [Win3.1 desktop metaphor / Program Manager shell]

[Win95 theme CSS]
    └──required by──> [Win95 desktop metaphor / desktop icons]
    └──required by──> [Win95 taskbar]

[Desktop.astro shell]
    └──required by──> [Desktop icons (section launchers)]
    └──required by──> [Taskbar.astro] (Win95 only)

[ThemeSwitcher.astro component]
    └──required by──> [User-accessible theme switching]

[Layout.astro modification]
    └──required by──> [ThemeSwitcher rendered on all pages]
    └──required by──> [Desktop.astro rendered for Windows themes]
```

### Dependency Notes

- **CSS vars refactor requires no visible changes:** The retro theme must look identical before and after. This is a pure internal refactor — it enables everything else but produces no user-visible change. It must come first.
- **Desktop shell requires theme CSS first:** The desktop metaphor (icon grid, wallpaper, app windows) requires the Win theme CSS vars to be defined or its visual appearance will be incorrect on first render.
- **Taskbar depends on Win95 theme only:** Win3.1 had no taskbar. The `Taskbar.astro` component is Win95-only and must only render under `[data-theme="win95"]`.
- **Window.astro/Button.astro light modification is a prerequisite for all themes:** These components consume CSS vars; once they use vars instead of hardcoded values, all three themes work through CSS alone without further component changes.

## MVP Definition

This is an additive milestone on an existing shipped site. "MVP" here means: themes work, look authentic, site still builds and deploys correctly.

### Launch With (v2.0)

- [ ] CSS vars refactor — retro theme unchanged visually, all values var-driven
- [ ] ThemeSwitcher component — accessible from all pages, switches `html[data-theme]`
- [ ] Windows 3.1 theme CSS — period-accurate chrome on existing pages
- [ ] Windows 95 theme CSS — period-accurate chrome on existing pages
- [ ] Desktop.astro shell — desktop wallpaper + section icons for Windows themes
- [ ] Win95 taskbar (Taskbar.astro) — Start button, clock, active section indicator
- [ ] Win3.1 Program Manager-style icon grid — section icons in a group window

### Add After Validation (v2.1)

- [ ] localStorage theme persistence — add once themes are confirmed working. Requires anti-flash inline script.
- [ ] Win95 title bar control buttons (minimize/close icons) — visual polish, no functionality needed
- [ ] Inactive window title bar state — grey title bar on non-active page windows

### Future Consideration (v3.0+)

- [ ] Draggable windows — only if portfolio grows to need multi-window content comparison
- [ ] DOS/terminal theme — fourth theme after proving three-theme system is maintainable
- [ ] Animated wallpapers — after v2.0 confirms theme system is stable

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| CSS vars refactor | LOW (invisible to user) | LOW | P1 — prerequisite for everything |
| ThemeSwitcher component | HIGH | LOW | P1 — enables all themes |
| Win95 theme CSS | HIGH | MEDIUM | P1 — core deliverable |
| Win3.1 theme CSS | HIGH | MEDIUM | P1 — core deliverable |
| Desktop shell (Desktop.astro) | HIGH | HIGH | P1 — makes themes feel complete |
| Win95 taskbar | MEDIUM | MEDIUM | P1 — Win95 without a taskbar feels hollow |
| Win3.1 Program Manager grid | MEDIUM | MEDIUM | P1 — Win3.1 without Program Manager is just blue windows |
| Win95 title bar control buttons | LOW | LOW | P2 — polish |
| localStorage persistence | MEDIUM | LOW | P2 — deferred per PROJECT.md out-of-scope |
| Inactive title bar state | LOW | LOW | P2 — nice authenticity detail |
| Draggable windows | LOW | HIGH | P3 — disproportionate complexity |
| Multi-window MDI | LOW | HIGH | P3 — navigation model doesn't require it |

## Existing Component Integration

The existing Window.astro and Button.astro components are well-structured for this change. Key adaptations needed:

| Component | Current Hardcoded Values | Replace With |
|-----------|--------------------------|-------------|
| `Window.astro` | `background-color: #c0c0c0` in `.window` | `var(--bg-window)` |
| `Window.astro` | `.window-titlebar` margin/height | `var(--titlebar-height)` |
| `Button.astro` | `background-color: #f0f0f0` | `var(--bg-button)` |
| `Button.astro` | `border: 2px solid #000` | `var(--border-button)` |
| `Button.astro` | `box-shadow: 2px 2px 0 #000` | `var(--shadow-button)` |
| `global.css` | `background-color: #008080` | `var(--bg-desktop)` |
| `global.css` | `.splash-screen` gradient/border animation | Retro-theme-only: keep as-is but scope under `[data-theme="retro"]` |

The `.splash-screen` animated border is unique to the retro theme and has no analog in Windows themes. It should remain in `global.css` but be scoped to `[data-theme="retro"] .splash-screen` after the refactor.

## Competitor Feature Analysis

| Feature | React95 portfolio (DonChiaQE) | WIN98-template (pollygon-dev) | Our Approach |
|---------|-------------------------------|-------------------------------|--------------|
| Window chrome | Authentic Win95 via CSS | Authentic Win98 via 98.css | Custom CSS vars, 98.css as reference |
| Desktop icons | Desktop icons, click to open modals | Desktop icons → open windows | Desktop icons → page navigation (simpler) |
| Taskbar | Yes, with Start menu | Yes, with working Start button | Yes, simplified (no nested submenus) |
| Multi-window | Multiple windows, draggable | Multiple windows, draggable | No — single maximized window per page |
| Theme switching | Single theme only | Single theme only | Three themes (differentiator) |
| Start menu | Full nested menu | Working Start menu | Flat 4-item popup |
| Framework | Vue.js | Vanilla HTML/CSS/JS | Astro (static, no client framework) |

The key differentiator of this project over all Win95 portfolio references is the three-theme switcher. No reference implementation supports switching between OS eras.

## Sources

- [98.css source (style.css)](https://raw.githubusercontent.com/jdan/98.css/main/style.css) — exact CSS variable values for Win95/98 chrome (HIGH confidence — primary source)
- [98.css live docs](https://jdan.github.io/98.css/) — component gallery showing scrollbars, title bars, buttons
- [98.css design rationale](https://notes.jordanscales.com/98-dot-css) — reference to Microsoft Windows User Experience manual as specification source
- [OS-GUI.js](https://os-gui.js.org/) — alternative Win98 CSS library confirming same color values
- [React95](https://react95.io/) — React component reference for Win95 UI patterns
- [DonChiaQE/win95 portfolio](https://github.com/DonChiaQE/win95) — Win95 portfolio example using CSS only
- [pollygon-dev/WIN98-template](https://github.com/pollygon-dev/WIN98-template) — working taskbar + desktop template reference
- [Astro Theme Switcher implementation](https://astro-theme-switcher.netlify.app/) — data-theme + localStorage pattern for Astro
- [Windows 3.1 default color schemes — BetaArchive](https://www.betaarchive.com/forum/viewtopic.php?t=26251) — community documentation of Win3.1 color defaults
- [Futur3Sn0w/web31](https://github.com/Futur3Sn0w/web31) — pixel-for-pixel Win3.1 recreation reference

---
*Feature research for: Switchable OS theme system (retro, Windows 3.1, Windows 95) on Astro static site*
*Researched: 2026-03-21*
