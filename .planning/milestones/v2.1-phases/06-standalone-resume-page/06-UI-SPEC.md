---
phase: 6
slug: standalone-resume-page
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-30
---

# Phase 6 — UI Design Contract

> Visual and interaction contract for the standalone `/resume` page. Recreates `~/resume/design_handoff_resume/Resume.html` pixel-faithfully. All values are extracted verbatim from the locked design handoff and CONTEXT.md decisions D-01 through D-12.
>
> **Isolation note:** The resume page is intentionally outside the `[data-theme]` system. It does NOT import `BaseHead.astro`, `Layout.astro`, or `src/styles/global.css`. All tokens, fonts, and layout below are scoped to `src/pages/resume.astro`'s inline `<style>` block (D-04, D-05). None of these tokens collide with, derive from, or influence the retro/win31/win95 theme tokens in `global.css`.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable (Astro static site, no shadcn) |
| Component library | none (single Astro file with inline `<style>`) |
| Icon library | none (no icons on `/resume`; FontAwesome on `/work` Resume button only) |
| Font | Merriweather 400/700 (body + headings), JetBrains Mono 400/500 (mono) — self-hosted WOFF2 in `public/fonts/` per D-07 |

**Self-host font files (D-07):**

| File | Family | Weight | Format |
|------|--------|--------|--------|
| `public/fonts/merriweather-regular.woff2` | Merriweather | 400 | woff2 |
| `public/fonts/merriweather-bold.woff2` | Merriweather | 700 | woff2 |
| `public/fonts/jetbrains-mono-regular.woff2` | JetBrains Mono | 400 | woff2 |
| `public/fonts/jetbrains-mono-medium.woff2` | JetBrains Mono | 500 | woff2 |

Declared via `@font-face` inside `resume.astro`'s inline `<style>`. No Google Fonts CDN link, no `<link rel="preload">` (single-page bundle, preload unnecessary).

**Font stacks (verbatim from handoff):**
- `--sans: "Merriweather", Georgia, serif;`
- `--mono: "JetBrains Mono", ui-monospace, monospace;`

---

## Spacing Scale

Declared values used by the resume page (extracted verbatim from `Resume.html`):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | `.intro` mobile gap; `.job-body li` margin-bottom + padding-left |
| sm | 6px | `.contact` row gap; `.personal` border-radius; `.technical` border-radius |
| md | 8px | `.contact-row` icon gap; `.summary` padding-top |
| md+ | 14px | `.tech-grid` row gap; `.intro .tagline` margin-bottom |
| lg | 16px | `.intro` mobile gap |
| lg+ | 18px | `.job-body ul` padding-left |
| xl | 22px | `.personal` vertical padding; `.technical` vertical padding |
| xl+ | 24px | `.job` column gap; `.tech-grid` column gap; mobile `.page` horizontal padding |
| 2xl | 26px | `.personal` horizontal padding; `.technical` horizontal padding |
| 2xl+ | 28px | `.job` margin-bottom (between roles) |
| 3xl | 32px | `.intro` desktop column gap; mobile `.page` vertical padding |
| 3xl+ | 36px | `section + section` margin-top (vertical rhythm between sections); print `.page` horizontal padding |
| 4xl | 44px | `.page` desktop vertical + horizontal padding |
| 4xl+ | 48px | `.page` outer margin (top/bottom on desktop) |

**Layout grid columns (locked):**
- `.intro` desktop: `grid-template-columns: 44% 1fr` (intro split per handoff README)
- `.job` and `.tech-grid`: `grid-template-columns: 130px 1fr` (130px date/label gutter)
- `.page` max-width: `780px`

**Exceptions to multiples-of-4 rule:**
This page is a recreation of an external pixel-faithful design handoff (D-10, D-11). The handoff uses values like 6, 14, 18, 22, 26, 28, 36, 44 px that are not on a strict 8-point or 4-point grid. Per D-10 ("Tokens (colors, type, spacing) … are all locked. Do not invent new spacing or color decisions."), these non-grid values are intentional and MUST be preserved verbatim. The standard 8-point scale rule does NOT apply to `/resume`.

---

## Typography

The handoff declares 4 distinct sizes plus 2 sub-variants (15.5px on `.job-body h3`, 14.5px on `.tech-grid dd`). All values verbatim from `Resume.html`.

