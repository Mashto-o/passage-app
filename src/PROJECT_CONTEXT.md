# Passage App — Project Context for Claude

## What this project is
Bachelor's thesis in interaction/UX design by Mariia Kotenko (2026).
A personalized, AI-supported navigation app for wheelchair users
in Ukraine. Research-through-Design methodology. Output is a
high-fidelity coded prototype, not a deployed product.

## Project location
/Users/mashatolochko/Developer/passage-app

## GitHub
https://github.com/Mashto-o/passage-app

## Tech stack
- React 18 + TypeScript
- Vite 8
- Tailwind CSS v3 (NOT v4)
- react-router-dom
- mapbox-gl + react-map-gl
- lucide-react
- vite-plugin-svgr (for SVG imports as React components)

## Figma files
- Main app: https://www.figma.com/design/UCRCAdzWwdzsJP9LqOnZiw/Passage-Designs
- Design system: https://www.figma.com/design/X58nAr0iMaFsM8aNToFqoK/Passage---Design-System

## Folder structure
src/
  components/     ← reusable UI components (all exported from index.ts)
  screens/        ← full app screens
  context/        ← React context providers
  tokens/         ← design system values
  utils/          ← shared helper functions
  assets/
    icons/        ← custom SVG icons + brand logos
    illustrations/ ← mobility aid SVGs + onboarding illustration
    images/       ← barrier photos

## Design tokens
- Colours: primary, neutral, accent, success, warning, danger
- Typography: Onest font, tokens include size + lineHeight +
  fontWeight + letterSpacing in tailwind.config.js fontSize
- Spacing: 2xs(4) xs(8) sm(12) md(16) lg(24) xl(32) 2xl(48)
- Radius: xs(8) sm(12) md(16) lg(24) xl(32) xxl(48) full(9999)

## All components built (src/components/index.ts)
- Button (6 variants: primary, secondary, ghost, danger, disabled,
  back. The "back" variant: ChevronLeft icon + label, no bg/border,
  text-primary-500, font-semibold, h-[48px], py-[13px], gap-[10px])
- AccessibilityBadge (accessible, inaccessible, partial,
  unknown × sm/md sizes, pulse animation,
  accepts optional custom icon prop replacing default checkmark)
- SelectionCard (default + selected, SVG illustrations,
  icon left + label right layout, no description text)
- ReviewCard (display only)
- PreferenceCard (default + selected, custom SVG icons)
- AccessibilityCard (accessible/partiallyAccessible/inaccessible
  × default/selected)
- PhotoCard (src, label, selected state with primary/500 overlay)
- PlacePhotoCard (optional src, location chip, last updated)
- Chip (primary/secondary, optional icon)
- StatusBadge (positive/warning/negative, optional icon,
  rounded-[24px])
- Divider (1px neutral/200 horizontal rule)
- Dropdown (expandable pill, custom bg/text colours,
  optional items prop — when provided becomes interactive with
  expand/collapse; when omitted stays display-only)
- TextInput (label + input, default/focused states)
- RouteDestination (From + To TextInputs + swap button.
  onSwap prop swaps from/to values. stopPropagation on swap
  button to prevent closing parent sheets)
- CommentInput (textarea, 280 char limit, default/focused/error)
- NavBar (Discover/Map/Profile, lucide icons, active pill,
  justify-between)
- OnboardingProgress (currentStep/totalSteps, animated fill)
- RadioButton (inset box-shadow style: 3px default, 6px selected)
- PlaceListItem (name, address, distance, accessibilityScore,
  category, verifiedAt, isLiftDependent props.
  Badge colour from score: 80+=accessible/green,
  40-79=partial/orange, below 40=red.
  Category icon shown inside AccessibilityBadge via getCategoryIcon.
  isLiftDependent=true shows "Lift-dependent" warning badge
  (Zap icon, warning colours) next to accessibility badge.
  verifiedAt shown as relative time bottom-right replacing
  barriers count label. Divider rendered internally,
  not after last item. onPress prop makes card tappable.)
- RouteTimeline (proportional segment frames horizontal bar.
  bg-primary-100 base, transport segments as bg-primary-500
  pills overlaid. Walk segments show Accessibility icon.
  Transport segments show AccessibilityBadge + transport icon
  + line number. Width proportional to durationMin.)
- NavigationCard (default/noHazard/arrived, direction icons,
  hazard banner, px-[16px] instruction row)
- MediaInputButton (voice=solid border, camera=dashed border)
- SortControl (value + onPress, opens SortSheet overlay)
- SortSheet (overlay component, not a route. Props: isOpen,
  options, value, onChange, onClose, height. Height matches
  parent sheet dynamically via ref measurement. Full-screen
  height covering map, rounded-tl-[48px] rounded-tr-[48px].
  Uses Button variant="back" to close. RadioButton per option.
  Slides up/down with transition-transform duration-300)
