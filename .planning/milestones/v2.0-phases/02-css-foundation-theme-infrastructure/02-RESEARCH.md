# Phase 2: CSS Foundation and Theme Infrastructure - Research

**Researched:** 2026-03-21
**Domain:** CSS custom properties theming, Astro View Transitions, accessible dialog
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** On the home page, the Themes button appears as a fourth button in the nav row alongside About, Work, Contact
- **D-02:** On subpages (about, work, contact), the Themes icon appears as a desktop icon (same pattern as the existing Home icon)
- **D-03:** Both entry points open the same mini dialog
- **D-04:** Clicking the Themes button/icon opens a small OS-styled mini dialog window
- **D-05:** Dialog contains radio buttons for each theme with the active theme pre-selected
- **D-06:** Theme applies instantly when a radio option is clicked (live preview) — OK button just closes the dialog
- **D-07:** Dialog is keyboard-accessible (tab to options, arrow keys to switch, Enter/Escape to close)
- **D-08:** Full tokenization — all visual properties get tokens: colors, fonts, borders, shadows, scrollbar styles, link colors
- **D-09:** The animated gradient border on the splash screen is retro-only — not tokenized. Other themes will define their own border style via tokens
- **D-10:** Background: use the same teal + pixel-grid background for all themes initially, but tokenize it so it can be swapped per-theme later (background color and pattern as separate tokens)
- **D-11:** Title treatment (the 3D perspective "Matt Creenan" text): theme-specific. Retro keeps the dramatic 3D chrome look. Win 3.1 and Win 95 will define their own title styles in their respective phases
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

### Deferred Ideas (OUT OF SCOPE)

- Theme-specific cursor styles (THEME-02)
- Theme-specific sound effects (THEME-03)
- Smooth CSS transition animation between themes (THEME-01)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFRA-01 | All hardcoded CSS values in global.css converted to CSS custom properties | Token inventory section; naming convention recommendation; `:root` + `[data-theme]` pattern |
| INFRA-02 | Theme state managed via data-theme attribute on `<html>` element | `[data-theme="retro"]` selector pattern; Layout.astro is the right place to set it |
| INFRA-03 | Anti-flash inline script prevents theme flash on page load | `is:inline` script in BaseHead.astro before stylesheets; synchronous localStorage read |
| INFRA-04 | Theme persists across sessions via localStorage | `localStorage.setItem/getItem("theme")` standard pattern |
| INFRA-05 | Theme state survives Astro View Transitions page navigation | `astro:after-swap` event handler reapplies `data-theme` from localStorage |
| SWITCH-01 | User can switch between three themes from any page | ThemeDialog component; home page nav button + subpage desktop icon |
| SWITCH-02 | Switcher visually indicates which theme is currently active | Radio button `checked` state bound to current localStorage value |
| SWITCH-03 | Switcher is keyboard-accessible | Native `<dialog>` element + radio inputs give keyboard nav for free; Escape closes |
</phase_requirements>

---

## Summary

This phase has two parallel workstreams: (1) refactoring all hardcoded CSS values in `global.css` into CSS custom properties scoped to `[data-theme="retro"]`, and (2) building the theme-switching machinery — anti-flash script, persistence via localStorage, View Transitions survival, and the mini dialog UI.

The CSS tokenization work is purely mechanical: audit `global.css` for every hardcoded hex color, font stack, border, shadow, and scrollbar color and replace them with `--token-name` references defined under `[data-theme="retro"] { }`. The visual output after refactoring must be pixel-identical — the phase succeeds only if the site looks identical to today. No new themes are styled here.

The theme machinery must solve three distinct problems: (1) the initial-load flash (solved with an `is:inline` script that runs synchronously before stylesheets), (2) cross-session persistence (localStorage), and (3) flash during View Transitions navigation (solved with `astro:after-swap` reapplication). The mini dialog is a native `<dialog>` element with radio inputs — no library needed.

