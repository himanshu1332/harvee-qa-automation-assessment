const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { InventoryPage } = require('./pages/inventory.page');
const { CartPage } = require('./pages/cart.page');
const { CheckoutPage } = require('./pages/checkout.page');

const user = process.env.STANDARD_USER || 'standard_user';
const lockedUser = process.env.LOCKED_USER || 'locked_out_user';
const password = process.env.PASSWORD || 'secret_sauce';

async function signedIn(page) {
  const login = new LoginPage(page);
  await login.open();
  await login.login(user, password);
  return new InventoryPage(page);
}

test('TC01 standard user logs in', async ({ page }) => {
  const inventory = await signedIn(page);
  await expect(inventory.title).toBeVisible();
  await expect(page).toHaveURL(/inventory\.html/);
});

test('TC02 locked out user sees login error', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(lockedUser, password);
  await expect(login.error).toContainText('locked out');
  await expect(page).toHaveURL(/\/$/);
});

test('TC07 price low to high sorts the complete list', async ({ page }) => {
  const inventory = await signedIn(page);
  await inventory.sort.selectOption('lohi');
  const prices = await inventory.prices();
  expect(prices.length).toBeGreaterThan(1);
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test('TC10 two products add and one remove updates badge and cart', async ({ page }) => {
  const inventory = await signedIn(page);
  await inventory.addByName('Sauce Labs Backpack');
  await inventory.addByName('Sauce Labs Bike Light');
  await expect(inventory.cartBadge).toHaveText('2');
  await inventory.removeByName('Sauce Labs Backpack');
  await expect(inventory.cartBadge).toHaveText('1');
  await inventory.cartLink.click();
  const cart = new CartPage(page);
  await expect(cart.items).toHaveCount(1);
  await expect(cart.items).toContainText('Sauce Labs Bike Light');
});

test('TC14 complete checkout total matches item total plus tax and cart clears', async ({ page }) => {
  const inventory = await signedIn(page);
  await inventory.addByName('Sauce Labs Backpack');
  await inventory.addByName('Sauce Labs Bike Light');
  await inventory.cartLink.click();
  const cart = new CartPage(page);
  await cart.checkout.click();
  const checkout = new CheckoutPage(page);
  await checkout.provideInfo('Himanshu', 'Chaudhary', '560001');
  await checkout.continueButton.click();
  const itemPrices = await checkout.itemPrices();
  const amounts = await checkout.amounts();
  const expectedSubtotal = Math.round(itemPrices.reduce((sum, price) => sum + price, 0) * 100) / 100;
  expect(amounts.subtotal).toBe(expectedSubtotal);
  expect(amounts.total).toBeCloseTo(amounts.subtotal + amounts.tax, 2);
  await checkout.finish.click();
  await expect(checkout.completeHeader).toBeVisible();
  await page.getByTestId('back-to-products').click();
  await expect(inventory.cartBadge).toHaveCount(0);
});

test('TC15 checkout requires each customer field', async ({ page }) => {
  const inventory = await signedIn(page);
  await inventory.addByName('Sauce Labs Backpack');
  await inventory.cartLink.click();
  const cart = new CartPage(page);
  await cart.checkout.click();
  const checkout = new CheckoutPage(page);
  const missingFields = [
    { first: '', last: 'Chaudhary', postal: '560001', message: 'First Name is required' },
    { first: 'Himanshu', last: '', postal: '560001', message: 'Last Name is required' },
    { first: 'Himanshu', last: 'Chaudhary', postal: '', message: 'Postal Code is required' }
  ];
  for (const data of missingFields) {
    await checkout.provideInfo(data.first, data.last, data.postal);
    await checkout.continueButton.click();
    await expect(checkout.error).toContainText(data.message);
    await checkout.error.getByRole('button').click();
  }
});

test('TC20 products URL redirects logged out user to login', async ({ page }) => {
  await page.goto('/inventory.html');
  await expect(page).toHaveURL(/\/$/);
  await expect(new LoginPage(page).loginButton).toBeVisible();
});

test('TC14 complete checkout total matches item total plus tax and cart clears', async ({ page }) => {
  const inventory = await signedIn(page);
  await inventory.addByName('Sauce Labs Backpack');
  await inventory.addByName('Sauce Labs Bike Light');
  await inventory.cartLink.click();
  const cart = new CartPage(page);
  await cart.checkout.click();
  const checkout = new CheckoutPage(page);
  await checkout.provideInfo('Himanshu', 'Chaudhary', '560001');
  await checkout.continueButton.click();
  const itemPrices = await checkout.itemPrices();
  const amounts = await checkout.amounts();
  const expectedSubtotal = Math.round(itemPrices.reduce((sum, price) => sum + price, 0) * 100) / 100;
  expect(amounts.subtotal).toBe(expectedSubtotal);
  expect(amounts.total).toBeCloseTo(amounts.subtotal + amounts.tax, 2);
  await checkout.finish.click();
  await expect(checkout.completeHeader).toBeVisible();
  await expect(page.getByTestId('back-to-products')).toBeVisible();
  await page.getByTestId('back-to-products').click();
  await expect(inventory.cartBadge).toHaveCount(0);
});

test('TC15 checkout requires each customer field', async ({ page }) => {
  const inventory = await signedIn(page);
  await inventory.addByName('Sauce Labs Backpack');
  await inventory.cartLink.click();
  const cart = new CartPage(page);
  await cart.checkout.click();
  const checkout = new CheckoutPage(page);
  const missingFields = [
    { first: '', last: 'Chaudhary', postal: '560001', message: 'First Name is required' },
    { first: 'Himanshu', last: '', postal: '560001', message: 'Last Name is required' },
    { first: 'Himanshu', last: 'Chaudhary', postal: '', message: 'Postal Code is required' }
  ];
  for (const data of missingFields) {
    await checkout.provideInfo(data.first, data.last, data.postal);
    await checkout.continueButton.click();
    await expect(checkout.error).toContainText(data.message);
    await checkout.error.getByRole('button').click();
  }
});

test('TC20 products URL redirects logged out user to login', async ({ page }) => {
  await page.goto('/inventory.html');
  await expect(page).toHaveURL(/\/$/);
  await expect(new LoginPage(page).loginButton).toBeVisible();
});
