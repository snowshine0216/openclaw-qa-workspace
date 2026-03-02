import type { Page } from '@playwright/test';

/**
 * Report TOC (Edit/Format/Filter tabs) for report editor.
 * Migrated from WDIO report/reportEditor/ReportTOC.js.
 */
export class ReportTOC {
  constructor(private readonly page: Page) {}

  private getPanelTab(panelName: string) {
    const name = panelName.toLowerCase();
    const byClass = this.page.locator(`.ant-tabs-nav-list div[class*="${name}"]`).first();
    const byRole = this.page.getByRole('tab', { name: new RegExp(name, 'i') }).first();
    return byClass.or(byRole);
  }

  private async clickPanelTab(panelName: string): Promise<void> {
    const tab = this.getPanelTab(panelName);
    await tab.click({ timeout: 5000 });
    await this.page.locator('.mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }

  async switchToFilterPanel(): Promise<void> {
    await this.clickPanelTab('filter');
    await this.page.waitForTimeout(1000);
  }

  async switchToEditorPanel(): Promise<void> {
    await this.clickPanelTab('edit');
  }

  async switchToFormatPanel(): Promise<void> {
    await this.clickPanelTab('format');
  }

  async switchToThemePanel(): Promise<void> {
    await this.clickPanelTab('theme');
  }
}
