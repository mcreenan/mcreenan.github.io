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
                        // No Chromium margins — its margin box renders white
                        // and is NOT painted by the page background. Per-page
                        // insets are handled by `@page { margin }` in CSS
                        // instead, so the warm-cream surface propagates across
                        // the whole sheet (margins included) while content
                        // stays inset on every page.
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
