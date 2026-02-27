import BasePage from '../base/BasePage.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import LoadingDialog from './components/LoadingDialog.js';

export default class Toolbar extends BasePage {
    constructor() {
        super();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.loadingDialog = new LoadingDialog();
    }

    // Element Locator
    getToolbar() {
        return this.$('.mstrmojo-RootView-toolbar');
    }

    getButtonFromToolbar(buttonName) {
        /* Valid toolbar button names include: 'Table of Contents', 'Undo', 'Redo', 'Pause Data Retrieval', 'Refresh', 'Add Data', 'Add Chapter', 'Add Page',
        'Visualization', 'Filter', 'Text', 'Image', 'HTML Container', 'Shape', 'Panel Stack', 'Information Window', 'Save', 'More', 'Auto Dashboard' etc. */
        return this.$(
            `//div[@class='mstrmojo-RootView-toolbar']//div[@class='btn' and contains(string(), "${buttonName}")]//div[@class='icn']`
        );
    }

    getMenuItemInMobileView(buttonName) {
        return this.$$('.mstrmojo-ui-Menu-item').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === buttonName;
        })[0];
    }

    // Action Methods
    async clickButtonFromToolbar(buttonName) {
        let el = this.getButtonFromToolbar(buttonName);
        await this.click({ elem: el });
        await this.sleep(200);
        if (['Add Data', 'Visualization', 'Auto Dashboard'].indexOf(buttonName) < 0) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    getInsertPanelStackButton() {
        return this.$('.insertPanelStack');
    }

    getItemPanelStackButton() {
        return this.$('.item.PanelStack');
    }

    getItemSelectorPanelButton() {
        return this.$('.item.SelectorPanel');
    }

    getInsertInfoWindowButton() {
        return this.$('.insertInfoWindow');
    }

    getItemInfoWindowButton() {
        return this.$('.item.InfoWindow');
    }

    getItemSelectorWindowButton() {
        return this.$('.item.SelectorWindow');
    }

    getToggleManualModeButton() {
        return this.$('.toggleManualMode .btn');
    }

    async clickMenuItemInMobileView(buttonName) {
        await this.clickButtonFromToolbar('More');
        let el = await this.getMenuItemInMobileView(buttonName);
        await this.click({ elem: el });
    }

    async isButtonDisabled(buttonName) {
        let el = (await this.getButtonFromToolbar(buttonName)).$('../..');
        return await this.isDisabled(el);
    }

    // URL Generator
    getURLGeneratorButton() {
        return this.$('.item.btn.toggleGenerateURL');
    }

    getURLGeneratorDialog() {
        return this.$('.mstrmojo-generate-url-dialog');
    }

    getSelectValuePromptButton() {
        return this.$('.generate-url-dialog-value-prompt-button');
    }

    getGenerateLinkButton() {
        return this.$('.mstrmojo-Button.mstrmojo-InteractiveButton.generate-url-dialog-generate-button');
    }

    getLinkCopiedText() {
        return this.$('.mstrmojo-Label.generate-url-dialog-copied-msg');
    }

    getCloseURLGeneratorDialogButton() {
        return this.$('.mstrmojo-Button.generate-url-dialog-close');
    }

    async clickURLGeneratorButton() {
        return this.click({ elem: this.getURLGeneratorButton() });
    }

    async hoverURLGeneratorButton() {
        await this.hover({ elem: this.getURLGeneratorButton() });
    }

    async isGenerateButtonDisabled() {
        return await this.isDisabled(this.getURLGeneratorButton());
    }

    async isSelectValuePromptButtonDisplay() {
        return (await this.getSelectValuePromptButton()).isDisplayed();
    }

    async clickSelectValuePromptButton() {
        await this.click({ elem: this.getSelectValuePromptButton() });
    }

    async clickGenerateLinkButton() {
        await this.click({ elem: this.getGenerateLinkButton() });
        await this.waitForElementVisible(this.getLinkCopiedText());
        await browser.setPermissions({ name: 'clipboard-read' }, 'granted');
        await browser.setPermissions({ name: 'clipboard-write' }, 'granted');
    }

    async generatorBarText() {
        return await this.$('.win.mstrmojo-bar').getText();
    }

    async clickCloseURLGeneratorDialogButton() {
        await this.click({ elem: this.getCloseURLGeneratorDialogButton() });
    }

    getOptionFromToolbarPullDown(optionName) {
        return this.$(
            `//div[@class='mstrmojo-RootView-toolbar']//div[contains(@class,'mstrmojo-ui-Menu')]//div[@class='mtxt' and text()='${optionName}']`
        );
    }

    async selectOptionFromToolbarPulldownWithoutLoading(optionName) {
        let el = await this.getOptionFromToolbarPullDown(optionName);
        await this.waitForElementVisible(el);
        await this.clickOnElement(el);
    }

    async selectOptionFromToolbarPulldown(optionName) {
        await this.selectOptionFromToolbarPulldownWithoutLoading(optionName);
    }

    async createPanelStack() {
        await this.click({ elem: this.getInsertPanelStackButton() });
        await this.click({ elem: this.getItemPanelStackButton() });
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async createSelectorPanel() {
        await this.click({ elem: this.getInsertPanelStackButton() });
        await this.click({ elem: this.getItemSelectorPanelButton() });
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async createInfoWindow() {
        await this.click({ elem: this.getInsertInfoWindowButton() });
        await this.click({ elem: this.getItemInfoWindowButton() });
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async createSelectorWindow() {
        await this.click({ elem: this.getInsertInfoWindowButton() });
        await this.click({ elem: this.getItemSelectorWindowButton() });
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async clickToggleManualModeBtn() {
        await this.click({ elem: this.getToggleManualModeButton() });
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    // Check if Pause Mode is active by checking if "Resume Data Retrieval" button exists
    async isPauseModeActive() {
        const resumeButton = this.$(
            `//div[@class='mstrmojo-RootView-toolbar']//div[@class='btn' and contains(string(), "Resume Data Retrieval")]`
        );
        return await resumeButton.isExisting();
    }

    async actionOnToolbarLoop(actionName, count) {
        for (let i = 0; i < count; i++) {
            await this.clickButtonFromToolbar(actionName);
        }
    }
}
