# Phase 4: Windows 95 Theme - Research

**Researched:** 2026-04-04
**Domain:** CSS library integration (98.css), Windows 95 UI patterns, Astro component extension
**Confidence:** HIGH

## Summary

This phase delivers the Windows 95 theme for `matt.creenan.me` by integrating the 98.css library (v0.1.21) under a `[data-theme="win95"]` CSS scope, adding a new `Taskbar.astro` component, extending `Window.astro` with a `variant="win95"` branch, creating a `Win95Desktop.astro` component with 48x48 pixel-art icons, and writing all CSS tokens and overrides into `global.css`. All locked decisions from CONTEXT.md are technically sound and directly implementable.

The 98.css dist file (`dist/98.css`) is a single minified stylesheet with no JavaScript. It uses CSS custom properties defined on `:root`, sets global `body` and element styles, and targets `.window`, `.title-bar`, `.title-bar-controls button`, `.window-body`, and `button` selectors. Scoping requires wrapping every rule under `[data-theme="win95"]` — the practical approach is to import the stylesheet raw and manually prefix it in `global.css` for the handful of rules needed, or to use an Astro `<style>` block that wraps the import. The fully minified dist file is 1 line (about 16KB), so cherry-picking the needed rules into a scoped block in `global.css` is the cleanest path.

The key technical facts: 98.css uses `navy` (`#000080`) and `#1084d0` for the title-bar gradient (matching D-04 exactly), `silver` (`#c0c0c0`) for all chrome, and SVG data URIs embedded in CSS for the minimize/maximize/close button icons. The `.window-body` selector (not `.window-content`) is 98.css's content wrapper. The existing project uses `.window-content` and `.window-inner` — these must be bridged carefully in the `variant="win95"` markup.

