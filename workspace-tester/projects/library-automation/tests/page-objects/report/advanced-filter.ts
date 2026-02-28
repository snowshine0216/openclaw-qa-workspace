import type { Page } from '@playwright/test';

/**
 * Advanced filter / qualification editor used in threshold conditions.
 * Shared with ThresholdEditor for "Based On" and element selection.
 */
export class AdvancedFilter {
  constructor(private readonly page: Page) {}

  private readonly newQualificationPopup = this.page.locator(
    '[class*="ConditionEditor"]:visible, [class*="condition-editor"]:visible'
  );

  /** Select object from "Based On" dropdown in New Qualification editor */
  async selectObjectFromBasedOnDropdown(objectName: string): Promise<void> {
    const dropdown = this.newQualificationPopup.locator(
      '[class*="Pulldown"]:has-text("Based"), [class*="pulldown"]:has-text("Based"), [aria-label*="Based"]'
    ).first();
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });
    await dropdown.click();
    await this.page.waitForTimeout(500);
    const item = this.page.locator(
      '[class*="PopupList"]:visible, [class*="popup-list"]:visible, .ant-dropdown:visible'
    ).locator(`[class*="item"]:has-text("${objectName}"), li:has-text("${objectName}")`).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
    await this.page.waitForTimeout(500);
  }

  /** Select elements in attribute filter (e.g. ['Movies']) */
  async doElementSelectionForAttributeFilter(elements: string[]): Promise<void> {
    for (const el of elements) {
      const item = this.page.locator(
        '[class*="element-list"] li, [class*="item"]:has-text("' + el + '"), li:has-text("' + el + '")'
      ).first();
      await item.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await item.click();
      await this.page.waitForTimeout(300);
    }
  }

  /** Click OK on New Qualification editor */
  async clickOnNewQualificationEditorOkButton(): Promise<void> {
    const okBtn = this.newQualificationPopup.locator(
      'button:has-text("OK"), [class*="Button"]:has-text("OK"), div:has-text("OK")'
    ).first();
    await okBtn.waitFor({ state: 'visible', timeout: 5000 });
    await okBtn.click();
    await this.page.waitForTimeout(1000);
  }
}
