import React from 'react'

export interface RadioButtonProps {
  selected: boolean
  className?: string
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  selected,
  className = '',
}) => {
  return (
    <div
      role="presentation"
      className={[
        'flex items-center justify-center shrink-0 size-[24px] rounded-full bg-transparent',
        selected
          ? 'shadow-[inset_0_0_0_6px_#361ecb]'  // primary/500
          : 'shadow-[inset_0_0_0_3px_#c8c8cf]',  // neutral-300
        'transition-shadow duration-200',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
