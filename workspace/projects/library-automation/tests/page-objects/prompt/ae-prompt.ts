import type { Page } from '@playwright/test';
import type { Locator } from '@playwright/test';

/**
 * Attribute elements prompt - shopping cart style (available list, add single).
 * Migrated from WDIO AEPrompt + ShoppingCartStyle.
 */
export class AEPrompt {
  constructor(private readonly page: Page) {}

  readonly shoppingCart = {
    /** Click element in available list (e.g. 'San Diego', 'Books') */
    clickElmInAvailableList: async (promptElement: Locator, elementName: string): Promise<void> => {
      const availableList = promptElement.locator('.mstrListCartCellAvailableView').first();
      const item = availableList.locator('.mstrListBlockItemName').filter({ hasText: new RegExp(`^${elementName}$`, 'i') }).first();
      await item.waitFor({ state: 'visible', timeout: 8000 });
      await item.click();
    },
    /** Click Add (single) button to add selected element to filter */
    addSingle: async (promptElement: Locator): Promise<void> => {
      const addBtn = promptElement.locator('.mstrListCartCellAddRemoveButtons .mstrBGIcon_tbAdd').first();
      await addBtn.waitFor({ state: 'visible', timeout: 5000 });
      await addBtn.click();
      await this.page.waitForTimeout(300);
    },
    /** Add all elements from available list to selected (double-arrow add) */
    addAll: async (promptElement: Locator): Promise<void> => {
      const addAllBtn = promptElement
        .locator('.mstrListCartCellAddRemoveButtons .mstrBGIcon_tbAddAll, [class*="add-all"]')
        .first();
      await addAllBtn.waitFor({ state: 'visible', timeout: 5000 });
      await addAllBtn.click();
      await this.page.waitForTimeout(500);
    },
    /** Get selected list text values */
    getSelectedObjectListText: async (promptElement: Locator): Promise<string[]> => {
      const selectedList = promptElement.locator('.mstrListCartCellSelectedView .mstrListBlockItemName');
      await selectedList.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      const count = await selectedList.count();
      const texts: string[] = [];
      for (let i = 0; i < count; i++) {
        const t = await selectedList.nth(i).textContent();
        if (t) texts.push(t.trim());
      }
      return texts;
    },
  };
}
