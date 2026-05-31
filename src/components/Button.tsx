import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'destructive'
  label: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const base =
  'inline-flex items-center justify-center gap-xs h-2xl rounded-xxl px-md ' +
  'text-heading-sm font-semibold transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:     'bg-primary-500 text-neutral-0 active:bg-primary-600',
  secondary:   'bg-neutral-0 border border-primary-500 text-primary-500 active:bg-primary-100',
  ghost:       'bg-transparent border border-neutral-300 text-neutral-900 active:bg-neutral-100',
  link:        'bg-transparent text-primary-500 active:text-primary-600 active:underline',
  destructive: 'bg-danger-500 text-neutral-0 active:bg-danger-700',
}

const disabledClasses = 'bg-neutral-200 text-neutral-400 cursor-not-allowed pointer-events-none'

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  label,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  const classes = [
    base,
    disabled ? disabledClasses : variants[variant],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const iconEl = icon ? (
    <span aria-hidden="true" className="flex items-center">
      {icon}
    </span>
  ) : null

  return (
    <button
      {...rest}
      disabled={disabled}
      aria-label={label}
      aria-disabled={disabled}
      className={classes}
    >
      {icon && iconPosition === 'left' && iconEl}
      <span>{label}</span>
      {icon && iconPosition === 'right' && iconEl}
    </button>
  )
}
