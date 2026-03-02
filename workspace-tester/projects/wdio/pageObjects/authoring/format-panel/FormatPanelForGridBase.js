import BasePage from '../../base/BasePage.js';
import LoadingDialog from '../../dossierEditor/components/LoadingDialog.js';
export default class FormatPanelForGridBase extends BasePage {
    //#region Element Locators
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
    }

    // Text Formatting Helpers

    /**
     * Retrieves the root node containing the various text format
     * elements. Used to avoid code duplication below.
     *
     * @readonly
     * @memberof FormatPanelForGridBase
     */
    get textFormatRoot() {
        // In case there are multiple font sections, only pull the first one
        // Other font sections should be handled separately
        return this.$(`//div[contains(@class, 'mstrmojo-ui-EditCharacter') and contains(@style,'display: block')]`);
    }

    /**
     * Retrieves the pulldown that opens the font menu.
     *
     * @readonly
     * @memberof FormatPanelForGridBase
     */
    get textFontsPulldown() {
        return this.textFormatRoot.$(`.//div[contains(@class, 'mstr-rc-font-selector__container')]`);
    }

    /**
     * Retrieves a specific font option within the font popup menu.
     *
     * @param {string} font Name of the font
     * @returns
     * @memberof FormatPanelForGridBase
     */
    getTextFontOption(font) {
        return this.$(
            `(//div[contains(@class, 'ant-select-item ant-select-item-option')]//div[text()='${font}'])[last()]`
        );
    }

    /**
     * Retrieves one of the font decoration elements (e.g. bold, italic, etc.)
     *
     * @param {string} decoration Class identifying the decorator
     * @returns
     * @memberof FormatPanelForGridBase
     */
    getTextFontDecoration(decoration) {
        return this.textFormatRoot.$(
            `.//div[contains(@class, 'mstrmojo-ListBase') and contains(@class, 'mstrmojo-ui-ButtonBar')]//div[contains(@class, 'item') and contains(@class, '${decoration}')]`
        );
    }

    get textFontBold() {
        return this.getTextFontDecoration('bold');
    }

    get textFontItalic() {
        return this.getTextFontDecoration('italic');
    }

    get textFontUnderline() {
        return this.getTextFontDecoration('underline');
    }

    get textFontStrikeout() {
        return this.getTextFontDecoration('strikeout');
    }

    // Note: Some font sections use a stepper, others use a pulldown
    /**
     * Retrieves the entire stepper for the font size. Not useable on its own,
     * this is the root node for other function calls.
     *
     * @readonly
     * @memberof FormatPanelForGridBase
     */
    get textFontSizeStepper() {
        return this.textFormatRoot.$(`.//div[contains(@class, 'mstrmojo-ui-ctrl-Stepper')]`);
    }

    /**
     * Retrieves the text of the font stepper.
     *
     * @readonly
     * @memberof FormatPanelForGridBase
     */
    get textFontSize() {
        return this.textFontSizeStepper.$(`.//div[contains(@class, 'text')]`);
    }

    /**
     * Retrieves the up arrow of the font stepper.
     *
     * @readonly
     * @memberof FormatPanelForGridBase
     */
    get textFontSizeStepUp() {
        return this.textFontSizeStepper.$(`.//div[contains(@class, 'next')]`);
    }

    /**
     * Retrieves the down arrow of the font stepper.
     *
     * @readonly
     * @memberof FormatPanelForGridBase
     */
    get textFontSizeStepDown() {
        return this.textFontSizeStepper.$(`.//div[contains(@class, 'prev')]`);
    }

    /**
     * Retrieves the input (text) box of the font size element.
     *
     * @readonly
     * @memberof FormatPanelForGridBase
     */
    get textFontSizeInput() {
        return this.textFormatRoot.$(
            `.//div[contains(@class, 'mstrmojo-ui-ComboBox') or contains(@class, 'mstrmojo-Stepper')]//input[contains(@class, 'mstrmojo-TextBox')]`
        );
    }

    /**
     * Retrieves the pulldown element of the font selection element.
     *
     * @readonly
     * @memberof FormatPanelForGridBase
     */
    get textFontSizePulldown() {
        return this.textFormatRoot.$(`.//div[contains(@class, 'mstrmojo-ui-ComboBox')]//div[contains(@class, 'btn')]`);
    }

    /**
     * Retrieves an individual font size option element within the pulldown popup.
     *
     * @readonly
     * @memberof FormatPanelForGridBase
     */
    getTextFontSizeOption(size) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted') and contains(@class, 'mstrmojo-ui-ComboBox') and not(contains(@style, 'display: none'))]//div[contains(@class, 'item') and text()='${size}']`
        );
    }

    get textFontColorButton() {
        return this.textFormatRoot.$(`.//div[contains(@class, 'mstrmojo-ColorPickerBtn')]`);
    }
    //#endregion Element Locators

    //#region Action Helpers
    // Text Formatting Actions

    async selectTextFont(font) {
        await this.click({ elem: this.textFontsPulldown });

        // Make sure the pulldown is open before continuing
        const elFontOption = this.getTextFontOption(font);
        await this.waitForElementVisible(elFontOption);
        await this.click({ elem: elFontOption });

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(60);
    }

    async selectTextFontBold() {
        await this.click({ elem: this.textFontBold });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTextFontItalic() {
        await this.click({ elem: this.textFontItalic });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTextFontUnderline() {
        await this.click({ elem: this.textFontUnderline });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTextFontStrikethrough() {
        await this.click({ elem: this.textFontStrikeout });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTextFontSizeStepUp() {
        await this.click({ elem: this.textFontSizeStepUp });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTextFontSizeStepDown() {
        await this.click({ elem: this.textFontSizeStepDown });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setTextFontSize(size) {
        const elFontSizeInput = await this.textFontSizeInput;
        await this.doubleClickOnElement(elFontSizeInput);
        await this.clear({elem: elFontSizeInput});
        await elFontSizeInput.addValue(size + '\n');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTextFontSize(size) {
        await this.click({ elem: this.textFontSizePulldown });

        // Make sure the pulldown is open before continuing
        const elSizeOption = this.getTextFontSizeOption(size);
        await this.waitForElementVisible(elSizeOption);
        await this.click({ elem: elSizeOption });

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTextFontColorButton() {
        await this.click({ elem: this.textFontColorButton });
    }

    //#endregion Action Helpers
}
