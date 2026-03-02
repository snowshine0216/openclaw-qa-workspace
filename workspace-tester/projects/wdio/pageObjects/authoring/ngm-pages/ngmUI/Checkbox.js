import BasePage from '../../../base/BasePage.js';
import Common from '../../Common.js';

let checkboxWebElement = null;
let indexID = 0;

export default class Checkbox extends BasePage {
    constructor() {
        super();
        this.common = new Common();
    }

    /**
     * Locate the checkbox by index
     * @param {number} idx - used to specify which checkbox to use if multiple checkboxes exist
     */
    async locateByIndex(idx) {
        const checkboxWebElement = await this.getWebElement(idx);
        return checkboxWebElement;
    }

    /**
     * Locate the first checkbox element
     */
    async locate() {
        const checkboxWebElement = await this.getWebElement(0);
        return checkboxWebElement;
    }

    async getWebElement(index) {
        const xpathOfCheckbox =
            "//div[contains(@class, 'mstrmojo-ui-Checkbox')][ancestor::div[contains(@class, 'mstrmojo-vi-PropEditor')]]";
        const checkboxWebElements = await this.$$(xpathOfCheckbox);
        indexID = index;
        return checkboxWebElements[index];
    }

    async getIdentity() {
        let result = '';
        if (checkboxWebElement != null) {
            const str = await checkboxWebElement.toString().split('//');
            result = `${str[str.length - 1]} <== @index: [${indexID}]`;
        }
        return result;
    }

    /**
     * check
     * @throws AWTException
     */
    async check() {
        checkboxWebElement = await this.locate();
        if (checkboxWebElement != null) {
            const id = await checkboxWebElement.getAttribute('id');
            const checkbox = mstrmojo.all[id];
            if (!checkbox.checked) {
                checkbox.onclick();
            }
            console.log(`[Checkbox]: check > ${await this.getIdentity()}`, true);
        }
        await this.loadingDataPopUpNotDisplayed();
    }

    /**
     * uncheck
     * @throws AWTException
     */
    async uncheck() {
        checkboxWebElement = await this.locate();

        if (checkboxWebElement != null) {
            const id = await checkboxWebElement.getAttribute('id');
            const checkbox = mstrmojo.all[id];
            if (checkbox.checked) {
                checkbox.onclick();
            }
            console.log(`[Checkbox]: uncheck > ${await this.getIdentity()}`, true);
        }
        await this.loadingDataPopUpNotDisplayed();
    }

    /**
     * get the status of checkbox
     * @throws AWTException
     */
    async isChecked() {
        checkboxWebElement = await this.locate();

        if (checkboxWebElement != null) {
            const id = await checkboxWebElement.getAttribute('id');
            const checkbox = mstrmojo.all[id];
            return checkbox.checked;
        }
        return false;
    }
}
