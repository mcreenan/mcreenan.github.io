# Codebase Structure

**Analysis Date:** 2026-03-21

## Directory Layout

```
mcreenan.github.io/
├── src/                          # Source code
│   ├── components/               # Reusable UI components
│   ├── layouts/                  # Page layout templates
│   ├── pages/                    # File-based routes
│   ├── styles/                   # Global stylesheets
│   ├── consts.ts                 # Site constants
│   └── env.d.ts                  # TypeScript environment types
├── public/                       # Static assets
│   ├── images/                   # Image files
│   └── fonts/                    # Custom font files
├── dist/                         # Build output (generated)
├── .github/                      # GitHub configuration
│   └── workflows/                # CI/CD workflows
├── .planning/                    # Planning documents
│   └── codebase/                 # Architecture/analysis docs
├── astro.config.mjs              # Astro framework config
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies
```

## Directory Purposes

**src/components:**
- Purpose: Self-contained, reusable UI building blocks
- Contains: Astro components (.astro files)
- Key files: `BaseHead.astro`, `Window.astro`, `Button.astro`, `HomeIcon.astro`, `HeaderLink.astro`

**src/layouts:**
- Purpose: Reusable page templates and wrappers
- Contains: Astro layout components
- Key files: `Layout.astro` - wraps content pages with consistent structure

**src/pages:**
- Purpose: Define application routes and page content
- Contains: Astro route files (each .astro file = one route)
- Key files: `index.astro` (home), `about.astro` (bio), `work.astro` (experience), `contact.astro` (social links)

**src/styles:**
- Purpose: Global CSS and theme definition
- Contains: CSS stylesheets imported globally
- Key files: `global.css` - defines body styling, window styles, button styles, desktop icon styles

**public/images:**
- Purpose: Image assets served as-is
- Contains: PNG, SVG, and other image formats
- Key files: `headshot.png`, `bluesky-black.svg`

**public/fonts:**
- Purpose: Custom font files for performance
- Contains: WOFF font files
- Key files: `atkinson-regular.woff`, `atkinson-bold.woff`

**dist/:**
- Purpose: Static site build output
- Generated: Yes (created by `npm run build`)
- Committed: No (in .gitignore)

## Key File Locations

**Entry Points:**
- `src/pages/index.astro`: Home/landing page
- `src/pages/about.astro`: About page
- `src/pages/work.astro`: Work/experience page
- `src/pages/contact.astro`: Contact/social links page

**Configuration:**
- `astro.config.mjs`: Astro build config, integrations (mdx, sitemap, tailwind), site URL
- `tsconfig.json`: TypeScript strict mode, extends astro/tsconfigs/strict
- `package.json`: Dependencies (Astro, Tailwind, TypeScript)

**Core Logic:**
- `src/consts.ts`: Site title and description constants
- `src/styles/global.css`: Theme styling (teal background, window aesthetic, button styles)

**Component Hierarchy:**
- `src/components/BaseHead.astro`: Metadata component (used by all pages)
- `src/components/Window.astro`: Window container (used by content pages)
- `src/components/Button.astro`: Interactive button/link (used by contact page)
- `src/components/HomeIcon.astro`: Navigation affordance (used by content pages)

## Naming Conventions

**Files:**
- Page files: lowercase kebab-case (index.astro, about.astro)
- Component files: PascalCase (BaseHead.astro, Window.astro)
- Style files: lowercase with descriptive names (global.css)
- Assets: lowercase with hyphens (headshot.png, bluesky-black.svg)

**Directories:**
- lowercase plural for collections (components, layouts, pages, styles)
- lowercase plural for assets (images, fonts)

**TypeScript/JavaScript:**
- Constants: SCREAMING_SNAKE_CASE (SITE_TITLE, SITE_DESCRIPTION)
- Component props: interfaces defined as Props type
- Variables: camelCase

## Where to Add New Code

**New Page:**
- Create `.astro` file in `src/pages/` matching desired route
- Import BaseHead or Layout component for consistent structure
- Import Window component for consistent content styling
- Use Button component for interactive elements

**New Component:**
- Create `.astro` file in `src/components/`
- Define interface for props at top of component
- Use Astro props destructuring and slot for content projection
- Apply CSS classes for styling (Tailwind utility classes or global.css classes)

**New Constants:**
- Add to `src/consts.ts` with SCREAMING_SNAKE_CASE naming
- Import in components/pages as needed

**Static Assets:**
- Images: place in `public/images/`
- Fonts: place in `public/fonts/`
- Reference via `/images/` or `/fonts/` paths in components

**Global Styling:**
- Add to `src/styles/global.css` for site-wide styles
- Use Tailwind utility classes in component markup for component-specific styles

## Special Directories

**dist/:**
- Purpose: Contains built static HTML output
- Generated: Yes (by `astro build` command)
- Committed: No

**.github/workflows/:**
- Purpose: CI/CD automation
- Generated: No
- Committed: Yes (contains workflow definitions)

**.planning/codebase/:**
- Purpose: Architecture and codebase analysis documents
- Generated: Yes (by gsd mapping process)
- Committed: Yes

---

*Structure analysis: 2026-03-21*
