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
- i18next + react-i18next (EN/UK)

## Figma files
- Main app: https://www.figma.com/design/UCRCAdzWwdzsJP9LqOnZiw/Passage-Designs
- Design system: https://www.figma.com/design/X58nAr0iMaFsM8aNToFqoK/Passage---Design-System

## Folder structure
src/
  components/     ← reusable UI components (all exported from index.ts)
  screens/        ← full app screens
  context/        ← React context providers
  tokens/         ← design system values
  utils/          ← shared helper functions (incl. a11y.ts, mockAI.ts,
                     accessibilityMatch.ts, formatUnits.ts, categoryIcon.tsx)
  i18n/           ← i18next init (index.ts) + changeLanguage helper
  locales/
    en/translation.json
    uk/translation.json
  assets/
    icons/        ← custom SVG icons + brand logos
    illustrations/ ← mobility aid SVGs + onboarding illustration
    images/       ← barrier photos

## Design tokens
- Colours: primary, neutral, accent, success, warning, danger
- Typography: Onest font, tokens in tailwind.config.js fontSize
- Spacing: 2xs(4) xs(8) sm(12) md(16) lg(24) xl(32) 2xl(48)
- Radius: xs(8) sm(12) md(16) lg(24) xl(32) xxl(48) full(9999)

## i18n (EN/UK)
- react-i18next, initialized in src/i18n/index.ts. Reads
  passage_language from localStorage, default 'uk', fallback 'uk'.
- src/locales/en/translation.json and uk/translation.json — all
  user-visible strings keyed by screen/component namespace
  (common, onboarding1-5, map, searchBar, placePopup, placeDetail,
  sort.places/sort.routes, routePlanning, routeDestination,
  transportSwitcher, routeDetail, bestMatch, filter, navBar,
  placeListItem, categories, navigationCard, discover, updateCard,
  friendActivity, eventCard, profile, accessibilityPreferences,
  reviewCard, placePhotoCard, mediaInput, review, etc.)
- DevLanguageToggle (src/components/DevLanguageToggle.tsx):
  dev-only (import.meta.env.DEV), fixed bottom-[8px] right-[8px]
  z-[200] pill, cycles EN/UK via src/i18n/changeLanguage.ts
  (calls i18n.changeLanguage + persists to localStorage).
  Component file kept for reference but NOT rendered in App.tsx
  (usage removed — default is now 'uk' so the toggle is not needed
  for demos).
- Plural forms (_one/_few/_many/_other) used for counts (reviews,
  friends, "X more to next level", "X going", time-ago).
- Localized DATA content: Place gets nameUk/addressUk; Route
  stationNames get Ukrainian equivalents; mock UPDATES/FRIEND_ACTIVITY/
  EVENTS get *Uk fields. getLocalizedField(obj, field, lang) helper
  picks `${field}Uk` for 'uk' else falls back to `field`.
