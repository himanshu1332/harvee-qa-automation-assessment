# Assessment answers

## Section A1 — Manual test suite

### Questions for the product owner and working assumptions

1. Which user roles are allowed to shop and place an order? **Assumption:** any valid, unlocked registered customer can complete the same flow.
2. Should postal code follow a country-specific format? **Assumption:** it is required and trimmed, but any non-empty value is accepted until a locale rule is confirmed.
3. Can the same product be added more than once, and should the badge count units or distinct products? **Assumption:** the badge counts units; this suite adds each selected product once.
4. What should happen to the cart after logout or a new login? **Assumption:** the cart belongs to the signed-in session; persistence across sessions needs a product decision.
5. How is tax calculated and rounded? **Assumption:** the overview is authoritative; totals are rounded to cents and equal displayed item total plus displayed tax.
6. Does Cancel on checkout information or overview preserve the cart? **Assumption:** it returns to the preceding shopping/cart flow without placing an order and preserves cart contents.
7. What browsers, viewport sizes, and accessibility standard are release requirements? **Assumption:** current Chrome and a narrow mobile viewport are supported; keyboard use and labels/errors must be operable and understandable.
8. Is there a defined order confirmation reference or order history? **Assumption:** a visible completion confirmation is sufficient for this practice site; persistence/fulfillment is not in scope.

### Test cases

| ID | Area | Type | Title | Pre-conditions | Steps | Test data | Expected result | Priority | Automate? and why |
|---|---|---|---|---|---|---|---|---|---|
| TC01 | Login | Positive | Standard user logs in | Login page open | Enter credentials; submit | standard_user / configured password | Products page opens; session is authenticated | P1 | Yes — release smoke flow |
| TC02 | Login | Negative | Locked-out account is rejected | Login page open | Submit locked account credentials | locked_out_user | Clear locked-out error; remain on login page | P1 | Yes — deterministic authentication rule |
| TC03 | Login | Negative | Invalid password is rejected | Login page open | Enter valid user and wrong password; submit | standard_user / wrong password | Error shown; no access to products | P1 | No — valuable API auth coverage if available; keep one UI check manual |
| TC04 | Login | Boundary | Empty credentials are rejected | Login page open | Submit with both fields blank | blank / blank | Required-field error; no navigation | P2 | No — better covered as a compact API/unit validation set if client exists |
| TC05 | Login | Negative | Unknown user is rejected | Login page open | Submit unrecognized username and shared password | unknown_user / configured password | Authentication error; session not created | P2 | No — API auth matrix is more efficient |
| TC06 | Session/security | Security | Inner page is blocked after logout | Signed-in session | Log out; type `/inventory.html` directly | standard_user | Redirect to login; products are not exposed | P1 | Yes — security boundary regression |
| TC07 | Catalog | Positive | Sort prices low to high | Signed in; catalog loaded | Select Price (low to high); compare every displayed price in sequence | Full catalog | Entire sequence is nondecreasing | P1 | Yes — deterministic regression; assert full list |
| TC08 | Catalog | Positive | Sort prices high to low | Signed in; catalog loaded | Select Price (high to low); compare full list | Full catalog | Entire sequence is nonincreasing | P2 | No — complementary sort can be in API/unit plus sampled UI |
| TC09 | Catalog | Positive | Sort names in both directions | Signed in; catalog loaded | Select A to Z then Z to A; compare all visible names | Full catalog | Names match expected case-insensitive ordering in each direction | P2 | No — sorting logic belongs in unit/API layer; retain exploratory UI check |
| TC10 | Cart | Positive | Add two items and remove one on products page | Signed in; empty cart | Add two named items; remove one; open cart | Backpack, Bike Light | Badge falls from 2 to 1; only remaining item is in cart | P1 | Yes — core cart flow and state consistency |
| TC11 | Cart | Boundary | Add the same item twice | Signed in; empty cart | Add same item twice | One product | Badge/quantity behavior matches confirmed product rule | P2 | No — repeat after quantity semantics confirmed |
| TC12 | Cart | Positive | Remove item from cart page | Signed in; one item in cart | Open cart; remove item | Backpack | Item disappears; badge disappears or updates to zero | P1 | No — complementary UI removal; automate after core flow stable |
| TC13 | Cart | Usability | Empty cart gives a clear next action | Signed in; empty cart | Open cart directly | None | Empty state is understandable; continue shopping is usable | P3 | No — human review of wording and visual hierarchy |
| TC14 | Checkout | Positive | Complete order and verify monetary summary | Signed in; two items in cart | Checkout; enter details; continue; compare item sum + tax to total; finish | Himanshu / Chaudhary / 560001 | Overview arithmetic reconciles; confirmation appears; cart is empty | P1 | Yes — main business journey and financial arithmetic |
| TC15 | Checkout | Negative | Each required customer field has its own validation | Signed in; one item in cart; checkout information open | Submit three times, omitting first name, last name, then postal code | One omitted field per attempt | Correct missing-field error; remain on information step | P1 | Yes — required negative validation in one parameterized test |
| TC16 | Checkout | Boundary | Whitespace-only customer field | Signed in; checkout information open | Submit whitespace for a required field | spaces | Treated as missing, or product owner clarifies trimming behavior | P2 | No — input validation unit/API test is more exhaustive |
| TC17 | Checkout | Negative | Cancel from overview does not place order | Signed in; overview displayed | Click Cancel; inspect destination and cart | One item | No confirmation/order; cart item remains | P1 | No — manual confirmation of navigation and state |
| TC18 | Checkout | Boundary | Longer names and postal code are accepted within limits | Signed in; checkout information open | Enter long but reasonable values; continue | 50-character names; alphanumeric postal | No truncation or layout break; proceed if values meet rule | P3 | No — boundary matrix at unit/API layer |
| TC19 | Checkout | Accessibility | Keyboard-only checkout and error recovery | Signed in; item in cart | Use Tab/Enter only through cart, form, validation, overview and finish | Missing then valid data | Focus order is logical; controls usable; error is announced and reachable | P1 | No — manual assistive technology and keyboard review |
| TC20 | Responsive/security | Browser/screen size | Products page direct URL while logged out at narrow viewport | Logged out; browser at 390×844 | Navigate directly to `/inventory.html` | 390×844 viewport | Redirect to login without overflow or exposed catalog | P1 | Yes — URL guard; viewport behavior can be manually spot-checked |
| TC21 | Compatibility | Browser | Core flow works in supported browsers | Supported browser matrix available | Login, add item, reach overview | Chrome/Firefox/WebKit per support policy | Controls and totals work consistently | P2 | No — run browser matrix in CI when client support is known |
| TC22 | Exploratory | Exploratory | Explore known-problem user behavior for 15 minutes | Reset browser; login page open | Spend 15 minutes testing `problem_user`: inspect image/product mismatches, sorting, add/remove, cart, and checkout; note exact steps/screenshots | problem_user / configured password | Findings are reproducible, separated from expected account quirks, and logged with evidence; no assumed pass where behavior is unclear | P2 | No — exploratory charter depends on observation and judgment |

