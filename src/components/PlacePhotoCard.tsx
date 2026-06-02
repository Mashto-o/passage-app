import React from 'react'
import { ImageIcon } from 'lucide-react'

export interface PlacePhotoCardProps {
  src?: string
  alt?: string
  location: string
  updatedAt: string
  className?: string
}

export const PlacePhotoCard: React.FC<PlacePhotoCardProps> = ({
  src,
  alt,
  location,
  updatedAt,
  className = '',
}) => {
  return (
    <div className={`w-[165px] flex flex-col items-start gap-[12px] ${className}`}>

      {/* Photo area */}
      <div className="relative w-full h-[165px] rounded-[24px] border border-neutral-200 overflow-hidden">
        {src ? (
          <img src={src} alt={alt} className="size-full object-cover rounded-[24px]" />
        ) : (
          <div className="size-full bg-neutral-100 flex items-center justify-center">
            <ImageIcon size={32} className="text-neutral-400" aria-hidden />
          </div>
        )}

        {/* Location chip */}
        <div className="absolute top-[4px] left-1/2 -translate-x-1/2 bg-primary-100 px-[8px] py-[4px] rounded-[24px]">
          <span className="text-caption-sm text-primary-500 tracking-[0.12px] whitespace-nowrap">
            {location}
          </span>
        </div>
      </div>

      {/* Text area */}
      <div className="flex flex-col items-start w-full">
        <span className="text-body-sb text-neutral-900">Last updated:</span>
        <span className="text-body-sm text-neutral-700 w-[165px]">{updatedAt}</span>
      </div>

    </div>
  )
}
