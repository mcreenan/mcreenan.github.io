# Phase 5: Desktop Shell and Polish - Research

**Researched:** 2026-04-04
**Domain:** Client-side JavaScript overlay system, focus management, History API, progressive enhancement in Astro
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Overlay Window Behavior**
- D-01: Overlay windows fetch page content via JS — Astro pages serve static HTML, fetch the page, extract `.window-content`, render in a themed overlay div on the desktop
- D-02: Keep page navigation as fallback — icons navigate normally if JS fails; with JS, click is intercepted to show overlay. Progressive enhancement.
- D-03: Update URL with History API (pushState to /about, /work, /contact) — back button closes overlay, direct URL access loads the full page normally
- D-04: Overlays are dismissible via click outside, Escape key, or close button in title bar

**Keyboard Accessibility**
- D-05: Theme switcher: Tab to reach dialog trigger, Enter to open, arrow keys between theme options, Escape to close — standard dialog keyboard pattern (native `<dialog>` handles most of this)
- D-06: Desktop icons are keyboard-navigable with Tab and visible focus ring — `tabindex="0"` and `:focus-visible` styles on icon grid items
- D-07: Overlay windows trap focus when open — standard modal accessibility pattern, focus returns to trigger element on close

**Cross-Theme Polish**
- D-08: Theme switcher position is consistent per theme — palette icon (retro), Options menu (win31), right-click (win95) are already theme-specific access points; no changes needed
- D-09: No animation when switching themes — instant switch matches authentic OS feel
- D-10: No extra visual indicator of current theme — the entire visual chrome IS the indicator

### Claude's Discretion
- Overlay window positioning and sizing (centered, max-width, scrollable content area)
- Focus trap implementation approach (manual JS or use a lightweight library)
- How overlay content is extracted from fetched pages (querySelector strategy)
- History API popstate handler implementation details
- How to handle overlay state during View Transitions
- Desktop icon focus ring styling per theme (consistent or theme-specific)

### Deferred Ideas (OUT OF SCOPE)
- Draggable/resizable overlay windows — Out of Scope per REQUIREMENTS.md
- Multiple simultaneous overlay windows — Out of Scope
- Minimize to taskbar — Future enhancement
- Theme-specific cursor styles — THEME-02 in future requirements
- Transition animations between themes — D-09 explicitly deferred
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SHELL-01 | Each section (About, Work, Contact) presented as a clickable app icon on the desktop | Desktop icons already exist in ProgramManager.astro (win31) and Win95Desktop.astro (win95); requires JS intercept layer and tabindex/focus-visible polish |
| SHELL-02 | Clicking an app icon opens the section content in a themed window | Requires overlay container, fetch+extract pattern, themed window markup reusing existing CSS classes, History API pushState |
| SHELL-03 | Current/default theme continues to work with existing page layout unchanged | Retro layout uses page navigation already; overlay JS must be gated behind theme check |
</phase_requirements>

---

## Summary

Phase 5 completes the desktop app-launcher metaphor for Windows themes. The core deliverable is a client-side overlay system: when a win31 or win95 desktop icon is clicked, JS intercepts the navigation, fetches the target page (`/about`, `/work`, `/contact`), extracts `.window-content` from the response HTML, and renders it inside a themed overlay window positioned over the desktop. URL updates via `history.pushState`, focus is trapped inside the overlay, and closing restores focus to the originating icon and pops the URL state.

The retro theme uses standard Astro page navigation and must be left entirely untouched. The overlay code must be conditional on the active theme (`[data-theme="win31"]` or `[data-theme="win95"]`). All overlay logic is client-side JS added to `index.astro` — the static pages already contain the content markup needed, and the existing `.window-content` CSS class is the extraction target.

Focus trap is a well-understood pattern that can be implemented in ~30 lines of vanilla JS, covering Tab/Shift+Tab cycling within focusable elements inside the overlay. The existing `ThemeDialog.astro` already demonstrates the `<dialog>` native focus trap model; the overlay window uses a `<div>` with role="dialog" and manual focus management rather than a native `<dialog>` (to allow custom window chrome positioning).

