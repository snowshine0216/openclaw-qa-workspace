import MainTeams from './MainTeams.js';

export default class ModalDialog extends MainTeams {
    constructor() {
        super();
    }
    getDialog() {
        return this.$(`div[role="dialog"]`);
    }
    getTabConfigPage() {
        return this.$('div.mstrd-TabConfigPage');
    }
    getDialogHeader() {
        return this.$('.mstrd-ContentPage-header');
    }
    getObjectList() {
        return this.$('.mstrd-LibraryContentView');
    }
    getObjectCount() {
        return this.$('.mstrd-VirtualizedDossierList-title-header').getText();
    }
    getDossier(dossierName) {
        return this.$(`//span[contains(text(), '${dossierName}')]`);
    }
    getCoverImage(objectName) {
        return this.$(`
            //span[text()='${objectName}']/parent::div/following-sibling::div[@class='mstrd-DossierInfoContainer-coverImageContainer']
        `);
    }
    getDefaultDossierCoverImage() {
        return this.$('div.mstrd-DefaultDossierCoverImage');
    }
    getApplicationDropdownList() {
        return this.$('.ant-select.mstrd-CustomAppSelect');
    }
    getApplicationByName(appName) {
        return this.$$('.mstrd-CustomAppSelect-customAppName').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(appName);
        })[0];
    }
    getTypeDropdownList() {
        return this.$('.mstrd-ContentTypeSelect');
    }
    getTypeByName(typeName) {
        return this.$('.mstrd-ContentTypeSelect-dropdown')
            .$$('.mstrd-ContentTypeSelect-option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(typeName);
            })[0];
    }
    getContentGroupDropdownList() {
        return this.$('.mstrd-ContentGroupSelect');
    }
    getContentGroupByName(contentGroupName) {
        return this.$('.mstrd-ContentGroupSelect-dropdown')
            .$$('.mstrd-ContentGroupSelect-option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(contentGroupName);
            })[0];
    }
    getSearchIcon() {
        return this.$('.icon-search');
    }
    getSearchBox() {
        return this.$('input.ant-input');
    }
    getSearchedList() {
        return this.$('.mstrd-DossierSearchResultView-content');
    }
    getTabInSearchResults(tabName) {
        return this.$$('.mstrd-DossierSearchResultView-menuBar-option').filter(async (elem) => {
            const elemText = await elem.$('.mstrd-DossierSearchResultView-menuBar-text').getText();
            return elemText == tabName;
        })[0];
    }
    getBackButton() {
        return this.$('.icon-back-lib');
    }
    getPostToChannelCheckbox() {
        return this.$('//*[contains(text(), "Post to the channel about this tab")]');
    }
    getSaveButton() {
        return this.$('#tab-save-btn');
    }
    // close button in pin
    getCloseButton() {
        return this.$('button[id="platform-app-configuration-header-close-button"]');
    }
    // message extension
    getWarningTextForNewChat() {
        return this.$('.mstrd-ContentPageFooter-warning').getText();
    }
    getCloseButtonInMessageExtension() {
        return this.$('button[data-tid="closeButton"]');
    }
    getShareButton() {
        return this.$('.mstrd-ContentPageFooter-share');
    }
    async isShareButtonDisabled() {
        const className = await this.getShareButton().getAttribute('class');
        return className.includes('--disabled');
    }
    async isShareButtonDisabled() {
        return this.isDisabled(this.getShareButton());
    }
    async chooseDossierAndSave(dossierName, search = true) {
        await this.chooseDossier(dossierName, search);
        await browser.switchToFrame(null);
        await this.clickAndNoWait({ elem: this.getPostToChannelCheckbox() });
        await this.click({ elem: this.getSaveButton() });
        await this.waitForElementInvisible(this.getSaveButton());
    }
    async chooseDossier(dossierName, search = true) {
        const dossier = await this.getDossier(dossierName);
        if(await (await this.getSearchIcon()).isDisplayed() && search) {
            await this.searchObject(dossierName);
            await this.changeTabInSearchResult('All');
        }
        await this.waitForElementVisible(dossier);
        await this.clickAndNoWait({ elem: dossier });
    }
    async closeModalDialog() {
        await browser.switchToFrame(null);
        await this.click({ elem: this.getCloseButton() });
    }
    async closeMessageExtensionDialog() {
        await browser.switchToFrame(null);
        await this.click({ elem: this.getCloseButtonInMessageExtension() });
        await this.waitForElementInvisible(this.getDialog());
    }
    async waitForDossierList() {
        await this.waitForElementVisible(this.getObjectList());
    }
    async triggerTooltip(objectName) {
        await this.hover({ elem: this.getDossier(objectName) });
    }
    async searchObject(objectName) {
        await this.click({ elem: this.getSearchIcon() });
        await this.waitForElementClickable(this.getSearchBox());
        await this.getSearchBox().addValue(objectName);
        await this.enter();
    }
    async changeTabInSearchResult(tabName) {
        await this.click({ elem: this.getTabInSearchResults(tabName) });
    }
    async switchToApp(appName) {
        await this.click({ elem: this.getApplicationDropdownList() });
        await this.sleep(500);
        await this.click({ elem: this.getApplicationByName(appName) });
        await this.waitForLibraryLoading();
    }
    async changeType(typeName) {
        await this.click({ elem: this.getTypeDropdownList() });
        await this.click({ elem: this.getTypeByName(typeName) });
        await this.waitForLibraryLoading();
    }
    async changeContentGroup(contentGroupName) {
        await this.click({ elem: this.getContentGroupDropdownList() });
        await this.sleep(500);
        await this.click({ elem: this.getContentGroupByName(contentGroupName) });
        await this.waitForLibraryLoading();
    }
    async back() {
        await this.click({ elem: this.getBackButton() });
    }
    async waitForObjectLoadingInMessageExtension(elemName = 'search') {
        const elem = await this.getSearchIcon();
        await this.waitForLibraryIframeLoading({ elem, elemName });
    }
}
