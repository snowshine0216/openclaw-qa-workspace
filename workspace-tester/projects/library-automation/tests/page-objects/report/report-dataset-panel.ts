import type { Page } from '@playwright/test';

export class ReportDatasetPanel {
  constructor(private readonly page: Page) {}

  readonly objectList = this.page.getByRole('list', { name: /object/i });
  readonly reportFilterRegion = this.page.getByRole('region', { name: /report filter/i });
  private readonly datasetPanel = this.page.locator('.dataset-panel');
  private readonly contextMenu = this.page.locator('.mstr-context-menu:not(.ant-dropdown-hidden)');

  private get statusBarLocator() {
    return this.page.locator('.report-footer, [class*="status-bar"], [class*="report-footer"]').first();
  }

  /** Status bar element (e.g. "29 Rows, 3 Columns") - WDIO API: StatusBar.getText() */
  get StatusBar() {
    return {
      locator: this.statusBarLocator,
      getText: async (): Promise<string> => this.getStatusBarText(),
    };
  }

  async getStatusBarText(): Promise<string> {
    await this.statusBarLocator.waitFor({ state: 'visible', timeout: 10000 });
    return (await this.statusBarLocator.textContent())?.trim() ?? '';
  }

  async openObjectContextMenu(objectName: string): Promise<void> {
    await this.closeContextMenuIfOpen();
    // WDIO getObjectInObjectsPanel: object in report tab or object browser
    const obj = this.datasetPanel.locator('.object-item-text').filter({ hasText: new RegExp(`^${objectName}$`, 'i') }).first();
    await obj.scrollIntoViewIfNeeded();
    await obj.click({ button: 'right' });
    await this.page.waitForTimeout(1000);
    await this.contextMenu.first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
  }

  private async closeContextMenuIfOpen(): Promise<void> {
    try {
      const visible = await this.contextMenu.first().isVisible().catch(() => false);
      if (visible) {
        await this.statusBarLocator.click({ timeout: 2000 }).catch(() => this.page.keyboard.press('Escape'));
        await this.page.waitForTimeout(300);
      }
    } catch {
      // ignore
    }
  }

  async selectSubmenuOption(path: string, waitAfter = false): Promise<void> {
    const parts = path.split('|').map((p) => p.trim());
    // WDIO: main menu .mstr-context-menu li div, submenu .mstr-rc-context-submenu-wrapper li div
    const mainMenu = this.page.locator('.mstr-context-menu:not(.ant-dropdown-hidden)');
    const submenu = this.page.locator('.mstr-rc-context-submenu-wrapper:not(.ant-dropdown-menu-submenu-hidden)');
    for (let i = 0; i < parts.length - 1; i++) {
      const container = i === 0 ? mainMenu : submenu;
      const item = container.locator('li').filter({ hasText: parts[i] }).first();
      await item.waitFor({ state: 'visible', timeout: 5000 });
      await item.hover();
      await this.page.waitForTimeout(500);
    }
    const lastPart = parts[parts.length - 1];
    const lastContainer = parts.length === 1 ? mainMenu : submenu;
    const lastItem = lastContainer.locator('li').filter({ hasText: lastPart }).first();
    await lastItem.waitFor({ state: 'visible', timeout: 5000 });
    await lastItem.click();
    if (waitAfter) {
      await this.page.waitForTimeout(2000);
    }
  }

  private getItemInObjectBrowser(itemName: string) {
    return this.datasetPanel
      .locator('.object-item-text')
      .filter({ hasText: new RegExp(`^${itemName}$`, 'i') })
      .first();
  }

  private get folderUpIcon() {
    return this.page.locator(
      '[class*="icon-objects-folder-up"], [class*="icon-parent-folder"], [class*="folder-up"]'
    );
  }

  async selectItemInObjectList(name: string): Promise<void> {
    const el = this.getItemInObjectBrowser(name);
    await el.scrollIntoViewIfNeeded();
    await el.waitFor({ state: 'visible', timeout: 10000 });
    await el.click();
    await this.page.waitForTimeout(1000);
  }

