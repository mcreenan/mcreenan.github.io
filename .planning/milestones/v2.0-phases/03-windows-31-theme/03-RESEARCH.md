# Phase 3: Windows 3.1 Theme - Research

**Researched:** 2026-03-21
**Domain:** CSS theming, retro OS aesthetics, bitmap fonts, pixel art icons
**Confidence:** HIGH (architecture), MEDIUM (font sourcing)

## Summary

Phase 3 delivers the `[data-theme="win31"]` CSS token block and a new Program Manager component for the home page. The Phase 2 foundation is complete: `global.css` has a token architecture under `[data-theme="retro"]`, the anti-flash script handles `win31` as a valid theme value, and `ThemeDialog.astro` already has the win31 radio wired. The work is additive CSS + one new Astro component.

The critical technical decisions are all locked in CONTEXT.md: flat gray #C0C0C0 chrome, solid navy #000080 title bars, 2px black borders, no beveling, and a bitmap-style font loaded as a local WOFF. The Program Manager is a single window with an icon grid — no nested sub-windows. Subpages float as centered windows over the teal desktop background.

The two open questions for the planner to resolve are (1) which specific bitmap font WOFF to use and where to host it, and (2) how to handle the CSS-only menu bar dropdown (hover vs. minimal JS). Both are within Claude's discretion per CONTEXT.md.

**Primary recommendation:** Build `[data-theme="win31"]` as a pure CSS override on existing tokens in `global.css`, create a `ProgramManager.astro` component for the home page, and scope win31-specific chrome rules under `[data-theme="win31"] .window` / `[data-theme="win31"] .button` mirroring the retro pattern established in Phase 2.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Program Manager layout**
- D-01: Flat icon grid inside a single Program Manager window — no nested group sub-windows
- D-02: About, Work, and Contact appear as 32x32 pixel art icons in the 16-color Win 3.1 palette
- D-03: Program Manager has a menu bar with File, Options, Window, Help labels
- D-04: Only the Options menu is functional — it contains a "Change Theme..." item that opens the existing theme dialog
- D-05: File, Window, and Help labels are visual-only (not clickable)
- D-06: Menu bar appears only on the Program Manager (home page), not on subpage windows

**Icon navigation**
- D-07: Clicking a Program Manager icon navigates to the corresponding page URL (e.g., /about) — same routing as other themes
- D-08: No overlay/SPA window behavior in this phase — that's Phase 5 territory

