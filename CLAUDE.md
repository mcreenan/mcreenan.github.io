## Project

Matt Creenan's personal site (matt.creenan.me): an Astro static site deployed to GitHub Pages.

The home page is a single page. A cozy night-time room scene is pinned behind it: a sit-stand desk with a working retro CRT terminal, a boombox that plays Web Audio music, and Matt's avatar on a beanbag in the corner. The about, now, projects, work, and contact sections scroll over the scene. `/resume` is a standalone resume page, also rendered to `/resume.pdf` at build time.

## Tech stack

- Astro 4, TypeScript (strict), plain CSS (no Tailwind)
- Bun for packages and scripts (`bun.lock`)
- `@astrojs/sitemap` for the sitemap
- `astro-pdf` renders `/resume` to `/resume.pdf` with Puppeteer during the build
- Fonts are self-hosted in `public/fonts/`

## Commands

- `bun run dev`: dev server with `--host` (reachable on the LAN and Tailscale)
- `bun run build`: `astro check`, then `astro build`, which includes the PDF render
- `bun run preview`: preview the production build
- If Puppeteer's bundled Chrome is missing locally, build with `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`

## Layout

- `src/pages/index.astro`: the home page (scene and content sections)
- `src/pages/resume.astro`: the resume page and PDF source
- `src/data/profile.ts`: site copy data (role, links, projects, jobs), shared by the home page, the resume, and the terminal
- `src/data/room.ts`: room geometry (back wall, windows, door, floor line) in percent of the stage. Place furniture and decor from these values so they line up with the drawing.
- `src/components/`
  - `Room.astro`: walls, floor, trim, and rug, in one-point perspective
  - `Yard.astro`: moonlit snowy yard seen through the glass
  - `Furniture.astro`: floor lamp (the lights toggle), pennants, family photo, bookshelf, and desk
  - `Crt.astro`, `Boombox.astro`, `Character.astro`
- `src/scripts/`: `scene.ts` (sky, lights, parallax, speech bubble), `terminal.ts` (terminal commands), `music.ts` (Web Audio), `email.ts` (click-to-reveal email)
- `src/styles/site.css`: all styles

## Scene conventions

- The room lives in a 16:10 `.stage` that always fills the viewport height. Narrow screens crop its sides; wide screens see the side walls, ceiling, and floor extend in perspective. Never stretch scene elements with the viewport width. Size things inside the stage with `%`/`cqw`/`cqh`.
- The avatar (`Character.astro`) is pinned to the viewport's bottom-right corner, outside the stage.
- Keep the scene dim and warm so it stays in the background behind the content.
- Decor should be personal to Matt (Bills/Sabres, family, Buffalo) or simple ambient touches. Keep it minimal.
- The email address never appears in the HTML. It is XOR-encoded in `src/scripts/email.ts` and revealed on click. The PDF build clicks the link so the resume PDF includes it.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds with `withastro/action@v2` (Bun) and deploys to GitHub Pages on every push to `main`.
