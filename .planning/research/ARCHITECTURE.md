# Architecture Research

**Domain:** Switchable theme system for Astro static site
**Researched:** 2026-03-21
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Pages Layer                               │
│  (index.astro, about.astro, work.astro, contact.astro)          │
│  No changes needed — pages become theme-agnostic content shells │
├─────────────────────────────────────────────────────────────────┤
│                        Layout Layer                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Layout.astro — inject ThemeSwitcher, theme-init script  │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      Theme Components Layer                      │
│  ┌─────────────┐  ┌────────────────┐  ┌───────────────────┐    │
│  │  Window.astro│  │ThemeSwitcher   │  │  Desktop.astro    │    │
│  │  (existing, │  │.astro (new)    │  │  (new, Win themes) │    │
│  │  adapted)   │  └────────────────┘  └───────────────────┘    │
│  └─────────────┘                                                │
├─────────────────────────────────────────────────────────────────┤
│                        Theme CSS Layer                           │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐     │
│  │ global.css   │  │ theme-win31   │  │ theme-win95      │     │
│  │ (base vars,  │  │ .css (new)    │  │ .css (new)       │     │
│  │  default     │  └───────────────┘  └──────────────────┘     │
│  │  theme vars) │                                               │
│  └──────────────┘                                               │
├─────────────────────────────────────────────────────────────────┤
│                     Theme State Layer                            │
│  html[data-theme="retro" | "win31" | "win95"]                   │
│  Controlled by: inline head script (load) + astro:after-swap    │
│  Persisted in: localStorage (optional for v2.0)                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Status |
|-----------|----------------|--------|
| `Layout.astro` | Root HTML shell, injects theme-init script and ThemeSwitcher | Modify |
| `BaseHead.astro` | Document head metadata — no changes needed | Existing, unchanged |
| `Window.astro` | OS window chrome — becomes theme-aware via CSS vars | Modify lightly |
| `Button.astro` | App-icon-style buttons — becomes theme-aware via CSS vars | Modify lightly |
| `HomeIcon.astro` | Home desktop icon — becomes theme-aware via CSS vars | Modify lightly |
| `ThemeSwitcher.astro` | Theme picker UI accessible from all pages | New |
| `Desktop.astro` | Windows theme desktop shell (taskbar, icons) | New |
| `Taskbar.astro` | Windows 95-style taskbar with Start button | New (Win95 only) |

## Recommended Project Structure

```
src/
├── components/
│   ├── BaseHead.astro         # unchanged
│   ├── Window.astro           # adapted to use CSS vars
│   ├── Button.astro           # adapted to use CSS vars
│   ├── HomeIcon.astro         # adapted to use CSS vars
│   ├── HeaderLink.astro       # unchanged
│   ├── ThemeSwitcher.astro    # new: theme picker UI
│   ├── Desktop.astro          # new: Windows theme desktop shell
│   └── Taskbar.astro          # new: Windows 95 taskbar (Win95 theme)
├── layouts/
│   └── Layout.astro           # modified: adds ThemeSwitcher + theme script
├── pages/
│   ├── index.astro            # adapted: content stays, chrome becomes theme-driven
│   ├── about.astro            # adapted: same
│   ├── work.astro             # adapted: same
│   └── contact.astro          # adapted: same
├── styles/
│   ├── global.css             # modified: CSS vars declared here, retro theme vars
│   ├── theme-win31.css        # new: Windows 3.1 CSS vars + component overrides
│   └── theme-win95.css        # new: Windows 95 CSS vars + component overrides
└── consts.ts                  # add THEMES constant and default theme
```

### Structure Rationale

- **styles/theme-*.css:** Theme CSS lives in separate files, imported once in `global.css` or `BaseHead.astro`. This keeps concerns separated and allows future themes without touching existing files.
- **components/Desktop.astro:** Windows themes require a desktop metaphor (icons on wallpaper, app-opening pattern) that doesn't exist in the retro theme. Isolating this in its own component keeps Layout lean.
- **components/ThemeSwitcher.astro:** Self-contained, rendered once in Layout. Contains its own inline `<script is:inline>` to avoid Astro optimization stripping out localStorage reads.

## Architectural Patterns

### Pattern 1: CSS Custom Properties with data-theme Attribute

**What:** All visual tokens (colors, borders, fonts, shadows) defined as CSS custom properties. The `html` element carries a `data-theme` attribute. Each theme stylesheet overrides the variables under its selector.

**When to use:** Any multi-theme system where components share the same HTML structure but differ visually. This is the correct approach here.

**Trade-offs:** Components need zero JS to respond to theme changes — only CSS needs to change. Variables cascade naturally. The downside is that Windows themes also require structural changes (a desktop with floating windows vs. centered content), so CSS vars alone are not sufficient for layout changes.

