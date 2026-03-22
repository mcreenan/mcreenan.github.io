# Project Research Summary

**Project:** Multi-theme retro OS system for matt.creenan.me
**Domain:** CSS theme switching for Astro static site (retro, Windows 3.1, Windows 95)
**Researched:** 2026-03-21
**Confidence:** HIGH

## Executive Summary

This project adds two period-accurate retro OS themes (Windows 3.1, Windows 95) to an existing Astro static site alongside the current retro aesthetic, switchable via a persistent UI. Research confirms that the correct architecture is CSS custom properties scoped under `html[data-theme]` attributes — no JS framework, no dynamic CSS loading, no server-side rendering. The existing `Window.astro` and `Button.astro` components are well-positioned to absorb theme variants through a CSS token refactor, and `98.css` (v0.1.21) provides verified, production-ready Windows 95 chrome that maps directly onto the required HTML structure. Windows 3.1 has no equivalent npm library — it must be hand-rolled, but the visual spec is well-documented and simpler than Win95.

The recommended implementation follows a strict dependency order: tokenize the existing CSS before writing any theme variants, build the theme switching infrastructure before any theme CSS, implement Win3.1 and Win95 chrome separately before tackling the desktop shell metaphor, and address the Win95 taskbar as the final chrome element. Structural layout differences between the retro theme (centered content window) and Windows themes (desktop with floating app windows) require a `Desktop.astro` shell component that can be toggled via CSS `display` without JS.

The primary risk is specificity conflicts if CSS tokenization is skipped or done incompletely — this is non-recoverable without a full refactor. A secondary risk is FOUC (flash of incorrect theme) caused by localStorage reads in non-inline scripts. Both risks have well-understood prevention strategies documented in the research and must be addressed in the foundation phase before any theme work begins.

## Key Findings

### Recommended Stack

The existing Astro 4.16.8, Tailwind CSS 3.4.14, and TypeScript 5.6.3 stack requires only one new npm dependency: `98.css@0.1.21` for Windows 95 window chrome. All theme switching infrastructure is CSS custom properties plus a ~200-byte inline script. Tailwind v3's `dark:` variant system is not suitable for multi-theme work — theme tokens must live in plain CSS under `[data-theme]` selectors, with Tailwind used only for layout utilities (flex, spacing, grid). No Tailwind v4 upgrade is needed or desirable for this milestone.

Font assets (W95FA webfont for Windows era authenticity) must be self-hosted as static files in `/public/fonts/` — no npm package exists. Google Fonts alternatives are lower fidelity and introduce external network dependencies.

**Core technologies:**
- `98.css@0.1.21`: Windows 95/98 window chrome — pure CSS, no JS, maps to `Window.astro` HTML structure
- CSS Custom Properties + `[data-theme]`: Theme variable system — zero dependency, FOUC-safe, Tailwind-compatible
- W95FA webfont (self-hosted): Period-accurate pixel font for Windows themes — SIL OFL licensed, woff2 format
- `<script is:inline>` + localStorage: Theme persistence without FOUC — required, no viable alternative for static site

### Expected Features

All research confirms the CSS vars refactor is a prerequisite for everything. No Windows theme feature can ship correctly until every hardcoded value in the existing CSS is expressed through a CSS custom property.

**Must have (table stakes for v2.0):**
- CSS vars refactor of `global.css`, `Window.astro`, `Button.astro` — prerequisite for all themes
- `ThemeSwitcher.astro` component — accessible from all four pages via Layout.astro
- Windows 95 beveled window chrome + navy gradient title bar — most recognizable Win95 visual
- Windows 3.1 flat gray window chrome + solid navy title bar — distinctly flat, no Win95 bevels
- Period-accurate fonts with `-webkit-font-smoothing: none` — wrong font immediately breaks era illusion
- `Desktop.astro` shell — teal wallpaper + section icons for Windows themes
- Win95 `Taskbar.astro` — Start button + clock; Win95 without a taskbar feels visibly incomplete
- Win3.1 Program Manager icon grid — section icons in a group window

