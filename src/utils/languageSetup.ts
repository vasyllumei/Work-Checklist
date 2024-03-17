import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from './translationEn.json';
import translationUa from './translationUa.json';

const resources = {
  en: {
    translation: translationEn,
  },
  ua: {
    translation: translationUa,
  },
};

i18n.use(initReactI18next).init({
  debug: true,
  resources: resources,
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
});
