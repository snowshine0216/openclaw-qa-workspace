import BaseComponent from '../base/BaseComponent.js';

export default class Alert extends BaseComponent {
    constructor(container) {
        super(container, '#mojoAlertx9', 'Alert Dialog');
    }

    // element locator
    getTextButtonByName(name) {
        return this.$$(`.mstrmojo-Button-text`).filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === name;
        })[0];
    }

    async clickOnButtonByName(name, time = 0) {
        //add sleep here to wait for multi alert dialog
        await this.sleep(1000);
        await this.waitForElementVisible(this.getElement());
        const el = this.getTextButtonByName(name);
        await this.clickAndNoWait({ elem: el }, false);
        // add sleep logic to avoid blank page after confirm submit transaction
        await this.sleep(time);
    }

    async clickOnButtonByNameNoWait(name) {
        const el = this.getTextButtonByName(name);
        await this.click({ elem: el });
    }

    async clickRepublishButton() {
        const el = this.getElement().$('#ok');
        await this.click({ elem: el });
        await this.waitForElementDisappear(this.getElement());
    }

    // asserison helper
    async getAlertMessage() {
        const el = this.$('#mojoAlertx9');
        await this.waitForElementVisible(el);
        const text = await this.locator.$$('.mstrmojo-Label')[0].getText();
        return text.split('\n')[0];
    }

    async isAlertDisplay() {
        return this.getElement().isDisplayed();
    }
}
