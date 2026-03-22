# Phase 1: Migrate to Bun - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-21
**Phase:** 01-migrate-to-bun
**Areas discussed:** CI strategy, Lockfile format

---

## CI Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Trust auto-detect | Keep withastro/action@v2 as-is — it should detect bun.lockb and use Bun automatically | ✓ |
| Explicit config | Set package-manager: bun in the action config to be explicit rather than relying on detection | |
| Custom steps | Replace withastro/action@v2 with manual bun install + bun run build steps for full control | |

**User's choice:** Trust auto-detect
**Notes:** STATE.md had flagged withastro/action@v2 compatibility as a concern. User chose to trust auto-detection rather than adding explicit configuration.

---

## Lockfile Format

| Option | Description | Selected |
|--------|-------------|----------|
| Binary (bun.lockb) | Default Bun behavior. Faster to parse. Not human-readable in diffs. | ✓ |
| Text (bun.lock) | Human-readable JSONC format. Easier to review in PRs. Requires --save-text-lockfile flag or bunfig.toml setting. | |

**User's choice:** Binary (bun.lockb)
**Notes:** None — straightforward preference for default behavior.

---

## Claude's Discretion

- Exact order of migration steps
- Whether to update documentation references to yarn commands

## Deferred Ideas

None
