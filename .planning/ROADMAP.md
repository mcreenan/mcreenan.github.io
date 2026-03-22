# Roadmap: matt.creenan.me

## Milestones

- ✅ **v1.0 Yarn to Bun Migration** — Phase 1 (shipped 2026-03-22)
- 🚧 **v2.0 Theme System** — Phases 2-5 (in progress)

## Phases

<details>
<summary>✅ v1.0 Yarn to Bun Migration (Phase 1) — SHIPPED 2026-03-22</summary>

- [x] Phase 1: Migrate to Bun (1/1 plans) — completed 2026-03-22

</details>

### 🚧 v2.0 Theme System (In Progress)

**Milestone Goal:** Add a switchable three-theme system (retro, Windows 3.1, Windows 95) where each theme authentically recreates its target OS aesthetic and sections are presented as native apps.

- [ ] **Phase 2: CSS Foundation and Theme Infrastructure** - Tokenize existing CSS and wire up theme switching machinery
- [ ] **Phase 3: Windows 3.1 Theme** - Hand-rolled flat gray chrome with period-accurate fonts and Program Manager
- [ ] **Phase 4: Windows 95 Theme** - 98.css-powered beveled chrome with taskbar
- [ ] **Phase 5: Desktop Shell and Polish** - App icon metaphor, accessibility, and switcher polish

## Phase Details

### Phase 2: CSS Foundation and Theme Infrastructure
**Goal**: The site's entire visual style is expressed through CSS custom properties and a working theme switcher lets users change themes instantly without any flash
**Depends on**: Phase 1
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, SWITCH-01, SWITCH-02, SWITCH-03
**Success Criteria** (what must be TRUE):
  1. The site looks identical to today after the CSS refactor — no visual regressions
  2. Visiting the site a second time loads in the previously selected theme with no visible flash
  3. User can click the theme switcher and the page chrome updates immediately without a page reload
  4. The active theme is visually indicated in the switcher UI
  5. Navigating between pages via View Transitions preserves the selected theme without flicker
**Plans**: 3 plans
Plans:
- [x] 02-01-PLAN.md — CSS tokenization and data-theme attribute
- [ ] 02-02-PLAN.md — Anti-flash script and View Transitions persistence
- [ ] 02-03-PLAN.md — Theme switcher dialog, buttons, and wiring

### Phase 3: Windows 3.1 Theme
**Goal**: Users can experience the site in an authentic Windows 3.1 aesthetic with flat gray chrome, solid navy title bars, and period-accurate fonts
**Depends on**: Phase 2
**Requirements**: WIN31-01, WIN31-02, WIN31-03, WIN31-04
**Success Criteria** (what must be TRUE):
  1. Switching to Windows 3.1 theme applies flat gray window chrome with thick black borders and solid navy title bars — no beveling or gradients
  2. Buttons in Windows 3.1 theme render with the raised flat gray style, not the current retro style
  3. A period-appropriate bitmap-style font is visible on UI labels and window titles
  4. The About, Work, and Contact sections appear as icon groups inside a Program Manager-style window on the desktop
**Plans**: TBD

### Phase 4: Windows 95 Theme
**Goal**: Users can experience the site in an authentic Windows 95 aesthetic using 98.css-powered beveled window chrome, a pixel font, and a taskbar
**Depends on**: Phase 3
**Requirements**: WIN95-01, WIN95-02, WIN95-03, WIN95-04, WIN95-05
**Success Criteria** (what must be TRUE):
  1. Switching to Windows 95 theme applies beveled 3D window chrome via 98.css with the classic navy-to-teal gradient title bar
  2. Buttons in Windows 95 theme render with the Win95 beveled style distinct from both the retro and Win3.1 styles
  3. The W95FA pixel font is applied to UI elements, approximating MS Sans Serif
  4. Each section (About, Work, Contact) is represented as a desktop icon that can be clicked to open it
  5. A taskbar with a Start button area and a clock is visible at the bottom of the screen
**Plans**: TBD

### Phase 5: Desktop Shell and Polish
**Goal**: The app-launcher metaphor is complete for both Windows themes, the existing retro theme is unaffected, and the switcher is keyboard-accessible and correctly positioned per theme
**Depends on**: Phase 4
**Requirements**: SHELL-01, SHELL-02, SHELL-03
**Success Criteria** (what must be TRUE):
  1. In Windows themes, each section (About, Work, Contact) is presented as a clickable desktop app icon
  2. Clicking an app icon opens the section content in a themed window overlaid on the desktop
  3. The existing retro/default theme continues to work with its current page layout unchanged
  4. The theme switcher is keyboard-navigable with visible focus states
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Migrate to Bun | v1.0 | 1/1 | Complete | 2026-03-22 |
| 2. CSS Foundation and Theme Infrastructure | v2.0 | 1/3 | In Progress|  |
| 3. Windows 3.1 Theme | v2.0 | 0/TBD | Not started | - |
| 4. Windows 95 Theme | v2.0 | 0/TBD | Not started | - |
| 5. Desktop Shell and Polish | v2.0 | 0/TBD | Not started | - |
