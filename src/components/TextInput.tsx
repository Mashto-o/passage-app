import React, { useState, useId } from 'react'

export interface TextInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  className = '',
}) => {
  const [focused, setFocused] = useState(false)
  const id = useId()

  return (
    <div className={`flex flex-col items-start gap-[4px] w-full ${className}`}>
      <label
        htmlFor={id}
        className="text-caption-sm tracking-[0.12px] text-neutral-700"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={[
          'w-full px-[12px] py-[8px] rounded-[24px] border bg-neutral-0',
          'text-body-sm text-neutral-900 placeholder:text-neutral-400',
          focused ? 'border-primary-500' : 'border-neutral-300',
          'transition-colors duration-200 focus-visible:outline-none',
        ].join(' ')}
      />
    </div>
  )
}
