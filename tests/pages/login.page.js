class LoginPage {
  constructor(page) { this.page = page; }
  get username() { return this.page.getByTestId('username'); }
  get password() { return this.page.getByTestId('password'); }
  get loginButton() { return this.page.getByTestId('login-button'); }
  get error() { return this.page.getByTestId('error'); }
  async open() { await this.page.goto('/'); }
  async login(user, password) {
    await this.username.fill(user);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
module.exports = { LoginPage };