- ToggleButton (Yes/No pair, success/danger selected)
- Toggle (on/off, thumb slides with translate-x)
- SearchBar (Search icon + input, default/focused.
  When searchActive: ArrowLeft replaces Search icon,
  tapping arrow clears query and closes search)
- TransportSwitcher (transit/car/walking tabs + header label,
  activeTab prop + onTabChange callback)
- PlaceDetailSheet (overlay inside MapScreen, not a route.
  Props: isOpen, place, onClose, onBuildRoute.
  top-[248px], z-[60/65]. Drag-to-close on handle.
  Scroll-to-top on open via useRef. Sticky feedback footer
  (thumbs down/up + Leave a review). Sections: Entrance,
  Toilet, Inside — each collapsible with photo cards +
  factor list. AccessibilityBadge with category icon.
  Lift warning banner if place.isLiftDependent.
  No NavBar — sheet covers bottom of screen.)
- RoutePlanningSheet (overlay inside MapScreen, not a route.
  Props: isOpen, destinationName, onClose, onRouteSelect.
  top-[X]px, z-[70/75]. Drag-to-close on handle.
  Shows RouteDestination as static display in MapScreen
  when open (replaces search bar + chips row).
  Power outage warning banner — always shown.
  TransportSwitcher with 3 tabs: transit/car/walking.
  Route sort via SortSheet with ROUTE_SORT_OPTIONS.
  SortSheet height measured dynamically from sheet ref.
  Route cards show proportional SegmentTimeline.
  Car tab split into "Own car" + "Taxi" sections with
  caption labels. Uklon card (yellow CTA "Order Uklon") and
  Social Taxi card (dark blue CTA "Schedule a ride") use
  hardcoded brand colours with explanatory comments.
  onRouteSelect called when route card tapped.)
- RouteDetailSheet (overlay inside MapScreen, not a route.
  Props: isOpen, route, destinationName, onClose.
  top-[248px], z-[80/75]. Drag-to-close on handle.
  Scroll-to-top on open. Sticky "Start route" footer.
  Timeline: vertical sequence of StationRows + SegmentFrames.
  Walk frames: bg-primary-100 pill, Accessibility icon inside,
  walk text + barriers dropdown in right column.
  Transport frames: bg-primary-500 pill, transport icon inside,
  ride text + stations dropdown + "2 people confirmed" row
  with Users icon outside the frame in right column.
  Frames touch with no gap — one continuous connected bar.
  Station rows between frames show location name + time.
  End point row uses end-point-icon.svg.
  Dropdowns expand below trigger row full-width — do NOT
  use the Dropdown component here; inline implementation only.
  Stations dropdown: bg-primary-100, station names listed.
  Barriers dropdown: bg-warning-100, barrier descriptions listed.
  Both use whitespace-nowrap on trigger labels, shrink-0 on
  trigger buttons. Text stays fixed when dropdown opens.
  Mapbox polyline drawn per route segment when sheet opens —
  walk=primary-100 dashed, transport=primary-500 solid.
  fitBounds with padding bottom:520 maxZoom:14 to show full
  route above the sheet. Layers cleaned up on sheet close.)

## SVG conventions
- All SVGs imported with ?react suffix
- stroke-width: 1.5 on all custom icons
- Use currentColor for fill/stroke
- Illustrations: src/assets/illustrations/
  wheelchair-manual, wheelchair-electric, no-wheelchair,
  cane, stroller, prosthesis, IllustrationOnboarding, arch
- Icons: src/assets/icons/
  door-width-90, door-width-100, door-width-120,
  slope-none, slope-moderate, slope-steep,
  stairs-avoided, stairs-single, stairs-multiple,
  surface-smooth, surface-uneven, surface-cobblestone,
  shelter, wc, starting-point-icon, end-point-icon,
  Uklon_Logo_2018.png, SocialTaxi_Logo.png

## Barrier photos (src/assets/images/)
cobblestone, drain-channel, kerb, narrow-doorway,
single-step, steep-slope

## Transport mode icons (lucide-react)
- transit → TrainFront
- bus → Bus, tram → TramFront, metro → Train
- taxi → CarTaxiFront, car → Car
- walking → Accessibility

## Navigation directions
turn-left, turn-right, slight-left, slight-right,
sharp-left, sharp-right, go-straight, u-turn, arrive

## Sort options
- Places: Most accessible first (default), Nearest first,
  Recently verified
- Routes: Fewest barriers (default), Shortest distance,
  Fastest, Flattest route

## Sort logic (in MapScreen)
- sortPlaces(places, sortValue) — sorts a copy, never mutates
- Most accessible first → sort by accessibilityScore descending
- Nearest first → parseDistanceToMetres(distance) converts
  "700 m" and "5.1 km" to metres before comparing
