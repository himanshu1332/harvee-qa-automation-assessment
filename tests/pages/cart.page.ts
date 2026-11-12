import { Locator, Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}
  get items(): Locator { return this.page.locator('.cart_item'); }
  get checkout(): Locator { return this.page.getByRole('button', { name: 'Checkout' }); }
  get continueShopping(): Locator { return this.page.getByRole('button', { name: 'Continue Shopping' }); }
  get cartBadge(): Locator { return this.page.locator('.shopping_cart_badge'); }
  item(name: string): Locator { return this.items.filter({ has: this.page.getByText(name, { exact: true }) }); }
  async names(): Promise<string[]> { return this.items.locator('.inventory_item_name').allTextContents(); }
  async removeByName(name: string): Promise<void> { await this.item(name).getByRole('button', { name: 'Remove' }).click(); }
}
