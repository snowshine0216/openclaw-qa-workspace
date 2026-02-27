import BaseFormatPanel from '../authoring/BaseFormatPanel.js';
import Alert from '../common/Alert.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import DossierEditorUtility from './components/DossierEditorUtility.js';
import LoadingDialog from './components/LoadingDialog.js';
import { Key } from 'webdriverio';

export default class FormatPanel extends BaseFormatPanel {
    constructor() {
        super();
        this.alert = new Alert();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.loadingDialog = new LoadingDialog();
        this.dossierEditorUtility = new DossierEditorUtility();
    }

    // Element Locator
    getFormatPanelHeader() {
        return this.$('.mstrmojo-VIBoxPanelContainer .prp');
    }

    getFormatPanel() {
        return this.$(`//div[contains(@class,'selected') and contains(@class,'prp')]`);
    }

    getFormatDetail() {
        return this.$('.mstrmojo-VIBoxPanel.mstrmojo-vi-PropEditor.mstrmojo-scrollbar-host');
    }

    getFormatDetailTitle() {
        return this.getFormatDetail().$('.title-text');
    }

    getSegmentControlByIndex(index = 0) {
        return this.$$('.mstr-editor-segment-control')[index];
    }

    getSegmentControl() {
        return this.$$('.mstr-editor-segment-control');
    }

    getVizOptionTab() {
        return this.getSegmentControlByIndex().$('.ant-radio-group .segment-control-icons');
    }

    getTextAndFormTab() {
        return this.$('.text-format');
    }

    getTextAndFormContent() {
        return this.$('#reactFormatPanel .selector-layout.content');
    }

    getTitleAndContainerTab() {
        return this.$('.title-container');
    }

    getPositionAndSizeSection() {
        return this.$("//div[contains(@class,'position-and-size-layout')]");
    }

    getPositionAndSizeInputs() {
        return this.getPositionAndSizeSection().$$(
            ".//div[contains(@class,'element') and contains(@class,'input-with-stepper')]//input[contains(@class,'ant-input-number-input')]"
        );
    }

    getPositionXInput() {
        return this.getPositionAndSizeInputs()[0];
    }

    getPositionYInput() {
        return this.getPositionAndSizeInputs()[1];
    }

    getSizeWidthInput() {
        return this.getPositionAndSizeInputs()[2];
    }

    getSizeHeightInput() {
        return this.getPositionAndSizeInputs()[3];
    }
    getElementByXPath(xPath) {
        return this.$(xPath);
    }

    getDropdownTrigger(section) {
        return this.$$('.ant-dropdown-trigger').filter(async (elem) => {
            const className = await elem.getText();
            return className.includes(section);
        })[0];
    }

    getCheckboxItemByLabel(label) {
        return this.$$('.mstr-editor-checkbox').filter(async (elem) => {
            const text = await elem.getText();
            return text.includes(label);
        })[0];
    }

    getFontFamilyDropdown() {
        return this.$('.mstr-rc-font-selector');
    }

    getFontType(fontType) {
        return $$('.ant-select-item-option-content').filter(async (elem) => {
            const fontName = await elem.getText();
            return fontName.includes(fontType);
        })[0];
    }

    getFontStyle(index) {
        return this.$$('.mstr-editor-toggle')[index];
    }

    getFontSizeInput() {
        return this.$('.ant-input-number-input');
    }

    getColorPicker() {
        return this.$('.mstr-editor-color-picker');
    }

    getColorOption(index) {
        return this.$$('.color-cell')[index];
    }

    getHorizontalAlignmentButton(index) {
        return this.$$('.font-style-icons')[index];
    }

    getVerticalAlignmentButton(index) {
        return this.$$('.vertical-align-icons')[index];
    }
    getTitleAndContainerFormatOption() {
        return this.$('div[aria-label="Title and Container"]');
    }

    getVizFormatOption() {
        return this.$(`//div[@class="item prp" and .="Format"]`);
    }

    getPanelStackPadding() {
        return this.$('div.container-padding-input.element.input-with-stepper').$('input.ant-input-number-input');
    }

    getRadiusTextboxValue() {
        return this.$('.radius-input').$('.ant-input-number-input');
    }

    // Shadow index mapping
    static SHADOW_PROPERTIES = {
        Fill: 0,
        Blur: 1,
        Distance: 2,
        Angle: 3,
    };