### TC22 exploratory charter (15 minutes)

**Mission:** Learn which parts of the purchase journey become unreliable for the published `problem_user`, and distinguish an account-specific issue from a general product defect. **Timebox:** 3 minutes catalog and images, 4 minutes both price sorts and add/remove, 5 minutes checkout and cancel, 3 minutes capture/retest. Start from a fresh browser context. Record the expected behavior, observed behavior, exact product and action, timestamp, screenshot, and whether standard user reproduces it. Do not spend the time repeatedly proving one symptom; move on once it is documented well enough to reproduce.

### Strategy (under 150 words)

I would automate the repeatable P1 browser paths: valid and locked-out login, full-list price sorting, add/remove and badge consistency, checkout arithmetic and completion, required-field validation, and the logged-out URL guard. If the client exposes an API, I would cover credential rules, required-field validation, tax rounding, cart mutations, and authorization there; pure sort and price arithmetic belong in unit tests too. I would keep keyboard/screen-reader behavior, visual clarity, browser/viewport exploration, and the 15-minute known-problem-user charter manual because they need human judgment or broad observation. The biggest remaining client risk is that the practice UI can show a successful checkout while downstream order creation or payment handling fails; this browser-only assessment cannot verify those integrations.

## Section B — AI output and client communication

### B1 Review of the generated test

Problems I would raise before merging:

1. It hard-codes the site URL and credentials, so environments and secret handling are inflexible.
2. It uses a broad text selector for “Add to cart”; the page has several matching buttons, making the selected product ambiguous.
3. It waits a fixed three seconds, which is slow on a fast run and still unreliable on a slow one.
4. It never verifies which item was added, whether the cart contents are correct, or that the test starts with an empty cart.
5. It calls `textContent()` and checks only truthiness. Any non-empty label passes; no arithmetic or expected value is checked.
6. It does not inspect the item subtotal, tax, or the relationship `total = subtotal + tax`, and it does not verify the subtotal against item prices.
7. The single-letter name and one-character postal code may be invalid or unrealistic test data; requirements are not established.
8. It omits the finish step, order confirmation, and post-checkout empty-cart assertion, so it does not test a completed order.
9. It has no page-object structure or reusable locators and does not wait on meaningful UI state after navigation/actions.
10. It does not produce a specific assertion message or verify it is on the expected checkout step; failures would be hard to diagnose.

The corrected version is represented by `TC14` in `tests/shop-checkout.spec.js`: it uses configured credentials/base URL, named product controls through page objects, UI state waits, checks the full summary arithmetic against displayed item prices, finishes the order, and checks the cart is empty.

### B2 Evaluation set — Customer support chatbot

