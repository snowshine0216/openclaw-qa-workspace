import BasePage from '../base/BasePage.js';

export default class DatasetDialog extends BasePage {
    // Element Locator
    getConfirmationEditDatasetDialog() {
        return this.$('.mstrmojo-warning-ConfirmEditDataset');
    }

    getConfirmationEditDatasetDialogBtn(text) {
        return this.getConfirmationEditDatasetDialog()
            .$$('.mstrmojo-Button-text ')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(text);
            })[0];
    }

    getDatasetDialog() {
        return this.$$('.enablePushDownFilter').filter(async (elem) => elem.isDisplayed())[0];
    }

    getCreateParameterBtn() {
        return this.getDatasetDialog().$('.addParameterLink');
    }

    getParameterTypeContainer() {
        return this.$('.mstrmojo-ui-Menu-item-container');
    }

    getParameterType(type) {
        return this.getParameterTypeContainer()
            .$$('.mtxt')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === type;
            })[0];
    }

    getBtn(text) {
        return this.$$('.mstrmojo-Button-text').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getUpdateDatasetAlertDialog() {
        return this.$('.mstrmojo-Editor.mstrmojo-alert.modal');
    }

    getBtnInUpdateDatasetAlertDialog(text) {
        return this.getUpdateDatasetAlertDialog()
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === text;
            })[0];
    }

    getKeepChangesLocalContainer() {
        return this.getDatasetDialog().$('.keepChangesLocalContainer');
    }

    getKeepChangesLocalCheckbox() {
        return this.getKeepChangesLocalContainer().$('.mstrmojo-ui-Checkbox');
    }

    getCheckedKeepChangesLocalCheckbox() {
        return this.getKeepChangesLocalContainer().$('.mstrmojo-ui-Checkbox.checked');
    }

    getNotificationWarning() {
        return this.$('.mstrmojo-warning.mstrmojo-alert.modal');
    }

    getNotificationWarningBtn(text) {
        return this.getNotificationWarning()
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === text;
            })[0];
    }

    getObjectListItem(objectName) {
        return this.getDatasetDialog()
            .$$('.item.unit')
            .filter(async (elem) => {
                const elemText = await elem.$('.txt.undefined').getText();
                return elemText === objectName;
            })[0];
    }

    getObjectListItemRemoveBtn(objectName) {
        return this.getObjectListItem(objectName).$('.clsx');
    }

    // Action Methods
    async clickConfirmationEditDatasetDialogBtn(text) {
        await this.waitForElementVisible(this.getConfirmationEditDatasetDialog());
        await this.waitForElementPresence(this.getConfirmationEditDatasetDialogBtn(text));
        await this.getConfirmationEditDatasetDialogBtn(text).click();
        await this.waitForElementInvisible(this.getConfirmationEditDatasetDialog());
    }

    async clickCreateParameterBtn(type) {
        await this.click({ elem: this.getCreateParameterBtn() });
        await this.click({ elem: this.getParameterType(type) });
    }

    async clickUpdateDatasetBtn() {
        await this.click({ elem: this.getBtn('Update Dataset') });
        await this.sleep(1000); // wait for alert appear
    }

    async clickCancelBtn() {
        await this.click({ elem: this.getBtn('Cancel') });
    }

    async hoverOnCancelBtn() {
        await this.hover({ elem: this.getBtn('Cancel') });
    }

    async checkKeepChangesLocalCheckbox() {
        await this.click({ elem: this.getKeepChangesLocalCheckbox() });
    }

    async isKeepChangesLocalCheckboxChecked() {
        const checkBox = await this.getCheckedKeepChangesLocalCheckbox();
        return await checkBox.isDisplayed();
    }

    async isKeepChangesLocalContainerPresent() {
        return this.getKeepChangesLocalContainer().isDisplayed();
    }

    async clickNotificationWarningBtn(text) {
        await this.click({ elem: this.getNotificationWarningBtn(text) });
        await this.waitForElementInvisible(this.getNotificationWarning());
    }

    async removeObjectFromList(objectName) {
        await this.click({ elem: this.getObjectListItemRemoveBtn(objectName) });
        await this.waitForElementInvisible(this.getObjectListItem(objectName));
    }

    async editObject(objectName) {
        await this.rightClick({ elem: this.getObjectListItem(objectName) });
        await this.click({ elem: this.getParameterTypeContainer('Edit') });
    }
}
