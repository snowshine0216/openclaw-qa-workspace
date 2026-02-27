import BaseComponent from '../base/BaseComponent.js';

export default class TimePicker extends BaseComponent {
    constructor(container) {
        super(container, '.mstrmojo-TimePicker', 'TimePicker DIC for TXN');
    }

    // element locator
    getStepperUpBtn() {
        return this.locator.$('.mstrmojo-Button.stepper.up');
    }

    getStepperDownBtn() {
        return this.locator.$('.mstrmojo-Button.stepper.down');
    }

    getApplyBtn() {
        return this.$('.mstrmojo-Button.mstrmojo-oivmSprite.tbApply');
    }

    getCancelBtn() {
        return this.$('.mstrmojo-Button.mstrmojo-oivmSprite.tbCancel');
    }

    // action helper
    async clickStepperUpBtn(times = 1) {
        for (let i = 0; i < times; i++) {
            await this.click({ elem: this.getStepperUpBtn() });
        }
    }

    async clickStepperDownBtn() {
        await this.click({ elem: this.getStepperDownBtn() });
    }

    async clickApplyBtn() {
        await this.click({ elem: this.getApplyBtn() });
        await this.waitDataLoaded();
    }

    async clickCancelBtn() {
        await this.click({ elem: this.getCancelBtn() });
    }

    // assersion helper
    async isApplyBtnsDisabled() {
        await this.waitForElementVisible(this.getApplyBtn());
        return this.isDisabledStatus(await this.getApplyBtn());
    }
}
