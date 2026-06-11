import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Accessibility, Bookmark, MessageCircle, Users,
  Volume2, Bell, LogOut, ChevronRight,
} from 'lucide-react'
import { NavBar, Toggle, Divider } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import type { MobilityAid } from '../context/OnboardingContext'

import WheelchairManual   from '../assets/illustrations/wheelchair-manual.svg?react'
import WheelchairElectric from '../assets/illustrations/wheelchair-electric.svg?react'
import Cane               from '../assets/illustrations/cane.svg?react'
import Prosthesis         from '../assets/illustrations/prosthesis.svg?react'
import Stroller           from '../assets/illustrations/stroller.svg?react'
import NoWheelchair       from '../assets/illustrations/no-wheelchair.svg?react'
import ProfileIllustration from '../assets/illustrations/ProfileIllustration.svg?react'

// ── Mobility illustration map ──────────────────────────────────────

const mobilityIllustrations: Record<MobilityAid, React.ReactElement> = {
  'wheelchair-manual':   <WheelchairManual   width={24} height={24} aria-hidden className="text-primary-500" />,
  'wheelchair-electric': <WheelchairElectric width={24} height={24} aria-hidden className="text-primary-500" />,
  'cane':                <Cane               width={24} height={24} aria-hidden className="text-primary-500" />,
  'prosthesis':          <Prosthesis         width={24} height={24} aria-hidden className="text-primary-500" />,
  'stroller':            <Stroller           width={24} height={24} aria-hidden className="text-primary-500" />,
  'no-aid':              <NoWheelchair       width={24} height={24} aria-hidden className="text-primary-500" />,
}

// ── Level system ───────────────────────────────────────────────────

const REVIEWS_PER_LEVEL = 10
const LEVEL_NAMES = ['Newcomer', 'Explorer', 'Local guide', 'City mapper', 'Barrier breaker']

function getLevel(reviewCount: number): { level: number; name: string; moreToNext: number } {
  const level     = Math.min(Math.floor(reviewCount / REVIEWS_PER_LEVEL) + 1, 5)
  const moreToNext = level < 5
    ? REVIEWS_PER_LEVEL - (reviewCount % REVIEWS_PER_LEVEL)
    : 0
  return { level, name: LEVEL_NAMES[level - 1], moreToNext }
}

// ── Types ──────────────────────────────────────────────────────────

export interface ProfileScreenProps {
  userName?:                  string
  avatarUrl?:                 string
  reviewCount?:               number
  friendCount?:               number
  weeklyReviews?:             number
  onTabChange?:               (tab: 'discover' | 'map' | 'profile') => void
  onAccessibilityPreferences?: () => void
  onSavedPlaces?:             () => void
  onMyReviews?:               () => void
  onMyFriends?:               () => void
  onSignOut?:                 () => void
}

// ── Sub-components ─────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-caption-md tracking-[0.56px] uppercase text-primary-500">
      {children}
    </p>
  )
}

function MenuRow({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode
  label: string
  onPress?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="flex items-center justify-between w-full h-[24px] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="flex items-center gap-sm">
        <span className="shrink-0 text-neutral-700">{icon}</span>
        <span className="text-body-md text-neutral-900">{label}</span>
      </div>
      <ChevronRight size={24} strokeWidth={1.5} className="text-neutral-500 shrink-0" aria-hidden />
    </button>
  )
}

function ToggleRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between w-full h-[24px]">
      <div className="flex items-center gap-sm">
        <span className="shrink-0 text-neutral-700">{icon}</span>
        <span className="text-body-md text-neutral-900">{label}</span>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}

