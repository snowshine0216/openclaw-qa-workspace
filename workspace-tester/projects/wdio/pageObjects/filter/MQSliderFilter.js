import BaseFilter from '../base/BaseFilter.js';
import FilterDropdown from '../common/FilterDropdown.js';
import FilterSlider from '../common/FilterSlider.js';

export default class MQSliderFilter extends BaseFilter {
    constructor() {
        super();
        this.dropdown = new FilterDropdown();
        this.slider = new FilterSlider();
    }

    // Element locator

    async hoverOnUpperHandle(name) {
        return this.slider.hoverOnUpperHandle(this.getFilterContainer(name));
    }

    async hoverOnLowerHandle(name) {
        return this.slider.hoverOnLowerHandle(this.getFilterContainer(name));
    }

    async hoverOnHandle(name) {
        return this.slider.hoverOnHandle(this.getFilterContainer(name));
    }

    async openDropdownMenu(name) {
        return this.dropdown.openDropdownMenu(this.getFilterContainer(name));
    }

    async selectOption(name, option) {
        return this.dropdown.selectOption(this.getFilterContainer(name), option);
    }

    async updateLowerInput(name, value) {
        return this.slider.updateLowerInput(this.getFilterContainer(name), value);
    }

    async updateUpperInput(name, value) {
        return this.slider.updateUpperInput(this.getFilterContainer(name), value);
    }

    async updateSliderInput(name, lowerValue, upperValue) {
        await this.updateLowerInput(name, lowerValue);
        await this.updateUpperInput(name, upperValue);
    }

    async dragToSamePosition(name) {
        const filterElementFinder = this.getFilterContainer(name);
        await this.slider.dragToSamePosition(filterElementFinder);
    }

    async updateValue({ filterName, valueLower, valueUpper }) {
        return this.dropdown.updateValue({ elem: this.getFilterContainer(filterName), valueLower, valueUpper });
    }

    async clearSlider(name) {
        return this.slider.clearSlider(this.getFilterContainer(name));
    }

    async moveLowerFilterHandle(filterName, position) {
        return this.slider.dragAndDropLowerHandle(this.getFilterContainer(filterName), position);
    }

    async moveUpperFilterHandle(filterName, position) {
        return this.slider.dragAndDropUpperHandle(this.getFilterContainer(filterName), position);
    }

    async sliderTooltip() {
        return this.tooltip();
    }
    // Assertion helper

    async inputBoxValue(name) {
        return this.dropdown.inputBoxValue(this.getFilterContainer(name));
    }

    async lowerInput(name) {
        return this.slider.lowerInput(this.getFilterContainer(name));
    }

    async upperInput(name) {
        return this.slider.upperInput(this.getFilterContainer(name));
    }

    async minValue(name) {
        return this.slider.minValue(this.getFilterContainer(name));
    }

    async maxValue(name) {
        return this.slider.maxValue(this.getFilterContainer(name));
    }

    async selectedOption(name) {
        return this.dropdown.selectedOption(this.getFilterContainer(name));
    }
}
