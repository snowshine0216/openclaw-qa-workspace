import BaseFilter from '../base/BaseFilter.js';
import FilterSlider from '../common/FilterSlider.js';

export default class AttributeSlider extends BaseFilter {
    constructor() {
        super();
        this.slider = new FilterSlider();
    }

    // Element locator

    getUpperSliderHandle(name) {
        return this.slider.getUpperSliderHandle(this.getFilterContainer(name));
    }

    getLowerSliderHandle(name) {
        return this.slider.getLowerSliderHandle(this.getFilterContainer(name));
    }

    // Action helper

    async clickLowerHandle(name) {
        return this.slider.clickLowerHandle(this.getFilterContainer(name));
    }

    async clickUpperHandle(name) {
        return this.slider.clickUpperHandle(this.getFilterContainer(name));
    }

    async clickHandle(name) {
        return this.slider.clickHandle(this.getFilterContainer(name));
    }

    async dragAndDropLowerHandle(name, pos) {
        return this.slider.dragAndDropLowerHandle(this.getFilterContainer(name), pos);
    }

    async dragAndDropUpperHandle(name, pos) {
        return this.slider.dragAndDropUpperHandle(this.getFilterContainer(name), pos);
    }

    async dragAndDropHandle(name, pos) {
        return this.slider.dragAndDropHandle(this.getFilterContainer(name), pos);
    }

    async hoverOnSummaryLabel(name) {
        return this.slider.hoverOnSummaryLabel(this.getFilterContainer(name));
    }

    async hoverOnMinValue(name) {
        return this.slider.hoverOnMinValue(this.getFilterContainer(name));
    }

    async hoverOnMaxValue(name) {
        return this.slider.hoverOnMaxValue(this.getFilterContainer(name));
    }

    async hoverOnUpperHandle(name) {
        return this.slider.hoverOnUpperHandle(this.getFilterContainer(name));
    }

    // Assertion helper

    async minValue(name) {
        return this.slider.minValue(this.getFilterContainer(name));
    }

    async maxValue(name) {
        return this.slider.maxValue(this.getFilterContainer(name));
    }

    async summary(name) {
        return this.slider.summary(this.getFilterContainer(name));
    }

    async isSummaryPresent(name) {
        return this.slider.isSummaryPresent(this.getFilterContainer(name));
    }

    async isSummaryInExcludeMode(name) {
        return this.slider.isSummaryInExcludeMode(this.getFilterContainer(name));
    }

    async isSliderHighlighted(name) {
        const sliderColor = await this.getFilterContainer(name)
            .$('.rc-slider-track')
            .getCSSProperty('background-color');
        return sliderColor === 'rgba(28, 145, 220, 1)';
    }

    async sliderTooltip() {
        return this.slider.sliderTooltip();
    }
}
