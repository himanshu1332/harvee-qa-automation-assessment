import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}
  get firstName(): Locator { return this.page.getByRole('textbox', { name: 'First Name' }); }
  get lastName(): Locator { return this.page.getByRole('textbox', { name: 'Last Name' }); }
  get postalCode(): Locator { return this.page.getByRole('textbox', { name: 'Zip/Postal Code' }); }
  get continueButton(): Locator { return this.page.getByRole('button', { name: 'Continue' }); }
  get cancelButton(): Locator { return this.page.getByRole('button', { name: 'Cancel' }); }
  get error(): Locator { return this.page.locator('[data-test="error"]'); }
  get summaryItems(): Locator { return this.page.locator('.cart_item'); }
  get subtotal(): Locator { return this.page.locator('.summary_subtotal_label'); }
  get tax(): Locator { return this.page.locator('.summary_tax_label'); }
  get total(): Locator { return this.page.locator('.summary_total_label'); }
  get finish(): Locator { return this.page.getByRole('button', { name: 'Finish' }); }
  get completeHeader(): Locator { return this.page.locator('.complete-header'); }
  get backToProductsButton(): Locator { return this.page.getByRole('button', { name: 'Back Home' }); }
  async provideInfo(first: string, last: string, postal: string): Promise<void> {
    await this.firstName.fill(first); await this.lastName.fill(last); await this.postalCode.fill(postal);
  }
  private async amount(locator: Locator): Promise<number> {
    const match = (await locator.innerText()).match(/\$([\d.]+)/);
    if (!match) throw new Error(`Could not parse displayed amount: ${await locator.innerText()}`);
    return Number(match[1]);
  }
  async amounts(): Promise<{ subtotal: number; tax: number; total: number }> {
    return { subtotal: await this.amount(this.subtotal), tax: await this.amount(this.tax), total: await this.amount(this.total) };
  }
  async itemPrices(): Promise<number[]> {
    const values = await this.summaryItems.locator('.inventory_item_price').allTextContents();
    return values.map(value => Number(value.replace('$', '')));
  }
}
