import type { Page } from '@playwright/test';

/** Option for selectNewObjects: { name, index?, opt? } */
export interface ReplaceObjectOption {
  name: string;
  index?: number;
  opt?: string;
}

/**
 * Replace Object dialog for mapping old→new objects when replacing cube.
 * Migrated from WDIO ReportReplaceObject.
 */
export class ReplaceObjectDialog {
  constructor(private readonly page: Page) {}

  private get dialog() {
    return this.page.locator('.mstrmojo-ReplaceObject').first();
  }

  private get dataContainer() {
    return this.dialog.locator('.ReplaceObject-DataGrid');
  }

  getReplaceObjectDialog() {
    return this.dialog;
  }

  private async getRowByName(name: string, index = 0) {
    const rows = this.dataContainer.locator('.mstrmojo-DataRow');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const leftUnit = row.locator('.left-unit.ReplaceObject-Unit');
      if (await leftUnit.isVisible().catch(() => false)) {
        const text = (await leftUnit.textContent())?.trim() ?? '';
        if (new RegExp(`^${name}$`, 'i').test(text)) {
          if (index === 0) return row;
          index--;
        }
      }
    }
    throw new Error(`ReplaceObjectDialog: row with name "${name}" not found`);
  }

  private async getNewObjectPulldown(name: string, index = 0) {
    const row = await this.getRowByName(name, index);
    return row.locator('.mstrmojo-ui-Pulldown');
  }

  private get dropdownList() {
    return this.page.locator('.mstrmojo-PopupList[style*="display: block"], .mstrmojo-PopupList:not([style*="display: none"])').first();
  }

  private get okButton() {
    return this.dialog.locator('.mstrmojo-Editor-button[aria-label="OK"], [aria-label="OK"]').first();
  }

  private get clearSettingLabel() {
    return this.dialog.locator('.mstrmojo-Box.ReplaceObject-overwrite label');
  }

  async waitForLoading(): Promise<void> {
    await this.dialog.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openNewObjectDropdown(name: string, index = 0): Promise<void> {
    const pulldown = await this.getNewObjectPulldown(name, index);
    await pulldown.waitFor({ state: 'visible', timeout: 5000 });
    await pulldown.click();
    await this.dropdownList.waitFor({ state: 'visible', timeout: 5000 });
  }

  async selectInDropdownByName(option: string): Promise<void> {
    const item = this.dropdownList.locator('.item').filter({ hasText: new RegExp(`^${option}$`, 'i') }).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await item.click();
    await this.dropdownList.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  async selectNewObjects(options: ReplaceObjectOption[]): Promise<void> {
    for (const opt of options) {
      const { name, index = 0, opt: choice = 'Remove from report' } = opt;
      await this.openNewObjectDropdown(name, index);
      await this.selectInDropdownByName(choice);
    }
  }

  async toggleClearSettingsCheckbox(): Promise<void> {
    await this.clearSettingLabel.waitFor({ state: 'visible', timeout: 5000 });
    await this.clearSettingLabel.click();
  }

  async clickOkButton(): Promise<void> {
    await this.okButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.okButton.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  }
}
