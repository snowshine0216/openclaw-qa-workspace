import type { Page } from '@playwright/test';

export class ReportEditorPanel {
  constructor(private readonly page: Page) {}

  /** Right-click attribute in rows dropzone, Remove from Report */
  async removeAttributeInRowsDropZone(name: string): Promise<void> {
    await this.openObjectContextMenu('Rows', 'attribute', name);
    await this.clickContextMenuItem('Remove from Report');
    await this.page.waitForTimeout(2000);
  }

  /** Rows dropzone locator */
  get rowsDropzone() {
    return this.page.locator('.template-editor-content-rows, [class*="template-editor-content-rows"]').first();
  }

  /** Columns dropzone locator */
  get columnsDropzone() {
    return this.page.locator('.template-editor-content-columns, [class*="template-editor-content-columns"]').first();
  }

  /** Page-by dropzone locator */
  get pageByDropzone() {
    return this.page.locator('.template-editor-content-pageby, [class*="template-editor-content-pageby"]').first();
  }

  async getRowsObjects(): Promise<string[]> {
    throw new Error('TODO: implement - get object names from rows dropzone');
  }

  async getColumnsObjects(): Promise<string[]> {
    throw new Error('TODO: implement');
  }

  async getPageByObjects(): Promise<string[]> {
    const items = this.page.locator('[class*="pageby"] [class*="object-item"], [class*="page-by"] span').filter({ hasText: /.+/ });
    const texts = await items.allTextContents();
    return texts.map((t) => t.trim()).filter(Boolean);
  }

  async dndMetricsFromColumnsToRows(): Promise<void> {
    throw new Error('TODO: implement dnd - validate with playwright-cli');
  }

  async dndMetricFromRowsToColumns(): Promise<void> {
    throw new Error('TODO: implement dnd');
  }

  async changeNumberFormatForMetricInMetricsDropZone(metric: string, format: string): Promise<void> {
    const metricEl = this.page.locator('.mstrmojo-UnitContainer-content, [class*="metrics"]').getByText(metric).first();
    await metricEl.click({ button: 'right' });
    await this.page.getByRole('menuitem', { name: /number format|format/i }).click({ timeout: 3000 }).catch(() => {});
    await this.page.getByText(format, { exact: false }).first().click({ timeout: 3000 }).catch(() => {});
  }

  async updateAttributeFormsForAttributeInPageByDropZone(attr: string, form: string): Promise<void> {
    // Page-by Customer: try WDIO selectors first, then any element with attr text in editor.
    const attrEl = this.page
      .locator(
        [
          '[aria-label="Page By"]',
          '[aria-label="Page-by"]',
          '.template-editor-content-pageby',
          '.report-editor-editor',
        ].join(', ')
      )
      .locator(`div, span, li`)
      .filter({ hasText: new RegExp(`^${attr}$`, 'i') })
      .first();
    await attrEl.click({ button: 'right', timeout: 20000 });
    await this.page.locator('.mstr-context-menu:not(.ant-dropdown-hidden)').getByText(/display attribute forms|attribute form/i).first().click({ timeout: 5000 });
    await this.page.locator('[class*="report-attr-forms"], [class*="attribute-forms"]').getByText(form, { exact: false }).first().click({ timeout: 5000 });
    await this.page.getByRole('button', { name: /done|ok|apply/i }).first().click({ timeout: 5000 }).catch(() => {});
  }

  async dndAttributeFromRowsToPageBy(_attr: string): Promise<void> {
    throw new Error('TODO: implement dnd');
  }

  async removeAll(): Promise<void> {
    throw new Error('TODO: implement');
  }

  /** Open metric context menu in Metrics dropzone and click "Clear Thresholds" */
  async clearThresholdForMetricInMetricsDropZone(metric: string): Promise<void> {
    await this.openObjectContextMenu('Metrics', 'metric', metric);
    await this.clickContextMenuItem('Clear Thresholds');
    await this.page.waitForTimeout(2000);
  }

