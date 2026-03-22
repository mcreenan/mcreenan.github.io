# Phase 1: Migrate to Bun - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace Yarn with Bun as the package manager for local development and CI. All existing npm scripts must work via `bun run`. GitHub Pages deployment must continue working. No application code changes.

</domain>

<decisions>
## Implementation Decisions

### CI strategy
- **D-01:** Keep `withastro/action@v2` as-is — trust its auto-detection of bun.lockb to use Bun automatically
- **D-02:** No need to set explicit `package-manager` config or replace the action with custom steps

### Lockfile format
- **D-03:** Use default binary lockfile (bun.lockb), not text-based bun.lock
- **D-04:** No bunfig.toml needed since we're using defaults

### Claude's Discretion
- Exact order of migration steps (install, remove yarn.lock, verify)
- Whether to update any documentation references to yarn commands

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### CI/CD
- `.github/workflows/deploy.yml` — Current deployment workflow using withastro/action@v2

### Project config
- `package.json` — Scripts and dependencies to verify after migration

No external specs — requirements fully captured in decisions above

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No migration-specific code to reuse — this is a tooling swap

### Established Patterns
- `package.json` scripts use `astro` CLI directly (e.g., `astro dev`, `astro build`) — these are PM-agnostic
- `astro check && astro build` in build script — should work identically under Bun

### Integration Points
- `yarn.lock` — to be removed
- `.github/workflows/deploy.yml` — withastro/action@v2 auto-detects PM from lockfile
- No yarn-specific config files (no `.yarnrc`, `.yarnrc.yml`, or similar)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-migrate-to-bun*
*Context gathered: 2026-03-21*
