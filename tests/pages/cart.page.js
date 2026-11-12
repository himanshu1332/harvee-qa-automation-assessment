class CartPage {
  constructor(page) { this.page = page; }
  get items() { return this.page.getByTestId('inventory-item'); }
  get checkout() { return this.page.getByTestId('checkout'); }
  get continueShopping() { return this.page.getByTestId('continue-shopping'); }
  get cartBadge() { return this.page.getByTestId('shopping-cart-badge'); }
  async names() { return this.items.locator('.inventory_item_name').allTextContents(); }
}
module.exports = { CartPage };
