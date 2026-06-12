import React from 'react'
import { useTranslation } from 'react-i18next'
import { changeLanguage, type SupportedLanguage } from '../i18n/changeLanguage'

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'uk', label: 'UK' },
]

export const DevLanguageToggle: React.FC = () => {
  const { i18n } = useTranslation()
  const current = i18n.language as SupportedLanguage

  return (
    <div
      role="group"
      aria-label="Dev: language switcher"
      className="fixed bottom-4 right-4 z-[9999] flex rounded-full bg-neutral-900/80 backdrop-blur-sm p-1 gap-1"
    >
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => changeLanguage(code)}
          aria-pressed={current === code}
          className={[
            'w-9 h-9 rounded-full text-caption-md font-semibold transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
            current === code
              ? 'bg-primary-500 text-neutral-0'
              : 'bg-transparent text-neutral-300 hover:text-neutral-0',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
