# Codebase Concerns

**Analysis Date:** 2026-03-21

## External CDN Dependencies

**Critical External Resources:**
- Issue: Multiple external CDN dependencies with no fallback or integrity checks
- Files: `src/components/BaseHead.astro`
- Resources:
  - Google Fonts (Montserrat, Roboto): `https://fonts.googleapis.com/css2?family=...`
  - Phosphor Icons: `https://unpkg.com/@phosphor-icons/web`
  - Font Awesome: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`
- Impact:
  - Site becomes non-functional if any CDN is unreachable
  - Single point of failure for icon rendering (used throughout site)
  - No subresource integrity (SRI) attributes present
  - Network latency impacts initial page load and responsiveness
- Fix approach:
  - Add SRI attributes to all external resources
  - Consider vendoring icon libraries or using local SVGs instead of unpkg
  - Implement font subsetting or self-host fonts
  - Add error handling or fallback fonts in CSS

## Viewport and Scrolling Issues

**Fixed Height Constraint:**
- Issue: Body element locked to `height: 100vh` with `overflow: hidden`
- Files: `src/styles/global.css` (line 6), `src/layouts/Layout.astro` (line 20)
- Problem:
  - Content can be cut off on shorter viewports
  - Address bar height on mobile browsers can cause layout shift
  - No graceful handling when content exceeds viewport
  - Mobile users on devices with small screens cannot access full content
- Examples:
  - `body { height: 100vh; overflow: hidden; }`
  - `<main class="h-screen overflow-hidden">`
- Workaround: Mobile users must zoom out to see content
- Fix approach:
  - Use `min-height: 100vh` instead of fixed `height: 100vh`
  - Allow vertical scrolling with `overflow-y: auto` when needed
  - Test with actual mobile devices and address bar behavior

## Accessibility Gaps

**Missing ARIA Attributes:**
- Issue: Interactive elements lack proper accessibility semantics
- Files:
  - `src/components/Button.astro`: Button component renders as `<a>` tag with `.button` class
  - `src/pages/work.astro` (line 31-40): Disabled button without proper `aria-disabled`
- Problems:
  - Screen reader users cannot determine button state
  - Keyboard navigation may be affected
  - Semantic meaning is lost when using `<a>` for button-like actions
- Specific gaps:
  - No `aria-label` for icon-only buttons
  - No `aria-disabled` on disabled elements (only `disabled` attribute)
  - Window components lack proper heading hierarchy and structure
- Fix approach:
  - Use proper `<button>` elements for button actions (not `<a>`)
  - Add `aria-label` to all icon-only interactive elements
  - Implement proper ARIA attributes for disabled states
  - Ensure heading structure matches visual hierarchy

**Link Target Awareness:**
- Issue: External links do not communicate to users they open in new tabs
- Files: `src/pages/work.astro` (line 48), `src/pages/contact.astro` (multiple)
- Impact: Users encounter unexpected behavior when external links open in new tabs
- Fix approach:
  - Add visual indicator (icon) for external links
  - Add `aria-label` or title text indicating link opens in new tab

## Responsive Design Issues

**Insufficient Mobile Testing:**
- Issue: Layout uses fixed positioning and assumes desktop-like interaction
- Files: `src/styles/global.css`, `src/layouts/Layout.astro`
- Problems:
  - `.splash-screen` uses fixed positioning (line 95)
  - `.desktop-icon` fixed positioned at top-left (line 286)
  - Window title uses complex transforms that may break on small screens
  - Touch targets may be too small on mobile
- Breakpoints: Only two media queries (640px, 380px) - insufficient coverage
- Fix approach:
  - Add mobile-first media queries for common breakpoints (320px, 480px, 768px, 1024px)
  - Test touch interactions on actual devices
  - Verify all interactive elements meet 44x44px touch target minimum
  - Consider dark mode for high ambient light mobile use cases

**Complex CSS Animations on Mobile:**
- Issue: `borderGradient` animation may impact performance on low-end devices
- Files: `src/styles/global.css` (line 73-113)
- Animation details:
  - `border-image-source` animates with 6s infinite loop
  - Uses radial-gradient recalculation every frame
  - `will-change: border-image-source` hints CPU optimization but may cause memory pressure
- Impact: Battery drain, jank on older mobile devices
- Mitigation present: `prefers-reduced-motion` (line 126-130) extends to 12s but doesn't disable
- Fix approach:
  - Set `animation: none` under `prefers-reduced-motion` instead of just slowing it
  - Consider using CSS custom properties for colors instead of animated gradient
  - Test on low-end mobile devices (Pixel 3a, iPhone SE)

## Missing Resume Functionality

**Incomplete Feature:**
- Issue: Resume button disabled with "Coming soon" message
- Files: `src/pages/work.astro` (line 31-40)
- Status: Hard-coded disabled state
- Impact: Users cannot download or view resume, professional capability appears incomplete
- Fix approach:
  - Complete resume implementation or remove from page
  - If truly coming soon, implement proper placeholder with timeline

## Performance Concerns

**Unused Font Weights:**
- Issue: Google Fonts imported with specific weights, but may not match all usage
- Files: `src/components/BaseHead.astro`
- Fonts loaded:
  - Montserrat (wght@700 only) - bold
  - Roboto (wght@700 only) - bold
  - Atkinson (preloaded as regular and bold)
- Problem: May not have coverage for all text weights needed
- Fix approach:
  - Audit all font-weight CSS properties
  - Ensure imported fonts match all used weights
  - Remove unused font imports

**Critical Render Path Blocking:**
- Issue: Multiple external scripts block rendering
- Files: `src/components/BaseHead.astro`
- Blocking resources:
  - Google Fonts CSS (line 41, 69)
  - Font Awesome CSS from CDN (line 76)
  - Phosphor Icons script (line 72) - renders synchronously
- Impact: First Contentful Paint delayed by network requests to external CDNs
- Fix approach:
  - Add `async` to script tags where possible
  - Preload critical fonts
  - Consider self-hosting or inlining critical CSS
  - Measure and optimize Core Web Vitals

## Styling Maintenance Risk

**Inline Styles in Components:**
- Issue: Height property passed as inline style string
- Files: `src/components/Window.astro` (line 13)
- Code: `style={`height: ${height};`}`
- Problem:
  - Not type-safe, prone to typos
  - Cannot be validated by TypeScript
  - Difficult to find all style usages across codebase
- Fix approach:
  - Use CSS classes with defined heights instead
  - Create utility class variants for common heights
  - Use TypeScript discriminated unions for style props

**Disabled Button Styling Inconsistency:**
- Issue: Disabled buttons apply both inline styles and CSS classes
- Files: `src/pages/work.astro` (line 32-33), `src/components/Button.astro` (line 24)
- Problem:
  - `cursor-not-allowed` and `opacity-60` applied inconsistently
  - CSS rules in `global.css` (line 351-359) don't remove all hover effects
- Fix approach:
  - Standardize disabled button styling in Button component
  - Remove `opacity-60` and `cursor-not-allowed` from inline markup
  - Ensure CSS `:disabled` selector fully overrides hover states

## Dependency Version Constraints

**No Version Pinning in Production:**
- Issue: package.json uses caret ranges for all dependencies
- Files: `package.json`
- Current versions:
  - `@astrojs/check: ^0.9.4`
  - `astro: ^4.16.8`
  - `tailwindcss: ^3.4.14`
  - `typescript: ^5.6.3`
- Risk: Breaking changes in minor versions could cause unexpected failures
- Example: Astro 4.x to 5.x could introduce breaking changes in next update
- Fix approach:
  - Consider using `~` (tilde) for more stable versions in production
  - Test major version upgrades in separate branch before merging
  - Document minimum supported versions

## View Transitions Compatibility

**Unverified Browser Support:**
- Issue: View Transitions API used without checking browser compatibility
- Files: `src/components/BaseHead.astro` (line 2, 21), `src/styles/global.css` (line 120)
- Feature: `ViewTransitions` component and `view-transition-name` CSS
- Impact:
  - Fallback behavior on unsupported browsers undefined
  - Older browsers may have visual glitches during navigation
  - No graceful degradation strategy documented
- Fix approach:
  - Add feature detection for View Transitions
  - Test on Safari (limited support), older Chrome versions
  - Document minimum browser requirements
  - Implement visual fallback if API unavailable

## Missing Metadata

**Open Graph Images Not Implemented:**
- Issue: Meta tags for social sharing exist but are commented out
- Files: `src/components/BaseHead.astro` (line 57, 64)
- Code: `<!-- <meta property="og:image" content={new URL(image, Astro.url)} /> -->`
- Impact:
  - Links shared on social media show no image preview
  - No opportunity to promote professional appearance
  - Less likely to get clicks from social platforms
- Fix approach:
  - Implement og:image generation
  - Create social media preview images
  - Consider using dynamic image generation service

## Test Coverage Gaps

**No Tests Present:**
- Issue: No test files found in codebase
- Files: None found
- Impact:
  - No automated verification of component behavior
  - Responsive design changes not regression tested
  - External link accessibility cannot be validated automatically
  - Styling regressions undetected
- Untested areas of concern:
  - Button component state variations (disabled, external, with icons, with images)
  - Window component height constraints and overflow behavior
  - Responsive breakpoint transitions
  - View Transitions fallback behavior
- Fix approach:
  - Add Vitest or Jest configuration
  - Create component tests for Button and Window
  - Add visual regression testing
  - Consider E2E tests with Playwright for navigation flow

## Type Safety Gaps

**Loose Prop Typing:**
- Issue: Component props use broad types or missing validation
- Files:
  - `src/components/Button.astro`: Props marked as optional but some are required (`href`, `label`)
  - `src/components/Window.astro`: `height` prop accepts any string with no validation
- Problem: No runtime protection against invalid values
- Fix approach:
  - Mark required props as non-optional
  - Add strict TypeScript validation
  - Use discriminated unions for icon vs image buttons

## Security Considerations

**Potential XSS from Markdown/Content:**
- Issue: Not identified if MDX content is sanitized
- Files: Astro MDX integration enabled (`@astrojs/mdx`)
- Risk: If user-generated markdown is displayed, XSS is possible
- Status: Not a current risk (static content), but architectural concern for future
- Fix approach:
  - Document security policies for any dynamic content
  - Use Astro's built-in HTML escaping
  - Sanitize any user-provided markdown

## Content Scalability

**Hard-coded Content Structure:**
- Issue: Work experience and about content hard-coded in templates
- Files:
  - `src/pages/work.astro` (lines 25-108)
  - `src/pages/about.astro` (lines 23-42)
- Problem:
  - Content updates require HTML editing
  - No separation of content and presentation
  - Difficult to maintain if frequently updated
- Fix approach:
  - Consider moving content to separate YAML/JSON files
  - Or implement blog-like system if content will grow
  - Document content update process

---

*Concerns audit: 2026-03-21*
