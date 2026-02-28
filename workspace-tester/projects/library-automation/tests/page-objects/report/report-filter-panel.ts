import type { Page } from '@playwright/test';
import { ReportEditorNewQual } from './report-editor-new-qual';

/**
 * Report filter panel (cube filter, report filter, view filter tabs).
 * Migrated from WDIO report/reportEditor/ReportFilterPanel.js.
 */
export class ReportFilterPanel {
  readonly newQual: ReportEditorNewQual;

  constructor(private readonly page: Page) {
    this.newQual = new ReportEditorNewQual(page);
  }

  /** Main filter panel container */
  getContainer() {
    return this.page.locator('.report-filter-panel').first();
  }

  getViewFilterTab() {
    return this.page.locator('.view-filter-tab').first();
  }

  getViewFilterEmptyPlaceholder() {
    return this.page.locator('.new-view-filter-container .mstr-qualification-panel .qualification-innr-container-empty-placeholder').first();
  }

  getAttributeElementFilterSubpanel() {
    return this.page.locator('.qualification-panel-popover.mode-authoring:not(.ant-popover-hidden) .ant-popover-content').first();
  }

  private getFilterTab(filterTab: string) {
    return this.page.locator(`.report-filter-panel span[class*="${filterTab}-data"]`).first();
  }

  /** Switch to View Filter tab (grid-data) */
  async switchToViewFilterTab(): Promise<void> {
    const tab = this.getFilterTab('grid');
    await tab.waitFor({ state: 'visible', timeout: 5000 });
    await tab.click();
    await this.page.locator('.mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async switchToReportFilterTab(): Promise<void> {
    const tab = this.getFilterTab('report');
    await tab.waitFor({ state: 'visible', timeout: 5000 });
    await tab.click();
  }

  async openNewViewFilterPanel(): Promise<void> {
    const btn = this.getViewFilterTab().locator('.new-qualification-button').first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
  }

  async openNewQualicationEditorAtNonAggregationLevel(): Promise<void> {
    const plusBtn = this.page.locator('(//button[contains(@class,"new-qualification-button")])[1]').first();
    await plusBtn.waitFor({ state: 'visible', timeout: 5000 });
    await plusBtn.click();
  }

  private get filterApplyButton() {
    return this.getContainer().locator('.tab-view-pane[aria-hidden="false"] .filter-apply-button').first();
  }

  async clickFilterApplyButton(): Promise<void> {
    await this.filterApplyButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.filterApplyButton.click();
    await this.page.locator('.mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async clickCancelQualificationEditor(): Promise<void> {
    const cancelBtn = this.getAttributeElementFilterSubpanel().locator('.qualification-editor-footer-buttons span:has-text("Cancel")').first();
    await cancelBtn.waitFor({ state: 'visible', timeout: 5000 });
    await cancelBtn.click();
    await this.getAttributeElementFilterSubpanel().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  /** Attribute elements filter - toggle in-list vs not-in-list mode */
  get attributeFilter() {
    return {
      toggleElementListMode: async (): Promise<void> => {
        const toggle = this.getAttributeElementFilterSubpanel().locator('button[role="switch"]').first();
        await toggle.waitFor({ state: 'visible', timeout: 5000 });
        await toggle.click();
      },
    };
  }

  /** Metric filter - operator, value, done */
  get metricFilter() {
    const subpanel = this.getAttributeElementFilterSubpanel();
    return {
      openSelector: async (name: string): Promise<void> => {
        const sel = subpanel.locator(`[aria-label*="${name}"]`).first();
        await sel.waitFor({ state: 'visible', timeout: 5000 });
        await sel.click();
      },
      selectOption: async (option: string): Promise<void> => {
        await this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item').filter({ hasText: option }).first().click();
      },
      enterValue: async (value: string): Promise<void> => {
        const input = subpanel.locator('input[type="text"], input[type="number"]').first();
        await input.fill(value);
      },
      done: async (): Promise<void> => {
        await this.newQual.done();
      },
    };
  }

  async saveAndCloseQualificationEditor(_apply?: boolean): Promise<void> {
    const doneBtn = this.getAttributeElementFilterSubpanel().locator('.qualification-editor-footer-buttons span:has-text("Done")').first();
    await doneBtn.waitFor({ state: 'visible', timeout: 5000 });
    await doneBtn.click();
    await this.page.locator('.mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async selectElements(elements: string[]): Promise<void> {
    for (const name of elements) {
      const cb = this.getAttributeElementFilterSubpanel().locator(`button.attribute-elements-checkbox-container[data-value="${name}"]`).first();
      await cb.waitFor({ state: 'visible', timeout: 5000 });
      await cb.click();
    }
  }

  async removeAllFilter(): Promise<void> {
    throw new Error('TODO: implement');
  }

  /** Attribute forms panel locator (authoring) */
  readonly AttributeFormsPanel = this.page.locator('.qualification-panel-popover.mode-authoring .ant-popover-content').first();

  /** Toggle view selected in attribute element filter */
  async toggleViewSelected(): Promise<void> {
    const toggle = this.getAttributeElementFilterSubpanel().locator('button[role="switch"]').first();
    await toggle.waitFor({ state: 'visible', timeout: 5000 });
    await toggle.click();
    await this.page.waitForTimeout(500);
  }

  /** Wait for element visible */
  async waitForElementVisible(locator: import('@playwright/test').Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
  }
}
