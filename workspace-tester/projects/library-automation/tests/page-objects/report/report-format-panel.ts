import type { Page } from '@playwright/test';

/** Lean POM for Format Panel column width, padding, banding. */
export class ReportFormatPanel {
  constructor(private readonly page: Page) {}

  /** Format panel container (WDIO: reportFormatPanel.FormatPanel) */
  readonly FormatPanel = this.page.locator('.report-editor-editor .format-panel').first();

  applyColorBySelectionBox = this.page.getByRole('combobox', { name: /apply color/i });

  async openColumnSizeFitSelectionBox(): Promise<void> {
    const box = this.page.getByRole('combobox', { name: /column size|fit to/i }).first();
    await box.click({ timeout: 5000 });
    await this.page.waitForTimeout(300);
  }

  async clickColumnSizeFitOption(option: string): Promise<void> {
    await this.openColumnSizeFitSelectionBox();
    await this.page.getByRole('option', { name: new RegExp(option, 'i') }).first().click();
    await this.page.waitForTimeout(300);
  }

  async selectOptionFromDropdown(option: string): Promise<void> {
    await this.page.getByRole('option', { name: new RegExp(option, 'i') }).first().click({ timeout: 5000 });
    await this.page.waitForTimeout(300);
  }

  async openMinimumColumnWidthMenu(): Promise<void> {
    const btn = this.page.getByRole('button', { name: /minimum column|add|column width/i }).first();
    await btn.click({ timeout: 5000 });
    await this.page.waitForTimeout(300);
  }

  async addMinimumColumnWidthOption(col: string): Promise<void> {
    await this.page.getByRole('option', { name: new RegExp(col, 'i') }).first().click({ timeout: 5000 });
    await this.page.waitForTimeout(300);
  }

  async setMinimumColumnWidthValue(col: string, value: string): Promise<void> {
    const input = this.FormatPanel.locator(`input[placeholder*="${col}"], input[name*="${col}"]`).or(
      this.page.getByLabel(new RegExp(col, 'i')).locator('input')
    ).first();
    await input.fill(value);
    await this.page.waitForTimeout(300);
  }

  async deleteMinimumColumnWidthOption(_col: string): Promise<void> {
    const removeBtn = this.page.getByRole('button', { name: /remove|delete/i }).first();
    await removeBtn.click({ timeout: 5000 });
    await this.page.waitForTimeout(300);
  }

  /** Alias for getMinimumColumnWithInputValue (WDIO typo) */
  async getMinimumColumnWithInputValue(col: string): Promise<string> {
    const input = this.page.locator(`input[placeholder*="${col}"], input[name*="${col}"]`).or(
      this.page.getByLabel(new RegExp(col, 'i')).locator('input')
    ).first();
    const val = await input.inputValue();
    return val ? `${val}px` : '';
  }

  async getValueOfMinimumColumnWidthOption(_col: string): Promise<string> {
    throw new Error('TODO');
  }

  async isMinimumColumnWidthInputDisplayed(_col: string): Promise<boolean> {
    throw new Error('TODO');
  }

  async isMinimumColumnWidthSectionDisplayed(): Promise<boolean> {
    throw new Error('TODO');
  }

  async setPaddingValue(side: string, value: string): Promise<void> {
    const input = this.page.getByLabel(new RegExp(side, 'i')).locator('input').first();
    await input.fill(value);
    await this.page.waitForTimeout(300);
  }

  async getPaddingValue(side: string): Promise<string> {
    const input = this.page.getByLabel(new RegExp(side, 'i')).locator('input').first();
    return input.inputValue();
  }

  async clickOnPaddingArrowButton(side: string, direction: string, count: number): Promise<void> {
    const container = this.page.getByLabel(new RegExp(side, 'i')).first();
    const arrow = direction === 'up'
      ? container.getByRole('button', { name: /increase|up|\\+/i })
      : container.getByRole('button', { name: /decrease|down|-/i });
    for (let i = 0; i < count; i++) {
      await arrow.first().click();
      await this.page.waitForTimeout(100);
    }
  }

