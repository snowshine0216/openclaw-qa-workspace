import LoadingDialog from '../../../dossierEditor/components/LoadingDialog.js';
import Common from '../../Common.js';

/**
 * Number format operations for grid
 */
export default class NumberFormatOperations {
    constructor(selectors, numberFormatSelectors) {
        this.selectors = selectors;
        this.numberFormatSelectors = numberFormatSelectors;
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
    }

    /**
     * Click one of the 3 icons in Number Format context menu
     * @param {*} shortcut ',' '$' '%' or fixed, currency, percentage
     */
    async clickNfShortcutIcon(shortcut) {
        let shortcutText;
        switch (shortcut) {
            case ',':
                shortcutText = 'fixed';
                break;
            case '$':
                shortcutText = 'currency';
                break;
            case '%':
                shortcutText = 'percentage';
                break;
            default:
                // can still use word version instead of icon if given something
                shortcutText = shortcut && shortcut.toLowerCase();
        }
        await this.selectors.click({ elem: await this.numberFormatSelectors.getNfShortcutsIcon(shortcutText) });
        // to dismiss tooltip
        await this.selectors.moveToPosition({ x: 0, y: 0 });
    }

    /**
     * Changes current number format by selecting another from the drop down
     * @param {*} numberFormat (from the dropdown) Automatic, Fixed, Currency, Percentage, etc..
     */
    async selectNumberFormatFromDropdown(numberFormat) {
        await this.selectors.sleep(0.3);
        await this.selectors.click({ elem: await this.numberFormatSelectors.getNfCategoryPulldown() });
        let pulldownOption = await this.common.getPopupListItem(numberFormat);
        // make sure pulldown is opened
        await this.selectors.waitForElementVisible(pulldownOption);
        await this.selectors.click({ elem: pulldownOption });
    }

    async clickNumberFormatDropdownOption() {
        await this.selectors.sleep(0.3);
        await this.selectors.click({ elem: await this.numberFormatSelectors.getNfCategoryPulldown() });
    }

    /**
     * Changes the currency used after selecting the Currency Number Format
     * @param {*} symbol $, €
     */
    async selectNfCurrencySymbolFromDropdown(symbol) {
        await this.selectors.click({ elem: await this.numberFormatSelectors.getNfCurrencySymbolPulldown() });
        let pulldownOption = await this.common.getPopupListItem(symbol);
        // make sure pulldown is opened
        await this.selectors.waitForElementVisible(pulldownOption);
        await this.selectors.click({ elem: pulldownOption });
    }

    /**
     * Changes where the currency is positioned after selecting the Currency Number Format
     * @param {*} position Left, Right, Left with space, Right with space
     */
    async selectNfCurrencyPositionFromDropdown(position) {
        await this.selectors.moveToPosition({ x: 0, y: 0 });
        await this.selectors.click({ elem: await this.numberFormatSelectors.getNfCurrencyPositionPulldown() });
        let pulldownOption = await this.common.getPopupListItem(position);
        // make sure pulldown is opened
        await this.selectors.waitForElementVisible(pulldownOption);
        await this.selectors.click({ elem: pulldownOption });
    }

    /**
     * Exra pulldown to configure how the value is formatted for Date, Time, and Fraction Number Formats
     * @param {*} format
     */
    async selectNfValueFormatFromDropdown(format) {
        await this.selectors.click({ elem: await this.numberFormatSelectors.getNfValueFormatPulldown() });
        // make sure pulldown is opened
        let pulldownOption = await this.common.getPopupListItem(format);
        await this.selectors.waitForElementVisible(pulldownOption);
        await this.selectors.clickOnElement(pulldownOption);
    }

    /**
     * For Custom Number Format, will automatically condense value. For ex: 4,000,000 to 4M
     */
    async clickNfCondense() {
        await this.selectors.click({ elem: await this.numberFormatSelectors.getNfCondenseButton() });
    }

    async inputNfCustomTextBox(newFormat) {
        await this.selectors.replaceTextByClickingOnElement(await this.numberFormatSelectors.getNfCustomTextbox(), newFormat);
    }

    /**
     * For Fixed number format, if wanted to enable or disable 1000 separator
     */
    async toggleNfThousandSeparator() {
        await this.selectors.click({ elem: await this.numberFormatSelectors.getNfThousandSeparator() });
    }

    /**
     * For Fixed, Currency, and Percentage
     * @param {*} form (1,234) or 1,234
     * @param {*} inRed boolean
     */
    async selectNfNegativeForm(form, inRed) {
        await this.selectors.click({ elem: await this.numberFormatSelectors.getNfNegativePulldown() });
        // make sure pulldown is opened
        let pulldownOption = await this.numberFormatSelectors.getNfNegativePopupListItem(form, inRed);
        await this.selectors.waitForElementVisible(pulldownOption);
        await this.selectors.click({ elem: pulldownOption });
    }

    /**
     * Function to increase or decrease the number of decimal places shown
     * @param {*} change increaes or decrease
     * @param {*} numOfPlaces >= 0
     */
    async moveNfDecimalPlace(change, numOfPlaces) {
        let direction = change.toLowerCase() === 'increase' ? 'left' : 'right',
            element = await this.numberFormatSelectors.getNfDecimalMoverBtn(direction),
            numOfClicks = parseInt(numOfPlaces);

        for (let i = 0; i < numOfClicks; i++) {
            await this.selectors.click({ elem: element });
        }
    }
} 