import React, { useState } from 'react'
import { Search } from 'lucide-react'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
}) => {
  const [focused, setFocused] = useState(false)

  return (
    <div
      className={[
        'flex items-center gap-[10px] px-[16px] py-[12px] w-full',
        'bg-neutral-0 rounded-[24px] border',
        focused ? 'border-primary-500' : 'border-neutral-200',
        'transition-colors duration-200',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Search
        size={24}
        strokeWidth={1.5}
        className={[
          'shrink-0 transition-colors duration-200',
          focused ? 'text-primary-500' : 'text-neutral-400',
        ].join(' ')}
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 text-body-md text-neutral-900 placeholder:text-neutral-400 bg-transparent border-none outline-none"
      />
    </div>
  )
}
