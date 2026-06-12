import React from 'react'

export interface ToggleProps {
  value: boolean
  onChange: (value: boolean) => void
  label?: string
  className?: string
}

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onChange,
  label,
  className = '',
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className={[
        'flex items-center w-[48px] h-[32px] rounded-[24px] p-[4px] shrink-0',
        value ? 'bg-primary-500' : 'bg-neutral-300',
        'transition-colors duration-200',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'size-[24px] rounded-full bg-neutral-0',
          'transition-transform duration-200',
          value ? 'translate-x-[16px]' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}
