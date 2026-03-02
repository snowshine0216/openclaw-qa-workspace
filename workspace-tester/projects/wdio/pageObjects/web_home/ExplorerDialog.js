import BasePageDialog from '../base/BasePageDialog.js';

/**
 * This dialog will be triggered in following scenarios
 * Right click on an item in folder, choose 'Copy...', ''Move...', 'Create Shortcut...'
 *
 * In this dialog, user can explore different folder path, modify the item name and description...
 */
export default class ExplorerDialog extends BasePageDialog {
    // id="OMD_display", scriptclass="mstrUnselectableObjectExplorerImpl", class="mstrTransform"
    // all the above 3 can be used to locate the element
    constructor() {
        super(`div[id="OMD_display"]`, 'Create explorer dialog');
    }

    getFileList() {
        return this.getElement().$('div[sty="fileList"]');
    }

    // Action helper

    async inputName(name) {
        const input = this.getElement().$('.mstrRenameDialogBody input');
        await this.clear({ elem: input });
        await input.setValue(name);
    }

    async confirm() {
        await super.confirm();
    }

    async waitExplorDialogShwon() {
        return this.waitForElementVisible(this.getElement());
    }

    /**
     * Open folder in file list
     * @param {String[]} paths path array of the folder
     */
    async navigateTo(paths) {
        for (const folderText of paths) {
            // This will only return folder link
            const folder = this.getFileList().$$('.mstrSmallIconView a').filter(async (elem) => (await elem.getText()).includes(folderText))[0];
            await this.click({ elem: folder });
        }
    }

    // Assersion helper
}
