import React from 'react'
import { StatusBadge } from './StatusBadge'
import type { MobilityAid } from '../context/OnboardingContext'

import WheelchairManual   from '../assets/illustrations/wheelchair-manual.svg?react'
import WheelchairElectric from '../assets/illustrations/wheelchair-electric.svg?react'
import Cane               from '../assets/illustrations/cane.svg?react'
import Prosthesis         from '../assets/illustrations/prosthesis.svg?react'
import Stroller           from '../assets/illustrations/stroller.svg?react'
import NoWheelchair       from '../assets/illustrations/no-wheelchair.svg?react'

const MOBILITY_ICONS: Record<MobilityAid, React.ReactElement> = {
  'wheelchair-manual':   <WheelchairManual   width={22} height={22} aria-hidden className="text-primary-500" />,
  'wheelchair-electric': <WheelchairElectric width={22} height={22} aria-hidden className="text-primary-500" />,
  'cane':                <Cane               width={22} height={22} aria-hidden className="text-primary-500" />,
  'prosthesis':          <Prosthesis         width={22} height={22} aria-hidden className="text-primary-500" />,
  'stroller':            <Stroller           width={22} height={22} aria-hidden className="text-primary-500" />,
  'no-aid':              <NoWheelchair       width={22} height={22} aria-hidden className="text-primary-500" />,
}

export interface FriendActivityCardProps {
  friendName: string
  mobilityAid: MobilityAid
  timeAgo: string
  placeName: string
  address: string
  accessibilityLabel: string
  reviewText: string
}

export const FriendActivityCard: React.FC<FriendActivityCardProps> = ({
  friendName,
  mobilityAid,
  timeAgo,
  placeName,
  address,
  accessibilityLabel,
  reviewText,
}) => {
  const mobilityIcon = MOBILITY_ICONS[mobilityAid] ?? (
    <WheelchairManual width={22} height={22} aria-hidden className="text-primary-500" />
  )

  return (
    <div className="bg-neutral-0 border border-neutral-200 rounded-[24px] p-md flex flex-col gap-md w-full">

      {/* Friend row */}
      <div className="flex items-center gap-xs w-full">
        {/* Avatar placeholder */}
        <div className="size-[36px] rounded-full bg-neutral-200 shrink-0" />
        <span className="text-heading-sm text-neutral-900 whitespace-nowrap">{friendName}</span>
        <span className="shrink-0">{mobilityIcon}</span>
        <span className="text-body-sm text-neutral-700 whitespace-nowrap ml-auto">{timeAgo}</span>
      </div>

      {/* Place row */}
      <div className="flex items-start justify-between gap-sm w-full">
        <div className="flex flex-col gap-[2px] min-w-0">
          <span className="text-heading-sm text-neutral-900 truncate">{placeName}</span>
          <span className="text-body-sm text-neutral-700 truncate">{address}</span>
        </div>
        <StatusBadge variant="positive" label={accessibilityLabel} className="shrink-0" />
      </div>

      {/* Review text */}
      <p className="text-body-md text-neutral-700">{reviewText}</p>

    </div>
  )
}
