import type { Page } from '@playwright/test';
import { SelectCubeDialog } from './select-cube-dialog';
import { ReplaceObjectDialog } from './replace-object-dialog';
import { EmbedPromptEditor } from './embed-prompt-editor';

/**
 * Report page / container POM for report editor.
 * Migrated from WDIO reportPage.js (Phase 2d reportSubset).
 */
export class ReportPage {
  readonly selectCubeDialog: SelectCubeDialog;
  readonly replaceObjectDialog: ReplaceObjectDialog;
  readonly embedPromptEditor: EmbedPromptEditor;

  constructor(private readonly page: Page) {
    this.selectCubeDialog = new SelectCubeDialog(page);
    this.replaceObjectDialog = new ReplaceObjectDialog(page);
    this.embedPromptEditor = new EmbedPromptEditor(page);
  }

  /** Confirm/warning dialog for add-prompt scenarios */
  getConfirmDialog() {
    return this.page.locator('.ant-modal-confirm, .ant-confirm-modal').first();
  }

  getConfirmMessage() {
    return this.getConfirmDialog().locator('.ant-modal-content, .ant-confirm-content').first();
  }

  async clickOKInConfirmDialog(): Promise<void> {
    await this.getConfirmDialog().locator('.ant-btn-primary').first().click();
    await this.getConfirmDialog().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  /** Main report container */
  getContainer() {
    return this.page.locator('.mstrd-DossierViewContainer').first();
  }

  /** Resize editor panel by dragging (WDIO: reportPage.resizeEditorPanel) */
  async resizeEditorPanel(deltaX: number): Promise<void> {
    const splitter = this.page.locator('.ant-splitter, [class*="resizer"], [class*="splitter"]').first();
    await splitter.waitFor({ state: 'visible', timeout: 5000 });
    const box = await splitter.boundingBox();
    if (box) {
      await splitter.hover();
      await this.page.mouse.down();
      await this.page.mouse.move(box.x + deltaX, box.y);
      await this.page.mouse.up();
    }
  }

  /** Wait for report loading to complete */
  async waitForReportLoading(_waitForData = false): Promise<void> {
    await this.page.locator('.mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});
  }

  /** Missing font popup (WDIO: reportPage.getMissingFontPopup) */
  getMissingFontPopup() {
    return this.page
      .locator('.ant-modal:has-text("Missing Font"), [class*="missing-font"]')
      .first();
  }

  /** Dismiss missing font popup (WDIO: reportPage.dismissMissingFontPopup) */
  async dismissMissingFontPopup(): Promise<void> {
    const popup = this.getMissingFontPopup();
    if (await popup.isVisible().catch(() => false)) {
      await popup.getByRole('button', { name: /OK|Close|Dismiss/i }).first().click({ timeout: 5000 }).catch(() => {});
      await popup.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }

  /** Loading dialog - wait for report loading spinner to disappear */
  get loadingDialog() {
    return {
      waitForReportLoadingIsNotDisplayed: async (timeout = 60000): Promise<void> => {
        await this.page.locator('.mstrd-LoadingIcon-content--visible, .mstr-rc-loading-dot-icon').waitFor({ state: 'hidden', timeout }).catch(() => {});
      },
    };
  }

  /** Cancel button in top loading bar (WDIO: .mstrmojo-Editor-content .mstrWaitCancel) */
  getCancelButtonInTopLoadingBar() {
    return this.page.locator('.mstrmojo-Editor-content .mstrWaitCancel').first();
  }

  /** Re-execute button in navbar (WDIO: .mstrd-reExecuteNavItem) */
  getReExecuteButton() {
    return this.page.locator('.mstrd-NavItemWrapper.mstrd-reExecuteNavItem, .single-icon-library-re-execute').first();
  }

  /** Grid section in pause mode (WDIO: .report-editor .mstmojo-freezingImgTableCell) */
  getGridViewSectionInPauseMode() {
    return this.page.locator('.report-editor .mstmojo-freezingImgTableCell').first();
  }

  /** No/Don't save button in confirm save dialog */
  getNoSaveButtonInConfirmSaveDialog() {
    return this.page.locator('.mstrmojo-ConfirmSave-Editor .mstrmojo-Button.nosave, [aria-label="Don\'t Save"]').first();
  }

  /** Whether report is in pause mode (resume data not loaded) */
  async isInPauseMode(): Promise<boolean> {
    return this.getGridViewSectionInPauseMode().isVisible().catch(() => false);
  }

  /** Click cancel button in top loading bar */
  async clickCancelButtonInTopLoadingBar(options?: { isWait?: boolean }): Promise<void> {
    await this.getCancelButtonInTopLoadingBar().click();
    if (options?.isWait) {
      await this.loadingDialog.waitForReportLoadingIsNotDisplayed();
    }
  }

  /** Click Don't Save in confirm save dialog */
  async clickDoNotSaveButtonInConfirmSaveDialog(options?: { isWait?: boolean }): Promise<void> {
    await this.getNoSaveButtonInConfirmSaveDialog().click();
    if (options?.isWait) {
      await this.page.locator('.mstrmojo-Editor-content .mstrWaitCancel').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
      await this.loadingDialog.waitForReportLoadingIsNotDisplayed();
    }
  }
}
