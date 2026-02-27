import WebBasePage from './WebBasePage.js';

export default class BaseDialog extends WebBasePage {
    constructor() {
        super('.mstrDialogBone', 'Dialog Component');
    }

    getDialog() {
        return this.$('.mstrDialogBone');
    }

    getApplyButton() {
        return this.$('.mstrDialogButtonBar input[name="apply"]');
    }

    getOkButton() {
        return this.$('.mstrDialogButtonBar input[name="ok"]');
    }

    getCancelButton() {
        return this.$('.mstrDialogButtonBar input[name="cancel"]');
    }

    async apply() {
        await this.click({ elem: this.getApplyButton() });
    }

    async confirm() {
        await this.sleep(2000);
        await this.waitForElementVisible(this.getDialog());
        await this.click({ elem: this.getOkButton() });
    }

    async cancel() {
        await this.click({ elem: this.getCancelButton() });
    }
}
