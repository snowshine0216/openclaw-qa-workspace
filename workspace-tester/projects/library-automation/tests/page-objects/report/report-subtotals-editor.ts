import type { Page } from '@playwright/test';

/** Lean POM for subtotals editor dialog. */
export class ReportSubtotalsEditor {
  constructor(private readonly page: Page) {}

  async selectTypeCheckbox(_type: string): Promise<void> {
    throw new Error('TODO');
  }

  async saveAndCloseSubtotalsEditor(): Promise<void> {
    throw new Error('TODO');
  }
}
