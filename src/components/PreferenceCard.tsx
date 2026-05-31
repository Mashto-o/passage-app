import React from 'react'

export interface PreferenceCardProps {
  label: string
  icon: React.ReactNode
  selected?: boolean
  onClick?: () => void
  className?: string
}

export const PreferenceCard: React.FC<PreferenceCardProps> = ({
  label,
  icon,
  selected = false,
  onClick,
  className = '',
}) => {
  const containerClasses = [
    'w-[112px] min-w-[112px] max-w-[112px] overflow-hidden',
    'p-sm rounded-xl',
    'flex flex-col items-center justify-start gap-sm',
    'border transition-colors duration-200 ease-in-out',
    'active:scale-[0.97]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    selected ? 'bg-primary-500 border-transparent' : 'bg-neutral-0 border-neutral-200',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const iconClasses  = selected ? 'text-neutral-0' : 'text-neutral-700'
  const labelClasses = selected ? 'text-neutral-0' : 'text-neutral-900'

  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      className={containerClasses}
    >
      <span aria-hidden="true" className={`flex items-center justify-center shrink-0 ${iconClasses}`}>
        {icon}
      </span>
      <span className={`text-heading-xsm text-center leading-tight w-full [overflow-wrap:break-word] ${labelClasses}`}>
        {label}
      </span>
    </button>
  )
}