- Recently verified → sort by verifiedAt (Date) descending
- displayPlaces = sortPlaces(filterPlaces(filteredPlaces,
  filterState), sortValue) computed once before render,
  used for both empty-state check and list map

## Accessibility badge colour logic (unified, score-based)
- 80+ → accessible (green)
- 40–79 → partial (orange)
- below 40 → inaccessible (red)
Applied consistently everywhere: map markers, popups,
list items, filter cards, route detail badges.

## getCategoryIcon helper
- Location: src/utils/categoryIcon.tsx (shared utility)
- Signature: getCategoryIcon(category: string, size: number): JSX.Element
- Returns correct lucide-react icon per category
- Used by: map markers, place popup badge, PlaceListItem badge,
  FilterScreen cards, PlaceDetailSheet, and all future screens
- Comment above function: "Shared helper — used by map markers,
  place popup, PlaceListItem, and all future place-detail screens.
  Import from here whenever a category icon is needed."

## Place data shape
type Place = {
  id: string
  name: string
  address: string
  category: string   // 'shelter'|'hospital'|'restaurant'|
                     // 'landmark'|'supermarket'|'park'|
                     // 'bank'|'toilet'|'pharmacy'
  coordinates: [number, number]  // [lng, lat]
  accessibilityScore: number
  barrierCount: number
  distance: string   // e.g. "300 m" or "1.2 km"
  verifiedAt: Date
  isLiftDependent: boolean
}
40+ real Kyiv places across 9 categories. All exported from
MapScreen.tsx as: export const PLACES: Place[]
export type { Place } also from MapScreen.tsx.

## Route data shape (defined in RoutePlanningSheet.tsx)
type RouteSegment = {
  type: 'walk' | 'bus' | 'tram' | 'metro' | 'car'
  durationMin: number
  line?: string
  accessible?: boolean
}
type RouteCoordinates = {
  segments: { type: string; coords: [number, number][] }[]
}
type Route = {
  id: string
  distanceKm: number
  barrierCount: number
  departureTime: string
  durationMin: number
  arrivalTime: string
  cardType: 'standard' | 'uklon' | 'social-taxi'
  segments: RouteSegment[]
  coordinates: RouteCoordinates
  stationNames?: {
    boardAt?: string
    direction?: string
    alightAt?: string
  }[]
}
Exported as: export type { Route }

Route arrays: TRANSIT_ROUTES (4), CAR_ROUTES (4: 2 standard +
uklon + social-taxi), WALKING_ROUTES (2) — all in
RoutePlanningSheet.tsx.

## Third-party brand colours (hardcoded, with comments)
// Uklon brand colours — not Passage tokens
UKLON_YELLOW = '#F5DB00'
UKLON_BLACK = '#222426'
// Social Taxi brand colours — not Passage tokens
SOCIAL_TAXI_YELLOW = '#FED428'
SOCIAL_TAXI_DARK_BLUE = '#253362'
Used only in RoutePlanningSheet.tsx car tab cards.

## Filter state (src/context/FilterContext.tsx)
FilterState lives in React Context, shared between MapScreen
and FilterScreen. Never local to either screen.

type FilterState = {
  accessibility: Set<string>  // 'accessible'|'inaccessible'|
                               // 'partial'|'unknown'
  avoidLifts: boolean
  hasCompanion: boolean
}

DEFAULT_FILTER_STATE = {
  accessibility: new Set(['accessible', 'inaccessible', 'partial']),
  avoidLifts: false,
  hasCompanion: false,
}

CRITICAL: Always create a new Set when updating accessibility —
never mutate the existing one:
  const next = new Set(prev.accessibility)
  next.delete(variant) / next.add(variant)
  return { ...prev, accessibility: next }
handleReset must also create a new Set — never reuse the
DEFAULT_FILTER_STATE reference directly.

FilterProvider wraps the app in main.tsx.
useFilterContext() hook used by both MapScreen and FilterScreen.

## filterPlaces function (in MapScreen)
Applies to both map markers AND bottom sheet list.
function filterPlaces(places: Place[], filter: FilterState): Place[] {
  return places.filter((place) => {
    const variant = getAccessibilityVariant(place.accessibilityScore)
    return filter.accessibility.has(variant)
  })
}
avoidLifts and hasCompanion are wired to state but filtering
logic pending place-level data.

Selected marker guard: if selected place is filtered out,
close popup automatically via useEffect watching filterState.

## MapScreen state overview
Key state variables (all in MapScreen.tsx):
- searchQuery, searchActive — search bar state
- sortValue, sortSheetOpen — place sort
- selectedPlaceId — active map marker
- bottomSheetOpen, bottomSheetHeight — places list sheet
- selectedPlaceForDetail, placeDetailOpen — PlaceDetailSheet
- routePlanningOpen, routeDestinationName, routeSwapped — route planning
- selectedRoute, routeDetailOpen — RouteDetailSheet

