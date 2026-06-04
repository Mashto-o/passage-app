import React from 'react'
import { Mic, Camera } from 'lucide-react'

export interface MediaInputButtonProps {
  variant: 'voice' | 'camera'
  onPress?: () => void
  className?: string
}

const config = {
  voice: {
    border: 'border-solid',
    Icon: Mic,
    label: 'Tap to speak',
  },
  camera: {
    border: 'border-dashed',
    Icon: Camera,
    label: 'Tap to add a photo',
  },
}

export const MediaInputButton: React.FC<MediaInputButtonProps> = ({
  variant,
  onPress,
  className = '',
}) => {
  const { border, Icon, label } = config[variant]

  return (
    <button
      type="button"
      onClick={onPress}
      className={[
        'flex flex-col items-center justify-center gap-[10px]',
        'w-full h-[81px] px-[32px]',
        'bg-neutral-0 border border-neutral-300 rounded-[24px]',
        border,
        'hover:bg-neutral-50',
        'transition-colors duration-200',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon size={24} strokeWidth={1.5} className="text-neutral-500" />
      <span className="text-caption-sm tracking-[0.12px] text-neutral-500">
        {label}
      </span>
    </button>
  )
}
