import BaseComponent from '../base/BaseComponent.js';

export default class RadioList extends BaseComponent {
    constructor(container) {
        super(
            container,
            '.mstrmojo-ListDIC .mstrmojo-ListBase.mstrmojo-TableLayoutList.radio',
            'Radio List DIC for TXN'
        );
    }

    getItem(name) {
        return this.locator.$$('.item').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === name;
        })[0];
    }

    getItemList() {
        return this.locator.$$('.item');
    }

    // action helper
    async selectItem(name) {
        await this.click({ elem: await this.getItem(name) });
        await this.waitDataLoaded();
    }

    // assertion helper
    async getSelectedItem() {
        const list = this.getItemList();
        const count = await list.length;
        let value = '';
        for (let i = 0; i < count; i++) {
            const el = list[i];
            const flag = await this.isSelected(el);
            if (flag) {
                value = this.getTitle(el);
            }
        }
        return value;
    }

    async isItemSelected(name) {
        const el = await this.getItem(name);
        const parent = await this.getParent(el);
        const value = await this.isSelected(parent);
        return value;
    }
}