**Primary recommendation:** Use `[data-theme="retro"]` attribute selectors on `<html>` as the cascade root, a minimal `is:inline` anti-flash script in `BaseHead.astro`, and `astro:after-swap` to reapply theme after each page navigation. Use the native `<dialog>` element for the switcher — keyboard accessibility comes for free.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS Custom Properties | Native | Theme token variables | Zero-dependency; cascade-native; survives JS failures |
| Native `<dialog>` | HTML spec | Modal switcher UI | Built-in focus trap, Escape key, `showModal()` / `close()` API; accessibility for free |
| localStorage | Web API | Theme persistence | Universal; synchronous on read (critical for anti-flash) |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Astro `is:inline` directive | Astro 4.x | Non-bundled inline script tag | Anti-flash script that MUST run synchronously before CSS parses |
| `astro:after-swap` event | Astro View Transitions | Re-apply theme after navigation | Any `<script>` that sets `data-theme` must listen to this event |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native `<dialog>` | Custom div modal | div requires hand-rolling focus trap, ARIA, Escape; no benefit |
| `astro:after-swap` | `astro:before-swap` + `newDocument` | `before-swap` requires modifying the incoming document; `after-swap` is simpler and sufficient for attribute reapplication |
| `localStorage` | `sessionStorage` or cookies | localStorage persists across sessions (required by INFRA-04); others do not |

**Installation:** No new packages required for this phase. Everything is native browser APIs and existing Astro features.

---

## Architecture Patterns

### Recommended Project Structure

No new directories needed. New/modified files:

```
src/
├── components/
│   ├── BaseHead.astro        # Add is:inline anti-flash script (before stylesheets)
│   ├── ThemeDialog.astro     # NEW: mini dialog with radio buttons
│   └── HomeIcon.astro        # Pattern reference for ThemesIcon
├── layouts/
│   └── Layout.astro          # Add data-theme="retro" to <html>; add ThemesIcon + ThemeDialog
├── pages/
│   └── index.astro           # Add Themes button to nav row (4th button)
└── styles/
    └── global.css            # Refactor all hardcoded values to CSS custom properties
```

### Pattern 1: CSS Token Architecture

**What:** All visual values live as custom properties under a `[data-theme]` attribute selector. `:root` holds only structural/layout values that are not theme-dependent.

**When to use:** This is the only pattern for this phase. Every color, font stack, border spec, shadow, and scrollbar color in `global.css` becomes a token.

