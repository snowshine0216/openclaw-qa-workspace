import type { Page } from '@playwright/test';

/**
 * Page object for the Create New Report/Dossier dialog.
 * Migrated from WDIO DossierCreator.js
 */
export class DossierCreator {
  constructor(private readonly page: Page) {}

  private get addButton() {
    return this.page.locator(
      '[class*="mstrd-CreateDossierNavItemContainer"], [class*="CreateDossier"], div[class*="create-dossier"]'
    ).first();
  }

  private get createNewReportItem() {
    return this.page.locator(
      'li[class*="create-report"], [class*="CreateDossierDropdownMenuContainer-create-report"]'
    ).first();
  }

  private get createNewDossierItem() {
    return this.page.locator(
      'li[class*="create-dossier"]:not([class*="create-report"])'
    ).first();
  }

  getCreateNewDossierPanel() {
    return this.page.locator('.ant-modal-content').first();
  }

  getCreateNewDossierAddDataBody() {
    return this.page.locator('[class*="ag-body-viewport"]').first();
  }

  getCreateNewDossierSelectTemplateInfoPanel() {
    return this.page.locator('.main-info-container').first();
  }

  private get projectDropdownBtn() {
    return this.page.locator(
      '[class*="projectPicker"] [class*="project-selector"], [class*="ant-select-selector"]'
    ).first();
  }

  private getProjectDropdownOption(name: string) {
    return this.page.locator(
      `[class*="ant-select-item-option-content"] div:has-text("${name}")`
    ).first();
  }

  private get searchBox() {
    return this.page.locator('.mstr-rc-input, .ant-input').filter({ has: this.getCreateNewDossierPanel() }).first();
  }

  private get clearSearchBtn() {
    return this.page.locator('button[aria-label="Clear"], .mstr-filter-search-input-clear').first();
  }

  private templateInGallery(name: string) {
    return this.getCreateNewDossierPanel().locator(
      `[class*="template-gallery"] [class*="name"]:has-text("${name}")`
    ).first();
  }

  private get listViewButton() {
    return this.page.locator('[class*="list-view-button"]').first();
  }

  private get gridViewButton() {
    return this.page.locator('[class*="grid-view-button"]').first();
  }

  private tabViewer(tabName: string) {
    return this.page.locator(`[class*="tab-view-container"] div:has-text("${tabName}")`).first();
  }

  private get createBtn() {
    return this.page.locator('.footer.library-theme .create-btn, button:has-text("Create")').first();
  }

  private templateInfoIcon(templateName: string) {
    return this.page.locator(`div:has-text("${templateName}")`).locator('[class*="info-icon"]').first();
  }