| Role | Size | Weight | Line Height | Selector |
|------|------|--------|-------------|----------|
| Display (name) | 32px | 700 | 1.1 | `.intro h1` (also `letter-spacing: -0.02em`, `margin: 0 0 4px`) |
| Body | 15px | 400 | 1.55 | `html, body` (default), `.summary`, `.intro .tagline` |
| Job title | 15.5px | 600 | inherit | `.job-body h3` |
| Tech value | 14.5px | 400 | inherit | `.tech-grid dd` |
| Job company | 14px | 400 | inherit | `.job-body .company` |
| Mono small caps / meta | 12px | 400 | 1.5 | `.contact`, `.job-meta`, `.tech-grid dt` (uppercase, letter-spacing 0.04em on `dt`) |

**Font weights used (locked at exactly 2 per family):**
- Merriweather: 400 (regular), 700 (bold) — used for `.intro h1` (700) and all body text (400)
- JetBrains Mono: 400 (regular), 500 (medium) — 500 is loaded for parity with Google Fonts handoff but the actual rules in `Resume.html` only use 400. Loading both keeps the contract aligned with the handoff CSS variable.

**Job title weight 600:** The handoff uses `font-weight: 600` on `.job-body h3` even though only Merriweather 400/700 are loaded. Per D-10 (pixel-faithful, do not improvise), preserve `font-weight: 600` verbatim — the browser will synthesize it from 700 via `font-synthesis-weight`. This is the documented behavior of the handoff and MUST NOT be changed.

**Note on size count:** Standard UI-SPEC convention is 3-4 sizes total. The resume page exceeds this with 6 declared sizes because it is a long-form document (not a UI surface) where typographic differentiation between job title / company / body / tech value / meta carries semantic weight. Per D-10, these sizes are locked and MUST be preserved verbatim.

---

## Color

All hex values verbatim from `Resume.html` `:root`. The resume page declares its own color tokens — none are imported from `global.css` theme tokens.

| Role | Value | CSS Var | Usage |
|------|-------|---------|-------|
| Dominant (60%) — page bg | `#efece6` | `--bg` | `body` background (warm off-white surrounding the paper) |
| Dominant (60%) — paper | `#fbfaf7` | `--paper` | `.page` background (the document itself) |
| Secondary (30%) — accent surface | `#c3cbd1` | `--accent-bg` | `.personal` and `.technical` cards (the two accent-bg sections per handoff README) |
| Ink primary | `#1a1d22` | `--ink`, `--accent-text` | Default body text, headings, hover state on accent links |
| Ink soft | `#3d434c` | `--ink-soft`, `--accent-text-soft` | `.summary`, `.job-body .company`, `.job-body ul`, `.personal .tagline`, `.personal .contact`, `.tech-grid dd` |
| Ink mute | `#6a717c` | `--ink-mute`, `--accent-text-mute` | `.job-meta`, `.job-body li::marker`, `.personal .contact-sep`, `.tech-grid dt` |
| Accent (10%) — interactive | inherits ink | n/a | Links use `color: inherit; text-decoration: none;` — color is not used to signal interactivity per handoff |
| Destructive | not applicable | — | No destructive actions on `/resume` |

**Accent surface (`#c3cbd1`) reserved for (per handoff README):**
1. `.personal` card (intro left column: name, tagline, contact strip)
2. `.technical` card (skills section)

These are the ONLY two surfaces that receive the accent background. No other element — not buttons, not headings, not the Download PDF action — uses `--accent-bg`. This is locked per D-10 and the handoff README "The accent background is applied to **personal info** and **technical** only."

**Print color rules (`@media print`):**
- `body { background: white; }` — overrides `--bg` to pure white for ink savings
- `.page` retains `--paper` background, accent cards retain `--accent-bg` (printers handle this; no override)

**`Download PDF` button color (D-02, D-03):**
- The button MUST be visible and recognizable on the warm paper surface but is NOT given the `--accent-bg` color (that token is reserved per the handoff). Use `--ink` or `--ink-soft` for the button's text/border, with `--paper` or transparent fill, so it reads as a secondary affordance against the cream paper. Hidden in `@media print` per D-03.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Page `<title>` | `Matt Creenan — Resume` (verbatim from handoff) |
| Page `<meta name="description">` | `Matt Creenan's resume — 15+ years across full-stack development, DevOps, and data engineering.` |
| Primary CTA (download action) | **`Download PDF`** (verbatim per D-02, matches RES-04 wording) |
| Primary CTA `aria-label` | `Download resume as PDF` (more descriptive for screen readers) |
| Primary CTA position | Top-right of `.intro` section (D-03), absolutely positioned or grid-area-positioned so it does not displace the centered name/tagline |
| Primary CTA print state | `display: none` inside `@media print` (D-03 — must not appear in printout) |
| Primary CTA action | Calls `window.print()` (D-01) — leverages existing tuned `@media print` block |
| Empty state | not applicable (resume is fully static, never empty) |
| Error state | not applicable (no async data, no form, no failure modes) |
| Loading state | not applicable (server-rendered static HTML at build time) |
| Destructive confirmation | not applicable (no destructive actions) |

