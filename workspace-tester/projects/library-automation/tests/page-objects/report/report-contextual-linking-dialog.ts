import type { Page } from '@playwright/test';

/** Lean POM for contextual linking dialog. */
export class ReportContextualLinkingDialog {
  constructor(private readonly page: Page) {}

  async clickOpenInNewWindowCheckbox(): Promise<void> {
    throw new Error('TODO');
  }

  async clickLinkToButton(): Promise<void> {
    throw new Error('TODO');
  }

  async selectTargetObject(_name: string): Promise<void> {
    throw new Error('TODO');
  }

  async clickDoneButtonInContextualLinkingEditor(): Promise<void> {
    throw new Error('TODO');
  }
}
