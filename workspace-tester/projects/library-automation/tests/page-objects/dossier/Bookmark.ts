import type { Page } from '@playwright/test';

/**
 * Bookmark panel POM for report/dossier.
 * Migrated from WDIO dossier/Bookmark.js (Phase 2j reportCancel).
 */
export class Bookmark {
  constructor(private readonly page: Page) {}

  /** Bookmark icon in navbar */
  getBookmarkIcon() {
    return this.page.locator('.mstr-nav-icon.icon-tb_bookmarks_n:not([disabled])').first();
  }

  /** Bookmark panel dropdown */
  getPanel() {
    return this.page.locator('.mstrd-DropdownMenu-main').first();
  }

  /** Continue button in save dialog (WDIO: getContinueOnSaveDialog) */
  getContinueOnSaveDialog() {
    return this.page.locator('.mstrd-SaveChangesDialog-continueBtn').first();
  }

  /** Open bookmark panel */
  async openPanel(): Promise<void> {
    await this.getBookmarkIcon().click();
    await this.getPanel().waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(1000);
  }

  /** Apply bookmark by name in section (WDIO: applyBookmark) */
  async applyBookmark(
    name: string,
    sectionName: string,
    options?: { isWait?: boolean }
  ): Promise<void> {
    const section =
      sectionName === 'MY BOOKMARKS'
        ? this.page.locator('.mstrd-BookmarkDropdownMenuContainer-myBookmarks')
        : this.page.locator('.mstrd-BookmarkDropdownMenuContainer-sharedBookmarks');
    const bookmark = section.locator('.mstrd-BookmarkItem').filter({ hasText: name }).first();
    await bookmark.click();
    if (options?.isWait !== false) {
      await this.page.waitForTimeout(2000);
    }
  }

  /** Click element without waiting for loading (WDIO: clickAndNoWait) */
  async clickAndNoWait(options: { elem: import('@playwright/test').Locator }): Promise<void> {
    await options.elem.click();
  }
}
