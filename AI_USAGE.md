# AI usage disclosure

AI assistance was used during preparation of this assessment. The prompts/tasks included:

1. **Assessment analysis:** I asked for the assessment brief to be broken into manual test coverage, automation requirements, AI evaluation, defect reporting, and client communication deliverables. I reviewed the proposed coverage against the supplied requirements and retained/edited the cases to match the stated use case.
2. **Playwright framework scaffolding:** I asked for a TypeScript Playwright Page Object Model structure for the Sauce Demo login, inventory, cart, and checkout flow. I reviewed the locators and moved reusable selectors/actions into page objects.
3. **Test implementation and assertions:** I asked for help implementing login, sorting, cart, checkout, and validation scenarios. I reviewed the assertions, including checking the full sorted price list and reconciling the displayed item subtotal, tax, and total.
4. **Code review:** I asked for a review against the assessment requirements. I applied changes to centralize environment configuration, remove a locator from the test body, make missing-field checks data-driven, improve checkout assertions, and align the README with the installed Playwright/Node requirements.
5. **Documentation:** I asked for help drafting the README and this disclosure. I reviewed and edited the documentation to describe the actual repository structure and commands.

AI-generated suggestions were treated as drafts, not as proof that the suite passes. The project owner/test author must run `npm ci`, `npm run typecheck`, and `npm test` in the target environment and review the resulting reports before submission. No claim of a successful execution is made by this disclosure.
