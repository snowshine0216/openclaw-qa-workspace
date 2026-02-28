import type { Page } from '@playwright/test';

/**
 * Report theme panel in authoring. Migrated from WDIO ReportThemePanel.js / ThemePanel.js.
 */
export class ReportThemePanel {
  constructor(private readonly page: Page) {}

  readonly themePanel = this.page.locator('.theme-panel-container, .mstrmojo-themesPanel-content').first();

  getThemePanel() {
    return this.themePanel;
  }

  private getThemeSearchInput() {
    return this.themePanel.locator('input[class*="mstr-rc-input"]').first();
  }

  private getThemeCard(theme: string) {
    return this.themePanel
      .locator('.theme-card')
      .filter({ has: this.themePanel.locator('.card-details__title').filter({ hasText: theme }) })
      .first();
  }

  getCurrentThemeContainer() {
    return this.themePanel.locator('.theme-gallery__current').first();
  }

  private getCurrentThemeTitle() {
    return this.getCurrentThemeContainer().locator('.card-details__title');
  }

  private getCurrentThemeCertifiedIcon() {
    return this.getCurrentThemeContainer().locator(
      '.card-details__btns .single-icon-common-certify-certified-orange'
    );
  }

  private getCertifiedToggleButton() {
    return this.themePanel.locator('.certified-only-container button.mstr-rc-switch').first();
  }

  private getThemeInfoTooltipContainer() {
    return this.page.locator('.mstr-rc-tooltip-popover').first();
  }

  async isThemePanelDisplayed(): Promise<boolean> {
    return this.themePanel.isVisible();
  }

  async searchTheme(theme: string): Promise<void> {
    await this.themePanel.waitFor({ state: 'visible', timeout: 15000 });
    const searchInput = this.getThemeSearchInput();
    await searchInput.waitFor({ state: 'visible', timeout: 5000 });
    await searchInput.fill(theme);
    await this.page.waitForTimeout(1000);
  }

  async applyTheme(theme: string): Promise<void> {
    await this.themePanel.waitFor({ state: 'visible', timeout: 15000 });
    const themeCard = this.getThemeCard(theme);
    await themeCard.waitFor({ state: 'visible', timeout: 10000 });
    await themeCard.hover();
    await this.page.waitForTimeout(500);
    const applyButton = themeCard.locator('.card-preview__apply');
    await applyButton.waitFor({ state: 'visible', timeout: 5000 });
    await applyButton.click();
    await this.page
      .locator('.mstrd-LoadingIcon-content--visible, .mstr-rc-loading-dot-icon')
      .waitFor({ state: 'hidden', timeout: 30000 })
      .catch(() => {});
    const tooltip = this.page.locator('.undoApplyTheme.mstrmojo-Tooltip').first();
    if (await tooltip.isVisible().catch(() => false)) {
      await tooltip.locator('[aria-label="Dismiss"]').click().catch(() => {});
    }
  }

  async getCurrentTheme(): Promise<string> {
    const text = await this.getCurrentThemeTitle().textContent();
    return (text ?? '').trim();
  }

  async isCurrentThemeCertified(): Promise<boolean> {
    return this.getCurrentThemeCertifiedIcon().isVisible();
  }

  async toggleCertifiedThemes(): Promise<void> {
    await this.getCertifiedToggleButton().click();
    await this.page.waitForTimeout(1000);
  }

  async getCoverImageUrlByName(theme: string): Promise<string> {
    const themeCard = this.getThemeCard(theme);
    const coverImage = themeCard.locator('.theme-card__preview');
    const isAutoStyle = await coverImage.locator('.cover-image-default-autostyle').isVisible().catch(() => false);
    if (isAutoStyle) {
      const bgImage = await coverImage.evaluate((el) =>
        window.getComputedStyle(el).getPropertyValue('background-image')
      );
      const urlMatch = bgImage.match(/url\(["']?(.*?)["']?\)/);
      return urlMatch ? urlMatch[1] : '';
    }
    const img = coverImage.locator('img');
    const src = await img.getAttribute('src');
    return src ?? '';
  }

  async hoverOnThemeInfoIcon(theme: string): Promise<void> {
    const themeCard = this.getThemeCard(theme);
    const infoIcon = themeCard.locator('.card-details__btns .theme-lib-info-icon');
    await infoIcon.hover();
    await this.getThemeInfoTooltipContainer().waitFor({ state: 'visible', timeout: 5000 });
  }

  async getTooltipContent(): Promise<string> {
    return (await this.getThemeInfoTooltipContainer().textContent()) ?? '';
  }

  async getCurrentThemeCardSize(): Promise<{ x: number; y: number }> {
    await this.getCurrentThemeContainer().waitFor({ state: 'visible', timeout: 10000 });
    const box = await this.getCurrentThemeContainer().boundingBox();
    return { x: box?.width ?? 0, y: box?.height ?? 0 };
  }
}
