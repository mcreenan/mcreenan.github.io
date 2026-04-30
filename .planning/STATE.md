---
gsd_state_version: 1.0
milestone: v2.1
milestone_name: Resume
status: planning
stopped_at: null
last_updated: "2026-04-30T00:00:00.000Z"
progress:
  total_phases: 1
  completed_phases: 0
  total_plans: 2
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-30)

**Core value:** A theme-switchable personal site where each theme authentically recreates its target OS aesthetic.
**Current focus:** Milestone v2.1 — adding a working resume across all three themes.

## Current Position

Phase: 6 — Standalone Resume Page (not started)
Plan: —
Status: Ready to plan Phase 6
Last activity: 2026-04-30 — Roadmap approved for milestone v2.1

## Performance Metrics

**Velocity:**

- Total plans completed: 9 (across v1.0 + v2.0)
- Average duration: —
- Total execution time: —

**By Phase (historical):**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 1 | - | - |
| 02 | 3 | - | - |
| 03 | 2 | - | - |
| 04 | 2 | - | - |
| 05 | 2 | - | - |

*Updated after each plan completion*

## Accumulated Context

### Decisions

- Resolved: Use Bun as package manager only (not runtime) — Astro expects Node.js runtime; Bun as PM is drop-in
- [Phase 01]: Used bun.lock text format (Bun 1.3.9 default)
- [Phase 01]: withastro/action@v2 requires explicit package-manager: bun@latest config
- [Phase 02]: Scoped .window under [data-theme='retro'] to prevent Phase 4 collision with 98.css
- [Phase 02]: @keyframes borderGradient kept hardcoded (retro-only per D-09)
- [Phase 02]: Two separate scripts in BaseHead.astro: is:inline for anti-flash (synchronous), bundled for astro:after-swap (deferred/deduplicated)
- [Phase 02]: ThemeDialog uses native dialog.showModal() for accessible modal with focus trap and Escape-to-close
- [Phase 02]: openThemeDialog() exposed as window global to decouple trigger from dialog component
- [Phase 02]: ThemesIcon uses button not anchor — dialog trigger is not navigation
- [Phase 03]: W95FA font sourced from verkcuos/w95fa GitHub repo, OTF converted to WOFF via fonttools
- [Phase 03]: Window.astro variant prop pattern: components accept variant='retro'|'win31' for structurally different markup

### Research Flags

- v2.1 (Resume): `/resume` is **standalone** — explicitly outside the theme system. Do NOT add it to the overlay TITLE_MAP in index.astro, do NOT add `[data-theme]` chrome variants
- v2.1 (Resume): Disabled Resume button exists in both retro and win95 variants of work.astro — both need to be enabled and link plainly to `/resume` (no overlay handling)
- v2.1 (Resume): `/resume` will likely need its own minimal layout/CSS independent of the theme tokens in global.css

### Pending Todos

None.

### Blockers/Concerns

None.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260405-cvh | Scale Win 3.1 and Win 95 themes 1.5x for retina/high-DPI | 2026-04-05 | 7c09045 | [260405-cvh-scale-win-3-1-and-win-95-theme-pixel-val](./quick/260405-cvh-scale-win-3-1-and-win-95-theme-pixel-val/) |

## Session Continuity

Last session: 2026-04-30
Stopped at: Milestone v2.1 initialized
Resume file: None
