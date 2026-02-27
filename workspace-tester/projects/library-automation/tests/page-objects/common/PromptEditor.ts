import type { Page } from '@playwright/test';

/** Lean POM for prompt editor (reprompt in consumption). */
export class PromptEditor {
  constructor(private readonly page: Page) {}

  async reprompt(): Promise<void> {
    throw new Error('TODO: trigger reprompt');
  }
}
