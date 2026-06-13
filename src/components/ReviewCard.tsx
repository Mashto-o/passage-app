import React from 'react'
import { useTranslation } from 'react-i18next'
import { MapPinCheck } from 'lucide-react'

export interface ReviewCardProps {
  authorName: string
  avatarUrl?: string
  mobilityIcon: React.ReactNode
  timestamp: string
  reviewText: string
  isVerified?: boolean
  className?: string
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  authorName,
  avatarUrl,
  mobilityIcon,
  timestamp,
  reviewText,
  isVerified = false,
  className = '',
}) => {
  const { t } = useTranslation()

  return (
    <div
      role="article"
      aria-label={t('reviewCard.reviewBy', { author: authorName })}
      className={`flex flex-col gap-xs p-md bg-neutral-0 border border-neutral-200 rounded-xl ${className}`}
    >
      {/* Header row */}
      <div className="flex items-center gap-xs">
        {/* Avatar */}
        <div className="w-[36px] h-[36px] rounded-full shrink-0 overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={authorName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
              <span className="text-body-sm text-neutral-500">
                {authorName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <span className="text-heading-sm text-neutral-900">{authorName}</span>

        <span aria-hidden="true" className="flex items-center shrink-0 text-primary-500">
          {mobilityIcon}
        </span>

        {/* Right side: icon+timestamp when verified, plain timestamp when not */}
        {isVerified ? (
          <div className="ml-auto shrink-0 flex items-center gap-[4px] text-primary-500">
            <MapPinCheck size={14} aria-hidden="true" />
            <span className="text-body-sm">{timestamp}</span>
          </div>
        ) : (
          <span className="ml-auto shrink-0 text-body-sm text-neutral-700">{timestamp}</span>
        )}
      </div>

      {/* Review text */}
      <p className="text-body-md text-neutral-700">{reviewText}</p>
    </div>
  )
}
