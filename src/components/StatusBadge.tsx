import React from 'react'

export interface StatusBadgeProps {
  label: string
  variant: 'positive' | 'warning' | 'negative'
  icon?: React.ReactNode
  className?: string
}

const variantConfig = {
  positive: { bg: 'bg-success-100', text: 'text-success-700' },
  warning:  { bg: 'bg-warning-100', text: 'text-warning-500' },
  negative: { bg: 'bg-danger-100',  text: 'text-danger-500'  },
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant,
  icon,
  className = '',
}) => {
  const { bg, text } = variantConfig[variant]

  return (
    <div
      className={[
        'flex items-center justify-center gap-[8px] px-[8px] py-[4px] rounded-[24px]',
        bg,
        text,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && (
        <span className="shrink-0 w-[16px] h-[16px] flex items-center justify-center">
          {icon}
        </span>
      )}
      <span className="text-caption-sm tracking-[0.12px] whitespace-nowrap">
        {label}
      </span>
    </div>
  )
}