- Units: src/utils/formatUnits.ts — formatDistance(metres, lang)
  → "700 m"/"5.1 km" or "700 м"/"5.1 км"; formatDuration(minutes, lang)
  → "{n} min" or "{n} хв". Place.distance and Route durations etc.
  are stored as raw numbers, formatted at render time via these
  + i18n.language (from useTranslation()'s i18n object).
- aria-label values are also translated via t() — screen reader
  output must be localized too.
- Time-ago strings in PlaceDetailSheet ReviewCard mock data and
  PlacePhotoCard mock data have *Uk counterparts (timestampUk,
  updatedAtUk) read via getLocalizedField — not a new utility,
  just the existing *Uk suffix pattern applied to these fields.
- PlaceDetailSheet PLACE_REVIEWS mock data also has reviewTextUk
  field; rendered via getLocalizedField(review, 'reviewText', lang).
- FriendActivityCard mock data (FRIEND_ACTIVITY in DiscoverScreen)
  has timeAgoUk fields added, read via getLocalizedField.

## Translation keys added since initial build
Under "common" namespace:
- back: "Back" / "Назад"
- madeOnLocation: "Made on location" / "Зроблено на локації"
- uploadedFromGallery: "Uploaded from gallery" / "Завантажено з галереї"
- verified: "Verified" / "Перевірено" (short form for tight spaces)
- yes: "Yes" / "Так"
- no: "No" / "Ні"

Under "reviewCard" namespace:
- verifiedAt key removed — no longer used (replaced by inline
  MapPinCheck icon + timestamp pattern)

Under "navBar" namespace:
- review: "Review" / Ukrainian equivalent

Under "accessibilityCard" namespace (new):
- accessible: "Accessible" / "Доступно"
- partiallyAccessible: "Partially accessible" / "Частково доступно"
- inaccessible: "Inaccessible" / "Недоступно"
- unknown: "Unknown" / "Невідомо"

Under "reviewScreen" namespace (additions):
- analyzingPhoto: "Analyzing photo..." / "Аналіз фото..."
- submitSuccess: "Review saved!" / "Відгук збережено!"
- submitSuccessHint: "You can find it on your profile page" /
  "Ви можете переглянути його у своєму профілі"

## Ukrainian inclusive terminology
Per the official «Без бар'єрів» vocabulary (bf.in.ua — Olena
Zelenska's initiative), the only correct Ukrainian term for
wheelchair is «крісло колісне». All uses of «візок/візка/візком»
in a wheelchair context have been replaced throughout the UK locale:
- «ручного крісла колісного» (genitive — "of a manual wheelchair")
- «для вашого крісла колісного» (genitive — "for your wheelchair")
- «типу крісла колісного» (genitive — "of wheelchair type")
- «Моє крісло колісне вмістилося всередині» (review question,
  neuter agreement — крісло is neuter in Ukrainian)
«Візок» is still correct for stroller (onboarding2.stroller).
onboarding2 UK labels use adjective-only ("Ручне" / "Електро")
since the section header «КРІСЛО КОЛІСНЕ» already names the
category — full phrase would be redundant on the card.

## Accessibility (a11y) conventions
- src/utils/a11y.ts exports clickableCardProps(onClick) — spreads
  role="button", tabIndex={0}, onClick, onKeyDown (Enter/Space) —
  used ONLY on genuinely tappable content cards (e.g. PlacePopupCard's
  info area), NEVER on backdrops, drag handles, or propagation-stopping
  wrappers.
- Backdrops (all sheets) and drag handles: aria-hidden="true", plain
  onClick (pointer-only dismiss is correct for backdrops). Each sheet/
  screen with overlays has a useEffect Escape-key listener that calls
  the appropriate close handler (priority-ordered if multiple overlays
  can be open).
- Toggle component: role="switch" + aria-checked (NOT aria-pressed),
  optional `label` prop → aria-label.
- Every screen has exactly one <main> landmark and one <h1> (visually
  styled via existing classes; sr-only h1 where no natural title exists,
  e.g. MapScreen).
- PlacePopupCard: outer card is a plain div (no role/tabIndex); the
  photo+info area is wrapped in its own <button> (onCardClick); Save/
  Share/Build-a-route remain sibling buttons with stopPropagation —
  avoids nested-interactive violations. Barrier count removed from
  the card. Spacing: 8px gap between the accessibility badge row and
  the text rows below it; 4px gap between the name/distance row and
  the address row.
- File inputs (MediaInputButton) and CommentInput textarea have
  aria-label / associated labels (translated).
- Verified clean via: eslint-plugin-jsx-a11y (eslint.a11y.config.js,
  not committed — recreate locally if needed) AND axe-core runtime
  audit (a11y-audit.mjs, Playwright — run locally: npm run dev +
  node a11y-audit.mjs). Both currently report 0 issues across all
  12 routes.

## All components built (src/components/index.ts)
- Button (7 variants: primary, secondary, ghost, danger,
  disabled, back, success. "back": ChevronLeft + label, no bg/border,
  text-primary-500, font-semibold, h-[48px].
  "success": bg-success-500 text-neutral-0, same shape as primary.)
- AccessibilityBadge (accessible/inaccessible/partial/unknown
  × sm/md, pulse animation, optional custom icon prop)
- SelectionCard (default/selected, SVG illustrations,
  icon left + label right, no description)
- ReviewCard (display only. Props: authorName, avatarUrl?,
  mobilityIcon, timestamp, reviewText, isVerified?: boolean,
  className?.
  Layout: single-column (matches FriendActivityCard pattern).
  Header row: 36px avatar (initial-letter fallback) + authorName +
  mobilityIcon + right-side date slot.
  Date slot: if isVerified → MapPinCheck icon (size 14,
  text-primary-500) + timestamp in text-primary-500; else plain
  timestamp in text-neutral-700.
  No placeName/address/accessibility badge — context provided by
  PlaceDetailSheet or FriendActivityCard.)
- PreferenceCard (default/selected, custom SVG icons)
- AccessibilityCard (accessible/partiallyAccessible/inaccessible
  × default/selected. Labels via t('accessibilityCard.*') —
  labelKey stored in module-level config, resolved inside component
  body via useTranslation so hooks are called correctly.)
- PhotoCard (src, label, selected with primary/500 overlay)
- PlacePhotoCard (optional src, isVerified?: boolean,
  updatedAt: string.
  Location prop REMOVED — was redundant with section header.
  When isVerified: centered pill on photo shows MapPinCheck icon
  + updatedAt text (both text-primary-500).
  When not verified: pill shows updatedAt text only (no icon).
  Caption below photo: t('common.madeOnLocation') when isVerified,
  else t('common.uploadedFromGallery').
  updatedAt strings localized via *Uk suffix + getLocalizedField
  at call site.)
- Chip (primary/secondary, optional icon)
- StatusBadge (positive/warning/negative, optional icon,
  rounded-[24px])
- Divider (1px neutral/200 horizontal rule)
- Dropdown (expandable pill, custom bg/text colours,
  optional items prop for interactive expand/collapse)
- TextInput (label + input, default/focused)
- RouteDestination (From + To TextInputs + swap button.
  onSwap swaps values. stopPropagation on swap button.)
- CommentInput (textarea, 280 char limit, aria-label)
- NavBar (Discover/Map/Profile tabs + separate "Review" circular
  button.
  activeTab: 'discover' | 'map' | 'profile'.
  Optional reviewActive?: boolean — when true, none of the three
  tabs render as active; the Review circle button renders with
  primary-500 icon + bg-primary-100 label pill instead of neutral.
  Review button: internally uses useNavigate() to call
  navigate('/map', { state: { reviewMode: true } }). Sits outside
  the main pill, same height as pill via self-stretch, rounded-full,
  Plus icon + t('navBar.review') label.
  Rendered on Discover, Map, and Profile screens.)
- OnboardingProgress (currentStep/totalSteps, animated fill)
- RadioButton (inset box-shadow: 3px default, 6px selected)
- PlaceListItem (name, address, distance, accessibilityScore,
  category, verifiedAt, isLiftDependent props.
  Score→colour: 80+=green, 40-79=orange, below 40=red.
  Category icon via getCategoryIcon inside AccessibilityBadge.
  isLiftDependent=true → "Lift-dependent" warning badge (Zap).
  verifiedAt → relative time bottom-right (translated, plural).
  onPress prop makes card tappable. Internal Divider.)
- RouteTimeline (proportional horizontal segment bar.
  bg-primary-100 base, transport pills = bg-primary-200 with
  text-primary-500 (was bg-primary-500).
  Width proportional to durationMin. mergeConsecutiveWalkSegments
  applied before render to avoid duplicate walk icons.
  RoutePlanningSheet feeds this component via an adaptSegments()
  adapter (in RoutePlanningSheet.tsx) that converts Route segments
  into RouteTimeline's segment shape, merges consecutive walking
  segments, and forces accessibility: 'accessible' for Uklon/
  Social Taxi segments.)
- NavigationCard (3 states: default/noHazard/arrived.
  ALL states use bg-neutral-0 border border-neutral-200 — no
  colour change between states.
  default: hazard warning banner (warning-100), ArrowLeft,
    turn instruction + distance, "Moderate incline ahead in 10m".
  noHazard: ArrowRight, turn instruction + distance, no banner.
  arrived: MapPin icon, "You have arrived!" (translated),
    destinationName as sublabel (NOT hardcoded "Your destination").
  All instruction/arrival text translated (navigation namespace,
  {{street}} interpolation).
  Slide animation on state change: slides out downward, updates
  content, slides in from above. transition-transform duration-300.)
- BarrierCheckModal (no longer used in the live ActiveNavigationSheet
  flow — kept as a component for the /dev showcase only.
  Props: isOpen, barrierLabel, barrierImageSrc, onYes, onNo, onSkip.
  z-[110] — above ActiveNavigationSheet.
  Full-screen dark overlay rgba(26,26,26,0.6).
  White card rounded-[48px] px-[24px] py-[32px], centred.
  Title: "Is this barrier still there?" heading/sm.
  Photo: w-[165px] h-[200px] rounded-[24px] overflow-hidden.
  Buttons: "Yes, still there" (primary), "No, it's gone" (success),
  "Skip — I'm not sure" (ghost, neutral/500).
  Footer: "Your answer helps other users on this route" body/sm.
  All three buttons dismiss modal + console.log action.)
- MediaInputButton (voice=solid border, camera=dashed. Supports
  onFileSelect for real photo upload (hidden file input,
  accept="image/*", aria-label translated incl. section context))
- SortControl (value + onPress, opens SortSheet)
- SortSheet (overlay, not a route. Props: isOpen, options,
  value, onChange, onClose, height. Height dynamic via ref.
  Full-screen, rounded-tl/tr-[48px]. Back button. RadioButton
  per option. transition-transform duration-300. aria-hidden
  backdrop + Escape listener.)
- ToggleButton (Yes/No pair, success/danger selected.
  Labels use t('common.yes') / t('common.no') — fully translated.)
- Toggle (on/off, role="switch", aria-checked, optional `label`
  prop → aria-label, thumb slides with translate-x)
- SearchBar (Search icon + input. searchActive: ArrowLeft
  replaces Search icon, tapping clears and closes search)
- TransportSwitcher (transit/car/walking tabs + header label,
  activeTab + onTabChange, each tab has translated aria-label)
- PlaceDetailSheet (overlay in MapScreen. Props: isOpen,
  place, onClose, onBuildRoute.
  top-[248px], z-[60/65]. Drag-to-close. Scroll-to-top.
  Sticky footer: single full-width "Leave a review" primary Button
  → navigate('/review', { state: { placeId, placeName, address } }).
  Thumbs up/down removed.
  Sections dynamic — derived via getPlaceFeatures(place): only the
  sections whose key is true in PlaceFeatures render (e.g. pharmacy
  shows Entrance+Inside, not Toilet). Each section's photos come
  from place.sections[key].photos (real PlacePhoto[] from places.ts);
  first FactorRow variant: 'inaccessible' if section status is
  'inaccessible', else 'accessible'.
  Lift warning if isLiftDependent.
  Profile match banner («8/10 key factors confirmed…») removed.
  Review cards (ReviewCard): single-column layout, isVerified +
  avatarUrl (cycled from Avatar1/2/3 in PLACE_REVIEWS) props,
  timestamp + reviewText localized via *Uk suffix + getLocalizedField.
  No NavBar. aria-hidden backdrop + Escape listener.)
- RoutePlanningSheet (overlay in MapScreen. Props: isOpen,
  destinationName, onClose, onRouteSelect, overrideTop.
  z-[70/75]. Drag-to-close. Power outage banner always shown.
  TransportSwitcher 3 tabs. SortSheet dynamic height via ref.
  SegmentTimeline per card. Car tab: "Own car" + "Taxi"
  sections. Uklon (yellow) + Social Taxi (dark blue) cards
  with brand colours + CTAs. overrideTop syncs height with
  RouteDetailSheet when open. aria-hidden backdrop + Escape listener.
  Per active tab, BestMatchCard (see below) pinned above the sorted
  list if getBestMatch() returns a result; that route is excluded
  from the regular list.
  Car tab — "Own car" section shows only 1 standard route card, no
  BestMatchCard (best-match logic does not apply to driving). Uklon/
  Social Taxi route segments are forced to accessibility:
  'accessible' (private/booked transport, not subject to the same
  accessibility variance as public transit).)
- BestMatchCard (src/components/BestMatchCard.tsx) — card:
  rounded-[32px], bg-success-100, border-2 border-success-500,
  wraps standard route card content. "Best match for you" badge:
  bg-success-500 white-text pill, absolute top-0 left-[24px]
  -translate-y-1/2 (straddles the card's top edge). Tags row
  (Chips) removed entirely.
  Computed via src/utils/accessibilityMatch.ts → getBestMatch(routes,
  mobilityAid): scores by route.barrierCount + mobilityAid sensitivity
  (manual/electric/stroller=high, cane/prosthesis=medium,
  no-wheelchair=low → returns null, no badge shown). NOT based on
  crowd/review data for this specific route (statistically meaningless
  for one-off A-to-B routes) — purely profile-vs-route-data driven.
- RouteDetailSheet (overlay in MapScreen. Props: isOpen,
  route, destinationName, onClose, onStartRoute.
  Two snap points: SNAP_SHORT=52vh, SNAP_FULL=0.
  Drag handle advances between snaps, drag down from short
  closes. onSnapChange prop notifies MapScreen of current top.
  z-[80]. Sticky "Start route" footer. aria-hidden backdrop +
  drag handle + Escape listener.
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
  [30.5098, 50.4415].
  Place markers hidden when routeDetailOpen or activeNavigationOpen.
  Only end point marker remains visible during route.)
- ActiveNavigationSheet (overlay in MapScreen. Props: isOpen,
  route, destinationName, onClose, onNavStateChange,
  onPanelHeightChange, maxHeight.
  z-[100] — highest in stack, true full-screen takeover.
  bg-neutral-50 covers everything including map.
  NavigationCard floats top-[56px] left/right-[24px] z-[101].
  Slide animation on navState change: card slides out down,
  content updates, slides back in from above (300ms).
  Bottom panel: bg-neutral-0 rounded-tl/tr-[48px], compact
  non-scrolling. Shows destinationName (flex-1) + arrivalTime/
  distanceKm stacked flex-col shrink-0 alongside it (divider
  between the two removed).
  "Report barrier" (secondary Button, console.log; renamed from
  "Report Difficulty") + "End route" (danger Button, calls onClose).
  On arrival: bottom panel slides down and disappears
  (translate-y-full, duration-500). NavigationCard remains
  visible showing arrived state.
  Auto-advancing timers (halved): default 7.5s → noHazard
  13.5s → arrived.
  BarrierCheckModal is no longer wired into this flow — the
  component file is kept only for the /dev showcase.
  onNavStateChange called on every navState change.
  onPanelHeightChange: measures bottom panel height via
  ResizeObserver.
  maxHeight: when set, clamps sheet height so it cannot exceed
  ActiveNavigationSheet panel when navigation is active.
  Timers cleared on close. navState resets to 'default' on open.)
- UpdateCard, FriendActivityCard, EventCard (DiscoverScreen cards)
  FriendActivityCard: isVerified?: boolean prop — when true, timeAgo
  shows MapPinCheck icon (size 14, text-primary-500) + timeAgo in
  text-primary-500; when false, plain timeAgo in text-neutral-700.
  avatarUrl?: string prop — renders <img> when defined, grey div
  fallback when not. timeAgoUk field read via getLocalizedField.
  UpdateCard: imageSrc?: string prop for place cover photo.
  avatar1Src?: string + avatar2Src?: string props — render as
  overlapping <img> circles (size-[24px], border-2 border-neutral-0)
  in the footer avatar stack; grey div fallback when undefined.
  Both avatar1Src and avatar2Src are passed as Avatar1/Avatar2
  (from src/assets/images/Discover/) in all UpdateCard usages.
- ReviewSection (accordion section for ReviewScreen — see below)
- DevLanguageToggle (see i18n section above)

## "Made on location" provenance system
Addresses the user-interview finding that existing solutions (e.g.
LUN) suffer from distrust due to off-site/fabricated data.
Design concept: reviews and photos submitted while physically at a
location carry a visual provenance signal (MapPinCheck icon,
text-primary-500) vs. content submitted remotely (plain date, no
icon). Deliberately NOT framed as "verified/unverified" (which
implies the absence is a negative) — instead framed as metadata
("made on location" vs "uploaded from gallery").

Implementation:
- isVerified: boolean prop on ReviewCard, PlacePhotoCard,
  FriendActivityCard
- ReviewCard + FriendActivityCard: date slot shows MapPinCheck +
  date in primary-500 (verified) vs plain date in neutral-700
- PlacePhotoCard: centered pill on photo shows MapPinCheck + date
  (verified) vs date only; caption below switches between
  "Made on location" and "Uploaded from gallery"
- All new submissions via ReviewScreen hardcoded as isVerified:true
  (entry point is PlaceDetailSheet → implies user engaged with a
  specific place; real-world version would use geolocation check)
- Mock data in PlaceDetailSheet shows mix of verified/unverified
  ReviewCards and PlacePhotoCards for demo purposes

## PlacePopupCard coverPhoto
coverPhoto?: string prop — renders <img> when defined (w-full
h-[120px] object-cover rounded-[16px]), grey div fallback when not.
In MapScreen, passed as:
  coverPhoto={selectedPlace?.sections?.entrance?.photos?.[0]?.src}

## Map popup behaviour
- Tapping a marker opens PlacePopupCard
- Tapping the photo/info area (a <button>, see a11y notes) →
  opens PlaceDetailSheet for that place
- Save / Share buttons: stopPropagation + console.log only
- "Build a route" button: stopPropagation + opens RoutePlanningSheet
- Close (X) button: stopPropagation + closes popup
- Popup hidden when selectedPlace is null

## Route completion flow
When navState reaches 'arrived' in ActiveNavigationSheet:
1. onNavStateChange fires with 'arrived'
2. MapScreen immediately: closes routeDetailOpen, routePlanningOpen,
   placeDetailOpen, calls closeSheet() (category list), clears
   selectedPlace, sets routeEndedAt = Date.now()
3. ActiveNavigationSheet bottom panel slides down (hidden)
4. NavigationCard stays visible showing arrived state + destinationName
5. Route polyline remains drawn on map
6. After 3 seconds: setActiveNavigationOpen(false),
   setSelectedRoute(null),
   navigate('/route-complete', { state: { distanceKm, durationMin } })
"End route" button: closes ActiveNavigationSheet only, returns to
RouteDetailSheet. Does NOT trigger route-complete flow.

## Route progress animation (during active navigation)
- Animated pulse dot (bg-primary-500, animate-ping ring bg-primary-300
  opacity-75) moves along flattened route coords as a Mapbox Marker
- Moves via setInterval every 300ms, stepPerTick =
  ceil(allCoords.length / 45)
- Timed to reach the end coordinate at exactly 13,500ms — the same
  moment navState becomes 'arrived' (matches timer2 in
  ActiveNavigationSheet)
- Dot stays at final coordinate once arrived, interval clears itself
- Coloured segment polylines remain fully coloured throughout — no
  grey overlay/fill layer (this approach was tried and removed)
- Marker added when activeNavigationOpen becomes true, removed on
  false or unmount

## Screens (src/screens/)
Onboarding1(/), Onboarding2-5(/onboarding/2-5) — all five call
window.scrollTo(0,0) in a useEffect on mount (scroll-to-top),
DiscoverScreen(/discover), MapScreen(/map), FilterScreen(/filter),
RouteCompleteScreen(/route-complete), ProfileScreen(/profile),
AccessibilityPreferencesScreen(/profile/preferences),
ReviewScreen(/review)

## DiscoverScreen (/discover)
Full-page route, bg-neutral-50, px-lg, pt-[56px], pb-[144px],
min-h-screen overflow-y-auto, gap-xl between sections.
- Header: "Discover" h1 (display/md) + FilterChip row (All/Updates/
  Friends/Events, single-select, larger than base Chip — px-md py-sm,
  body/md). Selected chip filters which sections below are shown.
- UPDATES: horizontal scroll row of UpdateCard (placeName, address,
  description, verifiedCount, timeAgo, imageSrc from places/,
  avatar1Src + avatar2Src from Discover/ avatars).
- FRIENDS' ACTIVITY: stacked FriendActivityCard (friendName,
  mobilityAid → illustration icon via same lookup/fallback as
  ProfileScreen, timeAgo/timeAgoUk, placeName, address,
  accessibilityLabel, reviewText, isVerified).
- ACCESSIBLE EVENTS: stacked EventCard (title, date Chip, organizer,
  attendeeCount — "{{count}} going", second row uses justify-between
  so attendee count is right-aligned).
- NavBar fixed bottom, activeTab="discover".
- All content + mock data (UPDATES/FRIEND_ACTIVITY/EVENTS) localized
  EN/UK via *Uk fields + getLocalizedField.

## RouteCompleteScreen (/route-complete)
Full-page scrollable screen, bg-neutral-50. Slide-up entrance
animation (translate-y-full → translate-y-0, duration-500).
Receives via React Router location state: { distanceKm, durationMin,
placeId, placeName, placeNameUk, address, addressUk,
destinationName } (distance/duration formatted via formatDistance/
formatDuration).
All content centered (flex flex-col items-center, text-center).
64px gap between the stats block and the button stack below it.
Sections:
- X close button, top-right → navigate('/map')
- Header: BadgeCheck icon (bg-primary-100 rounded-[48px] p-[16px]),
  "Route complete!" h1 (display/md), distance · duration
- Buttons (stacked):
  - "Leave a review for {{name}}" (primary, name=destinationName) →
    navigate('/review', { state: { placeId, placeName, address } })
  - "Report a problem with this route" (ghost) → console.log
  - "Back to map" (plain text link) → navigate('/map')
Ratings (AccessibilityCard), barrier ToggleButton, comment section,
and the old Submit/Skip buttons have all been removed.

## OnboardingContext (src/context/OnboardingContext.tsx)
Stores AND persists to localStorage:
- mobilityAid (key: passage_mobility_aid) — type MobilityAid =
  wheelchair-manual | wheelchair-electric | no-wheelchair | cane |
  stroller | prosthesis. setMobilityAid(null) removes the key.
- doorWidth, stairs, slope, surface (keys: passage_pref_door_width,
  passage_pref_stairs, passage_pref_slope, passage_pref_surface) —
  same option types as Onboarding4's PreferenceCard groups.
  setX(null) removes the key.
Exposes useOnboarding() with all values + setters.
Used by: Onboarding2 (mobilityAid selection), Onboarding4
(preference selections — context-backed, not local state),
ProfileScreen (mobilityAid display),
AccessibilityPreferencesScreen (preference selections —
context-backed, initialized from persisted values),
RoutePlanningSheet (getBestMatch uses mobilityAid).
Exported MobilityAid type is single source of truth. A separate,
narrower MobilityAid type is also exported from
src/components/RouteTimeline.tsx — same options except it uses
'none' in place of 'no-wheelchair'.

## ProfileScreen (/profile)
Reads mobilityAid from useOnboarding(), renders matching illustration
from src/assets/illustrations/ (fallback: wheelchair-manual),
className="text-primary-500" (illustrations use currentColor).
Level system: REVIEWS_PER_LEVEL = 10. reviewCount 24 → Level 3
"Local guide", badge shows "{{count}} more to get the next level!"
(plural). Badge background bg-primary-500 (was primary-300 — fixed
for contrast), text-neutral-0.
ProfileIllustration SVG in impact widget.
Layout: px-lg, pt-[56px], pb-[120px] (scrollable, overflow-y-auto,
min-h-screen — clears fixed NavBar), gap-xl/gap-lg/gap-md spacing.
h1 = page title (display/md). NavBar fixed bottom-[24px] left-[24px]
right-[24px], activeTab="profile".
"My accessibility preferences" list item →
navigate('/profile/preferences')
All text translated EN/UK incl. plural counts.

## AccessibilityPreferencesScreen (/profile/preferences)
Subpage of ProfileScreen — same four preference groups as Onboarding4
(Door width, Stairs, Slope, Surface) using PreferenceCard, but
without Logo, OnboardingProgress, or onboarding heading/intro.
Back button (variant="back") → navigate('/profile')
h1: "Accessibility preferences" (text-display-lg)
Save button (primary, fullWidth) → navigate('/profile')
State is context-backed via useOnboarding() (doorWidth/stairs/
slope/surface + setters) — persists across reloads, shared with
Onboarding4.

## ReviewScreen (/review) — AI-assisted review
Full-page route, bg-neutral-50, px-lg, pt-[56px], pb-[120px],
min-h-screen overflow-y-auto, gap-2xl between major blocks.
Entry points:
  1. PlaceDetailSheet's "Leave a review" footer →
     navigate('/review', { state: { placeId, placeName, address } })
  2. NavBar "Review" button → MapScreen reviewMode → place selection
     → navigate('/review', { state: { placeId, placeName, address } })
- Header: Back button + placeName (h1, display/md) + address (body/sm)
- AI banner: bg-primary-100 rounded-[24px] p-md, Sparkles icon +
  "AI-assisted review..." explanatory text (translated)
- Sections are dynamic: activeSectionIds derived from
  getPlaceFeatures(place).filter(key => features[key]).
  Only the active sections render. Lazy useState initializer:
  useState(() => initSections(activeSectionIds)).
- 3 possible ReviewSection accordions (Entrance/Toilet/Inside — icons:
  door-width-100 [stroke-width fixed to 1.5 to match icon set],
  wc, lucide Sofa):
  - status: 'empty' | 'analyzing' | 'done' | 'skipped'.
  - 'empty': MediaInputButton, plus a "Fill in manually" ghost
    button (left) + "Skip section" plain text link (right).
    "Fill in manually" → opens the section directly in 'done' state
    with no photo and no AI prefill (user fills ratings/answers from
    scratch). "Skip section" → status becomes 'skipped'.
  - 'analyzing': photo preview + pulsing Sparkles +
    t('reviewScreen.analyzingPhoto') card, ~1600ms → auto-advances
    to 'done'. ReviewSection uses useTranslation for this string.
  - 'done' (auto-opens): photo (if any) + 3 AccessibilityCard
    ratings + Yes/No ToggleButton questions. When reached via AI
    photo flow, AI-prefilled with Sparkles badges (user can override
    any value, removing its badge); when reached via "Fill in
    manually", all fields start unset.
  - isComplete (derived, not stored): rating selected AND all
    toggle questions answered for that section.
  - Mock AI (src/utils/mockAI.ts → analyzePhoto(sectionId)): predicts
    accessibility rating; answers derived from rating — accessible→
    all yes, inaccessible→all no, partiallyAccessible→half yes/half no.
    Explicitly commented as a placeholder for a real vision-model call.
  - Entrance: 4 questions, Toilet/Inside: 3 questions each.
  - Header row: Check (success-500) shows only when isComplete (not
    merely status==='done'). When status==='skipped', shows a muted
    "Skipped" label instead of the check icon. RotateCcw reset
    button shown in header whenever status is 'done' or 'skipped'
    (resets section back to 'empty').
- Comment section: "ADD A COMMENT" + MessageCircle icon, 2 Chips,
  CommentInput (280 char, aria-label).
- Submit "Post review": enabled only when every section is either
  isComplete or status==='skipped'; console.logs all state +
  comment, then sets isSubmitSuccess=true. All new submissions
  treated as isVerified:true.
- Success state: isSubmitSuccess=true renders a full-page centred
  view (replaces main form) with BadgeCheck icon (bg-primary-100
  pill, text-primary-500), t('reviewScreen.submitSuccess') h1,
  t('reviewScreen.submitSuccessHint') body. X button top-right
  (aria-label t('common.close')) clears timer + navigates /map
  immediately. useEffect on [isSubmitSuccess] stores a 2s
  setTimeout in successTimerRef — auto-navigates to /map and
  cleans up on unmount.
- Back button (navigate(-1)) is unaffected by success flow.
- All strings + AI banner translated EN/UK (reviewScreen namespace).

## Routing
/ /onboarding/2-5 /discover /map /filter /route-complete
/review /profile /profile/preferences /dev (component showcase)

## Context providers (main.tsx)
<BrowserRouter><LanguageProvider><OnboardingProvider><FilterProvider>
<App /></FilterProvider></OnboardingProvider></LanguageProvider>
</BrowserRouter>
(src/i18n imported as side-effect before render)

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

## Asset images structure
src/assets/images/
  Discover/   ← avatar1.png, avatar2.png, avatar3.png
  places/     ← place cover/toilet/inside photos by category+tier
                 (e.g. supermarket_accessible_cover.jpg)
  (root)      ← barrier photos: cobblestone, drain-channel, kerb,
                 narrow-doorway, single-step, steep-slope

## Transport mode icons (lucide-react)
transit→TrainFront, bus→Bus, tram→TramFront, metro→Train,
taxi→CarTaxiFront, car→Car, walking→Accessibility

## Sort options
- Places: Most accessible first (default), Nearest first,
  Recently verified
- Routes: Fewest barriers (default), Shortest distance,
  Fastest, Flattest route
All sort option labels translated (sort.places.* / sort.routes.*).

## Sort logic (MapScreen)
- displayPlaces = sortPlaces(filterPlaces(filteredPlaces,
  filterState), sortValue) — computed once, used everywhere
- Distance comparisons use raw metres (see formatUnits —
  Place.distance is now a number, formatted at render time)

## Accessibility badge colour (unified, score-based)
80+→accessible(green), 40-79→partial(orange), <40→red
Everywhere: markers, popups, lists, filter cards, badges.

## getCategoryIcon / category labels
Location: src/utils/categoryIcon.tsx — getCategoryIcon(category,
size). Category display names are translated via
t('categories.' + category) in the components that render them
(PlaceListItem, PlacePopupCard, PlaceDetailSheet) —
categoryIcon.tsx itself stays a pure icon lookup.

## Place data shape (src/data/places.ts — single source of truth)
All place types + data live in src/data/places.ts.
MapScreen.tsx re-exports everything for backward compat:
  export type { PlaceCategory, PlaceFeatures, PlacePhoto,
    PlaceSection, PlaceSections, Place, SortKey } from '../data/places'
  export { PLACES, SORT_KEYS, sortPlaces } from '../data/places'

type PlacePhoto = { src, isVerified, updatedAt, updatedAtUk }
type PlaceSection = { accessibilityStatus: 'accessible'|'inaccessible',
  photos: PlacePhoto[] }
type PlaceSections = { entrance?, toilet?, inside? }
type Place = {
  id, name, nameUk, address, addressUk, category,
  coordinates: [lng,lat], accessibilityScore, barrierCount,
  distance: number (metres — format via formatDistance),
  verifiedAt: Date, isLiftDependent: boolean,
  sections: PlaceSections
}

PLACE_DATA: 50 entries as Omit<Place,'sections'>[]
buildSections(category, score): score >= 70 → 'accessible' tier/photos,
  else 'inaccessible' tier/photos. COVER_IMG / TOILET_IMG / INSIDE_IMG
  are lookup records mapping category → {accessible, inaccessible} paths.
PLACES = PLACE_DATA.map(p => ({ ...p, sections: buildSections(...) }))

## PlaceFeatures / getPlaceFeatures (src/utils/placeFeatures.ts)
CATEGORY_FEATURE_DEFAULTS: Record<PlaceCategory, PlaceFeatures> — 9
  categories, each specifying which of entrance/toilet/inside
  sections are relevant (e.g. pharmacy has no toilet section).
getPlaceFeatures(place): merges CATEGORY_FEATURE_DEFAULTS with
  place.featuresOverride (if any). Used by PlaceDetailSheet to
  filter which sections render, and by ReviewScreen to filter
  which review sections appear. Imports from '../screens/MapScreen'
  (which re-exports from places.ts — no circular dependency).

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
  stationNames?: { boardAt?, direction?, alightAt?,
                    boardAtUk?, directionUk?, alightAtUk? }[]
}
TRANSIT_ROUTES(4), CAR_ROUTES(4), WALKING_ROUTES(2)
All routes end at [30.5098, 50.4415].
ROUTE_COMMUNITY_RATINGS was considered but NOT implemented (see
BestMatchCard above — rejected as statistically unrealistic for
one-off routes; replaced with profile-vs-segment-data scoring).

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
FilterScreen: h1 = "Filter" (translated), Toggle components have
translated `label` props (Avoid lift-dependent places / I'm
travelling with a companion).
FilterContext also exposes restoreFilterState(state: FilterState)
— sets full state from a snapshot (used by snackbar undo).

