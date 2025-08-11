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

import path from 'path'; //: @ vite resolve

// Ręczna transformacja (sketch)
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
    assets: '__',
    inlineStylesheets: 'never',
    // inlineStylesheets: 'always',
  },
  // publicDir: './my-custom-publicDir-directory',
  //: -----------------------------
  //: https://docs.astro.build/en/guides/integrations-guide/mdx/
  //: https://docs.astro.build/en/guides/integrations-guide/sitemap/
  //: integrations: [mdx()],
  //: -----------------------------
  // integrations: [mdx(), sitemap()],
  integrations: [
    mdx(),
    stripHTMLComments(),
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
    // "/blog": "https://example.com/blog"
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
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    },
  },
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
