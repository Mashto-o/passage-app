import React from 'react'
import { useTranslation } from 'react-i18next'
import { Compass, Map, User, type LucideIcon } from 'lucide-react'

type Tab = 'discover' | 'map' | 'profile'

export interface NavBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  className?: string
}

const TAB_DEFS: { id: Tab; Icon: LucideIcon }[] = [
  { id: 'discover', Icon: Compass },
  { id: 'map',      Icon: Map     },
  { id: 'profile',  Icon: User    },
]

export const NavBar: React.FC<NavBarProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {
  const { t } = useTranslation()

  const tabs = TAB_DEFS.map(def => ({ ...def, label: t(`navBar.${def.id}`) }))

  return (
    <div
      className={[
        'flex items-center justify-between w-full',
        'bg-neutral-0 border border-neutral-200 rounded-full py-[20px] px-xl',
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
            aria-label={label}
            className={[
              'flex flex-1 flex-col items-center gap-2xs',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            ].join(' ')}
          >
            <Icon
              size={24}
              strokeWidth={1.5}
              className={active ? 'text-primary-500' : 'text-neutral-500'}
              aria-hidden
            />
            {active ? (
              <div className="bg-primary-100 px-2xs rounded-xs">
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