  /** Open metric context menu in Metrics dropzone and click "Thresholds Editor" or "Edit Thresholds..." */
  async openThresholdInDropZoneForMetric(metric: string): Promise<void> {
    await this.openObjectContextMenu('Metrics', 'metric', metric);
    const editorItem = this.page
      .locator('.mstr-context-menu:not(.ant-dropdown-hidden)')
      .locator('li')
      .filter({ hasText: /thresholds editor|edit thresholds/i })
      .first();
    await editorItem.waitFor({ state: 'visible', timeout: 5000 });
    await editorItem.click();
    await this.page.waitForTimeout(2000);
  }

  /** Open attribute context menu in Rows dropzone and click "Threshold..." or "Thresholds Editor" */
  async openThresholdInDropZoneForAttribute(attribute: string): Promise<void> {
    await this.openObjectContextMenu('Rows', 'attribute', attribute);
    const item = this.page
      .locator('.mstr-context-menu:not(.ant-dropdown-hidden)')
      .locator('li')
      .filter({ hasText: /threshold/i })
      .first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
    await this.page.waitForTimeout(2000);
  }

  /** Open context menu for object at index in zone (e.g. Metrics, 2 = 3rd metric) */
  async openObjectContextMenuByIndex(zone: string, idx: number): Promise<void> {
    const zoneLoc = this.page.locator(
      `.template-editor-content-${zone.toLowerCase()}, [class*="template-editor-content"] [class*="${zone.toLowerCase()}"]`
    );
    const obj = zoneLoc.locator('[class*="object"], [class*="metric"], .txt').nth(idx);
    await obj.waitFor({ state: 'visible', timeout: 10000 });
    await obj.click({ button: 'right' });
    await this.page.waitForTimeout(500);
  }

  /** Clear thresholds for attribute in Rows dropzone */
  async clearThresholdsForAttributeInRowsDropzone(attribute: string): Promise<void> {
    await this.openObjectContextMenu('Rows', 'attribute', attribute);
    await this.clickContextMenuItem('Clear Thresholds');
    await this.page.waitForTimeout(2000);
  }

