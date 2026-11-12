import { Locator, Page } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}
  get title(): Locator { return this.page.getByText('Products', { exact: true }); }
  get sort(): Locator { return this.page.getByRole('combobox', { name: 'Sort products' }); }
  get cards(): Locator { return this.page.locator('.inventory_item'); }
  get cartBadge(): Locator { return this.page.locator('.shopping_cart_badge'); }
  get cartLink(): Locator { return this.page.getByRole('button', { name: /Cart/ }); }
  get menuButton(): Locator { return this.page.getByRole('button', { name: 'Open Menu' }); }
  get logoutLink(): Locator { return this.page.getByRole('button', { name: 'Logout' }); }
  async names(): Promise<string[]> { return this.cards.locator('.inventory_item_name').allTextContents(); }
  async prices(): Promise<number[]> {
    const values = await this.cards.locator('.inventory_item_price').allTextContents();
    return values.map(value => Number(value.replace('$', '')));
  }
  card(name: string): Locator { return this.cards.filter({ has: this.page.getByText(name, { exact: true }) }); }
  async addByName(name: string): Promise<void> { await this.card(name).getByRole('button', { name: 'Add to cart' }).click(); }
  async removeByName(name: string): Promise<void> { await this.card(name).getByRole('button', { name: 'Remove' }).click(); }
  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
  }
}