FilterScreen reset uses a snackbar undo pattern:
- "Reset" button snapshots state, calls handleReset, shows snackbar
  for 3s (UNDO_TIMEOUT_MS = 3000), then commits.
- Snackbar: fixed bottom-lg left-lg right-lg z-[120],
  bg-neutral-900 text-neutral-0, Undo button text-primary-300.
- Undo: clears timer, calls restoreFilterState(snapshot), hides
  snackbar. Timer cleared on unmount.
- Translation keys: filter.resetConfirm / filter.undo.

## filterPlaces (MapScreen)
Applies to map markers AND list. Checks getAccessibilityVariant
against filter.accessibility Set. When filterState.avoidLifts ===
true, places with isLiftDependent === true are additionally
excluded from both map markers and the place list.

## MapScreen state overview
searchQuery, searchActive, sortValue, sortSheetOpen,
selectedPlaceId, bottomSheetOpen, bottomSheetHeight,
selectedPlaceForDetail, placeDetailOpen,
routePlanningOpen, routeDestinationName, routeSwapped,
selectedRoute, routeDetailOpen, routeDetailSnapTop,
activeNavigationOpen, navPanelHeight, routeEndedAt,
routeProgress, reviewMode
h1: sr-only "Map" in normal mode. When reviewMode=true: h1
becomes t('placeDetail.leaveReview') (or equivalent key) —
both sr-only and visible heading update.
activeTab="map" on NavBar; reviewActive={reviewMode} passed
to NavBar.

