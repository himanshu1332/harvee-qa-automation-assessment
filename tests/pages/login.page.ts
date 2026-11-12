import { Locator, Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}
  get username(): Locator { return this.page.getByRole('textbox', { name: 'Username' }); }
  get password(): Locator { return this.page.getByRole('textbox', { name: 'Password' }); }
  get loginButton(): Locator { return this.page.getByRole('button', { name: 'Login' }); }
  get error(): Locator { return this.page.locator('[data-test="error"]'); }
  async open(): Promise<void> { await this.page.goto('/'); }
  async login(user: string, password: string): Promise<void> {
    await this.username.fill(user);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
