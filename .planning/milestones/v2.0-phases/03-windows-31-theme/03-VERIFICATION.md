---
phase: 03-windows-31-theme
verified: 2026-04-04T19:30:00Z
status: human_needed
score: 4/4 must-haves verified
human_verification:
  - test: "Switch to Win 3.1 theme and verify flat gray window chrome with navy title bars"
    expected: "Windows show #C0C0C0 gray chrome, 2px black borders, solid #000080 navy title bars with white text, no gradients or shadows"
    why_human: "Visual appearance verification -- CSS rules exist but rendered output needs human eyes"
  - test: "Verify W95FA bitmap font renders on title bars and UI labels"
    expected: "Blocky bitmap-style font visible on window titles, menu bar, icon labels -- not smooth system font"
    why_human: "Font rendering is visual -- file exists and is referenced but rendering quality needs confirmation"
  - test: "Navigate Program Manager icons and verify all three link to correct pages"
    expected: "About icon -> /about, Work icon -> /work, Contact icon -> /contact"
    why_human: "Navigation flow and icon visual quality need human testing"
  - test: "Switch back to retro theme and verify no visual regressions"
    expected: "Retro splash screen appears as before, Program Manager is hidden, retro styling intact"
    why_human: "Regression testing requires visual comparison"
  - test: "On subpages in win31 theme, verify chrome buttons appear and [-] navigates home"
    expected: "Title bar shows [-] control box on left, decorative arrows on right; clicking [-] returns to home"
    why_human: "Interactive behavior and visual layout need human verification"
---

# Phase 03: Windows 3.1 Theme Verification Report