## MapScreen overlay z-index stack (bottom to top)
Map:z-0, chips backdrop:z-[45], bottom sheet:z-[50],
popup backdrop:z-[55], popup:z-[60],
PlaceDetailSheet backdrop:z-[55] sheet:z-[60],
RoutePlanningSheet backdrop:z-[65] sheet:z-[70],
RouteDetailSheet backdrop:z-[75] sheet:z-[80],
ActiveNavigationSheet:z-[100] card:z-[101],
BarrierCheckModal:z-[110],
Review-mode overlay: z-[10] (above search bg z-[8]/z-[9],
below all sheets)

## MapScreen UI visibility rules
- Chips hidden: searchActive OR placeDetailOpen OR
  routePlanningOpen OR activeNavigationOpen
- Search bar hidden: activeNavigationOpen OR reviewMode
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
- Place markers visible: NOT routeDetailOpen AND NOT
  activeNavigationOpen

## Search behaviour
Tap bar→searchActive=true. ArrowLeft→clears+closes (normal mode).
Result tap→searchQuery=name, searchActive=false,
map flyTo, PlaceDetailSheet opens.
Filter from search: navigate with {from:'search'}.
FilterScreen back→/map with {returnToSearch:true}.

reviewMode: activated by navigate('/map', { state: {
reviewMode:true } }) from NavBar "Review" button. Works from
any screen including Map itself — useEffect depends on
location.state (not just mount) to handle same-route navigation.
When reviewMode=true:
- Full-screen overlay (z-[10], bg-neutral-50) with "Leave a
  review" heading + back button (variant="back") renders
