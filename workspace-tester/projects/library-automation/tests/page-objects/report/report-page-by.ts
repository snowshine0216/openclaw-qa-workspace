import type { Page } from '@playwright/test';

export class ReportPageBy {
  constructor(private readonly page: Page) {}

  private readonly pageByArea = this.page.locator('[aria-label="Page By"], [class*="pageby"], [class*="page-by"]').first();

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private normalizeSelectorText(raw: string): string {
    const compact = raw.replace(/\s+/g, ' ').trim();
    if (!compact) return '';
    const duplicatedPrefix = compact.match(/^(.{2,120}?)\1/);
    if (duplicatedPrefix?.[1]) {
      return duplicatedPrefix[1].trim();
    }
    return compact;
  }

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

  /** WDIO: getSelector(selectorName) - container with label. Matches mstrmojo-ReportPageBySelector-Box structure.
   * Optional fallbacks: try label variants when exact match fails (e.g. "Season" for "Seasons", "Metric" for "Metrics"). */
  getSelector(selectorName: string, fallbacks?: string[]) {
    const labels = [selectorName, ...(fallbacks ?? [])];
    const locators = labels.flatMap((label) => {
      const exactLabel = new RegExp(`^\\s*${this.escapeRegExp(label)}\\s*$`, 'i');
      const byAria = this.page.locator(
        `.mstrmojo-ReportPageBySelector-container:has(.mstrmojo-Label[aria-label="${label}"]), ` +
          `[class*="ReportPageBySelector-container"]:has(.mstrmojo-Label[aria-label="${label}"])`
      );
      const byExactLabel = this.page
        .locator(
          '.mstrmojo-ReportPageBySelector-container, [class*="ReportPageBySelector-container"], [class*="ReportPageBySelector-Box"]'
        )
        .filter({
          has: this.page.locator('.mstrmojo-Label, [class*="Label"]').filter({ hasText: exactLabel }),
        });
      return [byAria, byExactLabel];
    });
    let result = locators[0]!;
    for (let i = 1; i < locators.length; i++) {
      result = result.or(locators[i]!);
    }
    return result.first();
  }

