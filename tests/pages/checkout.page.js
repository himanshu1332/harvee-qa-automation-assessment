class CheckoutPage {
  constructor(page) { this.page = page; }
  get firstName() { return this.page.getByTestId('firstName'); }
  get lastName() { return this.page.getByTestId('lastName'); }
  get postalCode() { return this.page.getByTestId('postalCode'); }
  get continueButton() { return this.page.getByTestId('continue'); }
  get cancelButton() { return this.page.getByTestId('cancel'); }
  get error() { return this.page.getByTestId('error'); }
  get summaryItems() { return this.page.getByTestId('inventory-item'); }
  get subtotal() { return this.page.locator('.summary_subtotal_label'); }
  get tax() { return this.page.locator('.summary_tax_label'); }
  get total() { return this.page.locator('.summary_total_label'); }
  get finish() { return this.page.getByTestId('finish'); }
  get completeHeader() { return this.page.getByTestId('complete-header'); }
  async provideInfo(first, last, postal) {
    if (first !== undefined) await this.firstName.fill(first);
    if (last !== undefined) await this.lastName.fill(last);
    if (postal !== undefined) await this.postalCode.fill(postal);
  }
  async amounts() {
    const parse = async locator => Number((await locator.innerText()).match(/\$([\d.]+)/)[1]);
    return { subtotal: await parse(this.subtotal), tax: await parse(this.tax), total: await parse(this.total) };
  }
  async itemPrices() {
    const values = await this.summaryItems.locator('.inventory_item_price').allTextContents();
    return values.map(v => Number(v.replace('$', '')));
  }
}
module.exports = { CheckoutPage };