**Example:**
```css
/* global.css — default (retro) theme */
:root {
  --bg-desktop: #008080;
  --bg-window: #c0c0c0;
  --border-window: 4px solid;
  --font-body: "Courier New", monospace;
  --color-titlebar-text: transparent; /* retro uses gradient */
  --shadow-window: 0 8px 12px rgba(0,0,0,0.12), ...;
}

/* theme-win95.css — Win95 overrides */
[data-theme="win95"] {
  --bg-desktop: #008080;
  --bg-window: #c0c0c0;
  --border-window: 2px solid #000;
  --font-body: "MS Sans Serif", "Arial", sans-serif;
  --color-titlebar-text: #ffffff;
  --shadow-window: inset -1px -1px 0 #808080, inset 1px 1px 0 #ffffff;
}

/* theme-win31.css — Win 3.1 overrides */
[data-theme="win31"] {
  --bg-desktop: #008080;
  --bg-window: #c0c0c0;
  --border-window: 2px solid #000;
  --font-body: "Fixedsys", "Courier New", monospace;
  --color-titlebar-text: #ffffff;
  --shadow-window: 2px 2px 0 #000000;
}
```

### Pattern 2: Theme-Init Inline Script (Anti-Flash)

**What:** A small inline `<script is:inline>` placed in the `<head>` that reads localStorage and sets `document.documentElement.dataset.theme` before the page renders. Repeated on `astro:after-swap` for view transitions.

**When to use:** Required whenever theme state persists via localStorage. Without this, users see the default theme flash before their saved theme applies.

**Trade-offs:** Tiny inline script (< 200 bytes) runs synchronously — no bundle, no import. The `is:inline` attribute bypasses Astro's module optimization, which is correct here. Must be duplicated in the `astro:after-swap` listener for view transitions.

**Example:**
```html
<!-- In BaseHead.astro or Layout.astro <head> -->
<script is:inline>
  (function() {
    var theme = localStorage.getItem('site-theme') || 'retro';
    document.documentElement.dataset.theme = theme;
  })();
</script>
```

```javascript
// Also in a non-inline <script> block for view transitions:
document.addEventListener('astro:after-swap', () => {
  const theme = localStorage.getItem('site-theme') || 'retro';
  document.documentElement.dataset.theme = theme;
});
```

### Pattern 3: Layout-Conditional Desktop Shell

**What:** Layout.astro renders different structural wrappers based on the active theme. Windows themes render a `Desktop.astro` component that provides the wallpaper, floating-window metaphor, and taskbar. The retro theme uses the existing centered-content layout.

**When to use:** When themes differ structurally, not just visually. Win3.1 and Win95 have a desktop with icons that "open" content in floating windows — fundamentally different from the retro theme's single centered window.

**Trade-offs:** Theme switching requires a page reload (or View Transition) to change the structural layout. Since theme state is only set on `html`, a client-side structural change requires reading the data-theme value in JavaScript and conditionally rendering different DOM. The simplest approach: accept a page reload on theme change. This avoids a complex client-side conditional render.

**Example approach:**
```astro
---
// Layout.astro
const theme = Astro.cookies.get('site-theme')?.value || 'retro';
// OR: theme is read client-side, Desktop uses CSS display:none
---
<html lang="en" data-theme="retro">  <!-- default; overridden by inline script -->
  <head>...</head>
  <body>
    <!-- Desktop shell shown via CSS only for Windows themes -->
    <Desktop />
    <!-- Retro layout shown via CSS only for retro theme -->
    <main class="retro-layout">
      <slot />
    </main>
  </body>
</html>
```

```css
/* Desktop.astro is hidden for retro theme */
[data-theme="retro"] .desktop-shell { display: none; }
[data-theme="win31"] .retro-layout { display: none; }
[data-theme="win95"] .retro-layout { display: none; }
```

### Pattern 4: App-Launcher Metaphor for Windows Themes

**What:** Instead of direct navigation links, Windows themes show content sections as desktop icons (Win3.1 Program Manager icons or Win95 desktop icons). Clicking opens the section in a floating, themed window that overlays the desktop. The URL still changes (Astro page routing is preserved), but the visual metaphor is "launching an app."

**When to use:** Win3.1 and Win95 themes specifically. The retro theme keeps its current centered-window navigation pattern.

**Trade-offs:** The simplest implementation treats each page as a "maximized app window" filling the desktop area rather than truly floating windows (which would require real window management JS). Each page navigates normally; the desktop chrome (taskbar, icons) is persistent via Layout. This avoids draggable-window complexity while preserving the OS aesthetic.

**Recommended simplification:** Each Windows theme page renders as a "maximized window" that fills the desktop. The desktop wallpaper and taskbar frame it. No dragging or multi-window management needed for v2.0.

## Data Flow

### Theme Selection Flow

