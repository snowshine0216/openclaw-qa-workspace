import BaseFilter from '../base/BaseFilter.js';
import FilterCapsule from '../common/FilterCapsule.js';
import FilterElement from '../common/FilterElement.js';
import FilterSearch from '../common/FilterSearch.js';
import Checkbox from '../common/Checkbox.js';
import { scrollElementToBottom } from '../../utils/scroll.js';

export default class CheckboxFilter extends BaseFilter {
    constructor() {
        super();
        this.capsule = new FilterCapsule();
        this.fElement = new FilterElement();
        this.fSearch = new FilterSearch();
    }
    // Element locator

    getSecondaryFilterPanel() {
        return this.fElement.getSecondaryFilterPanel();
    }

    getFilterItemList() {
        return this.$('.mstrd-FilterItemsList');
    }

    getCheckboxes() {
        return Checkbox.findAll(this.getFilterItemList());
    }

    getFilterOptions() {
        return this.getFilterItemList().$$('.mstrd-Checkbox-label');
    }

    async getCheckboxByName(name) {
        const checkboxes = await this.getCheckboxes();
        for (const checkbox of checkboxes) {
            if ((await checkbox.getLabelText()) === name) {
                return checkbox;
            }
        }
    }

    // In BaseFilter, filter container get whole filter item, when click it to open secondary panel, it may click on the capsules, so only get filter name part in checkbox filter
    getFilterTitleContainer(name) {
        return this.$$('.mstrd-FilterItemContainer-top').filter(async (elem) => {
            const filterName = await elem.$('.mstrd-FilterItemTitle-filterTitle').getText();
            return filterName === name;
        })[0];
    }

    // Action helper

    async openSecondaryPanel(filterName) {
        await super.openSecondaryPanel(filterName);
        await this.waitForElementVisible(this.getSecondaryFilterPanel(), {
            timeout: 5000,
            msg: 'Secondary panel did not open.',
        });
        return this.sleep(2000);
    }

    async selectElementByName(name) {
        const checkbox = await this.getCheckboxByName(name);
        await checkbox.click();
        await this.fElement.waitForGDDEUpdate();
    }

    async selectElementsByNames(names) {
        for (const name of names) {
            const checkbox = await this.getCheckboxByName(name);
            if (checkbox) {
                await checkbox.click();
            }
        }
    }

    async uncheckElementByName(name) {
        const checked = await this.isElementSelected(name);
        if (checked) {
            const checkbox = await this.getCheckboxByName(name);
            await checkbox.click();
            await this.fElement.waitForGDDEUpdate();
        }
    }

    async keepOnly(name) {
        const checkbox = await this.getCheckboxByName(name);
        const only = await checkbox.getOnlyButton();
        await only.click();
        await this.fElement.waitForGDDEUpdate();
    }

    async hoverOnElement(name) {
        const checkbox = await this.getCheckboxByName(name);
        await this.hover({ elem: checkbox.getElement() });
        await this.waitForElementVisible(checkbox.getOnlyButton(), {
            timeout: 5000,
            msg: 'Keep only link did not appear.',
        });
        await this.sleep(1000);
    }

    async toggleViewSelectedOption() {
        return this.fElement.toggleViewSelectedOption();
    }

    async toggleViewSelectedOptionOn() {
        return this.fElement.toggleViewSelectedOptionOn();
    }

    async selectAll() {
        return this.fElement.selectAll();
    }

    async clearAll() {
        return this.fElement.clearAll();
    }

    async search(keyword) {
        return this.fSearch.search(keyword);
    }

    async clearSearch() {
        await this.fSearch.clearSearch();
        await this.esc();
    }

    async scrollSecondaryPanelToBottom() {
        return scrollElementToBottom(this.getFilterItemList());
    }

    // Assertion helper

    async isElementPresent(name) {
        const checkbox = await this.getCheckboxByName(name);
        if (!checkbox) {
            return false;
        }
        const main = await checkbox.getMain();
        return main.isDisplayed();
    }

    async isElementSelected(name) {
        const checkbox = await this.getCheckboxByName(name);
        return checkbox.isChecked();
    }

    async elementByOrder(index) {
        const checkboxes = await this.getCheckboxes();
        return checkboxes[index].getLabelText();
    }

    async message() {
        return this.fElement.message();
    }

    async isKeepOnlyLinkDisplayed(name) {
        const checkbox = await this.getCheckboxByName(name);
        const only = checkbox.getOnlyButton();
        return only.isDisplayed();
    }

    async isViewSelectedEnabled() {
        return this.fElement.isViewSelectedEnabled();
    }

    async isCapsulePresent({ filterName, capsuleName }) {
        return this.capsule.isCapsulePresent({
            filterElementFinder: this.getFilterContainer(filterName),
            name: capsuleName,
        });
    }

    async capsuleCount(filterName) {
        return this.capsule.capsuleCount(this.getFilterContainer(filterName));
    }

    async isCapsuleExcluded({ filterName, capsuleName }) {
        return this.capsule.isCapsuleExcluded({
            filterElementFinder: this.getFilterContainer(filterName),
            name: capsuleName,
        });
    }

    async keyword() {
        return this.fSearch.keyword();
    }

    async isClearSearchIconPresent() {
        return this.fSearch.isClearSearchIconPresent();
    }

    async visibleSelectedElementCount() {
        const checkboxes = await this.getCheckboxes();
        let count = 0;
        for (const checkbox of checkboxes) {
            if (await checkbox.isChecked()) {
                count++;
            }
        }
        return count;
    }

    async isSelectAllEnabled() {
        return this.fElement.isSelectAllEnabled();
    }

    async isClearAllEnabled() {
        return this.fElement.isClearAllEnabled();
    }

    async getCheckBoxElementsCount() {
        const checkboxes = await this.getCheckboxes();
        return checkboxes.length;
    }

    async getCheckBoxElementsText() {
        const options = this.getFilterOptions();
        const count = await options.length;
        if (count === 0) {
            return [];
        }
        const value = await options.map((item) => item.getText());
        return value;
    }
}
