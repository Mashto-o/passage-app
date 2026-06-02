import React from 'react'

export interface ChipProps {
  label: string
  variant?: 'primary' | 'secondary'
  icon?: React.ReactNode
  className?: string
}

const variantConfig = {
  primary:   { bg: 'bg-primary-100',  text: 'text-primary-500'  },
  secondary: { bg: 'bg-accent-100',   text: 'text-accent-500'   },
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'primary',
  icon,
  className = '',
}) => {
  const { bg, text } = variantConfig[variant]

  return (
    <div
      className={[
        'flex items-center gap-[8px] px-[8px] py-[4px] rounded-[24px]',
        bg,
        text,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && (
        <span className="shrink-0 w-[13px] h-[13px] flex items-center justify-center">
          {icon}
        </span>
      )}
      <span className="text-caption-sm tracking-[0.12px] whitespace-nowrap">
        {label}
      </span>
    </div>
  )
}
