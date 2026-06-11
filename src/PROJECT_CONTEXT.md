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
- Typography: Onest font, tokens in tailwind.config.js fontSize
- Spacing: 2xs(4) xs(8) sm(12) md(16) lg(24) xl(32) 2xl(48)
- Radius: xs(8) sm(12) md(16) lg(24) xl(32) xxl(48) full(9999)

## All components built (src/components/index.ts)
- Button (7 variants: primary, secondary, ghost, danger,
  disabled, back, success. "back": ChevronLeft + label, no bg/border,
  text-primary-500, font-semibold, h-[48px].
  "success": bg-success-500 text-neutral-0, same shape as primary.)
- AccessibilityBadge (accessible/inaccessible/partial/unknown
  × sm/md, pulse animation, optional custom icon prop)
- SelectionCard (default/selected, SVG illustrations,
  icon left + label right, no description)
- ReviewCard (display only)
- PreferenceCard (default/selected, custom SVG icons)
- AccessibilityCard (accessible/partiallyAccessible/inaccessible
  × default/selected)
- PhotoCard (src, label, selected with primary/500 overlay)
- PlacePhotoCard (optional src, location chip, last updated)
- Chip (primary/secondary, optional icon)
- StatusBadge (positive/warning/negative, optional icon,
  rounded-[24px])
- Divider (1px neutral/200 horizontal rule)
- Dropdown (expandable pill, custom bg/text colours,
  optional items prop for interactive expand/collapse)
- TextInput (label + input, default/focused)
- RouteDestination (From + To TextInputs + swap button.
  onSwap swaps values. stopPropagation on swap button.)
- CommentInput (textarea, 280 char limit)
- NavBar (Discover/Map/Profile, lucide icons, active pill)
- OnboardingProgress (currentStep/totalSteps, animated fill)
- RadioButton (inset box-shadow: 3px default, 6px selected)
- PlaceListItem (name, address, distance, accessibilityScore,
  category, verifiedAt, isLiftDependent props.
  Score→colour: 80+=green, 40-79=orange, below 40=red.
  Category icon via getCategoryIcon inside AccessibilityBadge.
  isLiftDependent=true → "Lift-dependent" warning badge (Zap).
  verifiedAt → relative time bottom-right.
  onPress prop makes card tappable. Internal Divider.)
- RouteTimeline (proportional horizontal segment bar.
  bg-primary-100 base, transport=bg-primary-500 pills.
  Width proportional to durationMin. mergeConsecutiveWalkSegments
  applied before render to avoid duplicate walk icons.)
- NavigationCard (3 states: default/noHazard/arrived.
  default: hazard warning banner (warning-100), ArrowLeft,
    "Turn left onto vul. Khreschyatyk", "80m", "Moderate
    incline ahead in 10m". bg rgba(255,255,255,0.7) frosted.
  noHazard: ArrowRight, "Turn right onto vul. Baseyna",
    "120m", no banner, bg-success-100 border-success-500.
  arrived: "You have arrived", no direction, no distance,
    bg-primary-100 border-primary-500.)
- MediaInputButton (voice=solid border, camera=dashed)
- SortControl (value + onPress, opens SortSheet)
- SortSheet (overlay, not a route. Props: isOpen, options,
  value, onChange, onClose, height. Height dynamic via ref.
  Full-screen, rounded-tl/tr-[48px]. Back button. RadioButton
  per option. transition-transform duration-300)
- ToggleButton (Yes/No pair, success/danger selected)
- Toggle (on/off, thumb slides with translate-x)
- SearchBar (Search icon + input. searchActive: ArrowLeft
  replaces Search icon, tapping clears and closes search)
- TransportSwitcher (transit/car/walking tabs + header label,
  activeTab + onTabChange)
- PlaceDetailSheet (overlay in MapScreen. Props: isOpen,
  place, onClose, onBuildRoute.
  top-[248px], z-[60/65]. Drag-to-close. Scroll-to-top.
  Sticky feedback footer (thumbs/Leave a review).
  Sections: Entrance/Toilet/Inside — collapsible, photo
  cards + factor list. Lift warning if isLiftDependent.
  No NavBar.)
- RoutePlanningSheet (overlay in MapScreen. Props: isOpen,
  destinationName, onClose, onRouteSelect, overrideTop.
  z-[70/75]. Drag-to-close. Power outage banner always shown.
  TransportSwitcher 3 tabs. SortSheet dynamic height via ref.
  SegmentTimeline per card. Car tab: "Own car" + "Taxi"
  sections. Uklon (yellow) + Social Taxi (dark blue) cards
  with brand colours + CTAs. overrideTop syncs height with
  RouteDetailSheet when open.)
