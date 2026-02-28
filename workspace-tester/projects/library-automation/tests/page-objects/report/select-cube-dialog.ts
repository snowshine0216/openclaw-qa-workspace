import type { Page } from '@playwright/test';

/**
 * Select Cube / Dataset selector dialog for replace subset report cube.
 * Migrated from WDIO BaseObjectBrowser + ReportCubeBrowser.
 */
export class SelectCubeDialog {
  constructor(private readonly page: Page) {}

  private get container() {
    return this.page.locator('.dataset-selector-dialog').first();
  }

  private get objectListFlatView() {
    return this.container.locator('.mstr-object-browser-object-list');
  }

  private get searchInputBox() {
    return this.container.locator('.mstr-object-browser-search input');
  }

  private get searchLoadingIcon() {
    return this.page.locator('.search-loading-spinner');
  }

  private get primaryButton() {
    return this.container.locator('.mstr-rc-dialog-footer .ant-btn-primary, [aria-label="Done"]').first();
  }

  getDatasetSelectContainer() {
    return this.container;
  }

  private getItemInFlatViewByName(name: string) {
    return this.objectListFlatView.locator('.object-item-text').filter({ hasText: new RegExp(`^${name}$`, 'i') }).first();
  }

  async searchObject(name: string, options: { isValid?: boolean } = {}): Promise<void> {
    const { isValid = true } = options;
    await this.searchInputBox.waitFor({ state: 'visible', timeout: 5000 });
    await this.searchInputBox.click();
    await this.searchInputBox.clear();
    await this.searchInputBox.fill(name);
    await this.page.keyboard.press('Enter');
    await this.searchLoadingIcon.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    if (isValid) {
      await this.getItemInFlatViewByName(name).waitFor({ state: 'visible', timeout: 8000 });
    }
  }

  async selectObjectInFlatView(name: string): Promise<void> {
    await this.objectListFlatView.waitFor({ state: 'visible', timeout: 5000 });
    const item = this.getItemInFlatViewByName(name);
    await item.waitFor({ state: 'visible', timeout: 10000 });
    await item.click();
    await this.searchLoadingIcon.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  async navigateInObjectBrowserFlatView(paths: string[]): Promise<void> {
    for (const name of paths) {
      await this.selectObjectInFlatView(name);
    }
  }

  async clickDoneButton(): Promise<void> {
    await this.primaryButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.primaryButton.click();
    await this.container.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }
}
