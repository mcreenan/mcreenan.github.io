---
phase: 06-standalone-resume-page
verified: 2026-04-30T23:59:41Z
status: human_needed
score: 5/5 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Visual fidelity to design handoff"
    expected: "Page matches ~/resume/design_handoff_resume/Resume.html pixel-faithfully — Merriweather serif body, JetBrains Mono meta, slate accent surfaces (#c3cbd1) on .personal and .technical only, paper card with subtle shadow on warm cream background, 130px date/label gutters, 44%/1fr intro grid, 780px max-width."
    why_human: "Pixel-faithful design fidelity (D-10) requires visual comparison against the handoff. Screenshot evidence at 1280x1800 was captured during execution and shows the major structural elements; final sign-off on color tones, spacing, and typographic rhythm is a visual judgement."
  - test: "Click 'Download PDF' opens browser print dialog and saves clean PDF"
    expected: "Clicking the button at top-right of .intro opens the native browser print dialog. Selecting 'Save as PDF' produces a PDF showing the full resume WITHOUT the Download PDF button (hidden via @media print), with white body background, no .page box-shadow, no margin, padding 36px 44px."
    why_human: "Print dialog and PDF generation cannot be verified programmatically without a headless browser run. The static analysis confirms the click handler calls window.print() and the @media print block contains .download-pdf { display: none } — a human runs the print dialog to confirm UX and that the saved PDF is recruiter-ready."
  - test: "Cmd/Ctrl+P from /resume produces clean printout"
    expected: "Standard browser print preview (Cmd/Ctrl+P, no button click) shows the resume with the same clean print styling — no themed nav chrome, no Download PDF button, white body background."
    why_human: "Print preview rendering is a browser-side behavior that depends on browser implementation of @media print. Static checks confirm the @media print block exists with the correct rules, but visually confirming the printed output's appearance requires opening the print preview."
  - test: "Mobile (≤640px) layout — Download PDF button does not overlap <h1>Matt Creenan"
    expected: "At viewport widths between 320px and 640px, the absolutely-positioned Download PDF button at top-right of .intro stays clear of the .personal card's name heading. The .intro grid collapses to single column with gap: 16px and the button remains discoverable."
    why_human: "Plan 2 noted overlap could occur at 320px–375px and proposed a contingency padding-top: 32px; the contingency was NOT applied. A live viewport test at the smallest mobile widths is needed to confirm no overlap occurs in practice."
  - test: "Theme switching on /about, /work, /contact remains unaffected"
    expected: "The retro/win31/win95 theme switcher (ThemeDialog) on the themed pages still cycles themes correctly via localStorage 'theme' key. /work in particular still toggles between .retro-win31-window and .win95-window blocks based on the active theme."
    why_human: "The theme switcher UI flow involves ThemeDialog interactions, localStorage persistence across page loads, and overlay behaviors. Static analysis confirms no theme-related files were modified outside the work.astro Resume button (which is not bound to the overlay system per code inspection — overlay binds only to .pm-icon and .win95-icon, neither of which is the Resume button). Visual sign-off needed to confirm regressions absent in the live UI."
---

# Phase 6: Standalone Resume Page Verification Report

