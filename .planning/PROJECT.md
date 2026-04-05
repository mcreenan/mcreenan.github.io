# matt.creenan.me

## What This Is

Personal site (matt.creenan.me) — an Astro-based static site deployed to GitHub Pages with a switchable three-theme desktop OS aesthetic. Users can switch between retro, Windows 3.1, and Windows 95 themes, each providing authentic OS chrome. The Windows themes present sections as clickable desktop app icons that open in themed overlay windows.

## Core Value

A theme-switchable personal site where each theme authentically recreates its target OS aesthetic, with sections presented as native-feeling apps within each theme's window chrome.

## Current State

**Shipped:** v2.0 Theme System (2026-04-05)

Three fully-functional themes with authentic period-accurate chrome:
- **Retro** (default): Original teal desktop with pixel grid, Roboto/Montserrat fonts
- **Windows 3.1**: Flat gray chrome, navy title bars, MS Sans Serif bitmap font, Program Manager with icon groups
- **Windows 95**: 98.css beveled chrome, navy-to-teal gradient title bars, W95FA font, taskbar with Start button and live clock, desktop icons

Overlay window system in Windows themes: clicking a desktop icon fetches the target page and displays content in a themed overlay with History API URL sync, focus trap, and full keyboard accessibility (Escape, close button, click outside, back button).

## Requirements

### Validated

- ✓ Replace yarn.lock with bun.lock — v1.0
- ✓ Update CI workflow to use Bun instead of Yarn/Node — v1.0
- ✓ Remove Yarn-specific artifacts — v1.0
- ✓ Verify local dev, build, and preview commands work with Bun — v1.0
- ✓ Astro static site builds and deploys correctly — existing
- ✓ Dev server runs locally — existing
- ✓ GitHub Pages deployment via GitHub Actions — existing
- ✓ All hardcoded CSS values converted to CSS custom properties — v2.0
- ✓ Theme state managed via data-theme attribute — v2.0
- ✓ Anti-flash inline script — v2.0
- ✓ Theme persists across sessions via localStorage — v2.0
- ✓ Theme survives Astro View Transitions — v2.0
- ✓ Theme switcher accessible from all pages — v2.0
- ✓ Switcher indicates active theme — v2.0
- ✓ Switcher keyboard-accessible — v2.0
- ✓ Windows 3.1 theme with flat gray chrome, navy title bars, bitmap font, Program Manager — v2.0
- ✓ Windows 95 theme with beveled chrome, pixel font, desktop icons, taskbar — v2.0
- ✓ Desktop icons open content as overlay windows in Windows themes — v2.0
- ✓ Retro theme unchanged with existing page layout — v2.0

### Active

(None — no current milestone)

### Out of Scope

- Switching away from Astro — framework stays the same
- Adding ESLint/Prettier/Biome — not currently used, not adding
- Using Bun as runtime (replacing Node.js) — Astro expects Node.js runtime
- Mobile-native theme variants — responsive but not separate mobile themes
- Draggable/resizable windows — high complexity, not core to theme authenticity
- Multiple simultaneous overlay windows — one content view at a time
- Functional Start menu — decorative only, theme switcher has its own access points

## Context

Shipped v2.0 Theme System with ~800 LOC added to global.css and 5 new components (ProgramManager, Win95Desktop, Taskbar, ThemeDialog, ThemesIcon). Tech stack: Astro 4.16.8, Tailwind CSS, MDX, TypeScript, 98.css (for Win95 chrome), MS Sans Serif + W95FA bitmap fonts.

Three themes share the same page content via CSS display toggles — `.retro-layout`, `.program-manager`, and `.win95-desktop` are all rendered and toggled by `[data-theme="..."]` selectors. Theme switching is instant (no animation), persistent (localStorage), and flash-free (anti-flash inline script).

## Constraints

- **Deployment**: GitHub Pages via GitHub Actions
- **Compatibility**: Bun supports all current Astro integrations
- **CI**: `withastro/action@v2` configured with `package-manager: bun@latest`
- **Theme authenticity**: Each theme uses period-accurate chrome, fonts, and colors from its target OS era

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Bun as package manager only (not runtime) | Astro expects Node.js runtime; Bun as PM is drop-in | ✓ Good |
| bun.lock text format (not binary bun.lockb) | Bun 1.3.9 default | ✓ Good |
| Explicit package-manager config in deploy.yml | withastro/action@v2 does NOT auto-detect Bun | ✓ Good |
| CSS custom properties + data-theme attribute | Industry standard, zero-JS theme switching | ✓ Good |
| 98.css scoped under [data-theme="win95"] | Avoids global class collision with existing .window | ✓ Good |
| Variant prop on Window.astro | Allows structurally different chrome per theme | ✓ Good |
| MS Sans Serif for Win 3.1, W95FA for Win 95 | Period-accurate differentiation — Win 3.1 used bitmap MS Sans Serif, Win 95 used TrueType | ✓ Good |
| Fetch-based overlays with History API | Progressive enhancement — works without JS via fallback navigation | ✓ Good |
| :focus-visible for keyboard-only focus rings | Standard accessibility pattern, prevents mouse focus flash | ✓ Good |
| CSS display toggle (not conditional rendering) | Simpler, no hydration required, all layouts in static HTML | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-04-05 after v2.0 milestone — three-theme desktop OS aesthetic with overlay windows*
