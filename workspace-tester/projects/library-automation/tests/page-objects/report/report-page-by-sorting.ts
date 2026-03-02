import type { Page } from '@playwright/test';

/**
 * Page object for the Page-by Sorting dialog in Report Editor.
 * Migrated from WDIO ReportPageBySorting.js
 */
export class ReportPageBySorting {
  constructor(private readonly page: Page) {}

  get dialog() {
    return this.page.locator(
      '.mstr-rc-dialog.sort-options-dialog, [class*="sort-options-dialog"], ' +
      '[class*="SortEditor"], [class*="sort-editor"]'
    );
  }

  private getSortingRow(idx: number) {
    return this.dialog.locator('.sort-row').nth(idx - 1);
  }

  private getSortingColumn(row: number, col: 'Sort By' | 'Criteria' | 'Order' | 'Total Position' | 'Parent Position' | 'Placeholder' | 'Remove') {
    const colIdx = {
      'Sort By': 1,
      Criteria: 2,
      Order: 3,
      'Total Position': 4,
      'Parent Position': 5,
      Placeholder: 1,
      Remove: -1,
    }[col];
    const rowEl = this.getSortingRow(row);
    if (col === 'Remove') {
      return rowEl.locator('.sort-remove-icon');
    }
    if (col === 'Placeholder') {
      return rowEl.locator('.ant-col').nth(1).locator('.current-type');
    }
    return rowEl.locator('.ant-col').nth(colIdx);
  }

  getSortingColumnByRowAndCol(row: number, col: string) {
    return this.getSortingColumn(row, col as 'Sort By');
  }

  getCurrentSelectionOnSortingColumnByRowAndCol(row: number, col: string, txt: string) {
    const rowEl = this.getSortingRow(row);
    if (col === 'Sort By') {
      // Flexible: .sort-object-name or any element in row containing the text
      return rowEl.locator(`.sort-object-name, .ant-space-item, [class*="sort"]`).filter({ hasText: txt }).first();
    }
    return rowEl.locator(`.ant-space-item:has-text("${txt}"), [class*="sort"]:has-text("${txt}")`).first();
  }

  /** WDIO: getSortByObjectText - text element for Sort By column on row */
  getSortByObjectText(row: number) {
    return this.getSortingRow(row).locator('.sort-object-name');
  }

  /** WDIO: getDropDownItem - dropdown menu item by row, column, and label.
   * Scopes to visible Sort dialog overlays to avoid REPORT panel / dataset browser.
   * Supports partial match when usePartialMatch is true (for hierarchy labels like "Month (Attribute)").
   */
  getDropDownItem(row: number, col: string, item: string, usePartialMatch = false) {
    const textMatcher = usePartialMatch ? new RegExp(item, 'i') : item;

    // Scope to visible dropdown overlays (Sort dialog uses ant-select-dropdown or ant-dropdown)
    const antSelectItem = this.page
      .locator('.ant-select-dropdown:visible .ant-select-item, .ant-select-dropdown:visible [role="option"]')
      .filter({ hasText: textMatcher })
      .first();
    const antDropdownItem = this.page
      .locator('.ant-dropdown:visible .ant-dropdown-menu-item, .ant-dropdown:visible [role="menuitem"]')
      .filter({ hasText: textMatcher })
      .first();
    const popupListItem = this.page
      .locator('.mstrmojo-PopupList:visible .item, [class*="PopupList"]:visible .item')
      .filter({ hasText: textMatcher })
      .first();
    return antSelectItem.or(antDropdownItem).or(popupListItem);
  }

  async openDropdown(row: number, col: string): Promise<void> {
    const cell = this.getSortingColumn(row, col as 'Sort By');
    await cell.click();
    // Wait for dropdown overlay to render (Sort dialog may use ant-select or PopupList)
    await this.page
      .locator(
        '.ant-select-dropdown:visible, .ant-dropdown:visible, .mstrmojo-PopupList:visible, [class*="PopupList"]:visible'
      )
      .first()
      .waitFor({ state: 'visible', timeout: 10000 })
      .catch(() => {});
    await this.page.waitForTimeout(500);
  }

  async selectFromDropdown(
    row: number,
    col: string,
    option: string,
    fallbacks?: string[],
    usePartialMatch = false
  ): Promise<void> {
    const optionsToTry = [option, ...(fallbacks ?? [])];
    let lastError: Error | null = null;
    for (const opt of optionsToTry) {
      const item = this.getDropDownItem(row, col, opt, usePartialMatch);
      try {
        await item.waitFor({ state: 'visible', timeout: 8000 });
        await item.click({ force: true });
        await this.page.waitForTimeout(500);
        return;
      } catch (e) {
        lastError = e as Error;
      }
    }
    throw lastError ?? new Error(`Could not select "${option}" from dropdown`);
  }

  async removeRow(idx: number): Promise<void> {
    const removeBtn = this.getSortingColumn(idx, 'Remove');
    await removeBtn.click();
    await this.page.waitForTimeout(500);
  }

  async clickBtn(btnName: string): Promise<void> {
    const btn = this.dialog.locator(`.mstr-rc-dialog-footer span:has-text("${btnName}")`).first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await this.page.waitForTimeout(2000);
  }

  /** Click context menu option (e.g. Sort) - used when menu is open from Page-by selector right-click */
  async clickContextMenuOption(opt: string): Promise<void> {
    const item = this.page
      .locator(
        '.mstr-context-menu li:has-text("' +
          opt +
          '"), .ant-dropdown-menu li:has-text("' +
          opt +
          '"), [class*="Menu-item-container"]:has-text("' +
          opt +
          '")'
      )
      .first();
    await item.waitFor({ state: 'visible', timeout: 8000 });
    await item.click();
    await this.page.waitForTimeout(500);
  }
}
