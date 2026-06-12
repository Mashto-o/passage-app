import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FilterChip, NavBar, UpdateCard, FriendActivityCard, EventCard } from '../components'
import type { MobilityAid } from '../context/OnboardingContext'

// ── Filter type ────────────────────────────────────────────────────

type DiscoverTab = 'all' | 'updates' | 'friends' | 'events'

// ── Mock data ──────────────────────────────────────────────────────

const UPDATES = [
  {
    id: '1',
    placeName: 'Silpo Khreschyatyk',
    address: 'vul. Khreschyatyk 44',
    description: 'New accessible entrance with automated sliding doors and a dedicated ramp — now fully wheelchair-friendly.',
    verifiedCount: 12,
    timeAgo: '2h ago',
  },
  {
    id: '2',
    placeName: 'Kyiv City Museum',
    address: 'vul. Khreschyatyk 15',
    description: 'The elevator is fully repaired and back in service after a 3-month closure.',
    verifiedCount: 8,
    timeAgo: '5h ago',
  },
]

const FRIEND_ACTIVITY: {
  id: string
  friendName: string
  mobilityAid: MobilityAid
  timeAgo: string
  placeName: string
  address: string
  accessibilityLabel: string
  reviewText: string
}[] = [
  {
    id: '1',
    friendName: 'Olena K.',
    mobilityAid: 'wheelchair-manual',
    timeAgo: '1h ago',
    placeName: 'Veterano Pizza',
    address: 'vul. Horodetskoho 10',
    accessibilityLabel: '75% accessible',
    reviewText: 'Wide entrance, accessible restroom on the ground floor. Staff were very helpful!',
  },
  {
    id: '2',
    friendName: 'Dmytro P.',
    mobilityAid: 'cane',
    timeAgo: '3h ago',
    placeName: 'Shevchenko Park',
    address: 'bulv. Tarasa Shevchenka 1',
    accessibilityLabel: '78% accessible',
    reviewText: 'Paths are smooth and wide. Some uneven sections near the fountain to watch out for.',
  },
]

const EVENTS = [
  {
    id: '1',
    title: 'Accessible Kyiv Walking Tour',
    date: 'Jun 20',
    organizer: 'Kyiv Tourism Board',
    attendeeCount: 24,
  },
  {
    id: '2',
    title: 'Inclusive Art Workshop',
    date: 'Jun 28',
    organizer: 'Mystetskyi Arsenal',
    attendeeCount: 15,
  },
]

// ── Screen ─────────────────────────────────────────────────────────

export const DiscoverScreen: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<DiscoverTab>('all')

  const showUpdates = activeTab === 'all' || activeTab === 'updates'
  const showFriends = activeTab === 'all' || activeTab === 'friends'
  const showEvents  = activeTab === 'all' || activeTab === 'events'

  const FILTER_CHIPS: { id: DiscoverTab; label: string }[] = [
    { id: 'all',     label: 'All'      },
    { id: 'updates', label: 'Updates'  },
    { id: 'friends', label: 'Friends'  },
    { id: 'events',  label: 'Events'   },
  ]

  return (
    <main className="min-h-screen overflow-y-auto bg-neutral-50 px-lg pt-[56px] pb-[144px]">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-md mb-2xl">
        <h1 className="text-display-md text-neutral-900">Discover</h1>

        {/* Filter chips */}
        <div className="flex items-center gap-xs flex-wrap">
          {FILTER_CHIPS.map(({ id, label }) => (
            <FilterChip
              key={id}
              label={label}
              active={activeTab === id}
              onClick={() => setActiveTab(id)}
            />
          ))}
        </div>
      </div>

      {/* ── Sections ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-xl">

        {/* UPDATES */}
        {showUpdates && (
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-[4px]">
              <p className="text-caption-md tracking-[0.56px] uppercase text-primary-500">
                Updates
              </p>
              <p className="text-body-sm text-neutral-700">Places that recently improved</p>
            </div>
            {/* Horizontal scroll */}
            <div className="flex flex-row gap-lg overflow-x-auto [&::-webkit-scrollbar]:hidden -mx-lg px-lg">
              {UPDATES.map(item => (
                <UpdateCard
                  key={item.id}
                  placeName={item.placeName}
                  address={item.address}
                  description={item.description}
                  verifiedCount={item.verifiedCount}
                  timeAgo={item.timeAgo}
                />
              ))}
            </div>
          </div>
        )}

        {/* FRIENDS' ACTIVITY */}
        {showFriends && (
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-[4px]">
              <p className="text-caption-md tracking-[0.56px] uppercase text-primary-500">
                Friends' activity
              </p>
              <p className="text-body-sm text-neutral-700">
                Your friends posted some reviews recently
              </p>
            </div>
            <div className="flex flex-col gap-md">
              {FRIEND_ACTIVITY.map(item => (
                <FriendActivityCard
                  key={item.id}
                  friendName={item.friendName}
                  mobilityAid={item.mobilityAid}
                  timeAgo={item.timeAgo}
                  placeName={item.placeName}
                  address={item.address}
                  accessibilityLabel={item.accessibilityLabel}
                  reviewText={item.reviewText}
                />
              ))}
            </div>
          </div>
        )}

        {/* ACCESSIBLE EVENTS */}
        {showEvents && (
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-[4px]">
              <p className="text-caption-md tracking-[0.56px] uppercase text-primary-500">
                Accessible events
              </p>
              <p className="text-body-sm text-neutral-700">
                Events we recommend you based on your interests
              </p>
            </div>
            <div className="flex flex-col gap-md">
              {EVENTS.map(item => (
                <EventCard
                  key={item.id}
                  title={item.title}
                  date={item.date}
                  organizer={item.organizer}
                  attendeeCount={item.attendeeCount}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── NavBar ──────────────────────────────────────────────── */}
      <div className="fixed bottom-[24px] left-[24px] right-[24px] z-40">
        <NavBar
          activeTab="discover"
          onTabChange={(tab) => navigate('/' + tab)}
        />
      </div>
    </main>
  )
}