// ── Screen ─────────────────────────────────────────────────────────

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userName     = 'User',
  avatarUrl,
  reviewCount  = 24,
  friendCount  = 12,
  weeklyReviews = 6,
  onTabChange,
  onAccessibilityPreferences,
  onSavedPlaces,
  onMyReviews,
  onMyFriends,
  onSignOut,
}) => {
  const navigate = useNavigate()
  const [voiceGuidance, setVoiceGuidance] = useState(false)
  const [notifications,  setNotifications]  = useState(false)

  const { mobilityAid } = useOnboarding()
  const mobilityIcon = mobilityAid
    ? mobilityIllustrations[mobilityAid]
    : <WheelchairManual width={24} height={24} aria-hidden className="text-primary-500" />

  const { level, name: levelName, moreToNext } = getLevel(reviewCount)

  return (
    <div className="relative w-full min-h-screen overflow-y-auto bg-neutral-50">
      <div className="flex flex-col gap-xl px-lg pt-[56px] pb-[144px]">

        {/* ── Page title ─────────────────────────────────────────── */}
        <p className="text-display-md text-neutral-900">Profile</p>

        {/* ── User info row ───────────────────────────────────────── */}
        <div className="flex items-start justify-between w-full">

          {/* Left: avatar + info */}
          <div className="flex items-center gap-sm">
            {/* Avatar */}
            <div className="shrink-0 size-[56px] rounded-full overflow-hidden bg-primary-100">
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center">
                  <span className="text-heading-md text-primary-500 font-semibold select-none">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Name + stats */}
            <div className="flex flex-col gap-xs">
              {/* Name + mobility icon */}
              <div className="flex items-center gap-xs">
                <span className="text-heading-md text-neutral-900 whitespace-nowrap">{userName}</span>
                <span className="shrink-0">{mobilityIcon}</span>
              </div>
              {/* Review / friends */}
              <div className="flex items-center gap-[12px]">
                <button
                  type="button"
                  onClick={() => onMyReviews?.()}
                  className="text-body-sm text-neutral-700 underline underline-offset-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  {reviewCount} reviews
                </button>
                <div className="w-px h-[10px] bg-neutral-200 shrink-0" aria-hidden />
                <button
                  type="button"
                  onClick={() => onMyFriends?.()}
                  className="text-body-sm text-neutral-700 underline underline-offset-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  {friendCount} friends
                </button>
              </div>
            </div>
          </div>

          {/* Right: level chip */}
          <div className="flex items-center gap-xs bg-primary-100 rounded-[24px] px-xs py-[4px] shrink-0 ml-xs">
            <div className="flex items-center justify-center border-2 border-primary-500 rounded-[24px] px-[7px] py-[2px]">
              <span className="text-caption-sm font-semibold text-primary-500 leading-[1.4]">{level}</span>
            </div>
            <span className="text-caption-sm text-primary-500 whitespace-nowrap">{levelName}</span>
          </div>
        </div>

        {/* ── Impact widget ───────────────────────────────────────── */}
        <div className="bg-primary-100 rounded-[24px] p-sm flex flex-col gap-sm w-full">
          <p className="text-caption-md tracking-[0.56px] uppercase text-primary-500">
            Your Impact This Week
          </p>
          <div className="flex items-start gap-sm w-full">
            {/* Left: count + badge + label */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-xs flex-wrap">
                <span className="text-display-md text-neutral-900">{weeklyReviews}</span>
                {level < 5 && moreToNext > 0 && (
                  <div className="bg-primary-300 rounded-[24px] px-xs py-[4px] shrink-0">
                    <span className="text-caption-sm text-neutral-0 whitespace-nowrap">
                      {moreToNext} more to get the next level!
                    </span>
                  </div>
                )}
              </div>
              <span className="text-body-md text-neutral-700">reviews posted</span>
            </div>
            {/* Right: illustration */}
            <div className="shrink-0 w-[90px] h-[54px] flex items-center justify-end">
              <ProfileIllustration width={90} height={54} aria-hidden />
            </div>
          </div>
        </div>

        {/* ── Sections ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-xl w-full">

          {/* MY PROFILE */}
          <div className="flex flex-col gap-lg w-full">
            <SectionLabel>My Profile</SectionLabel>
            <div className="flex flex-col gap-md w-full">
              <MenuRow
                icon={<Accessibility size={24} strokeWidth={1.5} />}
                label="My accessibility preferences"
                onPress={() => { navigate('/profile/preferences'); onAccessibilityPreferences?.() }}
              />
              <Divider />
              <MenuRow
                icon={<Bookmark size={24} strokeWidth={1.5} />}
                label="Saved places"
                onPress={onSavedPlaces}
              />
              <Divider />
              <MenuRow
                icon={<MessageCircle size={24} strokeWidth={1.5} />}
                label="My reviews"
                onPress={onMyReviews}
              />
              <Divider />
              <MenuRow
                icon={<Users size={24} strokeWidth={1.5} />}
                label="My friends"
                onPress={onMyFriends}
              />
            </div>
          </div>

          {/* APP SETTINGS */}
          <div className="flex flex-col gap-lg w-full">
            <SectionLabel>App Settings</SectionLabel>
            <div className="flex flex-col gap-md w-full">
              <ToggleRow
                icon={<Volume2 size={24} strokeWidth={1.5} />}
                label="Voice guidance"
                value={voiceGuidance}
                onChange={setVoiceGuidance}
              />
              <Divider />
              <ToggleRow
                icon={<Bell size={24} strokeWidth={1.5} />}
                label="Notifications"
                value={notifications}
                onChange={setNotifications}
              />
            </div>
          </div>

          {/* ACCOUNT */}
          <div className="flex flex-col gap-lg w-full">
            <SectionLabel>Account</SectionLabel>
            <MenuRow
              icon={<LogOut size={24} strokeWidth={1.5} />}
              label="Sign out"
              onPress={onSignOut}
            />
          </div>

        </div>
      </div>

      {/* ── NavBar fixed at bottom ──────────────────────────────── */}
      <div className="fixed bottom-[24px] left-[24px] right-[24px] z-40">
        <NavBar
          activeTab="profile"
          onTabChange={onTabChange ?? (() => {})}
        />
      </div>
    </div>
  )
}
