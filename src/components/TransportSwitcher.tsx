import React from 'react'
import { TrainFront, Car, Accessibility, type LucideIcon } from 'lucide-react'

export type TransportMode = 'transit' | 'car' | 'walking'

export interface TransportSwitcherProps {
  value: TransportMode
  onChange: (mode: TransportMode) => void
  className?: string
}

const modeLabels: Record<TransportMode, string> = {
  transit: 'Public transport',
  car:     'Car',
  walking: 'Walking',
}

const tabs: { id: TransportMode; Icon: LucideIcon }[] = [
  { id: 'transit', Icon: TrainFront    },
  { id: 'car',     Icon: Car           },
  { id: 'walking', Icon: Accessibility },
]

export const TransportSwitcher: React.FC<TransportSwitcherProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-start gap-[12px] w-full ${className}`}>
      <span className="text-display-md text-neutral-900">
        {modeLabels[value]}
      </span>
      <div className="flex items-center w-full bg-neutral-100 rounded-[24px] p-[4px]">
      {tabs.map(({ id, Icon }) => {
        const active = value === id
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            aria-label={modeLabels[id]}
            onClick={() => onChange(id)}
            className={[
              'flex-1 flex items-center justify-center py-[8px] rounded-[24px]',
              active ? 'bg-primary-500' : 'bg-transparent',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            ].join(' ')}
          >
            <Icon
              size={24}
              strokeWidth={1.5}
              className={active ? 'text-neutral-0' : 'text-neutral-500'}
            />
          </button>
        )
      })}
      </div>
    </div>
  )
}
