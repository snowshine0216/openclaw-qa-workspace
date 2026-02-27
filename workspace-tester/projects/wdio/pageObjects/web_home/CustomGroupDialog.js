import BasePageDialog from '../base/BasePageDialog.js';

export default class CustomGroupDialog extends BasePageDialog {
    constructor() {
        super(null, '.mstrmojo-Editor.mstrmojo-charcoalboxe.modal', 'Create custom group dialog');
    }

    // Action helper

    async close() {
        await super.close();
    }

    async waitDialogShown() {
        return this.waitForElementVisible(this.getElement());
    }
}
