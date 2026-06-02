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
  components/     ← reusable UI components
  screens/        ← full app screens
  tokens/         ← design system values
  assets/
    icons/        ← custom SVG icons (12 icons)
    illustrations/ ← mobility aid SVGs (6 illustrations)
    images/       ← photos

## Design tokens
- Colours: primary, neutral, accent, success, warning, danger
- Typography: Onest font, tokens include size + lineHeight + 
  fontWeight + letterSpacing in tailwind.config.js fontSize
- Spacing: 2xs(4) xs(8) sm(12) md(16) lg(24) xl(32) 2xl(48)
- Radius: xs(8) sm(12) md(16) lg(24) xl(32) xxl(48) full(9999)

## Components built so far
- Button (5 variants + disabled state)
- AccessibilityBadge (4 variants × 2 sizes, with pulse animation)
- SelectionCard (default + selected, uses SVG illustrations)
- ReviewCard (display only, uses SVG mobility badge)
- PreferenceCard (default + selected, uses custom SVG icons)
  All in src/components/index.ts

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

## Code conventions
- Named exports only (export const Button)
- No hardcoded hex values — Passage tokens only
- No inline styles
- No data-node-id attributes
- <button> element for all interactive components
- aria-pressed for toggle/selection components
- focus-visible:ring-2 focus-visible:ring-primary-500 
  focus-visible:ring-offset-2 focus-visible:outline-none
- transition-colors duration-200 for state changes
- Font smoothing: -webkit-font-smoothing: antialiased 
  in index.css

## Git workflow
- Commit after each completed component
- Push via Cursor terminal (not Claude Code)
- Terminal 1: npm run dev (keep running)
- Terminal 2: git commands

## Prompt conventions for Claude
- Always use Sonnet 4.6
- Effort: Low for fixes, Medium for new components/screens
- Always include: "Remove all data-node-id attributes"
- Always include: "Use only Passage tokens, no hardcoded values"
- Dev server note: "If not running, start with npm run dev"
- Figma specs are extracted in the Claude.ai chat and 
  embedded in prompts — Claude Code reads specs from 
  the prompt, not directly from Figma URLs