import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Map, { Marker } from 'react-map-gl/mapbox'
import type { MapRef } from 'react-map-gl/mapbox'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Funnel, Hospital, Utensils, Landmark, ShoppingCart, Trees, Toilet, Pill, ChevronLeft } from 'lucide-react'
import ShelterIcon from '../assets/icons/shelter.svg?react'
import { getCategoryIcon } from '../utils/categoryIcon'
import { formatDistance } from '../utils/formatUnits'
import { getLocalizedField } from '../utils/localizedField'
import type { FilterState } from '../context/FilterContext'
import { useFilterContext } from '../context/FilterContext'
import {
  SearchBar, Chip, AccessibilityBadge, NavBar, Button,
  PlaceListItem, SortControl, Divider, PlacePopupCard, SortSheet,
  PlaceDetailSheet, RoutePlanningSheet, RouteDestination, RouteDetailSheet,
  ActiveNavigationSheet,
} from '../components'
import type { Route } from '../components'

// ── Types & data ───────────────────────────────────────────────────────────
// Re-exported for backward compat — downstream files import from MapScreen
export type { PlaceCategory, PlaceFeatures, PlacePhoto, PlaceSection, PlaceSections, Place, SortKey } from '../data/places'
export { PLACES, SORT_KEYS, sortPlaces } from '../data/places'

import type { Place, SortKey } from '../data/places'
import { PLACES, SORT_KEYS, sortPlaces } from '../data/places'

// ── Filter helper ──────────────────────────────────────────────────────────

function filterPlaces(places: Place[], filter: FilterState): Place[] {
  return places.filter((place) => {
    const variant = getAccessibilityVariant(place.accessibilityScore)
    if (!filter.accessibility.has(variant)) return false
    if (filter.avoidLifts && place.isLiftDependent) return false
    return true
  })
}

// ── Search helper ─────────────────────────────────────────────────────────

function searchPlaces(places: Place[], query: string): Place[] {
  if (!query.trim()) return places
  const q = query.toLowerCase()
  const nameMatches = places.filter(
    p => p.name.toLowerCase().includes(q) || p.nameUk.toLowerCase().includes(q)
  )
  const addressOnlyMatches = places.filter(
    p => !p.name.toLowerCase().includes(q) && !p.nameUk.toLowerCase().includes(q)
      && (p.address.toLowerCase().includes(q) || p.addressUk.toLowerCase().includes(q))
  )
  return [...nameMatches, ...addressOnlyMatches]
}

// ── Helpers ────────────────────────────────────────────────────────────────

function scoreVariant(score: number): 'positive' | 'warning' | 'negative' {
  if (score >= 80) return 'positive'
  if (score >= 40) return 'warning'
  return 'negative'
}

export function getAccessibilityVariant(score: number): 'accessible' | 'partial' | 'inaccessible' {
  if (score >= 80) return 'accessible'
  if (score >= 40) return 'partial'
  return 'inaccessible'
}

