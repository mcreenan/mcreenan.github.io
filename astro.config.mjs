// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pdf from 'astro-pdf';

// https://astro.build/config
export default defineConfig({
    site: 'https://matt.creenan.me',
    // The old multi-page routes now live as sections of the single-page home.
    redirects: {
        '/about': '/#about',
        '/work': '/#experience',
        '/contact': '/#contact',
    },
    integrations: [
        sitemap(),
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
                    // The email is click-to-reveal on the web; reveal it so the PDF carries it.
                    callback: (page) => page.click('a.email'),
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
