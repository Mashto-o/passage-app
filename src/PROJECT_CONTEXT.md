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
    icons/        ← custom SVG icons (12 icons)
    illustrations/ ← mobility aid SVGs (6 illustrations)
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
  unknown × sm/md sizes, pulse animation)
- SelectionCard (default + selected, SVG illustrations)
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
- PlaceListItem (name, address, distance, max 2 badges,
  barrier colour: 0=positive 1-3=warning 4+=negative,
  badge variant: 0-4=accessible 5+=inaccessible)
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
  cane, stroller, prosthesis
- Icons: src/assets/icons/
  door-width-90, door-width-100, door-width-120,
  slope-none, slope-moderate, slope-steep,
  stairs-avoided, stairs-single, stairs-multiple,
  surface-smooth, surface-uneven, surface-cobblestone,
  shelter

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