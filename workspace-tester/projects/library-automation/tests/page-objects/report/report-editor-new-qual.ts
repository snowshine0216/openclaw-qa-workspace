import type { Page } from '@playwright/test';

/**
 * New qualification editor (Based on search, Create Embedded Prompt) in report filter.
 * Migrated from WDIO ReportEditorNewQual.js + NewQual.js.
 */
export class ReportEditorNewQual {
  constructor(private readonly page: Page) {}

  private get objectSearchDropdown() {
    return this.page.locator('.object-search-pulldown-dropdown:not(.ant-select-dropdown-hidden)').first();
  }

  private get editorContainer() {
    return this.page.locator('.qualification-panel-popover:not(.ant-popover-hidden) .mstr-qualification-editor.mode-authoring').first();
  }

  getDetailedPanel() {
    return this.editorContainer;
  }

  getCreateEmbeddedPromptButton() {
    return this.page.locator('.mstr-embedded-prompt-creation-button').first();
  }

  getSearchbox() {
    return this.editorContainer.locator('.object-search-pulldown.mstr-searchable-pulldown').first();
  }

  private getSearchBasedOnObject(objName: string) {
    return this.objectSearchDropdown.locator('.ant-select-item').filter({ hasText: new RegExp(`^${objName}$`, 'i') }).first();
  }

  async waitForObjectSearchDropdown(): Promise<void> {
    await this.objectSearchDropdown.waitFor({ state: 'visible', timeout: 10000 });
  }

  async selectBasedOnObject(objName: string): Promise<void> {
    await this.getSearchBasedOnObject(objName).waitFor({ state: 'visible', timeout: 8000 });
    await this.getSearchBasedOnObject(objName).click();
    await this.editorContainer.waitFor({ state: 'visible', timeout: 5000 });
  }

  async searchBasedOn(searchText: string): Promise<void> {
    await this.getSearchbox().click();
    await this.page.waitForTimeout(500);
    await this.page.keyboard.type(searchText);
    await this.objectSearchDropdown.waitFor({ state: 'visible', timeout: 5000 });
  }

  async clickCreateEmbeddedPrompt(): Promise<void> {
    await this.getCreateEmbeddedPromptButton().waitFor({ state: 'visible', timeout: 5000 });
    await this.getCreateEmbeddedPromptButton().click();
  }

  async done(): Promise<void> {
    const doneBtn = this.page.locator('.qualification-editor-footer-buttons span:has-text("Done")').first();
    await doneBtn.waitFor({ state: 'visible', timeout: 5000 });
    await doneBtn.click();
  }
}
