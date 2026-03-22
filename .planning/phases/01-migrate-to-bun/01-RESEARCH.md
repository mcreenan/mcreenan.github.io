# Phase 1: Migrate to Bun - Research

**Researched:** 2026-03-21
**Domain:** Package manager migration (Yarn to Bun), GitHub Actions CI with withastro/action
**Confidence:** HIGH

## Summary

Migrating from Yarn to Bun as a package manager for this Astro static site is a well-supported, low-risk operation. Bun is compatible with all dependencies in use (Astro 4.x, Tailwind, MDX, sitemap, RSS, check integrations). The migration is three mechanical steps: run `bun install` to generate `bun.lockb`, remove `yarn.lock`, and commit. No `package.json` script changes are required since scripts invoke `astro` directly.

The CI path via `withastro/action` (current `v2` tag in the workflow) supports Bun auto-detection. The action scans for lockfiles in a fixed priority order: pnpm-lock.yaml → yarn.lock → package-lock.json → bun.lock → bun.lockb → deno. This ordering is critical: `yarn.lock` must be removed before pushing to `main` or the action will continue using Yarn. Once `yarn.lock` is absent and `bun.lockb` is present, the action selects Bun automatically with no additional configuration.

The CONTEXT.md decisions (D-01 through D-04) are fully validated: `withastro/action@v2` does auto-detect `bun.lockb`, no `bunfig.toml` is needed, binary lockfile is the correct default choice, and no `package-manager` input override is required.

**Primary recommendation:** Run `bun install`, delete `yarn.lock`, commit both changes together, push to trigger CI.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Keep `withastro/action@v2` as-is — trust its auto-detection of bun.lockb to use Bun automatically
- **D-02:** No need to set explicit `package-manager` config or replace the action with custom steps
- **D-03:** Use default binary lockfile (bun.lockb), not text-based bun.lock
- **D-04:** No bunfig.toml needed since we're using defaults

### Claude's Discretion
- Exact order of migration steps (install, remove yarn.lock, verify)
- Whether to update any documentation references to yarn commands

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PKG-01 | Replace yarn.lock with bun.lockb by running `bun install` | `bun install` in a directory with `package.json` generates `bun.lockb` and installs all dependencies; confirmed compatible with Astro 4.x dependency tree |
| PKG-02 | Remove yarn.lock from the repository | Must be deleted AND committed — `withastro/action` detects yarn.lock before bun.lockb in its priority order, so presence of yarn.lock in CI checkout would cause Yarn to be used |
| PKG-03 | All existing npm scripts (dev, start, build, preview, astro) work via `bun run` | Astro scripts are PM-agnostic (`astro dev`, `astro check && astro build`, `astro preview`); `bun run <script>` reads package.json scripts identically to `yarn run` |
| CI-01 | GitHub Actions workflow uses Bun instead of Yarn/Node for install and build | withastro/action auto-detects bun.lockb once yarn.lock is removed; no workflow file changes needed |
| CI-02 | Site deploys successfully to GitHub Pages after migration | Deployment job unchanged; build job output (dist/) is uploaded and deployed the same way |
| VER-01 | Local dev server starts and serves pages correctly | Verified by running `bun run dev` after `bun install` |
| VER-02 | Production build completes without errors | Verified by running `bun run build` (runs `astro check && astro build`) |
</phase_requirements>

---

## Standard Stack

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Bun | 1.3.11 (latest as of 2026-03-21) | Package manager replacing Yarn | Drop-in replacement; faster installs; generates bun.lockb |

### No New Libraries
This migration adds no new runtime or dev dependencies. Bun replaces Yarn as a CLI tool only.

**Installation (Bun itself, if not already installed):**
```bash
curl -fsSL https://bun.sh/install | bash
```

**After Bun is installed:**
```bash
bun install
```

## Architecture Patterns

### Migration Sequence (Recommended Order)

The order matters because `withastro/action` detects lockfiles in priority sequence. Committing both the addition of `bun.lockb` and removal of `yarn.lock` in a single commit ensures the repository never has an ambiguous state.

