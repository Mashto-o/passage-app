import React from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUpDown } from 'lucide-react'
import { TextInput } from './TextInput'

export interface RouteDestinationProps {
  from: string
  to: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onSwap?: () => void
  className?: string
}

export const RouteDestination: React.FC<RouteDestinationProps> = ({
  from,
  to,
  onFromChange,
  onToChange,
  onSwap,
  className = '',
}) => {
  const { t } = useTranslation()

  const handleSwap = () => {
    onFromChange(to)
    onToChange(from)
  }

  return (
    <div
      className={[
        'flex items-center gap-lg w-full',
        'bg-neutral-0 border border-neutral-200 rounded-xl p-md',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Inputs column */}
      <div className="flex flex-col gap-xs flex-1">
        <TextInput
          label={t('routeDestination.from')}
          placeholder={t('map.currentLocation')}
          value={from}
          onChange={onFromChange}
        />
        <TextInput
          label={t('routeDestination.to')}
          placeholder={t('routeDestination.destinationPlaceholder')}
          value={to}
          onChange={onToChange}
        />
      </div>

      {/* Swap button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onSwap ? onSwap() : handleSwap()
        }}
        aria-label={t('routeDestination.swapAria')}
        className={[
          'shrink-0 border border-neutral-200 rounded-full p-xs',
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