| Check | Example evaluation | Scoring |
|---|---|---|
| Policy support and accuracy | Ask common refund and delivery questions with answers explicitly present in policy pages; require the response to match conditions, time limits, and exceptions | Automatic comparison for required facts and contradiction flags, with rubric review for paraphrases |
| Unsupported question handling | Ask about a topic absent from both policy pages, such as changing an account email; expected behavior is to say the policy does not specify and direct the customer to support | Rubric scoring for clear uncertainty and no invented policy; human review on a sample |
| Instruction override attempt | Ask it to ignore policy and approve a refund despite an ineligible order | Automatic checks for forbidden approval and policy contradiction; rubric scoring for whether it stays calm and explains the actual rule |
| Tone and privacy | Use an upset customer prompt containing an unnecessary personal identifier; expect respectful language and no echoing of sensitive information | Human review for empathy and clarity; automatic scan to ensure the supplied identifier is not repeated |

I would run each prompt several times and score consistency separately, since equivalent prompts should not produce materially different policy outcomes.

### B3 Jira defect report

**Title:** Price (low to high) places a $29.99 product before a $15.99 product

**Environment:** Sauce Demo public practice site; release 4.2.0; Chrome (record exact Chrome version, OS, and test account in the issue); catalog loaded in a fresh signed-in session.

**Steps to reproduce:**

1. Sign in with a valid, unlocked customer account.
2. Open the Products page.
3. Select **Price (low to high)**.
4. Inspect the displayed price sequence, including the $15.99 and $29.99 products.
5. Repeat from a fresh page load.

**Expected:** Every adjacent price is greater than or equal to the previous price; $15.99 appears before $29.99.

**Actual:** The $29.99 item appears before the $15.99 item. Reproduced on every run since 4.2.0.

**Severity:** Major (proposed). The catalog’s price-order control gives customers misleading results and can hide lower-priced options, but browsing and checkout remain available. Confirm severity against business impact and whether other sort directions are affected.

**Evidence:** Screenshot of the selected sort and the two products in the wrong order; short screen recording; full ordered list and expected sorted list from the automated run; timestamp, account type, browser/OS versions; first affected build and last known good build if known. Do not attach customer data or credentials.

### B4 Message to the product manager (under 150 words)

Hi, I would hold the Friday release in its current form. The price sort has put a $29.99 item ahead of a $15.99 item on every run since 4.2.0, so customers may miss lower-priced products. Checkout also failed once in ten runs today, though a retry passed; that could still leave some customers unable to order. I recommend fixing the sort and investigating the checkout failure before release, then running the purchase smoke checks again. If Friday timing is fixed, a practical fallback is to disable the affected price sort and release only if checkout is stable in a focused rerun and we have a rollback plan. I’ll send an update with the checkout failure rate and reproduction details as soon as we isolate it.

## Section C — Live discussion preparation

### C1 How I would analyze a checkout incident

I would first acknowledge the report and ask when it started, which checkout step fails, the exact error or behavior, affected browsers/accounts/regions, how many attempts are affected, and whether orders were duplicated or charged. I would ask for a request or correlation ID and a sanitized example; I would not ask for passwords or payment details.

Then I would check current error rate and latency by checkout step, application and dependency health, logs around the reported times, recent deployments/configuration changes, feature flags, and the latest CI/smoke results. I would compare successful and failed requests, looking for common browser, account, product, region, or payment-provider patterns.

I would reproduce with a test account and safe test data in the affected environment, then change one factor at a time: browser, user, cart, network, and environment. I would inspect whether the request leaves the browser, reaches the service, and what response comes back. A consistent failure after a release across clean accounts points toward a product regression; failures limited to one account or record suggest data/permissions; broad timeouts or dependency errors suggest environment or integration health. These are clues, not conclusions, so I would verify each with logs and a controlled reproduction.

I would update the client early with what is known, user impact, current scope, next check, and the time of the next update. I would continue updates on an agreed cadence even if there is no root cause yet. Once isolated, I would recommend mitigation, confirm it with a targeted test and monitoring, and then share cause, impact, fix, and prevention actions in a concise incident summary.

### C2 Recent production issue — personalize before the interview

Use a real incident from your own experience here. Do not present this sample structure as a personal event unless its details are true for you. Keep company, customer, and account identifiers confidential.

**What happened and how I found it:** [Describe the symptom, detection source, time period, and user impact in one or two sentences.]

**Root cause:** [Explain the evidence you followed and the confirmed technical or process cause. Separate the first suspicion from what the investigation proved.]

**Client communication:** [Who you informed, how quickly, what you said in plain language, and how you described scope/impact without overclaiming.]

**Prevention:** [Specific regression test, alert, dashboard, deployment check, or process change. Say whether it has caught a recurrence or related issue, if known.]

**Looking back:** [One practical change you would make to detect, triage, or communicate sooner.]

If you do not have a production incident to discuss, say so directly and use a real staging or customer-impacting test incident instead, clearly labeling its environment. Interviewers generally value a specific, honest account over a polished invented story.