- RouteDetailSheet (overlay in MapScreen. Props: isOpen,
  route, destinationName, onClose, onStartRoute.
  Two snap points: SNAP_SHORT=52vh, SNAP_FULL=0.
  Drag handle advances between snaps, drag down from short
  closes. onSnapChange prop notifies MapScreen of current top.
  z-[80]. Sticky "Start route" footer.
  Vertical timeline: StationRows + SegmentFrames connected.
  Walk=bg-primary-100, Transport=bg-primary-500. No gaps.
  Inline dropdowns (NOT Dropdown component): stations expand
  below trigger full-width bg-primary-100; barriers expand
  bg-warning-100. whitespace-nowrap + shrink-0 on triggers.
  Mapbox polyline per segment:
    transport=primary-500 (#361ecb) solid width 8
    walk no barriers=primary-300 (#8b84e5) solid width 8
    walk with barriers=warning-500 (#f0a030) solid width 8
  fitBounds padding top:100 bottom:280 left:60 right:60
  maxZoom:13. Padding reset in cleanup via setPadding zeros.
  Start/end point Markers using starting-point-icon.svg and
  end-point-icon.svg. All routes share same end coordinate
  [30.5098, 50.4415].)
- ActiveNavigationSheet (overlay in MapScreen. Props: isOpen,
  route, destinationName, onClose.
  z-[100] — highest in stack, true full-screen takeover.
  bg-neutral-50 covers everything including map.
  NavigationCard floats top-[56px] left/right-[24px] z-[101].
  Bottom sheet: bg-neutral-0 rounded-tl/tr-[48px], compact
  non-scrolling. Shows destination, arrivalTime, distanceKm.
  "Report Difficulty" (secondary Button, console.log) +
  "End route" (danger Button, calls onClose).
  Arrival text: "You have arrived" when navState==='arrived'.
  Auto-advancing timer: default 15s → noHazard 12s → arrived
  stays until End route tapped. Timers cleared on close.
  navState resets to 'default' on open.)

## SVG conventions
- All SVGs imported with ?react suffix, stroke-width: 1.5,
  currentColor for fill/stroke
- Illustrations: src/assets/illustrations/
  wheelchair-manual, wheelchair-electric, no-wheelchair,
  cane, stroller, prosthesis, IllustrationOnboarding, arch
- Icons: src/assets/icons/
  door-width-90/100/120, slope-none/moderate/steep,
  stairs-avoided/single/multiple,
  surface-smooth/uneven/cobblestone,
  shelter, wc, starting-point-icon, end-point-icon,
  Uklon_Logo_2018.png, SocialTaxi_Logo.png

## Barrier photos (src/assets/images/)
cobblestone, drain-channel, kerb, narrow-doorway,
single-step, steep-slope

## Transport mode icons (lucide-react)
transit→TrainFront, bus→Bus, tram→TramFront, metro→Train,
taxi→CarTaxiFront, car→Car, walking→Accessibility

## Sort options
- Places: Most accessible first (default), Nearest first,
  Recently verified
- Routes: Fewest barriers (default), Shortest distance,
  Fastest, Flattest route

## Sort logic (MapScreen)
- parseDistanceToMetres: converts "700 m"/"5.1 km" to metres
- displayPlaces = sortPlaces(filterPlaces(filteredPlaces,
  filterState), sortValue) — computed once, used everywhere

## Accessibility badge colour (unified, score-based)
80+→accessible(green), 40-79→partial(orange), <40→red
Everywhere: markers, popups, lists, filter cards, badges.

## getCategoryIcon helper
Location: src/utils/categoryIcon.tsx
Signature: getCategoryIcon(category, size): JSX.Element
Used everywhere a category icon is needed.

## Place data shape (exported from MapScreen.tsx)
type Place = {
  id, name, address, category, coordinates: [lng,lat],
  accessibilityScore, barrierCount, distance,
  verifiedAt: Date, isLiftDependent: boolean
}

## Route data shape (exported from RoutePlanningSheet.tsx)
type RouteSegment = {
  type: 'walk'|'bus'|'tram'|'metro'|'car'
  durationMin, line?, accessible?, hasBarriers?
}
type Route = {
  id, distanceKm, barrierCount, departureTime,
  durationMin, arrivalTime,
  cardType: 'standard'|'uklon'|'social-taxi'
  segments: RouteSegment[]
  coordinates: { segments: {type, hasBarriers?, coords}[] }
  stationNames?: { boardAt?, direction?, alightAt? }[]
}
TRANSIT_ROUTES(4), CAR_ROUTES(4), WALKING_ROUTES(2)
All routes end at [30.5098, 50.4415].

## Third-party brand colours (hardcoded with comments)
UKLON_YELLOW='#F5DB00', UKLON_BLACK='#222426'
SOCIAL_TAXI_YELLOW='#FED428', SOCIAL_TAXI_DARK_BLUE='#253362'
Used only in RoutePlanningSheet.tsx.

## Filter state (src/context/FilterContext.tsx)
Shared via React Context between MapScreen + FilterScreen.
type FilterState = {
  accessibility: Set<string>, avoidLifts, hasCompanion
}
DEFAULT: accessibility=new Set(['accessible','inaccessible',
'partial']), avoidLifts=false, hasCompanion=false.
CRITICAL: always create new Set on update, never mutate.
handleReset must create new Set, never reuse DEFAULT ref.

## filterPlaces (MapScreen)
Applies to map markers AND list. Checks getAccessibilityVariant
against filter.accessibility Set.

## MapScreen state overview
searchQuery, searchActive, sortValue, sortSheetOpen,
selectedPlaceId, bottomSheetOpen, bottomSheetHeight,
selectedPlaceForDetail, placeDetailOpen,
routePlanningOpen, routeDestinationName, routeSwapped,
selectedRoute, routeDetailOpen, routeDetailSnapTop,
activeNavigationOpen

## MapScreen overlay z-index stack (bottom to top)
Map:z-0, chips backdrop:z-[45], bottom sheet:z-[50],
popup backdrop:z-[55], popup:z-[60],
PlaceDetailSheet backdrop:z-[55] sheet:z-[60],
RoutePlanningSheet backdrop:z-[65] sheet:z-[70],
RouteDetailSheet backdrop:z-[75] sheet:z-[80],
ActiveNavigationSheet:z-[100] card:z-[101]

## MapScreen UI visibility rules
- Chips hidden: searchActive OR placeDetailOpen OR
  routePlanningOpen OR activeNavigationOpen
- Search bar hidden: activeNavigationOpen
- Search replaced by RouteDestination:
  routePlanningOpen AND NOT routeDetailOpen
  AND NOT activeNavigationOpen
- NavBar hidden: activeNavigationOpen
- PlaceDetailSheet isOpen: placeDetailOpen
  AND NOT routePlanningOpen AND NOT activeNavigationOpen
- RoutePlanningSheet isOpen: routePlanningOpen
  AND NOT routeDetailOpen AND NOT activeNavigationOpen
- RouteDetailSheet isOpen: routeDetailOpen
  AND NOT activeNavigationOpen
- RoutePlanningSheet overrideTop: routeDetailSnapTop
  when routeDetailOpen, else null

## Mapbox flyTo convention
All marker/search flyTo calls use offset:[0,-80], zoom:16.
No padding on flyTo — only fitBounds uses padding.
map.setPadding zeros on mount and in RouteDetailSheet cleanup.

## Search behaviour
Tap bar→searchActive=true. ArrowLeft→clears+closes.
Result tap→searchQuery=name, searchActive=false,
map flyTo, PlaceDetailSheet opens.
Filter from search: navigate with {from:'search'}.
FilterScreen back→/map with {returnToSearch:true}.

## Code conventions
- Named exports only
- No hardcoded hex — Passage tokens only
  (exceptions: brand colours, Mapbox line-color with comment)
- No inline styles except dynamic numeric values
- No data-node-id attributes
- <button> for interactive, aria-pressed for toggles
- focus-visible:ring-2 focus-visible:ring-primary-500
  focus-visible:ring-offset-2 focus-visible:outline-none
- transition-colors duration-200
- whitespace-nowrap on dropdown labels, shrink-0 on triggers
- Import from src/components/index.ts — never rebuild

## Screens (src/screens/)
Onboarding1(/), Onboarding2-5(/onboarding/2-5),
MapScreen(/map), FilterScreen(/filter)

## Routing
/ /onboarding/2-5 /map /filter /dev(component showcase)

## Context providers (main.tsx)
<BrowserRouter><FilterProvider><App /></FilterProvider></BrowserRouter>

## Mapbox
Token: VITE_MAPBOX_TOKEN. Style: streets-v12.
Centre: Kyiv [30.5234,50.4501] zoom:14.
Always import mapbox-gl/dist/mapbox-gl.css in map screens.

## Git / dev
Terminal 1: npm run dev. Terminal 2: git.
Phone: npm run dev -- --host → open Network URL.
Commit after each screen. Push via Cursor terminal.

## Prompt conventions for Claude Code
- Model: claude-sonnet-4-6
- Always: "Remove all data-node-id attributes"
- Always: "Use only Passage tokens, no hardcoded values"
- Always: "If not running, start with npm run dev"
- Figma specs embedded in prompts — not read from URLs
- components→src/components/ + export from index.ts
- screens→src/screens/
- utils→src/utils/
- context→src/context/