  async clickFolderUpIcon(): Promise<void> {
    await this.folderUpIcon.first().waitFor({ state: 'visible', timeout: 5000 });
    await this.folderUpIcon.first().click();
    await this.page.waitForTimeout(1000);
  }

  async dndFromObjectBrowserToReportFilter(objectName: string): Promise<void> {
    const source = this.objectList.getByText(objectName);
    await source.dragTo(this.reportFilterRegion);
  }

  async dndFromObjectBrowserToGrid(_objectName: string): Promise<void> {
    throw new Error('TODO: implement dnd - validate with playwright-cli');
  }

  async selectMultipleItemsInObjectList(path: string[]): Promise<void> {
    for (const name of path) {
      await this.selectItemInObjectList(name);
    }
  }

  async addMultipleObjectsToPageBy(names: string[]): Promise<void> {
    for (const name of names) {
      await this.addObjectToPageBy(name);
    }
  }

  async clickFolderUpMultipleTimes(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.clickFolderUpIcon();
    }
  }

  async addMultipleObjectsToColumns(names: string[]): Promise<void> {
    for (const name of names) {
      await this.addObjectToColumns(name);
    }
  }

  async addMultipleObjectsToRows(names: string[]): Promise<void> {
    for (const name of names) {
      await this.addObjectToRows(name);
    }
  }

  async addObjectToRows(name: string): Promise<void> {
    await this.openObjectContextMenu(name);
    await this.clickObjectContextMenuItem('Add to Rows');
    await this.page.waitForTimeout(2000);
  }

  async addObjectToColumns(name: string): Promise<void> {
    await this.openObjectContextMenu(name);
    await this.clickObjectContextMenuItem('Add to Columns');
    await this.page.waitForTimeout(2000);
  }

  async addObjectToPageBy(name: string): Promise<void> {
    await this.openObjectContextMenu(name);
    await this.clickObjectContextMenuItem('Add to Page-by');
    await this.page.waitForTimeout(2000);
  }

  /** Alias for addObjectToPageBy (WDIO naming) */
  async addObjectFromObjectBrowserToPageBy(name: string): Promise<void> {
    return this.addObjectToPageBy(name);
  }

  async addObjectToReport(_name: string): Promise<void> {
    throw new Error('TODO: implement');
  }

  async removeItemInReportTab(name: string): Promise<void> {
    await this.openObjectContextMenu(name);
    await this.clickObjectContextMenuItem('Remove from Report');
    await this.page.waitForTimeout(2000);
  }

  async renameObjectInReportTab(oldName: string, newName: string): Promise<void> {
    await this.openObjectContextMenu(oldName);
    await this.selectSubmenuOption('Rename', true);
    const input = this.page.locator('input[type="text"]').last();
    await input.fill(newName);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1500);
  }

  async clickObjectContextMenuItem(label: string): Promise<void> {
    const item = this.contextMenu.locator('li').filter({ hasText: label }).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
  }

  /** Get object in "In Report" tab - returns locator */
  getObjectInReportTab(objectName: string) {
    return this.datasetPanel
      .locator('.report-objects, [class*="report-objects"]')
      .locator(`span.object-item-text, [class*="object-item"]`)
      .filter({ hasText: new RegExp(`^${objectName}$`, 'i') })
      .first();
  }

  async clickObjectContextSubmenuItem(label: string): Promise<void> {
    const submenu = this.page.locator('.ant-dropdown-menu-submenu-popup, .mstr-rc-context-submenu-wrapper');
    const item = submenu.locator('li').filter({ hasText: label }).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
  }

  /** Three-dots menu for subset report cube (WDIO: getThreeDotsToOpenCubeMenu) */
  getThreeDotsToOpenCubeMenu() {
    return this.page.locator('.reportObjectsContainer .ant-dropdown-trigger.cube-menu, [class*="cube-menu"]').first();
  }

  /** Open Replace Cube dialog from dataset panel (subset reports only) */
  async openSelectCubeDialog(): Promise<void> {
    await this.getThreeDotsToOpenCubeMenu().click();
    await this.contextMenu.first().waitFor({ state: 'visible', timeout: 5000 });
    await this.clickObjectContextMenuItem('Replace Cube...');
    await this.page.waitForTimeout(1000);
  }

  /** Click status bar to lose focus (dismiss menus) */
  async clickBottomBarToLoseFocus(): Promise<void> {
    await this.statusBarLocator.click();
    await this.page.waitForTimeout(500);
  }

  /** Wait for status bar to contain text (e.g. "0 Rows") */
  async waitForStatusBarText(text: string, timeoutMs = 15000): Promise<void> {
    const bar = this.statusBarLocator;
    await bar.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForFunction(
      (expected) => {
        const el = document.querySelector('.report-footer, [class*="status-bar"], [class*="report-footer"]');
        return (el?.textContent ?? '').includes(expected);
      },
      text,
      { timeout: timeoutMs }
    );
  }

  /** Click object in report objects panel (for DnD prep) */
  async clickObjectInReportObjectsPanel(objectName: string): Promise<void> {
    const obj = this.datasetPanel.locator('.object-item-text').filter({ hasText: new RegExp(`^${objectName}$`, 'i') }).first();
    await obj.waitFor({ state: 'visible', timeout: 5000 });
    await obj.click();
  }

  /** Search in object browser (when object browser popover is open) */
  async searchObjectInObjectBrowser(searchText: string): Promise<void> {
    const searchInput = this.page.locator('.mstr-object-browser-search input, .object-search-pulldown input').first();
    await searchInput.waitFor({ state: 'visible', timeout: 5000 });
    await searchInput.fill(searchText);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  /** DnD from object panel to view filter container */
  async dndFromObjectPanelToContainer(objectName: string, target: string): Promise<void> {
    const source = this.datasetPanel.locator('.object-item-text').filter({ hasText: new RegExp(`^${objectName}$`, 'i') }).first();
    const dest = this.page.locator(`[class*="filter"], [class*="view-filter"]`).filter({ hasText: new RegExp(target, 'i') }).first();
    await source.dragTo(dest);
    await this.page.waitForTimeout(500);
  }

  /** DnD multi-select from report objects to view filter (BCIN-6460_01: not allowed) */
  async dndByMultiSelectFromReportObjectsToViewFilter(options: {
    objectNames: string[];
    target: string;
  }): Promise<void> {
    const { objectNames, target } = options;
    const mod = process.platform === 'darwin' ? 'Meta' : 'Control';
    await this.page.keyboard.down(mod);
    for (const name of objectNames) {
      const obj = this.datasetPanel.locator('.object-item-text').filter({ hasText: new RegExp(`^${name}$`, 'i') }).first();
      await obj.waitFor({ state: 'visible', timeout: 5000 });
      await obj.click();
    }
    await this.page.keyboard.up(mod);
    const first = this.datasetPanel.locator('.object-item-text').filter({ hasText: new RegExp(`^${objectNames[0]}$`, 'i') }).first();
    const dest = this.page.locator(`[class*="filter"], [class*="view-filter"]`).filter({ hasText: new RegExp(target, 'i') }).first();
    await first.dragTo(dest);
    await this.page.waitForTimeout(500);
  }

  /** DnD from object browser to report view filter */
  async dndFromObjectBrowserToReportViewFilter(options: {
    objectName: string;
    target?: import('@playwright/test').Locator;
    options?: { isWait?: boolean };
  }): Promise<void> {
    const { objectName, target } = options;
    const source = this.datasetPanel.locator('.object-item-text').filter({ hasText: new RegExp(`^${objectName}$`, 'i') }).first();
    const dest =
      target ??
      this.page.locator('.view-filter-tab .qualification-innr-container, .new-view-filter-container').first();
    await source.dragTo(dest);
    await this.page.waitForTimeout(500);
  }
}
