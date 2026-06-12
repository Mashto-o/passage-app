import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FilterChip, NavBar, UpdateCard, FriendActivityCard, EventCard } from '../components'
import { getLocalizedField } from '../utils/localizedField'
import type { MobilityAid } from '../context/OnboardingContext'

// ── Filter type ────────────────────────────────────────────────────

type DiscoverTab = 'all' | 'updates' | 'friends' | 'events'

// ── Chip defs (labels resolved via t()) ───────────────────────────

const CHIP_DEFS: { id: DiscoverTab; labelKey: string }[] = [
  { id: 'all',     labelKey: 'discover.filterAll'     },
  { id: 'updates', labelKey: 'discover.filterUpdates' },
  { id: 'friends', labelKey: 'discover.filterFriends' },
  { id: 'events',  labelKey: 'discover.filterEvents'  },
]

// ── Mock data ──────────────────────────────────────────────────────

const UPDATES = [
  {
    id: '1',
    placeName:   'Silpo Khreschyatyk',
    placeNameUk: 'Сільпо Хрещатик',
    address:     'vul. Khreschyatyk 44',
    addressUk:   'вул. Хрещатик 44',
    description:   'New accessible entrance with automated sliding doors and a dedicated ramp — now fully wheelchair-friendly.',
    descriptionUk: 'Новий доступний вхід з автоматичними розсувними дверима та виділеним пандусом — тепер повністю доступно для візків.',
    verifiedCount: 12,
    timeAgoHours:  2,
  },
  {
    id: '2',
    placeName:   'Kyiv City Museum',
    placeNameUk: 'Музей міста Київ',
    address:     'vul. Khreschyatyk 15',
    addressUk:   'вул. Хрещатик 15',
    description:   'The elevator is fully repaired and back in service after a 3-month closure.',
    descriptionUk: 'Ліфт повністю відремонтовано та повернуто в експлуатацію після 3-місячного закриття.',
    verifiedCount: 8,
    timeAgoHours:  5,
  },
]

const FRIEND_ACTIVITY: {
  id: string
  friendName: string
  mobilityAid: MobilityAid
  timeAgoHours: number
  placeName: string
  placeNameUk: string
  address: string
  addressUk: string
  accessibilityScore: number
  reviewText: string
  reviewTextUk: string
}[] = [
  {
    id: '1',
    friendName:        'Olena K.',
    mobilityAid:       'wheelchair-manual',
    timeAgoHours:      1,
    placeName:         'Veterano Pizza',
    placeNameUk:       'Ветерано Піцца',
    address:           'vul. Horodetskoho 10',
    addressUk:         'вул. Городецького 10',
    accessibilityScore: 75,
    reviewText:   'Wide entrance, accessible restroom on the ground floor. Staff were very helpful!',
    reviewTextUk: 'Широкий вхід, доступний туалет на першому поверсі. Персонал був дуже привітний!',
  },
  {
    id: '2',
    friendName:        'Dmytro P.',
    mobilityAid:       'cane',
    timeAgoHours:      3,
    placeName:         'Shevchenko Park',
    placeNameUk:       'Парк Шевченка',
    address:           'bulv. Tarasa Shevchenka 1',
    addressUk:         'бульв. Тараса Шевченка 1',
    accessibilityScore: 78,
    reviewText:   'Paths are smooth and wide. Some uneven sections near the fountain to watch out for.',
    reviewTextUk: 'Доріжки рівні та широкі. Є нерівні ділянки біля фонтану — слід бути обережним.',
  },
]

const EVENTS = [
  {
    id: '1',
    title:        'Accessible Kyiv Walking Tour',
    titleUk:      'Доступна пішохідна екскурсія Києвом',
    date:         'Jun 20',
    dateUk:       '20 черв',
    organizer:    'Kyiv Tourism Board',
    organizerUk:  'Київське туристичне управління',
    attendeeCount: 24,
  },
  {
    id: '2',
    title:        'Inclusive Art Workshop',
    titleUk:      'Інклюзивна художня майстерня',
    date:         'Jun 28',
    dateUk:       '28 черв',
    organizer:    'Mystetskyi Arsenal',
    organizerUk:  'Мистецький Арсенал',
    attendeeCount: 15,
  },
]

// ── Screen ─────────────────────────────────────────────────────────

export const DiscoverScreen: React.FC = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [activeTab, setActiveTab] = useState<DiscoverTab>('all')

  const showUpdates = activeTab === 'all' || activeTab === 'updates'
  const showFriends = activeTab === 'all' || activeTab === 'friends'
  const showEvents  = activeTab === 'all' || activeTab === 'events'

  return (
    <main className="min-h-screen overflow-y-auto bg-neutral-50 px-lg pt-[56px] pb-[144px]">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-md mb-2xl">
        <h1 className="text-display-md text-neutral-900">{t('discover.title')}</h1>

        {/* Filter chips */}
        <div className="flex items-center gap-xs flex-wrap">
          {CHIP_DEFS.map(({ id, labelKey }) => (
            <FilterChip
              key={id}
              label={t(labelKey)}
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
                {t('discover.updatesLabel')}
              </p>
              <p className="text-body-sm text-neutral-700">{t('discover.updatesSubtitle')}</p>
            </div>
            {/* Horizontal scroll */}
            <div className="flex flex-row gap-lg overflow-x-auto [&::-webkit-scrollbar]:hidden -mx-lg px-lg">
              {UPDATES.map(item => (
                <UpdateCard
                  key={item.id}
                  placeName={getLocalizedField(item, 'placeName', lang)}
                  address={getLocalizedField(item, 'address', lang)}
                  description={getLocalizedField(item, 'description', lang)}
                  verifiedCount={item.verifiedCount}
                  timeAgo={t('placeListItem.hoursAgo', { count: item.timeAgoHours })}
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
                {t('discover.friendsLabel')}
              </p>
              <p className="text-body-sm text-neutral-700">{t('discover.friendsSubtitle')}</p>
            </div>
            <div className="flex flex-col gap-md">
              {FRIEND_ACTIVITY.map(item => (
                <FriendActivityCard
                  key={item.id}
                  friendName={item.friendName}
                  mobilityAid={item.mobilityAid}
                  timeAgo={t('placeListItem.hoursAgo', { count: item.timeAgoHours })}
                  placeName={getLocalizedField(item, 'placeName', lang)}
                  address={getLocalizedField(item, 'address', lang)}
                  accessibilityLabel={t('map.accessiblePercent', { score: item.accessibilityScore })}
                  reviewText={getLocalizedField(item, 'reviewText', lang)}
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
                {t('discover.eventsLabel')}
              </p>
              <p className="text-body-sm text-neutral-700">{t('discover.eventsSubtitle')}</p>
            </div>
            <div className="flex flex-col gap-md">
              {EVENTS.map(item => (
                <EventCard
                  key={item.id}
                  title={getLocalizedField(item, 'title', lang)}
                  date={getLocalizedField(item, 'date', lang)}
                  organizer={getLocalizedField(item, 'organizer', lang)}
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
