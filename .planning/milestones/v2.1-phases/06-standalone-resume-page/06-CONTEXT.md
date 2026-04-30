# Phase 6: Standalone Resume Page - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Ship a standalone `/resume` page (outside the desktop-OS theme system) that recreates the design supplied in `~/resume/design_handoff_resume/` pixel-faithfully, replace the disabled "Resume coming soon" buttons on `/work` (retro + win95 variants) with real links to `/resume`, and provide a print-to-PDF action on the resume page itself.

The resume page is intentionally decoupled from `[data-theme]` switching, the overlay system, themed chrome (window/titlebar), `Taskbar`, `ThemeDialog`, and the theme tokens in `src/styles/global.css`. It is a clean, recruiter-friendly, print-ready document.

</domain>

<decisions>
## Implementation Decisions

### PDF Download
- **D-01:** Use `window.print()` for the PDF action — leverages the design handoff's already-tuned `@media print` stylesheet (no shadow, no margin, padding `48px 56px`). No static PDF binary committed; content edits ship automatically without regeneration.
- **D-02:** Button label is **"Download PDF"** (matches RES-04 wording).
- **D-03:** Button is positioned **top-right of the `.intro` section** so it's visible on first paint without disturbing the centered name/tagline. Hidden in `@media print` so it does not appear in the printout.

### Page Shell
- **D-04:** `src/pages/resume.astro` is a **fully standalone HTML document** — outputs its own `<!doctype html>`, own `<head>`, own `<style>` block. **Does not** import `BaseHead.astro`, `Layout.astro`, or `src/styles/global.css`. **Does not** include `ViewTransitions`, `ThemeDialog`, `Taskbar`, the home/themes desktop icons, or any `[data-theme]` attribute on `<html>`.
- **D-05:** Resume CSS lives **inline in a `<style>` block** inside `resume.astro` — matches the design handoff's structure exactly, keeps the page self-contained, makes "no theme tokens leak in" verifiable by reading one file.
- **D-06:** Manually wire the minimum head metadata the page needs: `<meta charset>`, `<meta viewport>`, `<title>`, `<meta name="description">`, canonical URL via `Astro.site` + `Astro.url.pathname`, and basic Open Graph + Twitter card tags. Do not extract a shared component for this — the duplication is bounded and intentional (keeps the standalone page truly standalone).

### Font Loading
- **D-07:** **Self-host** Merriweather (400, 700) and JetBrains Mono (400, 500) as WOFF2 in `public/fonts/`. Declare via `@font-face` inside `resume.astro`'s inline `<style>`. **Do not** use the Google Fonts CDN link from the handoff. Reasons: matches the existing project pattern (atkinson, w95fa, ms_sans_serif are all self-hosted), no external request on each load, prints reliably even when offline, no CDN-related FOUT.

### Resume Button on /work (retro + win95)
- **D-08:** In **both** `.retro-win31-window` and `.win95-window` blocks of `src/pages/work.astro`, replace the `<button disabled ...>` with `<a href="/resume" target="_blank" rel="noopener" class="button flex flex-col justify-between py-2 flex-shrink-0">…</a>`. Drop the `disabled` attribute, the `cursor-not-allowed` and `opacity-60` classes, and the `title="Resume coming soon"` tooltip. Keep the existing `.button` styling and the `<i class="fa-solid fa-file-lines text-4xl">` + `<span>Resume</span>` children unchanged.
- **D-09:** **Open `/resume` in a new tab** (`target="_blank" rel="noopener"`). Rationale: keeps the resume separate from the themed `/work` context — the user is viewing a different kind of artifact, and they don't lose their place on the themed page. Applies to both retro and win95 variants.

### Design Fidelity
- **D-10:** Recreate the design from `~/resume/design_handoff_resume/Resume Skeleton.html` **pixel-faithfully**. Tokens (colors, type, spacing), section structure (intro → experience → technical separated by 1px `--rule` borders), 2-column grids (`130px 1fr` for `.job` and `.tech-grid`), and the ≤640px single-column collapse are all locked. Do not invent new spacing or color decisions.
- **D-11:** Resume content is preserved **verbatim** from the handoff HTML's body — name, tagline, contact strip, summary, all four jobs (Delaware North Manager 2019–Present; Delaware North Senior 2014–2019; LocalNet/CoreComm/Exhibio 2013–2014; Synacor 2006–2012), and all six tech rows (Languages, Operating Systems, Cloud / AWS, Databases, Provisioning, Data Engineering).

