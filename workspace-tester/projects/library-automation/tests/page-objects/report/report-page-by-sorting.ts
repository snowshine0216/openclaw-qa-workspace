import type { Page } from '@playwright/test';

/**
 * Page object for the Page-by Sorting dialog in Report Editor.
 * Migrated from WDIO ReportPageBySorting.js
 */
export class ReportPageBySorting {
  constructor(private readonly page: Page) {}

  readonly dialog = this.page.locator('.mstr-rc-dialog.sort-options-dialog, [class*="sort-options-dialog"]');

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
      return rowEl.locator(`.sort-object-name:has-text("${txt}")`);
    }
    return rowEl.locator(`.ant-space-item:has-text("${txt}")`);
  }

  /** WDIO: getSortByObjectText - text element for Sort By column on row */
  getSortByObjectText(row: number) {
    return this.getSortingRow(row).locator('.sort-object-name');
  }

  /** WDIO: getDropDownItem - dropdown menu item by row, column, and label */
  getDropDownItem(row: number, col: string, item: string) {
    const colIdxMap: Record<string, number> = {
      'Sort By': 2,
      Criteria: 3,
      Order: 4,
      'Total Position': 5,
      'Parent Position': 6,
    };
    const idx = colIdxMap[col] ?? 2;
    const dropdown = this.dialog
      .locator('.sort-row')
      .nth(row - 1)
      .locator('.ant-col')
      .nth(idx)
      .locator('[class*="ant-dropdown"], .mstr-dropdown')
      .first();
    // Use getByText for more flexible text matching (same as context menu fix)
    return dropdown.getByText(item, { exact: true }).first();
  }

  async openDropdown(row: number, col: string): Promise<void> {
    const cell = this.getSortingColumn(row, col as 'Sort By');
    await cell.click();
    await this.page.waitForTimeout(500);
  }

  async selectFromDropdown(row: number, col: string, option: string): Promise<void> {
    const item = this.getDropDownItem(row, col, option);
    // Increased timeout from 5s to 15s for slower dev environments
    await item.waitFor({ state: 'visible', timeout: 15000 });
    await item.click();
    await this.page.waitForTimeout(500);
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
