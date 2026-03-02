import BaseFilter from '../base/BaseFilter.js';
import FilterElement from '../common/FilterElement.js';
import FilterSearch from '../common/FilterSearch.js';

export default class RadiobuttonFilter extends BaseFilter {
    constructor() {
        super();
        this.fElement = new FilterElement();
        this.fSearch = new FilterSearch();
    }

    async selectElementByName(name) {
        return this.fElement.selectRadioButtonByName(name);
    }

    async hoverOnElement(name) {
        await this.hover({ elem: this.fElement.getRadioButtonByName(name) });
        return this.sleep(1000);
    }

    async clearSelection() {
        return this.fElement.bulkSelection('Clear Selection');
    }

    async search(keyword) {
        return this.fSearch.search(keyword);
    }

    async clearSearch() {
        return this.fSearch.clearSearch();
    }

    //assertion helper
    async isElementPresent(name) {
        return this.fElement.isRadioButtonPresent(name);
    }

    async isElementSelected(name) {
        return this.fElement.isRadioButtonSelected(name);
    }

    async isCapsulePresent({ filterName, capsuleName }) {
        return this.capsule.isCapsulePresent({
            filterElementFinder: this.getFilterContainer(filterName),
            name: capsuleName,
        });
    }

    async isCapsuleExcluded({ filterName, capsuleName }) {
        return this.capsule.isCapsuleExcluded({
            filterElementFinder: this.getFilterContainer(filterName),
            name: capsuleName,
        });
    }

    async isClearSearchIconPresent() {
        return this.fSearch.isClearSearchIconPresent();
    }

    async elementByOrder(index) {
        return this.fElement.radioButtonByOrder(index);
    }

    async message() {
        return this.fElement.message();
    }

    async keyword() {
        return this.fSearch.keyword();
    }

    async isViewSelectedPresent() {
        return this.fElement.isViewSelectedPresent();
    }

    async visibleSelectedElementCount() {
        return this.fElement.visibleSelectedRadioButtonCount();
    }

}
