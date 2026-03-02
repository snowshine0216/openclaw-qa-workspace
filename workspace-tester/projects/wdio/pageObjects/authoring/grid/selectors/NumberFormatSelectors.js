import BaseContainer from '../../BaseContainer.js';

/**
 * Number format selectors for grid formatting
 * @extends BaseContainer
 */
export default class NumberFormatSelectors extends BaseContainer {
    constructor() {
        super();
    }

    /**
     * NUMBER FORMATTING GETTERS
     */
    /** pulldown to switch between Automatic, Date, Time, Fraction, etc. */
    getNfCategoryPulldown() {
        return this.$(`//div[contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'nf-category')]`);
    }

    /**
     * the 3 icons ',' $ and %
     * @param {*} shortcut: fixed, currency, percentage
     */
    getNfShortcutsIcon(shortcut) {
        let className = 'nf-shortcut-' + shortcut;
        return this.$(`//div[contains(@class, 'mstrmojo-Button') and contains(@class, '${className}')]`);
    }

    /**
     * the 2 decimal place buttons to increase or decrease
     * @param {*} direction left or right
     */
    getNfDecimalMoverBtn(direction) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Button') and contains(@class, 'nf-MoveDecimalPoint') and contains(@class, '${direction}')]`
        );
    }

    /** Only for Fixed Number Format */
    getNfThousandSeparator() {
        return this.$(`//span[contains(@class, 'mstrmojo-CheckBox') and contains(@class, 'nf-MiddleRow')]`);
    }

    /** Only for Currency Number Format */
    getNfCurrencySymbolPulldown() {
        return this.$(`//div[contains(@class, 'nf-CurrencySymbol')]//div[contains(@class,'btn')]`);
    }

    getNfCurrencyPositionPulldown() {
        return this.$(`//div[contains(@class, 'nf-CurrencyPosition')]`);
    }

    /** The extra pulldown for Date, Time, Fraction */
    getNfValueFormatPulldown() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'nf-MiddleRow') and contains(@class, 'nf-HasWidget') and @style='display: block;']`
        );
    }

    getNfValueFormatPulldownOption(option) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted') and contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'nf-MiddleRow') and contains(@class, 'nf-HasWidget')]//div[contains(@class, 'item') and text()='${option}']`
        );
    }

    getNfValueFormatPulldownSelection() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted') and contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'nf-MiddleRow') and contains(@class, 'nf-HasWidget')]//div[contains(@class, 'item') and contains(@class, 'selected')]`
        );
    }

    /** Extra configuration for Custom Number Format */
    getNfCondenseButton() {
        return this.$(`//div[contains(@class, 'mstrmojo-Button') and contains(@class, 'nf-condense')]`);
    }

    getNfCustomTextbox() {
        return this.$(`//input[contains(@class, 'mstrmojo-TextBox') and contains(@class, 'nf-custom')]`);
    }

    /** Pulldown to choose regarding negative values for Fixed, Currency, Percentage */
    getNfNegativePulldown() {
        return this.$(
            `//table[contains(@class, 'nf-HasWidget') and @style='display: table;']//div[contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'nf-NegativePullDown')]`
        );
    }

    /**
     * @param {*} form
     * @param {*} inRed boolean depending if it shows up as Red or Black in the pulldown
     */
    getNfNegativePopupListItem(form, inRed) {
        let path = `//div[contains(@class, 'mstrmojo-popupList-scrollBar') and contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class,'item ${
            inRed ? 'red' : ''
        }') and text()='${form}']`;
        return this.$(path);
    }

    get moreOptions() {
        return this.$(`//div[contains(@class, 'mstrmojo-MoreOptions-Editor')]`);
    }

    /**
     * @param {*} headerType row or column
     * @param {*} propertyName Merge, Show, Lock
     */
    getMoreOptionsHeaderProperty(headerType, propertyName) {
        // row header is first in DOM tree
        let index = headerType.toLowerCase() === 'row' ? 1 : 2;
        return this.moreOptions.$(`(.//span[text()='${propertyName}']/..)[${index}]`);
    }

    /**
     * @param {*} buttonName Save or Cancel
     */
    getMoreOptionsButton(buttonName) {
        return this.moreOptions.$(`.//div[contains(@class, 'mstrmojo-Button-text') and text()='${buttonName}']`);
    }

    get toolBox() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted')]/div[contains(@class, 'mstrmojo-ui-ToolbarPopup') and contains(@class, 'mstrmojo-ui-EditCharacter') and contains(@style, 'display: block')]`
        );
    }
}
