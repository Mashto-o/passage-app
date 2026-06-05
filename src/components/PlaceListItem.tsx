import React from 'react'
import { TrafficCone } from 'lucide-react'
import { AccessibilityBadge } from './AccessibilityBadge'
import { StatusBadge } from './StatusBadge'
import { getCategoryIcon } from '../utils/categoryIcon'


export interface PlaceListItemProps {
  name: string
  address: string
  distance: string
  barrierCount: number
  accessibilityScore: number
  category: string
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
  barrierCount,
  accessibilityScore,
  category,
  onClick,
  className = '',
}) => {
  const variant      = getVariantFromScore(accessibilityScore)
  const { icon: iconClass } = getColourClasses(variant)
  const statusVariant = toStatusVariant(variant)
  const a11yVariant   = toAccessibilityVariant(variant)

  const Tag = onClick ? 'button' : 'div'
  const interactiveProps = onClick
    ? {
        type: 'button' as const,
        onClick,
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
        <div className="flex items-center gap-[10px] overflow-hidden flex-nowrap w-full">
          <AccessibilityBadge variant={a11yVariant} size="sm" icon={getCategoryIcon(category, 12)} />

          <StatusBadge
            variant={statusVariant}
            label={`${accessibilityScore}% Accessible`}
          />

          <StatusBadge
            variant={statusVariant}
            label={`${barrierCount} barriers`}
            icon={<TrafficCone size={16} className={iconClass} />}
          />
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
            <span className="text-body-sm text-neutral-500 text-right whitespace-nowrap">
              {barrierCount} barriers
            </span>
          </div>
        </div>{/* end info row */}
      </div>{/* end badge+info group */}

    </Tag>
  )
}
