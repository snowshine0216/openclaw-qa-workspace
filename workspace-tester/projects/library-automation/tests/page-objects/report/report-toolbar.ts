import type { Page } from '@playwright/test';

export class ReportToolbar {
  constructor(private readonly page: Page) {}

  get undoButton() { return this.page.getByRole('button', { name: /undo/i }); }
  get redoButton() { return this.page.getByRole('button', { name: /redo/i }); }

  /** Report is in pause mode when Resume/Play button is visible */
  async isInPauseMode(): Promise<boolean> {
    const toolbar = this.page.locator('.toolbar-header, [class*="toolbar"], [class*="Toolbar"]');
    const resumeBtn = toolbar.locator('[class*="pause"]:not([class*="disabled"])').or(toolbar.locator('[class*="resume"]')).or(toolbar.locator('[class*="play"]')).first();
    return resumeBtn.isVisible();
  }

  async switchToDesignMode(inAuthoring?: boolean): Promise<void> {
    await this.page.locator('.mstr-loader, [class*="loading"], .mstrWaitBox, .mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
    
    // Click the resume/design mode button to switch from view mode to design mode
    // The button has classes: mstr-ws-icons, single-icon-library-resume
    const designModeBtn = this.page.locator(
      '[class*="single-icon-library-resume"][role="button"], ' +
      '.mstr-ws-icons[class*="resume"][role="button"], ' +
      '[class*="pause"][role="button"], ' +
      'span[class*="resume"][tabindex="0"]'
    ).first();
    
    const isVisible = await designModeBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (isVisible) {
      await designModeBtn.click();
      // Wait for design mode UI to load
      await this.page.waitForTimeout(2000);
      // Wait for any loading indicators to disappear
      await this.page.locator('.mstr-loader, [class*="loading"], .mstrWaitBox, .mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
    } else {
      // Already in design mode or button not available
      await this.page.waitForTimeout(2000);
    }
    
    if (inAuthoring) {
      // Wait for prompt editor or report loading
      await Promise.race([
        this.page.locator('.mstrd-PromptEditor, .mstrPromptEditor').waitFor({ state: 'visible', timeout: 12000 }),
      ]).catch(() => {});
    }
  }

  async isUndoDisabled(_inAuthoring?: boolean): Promise<boolean> {
    const btn = this.undoButton;
    return btn.isDisabled().catch(() => true);
  }

  async isRedoDisabled(_inAuthoring?: boolean): Promise<boolean> {
    const btn = this.redoButton;
    return btn.isDisabled().catch(() => true);
  }

  async isUndoEnabled(inAuthoring?: boolean): Promise<boolean> {
    const btn = inAuthoring
      ? this.page.locator('.mstr-ws-icons.single-icon-undo-normal')
      : this.undoButton;
    const visible = await btn.isVisible().catch(() => false);
    if (!visible) return false;
    if (inAuthoring) {
      const cls = await btn.getAttribute('class').catch(() => '');
      return !cls?.includes('disabled');
    }
    return (await btn.getAttribute('aria-disabled')) !== 'true';
  }

  /** WDIO: actionOnToolbar - click toolbar button by internal/display name */
  async actionOnToolbar(actionName: string, options?: { isWait?: boolean }): Promise<void> {
    const isWait = options?.isWait ?? true;
    const btn = this.page.locator(
      `div[class*="toolbar-header"] span[class*="${actionName.replace(/'/g, "\\'")}"]:not([class*="disabled"])`
    ).first();
    await btn.waitFor({ state: 'visible', timeout: 10000 });
    await btn.click();
    if (isWait) {
      await this.page.locator('.mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});
    }
  }

  async isRedoEnabled(): Promise<boolean> {
    throw new Error('TODO: implement');
  }

  async clickUndo(_inAuthoring?: boolean): Promise<void> {
    await this.undoButton.click();
  }

  async clickRedo(_inAuthoring?: boolean): Promise<void> {
    await this.redoButton.click();
  }

  async rePrompt(): Promise<void> {
    try {
      await this.actionOnToolbar('reprompt', { isWait: true });
    } catch {
      const btn = this.page.getByRole('button', { name: /re-prompt|reprompt|prompt/i }).first();
      await btn.click({ timeout: 5000 });
    }
  }

  async reExecute(): Promise<void> {
    throw new Error('TODO: implement');
  }

  async clickBack(): Promise<void> {
    throw new Error('TODO: implement');
  }
}
