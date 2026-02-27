import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import Common from './Common.js';

export const OptimizedForOptions = Object.freeze({
    SCREEN_4_3: 'Screen 4:3 (1024x768)',
    SCREEN_16_9: 'Screen 16:9 (1920x1080)',
    SCREEN_16_10: 'Screen 16:10 (1280x800)',
    WIDESCREEN: 'Widescreen (1366x768)',
    IPAD_IPAD_AIR_11: 'iPad & iPad Air 11-in.',
    IPAD_MINI: 'iPad Mini',
    IPAD_AIR_13: 'iPad Air 13-in.',
    IPAD_PRO_11: 'iPad Pro 11-in.',
    IPAD_PRO_13: 'iPad Pro 13-in.',
    CUSTOM: 'Custom',
    AUTOMATIC: 'Automatic',
    CUSTOM_IN_PAGE_SIZE: 'Custom...',
});

export const ConsumptionViewOptions = Object.freeze({
    FIT_TO_VIEW: 'Fit to View',
    FILL_THE_VIEW: 'Fill the View',
    ZOOM_TO_100_PERCENTAGE: 'Zoom to 100%',
});

/**
 * Class represing the Panel Stack
 * @extends BasePage
 */
export default class DashboardFormattingPanel extends DossierAuthoringPage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
    }

    getFormatButton() {
        return this.$('.item.mb.style');
    }

    getDashboardFormattingButton() {
        return this.$('.item.dashboardStyles.mstrmojo-ui-Menu-item');
    }

    getDashboardFormatPanel() {
        return this.$('.mstrmojo-Editor.DashboardStyles');
    }

    // Background color methods
    getBackgroundSection() {
        return this.$('.mstrmojo-Box.bg.ctrl-group');
    }

    getBackgroundColorPicker() {
        return this.getBackgroundSection().$('.mstrmojo-ui-PreviewButton.mstrmojo-ColorPickerBtn');
    }

    // for lock page size checkbox and helper icon in Dashboard Formatting panel
    getCurrentSelectionByName(name) {
        return this.$(
            `//div[contains(@class,'mstrmojo-Label') and text()='${name}']/parent::div//following-sibling::div//div[contains(@class,'mstrmojo-ui-Pulldown-text')]`
        );
    }

    getDashboardFormattingPopUp() {
        return this.$('.mstrmojo-Editor.DashboardStyles.modal');
    }

    getLockPageSizeCheckBox() {
        return this.$('.mstrmojo-CheckBox.pageSize');
    }

    getLockPageSizeHelperIcon() {
        return this.$('.mstrmojo-Box.helpIcon');
    }

    getScrollableArea() {
        return this.$('.mstrmojo-Box.mstrmojo-vi-EditorGroup.ctrl-group');
    }

    getLayoutStyleSection() {
        return this.$('.mstrmojo-ui-CheckList.layoutstyle.horizontal.radio');
    }

    getCardOption() {
        return this.getLayoutStyleSection().$('.item.card');
    }

    getFlatOption() {
        return this.getLayoutStyleSection().$('.item.basic');
    }

    getRadiusSection() {
        return this.$(
            '//div[contains(@class,"radius-spacing-setting") and contains(@class,"ctrl-group")]//div[@aria-label="Radius"]/..'
        );
    }

    getShadowFillSection() {
        return this.$('.shadow-fill-setting');
    }

    getShadowBlurSection() {
        return this.$('.shadow-size-setting');
    }

    getShadowDistanceSection() {
        return this.$('.shadow-distance-setting');
    }

    getShadowAngleSection() {
        return this.$('.shadow-angle-setting');
    }

    getRadiusTextInput() {
        return this.getRadiusSection().$('.mstrmojo-TextBox.right.right-alignment');
    }

    getRadiusSlider() {
        return this.getRadiusSection().$('.mstrmojo-VISlider.mstrmojo-Slider');
    }

    getShadowColorPicker() {
        return this.getShadowFillSection().$('.mstrmojo-ui-PreviewButton.mstrmojo-ColorPickerBtn');
    }

    getShadowFillTextInput() {
        return this.getShadowFillSection().$('.mstrmojo-TextBox.right.center-alignment');
    }

    getShadowColorList() {
        return this.getShadowFillSection().$('.mstrmojo-ui-AdvColorPicker .mstrmojo-ui-ColorList');
    }

    getPopupColorPicker() {
        return this.$('.mstrmojo-popup-widget-hosted.mstrmojo-ui-PreviewButton.mstrmojo-ColorPickerBtn');
    }

    getPopupColorPickerDropdown() {
        return this.$('.mstrmojo-ui-AdvColorPicker.mstrmojo-ui-AdvColorPickerPopup[style*="display: block"]');
    }

    getPopupColorList() {
        return $('.mstrmojo-popup-widget-hosted.mstrmojo-ColorPickerBtn .mstrmojo-ColorGrid-colorList');
    }

    getPopupColorItemByTitle(title) {
        const popupSelector = '.mstrmojo-popup-widget-hosted.mstrmojo-ColorPickerBtn';
        const itemSelector = `.mstrmojo-colorlist-item[title="${title}"]`;
        return $(popupSelector).$(itemSelector);
    }

    getPopupColorItemByIndex(index) {
        return $('.mstrmojo-popup-widget-hosted.mstrmojo-ColorPickerBtn').$$(`.mstrmojo-colorlist-item`)[index];
    }

    getShadowBlurSlider() {
        return this.getShadowBlurSection().$('.mstrmojo-VISlider.mstrmojo-Slider');
    }

    getShadowBlurTextInput() {
        return this.getShadowBlurSection().$('.mstrmojo-TextBox.right.right-alignment');
    }

    getShadowDistanceSlider() {
        return this.getShadowDistanceSection().$('.mstrmojo-VISlider.mstrmojo-Slider');
    }

    getShadowDistanceTextInput() {
        return this.getShadowDistanceSection().$('.mstrmojo-TextBox.right.right-alignment');
    }

    getShadowAngleSlider() {
        return this.getShadowAngleSection().$('.mstrmojo-VISlider.mstrmojo-Slider');
    }

    getShadowAngleTextInput() {
        return this.getShadowAngleSection().$('.mstrmojo-TextBox.right.right-alignment');
    }

    async openFormatMenu() {
        await this.click({ elem: this.getFormatButton() });
    }

    async openDashboardFormattingMenu() {
        await this.click({ elem: this.getDashboardFormattingButton() });
    }

    async open() {
        await this.waitForElementVisible(this.getFormatButton());
        await this.openFormatMenu();
        await this.openDashboardFormattingMenu();
    }

    async close() {
        const closeButton = await $('[tooltip="Close"]');
        if (await closeButton.isDisplayed()) {
            await closeButton.click();
        }
    }

    // OK Button methods
    getOkButton() {
        return this.$('.mstrmojo-Button-text=OK').parentElement();
    }

    async clickOkButton() {
        const okButton = this.getOkButton();
        await okButton.waitForDisplayed({ timeout: 5000 });
        await okButton.waitForClickable({ timeout: 5000 });
        await okButton.click();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickCardOption() {
        const cardOption = this.getCardOption();
        await this.waitForElementVisible(cardOption);
        await this.click({ elem: cardOption });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickFlatOption() {
        const flatOption = this.getFlatOption();
        await this.waitForElementVisible(flatOption);
        await this.click({ elem: flatOption });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectLayoutStyle(style) {
        switch (style.toLowerCase()) {
            case 'card':
                await this.clickCardOption();
                break;
            case 'flat':
            case 'basic':
                await this.clickFlatOption();
                break;
            default:
                throw new Error(`Unknown layout style: ${style}. Use 'card' or 'flat'`);
        }
    }

    async getSelectedLayoutStyle() {
        const layoutSection = this.getLayoutStyleSection();
        const selectedItem = layoutSection.$('.item.selected');
        const textElement = selectedItem.$('.text');
        return await textElement.getText();
    }

    async isCardSelected() {
        const cardOption = this.getCardOption();
        const classNames = await cardOption.getAttribute('class');
        return classNames.includes('selected');
    }

    async isFlatSelected() {
        const flatOption = this.getFlatOption();
        const classNames = await flatOption.getAttribute('class');
        return classNames.includes('selected');
    }

    // Padding methods
    getPaddingSection() {
        return this.$('.radius-spacing-setting .mstrmojo-vi-TwoColumnProp');
    }

    getPaddingTextInput() {
        return this.getPaddingSection().$('.mstrmojo-TextBox.right.right-alignment');
    }

    async getPaddingValue() {
        const input = this.getPaddingTextInput();
        return await input.getValue();
    }

    async setPaddingValue(value) {
        const input = this.getPaddingTextInput();
        await input.clearValue();
        await input.setValue(value);
        await browser.keys('Tab'); // Trigger change event
    }

    async getBackgroundColor() {
        const colorPicker = this.getBackgroundColorPicker();
        const preview = colorPicker.$('.preview');
        const style = await preview.getAttribute('style');
        const colorMatch = style.match(/background-color:\s*([^;]+)/);
        return colorMatch ? colorMatch[1].trim() : null;
    }

    async setBackgroundColor(colorName) {
        const colorPicker = this.getBackgroundColorPicker();
        await colorPicker.click();

        const colorList = this.$('.mstrmojo-ui-AdvColorPicker .mstrmojo-ui-ColorList');
        await colorList.waitForDisplayed({ timeout: 5000 });

        const colorItem = colorList.$(`[title="${colorName}"]`);
        await colorItem.click();

        // Click outside to close the color picker
        await this.getScrollableArea().click();
    }

    async clickLockPageSizeCheckBox() {
        await this.waitForElementVisible(this.getLockPageSizeCheckBox());
        await this.click({ elem: this.getLockPageSizeCheckBox() });
    }

    async clickLockPageSizeHelperIcon() {
        await this.waitForElementVisible(this.getLockPageSizeHelperIcon());
        await this.click({ elem: this.getLockPageSizeHelperIcon() });
    }

    async scrollUpInLeftBox() {
        const scrollableArea = this.getScrollableArea();
        await this.waitForElementVisible(scrollableArea);
        await scrollableArea.execute(function () {
            this.scrollTop -= 100; // Scroll up by 100 pixels
        });
    }

    async scrollToShadowAngleSetting() {
        const scrollableArea = this.getScrollableArea();
        const angleSection = this.getShadowAngleSection();
        await this.waitForElementVisible(scrollableArea);
        await angleSection.scrollIntoView({ block: 'start', inline: 'nearest' });
        await browser.pause(500);
    }

    async scrollBackToTop() {
        const scrollableArea = this.getScrollableArea();
        const flatSection = this.getFlatOption();
        await this.waitForElementVisible(scrollableArea);
        await flatSection.scrollIntoView({ block: 'start', inline: 'nearest' });
        await browser.pause(500);
    }

    async scrollToShadowSection(sectionType = 'angle') {
        const scrollableArea = this.getScrollableArea();
        let targetSection;

        switch (sectionType.toLowerCase()) {
            case 'fill':
                targetSection = this.getShadowFillSection();
                break;
            case 'blur':
                targetSection = this.getShadowBlurSection();
                break;
            case 'distance':
                targetSection = this.getShadowDistanceSection();
                break;
            case 'angle':
                targetSection = this.getShadowAngleSection();
                break;
            default:
                targetSection = this.getShadowAngleSection();
        }

        await this.waitForElementVisible(scrollableArea);
        //await this.waitForElementVisible(targetSection);

        // Scroll the target section into view - use 'start' for last items like angle
        const scrollPosition = sectionType.toLowerCase() === 'angle' ? 'start' : 'center';
        await targetSection.scrollIntoView({ block: scrollPosition, inline: 'nearest' });
        await browser.pause(500);
    }

    async clearInputValue() {
        // Clear existing value
        if (process.platform === 'darwin') {
            await browser.keys(['Meta', 'a']); // macOS
        } else {
            await browser.keys(['Control', 'a']); // Windows / Linux
        }
        await browser.keys('Backspace');
    }

    async getRadiusValue() {
        const radiusInput = this.getRadiusTextInput();
        return await radiusInput.getValue();
    }

    async setRadiusValue(value) {
        const radiusInput = this.getRadiusTextInput();
        await radiusInput.click();
        await this.clearInputValue();
        await radiusInput.setValue(value.toString());
        await browser.keys('Enter');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async getRadiusSliderPosition() {
        const slider = this.getRadiusSlider();
        const sliderHandle = slider.$('.t3');
        const style = await sliderHandle.getAttribute('style');
        const leftMatch = style.match(/left:\s*(\d+)px/);
        return leftMatch ? parseInt(leftMatch[1]) : 0;
    }

    async slideRadiusSlider(xOffset = 10) {
        const slider = this.getRadiusSlider();
        const sliderHandle = slider.$('.t3');
        await this.waitForElementVisible(sliderHandle);
        await sliderHandle.dragAndDrop({ x: xOffset, y: 0 });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async getShadowFillValue() {
        const shadowInput = this.getShadowFillTextInput();
        return await shadowInput.getValue();
    }

    async setShadowFillCapacityValue(value) {
        const shadowInput = this.getShadowFillTextInput();
        await shadowInput.click();
        await this.clearInputValue();
        await shadowInput.setValue(value.toString());
        await browser.keys('Enter');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickShadowColorPicker() {
        const colorPicker = this.getShadowColorPicker();
        await colorPicker.click();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectShadowColorByName(colorName) {
        await this.clickShadowColorPicker();
        const colorPickers = await $$('div.mstrmojo-ui-AdvColorPickerPopup');
        let visiblePicker = null;

        for (const picker of colorPickers) {
            if (await picker.isDisplayed()) {
                visiblePicker = picker;
                break;
            }
        }

        if (!visiblePicker) {
            throw new Error('No visible color picker popup found');
        }

        const colorElement = await visiblePicker.$(`.item[title="${colorName}"]`);
        await colorElement.waitForDisplayed({ timeout: 5000 });
        try {
            await colorElement.waitForClickable({ timeout: 3000 });
            await colorElement.click();
        } catch (err) {
            console.warn(`⚠️ Normal click failed for "${colorName}", using JS click`);
            await browser.execute((el) => el.click(), await colorElement);
        }

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async isPopupColorPickerVisible() {
        try {
            const popup = this.getPopupColorPickerDropdown();
            return await popup.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async closePopupColorPicker() {
        if (await this.isPopupColorPickerVisible()) {
            // Click outside to close
            await this.getScrollableArea().click();
            await browser.pause(500);
        }
    }

    async getShadowSelectedColor() {
        const colorPicker = this.getShadowColorPicker();
        const previewDiv = colorPicker.$('.preview');
        const style = await previewDiv.getAttribute('style');
        const colorMatch = style.match(/background-color:\s*([^;]+)/);
        return colorMatch ? colorMatch[1].trim() : null;
    }

    async getShadowFillColor() {
        return await this.getShadowSelectedColor();
    }

    // Alternative method to get shadow fill color with more detailed parsing
    async getShadowFillColorDetails() {
        const colorPicker = this.getShadowColorPicker();
        const previewDiv = colorPicker.$('.preview');
        const style = await previewDiv.getAttribute('style');

        // Parse RGB color
        const rgbMatch = style.match(/background-color:\s*rgb\(([^)]+)\)/);
        if (rgbMatch) {
            const [r, g, b] = rgbMatch[1].split(',').map((s) => s.trim());
            return {
                rgb: `rgb(${r}, ${g}, ${b})`,
                values: { r: parseInt(r), g: parseInt(g), b: parseInt(b) },
            };
        }

        // Parse hex color
        const hexMatch = style.match(/background-color:\s*(#[a-fA-F0-9]{6})/);
        if (hexMatch) {
            return {
                hex: hexMatch[1],
                rgb: this.hexToRgb(hexMatch[1]),
            };
        }
        return { raw: style };
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    }

    async getShadowBlurValue() {
        const blurInput = this.getShadowBlurTextInput();
        return await blurInput.getValue();
    }

    async setShadowBlurValue(value) {
        const blurInput = this.getShadowBlurTextInput();
        await blurInput.click();
        await this.clearInputValue();
        await blurInput.setValue(value.toString());
        await browser.keys('Enter');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async getShadowBlurSliderPosition() {
        const sliderHandle = this.getShadowBlurSlider();
        const style = await sliderHandle.getAttribute('style');
        const leftMatch = style.match(/left:\s*(\d+)px/);
        return leftMatch ? parseInt(leftMatch[1]) : 0;
    }

    async slideShadowBlurSlider(xOffset = 10) {
        const sliderHandle = this.getShadowBlurSlider();
        await this.waitForElementVisible(sliderHandle);
        await sliderHandle.dragAndDrop({ x: xOffset, y: 0 });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async getShadowDistanceValue() {
        const distanceInput = this.getShadowDistanceTextInput();
        return await distanceInput.getValue();
    }

    async setShadowDistanceValue(value) {
        const distanceInput = this.getShadowDistanceTextInput();
        await distanceInput.click();

        await this.clearInputValue();

        // Set new value
        await distanceInput.setValue(value.toString());
        await browser.keys('Enter');

        // Wait for any loading to complete
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async getShadowDistanceSliderPosition() {
        const sliderHandle = this.getShadowDistanceSlider();
        const style = await sliderHandle.getAttribute('style');
        const leftMatch = style.match(/left:\s*(\d+)px/);
        return leftMatch ? parseInt(leftMatch[1]) : 0;
    }

    async slideShadowDistanceSlider(xOffset = 10) {
        const sliderHandle = this.getShadowDistanceSlider();
        await this.waitForElementVisible(sliderHandle);
        await sliderHandle.dragAndDrop({ x: xOffset, y: 0 });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async getShadowAngleValue() {
        const angleInput = this.getShadowAngleTextInput();
        return await angleInput.getValue();
    }

    async setShadowAngleValue(value) {
        const angleInput = this.getShadowAngleTextInput();
        await angleInput.click();
        await this.clearInputValue();
        await angleInput.setValue(value.toString());
        await browser.keys('Enter');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async getShadowAngleSliderPosition() {
        const sliderHandle = this.getShadowAngleSlider();
        const style = await sliderHandle.getAttribute('style');
        const leftMatch = style.match(/left:\s*(\d+)px/);
        return leftMatch ? parseInt(leftMatch[1]) : 0;
    }

    async slideShadowAngleSlider(xOffset = 10) {
        const sliderHandle = this.getShadowAngleSlider();
        await this.waitForElementVisible(sliderHandle);
        await sliderHandle.dragAndDrop({ x: xOffset, y: 0 });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // New React component style color picker for background color
    getRootPanelBgColorPicker() {
        return this.$('.mstr-rc-3-color-picker.root-panel-bg-color-picker-rc3');
    }

    getRootPanelBgColorPickerButton() {
        return this.$('button[data-feature-id="authoring-dashboard-level-color-picker-button"]');
    }

    getRootPanelBgColorPreview() {
        return this.getRootPanelBgColorPicker().$('.mstr-rc-3-color-picker__color-preview');
    }

    getDashboardLevelRootPanelBgColorPreview() {
        return this.getDashboardFormatPanel().$('.mstr-rc-3-color-picker__color-preview');
    }

    async getRootPanelBgColorValue() {
        const preview = this.getRootPanelBgColorPreview();
        const style = await preview.getAttribute('style');
        const colorMatch = style.match(/background-color:\s*([^;]+)/);
        return colorMatch ? colorMatch[1].trim() : null;
    }

    // Background image preview methods
    getImagePreview() {
        return this.getRootPanelBgColorPreview().$('img');
    }

    // When page format panel is opened, use this to get dashboard level image preview
    getDashboardLevelImagePreview() {
        return this.getDashboardLevelRootPanelBgColorPreview().$('img');
    }

    async getDashboardLevelImagePreviewUrl() {
        const imagePreview = this.getDashboardLevelImagePreview();
        if (await imagePreview.isExisting()) {
            return await imagePreview.getAttribute('src');
        }
        return null;
    }

    async getImagePreviewUrl() {
        const imagePreview = this.getImagePreview();
        if (await imagePreview.isExisting()) {
            return await imagePreview.getAttribute('src');
        }
        return null;
    }

    async clickRootPanelBgColorPicker() {
        const colorPicker = this.getRootPanelBgColorPickerButton();
        await this.waitForElementVisible(colorPicker);
        await colorPicker.click();
    }

    async isRootPanelBgColorPickerExpanded() {
        const colorPicker = this.getRootPanelBgColorPickerButton();
        const ariaExpanded = await colorPicker.getAttribute('aria-expanded');
        return ariaExpanded === 'true';
    }

    // Color picker popover methods
    getRC3ColorPickerPopover() {
        return $('.mstr-rc-3-popover.root-panel-bg-color-picker-rc3[open]');
    }

    getColorPickerContent() {
        return this.getRC3ColorPickerPopover().$('.mstr-rc-3-color-picker__content');
    }

    getColorPickerToolbar() {
        return this.getColorPickerContent().$('.mstr-rc-3-color-picker-toolbar');
    }

    // Toolbar mode buttons
    getSwatchesButton() {
        return this.getColorPickerToolbar().$('button.mstr-rc-3-color-picker-toolbar__grid');
    }

    getPaletteButton() {
        return this.getColorPickerToolbar().$('button.mstr-rc-3-color-picker-toolbar__palette');
    }

    getGradientButton() {
        return this.getColorPickerToolbar().$('button.mstr-rc-3-color-picker-toolbar__gradient');
    }

    getImageButton() {
        return this.getColorPickerToolbar().$('button.mstr-rc-3-color-picker-toolbar__image');
    }

    // Color grid methods
    getEssentialColorGrid() {
        return this.getColorPickerContent().$('.mstr-rc-3-color-grid:first-child');
    }

    getPaletteColorGrid() {
        return this.getColorPickerContent().$('.mstr-rc-3-color-grid:nth-child(2)');
    }

    getColorCellByAriaLabel(ariaLabel) {
        return this.getColorPickerContent().$(`.mstr-rc-3-color-cell[aria-label="${ariaLabel}"]`);
    }

    getColorCellByTitle(title) {
        return this.getColorPickerContent().$(`.mstr-rc-3-color-cell[title="${title}"]`);
    }

    getColorCellByBackgroundColor(rgb) {
        return this.getColorPickerContent().$(`.mstr-rc-3-color-cell[style*="background-color: ${rgb}"]`);
    }

    // Action methods
    async clickSwatchesMode() {
        const button = this.getSwatchesButton();
        await button.waitForDisplayed({ timeout: 5000 });
        await button.click();
    }

    async clickPaletteMode() {
        const button = this.getPaletteButton();
        await button.waitForDisplayed({ timeout: 5000 });
        await button.click();
    }

    async clickGradientMode() {
        const button = this.getGradientButton();
        await button.waitForDisplayed({ timeout: 5000 });
        await button.click();
    }

    async clickImageMode() {
        const button = this.getImageButton();
        await button.waitForDisplayed({ timeout: 5000 });
        await button.click();
    }

    async selectColorByName(colorName) {
        const colorCell = this.getColorCellByAriaLabel(colorName);
        await colorCell.waitForDisplayed({ timeout: 5000 });
        await colorCell.click();
    }

    async selectColorByHex(hexValue) {
        const colorCell = this.getColorCellByTitle(hexValue);
        await colorCell.waitForDisplayed({ timeout: 5000 });
        await colorCell.click();
    }

    async selectColorByRGB(rgbValue) {
        const colorCell = this.getColorCellByBackgroundColor(rgbValue);
        await colorCell.waitForDisplayed({ timeout: 5000 });
        await colorCell.click();
    }

    async isColorPickerPopoverVisible() {
        try {
            const popover = this.getRC3ColorPickerPopover();
            return await popover.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async getCurrentSelectedColorMode() {
        const toolbar = this.getColorPickerToolbar();
        const selectedButton = toolbar.$('button[class*="--selected"]');

        try {
            const className = await selectedButton.getAttribute('class');
            if (className.includes('toolbar__grid')) return 'swatches';
            if (className.includes('toolbar__palette')) return 'palette';
            if (className.includes('toolbar__gradient')) return 'gradient';
            if (className.includes('toolbar__image')) return 'image';
            return 'unknown';
        } catch (error) {
            return 'none';
        }
    }

    async closeColorPickerPopover() {
        // Click outside the popover to close it
        await browser.keys('Escape');
        await browser.pause(500);
    }

    // Palette mode methods
    // Color saturation area methods
    getColorSaturationArea() {
        return this.getColorPickerContent().$('.react-colorful__saturation');
    }

    getColorSaturationInteractive() {
        return this.getColorSaturationArea().$('.react-colorful__interactive');
    }

    async setColorBySaturationClick(saturation = 50, brightness = 50) {
        // Saturation is left-right (0-100%), Brightness is top-bottom (100-0%)
        // Convert brightness to y-coordinate (0% brightness = 100% y, 100% brightness = 0% y)
        const yPercent = 100 - brightness;
        await this.clickColorSaturationArea(saturation, yPercent);
    }

    async clickColorSaturationArea(xPercent = 50, yPercent = 50) {
        const saturationArea = this.getColorSaturationInteractive();
        await saturationArea.waitForDisplayed({ timeout: 5000 });

        // Get the size of the saturation area
        const size = await saturationArea.getSize();

        // Ensure percentages are within valid range
        const clampedXPercent = Math.max(1, Math.min(99, xPercent));
        const clampedYPercent = Math.max(1, Math.min(99, yPercent));

        // Calculate target position based on percentage (with 1px margin from edges)
        const targetX = Math.round(size.width * (clampedXPercent / 100));
        const targetY = Math.round(size.height * (clampedYPercent / 100));

        // Get element location for absolute positioning
        const location = await saturationArea.getLocation();
        const absoluteX = location.x + targetX;
        const absoluteY = location.y + targetY;

        console.log(`Saturation area - Size: ${size.width}x${size.height}, Location: ${location.x}, ${location.y}`);
        console.log(
            `Click at ${clampedXPercent}%, ${clampedYPercent}% -> relative: ${targetX}, ${targetY} -> absolute: ${absoluteX}, ${absoluteY}`
        );

        // Use browser actions with absolute coordinates
        await browser.performActions([
            {
                type: 'pointer',
                id: 'mouse',
                actions: [
                    {
                        type: 'pointerMove',
                        duration: 0,
                        x: absoluteX,
                        y: absoluteY,
                    },
                    {
                        type: 'pointerDown',
                        button: 0,
                    },
                    {
                        type: 'pointerUp',
                        button: 0,
                    },
                ],
            },
        ]);
        await browser.releaseActions();

        // Trigger change event to confirm color selection
        await browser.pause(500); // Let the UI update and process the color change

        // Use relative coordinates to confirm at the same position without moving to center
        const relativeX = targetX - Math.round(size.width / 2);
        const relativeY = targetY - Math.round(size.height / 2);
        await saturationArea.click({ x: relativeX, y: relativeY });
        await browser.pause(100);
    }

    getHueSlider() {
        return this.getColorPickerContent().$('.react-colorful__hue .react-colorful__interactive');
    }

    async clickHueSlider(huePercent = 50) {
        const hueSlider = this.getHueSlider();
        await hueSlider.waitForDisplayed({ timeout: 5000 });

        // Find the hue pointer (the draggable element)
        const huePointer = this.getColorPickerContent().$('.react-colorful__hue-pointer');
        await huePointer.waitForDisplayed({ timeout: 5000 });

        // Get the size and location of the hue slider
        const size = await hueSlider.getSize();
        const location = await hueSlider.getLocation();

        // Ensure percentage is within valid range
        const clampedHuePercent = Math.max(1, Math.min(99, huePercent));

        // Calculate target position based on percentage
        const targetX = Math.round(size.width * (clampedHuePercent / 100));
        const centerY = Math.round(size.height / 2);

        console.log(`Hue slider - Size: ${size.width}x${size.height}, Location: ${location.x}, ${location.y}`);
        console.log(`Drag hue to ${clampedHuePercent}% -> target position: ${targetX}, ${centerY}`);

        // Calculate drag offset from current position to target
        const currentLocation = await huePointer.getLocation();
        const targetAbsoluteX = location.x + targetX;
        const dragOffsetX = targetAbsoluteX - currentLocation.x;

        console.log(`Drag offset: ${dragOffsetX}px`);

        // Use dragAndDrop with offset
        await huePointer.dragAndDrop({ x: dragOffsetX, y: 0 });

        // Trigger change event to confirm color selection
        await browser.pause(200); // Let the UI update
        // Click the hue slider to confirm the selection
        //await hueSlider.click(); // Click to confirm the selection
        //await browser.pause(100);

        // Alternative: use keyboard arrow keys to set precise value
        // await hueSlider.click(); // Focus the slider first
        // const currentHue = parseInt(await hueSlider.getAttribute('aria-valuenow')) || 0;
        // const targetHue = Math.round(360 * (clampedHuePercent / 100));
        // const steps = Math.abs(targetHue - currentHue);
        // const direction = targetHue > currentHue ? 'ArrowRight' : 'ArrowLeft';
        // for (let i = 0; i < steps; i++) {
        //     await browser.keys(direction);
        // }
    }

    async setHueByValue(hueValue) {
        // Convert hue value (0-360) to percentage (0-100)
        const huePercent = (hueValue / 360) * 100;
        await this.clickHueSlider(huePercent);
    }

    async getHexColorPicker() {
        // First try to find it in gradient mode container (for gradient mode)
        const gradientContainer = this.getColorPickerContent().$('.mstr-rc-3-color-picker-gradient-mode');
        if (await gradientContainer.isExisting()) {
            return gradientContainer.$('.mstr-rc-3-hex-color-picker');
        }

        // Fallback: look directly in content (for palette mode)
        return this.getColorPickerContent().$('.mstr-rc-3-hex-color-picker');
    }

    getHexInput() {
        return this.getColorPickerContent().$('.mstr-rc-3-hex-color-picker__hex-input');
    }

    getRGBAInput(channel) {
        const label = `hex-picker-${channel.toLowerCase()}-label`;
        return this.getColorPickerContent().$(`.mstr-rc-3-hex-color-picker__rgba-input[aria-labelledby="${label}"]`);
    }

    async setColorByHex(hexValue) {
        const hexInput = this.getHexInput();
        await hexInput.waitForDisplayed({ timeout: 5000 });
        await hexInput.clearValue();
        await hexInput.setValue(hexValue.replace('#', ''));
        await browser.keys('Enter');
    }

    async setColorByRGB(rgbValue) {
        let rValue, gValue, bValue;

        // Handle RGB string format like 'rgb(193,41,47)'
        if (typeof rgbValue === 'string' && rgbValue.startsWith('rgb(')) {
            const rgbMatch = rgbValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                rValue = parseInt(rgbMatch[1]);
                gValue = parseInt(rgbMatch[2]);
                bValue = parseInt(rgbMatch[3]);
            } else {
                throw new Error(`Invalid RGB format: ${rgbValue}. Expected format: 'rgb(r,g,b)'`);
            }
        }

        const rInput = this.getRGBAInput('R');
        const gInput = this.getRGBAInput('G');
        const bInput = this.getRGBAInput('B');

        await rInput.clearValue();
        await rInput.setValue(rValue.toString());

        await gInput.clearValue();
        await gInput.setValue(gValue.toString());

        await bInput.clearValue();
        await bInput.setValue(bValue.toString());

        await browser.keys('Enter');
        await browser.pause(1000);
    }

    // Favorite button methods
    getAddToFavoriteButton() {
        return this.getColorPickerContent().$('.mstr-rc-3-color-grid__grid--add-button');
    }

    async clickAddToFavorite() {
        const favoriteButton = this.getAddToFavoriteButton();
        await favoriteButton.waitForDisplayed({ timeout: 5000 });
        await favoriteButton.waitForClickable({ timeout: 5000 });
        await favoriteButton.click();
    }

    // Gradient mode methods
    getGradientModeContainer() {
        return this.getColorPickerContent().$('.mstr-rc-3-color-picker-gradient-mode');
    }

    getGradientStartButton() {
        return this.getGradientModeContainer().$('.mstr-rc-3-color-picker-gradient-mode__start-button');
    }

    getGradientEndButton() {
        return this.getGradientModeContainer().$('.mstr-rc-3-color-picker-gradient-mode__end-button');
    }

    getGradientInverseButton() {
        return this.getGradientModeContainer().$('.mstr-rc-3-color-picker-gradient-mode__inverse-button');
    }

    getGradientRotateButton() {
        return this.getGradientModeContainer().$('.mstr-rc-3-color-picker-gradient-mode__rotate-button');
    }

    async clickGradientStartButton() {
        const startButton = this.getGradientStartButton();
        await startButton.waitForDisplayed({ timeout: 5000 });
        await startButton.click();
    }

    async clickGradientEndButton() {
        const endButton = this.getGradientEndButton();
        await endButton.waitForDisplayed({ timeout: 5000 });
        await endButton.click();
    }

    async setGradientStartColor(color) {
        await this.clickGradientStartButton();
        if (color.startsWith('#')) {
            await this.setColorByHex(color);
        } else if (color.startsWith('rgb(')) {
            const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgb) {
                await this.setColorByRGB(color);
            }
        }
    }

    async setGradientEndColor(color) {
        await this.clickGradientEndButton();
        if (color.startsWith('#')) {
            await this.setColorByHex(color);
        } else if (color.startsWith('rgb(')) {
            const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgb) {
                await this.setColorByRGB(color);
            }
        }
    }

    async inverseGradient() {
        const inverseButton = this.getGradientInverseButton();
        await inverseButton.waitForDisplayed({ timeout: 5000 });
        await inverseButton.click();
    }

    async rotateGradient() {
        const rotateButton = this.getGradientRotateButton();
        await rotateButton.waitForDisplayed({ timeout: 5000 });
        await rotateButton.click();
    }

    // Image mode methods
    getImageModeContainer() {
        return this.getColorPickerContent().$('.mstr-rc-3-color-picker-image-mode');
    }

    getImageModeTitle() {
        return this.getImageModeContainer().$('.mstr-rc-3-color-picker-image-mode__title');
    }

    getImageInput() {
        return this.getImageModeContainer().$('#mstr-rc-3-color-picker-image-mode__image-input');
    }

    getImageFileInput() {
        return this.getImageModeContainer().$('input[type="file"]');
    }

    getUploadButton() {
        return this.getImageModeContainer().$('.mstr-rc-3-color-picker-image-mode__button[title="Upload"]');
    }

    getImageOkButton() {
        return this.getImageModeContainer().$('.mstr-rc-3-color-picker-image-mode__button--ok[title="OK"]');
    }

    getSizeSelect() {
        return this.getImageModeContainer().$('#mstr-rc-3-color-picker-image-mode__size-select');
    }

    getSizeSelectDropdown() {
        return this.$('#mstr-rc-3-color-picker-image-mode__size-select__dropdown');
    }

    getSizeSelectArrowButton() {
        return this.getImageModeContainer().$('.mstr-rc-3-icon-button[aria-label="Arrow down"]');
    }

    // Image mode action methods
    async setImageUrl(imageUrl) {
        const imageInput = this.getImageInput();
        await imageInput.waitForDisplayed({ timeout: 5000 });
        await imageInput.clearValue();
        await imageInput.setValue(imageUrl);
    }

    async getImageUrl() {
        const imageInput = this.getImageInput();
        return await imageInput.getValue();
    }

    async clickUploadButton() {
        const uploadButton = this.getUploadButton();
        await uploadButton.waitForDisplayed({ timeout: 5000 });
        await uploadButton.click();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickImageOkButton() {
        const okButton = this.getImageOkButton();
        await okButton.waitForDisplayed({ timeout: 5000 });
        await okButton.waitForEnabled({ timeout: 5000 });
        await okButton.click();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async isImageOkButtonEnabled() {
        const okButton = this.getImageOkButton();
        return await okButton.isEnabled();
    }

    async uploadImageFile(filePath) {
        const fileInput = this.getImageFileInput();
        await fileInput.setValue(filePath);
    }

    async openSizeSelect() {
        const selectArrow = this.getSizeSelectArrowButton();
        await selectArrow.waitForDisplayed({ timeout: 5000 });
        await selectArrow.click();
    }

    async getSizeSelectValue() {
        const sizeSelect = this.getSizeSelect();
        return await sizeSelect.getValue();
    }

    async selectImageSize(sizeOption) {
        await this.openSizeSelect();

        // Wait for dropdown to appear
        const dropdown = this.getSizeSelectDropdown();
        await dropdown.waitForDisplayed({ timeout: 5000 });

        // Select the option by aria-label
        const option = dropdown.$(`li[aria-label="${sizeOption}"]`);
        await option.waitForDisplayed({ timeout: 5000 });
        await option.click();
    }

    async getAvailableImageSizes() {
        await this.openSizeSelect();

        // Wait for dropdown to appear
        const dropdown = this.getSizeSelectDropdown();
        await dropdown.waitForDisplayed({ timeout: 5000 });

        // Get all available options
        const options = await dropdown.$$('li[role="option"]');
        const sizes = [];

        for (const option of options) {
            const ariaLabel = await option.getAttribute('aria-label');
            if (ariaLabel) {
                sizes.push(ariaLabel);
            }
        }

        // Close the dropdown by clicking elsewhere
        await this.getImageModeContainer().click();

        return sizes;
    }

    // Comprehensive image mode workflow methods
    async setImageBackground(imageUrl, size = '') {
        // Ensure we're in image mode
        await this.clickImageMode();

        // Set the image URL
        await this.setImageUrl(imageUrl);

        // Set the size
        // if size == '', do not change it, otherwise select the specified size
        if (size !== '') {
            await this.selectImageSize(size);
        }

        // Wait for OK button to be enabled and click it
        await browser.waitUntil(async () => await this.isImageOkButtonEnabled(), {
            timeout: 10000,
            timeoutMsg: 'Image OK button was not enabled within 10 seconds',
        });

        await this.clickImageOkButton();
    }

    async uploadImageBackground(filePath, size = 'Fill Canvas') {
        // Ensure we're in image mode
        await this.clickImageMode();

        // Upload the image file
        await this.uploadImageFile(filePath);

        // Set the size if different from default
        if (size !== 'Fill Canvas') {
            await this.selectImageSize(size);
        }

        // Wait for OK button to be enabled and click it
        await browser.waitUntil(async () => await this.isImageOkButtonEnabled(), {
            timeout: 10000,
            timeoutMsg: 'Image OK button was not enabled within 10 seconds',
        });

        await this.clickImageOkButton();
    }

    // Invalid URL dialog methods
    async getLastVisibleInvalidUrlDialog() {
        const dialogs = await $$('.mstrmojo-Editor.mstrmojo-alert.add-image-alert-dialog.modal');
        for (let i = dialogs.length - 1; i >= 0; i -= 1) {
            if (await dialogs[i].isDisplayed()) {
                return dialogs[i];
            }
        }
        return null;
    }

    async isInvalidUrlDialogVisible() {
        try {
            return Boolean(await this.getLastVisibleInvalidUrlDialog());
        } catch (error) {
            return false;
        }
    }

    async closeInvalidUrlDialog() {
        let dialog;
        await browser.waitUntil(
            async () => {
                dialog = await this.getLastVisibleInvalidUrlDialog();
                return Boolean(dialog);
            },
            {
                timeout: 5000,
                timeoutMsg: 'Invalid URL dialog was not displayed',
            }
        );

        const okButton = dialog.$('div[role="button"][aria-label="OK"]');
        await okButton.waitForDisplayed({ timeout: 5000 });

        await browser.execute((el) => el.click(), await okButton);

        await browser.waitUntil(async () => !(await dialog.isDisplayed()), {
            timeout: 5000,
            timeoutMsg: 'Invalid URL dialog did not close',
        });
    }

    async waitForInvalidUrlDialog(timeout = 5000) {
        await browser.waitUntil(async () => Boolean(await this.getLastVisibleInvalidUrlDialog()), {
            timeout,
            timeoutMsg: `Invalid URL dialog did not appear within ${timeout}ms`,
        });
    }

    async openOptimizedForDropDown() {
        //click on current selection to open all selections, then click on the selection in drop down list
        let el = this.getCurrentSelectionByName('Optimized for');
        await this.clickOnElement(el);
    }

    async openConsumptionViewDropDown() {
        //click on current selection to open all selections, then click on the selection in drop down list
        let el = this.getCurrentSelectionByName('Consumption view');
        await this.clickOnElement(el);
    }

    async selectOptimizedForOption(option) {
        const optionLabel = OptimizedForOptions[option] || option;
        const popupList = await this.getPopupList();
        await popupList.waitForDisplayed({ timeout: 5000 });
        const optionElement = await popupList.$(
            `.//div[contains(@class,'item') and not(contains(@class,'sectionHeader')) and normalize-space()='${optionLabel}']`
        );
        await this.waitForElementVisible(optionElement);
        await this.click({ elem: optionElement });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectConsumptionViewOption(option) {
        const optionLabel = ConsumptionViewOptions[option] || option;
        const popupList = await this.getPopupList();
        await popupList.waitForDisplayed({ timeout: 5000 });
        const optionElement = await popupList.$(
            `.//div[contains(@class,'item') and not(contains(@class,'sectionHeader')) and normalize-space()='${optionLabel}']`
        );
        await this.waitForElementVisible(optionElement);
        await this.click({ elem: optionElement });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async getPopupList() {
        const popupLists = await this.$$('.mstrmojo-popupList-scrollBar.mstrmojo-scrollNode');
        if (!popupLists.length) {
            throw new Error('No popup list is currently displayed.');
        }
        return popupLists[popupLists.length - 1];
    }

    async getCustomDimensionInput(axis) {
        const inputs = await this.$$(
            `//div[contains(@class,'pageSizeCurtain') and not(contains(@style,'display: none'))]//div[contains(@class,'pageSizeSettings') and not(contains(@style,'display: none'))]//div[@aria-label='[${axis}]']/ancestor::div[contains(@class,'mstrmojo-vi-ThreeColumnProp')]//input[@type='number']`
        );
        for (let i = inputs.length - 1; i >= 0; i -= 1) {
            if (await inputs[i].isDisplayed()) {
                return inputs[i];
            }
        }
        throw new Error(`No visible custom ${axis === 'w' ? 'width' : 'height'} input found.`);
    }

    async getCustomWidthInput() {
        const widthWrapper = await this.$(
            "//div[contains(@class,'pageSizeCurtain') and not(contains(@style,'display: none'))]//div[@aria-label='[w]']/ancestor::div[contains(@class,'mstrmojo-vi-ThreeColumnProp')]"
        );
        return widthWrapper.$(".//input[@type='number']");
    }

    async getCustomHeightInput() {
        const wrappers = await this.$$(
            "//div[contains(@class,'pageSizeCurtain') and not(contains(@style,'display: none'))]//div[@aria-label='[h]']/ancestor::div[contains(@class,'mstrmojo-vi-ThreeColumnProp')]"
        );

        for (let i = wrappers.length - 1; i >= 0; i -= 1) {
            if (await wrappers[i].isDisplayed()) {
                return wrappers[i].$(".//input[@type='number']");
            }
        }

        throw new Error('No visible height input found');
    }

    async setCustomPageSize(width, height) {
        const widthInput = await this.getCustomWidthInput();
        const heightInput = await this.getCustomHeightInput();

        await widthInput.waitForDisplayed({ timeout: 5000 });
        await widthInput.click();
        await widthInput.clearValue();
        await widthInput.setValue(width.toString());
        await browser.keys('Tab');

        await heightInput.waitForDisplayed({ timeout: 5000 });
        await heightInput.click();
        await heightInput.clearValue();
        await heightInput.setValue(height.toString());
        await browser.keys('Tab');

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
}
