import type { Page } from '@playwright/test';
import { FontPicker } from './font-picker';

/** Lean POM for Format Panel grid template/spacing. */
export class NewFormatPanelForGrid {
  readonly fontPicker: FontPicker;

  constructor(private readonly page: Page) {
    const formatPanel = this.page.locator('.report-editor-editor .format-panel, [class*="format-panel"]').first();
    this.fontPicker = new FontPicker(page, formatPanel);
  }

  readonly templateSection = this.page.getByRole('region', { name: /template/i });
  readonly spacingSection = this.page.getByRole('region', { name: /spacing/i });
  readonly layoutSection = this.page.getByRole('region', { name: /layout/i });

  private get gridSegmentDropDown() {
    return this.page.locator(
      '(//div[contains(@class,"editor-segment") and descendant::div[contains(@class,"text-format")]]//div[@class="dropdown-menu-control-box"])[1]'
    );
  }

  private get gridColumnsDropDown() {
    return this.page.locator(
      '(//div[contains(@class,"editor-segment") and descendant::div[contains(@class,"text-format")]]//div[@class="dropdown-menu-control-box"])[2]'
    );
  }

  async expandTemplateSection(): Promise<void> {
    await this.templateSection.click();
  }

  async expandSpacingSection(): Promise<void> {
    await this.spacingSection.click();
  }

  async expandLayoutSection(): Promise<void> {
    await this.layoutSection.click();
  }

  async switchToTextFormatTab(): Promise<void> {
    const textTab = this.page.locator('[class*="segment-control-icons"]').filter({ hasText: /text|Text/i }).first();
    await textTab.click({ timeout: 5000 });
    await this.page.waitForTimeout(500);
  }

  async selectGridSegment(segment: string): Promise<void> {
    await this.gridSegmentDropDown.click();
    await this.page.locator('.dropdown-menu-option-display-name').filter({ hasText: segment }).first().click();
    await this.page.waitForTimeout(300);
  }

  async selectGridColumns(column: string): Promise<void> {
    await this.gridColumnsDropDown.click();
    await this.page.locator('.dropdown-menu-option-display-name').filter({ hasText: column }).first().click();
    await this.page.waitForTimeout(300);
  }

  async selectGridTemplateStyle(name: string): Promise<void> {
    await this.page.getByRole('button', { name: new RegExp(name, 'i') }).first().click({ timeout: 5000 });
    await this.page.waitForTimeout(300);
  }

  async selectGridTemplateColor(name: string): Promise<void> {
    await this.page.getByRole('button', { name: new RegExp(name, 'i') }).first().click({ timeout: 5000 });
    await this.page.waitForTimeout(300);
  }

  async selectCellPadding(size: string): Promise<void> {
    const btn = this.page.getByRole('button', { name: new RegExp(size, 'i') });
    await btn.first().click({ timeout: 5000 });
    await this.page.waitForTimeout(300);
  }

  async selectFontAlign(_align: string): Promise<void> {
    throw new Error('TODO');
  }

  async setTextFontSize(size: string): Promise<void> {
    const input = this.page.locator('input[type="number"], input[placeholder*="size"], input[class*="font-size"]').first();
    await input.fill(size);
    await this.page.waitForTimeout(300);
  }

  async clickTextFormatButton(_format: string): Promise<void> {
    throw new Error('TODO');
  }

  async enableWrapText(): Promise<void> {
    const cb = this.page.getByRole('checkbox', { name: /wrap text/i });
    if (!(await cb.isChecked())) await cb.click();
    await this.page.waitForTimeout(300);
  }

  async disableWrapText(): Promise<void> {
    const cb = this.page.getByRole('checkbox', { name: /wrap text/i });
    if (await cb.isChecked()) await cb.click();
    await this.page.waitForTimeout(300);
  }

  clickFontColorBtn(): Promise<void> {
    return this.page.getByRole('button', { name: /font color|text color|color/i }).first().click().then(() => this.page.waitForTimeout(300));
  }

  async clickBuiltInColor(hex: string): Promise<void> {
    const color = this.page.locator(`[style*="${hex}"], [data-color="${hex}"], [title*="${hex}"]`).first();
    await color.click({ timeout: 5000 });
    await this.page.waitForTimeout(300);
  }

  async selectTextFont(font: string): Promise<void> {
    const dropdown = this.page.locator('[class*="font"], [class*="fontFamily"]').first();
    await dropdown.click();
    await this.page.getByText(font, { exact: false }).first().click();
    await this.page.waitForTimeout(300);
  }

  async selectFontAlign(align: string): Promise<void> {
    const btn = this.page.getByRole('button', { name: new RegExp(align, 'i') });
    await btn.first().click();
    await this.page.waitForTimeout(300);
  }

  async isCheckBoxChecked(_label: string): Promise<boolean> {
    throw new Error('TODO');
  }

  getUncheckedCheckbox(_label: string) {
    return this.page.getByRole('checkbox', { name: new RegExp(_label, 'i'), checked: false });
  }
}
