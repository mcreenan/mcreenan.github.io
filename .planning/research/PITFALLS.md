# Pitfalls Research

**Domain:** Multi-theme system with retro OS recreation (Windows 3.1, Windows 95) on existing Astro static site
**Researched:** 2026-03-21
**Confidence:** HIGH (core Astro/CSS pitfalls), MEDIUM (retro aesthetic specifics)

## Critical Pitfalls

### Pitfall 1: Theme Flash on Load (FART — Flash of inAccurate coloR Theme)

**What goes wrong:**
The browser renders the default/fallback theme for a visible frame before the stored theme preference (from localStorage) is applied. Users who selected Windows 95 theme see the default teal desktop flash briefly on every page load or navigation. This is especially jarring with retro themes because background colors and window chrome are dramatically different between themes.

**Why it happens:**
Astro bundles and defers scripts through Vite by default. A `<script>` tag that reads localStorage and sets `data-theme` on `<html>` gets bundled, moved, and executed late in the load sequence — after the browser has already painted default styles. The timing gap between "browser renders styled HTML" and "script applies stored theme" produces the flash.

**How to avoid:**
Place a `<script is:inline>` tag in `<head>` (inside `BaseHead.astro`) that reads localStorage and immediately sets `document.documentElement.setAttribute('data-theme', storedTheme)` before any other content renders. The `is:inline` directive bypasses Astro/Vite bundling and preserves script position in the DOM, ensuring it executes synchronously during HTML parsing.

```html
<!-- BaseHead.astro — inside <head>, before any <link> or <style> -->
<script is:inline>
  const stored = localStorage.getItem('theme');
  if (stored) document.documentElement.setAttribute('data-theme', stored);
</script>
```

Do not use a default attribute on `<html lang="en">` without this script — the fallback theme will flash before the script runs.

**Warning signs:**
- Visible color pop on load when switching between pages
- Theme appearing correct on direct URL visits but flashing on browser navigation
- Theme flash reproducible only on page reload with a non-default theme selected

**Phase to address:**
Foundation phase — theme persistence infrastructure. Must be solved before building any theme UI.

---

### Pitfall 2: CSS Specificity Wars with Existing Global Styles

**What goes wrong:**
`global.css` contains hardcoded values for `.window`, `.button`, `.splash-screen`, `.window-titlebar`, `.window-title`, `.window-content`, and `body` using specific hex colors and pixel values (e.g., `background-color: #008080`, `background-color: #c0c0c0`). When theme overrides are added via `[data-theme="win95"] .window { ... }`, the selector specificity is identical to the original single-class selectors. Import order and cascade position determine which wins — and Tailwind utility classes layered on top of the component classes create additional conflict points.

**Why it happens:**
The current CSS was written assuming a single theme. Values are baked in rather than referenced through CSS custom properties. Adding a second theme selector at the same specificity level requires the theme selector to appear after the base rules — any import reordering breaks the cascade silently.

**How to avoid:**
Migrate all theme-specific values in `global.css` to CSS custom properties before writing any theme variant rules. Use a single `[data-theme]` block (or `:root` for the default) to define all color and sizing tokens. Component rules reference only `var(--token-name)`. This way theme switching is a single block swap, not a specificity battle.

```css
/* Before refactor — fragile */
.window { background-color: #c0c0c0; }
[data-theme="win95"] .window { background-color: #d4d0c8; } /* same specificity, order-dependent */

/* After refactor — robust */
:root { --window-bg: #c0c0c0; }
[data-theme="win95"] { --window-bg: #d4d0c8; }
.window { background-color: var(--window-bg); }
```

**Warning signs:**
- Theme overrides only work when the stylesheet is in a specific import order
- Using `!important` anywhere in theme override rules
- Styles working in dev but breaking after `astro build` (Vite CSS chunking changes order)

**Phase to address:**
CSS tokenization refactor phase — must complete before any theme-specific styles are written. Do not add Windows 95 chrome until all base styles are tokenized.

---

### Pitfall 3: Breaking the Existing Layout During CSS Refactor

**What goes wrong:**
The existing `Window.astro` component uses hardcoded CSS classes, inline styles, and Tailwind utilities composited together (`class="window fixed splash-screen"`, `style="height: ${height}"`). Refactoring to CSS custom properties changes the cascade in ways that aren't always visually obvious — the retro chrome that makes the site distinctive (the animated `borderGradient`, `3D perspective transform` on `.window-title`, the radial-gradient pixel grid on `body`) can silently break or degrade.

**Why it happens:**
CSS custom properties do not interpolate inside some CSS functions (e.g., `background-image: linear-gradient(...)` with custom property colors that are shorthand). The `border-image-source` animation uses complex gradient syntax. `background-clip: text` on `.window-title` depends on the exact stacking of properties. Any refactor that touches adjacent properties risks breaking these effects without a clear error.

