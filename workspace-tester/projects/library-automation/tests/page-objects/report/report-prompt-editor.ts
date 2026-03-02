import type { Page } from '@playwright/test';

export class ReportPromptEditor {
  constructor(private readonly page: Page) {}

  async clickApplyButtonInReportPromptEditor(): Promise<void> {
    // WDIO: .mstrd-PromptEditor .mstrPromptEditorButtons with text "Apply"
    const promptEditor = this.page.locator('.mstrd-PromptEditor, .mstrPromptEditor, [class*="prompt-editor"]');
    const btn = promptEditor
      .locator('.mstrPromptEditorButtons, .ant-modal-footer, [class*="footer"]')
      .getByRole('button', { name: /apply|run|ok/i })
      .or(promptEditor.getByText('Apply', { exact: true }))
      .first();
    await btn.click({ timeout: 15000 });
  }

  async chooseItemInAvailableCart(
    _sectionIdx: number,
    _sectionName: string,
    _item: string
  ): Promise<void> {
    throw new Error('TODO: implement');
  }

  async chooseItemsInAvailableCart(
    _sectionIdx: number,
    _sectionName: string,
    _items: string[]
  ): Promise<void> {
    throw new Error('TODO: implement');
  }

  async doubleClickSelectedItem(
    _sectionIdx: number,
    _sectionName: string,
    _item: string
  ): Promise<void> {
    throw new Error('TODO: implement');
  }
}
