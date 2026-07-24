# Playwright Google Smoke Tests

[![Playwright Tests](https://github.com/aston-cook/Playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/aston-cook/Playwright/actions/workflows/playwright.yml)

Cross-browser smoke tests for Google Search, Images, and Maps, built with [Playwright](https://playwright.dev) and TypeScript.

The suite runs against a live third-party site, so it is designed around that reality: consent screens are dismissed automatically, anti-bot interstitials are detected and handled with a documented fallback strategy, and browser-specific quirks are skipped explicitly with a reason instead of being left to flake.

## Highlights

- **Page Object Model** — selectors and interactions live in `pages/`, so specs read as plain scenarios.
- **Custom fixtures** — a shared `test` fixture in `utils/fixtures.ts` applies common page setup once instead of repeating `beforeEach` hooks in every spec.
- **Cross-browser matrix** — Chromium (real Chrome channel), Firefox, and WebKit, plus a Pixel 7 mobile emulation project for `@mobile`-tagged tests.
- **Resilient third-party testing** — if Google serves its anti-bot page, search tests rerun the query on DuckDuckGo, and Google-only tests can skip (with a reason) via `ALLOW_GOOGLE_SKIP=1` instead of failing the build.
- **CI ready** — GitHub Actions typechecks and runs the full matrix on every push and pull request, uploads the HTML report, and keeps traces, videos, and screenshots for failures.
- **Strict TypeScript** — `npm run typecheck` runs `tsc --noEmit` locally and in CI.

## Project structure

```
.
├─ .github/workflows/
│  └─ playwright.yml        # CI: typecheck + full browser matrix + artifacts
├─ pages/                   # Page Objects
│  ├─ GoogleHomePage.ts
│  ├─ GoogleImagesPage.ts
│  └─ GoogleMapsPage.ts
├─ tests/
│  ├─ search.spec.ts        # Search: load, results, autocomplete, keyboard, negative
│  ├─ images.spec.ts        # Images: load, thumbnails, autocomplete, mobile
│  └─ maps.spec.ts          # Maps: suggestions, search navigation
├─ utils/
│  ├─ fixtures.ts           # Shared test fixture (common page setup)
│  ├─ google.ts             # Consent handling, block detection, DuckDuckGo fallback
│  └─ testConfig.ts         # Shared test data
├─ playwright.config.ts
└─ tsconfig.json
```

## Getting started

Requires [Node.js](https://nodejs.org/) 20 or later.

```bash
git clone https://github.com/aston-cook/Playwright.git
cd Playwright
npm ci
npx playwright install --with-deps
```

## Running tests

| Command | What it does |
| --- | --- |
| `npm test` | Full suite across all browser projects |
| `npm run test:smoke` | Only `@smoke`-tagged tests |
| `npm run test:chromium` | Single browser (fastest local loop) |
| `npm run test:headed` | Watch the browsers while tests run |
| `npm run test:ui` | Playwright UI mode |
| `npm run typecheck` | TypeScript check without emitting |
| `npm run report` | Open the last HTML report |

Useful local variations:

```bash
# Gentler on Google's rate limits
npx playwright test --project=chromium --workers=1

# Skip Google-only tests instead of failing when Google blocks automation
ALLOW_GOOGLE_SKIP=1 npx playwright test
```

## How third-party flakiness is handled

Testing a site you don't control means the site can fight back. Each known failure mode has an explicit strategy:

| Challenge | Strategy |
| --- | --- |
| Consent screen (EU regions, fresh profiles) | `acceptConsentIfShown` dismisses it before every scenario |
| Anti-bot interstitial on Search | Detected by `isBlocked`; the query reruns on DuckDuckGo and assertions are written to pass on either engine |
| Anti-bot interstitial on Google-only pages | With `ALLOW_GOOGLE_SKIP=1` (set in CI), the test skips with a visible reason instead of failing the build |
| Headless detection | Chromium runs the real Chrome channel with the automation flag disabled, and a shared fixture hides `navigator.webdriver` |
| WebKit instability on Maps | Skipped per browser with an explanatory reason (heavy WebGL/canvas) |
| Genuine flake in CI | Two retries with trace and video captured on the first retry |

## CI

The [workflow](.github/workflows/playwright.yml) runs on every push to `main` and on every pull request:

1. Install dependencies with `npm ci`
2. Typecheck with `tsc --noEmit`
3. Install Playwright browsers
4. Run the full matrix (Chromium, Firefox, WebKit, mobile)
5. Upload the HTML report on every run; traces and videos on failure

`ALLOW_GOOGLE_SKIP=1` is set in CI so Google rate-limiting shows up as skipped tests with a reason, not a red build.

## License

[MIT](LICENSE)

## Author

**Aston Cook** — [LinkedIn](https://www.linkedin.com/in/aston-cook/)
