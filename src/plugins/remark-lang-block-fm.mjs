//: src/plugins/remark-lang-block-fm.mjs
//: ----------------------------------------------------------------------------

//: Główna funkcja pluginu
//: --------------------------------------------------------
//: UWAGA: operuje tylko na bazie danych z frontmatter
//: --------------------------------------------------------
export default function remarkLangBlockFrontmatter() {
  return function (tree, file) {
    // const langToKeep = file.data?.astro?.frontmatter?.lang || 'en';
    const langToKeep = file.data?.astro?.frontmatter?.languages?.[0]
      || file.data?.astro?.frontmatter?.lang || 'pl';

    const newChildren = [];
    let isInsideBlockToRemove = false;

    for (const node of tree.children) {
      // Sprawdzamy, czy węzeł jest komentarzem HTML
      if (node.type === 'html') {
        const openMatch = node.value.match(/<!--\[:([a-z]{2})\]-->/);
        const closeMatch = node.value.match(/<!--\[\/([a-z]{2})\]-->/);

        if (openMatch) {
          const lang = openMatch[1];
          if (lang !== langToKeep) {
            // Wchodzimy do bloku, który będziemy usuwać
            isInsideBlockToRemove = true;
          }
          // Niezależnie od wszystkiego, sam znacznik otwierający jest usuwany
          continue;
        }

        if (closeMatch) {
          const lang = closeMatch[1];
          if (lang !== langToKeep) {
            // Wychodzimy z bloku, który usuwaliśmy
            isInsideBlockToRemove = false;
          }
          // Sam znacznik zamykający również jest zawsze usuwany
          continue;
        }
      }

      // Jeśli nie jesteśmy wewnątrz bloku do usunięcia, zachowujemy węzeł
      if (!isInsideBlockToRemove) {
        newChildren.push(node);
      }
    }

    // Zastępujemy stare dzieci nową, przefiltrowaną listą
    tree.children = newChildren;
  };
}