- Back button onClick: setReviewMode(false) +
  setSearchActive(false) + setSearchQuery('') +
  navigate('/map', { replace: true }) (was navigate(-1))
- reviewMode: true is passed through FilterScreen's navigation
  state when entering it from this flow, and read back on return,
  so filtering during review mode doesn't drop out of review mode.
- Search results sorted by 'nearest' when query is empty
  (sortPlaces(searchResults, 'nearest'))
- Result tap → navigate('/review', { state: { placeId,
  placeName, address } }) instead of opening PlaceDetailSheet
- NavBar shows reviewActive=true (Review button highlighted,
  tabs unselected)

## Escape-key handling (MapScreen)
Single useEffect, priority order: searchActive → popup
(selectedPlace && no sheet open) → bottom sheet (sheetVisible
&& no sheet open).
Individual sheet components (PlaceDetailSheet, RoutePlanningSheet,
RouteDetailSheet, SortSheet) have their own Escape listeners
for their own onClose.

## Mapbox flyTo convention
Marker tap (handleMarkerClick) uses offset:[0,-120], zoom:16.
Search result tap uses offset:[0,-80], zoom:16.
No padding on flyTo — only fitBounds uses padding.
map.setPadding zeros on mount and in RouteDetailSheet cleanup.
Mapbox free tier: 50,000 map loads/month, 100,000 Directions
API requests/month. GeoJSON layers do not count as extra loads.

