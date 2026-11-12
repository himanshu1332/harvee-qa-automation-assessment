import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { InventoryPage } from './pages/inventory.page';
import { CartPage } from './pages/cart.page';
import { CheckoutPage } from './pages/checkout.page';
import { testConfig } from './support/test-config';

async function signIn(page: Page): Promise<InventoryPage> {
  const login = new LoginPage(page);
  await login.open();
  await login.login(testConfig.standardUser, testConfig.password);
  return new InventoryPage(page);
}

test('TC01 standard user logs in', async ({ page }) => {
  const inventory = await signIn(page);
  await expect(inventory.title).toBeVisible();
  await expect(page).toHaveURL(/inventory\.html/);
});

test('TC02 locked out user sees the expected error', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(testConfig.lockedUser, testConfig.password);
  await expect(login.error).toContainText('locked out');
  await expect(page).toHaveURL(/\/$/);
});

test('TC04 empty login fields show a validation error', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login('', '');
  await expect(login.error).toContainText('Username is required');
  await expect(page).toHaveURL(/\/$/);
});

test('TC07 price low to high sorts the entire catalog', async ({ page }) => {
  const inventory = await signIn(page);
  await inventory.sort.selectOption('lohi');
  const prices = await inventory.prices();
  expect(prices.length).toBeGreaterThan(1);
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test('TC09 product names sort A to Z and Z to A', async ({ page }) => {
  const inventory = await signIn(page);
  await inventory.sort.selectOption('az');
  const ascending = await inventory.names();
  expect(ascending).toEqual([...ascending].sort((a, b) => a.localeCompare(b)));
  await inventory.sort.selectOption('za');
  const descending = await inventory.names();
  expect(descending).toEqual([...descending].sort((a, b) => b.localeCompare(a)));
});

test('TC10 add two products and remove one on products page', async ({ page }) => {
  const inventory = await signIn(page);
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

test('TC12 removing an item from cart updates the contents and badge', async ({ page }) => {
  const inventory = await signIn(page);
  await inventory.addByName('Sauce Labs Backpack');
  await inventory.cartLink.click();
  const cart = new CartPage(page);
  await expect(cart.items).toHaveCount(1);
  await cart.removeByName('Sauce Labs Backpack');
  await expect(cart.items).toHaveCount(0);
  await expect(cart.cartBadge).toHaveCount(0);
});

test('TC14 full checkout reconciles total and empties the cart', async ({ page }) => {
  const inventory = await signIn(page);
  await inventory.addByName('Sauce Labs Backpack');
  await inventory.addByName('Sauce Labs Bike Light');
  await inventory.cartLink.click();
  const cart = new CartPage(page);
  await expect(inventory.cartBadge).toHaveText('2');
  await expect(cart.items).toHaveCount(2);
  await cart.checkout.click();
  const checkout = new CheckoutPage(page);
  await checkout.provideInfo('Himanshu', 'Chaudhary', '560001');
  await checkout.continueButton.click();
  const prices = await checkout.itemPrices();
  const amounts = await checkout.amounts();
  const expectedSubtotal = Math.round(prices.reduce((sum, price) => sum + price, 0) * 100) / 100;
  expect(amounts.subtotal).toBe(expectedSubtotal);
  expect(amounts.total).toBeCloseTo(amounts.subtotal + amounts.tax, 2);
  await checkout.finish.click();
  await expect(checkout.completeHeader).toBeVisible();
  await checkout.backToProductsButton.click();
  await expect(inventory.cartBadge).toHaveCount(0);
});

const missingCheckoutFieldCases = [
  { label: 'first name', first: '', last: 'Chaudhary', postal: '560001', message: 'First Name is required' },
  { label: 'last name', first: 'Himanshu', last: '', postal: '560001', message: 'Last Name is required' },
  { label: 'postal code', first: 'Himanshu', last: 'Chaudhary', postal: '', message: 'Postal Code is required' }
];

for (const data of missingCheckoutFieldCases) {
  test(`TC15 missing ${data.label} shows the required-field error`, async ({ page }) => {
    const inventory = await signIn(page);
    await inventory.addByName('Sauce Labs Backpack');
    await inventory.cartLink.click();

    const cart = new CartPage(page);
    await cart.checkout.click();

    const checkout = new CheckoutPage(page);
    await checkout.provideInfo(data.first, data.last, data.postal);
    await checkout.continueButton.click();

    await expect(checkout.error).toContainText(data.message);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(checkout.continueButton).toBeVisible();
  });
}

test('TC06 after logout direct products URL redirects to login', async ({ page }) => {
  const inventory = await signIn(page);
  await inventory.logout();
  await page.goto('/inventory.html');
  await expect(page).toHaveURL(/\/$/);
  await expect(new LoginPage(page).loginButton).toBeVisible();
});
