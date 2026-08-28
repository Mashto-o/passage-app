import React from 'react'
import { useTranslation } from 'react-i18next'
import { Check, X, AlertTriangle, HelpCircle, type LucideProps } from 'lucide-react'

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
  iconClass?: string
  Icon: React.ComponentType<LucideProps>
}

const variantConfig: Record<CanonicalVariant, VariantConfig> = {
  accessible: {
    outerBg: 'bg-[rgba(31,168,91,0.2)]',
    innerBg: 'bg-success-500',
    Icon:    Check,
  },
  inaccessible: {
    outerBg: 'bg-[rgba(217,56,56,0.2)]',
    innerBg: 'bg-danger-500',
    Icon:    X,
  },
  partial: {
    outerBg:   'bg-[rgba(240,160,48,0.2)]',
    innerBg:   'bg-warning-500',
    Icon:      AlertTriangle,
    iconClass: '-translate-y-[1px]',
  },
  unknown: {
    outerBg: 'bg-[rgba(154,154,163,0.2)]',
    innerBg: 'bg-neutral-400',
    Icon:    HelpCircle,
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
  const { t } = useTranslation()

  const canonical: CanonicalVariant = variant === 'partiallyAccessible' ? 'partial' : variant
  const { outerBg, innerBg, Icon, iconClass } = variantConfig[canonical]
  const { outerSize, innerSize, iconSize } = sizeConfig[size]

  const ariaLabelMap: Record<CanonicalVariant, string> = {
    accessible:   t('accessibility.accessible'),
    inaccessible: t('accessibility.inaccessible'),
    partial:      t('accessibility.partial'),
    unknown:      t('accessibility.unknown'),
  }

  return (
    <div
      role="img"
      aria-label={ariaLabelMap[canonical]}
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
