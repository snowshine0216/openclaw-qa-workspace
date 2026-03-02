import BaseComponent from '../base/BaseComponent.js';

export default class Slider extends BaseComponent {
    constructor(container) {
        super(container, '.mstrmojo-Slider', 'Slider DIC for TXN');
    }

    // Element locator

    getSliderButton() {
        return this.locator.$('.t2');
    }

    getSliderBar() {
        return this.locator.$('.bk');
    }

    getApplyBtn() {
        return this.$('.mstrmojo-Button.mstrmojo-oivmSprite.tbApply');
    }

    getCancelBtn() {
        return this.$('.mstrmojo-Button.mstrmojo-oivmSprite.tbCancel');
    }

    // Action helper

    async dragSlider(toOffset) {
        await this.dragAndDropByInterval({
            fromElem: this.getSliderButton(),
            toElem: this.getSliderBar(),
            toOffset,
        });
    }

    async apply() {
        await this.click({ elem: this.getApplyBtn() });
        await this.waitDataLoaded();
    }

    async cancel() {
        await this.click({ elem: this.getCancelBtn() });
    }
}
