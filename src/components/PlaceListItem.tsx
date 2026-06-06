import React from 'react'
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

function formatVerifiedAt(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks < 5) return `${diffWeeks}w ago`
  if (diffMonths < 12) {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  }
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
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
  const variant      = getVariantFromScore(accessibilityScore)
  const { icon: iconClass } = getColourClasses(variant)
  const statusVariant = toStatusVariant(variant)
  const a11yVariant   = toAccessibilityVariant(variant)

  const handler = onPress ?? onClick
  const Tag = handler ? 'button' : 'div'
  const interactiveProps = handler
    ? {
        type: 'button' as const,
        onClick: handler,
        'aria-label': `View details for ${name}`,
        className: [
          'flex flex-col gap-[24px] w-full text-left',
          'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      }
    : { className: `flex flex-col gap-[24px] w-full ${className}` }

  return (
    <Tag {...interactiveProps}>
      {/* Badge row + info row grouped with tight gap */}
      <div className="flex flex-col gap-[8px] w-full">

        {/* Badge row — full width */}
        <div className="flex items-center gap-[10px]">
          <AccessibilityBadge variant={a11yVariant} size="sm" icon={getCategoryIcon(category, 12)} />

          <StatusBadge
            variant={statusVariant}
            label={`${accessibilityScore}% Accessible`}
          />

          {isLiftDependent && (
            <div className="flex items-center gap-[8px] px-[8px] py-[4px] bg-warning-100 rounded-[24px]">
              <Zap size={16} strokeWidth={1.5} className="text-warning-500 shrink-0" />
              <span className="text-[14px] font-regular leading-[1.4] tracking-[0.12px] text-warning-500 whitespace-nowrap">
                Lift-dependent
              </span>
            </div>
          )}
        </div>

        {/* Info row */}
        <div className="flex items-end justify-between w-full">

          {/* Left: name + address */}
          <div className="flex flex-col gap-[4px] flex-1 min-w-0">
            <span className="text-heading-sm text-neutral-900 truncate">
              {name}
            </span>
            <span className="text-body-sm text-neutral-500 truncate">
              {address}
            </span>
          </div>

          {/* Right: distance + barrier count */}
          <div className="flex flex-col gap-[4px] items-end w-[56px] shrink-0">
            <span className="text-body-sb text-neutral-900 text-right whitespace-nowrap">
              {distance}
            </span>
            <span className="text-body-sm text-neutral-400 text-right whitespace-nowrap">
              {formatVerifiedAt(verifiedAt)}
            </span>
          </div>
        </div>{/* end info row */}
      </div>{/* end badge+info group */}

    </Tag>
  )
}