  /** Click checkbox for option within section (e.g. 'Row headers', 'Lock headers') */
  async clickCheckBoxForOption(option: string, section: string): Promise<void> {
    const sectionEl = this.page.locator('[class*="format-panel"], [class*="editor-panel"]').filter({ hasText: section }).first();
    const cb = sectionEl.getByRole('checkbox', { name: new RegExp(option, 'i') });
    await cb.click({ timeout: 5000 });
    await this.page.waitForTimeout(300);
  }

  async getCheckedCheckbox(_section: string, _opt: string) {
    return this.page.getByRole('checkbox', { name: new RegExp(_opt, 'i'), checked: true });
  }

  async enableOutlineMode(): Promise<void> {
    const cb = this.page.getByRole('checkbox', { name: /outline|compact/i });
    if (!(await cb.isChecked())) await cb.click();
    await this.page.waitForTimeout(300);
  }

  async enableStandardOutlineMode(): Promise<void> {
    const cb = this.page.getByRole('checkbox', { name: /standard outline|outline/i });
    if (!(await cb.isChecked())) await cb.click();
    await this.page.waitForTimeout(300);
  }

  async enableBanding(): Promise<void> {
    const cb = this.page.getByRole('checkbox', { name: /banding/i });
    if (!(await cb.isChecked())) await cb.click();
    await this.page.waitForTimeout(300);
  }

  async selectBandingByRows(): Promise<void> {
    await this.page.getByRole('radio', { name: /row/i }).first().click();
    await this.page.waitForTimeout(300);
  }

  async selectBandingBy(_by: string): Promise<void> {
    await this.page.getByRole('radio', { name: new RegExp(_by, 'i') }).first().click();
    await this.page.waitForTimeout(300);
  }

  async selectBandingHeader(header: string): Promise<void> {
    await this.page.getByRole('combobox').first().click();
    await this.page.getByRole('option', { name: new RegExp(header, 'i') }).first().click();
    await this.page.waitForTimeout(300);
  }

  async selectBandingByColumns(): Promise<void> {
    await this.page.getByRole('radio', { name: /column/i }).first().click();
    await this.page.waitForTimeout(300);
  }

  async applyColorByNumberOfColumns(): Promise<void> {
    await this.applyColorBySelectionBox.click();
    await this.page.getByRole('option', { name: /number of columns/i }).first().click();
    await this.page.waitForTimeout(300);
  }

  async applyColorByNumberOfRows(): Promise<void> {
    await this.applyColorBySelectionBox.click();
    await this.page.getByRole('option', { name: /number of rows/i }).first().click();
    await this.page.waitForTimeout(300);
  }

  async applyColorByRowHeader(): Promise<void> {
    await this.applyColorBySelectionBox.click();
    await this.page.getByRole('option', { name: /row header/i }).first().click();
    await this.page.waitForTimeout(300);
  }

  async openApplyColorBySelectionBox(): Promise<void> {
    await this.applyColorBySelectionBox.click();
    await this.page.waitForTimeout(300);
  }

  async openBandingHeaderSelectionBox(): Promise<void> {
    await this.page.getByRole('combobox', { name: /header/i }).first().click();
    await this.page.waitForTimeout(300);
  }

  async openBandingColorPicker(which: string): Promise<void> {
    const btn = this.page.getByRole('button', { name: new RegExp(`${which}.*color|color.*${which}`, 'i') }).first();
    await btn.click();
    await this.page.waitForTimeout(300);
  }

  async setApplyColorEvery(n: string): Promise<void> {
    const input = this.page.locator('input[type="number"], input[placeholder*="every"]').first();
    await input.fill(n);
    await this.page.waitForTimeout(300);
  }

  async changeFirstBandingColor(hex: string): Promise<void> {
    const colorBtn = this.page.getByRole('button', { name: /first|banding/i }).first();
    await colorBtn.click();
    await this.page.locator(`[style*="${hex}"], [data-color="${hex}"]`).first().click();
    await this.page.waitForTimeout(300);
  }

