import React from 'react'

export interface ChipProps {
  label: string
  variant?: 'primary' | 'secondary' | 'neutral'
  size?: 'sm' | 'md'
  icon?: React.ReactNode
  className?: string
}

const variantConfig = {
  primary:   { container: 'bg-primary-100 text-primary-500',                          },
  secondary: { container: 'bg-accent-100 text-accent-500',                            },
  neutral:   { container: 'bg-neutral-0 border border-neutral-200 text-neutral-700',  },
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'primary',
  size = 'sm',
  icon,
  className = '',
}) => {
  const { container } = variantConfig[variant]

  return (
    <div
      className={[
        'flex items-center gap-[8px] px-[8px] py-[4px] rounded-[24px]',
        container,
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
    </div>
  )
}
