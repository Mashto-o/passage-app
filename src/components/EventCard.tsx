import React from 'react'
import { CircleUser } from 'lucide-react'
import { Chip } from './Chip'

export interface EventCardProps {
  title: string
  date: string
  organizer: string
  attendeeCount: number
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  organizer,
  attendeeCount,
}) => {
  return (
    <div className="bg-neutral-0 border border-neutral-200 rounded-[24px] p-md flex flex-col gap-xs w-full">

      {/* Title + date chip */}
      <div className="flex items-start justify-between gap-sm w-full">
        <span className="text-heading-sm text-neutral-900">{title}</span>
        <Chip variant="active" label={date} className="shrink-0" />
      </div>

      {/* Organizer + attendees */}
      <div className="flex items-center justify-between">
        <span className="text-body-sm text-neutral-700 truncate">{organizer}</span>
        <div className="flex items-center gap-[4px] shrink-0">
          <CircleUser size={16} strokeWidth={1.5} className="text-neutral-500" aria-hidden />
          <span className="text-body-sm text-neutral-700 whitespace-nowrap">{attendeeCount} going</span>
        </div>
      </div>

    </div>
  )
}