## Onboarding → Map handoff
Every CTA button on Onboarding5 (final step), regardless of
which one is tapped, calls navigate('/map').

## Code conventions
- Named exports only
- No hardcoded hex — Passage tokens only
  (exceptions: brand colours, Mapbox line-color with comment)
- No inline styles except dynamic numeric values
- No data-node-id attributes
- <button> for interactive, role="switch"+aria-checked for
  toggles (NOT aria-pressed)
- focus-visible:ring-2 focus-visible:ring-primary-500
  focus-visible:ring-offset-2 focus-visible:outline-none
- transition-colors duration-200
- whitespace-nowrap on dropdown labels, shrink-0 on triggers
- Import from src/components/index.ts — never rebuild
- All user-visible strings (and translated aria-labels) go
  through useTranslation()'s t() — no hardcoded UI text. New
  strings get added to BOTH src/locales/en/translation.json
  and uk/translation.json. Use plural forms
  (_one/_few/_many/_other) for counts. Use getLocalizedField
  for data-driven name/address/text fields (nameUk etc.). Use
  formatDistance/formatDuration for any metres/minutes display.
- clickableCardProps (src/utils/a11y.ts) only on genuinely
  tappable content — never backdrops/drag handles/propagation
  wrappers (those get aria-hidden="true" + plain onClick +
  Escape listener instead).

