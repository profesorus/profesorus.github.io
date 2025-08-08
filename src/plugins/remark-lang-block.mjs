//: src/plugins/remark-lang-block.mjs
//: ----------------------------------------------------------------------------

//: Główna funkcja pluginu
//: --------------------------------------------------------
//: UWAGA: operuje na bazie danych z options: { lang }
//: --------------------------------------------------------
export function createLangBlockPlugin(options) {
  const langToKeep = options.lang || 'pl';

  return function (tree, file) {
    const newChildren = [];
    let isInsideBlockToRemove = false;

    for (const node of tree.children) {
      if (node.type === 'html') {
        const openMatch = node.value.match(/<!--\[:([a-z]{2})\]-->/);
        const closeMatch = node.value.match(/<!--\[\/([a-z]{2})\]-->/);

        if (openMatch) {
          const lang = openMatch[1];
          if (lang !== langToKeep) {
            isInsideBlockToRemove = true;
          }
          continue; // Usuń znacznik otwierający
        }

        if (closeMatch) {
          const lang = closeMatch[1];
          if (lang !== langToKeep) {
            isInsideBlockToRemove = false;
          }
          continue; // Usuń znacznik zamykający
        }
      }

      if (!isInsideBlockToRemove) {
        newChildren.push(node);
      }
    }
    tree.children = newChildren;
  };
}
