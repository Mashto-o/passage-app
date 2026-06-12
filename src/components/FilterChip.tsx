import React from 'react'

export interface FilterChipProps {
  label: string
  active?: boolean
  onClick?: () => void
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, active = false, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center px-md py-sm rounded-[24px] text-body-md whitespace-nowrap',
        'cursor-pointer transition-colors duration-200',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
        active
          ? 'bg-primary-500 text-neutral-0 border border-primary-500'
          : 'bg-neutral-0 border border-neutral-200 text-neutral-900',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