  async changeSecondBandingColor(hex: string): Promise<void> {
    const colorBtn = this.page.getByRole('button', { name: /second|banding/i }).first();
    await colorBtn.click();
    await this.page.locator(`[style*="${hex}"], [data-color="${hex}"]`).first().click();
    await this.page.waitForTimeout(300);
  }

  async getFirstBandingColor(): Promise<string> {
    throw new Error('TODO');
  }

  async getApplyColorByNumberOfColumns(): Promise<string> {
    throw new Error('TODO');
  }

  async isBandingByColumns(): Promise<boolean> {
    throw new Error('TODO');
  }

  async isBandingEnabled(): Promise<boolean> {
    throw new Error('TODO');
  }

  async getLayoutSelectionBoxValue(): Promise<string> {
    throw new Error('TODO');
  }

  async isOutlineModeEnabled(): Promise<boolean> {
    throw new Error('TODO');
  }

  async selectGridSegment(segment: string, column: string): Promise<void> {
    const segmentBox = this.page.getByRole('combobox', { name: /segment|select/i }).first();
    await segmentBox.click();
    await this.page.getByRole('option', { name: new RegExp(segment, 'i') }).first().click();
    await this.page.waitForTimeout(200);
    const colBox = this.page.getByRole('combobox', { name: /column|headers|values/i }).first();
    await colBox.click();
    await this.page.getByRole('option', { name: new RegExp(column, 'i') }).first().click();
    await this.page.waitForTimeout(200);
  }

  async selectOptionFromBorderStyleDropdown(_style: string, _side: string): Promise<void> {
    throw new Error('TODO');
  }

  async selectOptionFromBorderColorDropdown(_color: string, _side: string): Promise<void> {
    throw new Error('TODO');
  }

  async getBorderStyleDropdownValue(_side: string): Promise<string> {
    throw new Error('TODO');
  }

  async getBorderColorDropDownSectionStyle(_side: string): Promise<string> {
    throw new Error('TODO');
  }

  async clickDefaultFormCheckBox(): Promise<void> {
    throw new Error('TODO');
  }

  async saveAndCloseAttributeFormsDialog(): Promise<void> {
    throw new Error('TODO');
  }

  async selectDisplayAttributeFormMode(_mode: string, _showName?: boolean): Promise<void> {
    throw new Error('TODO');
  }

  async isCellPaddingButtonChecked(_size: string): Promise<boolean> {
    throw new Error('TODO');
  }

  async getFontSelectorValue(): Promise<string> {
    const sel = this.page.locator('[class*="font"] select, [class*="fontFamily"]').first();
    const val = await sel.inputValue().catch(() => sel.textContent());
    return (val || '').trim();
  }

  async getFontTextSizeInputValue(): Promise<string> {
    const input = this.page.locator('input[placeholder*="size"], input[class*="font-size"]').first();
    const val = await input.inputValue();
    return val ? `${val}pt` : '';
  }

  async isTextFormatButtonSelected(format: string): Promise<boolean> {
    const btn = this.page.getByRole('button', { name: new RegExp(format, 'i') }).first();
    const pressed = await btn.getAttribute('aria-pressed');
    const hasClass = await btn.evaluate((el) => el.getAttribute('class')?.includes('selected'));
    return pressed === 'true' || !!hasClass;
  }

  async isFontAlignButtonSelected(align: string): Promise<boolean> {
    const btn = this.page.getByRole('button', { name: new RegExp(align, 'i') }).first();
    const pressed = await btn.getAttribute('aria-pressed');
    const hasClass = await btn.evaluate((el) => el.getAttribute('class')?.includes('selected'));
    return pressed === 'true' || !!hasClass;
  }

  async clickTextFormatButton(format: string): Promise<void> {
    const btn = this.page.getByRole('button', { name: new RegExp(format, 'i') }).first();
    await btn.click({ timeout: 5000 });
    await this.page.waitForTimeout(300);
  }
}
