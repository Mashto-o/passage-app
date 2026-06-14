import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './Button'
import { RadioButton } from './RadioButton'
import { Divider } from './Divider'

// ── Types ──────────────────────────────────────────────────────────────────

export interface SortOption {
  key: string
  label: string
}

export interface SortSheetProps {
  isOpen: boolean
  options: SortOption[]
  value: string
  onChange: (key: string) => void
  onClose: () => void
  height: number
}

// ── Component ──────────────────────────────────────────────────────────────

export const SortSheet: React.FC<SortSheetProps> = ({
  isOpen,
  options,
  value,
  onChange,
  onClose,
  height,
}) => {
  const { t } = useTranslation()

  const handleSelect = (key: string) => {
    onChange(key)
    onClose()
  }

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0 z-[66] bg-transparent',
          isOpen ? '' : 'pointer-events-none',
        ].filter(Boolean).join(' ')}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* SortSheet: width matches bottom sheet in MapScreen. Update both together if width changes. */}
      <div
        className={[
          'fixed bottom-0 left-0 right-0',
          'bg-neutral-0',
          'rounded-tl-[48px] rounded-tr-[48px]',
          'z-[71] flex flex-col items-center px-lg',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
        ].join(' ')}
        style={{ height }}
      >
        {/* Drag handle */}
        <div className="py-lg flex justify-center w-full">
          <div className="h-[3px] w-[40px] bg-neutral-400 rounded-full" />
        </div>

        {/* Header */}
        <div className="pb-lg flex flex-col gap-sm w-full">
          <Button variant="back" onClick={onClose}>{t('common.back')}</Button>
          <span className="text-display-md text-neutral-900">
            {t('sort.sortBy')}
          </span>
        </div>

        {/* Options list */}
        <div className="flex flex-col gap-lg w-full pb-lg">
          {options.map((option, idx) => (
            <React.Fragment key={option.key}>
              <button
                type="button"
                aria-pressed={value === option.key}
                onClick={() => handleSelect(option.key)}
                className={[
                  'flex items-center justify-between w-full',
                  'transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                ].join(' ')}
              >
                <span
                  className={[
                    'text-body-md text-neutral-900',
                    value === option.key ? 'font-semibold' : 'font-normal',
                  ].join(' ')}
                >
                  {option.label}
                </span>
                <RadioButton selected={value === option.key} />
              </button>
              {idx < options.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
