import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LanguageDetectorAsyncModule } from 'i18next';

import en from './locales/en.json';
import es from './locales/es.json';

const LANGUAGE_KEY = 'user-language';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    AsyncStorage.getItem(LANGUAGE_KEY)
      .then((language) => {
        if (language) {
          callback(language);
        } else {
          const bestLocale = RNLocalize.getLocales()[0]?.languageCode || 'es';
          callback(bestLocale);
        }
      })
      .catch(() => callback('es')); // fallback en caso de error
  },
  init: () => {},
  cacheUserLanguage: (lng) => {
    AsyncStorage.setItem(LANGUAGE_KEY, lng);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
