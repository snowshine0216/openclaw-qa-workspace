import type { Page } from '@playwright/test';
import type { Locator } from '@playwright/test';

/**
 * Value prompt - textbox input for number/text values.
 * Migrated from WDIO ValuePrompt.js.
 */
export class ValuePrompt {
  constructor(private readonly page: Page) {}

  readonly textbox = {
    /** Clear and type value into prompt textbox */
    clearAndInputText: async (promptElement: Locator, value: string): Promise<void> => {
      const input = promptElement.locator('input[type="text"], input[type="number"]').first();
      await input.waitFor({ state: 'visible', timeout: 5000 });
      await input.clear();
      await input.fill(value);
    },
  };
}