  /** Switch from Advanced to Simple threshold editor and clear thresholds */
  async switchAdvToSimThresholdWithClear(): Promise<void> {
    const quickLink = this.page.locator('text=/Quick|Simple/i').first();
    await quickLink.waitFor({ state: 'visible', timeout: 5000 });
    await quickLink.click();
    await this.page.waitForTimeout(500);
    const clearBtn = this.page.locator('button:has-text("Clear"), div:has-text("Clear")').first();
    await clearBtn.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    await clearBtn.click().catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  async createRankForMetricInMetricsDropZone(metricName: string, option: 'Ascending' | 'Descending' = 'Ascending'): Promise<void> {
    await this.openObjectContextMenu('Metrics', 'metric', metricName);
    await this.hoverContextMenuItem('Shortcut Metric');
    await this.hoverSubMenuItem('Rank');
    // Rank submenu uses dropdown (sorts) + OK, not direct list items
    const rankSubmenu = this.page.locator('.rank-submenu:visible, [class*="rank-submenu"]:visible, [class*="RankSubmenu"]:visible').last();
    const sortsDropdown = rankSubmenu.locator('.rank-submenu-sorts, [class*="sorts"], .ant-select').first();
    const clickableDropdown = sortsDropdown.locator('.ant-select-selection-item, .ant-select-selector, [role="combobox"]').first();
    await clickableDropdown.waitFor({ state: 'visible', timeout: 8000 });
    await clickableDropdown.click({ force: true });
    await this.page.waitForTimeout(500);
    // Match "Ascending" or "Ascending Order", "Descending" or "Descending Order"
    const optionPattern = option === 'Ascending' ? /ascending/i : /descending/i;
    const optionItem = this.page
      .locator('.mstr-select-option, [class*="select-option"], [role="option"], .ant-select-item')
      .filter({ hasText: optionPattern })
      .first();
    await optionItem.waitFor({ state: 'visible', timeout: 5000 });
    await optionItem.click();
    await this.page.waitForTimeout(500);
    const okBtn = rankSubmenu.locator('button:has-text("OK"), span:has-text("OK"), [role="button"]:has-text("OK")').first();
    await okBtn.waitFor({ state: 'visible', timeout: 3000 });
    await okBtn.click();
    await this.page.waitForTimeout(1500);
  }

  async openMectricContextMenuInMetricsDropzone(_metric: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  /** WDIO: contextMenuContainsOption - whether open context menu has the option */
  async contextMenuContainsOption(opt: string): Promise<boolean> {
    const mojoMenuItem = this.page
      .locator('.mstrmojo-ui-Menu.visible a.mstrmojo-ui-Menu-item, .mstrmojo-ListBase.mstrmojo-ui-Menu.visible a')
      .filter({ hasText: new RegExp(`^\\s*${opt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i') })
      .first();
    if (await mojoMenuItem.isVisible().catch(() => false)) {
      return true;
    }

    const item = this.page
      .locator(
        '.mstr-context-menu:not(.ant-dropdown-hidden) li, .ant-dropdown-menu:visible li'
      )
      .filter({ hasText: opt })
      .first();
    return item.isVisible();
  }

  /** Open context menu for object in editor panel dropzone (e.g. metrics, metric, Cost) */
  async openObjectContextMenu(dropZone: string, objectType: string, objectName: string): Promise<void> {
    const zone = dropZone.toLowerCase();
    // Primary: exact match in zone. Fallback: any object with text in editor (for dynamically added metrics like "Percent to Total By Rows (Cost)")
    const zoneLoc = this.page.locator(
      `.template-editor-content-${zone}, [class*="template-editor-content-${zone}"], [class*="template-editor-content"] [class*="${zone}"]`
    ).first();
    
    const objByText = zoneLoc.getByText(objectName, { exact: true }).first();
    const escaped = objectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const objByRegex = zoneLoc
      .locator(`[class*="${objectType.toLowerCase()}"], .txt, [class*="object"]`)
      .filter({ hasText: new RegExp(`^\\s*${escaped}\\s*$`, 'i') })
      .first();

    const obj = await objByText.isVisible().catch(() => false) ? objByText : objByRegex;
    await obj.waitFor({ state: 'visible', timeout: 20000 });
    await obj.scrollIntoViewIfNeeded();
    await obj.click({ button: 'right' });
    await this.page.waitForTimeout(500);
    await this.page.locator('.mstr-context-menu:not(.ant-dropdown-hidden)').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  /** Click a context menu item (e.g. Edit..., Create Metric..., Over Rows) */
  async clickContextMenuItem(menuItem: string): Promise<void> {
    const item = this.page
      .locator('.mstr-context-menu:not(.ant-dropdown-hidden)')
      .locator(`li.ant-dropdown-menu-item`)
      .filter({ hasText: menuItem })
      .first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
    await this.page.waitForTimeout(1000);
  }

  /** Hover over main context menu item (e.g. Shortcut Metric) */
  async hoverContextMenuItem(menuItem: string): Promise<void> {
    const item = this.page
      .locator('.mstr-context-menu:not(.ant-dropdown-hidden)')
      .locator('li')
      .filter({ hasText: menuItem })
      .first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.hover();
    await this.page.waitForTimeout(500);
  }

  /** Hover over submenu item (e.g. Percent to Total, Over Rows) */
  async hoverSubMenuItem(menuItem: string): Promise<void> {
    const submenu = this.page.locator('.ant-dropdown-menu-submenu-popup:not(.ant-dropdown-menu-submenu-hidden), .mstr-rc-context-submenu-wrapper');
    const item = submenu.locator('li').filter({ hasText: menuItem }).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.hover();
    await this.page.waitForTimeout(500);
  }

  /** Click submenu item */
  async clickSubMenuItem(menuItem: string): Promise<void> {
    const submenu = this.page.locator('.ant-dropdown-menu-submenu-popup:not(.ant-dropdown-menu-submenu-hidden), .mstr-rc-context-submenu-wrapper');
    const item = submenu.locator('li').filter({ hasText: menuItem }).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
    await this.page.waitForTimeout(1000);
  }

  /** Create percent to total for metric: Shortcut Metric > Percent to Total > Over Rows | Over Columns | Page Total | Grand Total */
  async createPercentToTotalForMetricInMetricsDropZone(
    metricName: string,
    option: 'Over Rows' | 'Over Columns' | 'Page Total' | 'Grand Total'
  ): Promise<void> {
    await this.openObjectContextMenu('metrics', 'metric', metricName);
    await this.hoverContextMenuItem('Shortcut Metric');
    await this.hoverSubMenuItem('Percent to Total');
    await this.clickSubMenuItem(option);
  }

  async isEditContextMenuItemDisplayed(): Promise<boolean> {
    const item = this.page
      .locator('.mstr-context-menu:not(.ant-dropdown-hidden)')
      .locator('li')
      .filter({ hasText: 'Edit...' })
      .first();
    return item.isVisible();
  }

  getObjectInDropzone(dropZone: string, objectType: string, objectName: string) {
    const zone = dropZone.toLowerCase();
    return this.page
      .locator(`.template-editor-content-${zone}`)
      .locator(`[class*="${objectType.toLowerCase()}"]`)
      .filter({ hasText: new RegExp(`^${objectName}$`, 'i') })
      .first();
  }

  /** Remove object from dropzone via context menu */
  async removeObjectInDropzone(dropZone: string, objectType: string, objectName: string): Promise<void> {
    await this.openObjectContextMenu(dropZone, objectType, objectName);
    await this.clickContextMenuItem('Remove');
    await this.page.waitForTimeout(2000);
  }

  async getMetricsObjects(): Promise<string[]> {
    const metricsZone = this.page.locator(
      '.template-editor-content-metrics, [class*="template-editor-content-metrics"]'
    );
    const items = metricsZone.locator('[class*="object"], .txt').filter({ hasText: /.+/ });
    const texts = await items.allTextContents();
    return texts.map((t) => t.trim()).filter(Boolean);
  }

  async expandSubmenuForPercentToTotalForMetricInMetricsDropZone(metricName: string): Promise<void> {
    await this.openObjectContextMenu('Metrics', 'metric', metricName);
    await this.hoverContextMenuItem('Shortcut Metric');
    await this.hoverSubMenuItem('Percent to Total');
  }

  async createTotalForeEachForAttributeInMetrics(metricName: string, attributeName: string): Promise<void> {
    await this.expandSubmenuForPercentToTotalForMetricInMetricsDropZone(metricName);
    await this.hoverSubMenuItem('Total for Each');
    await this.clickSubMenuItem(attributeName);
  }

  async isSubmenuItemDisplayed(itemText: string): Promise<boolean> {
    const submenu = this.page.locator('.ant-dropdown-menu-submenu-popup:not(.ant-dropdown-menu-submenu-hidden), .mstr-rc-context-submenu-wrapper');
    const item = submenu.locator('li').filter({ hasText: itemText }).first();
    return item.isVisible();
  }

  async createTransformationForMetricInMetricsDropZone(
    submenuOption: string,
    option: string,
    metricName: string
  ): Promise<void> {
    await this.openObjectContextMenu('Metrics', 'metric', metricName);
    await this.hoverContextMenuItem('Shortcut Metric');
    await this.hoverSubMenuItem('Transformation');
    await this.hoverSubMenuItem(submenuOption);
    await this.clickSubMenuItem(option);
  }
}