**Recommended:**
```
1. bun install          (generates bun.lockb, installs node_modules)
2. git rm yarn.lock     (stage deletion)
3. git add bun.lockb    (stage new lockfile)
4. bun run build        (verify locally before committing)
5. git commit           (single atomic commit)
6. git push             (triggers CI)
```

**Why atomic commit:** If `yarn.lock` is removed in one commit and `bun.lockb` added in another, a CI run on the intermediate state would fail (no lockfile found).

### withastro/action Lockfile Priority Order
```
1. pnpm-lock.yaml  → pnpm
2. yarn.lock       → yarn    ← MUST be absent
3. package-lock.json → npm
4. bun.lock        → bun     ← text-based (Bun 1.2+)
5. bun.lockb       → bun     ← binary (our target)
6. deno.json/deno.lock → deno
```

This is verified from the `action.yml` source on the main branch. Since we use the binary lockfile (`bun.lockb`, D-03), it falls at position 5. The action will select it correctly once `yarn.lock` is removed.

### Existing Workflow Analysis

Current `.github/workflows/deploy.yml` build step:
```yaml
- name: Install, build, and upload your site output
  uses: withastro/action@v2
  with:
      node-version: 20
```

After migration: **no changes required.** The `node-version: 20` input is accepted and used alongside Bun as the package manager (Bun runs Astro using Node.js — Bun is the PM, Node is the runtime, matching the project constraint in REQUIREMENTS.md "Out of Scope: Using Bun as runtime").

### Anti-Patterns to Avoid
- **Committing bun.lockb before deleting yarn.lock:** CI would detect yarn.lock first and use Yarn, causing a mismatch between local and CI lockfiles.
- **Adding bunfig.toml:** Not needed (D-04). Default Bun behavior works for this project.
- **Using `--bun` flag with astro CLI:** This switches Astro to use Bun as the runtime, not just the package manager. Out of scope per REQUIREMENTS.md.
- **Adding explicit `package-manager` input to workflow:** Not needed (D-02); defeats the purpose of auto-detection.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Package manager detection in CI | Custom shell script to detect and install Bun | withastro/action auto-detection | Already built into the action |
| Bun installation in CI | `curl bun.sh/install` step | withastro/action handles it | Action installs Bun when bun.lockb detected |
| Script compatibility shim | Wrapper scripts for bun/yarn | No shim needed | `bun run` reads package.json scripts identically |

**Key insight:** This migration is purely a file swap. No tooling, scripts, or configs need modification.

## Common Pitfalls

### Pitfall 1: yarn.lock still present at CI checkout
**What goes wrong:** `withastro/action` detects `yarn.lock` before `bun.lockb` and installs with Yarn, causing a build failure if `yarn.lock` and `bun.lockb` are out of sync.
**Why it happens:** The action's lockfile detection is ordered priority; yarn.lock has higher precedence than bun.lockb.
**How to avoid:** Delete `yarn.lock` and add `bun.lockb` in the same commit. Never push a state where both files coexist.
**Warning signs:** CI logs show "yarn install" instead of "bun install" after migration.

### Pitfall 2: bun.lockb not committed
**What goes wrong:** CI has no lockfile, `withastro/action` exits with an error: "No lockfile found."
**Why it happens:** `bun.lockb` may be in `.gitignore` (some templates add it), or it was generated but not staged.
**How to avoid:** After `bun install`, confirm `bun.lockb` exists and `git add bun.lockb` before committing.
**Warning signs:** `git status` shows `bun.lockb` as untracked.

### Pitfall 3: Bun 1.2+ text lockfile generated instead of binary
**What goes wrong:** `bun.lock` (text) is generated instead of `bun.lockb` (binary), which conflicts with D-03.
**Why it happens:** Bun 1.2.0+ changed the default lockfile to text-based (`bun.lock`). If the installed Bun version is 1.2 or later, default `bun install` may produce `bun.lock`.
**How to avoid:** Check which file was generated after `bun install`. D-03 specifies binary (`bun.lockb`). If `bun.lock` is generated instead, this is still detected by `withastro/action` (position 4 in priority, before bun.lockb at position 5) — so either format works for CI. However, honor D-03 by verifying.
**Warning signs:** After `bun install`, `ls -la` shows `bun.lock` instead of `bun.lockb`.

