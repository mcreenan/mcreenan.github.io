# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Yarn to Bun Migration

**Shipped:** 2026-03-22
**Phases:** 1 | **Plans:** 1 | **Sessions:** 1

### What Was Built
- Bun as package manager replacing Yarn (bun.lock text format)
- GitHub Actions CI configured with explicit Bun support
- dist/ cleaned from git tracking

### What Worked
- Simple single-phase migration kept scope tight
- Human-verify checkpoint caught the CI issue early (withastro/action detection)
- Bun's drop-in compatibility meant zero application code changes

### What Was Inefficient
- Assumed withastro/action@v2 would auto-detect Bun — required a push-fail-fix cycle
- dist/ was tracked in git unnecessarily — caught during migration but could have been pre-identified

### Patterns Established
- Bun as package manager only (not runtime) for Astro projects
- Explicit `package-manager` config in withastro/action — don't rely on auto-detection

### Key Lessons
1. Always verify CI action documentation for package manager detection before assuming auto-detection works
2. Check for build artifacts in git tracking before starting tooling migrations

### Cost Observations
- Model mix: orchestrator on opus, executors/verifier on sonnet
- Sessions: 1
- Notable: Very lightweight migration — 2 tasks, ~15min execution

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 1 | 1 | Initial migration — established Bun tooling baseline |

### Top Lessons (Verified Across Milestones)

1. Verify CI action behavior empirically — documentation may not cover edge cases
