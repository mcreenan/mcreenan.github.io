// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import pdf from 'astro-pdf';

// https://astro.build/config
export default defineConfig({
    site: 'https://matt.creenan.me',
    integrations: [
        mdx(),
        sitemap(),
        tailwind(),
        pdf({
            launch: {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                ...(process.env.PUPPETEER_EXECUTABLE_PATH
                    ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH }
                    : {}),
            },
            pages: {
                '/resume': {
                    path: '/resume.pdf',
                    waitUntil: 'networkidle0',
                    pdf: {
                        format: 'Letter',
                        printBackground: true,
                        // Per-page margins applied by Chromium for every
                        // page in the PDF. Body background paints through
                        // these regions, so the warm-cream surface still
                        // covers the page edge-to-edge while content is
                        // inset from the top on every sheet (not just p1).
                        margin: {
                            top: '36px',
                            right: '44px',
                            bottom: '36px',
                            left: '44px',
                        },
                    },
                },
            },
        }),
    ],
});
