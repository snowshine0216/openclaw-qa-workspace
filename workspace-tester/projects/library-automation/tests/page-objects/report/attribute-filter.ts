/**
 * Attribute element filter panel (consumption mode).
 * WDIO: attribute filter with element list, search, view selected.
 */
import type { Page } from '@playwright/test';

export class AttributeFilter {
  constructor(private readonly page: Page) {}

  /** Detailed panel / attribute element list container */
  getDetailedPanel() {
    return this.page.locator(
      '.qualification-panel-popover:not(.ant-popover-hidden) .ant-popover-content, .mstrd-FilterDetailsPanel'
    ).first();
  }

  /** Wait for element list loading */
  async waitForElementListLoading(): Promise<void> {
    await this.page.locator('.mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  /** Select attribute elements by name */
  async selectAttributeElements(names: string[]): Promise<void> {
    for (const name of names) {
      const cb = this.getDetailedPanel().locator(`[data-value="${name}"], input[value="${name}"]`).first();
      const byText = this.getDetailedPanel().locator('label, span').filter({ hasText: new RegExp(`^${name}$`, 'i') }).first();
      const el = cb.or(byText);
      await el.waitFor({ state: 'visible', timeout: 5000 });
      await el.click();
    }
  }

  /** Search in attribute filter */
  async attributeSearch(text: string): Promise<void> {
    const input = this.getDetailedPanel().locator('input[type="text"], input[placeholder*="Search"]').first();
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill(text);
    await this.page.waitForTimeout(500);
  }

  /** Toggle view selected / excluded */
  async toggleViewSelected(): Promise<void> {
    const toggle = this.getDetailedPanel().locator('button[role="switch"], [class*="toggle"]').first();
    await toggle.waitFor({ state: 'visible', timeout: 5000 });
    await toggle.click();
    await this.page.waitForTimeout(500);
  }

  /** Scroll element list to bottom */
  async scrollListToBottom(): Promise<void> {
    const list = this.getDetailedPanel().locator('[class*="list"], [role="listbox"]').first();
    await list.evaluate((el) => (el.scrollTop = el.scrollHeight));
    await this.page.waitForTimeout(500);
  }

  /** Select "Select in view" or similar */
  async selectInView(): Promise<void> {
    const btn = this.getDetailedPanel().getByRole('button', { name: /select in view|select all in view/i }).first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await this.page.waitForTimeout(500);
  }

  /** Get element list count */
  async getElementListCount(): Promise<number> {
    return this.getDetailedPanel().locator('[data-value], .attribute-elements-checkbox-container').count();
  }

  /** Click Done */
  async done(): Promise<void> {
    const btn = this.getDetailedPanel().getByRole('button', { name: /done|ok/i }).first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await this.page.waitForTimeout(500);
  }

  /** Sleep helper (for Required Validation toast) */
  async sleep(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
