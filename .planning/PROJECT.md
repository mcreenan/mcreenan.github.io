# Yarn to Bun Migration

## What This Is

Migrate the personal site (matt.creenan.me) from Yarn to Bun as the package manager. The site is an Astro-based static site deployed to GitHub Pages. This is a tooling-only change — no application code changes.

## Core Value

Replace Yarn with Bun cleanly without breaking the build, dev server, or GitHub Pages deployment.

## Requirements

### Validated

- ✓ Astro static site builds and deploys correctly — existing
- ✓ Dev server runs locally — existing
- ✓ GitHub Pages deployment via GitHub Actions — existing

### Active

- [ ] Replace yarn.lock with bun.lockb
- [ ] Update CI workflow to use Bun instead of Yarn/Node
- [ ] Remove Yarn-specific artifacts
- [ ] Verify local dev, build, and preview commands work with Bun

### Out of Scope

- Application code changes — this is tooling only
- Switching away from Astro — framework stays the same
- Adding ESLint/Prettier/Biome — not currently used, not adding

## Context

- Astro site with Tailwind CSS, MDX, sitemap, and RSS integrations
- Deployed via `withastro/action@v2` GitHub Action (auto-detects package manager)
- No devDependencies or ESLint/Prettier config to migrate
- Simple dependency tree — 8 direct dependencies

## Constraints

- **Deployment**: Must continue deploying to GitHub Pages via GitHub Actions
- **Compatibility**: Bun must support all current Astro integrations
- **CI**: `withastro/action@v2` needs to detect Bun or be configured for it

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Bun as package manager only (not runtime) | Astro expects Node.js runtime; Bun as PM is drop-in | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-21 after initialization*
