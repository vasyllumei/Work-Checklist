import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enTranslations } from '@/utils/translationEn';
import { uaTranslations } from '@/utils/translationUa';

i18n.use(initReactI18next).init({
  debug: true,
  resources: {
    en: {
      translation: enTranslations,
    },
    ua: {
      translation: uaTranslations,
    },
  },

  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
});
