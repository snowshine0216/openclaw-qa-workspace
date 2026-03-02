import BaseComponent from '../base/BaseComponent.js';

export default class Toggle extends BaseComponent {
    constructor(container) {
        super(container, '.mstrmojo-ImageToggle', 'Toggle DIC for TXN');
    }

    getItem() {
        return this.locator
            .$$('div')
            .filter((el) => el.isDisplayed())[0]
            .$('img');
    }

    // action helper
    async changeValue() {
        await this.click({ elem: this.getItem() });
        await this.click({ elem: $('.mstrmojo-DocLayoutViewer-layout') });
        await this.waitDataLoaded();
    }

    // assersion helper
    async getCurrentValue() {
        await this.waitForElementVisible(this.locator);
        console.log('find locator');
        await this.waitForElementVisible(this.getItem());
        console.log('find getItem');
        const value = await this.getTitle(this.getItem());
        return value;
    }
}
