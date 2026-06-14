import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BadgeCheck, X } from 'lucide-react'
import { Button } from '../components'
import { formatDistance, formatDuration } from '../utils/formatUnits'

// ── Screen ──────────────────────────────────────────────────────────────────

export const RouteCompleteScreen: React.FC = () => {
  const navigate      = useNavigate()
  const location      = useLocation()
  const { t, i18n }  = useTranslation()
  const lang          = i18n.language

  const {
    distanceKm,
    durationMin,
    placeId,
    placeName,
    placeNameUk,
    address,
    addressUk,
    destinationName,
  } = (location.state as {
    distanceKm?:     number
    durationMin?:    number
    placeId?:        string
    placeName?:      string
    placeNameUk?:    string
    address?:        string
    addressUk?:      string
    destinationName?: string
  }) ?? {}

  const localizedName    = lang === 'uk' ? (placeNameUk ?? placeName) : placeName
  const localizedAddress = lang === 'uk' ? (addressUk   ?? address)   : address
  const displayName      = localizedName ?? destinationName ?? ''

  // ── Slide-up entrance ────────────────────────────────────────────────────
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(id)
  }, [])

  return (
    <main
      className={[
        'fixed inset-0 bg-neutral-50 overflow-y-auto',
        'transition-transform duration-500 ease-out',
        visible ? 'translate-y-0' : 'translate-y-full',
      ].join(' ')}
    >
      {/* Close button */}
      <button
        type="button"
        aria-label={t('common.close')}
        onClick={() => navigate('/map')}
        className={[
          'absolute top-[56px] right-[24px]',
          'flex items-center justify-center',
          'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm',
        ].join(' ')}
      >
        <X size={24} strokeWidth={1.5} className="text-neutral-500" />
      </button>

      <div className="min-h-screen px-lg flex flex-col items-center justify-center gap-xl">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-2xs">

          {/* Icon */}
          <div className="bg-primary-100 rounded-[48px] p-md mb-2xs">
            <BadgeCheck size={24} strokeWidth={1.5} className="text-primary-500" />
          </div>

          {/* Title */}
          <h1 className="text-display-md text-neutral-900 text-center">
            {t('routeComplete.title')}
          </h1>

          {/* Subtitle row — distance · duration */}
          <div className="flex items-center gap-xs">
            <span className="text-body-sm text-neutral-700">
              {distanceKm !== undefined ? formatDistance(distanceKm * 1000, lang) : '—'}
            </span>
            <div className="w-px h-[10px] bg-neutral-200" />
            <span className="text-body-sm text-neutral-700">
              {durationMin !== undefined ? formatDuration(durationMin, lang) : '—'}
            </span>
          </div>

        </div>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-sm items-center w-full">
          <Button
            variant="primary"
            label={t('routeComplete.leaveReview', { name: displayName })}
            fullWidth
            onClick={() => navigate('/review', { state: { placeId, placeName: localizedName, address: localizedAddress } })}
          />
          <Button
            variant="ghost"
            label={t('routeComplete.reportProblem')}
            fullWidth
            onClick={() => console.log('Report problem with route')}
          />
          <button
            type="button"
            onClick={() => navigate('/map')}
            className={[
              'text-body-sm text-neutral-500 text-center w-full py-xs',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm',
            ].join(' ')}
          >
            {t('routeComplete.backToMap')}
          </button>
        </div>

      </div>
    </main>
  )
}
