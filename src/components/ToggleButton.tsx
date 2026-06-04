import React from 'react'

export interface ToggleButtonProps {
  value: 'yes' | 'no' | null
  onChange: (value: 'yes' | 'no') => void
  className?: string
}

const focusClasses = 'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none'

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-[8px] ${className}`}>
      {/* Yes button */}
      <button
        type="button"
        aria-pressed={value === 'yes'}
        onClick={() => onChange('yes')}
        className={[
          'px-[16px] py-[4px] rounded-[24px] text-body-md',
          'transition-colors duration-200',
          focusClasses,
          value === 'yes'
            ? 'bg-success-500 text-neutral-50'
            : 'bg-neutral-0 border border-neutral-300 text-neutral-500',
        ].join(' ')}
      >
        Yes
      </button>

      {/* No button */}
      <button
        type="button"
        aria-pressed={value === 'no'}
        onClick={() => onChange('no')}
        className={[
          'px-[16px] py-[4px] rounded-[24px] text-body-md',
          'transition-colors duration-200',
          focusClasses,
          value === 'no'
            ? 'bg-danger-500 text-neutral-50'
            : 'bg-neutral-0 border border-neutral-300 text-neutral-500',
        ].join(' ')}
      >
        No
      </button>
    </div>
  )
}
