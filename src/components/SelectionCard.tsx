import React from 'react'

export interface SelectionCardProps {
  label: string
  subtitle: string
  icon: React.ReactNode
  selected?: boolean
  onClick?: () => void
  className?: string
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  label,
  subtitle,
  icon,
  selected = false,
  onClick,
  className = '',
}) => {
  const containerClasses = [
    'w-full h-full min-h-[88px] p-md rounded-xl',
    'flex items-center gap-md text-left',
    'border transition-all duration-200 ease-in-out',
    'active:scale-[0.98]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    selected ? 'bg-primary-100 border-primary-500' : 'bg-neutral-0 border-neutral-200',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const badgeClasses = [
    'rounded-full p-md flex items-center justify-center shrink-0',
    selected ? 'bg-primary-500 text-neutral-0' : 'bg-primary-100 text-primary-500',
  ].join(' ')

  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      className={containerClasses}
    >
      <div aria-hidden="true" className={badgeClasses}>
        {icon}
      </div>
      <div className="flex flex-col gap-2xs">
        <span className="text-heading-sm text-neutral-900">{label}</span>
        <span className="text-body-sm text-neutral-700">{subtitle}</span>
      </div>
    </button>
  )
}