## MapScreen overlay z-index stack (bottom to top)
- Map: z-0
- Chips row backdrop / search backdrop: z-[45]
- Bottom sheet (places list): z-[50]
- Place popup backdrop: z-[55]
- Place popup: z-[60]
- PlaceDetailSheet backdrop: z-[55], sheet: z-[60]
- RoutePlanningSheet backdrop: z-[65], sheet: z-[70]
- RouteDetailSheet backdrop: z-[75], sheet: z-[80]
- SortSheet (inside RoutePlanningSheet): above parent sheet
- NavBar: fixed bottom-[24px]

## MapScreen UI visibility rules
- Chips row hidden when: searchActive OR placeDetailOpen
- Search bar replaced by RouteDestination when:
  routePlanningOpen AND NOT routeDetailOpen
- RouteDestination hidden when: routeDetailOpen
- NavBar always visible except inside PlaceDetailSheet
  (PlaceDetailSheet has no NavBar)

## Search behaviour
- Tapping search bar: searchActive=true, ArrowLeft replaces
  Search icon in bar
- Tapping ArrowLeft: clears query, searchActive=false
- Tapping result: sets searchQuery=place.name,
  searchActive=false, map flies to place, PlaceDetailSheet opens
- Filter button stays visible in search active state
- Filter navigates with state: { from: 'search' } when
  searchActive, { from: 'map' } otherwise
- FilterScreen Back button returns to /map with
  { returnToSearch: true } when from==='search'
- MapScreen on mount: if location.state.returnToSearch →
  setSearchActive(true)

## Code conventions
- Named exports only (export const ComponentName)
- No hardcoded hex values — Passage tokens only
  Exception: third-party brand colours (Uklon, Social Taxi)
  and Mapbox line-color values (must be hex; comment with
  token equivalent)
- No inline styles except dynamic numeric values (e.g. height)
- No data-node-id attributes
- <button> for all interactive components
- aria-pressed for toggle/selection components
- focus-visible:ring-2 focus-visible:ring-primary-500
  focus-visible:ring-offset-2 focus-visible:outline-none
- transition-colors duration-200
- Font smoothing: -webkit-font-smoothing: antialiased in index.css
- Import components from src/components/index.ts —
  never rebuild existing components
- whitespace-nowrap on all dropdown trigger labels
- shrink-0 on all dropdown trigger buttons

## Screens already built (src/screens/)
- Onboarding1 — Route: /
- Onboarding2 — Route: /onboarding/2
- Onboarding3 — Route: /onboarding/3
- Onboarding4 — Route: /onboarding/4
- Onboarding5 — Route: /onboarding/5
- MapScreen — Route: /map (see MapScreen state overview above)
- FilterScreen — Route: /filter

## Routing (react-router-dom, BrowserRouter in main.tsx)
/ → Onboarding1
/onboarding/2 → Onboarding2
/onboarding/3 → Onboarding3
/onboarding/4 → Onboarding4
/onboarding/5 → Onboarding5
/map → MapScreen
/filter → FilterScreen
/dev → component showcase (all components)

## Context providers (main.tsx wrapping order)
<BrowserRouter>
  <FilterProvider>
    <App />
  </FilterProvider>
</BrowserRouter>

## Mapbox setup
- Token: VITE_MAPBOX_TOKEN in .env (never hardcoded)
- Style: mapbox://styles/mapbox/streets-v12
- Default centre: Kyiv (lng:30.5234, lat:50.4501), zoom:14
- Always import: mapbox-gl/dist/mapbox-gl.css in map screens
- Route polylines: addSource/addLayer with GeoJSON LineString
  per segment. Cleaned up on RouteDetailSheet close.
  fitBounds padding: top:120 bottom:520 left:60 right:60
  maxZoom:14

## PWA
- Planned at end of project — no setup yet

## Git workflow
- Commit after each completed screen
- Push via Cursor terminal (not Claude Code)
- Terminal 1: npm run dev (keep running)
- Terminal 2: git commands
- Run on phone: npm run dev -- --host then open Network URL

## Prompt conventions for Claude Code
- Always use Sonnet 4.6
- Effort: Low for fixes, Medium for new screens
- Always include: "Remove all data-node-id attributes"
- Always include: "Use only Passage tokens, no hardcoded values"
- Dev server: "If not running, start with npm run dev"
- Figma specs are extracted in Claude Chat and embedded
  in prompts — Claude Code reads specs from the prompt,
  not directly from Figma URLs
- Screens go in src/screens/
- Components go in src/components/ and must be exported
  from src/components/index.ts
- Shared utilities go in src/utils/
- Context providers go in src/context/81