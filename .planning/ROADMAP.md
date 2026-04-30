# Roadmap: matt.creenan.me

## Milestones

- ✅ **v1.0 Yarn to Bun Migration** — Phase 1 (shipped 2026-03-22)
- ✅ **v2.0 Theme System** — Phases 2-5 (shipped 2026-04-05)
- 🚧 **v2.1 Resume** — Phase 6 (active, started 2026-04-30)

## Phases

<details>
<summary>✅ v1.0 Yarn to Bun Migration (Phase 1) — SHIPPED 2026-03-22</summary>

- [x] Phase 1: Migrate to Bun (1/1 plans) — completed 2026-03-22

</details>

<details>
<summary>✅ v2.0 Theme System (Phases 2-5) — SHIPPED 2026-04-05</summary>

- [x] Phase 2: CSS Foundation and Theme Infrastructure (3/3 plans) — completed 2026-03-22
- [x] Phase 3: Windows 3.1 Theme (2/2 plans) — completed 2026-04-04
- [x] Phase 4: Windows 95 Theme (2/2 plans) — completed 2026-04-04
- [x] Phase 5: Desktop Shell and Polish (2/2 plans) — completed 2026-04-05

See `.planning/milestones/v2.0-ROADMAP.md` for full details.

</details>

<details open>
<summary>🚧 v2.1 Resume (Phase 6) — ACTIVE</summary>

- [ ] Phase 6: Standalone Resume Page (0/2 plans)

</details>

## Active Phase Detail

### Phase 6: Standalone Resume Page

**Goal:** Add a standalone `/resume` page (outside the desktop-OS theme system) and wire up the disabled "Resume" button on `/work` to link to it. Provide a downloadable PDF version.

**Scope:** This phase covers the entire v2.1 milestone. The resume page is intentionally decoupled from the retro/win31/win95 theming framework — it lives as a clean, recruiter-friendly, print-ready document. The themed pages (`about`, `work`, `contact`) keep their existing theme behavior.

**Requirements covered:** RES-01, RES-02, RES-03, RES-04

**Plans:**

1. **Plan 1 — Resume page + button wiring**
   - Create `src/pages/resume.astro` as a standalone Astro page (no `[data-theme]` toggle, no themed chrome, no overlay integration)
   - Author resume content: professional summary, current role at Torch Coaching, work history with dates, highlights, skills
   - Apply minimal/clean print-friendly CSS (independent of `global.css` theme tokens) with appropriate `@media print` rules
   - Enable both Resume buttons in `src/pages/work.astro` (retro + win95 variants): remove `disabled`, drop the "Resume coming soon" tooltip, wrap as `<a href="/resume">` links
   - Verify navigation does **not** trigger the existing overlay system (overlay is bound to `.pm-icon, .win95-icon`; the work-page Resume button is neither, so it should navigate cleanly)
   - Covers: RES-01, RES-02, RES-03

2. **Plan 2 — PDF download**
   - Add a "Download PDF" action on `/resume`
   - Implementation choice: produce a static `public/resume.pdf` (committed) and link to it OR use the browser's `window.print()` with a print stylesheet — decide during planning
   - Ensure the action is visible on screen but hidden in print output
   - Covers: RES-04

**Success criteria:**

1. Visiting `/resume` shows a clean, standalone resume page with no theme-switching UI and no themed chrome
2. The "Resume" button on `/work` is no longer disabled and navigates to `/resume` from both retro and win95 variants
3. `/resume` is print-friendly: `Cmd/Ctrl+P` produces a clean single-purpose printout (no nav chrome, no theme leftovers)
4. A "Download PDF" affordance on `/resume` produces a downloadable PDF of the resume
5. Theme switching behavior on `about`/`work`/`contact` is unaffected by the changes

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Migrate to Bun | v1.0 | 1/1 | Complete | 2026-03-22 |
| 2. CSS Foundation and Theme Infrastructure | v2.0 | 3/3 | Complete | 2026-03-22 |
| 3. Windows 3.1 Theme | v2.0 | 2/2 | Complete | 2026-04-04 |
| 4. Windows 95 Theme | v2.0 | 2/2 | Complete | 2026-04-04 |
| 5. Desktop Shell and Polish | v2.0 | 2/2 | Complete | 2026-04-05 |
| 6. Standalone Resume Page | v2.1 | 0/2 | In Progress | — |
