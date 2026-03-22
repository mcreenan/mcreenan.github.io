# Technology Stack

**Analysis Date:** 2026-03-21

## Languages

**Primary:**
- TypeScript 5.6.3 - Type checking and site components
- HTML/CSS - Page templates and styling

**Secondary:**
- JavaScript - Configuration files and runtime

## Runtime

**Environment:**
- Node.js 20 (specified in GitHub Actions workflow)

**Package Manager:**
- Yarn (lockfile present: `yarn.lock`)
- Lockfile: `yarn.lock` (199.7K)

## Frameworks

**Core:**
- Astro 4.16.8 - Static site generator and framework

**Styling:**
- Tailwind CSS 3.4.14 - Utility-first CSS framework with @astrojs/tailwind integration

**Content:**
- @astrojs/mdx 3.1.9 - MDX support for content authoring

**Build/Dev:**
- @astrojs/check 0.9.4 - Type checking integration
- @astrojs/sitemap 3.2.1 - Automatic sitemap generation
- @astrojs/rss 4.0.9 - RSS feed generation

## Key Dependencies

**Critical:**
- astro 4.16.8 - Core framework for static site generation
- @astrojs/tailwind 5.1.2 - Tailwind CSS integration with Astro
- typescript 5.6.3 - Type safety for all TypeScript code

**Frameworks & Integrations:**
- @astrojs/mdx 3.1.9 - MDX support for content pages
- @astrojs/sitemap 3.2.1 - SEO sitemap generation
- @astrojs/rss 4.0.9 - RSS feed generation
- @astrojs/check 0.9.4 - Type checking and diagnostics
- tailwindcss 3.4.14 - CSS framework

## Configuration

**Environment:**
- No environment variables required or detected
- No `.env` files in repository

**Build:**
- `tsconfig.json` - TypeScript strict mode configuration extending astro/tsconfigs/strict
- `astro.config.mjs` - Astro framework configuration with site URL: https://matt.creenan.me
- `tailwind.config.mjs` - Tailwind CSS configuration

## Platform Requirements

**Development:**
- Node.js 20
- Yarn package manager
- TypeScript 5.6.3

**Production:**
- Deployed on GitHub Pages
- Hosting: GitHub Pages (github-pages environment)
- Static site output to dist directory

## Build & Development Commands

**Development:**
- `yarn dev` or `yarn start` - Start local development server via `astro dev`
- `yarn build` - Type check with `astro check` then build with `astro build`
- `yarn preview` - Preview production build locally
- `yarn astro` - Direct access to Astro CLI

## CI/CD Pipeline

**Continuous Integration:**
- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Trigger: Push to main branch or manual workflow dispatch
- Build runner: Ubuntu latest
- Deployment: GitHub Pages automatic deployment

---

*Stack analysis: 2026-03-21*