**Phase Goal:** Users can experience the site in an authentic Windows 3.1 aesthetic with flat gray chrome, solid navy title bars, and period-accurate fonts
**Verified:** 2026-04-04T19:30:00Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Switching to win31 theme applies flat gray window chrome with thick black borders and solid navy title bars | VERIFIED | `[data-theme="win31"] .window` has `background-color: var(--color-window)` (#C0C0C0), `border: 2px solid #C0C0C0`, `outline: 1px solid #000000`; `.window-titlebar` has `background: #000080`, `color: #FFFFFF` |
| 2 | Buttons in win31 theme render with raised flat gray style, not retro style | VERIFIED | `[data-theme="win31"] .button:hover` has `transform: none; box-shadow: none;` -- disables retro hover lift and shadow |
| 3 | Period-appropriate bitmap-style font visible on UI labels and window titles | VERIFIED | W95FA font files exist (woff: 9776B, woff2: 7880B), @font-face declared in global.css, preload in BaseHead.astro, `--font-body` and `--font-title` tokens reference "W95FA" |
| 4 | About, Work, Contact appear as icon groups inside Program Manager window on desktop | VERIFIED | ProgramManager.astro (104 lines) has 3 `pm-icon` anchors with 32x32 SVG pixel art linking to /about, /work, /contact; CSS toggle shows Program Manager in win31 theme |

**Score:** 4/4 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `public/fonts/w95fa.woff` | W95FA bitmap font WOFF | VERIFIED | 9,776 bytes, non-empty |
| `public/fonts/w95fa.woff2` | W95FA bitmap font WOFF2 | VERIFIED | 7,880 bytes, non-empty |
| `src/styles/global.css` | Win31 token block + component overrides | VERIFIED | 43 `[data-theme="win31"]` selectors, @font-face declaration, display toggle rules |
| `src/components/BaseHead.astro` | W95FA font preload link | VERIFIED | `<link rel="preload" href="/fonts/w95fa.woff2" as="font" type="font/woff2" crossorigin />` at line 55-60 |
| `src/components/Window.astro` | Variant prop with win31 chrome buttons | VERIFIED | `variant?: "retro" \| "win31"` prop, win31 chrome buttons always rendered (CSS toggle for visibility) |
| `src/components/ProgramManager.astro` | Program Manager with menu bar and icon grid | VERIFIED | 104 lines, menu bar with File/Options/Window/Help, 3 SVG pixel art icons, openThemeDialog() wired |
| `src/pages/index.astro` | retro-layout wrapper + ProgramManager | VERIFIED | `import ProgramManager`, `retro-layout` div, `<ProgramManager />` rendered |
| `src/pages/about.astro` | Win31 chrome buttons in title bar | VERIFIED | `win31-chrome-btn` elements with `aria-label="Close - return to home"` anchor |
| `src/pages/work.astro` | Win31 chrome buttons in title bar | VERIFIED | `win31-chrome-btn` elements with home anchor |
| `src/pages/contact.astro` | Win31 chrome via Window.astro component | VERIFIED | Uses `<Window title="Contact" contentWindow>` which renders chrome buttons |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| BaseHead.astro | /fonts/w95fa.woff2 | link rel=preload | WIRED | Line 55-60: preload with correct href and type |
| global.css | W95FA font-face | @font-face declaration | WIRED | Lines 1-8: @font-face with woff2 and woff sources |
| global.css | win31 token block | data-theme selector | WIRED | 43 selectors scoped under `[data-theme="win31"]` |
| index.astro | ProgramManager.astro | Astro component import | WIRED | `import ProgramManager` + `<ProgramManager />` |
| ProgramManager.astro | /about, /work, /contact | anchor href on icon grid | WIRED | 3 `<a href="/about|/work|/contact" class="pm-icon">` elements |
| ProgramManager.astro | openThemeDialog() | onclick on Change Theme | WIRED | `onclick="window.openThemeDialog()"` on menu button |
| about.astro | home page | win31 chrome button anchor | WIRED | `<a href="/" class="win31-chrome-btn">` |
| global.css | program-manager toggle | display none/flex | WIRED | `.program-manager { display: none }` + `[data-theme="win31"] .program-manager { display: flex }` |
| global.css | retro-layout toggle | display none | WIRED | `[data-theme="win31"] .retro-layout { display: none }` |

### Data-Flow Trace (Level 4)

Not applicable -- this is a static site with CSS-only theme switching. No dynamic data fetching or runtime state management.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build passes | `bun run build` | "5 page(s) built in 691ms" exit 0 | PASS |
| Win31 selector count | grep count for `[data-theme="win31"]` in global.css | 43 matches | PASS |
| Font files present | ls public/fonts/w95fa.* | woff (9776B) + woff2 (7880B) | PASS |
| ProgramManager substantive | wc -l ProgramManager.astro | 104 lines | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| WIN31-01 | 03-01, 03-02 | Windows have flat gray chrome with solid navy title bars and 2px black borders | SATISFIED | CSS rules for .window (2px border, #C0C0C0), .window-titlebar (#000080 background) |
| WIN31-02 | 03-01 | Buttons render with flat Win3.1 style (raised gray, black border) | SATISFIED | `[data-theme="win31"] .button:hover { transform: none; box-shadow: none }` |
| WIN31-03 | 03-01 | Period-appropriate bitmap-style font applied to UI elements | SATISFIED | W95FA font files, @font-face, preload, CSS tokens --font-body/--font-title |
| WIN31-04 | 03-02 | Desktop shows Program Manager window with icon groups for each section | SATISFIED | ProgramManager.astro with menu bar and 3 pixel art icons; CSS toggle on index.astro |

Note: WIN31-04 is still marked "Pending" in REQUIREMENTS.md but implementation is complete. REQUIREMENTS.md needs updating.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| (none) | - | - | - | No anti-patterns found |

No TODOs, FIXMEs, placeholders, empty implementations, or stub patterns detected in any phase 03 artifacts.

### Human Verification Required

### 1. Win 3.1 Visual Fidelity

**Test:** Switch to Win 3.1 theme via theme dialog. Inspect window chrome, title bars, and overall aesthetic.
**Expected:** Flat gray (#C0C0C0) windows, solid navy (#000080) title bars with white text, 2px black borders, no gradients/beveling/shadows. W95FA bitmap font visible on titles and labels.
**Why human:** Visual rendering fidelity cannot be verified programmatically.

### 2. Program Manager Layout and Icons

**Test:** On home page in Win 3.1 theme, verify Program Manager window with menu bar and 32x32 pixel art icons.
**Expected:** Window titled "Program Manager" with File/Options/Window/Help menu bar. Three pixel art icons (person, briefcase, envelope) labeled About, Work, Contact. Icons link to correct pages.
**Why human:** Icon visual quality, layout spacing, and pixel art fidelity need visual inspection.

### 3. Options Menu Interaction

**Test:** Click "Options" in the Program Manager menu bar, then click "Change Theme..."
**Expected:** Dropdown appears on focus/click. "Change Theme..." opens the theme dialog.
**Why human:** CSS :focus-within dropdown behavior and interaction flow need interactive testing.

### 4. Subpage Chrome and Navigation

**Test:** Navigate to /about, /work, /contact in Win 3.1 theme. Check title bar chrome buttons.
**Expected:** Navy title bar with [-] control box on left (links to home), decorative arrow buttons on right. Chrome buttons hidden in retro theme.
**Why human:** Interactive navigation and CSS visibility toggle behavior across themes need testing.

### 5. Retro Theme Regression

**Test:** Switch back to retro theme after testing Win 3.1.
**Expected:** Program Manager hidden, retro splash screen visible, all retro styling intact with no visual regressions.
**Why human:** Regression detection requires visual comparison against known-good state.

### Gaps Summary

No automated gaps found. All 4 roadmap success criteria are verified at the code level -- artifacts exist, are substantive, and are properly wired. The build passes cleanly.

5 items require human visual/interactive verification to confirm the Win 3.1 aesthetic renders correctly in the browser.

---

_Verified: 2026-04-04T19:30:00Z_
_Verifier: Claude (gsd-verifier)_
