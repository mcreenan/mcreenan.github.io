---
status: resolved
trigger: "Button icons in the retro theme sometimes disappear or become invisible after switching pages via View Transitions."
created: 2026-04-04T00:00:00Z
updated: 2026-04-04T01:00:00Z
---

## Current Focus

hypothesis: CONFIRMED — @phosphor-icons/web CDN script dynamically injects <link> stylesheet tags into document.head at runtime. Astro View Transitions strips those dynamically-injected <link> tags during its head swap (they don't exist in the incoming page's static HTML), and won't re-execute the script either (already-seen scripts run only once). Result: Phosphor icon CSS is gone after the first navigation, making all ph-* icons invisible.
test: Fix applied — replaced script tag with static <link rel="stylesheet"> in BaseHead.astro
expecting: ph-* icons (ph-user, ph-envelope, ph-palette) persist correctly through all page navigations
next_action: Await human verification in browser

## Symptoms

expected: Button components with icon props (FontAwesome icons) render correctly on every page, including after navigating between pages (home ↔ about ↔ work ↔ contact)
actual: Icons sometimes disappear/become invisible after a page navigation. Intermittent — doesn't happen every time.
errors: None reported; visual only
reproduction: Load home page, icons show. Navigate to another page and back. Icons may be missing.
started: Observed after v2.0 theme system was shipped. Unclear if caused by Phase 2 anti-flash script, Phase 2 View Transitions integration, or an existing FontAwesome loading issue.

## Eliminated

- hypothesis: FontAwesome CDN icons vanish because FA script re-runs and wipes SVG elements
  evidence: FontAwesome is CSS-only (no JS). FA icons are not affected by this bug. The affected icons are all ph-* (Phosphor) classes, not fa-* classes.
  timestamp: 2026-04-04T00:00:30Z

- hypothesis: Phosphor script uses MutationObserver that stops watching after swap
  evidence: The actual unpkg bundle (curl confirmed) is only 8 lines: it appends <link> stylesheet tags to document.head. No observer, no SVG injection.
  timestamp: 2026-04-04T00:01:00Z

## Evidence

- timestamp: 2026-04-04T00:00:10Z
  checked: src/components/BaseHead.astro line 110
  found: <script src="https://unpkg.com/@phosphor-icons/web"></script> — loaded as a JS script, not a stylesheet
  implication: The script runs JS at page load, not just CSS. Subject to Astro's "scripts run once" View Transitions behavior.

- timestamp: 2026-04-04T00:00:15Z
  checked: index.astro icon usage
  found: ph-* icons (ph-user, ph-envelope, ph-palette) on home page alongside fa-regular fa-building. Contact/work/about pages use fa-* icons only. ThemesIcon.astro uses ph-palette.
  implication: After navigation back to home, or on pages with ThemesIcon, Phosphor icons will be invisible.

- timestamp: 2026-04-04T00:00:20Z
  checked: actual unpkg bundle source (curl https://unpkg.com/@phosphor-icons/web)
  found: The entire script is 8 lines. It iterates 6 font weights and does document.getElementsByTagName("head")[0].appendChild(link) for each, where link is a <link rel="stylesheet"> pointing to cdn.jsdelivr.net.
  implication: The icons are CSS/font-based. All 6 <link> tags are injected dynamically at runtime. They are NOT in the static HTML that Astro's View Transitions head-swap compares. They will be stripped on every navigation swap.

- timestamp: 2026-04-04T00:00:25Z
  checked: Astro View Transitions script execution behavior (docs + issue #9359)
  found: Astro executes each script "only once on first sight." CDN scripts seen on page A are not re-executed when navigating to page B, even if page B also has the same <script src="..."> tag. The dynamically-injected <link> tags are removed by head-swap, and the script doesn't re-run to re-inject them.
  implication: After first navigation: Phosphor icon CSS is gone. On any page with ph-* icons (home, ThemesIcon): icons are invisible.

- timestamp: 2026-04-04T00:02:00Z
  checked: src/components/BaseHead.astro after fix
  found: <script src="https://unpkg.com/@phosphor-icons/web"> replaced with static <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/regular/style.css">. Only regular weight needed — all ph-* usages in codebase use the base ph class (regular weight).
  implication: The Phosphor CSS is now part of every page's static HTML head. Astro View Transitions deduplicates identical <link> tags by URL and keeps them across navigations. Icons will persist.

## Resolution

root_cause: @phosphor-icons/web is a JS script that dynamically injects 6 <link rel="stylesheet"> tags into document.head at runtime. Astro View Transitions strips those runtime-injected <link> tags during its head diff/swap (they don't exist in the incoming page's static HTML template), and the script is not re-run (Astro's "execute once" policy for already-seen scripts). After the first navigation, all Phosphor icon CSS is absent, making every <i class="ph ..."> element invisible.

fix: Replaced <script src="https://unpkg.com/@phosphor-icons/web"> with a static <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/regular/style.css"> in BaseHead.astro. Only the regular weight stylesheet is needed (all ph-* usages in the codebase use the base ph class). Static link tags survive Astro's View Transitions head swap.

verification: Confirmed by user — icons stay visible across all navigations in retro theme.
files_changed:
  - src/components/BaseHead.astro
