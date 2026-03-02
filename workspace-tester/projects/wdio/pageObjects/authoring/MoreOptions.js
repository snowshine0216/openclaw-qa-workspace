import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';

/**
 * Page representing More Options
 */

class MoreOptionsDialog extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
    }
    //Element Locators

    /**
     * get options for Row Headers in More Options dialog
     * @param {String} Option
     */
    getOptionsForRowsHeader(Option) {
        return $(
            `//div[contains(@class, 'mstrmojo-MoreOptions-Editor')]//div[contains(@class, 'headers')]//div[@class='mstrmojo-vi-TwoColumnProp'][1]//span[text()='${Option}']`
        );
    }

    /**
     * get options for Column Headers in More Options dialog
     * @param {String} Option
     */
    getOptionsForColumnsHeader(Option) {
        return $(
            `//div[contains(@class, 'mstrmojo-MoreOptions-Editor')]//div[contains(@class, 'headers')]//div[@class='mstrmojo-vi-TwoColumnProp'][2]//span[text()='${Option}']`
        );
    }

    /**
     * get Save button for More Options dialog
     */
    getSaveButtonInMoreOptionsDialog() {
        return $(`//div[contains(@class, 'mstr-moreOptions-buttonBar')]//button[@aria-label='Save']`);
    }

    /**
     * get join behavior dropdown menu
     */
    getJoinBehaviorDropDownMenu() {
        return $(
            `//div[contains(@class, 'mstrmojo-MoreOptions-Editor')]//div[contains(@class, 'joinbehavior')]//div[contains(@class, 'mstrmojo-ui-Pulldown-text')]`
        );
    }

    /**
     * get join behavior options
     * @param {String} optionName
     */
    getJoinBehaviorOptions(optionName) {
        return $(
            `//div[contains(@class, 'mstrmojo-MoreOptions-Editor')]//div[contains(@class, 'joinbehavior')]//div[contains(@class, 'mstrmojo-PopupList ')]//div[text()='${optionName}']`
        );
    }

    /**
     * get cartesian join warning button: executing cartesian join is not recommended
     */
    getCartesianJoinWarningButton() {
        return $(
            `//div[contains(@class, 'mstrmojo-MoreOptions-Editor')]//div[contains(@class, 'joinbehavior')]//div[contains(@class, 'warningTooltipBtn')]`
        );
    }

    getCurrentAttributeDisplayFormMode() {
        return $(
            `//div[contains(@class,'mstr-moreOptions-label') and text()='Show attribute form names:']/ancestor::div[contains(@class,'mstr-moreOptions-col2-box')]//div[contains(@class,'mstr-moreOptions-select')]//input`
        );
    }

    getAttributeDisplayFormModeFromPullDown(formMode) {
        return $(
            `//div[contains(@class,'mstr-rc-base-dropdown--single')]//div[contains(@class,'mstr-moreOptions-select-dropdown__option')]//span[contains(@class,'ellipsis-overflow') and text()='${formMode}']`
        );
    }

    getCurrentHideMetricNullZerosSetting() {
        return $(
            `//div[contains(@class,'mstr-moreOptions-label') and text()='Hide metric nulls and zeros']/ancestor::div[contains(@class,'mstr-moreOptions-col2-box')]//div[contains(@class,'mstr-moreOptions-select')]//input`
        );
    }

    getHideShowNullZerosOptionsFromPullDown(Option) {
        return $(
            `//div[contains(@class,'mstr-rc-base-dropdown--single')]//div[contains(@class,'mstr-moreOptions-select-dropdown__option')]//span[contains(@class,'ellipsis-overflow') and text()='${Option}']`
        );
    }

    getFilteringModePullDown() {
        return $(
            `//div[text()='Filtering']//parent::div[@class='vi-col1']//following-sibling::div[@class='vi-col2']//div[@class='mstrmojo-ui-Pulldown']`
        );
    }

    getFilteringModeFromPullDown(filteringMode) {
        return $(
            `//div[text()='Filtering']//parent::div[@class='vi-col1']//following-sibling::div[@class='vi-col2']//div[contains(@class,'popupList')]//div[text()='${filteringMode}']`
        );
    }

    getMoreOptionsDialog() {
        return $('#mstrmojo-more-options-editor .mstrmojo-MoreOptions-Editor');
    }

    //Functions

    /**
     * toggle options for Row Headers in More Options dialog
     * @param {String} Option
     * Options: Show/Merge/Lock
     */
    async toggleOptionsForRowsHeader(Option) {
        await (await this.getOptionsForRowsHeader(Option)).click();
    }

    /**
     * toggle options for Column Headers in More Options dialog
     * @param {String} Option
     * Options: Show/Merge/Lock
     */
    async toggleOptionsForColumnsHeader(Option) {
        await (await this.getOptionsForColumnsHeader(Option)).click();
    }

    /**
     * save and close More Options dialog
     */
    async saveAndCloseMoreOptionsDialog() {
        await (await this.getSaveButtonInMoreOptionsDialog()).click();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Select form mode from the display attribute form mode popup list
     * @param {String} formMode
     */
    async selectDisplayAttributeFormMode(formMode) {
        await (await this.getCurrentAttributeDisplayFormMode()).click();
        await (await this.getAttributeDisplayFormModeFromPullDown(formMode)).click();
    }

    /**
     * Select the option for Hide metric nulls and zeros from the pulldown list
     * @param {String} Option
     */
    async selectHideShowNullZerosOption(Option) {
        await (await this.getCurrentHideMetricNullZerosSetting()).click();
        await (await this.getHideShowNullZerosOptionsFromPullDown(Option)).click();
    }

    async changeFilteringMode(filteringMode) {
        await (await this.getFilteringModePullDown()).click();
        await (await this.getFilteringModeFromPullDown(filteringMode)).click();
    }

    /**
     * Set "rows per page" value
     * @param {string} value
     */
    async resetRowsPerPage(value) {
        const text = await $("//div[contains(@class,'incrementalfetch')]//input[contains(@class, 'mstrmojo-TextBox')]");
        await text.clearValue();
        await text.setValue(value);
    }
}

export default MoreOptionsDialog;