**Resume body copy is locked verbatim per D-11.** The following must be preserved exactly as authored in `Resume.html` — no paraphrasing, no reformatting, no wordsmithing:

- Name: `Matt Creenan`
- Tagline: `Experienced Software Professional`
- Contact strip:
  - Phone: `(716) 579-0988`
  - Email: `mattcreenan@gmail.com` (linked `mailto:`)
  - LinkedIn: `https://www.linkedin.com/pub/matt-creenan/56/677/605` (label `LinkedIn`)
  - GitHub: `https://github.com/mcreenan/` (label `GitHub`)
  - LinkedIn and GitHub share one row separated by `·` (middle dot, U+00B7)
- Summary paragraph (verbatim, including line wrapping in source):
  > `15+ years of experience across full-stack development, DevOps, and data engineering. Consistently a top-performing individual contributor across technologies, methodologies, and software architectures.`
- Four experience entries (verbatim — dates, titles, companies, all bullets):
  1. `2019 — Present` · `Engineering Manager, Data` · `Delaware North` · 3 bullets
  2. `2014 — 2019` · `Senior SOA Engineer, Senior Data Engineer` · `Delaware North` · 3 bullets
  3. `2013 — 2014` · `Senior Programmer` · `LocalNet / CoreComm / Exhibio LLC` · 3 bullets
  4. `2006 — 2012` · `Vendor Integrations Engineer, Lead Engineer` · `Synacor — Williamsville, NY` · 5 bullets
- Six technical rows (verbatim, including `&nbsp;` non-breaking spaces in `Operating Systems` and `Data Engineering` and `&amp;` in the Data Engineering value):
  - `Languages` · `PHP, Perl, Python, JavaScript, Java`
  - `Operating Systems` · `Linux, Windows, FreeBSD, macOS`
  - `Cloud / AWS` · 18 services from API Gateway through Step Functions
  - `Databases` · `MySQL, PostgreSQL, Microsoft SQL Server, MongoDB, Redis`
  - `Provisioning` · `Ansible, Puppet, Terraform`
  - `Data Engineering` · `Spark (pipelines), Airflow (orchestration), Parquet & ORC (storage formats)`

**Resume button on `/work` (retro + win95 variants per D-08, D-09):**

| Element | Copy |
|---------|------|
| Button label | `Resume` (unchanged) |
| Tooltip | none — DROP existing `title="Resume coming soon"` per D-08 |
| Anchor target | `target="_blank"` (D-09 — opens in new tab) |
| Anchor rel | `rel="noopener"` (D-09 — security) |
| `aria-label` (recommended) | `Open resume in a new tab` |

---

## Component Inventory

Single Astro file: `src/pages/resume.astro`. No new shared components. The page contains these structural blocks (verbatim CSS class names from handoff):

| Block | CSS class | Purpose |
|-------|-----------|---------|
| Document body | `body` | Warm-grey page background (`--bg`) |
| Paper container | `.page` | Max-width 780px paper card with shadow |
| Intro section | `.intro` | 2-col grid (44%/1fr) holding `.personal` + `.summary` |
| Personal card | `.personal` | Accent-bg card with `<h1>`, `.tagline`, `.contact` |
| Contact list | `.contact` | Mono 12px stacked column with phone, email, LinkedIn·GitHub row |
| Contact row | `.contact-row` | Inline LinkedIn · GitHub with `.contact-sep` |
| Summary | `.summary` | Body 15px paragraph in right column |
| Experience section | `.experience` | Wrapper for four `.job` articles |
| Job entry | `.job` | 130px / 1fr grid: `.job-meta` (mono dates) + `.job-body` (h3 + company + ul) |
| Job body | `.job-body` | Holds `<h3>` (15.5px/600), `.company` (14px), `<ul>` (15px soft) |
| Technical section | `.technical` | Accent-bg card holding `.tech-grid` |
| Tech grid | `.tech-grid` | 130px / 1fr `<dl>` with mono uppercase `<dt>` + `<dd>` value |
| Download PDF button | (new — class TBD by executor, e.g. `.download-pdf`) | Top-right of `.intro`, screen-only (D-03) |

