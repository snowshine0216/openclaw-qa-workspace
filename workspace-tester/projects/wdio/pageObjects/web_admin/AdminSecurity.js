import WebBasePage from './../base/WebBasePage.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class AdminSecurityPage extends WebBasePage {
    // Locator
    getAllowUsersToChangeExpiredPasswordCheckBox() {
        return this.$('input[name="allowChPwd"]');
    }

    getCreateNewHTTPSessionUponLoginCheckBox() {
        return this.$('input[name="createNewSession"]');
    }

    getAllowAutomaticLoginIfSessionLostCheckBox() {
        return this.$('input[id="allowSeamlessLogin"]');
    }

    getEnablePartitionedCheckBox() {
        return this.$('input[name="partitioned"]');
    }
    getEnablePartitionedText() {
        const ele = this.$(`//input[@id='partitioned']/parent::td/following-sibling::td`);
        return ele;
    }

    getEnableSecureCheckBox() {
        return this.$('input[name="secure"]');
    }

    getSameSiteRadioButton(value) {
        return this.$(`input[value="${value}"]`);
    }

    getEnableHTTPOnlyCheckBox() {
        return this.$('input[name="httpOnly"]');
    }

    getSaveButton() {
        return this.$('input[value="Save"]');
    }

    // Action helper

    async setAllowUsersToChangeExpiredPasswordCheckBox(toCheck) {
        await this.setCheckBox(this.getAllowUsersToChangeExpiredPasswordCheckBox(), toCheck);
    }

    async setCreateNewHTTPSessionUponLoginCheckBox(toCheck) {
        await scrollIntoView(this.getCreateNewHTTPSessionUponLoginCheckBox());
        await this.setCheckBox(this.getCreateNewHTTPSessionUponLoginCheckBox(), toCheck);
    }

    async setAllowAutomaticLoginIfSessionLostCheckBox(toCheck) {
        await scrollIntoView(this.getAllowAutomaticLoginIfSessionLostCheckBox());
        await this.setCheckBox(this.getAllowAutomaticLoginIfSessionLostCheckBox(), toCheck);
    }

    async setEnablePartitionedCheckBox(toCheck) {
        await this.setCheckBox(this.getEnablePartitionedCheckBox(), toCheck);
    }

    async setEnableSecureCheckBox(toCheck) {
        await this.setCheckBox(this.getEnableSecureCheckBox(), toCheck);
    }

    async setSameSiteRadioButton(value) {
        const element = this.getSameSiteRadioButton(value);
        const isSelected = await element.isSelected();
        if (!isSelected) {
            await this.click({ elem: element });
            await this.scrollWebPageToBottom();
            await this.waitForElementVisible(this.getSaveButton());
            return this.click({ elem: this.getSaveButton() });
        }
    }

    async setCheckBox(element, toCheck) {
        const isSelected = await element.isSelected();
        if (typeof toCheck === 'undefined' || toCheck !== isSelected) {
            await this.click({ elem: element });
        }
        await scrollIntoView(element);
        await this.waitForElementVisible(this.getSaveButton());
        return this.click({ elem: this.getSaveButton() });
    }
}
