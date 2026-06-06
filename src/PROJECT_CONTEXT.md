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
  tokens/         ← design system values
  assets/
    icons/        ← custom SVG icons
    illustrations/ ← mobility aid SVGs + onboarding illustration
    images/       ← barrier photos

## Design tokens
- Colours: primary, neutral, accent, success, warning, danger
- Typography: Onest font, tokens include size + lineHeight +
  fontWeight + letterSpacing in tailwind.config.js fontSize
- Spacing: 2xs(4) xs(8) sm(12) md(16) lg(24) xl(32) 2xl(48)
- Radius: xs(8) sm(12) md(16) lg(24) xl(32) xxl(48) full(9999)

## All components built (src/components/index.ts)
- Button (5 variants + disabled)
- AccessibilityBadge (accessible, inaccessible, partial,
  unknown × sm/md sizes, pulse animation,
  accepts optional custom icon prop replacing default checkmark)
- SelectionCard (default + selected, SVG illustrations,
  label wraps to two lines, no description text)
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
- Dropdown (display-only expandable pill, custom bg/text colours,
  full-width list)
- TextInput (label + input, default/focused states)
- RouteDestination (From + To TextInputs + swap button)
- CommentInput (textarea, 280 char limit, default/focused/error)
- NavBar (Discover/Map/Profile, lucide icons, active pill,
  justify-between)
- OnboardingProgress (currentStep/totalSteps, animated fill)
- RadioButton (inset box-shadow style: 3px default, 6px selected)
- PlaceListItem (name, address, distance, accessibilityScore prop,
  all badge colours derive from accessibilityScore as single source
  of truth: 80+=accessible/green, 40-79=partial/orange,
  below 40=inaccessible/red. Divider rendered internally,
  not after last item)
- RouteTimeline (segments with durationMinutes, mobility aid
  illustrations for walking, lucide for transport)
- NavigationCard (default/noHazard/arrived, direction icons,
  hazard banner, px-[16px] instruction row)
- MediaInputButton (voice=solid border, camera=dashed border)
- SortControl (value + onPress, opens sort subpage)
- ToggleButton (Yes/No pair, success/danger selected)
- Toggle (on/off, thumb slides with translate-x)
- SearchBar (Search icon + input, default/focused)
- TransportSwitcher (transit/car/walking tabs + header label)

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
  shelter, wc

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

## Accessibility badge colour logic (unified, score-based)
- 80+ → accessible (green)
- 40–79 → partial (orange)
- below 40 → inaccessible (red)
Applied consistently everywhere: map markers, popups, list items.

## Code conventions
- Named exports only (export const ComponentName)
- No hardcoded hex values — Passage tokens only
- No inline styles
- No data-node-id attributes
- <button> for all interactive components
- aria-pressed for toggle/selection components
- focus-visible:ring-2 focus-visible:ring-primary-500
  focus-visible:ring-offset-2 focus-visible:outline-none
- transition-colors duration-200
- Font smoothing: -webkit-font-smoothing: antialiased in index.css
- Import components from src/components/index.ts —
  never rebuild existing components

## Screens already built (src/screens/)
- Onboarding1 — splash screen, primary-500 bg, arch SVG
  animation (Arc Rise: arch rises translateY 100%→0 over 700ms),
  logo (accent-100 wordmark) + heading (display/xl 40px) +
  subtitle (heading/lg 22px) + Get started button.
  Route: /
- Onboarding2 — mobility aid selection, single select,
  SelectionCard grid (Manual, Electric, Cane, Limb aid,
  Stroller, No aid), Next disabled until selection made,
  logo gap-2xl, progress→header gap-xl.
  Route: /onboarding/2
- Onboarding3 — barrier selection, multi select,
  PhotoCard 2-col grid (6 barrier photos), Next disabled
  until ≥1 selected, cards w-[calc(50%-8px)].
  Route: /onboarding/3
- Onboarding4 — accessibility preferences, 4 groups single
  select each (Door Width, Stairs, Slope, Surface),
  PreferenceCard, all groups have defaults so Next always
  enabled. Route: /onboarding/4
