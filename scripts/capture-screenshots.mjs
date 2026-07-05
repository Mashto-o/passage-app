#!/usr/bin/env node
// Captures a full-page screenshot of every screen in the Passage prototype,
// walking through the real onboarding → map → review flow (rather than
// deep-linking) since most screens depend on OnboardingContext / router
// state that only exists once earlier steps have been completed.
//
// Usage: node scripts/capture-screenshots.mjs <output-dir>
// Requires the Vite dev server to already be running (npm run dev).

import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173'
const VIEWPORT = { width: 390, height: 844 } // no reference viewport in tailwind.config.js — using standard mobile size

const outDir = process.argv[2]
if (!outDir) {
  console.error('Usage: node scripts/capture-screenshots.mjs <output-dir>')
  process.exit(1)
}

let counter = 0
const manifest = []

async function capture(page, label) {
  counter += 1
  const filename = `screenshot_${String(counter).padStart(2, '0')}.png`
  await page.screenshot({ path: path.join(outDir, filename), fullPage: true })
  manifest.push({ file: filename, screen: label })
  console.log(`[${filename}] ${label}`)
}

// Best-effort step runner — logs and continues instead of aborting the
// whole run when one interaction along the flow doesn't line up.
async function step(description, fn) {
  try {
    await fn()
  } catch (err) {
    console.warn(`  ! step failed: ${description} — ${err.message}`)
  }
}

