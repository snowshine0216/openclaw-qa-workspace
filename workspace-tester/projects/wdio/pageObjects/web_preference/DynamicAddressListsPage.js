import BasePreference from './BasePreference.js';

export default class DynamicAddressList extends BasePreference {
    // element locator
    getAddNewBtn() {
        return this.getPreferencePanel()
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Add a new dynamic address list');
            })[0];
    }

    getCreateDialog() {
        return this.$('.mstrmojo-Editor.mstrmojo-DRLEditor.modal');
    }

    getNameInputBox() {
        return this.getCreateDialog().$('.mstrmojo-TextBox');
    }

    getSelectBtn() {
        return this.getCreateDialog()
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Select...');
            })[0];
    }

    getSelectReportDialog() {
        return this.$('.mstrmojo-Editor.SREditor.modal');
    }

    getSearchInputBox() {
        return this.getSelectReportDialog().$('.mstrmojo-SearchBox-input');
    }

    getSearchResultList() {
        return this.$('.mstrmojo-Booklet.mstrmojo-OB-booklet');
    }

    getSearchResultItem() {
        return this.getSearchResultList().$$('.mstrmojo-itemwrap');
    }

    getSpecifiedSearchResult(name) {
        return this.getSearchResultList()
            .$$('.mstrmojo-OBListItemText')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(name);
            })[0];
    }

    getStoreDropdown() {
        return this.getSelectReportDialog().$('.mstrmojo-DropDownButton-boxNode.mstrmojo-Pulldown-boxNode');
    }

    getStoreDropdownItem(value) {
        return this.getSelectReportDialog()
            .$$('.mstrmojo-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return this.escapeRegExp(elemText).includes(this.escapeRegExp(value));
            })[0];
    }

    getSelectReportOKBtn() {
        return this.getSelectReportDialog().$$('.mstrmojo-Button.mstrmojo-InteractiveButton.mstrmojo-Editor-button')[0];
    }

    getPropertyItem(property) {
        return this.getCreateDialog()
            .$$('tr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(property);
            })[0];
    }

    getPropertyItemDropdown(property) {
        return this.getPropertyItem(property).$('.mstrmojo-DropDownButton-boxNode.mstrmojo-Pulldown-boxNode');
    }

    getSaveBtnOnCreateDialog() {
        return this.getCreateDialog()
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Save');
            })[0];
    }

    getAddressList() {
        return this.$('.mstrmojo-DataGrid-itemsContainer .mstrmojo-itemwrap-table');
    }

    getAddressListContents() {
        return this.getAddressList().$$('.mstrmojo-itemwrap');
    }

    getSpecifiedAddressItem(value) {
        return this.getAddressList()
            .$$('tr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(value);
            })[0];
    }

    getEditBtn(value) {
        return this.getSpecifiedAddressItem(value)
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Edit');
            })[0];
    }

    getDeleteBtn(value) {
        return this.getSpecifiedAddressItem(value)
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Delete');
            })[0];
    }

    getDeleteConfirmDialog() {
        return this.$('.mstrmojo-Editor.mstrmojo-alert.modal');
    }

    getDeleteConfirmBtn() {
        return this.getDeleteConfirmDialog()
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Yes');
            })[0];
    }

    getDeleteButtonByIndex(index) {
        const list = this.getAddressListContents()[index];
        return list.$$('.mstrmojo-Button-text').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes('Delete');
        })[0];
    }

    // action helper

    async setForPropertyDropdown(property, value) {
        await this.click({ elem: this.getPropertyItemDropdown(property) });
        const item = this.getPropertyItem(property)
            .$$('.mstrmojo-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return this.escapeRegExp(elemText).includes(this.escapeRegExp(value));
            })[0];

        await this.waitForElementVisible(item);
        await this.click({ elem: item });
        await this.waitForElementInvisible(item);
    }

    async clickAddNewBtn() {
        await this.click({ elem: this.getAddNewBtn() });
        await this.waitForElementVisible(this.getCreateDialog());
    }

    async clickEditBtn(value) {
        await this.click({ elem: this.getEditBtn(value) });
        await this.waitForElementVisible(this.getCreateDialog());
    }

    async openSearchReportDialog() {
        await this.click({ elem: this.getSelectBtn() });
        await this.waitForElementVisible(this.getCreateDialog());
        await this.waitForElementVisible(this.getSpecifiedSearchResult('_Automation_'));
    }

    async searchReport(name) {
        await this.click({ elem: this.getSearchInputBox() });
        await this.clear({ elem: this.getSearchInputBox() });
        await this.getSearchInputBox().setValue(name);
        await this.enter();
        await this.waitForElementAppearAndGone(this.$('.mstrmojo-BookletLoader'));
        await this.waitForElementVisible(this.getSpecifiedSearchResult(name));
    }

    async setForStoreDropdown(dropdown, value) {
        await this.click({ elem: dropdown });
        await this.waitForElementVisible(this.getStoreDropdownItem(value));
        await this.getStoreDropdownItem(value).click();
        await this.waitForElementInvisible(this.getSelectReportDialog());
    }

    async selectReport(name, store) {
        await this.openSearchReportDialog();
        await this.searchReport(name);
        await this.click({ elem: this.getSpecifiedSearchResult(name) });
        await this.setForStoreDropdown(this.getStoreDropdown(), store);
        await this.click({ elem: this.getSelectReportOKBtn() });
        await this.waitForElementInvisible(this.getSelectReportDialog());
    }

    async addDynamicAddressList({ name, store, physicaladdress }) {
        await this.clickAddNewBtn();
        await this.waitForElementVisible(this.getNameInputBox());
        await this.click({ elem: this.getNameInputBox() });
        await this.clear({ elem: this.getNameInputBox() });
        await this.getNameInputBox().setValue(name);
        await this.waitForCurtainDisappear();
        await this.selectReport(name, store);
        await this.setForPropertyDropdown('Physical Address', physicaladdress);
        await this.click({ elem: this.getSaveBtnOnCreateDialog() });
        await this.waitForElementInvisible(this.getCreateDialog());
        await this.waitForElementInvisible(this.getSpecifiedAddressItem(name));
    }

    async editDynamicAddressList({ name1, name2, store, physicaladdress }) {
        await this.clickEditBtn(name1);
        await this.click({ elem: this.getNameInputBox() });
        await this.clear({ elem: this.getNameInputBox() });
        await this.getNameInputBox().setValue(name2);
        await this.waitForCurtainDisappear();
        await this.selectReport(name2, store);
        await this.setForPropertyDropdown('Physical Address', physicaladdress);
        await this.click({ elem: this.getSaveBtnOnCreateDialog() });
        await this.waitForElementInvisible(this.getCreateDialog());
        await this.waitForCurtainDisappear();
    }

    async deleteSpecifiedAddressItem(value) {
        await this.click({ elem: this.getDeleteBtn(value) });
        await this.click({ elem: this.getDeleteConfirmBtn() });
        await this.waitForElementInvisible(this.getSpecifiedAddressItem(value));
    }

    async deleteAllAddresses() {
        await this.sleep(1000); //wait for content load
        const el = await this.numberOfContents();
        if (el !== '0') {
            const els = await this.getAddressListContents();
            for (let i = 0; i < els.length; i++) {
                await this.moveToElement(this.getAddressListContents()[0]);
                await this.click({ elem: this.getDeleteButtonByIndex(0) });
                await this.waitForElementVisible(this.getDeleteConfirmDialog());
                await this.click({ elem: this.getDeleteConfirmBtn() });
                await this.waitForElementInvisible(this.getDeleteConfirmDialog());
            }
        }
    }

    // assertion helper

    async isSpecifiedAddressItemPresent(value) {
        await this.sleep(1000);
        return this.getSpecifiedAddressItem(value).isDisplayed();
    }

    async numberOfContents() {
        return this.getAddressListContents().length;
    }
}
