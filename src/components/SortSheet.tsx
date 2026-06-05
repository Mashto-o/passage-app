import React from 'react'
import { Button } from './Button'
import { RadioButton } from './RadioButton'
import { Divider } from './Divider'

// ── Types ──────────────────────────────────────────────────────────────────

type SortOption = string

export interface SortSheetProps {
  isOpen: boolean
  options: SortOption[]
  value: SortOption
  onChange: (value: SortOption) => void
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
  const handleSelect = (option: SortOption) => {
    onChange(option)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0 z-[45] bg-transparent',
          isOpen ? '' : 'pointer-events-none',
        ].filter(Boolean).join(' ')}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={[
          'fixed bottom-0 left-1/2 -translate-x-1/2',
          'w-[402px] bg-neutral-0',
          'rounded-tl-[48px] rounded-tr-[48px]',
          'z-[50] flex flex-col items-center px-[24px]',
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
          <Button variant="back" onClick={onClose}>Back</Button>
          <span className="font-medium text-[24px] leading-[1.3] tracking-[-0.48px] text-neutral-900">
            Sort by
          </span>
        </div>

        {/* Options list */}
        <div className="flex flex-col gap-lg w-full pb-lg">
          {options.map((option, idx) => (
            <React.Fragment key={option}>
              <button
                type="button"
                aria-pressed={value === option}
                onClick={() => handleSelect(option)}
                className={[
                  'flex items-center justify-between w-full',
                  'transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                ].join(' ')}
              >
                <span
                  className={[
                    'text-[16px] leading-[1.4] text-neutral-900',
                    value === option ? 'font-semibold' : 'font-normal leading-[1.5]',
                  ].join(' ')}
                >
                  {option}
                </span>
                <RadioButton selected={value === option} />
              </button>
              {idx < options.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
