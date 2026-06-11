import React from 'react'
import { ChevronLeft } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'destructive' | 'back' | 'success'
  label?: string
  children?: React.ReactNode
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const base =
  'inline-flex items-center justify-center gap-xs h-2xl rounded-xxl px-md ' +
  'text-heading-sm transition-colors duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'

const variants: Record<Exclude<NonNullable<ButtonProps['variant']>, 'back'>, string> = {
  primary:     'bg-primary-500 text-neutral-0 active:bg-primary-600',
  secondary:   'bg-neutral-0 border border-primary-500 text-primary-500 active:bg-primary-100',
  ghost:       'bg-transparent border border-neutral-300 text-neutral-900 active:bg-neutral-100',
  link:        'bg-transparent text-primary-500 active:text-primary-600 active:underline',
  destructive: 'bg-danger-500 text-neutral-0 active:bg-danger-700',
  success:     'bg-success-500 text-neutral-0 active:bg-success-600',
}

const disabledClasses = 'bg-neutral-200 text-neutral-400 cursor-not-allowed pointer-events-none'

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  label,
  children,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  // ── Back variant ────────────────────────────────────────────────────
  if (variant === 'back') {
    return (
      <button
        {...rest}
        type="button"
        disabled={disabled}
        className={[
          'inline-flex items-center gap-[10px]',
          'h-[48px] py-[13px]',
          'text-primary-500 font-semibold text-[16px] leading-[1.4]',
          'bg-transparent transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          className,
        ].filter(Boolean).join(' ')}
      >
        <ChevronLeft size={24} strokeWidth={1.5} aria-hidden className="text-primary-500" />
        <span>{children ?? label}</span>
      </button>
    )
  }

  // ── All other variants ───────────────────────────────────────────────
  const classes = [
    base,
    disabled ? disabledClasses : variants[variant as Exclude<NonNullable<ButtonProps['variant']>, 'back'>],
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
