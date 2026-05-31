import React from 'react'

export interface ReviewCardProps {
  authorName: string
  avatarUrl?: string
  mobilityIcon: React.ReactNode
  timestamp: string
  reviewText: string
  className?: string
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  authorName,
  avatarUrl,
  mobilityIcon,
  timestamp,
  reviewText,
  className = '',
}) => {
  return (
    <div
      role="article"
      aria-label={`Review by ${authorName}`}
      className={`flex gap-md p-md bg-neutral-0 border border-neutral-200 rounded-xl ${className}`}
    >
      {/* Avatar */}
      <div className="w-[56px] h-[56px] rounded-full shrink-0 overflow-hidden">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={authorName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
            <span className="text-heading-sm text-neutral-500">
              {authorName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-xs flex-1 min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between gap-xs">
          <div className="flex items-center gap-2xs">
            <span className="text-heading-sm text-neutral-900">{authorName}</span>
            <span aria-hidden="true" className="flex items-center shrink-0 text-primary-500">
              {mobilityIcon}
            </span>
          </div>
          <span className="text-body-sm text-neutral-700 shrink-0">{timestamp}</span>
        </div>

        {/* Review text */}
        <p className="text-body-md text-neutral-700">{reviewText}</p>

      </div>
    </div>
  )
}
