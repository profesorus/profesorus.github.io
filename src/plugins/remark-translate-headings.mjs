//: src/plugins/remark-translate-headings.mjs
//: ----------------------------------------------------------------------------
import { visit } from 'unist-util-visit';

//: Główna funkcja pluginu
//: --------------------------------------------------------
//: UWAGA: operuje tylko na bazie danych z frontmatter
//: --------------------------------------------------------
export default function remarkTranslateHeadings() {
  // Zwracamy funkcję "transformatora", która operuje na drzewie dokumentu
  return function (tree, file) {
    // Prawidłowa ścieżka do frontmatter w Astro + zabezpieczenie
    const frontmatter = file.data?.astro?.frontmatter || {};
    const lang = frontmatter.lang || 'en';
    const translations = frontmatter.translations || {};

    // Jeśli nie ma obiektu tłumaczeń dla danego języka, nic nie robimy
    if (!translations[lang]) {
      return;
    }

    const translationMap = translations[lang];

    // Odwiedzamy wszystkie węzły nagłówków
    visit(tree, 'heading', function (node) {
      if (node.children && node.children.length > 0 && node.children[0].type === 'text') {
        const originalText = node.children[0].value;
        const translatedText = translationMap[originalText];

        // Jeśli znaleziono tłumaczenie, podmieniamy treść
        if (translatedText) {
          node.children[0].value = translatedText;
        }
      }
    });
  };
}
