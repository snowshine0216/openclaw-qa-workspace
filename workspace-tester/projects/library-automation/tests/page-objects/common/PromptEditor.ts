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

  async reprompt(): Promise<void> {
    throw new Error('TODO: trigger reprompt');
  }
}
