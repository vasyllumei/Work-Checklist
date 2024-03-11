// i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    resources: {
      en: {
        translation: {
          firstName: 'Enter your first name',
          lastName: 'Enter your last name',
          email: 'Invalid email',
          password: 'Password must have 5-12 characters, special symbol, and uppercase letter',
          addStatus: 'Add status',
          kanban: 'Kanban',
          dashboard: 'Dashboard',
          addTask: 'Add task',
          assignedUsers: 'assigned users',
          buttonsStates: 'buttons states',
          clear: 'Clear',
          search: 'Search',
        },
      },
      ua: {
        translation: {
          firstName: "Введіть ваше ім'я",
          lastName: 'Введіть ваше прізвище',
          email: 'Невірна електронна пошта',
          password: 'Пароль повинен містити від 5 до 12 символів, спеціальний символ та велику літеру',
          addStatus: 'Добавити статус',
          kanban: 'Дошка',
          dashboard: 'Інформаційна панель',
          addTask: 'Додати задачу',
          assignedUsers: 'призначені користувачі',
          buttonsStates: 'стани кнопок',
          clear: 'Очистити',
          search: 'Пошук',
        },
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
