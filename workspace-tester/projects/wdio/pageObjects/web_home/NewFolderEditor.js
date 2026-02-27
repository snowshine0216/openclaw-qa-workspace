import BasePageDialog from '../base/BasePageDialog.js';
import { getInputValue } from '../../utils/getAttributeValue.js';

export default class NewFolderEditor extends BasePageDialog {
    constructor() {
        super('div[scriptclass="mstrCreateFolderImpl"]', 'New Folder pupup');
    }

    getName() {
        return this.getElement().$('#childFolderName');
    }

    getDescription() {
        return this.getElement().$('#childFolderDescription');
    }

    // Action helper

    /**
     * Clear and input name
     * @param {String} name name of the new folder
     */
    async inputName(name) {
        return this.getName().clear().setValue(name);
    }

    /**
     * Clear and input description
     * @param {String} description description of the new folder
     */
    async inputDescription(description) {
        const input = this.getDescription();
        await this.clear({ elem: input });
        await input.setValue(description);
    }

    async confirm() {
        await super.confirm();
    }

    // Assersion helper

    async getDescriptionText() {
        return getInputValue(this.getDescription());
    }
}
