import React, { useRef, useState } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import type { MapRef } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  Funnel, Droplets, Utensils, Hospital, Pill, ShoppingCart,
  Trees, Landmark, X, Bookmark, Share2,
} from 'lucide-react'
import ShelterIcon from '../assets/icons/shelter.svg?react'
import {
  SearchBar, Chip, AccessibilityBadge, StatusBadge, Button, NavBar,
} from '../components'

// ── Types & data ───────────────────────────────────────────────────────────

type Place = {
  id: string
  name: string
  address: string
  category: 'hospital' | 'restaurant' | 'landmark' | 'shelter'
  coordinates: [number, number]
  accessibilityScore: number
  barrierCount: number
  distance: string
}

const PLACES: Place[] = [
  { id: '1', name: 'Pharmacy Liky',       address: 'vul. Khreschyatyk 22',         category: 'hospital',   coordinates: [30.518, 50.452], accessibilityScore: 90, barrierCount: 0, distance: '300 m'  },
  { id: '2', name: 'Kyiv City Museum',    address: 'vul. Khreschyatyk 15',         category: 'landmark',   coordinates: [30.526, 50.448], accessibilityScore: 70, barrierCount: 2, distance: '500 m'  },
  { id: '3', name: 'Puzata Hata',         address: 'vul. Baseyna 5',               category: 'restaurant', coordinates: [30.512, 50.445], accessibilityScore: 60, barrierCount: 3, distance: '800 m'  },
  { id: '4', name: 'Shelter Point',       address: 'vul. Velyka Vasylkivska 12',   category: 'shelter',    coordinates: [30.528, 50.442], accessibilityScore: 80, barrierCount: 1, distance: '1.2 km' },
]

// ── Helpers ────────────────────────────────────────────────────────────────

function scoreVariant(score: number): 'positive' | 'warning' | 'negative' {
  if (score >= 80) return 'positive'
  if (score >= 40) return 'warning'
  return 'negative'
}

function badgeVariant(score: number): 'accessible' | 'partial' | 'inaccessible' {
  if (score >= 80) return 'accessible'
  if (score >= 40) return 'partial'
  return 'inaccessible'
}

// ── Category marker icons ──────────────────────────────────────────────────

function CategoryIcon({ category }: { category: Place['category'] }) {
  const cls = 'text-neutral-0'
  if (category === 'hospital')   return <Hospital  size={12} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'restaurant') return <Utensils  size={12} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'landmark')   return <Landmark  size={12} strokeWidth={1} className={cls} aria-hidden />
  return <ShelterIcon width={12} height={12} stroke="currentColor" strokeWidth={1} className={cls} aria-hidden />
}

// ── Marker badge ───────────────────────────────────────────────────────────

function PlaceMarker({ place, selected }: { place: Place; selected: boolean }) {
  const outerSize  = selected ? 'w-[36px] h-[36px]' : 'w-[28px] h-[28px]'
  const innerSize  = selected ? 'w-[28px] h-[28px]' : 'w-[22px] h-[22px]'

  return (
    <div className="relative flex items-center justify-center">
      {selected && (
        <span className="absolute w-[48px] h-[48px] rounded-full bg-success-500 opacity-20 animate-ping" />
      )}
      <div
        role="img"
        aria-label={place.name}
        className={`flex items-center justify-center shrink-0 rounded-full bg-success-500/20 ${outerSize}`}
      >
        <div className={`flex items-center justify-center shrink-0 rounded-full bg-success-500 ${innerSize}`}>
          <CategoryIcon category={place.category} />
        </div>
      </div>
    </div>
  )
}

// ── Screen ─────────────────────────────────────────────────────────────────

