import BaseComponent from '../base/BaseComponent.js';

export default class LikertScale extends BaseComponent {
    constructor(container) {
        super(container, '.tableLayoutList', 'LikertScale DIC for TXN');
    }

    getItem(name) {
        return this.locator.$(`.item[title="${name}"]`);
    }

    getItemList() {
        return this.locator.$$('.item_wrapper');
    }

    async getLowest() {
        const length = await this.locator.$$('.left_text').length;
        return this.locator.$$('.left_text')[length - 1];
    }

    async getHighest() {
        const length = await this.locator.$$('.right_text').length;
        return this.locator.$$('.right_text')[length - 1];
    }

    // action helper
    async chooseValue(value) {
        const el = this.getItem(value);
        await this.hover({ elem: el });
        await this.click({ elem: el });
        await this.waitDataLoaded();
    }

    // assersion helper
    async getLowestRating() {
        await this.waitForElementVisible(this.locator);
        const el = await this.getLowest();
        return el.getText();
    }

    async getHighestRating() {
        await this.waitForElementVisible(this.locator);
        const el = await this.getHighest();
        return el.getText();
    }

    async getSelectedItem() {
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
