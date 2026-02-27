import BasePage from '../base/BasePage.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

export default class FilterElement extends BasePage {
    constructor() {
        super();
    }

    // Element locator

    getSecondaryFilterPanel() {
        return this.$('.mstrd-FilterDetailsPanel-wrapper');
    }

    getAllElements() {
        return this.getSecondaryFilterPanel().$$('.mstrd-FilterItemsList-itemContainer');
    }

    getAllRadioButtons() {
        return this.getSecondaryFilterPanel().$$('.mstrd-RadioButton');
    }

    getSearchElementList() {
        return this.getSecondaryFilterPanel().$('.mstrd-SearchStyleFilterItemsList');
    }

    getAllSearchElements() {
        return this.getSecondaryFilterPanel().$$('.mstrd-SearchStyleFilterItemsList-itemContainer');
    }

    getElementByName(name) {
        return this.getAllElements().filter(async (elem) => {
            const elementName = await elem.getText();
            if (!name.includes("'")) {
                return elementName === name;
            } else {
                const i = name.indexOf("'");
                const sub1 = name.substring(0, i);
                const sub2 = name.substring(i + 1);
                return elementName === sub1.concat(`'`, sub2);
            }
        })[0];
    }


    getRadioButtonByName(name) {
        return this.getAllRadioButtons().filter(async (elem) => {
            const elementName = await elem.$('.mstrd-RadioButton-label').getText();
            if (!name.includes("'")) {
                return elementName === name;
            } else {
                const i = name.indexOf("'");
                const sub1 = name.substring(0, i);
                const sub2 = name.substring(i + 1);
                return elementName === sub1.concat(`'`, sub2);
            }
        })[0];
    }

    getSearchElementByName(name) {
        return this.getAllSearchElements().filter(async (elem) => {
            const elementName = await elem.$('.mstrd-Checkbox-label').getText();
            if (!name.includes("'")) {
                return elementName === name;
            } else {
                const i = name.indexOf("'");
                const sub1 = name.substring(0, i);
                const sub2 = name.substring(i + 1);
                return elementName === sub1.concat(`'`, sub2);
            }
        })[0];
    }

    getElementInputByName(name) {
        return this.getElementByName(name).$('.mstrd-Checkbox-input');
    }

    getSelectedRadioShapeByName(name) {
        return this.getRadioButtonByName(name).$('.mstrd-RadioButton-radioShape--checked');
    }

    getElementByOrder(index) {
        return this.getAllElements()[index];
    }

    getRadioButtonByOrder(index) {
        return this.getAllRadioButtons()[index];
    }

    getKeepOnlyLink(name) {
        return this.getElementByName(name).$(`../div[@class='mstrd-Checkbox-keepOnly']`);
    }

    getSearchElementKeepOnly(name) {
        return this.getSearchElementByName(name).$('.mstrd-Checkbox-keepOnly');
    }

    getViewSelectedIcon() {
        return this.$('.mstrd-Switch');
    }

    getEnabledToggle() {
        return this.$('.mstrd-Switch.mstrd-Switch--checked');
    }

    getFilterSelectionOptions() {
        return this.getSecondaryFilterPanel().$$('.mstr-panel-text');
    }

    getSelectAllLink() {
        return this.getFilterSelectionOptions().filter(async (elem) => {
            const linkName = await elem.getText();
            return linkName.includes('Select All'); //SelectAll for searchbox filter return with the count ex: Select All(3)
        })[0];
    }

    getClearAllLink() {
        return this.getFilterSelectionOptions().filter(async (elem) => {
            const linkName = await elem.getText();
            return linkName.includes('Clear All');
        })[0];
    }