- Onboarding5 — save preferences, IllustrationOnboarding SVG
  edge-to-edge in flex-1 middle zone, Sign up with phone
  (Phone icon) + Sign up with email (Mail icon) + Continue
  as guest (all console.log placeholder).
  Route: /onboarding/5
- MapScreen — full-screen Mapbox map. Route: /map
  Details:
  · Style: mapbox://styles/mapbox/streets-v12
  · Centre: Kyiv (lng:30.5234 lat:50.4501), zoom:14
  · Token: VITE_MAPBOX_TOKEN from .env
  · Search bar + filter button (Funnel icon, strokeWidth=1)
    overlay, top, left-[24px] right-0
  · Chips row: horizontally scrollable, left-[24px] right-0,
    overflow-x-auto flex-nowrap, no right boundary, shrink-0
    chips, all icons strokeWidth={1}
  · Chips: Shelter(custom SVG), Toilet(Toilet icon),
    Restaurant(Utensils), Hospital, Landmark, Supermarket
    (ShoppingCart), Park(Trees), Bank(Landmark), Pharmacy(Pill)
  · Active chip: bg-primary-500 text-neutral-0 border-primary-500
  · 40+ real Kyiv places in PLACES array across 9 categories:
    shelter, hospital, restaurant, landmark, supermarket,
    park, bank, toilet, pharmacy
  · Place type: { id, name, address, category, coordinates
    [lng,lat], accessibilityScore, barrierCount, distance }
  · getCategoryIcon(category, size) helper returns correct
    lucide icon per category, used for markers + popup badge
  · Map markers: AccessibilityBadge with category icon,
    colour from getAccessibilityVariant(score)
  · Selected marker: size="md" + animate-ping ring
  · Place popup: slides up on marker tap (translate-y-full→0
    duration-300), map flyTo zoom:16 offset:[0,-150],
    close X above photo, name+distance same row,
    address+barriers same row, rounded-[32px],
    fixed bottom-[125px] left-[24px] right-[24px] z-[60],
    transparent backdrop z-[55] to dismiss
  · Draggable bottom sheet: opens on chip tap or search input,
    snap points half/full screen (drag threshold 80px),
    dismiss on drag down, drag handle + title (display/md) +
    SortControl on separate line + PlaceListItem list,
    px-lg padding, pb-[120px] to clear NavBar,
    rounded-tl-[48px] rounded-tr-[48px], z-[50],
    transparent backdrop z-[45] to dismiss
  · Tapping chip while popup open → closes popup first
  · Tapping marker while sheet open → closes sheet,
    opens popup after 150ms delay
  · Tapping marker or chip closes the other UI element
  · List items in bottom sheet are NOT clickable (separate
    screen to be built)
  · NavBar activeTab="map" fixed bottom-[24px]

## Routing (react-router-dom, BrowserRouter in main.tsx)
/ → Onboarding1
/onboarding/2 → Onboarding2
/onboarding/3 → Onboarding3
/onboarding/4 → Onboarding4
/onboarding/5 → Onboarding5
/map → MapScreen
/dev → component showcase (all components)

## Mapbox setup
- Token: VITE_MAPBOX_TOKEN in .env (never hardcoded)
- Style: mapbox://styles/mapbox/streets-v12
- Default centre: Kyiv (lng:30.5234, lat:50.4501), zoom:14
- Always import: mapbox-gl/dist/mapbox-gl.css in map screens

## PWA
- Planned at end of project — no setup yet

## Git workflow
- Commit after each completed screen
- Push via Cursor terminal (not Claude Code)
- Terminal 1: npm run dev (keep running)
- Terminal 2: git commands

## Prompt conventions for Claude
- Always use Sonnet 4.6
- Effort: Low for fixes, Medium for new screens
- Always include: "Remove all data-node-id attributes"
- Always include: "Use only Passage tokens, no hardcoded values"
- Dev server: "If not running, start with npm run dev"
- Figma specs are extracted in Claude Chat and embedded
  in prompts — Claude Code reads specs from the prompt,
  not directly from Figma URLs
- Screens go in src/screens/