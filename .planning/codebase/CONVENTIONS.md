# Coding Conventions

**Analysis Date:** 2026-03-21

## Naming Patterns

**Files:**
- Components: PascalCase with `.astro` extension (e.g., `Button.astro`, `BaseHead.astro`, `HeaderLink.astro`)
- Pages: kebab-case with `.astro` extension (e.g., `about.astro`, `contact.astro`, `index.astro`)
- Constants: UPPER_SNAKE_CASE in TypeScript files (e.g., `SITE_TITLE`, `SITE_DESCRIPTION` in `src/consts.ts`)
- Style files: kebab-case with `.css` extension (e.g., `global.css`)
- Layout components: PascalCase with `.astro` extension (e.g., `Layout.astro`)

**Functions and Variables:**
- camelCase for function parameters and local variables
- camelCase for destructured props (e.g., `href`, `icon`, `image`, `label`, `external`, `disabled`)
- UPPER_SNAKE_CASE for exported constants

**CSS Classes:**
- kebab-case for CSS class names (e.g., `.window`, `.button`, `.splash-screen`, `.window-titlebar`, `.desktop-icon`)
- BEM-adjacent approach: parent-child relationships with hyphens (e.g., `.window-inner`, `.window-content`, `.window-title`)
- Utility classes from Tailwind CSS framework (e.g., `flex`, `items-center`, `justify-center`, `gap-4`)

**Types and Interfaces:**
- PascalCase for interfaces and type definitions (e.g., `Props`, `HTMLAttributes`)
- Used primarily for component props in Astro components

## Code Style

**Formatting:**
- No explicit formatter configured (Prettier not found)
- No linter configured (ESLint not found)
- Inconsistent indentation observed across files: some use tabs (`BaseHead.astro`, `Layout.astro`, `about.astro`), others use spaces
- Indentation patterns:
  - Tabs found in: `BaseHead.astro`, `about.astro`, `Layout.astro` (tabs for indentation, spaces within attributes)
  - Spaces found in: `Button.astro`, `contact.astro`, `work.astro` (consistent 4-space indentation)
- Inconsistent spacing in JSX/template code

**Linting:**
- No linting configured
- TypeScript strict mode enabled via `tsconfig.json` with `strictNullChecks: true`
- `astro check` used as build-time type checking (in `package.json` build script)

## Import Organization

**Order:**
1. Framework imports (`import { ViewTransitions } from "astro:transitions"`)
2. Local component imports (relative paths like `import BaseHead from "../components/BaseHead.astro"`)
3. Constant imports (e.g., `import { SITE_TITLE, SITE_DESCRIPTION } from "../consts"`)

**Path Aliases:**
- No path aliases configured
- All imports use relative paths (e.g., `../components/`, `../consts`)

**Import Style:**
- Named imports for constants and utilities
- Default imports for components

## Astro Component Structure

**Frontmatter Section (---)**
- TypeScript code enclosed between `---` delimiters at top of component
- Defines interfaces for props using `interface Props { ... }`
- Destructures `Astro.props` to extract component arguments
- Uses default parameter values for optional props (e.g., `external = false`, `disabled = false`, `height = "auto"`, `contentWindow = false`)

**Template Section**
- JSX-like template syntax after frontmatter
- Conditional rendering with ternary operators (e.g., `disabled ? (...) : (...)`)
- Dynamic class binding with `class:list=` directive for conditional classes
- Slot usage with `<slot />` for component composition

**Scoped Styles**
- CSS within `<style>` tags is scoped to component by default
- Used in `HeaderLink.astro` for component-specific styling
- Not heavily used; most styling is global or Tailwind utilities

## Error Handling

**Strategy:** Not explicitly documented. Minimal error handling observed.

**Patterns:**
- No try-catch blocks found in source code
- Relies on TypeScript type checking to prevent runtime errors
- No validation of component props beyond TypeScript interfaces

## Logging

**Framework:** Not used. No logging library detected.

**Patterns:**
- No structured logging observed
- Code does not include debug or info logging statements

## Comments

**When to Comment:**
- Minimal comments observed in codebase
- HTML comments for disabled features (e.g., `<!-- <meta property="og:image"... -->` in `BaseHead.astro`)
- Code is self-documenting through clear naming and structure

**JSDoc/TSDoc:**
- Not observed in codebase
- No documentation comments on functions or components

## Function Design

**Size:** Small, focused functions. No large functions observed.

**Parameters:**
- Use of interface-based props in Astro components (Props interface)
- Destructuring in frontmatter for clean variable access
- Optional parameters marked with `?` in interfaces

**Return Values:**
- Astro components implicitly return rendered markup
- No explicit return statements required in frontmatter
- Constants return scalar values (strings in `consts.ts`)

## Module Design

**Exports:**
- Named exports for constants (e.g., `export const SITE_TITLE = ...`)
- Default exports for components (Astro convention)

**Component Composition:**
- Layout components (`Layout.astro`) accept `title` prop and use `<slot />`
- Reusable components (`Button.astro`, `Window.astro`) accept props and render variants
- Pages composed of layouts and components (e.g., `contact.astro` uses `Layout` + `Window` + `Button`)

## Styling Approach

**Global Styles:**
- Centralized in `src/styles/global.css`
- Imported in `BaseHead.astro` component
- Defines base element styles, animations, and responsive breakpoints

**Tailwind CSS:**
- Used as primary utility CSS framework
- Configured in `tailwind.config.mjs`
- Classes used directly in templates (e.g., `flex`, `items-center`, `justify-center`, `gap-4`)
- Scans all source files for class usage: `['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}']`

**Component-Scoped Styles:**
- Scoped `<style>` blocks in `HeaderLink.astro` for component-specific rules
- CSS encapsulation handled by Astro automatically

**Responsive Design:**
- Media queries at breakpoints: `640px`, `380px` in `global.css`
- Mobile-first approach with breakpoints handling smaller screens

---

*Convention analysis: 2026-03-21*
