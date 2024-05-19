import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from './translationEn.json';
import translationUa from './translationUa.json';
import enFlag from '@/assets/image/flags/enFlag.svg';
import uaFlag from '@/assets/image/flags/uaFlag.svg';

const resources = {
  en: {
    translation: translationEn,
  },
  ua: {
    translation: translationUa,
  },
};

i18n.use(initReactI18next).init({
  debug: false,
  resources: resources,
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
});
export const languageList = [
  { value: 'en', label: 'En', leftIcon: enFlag },
  { value: 'ua', label: 'Ua', leftIcon: uaFlag },
];
