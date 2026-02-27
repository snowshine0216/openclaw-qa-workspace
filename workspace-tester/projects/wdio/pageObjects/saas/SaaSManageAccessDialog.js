import ManageAccessDialog from '../dossier/ManageAccessDialog.js';

export default class SaaSManageAccessDialog extends ManageAccessDialog {
    constructor() {
        super();
    }
    // Element locators
    getSaasManageAccessDialog() {
        return this.$('.mstrd-ManageAccessContainer-main');
    }
    getCloseButton() {
        return this.getSaasManageAccessDialog().$('.icon-pnl_close');
    }
    getAccessEntryItems() {
        return this.getSaasManageAccessDialog().$$('.mstrd-AccessEntryItem');
    }
    async getAccessEntryItemByName(itemName) {
        for (const item of await this.getAccessEntryItems()) {
            const entryItemName = await item.$('.mstrd-AccessEntryItem-fullName').getAttribute('aria-label');
            if (entryItemName === itemName) {
                return item;
            }
        }
        return null;
    }
    async getAccessEntryItemRemoveIcon(itemName, retry = 3) {
        while ((await this.getAccessEntryItemByName(itemName)) == null && retry > 0) {
            await this.getAccessEntryItemByName(itemName);
            console.log('retrying to get access entry item by name');
            retry--;
        }
        return (await this.getAccessEntryItemByName(itemName)).$('.icon-clearsearch,.icon-android-close_bold');
    }
    getCancelButton() {
        return this.getSaasManageAccessDialog().$('.mstrd-ManageAccessContainer-cancelBtn');
    }

    getSaveButton() {
        return this.getSaasManageAccessDialog().$('.mstrd-ManageAccessContainer-okBtn');
    }

    getManageAccessItems() {
        return this.getSaasManageAccessDialog().$('.mstrd-ManageAccessContainer-items');
    }

    async getAccessEntryItemOptions(itemName) {
        return this.getAccessEntryItemByName(itemName).$('.mstrd-AccessEntryItem-options.SaaS').getValue();
    }

    getUserIcons() {
        return this.$$('.mstrd-User-icon');
    }

    // Action helpers
    async removeAccessEntryItem(itemName) {
        await (await this.getAccessEntryItemRemoveIcon(itemName)).click();
    }

    async saveManageAccess() {
        await this.click({ elem: this.getSaveButton() });
        await this.waitForElementInvisible(this.getSaasManageAccessDialog());
    }

    // the color of user icon will change daynamically, so we need to hide it
    async hideUserIcons() {
        const count = await this.getUserIcons().length;
        for (let i = 0; i < count; i++) {
            await this.hideElement(this.getUserIcons()[i]);
        }
    }
}
