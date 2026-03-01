import type { Page } from '@playwright/test';

export class ReportPageBy {
  constructor(private readonly page: Page) {}

  private readonly pageByArea = this.page.locator('[aria-label="Page By"], [class*="pageby"], [class*="page-by"]').first();

  /** Wait for Page By area to be ready before interacting with selectors */
  async waitForPageByArea(timeout = 30000): Promise<void> {
    // Wait for mstrmojo-ReportPageBySelector to appear (actual DOM structure)
    await this.page
      .locator('.mstrmojo-ReportPageBySelector-Box, [class*="ReportPageBySelector-container"]')
      .first()
      .waitFor({ state: 'visible', timeout })
      .catch(() => {});
    await this.page.waitForTimeout(1500);
  }

  /** WDIO: getSelector(selectorName) - container with label. Matches mstrmojo-ReportPageBySelector-Box structure. */
  getSelector(selectorName: string) {
    return this.page
      .locator(
        `[class*="ReportPageBySelector-container"]:has(.mstrmojo-Label[aria-label="${selectorName}"]), ` +
          `[class*="ReportPageBySelector-container"]:has(.mstrmojo-Label:has-text("${selectorName}")), ` +
          `[class*="ReportPageBySelector-Box"]:has(.mstrmojo-Label:has-text("${selectorName}")), ` +
          `.mstrmojo-ReportPageBySelector-container:has(.mstrmojo-Label:has-text("${selectorName}")), ` +
          `[class*="ReportPageBySelector"]:has([class*="Label"]:has-text("${selectorName}"))`
      )
      .first();
  }

  /** WDIO: getSelectorPulldownTextBox - the dropdown trigger (mstrmojo-ui-Pulldown-text, role=combobox) */
  getSelectorPulldownTextBox(selectorName: string) {
    // Direct: container with Label[aria-label="Year"] -> [role="combobox"] (from actual DOM)
    const direct = this.page.locator(
      `[class*="ReportPageBySelector-container"]:has(.mstrmojo-Label[aria-label="${selectorName}"]) [role="combobox"]`
    );
    const viaSelector = this.getSelector(selectorName).locator(
      '.mstrmojo-ui-Pulldown-text, .pulldown-container [role="combobox"], ' +
      '[role="combobox"], .pulldown-container, [class*="Pulldown-text"]'
    );
    return direct.or(viaSelector).first();
  }

  /** WDIO: getElementFromPopupList - item in open dropdown */
  getElementFromPopupList(elementName: string) {
    const containers = this.page.locator(
      '.mstrmojo-PopupList:visible, [class*="PopupList"]:visible, [class*="popup-list"]:visible, ' +
      '.ant-dropdown:visible, .ant-select-dropdown:visible, [role="listbox"]:visible'
    );
    return containers
      .locator(
        `div.item:has-text("${elementName}"), [class*="item"]:has-text("${elementName}"), li:has-text("${elementName}"), ` +
        `[role="option"]:has-text("${elementName}"), [role="menuitem"]:has-text("${elementName}"), ` +
        `.ant-select-item:has-text("${elementName}"), .ant-tree-treenode:has-text("${elementName}")`
      )
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
    // Allow MicroStrategy .mstrmojo-PopupList to render before interacting
    await this.page.waitForTimeout(800);
  }

  /** WDIO: openSelectorContextMenu */
  async openSelectorContextMenu(selectorName: string): Promise<void> {
    const el = this.getSelector(selectorName);
    await el.waitFor({ state: 'visible', timeout: 20000 });
    await el.scrollIntoViewIfNeeded();
    await el.click({ button: 'right' });
    await this.page.waitForTimeout(1000);
  }

  /** WDIO: changePageByElement */
  async changePageByElement(selectorName: string, elementName: string): Promise<void> {
    await this.openDropdownFromSelector(selectorName);
    // Wait for the dropdown popup to be open before interacting with items.
    // MicroStrategy uses .mstrmojo-PopupList with display:block when visible.
    await this.page
      .locator(
        '.mstrmojo-PopupList:visible, .mstrmojo-PopupList[style*="display: block"], ' +
        '[class*="PopupList"]:visible, [class*="popup-list"]:visible'
      )
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });
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

  /** Click context menu option (e.g. Sort, Move) when menu is open from Page-by selector right-click.
   * For "Sort", uses exact match to avoid matching "Sort Ascending" or "Sort Descending". */
  async clickContextMenuOption(opt: string): Promise<void> {
    const mojoMenu = this.page.locator('.mstrmojo-ui-Menu.visible, .mstrmojo-ListBase.mstrmojo-ui-Menu.visible');
    const inMojoMenu = mojoMenu.locator(
      opt === 'Sort' ? 'a.mnu--page-by-sort' : 'a.mstrmojo-ui-Menu-item:has-text("' + opt + '")'
    );
    const exactMatch = opt === 'Sort';
    const textPattern = exactMatch ? /^Sort$/ : new RegExp(opt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const fallback = this.page.locator(
      '.mstr-context-menu li, .ant-dropdown-menu li, [role="menuitem"]'
    ).filter({ hasText: textPattern }).first();
    const item = inMojoMenu.or(fallback);
    await item.first().waitFor({ state: 'visible', timeout: 15000 });
    await item.first().click();
    await this.page.waitForTimeout(1500);
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
