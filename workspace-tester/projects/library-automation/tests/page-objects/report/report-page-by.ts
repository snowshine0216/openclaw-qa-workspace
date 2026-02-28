import type { Page } from '@playwright/test';

export class ReportPageBy {
  constructor(private readonly page: Page) {}

  private readonly pageByArea = this.page.locator('[aria-label="Page By"], [class*="pageby"], [class*="page-by"]').first();

  /** WDIO: getSelector(selectorName) - container with label */
  getSelector(selectorName: string) {
    return this.page
      .locator(
        `.mstrmojo-ReportPageBySelector-container:has(.mstrmojo-Label:has-text("${selectorName}")), ` +
          `[class*="ReportPageBySelector-container"]:has([class*="Label"]:has-text("${selectorName}"))`
      )
      .first();
  }

  /** WDIO: getSelectorPulldownTextBox - the dropdown trigger text */
  getSelectorPulldownTextBox(selectorName: string) {
    const selector = this.getSelector(selectorName);
    // Enhanced selector with more fallbacks for different DOM structures
    return selector.locator(
      '.pulldown-container, [class*="Pulldown-text"], [class*="pulldown"], [class*="Pulldown"], ' +
      '[role="combobox"], [class*="trigger"], .ant-select-selector, ' +
      '[class*="select"], [class*="dropdown"], .mstrmojo-Dropdown'
    ).first();
  }

  /** WDIO: getElementFromPopupList - item in open dropdown */
  getElementFromPopupList(elementName: string) {
    return this.page
      .locator('[class*="PopupList"]:visible, [class*="popup-list"]:visible, .ant-dropdown:visible')
      .locator(`[class*="item"]:has-text("${elementName}"), li:has-text("${elementName}")`)
      .first();
  }

  async getPageBySelectorText(selector: string): Promise<string> {
    const el = this.getSelectorPulldownTextBox(selector);
    // Increased timeout from 5s to 20s for slower dev environments
    return el.textContent({ timeout: 20000 }).then((t) => t?.trim() ?? '') ?? '';
  }

  async removePageBy(name: string): Promise<void> {
    const el = this.page.locator('[class*="pageby"], [class*="page-by"]').getByText(name).first();
    await el.click({ button: 'right' });
    await this.page.getByRole('menuitem', { name: /remove|delete/i }).click({ timeout: 3000 }).catch(() => {});
  }

  /** WDIO: openDropdownFromSelector */
  async openDropdownFromSelector(selectorName: string, timeout = 20000): Promise<void> {
    const el = this.getSelectorPulldownTextBox(selectorName);
    await el.waitFor({ state: 'visible', timeout });
    await el.scrollIntoViewIfNeeded();
    await el.click();
    await this.page.waitForTimeout(500);
  }

  /** WDIO: openSelectorContextMenu */
  async openSelectorContextMenu(selectorName: string): Promise<void> {
    const el = this.getSelector(selectorName);
    // Increased timeout from 5s to 20s for slower dev environments
    await el.waitFor({ state: 'visible', timeout: 20000 });
    await el.click({ button: 'right' });
    await this.page.waitForTimeout(1000);
  }

  /** WDIO: changePageByElement */
  async changePageByElement(selectorName: string, elementName: string): Promise<void> {
    await this.openDropdownFromSelector(selectorName);
    const item = this.getElementFromPopupList(elementName);
    // Increased timeout from 10s to 20s for slower dev environments
    await item.waitFor({ state: 'visible', timeout: 20000 });
    await item.click();
    await this.page.waitForTimeout(2000);
  }

