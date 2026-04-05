---
phase: quick
plan: 260405-cvh
type: execute
wave: 1
depends_on: []
files_modified: [src/styles/global.css]
autonomous: false
requirements: [QUICK-260405-cvh-scale-win31-win95]
must_haves:
  truths:
    - "Win 3.1 theme UI chrome is ~3-4x larger than before on high-DPI displays"
    - "Win 95 theme UI chrome is ~3-4x larger than before on high-DPI displays"
    - "Win 3.1 taskbar/title bar buttons and text are readable and proportional at new scale"
    - "Win 95 taskbar (28px→~80px) dominates the bottom of the screen authentically but at a comfortable modern size"
    - "Retro theme is visually unchanged"
    - "Font sizes scaled ~1.5-2x (not 4x), UI chrome scaled ~3-4x, proportions feel balanced"
    - "16-color palettes and borders/bevels preserved — only dimensions change"
  artifacts:
    - path: "src/styles/global.css"
      provides: "Scaled pixel values under [data-theme=\"win31\"] and [data-theme=\"win95\"] selectors"
      contains: "data-theme=\"win31\""
  key_links:
    - from: "[data-theme=\"win31\"] blocks"
      to: "Win 3.1 Program Manager + windows rendering"
      via: "pm-icon-grid, pm-icon, window-titlebar, win31-chrome-btn, menubar"
      pattern: "data-theme=.win31."
    - from: "[data-theme=\"win95\"] blocks"
      to: "Win 95 taskbar + desktop + windows rendering"
      via: "win95-taskbar, win95-start-btn, title-bar, title-bar-controls, win95-icon"
      pattern: "data-theme=.win95."
---

<objective>
Scale pixel-based dimensions in the `[data-theme="win31"]` and `[data-theme="win95"]` CSS blocks (plus unscoped `.win95-taskbar` / `.win95-start-btn` / `.win95-icon*` classes that only render under win95) so the themes feel right on modern retina/4K displays. UI chrome multiplies ~3-4x; fonts grow ~1.5-2x. Retro theme and global base styles are untouched.

Purpose: Authentic 1990s pixel sizes (28px taskbar, 48px icons, 11px font) look miniscule on high-DPI screens. Scaling restores the intended visual weight without breaking the 16-color pixel aesthetic.
Output: Updated `src/styles/global.css` with scaled win31/win95 dimensions; visual verification across all themes.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@./CLAUDE.md
@src/styles/global.css

<interfaces>
Relevant selectors and their current pixel values (discovered via grep):

### [data-theme="win31"] (lines 77-509)

Body / windows:
- .window: `border: 2px`, `outline: 1px`, `inset 0 0 0 1px` — leave borders, scale nothing here
- .splash-screen: `padding: 1px`, `border: 2px`, `outline: 1px`
- .window-titlebar: `font-size: 16px`
- .window-title: `font-size: 16px`
- .window-content: `font-size: 17px`, `border: 1px` on all sides
- .headshot-image: `border: 2px`
- .theme-dialog-content: `padding: 8px`, `gap: 8px`, `border: 2px`, `outline: 1px`
- .theme-dialog-title: `font-size: 16px`
- .theme-option: `font-size: 16px`, `padding: 3px 4px`

Menubar / Program Manager:
- .menubar: `font-size: 16px`, `height: 22px`, `border-bottom: 1px`
- .menubar-item: `padding: 2px 10px`
- .menubar-dropdown: `border: 1px`, `padding: 2px 0`, `min-width: 160px`
- .menubar-dropdown button: `padding: 3px 16px`, `font-size: 16px`
- .pm-icon-grid: `gap: 16px`, `padding: 16px 12px`, `min-height: 120px`, `border: 1px` (4 sides)
- .pm-icon: `gap: 4px`, `padding: 4px`
- .pm-icon-label: `font-size: 15px`
- .win31-chrome-btn: `font-size: 9px`, `border: 1px`, `aspect-ratio: 1 / 1` (size follows titlebar height)
- .win31-titlebar-center: `font-size: 16px`
- .window-content::-webkit-scrollbar: `width: 16px`

### [data-theme="win95"] + unscoped win95-only classes (lines 512-807)

