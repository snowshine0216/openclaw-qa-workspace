import BaseFilter from '../base/BaseFilter.js';
import FilterDropdown from '../common/FilterDropdown.js';
// import FilterSummary from '../common/FilterSummary.js';

export default class MQFilter extends BaseFilter {
    constructor() {
        super();
        this.dropdown = new FilterDropdown();
        // this.filterSummary = new FilterSummary(browserInstance);
    }

    // Element locator

    getExpression(name) {
        return this.getFilterContainer(name).$('.summary');
    }

    getOutOfDropdown() {
        return this.$('//div[@class="mstrd-DropdownMenu-headerTitle"][contains(text(),"Filter Data")]');
    }

    // Action helper

    async clickOutOfDropdown() {
        return this.click({ elem: this.getOutOfDropdown() });
    }

    async openDropdownMenu(name) {
        return this.dropdown.openDropdownMenu(this.getFilterContainer(name));
    }

    async updateValue({ filterName, valueLower, valueUpper }) {
        return this.dropdown.updateValue({ elem: this.getFilterContainer(filterName), valueLower, valueUpper });
    }

    async updateValueWithEnter({ filterName, valueLower, valueUpper }) {
        return this.dropdown.updateValueWithEnter({
            elem: this.getFilterContainer(filterName),
            valueLower,
            valueUpper,
        });
    }

    async selectOption(name, option) {
        await this.sleep(2000);
        return this.dropdown.selectOption(this.getFilterContainer(name), option);
    }

    async hoverOnFilter(filterName) {
        const dropdown = await this.dropdown.getDropdown(this.getFilterContainer(filterName));
        const elem = await dropdown.$('.mstrd-Ellipsis');
        await this.hover({ elem: elem || dropdown });
        return this.sleep(1000);
    }

    // Assertion helper

    async selectedOption(name) {
        return this.dropdown.selectedOption(this.getFilterContainer(name));
    }

    async inputBoxValue(name) {
        return this.dropdown.inputBoxValue(this.getFilterContainer(name));
    }
}
