import type { Page } from '@playwright/test';

/** Font picker sub-POM for format panel and threshold editor */
export class FontPicker {
  constructor(private readonly page: Page, private readonly scope?: import('@playwright/test').Locator) {}

  private get root() {
    return this.scope ?? this.page;
  }

  async getCurrentSelectedFont(): Promise<string> {
    const sel = this.root.locator('[class*="font"] select, [class*="fontFamily"], [class*="font-select"]').first();
    const val = await sel.inputValue().catch(() => sel.textContent());
    return (val || '').trim();
  }

  async clickWarningIcon(): Promise<void> {
    await this.root.locator('[class*="warning"], [aria-label*="warning"], [title*="missing"]').first().click({ timeout: 5000 });
    await this.page.waitForTimeout(300);
  }

  getMissingFontTooltip() {
    return this.page.locator('.ant-tooltip, [role="tooltip"], [class*="tooltip"]').filter({ hasText: /missing|font/i }).first();
  }

  async selectFontByName(fontName: string): Promise<void> {
    const dropdown = this.root.locator('[class*="font"], [class*="fontFamily"]').first();
    await dropdown.click();
    await this.page.getByText(fontName, { exact: false }).first().click();
    await this.page.waitForTimeout(300);
  }
}
