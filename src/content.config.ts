//: src/content/config.ts
//: ----------------------------------------------------------------------------
//: https://docs.astro.build/en/guides/content-collections/
//: ----------------------------------------------------------------------------
import { defineCollection, z } from 'astro:content';
import { defineContent } from "astro:content";
import { glob, file } from 'astro/loaders';

//: ----------------------------------------------------------------------------
//: CONTENT (default location)

const pl = defineCollection({
  schema: z.object({
    title: z.string(),
    menu: z.string().optional(),
    lang: z.enum(['pl', 'de']).default('pl'),
    slug: z.string().optional(),
  })
});

const de = defineCollection({
  //: ----------------------------------------------------------------- NOTE ---
  //: default - {id: 10.md , slug: 10 }
  //: loader -- {id: 10, slug: undefined }
  // {
  //   id: '00.md',
  //   data: { title: 'Prof. Dr. Karol Sauerland', lang: 'de' },
  //   slug: '000'
  // }
  // {
  //   id: '001',
  //   data: { title: 'Buchveröffentlichungen', lang: 'de', slug: '001' },
  //   slug: undefined
  // }
  //: ----------------------------------------------------------------- NOTE ---
  // loader: glob({ pattern: "**/*.md", base: "./src/content/de" }),
  // loader: glob({ pattern: ["*.md", "!--*" ], base: "./src/content/de" }),
  //: ---------------------------------------
  schema: z.object({
    title: z.string(),
    menu: z.string().optional(),
    lang: z.enum(['pl', 'de']).default('de'),
    slug: z.string().optional(),
  })
});

const uni = defineCollection({
  schema: z.object({
    title: z.string(),
    titl: z.object({
      pl: z.string(),
      de: z.string(),
    }),
    menu: z.string().optional(),
    lang: z.enum(['--', 'pl', 'de']).default('pl'),
    languages: z.array(z.enum(['pl', 'de'])).optional(),
    slug: z.string().optional(),
  })
});

const txt = defineCollection({
  schema: z.object({
    title: z.string(),
    subtitle: z.object({
      pl: z.string().optional(),
      de: z.string().optional(),
    }).optional(),
    menu: z.string().optional(),
    lang: z.enum(['--', 'pl', 'de']).default('pl'),
    languages: z.array(z.enum(['pl', 'de'])).optional(),
    slug: z.string().optional(),
  })
});

//: ----------------------------------------------------------------------------
//: FREE

// const ___test = defineCollection({
//   loader: glob({ pattern: "*.md", base: "./src/pages/___test___" }),
//   schema: z.object({
//     title: z.string().optional(),
//     // lang: z.enum(['pl', 'de']).default('pl'),
//     slug: z.string().optional(),
//   })
// });

// const ___test___ = defineCollection({
//   loader: glob({ pattern: "*.md", base: "./src/pages/___test___"}),
//   schema: z.object({
//     title: z.string().optional(),
//     slug: z.string().optional(),
//   }),
// });

// const _ = defineCollection({
//   loader: glob({ pattern: "**/*.md", base: "./src/content/__+" }),
//   schema: z.object({
//     title: z.string().optional(),
//     lang: z.enum(['pl', 'de']).default('pl'),
//     slug: z.string().optional(),
//   })
// });

// const __ = defineCollection({
//   // loader: glob({ pattern: "**/*.md", base: "./src/content/pl/__" }),
//   schema: z.object({
//     title: z.string().optional(),
//     lang: z.enum(['pl', 'de']).default('de'),
//     slug: z.string().optional(),
//   })
// });

//: ----------------------------------------------------------------------------
//: DATA (json)

const cats = defineCollection({
  loader: file("src/_data/pets.json", {
    parser: (text) => JSON.parse(text).cats
  })
});

//: ----------------------------------------------------------------------------
export const collections = {
  //: ---------------------------------------
  //: odpowiada nazwie folderu w src/content/
  //: ---------------------------------------
  pl, de, uni, txt,
  //: ---------------------------------------
  // _, __, ___test,
  // ___test___: ___test___,
  //: ---------------------------------------
  cats,
  //: ---------------------------------------
};
