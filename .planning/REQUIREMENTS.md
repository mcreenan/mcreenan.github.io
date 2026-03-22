# Requirements: Yarn to Bun Migration

**Defined:** 2026-03-21
**Core Value:** Replace Yarn with Bun cleanly without breaking the build, dev server, or GitHub Pages deployment.

## v1 Requirements

### Package Manager Migration

- [ ] **PKG-01**: Replace yarn.lock with bun.lockb by running `bun install`
- [ ] **PKG-02**: Remove yarn.lock from the repository
- [ ] **PKG-03**: All existing npm scripts (dev, start, build, preview, astro) work via `bun run`

### CI/CD

- [ ] **CI-01**: GitHub Actions workflow uses Bun instead of Yarn/Node for install and build
- [ ] **CI-02**: Site deploys successfully to GitHub Pages after migration

### Verification

- [ ] **VER-01**: Local dev server starts and serves pages correctly
- [ ] **VER-02**: Production build completes without errors

## v2 Requirements

(None — this is a one-time migration)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Using Bun as runtime (replacing Node.js) | Astro expects Node.js runtime; Bun as PM only |
| Adding linting/formatting tools | Not currently used, separate concern |
| Upgrading Astro or dependencies | Separate task from PM migration |
| Switching away from Astro | Framework stays the same |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PKG-01 | Phase 1 | Pending |
| PKG-02 | Phase 1 | Pending |
| PKG-03 | Phase 1 | Pending |
| CI-01 | Phase 1 | Pending |
| CI-02 | Phase 1 | Pending |
| VER-01 | Phase 1 | Pending |
| VER-02 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 7 total
- Mapped to phases: 7
- Unmapped: 0

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 after roadmap creation*