**How to avoid:**
Refactor incrementally with visual regression checkpoints. Tokenize one component at a time and verify in browser before moving to the next. Start with the simplest components (`.button`, `body` background color) and leave the complex ones (`.window-title` gradient text, `.splash-screen` animated border) until the tokenization pattern is proven. Keep the existing behavior as a passing visual test before writing any theme variants.

**Warning signs:**
- `border-image` stops animating after a refactor
- `.window-title` text becomes solid color instead of gradient
- Pixel grid background on `body` disappears
- Tailwind utility classes overriding custom property values unexpectedly

**Phase to address:**
CSS tokenization refactor phase — dedicate explicit checkpoints to visual regression. Do not batch the entire refactor in one commit.

---

### Pitfall 4: View Transitions Leaking Theme State Across Pages

**What goes wrong:**
The existing site uses Astro's `ViewTransitions` (the `view-transition-name: window` on `.splash-screen`). When a theme switcher changes `data-theme` on `<html>` mid-navigation, the view transition can capture the old-theme state in the outgoing frame and the new-theme state in the incoming frame, producing a visual glitch — the window morphs between two different chrome styles as part of the transition animation.

**Why it happens:**
View transitions take a screenshot of the current DOM state as the outgoing frame. If the theme attribute changes while a transition is in progress (or if the `is:inline` script fires after the transition starts), the captured snapshot reflects the wrong theme. This is a documented quirk: widespread use of `view-transition-name` can produce undesired cross-element transitions.

**How to avoid:**
Apply theme changes synchronously before triggering any navigation. If using the View Transition API for theme switching (for a morph animation between themes), use `document.startViewTransition()` explicitly. For page-to-page navigation, ensure the `is:inline` script fires before Astro's view transition script by placement in `<head>`.

**Warning signs:**
- Window chrome "morphs" visually between two styles during page navigation
- Theme flash specifically during Astro's page transition animation, not on initial load
- `view-transition-name: window` element flickers between themes

**Phase to address:**
Theme switcher implementation phase — test theme switching with ViewTransitions enabled explicitly.

---

### Pitfall 5: Retro Fonts Rendering Inconsistently Across Browsers

**What goes wrong:**
Windows 3.1 and Windows 95 used bitmap fonts (specifically MS Sans Serif at fixed pixel sizes, and System font for Win 3.1). Browser rendering of these fonts — whether using webfont versions (W95FA, Oldschool PC Font Pack) or system fonts — is inconsistent. Safari "lies" about device pixel ratio, producing blurry bitmap fonts at non-integer zoom levels. Chrome and Firefox apply subpixel antialiasing that makes pixel fonts look soft. Mobile browsers may arbitrarily adjust font sizes per-glyph.

**Why it happens:**
Bitmap fonts were designed for 1:1 pixel rendering at exact sizes. Modern browser rendering pipelines apply antialiasing, subpixel rendering, and DPI scaling that destroy the crisp pixel appearance. The `font-smooth` and `-webkit-font-smoothing` properties help but are not standardized. Using bitmap fonts at non-integer multiples of their native size (e.g., using an 8px bitmap font at 13px) always produces blur.

**How to avoid:**
Use bitmap fonts only at integer multiples of their native pixel size (8px, 16px, 24px for an 8-unit font). Set `image-rendering: pixelated` on canvas elements and `font-smooth: never; -webkit-font-smoothing: none` on text using bitmap fonts. Accept that Safari will not render pixel-perfect bitmap fonts in all cases and test on actual devices. For Windows 95 UI chrome specifically (title bars, menus, dialogs), the Tahoma or a web-safe sans-serif fallback is more reliable than forcing bitmap fonts.

**Warning signs:**
- Font looks sharp in Chrome but blurry in Safari
- Title bar text appears antialiased in screenshots
- Font sizes that looked right in design tools appear at wrong sizes on mobile

**Phase to address:**
Windows 3.1 and Windows 95 theme implementation phases — verify font rendering in Safari and on mobile before considering a theme complete.

---

### Pitfall 6: Accessibility Failures Hidden by Retro Aesthetic

**What goes wrong:**
Retro OS chrome uses historically poor contrast ratios. Windows 3.1's gray-on-gray UI, disabled button states, and title bar active/inactive states (dark blue text on medium blue background in Win 95) fail WCAG 2.2 AA contrast requirements (4.5:1 for normal text, 3:1 for large text). The retro aesthetic does not exempt the site from accessibility requirements. Screen readers also receive no context about the OS chrome metaphor — a "window" div with a title bar is meaningless to AT unless semantic structure is maintained.

