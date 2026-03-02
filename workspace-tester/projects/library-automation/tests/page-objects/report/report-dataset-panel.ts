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
    
    // Try object browser first (Schema Objects tree), then report objects (REPORT OBJECTS panel)
    let obj = this.getItemInObjectBrowser(objectName);
    let count = await obj.count();
    const container = this.page.locator('.objectBrowserContainer');
    
    if (count === 0) {
      console.log(`[Dataset Panel Context Menu] "${objectName}" not visible, progressive scrolling...`);
      let previousScrollTop = -1;
      let attempts = 0;
      const maxAttempts = 20;
      
      while (count === 0 && attempts < maxAttempts) {
        const currentScrollTop = await container.evaluate((node) => node.scrollTop);
        if (currentScrollTop === previousScrollTop && previousScrollTop > 0) {
          console.log(`[Dataset Panel Context Menu] Reached bottom, "${objectName}" not found in object browser`);
          break;
        }
        
        await container.evaluate((node) => {
          node.scrollTop += 150;
        });
        await this.page.waitForTimeout(300);
        
        previousScrollTop = currentScrollTop;
        attempts++;
        
        obj = this.getItemInObjectBrowser(objectName);
        count = await obj.count();
        
        if (count > 0) {
          console.log(`[Dataset Panel Context Menu] "${objectName}" found after ${attempts} scroll attempts`);
          break;
        }
      }
    }
    
    // Fallback: look in reportObjectsContainer (REPORT OBJECTS panel, e.g. Year after removal from Page By)
    if (count === 0) {
      const reportContainer = this.page.locator('.reportObjectsContainer, [class*="report-objects"]').first();
      obj = this.getItemInReportObjects(objectName);
      count = await obj.count();
      if (count === 0 && (await reportContainer.count()) > 0) {
        // Progressive scroll in report objects (may be below fold)
        let prevScroll = -1;
        for (let i = 0; i < 20; i++) {
          const curr = await reportContainer.evaluate((n) => n.scrollTop);
          if (curr === prevScroll && prevScroll > 0) break;
          await reportContainer.evaluate((n) => { n.scrollTop += 150; });
          await this.page.waitForTimeout(200);
          prevScroll = curr;
          obj = this.getItemInReportObjects(objectName);
          count = await obj.count();
          if (count > 0) break;
        }
      }
      if (count > 0) {
        console.log(`[Dataset Panel Context Menu] "${objectName}" found in report objects`);
      }
    }
    
    if (count === 0) {
      throw new Error(`Object "${objectName}" not found in object browser or report objects.`);
    }
    
    await obj.scrollIntoViewIfNeeded();
    await obj.click({ button: 'right', force: true });
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
    // Use .objectBrowserContainer and getByText for nested span support
    const container = this.page.locator('.objectBrowserContainer');
    return container.getByText(itemName, { exact: true }).first();
  }

  /** Object lookup with broader fallbacks (aria-label/tree nodes/report object item text). */
  private getObjectCandidate(itemName: string) {
    const escaped = itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exact = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    const browser = this.page
      .locator('.objectBrowserContainer')
      .locator(
        `[aria-label="${itemName}"], .ant-tree-title, .ant-tree-node-content-wrapper, ` +
        '.object-item-text, .object-item-container, [class*="object-item"], span, div'
      )
      .filter({ hasText: exact })
      .first();
    const reportObjects = this.page
      .locator('.reportObjectsContainer, [class*="report-objects"], .report-objects')
      .locator('.object-item-container[aria-label], .object-item-text, [class*="object-item"], span, div')
      .filter({ hasText: exact })
      .first();
    return browser.or(reportObjects).first();
  }

  /** Object in REPORT OBJECTS panel (e.g. Year after removal from Page By). DOM: .object-item-container or .object-item-text */
  private getItemInReportObjects(itemName: string) {
    return this.page
      .locator('.reportObjectsContainer, [class*="report-objects"], .report-objects')
      .locator('.object-item-container[aria-label], .object-item-text, [class*="object-item"]')
      .filter({ hasText: new RegExp(`^${itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') })
      .first();
  }

  private get folderUpIcon() {
    return this.page.locator(
      '[class*="icon-objects-folder-up"], [class*="icon-parent-folder"], [class*="folder-up"]'
    );
  }

  /**
   * Try to select the first item that exists from the given names.
   * Useful for environment-specific variations (e.g. "Year" vs "Jahr").
   * @returns The name that was selected, or null if none found
   */
  async trySelectFirstExisting(names: string[]): Promise<string | null> {
    const container = this.page.locator('.objectBrowserContainer');
    for (const name of names) {
      // Reset to top for each candidate so later fallback names are not searched only from the previous bottom position.
      await container.evaluate((node) => {
        node.scrollTop = 0;
      }).catch(() => {});
      await this.page.waitForTimeout(150);

      let el = this.getItemInObjectBrowser(name);
      let count = await el.count();
      if (count === 0) {
        let previousScrollTop = -1;
        for (let attempts = 0; attempts < 50; attempts++) {
          const currentScrollTop = await container.evaluate((node) => node.scrollTop);
          if (currentScrollTop === previousScrollTop && previousScrollTop > 0) break;
          await container.evaluate((node) => { node.scrollTop += 200; });
          await this.page.waitForTimeout(250);
          previousScrollTop = currentScrollTop;
          el = this.getItemInObjectBrowser(name);
          count = await el.count();
          if (count > 0) break;
        }
      }
      if (count > 0) {
        await el.waitFor({ state: 'attached', timeout: 10000 });
        await el.scrollIntoViewIfNeeded();
        await el.click({ force: true });
        await this.page.waitForTimeout(1000);
        return name;
      }
    }
    return null;
  }

  /**
   * Try to add an object to Page By, using the first name that exists.
   * @returns true if added, false if none found
   */
  async tryAddObjectToPageBy(names: string[]): Promise<boolean> {
    for (const name of names) {
      const container = this.page.locator('.objectBrowserContainer');
      await container.evaluate((node) => {
        node.scrollTop = 0;
      }).catch(() => {});
      await this.page.waitForTimeout(100);

      let obj = this.getObjectCandidate(name);
      let count = await obj.count();
      if (count === 0) {
        let previousScrollTop = -1;
        for (let attempts = 0; attempts < 60; attempts++) {
          const currentScrollTop = await container.evaluate((node) => node.scrollTop);
          if (currentScrollTop === previousScrollTop && previousScrollTop > 0) break;
          await container.evaluate((node) => { node.scrollTop += 150; });
          await this.page.waitForTimeout(300);
          previousScrollTop = currentScrollTop;
          obj = this.getObjectCandidate(name);
          count = await obj.count();
          if (count > 0) break;
        }
      }
      if (count > 0) {
        await obj.scrollIntoViewIfNeeded();
        await obj.click({ button: 'right', force: true });
        await this.page.waitForTimeout(1000);
        await this.contextMenu.first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
        await this.clickObjectContextMenuItem('Add to Page-by');
        await this.page.waitForTimeout(2000);
        return true;
      }
    }
    return false;
  }

  /** Search object browser and try add object to Page-by by context menu. */
  async trySearchAndAddObjectToPageBy(names: string[]): Promise<boolean> {
    const searchInput = this.page
      .locator('.mstr-object-browser-search input[aria-label*="search" i], .mstr-object-browser-search input')
      .first();
    const visible = await searchInput.isVisible().catch(() => false);
    if (!visible) return false;
    for (const name of names) {
      await searchInput.click({ force: true });
      const editable = await searchInput.isEditable().catch(() => false);
      if (editable) {
        await searchInput.fill('');
        await searchInput.fill(name);
      } else {
        await this.page.keyboard.press('Meta+a').catch(() => this.page.keyboard.press('Control+a').catch(() => {}));
        await this.page.keyboard.type(name);
      }
      await this.page.keyboard.press('Enter').catch(() => {});
      await this.page.waitForTimeout(1200);
      const added = await this.tryAddObjectToPageBy([name]);
      if (added) return true;
    }
    return false;
  }

  async selectItemInObjectList(name: string): Promise<void> {
    const container = this.page.locator('.objectBrowserContainer');
    
    // Try to find item with progressive scrolling
    let el = this.getItemInObjectBrowser(name);
    let count = await el.count();
    
    if (count === 0) {
      console.log(`[Dataset Panel] "${name}" not visible, progressive scrolling...`);
      
      // Progressive scroll: scroll down in increments until found or bottom reached.
      // Schema Objects and other top-level items may be below fold (see tc85390-progressive-scroll-confirmed).
      let previousScrollTop = -1;
      let attempts = 0;
      const maxAttempts = 80; // Increased for dossiers where Schema Objects is below fold
      
      while (count === 0 && attempts < maxAttempts) {
        const currentScrollTop = await container.evaluate((node) => node.scrollTop);
        
        // Check if we've reached the bottom (scrollTop no longer changes)
        if (currentScrollTop === previousScrollTop && previousScrollTop > 0) {
          console.log(`[Dataset Panel] Reached bottom after ${attempts} attempts, "${name}" not found`);
          break;
        }
        
        // Scroll down by 250px to reach items below fold (e.g. Schema Objects in ReportWS_PB_YearCategory2)
        await container.evaluate((node) => {
          node.scrollTop += 250;
        });
        await this.page.waitForTimeout(250);
        
        previousScrollTop = currentScrollTop;
        attempts++;
        
        // Check if item is now visible
        el = this.getItemInObjectBrowser(name);
        count = await el.count();
        
        if (count > 0) {
          console.log(`[Dataset Panel] "${name}" found after ${attempts} scroll attempts`);
          break;
        }
      }
      
      if (count === 0) {
        console.log(`[Dataset Panel] "${name}" not found after ${attempts} attempts, scrolling to top...`);
        await container.evaluate((node) => {
          node.scrollTop = 0;
        });
        await this.page.waitForTimeout(500);
        
        // Final check at top
        el = this.getItemInObjectBrowser(name);
        count = await el.count();
        console.log(`[Dataset Panel] "${name}" count at top: ${count}`);
        if (count === 0) {
          throw new Error(`Dataset panel item "${name}" not found. Object browser structure may differ in this environment.`);
        }
      }
    }
    
    // Increased timeout from 10s to 60s for slower dev environments with dataset loading
    await el.waitFor({ state: 'attached', timeout: 60000 });
    await el.scrollIntoViewIfNeeded();
    await el.waitFor({ state: 'visible', timeout: 30000 });
    // Use force click to bypass any overlay interception
    await el.click({ force: true });
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
    const liItem = this.contextMenu.locator('li').filter({ hasText: label }).first();
    const aItem = this.page
      .locator('.mstrmojo-ListBase.mstrmojo-ui-Menu.visible a.mstrmojo-ui-Menu-item')
      .filter({ hasText: label })
      .first();
    let item = liItem.or(aItem).first();
    const found = await item.isVisible().catch(() => false);
    if (!found && label === 'Remove from Report') {
      item = this.page
        .locator('.mstrmojo-ListBase.mstrmojo-ui-Menu.visible a.mstrmojo-ui-Menu-item, .mstr-context-menu li')
        .filter({ hasText: /^Remove$/i })
        .first();
    }
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click({ force: true });
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
