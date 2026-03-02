import BasePage from '../base/BasePage.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

export default class FilterDropdown extends BasePage {
    // Element locator
    getDropdown(filterElementFinder) {
        return filterElementFinder.$(`div[class*='pulldown-widget'], div[class*='AQContainer-widget']`);
    }

    getInputBox(filterElementFinder) {
        return this.getDropdown(filterElementFinder).$(`input[class*='mainValue-input']`);
    }

    getSecondaryInputBox(filterElementFinder) {
        return this.getDropdown(filterElementFinder).$('input.mstrd-MQInput-isBottom, input.mstrd-AQContainer-secondValue-input');
    }

    getDropDownContainer(filterElementFinder) {
        return this.getDropdown(filterElementFinder).$('.mstrd-DropDown-children');
    }

    getDropdownMenu(filterElementFinder) {
        return this.getDropdown(filterElementFinder).$('.mstrd-Select-dropdown');
    }

    getDropdownOption(filterElementFinder, option) {
        return this.getDropdownMenu(filterElementFinder)
            .$$('.mstrd-Option')
            .filter(async (elem) => {
                const optionName = await elem.getText();
                return optionName === option;
            })[0];
    }

    // Action helper
    async openDropdownMenu(filterElementFinder) {
        await this.click({ elem: this.getDropdown(filterElementFinder) });
        return this.waitForElementVisible(this.getDropDownContainer(filterElementFinder), {
            timeout: 5000,
            msg: 'Dropdown menu is not displayed.',
        });
    }

    async selectOption(filterElementFinder, option) {
        await this.getDropdownOption(filterElementFinder, option).click();
        return this.waitForElementInvisible(this.getDropDownContainer(filterElementFinder), {
            timeout: 5000,
            msg: 'Dropdown menu is still displayed.',
        });
    }

    async updateValue({ elem, valueLower, valueUpper }) {
        if (valueUpper) {
            const el = await this.getSecondaryInputBox(elem);
            await this.clear({ elem: el });
            await el.setValue(valueUpper.toString());
            await this.waitForTextPresentInElementValue(this.getSecondaryInputBox(elem), valueUpper, {
                timeout: 5000,
                msg: 'Input box does not display the provided value.',
            });
        }
        const el = await this.getInputBox(elem);
        await this.clear({ elem: el });
        await el.setValue(valueLower.toString());
        await this.waitForTextPresentInElementValue(this.getInputBox(elem), valueLower, {
            timeout: 5000,
            msg: 'Input box does not display the provided value.',
        });
        await this.enter();
    }

    async updateValueWithEnter({ elem, valueLower, valueUpper }) {
        await this.updateValue({ elem, valueLower, valueUpper });
        await this.enter();
    }

    // Assertion helper
    async selectedOption(filterElementFinder) {
        return this.getDropdown(filterElementFinder).$('.mstrd-Select-selected .mstrd-DropDownButton-label').getText();
    }

    async inputBoxValue(filterElementFinder) {
        const value = await getAttributeValue(this.getInputBox(filterElementFinder), 'value');
        return value;
    }
}
