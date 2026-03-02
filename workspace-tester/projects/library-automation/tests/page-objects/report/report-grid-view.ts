import type { Page } from '@playwright/test';

export class ReportGridView {
  constructor(private readonly page: Page) {}

  /** Wait for grid to contain text matching pattern (polling). Resilient when cell position varies. */
  async waitForGridToContainText(pattern: string | RegExp, timeout = 20000): Promise<void> {
    const re = typeof pattern === 'string' ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : pattern;
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const allCells = this.page.locator('.ag-cell, [role="gridcell"]');
      const count = await allCells.count();
      for (let i = 0; i < Math.min(count, 80); i++) {
        const text = (await allCells.nth(i).textContent())?.trim() || '';
        if (re.test(text)) return;
      }
      await this.page.waitForTimeout(500);
    }
    throw new Error(`waitForGridToContainText(${pattern}): not found within ${timeout}ms`);
  }

  /** Wait for grid cell to have expected value (polling). */
  async waitForGridCellToBeExpectedValue(
    row: number,
    col: number,
    expectedValue: string,
    timeout = 30000
  ): Promise<void> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const text = await this.getGridCellTextByPos(row, col);
      if (text === expectedValue) return;
      await this.page.waitForTimeout(1000);
    }
    const actual = await this.getGridCellTextByPos(row, col);
    throw new Error(`waitForGridCellToBeExpectedValue(${row},${col},'${expectedValue}'): got '${actual}'`);
  }

  async getGridCellTextByPos(row: number, col: number): Promise<string> {
    // WDIO ReportGridView: //div[contains(@class, 'content')]//div[@r and @c]
    const byRc = this.page.locator(`div.content div[r="${row}"][c="${col}"], div[class*="content"] div[r="${row}"][c="${col}"]`).first();
    const byAgGrid = this.page.locator('.ag-center-cols-container .ag-row').nth(row).locator('.ag-cell').nth(col);
    const byRole = this.page.locator('[role="grid"] [role="row"]').nth(row).locator('[role="gridcell"]').nth(col);
    const cell = byRc.or(byAgGrid).or(byRole);
    await cell.first().waitFor({ state: 'visible', timeout: 15000 });
    const text = await cell.first().textContent();
    return (text || '').trim();
  }

  /** Alias for getGridCellTextByPos */
  async getGridCellText(row: number, col: number): Promise<string> {
    return this.getGridCellTextByPos(row, col);
  }

  /** Get computed CSS property for grid cell at (row,col). Uses ag-grid or r/c divs. */
  async getGridCellStyleByPos(row: number, col: number, prop: string): Promise<string> {
    const byRc = this.page.locator(
      `div.content div[r="${row}"][c="${col}"], div[class*="content"] div[r="${row}"][c="${col}"]`
    ).first();
    const byAgGrid = this.page.locator('.ag-center-cols-container .ag-row').nth(row).locator('.ag-cell').nth(col);
    const byRole = this.page.locator('[role="grid"] [role="row"]').nth(row).locator('[role="gridcell"]').nth(col);
    const cell = byRc.or(byAgGrid).or(byRole);
    await cell.first().waitFor({ state: 'visible', timeout: 15000 });
    const value = await cell.first().evaluate((el, p) => {
      const style = window.getComputedStyle(el);
      return style.getPropertyValue(p.replace(/([A-Z])/g, '-$1').toLowerCase()) || '';
    }, prop);
    return value?.trim() || '';
  }

  /** Get img src from grid cell at (row,col). */
  async getGridCellImgSrcByPos(row: number, col: number): Promise<string> {
    const byRc = this.page.locator(
      `div.content div[r="${row}"][c="${col}"] img, div[class*="content"] div[r="${row}"][c="${col}"] img`
    ).first();
    const byAgGrid = this.page
      .locator('.ag-center-cols-container .ag-row')
      .nth(row)
      .locator('.ag-cell')
      .nth(col)
      .locator('img');
    const img = byRc.or(byAgGrid);
    await img.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    const src = await img.first().getAttribute('src').catch(() => null);
    return src ?? '';
  }

  /** WDIO: getVisualizationViewPort - viewport container for viz. */
  getVisualizationViewPort(visualization: string) {
    return this.page
      .locator(`[class*="mstrmojo-UnitContainer"], [class*="UnitContainer"]`)
      .filter({ hasText: visualization })
      .locator('[class*="ag-body-viewport"], [class*="body-viewport"]')
      .first();
  }

  async removeObject(_name: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  /** WDIO: sortByOption - column header context menu > sort option */
  async sortByOption(objectName: string, option: string): Promise<void> {
    await this.openGridColumnHeaderContextMenu(objectName);
    await this.clickContextMenuOption(option);
    await this.page.locator('.mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});
  }

  /** WDIO: openContextualLinkFromCellByPos - right-click cell > Links > linkName */
  async openContextualLinkFromCellByPos(
    row: number,
    col: number,
    options: { linkName: string; isWait?: boolean }
  ): Promise<void> {
    const isWait = options.isWait ?? true;
    const cell = this.getGridCellByPos(row, col);
    await cell.click({ button: 'right' });
    await this.page.waitForTimeout(1000);
    await this.clickContextMenuOption('Links');
    const linkOpt = this.page
      .locator(
        `.mstr-context-menu li:has-text("${options.linkName}"), .ant-dropdown-menu li:has-text("${options.linkName}"), [role="menuitem"]:has-text("${options.linkName}")`
      )
      .first();
    await linkOpt.click();
    if (isWait) {
      await this.page.locator('.mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});
    }
  }

  /** WDIO: moveGridHeaderToPageBy - column header context menu > Move > To Page-by */
  async moveGridHeaderToPageBy(objectName: string): Promise<void> {
    await this.openGridColumnHeaderContextMenu(objectName);
    await this.clickContextMenuOption('Move');
    await this.clickContextMenuOption('To Page-by');
    await this.page.locator('.mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});
  }

  async sortAscending(_name: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  async sortAscendingBySortIcon(_name: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  async sortDescendingBySortIcon(_name: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  /** WDIO: hideAllThresholds - column header context menu > Hide All Thresholds */
  async hideAllThresholds(columnName: string): Promise<void> {
    await this.openGridColumnHeaderContextMenu(columnName);
    await this.clickContextMenuOption('Hide All Thresholds');
    await this.page.waitForTimeout(2000);
  }

  /** WDIO: showAllThresholds - column header context menu > Show All Thresholds */
  async showAllThresholds(columnName: string): Promise<void> {
    await this.openGridColumnHeaderContextMenu(columnName);
    await this.clickContextMenuOption('Show All Thresholds');
    await this.page.waitForTimeout(2000);
  }

  async moveColumnHeaderToColumns(_name: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  async showTotalsForObject(_name: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  async isGridCellDisplayed(_row: number, _col: number): Promise<boolean> {
    throw new Error('TODO: implement');
  }

  async addAttributesBefore(_after: string, _attrs: string[]): Promise<void> {
    throw new Error('TODO: implement');
  }

  async changeNumberFormat(_metric: string, _format: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  async resizeColumnByMovingBorder(_col: number, _offset: number, _dir: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  async updateShowAttributeFormName(_attr: string, _form: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  async clickGridColumnHeader(_name: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  async clearSortBySortIcon(_name: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  async drillToItem(_from: string, _path: string[]): Promise<void> {
    throw new Error('TODO: implement');
  }

  async moveTotalToTop(): Promise<void> {
    throw new Error('TODO: implement');
  }

  async hideTotals(): Promise<void> {
    throw new Error('TODO: implement');
  }

  /** WDIO: openGridColumnHeaderContextMenu - right-click on grid column header */
  async openGridColumnHeaderContextMenu(columnName: string): Promise<void> {
    const header = this.page
      .locator('.ag-header-cell, [role="columnheader"]')
      .filter({ hasText: new RegExp(`^${columnName}$`, 'i') })
      .first();
    await header.waitFor({ state: 'visible', timeout: 10000 });
    await header.click({ button: 'right' });
    await this.page.waitForTimeout(1000);
  }

  readonly grid = this.page.locator(
    '[class*="mstrmojo-VIBox"]:has-text("Visualization 1"), .ag-root, [role="grid"]'
  ).first();

  async clickContextMenuOption(opt: string): Promise<void> {
    // Use getByText for flexible text matching (same as PageBy context menu fix)
    const item = this.page.getByText(opt, { exact: true }).first();
    await item.waitFor({ state: 'visible', timeout: 15000 });
    await item.click();
    await this.page.waitForTimeout(500);
  }

  /** WDIO: getContextMenuOption - returns whether option exists (truthy) */
  async getContextMenuOption(opt: string): Promise<import('@playwright/test').Locator> {
    return this.page
      .locator(
        `.mstr-context-menu li:has-text("${opt}"), ` +
          `.ant-dropdown-menu li:has-text("${opt}"), ` +
          `[class*="context-menu"] li:has-text("${opt}"), ` +
          `[role="menu"] [role="menuitem"]:has-text("${opt}")`
      )
      .first();
  }

  /** WDIO: getDisabledContextMenuOption - returns disabled menu option locator */
  getDisabledContextMenuOption(opt: string) {
    return this.page
      .locator(
        `.mstr-context-menu li.ant-dropdown-menu-item-disabled:has-text("${opt}"), ` +
          `.ant-dropdown-menu li.ant-dropdown-menu-item-disabled:has-text("${opt}"), ` +
          `[class*="disabled"]:has-text("${opt}")`
      )
      .first();
  }

  async showMetricsLabel(_name: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  /** Loading dialog - wait for data popup to disappear */
  get loadingDialog() {
    return {
      waitLoadingDataPopUpIsNotDisplayed: async (timeout = 60000): Promise<void> => {
        await this.page.locator('.mstrd-LoadingIcon-content--visible, .mstr-rc-loading-dot-icon').waitFor({ state: 'hidden', timeout }).catch(() => {});
      },
    };
  }

  /** Returns locator for grid cell at (row,col). Use .isVisible() for visibility checks. */
  getGridCellByPos(row: number, col: number) {
    const byRc = this.page.locator(
      `div.content div[r="${row}"][c="${col}"], div[class*="content"] div[r="${row}"][c="${col}"]`
    ).first();
    const byAgGrid = this.page.locator('.ag-center-cols-container .ag-row').nth(row).locator('.ag-cell').nth(col);
    const byRole = this.page.locator('[role="grid"] [role="row"]').nth(row).locator('[role="gridcell"]').nth(col);
    return byRc.or(byAgGrid).or(byRole).first();
  }

  /** Scroll grid to bottom (WDIO: scrollGridToBottom) */
  async scrollGridToBottom(visualization = 'Visualization 1'): Promise<void> {
    const viewport = this.getVisualizationViewPort(visualization);
    await viewport.evaluate((el) => (el.scrollTop = el.scrollHeight));
    await this.page.waitForTimeout(500);
  }

  /** Scroll grid horizontally (WDIO: scrollGridHorizontally) */
  async scrollGridHorizontally(visualization: string, deltaX: number): Promise<void> {
    const viewport = this.getVisualizationViewPort(visualization);
    await viewport.evaluate((el, dx) => (el.scrollLeft += dx), deltaX);
    await this.page.waitForTimeout(500);
  }

  /** Get style for cells in a row range [colStart, colEnd] at row. Returns array for JSON.stringify comparison. */
  async getGridCellStyleByRows(colStart: number, colEnd: number, row: number, prop: string): Promise<string[]> {
    const results: string[] = [];
    for (let c = colStart; c <= colEnd; c++) {
      results.push(await this.getGridCellStyleByPos(row, c));
    }
    return results;
  }

  /** Get style for cells in a column range [rowStart, rowEnd] at col. Returns JSON string for comparison. */
  async getGridCellStyleByCols(rowStart: number, rowEnd: number, col: number, prop: string): Promise<string> {
    const results: string[] = [];
    for (let r = rowStart; r <= rowEnd; r++) {
      results.push(await this.getGridCellStyleByPos(r, col));
    }
    return JSON.stringify(results);
  }

  /** WDIO: clickOutlineIconFromCH - expand outline from column header */
  async clickOutlineIconFromCH(columnName: string): Promise<void> {
    const header = this.page
      .locator('.ag-header-cell, [role="columnheader"]')
      .filter({ hasText: new RegExp(`^${columnName}$`, 'i') })
      .first();
    const icon = header.locator('[class*="outline"], [class*="expand"], .ag-icon');
    await icon.first().click({ timeout: 5000 });
    await this.page.waitForTimeout(500);
  }

  /** WDIO: collapseOutlineFromCell */
  async collapseOutlineFromCell(cellText: string): Promise<void> {
    const cell = this.page.locator(`.ag-cell, [role="gridcell"]`).filter({ hasText: new RegExp(`^${cellText}$`, 'i') }).first();
    const icon = cell.locator('[class*="collapse"], [class*="outline"], .ag-icon');
    await icon.first().click({ timeout: 5000 });
    await this.page.waitForTimeout(500);
  }

  /** Check if expand icon visible at (row,col) */
  async getGridCellExpandIconByPos(row: string, col: string): Promise<boolean> {
    const cell = this.getGridCellByPos(parseInt(row, 10), parseInt(col, 10));
    const icon = cell.locator('[class*="expanded"], [class*="expand"], [aria-expanded="true"]');
    return icon.first().isVisible().catch(() => false);
  }

  /** Check if collapse icon visible at (row,col) */
  async getGridCellCollapseIconByPos(row: string, col: string): Promise<boolean> {
    const cell = this.getGridCellByPos(parseInt(row, 10), parseInt(col, 10));
    const icon = cell.locator('[class*="collapsed"], [class*="collapse"], [aria-expanded="false"]');
    return icon.first().isVisible().catch(() => false);
  }

  async enableDisplayAttributeForms(_attr: string): Promise<void> {
    throw new Error('TODO: implement');
  }
}
