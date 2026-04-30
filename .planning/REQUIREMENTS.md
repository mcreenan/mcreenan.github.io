# Requirements: matt.creenan.me

## Milestone v2.1 Resume

**Goal:** Ship a working resume as a standalone `/resume` page (outside the desktop-OS theme system) and replace the disabled "Resume coming soon" button on `/work` with a real link.

**Scope note:** `/resume` is intentionally decoupled from the retro/win31/win95 theming framework. It is a clean, recruiter-friendly, print-ready document page — not part of the desktop-OS aesthetic.

### Resume Page

- [ ] **RES-01**: User can view a resume at `/resume` rendered as a standalone page — no `[data-theme]` switching, no themed chrome, no overlay integration
- [ ] **RES-02**: Resume content covers professional summary, current role, work history with dates, highlights, and skills

### Navigation Integration

- [ ] **RES-03**: The "Resume" button on `/work` is enabled (no longer `disabled`) and links to `/resume` via plain navigation in both the retro and win95 variants of `/work`

### PDF Export

- [ ] **RES-04**: User can download a printable PDF version of the resume from `/resume` via a clearly visible action

## Future Requirements

(None reserved for future milestones — v2.1 scope is self-contained.)

## Out of Scope

- Theming `/resume` to match retro/win31/win95 — explicit user decision; `/resume` lives outside the theme system
- Adding `/resume` to the overlay `TITLE_MAP` in index.astro — overlay integration is reserved for themed pages only
- Recruiter contact form on resume — `/contact` already exists and serves this purpose
- Multiple resume variants (e.g. tech-focused vs leadership-focused) — single canonical resume is sufficient for v2.1
- Resume version history or change tracking — not relevant for a personal site
- Auto-generated resume from a structured data source (e.g. JSON Resume) — adds tooling without proportional value at this scope; revisit if content updates become frequent
- Cover letter or letter-of-introduction page — out of scope for the resume milestone

## Traceability

| REQ-ID | Phase | Plan | Status |
|--------|-------|------|--------|
| RES-01 | 6 | TBD | Pending |
| RES-02 | 6 | TBD | Pending |
| RES-03 | 6 | TBD | Pending |
| RES-04 | 6 | TBD | Pending |
