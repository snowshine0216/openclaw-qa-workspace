import type { Page } from '@playwright/test';

/** POM for threshold editor dialogs (Simple and Advanced). */
export class ThresholdEditor {
  constructor(private readonly page: Page) {}

  private readonly simpleEditor = this.page.locator('[class*="SimpleThresholdEditor"], [class*="simple-threshold"]');
  private readonly advancedEditor = this.page.locator('[class*="adv-threshold"], [class*="advanced-threshold"]');

  async switchSimpleThresholdsTypeI18N(type: string): Promise<void> {
    const tab = this.simpleEditor.locator(`span:has-text("${type}"), div:has-text("${type}")`).first();
    await tab.waitFor({ state: 'visible', timeout: 5000 });
    await tab.click();
    await this.page.waitForTimeout(500);
  }

  async openSimpleThresholdImageBandDropDownMenu(): Promise<void> {
    const pulldown = this.simpleEditor.locator('[class*="image-pulldown"], [class*="Pulldown"]').first();
    await pulldown.waitFor({ state: 'visible', timeout: 5000 });
    await pulldown.click();
    await this.page.waitForTimeout(500);
  }

  async selectSimpleThresholdImageBand(name: string): Promise<void> {
    const item = this.page.locator(
      '[class*="PopupList"]:visible, [class*="popup-list"]:visible'
    ).locator(`div:has-text("${name}"), [class*="item"]:has-text("${name}")`).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
    await this.page.waitForTimeout(500);
  }

  async selectSimpleThresholdBasedOnObject(metric: string): Promise<void> {
    const pulldown = this.simpleEditor.locator('[class*="left-pulldown"]').first();
    await pulldown.waitFor({ state: 'visible', timeout: 5000 });
    await pulldown.click();
    await this.page.waitForTimeout(300);
    const item = this.page.locator('[class*="popupList"]:visible, .ant-dropdown:visible').locator(`div:has-text("${metric}")`).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
    await this.page.waitForTimeout(300);
  }

  async selectSimpleThresholdBasedOnOption(opt: string): Promise<void> {
    const pulldown = this.simpleEditor.locator('[class*="right-pulldown"]').first();
    await pulldown.waitFor({ state: 'visible', timeout: 5000 });
    await pulldown.click();
    await this.page.waitForTimeout(300);
    const item = this.page.locator('[class*="popupList"]:visible, .ant-dropdown:visible').locator(`div:has-text("${opt}")`).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
    await this.page.waitForTimeout(300);
  }

  async saveAndCloseSimThresholdEditor(): Promise<void> {
    const okBtn = this.simpleEditor.locator(
      'button:has-text("OK"), div:has-text("OK"), [class*="Button"]:has-text("OK")'
    ).first();
    await okBtn.waitFor({ state: 'visible', timeout: 5000 });
    await okBtn.click();
    await this.page.waitForTimeout(2000);
  }

  async switchSimToAdvThresholdWithApply(): Promise<void> {
    const advLink = this.page.locator('text=/Advanced/i').first();
    await advLink.waitFor({ state: 'visible', timeout: 5000 });
    await advLink.click();
    await this.page.waitForTimeout(500);
    const applyBtn = this.page.locator('button:has-text("Apply"), div:has-text("Apply")').first();
    await applyBtn.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    await applyBtn.click().catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  async saveAndCloseAdvancedThresholdEditor(): Promise<void> {
    const okBtn = this.advancedEditor
      .locator('button:has-text("OK"), div:has-text("OK"), [class*="Button"]:has-text("OK")')
      .first();
    await okBtn.waitFor({ state: 'visible', timeout: 5000 });
    await okBtn.click();
    await this.page.waitForTimeout(2000);
  }

  async clickOnEnableAllowUsersCheckBox(_type: string): Promise<void> {
    const checkbox = this.page.locator(
      '[class*="Allow Users"], label:has-text("Allow Users"), input[type="checkbox"]'
    ).first();
    await checkbox.waitFor({ state: 'visible', timeout: 5000 });
    await checkbox.click();
    await this.page.waitForTimeout(300);
  }

  async openNewThresholdCondition(): Promise<void> {
    const btn = this.advancedEditor.locator('div:has-text("New Threshold"), button:has-text("New Threshold")').first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await this.page.waitForTimeout(1000);
  }

  async selectOptionAttributeFromDropdown(attr: string): Promise<void> {
    const dropdown = this.page.locator('[class*="Pulldown"], [class*="dropdown"]').filter({ hasText: /.+/ }).first();
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });
    await dropdown.click();
    await this.page.waitForTimeout(300);
    const item = this.page.locator(`[class*="item"]:has-text("${attr}"), li:has-text("${attr}")`).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
    await this.page.waitForTimeout(500);
  }

  async checkAttributeName(name: string): Promise<void> {
    const item = this.page.locator(
      `[class*="checkbox"]:has-text("${name}"), [class*="item"]:has-text("${name}"), label:has-text("${name}")`
    ).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
    await this.page.waitForTimeout(300);
  }

  async selectSecondaryOptionInMenuForThresholdConditions(option: string, _idx: number): Promise<void> {
    const item = this.advancedEditor.locator(`[class*="thresholdRow"] span:has-text("${option}"), div:has-text("${option}")`).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
    await this.page.waitForTimeout(500);
  }

  async setFillColor(color: string): Promise<void> {
    const colorItem = this.page.locator(`[class*="color"]:has-text("${color}"), div:has-text("${color}"), span:has-text("${color}")`).first();
    await colorItem.waitFor({ state: 'visible', timeout: 5000 });
    await colorItem.click();
    await this.page.waitForTimeout(300);
  }

  async clickOnCheckMarkOnFormatPreviewPanel(): Promise<void> {
    const checkBtn = this.page.locator(
      '[class*="check"], [class*="checkmark"], button[aria-label*="OK"], div:has-text("OK")'
    ).first();
    await checkBtn.waitFor({ state: 'visible', timeout: 5000 });
    await checkBtn.click();
    await this.page.waitForTimeout(500);
  }

  async selectOptionSample(): Promise<void> {
    const sample = this.page.locator('text=/Sample/i').first();
    await sample.waitFor({ state: 'visible', timeout: 5000 });
    await sample.click();
    await this.page.waitForTimeout(300);
  }

  async setOpacityPercentage(value: string): Promise<void> {
    const input = this.page.locator('input[type="number"], input[type="text"]').filter({ has: this.page.locator('..') }).first();
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill(value);
    await this.page.waitForTimeout(300);
  }

  async clickFormatPreviewPanelOkButton(): Promise<void> {
    const okBtn = this.page.locator(
      '[class*="format-preview"] button:has-text("OK"), [class*="Format"] div:has-text("OK")'
    ).first();
    await okBtn.waitFor({ state: 'visible', timeout: 5000 });
    await okBtn.click();
    await this.page.waitForTimeout(500);
  }
}
