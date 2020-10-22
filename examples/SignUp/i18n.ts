import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import fr from './locales/fr/translation.json';

export default i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,

    fallbackLng: 'en',

    detection: {
      caches: []
    },

    // Allow keys to be phrases having `:`, `.`
    nsSeparator: false,
    keySeparator: false,

    interpolation: {
      escapeValue: false // Not needed with React
    },

    resources: {
      fr: { translation: fr }
    }
  });