**Naming convention (Claude's discretion — recommendation):** Use a two-segment `--{category}-{property}` naming scheme. Prefix with the semantic role, not the visual value:

```css
/* Source: MDN CSS Custom Properties docs + Smashing Magazine naming best practices */
[data-theme="retro"] {
  /* Colors */
  --color-bg:              #008080;
  --color-window:          #c0c0c0;
  --color-window-content:  #ffffff;
  --color-button-bg:       #f0f0f0;
  --color-button-text:     #000000;
  --color-button-border:   #000000;
  --color-link:            #0000EE;
  --color-link-hover:      #0066FF;
  --color-desktop-icon:    #ffffff;
  --color-scrollbar-track: #f1f1f1;
  --color-scrollbar-thumb: #c0c0c0;
  --color-scrollbar-thumb-hover: #a0a0a0;

  /* Typography */
  --font-body:   "Courier New", monospace;
  --font-title:  'Roboto', sans-serif;

  /* Borders */
  --border-button:  2px solid #000;
  --border-headshot: 3px solid #000;

  /* Shadows */
  --shadow-button:       2px 2px 0 #000;
  --shadow-button-hover: 4px 4px 0 #000;
  --shadow-headshot:     4px 4px 0 #000;
  --shadow-window:       0 8px 12px rgba(0,0,0,0.12), 0 12px 24px rgba(0,0,0,0.1),
                         0 24px 32px rgba(0,0,0,0.08), 0 32px 48px rgba(0,0,0,0.06);

  /* Background: tokenized so future themes can swap (D-10) */
  --bg-color:            #008080;
  --bg-pixel-grid-light: rgba(255,255,255,0.08);
  --bg-pixel-grid-dark:  rgba(0,0,0,0.05);
}
```

**Usage in rules:**
```css
/* global.css — after tokenization */
body {
  background-color: var(--color-bg);
  font-family: var(--font-body);
}

.button {
  background-color: var(--color-button-bg);
  border: var(--border-button);
  box-shadow: var(--shadow-button);
  color: var(--color-button-text);
}
```

### Pattern 2: Anti-Flash Inline Script

**What:** A synchronous, render-blocking inline script placed in `<head>` BEFORE the `<link rel="stylesheet">` import of `global.css`. It reads localStorage and immediately sets `data-theme` on `<html>` before a single pixel is painted.

**When to use:** Always — this is the ONLY way to prevent flash of unstyled/wrong-theme content on first load.

**Critical constraint:** Must use `is:inline` directive in Astro so the script is emitted literally into the HTML output (not bundled/deferred). Must NOT use `type="module"` (module scripts are deferred by default).

```astro
<!-- Source: Astro official docs view-transitions guide + CSS-Tricks FART article -->
<!-- In BaseHead.astro, BEFORE the global.css import -->
<script is:inline>
  (function() {
    const saved = localStorage.getItem('theme');
    const theme = saved || 'retro';
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

**Why wrap in IIFE:** Keeps variables out of global scope. Must be kept minimal — it's render-blocking.

### Pattern 3: View Transitions Theme Reapplication

**What:** After Astro swaps the page DOM during navigation, the `data-theme` attribute on `<html>` is preserved because Astro diffs `<head>` and only replaces `<body>`. However, any `<script>` setup code for the dialog must be rebound.

**When to use:** Required for INFRA-05. The anti-flash inline script handles first load; this handles navigation.

```astro
<!-- Source: Astro official docs — the canonical dark mode with view transitions example -->
<!-- In BaseHead.astro or Layout.astro, in a regular (bundled) script tag -->
<script>
  function applyTheme() {
    const theme = localStorage.getItem('theme') || 'retro';
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Re-apply after every View Transitions navigation
  document.addEventListener('astro:after-swap', applyTheme);
  // Also apply on initial load (fallback, anti-flash script is primary)
  applyTheme();
</script>
```

**Note on event choice:** `astro:after-swap` fires after the new page body is in the DOM but before elements are painted. This is the correct hook per official Astro docs — it prevents the "flash of light mode" problem during navigation.

### Pattern 4: ThemeDialog Component (Native dialog)

**What:** A native HTML `<dialog>` element with radio inputs for theme selection. The dialog is opened with `dialog.showModal()` (not `dialog.show()` — modal blocks interaction with the rest of the page). Closed by OK button, Escape key (built-in), or click-outside.

**When to use:** Per D-04 through D-07.

```astro
<!-- ThemeDialog.astro — Source: nilshendriks.com Astro dialog pattern + MDN dialog docs -->
---
// No props needed — reads/writes localStorage directly
---

<dialog id="theme-dialog" class="theme-dialog">
  <div class="theme-dialog-content">
    <h2 class="theme-dialog-title">Select Theme</h2>
    <form method="dialog" class="theme-dialog-options">
      <label class="theme-option">
        <input type="radio" name="theme" value="retro" />
        Retro
      </label>
      <label class="theme-option">
        <input type="radio" name="theme" value="win31" />
        Win 3.1
      </label>
      <label class="theme-option">
        <input type="radio" name="theme" value="win95" />
        Win 95
      </label>
    </form>
    <button class="button theme-dialog-close" type="button">OK</button>
  </div>
</dialog>

<script>
  function initThemeDialog() {
    const dialog = document.getElementById('theme-dialog');
    const radios = dialog.querySelectorAll('input[name="theme"]');
    const closeBtn = dialog.querySelector('.theme-dialog-close');

    // Pre-select the current theme (SWITCH-02)
    const current = localStorage.getItem('theme') || 'retro';
    radios.forEach(r => { r.checked = r.value === current; });

    // Instant apply on radio change (D-06)
    radios.forEach(r => {
      r.addEventListener('change', () => {
        localStorage.setItem('theme', r.value);
        document.documentElement.setAttribute('data-theme', r.value);
      });
    });

    // Close on OK button
    closeBtn.addEventListener('click', () => dialog.close());

    // Click-outside-to-close
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  }

  // Re-init after View Transitions navigation
  document.addEventListener('astro:after-swap', initThemeDialog);
  initThemeDialog();

  // Expose open function for trigger buttons
  window.openThemeDialog = function() {
    const dialog = document.getElementById('theme-dialog');
    const current = localStorage.getItem('theme') || 'retro';
    dialog.querySelectorAll('input[name="theme"]').forEach(r => {
      r.checked = r.value === current;
    });
    dialog.showModal();
  };
</script>
```

**Keyboard behavior (D-07):** Native radio inputs inside a `<dialog>` handle arrow-key navigation between options automatically. Tab moves between focusable elements. Escape closes the dialog via the browser's built-in `<dialog>` behavior — no custom handler needed.

### Pattern 5: Themes Button (Home Page) and Desktop Icon (Subpages)

**Home page — 4th nav button (D-01):**
```astro
<!-- index.astro — add after Contact button, same class/structure -->
<button
  class="button flex flex-col justify-between py-2"
  onclick="window.openThemeDialog()"
  type="button"
>
  <i class="ph ph-palette text-4xl"></i>
  <span>Themes</span>
</button>
```

**Subpage desktop icon (D-02) — ThemesIcon.astro, following HomeIcon.astro pattern:**
```astro
<!-- ThemesIcon.astro -->
<button
  class="desktop-icon"
  onclick="window.openThemeDialog()"
  type="button"
  style="background: none; border: none;"
>
  <i class="ph ph-palette"></i>
  <span>Themes</span>
</button>
```

**Integration point:** `ThemeDialog` and `ThemesIcon` must both be rendered inside `Layout.astro` so they appear on every subpage without duplication.

### Anti-Patterns to Avoid

- **Script without `is:inline` for anti-flash:** Default Astro scripts are bundled and injected asynchronously — they arrive too late to prevent the flash. The initial localStorage read MUST be `is:inline`.
- **Setting `data-theme` on `<body>` instead of `<html>`:** Astro View Transitions replaces `<body>` on navigation, so any attribute on `<body>` is wiped. The `<html>` element persists. Always set on `documentElement`.
- **Using `astro:before-swap` + `newDocument`:** While technically correct, this approach modifies the incoming document before swap — more complex than necessary. `astro:after-swap` is the simpler, officially-documented pattern.
- **Hand-rolling focus trap for dialog:** The native `<dialog>` with `showModal()` traps focus inside automatically. Do not add a custom focus trap — it will conflict.
- **Tokenizing the animated gradient border (D-09):** The `@keyframes borderGradient` animation and its `border-image-source` values are retro-only by decision. Leave them as hardcoded values inside a `[data-theme="retro"]` rule block. Do not create tokens for these values.
- **Using CSS classes (`.retro`, `.win31`) instead of `data-theme` attribute:** The `data-theme` attribute approach is the locked decision (D-12 through D-14) and is the conventional pattern for multi-theme systems. Do not use class-based theming.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dialog focus trap | Custom focus management | Native `<dialog>.showModal()` | Browser handles focus containment, Escape key, and focus restoration automatically |
| Keyboard arrow-key navigation in radio group | Custom keydown handlers | Native `<input type="radio">` | Browser handles arrow key navigation within a `name` group natively |
| Theme flash prevention | CSS-only approaches (prefers-color-scheme media query won't help) | `is:inline` synchronous script | CSS media queries can't read localStorage; only a synchronous script can |
| Re-running scripts after navigation | Manual script injection | `astro:after-swap` event | Astro's built-in lifecycle event is exactly the right hook |

**Key insight:** CSS custom properties + native `<dialog>` + localStorage covers everything in this phase. Zero npm packages needed.

---

## Hardcoded Values to Tokenize (Complete Inventory)

This is the complete audit of `src/styles/global.css` values that need tokens under `[data-theme="retro"]`:

| Location | Hardcoded Value | Token Name |
|----------|-----------------|------------|
| `body` | `#008080` (bg) | `--color-bg` |
| `body` gradient | `rgba(255,255,255,0.15)` | `--bg-gradient-fade` |
| `body` pixel grid | `rgba(255,255,255,0.08)` | `--bg-pixel-light` |
| `body` pixel grid | `rgba(0,0,0,0.05)` | `--bg-pixel-dark` |
| `.window` | `#c0c0c0` (bg) | `--color-window` |
| `.button` | `#f0f0f0` (bg) | `--color-button-bg` |
| `.button` | `2px solid #000` (border) | `--border-button` |
| `.button` | `2px 2px 0 #000` (shadow) | `--shadow-button` |
| `.button` | `#000` (color) | `--color-button-text` |
| `.button:hover` | `4px 4px 0 #000` (shadow) | `--shadow-button-hover` |
| `.os-title` | `'Roboto', sans-serif` | `--font-title` |
| `.os-title` | `#000000` (color) | `--color-title` |
| `.splash-screen` | `linear-gradient(145deg, #f0f0f0 ... #a8a8a8)` | `--bg-splash` |
| `.splash-screen` | multi-layer `box-shadow` | `--shadow-window` |
| `.headshot-image` | `3px solid #000` | `--border-headshot` |
| `.headshot-image` | `4px 4px 0 #000` | `--shadow-headshot` |
| `.content-window` | `linear-gradient(145deg, #fff ... #f5f5f5)` | `--bg-content-window` |
| `.window-content` scrollbar | `#f1f1f1` (track) | `--color-scrollbar-track` |
| `.window-content` scrollbar | `1px solid #000` (track border) | `--border-scrollbar` |
| `.window-content` scrollbar | `#c0c0c0` (thumb) | `--color-scrollbar-thumb` |
| `.window-content` scrollbar | `#a0a0a0` (thumb hover) | `--color-scrollbar-thumb-hover` |
| `.window-title` gradient | `#00FFF0`, `#FFFFFF` | `--color-title-gradient-start`, `--color-title-gradient-end` |
| `.window-title` text-shadow | `rgba(25,25,112,0.7)` | `--color-title-shadow` |
| `.window-title` glow | `rgba(0,255,240,0.4)`, `rgba(0,255,204,0.3)` | `--color-title-glow-1`, `--color-title-glow-2` |
| `.window-title` font | `'Roboto', sans-serif` | `--font-title` (shared) |
| `.desktop-icon` | `white` (color) | `--color-desktop-icon` |
| `.desktop-icon` text-shadow | `rgba(0,0,0,0.7)` | `--color-desktop-icon-shadow` |
| `.desktop-icon:hover/focus` | `rgba(0,0,255,0.3)` | `--color-desktop-icon-highlight` |
| `.desktop-icon:focus` | `1px dotted white` | `--outline-desktop-icon` |
| `.desktop-icon span` text-shadow | `#000` (4x) | `--color-desktop-label-stroke` |
| `.desktop-icon i` filter | `rgba(0,0,0,0.7)` | `--filter-desktop-icon` |
| `.window-content a` | `#0000EE` (link) | `--color-link` |
| `.window-content a:hover` | `#0066FF` (link hover) | `--color-link-hover` |

**NOT to tokenize (retro-only by D-09):**
- `@keyframes borderGradient` animation colors (`#2E0854`, `#5B2D90`, `#2962FF`, `#000000`)
- `border-image-source` animated values on `.splash-screen`

**NOT to tokenize (not visual/theme-specific):**
- Dimensional values (`width: 96px`, `height: 96px`, `padding: 8px`) — layout, not theme
- `border-image-slice: 1`, `border-radius: 0` — structural, not theme-colored

---

## Common Pitfalls

### Pitfall 1: Anti-Flash Script Not Truly Inline

**What goes wrong:** The theme script runs after CSS is already applied, causing a brief flash of the default retro theme even when a different theme is saved.
**Why it happens:** Astro's default `<script>` tag is bundled and injected with `type="module"`, which is always deferred. Even a `<script>` placed early in the template doesn't execute synchronously.
**How to avoid:** Use `<script is:inline>` in `BaseHead.astro`. This emits the script literally into the HTML output. Verify in the built HTML that the script appears immediately in `<head>` before any `<link>` stylesheet tags.
**Warning signs:** Visible flash of wrong theme on second+ visits. Check DevTools Network tab for script load order.

### Pitfall 2: `data-theme` on `<body>` Wiped by View Transitions

**What goes wrong:** Theme is lost on every page navigation — the page snaps back to the default theme.
**Why it happens:** Astro View Transitions replaces the entire `<body>` element. Any attribute set on `<body>` is destroyed. Only `<html>` (the `documentElement`) survives.
**How to avoid:** Always set `document.documentElement.setAttribute('data-theme', theme)`. Never target `document.body`. Set initial value on the `<html>` tag in `Layout.astro` as `data-theme="retro"` for SSG fallback.
**Warning signs:** Theme resets to default when clicking a nav link.

### Pitfall 3: Dialog Script Not Re-initialized After Navigation

**What goes wrong:** The Themes button opens the dialog on first load, but after navigating to a new page and clicking the Themes icon, nothing happens.
**Why it happens:** Astro View Transitions replaces the body, including the `<dialog>` element. The old event listeners are attached to the old DOM node, which is now gone.
**How to avoid:** Wrap all `ThemeDialog` event listener setup in a function and call it both on initial load AND inside `document.addEventListener('astro:after-swap', ...)`.
**Warning signs:** Dialog trigger works on first page load but fails after navigation.

### Pitfall 4: Visual Regression from Incomplete Tokenization

**What goes wrong:** The site looks different after the CSS refactor — a color is wrong, a shadow is missing, or a scrollbar style is lost.
**Why it happens:** A hardcoded value was missed during the audit, or a `var()` reference was misspelled and silently fell back to `inherit` or `initial`.
**How to avoid:** Use the token inventory table above as a checklist. After each token group is refactored, do a visual diff in the browser at each breakpoint (full-width, 640px, 380px). CSS custom property typos fail silently.
**Warning signs:** Any visual difference between before-and-after screenshots. Pay special attention to scrollbars (often forgotten), box-shadows (complex multi-layer values), and the window title gradient.

### Pitfall 5: `.window` Class Collision with Future 98.css (Phase 4 Flag)

**What goes wrong:** Phase 4 will import 98.css, which defines its own `.window` class with beveled Win95 styles. If `.window` in `global.css` is not scoped, it will conflict.
**Why it happens:** Both `global.css` and 98.css use the same class name for different visual styles.
**How to avoid:** During tokenization in this phase, wrap the `.window { background-color: var(--color-window); }` rule under `[data-theme="retro"] .window { }` or `[data-theme="retro"] { .window { } }` (CSS nesting). This scoping prevents the collision in Phase 4.
**Warning signs:** Noted in STATE.md as a Phase 4 research flag — address proactively now.

### Pitfall 6: `<dialog>` Needs CSS Reset for Themed Appearance

**What goes wrong:** The native `<dialog>` element has browser-default styling (border, padding, background, position) that looks wrong in the retro OS aesthetic.
**Why it happens:** `<dialog>` has UA stylesheet defaults that differ across browsers: Chrome adds `border`, Firefox adds different defaults.
**How to avoid:** Add explicit CSS reset/override for `.theme-dialog`: set `border`, `padding`, `background-color`, `box-shadow` using retro theme tokens. The dialog should be styled using `.window` / `.window-content` class patterns to match the OS chrome.
**Warning signs:** Dialog appears with default browser chrome (usually a thin border, system background) instead of retro window styling.

---

## Code Examples

### Complete Anti-Flash + View Transitions Script

```astro
<!-- Source: Astro official docs view-transitions guide -->
<!-- BaseHead.astro — BEFORE the global.css import line -->

<!-- Anti-flash: runs synchronously before any CSS is applied -->
<script is:inline>
  (function() {
    var saved = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', saved || 'retro');
  })();
</script>

<!-- Then the stylesheet import proceeds -->
```

```astro
<!-- In a separate regular <script> tag (bundled is fine here) -->
<!-- Also in BaseHead.astro or Layout.astro -->
<script>
  // Reapply theme after View Transitions navigation (INFRA-05)
  document.addEventListener('astro:after-swap', function() {
    var saved = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', saved || 'retro');
  });
</script>
```

### Layout.astro with data-theme Fallback

```astro
<!-- Layout.astro — html element gets SSG fallback; JS overrides on client -->
<html lang="en" data-theme="retro">
```

### CSS Token Structure

```css
/* global.css — complete token block for retro theme */
[data-theme="retro"] {
  --color-bg:                    #008080;
  --color-window:                #c0c0c0;
  --color-window-content:        #ffffff;
  --color-button-bg:             #f0f0f0;
  --color-button-text:           #000000;
  --color-button-border:         #000000;
  --color-link:                  #0000EE;
  --color-link-hover:            #0066FF;
  --color-desktop-icon:          #ffffff;
  --color-scrollbar-track:       #f1f1f1;
  --color-scrollbar-thumb:       #c0c0c0;
  --color-scrollbar-thumb-hover: #a0a0a0;
  --font-body:                   "Courier New", monospace;
  --font-title:                  'Roboto', sans-serif;
  --border-button:               2px solid #000;
  --border-headshot:             3px solid #000;
  --shadow-button:               2px 2px 0 #000;
  --shadow-button-hover:         4px 4px 0 #000;
  --shadow-headshot:             4px 4px 0 #000;
  --bg-splash:                   linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 25%, #c8c8c8 50%, #b8b8b8 75%, #a8a8a8 100%);
  --bg-content-window:           linear-gradient(145deg, #ffffff 0%, #fafafa 50%, #f5f5f5 100%);
  --shadow-window:               0 8px 12px rgba(0,0,0,0.12), 0 12px 24px rgba(0,0,0,0.1),
                                 0 24px 32px rgba(0,0,0,0.08), 0 32px 48px rgba(0,0,0,0.06);
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Class-based theming (`.dark`, `.light` on body) | `data-theme` attribute on `<html>` | Post-2020 convention | Survives body replacement; works with CSS attribute selectors |
| Manual focus trap for modals | Native `<dialog>.showModal()` | Broad browser support ~2022+ | Eliminates complex JS focus management |
| `astro:before-swap` newDocument modification | `astro:after-swap` reapplication | Astro 2.10+ | Simpler; officially documented pattern for theme persistence |
| Bundled script for anti-flash | `<script is:inline>` synchronous read | Astro 2.x+ | Inline script executes before CSS parsing; prevents flash |

---

## Open Questions

1. **ThemeDialog dialog backdrop styling**
   - What we know: Native `<dialog>` exposes a `::backdrop` pseudo-element when opened with `showModal()`
   - What's unclear: Whether a retro OS dialog should have a dimmed backdrop or be borderless/floating — this is Claude's Discretion per context
   - Recommendation: Use a subtle backdrop (`rgba(0,0,0,0.3)`) to establish modal affordance; style it in the retro theme tokens

2. **Tailwind utility conflicts with theme tokens**
   - What we know: Tailwind 3.x utility classes use fixed values; CSS custom properties override inline values but not Tailwind classes
   - What's unclear: Some elements (e.g., the `body` tag) use Tailwind classes alongside global.css rules — if both specify a property, Tailwind wins via specificity
   - Recommendation: Audit all Tailwind classes used on `body`, `main`, and top-level containers. In places where Tailwind classes set values that need to be themeable, use CSS custom properties in global.css rather than inline Tailwind classes, or use Tailwind's `theme()` function

3. **`window` class scoping timing**
   - What we know: STATE.md flags the `.window` class collision with 98.css as a Phase 4 concern
   - What's unclear: Whether scoping `.window` under `[data-theme="retro"]` now requires touching all pages that use `class="window"` or just global.css
   - Recommendation: Scope in global.css only — CSS cascade means `[data-theme="retro"] .window` will apply when the html element has the attribute. No HTML changes needed.

---

## Sources

### Primary (HIGH confidence)
- [Astro View Transitions Official Docs](https://docs.astro.build/en/guides/view-transitions/) — lifecycle events, `astro:after-swap`, dark mode persistence example
- [Astro Scripts and Event Handling](https://docs.astro.build/en/guides/client-side-scripts/) — `is:inline` directive behavior and non-bundled script semantics
- [MDN — Using CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) — `:root` and `[data-theme]` selector pattern
- [MDN — `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) — `showModal()`, `close()`, `::backdrop`, built-in keyboard behavior

### Secondary (MEDIUM confidence)
- [CSS-Tricks — Flash of inAccurate coloR Theme (FART)](https://css-tricks.com/flash-of-inaccurate-color-theme-fart/) — canonical anti-flash pattern; inline script placement
- [Jack Watters — Astro Theme Toggle with Page Transitions](https://www.jackwatters.dev/blog/astro-theme-toggle-with-page-transitions) — `astro:after-swap` reapplication pattern verified against official docs
- [Nils Hendriks — Astro Dialog Component](https://nilshendriks.com/posts/modal-dialog/) — native `<dialog>` + Astro component pattern with unique ID and slot
- [Smashing Magazine — Naming Best Practices for Design Tokens](https://www.smashingmagazine.com/2024/05/naming-best-practices/) — token naming convention guidance

### Tertiary (LOW confidence)
- [Victor Lillo — Theme Selector in Astro](https://victorlillo.dev/blog/theme-selector-component-in-astro) — general pattern reference; not verified line-by-line against official docs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all patterns are native browser APIs or officially documented Astro features
- Architecture: HIGH — patterns confirmed against Astro official docs; token inventory audited directly from source files
- Pitfalls: HIGH for P1–P4 (confirmed from Astro issue tracker and official docs); MEDIUM for P5–P6 (observed patterns, verified against browser behavior)

**Research date:** 2026-03-21
**Valid until:** 2026-09-21 (stable APIs; Astro View Transitions event API is stable in 4.x)