Window chrome:
- .window: `padding: 3px`, box-shadow uses 1px/2px insets
- .title-bar: `padding: 3px 2px 3px 3px`
- .title-bar-text: `font-size: 12px`, `margin-right: 24px`
- .title-bar-controls button: `min-width: 16px`, `min-height: 14px`, plus SVG icon background-position offsets (3px/4px) and `margin-left: 2px` on Close
- .button: `font-size: 11px`, 1px/2px inset box-shadow
- .splash-screen: `padding: 3px`, 1px/2px inset box-shadow
- .window-body: `padding: 8px`, `border: 2px groove`
- .headshot-image: `border: 2px`
- .theme-dialog-title: `font-size: 12px`
- .theme-option: `font-size: 12px`, `padding: 3px 4px`
- body: `font-size: 14px`

Taskbar (unscoped — only shown under win95):
- .win95-taskbar: `height: 28px`, `padding: 2px`, `gap: 4px`, `font-size: 11px`
- .win95-start-btn: `padding: 2px 6px`, `min-height: 22px`, `font-size: 11px`
- .win95-start-flag: `width: 16px`, `height: 14px`
- .win95-tray: `padding: 2px 8px`, `min-height: 18px`
- .win95-clock: `font-size: 11px`
- .win95-desktop: `gap: 24px`, `padding-bottom: 28px` (matches taskbar height — MUST stay in sync)
- .win95-icon: `gap: 4px`, `padding: 4px`
- .win95-icon-label: `font-size: 12px`, 1px text-shadow offsets (4 corners)
- .win95-window .content-window: `padding-bottom: 28px` (matches taskbar height)

Overlay (win95 scoped, lines 1260-1273):
- [data-theme="win95"] #overlay-window: `bottom: 28px` (MUST stay in sync with taskbar height)

### Scaling guide (from constraints)

| Category | Multiplier | Examples |
|----------|------------|----------|
| Taskbar / icons / UI chrome | ~3-4x | 28px → 80px, 48px → 80-96px, 22px → 64-80px |
| Fonts | ~1.5-2x | 11px → 18px, 12px → 20px, 14px → 22px, 16px → 26-28px, 17px → 28px, 9px → 14-16px |
| Padding / gaps | ~3-4x | 4px → 12-16px, 8px → 24-32px, 16px → 48px, 24px → 72px |
| 1px/2px decorative borders + bevel insets | 1x (keep) | Preserves the 16-color pixel bevel look |
| Min widths / positioning offsets (margin-right, svg bg-position) | ~3-4x | 16px → 48-64px, 24px → 72px |