**Should have (v2.1 after validation):**
- localStorage theme persistence with anti-flash inline script
- Win95 title bar minimize/close button icons (pure CSS polish)
- Inactive window title bar state (grey title bar on unfocused window)

**Defer (v3.0+):**
- Draggable/resizable windows — no portfolio content value justifies the JS complexity
- Multi-window MDI — navigation model does not require it
- DOS/terminal fourth theme — prove three-theme system first
- Animated wallpapers/screensavers

### Architecture Approach

The architecture is layered: theme state lives solely on `html[data-theme]`, CSS custom properties cascade from that attribute to all components, structural shell differences (desktop vs. centered layout) are handled by a `Desktop.astro` component toggled via CSS `display:none`, and all theme stylesheets are imported unconditionally at build time. The key insight from research is that conditional CSS file imports are impossible in Astro's static output — all three theme stylesheets must always be loaded, with CSS selectors determining which rules activate. The total CSS weight for all three themes is estimated under 20KB.

**Major components:**
1. `Layout.astro` (modified) — injects `ThemeSwitcher`, `Desktop.astro` shell, and `is:inline` theme-init script
2. `ThemeSwitcher.astro` (new) — vanilla JS, no framework; writes to localStorage and sets `html[data-theme]`
3. `Desktop.astro` (new) — Windows-theme desktop metaphor with teal wallpaper, icon grid, content slot
4. `Taskbar.astro` (new, Win95 only) — Start button, clock, active page indicator
5. `Window.astro` / `Button.astro` (modified) — replace hardcoded hex values with CSS vars
6. `theme-win31.css` / `theme-win95.css` (new) — `[data-theme]`-scoped custom property overrides

### Critical Pitfalls

1. **FOUC (Flash of inAccurate coloR Theme)** — Prevent by placing `<script is:inline>` in `<head>` that reads localStorage and sets `data-theme` before first paint. Also add `astro:after-swap` listener for View Transitions. Using a regular (bundled) `<script>` tag instead will cause visible theme flash on every load.

2. **CSS specificity wars from hardcoded values** — Prevent by completing the CSS tokenization refactor before writing any theme variant rules. Every hardcoded hex color in component styles must become a `var(--token)` reference first. Using `!important` to resolve conflicts escalates permanently.

3. **Breaking the existing retro layout during CSS refactor** — Prevent by refactoring incrementally (one component at a time) with browser visual regression checks between each component. The animated border on `.splash-screen` and gradient text on `.window-title` are particularly fragile. Do not batch the entire refactor.

4. **View Transitions leaking theme state** — Prevent by ensuring `is:inline` script fires before Astro's View Transition script via `<head>` placement order. Theme changes that occur mid-transition will cause window chrome to visually morph between themes during the transition animation.

5. **Astro scoped `<style>` breaking `[data-theme]` selectors** — Prevent by placing all `[data-theme]` custom property definitions in `global.css` or `<style is:global>` blocks. Writing `[data-theme="win95"] .window` inside a component's scoped `<style>` block causes Astro to rewrite the selector with a hash that breaks the attribute selector.

## Implications for Roadmap

Based on research, the dependency chain is non-negotiable: foundation before infrastructure before theme CSS before desktop shell. Six phases are recommended.

### Phase 1: CSS Foundation Refactor
**Rationale:** Every subsequent phase depends on this. Specificity conflicts are non-recoverable without this refactor. Zero user-visible change is the success criteria.
**Delivers:** All hardcoded theme values extracted to `:root` CSS custom properties; retro theme visually identical to current state; `[data-theme="retro"]` alias working; stub imports for Win3.1 and Win95 theme files
**Addresses:** CSS vars refactor table-stakes feature; Existing component integration (Window.astro, Button.astro, global.css)
**Avoids:** CSS specificity wars pitfall; Breaking existing layout pitfall (incremental approach required)

### Phase 2: Theme State Infrastructure
**Rationale:** Theme switching machinery must work before any visual theme work begins. Validates the data-theme pattern on the live site with zero risk of visual regressions.
**Delivers:** `ThemeSwitcher.astro` component (minimal 3-button UI); `is:inline` anti-flash script in BaseHead.astro; `astro:after-swap` listener for View Transitions; clicking switcher changes `html[data-theme]`
**Uses:** CSS custom properties, localStorage, `is:inline` script pattern
**Avoids:** FOUC pitfall (addressed here permanently); View Transitions theme leak pitfall