  /** Click Add → Create Report to open the Create New Report dialog */
  async createNewReport(): Promise<void> {
    try {
      await this.addButton.waitFor({ state: 'visible', timeout: 30000 });
    } catch (e) {
      const fs = require('fs');
      await this.page.screenshot({ path: '/tmp/add_button_timeout.png' }).catch(() => {});
      const html = await this.page.content().catch(() => '');
      fs.writeFileSync('/tmp/add_button_timeout.html', html);
      throw e;
    }
    await this.addButton.click();
    await this.page.waitForTimeout(500);
    await this.createNewReportItem.waitFor({ state: 'visible', timeout: 5000 });
    await this.createNewReportItem.click();
    await this.page.waitForSelector('.ant-modal-content', { state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(1000);
  }

  /** Switch project by name in the project dropdown */
  async switchProjectByName(projectName: string): Promise<void> {
    await this.projectDropdownBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.projectDropdownBtn.click();
    await this.page.waitForTimeout(500);
    const option = this.getProjectDropdownOption(projectName);
    await option.waitFor({ state: 'visible', timeout: 8000 });
    await option.click();
    await this.page.waitForTimeout(1000);
  }

  /** Search for template in the search box */
  async searchTemplate(inputText: string): Promise<void> {
    await this.clearSearchData();
    const box = this.getCreateNewDossierPanel().locator('.mstr-rc-input, .ant-input').first();
    await box.waitFor({ state: 'visible', timeout: 5000 });
    await box.fill(inputText);
    await this.page.waitForTimeout(2000);
  }

  /** Clear search box */
  async clearSearchData(): Promise<void> {
    const clearBtn = this.clearSearchBtn;
    if (await clearBtn.isVisible().catch(() => false)) {
      await clearBtn.click();
      await this.page.waitForTimeout(300);
    }
    const box = this.getCreateNewDossierPanel().locator('.mstr-rc-input, .ant-input').first();
    if (await box.isVisible().catch(() => false)) {
      await box.clear();
    }
  }

  /** Select template by name (grid or list view) */
  async selectTemplate(templateName: string): Promise<void> {
    if (templateName === 'Blank') {
      const blankEl = this.getCreateNewDossierPanel().locator(
        '[class*="template-gallery"] [class*="blank-dossier"], [class*="blank-dossier"]'
      ).first();
      await blankEl.waitFor({ state: 'visible', timeout: 8000 });
      await blankEl.click();
    } else {
      const listViewSelected = await this.page.locator('.list-view-button.selected').isVisible().catch(() => false);
      if (listViewSelected) {
        const item = this.getCreateNewDossierPanel().locator('.template-name').filter({ hasText: templateName }).first();
        await item.waitFor({ state: 'visible', timeout: 8000 });
        await item.click();
      } else {
        const item = this.templateInGallery(templateName);
        await item.waitFor({ state: 'visible', timeout: 8000 });
        await item.click();
      }
    }
    await this.page.waitForTimeout(500);
  }

  /** Switch to list view */
  async switchToListView(): Promise<void> {
    const btn = this.page.locator('[class*="list-view-button"]').first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await this.page.waitForTimeout(2000);
  }

  /** Switch to grid view */
  async switchToGridView(): Promise<void> {
    const btn = this.page.locator('[class*="grid-view-button"]').first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await this.page.waitForTimeout(500);
  }

  /** Get view mode selector element (e.g. "Data Pause Mode") */
  getViewModeSelector() {
    return this.getCreateNewDossierPanel().locator('.view-mode-selector').first();
  }

  async getViewModeSelectorText(): Promise<string> {
    const el = this.getViewModeSelector();
    if (!(await el.isVisible().catch(() => false))) return '';
    return (await el.textContent())?.trim() ?? '';
  }

  /** Select pause mode (first option) in view mode selector */
  async selectPauseMode(): Promise<void> {
    const selector = this.getViewModeSelector();
    if (await selector.isVisible().catch(() => false)) {
      await selector.click();
      await this.page.waitForTimeout(500);
      const options = this.page.locator('.view-mode-selector-option');
      await options.first().click();
      await this.page.waitForTimeout(500);
    }
  }

  /** Select execution mode (vs pause/design mode) in view mode selector */
  async selectExecutionMode(): Promise<void> {
    const selector = this.getViewModeSelector();
    if (await selector.isVisible().catch(() => false)) {
      await selector.click();
      await this.page.waitForTimeout(500);
      const options = this.page.locator('.view-mode-selector-option');
      const count = await options.count();
      if (count >= 2) {
        await options.nth(1).click();
      } else {
        await options.first().click();
      }
      await this.page.waitForTimeout(500);
    }
  }

  /** Click Create button */
  async clickCreateButton(): Promise<void> {
    await this.createBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.createBtn.click();
    await this.getCreateNewDossierPanel().waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
    await this.page.waitForTimeout(2000);
  }

  /** Reset localStorage for dossier creator state */
  async resetLocalStorage(): Promise<void> {
    for (let i = 0; i < 3; i++) {
      try {
        await this.page.evaluate(() => {
          localStorage.removeItem('/MicroStrategyLibrary/mstrProjectSelection');
          localStorage.removeItem('/MicroStrategyLibrary/mstrDossierCreateSourceTab');
          localStorage.removeItem('/MicroStrategyLibrary/mstrReportCreateSourceTab');
          localStorage.removeItem('/MicroStrategyLibrary/mstrReportViewMode');
        });
        break; // Success
      } catch (e: any) {
        if (i === 2) throw e;
        // If execution context was destroyed by navigation, wait and retry
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /** Open template info panel for template */
  async checkTemplateInfo(templateName: string): Promise<void> {
    const icon = this.templateInfoIcon(templateName);
    await icon.waitFor({ state: 'visible', timeout: 8000 });
    await icon.click();
    await this.page.waitForTimeout(2000);
    await this.getCreateNewDossierSelectTemplateInfoPanel().waitFor({ state: 'visible', timeout: 5000 });
  }

  /** Click Blank template / Blank Dossier button */
  async clickBlankDossierBtn(): Promise<void> {
    const btn = this.page.locator('button[class*="blank-dossier-btn"]').first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    const panel = this.getCreateNewDossierPanel();
    if (await panel.isVisible().catch(() => false)) {
      const dontShow = this.page.locator('[class*="contentWrapper"] [class*="CheckBox"]').first();
      if (await dontShow.isVisible().catch(() => false)) {
        await dontShow.click();
      }
    }
  }

  /** Fake update timestamp (WDIO: for screenshot stability - skip in Playwright) */
  async fakeUpdateTimestamp(): Promise<void> {
    // No-op for Playwright; WDIO used executeScript to fake text
    await this.page.waitForTimeout(100);
  }

  /** Active tab header text (e.g. "Select Template", "Cubes") */
  async getActiveTabHeaderText(): Promise<string> {
    const tab = this.getCreateNewDossierPanel().locator('.tab-view-tab.active').first();
    await tab.waitFor({ state: 'visible', timeout: 5000 });
    return (await tab.textContent())?.trim() ?? '';
  }

  /** Switch to Cubes tab */
  async switchToCubesTab(): Promise<void> {
    await this.switchTabViewer('Cubes');
    await this.page.waitForTimeout(500);
    await this.page.locator('.mstr-rc-loading-dot-icon').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  /** Switch to Select Template tab */
  async switchToTemplateTab(): Promise<void> {
    await this.switchTabViewer('Select Template');
    await this.page.waitForTimeout(500);
  }

  /** Switch to MDX Sources tab */
  async switchToMdxSourceTab(): Promise<void> {
    await this.switchTabViewer('MDX Sources');
    await this.page.waitForTimeout(500);
  }

  private async switchTabViewer(tabName: string): Promise<void> {
    const tab = this.tabViewer(tabName);
    await tab.waitFor({ state: 'visible', timeout: 5000 });
    await tab.click();
  }

  /** Whether Create button is enabled */
  async isCreateButtonEnabled(): Promise<boolean> {
    const btn = this.page.locator('.footer.library-theme .create-btn, button:has-text("Create")').first();
    return btn.isEnabled();
  }

  /** Close the Create New Dossier panel */
  async closeNewDossierPanel(): Promise<void> {
    const closeBtn = this.getCreateNewDossierPanel().locator('.ant-modal-close-x, [class*="modal-close"]').first();
    await closeBtn.waitFor({ state: 'visible', timeout: 5000 });
    await closeBtn.click();
    await this.getCreateNewDossierPanel().waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  }

  /** Search in Add Data tab (cubes/datasets) */
  async searchData(inputText: string): Promise<void> {
    await this.clearSearchData();
    const box = this.getCreateNewDossierPanel().locator('.mstr-rc-input, .ant-input').first();
    await box.waitFor({ state: 'visible', timeout: 5000 });
    await box.fill(inputText);
    await this.page.waitForTimeout(2000);
  }

  /** Sort Add Data grid by column header */
  async sortDataByHeaderName(headerName: string): Promise<void> {
    const header = this.page.locator(
      `[class*="ag-header-cell-label"] span:has-text("${headerName}")`
    ).first();
    await header.waitFor({ state: 'visible', timeout: 5000 });
    await header.click();
    await this.page.waitForTimeout(1000);
  }

  /** Select cube by name in Add Data grid */
  async selectReportCube(options: { name: string; index?: number; isWait?: boolean }): Promise<void> {
    const { name, index = 0, isWait = true } = options;
    const grid = this.getCubeFlatGrid();
    const nameCell = grid.locator('.ag-cell[col-id="name"]').filter({ hasText: new RegExp(`^${name}$`, 'i') }).nth(index);
    await nameCell.waitFor({ state: 'visible', timeout: 10000 });
    await nameCell.click();
    if (isWait) {
      await this.page.waitForTimeout(1000);
    }
  }

  /** Cube grid in Add Data tab */
  getCubeFlatGrid() {
    return this.getCreateNewDossierPanel().locator('.ag-root-wrapper, [class*="ag-root"]').first();
  }

  /** Confirm switch project popup (visible when cube selected and switching project) */
  getConfirmSwitchProjectPopup() {
    return this.page.locator(
      '.mstr-react-dossier-creator-confirmation-dialog.confirmation-dialog.library-theme, [class*="confirmation-dialog"]'
    ).first();
  }

  /** Current project text in project picker */
  getCurrentProject() {
    return this.page.locator(
      '[class*="projectPicker"] .ant-select-selection-item div, [class*="project-selector"] [class*="selection-item"]'
    ).first();
  }

  async getCurrentProjectText(): Promise<string> {
    const el = this.getCurrentProject();
    await el.waitFor({ state: 'visible', timeout: 5000 });
    return (await el.textContent())?.trim() ?? '';
  }

  /** Cancel switch project in confirmation popup */
  async cancelSwitchProject(): Promise<void> {
    const btn = this.page.locator('button[class*="confirmation-dialog-cancel-button"]').first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await this.page.waitForTimeout(500);
  }

  /** No result warning (e.g. when no execute ACL on templates) */
  getNoResultWarning() {
    return this.getCreateNewDossierPanel().locator(
      '.no-item-warning, [class*="no-content"], [class*="no-data"], .single-icon-illustrations-no-content-no-data-returned'
    ).first();
  }

  /** Confirm switch project in confirmation popup */
  async confirmSwitchProject(): Promise<void> {
    const btn = this.page.locator('button[class*="confirmation-dialog-action-button"]').first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await this.page.waitForTimeout(1000);
    await this.page.locator('.mstr-rc-loading-dot-icon').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  /** Active tab pane (for folder mode assertions) */
  getActiveTab() {
    return this.getCreateNewDossierPanel().locator('.ant-tabs-tabpane-active').first();
  }

  /** Switch to tree/folder browsing mode in Add Data tab */
  async switchToTreeMode(): Promise<void> {
    const treeModeBtn = this.getCreateNewDossierPanel().locator(
      '.browsing-mode-icon.template-library-theme, [class*="tree-mode"], [class*="browsing-mode"]'
    ).first();
    await treeModeBtn.waitFor({ state: 'visible', timeout: 5000 });
    await treeModeBtn.click();
    await this.page.waitForTimeout(1000);
  }

  /** Wait for dossier creator loading to complete */
  async waitTemplateLoading(): Promise<void> {
    await this.getCreateNewDossierPanel()
      .locator('.mstr-rc-loading-dot-icon')
      .waitFor({ state: 'hidden', timeout: 15000 })
      .catch(() => {});
    await this.page.waitForTimeout(500);
  }

  /** Dismiss tooltips by hovering on title bar */
  async dismissTooltipsByClickTitle(): Promise<void> {
    const titleBar = this.getCreateNewDossierPanel().locator('.ant-modal-title').first();
    await titleBar.hover();
    await this.page.waitForTimeout(1000);
  }

  /** Get row cell values in Add Data tab grid by row index */
  async getRowDataInAddDataTab(index: number): Promise<string[]> {
    const row = this.getCreateNewDossierPanel().locator(
      `.ag-center-cols-container .ag-row:nth-child(${index + 1})`
    ).first();
    const cells = row.locator('.ag-cell');
    const count = await cells.count();
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      const cell = cells.nth(i);
      const certifiedIcon = cell.locator('.object-selector-icon');
      if (await certifiedIcon.isVisible().catch(() => false)) {
        values.push('Certified');
      } else {
        const text = (await cell.textContent())?.trim() ?? '';
        if (text) values.push(text);
      }
    }
    return values;
  }

  /** Expand folder in tree view and wait for next level folder to appear */
  async expandTreeView(folderName: string, nextLevelFolder: string): Promise<void> {
    const panel = this.getCreateNewDossierPanel();
    const folderSpan = panel.locator(`[class*="ant-tree-list"] span[title="${folderName}"]`).first();
    await folderSpan.scrollIntoViewIfNeeded();
    const expandIcon = panel.locator(
      `xpath=.//span[@title="${folderName}"]/.././/span[contains(@class, "ant-tree-switcher-icon")]`
    ).first();
    await expandIcon.click();
    await this.getCreateNewDossierPanel()
      .locator(`[class*="ant-tree-list"] span[title="${nextLevelFolder}"]`)
      .first()
      .waitFor({ state: 'visible', timeout: 8000 });
    await this.waitTemplateLoading();
  }

  /** Double-click folder in tree view to navigate into it */
  async doubleClickOnTreeView(folderName: string): Promise<void> {
    const folderSpan = this.getCreateNewDossierPanel().locator(
      `[class*="ant-tree-list"] span[title="${folderName}"]`
    ).first();
    await folderSpan.scrollIntoViewIfNeeded();
    await folderSpan.dblclick();
    await this.waitTemplateLoading();
  }

  /** Double-click folder in ag-grid (list) view to navigate into it */
  async doubleClickOnAgGrid(folderName: string): Promise<void> {
    const folderCell = this.getCreateNewDossierPanel().locator(
      `[class*="ag-center-cols-container"] >> *:has-text("${folderName}")`
    ).first();
    await folderCell.waitFor({ state: 'visible', timeout: 8000 });
    await folderCell.dblclick();
    await this.waitTemplateLoading();
    await folderCell.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }
}