**CRITICAL invariants:** the three `28px` values (.win95-taskbar height, .win95-desktop padding-bottom, .win95-window .content-window padding-bottom, [data-theme="win95"] #overlay-window bottom) MUST all change to the same new value. Taskbar height and the bottom-padding offsets are a coupled system.

**Preserve:** 16-color palettes, bevel box-shadows (inset 1px/2px), 1px/2px borders that create the 3D chrome effect. Only scale layout dimensions and font-sizes.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Scale [data-theme="win31"] pixel values in global.css</name>
  <files>src/styles/global.css</files>
  <action>
Edit every pixel dimension inside `[data-theme="win31"]` selectors (lines 77-509) and the `.win31-titlebar-*` unscoped defaults (lines 342-343) per the scaling guide in `<interfaces>`. Apply these specific changes:

**Fonts (~1.5-2x):**
- .window-titlebar `font-size: 16px` → `28px`
- .window-title `font-size: 16px` → `28px`
- .window-content `font-size: 17px` → `28px`
- .theme-dialog-title `font-size: 16px` → `26px`
- .theme-option `font-size: 16px` → `26px`
- .menubar `font-size: 16px` → `26px`, `height: 22px` → `44px`
- .menubar-dropdown button `font-size: 16px` → `26px`
- .pm-icon-label `font-size: 15px` → `24px`
- .win31-chrome-btn `font-size: 9px` → `16px`
- .win31-titlebar-center `font-size: 16px` → `28px`

**Padding / gaps / min-sizes (~3-4x):**
- .theme-dialog-content `padding: 8px` → `24px`, `gap: 8px` → `24px` (keep border/outline at 2px/1px)
- .theme-option `padding: 3px 4px` → `10px 14px`
- .menubar-item `padding: 2px 10px` → `8px 32px`
- .menubar-dropdown `padding: 2px 0` → `8px 0`, `min-width: 160px` → `480px`
- .menubar-dropdown button `padding: 3px 16px` → `10px 48px`
- .pm-icon-grid `gap: 16px` → `48px`, `padding: 16px 12px` → `48px 36px`, `min-height: 120px` → `360px`
- .pm-icon `gap: 4px` → `12px`, `padding: 4px` → `12px`
- .window-content::-webkit-scrollbar `width: 16px` → `48px`

**Leave unchanged (preserve pixel bevel aesthetic):**
- All `border: 1px`/`border: 2px` declarations
- All `outline: 1px` declarations
- All `box-shadow: inset 0 0 0 1px` / `inset 1px 1px 0 0` declarations
- `.splash-screen padding: 1px` (it's a border hack)
- Color values

After edits, run `bun run build` to verify no CSS syntax errors introduced.
  </action>
  <verify>
    <automated>bun run build 2>&1 | tail -20</automated>
  </verify>
  <done>All pixel values listed above are updated in src/styles/global.css; `bun run build` completes without errors; only lines inside `[data-theme="win31"]` blocks (plus the .win31-titlebar-left/-right defaults at lines 342-343 if they had pixel values, which they don't) are modified.</done>
</task>

<task type="auto">
  <name>Task 2: Scale [data-theme="win95"] + unscoped win95 pixel values in global.css</name>
  <files>src/styles/global.css</files>
  <action>
Edit every pixel dimension inside `[data-theme="win95"]` selectors (lines 512-807, plus lines 1260-1273 overlay) AND the unscoped `.win95-*` classes (`.win95-taskbar` at line 679, `.win95-start-btn`, `.win95-start-flag`, `.win95-tray`, `.win95-clock`, `.win95-icon`, `.win95-icon-label`) since they only render under win95 theme. Apply:

**Fonts (~1.5-2x):**
- [data-theme="win95"] body `font-size: 14px` → `22px`
- .title-bar-text `font-size: 12px` → `20px`, `margin-right: 24px` → `72px`
- .button `font-size: 11px` → `18px`
- .theme-dialog-title `font-size: 12px` → `20px`
- .theme-option `font-size: 12px` → `20px`, `padding: 3px 4px` → `10px 14px`
- .win95-taskbar `font-size: 11px` → `18px`
- .win95-start-btn `font-size: 11px` → `18px`
- .win95-clock `font-size: 11px` → `18px`
- .win95-icon-label `font-size: 12px` → `20px`

**Taskbar + coupled offsets (MUST all stay in sync, 28px → 80px):**
- .win95-taskbar `height: 28px` → `80px`
- [data-theme="win95"] .win95-desktop `padding-bottom: 28px` → `80px`
- [data-theme="win95"] .win95-window .content-window `padding-bottom: 28px` → `80px`
- [data-theme="win95"] #overlay-window `bottom: 28px` → `80px`

**Taskbar internals (~3-4x):**
- .win95-taskbar `padding: 2px` → `6px`, `gap: 4px` → `12px`
- .win95-start-btn `padding: 2px 6px` → `6px 18px`, `min-height: 22px` → `64px`
- .win95-start-btn:active `padding: 3px 5px 1px 7px` → `7px 17px 5px 19px` (keep 1px offset character)
- .win95-start-flag `width: 16px` → `48px`, `height: 14px` → `42px`
- .win95-tray `padding: 2px 8px` → `6px 24px`, `min-height: 18px` → `54px`

**Desktop icons (~3-4x):**
- .win95-desktop `gap: 24px` → `72px`
- .win95-icon `gap: 4px` → `12px`, `padding: 4px` → `12px`

**Title bar + window chrome (~3-4x for padding, keep bevel borders):**
- [data-theme="win95"] .window `padding: 3px` → `10px`
- .title-bar `padding: 3px 2px 3px 3px` → `10px 6px 10px 10px`
- .title-bar-controls button `min-width: 16px` → `48px`, `min-height: 14px` → `42px`
- .title-bar-controls button[aria-label="Minimize"] `background-position: bottom 3px left 4px` → `bottom 10px left 14px`
- .title-bar-controls button[aria-label="Maximize"] `background-position: top 2px left 3px` → `top 6px left 10px`
- .title-bar-controls button[aria-label="Close"] `background-position: top 3px left 4px` → `top 10px left 14px`, `margin-left: 2px` → `6px`
- .splash-screen `padding: 3px` → `10px`
- .window-body `padding: 8px` → `24px`
- .theme-dialog-content `padding: 8px` → `24px`, `gap: 8px` → `24px`
- [data-theme="win95"] .overlay-chrome-win95 .window-body `padding: 1rem` — leave (rem, not px)

**Leave unchanged (preserve pixel bevel aesthetic):**
- All `box-shadow: inset -1px -1px / 1px 1px / -2px -2px / 2px 2px` declarations (the 3D bevel)
- `.headshot-image border: 2px`
- `.window-body border: 2px groove`
- `.win95-icon-label text-shadow` 1px offsets
- `.win95-tray box-shadow` 1px insets
- Color values

**CRITICAL:** The 80px taskbar height MUST match in all four places (taskbar, desktop padding-bottom, window content padding-bottom, overlay bottom). Do a final grep for `28px` in win95 blocks before finishing.

After edits, run `bun run build`.
  </action>
  <verify>
    <automated>bun run build 2>&1 | tail -20</automated>
  </verify>
  <done>All pixel values listed above are updated; `bun run build` completes without errors; all four 28px→80px coupled values are in sync; no `[data-theme="retro"]` rules or global base styles (lines 1-76, 165-178 body overrides, 809+ body) were touched.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Visually verify scaling across all themes</name>
  <what-built>Win 3.1 and Win 95 theme dimensions scaled ~3-4x (UI chrome) and ~1.5-2x (fonts) to feel right on retina/4K displays. Retro theme untouched.</what-built>
  <how-to-verify>
1. Start dev server: `bun run dev`
2. Open http://localhost:4321 at normal browser zoom (100%) on a high-DPI display
3. **Retro theme (should be UNCHANGED):** Open theme dialog, select Retro. Confirm visual appearance matches previous behavior — same font sizes, same window chrome, same desktop icons.
4. **Win 3.1 theme:** Switch to Win 3.1. Confirm:
   - Program Manager window title bar, menubar, and pm-icons look appropriately larger (~3-4x chrome)
   - Menu dropdown items are comfortably clickable
   - Title bar buttons (chrome min/max/close) are square and proportional to titlebar height
   - Font is readable but still has pixel character (not ballooned)
   - Navigate to /about, /work, /contact — content text readable at new 28px size
5. **Win 95 theme:** Switch to Win 95. Confirm:
   - Taskbar dominates bottom ~80px, Start button visually anchored
   - Start flag icon scales with taskbar
   - Clock in tray is readable
   - Desktop icons are larger with readable labels
   - Window title bars + min/max/close buttons are proportional (not tiny, not gigantic)
   - Content doesn't get hidden behind taskbar on any subpage
   - Theme dialog scales appropriately
6. **Cross-theme:** Open theme dialog under each theme — confirm dialog sizing feels native to that theme.

If anything looks off (fonts too large/small, chrome off-proportion, content hidden behind taskbar, coupled taskbar offsets out of sync), describe the issue and I'll adjust values.
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues to fix</resume-signal>
</task>

</tasks>

<verification>
- `bun run build` succeeds with no CSS errors
- Retro theme is visually identical to before (zero delta)
- Win 3.1 + Win 95 chrome and fonts scale appropriately on high-DPI displays
- Taskbar height and all coupled bottom-offsets remain in sync (80px everywhere)
- 16-color palettes and bevel borders preserved
</verification>

<success_criteria>
All pixel dimensions in win31/win95 CSS scoped blocks (and unscoped win95-only classes) scaled per the scaling guide. Build passes. Human verification confirms visual improvement on retina/4K displays without breaking the retro theme or the pixel-bevel aesthetic.
</success_criteria>

<output>
After completion, create `.planning/quick/260405-cvh-scale-win-3-1-and-win-95-theme-pixel-val/260405-cvh-SUMMARY.md`
</output>