async function main() {
  await mkdir(outDir, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: VIEWPORT })
  page.setDefaultTimeout(10000)

  // ── Onboarding1 ──────────────────────────────────────────────────────
  await page.goto(BASE_URL + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200) // entrance animation
  await capture(page, 'Onboarding1 (/) — welcome screen')

  await step('Onboarding1 → Onboarding2', async () => {
    await page.getByRole('button', { name: 'Get started' }).click()
    await page.waitForURL('**/onboarding/2')
  })
  await capture(page, 'Onboarding2 (/onboarding/2) — mobility aid selection')

  // ── Onboarding2 → 3b ─────────────────────────────────────────────────
  await step('select mobility aid + Next', async () => {
    await page.getByText('Manual', { exact: true }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.waitForURL('**/onboarding/3b')
  })
  await capture(page, 'Onboarding3b (/onboarding/3b) — travel companion question')

  // ── Onboarding3b → 3 ─────────────────────────────────────────────────
  await step('select "Alone" + Next', async () => {
    await page.getByText('Alone', { exact: true }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.waitForURL('**/onboarding/3')
  })
  await capture(page, 'Onboarding3 (/onboarding/3) — barrier selection')

  // ── Onboarding3 → 4 ──────────────────────────────────────────────────
  await step('select barriers + Next', async () => {
    await page.getByText('Narrow doorway, < 90 cm', { exact: true }).click()
    await page.getByText('Steep slope / gradient', { exact: true }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.waitForURL('**/onboarding/4')
  })
  await capture(page, 'Onboarding4 (/onboarding/4) — accessibility preferences')

  // ── Onboarding4 → 5 ──────────────────────────────────────────────────
  await step('select preferences + Next', async () => {
    await page.getByText('± 90 cm', { exact: true }).click()
    await page.getByText('Low step', { exact: true }).click()
    await page.getByText('Moderate', { exact: true }).click()
    await page.getByText('Cobblestone', { exact: true }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.waitForURL('**/onboarding/5')
  })
  await capture(page, 'Onboarding5 (/onboarding/5) — sign-up / continue as guest')

  // ── Onboarding5 → Map ────────────────────────────────────────────────
  await step('continue as guest → Map', async () => {
    await page.getByRole('button', { name: 'Continue as guest' }).click()
    await page.waitForURL('**/map')
    await page.waitForTimeout(1500) // mapbox tiles
  })
  await capture(page, 'MapScreen (/map) — default state')

  // ── Category chip → bottom sheet list ──────────────────────────────
  await step('open Pharmacy category chip', async () => {
    await page.getByRole('button', { name: 'Pharmacy' }).click()
    await page.waitForTimeout(500)
  })
  await capture(page, 'MapScreen (/map) — category bottom sheet (place list)')

  // ── Close the bottom sheet first — markers underneath it aren't truly
  //    clickable (Playwright dispatches at real screen coordinates, which
  //    would hit the sheet, not the covered marker) ─────────────────────
  await step('close category sheet before clicking a marker', async () => {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
  })

  // ── Marker click → popup ─────────────────────────────────────────────
  await step('click a map marker', async () => {
    await page.locator('.mapboxgl-marker').first().click()
    await page.waitForTimeout(700)
  })
  await capture(page, 'MapScreen (/map) — PlacePopupCard overlay')

  // ── Popup card body → PlaceDetailSheet ───────────────────────────────
  // The card's accessible-name is ambiguous, so target it via the
  // "NN% Accessible" StatusBadge text that only appears inside that button.
  await step('open place detail sheet', async () => {
    await page.getByText(/% Accessible$/).first().click()
    await page.waitForTimeout(500)
  })
  await capture(page, 'MapScreen (/map) — PlaceDetailSheet overlay')

  // ── Close detail sheet (popup reappears — selectedPlace is untouched) ──
  // PlaceDetailSheet only exposes "Leave a review" — Build a route lives
  // on the popup card underneath it.
  await step('close detail sheet, build a route from the popup', async () => {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: 'Build a route' }).click()
    await page.waitForTimeout(700)
  })
  await capture(page, 'MapScreen (/map) — RoutePlanningSheet overlay')

  // ── Select a route → RouteDetailSheet ───────────────────────────────
  await step('select a route card', async () => {
    const routeButtons = page.locator('button', { hasText: /min/ })
    await routeButtons.first().click()
    await page.waitForTimeout(700)
  })
  await capture(page, 'MapScreen (/map) — RouteDetailSheet overlay')

  // ── Start route → ActiveNavigationSheet (default state) ────────────
  await step('start route', async () => {
    await page.getByRole('button', { name: 'Start route' }).click()
    await page.waitForTimeout(600)
  })
  await capture(page, 'MapScreen (/map) — ActiveNavigationSheet (default nav state)')

  // ── Wait for noHazard state (fires at 7.5s) ─────────────────────────
  await step('wait for noHazard nav state', async () => {
    await page.waitForTimeout(7500)
  })
  await capture(page, 'MapScreen (/map) — ActiveNavigationSheet (noHazard nav state)')

  // ── Wait for arrived state (fires at 13.5s total) ───────────────────
  await step('wait for arrived nav state', async () => {
    await page.waitForTimeout(6500)
  })
  await capture(page, 'MapScreen (/map) — ActiveNavigationSheet (arrived nav state)')

  // ── Auto-navigates to /route-complete 3 s after arrival ─────────────
  await step('wait for auto-navigate to route-complete', async () => {
    await page.waitForURL('**/route-complete', { timeout: 6000 })
    await page.waitForTimeout(700) // slide-up entrance animation
  })
  await capture(page, 'RouteCompleteScreen (/route-complete)')

  // ── Leave a review → ReviewScreen ───────────────────────────────────
  await step('leave a review', async () => {
    await page.getByRole('button', { name: /Leave a review/ }).click()
    await page.waitForURL('**/review')
    await page.waitForTimeout(400)
  })
  await capture(page, 'ReviewScreen (/review) — empty AI-assisted accordion')

  // ── Fill one section manually, rate it, answer all questions ───────
  await step('fill in one review section manually', async () => {
    await page.getByRole('button', { name: 'Fill in manually' }).first().click()
    await page.waitForTimeout(300)
    // AccessibilityCard's accessible name is "<icon alt> <label>" (e.g.
    // "Accessible Accessible") since the status icon also carries an alt text.
    await page.getByRole('button', { name: 'Accessible Accessible' }).first().click()
    const yesButtons = page.getByRole('button', { name: 'Yes', exact: true })
    const count = await yesButtons.count()
    for (let i = 0; i < count; i++) {
      await yesButtons.nth(i).click()
    }
    await page.waitForTimeout(300)
  })
  await capture(page, 'ReviewScreen (/review) — section filled in, ready to submit')

  // ── Submit review → success state ───────────────────────────────────
  await step('submit review', async () => {
    await page.getByRole('button', { name: 'Post review' }).click()
    await page.waitForTimeout(500)
  })
  await capture(page, 'ReviewScreen (/review) — submission success state')

  // ── Wait out the 2 s auto-redirect back to /map before continuing ──
  await step('wait for review success auto-redirect', async () => {
    await page.waitForURL('**/map', { timeout: 4000 })
  })

  // ── Discover screen ──────────────────────────────────────────────────
  await step('navigate to Discover', async () => {
    await page.getByRole('button', { name: 'Discover' }).click()
    await page.waitForURL('**/discover')
    await page.waitForTimeout(400)
  })
  await capture(page, 'DiscoverScreen (/discover)')

  // ── Profile screen ────────────────────────────────────────────────────
  await step('navigate to Profile', async () => {
    await page.getByRole('button', { name: 'Profile' }).click()
    await page.waitForURL('**/profile')
    await page.waitForTimeout(400)
  })
  await capture(page, 'ProfileScreen (/profile)')

  // ── Accessibility preferences ────────────────────────────────────────
  await step('open accessibility preferences', async () => {
    await page.getByText('My accessibility preferences', { exact: true }).click()
    await page.waitForURL('**/profile/preferences')
    await page.waitForTimeout(300)
  })
  await capture(page, 'AccessibilityPreferencesScreen (/profile/preferences)')

  // ── Filter screen (reached from Map) ────────────────────────────────
  await step('navigate to Map then open Filter', async () => {
    await page.goto(BASE_URL + '/map', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: 'Filter' }).click()
    await page.waitForURL('**/filter')
    await page.waitForTimeout(300)
  })
  await capture(page, 'FilterScreen (/filter)')

  // ── Dev component showcase (route exists in App.tsx) ────────────────
  await step('navigate to /dev showcase', async () => {
    await page.goto(BASE_URL + '/dev', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
  })
  await capture(page, 'DevShowcase (/dev) — component library reference')

  await browser.close()

  await writeFile(
    path.join(outDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  )
  console.log(`\nDone — ${manifest.length} screenshots written to ${outDir}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
