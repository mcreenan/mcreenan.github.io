# Requirements: matt.creenan.me

**Defined:** 2026-03-21
**Core Value:** A theme-switchable personal site where each theme authentically recreates its target OS aesthetic.

## v2.0 Requirements

Requirements for theme system release. Each maps to roadmap phases.

### Theme Infrastructure

- [x] **INFRA-01**: All hardcoded CSS values in global.css converted to CSS custom properties
- [x] **INFRA-02**: Theme state managed via data-theme attribute on `<html>` element
- [x] **INFRA-03**: Anti-flash inline script prevents theme flash on page load
- [x] **INFRA-04**: Theme persists across sessions via localStorage
- [x] **INFRA-05**: Theme state survives Astro View Transitions page navigation

### Theme Switcher

- [ ] **SWITCH-01**: User can switch between three themes from any page
- [ ] **SWITCH-02**: Switcher visually indicates which theme is currently active
- [ ] **SWITCH-03**: Switcher is keyboard-accessible

### Windows 3.1 Theme

- [ ] **WIN31-01**: Windows have flat gray chrome with solid navy title bars and 2px black borders
- [ ] **WIN31-02**: Buttons render with flat Win3.1 style (raised gray, black border)
- [ ] **WIN31-03**: Period-appropriate bitmap-style font applied to UI elements
- [ ] **WIN31-04**: Desktop shows Program Manager window with icon groups for each section

### Windows 95 Theme

- [ ] **WIN95-01**: Windows have beveled 3D chrome via 98.css with proper shadows
- [ ] **WIN95-02**: Buttons render with Win95 beveled style
- [ ] **WIN95-03**: Pixel font (W95FA) applied to UI elements for MS Sans Serif look
- [ ] **WIN95-04**: Desktop shows icons for each section that open as themed windows
- [ ] **WIN95-05**: Taskbar with Start button area and clock displayed at bottom

### Desktop Shell

- [ ] **SHELL-01**: Each section (About, Work, Contact) presented as a clickable app icon on the desktop
- [ ] **SHELL-02**: Clicking an app icon opens the section content in a themed window
- [ ] **SHELL-03**: Current/default theme continues to work with existing page layout

## Future Requirements

### Theme Enhancements

- **THEME-01**: Smooth CSS transition animation when switching themes
- **THEME-02**: Theme-specific cursor styles
- **THEME-03**: Theme-specific sound effects on interactions
- **THEME-04**: Additional themes (Mac OS 9, Linux/GNOME)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Draggable/resizable windows | High complexity, not core to theme authenticity |
| Multi-window management | Scope explosion — one maximized window per section is sufficient |
| Mobile-native theme variants | Responsive but not separate mobile themes |
| Theme creation API | This is a personal site, not a platform |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 2 | Complete |
| INFRA-02 | Phase 2 | Complete |
| INFRA-03 | Phase 2 | Complete |
| INFRA-04 | Phase 2 | Complete |
| INFRA-05 | Phase 2 | Complete |
| SWITCH-01 | Phase 2 | Pending |
| SWITCH-02 | Phase 2 | Pending |
| SWITCH-03 | Phase 2 | Pending |
| WIN31-01 | Phase 3 | Pending |
| WIN31-02 | Phase 3 | Pending |
| WIN31-03 | Phase 3 | Pending |
| WIN31-04 | Phase 3 | Pending |
| WIN95-01 | Phase 4 | Pending |
| WIN95-02 | Phase 4 | Pending |
| WIN95-03 | Phase 4 | Pending |
| WIN95-04 | Phase 4 | Pending |
| WIN95-05 | Phase 4 | Pending |
| SHELL-01 | Phase 5 | Pending |
| SHELL-02 | Phase 5 | Pending |
| SHELL-03 | Phase 5 | Pending |

**Coverage:**
- v2.0 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 after roadmap creation*
