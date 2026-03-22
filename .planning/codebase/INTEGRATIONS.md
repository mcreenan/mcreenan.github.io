# External Integrations

**Analysis Date:** 2026-03-21

## APIs & External Services

**Font Services:**
- Google Fonts - Typography via googleapis.com and fonts.gstatic.com
  - Integration: CSS link preload in `src/components/BaseHead.astro`
  - Fonts: Montserrat (weight 700), Roboto (weight 700)
  - Status: Via CSS link tags with preconnect

**Icon Libraries:**
- Phosphor Icons (@phosphor-icons/web) - Icon library
  - Integration: CDN script from unpkg.com in `src/components/BaseHead.astro`
  - Usage: SVG icon system for UI elements

- Font Awesome 6.5.1 - Icon library fallback
  - Integration: CDN CSS from cdnjs.cloudflare.com in `src/components/BaseHead.astro`
  - Scope: CSS icon classes

**Social Links (External):**
- Twitter - Contact page link
- Bluesky (bsky.app) - Contact page link
- GitHub - Contact page link
- LinkedIn - Contact page link
- External portfolio link to torch.io

## Data Storage

**Databases:**
- Not applicable - Static site with no database

**File Storage:**
- Local filesystem only - Static assets in `public/` directory
- Fonts stored locally: `public/fonts/atkinson-regular.woff`, `public/fonts/atkinson-bold.woff`

**Caching:**
- Built-in to GitHub Pages (static site)
- No application-level caching configured

## Authentication & Identity

**Auth Provider:**
- None - Static public website
- No user authentication or authorization

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service configured

**Logs:**
- Build logs via GitHub Actions
- No runtime logging configured (static site)

**Analytics:**
- Not detected - No analytics tracking code present

## CI/CD & Deployment

**Hosting:**
- GitHub Pages
  - URL: https://matt.creenan.me (configured in `astro.config.mjs`)
  - Environment: github-pages

**CI Pipeline:**
- GitHub Actions: `.github/workflows/deploy.yml`
- Build step: Uses withastro/action@v2 with Node 20
- Deployment step: Uses actions/deploy-pages@v4
- Triggers: Push to main or manual workflow_dispatch

**Build Artifacts:**
- Output: Static HTML/CSS/JS in dist directory
- Deployment: Direct to GitHub Pages via OIDC token authentication

## Environment Configuration

**Required env vars:**
- None - No environment variables required

**Secrets location:**
- None - No secrets needed for static site

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## Content & Assets

**Content Format:**
- MDX support enabled via @astrojs/mdx for rich content authoring
- Static pages in `src/pages/` directory

**SEO Features:**
- Sitemap generation via @astrojs/sitemap (automatic)
- RSS feed generation via @astrojs/rss
- Open Graph metadata in `src/components/BaseHead.astro`
- Twitter card metadata in `src/components/BaseHead.astro`

---

*Integration audit: 2026-03-21*
