---
phase: 06-standalone-resume-page
plan: 01
subsystem: pages/resume
tags: [astro, resume, fonts, theme-isolation]
requires:
  - "src/pages/work.astro (existing two Resume button placeholders)"
  - "public/fonts/ self-hosting convention (existing pattern)"
  - "Astro.site / Astro.url.pathname for canonical URL"
provides:
  - "/resume route as a fully standalone HTML document outside the theme system"
  - "Self-hosted Merriweather (400, 700) and JetBrains Mono (400, 500) WOFF2 fonts"
  - "Enabled Resume buttons on /work in both retro-win31 and win95 blocks linking to /resume in a new tab"
affects:
  - "src/pages/work.astro (Resume buttons in two theme blocks)"
tech-stack:
  added:
    - "Self-hosted Merriweather + JetBrains Mono WOFF2 fonts (sourced from Google Fonts gstatic CDN, served locally)"
  patterns:
    - "Astro page with own <!doctype html>, manual <head>, inline <style is:global>"
    - "Frontmatter const data + .map() iteration in template (D-12)"
    - "set:html for non-breaking space entity preservation in tech labels (D-11)"
key-files:
  created:
    - "src/pages/resume.astro"
    - "public/fonts/merriweather-regular.woff2"
    - "public/fonts/merriweather-bold.woff2"
    - "public/fonts/jetbrains-mono-regular.woff2"
    - "public/fonts/jetbrains-mono-medium.woff2"
  modified:
    - "src/pages/work.astro (Resume buttons enabled in both theme blocks)"
decisions:
  - "Used Google Fonts gstatic latin-subset URLs as the source for the four WOFF2 files (variable-axis files are reused for both weights of each family — a single physical file per family carries both 400/700 (Merriweather) or 400/500 (JetBrains Mono); the @font-face declarations select the appropriate weight at use time)"
  - "Used <style is:global> on the inline <style> block so Astro does not transform the resume page's CSS with scoping classes — keeps the page truly self-contained per D-05"
metrics:
  duration: "~3.6 minutes"
  completed: "2026-04-30"
  tasks: 3
  files: 6
---

# Phase 6 Plan 01: Standalone Resume Page Summary

**One-liner:** Standalone `/resume` page recreating the locked design handoff pixel-faithfully, self-hosted Merriweather + JetBrains Mono fonts, and both `/work` Resume buttons converted from disabled placeholders to live anchors targeting `/resume` in a new tab.

## What Was Built

**Task 1 — Self-hosted fonts (commit `21671a1`):** Added four WOFF2 files to `public/fonts/` for Merriweather (400, 700) and JetBrains Mono (400, 500), sourced from the Google Fonts gstatic latin-subset URLs. The variable font files served by Google Fonts contain multiple weight axes; the same physical bytes back both 400/700 (Merriweather) and 400/500 (JetBrains Mono), and the `@font-face` declarations in `resume.astro` pin which weight is presented to the browser. All four files verified as `Web Open Font Format (Version 2), TrueType`.

**Task 2 — Standalone `/resume` page (commit `2cd85ad`):** Created `src/pages/resume.astro` as a fully standalone Astro page that emits its own `<!doctype html>`, manual `<head>` (charset, viewport, title, description, canonical URL via `Astro.site` + `Astro.url.pathname`, Open Graph + Twitter card tags), and an inline `<style is:global>` block with the four `@font-face` declarations followed by the verbatim CSS from `~/resume/design_handoff_resume/Resume.html` lines 11–188. Resume body copy is rendered verbatim per D-11, with the `jobs` and `techRows` arrays defined as frontmatter `const`s and iterated via `.map()` per D-12. Non-breaking space entities in `Operating Systems` and `Data Engineering` labels are preserved via `set:html`. The page does NOT import `BaseHead`, `Layout`, `global.css`, `ViewTransitions`, `ThemeDialog`, `Taskbar`, `HomeIcon`, or `ThemesIcon`; does NOT carry `[data-theme]` on `<html>`; uses no Tailwind utility classes; references no Google Fonts CDN URL. Theme isolation contract from `06-UI-SPEC.md` is satisfied.

**Task 3 — Enable `/work` Resume buttons (commit `83db7ca`):** Replaced the disabled `<button>` placeholders with enabled `<a href="/resume" target="_blank" rel="noopener" aria-label="Open resume in a new tab">` anchors in both the `.retro-win31-window` and `.win95-window` blocks of `src/pages/work.astro`. Dropped `disabled`, `cursor-not-allowed`, `opacity-60`, and `title="Resume coming soon"`; preserved `<div class="relative">` wrappers, FontAwesome `fa-file-lines` icon, and the `Resume` label.