### Phase 3: Windows 3.1 Theme CSS
**Rationale:** Win3.1 is visually simpler than Win95 (no beveling, no library dependency), making it the safer first theme to validate the CSS vars system end-to-end.
**Delivers:** `theme-win31.css` with period-accurate vars (flat gray, thick black borders, solid navy title bar, monospace font); Window.astro and Button.astro consuming vars; Win3.1 theme visually correct on all four existing pages
**Uses:** Hand-rolled CSS (no npm library); W95FA webfont in `/public/fonts/`
**Avoids:** Retro font rendering pitfall (Safari font-smoothing testing required)

### Phase 4: Windows 95 Theme CSS
**Rationale:** Win95 chrome requires 98.css integration and the 4-layer inset bevel pattern. Isolated from the desktop shell to contain scope and validate the CSS before building the structural components.
**Delivers:** `98.css` installed; `theme-win95.css` with beveled borders, navy-to-teal gradient title bar, Win95 font; Win95 theme visually correct on all existing pages
**Uses:** `98.css@0.1.21`; CSS custom properties for vars; W95FA webfont
**Avoids:** 98.css `.window` class conflict with existing global.css `.window` — requires scoping existing styles under `[data-theme="retro"] .window`

### Phase 5: Windows Desktop Shell
**Rationale:** Desktop metaphor (icons, wallpaper, taskbar) is structurally separate from window chrome CSS. Blocked on Phases 3 and 4 being complete.
**Delivers:** `Desktop.astro` (teal wallpaper + section icon grid + content slot); CSS-based show/hide wired into Layout.astro; `Taskbar.astro` for Win95 (Start button, clock, active app label); Win3.1 Program Manager-style icon grid
**Implements:** Desktop.astro + Taskbar.astro architecture components; App-launcher metaphor pattern
**Avoids:** Draggable window complexity (each page renders as maximized window — no window management JS needed)

### Phase 6: Theme Switcher Polish and Accessibility
**Rationale:** Polish and compliance work after all themes are functionally complete. Easier to audit contrast and keyboard nav once the final visual states exist.
**Delivers:** Theme switcher positioned appropriately per active theme; active/selected theme indicator in switcher UI; WCAG contrast verification for all color pairs; keyboard navigation and focus states for all interactive elements
**Avoids:** Accessibility failures hidden by retro aesthetic pitfall; UX pitfall of no current-theme indicator

### Phase Ordering Rationale

- Phases 1 and 2 must precede all others — they are hard prerequisites not just soft dependencies. Any theme CSS written before tokenization is complete will need to be rewritten.
- Phase 3 (Win3.1) precedes Phase 4 (Win95) because Win3.1 requires no npm library and validates the CSS vars pattern before the 98.css integration complexity is introduced.
- Phase 5 (Desktop shell) is intentionally decoupled from Phases 3-4. Window chrome and desktop metaphor are independent concerns — shipping chrome first allows verification that themes look correct before adding structural layout complexity.
- Phase 6 is always last. Contrast ratios and focus states can only be definitively verified against final visual states.

### Research Flags

Phases with standard, well-documented patterns (skip research-phase):
- **Phase 1 (CSS Foundation):** Standard CSS tokenization — well-understood; no research needed
- **Phase 2 (Theme Infrastructure):** localStorage + `is:inline` pattern is fully documented in research artifacts; Astro docs confirm the approach
- **Phase 4 (Win95 CSS):** 98.css documentation is comprehensive; HTML structure requirements are explicit
- **Phase 6 (Polish):** WCAG contrast tooling is standard; no research needed

