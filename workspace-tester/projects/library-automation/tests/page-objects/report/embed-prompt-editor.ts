import type { Page } from '@playwright/test';

/**
 * Embedded prompt creation modal (Create Embedded Prompt).
 * Migrated from WDIO EmbedPromptEditor.js.
 */
export class EmbedPromptEditor {
  constructor(private readonly page: Page) {}

  private get container() {
    return this.page.locator('div.embeded-prompt-modal[role="dialog"]').first();
  }

  private get loadingIndicator() {
    return this.container.locator('.search-status.mstr-object-list-loading');
  }

  getPromptSummaryContainer() {
    return this.container.locator('.prompt-summary');
  }

  private get doneButton() {
    return this.container.locator('.ant-modal-footer .ant-btn-primary').first();
  }

  async waitForLoading(): Promise<void> {
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    await this.getPromptSummaryContainer().waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickDoneButton(): Promise<void> {
    await this.doneButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.doneButton.click();
    await this.container.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }
}