const markerColors = {
  accessible:   { outer: 'bg-success-500/20',  inner: 'bg-success-500',  ping: 'bg-success-500'  },
  partial:      { outer: 'bg-warning-500/20',   inner: 'bg-warning-500',  ping: 'bg-warning-500'  },
  inaccessible: { outer: 'bg-danger-500/20',    inner: 'bg-danger-500',   ping: 'bg-danger-500'   },
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

// ── Category chip definitions ──────────────────────────────────────────────

type CategoryKey = Place['category']

// Icons only — labels are resolved via t() inside the component
const CHIP_DEFS: { key: CategoryKey; icon: React.ReactNode }[] = [
  { key: 'shelter',     icon: <ShelterIcon  width={14} height={14} stroke="currentColor" strokeWidth={1} aria-hidden /> },
  { key: 'toilet',      icon: <Toilet       size={14} strokeWidth={1} className="text-neutral-700" aria-hidden /> },
  { key: 'hospital',    icon: <Hospital     size={14} strokeWidth={1} aria-hidden /> },
  { key: 'restaurant',  icon: <Utensils     size={14} strokeWidth={1} aria-hidden /> },
  { key: 'landmark',    icon: <Landmark     size={14} strokeWidth={1} aria-hidden /> },
  { key: 'supermarket', icon: <ShoppingCart size={14} strokeWidth={1} aria-hidden /> },
  { key: 'park',        icon: <Trees        size={14} strokeWidth={1} aria-hidden /> },
  { key: 'bank',        icon: <Landmark     size={14} strokeWidth={1} aria-hidden /> },
  { key: 'pharmacy',    icon: <Pill         size={14} strokeWidth={1} className="text-neutral-700" aria-hidden /> },
]

// ── Bottom sheet snap positions ────────────────────────────────────────────

type SnapPoint = 'half' | 'full' | 'closed'

const SNAP: Record<SnapPoint, string> = {
  half:   'top-[45%]',
  full:   'top-[8%]',
  closed: 'top-[110%]',
}

// Numeric heights matching the CSS snap positions (1 - topFraction) * vh
const SNAP_HEIGHT: Record<SnapPoint, number> = {
  half:   window.innerHeight * 0.55,
  full:   window.innerHeight * 0.92,
  closed: 0,
}

// ── Screen ─────────────────────────────────────────────────────────────────

export const MapScreen: React.FC = () => {
  const navigate                          = useNavigate()
  const location                          = useLocation()
  const { t, i18n }                       = useTranslation()
  const lang                             = i18n.language
  const mapRef                            = useRef<MapRef>(null)
  const [searchQuery, setSearchQuery]    = useState('')
  const [searchActive, setSearchActive]  = useState(false)
  const [reviewMode, setReviewMode]      = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null)
  const [sheetSnap, setSheetSnap]        = useState<SnapPoint>('closed')
  const [sheetVisible, setSheetVisible]  = useState(false)
  const [sortSheetOpen, setSortSheetOpen] = useState(false)
  const [sortValue, setSortValue]        = useState<SortKey>('most-accessible')
  const [selectedPlaceForDetail, setSelectedPlaceForDetail] = useState<Place | null>(null)
  const [placeDetailOpen, setPlaceDetailOpen] = useState(false)
  const [routePlanningOpen, setRoutePlanningOpen] = useState(false)
  const [routeDestinationName, setRouteDestinationName] = useState('')
  const [routeSwapped, setRouteSwapped] = useState(false)
  const [routeDetailOpen, setRouteDetailOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [routeDetailSnapTop, setRouteDetailSnapTop] = useState<number | null>(null)
  const [activeNavigationOpen, setActiveNavigationOpen] = useState(false)
  const [navPanelHeight, setNavPanelHeight] = useState(0)
  const [routeEndedAt, setRouteEndedAt] = useState<{
    ts:            number
    placeId?:      string
    placeName?:    string
    placeNameUk?:  string
    address?:      string
    addressUk?:    string
    destinationName: string
  } | null>(null)
  const [routeMarkers, setRouteMarkers] = useState<{
    start: [number, number] | null
    end: [number, number] | null
  }>({ start: null, end: null })
  const dotIndexRef          = useRef(0)
  const dotMarkerRef         = useRef<mapboxgl.Marker | null>(null)
  const dotIntervalRef       = useRef<ReturnType<typeof setInterval> | null>(null)
  const handledLocationKey   = useRef<string | null>(null)
  const { filterState }                  = useFilterContext()

  // touch tracking refs
  const touchStartY  = useRef(0)
  const touchStartSnap = useRef<SnapPoint>('half')

  // ── Search handlers ───────────────────────────────────────────────
  const handleSearchFocus = () => {
    setSearchActive(true)
    closeSheet()
    setSelectedPlace(null)
  }

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    if (!val) {
      setSearchActive(false)
    }
  }

  const dismissSearch = () => {
    setSearchActive(false)
    setSearchQuery('')
  }

  // ── Sheet helpers ─────────────────────────────────────────────────
  const openSheet = (snap: SnapPoint = 'half') => {
    setSheetVisible(true)
    setSheetSnap(snap)
  }

  const closeSheet = () => {
    setSheetSnap('closed')
    setTimeout(() => {
      setSheetVisible(false)
      setActiveCategory(null)
      setSearchQuery('')
    }, 300)
  }

  // ── Chip click ────────────────────────────────────────────────────
  const handleChipClick = (key: CategoryKey) => {
    if (activeCategory === key) {
      closeSheet()
    } else {
      setActiveCategory(key)
      setSelectedPlace(null)
      openSheet('half')
    }
  }

  // ── Marker click ──────────────────────────────────────────────────
  const handleMarkerClick = (place: Place) => {
    const doFly = () => {
      setSelectedPlace(place)
      mapRef.current?.getMap().flyTo({
        center: place.coordinates,
        zoom: 16,
        duration: 600,
        offset: [0, -120],
      })
    }

    if (sheetVisible) {
      closeSheet()
      setTimeout(doFly, 150)
    } else {
      doFly()
    }
  }

  const handleClosePopup = () => setSelectedPlace(null)

  // ── Close popup if selected place is filtered out ─────────────────
  useEffect(() => {
    if (selectedPlace && !filterPlaces(PLACES, filterState).find(p => p.id === selectedPlace.id)) {
      setSelectedPlace(null)
    }
  }, [filterState, selectedPlace])

  // ── Restore search state when returning from FilterScreen ─────────
  // Uses location.key so re-fires on same-path navigations without double-triggering.
  useEffect(() => {
    if (location.key === handledLocationKey.current) return
    handledLocationKey.current = location.key
    if (location.state?.reviewMode) {
      setReviewMode(true)
      setSearchActive(true)
    }
    if (location.state?.returnToSearch) {
      setSearchActive(true)
    }
  }, [location.key, location.state])

  // ── Reset map padding on mount ───────────────────────────────────
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (map) {
      map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 })
    }
  }, [])

  // ── Route polyline overlay ────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map || !selectedRoute) return

    const addLayers = () => {
      selectedRoute.coordinates.segments.forEach((seg, i) => {
        const sourceId = `route-seg-${i}`
        const layerId  = `route-layer-${i}`

        if (map.getLayer(layerId))  map.removeLayer(layerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)

        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: seg.coords },
            properties: {},
          },
        })

        // Colours are hex strings required by Mapbox — Passage token equivalents noted inline
        const isTransport  = !['walk', 'car'].includes(seg.type)
        const hasBarriers  = seg.hasBarriers ?? false

        const color = isTransport
          ? '#361ecb'  // primary-500
          : hasBarriers
            ? '#f0a030' // warning-500
            : '#8b84e5' // primary-300

        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': 8, // same for all segment types
          },
        })
      })

      const allCoords = selectedRoute.coordinates.segments.flatMap(s => s.coords)
      const lngs = allCoords.map(c => c[0])
      const lats = allCoords.map(c => c[1])
      map.fitBounds(
        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
        {
          padding: { top: 100, bottom: 280, left: 60, right: 60 },
          duration: 800,
          maxZoom: 13,
        }
      )

      const allSegments = selectedRoute.coordinates.segments
      const startCoord = allSegments[0].coords[0]
      const lastSeg = allSegments[allSegments.length - 1]
      const endCoord = lastSeg.coords[lastSeg.coords.length - 1]
      setRouteMarkers({ start: startCoord, end: endCoord })
    }

    if (map.isStyleLoaded()) {
      addLayers()
    } else {
      map.once('load', addLayers)
    }

    return () => {
      // Remove route layers
      selectedRoute.coordinates.segments.forEach((_, i) => {
        const sourceId = `route-seg-${i}`
        const layerId  = `route-layer-${i}`
        if (map.getLayer(layerId))  map.removeLayer(layerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      })
      setRouteMarkers({ start: null, end: null })
      // CRITICAL: reset padding so marker flyTo works correctly after sheet closes
      map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 })
    }
  }, [selectedRoute])

  // ── Moving dot marker during active navigation ────────────────────
  useEffect(() => {
    const map = mapRef.current?.getMap()

    if (!activeNavigationOpen || !selectedRoute || !map) {
      if (dotIntervalRef.current) { clearInterval(dotIntervalRef.current); dotIntervalRef.current = null }
      dotMarkerRef.current?.remove(); dotMarkerRef.current = null
      dotIndexRef.current = 0
      return
    }

    const allCoords   = selectedRoute.coordinates.segments.flatMap(s => s.coords)
    const ARRIVAL_MS  = 13500
    const INTERVAL_MS = 300
    const totalTicks  = ARRIVAL_MS / INTERVAL_MS // 45 ticks

    // Build DOM element — inline styles used because this element is created at runtime
    const el   = document.createElement('div')
    el.style.cssText = 'position:relative;display:flex;align-items:center;justify-content:center;width:32px;height:32px'

    const ring = document.createElement('div')
    // primary-300 (#8b84e5) — Mapbox DOM element, Passage token unavailable at runtime
    ring.style.cssText = 'position:absolute;width:24px;height:24px;border-radius:9999px;background-color:#8b84e5;opacity:0.75;animation:ping 1s cubic-bezier(0,0,0.2,1) infinite'

    const dot  = document.createElement('div')
    // primary-500 (#361ecb) — Mapbox DOM element, Passage token unavailable at runtime
    dot.style.cssText  = 'width:16px;height:16px;border-radius:9999px;background-color:#361ecb;position:relative;z-index:10'

    el.appendChild(ring)
    el.appendChild(dot)

    dotIndexRef.current = 0
    const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat(allCoords[0])
      .addTo(map)
    dotMarkerRef.current = marker

    let tick = 0
    dotIntervalRef.current = setInterval(() => {
      tick = Math.min(tick + 1, totalTicks)
      // Map tick → coord index proportionally so the dot always takes exactly ARRIVAL_MS
      const idx = Math.floor((tick / totalTicks) * (allCoords.length - 1))
      dotIndexRef.current = idx
      dotMarkerRef.current?.setLngLat(allCoords[idx])
      if (tick >= totalTicks) {
        clearInterval(dotIntervalRef.current!)
        dotIntervalRef.current = null
      }
    }, INTERVAL_MS)

    return () => {
      if (dotIntervalRef.current) { clearInterval(dotIntervalRef.current); dotIntervalRef.current = null }
      dotMarkerRef.current?.remove(); dotMarkerRef.current = null
      dotIndexRef.current = 0
    }
  }, [activeNavigationOpen, selectedRoute])

  // ── Navigate to route review 2 s after arrival ───────────────────
  useEffect(() => {
    if (!routeEndedAt) return
    const timeout = setTimeout(() => {
      setActiveNavigationOpen(false)
      setSelectedRoute(null)
      navigate('/route-complete', {
        state: {
          distanceKm:      selectedRoute?.distanceKm,
          durationMin:     selectedRoute?.durationMin,
          placeId:         routeEndedAt.placeId,
          placeName:       routeEndedAt.placeName,
          placeNameUk:     routeEndedAt.placeNameUk,
          address:         routeEndedAt.address,
          addressUk:       routeEndedAt.addressUk,
          destinationName: routeEndedAt.destinationName,
        },
      })
      setRouteEndedAt(null)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [routeEndedAt])

  // Dismiss active overlay on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (searchActive) { dismissSearch(); return }
      if (selectedPlace && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen) { handleClosePopup(); return }
      if (sheetVisible && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen) { closeSheet() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchActive, selectedPlace, sheetVisible, placeDetailOpen, routePlanningOpen, routeDetailOpen])

  // ── Touch handlers ────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current    = e.touches[0].clientY
    touchStartSnap.current = sheetSnap
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientY - touchStartY.current
    const THRESHOLD = 80
    if (touchStartSnap.current === 'half') {
      if (delta < -THRESHOLD) setSheetSnap('full')
      else if (delta > THRESHOLD) closeSheet()
    } else if (touchStartSnap.current === 'full') {
      if (delta > THRESHOLD) setSheetSnap('half')
    }
  }

  // ── i18n-derived values ───────────────────────────────────────────
  const chips = CHIP_DEFS.map(({ key, icon }) => ({
    key,
    label: t(`map.categories.${key}`),
    icon,
  }))

  const sortOptions = SORT_KEYS.map(key => ({
    key,
    label: t(`sort.${key}`),
  }))

  // ── Filtered / search places ──────────────────────────────────────
  const filteredPlaces = activeCategory ? PLACES.filter(p => p.category === activeCategory) : []
  const displayPlaces  = sortPlaces(filterPlaces(filteredPlaces, filterState), sortValue)
  const rawSearchResults = searchPlaces(filterPlaces(PLACES, filterState), searchQuery)
  const searchResults    = reviewMode && !searchQuery.trim()
    ? sortPlaces(rawSearchResults, 'nearest')
    : rawSearchResults

  const sheetTitle     = chips.find(c => c.key === activeCategory)?.label ?? ''
  const sortLabel      = sortOptions.find(o => o.key === sortValue)?.label ?? sortValue

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <h1 className="sr-only">{reviewMode ? t('placeDetail.leaveReview') : t('map.search')}</h1>

      {/* ── Search mode background (non-reviewMode only) ───────────── */}
      {searchActive && !reviewMode && (
        <>
          <div className="fixed inset-0 z-[8] bg-neutral-50" />
          <div
            aria-hidden="true"
            className="fixed inset-0 z-[9]"
            onClick={dismissSearch}
          />
        </>
      )}

      {/* ── Full-screen Mapbox map ───────────────────────────────────── */}
      {!searchActive && (
        <Map
          ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={{ longitude: 30.5234, latitude: 50.4501, zoom: 14 }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          onClick={() => { if (sheetVisible) closeSheet() }}
        >
          {!routeDetailOpen && !activeNavigationOpen && filterPlaces(PLACES, filterState).map(place => (
            <Marker
              key={place.id}
              longitude={place.coordinates[0]}
              latitude={place.coordinates[1]}
              anchor="center"
              onClick={e => { e.originalEvent.stopPropagation(); handleMarkerClick(place) }}
            >
              <PlaceMarker place={place} selected={selectedPlace?.id === place.id} />
            </Marker>
          ))}

          {selectedRoute && routeMarkers.start && (
            <Marker
              longitude={routeMarkers.start[0]}
              latitude={routeMarkers.start[1]}
              anchor="center"
            >
              <img
                src="/src/assets/icons/starting-point-icon.svg"
                alt={t('map.startMarker')}
                className="w-[24px] h-[24px]"
              />
            </Marker>
          )}

          {selectedRoute && routeMarkers.end && (
            <Marker
              longitude={routeMarkers.end[0]}
              latitude={routeMarkers.end[1]}
              anchor="center"
            >
              <img
                src="/src/assets/icons/end-point-icon.svg"
                alt={t('map.endMarker')}
                className="w-[24px] h-[24px]"
              />
            </Marker>
          )}

        </Map>
      )}

      {/* ── Search / route destination bar ──────────────────────────── */}
      {routePlanningOpen && !routeDetailOpen ? (
        <div className="absolute top-[56px] left-[24px] right-[24px] z-[20]">
          <RouteDestination
            from={routeSwapped ? routeDestinationName : t('map.currentLocation')}
            to={routeSwapped ? t('map.currentLocation') : routeDestinationName}
            onFromChange={() => {}}
            onToChange={() => {}}
            onSwap={() => setRouteSwapped(prev => !prev)}
          />
        </div>
      ) : (
        <>
          {/* ── Search + filter bar + chips — hidden during active navigation */}
          {!activeNavigationOpen && (
            <>
              {/* ── Search + filter bar (non-reviewMode) ────────────── */}
              {!reviewMode && (
                <div className="absolute top-[56px] left-lg right-lg z-[10]">
                  <div className="flex items-center gap-xs">
                    <div className="flex-1">
                      <SearchBar
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                        placeholder={t('map.search')}
                        leftSlot={searchActive ? (
                          <button
                            onClick={() => {
                              setSearchQuery('')
                              setSearchActive(false)
                            }}
                            className="shrink-0 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                            aria-label={t('map.backToMap')}
                          >
                            <ChevronLeft size={24} strokeWidth={1.5} className="text-neutral-500" />
                          </button>
                        ) : undefined}
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
                      aria-label={t('map.filterButton')}
                      onClick={() => navigate('/filter', { state: { from: searchActive ? 'search' : 'map', reviewMode: reviewMode } })}
                    >
                      <Funnel size={20} strokeWidth={1.5} aria-hidden />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Category chips ───────────────────────────────────── */}
              {!searchActive && !placeDetailOpen && (
                <div className="absolute top-[124px] left-lg right-0 z-10 flex flex-row flex-nowrap gap-xs overflow-x-auto [&::-webkit-scrollbar]:hidden">
                  {chips.map(({ key, label, icon }) => {
                    const active = activeCategory === key
                    return (
                      <Chip
                        key={key}
                        size="md"
                        label={label}
                        variant={active ? 'active' : 'neutral'}
                        className="shrink-0 cursor-pointer"
                        icon={React.cloneElement(icon as React.ReactElement, {
                          className: active ? 'text-neutral-0' : 'text-neutral-700',
                        })}
                        onClick={() => handleChipClick(key)}
                      />
                    )
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── Search results (non-reviewMode) ─────────────────────────── */}
      {searchActive && !reviewMode && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events -- propagation stopper only, not an interactive control
        <div
          className="absolute top-[136px] left-lg right-lg z-[10] overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 224px)' }}
          onClick={e => e.stopPropagation()}
        >
          {searchResults.length === 0 && searchQuery.trim() ? (
            <div className="flex flex-col items-center justify-center pt-2xl gap-xs">
              <p className="text-heading-sm text-neutral-900">{t('map.noResultsTitle')}</p>
              <p className="text-body-sm text-neutral-500 text-center">
                {t('map.noResultsSubtitle')}
              </p>
            </div>
          ) : (
            searchResults.map((place, idx) => (
              <React.Fragment key={place.id}>
                <PlaceListItem
                  name={getLocalizedField(place, 'name', lang)}
                  address={getLocalizedField(place, 'address', lang)}
                  distance={formatDistance(place.distanceM, lang)}
                  accessibilityScore={place.accessibilityScore}
                  category={place.category}
                  verifiedAt={place.verifiedAt}
                  isLiftDependent={place.isLiftDependent}
                  onPress={() => {
                    if (reviewMode) {
                      navigate('/review', {
                        state: {
                          placeId: place.id,
                          placeName: getLocalizedField(place, 'name', lang),
                          address: getLocalizedField(place, 'address', lang),
                        },
                      })
                    } else {
                      setSearchQuery(getLocalizedField(place, 'name', lang))
                      setSearchActive(false)
                      mapRef.current?.getMap().flyTo({
                        center: place.coordinates,
                        zoom: 16,
                        offset: [0, -80],
                      })
                      setSelectedPlaceForDetail(place)
                      setPlaceDetailOpen(true)
                    }
                  }}
                />
                {idx < searchResults.length - 1 && (
                  <div className="py-md">
                    <Divider />
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      )}

      {/* ── Review-mode full-page overlay ───────────────────────────── */}
      {searchActive && reviewMode && (
        <div className="fixed inset-0 z-[10] bg-neutral-50 flex flex-col px-lg pt-xl overflow-hidden">
          {/* Back */}
          <Button variant="back" label={t('common.back')} onClick={() => { setReviewMode(false); setSearchActive(false); setSearchQuery(''); navigate('/map', { replace: true }) }} />

          {/* Heading */}
          <h2 className="text-display-md text-neutral-900 mt-lg">
            {t('placeDetail.leaveReview')}
          </h2>

          {/* Search bar + filter */}
          <div className="flex items-center gap-xs mt-md">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder={t('map.search')}
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
              aria-label={t('map.filterButton')}
              onClick={() => navigate('/filter', { state: { from: 'search', reviewMode: reviewMode } })}
            >
              <Funnel size={20} strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto mt-md">
            {searchResults.length === 0 && searchQuery.trim() ? (
              <div className="flex flex-col items-center justify-center pt-2xl gap-xs">
                <p className="text-heading-sm text-neutral-900">{t('map.noResultsTitle')}</p>
                <p className="text-body-sm text-neutral-500 text-center">
                  {t('map.noResultsSubtitle')}
                </p>
              </div>
            ) : (
              searchResults.map((place, idx) => (
                <React.Fragment key={place.id}>
                  <PlaceListItem
                    name={getLocalizedField(place, 'name', lang)}
                    address={getLocalizedField(place, 'address', lang)}
                    distance={formatDistance(place.distanceM, lang)}
                    accessibilityScore={place.accessibilityScore}
                    category={place.category}
                    verifiedAt={place.verifiedAt}
                    isLiftDependent={place.isLiftDependent}
                    onPress={() => navigate('/review', {
                      state: {
                        placeId: place.id,
                        placeName: getLocalizedField(place, 'name', lang),
                        address: getLocalizedField(place, 'address', lang),
                      },
                    })}
                  />
                  {idx < searchResults.length - 1 && (
                    <div className="py-md">
                      <Divider />
                    </div>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Bottom sheet backdrop ───────────────────────────────────── */}
      {sheetVisible && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[45] bg-transparent"
          onClick={() => closeSheet()}
        />
      )}

      {/* ── Bottom sheet ────────────────────────────────────────────── */}
      {sheetVisible && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen && (
        <div
          className={[
            'fixed left-0 right-0 bottom-0 z-[50]',
            'bg-neutral-0 rounded-tl-[48px] rounded-tr-[48px] shadow-2xl',
            'flex flex-col',
            'transition-all duration-300 ease-out',
            SNAP[sheetSnap],
          ].join(' ')}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Drag handle */}
          <div className="flex justify-center py-lg shrink-0">
            <div className="w-[40px] h-[3px] bg-neutral-400 rounded-full" />
          </div>

          {/* Sheet header */}
          <div className="px-lg flex flex-col gap-sm shrink-0">
            <span className="text-display-md text-neutral-900">{sheetTitle}</span>
            <SortControl value={sortLabel} onPress={() => setSortSheetOpen(true)} />
          </div>

          {/* Place list */}
          <div className="overflow-y-auto flex-1 pb-[144px] px-lg mt-[34px]">
            {displayPlaces.length === 0 ? (
              <p className="py-xl text-body-md text-neutral-500">{t('map.noPlacesFound')}</p>
            ) : (
              displayPlaces.map((place, idx) => (
                <React.Fragment key={place.id}>
                  <PlaceListItem
                    name={getLocalizedField(place, 'name', lang)}
                    address={getLocalizedField(place, 'address', lang)}
                    distance={formatDistance(place.distanceM, lang)}
                    accessibilityScore={place.accessibilityScore}
                    category={place.category}
                    verifiedAt={place.verifiedAt}
                    isLiftDependent={place.isLiftDependent}
                  onPress={() => {
                    setSelectedPlaceForDetail(place)
                    setPlaceDetailOpen(true)
                  }}
                  />
                  {idx < displayPlaces.length - 1 && (
                    <div className="py-md">
                      <Divider />
                    </div>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Popup backdrop ──────────────────────────────────────────── */}
      {selectedPlace && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[55] bg-transparent"
          onClick={handleClosePopup}
        />
      )}

      {/* ── Place popup card ────────────────────────────────────────── */}
      <PlacePopupCard
        visible={!!selectedPlace && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen}
        name={selectedPlace ? getLocalizedField(selectedPlace, 'name', lang) : ''}
        address={selectedPlace ? getLocalizedField(selectedPlace, 'address', lang) : ''}
        distance={selectedPlace ? formatDistance(selectedPlace.distanceM, lang) : ''}
        barrierCount={selectedPlace?.barrierCount ?? 0}
        accessibilityScore={selectedPlace?.accessibilityScore ?? 0}
        accessibilityVariant={getAccessibilityVariant(selectedPlace?.accessibilityScore ?? 0)}
        scoreVariant={scoreVariant(selectedPlace?.accessibilityScore ?? 0)}
        categoryIcon={selectedPlace ? getCategoryIcon(selectedPlace.category, 12) : undefined}
        coverPhoto={selectedPlace?.sections?.entrance?.photos?.[0]?.src}
        onClose={handleClosePopup}
        onCardClick={() => {
          if (selectedPlace) {
            setSelectedPlaceForDetail(selectedPlace)
            setPlaceDetailOpen(true)
          }
        }}
        onRoute={() => {
          if (selectedPlace) {
            setRouteDestinationName(getLocalizedField(selectedPlace, 'name', lang))
            setRoutePlanningOpen(true)
          }
        }}
        onBookmark={() => console.log('save')}
        onShare={() => console.log('share')}
      />

      {/* ── NavBar ──────────────────────────────────────────────────── */}
      {!activeNavigationOpen && (
        <div className="absolute bottom-lg left-lg right-lg z-40">
          <NavBar activeTab="map" onTabChange={(tab) => navigate('/' + tab)} reviewActive={reviewMode} />
        </div>
      )}

      {/* ── Sort sheet ──────────────────────────────────────────────── */}
      <SortSheet
        isOpen={sortSheetOpen && !activeNavigationOpen}
        options={sortOptions}
        value={sortValue}
        onChange={(key) => setSortValue(key as SortKey)}
        onClose={() => setSortSheetOpen(false)}
        height={SNAP_HEIGHT[sheetSnap]}
      />

      {/* ── Place detail sheet ──────────────────────────────────────── */}
      <PlaceDetailSheet
        place={selectedPlaceForDetail}
        isOpen={placeDetailOpen && !routePlanningOpen && !activeNavigationOpen}
        onClose={() => {
          setPlaceDetailOpen(false)
          setSelectedPlaceForDetail(null)
        }}
        onBuildRoute={(name) => {
          setRouteDestinationName(name)
          setRoutePlanningOpen(true)
        }}
      />

      {/* ── Route planning sheet ────────────────────────────────────── */}
      <RoutePlanningSheet
        isOpen={routePlanningOpen && !routeDetailOpen && !activeNavigationOpen}
        destinationName={routeDestinationName}
        onClose={() => {
          setRoutePlanningOpen(false)
          setRouteDestinationName('')
          setRouteSwapped(false)
        }}
        onRouteSelect={(route) => {
          setSelectedRoute(route)
          setRouteDetailOpen(true)
        }}
        overrideTop={routeDetailOpen ? routeDetailSnapTop : null}
        maxHeight={activeNavigationOpen ? navPanelHeight : undefined}
      />

      {/* ── Route detail sheet ──────────────────────────────────────── */}
      <RouteDetailSheet
        isOpen={routeDetailOpen && !activeNavigationOpen}
        route={selectedRoute}
        destinationName={routeDestinationName}
        onClose={() => {
          setRouteDetailOpen(false)
          setSelectedRoute(null)
        }}
        onSnapChange={(top) => setRouteDetailSnapTop(top)}
        onStartRoute={() => setActiveNavigationOpen(true)}
        maxHeight={activeNavigationOpen ? navPanelHeight : undefined}
      />

      {/* ── Active navigation sheet ──────────────────────────────────── */}
      <ActiveNavigationSheet
        isOpen={activeNavigationOpen}
        route={selectedRoute}
        destinationName={routeDestinationName}
        onClose={() => setActiveNavigationOpen(false)}
        onNavStateChange={(state) => {
          if (state === 'arrived') {
            const arrivedPlaceId      = selectedPlace?.id
            const arrivedPlaceName    = selectedPlace?.name
            const arrivedPlaceNameUk  = selectedPlace?.nameUk
            const arrivedAddress      = selectedPlace?.address
            const arrivedAddressUk    = selectedPlace?.addressUk
            setRouteDetailOpen(false)
            setRoutePlanningOpen(false)
            setPlaceDetailOpen(false)
            setSelectedPlace(null)
            closeSheet()
            setRouteEndedAt({
              ts:            Date.now(),
              placeId:       arrivedPlaceId,
              placeName:     arrivedPlaceName,
              placeNameUk:   arrivedPlaceNameUk,
              address:       arrivedAddress,
              addressUk:     arrivedAddressUk,
              destinationName: routeDestinationName,
            })
          }
        }}
        onPanelHeightChange={setNavPanelHeight}
      />

    </main>
  )
}