## Verification Results

All `<automated>` checks from the plan passed:

| Task | Verification | Result |
|------|--------------|--------|
| 1 | Four WOFF2 files exist, all report `Web Open Font Format (Version 2)` | PASS |
| 2 | resume.astro contains `<!doctype html>`, `<html lang="en">`, no theme imports, no CDN refs, all four `@font-face` blocks, locked CSS tokens, locked layout values, all required body strings; `bun run build` produces `dist/resume/index.html` with 0 occurrences of `data-theme` | PASS |
| 3 | work.astro has 0 occurrences of `disabled`, `cursor-not-allowed`, `opacity-60`, `Resume coming soon`; exactly 2 occurrences of `href="/resume"`, `aria-label="Open resume in a new tab"`, `<span>Resume</span>`; ≥2 of `target="_blank"`, `rel="noopener"`; `bun run build` succeeds | PASS |

**Overall plan verification:**
- `bun run build` succeeds end-to-end (`5 page(s) built in 686ms`)
- `dist/resume/index.html` exists, contains `Matt Creenan`, has 0 occurrences of `data-theme`
- `dist/work/index.html` contains `href="/resume"` for both theme variants
- No Google Fonts CDN references anywhere in the source tree

## Deviations from Plan

**1. `<style is:global>` on the inline style block.** The plan specified `<style>` without an attribute. By default, Astro scopes component styles by appending hashed class names to selectors. For a standalone page this would still render correctly (the class hashes are applied to the elements in the same file), but the rendered HTML would carry Astro-injected scope attributes that aren't part of the design handoff. Adding `is:global` keeps the rendered CSS byte-identical to the handoff and keeps the page literally self-contained per D-05's intent ("makes 'no theme tokens leak in' verifiable by reading one file"). This is a Rule 3 fix (alignment with the documented theme-isolation contract). No automated verification check was affected.

**2. Variable-axis font files reused across weights.** Google Fonts now serves Merriweather and JetBrains Mono as variable fonts. The same physical WOFF2 file backs `merriweather-regular.woff2` and `merriweather-bold.woff2` (and similarly for JetBrains Mono regular/medium). Each `@font-face` declaration selects the corresponding weight axis at use time, so the visual contract — Merriweather 400/700, JetBrains Mono 400/500 — is honored. This is implementation-equivalent to four distinct static-weight files and does not change the source, the API, or any verification check, but it's worth noting for anyone inspecting the file sizes (the two Merriweather files are 97 548 bytes each; the two JetBrains Mono files are 31 432 bytes each).

## Authentication Gates

None.

## Threat Model Status

| Threat | Disposition | Outcome |
|--------|-------------|---------|
| T-06-01 Tampering of font files | accept | Files committed to repo; integrity guaranteed by git history |
| T-06-02 `target="_blank"` opener access | mitigate | `rel="noopener"` added to both `/work` anchors per D-09 |
| T-06-03 Tampering via inline style/copy | accept | Static, build-time only |
| T-06-04 Personal contact info disclosure | accept | Intended behavior per RES-02 |

No new threat surface introduced beyond the registered items.

## Known Stubs

None. The page renders complete content end-to-end. The `Download PDF` CTA is intentionally deferred to Plan 06-02 per the plan's `<objective>` ("everything except the explicit 'Download PDF' CTA").

## Notes for Plan 06-02

The standalone resume page is fully wired and ready to receive a `Download PDF` button. Plan 02 will add a screen-only button in the top-right of `.intro` that calls `window.print()`, hidden in `@media print` per D-01–D-03. The existing `@media print` block in resume.astro already drops the box-shadow, recovers margin, and switches the body background to white, so the printout will be clean as soon as the button can be hidden.

## Self-Check: PASSED

Files created/modified verified:

- FOUND: src/pages/resume.astro
- FOUND: public/fonts/merriweather-regular.woff2
- FOUND: public/fonts/merriweather-bold.woff2
- FOUND: public/fonts/jetbrains-mono-regular.woff2
- FOUND: public/fonts/jetbrains-mono-medium.woff2
- FOUND: src/pages/work.astro (modified)

Commits verified in git log:

- FOUND: 21671a1 feat(06-01): self-host Merriweather and JetBrains Mono WOFF2 fonts
- FOUND: 2cd85ad feat(06-01): add standalone /resume page
- FOUND: 83db7ca feat(06-01): enable Resume buttons on /work, link to /resume

Build artifact verified:

- FOUND: dist/resume/index.html
- VERIFIED: dist/resume/index.html contains 0 occurrences of `data-theme`
- VERIFIED: dist/resume/index.html contains "Matt Creenan"
- VERIFIED: dist/work/index.html contains `href="/resume"`
