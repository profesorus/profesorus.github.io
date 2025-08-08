// utils/i18n.js
export const t = (key, lang = 'en') => {
  const translations = {
    en: { welcome: "Welcome" },
    pl: { welcome: "Witaj" }
  };
  return translations[lang]?.[key] || key;
};