```
User clicks ThemeSwitcher
    ↓
ThemeSwitcher JS: localStorage.setItem('site-theme', newTheme)
    ↓
document.documentElement.dataset.theme = newTheme
    ↓
CSS custom properties cascade immediately (visual update)
    ↓
If layout change required (retro ↔ Windows): trigger page reload
    OR: CSS display:none swap for structural shell changes
```

### Theme Restoration on Page Load

```
Browser requests page → Astro sends static HTML (data-theme="retro" default)
    ↓
<script is:inline> in <head> executes synchronously
    ↓
reads localStorage 'site-theme'
    ↓
sets document.documentElement.dataset.theme before first paint
    ↓
CSS vars apply immediately — no flash
```

### View Transitions Theme Persistence

```
User navigates (View Transition)
    ↓
astro:after-swap fires (new DOM replacing old, before paint)
    ↓
Event handler reads localStorage, sets data-theme on new html
    ↓
Theme preserved across navigation without flash
```

### Key Data Flows

1. **Theme state:** Flows from localStorage → inline script → `html[data-theme]` → CSS custom properties → component visual styles
2. **Navigation:** Standard Astro file-based routing, unchanged. View Transitions API already in use (via BaseHead.astro `ViewTransitions`)
3. **Content:** All page content (About, Work, Contact) is static. Theme only affects chrome and layout — not content.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 3 themes (v2.0) | CSS vars + data-theme is sufficient, no dynamic imports needed |
| 5-8 themes | Extract theme configs to a `themes.ts` config file, generate CSS vars programmatically |
| 10+ themes | Consider CSS-in-JS or a PostCSS plugin to manage variable sets |

### Scaling Priorities

1. **First bottleneck:** CSS specificity conflicts between theme stylesheets. Prevent by always scoping theme vars under `[data-theme="x"]` selectors, never using bare class overrides.
2. **Second bottleneck:** Structural complexity if themes diverge further (floating windows, drag-resize). Not needed for v2.0 — defer window management JS entirely.

## Anti-Patterns

### Anti-Pattern 1: Per-Component Theme Awareness via Props

**What people do:** Pass `theme` prop through every component (`<Window theme="win95" />`, `<Button theme="win95" />`)
**Why it's wrong:** Creates prop-drilling through the entire component tree. Every component needs updating when a theme is added. The theme is global state — it should not be prop-drilled.
**Do this instead:** Use `html[data-theme]` as the single source of truth. Components read theme implicitly via CSS custom properties. No component needs a theme prop.

### Anti-Pattern 2: Separate Stylesheet Imports Per Theme

**What people do:** Import different CSS files based on the selected theme (`import './theme-win95.css'`)
**Why it's wrong:** Astro compiles CSS at build time. You cannot conditionally import stylesheets based on runtime state. All theme stylesheets must be imported unconditionally; theme switching happens via the `data-theme` attribute in CSS selectors.
**Do this instead:** Import all theme stylesheets unconditionally in `global.css` or `BaseHead.astro`. Let CSS selectors (`[data-theme="win95"]`) determine which rules apply.

### Anti-Pattern 3: Astro.request / Server-Side Theme Reading

**What people do:** Read theme from a cookie server-side (`Astro.cookies.get('theme')`) and render different HTML per theme on each request.
**Why it's wrong:** This site is a static site (`output: 'static'` default in Astro). There is no server-side request processing at runtime. Each page is pre-rendered HTML.
**Do this instead:** Default to the base theme in static HTML. Use the inline `<script is:inline>` pattern to apply the correct theme client-side before first paint. Accept that the base theme flashes for ~1 frame on hard reload (imperceptible in practice with the inline script approach).

### Anti-Pattern 4: Using Astro Islands for Theme Switching

**What people do:** Create a React or Svelte island component (`client:load`) for the ThemeSwitcher to manage state.
**Why it's wrong:** Unnecessary framework overhead for what is fundamentally a 5-line vanilla JS operation. Introduces a hydration dependency.
**Do this instead:** Write a plain `ThemeSwitcher.astro` with a `<script>` block containing vanilla JS event listeners. Astro bundles this efficiently, no framework needed.

## Integration Points

### Existing Components — Integration with Theme System

| Component | Integration Required | Notes |
|-----------|---------------------|-------|
| `Window.astro` | Replace hardcoded colors with CSS vars | `background-color: #c0c0c0` → `var(--bg-window)`, etc. |
| `Button.astro` | Replace hardcoded colors with CSS vars | `background-color: #f0f0f0` → `var(--bg-button)`, etc. |
| `HomeIcon.astro` | Replace hardcoded colors with CSS vars | Desktop icon colors are theme-specific |
| `Layout.astro` | Add `<ThemeSwitcher />`, add theme-init script | Critical integration point |
| `BaseHead.astro` | Add theme stylesheet imports | All three theme CSS files imported here |
| `global.css` | Refactor to use CSS vars throughout | Define `:root` vars as the retro theme defaults |

