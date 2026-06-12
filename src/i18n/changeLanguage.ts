import i18n from './index'

const STORAGE_KEY = 'passage_language'

export type SupportedLanguage = 'en' | 'uk'

export function changeLanguage(lng: SupportedLanguage): void {
  i18n.changeLanguage(lng)
  localStorage.setItem(STORAGE_KEY, lng)
}