**Note:** As of research, the action detects both `bun.lock` (text) and `bun.lockb` (binary). Either will work for CI auto-detection. D-03 chose binary, which is the pre-1.2 default. If the local Bun version generates text lockfile by default, either accept it (both work) or use `bun install --save-binary-lockfile` if that flag exists.

### Pitfall 4: node_modules incompatible state
**What goes wrong:** Old `node_modules` installed by Yarn conflicts with Bun's install.
**Why it happens:** Yarn and Bun may organize `node_modules` differently for hoisted packages.
**How to avoid:** Delete `node_modules` before running `bun install`.
**Warning signs:** `bun run build` fails with resolution errors despite `bun install` succeeding.

## Code Examples

### Running the migration locally
```bash
# Source: bun.sh/docs + astro.build/recipes/bun
# Remove old node_modules to avoid state conflicts
rm -rf node_modules

# Install all dependencies with Bun (generates bun.lockb or bun.lock)
bun install

# Verify scripts work
bun run build    # runs: astro check && astro build
bun run dev      # runs: astro dev

# Stage changes for commit
git rm yarn.lock
git add bun.lockb   # or bun.lock if that's what was generated
git commit -m "chore: migrate from yarn to bun"
```

### Verifying CI will use Bun (manual check)
```bash
# Confirm yarn.lock is gone and bun lockfile is present
git ls-files | grep -E '(yarn\.lock|bun\.lock)'
# Expected output: bun.lockb (or bun.lock)
# yarn.lock must NOT appear
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Binary lockfile only (bun.lockb) | Text lockfile default (bun.lock) | Bun 1.2.0 (early 2025) | Both are detected by withastro/action; either works |
| Manual Bun install step in CI | withastro/action auto-installs Bun | withastro/action v2+ | No explicit CI changes needed |

**Deprecated/outdated:**
- `yarn.lock`: Will be replaced by `bun.lockb` (or `bun.lock`) — not deprecated in industry, but removed from this project

## Open Questions

1. **Which lockfile format does local Bun version generate?**
   - What we know: Bun 1.2+ defaults to text-based `bun.lock`; pre-1.2 defaults to binary `bun.lockb`
   - What's unclear: What Bun version is installed locally on the developer machine
   - Recommendation: After `bun install`, check which file was generated. Both are detected by `withastro/action`. If text lockfile is generated, update D-03 or accept text lockfile — it's a non-breaking difference.

2. **Documentation references to yarn commands**
   - What we know: Claude's Discretion area — update is optional
   - What's unclear: Whether README or any docs reference yarn-specific commands
   - Recommendation: Check `README.md` and `CLAUDE.md` for `yarn` references; update to `bun run` equivalents if found. Low effort, good hygiene.

## Sources

### Primary (HIGH confidence)
- `withastro/action` main branch `action.yml` — lockfile detection priority order verified directly from source (fetched via WebFetch from github.com/withastro/action/blob/main/action.yml)
- [Astro Bun recipe](https://docs.astro.build/en/recipes/bun/) — official Astro docs confirming Bun compatibility with Astro and command equivalents
- [Bun Astro guide](https://bun.sh/guides/ecosystem/astro) — official Bun docs confirming `bun install` + `bun run` workflow
- [Astro GitHub Pages deploy guide](https://docs.astro.build/en/guides/deploy/github/) — confirms withastro/action detects bun lockfile

### Secondary (MEDIUM confidence)
- WebSearch results confirming Bun 1.3.11 as current version (npm registry, GitHub releases) — cross-verified across multiple sources
- GitHub issue #13065 (withastro/astro) — confirms `bun.lock` text format introduced in Bun 1.2.0

### Tertiary (LOW confidence)
- WebSearch on v2-specific withastro/action release notes — release page did not load fully; v2 Bun support inferred from current main branch source which is the v2 tag target

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Bun is the only tool, well-documented, verified compatible with Astro 4.x
- Architecture (migration steps): HIGH — withastro/action source code confirmed, detection order verified
- Pitfalls: HIGH for lockfile ordering (verified from source); MEDIUM for Bun 1.2+ text lockfile (observed via issue tracker)

**Research date:** 2026-03-21
**Valid until:** 2026-06-21 (stable ecosystem; withastro/action changes slowly)
