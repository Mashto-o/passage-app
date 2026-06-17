import React from 'react'
import { ArrowUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StatusBadge } from './StatusBadge'
import WheelchairManual from '../assets/illustrations/wheelchair-manual.svg?react'

export interface UpdateCardProps {
  imageSrc?: string
  placeName: string
  address: string
  description: string
  verifiedCount: number
  timeAgo: string
  avatar1Src?: string
  avatar2Src?: string
}

export const UpdateCard: React.FC<UpdateCardProps> = ({
  imageSrc,
  placeName,
  address,
  description,
  verifiedCount,
  timeAgo,
  avatar1Src,
  avatar2Src,
}) => {
  const { t } = useTranslation()

  return (
    <div className="w-[290px] shrink-0 bg-neutral-0 border border-neutral-200 rounded-[24px] p-md flex flex-col gap-md">

      {/* Image */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={placeName}
          className="h-[120px] w-full rounded-[24px] object-cover"
        />
      ) : (
        <div className="h-[120px] w-full rounded-[24px] bg-neutral-200" />
      )}

      {/* Status + time */}
      <div className="flex items-center justify-between gap-xs">
        <StatusBadge
          variant="positive"
          label={t('updateCard.nowAccessible')}
          icon={<ArrowUp size={12} strokeWidth={2} />}
        />
        <span className="text-body-sm text-neutral-700 whitespace-nowrap">{timeAgo}</span>
      </div>

      {/* Place name + address */}
      <div className="flex flex-col gap-[2px]">
        <span className="text-heading-sm text-neutral-900">{placeName}</span>
        <span className="text-body-sm text-neutral-700">{address}</span>
      </div>

      {/* Description */}
      <p className="text-body-md text-neutral-900">{description}</p>

      {/* Footer: avatar stack + verified by */}
      <div className="flex items-center gap-xs">
        {/* Two overlapping avatar circles */}
        <div className="flex items-center">
          {avatar1Src
            ? <img src={avatar1Src} className="size-[24px] rounded-full object-cover border-2 border-neutral-0 z-10 relative" />
            : <div className="size-[24px] rounded-full bg-neutral-200 border-2 border-neutral-0 z-10 relative" />
          }
          {avatar2Src
            ? <img src={avatar2Src} className="size-[24px] rounded-full object-cover border-2 border-neutral-0 -ml-[8px]" />
            : <div className="size-[24px] rounded-full bg-neutral-200 border-2 border-neutral-0 -ml-[8px]" />
          }
        </div>
        <WheelchairManual
          width={16}
          height={16}
          aria-hidden
          className="text-primary-500 shrink-0"
        />
        <span className="text-body-sm text-neutral-700">
          {t('updateCard.verifiedBy', { count: verifiedCount })}
        </span>
      </div>

    </div>
  )
}