### Content / Data Structure
- **D-12 (Claude's discretion):** Define resume data (jobs array, tech rows array) as `const`s in `resume.astro`'s frontmatter and iterate with `.map()` in the template. Single-file approach matches the handoff's "single component is fine too" guidance and keeps everything in one reviewable place. Do not extract into `src/data/resume.ts` — adds an indirection without proportional value at this scope.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design (locked, pixel-faithful)
- `~/resume/design_handoff_resume/README.md` — full design spec: tokens, type scale, layout, spacing, print rules, content list, suggested implementation notes
- `~/resume/design_handoff_resume/Resume Skeleton.html` — the canonical HTML/CSS reference; recreate this in the codebase. Contains verbatim resume content.

### Project planning
- `.planning/REQUIREMENTS.md` — RES-01 through RES-04, plus the explicit "Out of Scope" list (no theming `/resume`, no overlay integration, no recruiter form, no multiple variants, no version history, no JSON Resume tooling, no cover letter)
- `.planning/ROADMAP.md` §"Phase 6: Standalone Resume Page" — goal, scope, plan breakdown, success criteria
- `.planning/STATE.md` §"Research Flags / v2.1 (Resume)" — explicit reminders that `/resume` is standalone, not in `TITLE_MAP`, and likely needs its own minimal layout/CSS

### Code touch points
- `src/pages/work.astro` — both `.retro-win31-window` (lines ~42–52) and `.win95-window` (lines ~133–144) blocks contain the disabled Resume button; both need to be updated identically per D-08/D-09
- `src/pages/index.astro` — referenced only to confirm `/resume` is **not** added to `TITLE_MAP` (overlay system is for themed pages only)
- `src/components/BaseHead.astro` — used as a reference for canonical-URL pattern (`new URL(Astro.url.pathname, Astro.site)`) when wiring the standalone page's head, **not** imported by `resume.astro`
- `src/layouts/Layout.astro` — explicitly **not** used by `resume.astro` (it pulls in `BaseHead`, `ThemeDialog`, `Taskbar`, sets `data-theme="retro"`, all of which violate D-04)

### Existing self-host font pattern (for D-07)
- `public/fonts/` — destination for `merriweather-{regular,bold}.woff2` and `jetbrains-mono-{regular,medium}.woff2`. Existing files there: `atkinson-regular.woff`, `atkinson-bold.woff`, `w95fa.woff2`, `ms_sans_serif.woff2`, `ms_sans_serif_bold.woff2`
- `src/components/BaseHead.astro` lines ~40–75 — `<link rel="preload" as="font" type="font/woff2" crossorigin>` pattern. `resume.astro` may use `@font-face` inline rather than `<link rel="preload">` — both are acceptable; preload is unnecessary for this single-page bundle

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`Astro.site` + `Astro.url.pathname`** for canonical URL — same pattern used in `BaseHead.astro` line 10
- **Existing `.button` class in `global.css`** — *not* reused by `/resume` (page is unstyled by `global.css`), but *is* reused by the work.astro Resume buttons after the disabled attributes are dropped (D-08)
- **FontAwesome CDN** loaded via `BaseHead.astro` — relevant for `/work`'s `fa-file-lines` icon; **not loaded** on `/resume` (no FA usage)

### Established Patterns
- **Self-host fonts in `public/fonts/`** — supports D-07 (Merriweather + JetBrains Mono)
- **Astro frontmatter `const` data + template iteration** — standard idiom in this codebase, supports D-12
- **Inline `<style>` blocks scoped to `.astro` components** — supports D-05; per `Layout.astro` precedent, scoped styles work as expected for a single-file page

### Integration Points
- **`/work` → `/resume`**: plain anchor with `target="_blank"`. Overlay system is bound to `.pm-icon` and `.win95-icon` selectors only; the work-page Resume button is neither, so it bypasses overlays cleanly without code changes (per ROADMAP success criterion #5).
- **GitHub Pages routing**: Astro generates `dist/resume/index.html` for `src/pages/resume.astro`; no special CI/CD changes needed.
- **No interaction with `ViewTransitions`**: standalone page lives outside the swap pipeline. Navigating from `/work` to `/resume` triggers a full page load (further reinforced by `target="_blank"` in D-09).

</code_context>

<specifics>
## Specific Ideas

- "Recreate this design pixel-faithfully" — verbatim language from the handoff README. No design improvisation.
- "Don't add a framework component library" — explicit handoff guidance for static-site projects (Astro). Keep it to one Astro file with inline styles.
- "Keep the data (jobs array, tech rows array) separate from the markup" — handoff suggestion. Implemented via D-12 (frontmatter `const`s + template `.map()`), which counts as "data separate from markup" inside one file.
- "Test print preview before shipping" — handoff requirement. Verification should include opening DevTools print preview and confirming the printout: no shadow, no warm-grey body background, padding `48px 56px`, fonts intact, "Download PDF" button hidden.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. The "Out of Scope" list in REQUIREMENTS.md (themed resume, overlay integration, recruiter form, multiple variants, version history, JSON Resume tooling, cover letter) is already documented and not revisited here.

</deferred>

---

*Phase: 6-standalone-resume-page*
*Context gathered: 2026-04-30*
