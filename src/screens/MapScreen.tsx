import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Map, { Marker } from 'react-map-gl/mapbox'
import type { MapRef } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Funnel, Hospital, Utensils, Landmark, ShoppingCart, Trees, Toilet, Pill, ChevronLeft } from 'lucide-react'
import ShelterIcon from '../assets/icons/shelter.svg?react'
import { getCategoryIcon } from '../utils/categoryIcon'
import type { FilterState } from '../context/FilterContext'
import { useFilterContext } from '../context/FilterContext'
import {
  SearchBar, Chip, AccessibilityBadge, NavBar,
  PlaceListItem, SortControl, Divider, PlacePopupCard, SortSheet,
  PlaceDetailSheet, RoutePlanningSheet, RouteDestination, RouteDetailSheet,
} from '../components'
import type { Route } from '../components'

// ── Types & data ───────────────────────────────────────────────────────────

export type Place = {
  id: string
  name: string
  address: string
  category: 'hospital' | 'restaurant' | 'landmark' | 'shelter' | 'supermarket' | 'park' | 'bank' | 'toilet' | 'pharmacy'
  coordinates: [number, number]
  accessibilityScore: number
  barrierCount: number
  distance: string
  verifiedAt: Date
  isLiftDependent: boolean
}

export const PLACES: Place[] = [
  // Shelters
  { id: 's1',  name: 'Shelter Maidan',                   address: 'Maidan Nezalezhnosti 1',          category: 'shelter',     coordinates: [30.5234, 50.4504], accessibilityScore: 80, barrierCount: 1, distance: '200 m',  verifiedAt: new Date('2026-06-05T18:00:00'), isLiftDependent: false },
  { id: 's2',  name: 'Shelter Lukyanivska',               address: 'vul. Oleny Telihy 3',             category: 'shelter',     coordinates: [30.4986, 50.4612], accessibilityScore: 50, barrierCount: 3, distance: '2.1 km', verifiedAt: new Date('2026-05-22T09:00:00'), isLiftDependent: false },
  { id: 's3',  name: 'Shelter Pechersk',                  address: 'vul. Lavrska 15',                 category: 'shelter',     coordinates: [30.5574, 50.4338], accessibilityScore: 65, barrierCount: 2, distance: '1.8 km', verifiedAt: new Date('2026-04-11T13:00:00'), isLiftDependent: false },
  { id: 's4',  name: 'Shelter Podil',                     address: 'vul. Sahaidachnoho 10',           category: 'shelter',     coordinates: [30.5189, 50.4634], accessibilityScore: 72, barrierCount: 2, distance: '1.5 km', verifiedAt: new Date('2026-06-03T10:00:00'), isLiftDependent: false },
  { id: 's5',  name: 'Shelter Obolon',                    address: 'prosp. Obolonsky 1',              category: 'shelter',     coordinates: [30.4978, 50.5012], accessibilityScore: 88, barrierCount: 0, distance: '3.2 km', verifiedAt: new Date('2026-02-27T08:00:00'), isLiftDependent: false },
  { id: 's6',  name: 'Shelter Sviatoshyn',                address: 'vul. Peremohy 90',                category: 'shelter',     coordinates: [30.3912, 50.4567], accessibilityScore: 45, barrierCount: 4, distance: '4.1 km', verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  // Hospitals
  { id: 'h1',  name: 'Pharmacy Liky',                     address: 'vul. Khreschyatyk 22',            category: 'hospital',    coordinates: [30.5238, 50.4494], accessibilityScore: 90, barrierCount: 0, distance: '300 m',  verifiedAt: new Date('2026-06-04T09:00:00'), isLiftDependent: false },
  { id: 'h2',  name: 'Oleksandrivska Hospital',           address: 'bulv. Tarasa Shevchenka 17',      category: 'hospital',    coordinates: [30.5106, 50.4478], accessibilityScore: 55, barrierCount: 4, distance: '1.1 km', verifiedAt: new Date('2026-03-18T11:00:00'), isLiftDependent: true  },
  { id: 'h3',  name: 'Kyiv City Clinical Hospital 1',     address: 'vul. Heroyiv Dnipra 37',          category: 'hospital',    coordinates: [30.4889, 50.5023], accessibilityScore: 62, barrierCount: 3, distance: '3.5 km', verifiedAt: new Date('2026-05-05T11:00:00'), isLiftDependent: true  },
  { id: 'h4',  name: 'Pharmacy 911',                      address: 'vul. Baseyna 12',                 category: 'hospital',    coordinates: [30.5201, 50.4445], accessibilityScore: 85, barrierCount: 1, distance: '800 m',  verifiedAt: new Date('2026-05-29T14:00:00'), isLiftDependent: false },
  { id: 'h5',  name: 'Dobrobut Clinic',                   address: 'vul. Velyka Vasylkivska 55',      category: 'hospital',    coordinates: [30.5178, 50.4356], accessibilityScore: 91, barrierCount: 0, distance: '1.6 km', verifiedAt: new Date('2026-04-30T10:00:00'), isLiftDependent: true  },
  { id: 'h6',  name: 'Pharmacy D.S.',                     address: 'prosp. Peremohy 12',              category: 'hospital',    coordinates: [30.4934, 50.4521], accessibilityScore: 70, barrierCount: 2, distance: '2.0 km', verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  // Restaurants / Cafés
  { id: 'r1',  name: 'Puzata Hata',                       address: 'vul. Baseyna 5',                  category: 'restaurant',  coordinates: [30.5189, 50.4432], accessibilityScore: 60, barrierCount: 3, distance: '800 m',  verifiedAt: new Date('2026-05-29T14:00:00'), isLiftDependent: false },
  { id: 'r2',  name: 'Veterano Pizza',                    address: 'vul. Horodetskoho 10',            category: 'restaurant',  coordinates: [30.5271, 50.4468], accessibilityScore: 75, barrierCount: 1, distance: '600 m',  verifiedAt: new Date('2026-06-03T10:00:00'), isLiftDependent: false },
  { id: 'r3',  name: 'Zhyva Kava',                        address: 'vul. Velyka Vasylkivska 45',      category: 'restaurant',  coordinates: [30.5223, 50.4385], accessibilityScore: 65, barrierCount: 2, distance: '1.4 km', verifiedAt: new Date('2026-02-27T08:00:00'), isLiftDependent: false },
  { id: 'r4',  name: 'Kanapa Restaurant',                 address: 'vul. Andriivsky Uzviz 19',        category: 'restaurant',  coordinates: [30.5134, 50.4589], accessibilityScore: 42, barrierCount: 5, distance: '1.9 km', verifiedAt: new Date('2026-05-22T09:00:00'), isLiftDependent: true  },
  { id: 'r5',  name: 'Pervak',                            address: 'vul. Rohnidynska 2',              category: 'restaurant',  coordinates: [30.5156, 50.4423], accessibilityScore: 78, barrierCount: 1, distance: '1.0 km', verifiedAt: new Date('2026-04-11T13:00:00'), isLiftDependent: false },
  { id: 'r6',  name: 'Spotykach',                         address: 'vul. Volodymyrska 16',            category: 'restaurant',  coordinates: [30.5145, 50.4534], accessibilityScore: 35, barrierCount: 6, distance: '1.3 km', verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  // Landmarks / Museums
  { id: 'l1',  name: 'Kyiv City Museum',                  address: 'vul. Khreschyatyk 15',            category: 'landmark',    coordinates: [30.5214, 50.4501], accessibilityScore: 70, barrierCount: 2, distance: '500 m',  verifiedAt: new Date('2026-06-05T18:00:00'), isLiftDependent: false },
  { id: 'l2',  name: 'National Museum of History',        address: 'vul. Volodymyrska 2',             category: 'landmark',    coordinates: [30.5136, 50.4547], accessibilityScore: 45, barrierCount: 5, distance: '1.3 km', verifiedAt: new Date('2026-03-18T11:00:00'), isLiftDependent: true  },
  { id: 'l3',  name: 'Pinchuk Art Centre',                address: 'vul. Velyka Vasylkivska 1',       category: 'landmark',    coordinates: [30.5241, 50.4447], accessibilityScore: 85, barrierCount: 1, distance: '900 m',  verifiedAt: new Date('2026-05-05T11:00:00'), isLiftDependent: true  },
  { id: 'l4',  name: 'Museum of Western & Oriental Art',  address: 'vul. Tereshchenkivska 15',        category: 'landmark',    coordinates: [30.5123, 50.4456], accessibilityScore: 38, barrierCount: 6, distance: '1.1 km', verifiedAt: new Date('2026-02-27T08:00:00'), isLiftDependent: true  },
  { id: 'l5',  name: 'Mystetskyi Arsenal',                address: 'vul. Lavrska 10-12',              category: 'landmark',    coordinates: [30.5534, 50.4367], accessibilityScore: 82, barrierCount: 1, distance: '2.2 km', verifiedAt: new Date('2026-04-30T10:00:00'), isLiftDependent: true  },
  { id: 'l6',  name: 'National Art Museum',               address: 'vul. Hrushevskoho 6',             category: 'landmark',    coordinates: [30.5312, 50.4478], accessibilityScore: 58, barrierCount: 3, distance: '1.0 km', verifiedAt: new Date('2026-05-22T09:00:00'), isLiftDependent: true  },
  // Supermarkets
  { id: 'sm1', name: 'Silpo Khreschyatyk',                address: 'vul. Khreschyatyk 44',            category: 'supermarket', coordinates: [30.5198, 50.4471], accessibilityScore: 88, barrierCount: 0, distance: '700 m',  verifiedAt: new Date('2026-06-04T09:00:00'), isLiftDependent: true  },
  { id: 'sm2', name: 'Novus Lukyanivska',                  address: 'vul. Turhenievska 38',            category: 'supermarket', coordinates: [30.5012, 50.4598], accessibilityScore: 72, barrierCount: 2, distance: '1.9 km', verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  { id: 'sm3', name: 'ATB Podil',                          address: 'vul. Sahaidachnoho 25',           category: 'supermarket', coordinates: [30.5201, 50.4645], accessibilityScore: 55, barrierCount: 3, distance: '2.0 km', verifiedAt: new Date('2026-05-29T14:00:00'), isLiftDependent: false },
  { id: 'sm4', name: 'Fora Pechersk',                      address: 'vul. Instytutska 18',             category: 'supermarket', coordinates: [30.5389, 50.4423], accessibilityScore: 80, barrierCount: 1, distance: '1.5 km', verifiedAt: new Date('2026-03-18T11:00:00'), isLiftDependent: true  },
  { id: 'sm5', name: 'Metro Cash & Carry',                 address: 'vul. Akademika Palladin 44',      category: 'supermarket', coordinates: [30.4312, 50.4234], accessibilityScore: 91, barrierCount: 0, distance: '5.1 km', verifiedAt: new Date('2026-04-11T13:00:00'), isLiftDependent: false },
  { id: 'sm6', name: 'Velika Kyshenya',                    address: 'prosp. Peremohy 34',              category: 'supermarket', coordinates: [30.4756, 50.4512], accessibilityScore: 63, barrierCount: 3, distance: '2.8 km', verifiedAt: new Date('2026-02-27T08:00:00'), isLiftDependent: true  },
  // Parks
  { id: 'p1',  name: 'Shevchenko Park',                    address: 'bulv. Tarasa Shevchenka 1',       category: 'park',        coordinates: [30.5134, 50.4453], accessibilityScore: 78, barrierCount: 2, distance: '1.0 km', verifiedAt: new Date('2026-06-03T10:00:00'), isLiftDependent: false },
  { id: 'p2',  name: 'Mariinsky Park',                     address: 'vul. Hrushevskoho 5',             category: 'park',        coordinates: [30.5385, 50.4489], accessibilityScore: 62, barrierCount: 3, distance: '1.6 km', verifiedAt: new Date('2026-05-05T11:00:00'), isLiftDependent: false },
  { id: 'p3',  name: 'Hydropark',                          address: 'Hydropark Island',                category: 'park',        coordinates: [30.5912, 50.4634], accessibilityScore: 48, barrierCount: 4, distance: '3.8 km', verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  { id: 'p4',  name: 'Feofania Park',                      address: 'vul. Akademika Zabolotnoho 21',   category: 'park',        coordinates: [30.4823, 50.3934], accessibilityScore: 55, barrierCount: 3, distance: '6.2 km', verifiedAt: new Date('2026-03-18T11:00:00'), isLiftDependent: false },
  { id: 'p5',  name: 'Syretsky Park',                      address: 'vul. Syretska 1',                 category: 'park',        coordinates: [30.4923, 50.4812], accessibilityScore: 83, barrierCount: 1, distance: '2.9 km', verifiedAt: new Date('2026-05-22T09:00:00'), isLiftDependent: false },
  { id: 'p6',  name: 'Babyn Yar Park',                     address: 'vul. Melnikova 44',               category: 'park',        coordinates: [30.4489, 50.4712], accessibilityScore: 70, barrierCount: 2, distance: '3.5 km', verifiedAt: new Date('2026-04-30T10:00:00'), isLiftDependent: false },
  // Banks
  { id: 'b1',  name: 'PrivatBank Central',                 address: 'vul. Hrushevskoho 1d',            category: 'bank',        coordinates: [30.5301, 50.4512], accessibilityScore: 83, barrierCount: 1, distance: '400 m',  verifiedAt: new Date('2026-06-05T18:00:00'), isLiftDependent: false },
  { id: 'b2',  name: 'Oschadbank Maidan',                  address: 'Maidan Nezalezhnosti 2',          category: 'bank',        coordinates: [30.5223, 50.4502], accessibilityScore: 75, barrierCount: 2, distance: '250 m',  verifiedAt: new Date('2026-05-29T14:00:00'), isLiftDependent: false },
  { id: 'b3',  name: 'Monobank Office',                    address: 'vul. Baseyna 7',                  category: 'bank',        coordinates: [30.5189, 50.4441], accessibilityScore: 92, barrierCount: 0, distance: '850 m',  verifiedAt: new Date('2026-04-11T13:00:00'), isLiftDependent: false },
  { id: 'b4',  name: 'Raiffeisen Bank',                    address: 'vul. Lesi Ukrainky 9',            category: 'bank',        coordinates: [30.5423, 50.4378], accessibilityScore: 68, barrierCount: 2, distance: '1.7 km', verifiedAt: new Date('2026-02-27T08:00:00'), isLiftDependent: true  },
  { id: 'b5',  name: 'PUMB Bank',                          address: 'vul. Volodymyrska 48',            category: 'bank',        coordinates: [30.5112, 50.4512], accessibilityScore: 55, barrierCount: 3, distance: '1.2 km', verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  { id: 'b6',  name: 'Ukrsibbank',                         address: 'prosp. Peremohy 22',              category: 'bank',        coordinates: [30.4845, 50.4523], accessibilityScore: 78, barrierCount: 1, distance: '2.3 km', verifiedAt: new Date('2026-05-05T11:00:00'), isLiftDependent: false },
  // Toilets
  { id: 't1',  name: 'Public Toilet Maidan',               address: 'Maidan Nezalezhnosti',            category: 'toilet',      coordinates: [30.5221, 50.4503], accessibilityScore: 85, barrierCount: 1, distance: '150 m',  verifiedAt: new Date('2026-06-04T09:00:00'), isLiftDependent: false },
  { id: 't2',  name: 'Public Toilet Shevchenko Park',      address: 'bulv. Tarasa Shevchenka',         category: 'toilet',      coordinates: [30.5129, 50.4461], accessibilityScore: 82, barrierCount: 1, distance: '1.1 km', verifiedAt: new Date('2026-05-22T09:00:00'), isLiftDependent: false },
  { id: 't3',  name: 'Public Toilet Besarabska',           address: 'Besarabska pl. 1',                category: 'toilet',      coordinates: [30.5201, 50.4445], accessibilityScore: 55, barrierCount: 3, distance: '800 m',  verifiedAt: new Date('2026-03-18T11:00:00'), isLiftDependent: false },
  { id: 't4',  name: 'Public Toilet Podil',                address: 'Kontraktova pl. 4',               category: 'toilet',      coordinates: [30.5167, 50.4634], accessibilityScore: 40, barrierCount: 4, distance: '2.0 km', verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  { id: 't5',  name: 'Public Toilet Olimpiyska',           address: 'vul. Velyka Vasylkivska 55',      category: 'toilet',      coordinates: [30.5212, 50.4334], accessibilityScore: 35, barrierCount: 5, distance: '1.8 km', verifiedAt: new Date('2026-04-30T10:00:00'), isLiftDependent: false },
  // Pharmacies
  { id: 'ph1', name: 'Pharmacy Liky Plus',                 address: 'vul. Baseyna 14',                 category: 'pharmacy',    coordinates: [30.5195, 50.4442], accessibilityScore: 92, barrierCount: 0, distance: '750 m',  verifiedAt: new Date('2026-06-03T10:00:00'), isLiftDependent: false },
  { id: 'ph2', name: 'Apteka Dobrogo Dnya',                address: 'vul. Khreschyatyk 30',            category: 'pharmacy',    coordinates: [30.5229, 50.4488], accessibilityScore: 88, barrierCount: 0, distance: '400 m',  verifiedAt: new Date('2026-05-29T14:00:00'), isLiftDependent: false },
  { id: 'ph3', name: 'Pharmacy 36.6',                      address: 'vul. Volodymyrska 20',            category: 'pharmacy',    coordinates: [30.5141, 50.4523], accessibilityScore: 63, barrierCount: 2, distance: '1.2 km', verifiedAt: new Date('2026-04-11T13:00:00'), isLiftDependent: false },
  { id: 'ph4', name: 'Tabletka Pharmacy',                  address: 'prosp. Peremohy 18',              category: 'pharmacy',    coordinates: [30.4912, 50.4534], accessibilityScore: 48, barrierCount: 4, distance: '2.6 km', verifiedAt: new Date('2026-02-27T08:00:00'), isLiftDependent: false },
  { id: 'ph5', name: 'D.S. Pharmacy Pechersk',             address: 'vul. Lavrska 8',                  category: 'pharmacy',    coordinates: [30.5512, 50.4356], accessibilityScore: 71, barrierCount: 2, distance: '2.1 km', verifiedAt: new Date('2026-05-05T11:00:00'), isLiftDependent: false },
]

// ── Sort helper ────────────────────────────────────────────────────────────

function parseDistanceToMetres(distance: string): number {
  const value = parseFloat(distance)
  if (distance.toLowerCase().includes('km')) {
    return value * 1000
  }
  return value
}

function sortPlaces(places: Place[], sortValue: string): Place[] {
  const sorted = [...places]
  switch (sortValue) {
    case 'Most accessible first':
      return sorted.sort((a, b) => b.accessibilityScore - a.accessibilityScore)
    case 'Nearest first':
      return sorted.sort((a, b) => parseDistanceToMetres(a.distance) - parseDistanceToMetres(b.distance))
    case 'Recently verified':
      return sorted.sort((a, b) => b.verifiedAt.getTime() - a.verifiedAt.getTime())
    default:
      return sorted
  }
}

// ── Filter helper ──────────────────────────────────────────────────────────

function filterPlaces(places: Place[], filter: FilterState): Place[] {
  return places.filter((place) => {
    const variant = getAccessibilityVariant(place.accessibilityScore)
    if (!filter.accessibility.has(variant)) return false
    // avoidLifts and hasCompanion: wired to state, filtering logic pending place-level data
    return true
  })
}

// ── Search helper ─────────────────────────────────────────────────────────

function searchPlaces(places: Place[], query: string): Place[] {
  if (!query.trim()) return places
  const q = query.toLowerCase()
  const nameMatches = places.filter(p => p.name.toLowerCase().includes(q))
  const addressOnlyMatches = places.filter(
    p => !p.name.toLowerCase().includes(q) && p.address.toLowerCase().includes(q)
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

const CHIPS: { key: CategoryKey; label: string; icon: React.ReactNode }[] = [
  { key: 'shelter',     label: 'Shelter',     icon: <ShelterIcon  width={14} height={14} stroke="currentColor" strokeWidth={1} aria-hidden /> },
  { key: 'toilet',     label: 'Toilet',      icon: <Toilet       size={14} strokeWidth={1} className="text-neutral-700" aria-hidden /> },
  { key: 'hospital',   label: 'Hospital',    icon: <Hospital     size={14} strokeWidth={1} aria-hidden /> },
  { key: 'restaurant', label: 'Restaurant',  icon: <Utensils     size={14} strokeWidth={1} aria-hidden /> },
  { key: 'landmark',   label: 'Landmark',    icon: <Landmark     size={14} strokeWidth={1} aria-hidden /> },
  { key: 'supermarket',label: 'Supermarket', icon: <ShoppingCart size={14} strokeWidth={1} aria-hidden /> },
  { key: 'park',       label: 'Park',        icon: <Trees        size={14} strokeWidth={1} aria-hidden /> },
  { key: 'bank',       label: 'Bank',        icon: <Landmark     size={14} strokeWidth={1} aria-hidden /> },
  { key: 'pharmacy',   label: 'Pharmacy',    icon: <Pill         size={14} strokeWidth={1} className="text-neutral-700" aria-hidden /> },
]

// ── Sort options ───────────────────────────────────────────────────────────

const PLACE_SORT_OPTIONS = ['Most accessible first', 'Nearest first', 'Recently verified']

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
  const mapRef                            = useRef<MapRef>(null)
  const [searchQuery, setSearchQuery]    = useState('')
  const [searchActive, setSearchActive]  = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null)
  const [sheetSnap, setSheetSnap]        = useState<SnapPoint>('closed')
  const [sheetVisible, setSheetVisible]  = useState(false)
  const [sortSheetOpen, setSortSheetOpen] = useState(false)
  const [sortValue, setSortValue]        = useState('Most accessible first')
  const [selectedPlaceForDetail, setSelectedPlaceForDetail] = useState<Place | null>(null)
  const [placeDetailOpen, setPlaceDetailOpen] = useState(false)
  const [routePlanningOpen, setRoutePlanningOpen] = useState(false)
  const [routeDestinationName, setRouteDestinationName] = useState('')
  const [routeSwapped, setRouteSwapped] = useState(false)
  const [routeDetailOpen, setRouteDetailOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [routeDetailSnapTop, setRouteDetailSnapTop] = useState<number | null>(null)
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
        offset: [0, -150],
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
  useEffect(() => {
    if (location.state?.returnToSearch) {
      setSearchActive(true)
    }
  }, [])

  // ── Route polyline overlay ────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map || !selectedRoute || !routeDetailOpen) return

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
        const color = seg.type === 'walk'
          ? '#ebf1ff'  // primary-100
          : '#361ecb'  // primary-500 (bus, tram, metro, car)

        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': seg.type === 'walk' ? 4 : 6,
            'line-dasharray': seg.type === 'walk' ? [2, 2] : [1],
          },
        })
      })

      const allCoords = selectedRoute.coordinates.segments.flatMap(s => s.coords)
      const lngs = allCoords.map(c => c[0])
      const lats = allCoords.map(c => c[1])
      map.fitBounds(
        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
        {
          padding: {
            top: 100,
            bottom: Math.round(window.innerHeight * 0.52) + 40,
            left: 60,
            right: 60,
          },
          duration: 800,
          maxZoom: 13,
        }
      )
    }

    if (map.isStyleLoaded()) {
      addLayers()
    } else {
      map.once('load', addLayers)
    }

    return () => {
      selectedRoute.coordinates.segments.forEach((_, i) => {
        const sourceId = `route-seg-${i}`
        const layerId  = `route-layer-${i}`
        if (map.getLayer(layerId))  map.removeLayer(layerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      })
    }
  }, [routeDetailOpen, selectedRoute])

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

  // ── Filtered / search places ──────────────────────────────────────
  const filteredPlaces = activeCategory ? PLACES.filter(p => p.category === activeCategory) : []
  const displayPlaces  = sortPlaces(filterPlaces(filteredPlaces, filterState), sortValue)
  const searchResults  = searchPlaces(filterPlaces(PLACES, filterState), searchQuery)

  const sheetTitle = CHIPS.find(c => c.key === activeCategory)?.label ?? ''

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* ── Search mode background ──────────────────────────────────── */}
      {searchActive && (
        <>
          <div className="fixed inset-0 z-[8] bg-neutral-50" />
          <div
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
          {filterPlaces(PLACES, filterState).map(place => (
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
        </Map>
      )}

      {/* ── Search / route destination bar ──────────────────────────── */}
      {routePlanningOpen && !routeDetailOpen ? (
        <div className="absolute top-[56px] left-[24px] right-[24px] z-[20]">
          <RouteDestination
            from={routeSwapped ? routeDestinationName : 'Current location'}
            to={routeSwapped ? 'Current location' : routeDestinationName}
            onFromChange={() => {}}
            onToChange={() => {}}
            onSwap={() => setRouteSwapped(prev => !prev)}
          />
        </div>
      ) : (
        <>
          {/* ── Search + filter bar ─────────────────────────────────── */}
          <div className="absolute top-[56px] left-lg right-lg z-[10] flex items-center gap-xs">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder="Search places..."
                leftSlot={searchActive ? (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSearchActive(false)
                    }}
                    className="shrink-0 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                    aria-label="Back to map"
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
              aria-label="Filter"
              onClick={() => navigate('/filter', { state: { from: searchActive ? 'search' : 'map' } })}
            >
              <Funnel size={20} strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          {/* ── Category chips ─────────────────────────────────────── */}
          {!searchActive && !placeDetailOpen && (
            <div className="absolute top-[124px] left-lg right-0 z-10 flex flex-row flex-nowrap gap-xs overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {CHIPS.map(({ key, label, icon }: { key: CategoryKey; label: string; icon: React.ReactNode }) => {
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

      {/* ── Search results ──────────────────────────────────────────── */}
      {searchActive && (
        <div
          className="absolute top-[136px] left-lg right-lg z-[10] overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 224px)' }}
          onClick={e => e.stopPropagation()}
        >
          {searchResults.length === 0 && searchQuery.trim() ? (
            <div className="flex flex-col items-center justify-center pt-[48px] gap-[8px]">
              <p className="text-[16px] font-semibold text-neutral-900">No results found</p>
              <p className="text-[14px] font-normal text-neutral-500 text-center">
                Try a different name or address
              </p>
            </div>
          ) : (
            searchResults.map((place, idx) => (
              <React.Fragment key={place.id}>
                <PlaceListItem
                  name={place.name}
                  address={place.address}
                  distance={place.distance}
                  accessibilityScore={place.accessibilityScore}
                  category={place.category}
                  verifiedAt={place.verifiedAt}
                  isLiftDependent={place.isLiftDependent}
                  onPress={() => {
                    setSearchQuery(place.name)
                    setSearchActive(false)
                    mapRef.current?.getMap().flyTo({
                      center: place.coordinates,
                      zoom: 16,
                      offset: [0, -150],
                    })
                    setSelectedPlaceForDetail(place)
                    setPlaceDetailOpen(true)
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

      {/* ── Bottom sheet backdrop ───────────────────────────────────── */}
      {sheetVisible && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen && (
        <div
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
            <SortControl value={sortValue} onPress={() => setSortSheetOpen(true)} />
          </div>

          {/* Place list */}
          <div className="overflow-y-auto flex-1 pb-[144px] px-lg mt-[34px]">
            {displayPlaces.length === 0 ? (
              <p className="py-xl text-body-md text-neutral-500">No places found.</p>
            ) : (
              displayPlaces.map((place, idx) => (
                <React.Fragment key={place.id}>
                  <PlaceListItem
                    name={place.name}
                    address={place.address}
                    distance={place.distance}
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
          className="fixed inset-0 z-[55] bg-transparent"
          onClick={handleClosePopup}
        />
      )}

      {/* ── Place popup card ────────────────────────────────────────── */}
      <PlacePopupCard
        visible={!!selectedPlace && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen}
        name={selectedPlace?.name ?? ''}
        address={selectedPlace?.address ?? ''}
        distance={selectedPlace?.distance ?? ''}
        barrierCount={selectedPlace?.barrierCount ?? 0}
        accessibilityScore={selectedPlace?.accessibilityScore ?? 0}
        accessibilityVariant={getAccessibilityVariant(selectedPlace?.accessibilityScore ?? 0)}
        scoreVariant={scoreVariant(selectedPlace?.accessibilityScore ?? 0)}
        categoryIcon={selectedPlace ? getCategoryIcon(selectedPlace.category, 12) : undefined}
        onClose={handleClosePopup}
        onRoute={() => {
          if (selectedPlace) {
            setSelectedPlaceForDetail(selectedPlace)
            setPlaceDetailOpen(true)
          }
        }}
        onBookmark={() => console.log('Bookmark', selectedPlace)}
        onShare={() => console.log('Share', selectedPlace)}
      />

      {/* ── NavBar ──────────────────────────────────────────────────── */}
      <div className="absolute bottom-lg left-lg right-lg z-40">
        <NavBar activeTab="map" onTabChange={() => {}} />
      </div>

      {/* ── Sort sheet ──────────────────────────────────────────────── */}
      <SortSheet
        isOpen={sortSheetOpen}
        options={PLACE_SORT_OPTIONS}
        value={sortValue}
        onChange={(val) => setSortValue(val)}
        onClose={() => setSortSheetOpen(false)}
        height={SNAP_HEIGHT[sheetSnap]}
      />

      {/* ── Place detail sheet ──────────────────────────────────────── */}
      <PlaceDetailSheet
        place={selectedPlaceForDetail}
        isOpen={placeDetailOpen && !routePlanningOpen}
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
        isOpen={routePlanningOpen && !routeDetailOpen}
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
      />

      {/* ── Route detail sheet ──────────────────────────────────────── */}
      <RouteDetailSheet
        isOpen={routeDetailOpen}
        route={selectedRoute}
        destinationName={routeDestinationName}
        onClose={() => {
          setRouteDetailOpen(false)
          setSelectedRoute(null)
        }}
        onSnapChange={(top) => setRouteDetailSnapTop(top)}
      />

    </div>
  )
}
