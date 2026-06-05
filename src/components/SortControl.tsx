import React from 'react'
import { ChevronRight } from 'lucide-react'

export interface SortControlProps {
  value: string
  onPress: () => void
  className?: string
}

export const SortControl: React.FC<SortControlProps> = ({
  value,
  onPress,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onPress}
      className={[
        'flex items-center justify-between w-full',
        'transition-colors duration-200',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="text-body-md text-neutral-900">Sort by</span>

      <div className="flex items-center gap-[8px]">
        <span className="text-heading-sm text-neutral-900 text-right">{value}</span>
        <ChevronRight size={20} strokeWidth={1.5} className="text-neutral-900 shrink-0" />
      </div>
    </button>
  )
}
