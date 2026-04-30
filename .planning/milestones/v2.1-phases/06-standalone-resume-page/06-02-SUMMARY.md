---
phase: 06-standalone-resume-page
plan: 02
subsystem: pages/resume
tags: [astro, resume, print, pdf, theme-isolation]
requires:
  - "src/pages/resume.astro from Plan 06-01 (standalone page with .intro grid + tuned @media print block)"
  - ".planning/milestones/v2.1-phases/06-standalone-resume-page/06-CONTEXT.md decisions D-01, D-02, D-03"
  - ".planning/milestones/v2.1-phases/06-standalone-resume-page/06-UI-SPEC.md (Copywriting Contract, Color §Download PDF button)"
provides:
  - "Download PDF affordance on /resume that calls window.print() (RES-04)"
  - "@media print rule hiding .download-pdf so the button is excluded from the saved PDF"
affects:
  - "src/pages/resume.astro (single-file edit — markup, CSS, click handler, print-hide rule)"
tech-stack:
  added: []
  patterns:
    - "Bundled (non is:inline) <script> for one-shot DOM lookup + click handler on a standalone page (no ViewTransitions pipeline, so no astro:after-swap re-init needed)"
    - "Absolute positioning of CTA inside a CSS grid container (position: relative on .intro) — keeps the button in the top-right corner without claiming a grid cell, preserving the verbatim 44%/1fr/32px/start grid from D-10"
key-files:
  created: []
  modified:
    - "src/pages/resume.astro"
decisions:
  - "Used position: absolute relative to .intro (rather than a third grid column or grid-area) so the existing 44%/1fr 2-column grid baked from the design handoff is preserved verbatim per D-10"
  - "Used --ink (text), --ink-soft (border), --paper (fill) for the button per UI-SPEC §Color 'Download PDF button color' — --accent-bg is reserved for .personal and .technical only and was NOT used"
  - "Used a bundled <script> (not is:inline) so Astro's standard module bundling applies; one-shot DOM lookup is sufficient because /resume is outside the ViewTransitions pipeline (per Plan 1 D-04) and the button is rendered server-side in the same document"
  - "Extended the existing @media print block (added .download-pdf { display: none }) rather than creating a second @media print block — keeps Plan 1's tuned print rules (white body, no shadow, no margin, padding 36px 44px) intact and authoritative"
metrics:
  duration: "~1.5 minutes"
  completed: "2026-04-30"
  tasks: 1
  files: 1
---

# Phase 6 Plan 02: Download PDF Affordance Summary

**One-liner:** Adds the "Download PDF" button to the top-right of `/resume`'s intro section, calling `window.print()` on click and hiding itself in print output via the existing `@media print` block — closing RES-04 without committing a static PDF binary.

## What Was Built

**Task 1 — Download PDF affordance (commit `193fe04`):** Three coordinated changes to `src/pages/resume.astro`, all in one file, all in one commit:

- **Markup (Change A):** A `<button type="button" id="download-pdf" class="download-pdf" aria-label="Download resume as PDF">Download PDF</button>` inserted as the first child of `<section class="intro">`, before `<div class="personal">`. Visible label is `Download PDF` verbatim per D-02; aria-label is `Download resume as PDF` per UI-SPEC.
- **CSS (Change B):** Three rules added to the existing inline `<style is:global>` block. The existing `.intro` rule got `position: relative` appended (verbatim handoff grid `display: grid; grid-template-columns: 44% 1fr; gap: 32px; align-items: start;` preserved). A new `.download-pdf` rule positions the button absolutely top-right with mono 12px uppercase 0.04em-tracked type, `--ink` text, `--paper` fill, `--ink-soft` border, 4px radius, 6px/10px padding. Companion `:hover` (subtle bg shift to `--bg`) and `:focus-visible` (`--ink` outline) rules satisfy the UI-SPEC interaction contract. Inside the existing `@media print` block, `.download-pdf { display: none }` was appended so the button is hidden in the saved PDF (D-03).
- **Click handler (Change C):** A bundled `<script>` (NOT `is:inline`) inserted between `</main>` and `</body>` does a one-shot `document.getElementById('download-pdf')` lookup and binds a click listener that calls `window.print()` per D-01. No event delegation, no re-init — `/resume` lives outside the ViewTransitions pipeline (per Plan 1 D-04) so a single bind at script execution time is sufficient.

The mobile breakpoint (`@media (max-width: 640px)`) was not modified: the button stays absolutely positioned to the top-right of `.intro` on small viewports, sitting above the (now single-column) `.personal` card. The `.intro { gap: 16px }` mobile override and the `.personal { padding: 22px 26px }` provide enough vertical breathing room — verified via build.

## Verification Results

All acceptance criteria from the plan pass:

