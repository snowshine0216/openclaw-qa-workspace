import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  // MicroStrategy Library uses #username, #password, #loginButton (WDIO LoginPage.js)
  // Use input[type="password"]#password to avoid matching "Set a new password" h2 or other elements.
  readonly usernameInput = this.page.locator('#username').or(this.page.getByLabel(/username|login|user/i));
  readonly passwordInput = this.page.locator('input#password[type="password"]');
  readonly loginButton = this.page
    .locator('#loginButton')
    .or(this.page.getByRole('button', { name: /log in|sign in|login/i }));

  async login(credentials: { username: string; password: string }): Promise<void> {
    await this.usernameInput.first().fill(credentials.username);
    const password = credentials.password ?? '';
    const hasPassword = password !== '' && password.toLowerCase() !== 'none';
    if (hasPassword) {
      await this.passwordInput.first().fill(password);
    } else {
      // When password is empty or "none", click the password field to satisfy
      // form focus/touch requirements, then click login (MicroStrategy Library).
      await this.passwordInput.first().click();
    }
    await this.loginButton.first().click();
  }
}
