import BaseComponent from '../base/BaseComponent.js';

export default class StarRating extends BaseComponent {
    constructor(container) {
        super(container, '.mstrmojo-TableLayoutList.rate', 'StarRating DIC for TXN');
    }

    getItem(name) {
        return this.locator.$(`.item[title="${name}"]`);
    }

    // action helper
    async chooseValue(value) {
        const el = this.getItem(value);
        await this.hover({ elem: el });
        await this.click({ elem: el });
        await this.waitDataLoaded();
    }
}
