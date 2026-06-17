import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '../locales/en/translation.json'
import uk from '../locales/uk/translation.json'

const STORAGE_KEY = 'passage_language'
const savedLng = localStorage.getItem(STORAGE_KEY)

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      uk: { translation: uk },
    },
    lng: savedLng ?? 'uk',
    fallbackLng: 'uk',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })

export default i18n
