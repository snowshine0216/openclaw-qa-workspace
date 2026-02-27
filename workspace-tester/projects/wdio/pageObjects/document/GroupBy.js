import BaseComponent from '../base/BaseComponent.js';

export default class GroupBy extends BaseComponent {
    constructor(container) {
        super(container, '.mstrmojo-DocGroupBy', 'Group-By on document');
    }

    // element locator
    getDropDown() {
        return this.getElement().$('.mstrmojo-DropDownList-select');
    }

    getItemList() {
        return this.getDropDown().$$('option');
    }

    getItem(name) {
        return this.getDropDown()
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(name);
            })[0];
    }

    getGroupByOption(value) {
        return this.locator.$$('option').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(value);
        })[0];
    }

    // action helper
    async changeGroupBy(name) {
        await this.click({ elem: this.getDropDown() });
        const el = this.getItem(name);
        await el.click();
        await this.waitForCurtainDisappear();
    }

    // assersion helper
    async getCurrentSelection() {
        const list = this.getItemList();
        const count = await list.length;
        let value = '';
        for (let i = 0; i < count; i++) {
            const el = list[i];
            const flag = await this.isSelected(el);
            if (flag) {
                value = await el.getText();
            }
        }
        return value;
    }
}
