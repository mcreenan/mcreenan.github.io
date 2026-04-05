# GSD Debug Knowledge Base

Resolved debug sessions. Used by `gsd-debugger` to surface known-pattern hypotheses at the start of new investigations.

---

## retro-button-icons-disappear — Phosphor icons invisible after View Transitions navigation
- **Date:** 2026-04-04
- **Error patterns:** icons disappear, invisible, ph-*, phosphor, view transitions, navigation, CDN script, dynamic stylesheet
- **Root cause:** @phosphor-icons/web JS script dynamically injects <link> stylesheet tags into document.head at runtime. Astro View Transitions strips those runtime-injected tags during head diff/swap, and does not re-run already-seen scripts. After the first navigation, Phosphor icon CSS is absent, making every ph-* icon invisible.
- **Fix:** Replaced <script src="https://unpkg.com/@phosphor-icons/web"> with a static <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/regular/style.css"> in BaseHead.astro. Static link tags survive Astro's View Transitions head swap.
- **Files changed:** src/components/BaseHead.astro
---

