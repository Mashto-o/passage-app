import React from 'react'
import { Compass, Map, User, type LucideIcon } from 'lucide-react'

type Tab = 'discover' | 'map' | 'profile'

export interface NavBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  className?: string
}

const tabs: { id: Tab; label: string; Icon: LucideIcon }[] = [
  { id: 'discover', label: 'Discover', Icon: Compass },
  { id: 'map',      label: 'Map',      Icon: Map     },
  { id: 'profile',  label: 'Profile',  Icon: User    },
]

export const NavBar: React.FC<NavBarProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <div
      className={[
        'flex items-center justify-between w-full',
        'bg-neutral-0 border border-neutral-200 rounded-[48px] py-[20px] px-[32px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {tabs.map(({ id, label, Icon }) => {
        const active = activeTab === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            aria-pressed={active}
            className={[
              'flex flex-col items-center gap-[4px] w-[45px]',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            ].join(' ')}
          >
            <Icon
              size={24}
              strokeWidth={1.5}
              className={active ? 'text-primary-500' : 'text-neutral-500'}
            />
            {active ? (
              <div className="bg-primary-100 px-[4px] rounded-[8px]">
                <span className="text-caption-sm tracking-[0.12px] text-primary-500">
                  {label}
                </span>
              </div>
            ) : (
              <span className="text-caption-sm tracking-[0.12px] text-neutral-500">
                {label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
