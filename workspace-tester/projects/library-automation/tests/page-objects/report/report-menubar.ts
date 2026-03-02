import type { Page } from '@playwright/test';

/**
 * Report menubar for View/Format etc. Migrated from WDIO ReportMenubar.js.
 */
export class ReportMenubar {
  constructor(private readonly page: Page) {}

  readonly menubar = this.page.locator('.mstr-menubar').first();

  getActiveMenuDropdown() {
    return this.page.locator('.mstrd-DropDown-content:not(.mstrd-DropDown-content--collapsed)').first();
  }

  async clickMenuItem(menuItem: string): Promise<void> {
    const item = this.page.locator(`div[class*="menu-item-name"]:has-text("${menuItem}")`).first();
    await item.click();
    await this.page.waitForTimeout(500);
  }

  async clickSubMenuItem(menuItem: string, subMenuItem: string): Promise<void> {
    await this.clickMenuItem(menuItem);
    const subItem = this.page.locator('.mstrd-DropDown-content').locator(`*:has-text("${subMenuItem}")`).first();
    await subItem.click();
    await this.page.locator('[aria-label="Loading..."] .mstr-rc-loading-dot-icon').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }
}
