import React from 'react'

export interface PhotoCardProps {
  src: string
  alt: string
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  src,
  alt,
  label,
  selected = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={[
        'flex flex-col items-start gap-[12px]',
        'transition-colors duration-200',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Photo area */}
      <div
        className={[
          'relative w-[165px] h-[200px] rounded-[24px] border overflow-hidden',
          selected ? 'border-primary-500' : 'border-neutral-200',
        ].join(' ')}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-[24px]"
        />
        {selected && (
          <div
            aria-hidden
            className="absolute inset-0 rounded-[24px] bg-primary-500/20"
          />
        )}
      </div>

      {/* Label */}
      <span
        className={[
          'w-[165px] text-left',
          selected ? 'text-body-sb text-primary-500' : 'text-body-sm text-neutral-900',
        ].join(' ')}
      >
        {label}
      </span>
    </button>
  )
}