**Primary recommendation:** Cherry-pick only the needed 98.css rules (`.window`, `.title-bar`, `.title-bar-controls`, `button`, `.window-body`) into a `[data-theme="win95"]` block in `global.css`. Do not import the full stylesheet globally — it will break the retro and win31 themes via `:root` variable overrides and global `body` styles.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Install 98.css as NPM package, scope all rules under `[data-theme="win95"]` to avoid global collision
- **D-02:** The `.window` class collision is handled by scoping 98.css under the `[data-theme="win95"]` selector — Phase 2 already scoped existing `.window` under `[data-theme="retro"]`
- **D-03:** Selective import of 98.css — only window, button, and title bar styles needed, avoid importing full stylesheet
- **D-04:** Classic navy-to-teal gradient title bar (`#000080` to `#1084d0`) per actual Windows 95
- **D-05:** Static HTML/CSS taskbar at bottom of screen — Start button area (decorative, non-functional) with "Start" label and Windows flag icon
- **D-06:** Live clock in taskbar system tray area — minimal JS with `setInterval` updating every minute, formatted as "12:34 PM"
- **D-07:** Desktop icons are 48x48 pixel art (larger than Win31's 32x32) using 16-color Win95 palette
- **D-08:** Desktop icons placed in centered grid on desktop area above the taskbar — consistent with Win31 approach
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

### Deferred Ideas (OUT OF SCOPE)

- Functional Start menu with app list — decorative only for this phase
- Taskbar window buttons (showing open windows) — out of scope per REQUIREMENTS.md
- Draggable/resizable windows — Out of Scope per REQUIREMENTS.md
- Theme-specific cursor styles — captured as THEME-02 in future requirements
- System tray icons beyond clock — future enhancement

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| WIN95-01 | Windows have beveled 3D chrome via 98.css with proper shadows | 98.css `.window` selector provides `box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px #fff` — verified from dist source |
| WIN95-02 | Buttons render with Win95 beveled style | 98.css `button` selector provides full bevel treatment — cherry-picked and scoped |
| WIN95-03 | Pixel font (W95FA) applied to UI elements for MS Sans Serif look | W95FA font already installed at `/public/fonts/w95fa.woff2` + `.woff` with @font-face in global.css — VERIFIED by filesystem check |
| WIN95-04 | Desktop shows icons for each section that can be clicked to open them | New `Win95Desktop.astro` component with 48x48 SVG pixel art icons, CSS display toggle pattern from Phase 3 |
| WIN95-05 | Taskbar with Start button area and clock displayed at bottom | New `Taskbar.astro` component with `position: fixed; bottom: 0`, `setInterval` clock, CSS display toggle under `[data-theme="win95"]` |

</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| 98.css | 0.1.21 | Authentic Win95 beveled chrome CSS | CSS-only, no JS, data-URI SVG icons embedded — no asset pipeline needed |

**Version verification:** `npm view 98.css version` returns `0.1.21` [VERIFIED: npm registry, 2026-04-04]

### Supporting (already in project)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| W95FA font | installed Phase 3 | MS Sans Serif pixel font approximation | Applied via `font-family: "W95FA", Arial, sans-serif` on all win95 elements |
| Tailwind CSS | 3.4.14 | Utility classes for layout | Already used in all components; taskbar flex layout uses Tailwind utilities |
| Astro | 4.16.8 | Component system | Window.astro variant extension, new component creation |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| 98.css npm | XP.css / 7.css | XP.css targets WinXP, not Win95 — wrong era. 98.css is the canonical Win95 CSS library |
| cherry-pick approach | full @import | Full import overwrites `:root` variables and `body` — breaks retro/win31 themes |

**Installation:**

```bash
bun add 98.css
```

[VERIFIED: npm registry — package exists at v0.1.21, CSS-only, no JS dependencies]

---

## Architecture Patterns

### Recommended Project Structure

No new directories needed. New files:

```
src/
├── components/
│   ├── Taskbar.astro          # NEW — Win95 taskbar with Start btn + clock
│   └── Win95Desktop.astro     # NEW — desktop icon grid for home page
├── styles/
│   └── global.css             # EXTEND — add [data-theme="win95"] block
├── pages/
│   ├── index.astro            # EXTEND — import Win95Desktop, add display toggle
│   ├── about.astro            # EXTEND — add win95 window variant
│   ├── work.astro             # EXTEND — add win95 window variant
│   └── contact.astro         # EXTEND — add win95 window variant (via Window.astro)
└── components/
    └── Window.astro           # EXTEND — add variant="win95" branch
```

### Pattern 1: CSS Display Toggle (established from Phase 3)

**What:** Theme-specific layouts are hidden by default and revealed under the matching `[data-theme]` selector.
**When to use:** For structurally different layouts that cannot be styled the same (e.g., win95-desktop vs retro-layout vs program-manager).

```css
/* global.css */
.win95-desktop { display: none; }
[data-theme="win95"] .win95-desktop { display: flex; }

.win95-taskbar { display: none; }
[data-theme="win95"] .win95-taskbar { display: flex; }

/* Suppress other layouts in win95 */
[data-theme="win95"] .retro-layout { display: none; }
[data-theme="win95"] .program-manager { display: none; }
```

[VERIFIED: pattern used in global.css line 262-264 for Phase 3]

### Pattern 2: 98.css Cherry-Pick Into Scoped Block

**What:** Copy only the needed selectors from `node_modules/98.css/dist/98.css` into `global.css`, wrapped under `[data-theme="win95"]`. This is a one-time transcription — 98.css doesn't change at runtime.
**When to use:** The full 98.css stylesheet sets `:root` CSS custom properties and global `body` styles that would override the existing token system.

**Critical selectors to cherry-pick and scope:**

```css
[data-theme="win95"] .window {
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf,
              inset -2px -2px grey, inset 2px 2px #fff;
  background: #c0c0c0;
  padding: 3px;
}

[data-theme="win95"] .title-bar {
  background: linear-gradient(90deg, #000080, #1084d0);
  padding: 3px 2px 3px 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

[data-theme="win95"] .title-bar-text {
  font-weight: bold;
  color: white;
  letter-spacing: 0;
  margin-right: 24px;
}

[data-theme="win95"] .title-bar-controls {
  display: flex;
}

[data-theme="win95"] .title-bar-controls button {
  padding: 0;
  display: block;
  min-width: 16px;
  min-height: 14px;
  /* SVG data URIs for minimize/maximize/close icons are embedded below */
}
```

**Button bevel (scoped under win95):**

```css
[data-theme="win95"] button {
  background: #c0c0c0;
  border: none;
  border-radius: 0;
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff,
              inset -2px -2px grey, inset 2px 2px #dfdfdf;
  min-width: 75px;
  min-height: 23px;
  padding: 0 12px;
  font-family: "W95FA", Arial, sans-serif;
  font-size: 11px;
  -webkit-font-smoothing: none;
}
```

[VERIFIED: from `npm pack 98.css` and inspection of `package/dist/98.css`, 2026-04-04]

### Pattern 3: Window.astro Variant Extension

**What:** The existing `variant` prop pattern supports `"retro" | "win31"` — extend the union to `"retro" | "win31" | "win95"` and add a conditional branch for win95 markup using 98.css class names.

**Win95 markup structure (98.css class names):**

```astro
{variant === "win95" && title && (
  <div class="window">
    <div class="title-bar">
      <div class="title-bar-text">{title}</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        {contentWindow
          ? <a href="/" aria-label="Close" class="title-bar-close-link"></a>
          : <button aria-label="Close"></button>
        }
      </div>
    </div>
    <div class="window-body">
      <slot />
    </div>
  </div>
)}
```

**Close button as home link:** 98.css styles `.title-bar-controls button[aria-label="Close"]` with the X icon. For the close-as-link case on subpages, wrap in an `<a>` or use `onclick="window.location='/'"`  — the icon background-image will still apply via the CSS selector on the `<a>` tag if class `.close` is also added (98.css supports `button[aria-label].close` alternate selector).

[VERIFIED: 98.css dist source, title-bar-controls button selectors confirmed]

### Pattern 4: Taskbar Component

**What:** New `Taskbar.astro` component, hidden by default, displayed only under `[data-theme="win95"]` via CSS toggle.

```astro
<div class="win95-taskbar">
  <button class="win95-start-btn" type="button">
    <!-- Windows flag SVG inline -->
    <svg ...>...</svg>
    Start
  </button>
  <div class="win95-tray">
    <time class="win95-clock" id="win95-clock" datetime="">12:00 PM</time>
  </div>
</div>

<script>
  function updateClock() {
    const el = document.getElementById('win95-clock');
    if (!el) return;
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const timeStr = `${h}:${m} ${ampm}`;
    el.textContent = timeStr;
    el.setAttribute('datetime', now.toISOString());
  }
  updateClock();
  setInterval(updateClock, 60000);
  document.addEventListener('astro:after-swap', () => {
    updateClock();
  });
</script>
```

**CSS positioning:**

```css
.win95-taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  z-index: 9999;
  display: none;
  background: #c0c0c0;
  box-shadow: inset 0 1px 0 #fff;  /* top bevel */
  align-items: center;
  padding: 2px;
  gap: 4px;
  font-family: "W95FA", Arial, sans-serif;
  font-size: 11px;
  -webkit-font-smoothing: none;
}

[data-theme="win95"] .win95-taskbar {
  display: flex;
}
```

[VERIFIED: pattern from Phase 3 ProgramManager toggle; 28px height per Win95 reference per UI-SPEC.md]

### Pattern 5: Win95Desktop Component

**What:** New `Win95Desktop.astro` component with centered grid of 3 icons (About, Work, Contact), hidden by default, shown under `[data-theme="win95"]`. Bottom padding accounts for 28px taskbar.

Icons are 48x48 SVGs scaled up from the Phase 3 32x32 designs. Use `viewBox="0 0 48 48"` with proportionally scaled `rect` elements. The 16-color Win95 palette is identical to the Win31 palette already used.

[VERIFIED: ProgramManager.astro source — SVG pixel art with `#000080`, `#C0C0C0`, `#808000`, etc.]

### Anti-Patterns to Avoid

- **Importing 98.css globally (via BaseHead.astro):** The stylesheet sets `:root` CSS custom properties (`--surface: #c0c0c0`, `--dialog-blue: #000080`, etc.) and styles `body` with `font-family: Arial; font-size: 12px`. This overrides the existing token system and breaks the retro/win31 themes. Cherry-pick only needed rules.
- **Using 98.css `window-body` class name in existing CSS:** The project uses `.window-content` and `.window-inner` — the win95 `variant` in `Window.astro` should use `window-body` (98.css) only for the win95 branch, while other variants keep their existing class names.
- **Omitting `display: none` default on `.win95-taskbar`:** The taskbar must be hidden by default and only shown in win95 theme. Without this, it appears on all themes.
- **Forgetting `astro:after-swap` handler on clock:** Astro View Transitions swap the DOM on navigation. The clock `setInterval` is reset on page swap — the handler must re-initialize after swap.
- **Using `[data-theme="win95"] button` too broadly:** Scoping all `button` elements under win95 will style the ThemeDialog's "Apply Theme" button, the Start button, and any other buttons. Verify the intent covers all visible buttons or use a more specific selector like `.win95-start-btn` for the taskbar Start button.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Win95 beveled window chrome | Custom box-shadow formulas | 98.css cherry-picked `.window` rules | The 4-layer inset box-shadow formula is exact: `inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px #fff` — already solved and period-accurate |
| Win95 title bar gradient | Hand-coded gradient | 98.css `.title-bar` rule | `linear-gradient(90deg, #000080, #1084d0)` is the canonical Win95 reference value — already in 98.css |
| Title bar button icons (min/max/close) | HTML entities or custom SVGs | 98.css embedded data-URI SVGs | The minimize/maximize/close icons are pixel-perfect SVG data URIs already in 98.css `title-bar-controls button[aria-label=...]` rules |
| Button bevel | Custom box-shadow | 98.css `button` rule | 4-layer inset shadow is non-trivial to get right; 98.css has it correct for Win95 |

**Key insight:** 98.css exists specifically because the Win95 bevel system is complex. The exact shadow stacking order (`outer-highlight, inner-highlight, inner-shadow, outer-shadow`) matters — wrong order produces the inverted/sunken look.

---

## Common Pitfalls

### Pitfall 1: 98.css `:root` variable collision

**What goes wrong:** Importing the full 98.css stylesheet (e.g., `import '98.css'` in BaseHead.astro) rewrites `:root` variables like `--surface`, `--dialog-blue`, etc. These variables are not the same as the project's own token set (`--color-bg`, `--color-window`, etc.), but the `body` font-family override (`font-family: Arial; font-size: 12px`) and global element font resets will visually change all themes.
**Why it happens:** 98.css was designed to be the entire design system for a page, not a scoped theme.
**How to avoid:** Cherry-pick only the needed selectors from the dist file into a `[data-theme="win95"]` block in `global.css`. Never import 98.css at the component or page level without scoping.
**Warning signs:** Retro theme buttons lose their styling; win31 theme fonts change size; body background changes.

### Pitfall 2: `.window` class selector conflict

**What goes wrong:** The project's `.window` class (globally styled for retro) and 98.css's `.window` class both target the same selector. Phase 2 already scoped `.window` under `[data-theme="retro"] .window`, but any global `.window` styles (e.g., the base `.window` in global.css line ~457) could bleed into the win95 variant.
**Why it happens:** The base `.window` selector at global scope sets `background-color: var(--color-window); border: none`. Under win95, `--color-window` would need to be `#c0c0c0`, and the 98.css bevel is applied via `box-shadow` not `border`.
**How to avoid:** Ensure `[data-theme="win95"] .window` overrides all inherited `.window` styles. Set `border: none` (or rely on the scoped 98.css bevel), and verify `background: #c0c0c0` in the win95 block.
**Warning signs:** Win95 windows have the retro border animation or unexpected background.

### Pitfall 3: Title-bar close button as a link

**What goes wrong:** 98.css styles `.title-bar-controls button[aria-label="Close"]` with a data-URI SVG background image. If the close button needs to be a navigation link (`<a href="/">`), the CSS selector won't match `<a>` elements and the icon won't render.
**Why it happens:** 98.css uses `button[aria-label="Close"]` — an `<a>` tag with `aria-label="Close"` won't match.
**How to avoid:** Two valid options: (1) Use a `<button onclick="window.location='/'">` — keeps the button selector working. (2) Add the alternate `.close` class to the `<a>`: 98.css also supports `button[aria-label].close` which can be adapted to `[aria-label].close` if the selector is manually cherry-picked with `[aria-label].close` instead. The safest option for this project is `onclick`.
**Warning signs:** Close button renders as a blank square without the X icon.

### Pitfall 4: Taskbar clock on View Transitions navigation

**What goes wrong:** The `setInterval` for the clock starts on page load. When Astro View Transitions navigates to a new page, the DOM is swapped but the script context may or may not persist depending on whether the Taskbar component re-mounts. If Taskbar re-renders (different page), the clock reinitializes correctly. If the clock element is reused via view-transition but the script isn't re-run, the clock freezes.
**Why it happens:** Astro bundles and deduplicates scripts. A second navigation to a page that includes Taskbar may not re-execute the inline script.
**How to avoid:** Add `document.addEventListener('astro:after-swap', updateClock)` in the Taskbar script, matching the pattern used in BaseHead.astro's theme persistence script.
**Warning signs:** Clock shows initialization time and stops updating after page navigation.

### Pitfall 5: Body height + taskbar overlap

**What goes wrong:** The body uses `height: 100vh; overflow: hidden`. The fixed 28px taskbar sits at the bottom. The Win95 desktop icon grid and any win95 content windows will extend behind the taskbar if no padding-bottom is applied to the desktop area.
**Why it happens:** `position: fixed` elements don't affect document flow — the desktop container won't know to stop 28px short.
**How to avoid:** Apply `padding-bottom: 28px` to the `.win95-desktop` container and to any win95 content window sections that need to be visible above the taskbar.
**Warning signs:** Bottom icon partially obscured by taskbar; window content scrolled under taskbar.

---

## Code Examples

Verified patterns from official sources:

### 98.css Window Chrome (from dist)

```css
/* Source: npm pack 98.css, package/dist/98.css — verified 2026-04-04 */

/* Win95 window bevel — use this verbatim in [data-theme="win95"] .window */
box-shadow: inset -1px -1px #0a0a0a,
            inset 1px 1px #dfdfdf,
            inset -2px -2px grey,
            inset 2px 2px #fff;
background: #c0c0c0;
padding: 3px;

/* Win95 title bar gradient */
background: linear-gradient(90deg, #000080, #1084d0);

/* Win95 button bevel */
box-shadow: inset -1px -1px #0a0a0a,
            inset 1px 1px #fff,
            inset -2px -2px grey,
            inset 2px 2px #dfdfdf;
```

### Close Button as Home Link (Win95 subpages)

```astro
<!-- Option A: button with onclick — CSS selector matches correctly -->
<button aria-label="Close" onclick="window.location='/'" type="button"></button>

<!-- Option B: anchor with .close class — requires [aria-label].close selector in cherry-picked CSS -->
<a href="/" aria-label="Close" class="close"></a>
```

### Clock Initialization with View Transitions Support

```javascript
// Source: BaseHead.astro pattern (astro:after-swap), extended for clock
function updateClock() {
  const el = document.getElementById('win95-clock');
  if (!el) return;
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const timeStr = `${h}:${m} ${ampm}`;
  el.textContent = timeStr;
  el.setAttribute('datetime', now.toISOString());
}
updateClock();
setInterval(updateClock, 60000);
document.addEventListener('astro:after-swap', updateClock);
```

### Win95 Desktop CSS Toggle

```css
/* Source: global.css line 262-264 pattern from Phase 3 */
.win95-desktop { display: none; }
[data-theme="win95"] .win95-desktop { display: flex; }
[data-theme="win95"] .retro-layout { display: none; }
[data-theme="win95"] .program-manager { display: none; }
.win95-taskbar { display: none; }
[data-theme="win95"] .win95-taskbar { display: flex; }
```

### 48x48 SVG Icon (scaling from Phase 3 32x32)

```html
<!-- Scale viewBox from 32x32 to 48x48, multiply all rect coordinates by 1.5 -->
<!-- Source: ProgramManager.astro pixel art pattern, scaled up -->
<svg width="48" height="48" viewBox="0 0 48 48"
     xmlns="http://www.w3.org/2000/svg"
     style="image-rendering: pixelated; image-rendering: crisp-edges;">
  <!-- Scale all rect x/y/width/height values by 1.5 from 32x32 originals -->
</svg>
```

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Bun | Package manager (install 98.css) | ✓ | runtime present (bun.lock exists) | — |
| 98.css | WIN95-01, WIN95-02 | Not installed | 0.1.21 (npm verified) | — (no fallback; must install) |
| W95FA font | WIN95-03 | ✓ | woff2 + woff at /public/fonts/ | — |
| Node.js / Astro build | Build + dev | ✓ | Astro 4.16.8 per package.json | — |

**Missing dependencies with no fallback:**
- `98.css` — must be installed with `bun add 98.css` as the first task of the phase. No fallback; it is the specified library for WIN95-01 and WIN95-02.

[VERIFIED: `ls node_modules/98.css` returns "NOT INSTALLED"; `npm view 98.css version` returns `0.1.21`]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 98.css full import | Scoped cherry-pick | This phase | Prevents cross-theme collision |
| Win31 variant only in Window.astro | Multi-variant system | Phase 3 established | Extend with win95 branch |

**Deprecated/outdated:**
- None for this phase stack.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | 98.css `.title-bar-controls button[aria-label].close` selector will match `<a aria-label="Close" class="close">` if cherry-picked with `[aria-label].close` selector syntax | Code Examples — close button | Close button icon won't render; fall back to `button` with `onclick` |
| A2 | `astro:after-swap` event fires on all View Transitions navigations in Astro 4.x when Taskbar is on all theme-affected pages | Code Examples — clock | Clock freezes on navigation; add `astro:page-load` as fallback |

**Low-risk:** Both assumptions have documented fallbacks. The safest implementation uses `button` with `onclick` for the close link (eliminates A1) and adds both `astro:after-swap` and `DOMContentLoaded` handlers (eliminates A2).

---

## Open Questions

1. **Where to mount Taskbar.astro?**
   - What we know: Layout.astro is used by `contact.astro` but not `about.astro` or `work.astro`. The index.astro and subpages have different import trees.
   - What's unclear: Whether Taskbar should live in Layout.astro (covers contact), in each page directly, or if all pages should migrate to Layout.astro.
   - Recommendation: Add Taskbar import to Layout.astro AND to `index.astro`, `about.astro`, `work.astro` directly (following the ThemeDialog pattern, which appears in both Layout.astro and index.astro).

2. **Right-click context menu implementation (D-10, discretion item)**
   - What we know: `window.openThemeDialog()` is the integration point. Right-click on desktop requires `contextmenu` event listener.
   - What's unclear: Whether to add a right-click handler to the win95-desktop div or use a visible "Properties" desktop icon button.
   - Recommendation: Add a simple `contextmenu` event on `.win95-desktop` that calls `window.openThemeDialog()` and prevents default — minimal JS, no extra DOM elements.

---

## Project Constraints (from CLAUDE.md)

- **Package manager:** Bun — use `bun add 98.css`, not `npm install`
- **No Prettier/ESLint:** Code style maintained manually; follow existing indentation patterns in modified files
- **TypeScript strict mode:** `astro check` runs as part of build — `Window.astro` variant prop union type must be updated to include `"win95"`
- **No environment variables required** — no `.env` changes
- **GitHub Pages deployment** — no server-side code; all JS must be client-side
- **Astro component conventions:** PascalCase filenames, Props interface, `Astro.props` destructuring, `<slot />` for composition
- **CSS naming:** kebab-case class names; BEM-adjacent parent-child with hyphens (e.g., `.win95-taskbar`, `.win95-start-btn`, `.win95-tray`, `.win95-clock`, `.win95-desktop`, `.win95-icon`, `.win95-icon-label`)

---

## Sources

### Primary (HIGH confidence)
- npm registry (`npm view 98.css version`) — version 0.1.21 confirmed
- `npm pack 98.css` + tar extraction — full `dist/98.css` and `style.css` inspected directly
- `/Users/mcreenan/p/mcreenan.github.io/src/styles/global.css` — existing theme token structure, Phase 2/3 patterns
- `/Users/mcreenan/p/mcreenan.github.io/src/components/ProgramManager.astro` — Phase 3 icon pattern, display toggle, `window.openThemeDialog()` integration
- `/Users/mcreenan/p/mcreenan.github.io/src/components/Window.astro` — current variant prop structure
- `/Users/mcreenan/p/mcreenan.github.io/src/components/BaseHead.astro` — `astro:after-swap` handler pattern
- `/Users/mcreenan/p/mcreenan.github.io/public/fonts/` — W95FA font files confirmed present

### Secondary (MEDIUM confidence)
- 98.css GitHub README (WebFetch) — confirmed CSS-only, no JS dependency

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — 98.css verified via npm, dist file inspected directly
- Architecture: HIGH — cherry-pick approach confirmed against actual 98.css selectors and project code
- Pitfalls: HIGH — derived from direct inspection of 98.css dist and existing project patterns

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable libraries)