**Why it happens:**
Authentic period accuracy conflicts with modern accessibility standards. Developers focusing on visual accuracy copy colors directly from OS screenshots without measuring contrast ratios. The interactive OS metaphor (clicking "desktop icons" to navigate) can also obscure navigation semantics from keyboard-only users.

**How to avoid:**
Measure every foreground/background color pair with a contrast checker before finalizing theme colors. Where authentic colors fail AA, adjust toward the accessible end without destroying the aesthetic (usually lightening or darkening by 5-10%). Maintain semantic HTML underneath the visual chrome — `<nav>`, `<main>`, `<a>`, proper `alt` attributes — independent of how it looks. Keep `aria-label` on all interactive elements that are styled as OS controls. The existing `.desktop-icon:focus` outline is a good pattern to preserve.

**Warning signs:**
- Gray text on gray background anywhere (Win 3.1 characteristic)
- Inactive window title (dark text on medium background) failing contrast check
- Navigation implemented via `<div onClick>` instead of `<a>` or `<button>`
- No visible focus indicator on the theme switcher control

**Phase to address:**
Each theme implementation phase — run contrast checks at the end of each theme's visual styling before moving on.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcode theme colors in component `<style>` blocks instead of tokenizing | Faster to build first theme | Every theme needs its own component copy; impossible to add 4th theme | Never — tokenize from the start |
| Use separate CSS files per theme loaded via `<link>` swap | Simpler than CSS variables | Additional network request per theme switch; FOUC on switch; Astro cannot optimize | Never for this project |
| Skip `is:inline` and use regular script for localStorage | Simpler code | Theme flash on every load; no workaround once shipped | Never |
| Copy-paste Window.astro as Window95.astro | Faster first Windows 95 result | Two components to maintain; diverge over time; layout refactor doubles | Never — use props/variants on one component |
| Use `!important` to override base styles in theme blocks | Resolves specificity conflict quickly | Permanently escalates specificity arms race; blocks future overrides | Never |
| Defer accessibility pass to "later" | Faster theme visual work | WCAG issues are expensive to retrofit; color changes can break visual accuracy | Never for navigation/interactive elements; acceptable to defer body text checks to final review |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Tailwind CSS + CSS custom properties | Tailwind v4 `data-theme` cascading has known issues with CSS variables not inheriting globally in some configurations | Use Tailwind v3 (current version in this project) — the `data-theme` attribute on `<html>` cascades correctly to all descendants via CSS custom properties without Tailwind-specific issues |
| Astro `<style>` scoping + theme selectors | Writing `[data-theme="win95"] .window { }` inside a scoped component `<style>` block — Astro rewrites the selector with a hash, making the data-attribute selector target a non-existent specificity combination | Theme token definitions must be in `global.css` or a `<style is:global>` block; only token consumption (var references) should be in scoped component styles |
| Astro ViewTransitions + `localStorage` | Reading localStorage in a regular `<script>` tag — Astro's client router re-runs `DOMContentLoaded` handlers but not inline scripts on navigation | Use `document.addEventListener('astro:page-load', ...)` for the theme switcher toggle logic; use `is:inline` for the initial theme application |
| `define:vars` + theme tokens | Using Astro's `define:vars` to pass theme colors from frontmatter — tempting but passes values at render time, not at theme-switch time | CSS custom properties at the `:root`/`[data-theme]` level switch at runtime; `define:vars` bakes values at build time |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading all theme CSS always | Page weight includes styles for 2 unused themes on every load | All three themes can safely share one CSS file using `[data-theme]` scoping — Astro bundles them together, browsers parse but don't apply unused rules; total size is small for a personal site | Never at this scale — total theme CSS unlikely to exceed 20KB |
| Importing separate webfonts per theme | 3 separate `@font-face` declarations loading on every page, fonts for Win 3.1 bitmap font load even when Win 95 theme is active | Load all theme fonts in `BaseHead.astro` with `font-display: swap`; fonts are cached after first page load | Visible on first load with slow connection if multiple font files are large |
| CSS-in-JS or runtime style injection for theme switching | Theme switching triggers reflow/repaint across entire page | Pure CSS custom property switching with `data-theme` attribute change causes targeted repaint only; no reflow | Not applicable to Astro static site, but mention if JS framework components are added |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No theme switcher on every page | Users get stuck in a theme after navigating away from the page where the switcher lives | Embed the theme switcher in Layout.astro (or a persistent component it always renders) so it appears on all pages |
| Theme preference lost on page reload (not persisting to localStorage) | User sets theme, refreshes, gets default back — frustrating and confusing | `PROJECT.md` marks this as "nice-to-have, not required for v2.0" — acceptable to defer, but if implemented, use localStorage with the `is:inline` guard |
| No visual indicator of current active theme in the switcher | User cannot tell which theme is active; clicks switcher again to find out | Apply active/selected state styling to the current theme option in the switcher UI |
| OS chrome aesthetics obscuring that content is navigable | Users treat retro "desktop icons" as decorative, not interactive | Maintain sufficient affordance cues (pointer cursor, visible focus, hover state) even at the cost of some period accuracy |
| Retro theme making text content hard to read | Users leave before reading bio/work content | Prioritize readability of content areas (`.window-content`) over chrome authenticity; be less strict with period accuracy inside the content pane |

