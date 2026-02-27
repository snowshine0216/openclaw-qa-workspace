import BaseComponent from '../base/BaseComponent.js';

export default class Stepper extends BaseComponent {
    constructor(container) {
        super(container, '.mstrmojo-StepperDIC', 'Stepper DIC for TXN');
    }

    getBtnByText(text) {
        return this.locator.$$('.mstrmojo-Button').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getValueInput() {
        return this.locator.$('.mstrmojo-Textbox');
    }

    // action helper
    async clickMinusBtn(times = 1) {
        for (let i = 0; i < times; i++) {
            await this.click({ elem: this.getBtnByText('-') });
        }
        await this.click({ elem: $('.mstrmojo-DocLayoutViewer-layout') });
    }

    async clickPlusBtn(times = 1) {
        for (let i = 0; i < times; i++) {
            await this.click({ elem: this.getBtnByText('+') });
        }
        await this.click({ elem: $('.mstrmojo-DocLayoutViewer-layout') });
    }

    // assersion helper
    async isBtnDisabled(text) {
        await this.waitForElementVisible(this.locator);
        return this.isDisabledStatus(await this.getBtnByText(text));
    }

    async getValue() {
        const value = await this.getInputValue(this.locator.$('input'));
        return value;
    }
}
