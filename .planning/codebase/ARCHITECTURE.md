# Architecture

**Analysis Date:** 2026-03-21

## Pattern Overview

**Overall:** Static Site Generation (SSG) with Astro framework

**Key Characteristics:**
- File-based routing for pages
- Component-driven UI with reusable Astro components
- CSS-in-module styling with Tailwind CSS utility classes
- Zero JavaScript runtime by default (pure HTML/CSS output)
- Retro 1990s desktop OS aesthetic as primary design theme

## Layers

**Page Layer:**
- Purpose: Define top-level routes and page structure
- Location: `src/pages/`
- Contains: `.astro` files that map to HTTP routes (index, about, work, contact)
- Depends on: Components, layouts, constants
- Used by: Browser routing system (Astro file-based routing)

**Layout Layer:**
- Purpose: Provide consistent page structure and wrapping
- Location: `src/layouts/Layout.astro`
- Contains: Root HTML structure, slot for page content, navigation affordances
- Depends on: Components (BaseHead, HomeIcon)
- Used by: Pages that need consistent styling and structure

**Component Layer:**
- Purpose: Encapsulate reusable UI elements
- Location: `src/components/`
- Contains: BaseHead (metadata), Window (layout container), Button (interactive element), HomeIcon (navigation affordance), HeaderLink (nav link with active state)
- Depends on: Constants, global styles
- Used by: Pages and layouts

**Styling Layer:**
- Purpose: Global styles and theme definition
- Location: `src/styles/global.css`
- Contains: Body styling (teal background, pixel grid pattern), window styling, button styling, desktop icon styling
- Depends on: Tailwind CSS (for utility classes)
- Used by: BaseHead component (imported globally)

**Configuration Layer:**
- Purpose: Site-level constants and metadata
- Location: `src/consts.ts`
- Contains: SITE_TITLE, SITE_DESCRIPTION
- Depends on: None
- Used by: All pages and components for consistent branding

## Data Flow

**Page Render Flow:**

1. Browser requests route (e.g., `/about`)
2. Astro routes request to matching file in `src/pages/` (e.g., `about.astro`)
3. Page component imports layout or builds structure directly
4. Page imports BaseHead component for `<head>` metadata
5. Page imports child components (Window, Button, etc.)
6. Astro builds static HTML at build time
7. Browser receives pre-rendered HTML with inline CSS
8. View transitions script enables page transitions without full reload

**State Management:**
- Static site: no runtime state
- Page constants pulled from `src/consts.ts` at build time
- ViewTransitions API provides navigation animation state

## Key Abstractions

**Window Component:**
- Purpose: Represents a retro OS window container with optional title bar
- Examples: `src/components/Window.astro`
- Pattern: Accepts title, height, and contentWindow props; renders title bar if title provided; uses CSS classes for styling

**Button Component:**
- Purpose: Unified interactive button/link with icon or image support
- Examples: `src/components/Button.astro`
- Pattern: Accepts href, icon/image, label, external flag; conditionally renders button or anchor tag; supports disabled state

**BaseHead Component:**
- Purpose: Centralized head metadata for all pages
- Examples: `src/components/BaseHead.astro`
- Pattern: Accepts title and description; generates canonical URL; includes ViewTransitions, font preloads, Open Graph tags, Twitter card tags

## Entry Points

**Home Page:**
- Location: `src/pages/index.astro`
- Triggers: Root path `/`
- Responsibilities: Renders landing page with profile image, site title, navigation buttons to about/work/contact

**About Page:**
- Location: `src/pages/about.astro`
- Triggers: `/about` path
- Responsibilities: Renders personal bio, background, and interests in a window container

**Work Page:**
- Location: `src/pages/work.astro`
- Triggers: `/work` path
- Responsibilities: Renders professional experience, current role, career highlights, and technical skills

**Contact Page:**
- Location: `src/pages/contact.astro`
- Triggers: `/contact` path
- Responsibilities: Uses Layout component and Button components to display social media links (Twitter, Bluesky, GitHub, LinkedIn)

## Error Handling

**Strategy:** Not explicitly implemented (static site)

**Patterns:**
- Missing routes fall through to Astro's 404 handling (generates 404.html if custom page not provided)
- Disabled buttons (like Resume button) use `disabled` attribute and reduced opacity

## Cross-Cutting Concerns

**Logging:** None (static site, no runtime logging)

**Validation:** Component props validated via TypeScript interfaces (strict mode enabled in tsconfig.json)

**Authentication:** None required (public static site)

**Navigation:**
- File-based routing handled by Astro at build time
- View Transitions provide smooth page transitions
- HomeIcon and desktop-icon anchors provide explicit navigation affordances on content pages

---

*Architecture analysis: 2026-03-21*
