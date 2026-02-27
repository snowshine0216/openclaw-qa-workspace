import BaseComponent from '../base/BaseComponent.js';

export default class ListView extends BaseComponent {
    constructor() {
        super('#FolderList tbody', 'Folder ListView component');
    }

    getListItem(name) {
        return this.locator.$$(`.mstrLink`).filter(async (item)=> (await item.getText()).includes(name))[0];
    }
}
