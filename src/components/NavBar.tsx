import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Compass, Map, User, Plus, type LucideIcon } from 'lucide-react'

type Tab = 'discover' | 'map' | 'profile'

export interface NavBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  reviewActive?: boolean
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
  reviewActive = false,
  className = '',
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const tabs = TAB_DEFS.map(def => ({ ...def, label: t(`navBar.${def.id}`) }))

  return (
    <div
      className={[
        'grid gap-2xs w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ gridTemplateColumns: '1fr auto' }}
    >
      {/* Main tab pill */}
      <div className="flex items-center justify-between bg-neutral-0 border border-neutral-200 rounded-full py-[20px] px-md">
        {tabs.map(({ id, label, Icon }) => {
          const active = !reviewActive && activeTab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              aria-pressed={active}
              aria-label={label}
              className={[
                'flex flex-1 flex-col items-center gap-2xs min-w-0',
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

      {/* Review circular button
          Outer div: self-stretch gives it a concrete computed height = pill height.
          Inner button: h-full resolves against that concrete height; aspect-square makes width = height. */}
      <div className="self-stretch aspect-square shrink-0">
        <button
          type="button"
          onClick={() => navigate('/map', { state: { reviewMode: true } })}
          aria-label={t('navBar.review')}
          className={[
            'flex flex-col items-center justify-center gap-2xs',
            'bg-neutral-0 border border-neutral-200 rounded-full',
            'h-full w-full',
            'transition-colors duration-200',
            'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
          ].join(' ')}
        >
          <Plus size={24} strokeWidth={1.5} className={reviewActive ? 'text-primary-500' : 'text-neutral-500'} aria-hidden />
          {reviewActive ? (
            <div className="bg-primary-100 px-2xs rounded-xs">
              <span className="text-caption-sm tracking-[0.12px] text-primary-500">
                {t('navBar.review')}
              </span>
            </div>
          ) : (
            <span className="text-caption-sm tracking-[0.12px] text-neutral-500">
              {t('navBar.review')}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