## Prompt conventions for Claude Code
- Model: claude-sonnet-4-6
- Always: "Remove all data-node-id attributes"
- Always: "Use only Passage tokens, no hardcoded values"
- Always: "If not running, start with npm run dev"
- Always: check src/components/index.ts for existing components
  before building new ones; new repeated UI patterns become
  components exported from index.ts
- Figma specs embedded in prompts — not read from URLs
- components→src/components/ + export from index.ts
- screens→src/screens/
- utils→src/utils/
- context→src/context/
- New user-visible strings → add to both locale JSON files
- When touching translation files: use grep/targeted search,
  never read the entire file — locale files are large and
  reading them whole is expensive

## Pending / not yet implemented
- ReviewsContext: submitted reviews from ReviewScreen do not
  yet persist to PlaceDetailSheet. Planned: new
  src/context/ReviewsContext.tsx with addReview(placeId,
  reviewData) + getReviews(placeId), wired into main.tsx,
  ReviewScreen submit calls addReview, PlaceDetailSheet reads
  and renders submitted reviews via ReviewCard above mock
  reviews. New review author: "You" (translated), mobilityIcon
  from useOnboarding().mobilityAid, timestamp: t('common.justNow'),
  isVerified: true (hardcoded).

## Research alignment (for thesis write-up)
- RQ3 (Collaborative feedback): addressed via ReviewScreen's
  AI-assisted accordion + DiscoverScreen's Updates/Friends
  activity. Also addressed by the "Made on location" provenance
  system (isVerified on ReviewCard/PlacePhotoCard/FriendActivityCard
  — MapPinCheck icon signals on-site submission vs. plain date
  for remote). Directly responds to user interview finding about
  distrust of off-site/fabricated data (LUN problem). NavBar
  "Review" button provides always-accessible entry point to
  leave a review from any screen.
