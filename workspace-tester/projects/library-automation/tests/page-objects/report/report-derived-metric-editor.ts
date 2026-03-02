import type { Page } from '@playwright/test';

/**
 * Page object for the Derived Metric Editor (Metric IDE) in Report Editor.
 * Migrated from WDIO ReportDerivedMetricEditor.js
 */
export class ReportDerivedMetricEditor {
  constructor(private readonly page: Page) {}

  /** Main metric editor container */
  get metricDefn() { return this.page.locator('#mstrMetricIDE div.mstrmojo-MetricIDE, [class*="MetricIDE"]'); }
  get derivedMetricEditor() { return this.page.locator('#mstrMetricIDE div.mstrmojo-MetricIDE.dme.modal'); }
  get inputSection() { return this.page.locator('[class*="MetricIDE"] [class*="Editor-content"]'); }

  async switchMode(mode: 'Formula' | 'Function'): Promise<void> {
    await this.page.locator('.mstrmojo-Editor-curtain, .mstrmojo-InlineWaitIcon').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    const btn = this.page.locator(`text="Switch to ${mode}"`).or(this.page.locator('[class*="ME-switch"]').filter({ hasText: new RegExp(mode, 'i') })).first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  async switchToFormulaMode(): Promise<void> {
    await this.switchMode('Formula');
  }

  async getTextInInputSection(): Promise<string> {
    const el = this.inputSection.or(this.page.locator('[class*="mstrmojo-Editor-content"]')).first();
    await el.waitFor({ state: 'visible', timeout: 5000 });
    return (await el.textContent()) || '';
  }

  async setMetricName(name: string): Promise<void> {
    const input = this.page.locator('input[placeholder*="Name"], [class*="MetricName"] input').first();
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill(name);
    await this.page.waitForTimeout(300);
  }

  async saveMetric(): Promise<void> {
    const saveBtn = this.page.locator('div:has-text("Save"), button:has-text("Save")').first();
    await saveBtn.waitFor({ state: 'visible', timeout: 5000 });
    await saveBtn.click();
    await this.page.waitForTimeout(2000);
  }

  async saveFormulaMetric(): Promise<void> {
    await this.saveMetric();
  }

  async saveMetricEditorOpenFromEdit(): Promise<void> {
    await this.saveMetric();
  }

  async selectFunctionsSelectionFromDMEditor(): Promise<void> {
    const dropdown = this.page.locator('[class*="FunctionSelector"] [class*="Pulldown"], [class*="functions"]').first();
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });
    await dropdown.click();
    await this.page.waitForTimeout(500);
  }

  async selectFunctionFromList(name: string): Promise<void> {
    const option = this.page.locator(`[class*="mstr-select-option"]:has-text("${name}"), li:has-text("${name}")`).first();
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
    await this.page.waitForTimeout(500);
  }
}
