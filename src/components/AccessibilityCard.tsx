import React from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityBadge } from './AccessibilityBadge'

export interface AccessibilityCardProps {
  accessibility: 'accessible' | 'partiallyAccessible' | 'inaccessible' | 'unknown'
  selected?: boolean
  onClick?: () => void
  className?: string
}

const config: Record<
  AccessibilityCardProps['accessibility'],
  {
    badgeVariant: 'accessible' | 'partial' | 'inaccessible' | 'unknown'
    labelKey: string
    selectedBg: string
    selectedBorder: string
  }
> = {
  accessible: {
    badgeVariant: 'accessible',
    labelKey: 'accessibilityCard.accessible',
    selectedBg: 'bg-success-100',
    selectedBorder: 'border-success-500',
  },
  partiallyAccessible: {
    badgeVariant: 'partial',
    labelKey: 'accessibilityCard.partiallyAccessible',
    selectedBg: 'bg-warning-100',
    selectedBorder: 'border-warning-500',
  },
  inaccessible: {
    badgeVariant: 'inaccessible',
    labelKey: 'accessibilityCard.inaccessible',
    selectedBg: 'bg-danger-100',
    selectedBorder: 'border-danger-500',
  },
  unknown: {
    badgeVariant: 'unknown',
    labelKey: 'accessibilityCard.unknown',
    selectedBg: 'bg-neutral-100',
    selectedBorder: 'border-neutral-400',
  },
}

export const AccessibilityCard: React.FC<AccessibilityCardProps> = ({
  accessibility,
  selected = false,
  onClick,
  className = '',
}) => {
  const { t } = useTranslation()
  const { badgeVariant, labelKey, selectedBg, selectedBorder } = config[accessibility]
  const label = t(labelKey)

  const bg = selected ? selectedBg : 'bg-neutral-0'
  const border = selected ? selectedBorder : 'border-neutral-200'

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={[
        'flex flex-col items-center justify-center gap-[8px]',
        'w-[112px] h-[92px] p-[12px]',
        'rounded-[24px] border',
        bg,
        border,
        'transition-colors duration-200',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <AccessibilityBadge variant={badgeVariant} size="sm" />
      <span className="text-neutral-900 text-center text-[12px] font-medium leading-[1.4] tracking-[0.12px]">
        {label}
      </span>
    </button>
  )
}
