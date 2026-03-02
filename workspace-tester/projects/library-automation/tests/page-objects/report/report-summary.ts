/**
 * Report filter summary bar and container (consumption mode).
 * WDIO: ReportFilterSummary / filter summary.
 */
import type { Page } from '@playwright/test';

export class ReportSummary {
  constructor(private readonly page: Page) {}

  /** Summary bar text (e.g. "SCOPE FILTERS  |  SF-Country ID [equals 1]") */
  async getSummaryBarText(): Promise<string> {
    const bar = this.page.locator('.mstrd-FilterSummaryBar, [class*="FilterSummaryBar"], [class*="filter-summary"]').first();
    await bar.waitFor({ state: 'visible', timeout: 10000 });
    return (await bar.textContent())?.trim() ?? '';
  }

  /** Summary container (modal/expanded view) */
  getSummaryContainer() {
    return this.page.locator('.mstrd-FilterSummaryContainer, [class*="FilterSummary"], .filter-summary-modal').first();
  }

  /** Click View All to expand filter summary */
  async viewAll(): Promise<void> {
    const btn = this.page.getByRole('button', { name: /view all|view all filters/i }).first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await this.page.waitForTimeout(500);
  }

  /** Edit filter from summary by name and section */
  async edit(options: { name: string; section: string }): Promise<void> {
    const { name, section } = options;
    const link = this.getSummaryContainer().locator(`a, span, div`).filter({ hasText: new RegExp(`^${name}$`, 'i') }).first();
    await link.waitFor({ state: 'visible', timeout: 5000 });
    await link.click();
    await this.page.waitForTimeout(1000);
  }
}
