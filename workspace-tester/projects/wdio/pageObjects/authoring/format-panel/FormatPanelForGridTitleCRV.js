import BasePage from '../../base/BasePage.js';
import LoadingDialog from '../../dossierEditor/components/LoadingDialog.js';

export default class FormatPanelForGridTitleCRV extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
    }

    getTextAlignOption(option) {
        return this.$(`//div[contains(@class, 'font-style-icons') and contains(@class,'${option}')]`);
    }

    getCellAlignOption(option) {
        return this.$(`//div[contains(@class, 'vertical-align-icons') and contains(@class,'${option}')]`);
    }

    get backgroundFillColorButton() {
        return this.$(`(//div[contains(@class, 'color-picker-arrow-button')])[2]`);
    }

    get horizontalLinesStyleButton() {
        return this.$(`//div[contains(@class, 'mstr-select-container__bordered')]`);
    }

    get horizontalLinesColorButton() {
        return this.$(`(//div[contains(@class, 'color-picker-arrow-button')])[3]`);
    }

    get verticalLinesStyleButton() {
        return this.$(`//div[contains(@class, 'mstr-select-container__bordered')]`);
    }

    get verticalLinesColorButton() {
        return this.$(`(//div[contains(@class, 'color-picker-arrow-button')])[3]`);
    }

    getLineStyleOption(option) {
        return this.$(
            `//div[contains(@class, 'ant-select-dropdown')]//div[@class = 'ant-select-item-option-content' and descendant::span[text() = '${option}']]`
        );
    }

    get wrapTextCheckbox() {
        return this.$(`//label[contains(@class, 'ant-checkbox-wrapper')]`);
    }

    get subtotalSameAsCheckbox() {
        return this.$(`//span/p[text()='Same as Row Headers']`);
    }

    get subtotalSameAsIsChecked() {
        return this.$(
            `//div[@class='mstr-editor-checkbox']//span[contains(@class,'ant-checkbox-checked')  and following-sibling::span/p[contains(text(),'Same as')]]`
        );
    }

    get subtotalTextFormatRoot() {
        return this.$(`//div[contains(@class, 'mstrmojo-ui-EditCharacter') and position()=3]`);
    }

    get subtotalTextFontsPulldown() {
        return this.subtotalTextFormatRoot.$(
            `.//div[contains(@class, 'mstrmojo-ui-Pulldown') and not(contains(@class, 'mstrmojo-ui-Pulldown-text'))]`
        );
    }

    get textFontColorButton() {
        return this.subtotalTextFormatRoot.$(`.//div[contains(@class, 'mstrmojo-ColorPickerBtn')]`);
    }

    getSubtotalTextFontDecoration(decoration) {
        return this.subtotalTextFormatRoot.$(
            `.//div[contains(@class, 'mstrmojo-ListBase') and contains(@class, 'mstrmojo-ui-ButtonBar')]//div[contains(@class, 'item') and contains(@class, '${decoration}')]`
        );
    }

    get subtotalTextFontBold() {
        return this.getSubtotalTextFontDecoration('bold');
    }

    get subtotalTextFontItalic() {
        return this.getSubtotalTextFontDecoration('italic');
    }

    get subtotalTextFontUnderline() {
        return this.getSubtotalTextFontDecoration('underline');
    }

    get subtotalTextFontStrikeout() {
        return this.getSubtotalTextFontDecoration('strikeout');
    }

    get subtotalTextFontSizeInput() {
        return this.subtotalTextFormatRoot.$(
            `.//div[contains(@class, 'mstrmojo-ui-ComboBox')]//input[contains(@class, 'mstrmojo-TextBox')]`
        );
    }

    get subtotalTextFontSizePulldown() {
        return this.subtotalTextFormatRoot.$(
            `.//div[contains(@class, 'mstrmojo-ui-ComboBox')]//div[contains(@class, 'btn')]`
        );
    }

    get subtotalTextFontColorButton() {
        return this.subtotalTextFormatRoot.$(`.//div[contains(@class, 'mstrmojo-ColorPickerBtn')]`);
    }

    getSubtotalTextAlignOption(option) {
        return this.$(`(//div[contains(@class, 'txtAlign')])[2]//div[contains(@class, '${option}')]`);
    }

    getSubtotalCellAlignOption(option) {
        return this.$(`(//div[contains(@class, 'cellAlign')])[2]//div[contains(@class, '${option}')]`);
    }

    get subtotalBackgroundFillColorButton() {
        return this.$(`(//div[contains(@class, 'mstrmojo-ColorPickerBtn')])[6]`);
    }

    get subtotalHorizontalLinesStyleButton() {
        return this.$(`(//div[contains(@class, 'mstrmojo-ui-LineStyle')])[3]//div[contains(@class, 'btn')]`);
    }

    get subtotalHorizontalLinesColorButton() {
        return this.$(`(//div[contains(@class, 'mstrmojo-ColorPickerBtn')])[7]`);
    }

    get subtotalVerticalLinesStyleButton() {
        return this.$(`(//div[contains(@class, 'mstrmojo-ui-LineStyle')])[4]//div[contains(@class, 'btn')]`);
    }

    get subtotalVerticalLinesColorButton() {
        return this.$(`(//div[contains(@class, 'mstrmojo-ColorPickerBtn')])[8]`);
    }

    get subtotalWrapTextCheckbox() {
        return this.$(`(//div[contains(@class, 'checkLabel')])[2]//div[contains(@class, 'mstrmojo-Label')]`);
    }

    async selectTextAlign(align) {
        await this.click({ elem: this.getTextAlignOption(align) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectCellAlign(align) {
        await this.click({ elem: this.getCellAlignOption(align) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectBackgroundFillColorButton() {
        await this.click({ elem: this.backgroundFillColorButton });
    }

    async selectHorizontalLinesStyleButton() {
        await this.click({ elem: this.horizontalLinesStyleButton });
    }

    async selectVerticalLinesStyleButton() {
        await this.click({ elem: this.verticalLinesStyleButton });
    }

    async selectLineStyle(style) {
        if (style === 'None') {
            style = '';
        }
        const elStyleOption = this.getLineStyleOption(style);
        await this.waitForElementVisible(elStyleOption);
        await this.click({ elem: elStyleOption });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectHorizontalLinesColorButton() {
        await this.click({ elem: this.horizontalLinesColorButton });
    }

    async selectVerticalLinesColorButton() {
        await this.click({ elem: this.verticalLinesColorButton });
    }

    async selectWrapTextCheckbox() {
        await this.click({ elem: this.wrapTextCheckbox });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectSubtotalSameAs() {
        await this.click({ elem: this.subtotalSameAsCheckbox });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectSubtotalTextFont(font) {
        await this.click({ elem: this.subtotalTextFontsPulldown });
        const elFontOption = this.getTextFontOption(font);
        await this.waitForElementVisible(elFontOption);
        await this.click({ elem: elFontOption });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectSubtotalTextFontBold() {
        await this.click({ elem: this.subtotalTextFontBold });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectSubtotalTextFontItalic() {
        await this.click({ elem: this.subtotalTextFontItalic });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectSubtotalTextFontUnderline() {
        await this.click({ elem: this.subtotalTextFontUnderline });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectSubtotalTextFontStrikethrough() {
        await this.click({ elem: this.subtotalTextFontStrikeout });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setSubtotalTextFontSize() {
        const elFontSizeInput = this.subtotalTextFontSizeInput;
        await this.doubleClickOnElement(elFontSizeInput);
        await this.enter();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectSubtotalTextFontSize(size) {
        await this.click({ elem: this.subtotalTextFontSizePulldown });
        const elSizeOption = this.getTextFontSizeOption(size);
        await this.waitForElementVisible(elSizeOption);
        await this.click({ elem: elSizeOption });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectSubtotalTextFontColorButton() {
        await this.click({ elem: this.subtotalTextFontColorButton });
    }

    async selectSubtotalTextAlign(align) {
        await this.click({ elem: this.getSubtotalTextAlignOption(align) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectSubtotalCellAlign(align) {
        await this.click({ elem: this.getSubtotalCellAlignOption(align) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectSubtotalBackgroundFillColorButton() {
        await this.click({ elem: this.subtotalBackgroundFillColorButton });
    }

    async selectSubtotalHorizontalLinesStyleButton() {
        await this.click({ elem: this.subtotalHorizontalLinesStyleButton });
    }

    async selectSubtotalVerticalLinesStyleButton() {
        await this.click({ elem: this.subtotalVerticalLinesStyleButton });
    }

    async selectSubtotalHorizontalLinesColorButton() {
        await this.click({ elem: this.subtotalHorizontalLinesColorButton });
    }

    async selectSubtotalVerticalLinesColorButton() {
        await this.click({ elem: this.subtotalVerticalLinesColorButton });
    }

    async selectSubtotalWrapTextCheckbox() {
        await this.click({ elem: this.subtotalWrapTextCheckbox });
    }

    async isSubtotalSameAsCheckboxChecked() {
        return this.subtotalSameAsIsChecked.isDisplayed();
    }
}
