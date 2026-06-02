import React, { useState } from 'react'

export interface CommentInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  className?: string
}

export const CommentInput: React.FC<CommentInputProps> = ({
  value,
  onChange,
  placeholder,
  maxLength = 280,
  className = '',
}) => {
  const [focused, setFocused] = useState(false)
  const isError = value.length > maxLength

  const borderColor = isError
    ? 'border-danger-500'
    : focused
    ? 'border-primary-500'
    : 'border-neutral-300'

  const counterColor = isError ? 'text-danger-500' : 'text-neutral-500'

  return (
    <div className={`flex flex-col items-start w-full ${className}`}>
      <div className="relative w-full">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={[
            'w-full h-[131px] px-[12px] py-[12px] pb-[28px]',
            'rounded-[24px] border bg-neutral-0 resize-none',
            'text-caption-sm tracking-[0.12px] text-neutral-900',
            'placeholder:text-neutral-500 placeholder:font-medium placeholder:text-[12px] placeholder:tracking-[0.12px]',
            'transition-colors duration-200 focus-visible:outline-none',
            borderColor,
          ].join(' ')}
        />
        <span
          className={[
            'absolute bottom-[12px] right-[12px] pointer-events-none',
            'text-caption-sm tracking-[0.12px]',
            counterColor,
          ].join(' ')}
        >
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  )
}