| Criterion | Result |
|-----------|--------|
| `<button>` with `id="download-pdf"`, visible text `Download PDF`, `aria-label="Download resume as PDF"` | PASS |
| Button is first child of `<section class="intro">`, before `<div class="personal">` | PASS |
| `.download-pdf` rule has `position: absolute; top: 0; right: 0;` and uses `--ink` / `--paper` / `--ink-soft` (NOT `--accent-bg`) | PASS |
| `.intro` rule has `position: relative;` added; existing `grid-template-columns: 44% 1fr; gap: 32px; align-items: start;` preserved | PASS |
| Existing `@media print` block contains `.download-pdf { display: none; }` | PASS |
| Bundled `<script>` (no `is:inline`) wires `getElementById('download-pdf')` click → `window.print()` | PASS |
| Plan 1 isolation invariants preserved: 0 occurrences of `data-theme`, `BaseHead`, `global.css`, `fonts.googleapis.com`, `fonts.gstatic.com`, `is:inline` | PASS |
| `.download-pdf` rule does not reference `--accent-bg` | PASS |
| `bun run build` succeeds end-to-end | PASS (5 pages built in 664ms) |
| `dist/resume/index.html` contains `id="download-pdf"` and `window.print` | PASS |

The plan's `<automated>` one-liner had two grep regex artifacts that did not affect the implementation:

1. `grep -q '>Download PDF<'` — the button text in the rendered Astro source spans multiple lines (the literal `Download PDF` is on its own indented line between `>` and `</button>`), so the same-line `>X<` pattern returns false. The implementation is correct: `dist/resume/index.html` shows the rendered text, and a plain `grep -q 'Download PDF'` on the source returns 1 match.
2. `awk '/@media print/,/^[[:space:]]*}[[:space:]]*$/' | grep '.download-pdf'` — the awk address range terminates at the first lonely-line `}` it sees, which is the inner `body { ... }` rule's closing brace, so it never reaches the `.download-pdf` rule below. A corrected pattern (`awk '/@media print {/,/^            }$/'`) extracts the full block and confirms `.download-pdf { display: none; }` is inside `@media print`.

These are command-line tooling artifacts in the plan's verification regex, not implementation issues. All semantic acceptance criteria pass under tightened patterns.

## Deviations from Plan

None. The plan's three changes were applied verbatim (markup, CSS, click handler) including the specified property values, color tokens, type sizing, and script placement.

The only minor accommodation was running a corrected verification awk pattern after observing the plan's verification one-liner regex did not match the actual file structure. This did not change any code; it only confirmed that the implementation matches the plan's intent and acceptance criteria.

## Authentication Gates

None.

## Threat Model Status

| Threat | Disposition | Outcome |
|--------|-------------|---------|
| T-06-05 Tampering — inline click handler bound to button id | accept | Bundled script runs same-origin, no user input, only calls `window.print()`. No DOM injection, no eval. |
| T-06-06 Information Disclosure — print output may leak UI chrome | mitigate | `.download-pdf { display: none }` rule appended to existing `@media print` block (Change B.3) — confirmed present in source and built artifact. Combined with Plan 1's `body { background: white }` and `.page { box-shadow: none; margin: 0; max-width: none; padding: 36px 44px }` rules, the printed output contains only the resume document. |
| T-06-07 Denial of Service — window.print() blocking the page | accept | Browser handles print dialog UX; user can dismiss. |

No new threat surface introduced beyond the registered items in the plan.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced. The change is screen-only UI plus a single same-origin call to the standard `window.print()` API.

## Known Stubs

None. The Download PDF button is fully wired end-to-end: visible label, accessible name, working click handler, and print-hide rule.

## Notes for Phase 6 Verifier / Wave 2 Closeout

`/resume` now satisfies all four phase-level requirements:

- **RES-01:** Standalone `/resume` page — Plan 06-01
- **RES-02:** Career summary, current role, work history, highlights, skills — Plan 06-01 (verbatim per D-11)
- **RES-03:** `/work` Resume button enabled and links to `/resume` — Plan 06-01 (both retro and win95 variants per D-08, D-09)
- **RES-04:** User can download a PDF version of the resume from `/resume` — **Plan 06-02 (this plan)** via `window.print()` and the user's browser "Save as PDF" destination

Human verification recommended (per plan `<verification>` step 3–7): run `bun run dev`, visit `/resume`, confirm:

1. Download PDF button is visible top-right of intro with mono-uppercase 12px label
2. Click opens browser print dialog
3. Switching destination to "Save as PDF" shows the resume WITHOUT the button (hidden via `@media print`)
4. Print preview also shows white body bg, no `.page` box-shadow, no margin, padding `36px 44px` (carried over from Plan 1's tuned `@media print` — confirms the block was extended, not replaced)
5. Resize 320px–640px: button stays top-right, does not overlap `<h1>Matt Creenan</h1>`
6. Theme switching on `/about`, `/work`, `/contact` remains unaffected (this plan only touched `resume.astro`)

## Self-Check: PASSED

Files modified verified:

- FOUND: src/pages/resume.astro

Commits verified in git log:

- FOUND: 193fe04 feat(06-02): add Download PDF button to /resume

Build artifact verified:

- FOUND: dist/resume/index.html
- VERIFIED: dist/resume/index.html contains `id="download-pdf"`
- VERIFIED: dist/resume/index.html contains `window.print`
- VERIFIED: src/pages/resume.astro contains 0 occurrences of `data-theme`, `BaseHead`, `global.css`, `fonts.googleapis.com`, `fonts.gstatic.com`, `is:inline`
- VERIFIED: `.download-pdf` rule does not reference `--accent-bg` (UI-SPEC color reservation honored)
