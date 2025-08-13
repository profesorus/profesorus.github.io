//: ==================================================================
//: https://docs.astro.build/en/reference/configuration-reference
//: ==================================================================
import { defineConfig } from 'astro/config';
//: ------------------------------------------------------------------
import remarkDeflist from 'remark-deflist';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

import remarkTranslateHeadings from './src/plugins/remark-translate-headings.mjs';
// import remarkLangBlock from './src/plugins/remark-lang-block.mjs'; // Usunięte, będzie stosowane dynamicznie
import remarkLangBlockFrontmatter from './src/plugins/remark-lang-block-fm.mjs';

//: import { stripHTMLComments } from "@zade/vite-plugin-strip-html-comments";
import { stripHTMLComments } from "./src/plugins/strip-html-comments/plugin.ts";

import path from 'node:path'; //: @ vite resolve

//: -----------------------------------------
// import { fileURLToPath } from 'node:url';
// import fs from 'fs-extra';
//: -----------------------------------------
// function filesPdfHandler() {
//   return {
//     name: 'files-pdf-handler',
//     hooks: {
//       // Po buildzie kopiujemy PDF-y
//       'astro:build:done': async ({ dir }) => {
//         const outDir = fileURLToPath(dir);
//         const src = path.resolve('public/files');
//         const dest = path.join(outDir, 'files');
//         if (fs.existsSync(src)) {
//           const files = (await fs.readdir(src)).filter(f => f.endsWith('.pdf'));
//           console.log(`📑 PDF-y znalezione w public/files:`);
//           files.forEach(f => console.log(`  - ${f}`));
//           // await fs.copy(src, dest, { overwrite: true });
//           console.log(`✅ Skopiowano PDF-y z ${src} → ${dest}`);
//         } else {
//           console.warn(`⚠️ Brak katalogu ${src} — pomijam kopiowanie.`);
//         }
//       }
//     },
//   };
// }
//: -----------------------------------------
// function preservePdfFiles() {
//   return {
//     name: 'preserve-pdf-files',
//     hooks: {
//       'astro:build:done': async ({ dir }) => {
//         const src = path.resolve('public/files');
//         const dest = path.resolve(dir, 'files');
//         if (fs.existsSync(src)) {
//           await fs.copy(src, dest, { overwrite: true });
//           console.log(`📄 Skopiowano PDF-y z ${src} → ${dest}`);
//         } else {
//           console.warn(`⚠️ Brak katalogu ${src} — pomijam kopiowanie.`);
//         }
//       }
//     }
//   };
// }

// Ręczna transformacja (sketch) vite
//: -----------------------------------------
// import { promises as fs } from 'fs';
// import path from 'path';
//: -----------------------------------------
// async function transformMarkdown(content, filePath) {
//   const langMatch = content.match(/lang:\s*["']?(\w+)["']?/i);
//   const lang = langMatch?.[1] || 'en';
//   const translationsPath = path.join(process.cwd(), 'src', 'locales', `${lang}.json`);
//   const translations = JSON.parse(await fs.readFile(translationsPath, 'utf-8'));
//   return content.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
//     return translations[key] || `[MISSING:${key}]`;
//   });
// }

//: Your Astro configuration goes here
//: ------------------------------------------------------------------
export default defineConfig({
  //: ------------------------------------------------------
  site: 'https://sauerland.pl', //: required by sitemap
  //: ------------------------------------------------------
  compressHTML: false,
  // trailingSlash: "never", //~~~~~~~
  //: -----------------------------
  build: {
    //: Generate `page.html` instead of `page/index.html`
    // format: 'file', //~~~~~~~~~~~~~
    assets: '__a__', //: default: _astro
    // inlineStylesheets: 'never',
    inlineStylesheets: 'always',
  },
  // publicDir: './my-publicDir',
  //: -----------------------------
  //: https://docs.astro.build/en/guides/integrations-guide/mdx/
  //: https://docs.astro.build/en/guides/integrations-guide/sitemap/
  //: -----------------------------
  integrations: [
    mdx(),
    stripHTMLComments(),
    // filesPdfHandler(),
    sitemap({
      // filenameBase: 'sauerland-sitemap',
      // lastmod: new Date(),
      i18n: {
        defaultLocale: 'pl',
        locales: {
          pl: 'pl',
          de: 'de',
        },
      },
      serialize(item) {
        if (/--/.test(item.url)) return undefined;
        if (/\+\+/.test(item.url)) return undefined;
        if (/list/.test(item.url)) return undefined;
        if (/todo/.test(item.url)) return undefined;
        if (/test/.test(item.url)) return undefined;
        if (item.url === 'https://sauerland.pl/') {
          item.lastmod = new Date();
          // item.changefreq = 'daily';
          // item.priority = 0.9;
        }
        return item;
      },
      // customPages: [
      //   'https://xexample.com/my.pdf', // <-- File from `public/`
      //   'https://xexample.com/my_french.pdf', // <-- File from `public/`
      // ],
    }),
  ],
  //: -----------------------------
  markdown: {
    remarkPlugins: [
      remarkDeflist, /* dl/dt/dd */
      remarkTranslateHeadings,
      //: remarkLangBlock, // Usunięte, będzie stosowane dynamicznie
      remarkLangBlockFrontmatter, // wersja Frontmatter
    ],
    // Włącz obsługę wyrażeń JS w MD
    extendDefaultPlugins: true,
  },
  //: -----------------------------
  //*/
  i18n: {
    defaultLocale: 'pl', // Domyślny język (np. polski)
    locales: ['pl', 'de', 'en'], // Obsługiwane języki
    routing: {
      prefixDefaultLocale: false, // emty \\ default
    },
    // fallback: {
    //   de: "pl"
    // },
    // routing: {
    //   fallbackType: "rewrite"
    // }
  },
  //*/
  //: -----------------------------
  redirects: {
    //: -------------------------------------
    //: 21:19:37 [_ERROR_] [build] Failed to call getStaticPaths for /*/[...slug]
    //: -------------------------------------
    // "/*/[...slug]": "/pl/[...slug]",
    // "/de/*/[...slug]": "/de/[...slug]",
    //: -------------------------------------
    // "/blog/[...slug]": "/articles/[...slug]",
    // "/old-page": "/new-page",
    // "/blog": "https://example.com/blog",
    //: -------------------------------------
    "/files/2020": "/files",
    "/files/2024": "/files",
    "/de/files": "/files",
  },
  //: -----------------------------
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    },
  },
  //: -----------------------------
  // vite: {
  //   resolve: {
  //     preserveSymlinks: true, //: Pomaga przy niestandardowych nazwach
  //   },
  //   plugins: [{
  //     name: 'md-transformer',
  //     async transform(code, id) {
  //       if (!id.endsWith('.md')) return;
  //       console.log(`📄 Processing: ${path.basename(id)}`);
  //       return await transformMarkdown(code, id);
  //     }
  // }]
  // },
  //: -----------------------------
  //: https://docs.astro.build/en/guides/troubleshooting/#adding-dependencies-to-astro-in-a-monorepo
  //: Adding dependencies to Astro in a monorepo
  //: @ resolve @ pnpm @ shamefully-hoist=true
  //: -----------------------------
  // vite: {
  //   ssr: {
  //     noExternal: [
  //       '@astrojs/vue',
  //       'astro-component-lib',
  //     ]
  //   }
  // },
  //: -----------------------------
});