    getShadowSection() {
        return this.$(`//span[text()="Shadow"]/ancestor::div[contains(@class,"container-shadow-section")]`);
    }

    getShadowFillColorBtn() {
        const shadowSection = this.getShadowSection();
        return shadowSection.$('.button-dropdown');
    }

    getShadowInputBoxByName(name) {
        const shadowSection = this.getShadowSection();
        const index = FormatPanel.SHADOW_PROPERTIES[name];
        const input = shadowSection.$$('.ant-input-number-input')[index];
        return input;
    }

    getShadowSliderByName(name) {
        const shadowSection = this.getShadowSection();
        const index = FormatPanel.SHADOW_PROPERTIES[name] - 1; // Slider index starts from 0 for Blur
        const sliderHandle = shadowSection.$$('.ant-slider-handle')[index];
        return sliderHandle;
    }

    getShadowSliderByIndex(index) {
        const shadowSection = this.getShadowSection();
        const sliderHandle = shadowSection.$$('.ant-slider-handle')[index];
        return sliderHandle;
    }

    getPaddingInput() {
        return this.$('//li[.//span[text()="Padding"]]//input[@class="ant-input-number-input"]');
    }

    getFreeFormLayoutBtn() {
        return this.$('.layout-icons.free-form-layout');
    }
    getAutoLayoutBtn() {
        return this.$('.layout-icons.auto-layout');
    }

    getSwitchFormatButton() {
        return this.$('.item.propertiesPanel');
    }

    getFormatPanelCloseButton() {
        return this.$(`//div[contains(@class,'mstrmojo-VIBoxPanelContainer-closeBtn')]`);
    }

    // Action Methods
    async switchToFormatPanel() {
        await this.waitForElementVisible(this.getFormatPanelHeader());
        await this.click({ elem: this.getFormatPanelHeader() });
        await this.waitForElementVisible(this.getFormatPanel());
        await this.dossierEditorUtility.clickToDismissPopups();
    }

    async enableFormatPanel() {
        const isFormatPanelEnabled = await this.getFormatPanelHeader().isDisplayed();
        if (!isFormatPanelEnabled) {
            await this.click({ elem: this.getSwitchFormatButton() });
            await this.waitForElementVisible(this.getFormatPanelHeader());
        }
    }

    async disableFormatPanel() {
        const isFormatPanelEnabled = await this.getFormatPanelHeader().isDisplayed();
        if (isFormatPanelEnabled) {
            await this.click({ elem: this.getSwitchFormatButton() });
            await this.waitForElementInvisible(this.getFormatPanelHeader());
        }
    }

    async switchToVizOptionTab() {
        await this.click({ elem: this.getVizOptionTab() });
    }

    async switchToTextAndFormTab() {
        await this.click({ elem: this.getTextAndFormTab() });
    }

    async switchToTitleAndContainerTab() {
        await this.click({ elem: this.getTitleAndContainerTab() });
        await this.dossierEditorUtility.clickToDismissPopups();
    }

