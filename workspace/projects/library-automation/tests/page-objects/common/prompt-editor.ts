import type { Page } from '@playwright/test';
import type { Locator } from '@playwright/test';

/** Lean POM for prompt editor (reprompt, run, findPrompt, isEditorOpen). */
export class PromptEditor {
  constructor(private readonly page: Page) {}

  private get promptContainer() {
    return this.page.locator('.mstrd-PromptEditor, .mstrPromptEditor, [class*="prompt-editor"]').first();
  }

  async isEditorOpen(): Promise<boolean> {
    return this.promptContainer.isVisible();
  }

  /** Find prompt section by name (e.g. 'Call Center', 'Number', 'Year') - returns Locator for aePrompt/valuePrompt */
  findPrompt(promptName: string): Locator {
    return this.promptContainer.locator('.mstrPromptQuestionContents').filter({ hasText: new RegExp(`^${promptName}`, 'i') }).first();
  }

  /** Wait for reprompt loading to complete */
  async waitForRepromptLoading(): Promise<void> {
    await this.promptContainer.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.locator('.mstrd-LoadingIcon-content--visible').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  }

  /** Click Apply/Run button in prompt editor */
  async run(): Promise<void> {
    const btn = this.promptContainer
      .locator('.mstrPromptEditorButtons, .ant-modal-footer, [class*="footer"]')
      .getByRole('button', { name: /apply|run|ok/i })
      .or(this.promptContainer.getByText('Apply', { exact: true }))
      .first();
    await btn.click({ timeout: 15000 });
    await this.page.waitForTimeout(2000);
  }

  /** Click Apply/Run without waiting for load (for cancel scenarios) */
  async runNoWait(): Promise<void> {
    const btn = this.promptContainer
      .locator('.mstrPromptEditorButtons, .ant-modal-footer, [class*="footer"]')
      .getByRole('button', { name: /apply|run|ok/i })
      .or(this.promptContainer.getByText('Apply', { exact: true }))
      .first();
    await btn.click({ timeout: 15000 });
  }

  /** Wait for prompt editor to be visible */
  async waitForEditor(): Promise<void> {
    await this.promptContainer.waitFor({ state: 'visible', timeout: 15000 });
  }

  /** Close prompt editor (X or Close button) */
  async closeEditor(): Promise<void> {
    const closeBtn = this.promptContainer
      .locator('.icon-pnl_close, [aria-label="Close"], button:has-text("Close")')
      .first();
    await closeBtn.click({ timeout: 5000 }).catch(() => {});
  }

  /** Click Re-prompt button */
  async reprompt(): Promise<void> {
    const btn = this.page
      .locator('.mstrd-NavBar, [class*="toolbar"]')
      .getByRole('button', { name: /re-prompt|reprompt|prompt/i })
      .or(this.promptContainer.getByText(/re-prompt|reprompt/i))
      .first();
    await btn.click({ timeout: 5000 }).catch(() => {});
  }
}