- RQ4 (User profiling): OnboardingContext mobilityAid +
  accessibility preferences.
- RQ1 (Adaptive personalisation): addressed via BestMatchCard
  (profile-vs-route-segment-data scoring) — explicitly NOT via
  fabricated crowd-rating data (documented reasoning in
  accessibilityMatch.ts comments).
- RQ2 (Engaging onboarding): Onboarding1-5 covers mobility-aid
  + preference capture, one decision per screen + progress
  indicator. Notion brief's voice guidance / location permission
  / route-teaser / sign-up steps are NOT in the coded prototype
  (documented gap).
- Accessibility of the prototype itself: eslint-plugin-jsx-a11y
  + axe-core audits both pass with 0 issues (see Accessibility
  section above) — relevant for the "prototype demonstrates
  accessible design practice" angle.
- Data realism: barrier/accessibility data is pre-authored mock
  data. Community verification loop (verifiedAt, BarrierCheckModal,
  RouteCompleteScreen barrier toggle, ReviewScreen) demonstrates
  the interaction pattern but does not write to any data store.
  Plausible as a future product; documented as a prototype
  limitation.

## Git / dev
Terminal 1: npm run dev. Terminal 2: git.
Phone: npm run dev -- --host → open Network URL.
Commit after each screen/feature. Push via Cursor terminal.