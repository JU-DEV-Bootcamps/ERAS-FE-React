import i18next, { type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './en';
import { es } from './es';
import { ptBR } from './pt-BR';

/** The languages of ERAS v3: English, neutral Spanish and Brazilian Portuguese (v2 is English only). */
export const LANGUAGES = ['en', 'es', 'pt-BR'] as const;
export type Language = (typeof LANGUAGES)[number];

/**
 * Creates the translation instance with the three languages. English is always the initial language and the
 * fallback; choosing another language in the UI is a later change with its own spec.
 */
export async function initI18n(): Promise<i18n> {
  const instance = i18next.createInstance();
  await instance.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: [...LANGUAGES],
    resources: {
      en: { translation: en },
      es: { translation: es },
      'pt-BR': { translation: ptBR },
    },
    interpolation: { escapeValue: false },
  });
  return instance;
}