Phases that may benefit from deeper research during planning:
- **Phase 3 (Win3.1 CSS):** Win3.1 font rendering and authentic bitmap font fallback stack may need browser compatibility testing before finalizing font choices. MEDIUM confidence on exact Fixedsys fallback behavior across operating systems.
- **Phase 5 (Desktop Shell):** Win3.1 Program Manager icon grid layout has no direct CSS reference — the MDI-style "group window containing icons" layout requires structural decisions about HTML and CSS. Worth a focused spike before writing the component.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | 98.css version and API verified. Win3.1 library absence confirmed (HIGH confidence). Font file availability confirmed but self-hosting workflow requires manual steps. |
| Features | HIGH | Win95 Chrome specs derived directly from 98.css source. Win3.1 specs from screenshot analysis and community sources — slightly lower certainty on exact border/shadow values. |
| Architecture | HIGH | CSS custom properties + data-theme pattern verified via multiple independent sources including official Astro docs. `astro:after-swap` pattern confirmed via Astro view transitions documentation. |
| Pitfalls | HIGH | FOUC issue is documented with official Astro guidance. CSS specificity rules are deterministic. Scoped style / data-theme interaction confirmed via Astro styling docs. |

**Overall confidence:** HIGH

### Gaps to Address

- **W95FA font self-hosting workflow:** Font files must be manually downloaded and placed in `/public/fonts/`. No automated step in the build. The exact WOFF2 file path and `@font-face` declaration needs verification against the actual downloaded file before Phase 3 begins.
- **98.css `.window` class collision:** Importing 98.css globally will conflict with the existing `.window` class in `global.css`. The resolution (scoping existing `.window` under `[data-theme="retro"]`) is documented but requires careful execution — a mis-scoped selector will silently break the retro theme.
- **Win3.1 exact font fallback stack:** `"Fixedsys"` is not available on modern operating systems. The correct monospace fallback that visually approximates Win3.1's System bitmap font has not been verified across browsers and OS. Test and confirm during Phase 3.
- **Desktop shell CSS toggle approach:** Both CSS `display:none` swapping and conditional Astro component rendering are viable approaches for the Desktop/retro layout switch. The CSS-only `display:none` approach (recommended in ARCHITECTURE.md) means both DOM trees are always present. Verify this doesn't cause accessibility issues (hidden content in DOM) during Phase 5 planning.

## Sources

### Primary (HIGH confidence)
- [98.css GitHub — jdan/98.css](https://github.com/jdan/98.css) — Win95 chrome color values, HTML structure requirements, `.window` class semantics
- [Astro View Transitions docs](https://docs.astro.build/en/guides/view-transitions/) — `astro:after-swap` event, View Transitions lifecycle
- [Astro Styles and CSS docs](https://docs.astro.build/en/guides/styling/) — `is:inline` behavior, global CSS, `define:vars` limitations
- [98.css live docs](https://jdan.github.io/98.css/) — component gallery for Win95 chrome specifications

### Secondary (MEDIUM confidence)
- [Victor Lillo — Theme Selector in Astro](https://victorlillo.dev/blog/theme-selector-component-in-astro) — localStorage + inline script pattern, FOUC prevention
- [Simon Porter — FOUC with Astro transitions](https://www.simonporter.co.uk/posts/what-the-fouc-astro-transitions-and-tailwind/) — `astro:after-swap` for View Transitions compatibility
- [Scott Willsey — Get Rid of Theme Flicker](https://scottwillsey.com/theme-flicker/) — inline script technique for FART prevention
- [Tailwind CSS v3 Dark Mode docs](https://v3.tailwindcss.com/docs/dark-mode) — selector strategy for multi-theme
- [BetaArchive — Win3.1 default color schemes](https://www.betaarchive.com/forum/viewtopic.php?t=26251) — Win3.1 color defaults
- [Futur3Sn0w/web31](https://github.com/Futur3Sn0w/web31) — pixel-for-pixel Win3.1 recreation reference

### Tertiary (LOW confidence)
- [W95FA font — CDNFonts](https://www.cdnfonts.com/w95fa.font) — webfont format availability, license
- [Bitmap fonts on modern browsers — reverseback.gr](https://reverseback.gr/txt/bitmap-fonts/) — browser rendering behavior for bitmap fonts

---
*Research completed: 2026-03-21*
*Ready for roadmap: yes*
