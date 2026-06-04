import React from 'react'
import { Check, X, AlertTriangle, HelpCircle } from 'lucide-react'

export interface AccessibilityBadgeProps {
  variant: 'accessible' | 'inaccessible' | 'partial' | 'partiallyAccessible' | 'unknown'
  size?: 'md' | 'sm'
  icon?: React.ReactNode
  pulse?: boolean
  className?: string
}

type CanonicalVariant = 'accessible' | 'inaccessible' | 'partial' | 'unknown'

type VariantConfig = {
  outerBg:   string
  innerBg:   string
  ariaLabel: string
  iconClass?: string
  Icon: React.ComponentType<{ size: number; className?: string; 'aria-hidden'?: boolean }>
}

const variantConfig: Record<CanonicalVariant, VariantConfig> = {
  accessible: {
    outerBg:   'bg-[rgba(31,168,91,0.2)]',
    innerBg:   'bg-success-500',
    ariaLabel: 'Accessible',
    Icon:      Check,
  },
  inaccessible: {
    outerBg:   'bg-[rgba(217,56,56,0.2)]',
    innerBg:   'bg-danger-500',
    ariaLabel: 'Not accessible',
    Icon:      X,
  },
  partial: {
    outerBg:   'bg-[rgba(240,160,48,0.2)]',
    innerBg:   'bg-warning-500',
    ariaLabel: 'Partially accessible',
    Icon:      AlertTriangle,
    iconClass: '-translate-y-[1px]',
  },
  unknown: {
    outerBg:   'bg-[rgba(154,154,163,0.2)]',
    innerBg:   'bg-neutral-400',
    ariaLabel: 'Accessibility unknown',
    Icon:      HelpCircle,
  },
}

const sizeConfig = {
  md: { outerSize: 'w-[36px] h-[36px]', innerSize: 'w-[28px] h-[28px]', iconSize: 16 },
  sm: { outerSize: 'w-[28px] h-[28px]', innerSize: 'w-[22px] h-[22px]', iconSize: 12 },
}

export const AccessibilityBadge: React.FC<AccessibilityBadgeProps> = ({
  variant,
  size = 'md',
  icon,
  className = '',
}) => {
  const canonical: CanonicalVariant = variant === 'partiallyAccessible' ? 'partial' : variant
  const { outerBg, innerBg, ariaLabel, Icon, iconClass } = variantConfig[canonical]
  const { outerSize, innerSize, iconSize } = sizeConfig[size]

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`flex items-center justify-center shrink-0 overflow-hidden rounded-full ${outerSize} ${outerBg}${className ? ` ${className}` : ''}`}
    >
      <div className={`flex items-center justify-center shrink-0 rounded-full ${innerSize} ${innerBg}`}>
        {icon ?? (
          <Icon
            size={iconSize}
            aria-hidden={true}
            className={`text-neutral-0${iconClass ? ` ${iconClass}` : ''}`}
          />
        )}
      </div>
    </div>
  )
}
