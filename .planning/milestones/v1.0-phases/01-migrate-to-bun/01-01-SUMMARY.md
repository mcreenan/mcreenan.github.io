---
phase: 01-migrate-to-bun
plan: 01
subsystem: infra
tags: [bun, package-manager, astro, migration]

# Dependency graph
requires: []
provides:
  - "Bun lockfile (bun.lock) replacing yarn.lock"
  - "Updated CLAUDE.md with bun references"
  - "Verified local build, dev, and preview commands"
  - "GitHub Pages deployment via Bun-based CI pipeline"
affects: []

# Tech tracking
tech-stack:
  added: [bun]
  patterns: [bun-as-package-manager-only]

key-files:
  created: [bun.lock]
  modified: [CLAUDE.md, .github/workflows/deploy.yml, .gitignore]

key-decisions:
  - "Used bun.lock (text format) instead of bun.lockb (binary) -- Bun 1.3.9 generates text lockfile by default, withastro/action@v2 detects both"
  - "withastro/action@v2 does NOT auto-detect bun from lockfile -- required explicit package-manager: bun@latest in deploy.yml"
  - "No bunfig.toml needed -- defaults work correctly"

patterns-established:
  - "Bun as package manager only (not runtime) -- Astro uses Node.js runtime"

requirements-completed: [PKG-01, PKG-02, PKG-03, CI-01, CI-02, VER-01, VER-02]

# Metrics
duration: ~15min (across two sessions with human-verify checkpoint)
completed: 2026-03-22
---

# Phase 01 Plan 01: Migrate to Bun Summary

**Replaced yarn.lock with bun.lock, verified all Astro build/dev/preview commands work via Bun, configured CI for Bun, and confirmed GitHub Pages deployment**

## Performance

- **Duration:** ~15 min (across two sessions with human-verify checkpoint)
- **Started:** 2026-03-22T01:21:11Z
- **Completed:** 2026-03-22
- **Tasks:** 2 of 2
- **Files modified:** 4 (bun.lock, yarn.lock deleted, CLAUDE.md, .github/workflows/deploy.yml)

## Accomplishments

- Migrated from Yarn to Bun as package manager (bun.lock text format)
- Verified bun run build, bun run dev, and bun run preview all work correctly
- Updated all CLAUDE.md references from yarn to bun
- Configured withastro/action@v2 with explicit `package-manager: bun@latest`
- Confirmed GitHub Pages deployment succeeds with Bun-based CI pipeline
- Site verified live at https://matt.creenan.me with all pages working

## Task Commits

Each task was committed atomically:

1. **Task 1: Run Bun migration and verify local builds** - `96bdc47` (chore)
2. **Task 2: Commit, push, and verify GitHub Pages deployment** - human-verify checkpoint
   - Additional commits: `0729448` (add dist/ to .gitignore), `c05ee87` (fix CI deploy.yml)

## Files Created/Modified

- `bun.lock` - Bun text-format lockfile replacing yarn.lock
- `yarn.lock` - Deleted
- `CLAUDE.md` - Updated all yarn references to bun equivalents
- `.github/workflows/deploy.yml` - Added `package-manager: bun@latest` to withastro/action config
- `.gitignore` - Added dist/ directory

## Decisions Made

- **bun.lock (text) vs bun.lockb (binary):** Bun 1.3.9 generates text-format bun.lock by default. Both formats are detected by withastro/action@v2, so no issue.
- **Explicit package-manager config required:** withastro/action@v2 does NOT auto-detect bun from lockfile presence. Required adding `package-manager: bun@latest` to deploy.yml. This contradicts the original plan assumption (D-01/D-02) but was necessary for CI to work.
- **No bunfig.toml:** Bun defaults work correctly for this project.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] withastro/action@v2 does not auto-detect Bun**
- **Found during:** Task 2 (CI deployment)
- **Issue:** The plan assumed withastro/action@v2 would auto-detect Bun from bun.lock presence (decisions D-01, D-02). In practice, the action defaulted to another package manager.
- **Fix:** Added `package-manager: bun@latest` to the withastro/action step in `.github/workflows/deploy.yml`
- **Files modified:** `.github/workflows/deploy.yml`
- **Commit:** `c05ee87`

**2. [Rule 3 - Blocking] dist/ directory tracked in git**
- **Found during:** Task 1 execution
- **Issue:** The dist/ build output directory was being tracked by git
- **Fix:** Added dist/ to .gitignore and removed from tracking
- **Files modified:** `.gitignore`
- **Commit:** `0729448`

## Known Stubs

None - this was a tooling-only migration with no application code changes.

## Next Phase Readiness

Migration fully complete. All requirements satisfied (PKG-01 through VER-02). No further phases planned.

## Self-Check: PASSED

- FOUND: bun.lock
- CONFIRMED: yarn.lock deleted
- FOUND: commit 96bdc47 (Task 1)
- FOUND: commit c05ee87 (CI fix)
- FOUND: commit 0729448 (gitignore fix)

---
*Phase: 01-migrate-to-bun*
*Completed: 2026-03-22*