    getFooterButton(option) {
        return this.$('.mstrd-FilterDetailPanelFooter')
            .$$('.mstr-panel-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(option);
            })[0];
    }

    getBulkSelection(option) {
        const xpathCommand = this.getCSSContainingText('mstr-panel-text', option);
        return this.$(`${xpathCommand}`);
    }

    getVisibleElements() {
        return this.$$('.mstrd-Checkbox-body');
    }

    getVisibleRadioButtons() {
        return this.$$('.mstrd-RadioButton');
    }

    getVisibleSelectedElements() {
        return this.$(`div[class*='FilterItemsList']`).$$('.mstrd-Checkbox-body').$$('.mstrd-Checkbox-input:checked');
    }

    getVisibleSelectedRadioButtons() {
        return this.$(`div[class*='FilterItemsList']`).$$('.mstrd-RadioButton-radioShape--checked');
    }

    getGDDEUpdate() {
        return this.$('.mstrd-FilterItemTitle-gddeStatus > .loading-spinner');
    }

    async waitForGDDEUpdate() {
        await this.sleep(1000);
        return this.waitForElementInvisible(this.getGDDEUpdate(), {
            timeout: 60000,
            msg: 'Filter-targeting filter did not get resolved for a long time.',
        });
    }

    // Action helper

    async selectElementByName(name) {
        await this.getElementByName(name).click();
        await this.waitForGDDEUpdate();
    }

    async selectRadioButtonByName(name) {
        await this.getRadioButtonByName(name).click();
        await this.waitForGDDEUpdate();
    }

    async selectSearchElementByName(name) {
        await this.click({ elem: this.getSearchElementByName(name) });
        await this.sleep(1000);
        return this.waitForElementInvisible(this.getGDDEUpdate(), {
            timeout: 60000,
            msg: 'Filter-targeting filter did not get resolved for a long time.',
        });
    }

    async hoverOnElement(name) {
        await this.hover({ elem: this.getElementByName(name) });
        await this.waitForElementVisible(this.getKeepOnlyLink(name), {
            timeout: 5000,
            msg: 'Keep only link did not appear.',
        });
        return this.sleep(1000);
    }

    async hoverOnRadioButton(name) {
        await this.hover({ elem: this.getRadioButtonByName(name) });
        return this.sleep(1000);
    }

    async hoverOnSearchElement(name) {
        await this.hover({ elem: this.getSearchElementByName(name) });
        return this.sleep(1000);
    }

    async keepOnly(name) {
        await this.getKeepOnlyLink(name).click();
        return this.waitForElementInvisible(this.getGDDEUpdate());
    }

    async keepOnlyForSearchElement(name) {
        await this.getSearchElementKeepOnly(name).click();
        return this.waitForElementInvisible(this.getGDDEUpdate());
    }

    async toggleViewSelectedOption() {
        return this.getViewSelectedIcon().click();
    }

    async toggleViewSelectedOptionOn() {
        await this.click({ elem: this.getViewSelectedIcon() });
        await this.waitForDynamicElementLoading();
        return this.waitForElementVisible(this.getEnabledToggle());
    }

    async selectAll() {
        await this.getSelectAllLink().click();
        await this.sleep(1000);
        return this.waitForElementInvisible(this.getGDDEUpdate());
    }

    async clearAll() {
        await this.getClearAllLink().click();
        await this.sleep(1000);
        return this.waitForElementInvisible(this.getGDDEUpdate());
    }

    async bulkSelection(option) {
        await this.getBulkSelection(option).click();
        await this.sleep(1000);
        return this.waitForElementInvisible(this.getGDDEUpdate());
    }

    async clickFooterButton(option) {
        await this.click({ elem: this.getFooterButton(option) });
        return this.waitForElementInvisible(this.getGDDEUpdate());
    }

    // Assertion helper

    async isElementPresent(name) {
        return this.getElementByName(name).isDisplayed();
    }

    async isElementSelected(name) {
        const element = await this.getElementByName(name);
        const checked = await element.getAttribute('aria-checked');
        return checked === 'true';
    }

    async isRadioButtonPresent(name) {
        return this.getRadioButtonByName(name).isDisplayed();
    }

    async isRadioButtonSelected(name) {
        return this.getSelectedRadioShapeByName(name).isDisplayed();
    }

    async isSearchElementSelected(name) {
        const element = await this.getSearchElementByName(name);
        const main = await element.$('.mstrd-Checkbox-main');
        const checked = await main.getAttribute('aria-checked');
        return checked === 'true';
    }

    async elementByOrder(index) {
        return this.getElementByOrder(index).getText();
    }

    async radioButtonByOrder(index) {
        const value = await this.getRadioButtonByOrder(index).getText();
        return this.getRadioButtonByOrder(index).getText();
    }

    async message() {
        return this.$('.mstrd-FilterItemsList-warn-msg').getText();
    }

    async isKeepOnlyLinkDisplayed(name) {
        return this.getKeepOnlyLink(name).isDisplayed();
    }

    async isKeepOnlyLinkDisplayedForSearchElement(name) {
        return this.getSearchElementKeepOnly(name).isDisplayed();
    }

    async isViewSelectedEnabled() {
        return this.$('.mstrd-Switch--checked').isDisplayed();
    }

    async isViewSelectedPresent() {
        return this.getViewSelectedIcon().isDisplayed();
    }

    async visibleElementCount() {
        return this.getAllElements().length;
    }

    async visibleRadioButtonCount() {
        return this.getAllRadioButtons().length;
    }

    async visibleSearchElementCount() {
        return this.getAllSearchElements().length;
    }

    async visibleSelectedElementCount() {
        return this.getVisibleSelectedElements().length;
    }

    async visibleSelectedRadioButtonCount() {
        return this.getVisibleSelectedRadioButtons().length;
    }

    async isSelectAllEnabled() {
        const color = await this.getSelectAllLink().getCSSProperty('color');
        return color.value === 'rgba(6,97,224,1)';
    }

    async isClearAllEnabled() {
        const color = await this.getClearAllLink().getCSSProperty('color');
        return color.value === 'rgba(6,97,224,1)';
    }

    async getCheckBoxElementsCount() {
        const eCount = await this.getVisibleElements().length;
        return console.log(' Total number of checkbox elements present : ' + eCount);
    }

    async isFooterButtonPresent(option) {
        return this.getFooterButton(option).isDisplayed();
    }

    async isFooterButtonDisabled(option) {
        await this.waitForElementVisible(this.getFooterButton(option));
        const name = await getAttributeValue(await this.getFooterButton(option), 'className');
        return name.includes('disabled');
    }


    async getSearchResultsText() {
        const elements = this.getAllSearchElements();
        const count = await elements.length;
        if (count === 0) {
            return [];
        }
        const value = await elements.map((item) => item.getText());
        return value;
    }

    async getElementIndex(name) {
        const elements = this.getAllSearchElements();
        const count = await elements.length;
        if (count === 0) {
            return -1;
        }
        for (let i = 0; i < count; i++) {
            const text = await elements[i].getText();
            if (text.includes(name)) {
                return i;
            }
        }
        return -1;
    }
}
