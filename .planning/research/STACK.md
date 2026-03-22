# Stack Research

**Domain:** Multi-theme system for Astro static site (Windows 3.1 + Windows 95 + existing retro desktop)
**Researched:** 2026-03-21
**Confidence:** MEDIUM — CSS library versions verified via npm/GitHub, FOUC pattern verified via official Astro docs and community articles. Windows 3.1 CSS library finding is definitive absence (no npm package exists).

## Existing Stack (Do Not Change)

These are already in place and validated. Research focuses on additions only.

| Technology | Version | Status |
|------------|---------|--------|
| Astro | 4.16.8 | Keep — static site generation, View Transitions already in use |
| Tailwind CSS | 3.4.14 | Keep — utility classes, extend for theme variables |
| TypeScript | 5.6.3 | Keep |
| Bun | latest | Keep as package manager |

## Recommended Stack Additions

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| CSS Custom Properties (native) | N/A — browser native | Theme variable system — desktop colors, fonts, borders per theme | Zero dependency. Scoped via `[data-theme="win95"]` attribute on `<html>`. Already used in site CSS. Only mechanism that survives View Transition page swaps without FOUC. |
| 98.css | 0.1.21 | Windows 95/98 window chrome, buttons, title bars, form controls | Pure CSS, no JS, semantic HTML basis. Purpose-built pixel-perfect recreation of Win95/98. Matches `window` + `title-bar` + `window-body` HTML structure that can replace existing `Window.astro` output when win95 theme is active. Latest publish: ~3 months ago as of research date. |
| xp.css | 0.2.3 | Alternative Windows 98 theme distribution (bundled inside xp.css package) | Ships a `98.css` dist alongside its XP theme. Useful if 98.css standalone needs supplementing, but 98.css directly is simpler. Use 98.css directly instead — see Alternatives. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| W95FA webfont (self-hosted) | N/A — font file | Pixel-accurate Windows 95 system font recreation of MS Sans Serif | Include as a `@font-face` rule in theme CSS block. Free, SIL OFL licensed, provides `.woff2` format. Download from [CDNFonts](https://www.cdnfonts.com/w95fa.font) or [dafont](https://www.dafont.com/w95fa.font). Only needed for `win95` and `win31` themes. |
| MS W98 UI font (self-hosted) | N/A — font file | Conversion of original MS Sans Serif covering Windows 3.1, 95, 98, ME — OTF/TTF/webfont | Alternative to W95FA if deeper Unicode or Bold coverage is needed. No npm package — distribute as static asset in `/public/fonts/`. |
| Pixelify Sans (Google Fonts) | N/A — CDN | Pixel sans-serif for Windows 3.1 general text | Use only if self-hosting W95FA is blocked. Google Fonts CDN introduces external network request. LOW preference. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| None new required | Theme switching is CSS + inline vanilla JS | No additional build tools, preprocessors, or Astro integrations needed. Tailwind v3 already in place handles utility classes. |

## Installation

```bash
# Windows 95/98 CSS chrome library
bun add 98.css

# NO additional packages needed for theme switching itself
# Theme system = CSS custom properties + inline script + 98.css
```

Font files (W95FA) go in `/public/fonts/` as static assets — no npm package exists.

## Architecture Pattern: How Themes Work Together

### Theme Variable Scoping (Tailwind v3 Compatible)

Tailwind v3 does not natively support `[data-theme]` attribute variants — that is a Tailwind v4 feature. However, the theme switching does **not** need to go through Tailwind classes. The correct pattern for this project:

1. CSS custom properties scoped to `[data-theme]` selectors in `global.css`
2. Existing `.window`, `.button`, `.splash-screen`, `.desktop-icon` classes read from those variables
3. 98.css classes rendered conditionally by `Window.astro` when theme = `win95`
4. Tailwind utility classes (layout, spacing, flex) work unchanged across all themes — no theme variant needed

```css
/* global.css — theme variable blocks */
:root,
[data-theme="default"] {
  --theme-bg: #008080;
  --theme-window-bg: #c0c0c0;
  --theme-font: "Courier New", monospace;
  /* ... */
}

[data-theme="win95"] {
  --theme-bg: #008080;
  --theme-window-bg: #c0c0c0;
  --theme-font: "W95FA", "MS Sans Serif", sans-serif;
  /* win95 uses 98.css classes for chrome — override variables AND swap classes */
}

[data-theme="win31"] {
  --theme-bg: #000080;
  --theme-window-bg: #c0c0c0;
  --theme-font: "W95FA", "MS Sans Serif", sans-serif;
  /* win31 uses custom hand-rolled chrome — 98.css doesn't cover this era */
}
```

### Theme Switcher Script (FOUC-safe)

Astro View Transitions replaces the DOM on navigation, stripping `data-theme` from `<html>`. The fix is an `is:inline` script in `<head>` that listens to both page load and `astro:after-swap`:

```astro
<!-- In Layout.astro <head> -->
<script is:inline>
  function applyTheme() {
    const theme = localStorage.getItem('theme') ?? 'default';
    document.documentElement.setAttribute('data-theme', theme);
  }
  document.addEventListener('astro:after-swap', applyTheme);
  applyTheme();
</script>
```

`is:inline` executes before render, preventing flash. `astro:after-swap` re-applies after every view transition. Total script size: ~200 bytes.

### 98.css Integration in Window.astro

98.css must be imported globally (not scoped) because it styles semantic HTML. Import conditionally from a theme layout wrapper or always import and use CSS specificity:

```astro
---
// In Layout.astro — import 98.css globally; its classes only activate
// when Window.astro emits the right HTML structure
import '98.css/98.css';
---
```

Then `Window.astro` conditionally emits 98.css-compatible HTML vs current HTML based on `data-theme` read at render time OR a theme-aware Astro component prop.

**Note:** 98.css uses `.window`, `.window-body`, `.title-bar`, `.title-bar-text`, `.title-bar-controls` classes. The existing global.css has a `.window` class. These will conflict. Resolution: scope existing `.window` styles under `[data-theme="default"] .window { ... }` and let 98.css handle `.window` for win95 theme. This is the main CSS refactor needed.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| 98.css (v0.1.21) | xp.css (v0.2.3) | xp.css is an extension of 98.css and bundles a 98.css dist inside it. Use xp.css only if also targeting a Windows XP theme. For Win95 only, 98.css directly is smaller and more focused. |
| 98.css | OS-GUI.js | OS-GUI.js adds JavaScript window management (draggable, minimize/maximize). Use if the site needs actual interactive draggable windows. Overkill for a personal static site with fixed-position content. |
| Self-hosted W95FA font | Google Fonts / Pixelify Sans | Google Fonts dependency adds network request and privacy concern. Pixelify Sans is a modern interpretation, not a faithful recreation. Self-host W95FA for authenticity. |
| CSS custom properties + inline script | Astro middleware / cookies | Cookies approach works for SSR sites. This is a static site — cookies at build time don't help. localStorage + inline script is the correct SSG approach. |
| CSS custom properties + inline script | `nanostores` or Svelte stores | Heavy JS store for a theme string read on page load is overkill. localStorage + 200-byte inline script is simpler, faster, and avoids a dependency. |
| CSS custom properties + inline script | `next-themes` / `astro-color-mode` | `next-themes` is React-specific. `astro-color-mode` is dark/light only — doesn't support named themes like `win31`, `win95`, `default`. Hand-rolled inline script is necessary for 3+ named themes. |
| Hand-rolled Windows 3.1 CSS | A dedicated Win 3.1 CSS lib | No dedicated Windows 3.1 CSS npm package exists (HIGH confidence — searched npm, GitHub, CSS framework directories). Must hand-roll Win 3.1 chrome using flat gray (#c0c0c0), beveled borders (ridge/groove), and bitmap font. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Tailwind `dark:` variant for theme switching | `dark:` only supports 2 states (dark/light). Multi-theme requires `[data-theme="win95"] .class` selectors in CSS. Using Tailwind variants for 3 OS themes produces unmaintainable class lists in every template. | CSS custom properties scoped to `[data-theme]` selectors, with Tailwind only for layout utilities |
| React / Vue / Svelte for theme switcher UI | The site is intentionally zero-JS framework. Adding a framework island just for a theme dropdown button is disproportionate. | Vanilla `<script>` in a `.astro` component — no hydration cost |
| CSS-in-JS (styled-components, emotion) | Incompatible with Astro static output. Adds JS bundle weight. | CSS custom properties in `global.css` |
| Tailwind v4 upgrade for this milestone | Tailwind v4's `@theme` directive and native multi-theme support would help, but the migration risk is out of scope. Tailwind v3 handles this via CSS custom properties without Tailwind's own theming system. | Stay on Tailwind v3.4.14; add theme vars manually to `global.css` |
| Dynamic CSS file swapping (`<link>` swap) | Causes visible FOUC and layout shift when switching themes. Hard to keep in sync with View Transitions. | Single global CSS with theme-scoped custom property blocks |

## Stack Patterns by Variant

**For the Windows 95 theme:**
- Use 98.css HTML structure in `Window.astro` (`.window` > `.title-bar` > `.window-body`)
- Import 98.css globally, scope current `.window` styles under `[data-theme="default"]`
- Override font with W95FA webfont via `[data-theme="win95"]` CSS block
- Background stays `#008080` (authentic Win95 teal desktop)

**For the Windows 3.1 theme:**
- No existing CSS library — hand-roll chrome
- Windows 3.1 aesthetic: flat gray (#c0c0c0), solid black 1px borders (no drop shadows), beveled look via `border-style: ridge` or manual inset/outset borders, uppercase title bars, navy/gray title bar gradient
- Background: `#000080` (Program Manager navy blue) or `#008080`
- Font: W95FA (it covers 3.1 era) or "MS Sans Serif" system fallback

**For the default retro theme:**
- Existing CSS unchanged, just wrapped in `[data-theme="default"]` scope
- No additions needed

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| 98.css@0.1.21 | Astro 4.x, Tailwind 3.x | Pure CSS — no framework coupling. Import via `node_modules/98.css/98.css` or npm dist path. |
| 98.css@0.1.21 | xp.css@0.2.3 | Do not use both simultaneously — they both define `.window` and will conflict. Pick one. |
| Tailwind CSS 3.4.14 | CSS custom properties | Tailwind v3 generates utility classes independently of CSS custom properties. Custom properties can coexist in the same stylesheet without conflict. |

## Sources

- [98.css GitHub — jdan/98.css](https://github.com/jdan/98.css) — version confirmed 0.1.21, HTML structure requirements, no-JS confirmation
- [XP.css GitHub — botoxparty/XP.css](https://github.com/botoxparty/XP.css) — version 0.2.3, theme dist paths, relationship to 98.css
- [Tailwind CSS v3 Dark Mode docs](https://v3.tailwindcss.com/docs/dark-mode) — selector/variant strategies, multiple theme variant support confirmed
- [Astro theme selector — victorlillo.dev](https://victorlillo.dev/blog/theme-selector-component-in-astro) — localStorage + inline script pattern, FOUC prevention, MEDIUM confidence
- [FOUC with Astro transitions — simonporter.co.uk](https://www.simonporter.co.uk/posts/what-the-fouc-astro-transitions-and-tailwind/) — `astro:after-swap` event required for View Transitions compatibility, MEDIUM confidence
- [W95FA font — CDNFonts](https://www.cdnfonts.com/w95fa.font) — webfont format availability, SIL OFL license, MEDIUM confidence
- [MS W98 UI — MARTYR-X-LTD/ms-w98-ui](https://github.com/MARTYR-X-LTD/ms-w98-ui) — covers Win 3.1 through ME, OTF/TTF/webfont formats, no npm package
- [Astro Styles and CSS docs](https://docs.astro.build/en/guides/styling/) — global CSS import patterns, `is:inline` script behavior
- WebSearch for Windows 3.1 CSS npm package — no package found (searched npm, GitHub topics, CSS framework directories) — HIGH confidence absence

---
*Stack research for: Astro multi-theme system (Windows 3.1 + Windows 95 + default retro desktop)*
*Researched: 2026-03-21*