**Window chrome**
- D-09: Title bars have a control menu box [-] on the left and minimize/maximize arrow buttons on the right — all visual-only (decorative)
- D-10: Flat gray chrome with thick black outer border, solid navy (#000080) title bars, white title text
- D-11: No beveling or gradients anywhere — strictly flat Win 3.1 aesthetic

**Subpage windows**
- D-12: Subpages (About, Work, Contact) render as centered floating windows with visible desktop background behind them
- D-13: Subpage windows have Win 3.1 title bars but no menu bar
- D-14: Home navigation via both: a desktop icon visible on the background AND a close/minimize button on the title bar that navigates home

**Typography**
- D-15: UI elements (title bars, buttons, labels, menu bar) use an MS Sans Serif web font clone (WOFF file, ~20KB)
- D-16: Body/content text also uses the same bitmap font — fully immersive Win 3.1 experience
- D-17: Fallback: graceful degradation to Arial/sans-serif if the WOFF fails to load (font-display: swap)
- D-18: Home page title ("Matt Creenan") styled like a Win 3.1 title bar — navy background, white bitmap text

**Desktop and color palette**
- D-19: Desktop background uses the same teal + pixel-grid pattern as the retro theme (shared via existing CSS tokens)
- D-20: Chrome uses exact Win 3.1 system colors: #C0C0C0 (silver gray), #000080 (navy), #FFFFFF (white text), #808080 (dark gray borders)
- D-21: Links use Win 3.1 Help-style green underlined text for period-authentic hyperlink appearance
- D-22: Scrollbars styled to match Win 3.1 — flat gray with black arrow buttons and flat gray thumb (CSS scrollbar styling)

### Claude's Discretion
- Pixel art icon creation approach (inline SVG, CSS sprites, or static image files)
- MS Sans Serif WOFF source selection and licensing verification
- Menu bar dropdown implementation details (CSS-only vs minimal JS)
- Exact spacing, padding, and sizing of window chrome elements
- How the floating window centers on various screen sizes
- Scrollbar CSS compatibility approach across browsers

### Deferred Ideas (OUT OF SCOPE)
- Opening sections as overlay windows on the desktop without navigation — Phase 5 (SHELL-02)
- Draggable/resizable windows — Out of Scope per REQUIREMENTS.md
- Functional File/Window/Help menus with real actions — could be a future enhancement but not in scope
- Win 3.1 specific cursor styles — captured as THEME-02 in future requirements
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| WIN31-01 | Windows have flat gray chrome with solid navy title bars and 2px black borders | CSS token block under `[data-theme="win31"]`; scoped `.window` rule; title bar as flex div with navy bg; decorative chrome buttons ([-], [^v]) as text spans |
| WIN31-02 | Buttons render with flat Win3.1 style (raised gray, black border) | `[data-theme="win31"] .button` overrides: `background: #C0C0C0`, `border: 2px solid #000`, `box-shadow: none` |
| WIN31-03 | Period-appropriate bitmap-style font applied to UI elements | W95FA or Pixelated MS Sans Serif WOFF; `<link rel="preload">` in BaseHead.astro; `font-family` in win31 `--font-body` and `--font-title` tokens |
| WIN31-04 | Desktop shows Program Manager window with icon groups for each section | New `ProgramManager.astro` component conditionally shown in `index.astro` when `data-theme="win31"`; 32x32 SVG or PNG pixel art icons; menu bar with functional Options dropdown |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 4.16.8 (existing) | Component and page framework | Already in project |
| Tailwind CSS | 3.4.14 (existing) | Utility classes for layout | Already in project |
| No new npm packages | — | Win31 is pure CSS + a font file | All chrome is hand-rolled CSS per D-11 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| W95FA font | OFL-licensed, ~20KB | Bitmap-style pixel font for Win 3.1 UI | Self-hosted WOFF in `/public/fonts/` (same as Atkinson font pattern) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| W95FA (Win95 era clone) | Pixelated MS Sans Serif (from 98.css PR #27) | Pixelated MS Sans Serif is 7KB woff2, inlined into CSS; W95FA is more widely hosted with clear OFL license; either works |
| Self-hosted WOFF | CDNFonts or Google Fonts CDN | Self-hosting avoids external dependency and matches existing pattern (Atkinson fonts are self-hosted) |
| CSS-only dropdown | Minimal JS for Options menu | CSS `:focus-within` hover dropdown is possible but WCAG 1.4.13 (Escape to dismiss) requires JS; since `openThemeDialog()` is already a JS call, minimal JS is fine |

**Installation:** No npm packages needed. Font file download only:
```bash
# Download W95FA woff from CDNFonts or FontsArena and place in:
/public/fonts/w95fa.woff
# Or use woff2 format for smaller size (~7KB vs ~20KB):
/public/fonts/w95fa.woff2
```

**Version note:** W95FA is a static font artifact, not versioned by npm. License: SIL Open Font License (free personal and commercial use). Source verified via FontsArena and CDNFonts.

## Architecture Patterns

### How Phase 3 Slots into the Existing Architecture

Phase 2 established this pattern — Phase 3 extends it:

```
global.css
├── [data-theme="retro"] { ...tokens... }   ← Phase 2 complete
├── [data-theme="win31"] { ...tokens... }    ← Phase 3: add this block
├── [data-theme="retro"] .window { ... }     ← Phase 2 complete
├── [data-theme="win31"] .window { ... }     ← Phase 3: add this block
└── [data-theme="win31"] .button { ... }     ← Phase 3: add this block

src/components/
├── ProgramManager.astro    ← Phase 3: new component for home page
├── Window.astro            ← Existing; needs win31 title bar chrome tweak
├── Button.astro            ← Existing; restyled via CSS tokens
├── ThemeDialog.astro       ← Existing; no changes needed
└── BaseHead.astro          ← Existing; add W95FA font preload

src/pages/
├── index.astro             ← Phase 3: add ProgramManager conditional
├── about.astro             ← Phase 3: win31 floating window layout
├── work.astro              ← Phase 3: win31 floating window layout
└── contact.astro           ← Phase 3: win31 floating window layout
```

### Pattern 1: CSS Token Block for win31

**What:** A `[data-theme="win31"]` block in `global.css` that overrides all CSS custom properties to Win 3.1 values. The same component HTML renders correctly in both themes.

**When to use:** Whenever a token has a different value under win31 vs. retro.

**Example:**
```css
/* Mirrors the retro block pattern from Phase 2 */
[data-theme="win31"] {
  /* Colors */
  --color-bg:                    #008080;  /* same teal desktop (D-19) */
  --color-window:                #C0C0C0;  /* silver gray (D-20) */
  --color-button-bg:             #C0C0C0;
  --color-button-text:           #000000;
  --color-button-border:         #000000;
  --color-link:                  #008000;  /* Win3.1 Help green (D-21) */
  --color-link-hover:            #006600;
  --color-title:                 #FFFFFF;  /* white text on navy bar (D-10) */
  --color-scrollbar-track:       #C0C0C0;
  --color-scrollbar-thumb:       #808080;

  /* Typography */
  --font-body:                   "W95FA", Arial, sans-serif;
  --font-title:                  "W95FA", Arial, sans-serif;

  /* Borders */
  --border-button:               2px solid #000000;

  /* Shadows — none in win31 (D-11) */
  --shadow-button:               none;
  --shadow-button-hover:         none;
  --shadow-window:               none;

  /* Win31-specific: no gradients */
  --bg-splash:                   #C0C0C0;
  --bg-content-window:           #C0C0C0;
}

[data-theme="win31"] .window {
  background-color: var(--color-window);
  border: 2px solid #000000;
}

[data-theme="win31"] .button:hover {
  transform: none;  /* no hover lift in win31 */
  box-shadow: none;
}
```

### Pattern 2: Win31 Title Bar Chrome

**What:** The title bar in Win 3.1 is a solid navy rectangle with white bitmap text, a `[-]` control menu box on the left, and `[^]` and `[v]` on the right. These are decorative spans, not interactive.

**When to use:** `[data-theme="win31"] .window-titlebar`

**Example:**
```css
[data-theme="win31"] .window-titlebar {
  background: #000080;  /* solid navy, no gradient */
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px;
  height: 18px;
  margin: 0;  /* override retro negative margin hack */
  font-family: "W95FA", Arial, sans-serif;
  font-size: 11px;
}

[data-theme="win31"] .window-title {
  /* Override retro's gradient/glow treatment completely */
  background: none;
  -webkit-background-clip: unset;
  background-clip: unset;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: normal;
  text-shadow: none;
  transform: none;
  letter-spacing: 0;
  filter: none;
  line-height: 1;
}
```

**Note:** The existing `Window.astro` component renders the title bar inside `.window-titlebar` with `.window-title` text. The win31 CSS resets the retro-specific properties (gradient text, perspective transform, animation) and applies flat navy + white.

### Pattern 3: Program Manager Component

**What:** A new `ProgramManager.astro` component that renders when `[data-theme="win31"]` is active. It wraps the icon grid in a Win 3.1 window with a menu bar.

**When to use:** Only on `index.astro`, conditionally shown/hidden by theme.

**Astro-idiomatic approach for theme-conditional rendering:**

Because Astro builds static HTML, there are two approaches:

1. **CSS display:none toggle** (recommended): Always render both the retro splash and the Program Manager in the HTML; use `[data-theme="win31"] .program-manager { display: block }` and `[data-theme="win31"] .splash-screen { display: none }`. No JS required, theme switch is instant.

2. **Client-side JS swap**: Render both and use a script to swap visibility on `data-theme` attribute changes. More complex, not needed here.

**Use CSS display toggling** — it matches how the existing theme system works (CSS token swap) and Astro's build process bundles all component styles regardless of conditional render.

```astro
<!-- index.astro — render both, CSS controls visibility -->
<div class="retro-layout">
  <!-- existing splash-screen markup -->
</div>
<ProgramManager />
```

```css
/* global.css */
.program-manager { display: none; }
[data-theme="win31"] .program-manager { display: flex; }
[data-theme="win31"] .retro-layout { display: none; }
```

### Pattern 4: Menu Bar Dropdown (Options > Change Theme...)

**What:** A Win 3.1-style menu bar with static labels and one functional dropdown.

**Recommended approach:** CSS `:focus-within` for the dropdown reveal, plus a small `<script>` to call `window.openThemeDialog()` on the "Change Theme..." click. The menu bar itself is CSS-only for hover/focus states.

```css
[data-theme="win31"] .menubar { ... }
[data-theme="win31"] .menubar-item { position: relative; padding: 2px 6px; }
[data-theme="win31"] .menubar-item:focus-within .menubar-dropdown { display: block; }
[data-theme="win31"] .menubar-dropdown { display: none; position: absolute; ... }
```

```html
<nav class="menubar" aria-label="Program Manager menu">
  <span class="menubar-item" aria-disabled="true">File</span>
  <div class="menubar-item" tabindex="0">Options
    <ul class="menubar-dropdown">
      <li><button onclick="window.openThemeDialog()">Change Theme...</button></li>
    </ul>
  </div>
  <span class="menubar-item" aria-disabled="true">Window</span>
  <span class="menubar-item" aria-disabled="true">Help</span>
</nav>
```

### Pattern 5: 32x32 Pixel Art Icons

**What:** Program Manager icons for About, Work, Contact in the Win 3.1 16-color palette.

**Recommended approach:** Inline SVG with `<rect>` elements at 1px scale (32x32 viewBox). SVG is resolution-independent, renders crisp at any size with `image-rendering: pixelated`, and requires no external files. Each icon is authored directly in the `.astro` component.

```html
<svg width="32" height="32" viewBox="0 0 32 32"
     xmlns="http://www.w3.org/2000/svg"
     style="image-rendering: pixelated; image-rendering: crisp-edges;">
  <!-- pixel art using rect elements or path in 16-color palette -->
</svg>
```

**16-color Win 3.1 palette for icons:** `#000000 #000080 #008000 #008080 #800000 #800080 #808000 #C0C0C0 #808080 #0000FF #00FF00 #00FFFF #FF0000 #FF00FF #FFFF00 #FFFFFF`

### Pattern 6: Subpage Floating Window Layout

**What:** About/Work/Contact render as centered floating windows with the teal desktop visible around them.

**Current state:** Subpages already use `position: fixed` and `splash-screen content-window` classes. The win31 CSS overrides the border/shadow/background to flat gray.

**Key difference from retro:** The retro window has `border-top-width: 21px` for the animated gradient title bar hack. Win31 uses a proper flexbox title bar row, so the `Window.astro` component may need a new `titleBarStyle` prop, or the win31 CSS must carefully override the retro-specific margin/padding tricks.

**Simpler path:** Add a `win31TitleBar` prop to `Window.astro` that renders a structurally different title bar (navy bar with decorative chrome buttons) when set. The CSS then targets `.window-titlebar-win31` independently.

**Alternative (CSS-only):** Keep `Window.astro` unchanged and override all the retro title bar properties with win31 CSS. The retro title bar uses `margin: -21px -1rem 0 -1rem` (negative margin hack). Win31 CSS would set `margin: 0` and `background: #000080` to override. This avoids component changes but may be fragile.

**Recommendation:** Add a `variant` prop to `Window.astro` (values: `"retro"` | `"win31"`) and render structurally different title bar markup per variant. This is cleaner than CSS fighting the retro margin hack.

### Anti-Patterns to Avoid

- **Applying win31 CSS without scoping:** All win31 rules MUST be under `[data-theme="win31"]` selector to prevent interference with retro and future win95 themes.
- **Using `border-style: outset/inset` for win31:** Win 3.1 is FLAT — no CSS 3D border values. That's Win 95 territory (Phase 4).
- **Gradients anywhere in win31:** `--bg-splash`, `--bg-content-window`, and title bar must all be solid colors. Retro uses `linear-gradient()` extensively; win31 overrides must replace these entirely.
- **Forgetting the retro `.window-title` transform reset:** The retro title renders with `transform: translateY(-21px) perspective(800px) rotateX(-15deg) scaleY(1.1)`. Win31 CSS must set `transform: none` explicitly.
- **CSS-only theme conditional via `:root[data-theme="win31"]`:** The existing code uses `[data-theme="win31"]` (no `:root`), matching the retro pattern. Keep consistent.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bitmap-style pixel font | Custom CSS pixel rendering tricks | W95FA WOFF or Pixelated MS Sans Serif WOFF | Font files render correctly at 11-12px with crisp hinting; CSS tricks produce inconsistent results across browsers |
| Cross-browser scrollbar | One CSS approach only | Both `scrollbar-color`/`scrollbar-width` (standard) + `::-webkit-scrollbar` (Chrome/Safari) | Firefox ignores webkit pseudo-elements; Chrome 121+ supports the standard properties — write both blocks |
| Icon pixel art from scratch in CSS | `box-shadow` sprite technique | Inline SVG `<rect>` grid | SVG approach is maintainable and resolution-independent; `box-shadow` icons are unmaintainable |

**Key insight:** The entire Win 3.1 chrome is simple enough to hand-roll in CSS. No external CSS library needed (98.css targets Win 95/98). Keep it lean.

## Common Pitfalls

### Pitfall 1: Retro Title Bar Negative Margin Bleed

**What goes wrong:** The retro splash window uses `border-top-width: 21px` and the title bar uses `margin: -21px -1rem 0 -1rem` to float the title above the border. Win31 CSS targeting `[data-theme="win31"] .window-titlebar` without resetting the margin produces a title bar floating above the window instead of inside it.

**Why it happens:** The retro theme uses the top border as the "title bar background" — it's a clever hack that breaks for win31 where the title bar is a normal DOM element inside the window.

**How to avoid:** Win31 CSS must set `.splash-screen { border-top-width: 2px }` (not 21px) and `.window-titlebar { margin: 0 }` to override the retro layout hack.

**Warning signs:** Title bar text floats above or outside the window frame in win31 theme.

### Pitfall 2: Win31 Font Rendering at Small Sizes

**What goes wrong:** Bitmap fonts like W95FA are designed for specific pixel sizes (8px, 10px, 11px). At fractional sizes or with subpixel rendering enabled, they look blurry.

**Why it happens:** Browser subpixel antialiasing smooths pixel edges.

**How to avoid:** Use `font-size: 11px` (not rem/em) for chrome elements. Set `-webkit-font-smoothing: none; font-smooth: never;` on `.window-titlebar` and `.button` under `[data-theme="win31"]`. The STATE.md research flag says "Win3.1 bitmap font fallback behavior across browsers/OS not fully confirmed" — verify during implementation.

**Warning signs:** Title bar text appears blurry or antialiased; pixel grid is not sharp.

### Pitfall 3: CSS Gradient Override Incompleteness

**What goes wrong:** The retro `--bg-splash` is a `linear-gradient(...)` and `--bg-content-window` is also a gradient. Win31 sets these to solid colors. But if any component directly references `background-image` (not `background`) with a gradient literal instead of via token, the win31 token override won't apply.

**Why it happens:** `background` shorthand and `background-image` are separate properties. Setting `--bg-splash: #C0C0C0` only works if the component uses `background: var(--bg-splash)`.

**How to avoid:** Audit `global.css` and all `.astro` files for hardcoded `background-image: linear-gradient(...)` that bypass tokens. The `body` element in `global.css` uses hardcoded `background-image:` (not a token) — this must also be handled under `[data-theme="win31"] body` if the teal pixel-grid pattern needs adjustment.

**Warning signs:** Win31 windows still show gradient backgrounds instead of flat gray.

### Pitfall 4: View Transitions Breaking Win31 Title Bar

**What goes wrong:** The existing `.splash-screen` has `view-transition-name: window`. Astro's View Transitions API morphs the element during navigation. Win31 and retro windows have different heights and structures — the morph may look wrong.

**Why it happens:** View Transitions captures the before/after states and animates between them. Structural differences (21px border vs. 2px + title bar div) may produce jarring transitions.

**How to avoid:** Consider assigning a different `view-transition-name` to the win31 window, or accept that the cross-theme transition looks slightly different. Within a single theme, navigation should work fine.

**Warning signs:** Navigation between pages in win31 theme has glitchy title bar animation.

### Pitfall 5: Program Manager Icon Focus/Click in Win31 Only

**What goes wrong:** The Program Manager uses a flat icon grid that is conditionally visible. If `display: none` is toggled by JS after page load (when the user switches theme), the focus state of icons may be lost or the icon grid may not respond to theme switches that happen mid-session.

**Why it happens:** The CSS `display: none` / `display: flex` toggle is driven by `[data-theme]` on `<html>`. When the user switches theme via the dialog, the `data-theme` attribute changes and CSS re-evaluates instantly — this works correctly. No JS needed for the toggle.

**How to avoid:** Use CSS-only display toggling (`[data-theme="win31"] .program-manager { display: flex }`), not JS class manipulation.

## Code Examples

### Win31 Scrollbar Cross-Browser Pattern

```css
/* Source: MDN scrollbar-color, MDN ::-webkit-scrollbar */

/* Standard (Firefox, Chrome 121+, Edge 121+) */
[data-theme="win31"] .window-content {
  scrollbar-color: #808080 #C0C0C0;  /* thumb track */
  scrollbar-width: thin;
}

/* WebKit legacy (older Chrome, Safari) */
[data-theme="win31"] .window-content::-webkit-scrollbar {
  width: 16px;
}
[data-theme="win31"] .window-content::-webkit-scrollbar-track {
  background: #C0C0C0;
  border: 1px solid #000;
}
[data-theme="win31"] .window-content::-webkit-scrollbar-thumb {
  background: #808080;
  border: 1px solid #000;
}
```

### Win31 Token Block Skeleton

```css
/* global.css — add after [data-theme="retro"] block */
[data-theme="win31"] {
  --color-bg:                    #008080;
  --color-window:                #C0C0C0;
  --color-button-bg:             #C0C0C0;
  --color-button-text:           #000000;
  --color-button-border:         #000000;
  --color-link:                  #008000;
  --color-link-hover:            #006600;
  --color-desktop-icon:          #FFFFFF;
  --color-desktop-icon-shadow:   rgba(0,0,0,0.7);
  --color-desktop-icon-highlight: rgba(0,0,128,0.3);
  --outline-desktop-icon:        1px dotted white;
  --color-desktop-label-stroke:  #000;
  --filter-desktop-icon:         none;
  --color-scrollbar-track:       #C0C0C0;
  --border-scrollbar:            1px solid #000;
  --color-scrollbar-thumb:       #808080;
  --color-scrollbar-thumb-hover: #606060;
  --color-title:                 #FFFFFF;
  --color-title-gradient-start:  #FFFFFF;
  --color-title-gradient-end:    #FFFFFF;
  --color-title-shadow:          transparent;
  --color-title-glow-1:          transparent;
  --color-title-glow-2:          transparent;
  --font-body:                   "W95FA", Arial, sans-serif;
  --font-title:                  "W95FA", Arial, sans-serif;
  --border-button:               2px solid #000000;
  --border-headshot:             2px solid #000000;
  --shadow-button:               none;
  --shadow-button-hover:         none;
  --shadow-headshot:             none;
  --shadow-window:               none;
  --bg-gradient-fade:            transparent;
  --bg-pixel-light:              transparent;
  --bg-pixel-dark:               transparent;
  --bg-splash:                   #C0C0C0;
  --bg-content-window:           #C0C0C0;
}
```

### BaseHead.astro Font Preload Addition

```html
<!-- Add to BaseHead.astro after existing font preloads -->
<link
  rel="preload"
  href="/fonts/w95fa.woff"
  as="font"
  type="font/woff"
  crossorigin
/>
```

### CSS Font-Face Declaration

```css
/* In global.css */
@font-face {
  font-family: "W95FA";
  src: url("/fonts/w95fa.woff2") format("woff2"),
       url("/fonts/w95fa.woff") format("woff");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `::-webkit-scrollbar` only | Also add `scrollbar-color` + `scrollbar-width` standard properties | Chrome 121 (Jan 2024) added standard support | Standard properties override webkit pseudo-elements in Chrome 121+; write both for backward compat |
| CSS 3D borders (`outset`/`inset`) for retro look | Explicit multiple `box-shadow` layers | Modern CSS | More control; Win31 uses `box-shadow: none` entirely |
| Bitmap fonts served as system fonts | WOFF/WOFF2 self-hosted | Web Fonts era | W95FA OFL license, ~7-20KB, reliable |

**Deprecated/outdated:**
- `font-smooth: never` on Firefox: replaced by `-moz-osx-font-smoothing: none` on macOS; `font-smooth` is non-standard. Test empirically.
- `image-rendering: -webkit-optimize-contrast`: Use `image-rendering: pixelated` (standard) instead.

## Open Questions

1. **W95FA vs Pixelated MS Sans Serif — which to use?**
   - What we know: W95FA is OFL-licensed, widely hosted, ~20KB WOFF. Pixelated MS Sans Serif (from 98.css PR #27) is ~7KB woff2 but sourced from an internal PR — less clear distribution/license.
   - What's unclear: Whether Pixelated MS Sans Serif is independently downloadable with a clear license.
   - Recommendation: Use W95FA from CDNFonts/FontsArena (OFL license confirmed). It is intended for Win 95 era but visually identical to Win 3.1 at 11px — the user won't notice the distinction.

2. **Window.astro structural change vs CSS-only override**
   - What we know: The retro title bar uses a negative-margin hack tied to `border-top-width: 21px`. Win31 needs a normal in-flow title bar.
   - What's unclear: Whether CSS can cleanly override the 21px hack without touching `Window.astro`.
   - Recommendation: Add a `variant` prop to `Window.astro`. Render the win31 title bar as a structurally distinct `<div class="window-titlebar-win31">` with decorative chrome buttons ([-] and [^v]). This avoids fragile CSS-fighting-CSS.

3. **Font antialiasing behavior on Windows/Chrome**
   - What we know: STATE.md explicitly flags this as unconfirmed. W95FA at 11px may still be antialiased on Windows Chrome despite `-webkit-font-smoothing: none` (which only affects macOS WebKit).
   - What's unclear: Windows Chrome behavior for pixel fonts — Chrome on Windows uses ClearType by default.
   - Recommendation: Accept that antialiasing behavior differs per OS. The font still reads as "bitmap era" even with slight smoothing. This is a visual nicety, not a correctness issue.

## Sources

### Primary (HIGH confidence)
- Phase 2 source code (`src/styles/global.css`, `src/components/*.astro`) — confirmed token architecture and retro pattern to mirror
- `.planning/phases/03-windows-31-theme/03-CONTEXT.md` — all locked decisions
- MDN Web Docs (via WebSearch) — `scrollbar-color`, `scrollbar-width`, `::-webkit-scrollbar` cross-browser behavior

### Secondary (MEDIUM confidence)
- FontsArena (fontsarena.com/w95fa-by-alina-sava/) — W95FA font, OFL license, woff/woff2 formats available
- CDNFonts (cdnfonts.com/w95fa.font) — W95FA hosting with confirmed web font formats
- GitHub jdan/98.css PR #27 (via WebFetch) — Pixelated MS Sans Serif approach: 7KB woff2, inline-in-CSS strategy; fallback to Arial

### Tertiary (LOW confidence)
- WebSearch results for CSS-only dropdown menus — cross-verified with MDN popover API notes; `:focus-within` approach is established but WCAG escape-key behavior needs JS supplement

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new npm dependencies; font file is well-established
- Architecture: HIGH — extends confirmed Phase 2 patterns; CSS token approach validated
- Pitfalls: HIGH — identified from direct code inspection of existing retro hacks
- Font sourcing: MEDIUM — W95FA license confirmed OFL but exact file not yet downloaded

**Research date:** 2026-03-21
**Valid until:** 2026-06-21 (stable CSS properties; font availability unlikely to change)
