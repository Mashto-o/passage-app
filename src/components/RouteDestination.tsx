import React from 'react'
import { ArrowUpDown } from 'lucide-react'
import { TextInput } from './TextInput'

export interface RouteDestinationProps {
  from: string
  to: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  className?: string
}

export const RouteDestination: React.FC<RouteDestinationProps> = ({
  from,
  to,
  onFromChange,
  onToChange,
  className = '',
}) => {
  const handleSwap = () => {
    onFromChange(to)
    onToChange(from)
  }

  return (
    <div
      className={[
        'flex items-center gap-[24px] w-full',
        'bg-neutral-0 border border-neutral-200 rounded-[24px] p-[16px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Inputs column */}
      <div className="flex flex-col gap-[8px] flex-1">
        <TextInput
          label="From"
          placeholder="Current location"
          value={from}
          onChange={onFromChange}
        />
        <TextInput
          label="To"
          placeholder="Destination"
          value={to}
          onChange={onToChange}
        />
      </div>

      {/* Swap button */}
      <button
        type="button"
        onClick={handleSwap}
        aria-label="Swap origin and destination"
        className={[
          'shrink-0 border border-neutral-200 rounded-[48px] p-[8px]',
          'text-neutral-700 hover:bg-neutral-100',
          'transition-colors duration-200',
          'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
        ].join(' ')}
      >
        <ArrowUpDown size={20} />
      </button>
    </div>
  )
}
