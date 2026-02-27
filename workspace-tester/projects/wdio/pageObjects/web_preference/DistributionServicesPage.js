import BasePreference from './BasePreference.js';

export default class DistributionServicesPage extends BasePreference {
    // element locator
    getaddAddressBtn() {
        return this.$('.addressNew .mstrLink');
    }

    getAddressNameInputBox() {
        return this.$('#dispName');
    }

    getPhysicalAddressInputBox() {
        return this.$('#addressValue');
    }

    getDeviceDropDown() {
        return this.$('#deviceID');
    }

    getDeviceDropDownList(value) {
        return this.$$('option').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(value);
        })[0];
    }

    getAddressList() {
        return this.$('.addressesList.mstrListView tbody');
    }

    getAddressListContents() {
        return this.getAddressList().$$('tr');
    }

    getSpecifiedAddressItem(text) {
        return this.getAddressList()
            .$$('tr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(text);
            })[0];
    }

    getSaveBtn() {
        return this.$(`input[value='Save']`);
    }

    getDeleteBtn(text) {
        return this.getSpecifiedAddressItem(text)
            .$$('.mstrLink')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Delete');
            })[0];
    }

    getDeleteButtonByIndex(index) {
        const list = this.getAddressListContents()[index];
        return list.$$('.mstrLink').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes('Delete');
        })[0];
    }

    getEditBtn(text) {
        return this.getSpecifiedAddressItem(text)
            .$$('.mstrLink')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Edit');
            })[0];
    }

    getDeleteConfirmBtn() {
        return this.$(`input[value='Delete']`);
    }

    getSpecifiedAddressRadioBtn(text) {
        return this.getSpecifiedAddressItem(text).$(`input[type='radio']`);
    }

    getSetNewDefaultBtn() {
        return this.$(`input[value='Set New Default']`);
    }

    // action helper

    async inputAddressName(text) {
        await this.click({ elem: this.getAddressNameInputBox() });
        await this.clear({ elem: this.getAddressNameInputBox() });
        await this.getAddressNameInputBox().setValue(text);
    }

    async inputPhysicalAddress(text) {
        await this.click({ elem: this.getPhysicalAddressInputBox() });
        await this.clear({ elem: this.getPhysicalAddressInputBox() });
        await this.getPhysicalAddressInputBox().setValue(text);
    }

    async setValueForDeviceDropDown(value) {
        await this.click({ elem: this.getDeviceDropDown() });
        await this.waitForElementVisible(this.getDeviceDropDownList(value));
        await this.waitForElementEnabled(this.getDeviceDropDownList(value));
        await this.getDeviceDropDownList(value).click();
    }

    async saveNewlyAddedAddress() {
        await this.click({ elem: this.getSaveBtn() });
    }

    async addAddress({ addressName, physicalAddress, device }) {
        if ((await this.isaddAddressBtnExist()) === true) {
            await this.click({ elem: this.getaddAddressBtn() });
        }
        await this.inputAddressName(addressName);
        await this.inputPhysicalAddress(physicalAddress);
        await this.setValueForDeviceDropDown(device);
        await this.saveNewlyAddedAddress();
        await this.waitForComfirmMessageAppear();
    }

    async editAddress(text, { addressName, physicalAddress, device }) {
        await this.click({ elem: this.getEditBtn(text) });
        await this.inputAddressName(addressName);
        await this.inputPhysicalAddress(physicalAddress);
        await this.setValueForDeviceDropDown(device);
        await this.saveNewlyAddedAddress();
    }

    async deleteSpecifiedAddressItem(text) {
        await this.click({ elem: this.getDeleteBtn(text) });
        await this.click({ elem: this.getDeleteConfirmBtn() });
    }

    async setDefault(text) {
        await this.click({ elem: this.getSpecifiedAddressRadioBtn(text) });
        await this.click({ elem: this.getSetNewDefaultBtn() });
    }

    async deleteAllAddresses() {
        const exist = await this.isaddAddressBtnExist();
        if (exist === true) {
            const els = await this.getAddressListContents();
            for (let i = 0; i < els.length; i++) {
                await this.moveToElement(this.getAddressListContents()[0]);
                await this.click({ elem: this.getDeleteButtonByIndex(0) });
                await this.click({ elem: this.getDeleteConfirmBtn() });
            }
        }
    }

    // assertion helper

    async isSpecifiedAddressItemPresent(text) {
        return this.getSpecifiedAddressItem(text).isDisplayed();
    }

    async isaddAddressBtnExist() {
        return this.getaddAddressBtn().isDisplayed();
    }

    async isRadioBtnSelected(text) {
        return this.getSpecifiedAddressRadioBtn(text).isSelected();
    }

    async numberOfContents() {
        return this.getAddressListContents().length;
    }
}
