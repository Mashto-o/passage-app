import React from 'react'
import { ImageIcon, MapPinCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface PlacePhotoCardProps {
  src?: string
  alt?: string
  updatedAt: string
  isVerified?: boolean
  className?: string
}

export const PlacePhotoCard: React.FC<PlacePhotoCardProps> = ({
  src,
  alt,
  updatedAt,
  isVerified = false,
  className = '',
}) => {
  const { t } = useTranslation()

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

        {/* Date pill — top-left, always shown. Icon+date when verified, date-only when not */}
        <div className="absolute top-[8px] left-1/2 -translate-x-1/2 flex items-center gap-[4px] bg-primary-100 px-[8px] py-[4px] rounded-[24px]">
          {isVerified && (
            <MapPinCheck size={14} aria-hidden="true" className="text-primary-500 shrink-0" />
          )}
          <span className="text-caption-sm tracking-[0.12px] text-primary-500 whitespace-nowrap">
            {updatedAt}
          </span>
        </div>
      </div>

      {/* Caption — single descriptive line */}
      <span className="text-body-sm text-neutral-700">
        {isVerified ? t('common.madeOnLocation') : t('common.uploadedFromGallery')}
      </span>

    </div>
  )
}
