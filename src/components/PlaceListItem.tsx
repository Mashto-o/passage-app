import React from 'react'
import { useTranslation } from 'react-i18next'
import { Zap } from 'lucide-react'
import { AccessibilityBadge } from './AccessibilityBadge'
import { StatusBadge } from './StatusBadge'
import { getCategoryIcon } from '../utils/categoryIcon'


export interface PlaceListItemProps {
  name: string
  address: string
  distance: string
  accessibilityScore: number
  category: string
  verifiedAt: Date
  isLiftDependent: boolean
  onPress?: () => void
  onClick?: () => void
  className?: string
}

// ── Score-driven helpers ───────────────────────────────────────────────────

const getVariantFromScore = (score?: number) => {
  if (score === undefined) return 'unknown'
  if (score >= 80) return 'accessible'
  if (score >= 40) return 'partial'
  return 'inaccessible'
}

const getColourClasses = (variant: string) => {
  switch (variant) {
    case 'accessible':   return { bg: 'bg-success-100',  text: 'text-success-700', icon: 'text-success-500'  }
    case 'partial':      return { bg: 'bg-warning-100',  text: 'text-warning-500', icon: 'text-warning-500'  }
    case 'inaccessible': return { bg: 'bg-danger-100',   text: 'text-danger-500',  icon: 'text-danger-500'   }
    default:             return { bg: 'bg-neutral-100',  text: 'text-neutral-500', icon: 'text-neutral-400'  }
  }
}

// Map to StatusBadge's variant union
const toStatusVariant = (variant: string): 'positive' | 'warning' | 'negative' => {
  if (variant === 'accessible')   return 'positive'
  if (variant === 'partial')      return 'warning'
  return 'negative'
}

// Map to AccessibilityBadge's variant union
const toAccessibilityVariant = (variant: string): 'accessible' | 'partial' | 'inaccessible' | 'unknown' => {
  if (variant === 'accessible')   return 'accessible'
  if (variant === 'partial')      return 'partial'
  if (variant === 'inaccessible') return 'inaccessible'
  return 'unknown'
}


export const PlaceListItem: React.FC<PlaceListItemProps> = ({
  name,
  address,
  distance,
  accessibilityScore,
  category,
  verifiedAt,
  isLiftDependent,
  onPress,
  onClick,
  className = '',
}) => {
  const { t, i18n } = useTranslation()

  const getVerifiedAtLabel = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins   = Math.floor(diffMs / (1000 * 60))
    const diffHours  = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays   = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffWeeks  = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)

    const locale = i18n.language === 'uk' ? 'uk-UA' : 'en-GB'
    if (diffMins  <  60) return t('placeListItem.minutesAgo', { count: diffMins  })
    if (diffHours <  24) return t('placeListItem.hoursAgo',   { count: diffHours })
    if (diffDays  <   7) return t('placeListItem.daysAgo',    { count: diffDays  })
    if (diffWeeks <   5) return t('placeListItem.weeksAgo',   { count: diffWeeks })
    if (diffMonths < 12) return date.toLocaleDateString(locale, { day: '2-digit', month: 'short' })
    return date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: '2-digit' })
  }

  const variant       = getVariantFromScore(accessibilityScore)
  const statusVariant = toStatusVariant(variant)
  const a11yVariant   = toAccessibilityVariant(variant)

  const handler = onPress ?? onClick
  const Tag = handler ? 'button' : 'div'
  const interactiveProps = handler
    ? {
        type: 'button' as const,
        onClick: handler,
        'aria-label': t('placeListItem.viewDetails', { name }),
        className: [
          'flex flex-col gap-lg w-full text-left',
          'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      }
    : { className: `flex flex-col gap-lg w-full ${className}` }

  return (
    <Tag {...interactiveProps}>
      {/* Badge row + info row grouped with tight gap */}
      <div className="flex flex-col gap-xs w-full">

        {/* Badge row — full width */}
        <div className="flex items-center gap-[10px]">
          <AccessibilityBadge variant={a11yVariant} size="sm" icon={getCategoryIcon(category, 12)} />

          <StatusBadge
            variant={statusVariant}
            label={t('map.accessiblePercent', { score: accessibilityScore })}
          />

          {isLiftDependent && (
            <div className="flex items-center gap-xs px-xs py-2xs bg-warning-100 rounded-xl">
              <Zap size={16} strokeWidth={1.5} className="text-warning-500 shrink-0" />
              <span className="text-[14px] font-regular leading-[1.4] tracking-[0.12px] text-warning-500 whitespace-nowrap">
                {t('placeListItem.liftDependent')}
              </span>
            </div>
          )}
        </div>

        {/* Info row */}
        <div className="flex items-end justify-between w-full">

          {/* Left: name + address */}
          <div className="flex flex-col gap-2xs flex-1 min-w-0">
            <span className="text-heading-sm text-neutral-900 truncate">
              {name}
            </span>
            <span className="text-body-sm text-neutral-500 truncate">
              {address}
            </span>
          </div>

          {/* Right: distance + verified time */}
          <div className="flex flex-col gap-2xs items-end w-[56px] shrink-0">
            <span className="text-body-sb text-neutral-900 text-right whitespace-nowrap">
              {distance}
            </span>
            <span className="text-body-sm text-neutral-400 text-right whitespace-nowrap">
              {getVerifiedAtLabel(verifiedAt)}
            </span>
          </div>
        </div>{/* end info row */}
      </div>{/* end badge+info group */}

    </Tag>
  )
}
