# Phase 6: Standalone Resume Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-30
**Phase:** 6-standalone-resume-page
**Areas discussed:** PDF download approach, Page shell strategy, Font loading, Resume button transition

---

## PDF Download Approach

### Q1: How should the 'Download PDF' button work?

| Option | Description | Selected |
|--------|-------------|----------|
| `window.print()` (Recommended) | Trigger `window.print()`; design handoff already includes a tuned `@media print` stylesheet. User saves as PDF via browser. Zero binary to maintain — content edits ship automatically. | ✓ |
| Static `public/resume.pdf` | Generate a PDF once, commit to `public/`, link directly. Single-click download. Trade-off: regenerate on every content change; binary in git; hand-tuning to match screen design. | |
| Both — link to PDF, fallback to print | Static PDF as primary, secondary 'Print version' link. More options, more maintenance. | |

**User's choice:** `window.print()`

### Q2: How should the print/download button be labeled and placed?

| Option | Description | Selected |
|--------|-------------|----------|
| 'Download PDF' top-right of intro section | Matches RES-04 wording. Absolute/floated top-right of `.intro` so visible on first paint without disturbing centered name/tagline. Hidden in `@media print`. | ✓ |
| 'Print / Save as PDF' below contact strip | More honest about what window.print() does. Inline with contact links. | |
| Floating action button bottom-right | Small fixed button bottom-right. Less discoverable on initial load. | |

**User's choice:** 'Download PDF' top-right of intro section

---

## Page Shell Strategy

### Q1: How should /resume's HTML shell be structured?

| Option | Description | Selected |
|--------|-------------|----------|
| Fully standalone HTML (Recommended) | `resume.astro` outputs its own `<!doctype html>`, own `<head>`, own `<style>` block. No `BaseHead`, no `Layout.astro`, no `global.css`. Cleanest separation — no theme tokens leak in. | ✓ |
| Slim shared head + scoped styles | Extract a minimal ResumeHead component reusing BaseHead's canonical/OG logic, skip `global.css` and themed shell. Saves duplication but introduces a second 'head' abstraction. | |
| Reuse `Layout.astro` | Cheapest mechanically, but pulls in `global.css`, ViewTransitions, w95fa preloads, ThemeDialog, Taskbar — contradicts 'standalone, decoupled from theme system'. | |

**User's choice:** Fully standalone HTML

### Q2: Where should the resume CSS live?

| Option | Description | Selected |
|--------|-------------|----------|
| Inline `<style>` block in `resume.astro` (Recommended) | Matches the design handoff's structure. Truly self-contained. Total CSS ~120 lines. | ✓ |
| Separate `src/styles/resume.css` | Imported only by `resume.astro`. Slightly cleaner separation. Astro bundles it inline anyway for a single-page import. | |

**User's choice:** Inline `<style>` block in `resume.astro`

---

## Font Loading

### Q1: How should Merriweather + JetBrains Mono be loaded?

| Option | Description | Selected |
|--------|-------------|----------|
| Self-host WOFF2 in `/public/fonts/` (Recommended) | Download Merriweather (400, 700) + JetBrains Mono (400, 500) as WOFF2, declare with `@font-face` in inline styles. Matches existing project pattern (atkinson, w95fa, ms_sans_serif self-hosted). No external request. | ✓ |
| Google Fonts CDN as designed | Use the handoff's `<link href='fonts.googleapis.com/...'>`. Zero binary commits. Trade-off: external request on every load, possible FOUT, may not load when opened locally for print. | |

**User's choice:** Self-host WOFF2 in `/public/fonts/`

---

## Resume Button Transition

### Q1: How should the work.astro Resume buttons be re-styled when enabled?

| Option | Description | Selected |
|--------|-------------|----------|
| Plain enabled link, drop disabled affordances (Recommended) | Wrap as `<a href='/resume' class='button ...'>`. Drop `disabled`, `cursor-not-allowed`, `opacity-60`, `title='Resume coming soon'`. Existing `.button` hover styles apply. | ✓ |
| Plain link + cursor-pointer override | Same as above, but explicitly add `cursor-pointer` / hover state. Defensive against inherited button-default styles. | |
| Plain link + a 'New' or external-style indicator | Add a small visual cue (chevron icon, external-link border). Adds visual noise and a treatment that doesn't exist elsewhere on /work. | |

**User's choice:** Plain enabled link, drop disabled affordances

### Q2: Should /resume open in a new tab from /work, or navigate in place?

| Option | Description | Selected |
|--------|-------------|----------|
| Navigate in place (Recommended) | Plain `<a href='/resume'>`, no target. User can use back button. Consistent with rest of site. | |
| Open in new tab | `<a href='/resume' target='_blank' rel='noopener'>`. Resume stays separate from themed work-page context. Trade-off: spawns a tab the user has to close. | ✓ |

**User's choice:** Open in new tab — user override of recommendation. Captured as **D-09** in CONTEXT.md.

---

## Claude's Discretion

- **Content data structure (D-12):** User did not select an option here — Claude defaulted to inline `const`s in frontmatter + `.map()` iteration over `src/data/resume.ts`. Handoff guidance: "single component is fine too." This decision is reversible at planning time if the planner sees a stronger reason to extract data.

## Deferred Ideas

None — discussion stayed within phase scope. The "Out of Scope" list in REQUIREMENTS.md (themed resume, overlay integration, recruiter form, multiple variants, version history, JSON Resume tooling, cover letter) was not revisited.
