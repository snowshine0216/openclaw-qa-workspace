import BasePage from '../base/BasePage.js';

export default class SaveAsEditor extends BasePage {
    // Element locator
    getSaveAsEditor() {
        return this.$('.mstrmojo-SaveAsEditor');
    }

    getNameInputBoxOnSaveAsEditor() {
        return this.getSaveAsEditor().$('input.mstrmojo-SaveAsEditor-nameInput');
    }

    getSaveButtonOnSaveAsEditor() {
        return this.getSaveAsEditor().$('.okButton');
    }

    getCancelButtonOnSaveAsEditor() {
        return this.getSaveAsEditor().$('.mstrmojo-WebButton:not(.mstrmojo-createfolder):not(.okButton)');
    }

    getCertifyCheckboxOnSaveAsEditor() {
        return this.getSaveAsEditor().$(`//span[contains(@class,'mstrmojo-certify-checkbox')]`);
    }

    getSetAsTemplateCheckboxOnSaveAsEditor() {
        return this.getSaveAsEditor().$('span.mstrmojo-setAsTemplate-checkbox label');
    }

    getSaveInFolder() {
        return this.getSaveAsEditor().$('.mstrmojo-DropDownButton-boxNode');
    }

    getObjectBrowserDropDown() {
        return this.$('.mstrmojo-OBNavigatorPopup');
    }

    getFoldersInObjectBrowser() {
        return this.getObjectBrowserDropDown().$$('span.mstrmojo-TreeNode-text');
    }

    getRootFolder() {
        return this.getFoldersInObjectBrowser()[0];
    }

    getSearchFolderInputbox() {
        return this.getSaveAsEditor().$('.mstrmojo-SearchBox input');
    }

    getFolderContainerInFlatFolderList() {
        return this.$$('.mstrmojo-BookletPage').filter(async (elem) => {
            const isVisible = await elem.isDisplayed();
            return isVisible;
        })[0];
    }

    getFolderFromFlatFolderList(folderName) {
        return this.getFolderContainerInFlatFolderList()
            .$$('.mstrmojo-OBListItemText')
            .filter(async (elem) => {
                const text = await elem.getText();
                return text === folderName;
            })[0];
    }

    getSavingModalView() {
        return this.$('.saving-in-progress.modal');
    }

    getFolderLoadIndicatorOnSaveAsEditor() {
        return this.getSaveAsEditor().$(
            `//div[contains(@style, 'left: 0px;') and contains(@class, 'mstrmojo-BookletLoader')]`
        );
    }

    // Action helper
    async changeInputBotNameInSaveAsDialog(name) {
        await this.waitForElementVisible(this.getNameInputBoxOnSaveAsEditor());
        await this.getNameInputBoxOnSaveAsEditor().clearValue();
        //wait for bot name input is cleared
        await this.waitForTextPresentInElementValue(this.getNameInputBoxOnSaveAsEditor(), '');
        await this.enter();
        await this.getNameInputBoxOnSaveAsEditor().setValue(name);
        //wait for bot name input change to expected value
        await this.waitForTextPresentInElementValue(this.getNameInputBoxOnSaveAsEditor(), name);
        await this.enter();
    }

    async changeCertifyCheckBoxInSaveAsDialog(certified) {
        const isCertifyCheckBoxChecked = await this.isCertifyCheckBoxCheckedInSaveAsDialog();
        if (isCertifyCheckBoxChecked !== certified) {
            await this.getCertifyCheckboxOnSaveAsEditor().click();
        }
    }

    async changeSetAsTemplateCheckBoxInSaveAsDialog() {
        await this.click({ elem: this.getSetAsTemplateCheckboxOnSaveAsEditor() });
    }

    async openObjectBrowser() {
        const isObjectBrowserDisplayed = await this.getObjectBrowserDropDown().isDisplayed();
        if (!isObjectBrowserDisplayed) {
            await this.click({ elem: this.getSaveInFolder() });
            await this.waitForElementVisible(this.getObjectBrowserDropDown());
        }
    }

    async searchByName(text) {
        await this.getSearchFolderInputbox().clearValue();
        await this.getSearchFolderInputbox().setValue(text);
        await this.enter();
        await this.waitForElementStaleness(this.getFolderLoadIndicatorOnSaveAsEditor());
        await this.waitForElementVisible(this.getFolderFromFlatFolderList(text));
    }

    async browseFolderInSaveAsDialog(folderName) {
        const currentFolder = await this.getSaveInFolder().getText();
        if (currentFolder === 'Shared Reports') {
            await this.openObjectBrowser();
            await this.click({ elem: this.getRootFolder() });
        }
        await this.searchByName(folderName);
        await this.click({ elem: this.getFolderFromFlatFolderList(folderName) });
        await this.waitForElementStaleness(this.getFolderLoadIndicatorOnSaveAsEditor());
        await this.sleep(1000); //wait for folder selection to be applied
    }

    async waitForSaving() {
        await this.waitForElementInvisible(this.getSavingModalView());
        await this.waitForElementInvisible(this.getSaveAsEditor());
    }

    async clickSaveButtonInSaveAsDialog() {
        //use the method to make sure corrent focus is on save dialog, otherwise click action could not take effect
        await this.getNameInputBoxOnSaveAsEditor().getValue();
        await this.waitForElementClickable(this.getSaveButtonOnSaveAsEditor());
        await this.waitForElementStaleness(this.getFolderLoadIndicatorOnSaveAsEditor());
        await this.getSaveButtonOnSaveAsEditor().click();
    }

    async clickCancelButtonInSaveAsDialog() {
        //use the method to make sure corrent focus is on save dialog, otherwise click action could not take effect
        await this.getNameInputBoxOnSaveAsEditor().getValue();
        await this.waitForElementClickable(this.getCancelButtonOnSaveAsEditor());
        await this.waitForElementStaleness(this.getFolderLoadIndicatorOnSaveAsEditor());
        await this.getCancelButtonOnSaveAsEditor().click();
    }

    // Assertion helper
    async isCertifyCheckBoxCheckedInSaveAsDialog() {
        return this.getCertifyCheckboxOnSaveAsEditor().isSelected();
    }

    async isCertifyCheckBoxPresentInSaveAsDialog() {
        return this.getCertifyCheckboxOnSaveAsEditor().isDisplayed();
    }

    async getBotNameInSaveDialog() {
        return this.getNameInputBoxOnSaveAsEditor().getValue();
    }
}
