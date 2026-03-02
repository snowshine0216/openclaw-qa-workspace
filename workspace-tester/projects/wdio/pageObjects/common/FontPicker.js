import BaseComponent from '../base/BaseComponent.js';

const FONT_CONTAINER_LOCATOR = '.mstr-rc-font-selector__container';

export const FONTS = {
    ComicSansMS: 'Comic Sans MS',
    Arial: 'Arial',
    Helvetica: 'Helvetica',
    TimesNewRoman: 'Times New Roman',
    Verdana: 'Verdana',
    CourierNew: 'Courier New',
    Tahoma: 'Tahoma',
    MonotypeCorsiva: 'Monotype Corsiva',
    LucidaSansUnicode: 'Lucida Sans Unicode',
    NotoSans: 'Noto Sans',
    Inter: 'Inter',
    BigShoulders: 'BigShoulders',
    Batang: 'Batang',
    Roboto: 'Roboto',
};

export default class FontPicker extends BaseComponent {
    constructor(container) {
        super(container, FONT_CONTAINER_LOCATOR, 'Unified Font Picker');
    }

    getFontPicker() {
        return this.getElement();
    }

    getSearchInputBoxFromFontPicker() {
        return this.getFontPicker().$('.ant-select-selection-search input');
    }

    getFontUnavailableIcon() {
        return this.getFontPicker().$('.ant-select-selection-item svg');
    }

    getMissingFontTooltip() {
        return this.$('.mstr-rc-font-selector__popover .ant-popover-content');
    }

    getCurrentSelectionOfFontPicker() {
        return this.getFontPicker().$('.ant-select-selection-item');
    }

    getFontPickerDropdown() {
        return this.$('.ant-select-dropdown.mstr-rc-font-selector__dropdown');
    }

    getFontOptionInDropdown(fontName) {
        return this.getFontPickerDropdown().$(`.ant-select-item-option-content div[title='${fontName}']`);
    }

    // inner selector for *All Fonts* and *Export Ready Fonts*
    getInnerSelector() {
        return this.getFontPickerDropdown().$('.mstr-rc-font-selector__innerselect');
    }

    getInnerSelectorSelection() {
        return this.getInnerSelector().$('.ant-select-selection-item');
    }

    getInnerSelectorDropdown() {
        return this.$('.ant-select-dropdown.mstr-rc-font-selector__innerdropdown');
    }

    getInnerSelectorOptionInDropdown(optionName) {
        return this.getInnerSelectorDropdown().$(`div[title='${optionName}']`);
    }

    // action helper

    async selectFontByName(fontName) {
        await this.click({ elem: this.getFontPicker() });
        await this.input(fontName);
        await this.sleep(500); // wait for animation finished
        await this.waitForElementVisible(this.getFontPickerDropdown());
        const fontOption = this.getFontOptionInDropdown(fontName);
        await this.waitForElementVisible(fontOption);
        await this.click({ elem: fontOption });
        await this.waitForElementInvisible(this.getFontPickerDropdown());
    }

    async openFontPicker() {
        await this.click({ elem: this.getFontPicker() });
        await this.sleep(500); // wait for animation finished
        await this.waitForElementVisible(this.getFontPickerDropdown());
    }

    async clickWarningIcon() {
        await this.click({ elem: this.getFontUnavailableIcon() });
        await this.waitForElementVisible(this.getMissingFontTooltip());
    }

    // inner selector action helper

    /**
     * Having outer font picker dropdown open to switch between *All Fonts* and *Export Ready Fonts*
     * @param {*} optionName = 'All Fonts' | 'Export Ready Fonts'
     * @returns {Promise<void>}
     */
    async switchMode(optionName) {
        await this.click({ elem: this.getInnerSelector() });
        await this.waitForElementVisible(this.getInnerSelectorDropdown());
        const option = this.getInnerSelectorOptionInDropdown(optionName);
        await this.click({ elem: option });
        await this.waitForElementInvisible(this.getInnerSelectorDropdown());
    }

    // assertion helper

    async getCurrentSelectedFont() {
        const selectedFont = await this.getCurrentSelectionOfFontPicker().getText();
        return selectedFont;
    }

    async getCurrentInnerSelectorMode() {
        const selectedMode = await this.getInnerSelectorSelection().getText();
        return selectedMode;
    }
}
