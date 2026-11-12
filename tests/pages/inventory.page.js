class InventoryPage {
  constructor(page) { this.page = page; }
  get title() { return this.page.getByText('Products', { exact: true }); }
  get sort() { return this.page.getByTestId('product-sort-container'); }
  get cards() { return this.page.getByTestId('inventory-item'); }
  get cartBadge() { return this.page.getByTestId('shopping-cart-badge'); }
  get cartLink() { return this.page.getByTestId('shopping-cart-link'); }
  async names() { return this.cards.locator('.inventory_item_name').allTextContents(); }
  async prices() {
    const values = await this.cards.locator('.inventory_item_price').allTextContents();
    return values.map(v => Number(v.replace('$', '')));
  }
  async addByName(name) { await this.card(name).getByRole('button', { name: 'Add to cart' }).click(); }
  async removeByName(name) { await this.card(name).getByRole('button', { name: 'Remove' }).click(); }
  card(name) { return this.cards.filter({ has: this.page.getByText(name, { exact: true }) }); }
}
module.exports = { InventoryPage };
