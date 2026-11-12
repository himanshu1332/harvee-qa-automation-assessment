# Sauce Demo QA Automation Assessment

## Overview

This repository contains the Playwright UI automation suite for the Sauce Demo public practice store, prepared for the Harvee Technologies QA Automation Tester assessment.

The suite uses **Playwright with TypeScript** and follows the **Page Object Model (POM)**. It covers the main login, session, product sorting, cart, and checkout flows.

The automation targets the public practice site only. It does not interact with any production store or real payment service.

## Scope and assumptions

- The base URL and practice-user credentials can be configured through environment variables.
- The default configuration targets the public Sauce Demo practice site and its published practice accounts.
- Checkout accepts a non-empty postal code because no country-specific validation rule is defined in the assessment.
- The checkout overview's displayed item subtotal, tax, and total are treated as the values under test.
- A completed order should display a confirmation and leave the cart empty.
- A logged-out user should be redirected to the login page when opening the inventory URL directly.

## Requirements

- Node.js 20 or later
- npm

## Setup

Install the dependencies from the lockfile:

```bash
npm ci
```

Install the Chromium browser used by the configured test project:

```bash
npx playwright install chromium
```

On Linux CI agents that need Playwright system dependencies, use:

```bash
npx playwright install --with-deps chromium
```

## Configuration

The repository includes `.env.example` as a reference for local configuration.

For local overrides, copy it to `.env` and update the values as required:

```bash
# macOS / Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Available settings:

- `BASE_URL` — application base URL
- `STANDARD_USER` — valid practice account
- `LOCKED_USER` — locked practice account
- `PASSWORD` — practice account password

Do not commit `.env`, real credentials, or other secrets. The `.env` file is excluded by `.gitignore`.

## Run the tests

Type-check the TypeScript project:

```bash
npm run typecheck
```

Run the complete test suite:

```bash
npm test
```

Run tests with a visible browser:

```bash
npm run test:headed
```

Run a specific test by title, for example:

```bash
npx playwright test -g "TC14"
```

## Reports and failure artifacts

The Playwright configuration produces:

- **HTML report:** `playwright-report/`
- **JUnit XML report:** `test-results/junit.xml`
- **Screenshots:** captured on test failure
- **Traces:** retained on test failure

Open the HTML report after a test run:

```bash
npm run report
```

The report and test-artifact folders are generated during execution and are excluded from Git. Run the tests before opening the report.

## Test design

Each test uses its own Playwright browser context and establishes the state it needs, so tests can run independently and in any order.

The suite uses page objects for reusable page locators and actions. The required-checkout-field scenarios are data-driven: the missing first name, last name, and postal code are exercised as separate test cases.

## Manual case to automated test mapping

| Manual ID | Automated test / coverage |
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
| TC20 | Manual responsive viewport check; the logged-out URL guard is covered by TC06 |
| TC21–TC22 | Manual only |

## Project structure

```text
.
├── tests/
│   ├── pages/
│   │   ├── cart.page.ts
│   │   ├── checkout.page.ts
│   │   ├── inventory.page.ts
│   │   └── login.page.ts
│   ├── support/
│   │   └── test-config.ts
│   └── shop-checkout.spec.ts
├── .env.example
├── .gitignore
├── .nvmrc
├── AI_USAGE.md
├── package.json
├── package-lock.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
```

- `tests/pages/` — Page Object Model classes, locators, and page actions.
- `tests/support/test-config.ts` — environment-variable loading and shared test configuration.
- `tests/shop-checkout.spec.ts` — automated test scenarios.
- `playwright.config.ts` — test discovery, browser, retries, traces, screenshots, and reporters.
- `.env.example` — example environment configuration.
- `AI_USAGE.md` — disclosure of AI assistance and the human review performed.

Node.js type definitions are supplied by the `@types/node` development dependency. No custom global declaration file is required.

The default run targets Chromium. Firefox and WebKit can be added when the supported browser matrix is confirmed.

## Scaling the suite

To grow the suite, keep page objects focused and move repeated setup, test data, and assertions into fixtures and helper functions. Organize cases by feature and risk, and use data-driven tests for combinations such as sort direction, required fields, and user permissions. Add API or unit tests for rules that do not need a browser.

Before increasing parallelism, verify test-data isolation and the practice site's capacity. In CI, run a fast smoke set on every change and the wider suite on a schedule or release candidate. Investigate flaky tests rather than masking them with retries, and retain traces and reports to support diagnosis.
