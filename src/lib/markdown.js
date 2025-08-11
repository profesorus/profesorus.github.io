// src/_utils/markdown.js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkDeflist from 'remark-deflist';
import { createLangBlockPlugin } from '../plugins/remark-lang-block.mjs';

export async function renderMarkdown(markdownContent, lang) {
  const file = await unified()
    .use(remarkParse)
    // Tutaj można dodać inne wtyczki remark, które były w astro.config.mjs
    .use(remarkDeflist)
    .use(createLangBlockPlugin, { lang: lang })
    .use(remarkRehype, { allowDangerousHtml: true })
    // Tutaj można dodać wtyczki rehype
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdownContent);

  return String(file);
}