**Frontmatter data (D-12):**

```ts
const jobs = [
  { dates: '2019 — Present', title: 'Engineering Manager, Data', company: 'Delaware North', bullets: [...] },
  // ...
];
const techRows = [
  { label: 'Languages', value: 'PHP, Perl, Python, JavaScript, Java' },
  // ...
];
```

Iterated via `.map()` in template. No `src/data/resume.ts` extraction.

---

## Responsive Behavior

Single breakpoint at `max-width: 640px` (verbatim from handoff):

| Property | Desktop (>640px) | Mobile (≤640px) |
|----------|------------------|-----------------|
| `.page` margin | `48px auto` | `0` |
| `.page` padding | `44px 44px` | `32px 24px` |
| `.intro` columns | `44% 1fr` | `1fr` |
| `.intro` gap | `32px` | `16px` |
| `.job` columns | `130px 1fr` | `1fr` |
| `.job` gap | `24px` | `4px` |
| `.tech-grid` columns | `130px 1fr` | `1fr` |
| `.tech-grid` gap | `14px 24px` | `4px` |
| `.job-meta`, `.tech-grid dt` padding-top | `3px` | `0` |

**Print (`@media print`):**

| Property | Print value |
|----------|-------------|
| `body` background | `white` |
| `.page` box-shadow | `none` |
| `.page` margin | `0` |
| `.page` max-width | `none` |
| `.page` padding | `36px 44px` |
| Download PDF button | `display: none` (D-03) |

---

## Interaction Contracts

| Interaction | Behavior |
|-------------|----------|
| Click "Download PDF" | Calls `window.print()`. Browser opens print dialog; user chooses "Save as PDF" destination. (D-01) |
| Hover link in `.personal` (LinkedIn, GitHub, email) | `color: var(--accent-text)` per `.personal .contact a:hover` rule (verbatim from handoff). Other links: `color: inherit; text-decoration: none;` |
| Focus state | Use browser default focus ring on all `<a>` and the Download PDF button. Do NOT remove outline. (Accessibility — handoff omits explicit focus rules; default suffices.) |
| Print preview | All sections render; box-shadow drops; warm-grey background drops to white; padding tightens to `36px 44px`; Download PDF button hidden. |
| `/work` Resume button click | Plain anchor navigation to `/resume` in a new tab (D-08, D-09). NO overlay, NO ViewTransitions, NO theme inheritance — full page load with no `[data-theme]` on `<html>`. |

---

## Theme Isolation Contract (CRITICAL)

The resume page MUST be verifiably isolated from the main site's theme system. Executor and checker MUST confirm:

| Constraint | Verification |
|------------|--------------|
| No `[data-theme]` attribute on `<html>` of `/resume` | Inspect rendered HTML — `<html lang="en">` only, no `data-theme` |
| `BaseHead.astro` NOT imported | Grep `resume.astro` for `BaseHead` — must be 0 matches |
| `Layout.astro` NOT imported | Grep `resume.astro` for `Layout` — must be 0 matches |
| `src/styles/global.css` NOT imported | Grep `resume.astro` for `global.css` — must be 0 matches |
| `ViewTransitions` NOT used | Grep `resume.astro` for `ViewTransitions` — must be 0 matches |
| `ThemeDialog`, `Taskbar`, `HomeIcon`, `ThemesIcon` NOT used | Grep `resume.astro` for these names — must be 0 matches |
| Tailwind utility classes NOT used | The `<style>` block uses only the local CSS classes catalogued above; no `class="flex items-center …"` |
| Resume page's `--bg`, `--ink`, `--paper`, etc. CSS vars do NOT leak outward | Variables declared inside `.page` scope or `:root` of `resume.astro`'s inline `<style>` only — Astro scopes them to the page |
| `/resume` NOT in `TITLE_MAP` in `index.astro` | Grep `index.astro` for `/resume` — must be 0 matches |

This isolation is what makes the resume page a "single-file-readable" artifact (D-05). The whole page can be reviewed by reading exactly one file.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| n/a | none | not applicable — no shadcn, no third-party UI registries used on this page |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