**Phase Goal:** Add a standalone `/resume` page (outside the desktop-OS theme system) and wire up the disabled "Resume" button on `/work` to link to it. Provide a downloadable PDF version.
**Verified:** 2026-04-30T23:59:41Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visiting `/resume` shows clean standalone page (no theme-switching UI / no themed chrome) | VERIFIED | `src/pages/resume.astro` opens with literal `<!doctype html>` then `<html lang="en">` (no `data-theme`). Grep counts: 0 `data-theme`, 0 `BaseHead`, 0 `Layout` import, 0 `global.css`, 0 `ViewTransitions`, 0 `ThemeDialog`/`Taskbar`/`HomeIcon`/`ThemesIcon`. Built artifact `dist/resume/index.html` shows 0 `data-theme` occurrences. The resume page does NOT include `<a class="desktop-icon">`, `<ThemeDialog>`, or `<Taskbar>` (verified by reading the file end-to-end). `/resume` is not present in `TITLE_MAP` in `src/pages/index.astro`. |
| 2 | Resume button on `/work` enabled, navigates to `/resume` from BOTH retro and win95 variants | VERIFIED | `src/pages/work.astro` has 0 `disabled`, 0 `cursor-not-allowed`, 0 `opacity-60`, 0 `Resume coming soon`. Contains exactly 2 `href="/resume"`, 2 `aria-label="Open resume in a new tab"`, 2 `<span>Resume</span>`, ≥2 `target="_blank"` and `rel="noopener"`. Direct file reading (lines 41-54 retro-win31-window, lines 135-148 win95-window) confirms identical `<a>` element markup in both blocks. Built `dist/work/index.html` contains both anchors. |
| 3 | `/resume` is print-friendly (`Cmd/Ctrl+P` produces clean printout, no nav chrome, no theme leftovers) | VERIFIED (programmatic) — human visual confirmation requested | `src/pages/resume.astro` contains a complete `@media print` block (lines 368-381): `body { background: white; }`, `.page { box-shadow: none; margin: 0; max-width: none; padding: 36px 44px; }`, `.download-pdf { display: none; }`. Built artifact: `@media print{body{background:#fff}.page{box-shadow:none;margin:0;max-width:none;padding:36px 44px}.download-pdf{display:none}}` confirmed in `dist/resume/index.html`. Page has no nav chrome to hide (no `desktop-icon`, no `Taskbar`). |
| 4 | "Download PDF" affordance produces downloadable PDF (window.print()) | VERIFIED (programmatic) — human end-to-end test requested | Source has `<button id="download-pdf" class="download-pdf" aria-label="Download resume as PDF">Download PDF</button>` inside `<section class="intro">` (lines 387-394). Bundled (NOT `is:inline`) `<script>` (lines 450-457): `document.getElementById("download-pdf").addEventListener("click", () => { window.print(); })`. Built artifact contains the inlined module script: `<script type="module">const n=document.getElementById("download-pdf");n&&n.addEventListener("click",()=>{window.print()})</script>`. The `.download-pdf` CSS uses `--ink`/`--paper`/`--ink-soft` (NOT `--accent-bg`, per UI-SPEC color reservation). |
| 5 | Theme switching on about/work/contact unaffected | VERIFIED (programmatic) — human UI flow confirmation requested | No files touched outside `src/pages/resume.astro` (created), `src/pages/work.astro` (Resume buttons only), and `public/fonts/*.woff2` (added). `src/styles/global.css`, `src/components/ThemeDialog.astro`, `src/components/Taskbar.astro`, `src/components/BaseHead.astro`, `src/pages/about.astro`, `src/pages/contact.astro`, and `src/pages/index.astro` are untouched. Built `dist/about|work|contact|index` HTML each still contain `data-theme` occurrences (2 each — html attribute + bootstrap script). The work.astro Resume `<a>` is not bound to the overlay system: overlay binds via `document.querySelectorAll('.pm-icon, .win95-icon')` (verified in `src/pages/index.astro` line 113-150 area), and the Resume anchor uses `class="button …"` — not `.pm-icon` or `.win95-icon`. |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/pages/resume.astro` | Standalone resume page (own doctype, head, inline `<style>`; no Layout/BaseHead/global.css imports) | VERIFIED | 459 lines. Contains `<!doctype html>`, `<html lang="en">`, manual `<head>` with charset/viewport/title/description/canonical/OG/Twitter, four `@font-face` blocks, all 11 CSS variables verbatim, full layout CSS (44%/1fr intro, 130px/1fr job/tech-grid, max-width 780px, padding 44px 44px), `@media (max-width: 640px)` and `@media print` blocks, body markup with verbatim copy, `.map()` iteration over `jobs` and `techRows`. Implements all D-04, D-05, D-06, D-10, D-11, D-12 contracts. |
| `src/pages/work.astro` | Updated work page with both Resume buttons converted to enabled anchors linking to /resume in a new tab | VERIFIED | Both `.retro-win31-window` block (lines 41-54) and `.win95-window` block (lines 135-148) contain identical `<a href="/resume" target="_blank" rel="noopener" aria-label="Open resume in a new tab" class="button flex flex-col justify-between py-2 flex-shrink-0">` markup. No `disabled`, `cursor-not-allowed`, `opacity-60`, or `title="Resume coming soon"` remain. Surrounding `<div class="relative">` wrappers preserved; FontAwesome icon and `<span>Resume</span>` label preserved. |
| `public/fonts/merriweather-regular.woff2` | Self-hosted Merriweather 400 | VERIFIED | 97548 bytes, `Web Open Font Format (Version 2), TrueType` |
| `public/fonts/merriweather-bold.woff2` | Self-hosted Merriweather 700 | VERIFIED (with note) | 97548 bytes, WOFF2. Same byte size as merriweather-regular.woff2 — variable-axis font reused for both weights, documented as Plan 1 deviation #2. The `@font-face` declarations select the appropriate weight axis at use time. Implementation-equivalent to two distinct static-weight files. |
| `public/fonts/jetbrains-mono-regular.woff2` | Self-hosted JetBrains Mono 400 | VERIFIED | 31432 bytes, WOFF2 |
| `public/fonts/jetbrains-mono-medium.woff2` | Self-hosted JetBrains Mono 500 | VERIFIED (with note) | 31432 bytes, WOFF2. Same byte size as jetbrains-mono-regular.woff2 — variable-axis font reused; same deviation noted above. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `src/pages/work.astro` (.retro-win31-window block) | `/resume` | `<a href="/resume" target="_blank" rel="noopener" class="button …">` | WIRED | Line 42-53: anchor with all required attributes; surrounding `<div class="relative">` preserved |
| `src/pages/work.astro` (.win95-window block) | `/resume` | `<a href="/resume" target="_blank" rel="noopener" class="button …">` | WIRED | Line 136-147: anchor with all required attributes; nested inside `<Window variant="win95" …>` component which provides win95 chrome |
| `src/pages/resume.astro` inline `@font-face` | `public/fonts/*.woff2` | `url('/fonts/*.woff2') format('woff2')` | WIRED | All four `@font-face` blocks present (lines 100-127) referencing `/fonts/merriweather-regular.woff2`, `/fonts/merriweather-bold.woff2`, `/fonts/jetbrains-mono-regular.woff2`, `/fonts/jetbrains-mono-medium.woff2`. Built artifact references all four URLs verbatim. Astro serves `public/fonts/*` at root path `/fonts/*`. |
| Download PDF `<button>` | `window.print()` | bundled `<script>` click handler bound by id | WIRED | Source: `<button … id="download-pdf" …>Download PDF</button>` and `<script>const btn = document.getElementById("download-pdf"); if (btn) { btn.addEventListener("click", () => { window.print(); }); }</script>`. Built artifact: minified inline module script with same wiring. |
| `@media print` block | `.download-pdf { display: none }` | CSS rule inside the existing `@media print` block | WIRED | Source lines 378-380: rule appended to existing block (not a second `@media print` block). Built artifact: `@media print{body{background:#fff}.page{box-shadow:none;margin:0;max-width:none;padding:36px 44px}.download-pdf{display:none}}` confirmed. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `src/pages/resume.astro` | `jobs` array (4 entries) | Frontmatter `const jobs = [...]` (lines 4-47) | Yes — 4 verbatim entries with dates/title/company/bullets per D-11 | FLOWING |
| `src/pages/resume.astro` | `techRows` array (6 entries) | Frontmatter `const techRows = [...]` (lines 53-66) | Yes — 6 verbatim rows including `Operating&nbsp;Systems` and `Data&nbsp;Engineering` non-breaking space labels | FLOWING |
| `src/pages/resume.astro` | personal contact strip | Hardcoded inline JSX (lines 396-407) | Yes — phone, email, LinkedIn, GitHub all rendered as expected | FLOWING |

Built artifact `dist/resume/index.html` contains all 4 job titles, all 6 tech labels, and the contact strip — confirmed via grep.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build succeeds end-to-end | `bun run build` | `5 page(s) built in 684ms` | PASS |
| `/resume` route generated | `test -f dist/resume/index.html` | exists | PASS |
| `/resume` carries no theme attribute | `grep -c 'data-theme' dist/resume/index.html` | `0` | PASS |
| `Matt Creenan` rendered | `grep -c 'Matt Creenan' dist/resume/index.html` | `2` (h1 + meta tags) | PASS |
| `id="download-pdf"` present in built HTML | `grep -c 'id="download-pdf"' dist/resume/index.html` | `1` | PASS |
| Click handler bundles `window.print()` | `grep -c 'window.print' dist/resume/index.html` | `1` | PASS |
| `@media print` block rendered with `.download-pdf{display:none}` | `grep -oE '@media print\{[^@]*' dist/resume/index.html` | `@media print{body{background:#fff}.page{box-shadow:none;margin:0;max-width:none;padding:36px 44px}.download-pdf{display:none}}` | PASS |
| `/work` has 2 anchors to `/resume` | `grep -c 'href="/resume"' dist/work/index.html` | `2` | PASS |
| Themed pages still carry `data-theme` (no regression) | `grep -c 'data-theme' dist/{about,work,contact,index}/index.html` | `2`, `2`, `2`, `2` | PASS |
| Self-hosted fonts referenced (no CDN) | `grep -c 'fonts.googleapis\|fonts.gstatic' dist/resume/index.html` | `0` | PASS |
| Self-hosted font URLs all four present | `grep -oE '/fonts/(merriweather\|jetbrains)[^"]+' dist/resume/index.html \| sort -u` | 4 unique paths | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| RES-01 | 06-01 | User can view a resume at `/resume` rendered as a standalone page — no `[data-theme]` switching, no themed chrome, no overlay integration | SATISFIED | Truth #1 verified; `dist/resume/index.html` exists with 0 `data-theme`, no themed components imported. |
| RES-02 | 06-01 | Resume content covers professional summary, current role, work history with dates, highlights, and skills | SATISFIED | All four jobs and six tech rows render verbatim from D-11 in built HTML. Summary paragraph present. |
| RES-03 | 06-01 | The "Resume" button on `/work` is enabled (no longer `disabled`) and links to `/resume` via plain navigation in both the retro and win95 variants | SATISFIED | Truth #2 verified; both blocks contain identical enabled `<a>` markup. |
| RES-04 | 06-02 | User can download a printable PDF version of the resume from `/resume` via a clearly visible action | SATISFIED (programmatic) — needs human end-to-end print test | Truth #4: Download PDF button is rendered, bundled click handler calls `window.print()`, button is hidden via `@media print` `.download-pdf { display: none }`. Final UX confirmation needs a real print dialog interaction. |

No orphaned requirements detected — all four RES-01..04 are claimed by phase 6 plans (RES-01..03 by 06-01, RES-04 by 06-02). REQUIREMENTS.md traceability table will need its `Status` column updated post-merge but the implementation evidence supports moving all four to a satisfied state.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| (none) | — | — | — | — |

Scan results:
- `src/pages/resume.astro`: 0 occurrences of TODO/FIXME/XXX/HACK/PLACEHOLDER/`coming soon`/`placeholder`/`will be here`/`not yet implemented`/`not available`.
- `src/pages/work.astro`: 0 occurrences of `disabled`, `cursor-not-allowed`, `opacity-60`, `Resume coming soon` (the previously-disabled stub markers were correctly removed).
- No `console.log`-only handlers, no empty `() => {}` handlers, no static empty arrays in render paths. The `jobs` and `techRows` arrays are populated with real verbatim resume content per D-11.

### Human Verification Required

5 items need human testing — see frontmatter `human_verification:` for full structured records. Summary:

#### 1. Visual fidelity to design handoff
**Test:** Load `/resume` and visually compare against `~/resume/design_handoff_resume/Resume.html` open in a second tab.
**Expected:** Pixel-faithful match — Merriweather body, JetBrains Mono meta, slate accent surfaces (`#c3cbd1`) on `.personal` and `.technical` ONLY, paper card with subtle shadow on warm cream background, 130px date/label gutters, 44%/1fr intro grid, 780px max-width.
**Why human:** Pixel-faithful design fidelity (D-10) is a visual judgement. Static analysis confirms tokens, layout values, and structural classes are present verbatim; final sign-off on color tones, spacing, and typographic rhythm needs eyes on the rendered page.

#### 2. Click "Download PDF" → save clean PDF
**Test:** On `/resume`, click the Download PDF button at top-right of `.intro`. In the resulting print dialog, set destination to "Save as PDF" and review the preview.
**Expected:** Print dialog opens. PDF preview shows the full resume WITHOUT the Download PDF button (hidden via `@media print`), with white body background, no `.page` box-shadow, no margin, padding `36px 44px`.
**Why human:** Print dialog and PDF generation cannot be programmatically verified without a headless browser. Static checks confirm the click handler calls `window.print()` and the `@media print` block hides the button — a human runs the dialog to confirm UX and saved PDF quality.

#### 3. `Cmd/Ctrl+P` from `/resume` produces clean printout
**Test:** Visit `/resume` and press `Cmd+P` (macOS) or `Ctrl+P` (Linux/Windows) without clicking the Download PDF button. Inspect the print preview.
**Expected:** Same clean print styling — no themed nav chrome, no Download PDF button visible, white body bg.
**Why human:** Print preview rendering is browser-side; static checks confirm `@media print` rules but visual confirmation requires the print dialog.

#### 4. Mobile (≤640px) — Download PDF button does not overlap `<h1>Matt Creenan`
**Test:** Open `/resume` and resize the viewport from 320px up to 640px wide. Watch the top-right button vs. the personal card heading.
**Expected:** Button stays clear of the name heading. The `.intro` grid collapses to single column with `gap: 16px`. The `.personal` card's own `padding: 22px 26px` should clear the absolutely-positioned button.
**Why human:** Plan 2 noted overlap could occur at 320px–375px and proposed a contingency (`padding-top: 32px` on `.intro` inside the mobile breakpoint). The contingency was NOT applied. Live viewport test at the smallest mobile widths is needed to confirm no overlap occurs in practice.

#### 5. Theme switching on `/about`, `/work`, `/contact` unaffected
**Test:** Visit `/work` (or `/about`, `/contact`), open the ThemeDialog (themes desktop icon), cycle between retro / win31 / win95 themes, refresh, navigate between pages. Confirm theme persists and renders correctly. On `/work`, click the Resume button in BOTH the retro and win95 variants and confirm `/resume` opens in a new tab.
**Expected:** Themes still cycle, persist across reloads via `localStorage 'theme'` key, and the Resume button on `/work` opens `/resume` in a new tab without invoking the overlay system.
**Why human:** Theme UI flow involves dialog interactions, localStorage persistence, and overlay behaviors. Static analysis confirms no theme-related files were modified outside the work.astro Resume button (which is bound to plain `<a>` navigation, NOT the overlay system — overlay only binds to `.pm-icon` and `.win95-icon` per `src/pages/index.astro`). Sign-off on the live UI flow is the final gate.

### Gaps Summary

No gaps detected. All five ROADMAP success criteria are programmatically verified via codebase evidence. All four requirements (RES-01..04) have implementation evidence that satisfies their intent. All artifacts exist, are substantive, are wired, and have real data flowing through them. No anti-patterns, stubs, or orphaned components found.

The phase enters `human_needed` status because:
- Goal achievement at the code level is confirmed
- Five UX-level confirmations remain (visual fidelity, click-to-print, Cmd+P print preview, mobile no-overlap at 320px–375px, themed-page regression sign-off)
- These cannot be verified without running the dev server, opening browsers, and clicking buttons

The captured screenshot at `/tmp/resume-screenshot.png` (1280x1800) provides preliminary evidence that name, tagline, contact strip, summary, four job entries, technical skills grid, and the Download PDF button all render at desktop width — but the five tests above still need explicit human sign-off.

---

*Verified: 2026-04-30T23:59:41Z*
*Verifier: Claude (gsd-verifier)*
