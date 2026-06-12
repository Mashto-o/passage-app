// Runtime accessibility audit using Playwright + axe-core
//
// SETUP (run once in your project root):
//   npm install -D playwright axe-core
//   npx playwright install chromium
//
// USAGE:
//   1. In one terminal: npm run dev
//   2. Note the local URL it prints (usually http://localhost:5173)
//   3. In another terminal: node a11y-audit.mjs [base-url]
//      (if you omit base-url, it defaults to http://localhost:5173)
//
// OUTPUT:
//   - Prints a summary to the console
//   - Writes a detailed report to a11y-report.json

import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { writeFileSync } from 'fs';

const baseUrl = process.argv[2] || 'http://localhost:5173';

// Add/adjust routes here to match your app's routes
const routes = [
  { path: '/', name: 'Onboarding1' },
  { path: '/onboarding/2', name: 'Onboarding2' },
  { path: '/onboarding/3', name: 'Onboarding3' },
  { path: '/onboarding/4', name: 'Onboarding4' },
  { path: '/onboarding/5', name: 'Onboarding5' },
  { path: '/discover', name: 'DiscoverScreen' },
  { path: '/map', name: 'MapScreen' },
  { path: '/filter', name: 'FilterScreen' },
  { path: '/route-complete', name: 'RouteCompleteScreen' },
  { path: '/profile', name: 'ProfileScreen' },
  { path: '/profile/preferences', name: 'AccessibilityPreferencesScreen' },
  { path: '/review', name: 'ReviewScreen' },
];

// axe-core source, loaded once and injected into each page
const axeSource = readFileSync(
  new URL('./node_modules/axe-core/axe.min.js', import.meta.url),
  'utf-8'
);

const impactRank = { minor: 1, moderate: 2, serious: 3, critical: 4 };

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const allResults = [];

  for (const route of routes) {
    const url = `${baseUrl}${route.path}`;
    console.log(`\nScanning ${route.name} (${url})...`);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      // small settle delay for animations/transitions
      await page.waitForTimeout(500);

      await page.evaluate(axeSource);
      const results = await page.evaluate(async () => {
        // @ts-ignore - axe is injected globally
        return await axe.run(document, {
          // Mapbox GL canvas often trips up some rules irrelevantly;
          // exclude it from scanning if present
          exclude: [['.mapboxgl-map']],
        });
      });

      const violations = results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map(n => ({
          target: n.target,
          html: n.html,
          failureSummary: n.failureSummary,
        })),
      }));

      violations.sort(
        (a, b) => (impactRank[b.impact] || 0) - (impactRank[a.impact] || 0)
      );

      allResults.push({ route: route.path, name: route.name, violations });

      if (violations.length === 0) {
        console.log('  ✅ No violations found');
      } else {
        console.log(`  ⚠️  ${violations.length} violation type(s) found:`);
        for (const v of violations) {
          console.log(
            `     [${v.impact}] ${v.id} — ${v.help} (${v.nodes.length} element(s))`
          );
        }
      }
    } catch (err) {
      console.log(`  ❌ Failed to scan: ${err.message}`);
      allResults.push({
        route: route.path,
        name: route.name,
        error: err.message,
      });
    }
  }

  await browser.close();

  writeFileSync('a11y-report.json', JSON.stringify(allResults, null, 2));
  console.log('\nFull report written to a11y-report.json');

  // Summary
  const total = allResults.reduce(
    (sum, r) => sum + (r.violations ? r.violations.length : 0),
    0
  );
  console.log(`\n=== SUMMARY: ${total} total violation type(s) across ${routes.length} routes ===`);
}

run();