**Primary recommendation:** Implement the overlay as a single `<div id="overlay-window">` appended to `index.astro`, styled with existing window chrome CSS classes, controlled by a ~100-line vanilla JS module. No external dependencies required.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JS (ES2020) | — | Overlay controller, focus trap, History API | No dependency needed; all required APIs are native browser |
| Fetch API | — | Fetch static page HTML for content extraction | Native browser, no polyfill needed for target browsers |
| History API (pushState/popstate) | — | URL sync for overlay open/close | Native browser; Astro's View Transitions wraps this but it still works directly on `index.astro` |
| `<dialog>` (native) | — | Theme switcher modal (already in use) | Already used in ThemeDialog.astro; no change needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS `display` toggle | — | Show/hide overlay, theme-gated visibility | Theme-conditional overlay: `[data-theme="win31"] #overlay-window.open { display: block }` |
| `tabindex="0"` + `:focus-visible` | — | Make desktop icons keyboard-navigable | Add to `.pm-icon` and `.win95-icon` if not already present |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vanilla JS focus trap | focus-trap npm package (1.3kb) | Package adds a dep; ~30 lines of hand-rolled code covers the exact use case; use package only if cycle detection becomes fragile |
| Fetch + extract | Inline content duplication in index.astro | Inline avoids fetch latency but duplicates markup; fetch stays DRY and matches CONTEXT D-01 |
| `<dialog>` for overlay | `<div role="dialog">` | Native `<dialog>` handles some focus trap automatically but constrains positioning; div gives full control over window chrome placement within the desktop background |

**Installation:** No new packages required. [VERIFIED: codebase — package.json has no new deps needed]

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── ProgramManager.astro    # win31 icons — add tabindex, data-page attributes
│   ├── Win95Desktop.astro      # win95 icons — add tabindex, data-page attributes
│   └── Window.astro            # add variant="overlay" or reuse win31/win95 chrome inline
├── pages/
│   └── index.astro             # add overlay container div + <script> overlay controller
└── styles/
    └── global.css              # add overlay positioning, backdrop, focus ring styles
```

### Pattern 1: Progressive Enhancement Click Intercept

**What:** Icons have normal `href` anchors. A JS event listener on the container intercepts clicks, calls `event.preventDefault()`, and triggers the overlay instead.

**When to use:** Required for D-02 (JS-off fallback). The anchor already navigates correctly without JS; with JS, click is replaced by overlay open.

**Example:**
```javascript
// Source: [VERIFIED: codebase pattern — ThemeDialog uses same event delegation approach]
function initDesktopOverlay() {
  // Gate: only activate for Windows themes
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme !== 'win31' && theme !== 'win95') return;

  const iconContainers = document.querySelectorAll('.pm-icon, .win95-icon');
  iconContainers.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      const href = icon.getAttribute('href');
      openOverlay(href, icon);
    });
  });
}
```

### Pattern 2: Fetch + Extract Content

**What:** Fetch the target static page, parse response HTML, extract content from `.window-content` selector.

**When to use:** Required per D-01.

**Example:**
```javascript
// Source: [ASSUMED — standard fetch/DOMParser pattern]
async function loadContent(url) {
  const res = await fetch(url);
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.querySelector('.window-content');
}
```

**Key insight on selector strategy:** The subpages (`about.astro`, `work.astro`, `contact.astro`) already use `.window-content` as the inner scrollable content area. This is the correct extraction target — it contains only body text, no window chrome. The title text can be taken from `.window-title` (win31) or `.title-bar-text` (win95) elements, or derived from the URL path.

### Pattern 3: Overlay Container with Themed Window Chrome

**What:** A single `<div id="overlay-window">` in `index.astro` acts as the overlay host. It uses existing window CSS classes per theme. The overlay is hidden by default and shown via an `.open` class toggle.

**When to use:** Required for SHELL-02.

**Example:**
```html
<!-- Add to index.astro, after Win95Desktop and ProgramManager -->
<div id="overlay-window" role="dialog" aria-modal="true" aria-label="Content" hidden>
  <!-- win31 chrome: uses .window .splash-screen structure from Window.astro -->
  <div class="overlay-chrome-win31 window splash-screen">
    <div class="window-titlebar">
      <div class="win31-titlebar-left">
        <button class="win31-chrome-btn overlay-close" aria-label="Close">-</button>
      </div>
      <span class="window-title overlay-title">Title</span>
      <div class="win31-titlebar-right">
        <span class="win31-chrome-btn win31-btn-raised" aria-hidden="true">▲</span>
        <span class="win31-chrome-btn win31-btn-raised" aria-hidden="true">▼</span>
      </div>
    </div>
    <div class="window-inner"><div class="window-content overlay-body"></div></div>
  </div>
  <!-- win95 chrome: uses .window .title-bar structure -->
  <div class="overlay-chrome-win95 window splash-screen">
    <div class="title-bar">
      <div class="title-bar-text overlay-title"></div>
      <div class="title-bar-controls">
        <button aria-label="Minimize" type="button"></button>
        <button aria-label="Maximize" type="button"></button>
        <button class="overlay-close" aria-label="Close" type="button"></button>
      </div>
    </div>
    <div class="window-body overlay-body"></div>
  </div>
