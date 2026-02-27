import BasePageDialog from '../base/BasePageDialog.js';

/**
 * You can trigger message box popup in following scenarios
 *
 * Right click on item in folder > 'Delete'
 */
export default class MsgBox extends BasePageDialog {
    constructor() {
        super('#msgBox', 'Create message box');
    }

    // Action helper

    async confirm() {
        await super.confirm();
    }

    async waitMsgBoxShown() {
        return this.waitForElementVisible(this.getElement());
    }

    // Action helper

    async getMessageContent() {
        return this.getElement().$('#msgContent').getText();
    }
}
