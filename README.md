# Sauce Demo QA Automation Assessment

## Scope and assumptions

The suite targets only the public Sauce Demo practice store at `https://www.saucedemo.com`. Credentials and the base URL can be overridden with environment variables. The example values in `.env.example` are the public practice credentials listed by the assessment. Tests use the standard user so the deliberately problematic demo accounts do not create unrelated failures.

Assumptions: checkout accepts any non-empty postal code because no format rule is stated; tax is calculated by the application and verified from the values displayed on the overview page; a successful order leaves the cart empty; sorting uses the full catalog; direct navigation while logged out returns the visitor to login. Confirm these against the product owner before treating them as final product requirements.

## Setup and run

Requires Node.js 18 or later and npm.

```sh
npm install
npx playwright install chromium
```

Optionally copy `.env.example` to `.env` and set `BASE_URL`, `STANDARD_USER`, `LOCKED_USER`, and `PASSWORD`. The defaults point to the public practice site and its published assessment credentials.

```sh
npm test
```

Open the HTML report with `npm run report`. JUnit XML is written to `test-results/junit.xml`. Playwright saves a screenshot and trace when a test fails. Each test creates its own browser context and seeds the state it needs; it can run independently and in any order.

## Manual case to automated test mapping

| Manual ID | Automated test |
|---|---|
| TC01 | `TC01 standard user logs in` |
| TC02 | `TC02 locked out user sees login error` |
| TC03–TC06 | Manual only |
| TC07 | `TC07 price low to high sorts the complete list` |
| TC08–TC09 | Manual only |
| TC10 | `TC10 two products add and one remove updates badge and cart` |
| TC11–TC13 | Manual only |
| TC14 | `TC14 complete checkout total matches item total plus tax and cart clears` |
| TC15 | `TC15 checkout requires each customer field` (parameterized scenarios in one test) |
| TC16–TC19 | Manual only |
| TC20 | `TC20 products URL redirects logged out user to login` |
| TC21–TC22 | Manual only |

## Growing the suite to 200 tests

I would keep the page objects small and move repeated setup, test data, and assertions into fixtures and helper functions. I would organize cases by feature and risk, add API or unit tests for rules that do not need a browser, and use a data-driven approach for combinations such as sort direction, required fields, and user permissions. Before adding broad parallelism, I would check that test data is isolated and the practice site can handle the load. CI would run a fast smoke set on every change and the wider suite on a schedule or release candidate, with traces and reports retained for failures. I would review flaky tests rather than hiding them behind retries.

## Project structure

`tests/pages/` contains page objects; `tests/shop-checkout.spec.js` contains the traced UI cases; `playwright.config.js` defines browsers and reporting; `.env.example` lists configuration keys.
