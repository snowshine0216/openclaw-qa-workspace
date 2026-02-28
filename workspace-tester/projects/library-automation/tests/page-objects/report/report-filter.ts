import type { Page } from '@playwright/test';
import { InlineFilterItem } from './inline-filter-item';

/** Expression types for findInlineFilterItem (matches WDIO reportFilterType) */
export type ReportFilterExpType = 'Attribute Qualification' | 'Metric Qualification';

/**
 * Report filter - consumption & authoring filter panel expressions.
 * Migrated from WDIO ReportFilter.js.
 */
export class ReportFilter {
  constructor(private readonly page: Page) {}

  /** Filter panel dropdown / content (consumption mode) */
  private get filterPanelDropdown() {
    return this.page.locator('.mstrd-FilterDropdownMenuContainer .mstrd-DropdownMenu-content').first();
  }

  /** Filter icon to open/close filter panel */
  private get filterIcon() {
    return this.page.locator('.mstr-nav-icon.icon-tb_filter_n, .mstr-nav-icon.icon-tb_filter_a').first();
  }

  /** Open filter panel (consumption) */
  async open(): Promise<void> {
    const icon = this.page.locator('.mstr-nav-icon.icon-tb_filter_n').first();
    await icon.waitFor({ state: 'visible', timeout: 10000 });
    await icon.click();
    await this.filterPanelDropdown.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  /** Close filter panel (consumption) */
  async close(): Promise<void> {
    const icon = this.page.locator('.mstr-nav-icon.icon-tb_filter_a').first();
    if (await icon.isVisible().catch(() => false)) {
      await icon.click();
    }
  }

  /** Wait for view filter panel loading to complete */
  async waitForViewFilterPanelLoading(): Promise<void> {
    await this.page.locator('.mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  /** Open filter by header (expType + objectName) */
  async openFilterByHeader(options: { expType: ReportFilterExpType; objectName: string }): Promise<void> {
    const { objectName } = options;
    const header = this.filterPanelDropdown.locator(`[class*="FilterItemContainer"]`).filter({ hasText: objectName }).first();
    await header.waitFor({ state: 'visible', timeout: 5000 });
    await header.click();
    await this.page.waitForTimeout(500);
  }

  /** Apply filter */
  async apply(): Promise<void> {
    const applyBtn = this.page.locator('.mstr-apply-button').first();
    await applyBtn.waitFor({ state: 'visible', timeout: 5000 });
    await applyBtn.click();
    await this.page.locator('.mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  /** Trigger filter section info icon (scope filter tooltip) */
  async triggerFilterSectionInfoIcon(): Promise<void> {
    const infoIcon = this.filterPanelDropdown.locator('.mstrd-InfoIcon').first();
    await infoIcon.waitFor({ state: 'visible', timeout: 5000 });
    await infoIcon.click();
  }

  /** Get tooltip text */
  async getTooltipText(): Promise<string> {
    const tooltip = this.page.locator('.ant-tooltip-inner, [role="tooltip"]').first();
    await tooltip.waitFor({ state: 'visible', timeout: 5000 });
    return (await tooltip.textContent())?.trim() ?? '';
  }

  /**
   * Find inline filter item in view filter panel.
   * @param expType - e.g. 'Metric Qualification', 'Attribute Qualification'
   * @param objectName - e.g. 'Profit', 'Category'
   * @param index - 1-based index if multiple same expressions
   */
  findInlineFilterItem(options: {
    expType: ReportFilterExpType;
    objectName: string;
    index?: number;
  }): InlineFilterItem {
    const { expType, objectName, index = 1 } = options;
    const predicates = this.page.locator('.filter-expression-predicate').filter({
      has: this.page.locator(`[aria-label*="${expType}"]`),
    });
    const withObject = predicates.filter({ hasText: new RegExp(`^${objectName}$|\\b${objectName}\\b`, 'i') });
    const parent = withObject.nth(index - 1);
    return new InlineFilterItem(parent);
  }
}
