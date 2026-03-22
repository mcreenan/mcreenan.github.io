# Yarn to Bun Migration

## What This Is

Personal site (matt.creenan.me) — an Astro-based static site deployed to GitHub Pages. Now uses Bun as the package manager (migrated from Yarn in v1.0).

## Core Value

Replace Yarn with Bun cleanly without breaking the build, dev server, or GitHub Pages deployment.

## Requirements

### Validated

- ✓ Replace yarn.lock with bun.lock — v1.0
- ✓ Update CI workflow to use Bun instead of Yarn/Node — v1.0
- ✓ Remove Yarn-specific artifacts — v1.0
- ✓ Verify local dev, build, and preview commands work with Bun — v1.0
- ✓ Astro static site builds and deploys correctly — existing
- ✓ Dev server runs locally — existing
- ✓ GitHub Pages deployment via GitHub Actions — existing

### Active

(None — migration complete)

### Out of Scope

- Application code changes — this is tooling only
- Switching away from Astro — framework stays the same
- Adding ESLint/Prettier/Biome — not currently used, not adding
- Using Bun as runtime (replacing Node.js) — Astro expects Node.js runtime

## Context

Shipped v1.0 with Bun as package manager. Tech stack: Astro 4.16.8, Tailwind CSS, MDX, TypeScript. Deployed via `withastro/action@v2` with explicit `package-manager: bun@latest`. Simple dependency tree — 8 direct dependencies. `dist/` excluded from git tracking.

## Constraints

- **Deployment**: GitHub Pages via GitHub Actions
- **Compatibility**: Bun supports all current Astro integrations
- **CI**: `withastro/action@v2` configured with `package-manager: bun@latest`

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Bun as package manager only (not runtime) | Astro expects Node.js runtime; Bun as PM is drop-in | ✓ Good |
| bun.lock text format (not binary bun.lockb) | Bun 1.3.9 default, both formats work with withastro/action | ✓ Good |
| Explicit package-manager config in deploy.yml | withastro/action@v2 does NOT auto-detect Bun from lockfile | ✓ Good — required for CI |
| No bunfig.toml | Bun defaults work correctly for this project | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-03-22 after v1.0 milestone*