  /** WDIO: getSelectorPulldownTextBox - the dropdown trigger (mstrmojo-ui-Pulldown-text, role=combobox) */
  getSelectorPulldownTextBox(selectorName: string, fallbacks?: string[]) {
    const inSelector = this.getSelector(selectorName, fallbacks).locator(
      '.mstrmojo-ui-Pulldown-text, .pulldown-container [role="combobox"], [role="combobox"], .pulldown-container, [class*="Pulldown-text"]'
    );
    const labels = [selectorName, ...(fallbacks ?? [])];
    const directByAria = labels
      .map(
        (label) =>
          `[class*="ReportPageBySelector-container"]:has(.mstrmojo-Label[aria-label="${label}"]) .mstrmojo-ui-Pulldown-text, ` +
          `[class*="ReportPageBySelector-container"]:has(.mstrmojo-Label[aria-label="${label}"]) [role="combobox"]`
      )
      .join(', ');
    return inSelector.or(this.page.locator(directByAria)).first();
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

  private getVisiblePopupList() {
    return this.page.locator(
      '.mstrmojo-PopupList:visible, [class*="PopupList"]:visible, [class*="popup-list"]:visible, ' +
      '.ant-dropdown:visible, .ant-select-dropdown:visible, [role="listbox"]:visible'
    ).first();
  }

  private async waitForPopupListVisible(timeout = 10000): Promise<void> {
    await this.getVisiblePopupList().waitFor({ state: 'visible', timeout });
  }

  getVisiblePopupListLocator() {
    return this.getVisiblePopupList();
  }

  async getPageBySelectorText(selector: string, fallbacks?: string[]): Promise<string> {
    const selectorEl = this.getSelector(selector, fallbacks);
    await selectorEl.waitFor({ state: 'visible', timeout: 20000 });

    const pulldown = this.getSelectorPulldownTextBox(selector, fallbacks);
    await pulldown.waitFor({ state: 'visible', timeout: 20000 });

    for (const attr of ['aria-valuetext', 'value', 'title', 'aria-label'] as const) {
      const attrValue = (await pulldown.getAttribute(attr))?.trim();
      if (attrValue && attrValue.toLowerCase() !== selector.toLowerCase()) {
        return this.normalizeSelectorText(attrValue);
      }
    }

    const candidate = selectorEl
      .locator(
        '.mstrmojo-ui-Pulldown-text > .mstrmojo-Label, .mstrmojo-ui-Pulldown-text > span, ' +
        '.mstrmojo-ui-Pulldown-text, [role="combobox"]'
      )
      .first();
    const raw = (await candidate.textContent({ timeout: 20000 })) ?? '';
    return this.normalizeSelectorText(raw);
  }

  async removePageBy(name: string): Promise<void> {
    const el = this.page.locator('[class*="pageby"], [class*="page-by"]').getByText(name).first();
    await el.click({ button: 'right' });
    await this.page.getByRole('menuitem', { name: /remove|delete/i }).click({ timeout: 3000 }).catch(() => {});
  }

  /** WDIO: openDropdownFromSelector */
  async openDropdownFromSelector(selectorName: string, timeout = 20000, fallbacks?: string[]): Promise<void> {
    const el = this.getSelectorPulldownTextBox(selectorName, fallbacks);
    await el.waitFor({ state: 'visible', timeout });
    await el.scrollIntoViewIfNeeded();
    await el.click({ force: true });
    try {
      await this.waitForPopupListVisible(5000);
      return;
    } catch {
      // Retry with keyboard in case click focuses combobox but does not open list.
      await el.click({ force: true });
      await this.page.keyboard.press('ArrowDown').catch(() => {});
      await this.waitForPopupListVisible(10000);
    }
  }

  /** WDIO: openSelectorContextMenu */
  async openSelectorContextMenu(selectorName: string, fallbacks?: string[]): Promise<void> {
    const labels = [selectorName, ...(fallbacks ?? [])];
    for (const lbl of labels) {
      const label = this.page.locator(`.mstrmojo-ReportPageBySelector-container .mstrmojo-Label[aria-label="${lbl}"]`).first();
      if ((await label.count()) > 0) {
        await label.waitFor({ state: 'visible', timeout: 20000 });
        await label.scrollIntoViewIfNeeded();
        await label.click({ button: 'right', force: true });
        await this.page.waitForTimeout(800);
        return;
      }
    }

    let el = this.getSelector(selectorName, fallbacks);
    await el.waitFor({ state: 'visible', timeout: 20000 });
    await el.scrollIntoViewIfNeeded();
    const menu = this.page.locator(
      '.mstrmojo-ui-Menu.visible, .mstrmojo-ListBase.mstrmojo-ui-Menu.visible, .mstr-context-menu:not(.ant-dropdown-hidden), .ant-dropdown:visible, [role="menu"]'
    );
    await el.click({ button: 'right', force: true });
    if (await menu.first().isVisible().catch(() => false)) return;

    // Retry on combobox element in the selector in case the container swallows right click.
    const pulldown = this.getSelectorPulldownTextBox(selectorName, fallbacks);
    await pulldown.click({ button: 'right', force: true }).catch(() => {});
    if (await menu.first().isVisible().catch(() => false)) return;

    // Keyboard context-menu fallback.
    await el.click({ force: true });
    await this.page.keyboard.press('Shift+F10').catch(() => {});
    await this.page.waitForTimeout(800);
  }

  async openLastSelectorContextMenu(): Promise<void> {
    let target = this.page.locator('.mstrmojo-ReportPageBySelector-container .mstrmojo-Label').last();
    if ((await target.count()) === 0) {
      target = this.page.locator('.mstrmojo-ReportPageBySelector-container').last();
    }
    await target.waitFor({ state: 'visible', timeout: 20000 });
    await target.scrollIntoViewIfNeeded();
    await target.click({ button: 'right', force: true });
    await this.page.waitForTimeout(800);
  }

  /** WDIO: changePageByElement */
  async changePageByElement(selectorName: string, elementName: string, fallbacks?: string[]): Promise<void> {
    const popupList = this.getVisiblePopupList();
    const escaped = this.escapeRegExp(elementName);
    const exactText = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    const looseText = new RegExp(`\\b${escaped}\\b`, 'i');
    const popupItems = popupList.locator(
      'div.item, [class*="item"], li, [role="option"], [role="menuitem"], .ant-select-item, .ant-tree-treenode, span'
    );
    const exactItem = popupItems.filter({ hasText: exactText }).first();
    const looseItem = popupItems.filter({ hasText: looseText }).first();

    const clickPopupItem = async (timeoutMs: number): Promise<boolean> => {
      const item = this.getElementFromPopupList(elementName).or(exactItem).or(looseItem).first();
      try {
        await item.waitFor({ state: 'visible', timeout: timeoutMs });
        await item.click({ force: true });
        return true;
      } catch {
        return false;
      }
    };

    await this.openDropdownFromSelector(selectorName, 20000, fallbacks);
    await this.waitForPopupListVisible(10000);

    // Primary attempt, then one re-open attempt to handle transient stale overlays.
    const selected = await clickPopupItem(12000);
    if (!selected) {
      const availableValues = (await popupItems.allTextContents())
        .map((t) => t.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .slice(0, 20);
      await this.page.keyboard.press('Escape').catch(() => {});
      await this.page.waitForTimeout(300);
      await this.openDropdownFromSelector(selectorName, 20000, fallbacks);
      await this.waitForPopupListVisible(10000);

      const selectedOnRetry = await clickPopupItem(12000);
      if (!selectedOnRetry) {
        // Final fallback: editable combobox path (type value + Enter)
        const combo = this.getSelectorPulldownTextBox(selectorName, fallbacks);
        await combo.click({ force: true }).catch(() => {});
        await combo.fill(elementName).catch(async () => {
          await combo.press('Meta+a').catch(() => combo.press('Control+a').catch(() => {}));
          await this.page.keyboard.type(elementName).catch(() => {});
        });
        await this.page.keyboard.press('Enter').catch(() => {});
        await this.page.waitForTimeout(800);
        const textAfter = await this.getPageBySelectorText(selectorName, fallbacks);
        if (!new RegExp(escaped, 'i').test(textAfter)) {
          throw new Error(
            `Page By value "${elementName}" not found for selector "${selectorName}". ` +
            `Visible options: ${availableValues.join(' | ')}`
          );
        }
      }
    }

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
    if (opt === 'Sort') {
      const exactSort = this.page.locator(
        '.mstrmojo-ListBase.mstrmojo-ui-Menu.visible a.mnu--page-by-sort, ' +
        '.mstrmojo-ListBase.mstrmojo-ui-Menu a.mnu--page-by-sort'
      ).first();
      // Exact "Sort" only — exclude "Sort Ascending" and "Sort Descending"
      const fallbackSort = this.page
        .locator('.mstr-context-menu li, .ant-dropdown-menu li, [role="menuitem"]')
        .filter({ hasText: /^\s*Sort\s*$/i })
        .first();
      const sortItem = exactSort.or(fallbackSort).first();
      await sortItem.waitFor({ state: 'visible', timeout: 15000 });
      await sortItem.click({ force: true });
      await this.page.waitForTimeout(1200);
      return;
    }

    const mojoMenu = this.page.locator('.mstrmojo-ui-Menu.visible, .mstrmojo-ListBase.mstrmojo-ui-Menu.visible');
    const inMojoMenu = mojoMenu.locator(
      opt === 'Sort' ? 'a.mnu--page-by-sort' : 'a.mstrmojo-ui-Menu-item:has-text("' + opt + '")'
    );
    const textPattern =
      opt === 'Sort'
        ? /sort/i
        : new RegExp(opt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
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