### New Components Required

| Component | Purpose | Theme Scope |
|-----------|---------|-------------|
| `ThemeSwitcher.astro` | Floating picker UI (radio buttons or segmented control) | All themes |
| `Desktop.astro` | Desktop wallpaper + icon grid for Windows themes | Win3.1, Win95 |
| `Taskbar.astro` | Win95 taskbar with Start button and system clock | Win95 only |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| ThemeSwitcher ↔ global CSS | `html[data-theme]` attribute | No direct JS coupling; CSS vars handle visual response |
| ThemeSwitcher ↔ Layout | ThemeSwitcher is a child of Layout | Rendered once, visible on all pages |
| Desktop ↔ Pages | Pages render inside Desktop's content slot | Desktop provides the chrome; pages provide content |
| theme-*.css ↔ Window.astro | CSS vars consumed by Window's class selectors | No Astro prop needed |

## Suggested Build Order

Dependencies determine order. Each phase must be complete before the next starts.

### Phase 1 — CSS Foundation (no visual regressions)
**Goal:** Convert existing hardcoded CSS values to CSS custom properties, keeping the retro theme identical.
- Refactor `global.css`: extract all color/shadow/font values into `:root` CSS vars
- Verify retro theme looks unchanged
- Add `html[data-theme="retro"]` as alias for `:root` vars
- Import stubs for `theme-win31.css` and `theme-win95.css` (empty files)

### Phase 2 — Theme State Infrastructure
**Goal:** Theme switching machinery works before any new theme UI exists.
- Add `ThemeSwitcher.astro` component (minimal UI — three buttons)
- Add inline theme-init `<script is:inline>` to `BaseHead.astro`
- Add `astro:after-swap` listener in Layout.astro for view transitions
- Test: clicking switcher buttons changes `html[data-theme]` and CSS vars respond

### Phase 3 — Windows 3.1 Theme CSS
**Goal:** Win3.1 visual theme is complete, desktop metaphor not yet started.
- Populate `theme-win31.css` with period-accurate CSS vars (flat gray, thick black borders, MS Sans Serif font)
- Adapt `Window.astro` to consume vars (title bar becomes solid blue bar with white text)
- Adapt `Button.astro` for Win3.1 flat style
- Test: switching to win31 theme shows correct chrome on existing pages

### Phase 4 — Windows 95 Theme CSS
**Goal:** Win95 visual theme is complete, desktop metaphor not yet started.
- Populate `theme-win95.css` with period-accurate CSS vars (beveled borders, #000080 title bar, Win95 font)
- Key Win95 details: `inset` borders simulating beveled chrome, title bar gradient from navy to teal
- Test: switching to win95 theme shows correct chrome on existing pages

### Phase 5 — Windows Desktop Shell
**Goal:** Windows themes get the desktop metaphor (wallpaper + app icons).
- Create `Desktop.astro`: teal wallpaper, icon grid layout, content slot for the active "app window"
- Wire into `Layout.astro` with CSS-based show/hide per theme
- Pages render their content inside the Desktop's window slot
- Win95 only: create `Taskbar.astro` (Start button, clock, active app label)

### Phase 6 — Theme Switcher Polish
**Goal:** Theme switcher UI is accessible and visually appropriate per theme.
- Position switcher appropriately per theme (floating badge for retro, Start menu item for Win95, Program Manager menu for Win3.1)
- Add localStorage persistence (if targeting v2.0 scope — currently out of scope per PROJECT.md)
- Accessibility: keyboard navigation, aria-labels, visible focus states

## Sources

- [Astro Styles and CSS Documentation](https://docs.astro.build/en/guides/styling/) — CSS vars, define:vars, global styles
- [Astro View Transitions Documentation](https://docs.astro.build/en/guides/view-transitions/) — astro:after-swap lifecycle event
- [Victor Lillo — Theme Selector Component in Astro](https://victorlillo.dev/blog/theme-selector-component-in-astro) — multi-theme class approach, is:inline anti-flash pattern
- [Scott Willsey — Get Rid of Theme Flicker](https://scottwillsey.com/theme-flicker/) — inline script technique
- [rainballs.com — astro:after-swap for Persistent Theme](https://test.rainballs.com/blog/astro-after-swap-en/) — view transitions + theme persistence
- [OS-GUI.js](https://os-gui.js.org/) — reference implementation of Windows 98 CSS (for Win95 chrome accuracy)
- [React95](https://react95.io/) — reference for authentic Win95 component styling details

---
*Architecture research for: Astro static site — switchable OS theme system (retro, Win3.1, Win95)*
*Researched: 2026-03-21*