  async openDisplayAttributeFormsDialog(_attr: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  async getSelectorNameByIdx(idx: number): Promise<string> {
    return (await this.getSelectorByIdx(idx).getText()) || '';
  }

  /** Click context menu option (e.g. Sort, Move) when menu is open from Page-by selector right-click */
  async clickContextMenuOption(opt: string): Promise<void> {
    // Use getByText for more flexible text matching
    const item = this.page.getByText(opt, { exact: true }).first();
    await item.waitFor({ state: 'visible', timeout: 15000 });
    await item.click();
    await this.page.waitForTimeout(500);
  }

  /** WDIO: clickChecklistElementInContextMenu - click checkbox/item in Add Attributes / Show Metrics submenu */
  async clickChecklistElementInContextMenu(elementName: string): Promise<void> {
    const item = this.page
      .locator(
        '[class*="PopupList"]:visible, [class*="popup-list"]:visible, .ant-dropdown:visible, .mstr-rc-context-submenu-wrapper'
      )
      .locator(`[class*="item"]:has-text("${elementName}"), li:has-text("${elementName}")`)
      .first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
    await this.page.waitForTimeout(500);
  }

  /** WDIO: getSelectedChecklistElementInContextMenu - returns whether checkbox for element is checked (visible) */
  async getSelectedChecklistElementInContextMenu(elementName: string): Promise<{ isDisplayed: () => Promise<boolean> }> {
    const item = this.page
      .locator(
        '[class*="PopupList"]:visible, [class*="popup-list"]:visible, .ant-dropdown:visible'
      )
      .locator(`[class*="item"]:has-text("${elementName}"), li:has-text("${elementName}")`)
      .locator('[class*="checked"], .ant-checkbox-checked, [class*="selected"]')
      .first();
    return {
      isDisplayed: async () => item.isVisible(),
    };
  }

  /** WDIO: saveAndCloseContextMenu - click OK button in context menu */
  async saveAndCloseContextMenu(): Promise<void> {
    const okBtn = this.page
      .locator('.mstr-context-menu:not(.ant-dropdown-hidden), .ant-dropdown:visible')
      .getByRole('button', { name: /^OK$/i })
      .or(this.page.locator('.mstr-context-menu li:has-text("OK"), .ant-dropdown-menu li:has-text("OK")'))
      .first();
    await okBtn.waitFor({ state: 'visible', timeout: 5000 });
    await okBtn.click();
    await this.page.waitForTimeout(2000);
  }

  /** WDIO: getSelectorByIdx - get page-by selector at index (0-based); returns locator with getText */
  getSelectorByIdx(idx: number) {
    const selector = this.page
      .locator(
        '[class*="ReportPageBySelector"], [class*="pageby"] [class*="selector"], [class*="page-by"] [class*="selector"]'
      )
      .nth(idx);
    return {
      getText: async (): Promise<string> => {
        const el = selector.locator('.mstrmojo-Label, [class*="Label"], span').first();
        return (await el.textContent({ timeout: 5000 }))?.trim() ?? '';
      },
    };
  }

  /** WDIO: getIndexForElementFromPopupList - index of element in open dropdown (0-based as string) */
  async getIndexForElementFromPopupList(elementName: string): Promise<string> {
    const list = this.page.locator(
      '[class*="PopupList"]:visible [class*="item"], [class*="popup-list"]:visible li, .ant-dropdown:visible li'
    );
    const count = await list.count();
    for (let i = 0; i < count; i++) {
      const text = await list.nth(i).textContent();
      if (text?.trim().includes(elementName)) {
        return String(i);
      }
    }
    return '-1';
  }

  /** WDIO: getElementFromPopupList - returns locator; use .isVisible() for assertion */
  getElementFromPopupListLocator(elementName: string) {
    return this.getElementFromPopupList(elementName);
  }

  /** WDIO: moveGridHeaderToPageBy - grid column header context menu > Move > To Page-by */
  async moveGridHeaderToPageBy(columnName: string): Promise<void> {
    const header = this.page
      .locator('.ag-header-cell, [role="columnheader"]')
      .filter({ hasText: new RegExp(`^${columnName}$`, 'i') })
      .first();
    await header.waitFor({ state: 'visible', timeout: 10000 });
    await header.click({ button: 'right' });
    await this.page.waitForTimeout(1000);
    await this.clickContextMenuOption('Move');
    await this.clickContextMenuOption('To Page-by');
    await this.page.waitForTimeout(2000);
  }
}