    async setValueForPositionX(value) {
        let x = await this.getPositionXInput();
        await this.click({ elem: x });
        await this.typeKeyboard([[Key.Ctrl, 'a'], Key.Backspace]);
        await this.typeKeyboard(value);
        await this.typeKeyboard(Key.Enter);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openDropdown(section) {
        await this.click({ elem: this.getDropdownTrigger(section) });
        await this.waitForDynamicElementLoading();
    }

    async isCheckboxItemDisabled(label) {
        const checkbox = this.getCheckboxItemByLabel(label).$('.ant-checkbox');
        return this.isDisabled(checkbox);
    }

    async selectFontType(fontType) {
        await this.click({ elem: this.getFontFamilyDropdown() });
        await this.click({ elem: this.getFontType(fontType) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setFontStyle(index) {
        await this.click({ elem: this.getFontStyle(index) });
    }

    async setFontSize(value) {
        const input = await this.getFontSizeInput();
        await this.clear({ elem: input });
        await input.setValue(value);
        await this.enter();
    }

    async setFontColor(index) {
        await this.click({ elem: this.getColorPicker() });
        const colorOption = await this.getColorOption(index);
        await colorOption.waitForDisplayed({ timeout: 5000 });
        await colorOption.click();
        await this.switchToFormatPanel();
    }

    async setFontHorizontalAlignment(index) {
        await this.click({ elem: this.getHorizontalAlignmentButton(index) });
    }

    async setFontVerticalAlignment(index) {
        await this.click({ elem: this.getVerticalAlignmentButton(index) });
    }

    /**
     * Generic method to set a value in an input field
     * @param {Function} getInputFn Function that returns the input element
     * @param {string|number} value Value to set in the input
     */
    async setInputValue(getInputFn, value) {
        const input = await getInputFn();
        await input.click();

        // Select all and clear
        if (process.platform === 'darwin') {
            await browser.keys(['Meta', 'a']); // macOS
        } else {
            await browser.keys(['Control', 'a']); // Windows / Linux
        }
        await browser.keys('Backspace');

        await input.setValue(value.toString());
        await browser.keys('Enter');

        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async setPanelStackPaddingValue(value = 100) {
        await this.setInputValue(this.getPanelStackPadding.bind(this), value);
    }

    async setRadiusValue(value = 40) {
        await this.setInputValue(this.getRadiusTextboxValue.bind(this), value);
    }

    async setPaddingValue(value = 10) {
        await this.setInputValue(this.getPaddingInput.bind(this), value);
    }

    async setPositionXValue(value) {
        await this.setInputValue(this.getPositionXInput.bind(this), value);
    }

    async setPositionYValue(value) {
        await this.setInputValue(this.getPositionYInput.bind(this), value);
    }

    async setSizeWidthValue(value) {
        await this.setInputValue(this.getSizeWidthInput.bind(this), value);
    }

    async setSizeHeightValue(value) {
        await this.setInputValue(this.getSizeHeightInput.bind(this), value);
    }

    async openTitleContainerFormatPanel() {
        await this.click({ elem: this.getTitleAndContainerFormatOption() });
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async openVizFormatPanel() {
        await this.click({ elem: this.getVizFormatOption() });
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async openFormatPanel() {
        await this.click({ elem: this.getVizFormatOption() });
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async closeFormatPanel() {
        await this.click({ elem: this.getFormatPanelCloseButton() });
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async clickFreeFormLayout() {
        await (await this.getFreeFormLayoutBtn()).click();
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async clickAutoLayout() {
        await (await this.getAutoLayoutBtn()).click();
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async formatTitle() {
        return (await this.getFormatDetailTitle()).getText();
    }

    async getShadowFillColor() {
        const shadowSection = this.getShadowSection();
        const style = await shadowSection.$('.button-dropdown').getAttribute('style');
        if (!style) {
            return 'inherit';
        }
        const match = style.match(/background-color:\s*([^;]+);?/);
        return match ? match[1] : 'inherit';
    }

    async getShadowInputBoxValueByName(name) {
        const input = this.getShadowInputBoxByName(name);
        return await input.getValue();
    }

    async slideShadowSliderByName(name, x = 50, y = 0) {
        const index = FormatPanel.SHADOW_PROPERTIES[name] - 1; // Slider index starts from 0 for Blur
        const sliderHandle = await this.getShadowSliderByIndex(index);
        await sliderHandle.dragAndDrop({ x, y });
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async setShadowInputboxByName(name, value = 10) {
        const input = await this.getShadowInputBoxByName(name);
        await input.click();

        // Select all and clear
        if (process.platform === 'darwin') {
            await browser.keys(['Meta', 'a']); // macOS
        } else {
            await browser.keys(['Control', 'a']); // Windows / Linux
        }
        await browser.keys('Backspace');

        await input.setValue(value.toString());
        await browser.keys('Enter');

        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async clickShadowFillColorBtn() {
        await this.click({ elem: this.getShadowFillColorBtn() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // Page Level Color Picker Methods - color picker please DashboardFormattingPanel methods
    getPageLevelColorPickerButton() {
        return $('button[data-feature-id="authoring-page-level-color-picker-button"]');
    }

    getPageLevelColorPreview() {
        return this.getPageLevelColorPickerButton().$('.mstr-rc-3-color-picker__color-preview');
    }

    async clickPageLevelColorPicker() {
        const colorPicker = this.getPageLevelColorPickerButton();
        await this.waitForElementVisible(colorPicker);
        await colorPicker.click();
    }
}
