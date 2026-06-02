import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface DropdownProps {
  label: string
  items: string[]
  icon?: React.ReactNode
  bgColor?: string
  textColor?: string
  defaultOpen?: boolean
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  items,
  icon,
  bgColor = 'bg-primary-100',
  textColor = 'text-primary-700',
  defaultOpen = false,
  className = '',
}) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {/* Trigger pill */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={[
          'flex items-center justify-center gap-[8px] px-[8px] py-[4px] ml-auto',
          open ? 'rounded-t-[16px]' : 'rounded-[16px]',
          bgColor,
          textColor,
          'transition-[border-radius] duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        ].join(' ')}
      >
        {icon && (
          <span className="shrink-0 w-[16px] h-[16px] flex items-center justify-center">
            {icon}
          </span>
        )}
        <span className="text-body-sm whitespace-nowrap">{label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Option list */}
      {open && (
        <div
          className={[
            'w-full flex flex-col gap-[12px] p-[12px]',
            'rounded-bl-[16px] rounded-br-[16px] rounded-tl-[16px]',
            bgColor,
          ].join(' ')}
        >
          {items.map((item, i) => (
            <span key={i} className={`text-body-sm ${textColor}`}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
