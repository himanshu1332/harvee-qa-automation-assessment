# Sauce Demo QA Automation Assessment

## Scope and assumptions

This repository contains the UI automation portion of the QA Automation assessment for the public Sauce Demo practice store only. It does not target any other live system. The base URL and published practice-user credentials are configurable through environment variables; defaults are provided for the public practice site.

Assumptions: checkout accepts any non-empty postal code because no format rule is stated; the overview page's displayed subtotal, tax, and total are the values under test; a successful order empties the cart; and a logged-out visitor is redirected to login when opening the inventory URL directly.

## Requirements

- Node.js 20 or later
- npm

## Setup

```bash
npm ci
npx playwright install chromium
```

Optionally copy `.env.example` to `.env` and override `BASE_URL`, `STANDARD_USER`, `LOCKED_USER`, or `PASSWORD`. Do not commit `.env` or real credentials.

## Run

```bash
npm run typecheck
npm test
```

Run with a visible browser:

```bash
npm run test:headed
```

Open the HTML report:

```bash
npm run report
```

The suite writes an HTML report to `playwright-report/`, JUnit XML to `test-results/junit.xml`, and captures screenshots plus traces on failure. Generated reports and test artifacts are intentionally excluded from Git.

Each test starts from its own browser context and establishes the state it needs, so tests can run independently and in any order. The missing-checkout-field cases are generated as separate data-driven tests from one scenario table.

## Manual case to automated test mapping

| Manual ID | Automated test |
|---|---|
| TC01 | `TC01 standard user logs in` |
| TC02 | `TC02 locked out user sees the expected error` |
| TC03 | Manual only |
| TC04 | `TC04 empty login fields show a validation error` |
| TC05 | Manual only |
| TC06 | `TC06 after logout direct products URL redirects to login` |
| TC07 | `TC07 price low to high sorts the entire catalog` |
| TC08 | Manual only |
| TC09 | `TC09 product names sort A to Z and Z to A` |
| TC10 | `TC10 add two products and remove one on products page` |
| TC11 | Manual only |
| TC12 | `TC12 removing an item from cart updates the contents and badge` |
| TC13 | Manual only |
| TC14 | `TC14 full checkout reconciles total and empties the cart` |
| TC15 | Three data-driven tests: missing first name, last name, and postal code |
| TC16–TC19 | Manual only |
| TC20 | Manual responsive viewport observation; URL guard is covered by TC06 |
| TC21–TC22 | Manual only |

## Growing the suite to 200 tests

I would keep page objects focused and move repeated setup, test data, and assertions into fixtures and helper functions. I would organize cases by feature and risk, add API or unit tests for rules that do not need a browser, and use data-driven tests for combinations such as sort direction, required fields, and user permissions. Before increasing parallelism, I would verify test-data isolation and the practice site's capacity. CI would run a fast smoke set on every change and the wider suite on a schedule or release candidate. I would investigate flaky tests rather than masking them with retries, and retain traces and reports to support diagnosis.

## Project structure

- `tests/pages/` — Page Object Model classes and locators.
- `tests/support/` — shared environment configuration and TypeScript environment declaration.
- `tests/shop-checkout.spec.ts` — UI test scenarios.
- `playwright.config.ts` — browser and reporting configuration.
- `.env.example` — configurable values; copy to `.env` for local overrides.
- `AI_USAGE.md` — disclosure of AI assistance and human review.

The default run targets Chromium. Firefox and WebKit can be added once the supported browser matrix is confirmed.
