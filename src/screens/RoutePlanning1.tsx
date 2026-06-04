import React, { useState } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Funnel, Warehouse, Building2, Utensils, Hospital } from 'lucide-react'
import { SearchBar, Chip, AccessibilityBadge, NavBar } from '../components'

const MARKERS: { id: string; lng: number; lat: number }[] = [
  { id: 'm1', lng: 30.518, lat: 50.452 },
  { id: 'm2', lng: 30.526, lat: 50.448 },
  { id: 'm3', lng: 30.512, lat: 50.445 },
  { id: 'm4', lng: 30.528, lat: 50.442 },
]

export const RoutePlanning1: React.FC = () => {
  const [search, setSearch] = useState('')

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* ── Full-screen Mapbox map ───────────────────────────────────── */}
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{ longitude: 30.5234, latitude: 50.4501, zoom: 14 }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {MARKERS.map(({ id, lng, lat }) => (
          <Marker key={id} longitude={lng} latitude={lat} anchor="center">
            <AccessibilityBadge variant="accessible" size="sm" />
          </Marker>
        ))}
      </Map>

      {/* ── Search + filter bar ─────────────────────────────────────── */}
      <div className="absolute top-[80px] left-lg right-lg z-10 flex items-center gap-xs">
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
      <div className="absolute top-[148px] left-lg right-lg z-10 flex gap-xs overflow-x-auto [&::-webkit-scrollbar]:hidden">
        <Chip label="Shelter"    icon={<Warehouse size={14} aria-hidden />} />
        <Chip label="Toilet"     icon={<Building2  size={14} aria-hidden />} />
        <Chip label="Restaurant" icon={<Utensils   size={14} aria-hidden />} />
        <Chip label="Hospital"   icon={<Hospital   size={14} aria-hidden />} />
      </div>

      {/* ── NavBar ──────────────────────────────────────────────────── */}
      <div className="absolute bottom-lg left-lg right-lg z-10">
        <NavBar activeTab="map" onTabChange={() => {}} />
      </div>

    </div>
  )
}
