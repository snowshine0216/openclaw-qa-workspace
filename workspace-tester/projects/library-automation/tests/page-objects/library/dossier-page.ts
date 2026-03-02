import type { Page } from '@playwright/test';

/**
 * Dossier/report consumption page POM.
 * Migrated from WDIO dossier/DossierPage.js (Phase 2j reportCancel).
 */
export class DossierPage {
  constructor(private readonly page: Page) {}

  /** Cancel execution button during report loading (WDIO: .mstrd-CancelExecutionButton) */
  getCancelExecutionButton() {
    return this.page.locator('.mstrd-CancelExecutionButton').first();
  }

  /** Navigation bar (for screenshots/visibility assertions) */
  getNavigationBar() {
    return this.page.locator('.mstrd-NavBarWrapper').first();
  }

  /** Reset icon (WDIO: getResetIcon) */
  getResetIcon() {
    return this.page.locator('.icon-tb_reset').first();
  }

  /** Confirm reset button */
  getConfirmResetButton() {
    return this.page.locator('.mstrd-ConfirmationDialog-button').first();
  }

  /** Wait for curtain/loading overlay to disappear */
  async waitForCurtainDisappear(timeout = 60000): Promise<void> {
    const curtain = this.page.locator(
      '.mstrd-LoadingIcon-content--visible, .mstrmojo-Editor.mstrWaitBox.modal'
    );
    await curtain.waitFor({ state: 'hidden', timeout }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  /** Click cancel execution button (WDIO: clickCancelExecutionButton) */
  async clickCancelExecutionButton(options?: { isWait?: boolean }): Promise<void> {
    const btn = this.getCancelExecutionButton();
    await btn.waitFor({ state: 'visible', timeout: 60000 });
    await btn.click({ force: true });
    if (options?.isWait) {
      await this.waitForCurtainDisappear();
    }
  }

  /** Reset dossier without waiting for load (WDIO: resetDossierNoWait) */
  async resetDossierNoWait(): Promise<void> {
    await this.getResetIcon().click();
    await this.getConfirmResetButton().click();
  }
}
