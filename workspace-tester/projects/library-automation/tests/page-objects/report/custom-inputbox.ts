/**
 * Custom input box for attribute qualification (ID form, list of values).
 * WDIO: CustomInputbox.
 */
import type { Page } from '@playwright/test';

export class CustomInputbox {
  constructor(private readonly page: Page) {}

  /** Current input (inline qualification value) */
  private get input() {
    return this.page.locator('.qualification-panel-popover input[type="text"], [data-feature-id="constant-input-box"] input').first();
  }

  async getCurrentInputText(): Promise<string> {
    await this.input.waitFor({ state: 'visible', timeout: 5000 });
    return (await this.input.inputValue())?.trim() ?? '';
  }

  async clearByKeyboard(): Promise<void> {
    await this.input.click();
    await this.page.keyboard.press('Control+a');
    await this.page.keyboard.press('Backspace');
    await this.page.waitForTimeout(200);
  }

  async inputListOfValue(text: string): Promise<void> {
    await this.input.fill(text);
    await this.page.waitForTimeout(200);
  }

  async tab(): Promise<void> {
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(200);
  }

  async validateAndWait(): Promise<void> {
    await this.page.waitForTimeout(1000);
  }

  async done(): Promise<void> {
    const btn = this.page.locator('.qualification-editor-footer-buttons span:has-text("Done"), button:has-text("Done")').first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await this.page.waitForTimeout(500);
  }
}
