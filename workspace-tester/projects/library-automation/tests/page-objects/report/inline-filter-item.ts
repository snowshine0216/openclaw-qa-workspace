import type { Locator } from '@playwright/test';

/**
 * Inline filter item - wraps a filter expression predicate for DnD target, etc.
 * Migrated from WDIO InlineFilterItem.js.
 */
export class InlineFilterItem {
  constructor(private readonly parent: Locator) {}

  /** Constant value input for metric qualification (drop target for value prompt) */
  getConstValueInput(index = 0): Locator {
    return this.parent.locator('[data-feature-id="constant-input-box"] input').nth(index);
  }

  /** Enter value into AQ input */
  async enterValue(options: { value: string; index?: number }): Promise<void> {
    const { value, index = 0 } = options;
    const input = this.parent.locator('input[type="text"], [data-feature-id="constant-input-box"] input').nth(index);
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill(value);
  }

  /** Wait for attribute list value to update */
  async waitForAttributeListValueUpdate(text: string): Promise<void> {
    await this.parent.page().waitForFunction(
      (t) => {
        const inputs = document.querySelectorAll('input[type="text"]');
        return Array.from(inputs).some((inp) => (inp as HTMLInputElement).value?.includes(t));
      },
      text,
      { timeout: 5000 }
    ).catch(() => {});
  }

  /** Enter value to date time picker */
  async enterValueToDateTimePicker(options: { value: string }): Promise<void> {
    const input = this.parent.locator('input[type="text"], .mstrmojo-DateTextBox-input').first();
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill(options.value);
  }

  /** Open operator dropdown */
  async openOperatorDropdown(): Promise<void> {
    const trigger = this.parent.locator('[class*="Pulldown"], .ant-select').first();
    await trigger.waitFor({ state: 'visible', timeout: 5000 });
    await trigger.click();
  }

  /** Get operator dropdown */
  getOperatorDropdown() {
    return this.parent.page().locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').first();
  }

  /** Set operator by name */
  async setOperator(name: string): Promise<void> {
    const item = this.parent.page().locator('.ant-select-item').filter({ hasText: name }).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
  }

  /** Select date in date time picker */
  async selectDateTime(options: { year: string; month: string; day: string; index?: number }): Promise<void> {
    const input = this.parent.locator('input').nth(options.index ?? 0);
    await input.click();
    await this.parent.page().waitForTimeout(300);
    // TODO: semantic date picker interaction - use placeholder locators
    const picker = this.parent.page().locator('.ant-picker-dropdown, [class*="DatePicker"]').first();
    await picker.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  /** Open dynamic date time picker */
  async openDynamicDateTimePicker(): Promise<void> {
    const btn = this.parent.locator('button, [class*="dynamic"], [aria-label*="dynamic"]').first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
  }

  /** Get dynamic date time picker */
  getDynamicDateTimePicker() {
    return this.parent.page().locator('.ant-picker-dropdown, [class*="DynamicDate"]').first();
  }

  /** Click Done in dynamic date picker */
  async clickDoneButtonInDynamicDatePicker(): Promise<void> {
    const btn = this.parent.page().locator('button:has-text("Done"), span:has-text("Done")').first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
  }

  /** Get date time input value */
  async getDateTimeInputValue(): Promise<string> {
    const input = this.parent.locator('input').first();
    return (await input.inputValue())?.trim() ?? '';
  }

  /** Set dynamic date (e.g. days: 100, dayOp: '+', months: 1, monthOp: '-') */
  async setDynamicDate(options: { days: string; dayOp: string; months: string; monthOp: string }): Promise<void> {
    // TODO: semantic locators for dynamic date fields
    const page = this.parent.page();
    const dayInput = page.locator('input[placeholder*="day"], [data-placeholder*="day"]').first();
    await dayInput.fill(options.days).catch(() => {});
  }
}