</div>
```

**Alternative approach:** A single chrome set that conditionally applies win31 or win95 classes based on `data-theme` at open-time. This avoids duplicate markup but requires toggling multiple classes. Both approaches are valid — the planner should choose based on which is easier to keep in sync with existing Window.astro markup.

### Pattern 4: Focus Trap

**What:** While overlay is open, Tab and Shift+Tab cycle through focusable elements within the overlay. Focus does not escape to the desktop.

**When to use:** Required per D-07.

**Example:**
```javascript
// Source: [ASSUMED — standard focus trap pattern, well-established]
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trapFocus(container, event) {
  if (event.key !== 'Tab') return;
  const els = [...container.querySelectorAll(FOCUSABLE)];
  if (!els.length) return;
  const first = els[0];
  const last = els[els.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
```

### Pattern 5: History API + popstate for Back-Button Close

**What:** `pushState` on overlay open; `popstate` listener calls `closeOverlay()`.

**When to use:** Required per D-03.

**Example:**
```javascript
// Source: [ASSUMED — standard History API pattern]
function openOverlay(url, triggerEl) {
  history.pushState({ overlayUrl: url }, '', url);
  // ... show overlay
}

window.addEventListener('popstate', (e) => {
  if (overlayIsOpen) {
    closeOverlay(); // does NOT call history.back() again — popstate already changed state
  }
});
```

**Critical nuance:** `popstate` fires AFTER the URL has already changed. `closeOverlay()` must NOT call `history.back()` in the popstate handler, otherwise double-back occurs. Closing via Escape/click/close button DOES call `history.back()` to match the URL.

### Pattern 6: Re-initialization After View Transitions

**What:** Astro View Transitions replaces DOM on page navigation. The overlay JS must re-attach event listeners after `astro:after-swap`.

**When to use:** Required. The existing Taskbar and ThemeDialog already use this pattern.

**Example:**
```javascript
// Source: [VERIFIED: codebase — Taskbar.astro line 38-40, ThemeDialog.astro line 57]
document.addEventListener('astro:after-swap', initDesktopOverlay);
initDesktopOverlay();
```

**Note:** If navigating away while an overlay is open (unlikely since overlay only appears on index), overlay state must be cleaned up. The `astro:before-swap` event can be used for cleanup.

### Anti-Patterns to Avoid

- **Duplicating page content inline in index.astro:** Maintenance burden — two copies of About/Work/Contact text drift out of sync. The fetch approach (D-01) is the correct pattern.
- **Using native `<dialog>` for the overlay window:** `<dialog>` elements render in the top layer via the browser, which means they overlay all z-index stacking contexts — useful for the theme picker, but it also means you can't position them relative to the desktop background. The overlay window needs to appear ON the desktop, not above everything including the taskbar.
- **Attaching popstate without guarding against non-overlay popstate events:** Check `event.state?.overlayUrl` before calling `closeOverlay()`.
- **Calling `history.back()` in the popstate handler:** This causes double-navigation. Only call `history.back()` in the close-button/Escape/click-outside handler.
- **Calling `fetch()` on every icon click without caching:** The content is static HTML — cache the parsed result in a `Map<url, HTMLElement>` to avoid re-fetching.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal focus trap | Complex MutationObserver-based focus guard | 30-line standard Tab/Shift+Tab listener | The pattern is fully specified; mutation observer overkill for static content |
| Theme detection | Re-reading localStorage on every click | Read `document.documentElement.dataset.theme` | Already set as `data-theme` on `<html>` by existing BaseHead anti-flash script |
| URL title update | Custom title injection | Let the overlay title span reflect the page path; no `document.title` change needed | History API pushState second arg (title) is ignored by all browsers; avoid confusion |

**Key insight:** Every CSS class and structural pattern needed for the overlay already exists in global.css and Window.astro. This phase is primarily about writing ~100–150 lines of vanilla JS and wiring existing markup/styles — not building new CSS systems.

---

## Common Pitfalls

### Pitfall 1: View Transitions Conflict with pushState

**What goes wrong:** Astro's View Transitions intercepts anchor navigations and replaces DOM. If an icon click is not properly `preventDefault()`-ed before Astro intercepts it, the View Transition fires instead of the overlay opening. Conversely, `history.pushState()` from the overlay script triggers a re-render in some Astro VT configurations.

**Why it happens:** Astro's View Transitions add a global `click` listener on `<a>` tags that fires before the page-level listener if the event propagates.

**How to avoid:** Call `event.preventDefault()` AND `event.stopPropagation()` in the icon click handler to prevent Astro VT from intercepting it. Test in both JS-on and JS-off mode.

**Warning signs:** Page navigates to `/about` instead of showing overlay; or page flashes during overlay open.

### Pitfall 2: CSS display:none Hides Content from Screen Readers

**What goes wrong:** The overlay-window div uses `display: none` / `hidden` attribute when closed. Content inside it (pre-fetched) is hidden from the DOM and inaccessible. This is actually correct — `hidden` prevents AT from reading the overlay when it's closed. The risk is forgetting to remove `hidden` (or set `display: block`) when opening.

**Why it happens:** Using only CSS `opacity: 0` or `visibility: hidden` without `display: none` or `hidden` attribute leaves content in accessibility tree when it should be hidden.

**How to avoid:** Use the `hidden` attribute on the overlay container. Remove it on open, add it on close. Set `aria-hidden="false"` / `aria-hidden="true"` correspondingly or rely on `hidden` attribute alone.

**Warning signs:** Screen reader announces overlay content while it's visually closed.

### Pitfall 3: Focus Not Returned to Trigger Element on Close

**What goes wrong:** After closing the overlay (Escape, close button, click outside), focus lands on `document.body` instead of the icon that opened the overlay.

**Why it happens:** The trigger element reference is not stored before overlay open.

**How to avoid:** Store the `triggerEl` reference in `openOverlay(url, triggerEl)` call signature. In `closeOverlay()`, call `triggerEl.focus()`.

**Warning signs:** After pressing Escape, user has to re-Tab from the beginning of the page.

### Pitfall 4: popstate Event Fires on Unrelated Navigation

**What goes wrong:** The `popstate` listener calls `closeOverlay()` even when the user presses back after navigating away and then returning to index — the overlay is not open but `closeOverlay()` tries to clean up non-existent DOM.

**Why it happens:** `popstate` fires for all history transitions, not just overlay-related ones.

**How to avoid:** Guard with `if (!overlayIsOpen) return;` at top of popstate handler. Or check `event.state?.overlayUrl`.

### Pitfall 5: Fetched Content Includes Scripts That Execute

**What goes wrong:** DOMParser.parseFromString does NOT execute scripts in the parsed document. However, if the extracted `.window-content` is inserted via `innerHTML`, any inline `<script>` tags inside will be stripped silently.

**Why it happens:** The about/work/contact pages don't contain scripts inside `.window-content`, but this is worth verifying.

**How to avoid:** Verify the subpages — `.window-content` contains only text/HTML. [VERIFIED: codebase — about.astro window-content is pure `<p>` tags; work.astro has `<p>`, `<ul>`, `<div>` — no scripts]. No issue in practice.

### Pitfall 6: Overlay Appears Under Win95 Taskbar

**What goes wrong:** The overlay `z-index` is lower than the taskbar's `z-index: 9999` (per global.css line 685). The bottom portion of the overlay is obscured by the taskbar.

**Why it happens:** Overlay container added without explicit z-index.

**How to avoid:** Set overlay container `z-index: 100` (between desktop icons at `z-index: 0` and taskbar at `z-index: 9999`). Or add `padding-bottom: 28px` to overlay positioning in win95 mode to clear the taskbar, consistent with the existing `padding-bottom: 28px` on `.win95-desktop`.

### Pitfall 7: Icon tabindex Already Present vs Missing

**What goes wrong:** `.pm-icon` elements in ProgramManager.astro are `<a href>` elements — they are already keyboard-focusable natively (no `tabindex` needed for anchors). `.win95-icon` elements are also `<a href>` anchors. Adding `tabindex="0"` to anchors is redundant and harmless but unnecessary.

**Why it happens:** D-06 says "add `tabindex='0'`" but `<a href>` is natively focusable.

**How to avoid:** Verify focus ring styles (`:focus-visible`) are defined. [VERIFIED: codebase — `.pm-icon:focus` and `.win95-icon:focus` both have outline styles in global.css]. The `:focus-visible` pseudo-class should be used instead of `:focus` to avoid showing focus ring on mouse click.

**Action:** Update `.pm-icon:focus` and `.win95-icon:focus` selectors to `:focus-visible` instead of `:focus` for D-06 compliance.

---

## Code Examples

Verified patterns from the codebase:

### Theme Detection (from existing pattern)
```javascript
// Source: [VERIFIED: codebase — BaseHead.astro, ThemeDialog.astro]
const theme = document.documentElement.getAttribute('data-theme');
// Returns 'retro', 'win31', or 'win95'
```

### Global Function Pattern (from existing pattern)
```javascript
// Source: [VERIFIED: codebase — ThemeDialog.astro line 60]
(window as any).openThemeDialog = function () { ... };
// Pattern: expose overlay open/close as window globals for cross-component access
```

### astro:after-swap Re-init (from existing pattern)
```javascript
// Source: [VERIFIED: codebase — Taskbar.astro line 38, ThemeDialog.astro line 57]
document.addEventListener('astro:after-swap', initFn);
initFn(); // also run on first load
```

### Existing Content Structure (extraction target)
```html
<!-- Source: [VERIFIED: codebase — about.astro, work.astro, contact.astro] -->
<!-- Target selector for content extraction: .window-content -->
<div class="window-content">
  <p>...</p>  <!-- pure text content, no scripts -->
</div>
<!-- Title extraction: .window-title (win31) or first .title-bar-text (win95) -->
```

### Win31 Close Button Pattern (from existing Window.astro)
```html
<!-- Source: [VERIFIED: codebase — Window.astro line 43-45] -->
<!-- contentWindow close uses anchor to /; overlay close should be a button -->
<button class="win31-chrome-btn overlay-close" aria-label="Close">-</button>
```

### Win95 Close Button (from existing Window.astro)
```html
<!-- Source: [VERIFIED: codebase — Window.astro line 26] -->
<button aria-label="Close" type="button" onclick="window.location='/'"></button>
<!-- For overlay: override onclick to call closeOverlay() instead -->
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `focus` pseudo-class for keyboard nav | `:focus-visible` (CSS4) | Broadly available since 2021; all current browsers | Show focus ring on keyboard only, not mouse click — more authentic to OS feel |
| `history.pushState` with title argument | pushState title ignored by all browsers | Per spec, never honored | Don't rely on pushState's second arg for document.title; set title manually if needed |
| Astro page scripts without `astro:after-swap` | Re-init with `astro:after-swap` | Required since Astro View Transitions introduced | Already used in Taskbar.astro and ThemeDialog.astro — follow this pattern |

**Deprecated/outdated:**
- `:focus` for keyboard styles: Replaced by `:focus-visible`. Current `.pm-icon:focus` and `.win95-icon:focus` in global.css use `:focus` — should be updated to `:focus-visible` as part of this phase.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | DOMParser.parseFromString does not execute scripts | Common Pitfalls / Pitfall 5 | LOW risk — subpages don't have scripts in .window-content (verified by reading source) |
| A2 | Focus trap pattern with Tab/Shift+Tab cycling works without MutationObserver for static overlay content | Architecture Patterns / Pattern 4 | LOW risk — overlay content is static HTML; no dynamic insertion expected during open state |
| A3 | `event.stopPropagation()` prevents Astro View Transitions from intercepting icon clicks | Common Pitfalls / Pitfall 1 | MEDIUM risk — Astro VT internals are not verified here; needs manual testing during execution |
| A4 | `history.pushState()` does not trigger Astro View Transitions re-render | Architecture Patterns / Pattern 5 | MEDIUM risk — Astro VT might intercept programmatic state changes; verify during execution |

---

## Open Questions

1. **Does `history.pushState()` from overlay JS trigger Astro View Transitions?**
   - What we know: Astro VT intercepts anchor clicks; pushState is not a click
   - What's unclear: Whether Astro VT also intercepts programmatic pushState calls
   - Recommendation: Test during execution; if pushState triggers VT, use a custom state key and intercept the popstate to suppress VT

2. **Should the overlay use a single chrome set (theme-switching CSS) or dual chrome sets (win31 + win95 markup both present)?**
   - What we know: Existing Window.astro uses variant prop to render structurally different markup; win31 uses `.window-titlebar` / `.window-inner`; win95 uses `.title-bar` / `.window-body`
   - What's unclear: Whether CSS alone can toggle between these two structure types without duplicate markup
   - Recommendation: Use dual chrome sets (both present in HTML, show/hide via `[data-theme="win31"] .overlay-chrome-win31 { display: flex }` etc.). Cleaner than trying to toggle class names dynamically.

3. **How should overlay content titles be derived?**
   - What we know: `/about` → "About Me", `/work` → "Work", `/contact` → "Contact" — per subpage HTML
   - What's unclear: Whether to extract from fetched HTML or hardcode a lookup map
   - Recommendation: Use a static lookup map `{ '/about': 'About Me', '/work': 'Work', '/contact': 'Contact' }` — avoids selector fragility on title extraction

---

## Environment Availability

Step 2.6: SKIPPED — This phase is purely client-side JS + CSS changes. No external tools, services, CLIs, runtimes, or databases are required beyond the existing Astro dev environment.

---

## Validation Architecture

`nyquist_validation` is set to `false` in `.planning/config.json`. Skipping this section per configuration.

---

## Security Domain

This phase adds client-side JS that fetches internal static pages and inserts HTML content into the DOM. Applicable threat review:

- **XSS via innerHTML:** The overlay injects fetched HTML via `innerHTML`. Since the content is served from the same origin (GitHub Pages static files), the risk is limited to self-XSS. However, best practice is to still sanitize or use `textContent` for any user-controlled content. In this case, content is static and controlled — risk is LOW.
- **`[ASSUMED]`** Content-Security-Policy: No CSP headers are configured on this static GitHub Pages site (no server-side headers). The fetch is same-origin. No CSP concern to research.
- **Open redirect:** `pushState` only updates the URL display; no actual navigation or redirect occurs. No risk.

**Applicable ASVS Categories:**

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Not applicable — static site, no auth |
| V3 Session Management | No | Not applicable |
| V4 Access Control | No | Not applicable — all content is public |
| V5 Input Validation | Low | Fetch target URLs are hardcoded from icon href — not user-input. No validation needed. |
| V6 Cryptography | No | Not applicable |

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: codebase] — All Window.astro, ProgramManager.astro, Win95Desktop.astro, ThemeDialog.astro, Taskbar.astro, global.css, index.astro, about.astro, work.astro fully read and analyzed
- [VERIFIED: codebase] — CSS class structure, z-index values, theme toggle patterns, astro:after-swap usage all confirmed from source files

### Secondary (MEDIUM confidence)
- [ASSUMED] — History API pushState/popstate behavior, focus trap vanilla JS pattern — standard browser APIs, well-established patterns

### Tertiary (LOW confidence)
- [ASSUMED] — Astro View Transitions interaction with programmatic pushState — not verified against Astro docs in this session; flagged as Open Question

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — No new dependencies; all APIs native browser
- Architecture: HIGH — Patterns derived directly from existing codebase structure; two MEDIUM assumptions flagged
- Pitfalls: HIGH — Derived from code reading (z-index values, selector verification, astro:after-swap pattern); one MEDIUM assumption about Astro VT interaction

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable patterns — Astro 4.x minor changes possible but VT API stable)
