import TitleBar from '../document/TitleBar.js';
import Slider from './Slider.js';

export default class MetricSlider extends Slider {
    constructor(container) {
        super(container, '.mstrmojo-DocSelector.extSlider', 'Metric Slider');
    }

    getContent() {
        return this.getParent(this.getParent(this.getElement()));
    }

    getTitle() {
        const plocator = this.getElement().$('../..').$('.mstrmojo-portlet-titlebar');
        const el = new TitleBar(plocator);
        return el;
    }

    getQualificationText() {
        return this.getElement().$('.mstrmojo-ui-Pulldown-text');
    }

    getQualificationDropdown() {
        return this.$('.mstrmojo-PopupList');
    }

    getQualificationOption(name) {
        return this.$$('.mstrmojo-PopupList .item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return this.escapeRegExp(elemText).includes(this.escapeRegExp(name));
            })[0];
    }

    async getSliderLabel() {
        return this.getElement().$('.sl-control').getText();
    }

    async getSliderSummary() {
        return this.getElement().$('.mstrmojo-Slider-summary').getText();
    }

    async selectQualificationOperation(name, iswait = true) {
        await this.openQualificationDropdown();
        await this.click({ elem: this.getQualificationOption(name) });
        if (iswait) {
            await this.waitForElementInvisible(this.getQualificationDropdown());
        }
    }

    async openQualificationDropdown() {
        await this.click({ elem: this.getQualificationText() });
    }
}
