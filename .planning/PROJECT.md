# matt.creenan.me

## What This Is

Personal site (matt.creenan.me) — an Astro-based static site deployed to GitHub Pages with a retro desktop OS aesthetic. Features a switchable theme system with three themes: the current retro desktop, Windows 3.1, and Windows 95. Each theme provides authentic OS chrome, and the Windows themes present sections as clickable desktop apps that open in themed windows.

## Core Value

A theme-switchable personal site where each theme authentically recreates its target OS aesthetic, with sections presented as native-feeling apps within each theme's window chrome.

## Current Milestone: v2.0 Theme System

**Goal:** Add a switchable theme system with three authentic OS themes

**Target features:**
- Theme switcher accessible from all pages
- Windows 3.1 theme with period-accurate chrome and app metaphor
- Windows 95 theme with period-accurate chrome and app metaphor
- Refactored page structure to support theme-driven layouts

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

- [x] Theme switcher UI accessible from all pages — Validated in Phase 02
- [x] Current theme preserved as default option — Validated in Phase 02
- [ ] Windows 3.1 theme with authentic chrome and app metaphor
- [ ] Windows 95 theme with authentic chrome and app metaphor
- [ ] Refactored page/component structure to support theme-driven layouts

### Out of Scope

- Switching away from Astro — framework stays the same
- Adding ESLint/Prettier/Biome — not currently used, not adding
- Using Bun as runtime (replacing Node.js) — Astro expects Node.js runtime
- Mobile-native theme variants — responsive but not separate mobile themes
- Theme persistence across sessions — implemented in Phase 02 (localStorage + anti-flash)

## Context

Shipped v1.0 with Bun as package manager. Tech stack: Astro 4.16.8, Tailwind CSS, MDX, TypeScript. Deployed via `withastro/action@v2` with explicit `package-manager: bun@latest`. Simple dependency tree — 8 direct dependencies. `dist/` excluded from git tracking.

Current site has a retro desktop OS aesthetic with Window components, Button components, and a teal background with pixel grid pattern. The existing design already uses window chrome concepts (title bars, content areas) which will serve as the foundation for the theme system.

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
*Last updated: 2026-03-21 after Phase 02 completion — CSS token foundation and theme switcher UI*