---

## "Looks Done But Isn't" Checklist

- [ ] **Theme switcher:** Verify it appears and works on all four pages (index, about, work, contact) — not just the page where it was first built
- [ ] **Theme flash prevention:** Test by selecting Win95 theme, then hard-reloading — default theme must NOT flash before Win95 loads
- [ ] **CSS tokenization:** Verify no hex colors remain hardcoded in component styles (grep for `#[0-9a-fA-F]{3,6}` outside of `global.css` token definitions)
- [ ] **ViewTransitions compatibility:** Navigate between pages while a non-default theme is active — window chrome should not flash or morph during transition
- [ ] **Bitmap font rendering:** Verify in Safari on macOS and iOS — font must not appear blurry at the chosen font size
- [ ] **Keyboard navigation:** Tab through the entire page in each theme — all interactive elements must have visible focus indicators
- [ ] **Contrast check:** Run each theme's foreground/background pairs through a contrast checker — all text must meet 4.5:1 AA minimum
- [ ] **Scoped style isolation:** Confirm `[data-theme]` selectors work correctly when written in `global.css` vs inside component `<style>` blocks
- [ ] **Astro build output:** Run `bun run build` and verify no CSS conflicts appear in built output — dev and production CSS chunking differ

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Theme flash shipped to production | LOW | Add `is:inline` script to BaseHead.astro; single commit; deploy |
| Specificity wars after adding theme overrides | HIGH | Requires CSS tokenization refactor of all affected components; no safe shortcut |
| Broken existing layout after CSS refactor | MEDIUM | Git revert to pre-refactor state; re-apply incrementally one component at a time |
| ViewTransitions + theme switching glitch | MEDIUM | Disable ViewTransitions during theme change; use `document.startViewTransition()` with explicit control |
| Bitmap fonts blurry in Safari | LOW-MEDIUM | Switch to non-bitmap fallback font for Safari via `@supports` or user-agent; accept minor period inaccuracy |
| Accessibility contrast failures | MEDIUM | Adjust specific color tokens in theme definitions; re-verify visual accuracy after each change |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Theme flash on load (FART) | Foundation — theme infrastructure setup | Hard reload with non-default theme active; no flash visible |
| CSS specificity wars | Foundation — CSS tokenization refactor | No hex colors in component styles; all overrides through CSS custom properties |
| Breaking existing layout during refactor | Foundation — CSS tokenization refactor | Visual regression check after each component tokenized; pixel-compare before/after in default theme |
| ViewTransitions leaking theme state | Theme switcher implementation | Navigate between pages in non-default theme; inspect for chrome flash during transition |
| Retro fonts inconsistent across browsers | Windows 3.1 and Windows 95 theme phases | Test in Safari (macOS + iOS) and Chrome; bitmap font appears crisp at chosen size |
| Accessibility hidden by retro aesthetic | Each theme implementation phase | Run contrast checker on all color pairs; tab through page in each theme |

---

## Sources

- [Get Rid of Theme Flicker — scottwillsey.com](https://scottwillsey.com/theme-flicker/)
- [CSS Themes In Astro and FART issue — julien-qnn.dev](https://julien-qnn.dev/posts/css-theme-in-astro/)
- [Astro View Transitions — docs.astro.build](https://docs.astro.build/en/guides/view-transitions/)
- [Astro Styles and CSS — docs.astro.build](https://docs.astro.build/en/guides/styling/)
- [98.css — A design system for faithful recreations of old UIs — jdan.github.io](https://jdan.github.io/98.css/)
- [Bitmap fonts on modern browsers — reverseback.gr](https://reverseback.gr/txt/bitmap-fonts/)
- [Oldschool PC Font Pack — int10h.org](https://int10h.org/oldschool-pc-fonts/readme/)
- [WCAG Contrast Requirements — webaim.org](https://webaim.org/articles/contrast/)
- [Tailwind data-theme attribute discussion — github.com/tailwindlabs](https://github.com/tailwindlabs/tailwindcss/discussions/16292)
- [Hydration issue when using local storage — github.com/withastro](https://github.com/withastro/astro/issues/4726)

---
*Pitfalls research for: Multi-theme retro OS system on Astro static site*
*Researched: 2026-03-21*
