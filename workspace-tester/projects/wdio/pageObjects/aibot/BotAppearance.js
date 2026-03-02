import BaseBotConfigTab from '../base/BaseBotConfigTab.js';
import LibraryAuthoringPage from '../library/LibraryAuthoringPage.js';
import LibraryPage from '../library/LibraryPage.js';

export default class BotAppearance extends BaseBotConfigTab {
    constructor() {
        super();
        this.libraryAuthoringPage = new LibraryAuthoringPage();
        this.libraryPage = new LibraryPage();
    }

    // Element locator
    getAppearancePanel() {
        return this.$('.mstr-ai-chatbot-AppearancePanel-container');
    }

    getThemeSelector() {
        return this.$('.mstr-ai-chatbot-ThemeSelect-wrapper');
    }

    getTheme(theme) {
        return this.$$('.mstr-ai-chatbot-Select-item').filter(async (elem) => {
            const elemText = await elem.$('.mstr-ai-chatbot-ThemeSelect-item-label').getText();
            return elemText === theme;
        })[0];
    }

    getThemeTooltip() {
        return this.$('.mstr-ai-chatbot-AppearancePanel-theme-info');
    }

    getPalettesSelector() {
        return this.$('.mstr-ai-chatbot-PaletteSelect-select-trigger');
    }

    getPaletteSelectPanel() {
        return this.$('.mstr-ai-chatbot-PaletteSelect-select-content');
    }

    getPalette(paletteName) {
        return this.$$('.mstr-ai-chatbot-PaletteOption').filter(async (elem) => {
            const elemText = await elem.$('.mstr-ai-chatbot-PaletteOption-name').getText();
            return elemText.toLowerCase().includes(paletteName.toLowerCase());
        })[0];
    }

    getPaletteSelectIndicator() {
        return this.$('.mstr-ai-chatbot-PaletteSelect-select-item-indicator');
    }

    getSelectedPaletteItem() {
        return this.$$('.mstr-ai-chatbot-PaletteSelect-select-item').filter(async (elem) => {
            const state = await elem.getAttribute('data-state');
            return state === 'checked';
        })[0];
    }

    getThemeSelectorItemContainer(customItemLabel) {
        return this.$$('.mstr-ai-chatbot-ThemeSelect-custom-item-container').filter(async (elem) => {
            const elemText = await elem.$('.mstr-ai-chatbot-ThemeSelect-custom-item-label').getText();
            return elemText === customItemLabel;
        })[0];
    }

    getThemeSelectorColorPickerPopTrigger(customItemLabel) {
        return this.getThemeSelectorItemContainer(customItemLabel).$(
            '.mstr-ai-chatbot-ThemeSelect-colorPickerPopTrigger'
        );
    }

    getColorPickerColor(colorAriaLabel) {
        return this.$(`.mstr-ai-chatbot-ColorPicker-color-cell[aria-label='${colorAriaLabel}']`);
    }

    // Action helper

    async openThemeList() {
        await this.click({ elem: this.getThemeSelector() });
    }

    async changeThemeTo(theme) {
        await this.click({ elem: this.getThemeSelector() });
        await this.click({ elem: this.getTheme(theme) });
        await this.waitForItemLoading();
    }

    async changeThemeItemColor(itemLabel, colorAriaLabel) {
        await this.click({ elem: this.getThemeSelectorColorPickerPopTrigger(itemLabel) });
        await this.click({ elem: this.getColorPickerColor(colorAriaLabel) });
        await this.click({ elem: this.getThemeSelectorItemContainer(itemLabel) });
    }

    async triggerThemeTooltip() {
        await this.hover({ elem: this.getThemeTooltip(), time: 2000 });
        await this.waitForElementVisible(this.getTooltip());
    }

    async openPaletteDropdownList() {
        await this.click({ elem: this.getPalettesSelector() });
    }

    async closePaletteDropdownList() {
        await this.click({ elem: this.getPalettesSelector() });
    }

    async changePaletteTo(palette) {
        const isOpened = await this.getPaletteSelectPanel().isDisplayed();
        if (!isOpened) {
            await this.openPaletteDropdownList();
        }
        await this.click({ elem: this.getPalette(palette) });
        await this.waitForItemLoading();
    }

    async checkPaletteInApp({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29',
        projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        botId: botId,
    }) {
        await this.libraryPage.openBotById({
            appId: appId,
            projectId: projectId,
            botId: botId,
        });
        await this.libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await this.libraryAuthoringPage.waitForCurtainDisappear();
        await this.botAuthoring.selectBotConfigTabByName('Appearance');
        await this.openPaletteDropdownList();
    }

    // Assertion helper

    async isPaletteSelected(palette) {
        const selectedPalette = await this.getSelectedPaletteItem().$('.mstr-ai-chatbot-PaletteOption-name').getText();
        return selectedPalette.toLowerCase().includes(palette.toLowerCase());
    }

    async isPaletteSelectIndicatorDisplayed() {
        return this.getPaletteSelectIndicator().isDisplayed();
    }
}
