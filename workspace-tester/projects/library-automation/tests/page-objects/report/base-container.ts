import type { Page } from '@playwright/test';

/** Lean POM for report visualization container. */
export class BaseContainer {
  constructor(private readonly page: Page) {}

  /** Dismiss color picker (WDIO: baseFormatPanelReact.dismissColorPicker) */
  async dismissColorPicker(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
    const outside = this.page.locator('body');
    await outside.click({ position: { x: 0, y: 0 }, force: true }).catch(() => {});
  }

  /** Click on visualization container by name (e.g. "Visualization 1") */
  async clickContainerByScript(name: string): Promise<void> {
    const container = this.page.locator(
      `[class*="mstrmojo-VIBox"]:has-text("${name}"), [class*="vi-box"]:has-text("${name}")`
    ).first();
    await container.waitFor({ state: 'visible', timeout: 10000 });
    await container.click();
    await this.page.waitForTimeout(500);
  }
}
