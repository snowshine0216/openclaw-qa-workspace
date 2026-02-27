import BaseComponent from '../base/BaseComponent.js';

export default class Switch extends BaseComponent {
    constructor(container) {
        super(container, '.mstrmojo-Label.tristate', 'Switch DIC for TXN');
    }

    // action helper
    async clickCheckbox() {
        await this.click({ elem: this.locator });
        await this.waitDataLoaded();
    }

    // assersion helper
    async isGrayed() {
        await this.waitForElementVisible(this.locator);
        return (await this.getElement().getAttribute('class')).indexOf('grayed') >= 0;
    }

    // assersion helper
    async isChecked() {
        await this.waitForElementVisible(this.locator);
        const value = await super.isChecked(this.locator);
        return value;
    }
}
