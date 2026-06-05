import React from 'react'

export interface ChipProps {
  label: string
  variant?: 'primary' | 'secondary' | 'neutral' | 'active'
  size?: 'sm' | 'md'
  icon?: React.ReactNode
  className?: string
  onClick?: () => void
}

const variantConfig = {
  primary:   { container: 'bg-primary-100 text-primary-500',                                       },
  active:    { container: 'bg-primary-500 text-neutral-0 border border-primary-500',               },
  secondary: { container: 'bg-accent-100 text-accent-500',                                         },
  neutral:   { container: 'bg-neutral-0 border border-neutral-200 text-neutral-700',               },
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'primary',
  size = 'sm',
  icon,
  className = '',
  onClick,
}) => {
  const { container } = variantConfig[variant]
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={[
        'flex items-center gap-[8px] px-[8px] py-[4px] rounded-[24px]',
        container,
        onClick ? 'cursor-pointer transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && (
        <span className="shrink-0 w-[14px] h-[14px] flex items-center justify-center">
          {icon}
        </span>
      )}
      <span className={[
        size === 'md' ? 'text-body-sm' : 'text-caption-sm tracking-[0.12px]',
        'whitespace-nowrap',
      ].join(' ')}>
        {label}
      </span>
    </Tag>
  )
}
