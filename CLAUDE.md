<!-- GSD:project-start source:PROJECT.md -->
## Project

**Yarn to Bun Migration**

Migrate the personal site (matt.creenan.me) from Yarn to Bun as the package manager. The site is an Astro-based static site deployed to GitHub Pages. This is a tooling-only change — no application code changes.

**Core Value:** Replace Yarn with Bun cleanly without breaking the build, dev server, or GitHub Pages deployment.

### Constraints

- **Deployment**: Must continue deploying to GitHub Pages via GitHub Actions
- **Compatibility**: Bun must support all current Astro integrations
- **CI**: `withastro/action@v2` needs to detect Bun or be configured for it
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.6.3 - Type checking and site components
- HTML/CSS - Page templates and styling
- JavaScript - Configuration files and runtime
## Runtime
- Node.js 20 (specified in GitHub Actions workflow)
- Yarn (lockfile present: `yarn.lock`)
- Lockfile: `yarn.lock` (199.7K)
## Frameworks
- Astro 4.16.8 - Static site generator and framework
- Tailwind CSS 3.4.14 - Utility-first CSS framework with @astrojs/tailwind integration
- @astrojs/mdx 3.1.9 - MDX support for content authoring
- @astrojs/check 0.9.4 - Type checking integration
- @astrojs/sitemap 3.2.1 - Automatic sitemap generation
- @astrojs/rss 4.0.9 - RSS feed generation
## Key Dependencies
- astro 4.16.8 - Core framework for static site generation
- @astrojs/tailwind 5.1.2 - Tailwind CSS integration with Astro
- typescript 5.6.3 - Type safety for all TypeScript code
- @astrojs/mdx 3.1.9 - MDX support for content pages
- @astrojs/sitemap 3.2.1 - SEO sitemap generation
- @astrojs/rss 4.0.9 - RSS feed generation
- @astrojs/check 0.9.4 - Type checking and diagnostics
- tailwindcss 3.4.14 - CSS framework
## Configuration
- No environment variables required or detected
- No `.env` files in repository
- `tsconfig.json` - TypeScript strict mode configuration extending astro/tsconfigs/strict
- `astro.config.mjs` - Astro framework configuration with site URL: https://matt.creenan.me
- `tailwind.config.mjs` - Tailwind CSS configuration
## Platform Requirements
- Node.js 20
- Yarn package manager
- TypeScript 5.6.3
- Deployed on GitHub Pages
- Hosting: GitHub Pages (github-pages environment)
- Static site output to dist directory
## Build & Development Commands
- `yarn dev` or `yarn start` - Start local development server via `astro dev`
- `yarn build` - Type check with `astro check` then build with `astro build`
- `yarn preview` - Preview production build locally
- `yarn astro` - Direct access to Astro CLI
## CI/CD Pipeline
- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Trigger: Push to main branch or manual workflow dispatch
- Build runner: Ubuntu latest
- Deployment: GitHub Pages automatic deployment
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Components: PascalCase with `.astro` extension (e.g., `Button.astro`, `BaseHead.astro`, `HeaderLink.astro`)
- Pages: kebab-case with `.astro` extension (e.g., `about.astro`, `contact.astro`, `index.astro`)
- Constants: UPPER_SNAKE_CASE in TypeScript files (e.g., `SITE_TITLE`, `SITE_DESCRIPTION` in `src/consts.ts`)
- Style files: kebab-case with `.css` extension (e.g., `global.css`)
- Layout components: PascalCase with `.astro` extension (e.g., `Layout.astro`)
- camelCase for function parameters and local variables
- camelCase for destructured props (e.g., `href`, `icon`, `image`, `label`, `external`, `disabled`)
- UPPER_SNAKE_CASE for exported constants
- kebab-case for CSS class names (e.g., `.window`, `.button`, `.splash-screen`, `.window-titlebar`, `.desktop-icon`)
- BEM-adjacent approach: parent-child relationships with hyphens (e.g., `.window-inner`, `.window-content`, `.window-title`)
- Utility classes from Tailwind CSS framework (e.g., `flex`, `items-center`, `justify-center`, `gap-4`)
- PascalCase for interfaces and type definitions (e.g., `Props`, `HTMLAttributes`)
- Used primarily for component props in Astro components
## Code Style
- No explicit formatter configured (Prettier not found)
- No linter configured (ESLint not found)
- Inconsistent indentation observed across files: some use tabs (`BaseHead.astro`, `Layout.astro`, `about.astro`), others use spaces
- Indentation patterns:
- Inconsistent spacing in JSX/template code
- No linting configured
- TypeScript strict mode enabled via `tsconfig.json` with `strictNullChecks: true`
- `astro check` used as build-time type checking (in `package.json` build script)
## Import Organization
- No path aliases configured
- All imports use relative paths (e.g., `../components/`, `../consts`)
- Named imports for constants and utilities
- Default imports for components
## Astro Component Structure
- TypeScript code enclosed between `---` delimiters at top of component
- Defines interfaces for props using `interface Props { ... }`
- Destructures `Astro.props` to extract component arguments
- Uses default parameter values for optional props (e.g., `external = false`, `disabled = false`, `height = "auto"`, `contentWindow = false`)
- JSX-like template syntax after frontmatter
- Conditional rendering with ternary operators (e.g., `disabled ? (...) : (...)`)
- Dynamic class binding with `class:list=` directive for conditional classes
- Slot usage with `<slot />` for component composition
- CSS within `<style>` tags is scoped to component by default
- Used in `HeaderLink.astro` for component-specific styling
- Not heavily used; most styling is global or Tailwind utilities
## Error Handling
- No try-catch blocks found in source code
- Relies on TypeScript type checking to prevent runtime errors
- No validation of component props beyond TypeScript interfaces
## Logging
- No structured logging observed
- Code does not include debug or info logging statements
## Comments
- Minimal comments observed in codebase
- HTML comments for disabled features (e.g., `<!-- <meta property="og:image"... -->` in `BaseHead.astro`)
- Code is self-documenting through clear naming and structure
- Not observed in codebase
- No documentation comments on functions or components
## Function Design
- Use of interface-based props in Astro components (Props interface)
- Destructuring in frontmatter for clean variable access
- Optional parameters marked with `?` in interfaces
- Astro components implicitly return rendered markup
- No explicit return statements required in frontmatter
- Constants return scalar values (strings in `consts.ts`)
## Module Design
- Named exports for constants (e.g., `export const SITE_TITLE = ...`)
- Default exports for components (Astro convention)
- Layout components (`Layout.astro`) accept `title` prop and use `<slot />`
- Reusable components (`Button.astro`, `Window.astro`) accept props and render variants
- Pages composed of layouts and components (e.g., `contact.astro` uses `Layout` + `Window` + `Button`)
## Styling Approach
- Centralized in `src/styles/global.css`
- Imported in `BaseHead.astro` component
- Defines base element styles, animations, and responsive breakpoints
- Used as primary utility CSS framework
- Configured in `tailwind.config.mjs`
- Classes used directly in templates (e.g., `flex`, `items-center`, `justify-center`, `gap-4`)
- Scans all source files for class usage: `['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}']`
- Scoped `<style>` blocks in `HeaderLink.astro` for component-specific rules
- CSS encapsulation handled by Astro automatically
- Media queries at breakpoints: `640px`, `380px` in `global.css`
- Mobile-first approach with breakpoints handling smaller screens
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- File-based routing for pages
- Component-driven UI with reusable Astro components
- CSS-in-module styling with Tailwind CSS utility classes
- Zero JavaScript runtime by default (pure HTML/CSS output)
- Retro 1990s desktop OS aesthetic as primary design theme
## Layers
- Purpose: Define top-level routes and page structure
- Location: `src/pages/`
- Contains: `.astro` files that map to HTTP routes (index, about, work, contact)
- Depends on: Components, layouts, constants
- Used by: Browser routing system (Astro file-based routing)
- Purpose: Provide consistent page structure and wrapping
- Location: `src/layouts/Layout.astro`
- Contains: Root HTML structure, slot for page content, navigation affordances
- Depends on: Components (BaseHead, HomeIcon)
- Used by: Pages that need consistent styling and structure
- Purpose: Encapsulate reusable UI elements
- Location: `src/components/`
- Contains: BaseHead (metadata), Window (layout container), Button (interactive element), HomeIcon (navigation affordance), HeaderLink (nav link with active state)
- Depends on: Constants, global styles
- Used by: Pages and layouts
- Purpose: Global styles and theme definition
- Location: `src/styles/global.css`
- Contains: Body styling (teal background, pixel grid pattern), window styling, button styling, desktop icon styling
- Depends on: Tailwind CSS (for utility classes)
- Used by: BaseHead component (imported globally)
- Purpose: Site-level constants and metadata
- Location: `src/consts.ts`
- Contains: SITE_TITLE, SITE_DESCRIPTION
- Depends on: None
- Used by: All pages and components for consistent branding
## Data Flow
- Static site: no runtime state
- Page constants pulled from `src/consts.ts` at build time
- ViewTransitions API provides navigation animation state
## Key Abstractions
- Purpose: Represents a retro OS window container with optional title bar
- Examples: `src/components/Window.astro`
- Pattern: Accepts title, height, and contentWindow props; renders title bar if title provided; uses CSS classes for styling
- Purpose: Unified interactive button/link with icon or image support
- Examples: `src/components/Button.astro`
- Pattern: Accepts href, icon/image, label, external flag; conditionally renders button or anchor tag; supports disabled state
- Purpose: Centralized head metadata for all pages
- Examples: `src/components/BaseHead.astro`
- Pattern: Accepts title and description; generates canonical URL; includes ViewTransitions, font preloads, Open Graph tags, Twitter card tags
## Entry Points
- Location: `src/pages/index.astro`
- Triggers: Root path `/`
- Responsibilities: Renders landing page with profile image, site title, navigation buttons to about/work/contact
- Location: `src/pages/about.astro`
- Triggers: `/about` path
- Responsibilities: Renders personal bio, background, and interests in a window container
- Location: `src/pages/work.astro`
- Triggers: `/work` path
- Responsibilities: Renders professional experience, current role, career highlights, and technical skills
- Location: `src/pages/contact.astro`
- Triggers: `/contact` path
- Responsibilities: Uses Layout component and Button components to display social media links (Twitter, Bluesky, GitHub, LinkedIn)
## Error Handling
- Missing routes fall through to Astro's 404 handling (generates 404.html if custom page not provided)
- Disabled buttons (like Resume button) use `disabled` attribute and reduced opacity
## Cross-Cutting Concerns
- File-based routing handled by Astro at build time
- View Transitions provide smooth page transitions
- HomeIcon and desktop-icon anchors provide explicit navigation affordances on content pages
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
