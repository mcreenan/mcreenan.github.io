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
                        // Margins handled by CSS `@page` (it takes precedence
                        // over this option, so keep these at 0 to avoid a
                        // zeroed-out result). The PDF uses a white content
                        // surface, matching the white margins — no mismatch.
                        margin: {
                            top: '0',
                            right: '0',
                            bottom: '0',
                            left: '0',
                        },
                    },
                },
            },
        }),
    ],
});
