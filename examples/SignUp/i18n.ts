import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// tslint:disable-next-line:no-var-requires
const fr = require('./locales/fr/translation.json');

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule)
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
      fr: {translation: fr}
    }
  });

export default i18n;