export const MapScreen: React.FC = () => {
  const mapRef                            = useRef<MapRef>(null)
  const [search, setSearch]              = useState('')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place)
    mapRef.current?.getMap().flyTo({
      center: place.coordinates,
      zoom: 16,
      duration: 600,
      offset: [0, -150],
    })
  }

  const handleClosePopup = () => setSelectedPlace(null)

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* ── Full-screen Mapbox map ───────────────────────────────────── */}
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{ longitude: 30.5234, latitude: 50.4501, zoom: 14 }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {PLACES.map(place => (
          <Marker
            key={place.id}
            longitude={place.coordinates[0]}
            latitude={place.coordinates[1]}
            anchor="center"
            onClick={() => handleMarkerClick(place)}
          >
            <PlaceMarker place={place} selected={selectedPlace?.id === place.id} />
          </Marker>
        ))}
      </Map>

      {/* ── Search + filter bar ─────────────────────────────────────── */}
      <div className="absolute top-[56px] left-lg right-lg z-10 flex items-center gap-xs">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search places..."
          />
        </div>

        <button
          type="button"
          className={[
            'flex items-center justify-center shrink-0',
            'w-[48px] h-[48px] rounded-xl',
            'bg-neutral-0 border border-neutral-200',
            'text-neutral-500',
            'transition-colors duration-200',
            'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
          ].join(' ')}
          aria-label="Filter"
        >
          <Funnel size={20} aria-hidden />
        </button>
      </div>

      {/* ── Category chips ──────────────────────────────────────────── */}
      <div className="absolute top-[124px] left-lg right-0 z-10 flex flex-row flex-nowrap gap-xs overflow-x-auto [&::-webkit-scrollbar]:hidden">
        <Chip variant="neutral" size="md" label="Shelter"     className="shrink-0" icon={<ShelterIcon  width={14} height={14} stroke="currentColor" strokeWidth={1} className="text-neutral-700" aria-hidden />} />
        <Chip variant="neutral" size="md" label="Toilet"      className="shrink-0" icon={<Droplets     size={14} strokeWidth={1} className="text-neutral-700" aria-hidden />} />
        <Chip variant="neutral" size="md" label="Restaurant"  className="shrink-0" icon={<Utensils     size={14} strokeWidth={1} className="text-neutral-700" aria-hidden />} />
        <Chip variant="neutral" size="md" label="Hospital"    className="shrink-0" icon={<Hospital     size={14} strokeWidth={1} className="text-neutral-700" aria-hidden />} />
        <Chip variant="neutral" size="md" label="Pharmacy"    className="shrink-0" icon={<Pill         size={14} strokeWidth={1} className="text-neutral-700" aria-hidden />} />
        <Chip variant="neutral" size="md" label="Supermarket" className="shrink-0" icon={<ShoppingCart size={14} strokeWidth={1} className="text-neutral-700" aria-hidden />} />
        <Chip variant="neutral" size="md" label="Park"        className="shrink-0" icon={<Trees        size={14} strokeWidth={1} className="text-neutral-700" aria-hidden />} />
        <Chip variant="neutral" size="md" label="Bank"        className="shrink-0" icon={<Landmark     size={14} strokeWidth={1} className="text-neutral-700" aria-hidden />} />
      </div>

      {/* ── Place popup card ────────────────────────────────────────── */}
      <div
        className={[
          'fixed bottom-[133px] left-lg right-lg z-10',
          'transition-transform duration-300 ease-out',
          selectedPlace ? 'translate-y-0' : 'translate-y-[calc(100%+125px)]',
        ].join(' ')}
      >
        {selectedPlace && (
          <div className="bg-neutral-0 rounded-[32px] pt-sm px-md pb-md flex flex-col gap-sm shadow-lg">

            {/* Close button row */}
            <div className="flex justify-end mb-xs">
              <button
                type="button"
                onClick={handleClosePopup}
                className={[
                  'flex items-center justify-center',
                  'w-[32px] h-[32px] rounded-full',
                  'text-neutral-900',
                  'transition-colors duration-200',
                  'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                ].join(' ')}
                aria-label="Close"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            {/* Photo */}
            <img
              src="https://placehold.co/354x120"
              alt={selectedPlace.name}
              className="h-[120px] w-full rounded-xl object-cover bg-neutral-100"
            />

            {/* Info section */}
            <div className="flex flex-col gap-xs pt-xs">

              {/* Badges */}
              <div className="flex items-center gap-xs">
                <AccessibilityBadge variant={badgeVariant(selectedPlace.accessibilityScore)} size="sm" />
                <StatusBadge variant={scoreVariant(selectedPlace.accessibilityScore)} label={`${selectedPlace.accessibilityScore}% Accessible`} />
              </div>

              {/* Name + distance */}
              <div className="flex items-center justify-between">
                <span className="text-heading-sm text-neutral-900 flex-1">{selectedPlace.name}</span>
                <span className="text-body-sb text-neutral-900">{selectedPlace.distance}</span>
              </div>

              {/* Address + barriers */}
              <div className="flex items-center justify-between">
                <span className="text-caption-sm text-neutral-500 flex-1">{selectedPlace.address}</span>
                <span className="text-caption-sm text-neutral-500">{selectedPlace.barrierCount} barriers</span>
              </div>
            </div>

            {/* Action row */}
            <div className="flex items-center gap-xs">
              <div className="flex-1">
                <Button
                  variant="primary"
                  label="Build a route"
                  fullWidth
                  onClick={() => console.log('Build a route', selectedPlace)}
                />
              </div>

              <button
                type="button"
                className={[
                  'flex items-center justify-center shrink-0',
                  'w-[48px] h-[48px] rounded-full',
                  'bg-neutral-0 border border-neutral-200',
                  'text-neutral-700',
                  'transition-colors duration-200',
                  'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                ].join(' ')}
                aria-label="Bookmark"
              >
                <Bookmark size={20} aria-hidden />
              </button>

              <button
                type="button"
                className={[
                  'flex items-center justify-center shrink-0',
                  'w-[48px] h-[48px] rounded-full',
                  'bg-neutral-0 border border-neutral-200',
                  'text-neutral-700',
                  'transition-colors duration-200',
                  'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                ].join(' ')}
                aria-label="Share"
              >
                <Share2 size={20} aria-hidden />
              </button>
            </div>

          </div>
        )}
      </div>

      {/* ── NavBar ──────────────────────────────────────────────────── */}
      <div className="absolute bottom-lg left-lg right-lg z-20">
        <NavBar activeTab="map" onTabChange={() => {}} />
      </div>

    </div>
  )
}
