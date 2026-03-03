import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  // MicroStrategy Library uses #username, #password, #loginButton (WDIO LoginPage.js)
  // Use input[type="password"]#password to avoid matching "Set a new password" h2 or other elements.
  readonly usernameInput = this.page.locator('#username').or(this.page.getByLabel(/username|login|user/i));
  readonly passwordInput = this.page.locator('input#password[type="password"], input.form-control[id="password"]');
  readonly loginButton = this.page
    .locator('#loginButton')
    .or(this.page.getByRole('button', { name: /log in|sign in|login/i }));
  readonly appContainer = this.page.locator(
    '.mstrd-AppContainer, .library-home, .mstrd-LibraryPage, .mstrd-NavBarWrapper, [class*="DossierGallery"]'
  );

  private async isLibraryLoaded(): Promise<boolean> {
    if (/(\/app|\/Home|\/Dashboard)/i.test(this.page.url())) {
      return true;
    }
    return this.appContainer.first().isVisible().catch(() => false);
  }

  /** WDIO: waitForLoginView - wait for creds login container before filling */
  async waitForLoginView(timeout = 60000): Promise<void> {
    const container = this.page.locator('.credsLoginContainer, #username, #StandardModeLabel, .login-modes-row').first();
    if (await this.isLibraryLoaded()) return;
    try {
      await container.waitFor({ state: 'visible', timeout });
    } catch (e) {
      if (await this.isLibraryLoaded()) return;
      const fs = require('fs');
      await this.page.screenshot({ path: '/tmp/test_timeout.png' }).catch(() => {});
      const html = await this.page.content().catch(() => '');
      fs.writeFileSync('/tmp/test_timeout.html', html);
      fs.writeFileSync('/tmp/test_timeout_url.txt', this.page.url());
      throw e;
    }
  }

  /** WDIO: switchToStandardTab - click Standard mode if LDAP/SAML is default */
  async switchToStandardTabIfNeeded(): Promise<void> {
    const standardTab = this.page.locator('#StandardModeLabel');
    if (await standardTab.isVisible().catch(() => false)) {
      await standardTab.click();
      await this.page.waitForTimeout(500);
    }
  }

  async login(credentials: { username: string; password: string }): Promise<void> {
    await this.waitForLoginView();
    if (await this.isLibraryLoaded()) return;
    await this.switchToStandardTabIfNeeded();
    const usernameEl = this.usernameInput.first();
    const usernameVisible = await usernameEl.isVisible().catch(() => false);
    if (!usernameVisible) {
      await this.switchToStandardTabIfNeeded();
      if (await this.isLibraryLoaded()) return;
      await usernameEl.waitFor({ state: 'visible', timeout: 10000 });
    }
    await usernameEl.fill(credentials.username);
    const password = credentials.password ?? '';
    const hasPassword = password !== '' && password.toLowerCase() !== 'none';
    if (hasPassword) {
      const passwordEl = this.passwordInput.first();
      await passwordEl.waitFor({ state: 'visible', timeout: 5000 });
      await passwordEl.fill(password);
    }
    // If password is empty, directly click login button without attempting to type
    const loginEl = this.loginButton.first();
    await loginEl.waitFor({ state: 'visible', timeout: 10000 });
    await loginEl.click({ force: true });
    await Promise.race([
      this.page.waitForURL((url) => !/\/auth\/(ui\/)?login/i.test(url.href), { timeout: 30000 }),
      this.page.locator('.mstrd-AppContainer, .library-home, .mstrd-LibraryPage, .mstrd-NavBarWrapper').first().waitFor({ state: 'visible', timeout: 30000 }),
    ]).catch(() => {});
  }
}
