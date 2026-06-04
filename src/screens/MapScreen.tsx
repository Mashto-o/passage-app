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
  category: 'hospital' | 'restaurant' | 'landmark' | 'shelter' | 'supermarket' | 'park' | 'bank'
  coordinates: [number, number]
  accessibilityScore: number
  barrierCount: number
  distance: string
}

const PLACES: Place[] = [
  // Hospitals / Pharmacies
  { id: '1',  name: 'Pharmacy Liky',              address: 'vul. Khreschyatyk 22',          category: 'hospital',     coordinates: [30.5238, 50.4494], accessibilityScore: 90, barrierCount: 0, distance: '300 m'  },
  { id: '2',  name: 'Oleksandrivska Hospital',    address: 'bulv. Tarasa Shevchenka 17',    category: 'hospital',     coordinates: [30.5106, 50.4478], accessibilityScore: 55, barrierCount: 4, distance: '1.1 km' },
  // Restaurants / Cafés
  { id: '3',  name: 'Puzata Hata',                address: 'vul. Baseyna 5',                category: 'restaurant',   coordinates: [30.5189, 50.4432], accessibilityScore: 60, barrierCount: 3, distance: '800 m'  },
  { id: '4',  name: 'Veterano Pizza',             address: 'vul. Horodetskoho 10',          category: 'restaurant',   coordinates: [30.5271, 50.4468], accessibilityScore: 75, barrierCount: 1, distance: '600 m'  },
  { id: '5',  name: 'Zhyva Kava',                 address: 'vul. Velyka Vasylkivska 45',    category: 'restaurant',   coordinates: [30.5223, 50.4385], accessibilityScore: 65, barrierCount: 2, distance: '1.4 km' },
  // Landmarks / Museums
  { id: '6',  name: 'Kyiv City Museum',           address: 'vul. Khreschyatyk 15',          category: 'landmark',     coordinates: [30.5214, 50.4501], accessibilityScore: 70, barrierCount: 2, distance: '500 m'  },
  { id: '7',  name: 'National Museum of History', address: 'vul. Volodymyrska 2',           category: 'landmark',     coordinates: [30.5136, 50.4547], accessibilityScore: 45, barrierCount: 5, distance: '1.3 km' },
  { id: '8',  name: 'Pinchuk Art Centre',         address: 'vul. Velyka Vasylkivska 1',     category: 'landmark',     coordinates: [30.5241, 50.4447], accessibilityScore: 85, barrierCount: 1, distance: '900 m'  },
  // Shelters
  { id: '9',  name: 'Shelter Maidan',             address: 'Maidan Nezalezhnosti 1',        category: 'shelter',      coordinates: [30.5234, 50.4504], accessibilityScore: 80, barrierCount: 1, distance: '200 m'  },
  { id: '10', name: 'Shelter Lukyanivska',         address: 'vul. Oleny Telihy 3',           category: 'shelter',      coordinates: [30.4986, 50.4612], accessibilityScore: 50, barrierCount: 3, distance: '2.1 km' },
  // Supermarkets
  { id: '11', name: 'Silpo Khreschyatyk',         address: 'vul. Khreschyatyk 44',          category: 'supermarket',  coordinates: [30.5198, 50.4471], accessibilityScore: 88, barrierCount: 0, distance: '700 m'  },
  { id: '12', name: 'Novus Lukyanivska',           address: 'vul. Turhenievska 38',          category: 'supermarket',  coordinates: [30.5012, 50.4598], accessibilityScore: 72, barrierCount: 2, distance: '1.9 km' },
  // Parks
  { id: '13', name: 'Shevchenko Park',             address: 'bulv. Tarasa Shevchenka 1',    category: 'park',         coordinates: [30.5134, 50.4453], accessibilityScore: 78, barrierCount: 2, distance: '1.0 km' },
  { id: '14', name: 'Mariinsky Park',              address: 'vul. Hrushevskoho 5',          category: 'park',         coordinates: [30.5385, 50.4489], accessibilityScore: 62, barrierCount: 3, distance: '1.6 km' },
  // Bank
  { id: '15', name: 'PrivatBank Central',          address: 'vul. Hrushevskogo 1d',         category: 'bank',         coordinates: [30.5301, 50.4512], accessibilityScore: 83, barrierCount: 1, distance: '400 m'  },
]

// ── Helpers ────────────────────────────────────────────────────────────────

function scoreVariant(score: number): 'positive' | 'warning' | 'negative' {
  if (score >= 80) return 'positive'
  if (score >= 40) return 'warning'
  return 'negative'
}

function getAccessibilityVariant(score: number): 'accessible' | 'partial' | 'inaccessible' {
  if (score >= 80) return 'accessible'
  if (score >= 40) return 'partial'
  return 'inaccessible'
}

const markerColors = {
  accessible:   { outer: 'bg-success-500/20',  inner: 'bg-success-500',  ping: 'bg-success-500'  },
  partial:      { outer: 'bg-warning-500/20',   inner: 'bg-warning-500',  ping: 'bg-warning-500'  },
  inaccessible: { outer: 'bg-danger-500/20',    inner: 'bg-danger-500',   ping: 'bg-danger-500'   },
}

// ── Category icon helper ───────────────────────────────────────────────────

function getCategoryIcon(category: Place['category'], size: number) {
  const cls = 'text-neutral-0'
  if (category === 'hospital')    return <Hospital     size={size} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'restaurant')  return <Utensils     size={size} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'landmark')    return <Landmark     size={size} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'supermarket') return <ShoppingCart size={size} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'park')        return <Trees        size={size} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'bank')        return <Landmark     size={size} strokeWidth={1} className={cls} aria-hidden />
  return <ShelterIcon width={size} height={size} stroke="currentColor" strokeWidth={1} className={cls} aria-hidden />
}

// ── Marker badge ───────────────────────────────────────────────────────────

function PlaceMarker({ place, selected }: { place: Place; selected: boolean }) {
  const size      = selected ? 'md' : 'sm'
  const iconSize  = selected ? 16 : 12
  const { ping }  = markerColors[getAccessibilityVariant(place.accessibilityScore)]

  return (
    <div className="relative flex items-center justify-center">
      {selected && (
        <span className={`absolute w-[48px] h-[48px] rounded-full ${ping} opacity-20 animate-ping`} />
      )}
      <AccessibilityBadge
        variant={getAccessibilityVariant(place.accessibilityScore)}
        size={size}
        icon={getCategoryIcon(place.category, iconSize)}
      />
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
                <AccessibilityBadge
                  variant={getAccessibilityVariant(selectedPlace.accessibilityScore)}
                  size="sm"
                  icon={getCategoryIcon(selectedPlace.category, 12)}
                />
                <StatusBadge variant={scoreVariant(selectedPlace.accessibilityScore)} label={`${selectedPlace.accessibilityScore}% Accessible`} />
              </div>

              {/* Name + distance */}
              <div className="flex items-center justify-between">
                <span className="text-heading-sm text-neutral-900 flex-1">{selectedPlace.name}</span>
                <span className="text-body-sb text-neutral-900">{selectedPlace.distance}</span>
              </div>

              {/* Address + barriers */}
              <div className="flex items-center justify-between">
                <span className="text-body-sm text-neutral-500 flex-1">{selectedPlace.address}</span>
                <span className="text-body-sm text-neutral-500">{selectedPlace.barrierCount} barriers</span>
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
