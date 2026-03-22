# Roadmap: Yarn to Bun Migration

## Overview

A single-phase migration: replace Yarn with Bun as the package manager for the Astro site. The migration is complete when Bun installs dependencies, all commands work locally, and GitHub Pages deployment succeeds through the updated CI workflow.

## Phases

- [ ] **Phase 1: Migrate to Bun** - Replace Yarn with Bun across local tooling and CI, verify the build and deployment work

## Phase Details

### Phase 1: Migrate to Bun
**Goal**: Bun is the package manager everywhere Yarn was — locally and in CI — and the site builds and deploys without issues
**Depends on**: Nothing (first phase)
**Requirements**: PKG-01, PKG-02, PKG-03, CI-01, CI-02, VER-01, VER-02
**Success Criteria** (what must be TRUE):
  1. bun.lockb exists in the repository and yarn.lock does not
  2. `bun run dev`, `bun run build`, and `bun run preview` all work locally
  3. The GitHub Actions workflow installs dependencies and builds using Bun
  4. The site deploys successfully to GitHub Pages after a push
**Plans:** 1 plan

Plans:
- [x] 01-01-PLAN.md — Run Bun migration, verify local builds, deploy to GitHub Pages

## Progress

**Execution Order:**
Phases execute in numeric order: 1

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Migrate to Bun | 0/1 | Not started | - |
