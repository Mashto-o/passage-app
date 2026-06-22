import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles, Check, ChevronDown, RotateCcw } from 'lucide-react'
import { AccessibilityCard } from './AccessibilityCard'
import { MediaInputButton } from './MediaInputButton'
import { ToggleButton } from './ToggleButton'
import { Divider } from './Divider'

// ── Types ──────────────────────────────────────────────────────────

export interface ReviewSectionQuestion {
  id: string
  label: string
  value: 'yes' | 'no' | null
  aiSet: boolean
}

export interface ReviewSectionProps {
  icon: React.ReactNode
  label: string
  inputLabel?: string
  skipLabel?: string
  fillManuallyLabel?: string
  resetSectionLabel?: string
  skippedLabel?: string
  photoSrc: string | null
  status: 'empty' | 'analyzing' | 'done' | 'skipped'
  accessibilityValue: 'accessible' | 'partiallyAccessible' | 'inaccessible' | null
  aiSetAccessibility: boolean
  onAccessibilityChange: (value: 'accessible' | 'partiallyAccessible' | 'inaccessible') => void
  onPhotoSelect: (file: File) => void
  onFillManually?: () => void
  onSkip?: () => void
  onReset?: () => void
  questions: ReviewSectionQuestion[]
  onQuestionChange: (id: string, value: 'yes' | 'no') => void
  isComplete?: boolean
  isOpen: boolean
  onToggle: () => void
}

// ── Component ──────────────────────────────────────────────────────

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  icon,
  label,
  inputLabel,
  skipLabel,
  fillManuallyLabel,
  resetSectionLabel,
  skippedLabel,
  photoSrc,
  status,
  accessibilityValue,
  aiSetAccessibility,
  onAccessibilityChange,
  onPhotoSelect,
  onFillManually,
  onSkip,
  onReset,
  questions,
  onQuestionChange,
  isComplete = false,
  isOpen,
  onToggle,
}) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onPhotoSelect(file)
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-col">

      {/* ── Header row ──────────────────────────────────────── */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-xs">
          <span className="text-neutral-700">{icon}</span>
          <span className="text-caption-md uppercase tracking-caption-md text-neutral-700">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-xs">
          {/* Reset button — shown when done or skipped */}
          {(status === 'done' || status === 'skipped') && onReset && (
            <button
              type="button"
              onClick={onReset}
              aria-label={resetSectionLabel}
              className="text-neutral-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
            >
              <RotateCcw size={16} strokeWidth={1.5} />
            </button>
          )}

          {/* Toggle button — done state */}
          {status === 'done' && (
            <button
              type="button"
              onClick={onToggle}
              className="flex items-center gap-xs focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
            >
              {isComplete && <Check size={16} strokeWidth={2} className="text-success-500" />}
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                className={[
                  'text-neutral-500 transition-transform duration-300',
                  isOpen ? 'rotate-180' : '',
                ].join(' ')}
              />
            </button>
          )}

          {/* Skipped label */}
          {status === 'skipped' && (
            <span className="text-caption-md text-neutral-400">
              {skippedLabel}
            </span>
          )}
        </div>
      </div>

      {/* ── Empty state ─────────────────────────────────────── */}
      {status === 'empty' && (
        <div className="mt-md flex flex-col gap-sm">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="sr-only"
            aria-label={inputLabel ?? `Upload photo for ${label.toLowerCase()} accessibility`}
            onChange={handleFileChange}
          />
          <MediaInputButton
            variant="camera"
            onPress={() => fileInputRef.current?.click()}
          />
          {(onFillManually || onSkip) && (
            <div className="flex items-center justify-between">
              {onFillManually && (
                <button
                  type="button"
                  onClick={onFillManually}
                  className={[
                    'border border-neutral-300 rounded-full px-md py-xs',
                    'text-neutral-900 text-body-sm',
                    'transition-colors duration-200',
                    'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                  ].join(' ')}
                >
                  {fillManuallyLabel}
                </button>
              )}
              {onSkip && (
                <button
                  type="button"
                  onClick={onSkip}
                  className={[
                    'text-neutral-500 text-body-sm',
                    'transition-colors duration-200',
                    'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm',
                  ].join(' ')}
                >
                  {skipLabel}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Analyzing state ──────────────────────────────────── */}
      {status === 'analyzing' && (
        <div className="mt-md flex flex-col gap-md">
          {photoSrc && (
            <img
              src={photoSrc}
              alt="Uploaded"
              className="h-[120px] w-full rounded-lg object-cover"
            />
          )}
          <div className="bg-neutral-0 border border-neutral-200 rounded-lg p-md flex items-center gap-sm">
            <Sparkles
              size={20}
              strokeWidth={1.5}
              className="text-primary-500 animate-pulse shrink-0"
            />
            <span className="text-body-sm text-neutral-700">{t('reviewScreen.analyzingPhoto')}</span>
          </div>
        </div>
      )}

      {/* ── Done state — collapsible ─────────────────────────── */}
      {status === 'done' && (
        <div
          className="overflow-hidden transition-all duration-300"
          style={isOpen ? { maxHeight: '2000px' } : { maxHeight: '0px' }}
        >
          <div className="mt-md flex flex-col gap-md">

            {/* Photo preview */}
            {photoSrc && (
              <img
                src={photoSrc}
                alt="Uploaded"
                className="h-[120px] w-full rounded-lg object-cover"
              />
            )}

            {/* Accessibility cards */}
            <div className="flex gap-sm">
              {(['accessible', 'partiallyAccessible', 'inaccessible'] as const).map(variant => {
                const isSelected = accessibilityValue === variant
                return (
                  <div key={variant} className="relative flex-1 min-w-0">
                    <AccessibilityCard
                      accessibility={variant}
                      selected={isSelected}
                      onClick={() => onAccessibilityChange(variant)}
                      className="w-full"
                    />
                    {isSelected && aiSetAccessibility && (
                      <div className="absolute top-xs right-xs pointer-events-none">
                        <Sparkles size={12} strokeWidth={1.5} className="text-primary-500" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Questions */}
            <div className="flex flex-col">
              {questions.map((q, idx) => (
                <React.Fragment key={q.id}>
                  <div className="flex items-center justify-between gap-sm py-xs">
                    <span className="text-body-md text-neutral-900 w-[189px] shrink-0">
                      {q.label}
                    </span>
                    <div className="flex items-center gap-xs shrink-0">
                      {q.aiSet && (
                        <Sparkles
                          size={12}
                          strokeWidth={1.5}
                          className="text-primary-500 shrink-0"
                        />
                      )}
                      <ToggleButton
                        value={q.value}
                        onChange={val => onQuestionChange(q.id, val)}
                      />
                    </div>
                  </div>
                  {idx < questions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
