/**
 * Filter panel (consumption mode) - WDIO FilterPanel.js.
 * For report consumption: filter dropdown, filter icon.
 */
import type { Page } from '@playwright/test';

export class FilterPanel {
  constructor(private readonly page: Page) {}

  /** Filter panel dropdown content */
  getFilterPanelDropdown() {
    return this.page.locator('.mstrd-FilterDropdownMenuContainer .mstrd-DropdownMenu-content').first();
  }

  /** Filter icon (opened state - icon-tb_filter_a) */
  getFilterIcon() {
    return this.page.locator('.mstr-nav-icon.icon-tb_filter_a').first();
  }
}
