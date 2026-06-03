import React from 'react'
import { TrafficCone } from 'lucide-react'
import { AccessibilityBadge } from './AccessibilityBadge'
import { StatusBadge } from './StatusBadge'
import { Divider } from './Divider'

export interface PlaceListItemProps {
  name: string
  address: string
  distance: string
  barrierCount: number
  accessibilityScore: string
  onClick?: () => void
  className?: string
}

function barrierVariant(count: number): 'positive' | 'warning' | 'negative' {
  if (count === 0) return 'positive'
  if (count <= 3)  return 'warning'
  return 'negative'
}

function accessibilityBadgeVariant(count: number): 'accessible' | 'partial' | 'inaccessible' {
  if (count === 0) return 'accessible'
  if (count <= 4)  return 'partial'
  return 'inaccessible'
}

function scoreStatusVariant(score: string): 'positive' | 'warning' | 'negative' {
  const pct = parseInt(score, 10)
  if (pct >= 80) return 'positive'
  if (pct >= 40) return 'warning'
  return 'negative'
}

export const PlaceListItem: React.FC<PlaceListItemProps> = ({
  name,
  address,
  distance,
  barrierCount,
  accessibilityScore,
  onClick,
  className = '',
}) => {
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
      <div className="flex flex-col gap-[4px] w-full">

        {/* Badge row — full width */}
        <div className="flex items-center gap-[10px] overflow-hidden flex-nowrap w-full">
          <AccessibilityBadge variant={accessibilityBadgeVariant(barrierCount)} size="sm" />

          <StatusBadge variant={scoreStatusVariant(accessibilityScore)} label={accessibilityScore} />

          <StatusBadge
            variant={barrierVariant(barrierCount)}
            label={`${barrierCount} barriers`}
            icon={<TrafficCone size={16} />}
          />
        </div>

        {/* Info row */}
        <div className="flex items-end justify-between w-full">

        {/* Left: name + address */}
        <div className="flex flex-col gap-[4px] flex-1 min-w-0">
          <span className="text-heading-sm text-neutral-900 truncate">
            {name}
          </span>
          <span className="text-caption-sm tracking-[0.12px] text-neutral-500 truncate">
            {address}
          </span>
        </div>

        {/* Right: distance + barrier count */}
        <div className="flex flex-col gap-[4px] items-end w-[56px] shrink-0">
          <span className="text-body-sb text-neutral-900 text-right whitespace-nowrap">
            {distance}
          </span>
          <span className="text-caption-sm tracking-[0.12px] text-neutral-500 text-right whitespace-nowrap">
            {barrierCount} barriers
          </span>
        </div>
        </div>{/* end info row */}
      </div>{/* end badge+info group */}

      <Divider />
    </Tag>
  )
}
