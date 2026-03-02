'use strict';

import { Key } from 'webdriverio';
import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import Common from './Common.js';

/**
 * Base Format Panel page object (to be used by all containers in Dossier)
 * Open format panel, change pulldown, rename title, change container fill/border
 * Also includes Cornell's advance color picker actions (originally in FormatPanelForGridBase.js)
 *
 * @author  Chuanhao Ma <chuanhaoma@microstrategy.com>,
 * @author Cornell Daly <cdaly@microstrategy.com>,
 * @author Patricia Soriano <psoriano@microstrategy.com>
 */
export default class BaseFormatPanel extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
    }

    get formatPanelToggleButton() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-RootView-togglebar')]//div[contains(@class, 'propertiesPanel')]`
        );
    }

    get formatPanelTab() {
        return this.$(`//div[contains(@class, 'prp')]`);
    }

    get formatPanelPath() {
        return `//div[contains(@class, 'mstrmojo-VIBoxPanel mstrmojo-vi-PropEditor')]`;
    }

    get formatPanelTitle() {
        return this.$(
            this.formatPanelPath +
                `//div[contains(@class, 'mstrmojo-VITitleBar')]//div[contains(@class, 'title-text')]//div[contains(@class, 'mstrmojo-EditableLabel')]`
        );
    }

    /**
     * Button to option pop up for format panel w/ menu: Rename and Help
     * Should use common.getContextMenuItem(item) once element is clicked
     */
    get formatPanelContextMenu() {
        return this.$(
            this.formatPanelPath +
                `//div[contains(@class, 'mstrmojo-VITitleBar')]//div[contains(@class, 'mstrmojo-ListBase')]`
        );
    }

    /**
     * Retrieves the pulldown which targets the various sections within
     * the Format Panel (e.g. General Settings, Title and Container, etc.)
     *
     * @readonly
     * @memberof BaseFormatPanel
     */
    get targetPulldown() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Box mstrmojo-VIPanelContents')]/child::div[(contains(@class, 'ctrl-group') and not(contains(@class, 'mstrmojo-ui-EditCharacter')))]/child::div[contains(@class, 'mstrmojo-ui-Pulldown')]`
        );
    }

    /**
     * Retrieves the currently selected text within targetPulldown,
     * useful for validation.
     *
     * @readonly
     * @memberof BaseFormatPanel
     */
    get targetPulldownText() {
        return this.targetPulldown.$(
            `.//child::div[contains(@class, 'mstrmojo-ui-Pulldown')]//div[contains(@class, 'mstrmojo-Pulldown-text')]`
        );
    }

    getTargetSelectOption(optionText) {
        let path = `//div[contains(@class, 'mstrmojo-vi-EditorGroup')]//div[@class='mstrmojo-popupList-scrollBar mstrmojo-scrollNode']//div[text()='${optionText}']`;
        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }
        return this.$(path);
    }

    // ----- Applied to any Dropdown in format panel ------
    // ex. Text box -- Direction, Overflow
    getPullDownWithTitle(title) {
        return this.$(
            `//div[@class='mstrmojo-Label' and contains(text(), '${title}')]/ancestor::div[@class='mstrmojo-vi-TwoColumnProp']//div[@class='mstrmojo-ui-Pulldown']`
        );
    }

    getPullDownWithCurrentSelection(curSelection) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-vi-PropEditor')]//div[@class='mstrmojo-ui-Pulldown']//div[contains(@class, 'mstrmojo-ui-Pulldown-text') and text()='${curSelection}']`
        );
    }

    getOptionFromPullDownList(option) {
        return this.$(`//div[contains(@class,'mstrmojo-PopupList ctrl-popup-list')]//div[text()='${option}']`);
    }

    getCurrentPullDownOptionWithTitle(title) {
        return this.$(
            `//div[@class='mstrmojo-Label' and contains(text(), '${title}')]/ancestor::div[@class='mstrmojo-vi-TwoColumnProp']//div[@class='mstrmojo-ui-Pulldown-text ']`
        );
    }

    // ----- Applied to any checkbox in format panel ---
    // ex. Show Title Bar, Text box -- Wrap text, Image -- Lock aspect ratio..
    getCheckboxWithLabel(label) {
        return this.$(
            `//div[contains(@class,'mstrmojo-vi-PropEditor')]//div[text()='${label}']/ancestor::div[contains(@class, 'mstrmojo-vi-TwoColumnProp checkLabel')]//div[contains(@class,'mstrmojo-ui-Checkbox')]`
        );
    }

    // ----- Applied to any button in format panel  ---
    // ex. Image -- Restore to Original Size
    getButtonWithText(text) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-vi-PropEditor')]//div[contains(@class, 'mstrmojo-Button-text') and text()='${text}']`
        );
    }

    // Container locators
    get containerSection() {
        // works for all visualizations, text, html, survey containers.
        // visualizations have another div that has mstrmojo-ui-EditContainer class under title, so don't select that
        // select the one for bem-tc-container
        // for grid, original was //div[contains(@class, 'bem-tc-container')
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-EditContainer') and not(ancestor::div[contains(@class, 'bem-tc-title')])]/..`
        );
    }

    get containerFillColorButton() {
        return this.containerSection.$(
            `(.//div[contains(@class, 'mstrmojo-ui-EditContainer')]//div[contains(@class, 'mstrmojo-ColorPickerBtn')])[1]`
        );
    }

    get ContainerFillColorOpacityInput() {
        return this.containerSection.$(`(.//div[contains(@class, 'vi-col1')]//descendant::input)[1]`);
    }

    //For grid/compound grid: color opacity input box in Column Headers, Row Headers and Values sections
    //Also works for visualization's title fill opacity input
    get GridFillColorOpacityInput() {
        return this.containerSection.$(`(.//div[contains(@class, 'vi-col1')]//descendant::input)[2]`);
    }

    get containerBorderStylePulldown() {
        return this.containerSection.$(
            `.//div[contains(@class, 'mstrmojo-ui-LineStyle')]//div[contains(@class, 'btn')]`
        );
    }

    getContainerBorderStyleOption(style) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted') and contains(@class, 'mstrmojo-ui-LineStyle') and not(contains(@style, 'display: none'))]//div[contains(@class, 'item') and @title='${style}']`
        );
    }

    get containerBorderColorPulldown() {
        return this.containerSection.$(
            `(.//div[contains(@class, 'mstrmojo-ui-EditContainer')]//div[contains(@class, 'mstrmojo-ColorPickerBtn')])[2]`
        );
    }

    /**
     * Element Locator for title bar section
     * Works for all visualization that have "Title and Container" in format panel
     */
    get TitleBarSection() {
        return this.$(`//div[contains(@class, 'bem-tc-title')]`);
    }

    get containerTitleBarFillColorButton() {
        return this.TitleBarSection.$(
            `.//div[text()='Fill color']/following-sibling::div/div[contains(@class,'vi-col1')]//div[@class='btn']`
        );
    }

    get TitleBarFillColorOpacityInput() {
        return this.TitleBarSection.$(
            `.//div[contains(@class, 'mstrmojo-ui-EditContainer')]//div[contains(@class, 'vi-col1')]//descendant::input`
        );
    }

    getTitleAlignButton(alignment) {
        return this.TitleBarSection.$(
            `.//div[contains(@class, 'txtAlign')]//div[contains(@class, 'item') and contains(@class, '${alignment}')]`
        );
    }

    /*This works in "Rows and Columns" sections in format panel*/
    get RowsAndColumnsFillColorButton() {
        return this.$(`//div[contains(@class, 'vi-col1')]//div[contains(@class, 'mstrmojo-ColorPickerBtn')]`);
    }

    /*This works in "Rows and Columns" sections in format panel*/
    get RowsAndColumnsOpacityInput() {
        return this.$(`(//div[contains(@class, 'vi-col1')]//descendant::input)[2]`);
    }

    /** Select rows or columns from dropdown in "Row and Columns" pull down, background section */
    get RowsAndColumnsPulldown() {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-VIBoxPanelContainer-content')]//div[contains(@class, 'mstrmojo-ui-Pulldown')])[7]`
        );
    }

    getRowsColumnsSelectOption(optionText) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted')]//div[@class='mstrmojo-popupList-scrollBar mstrmojo-scrollNode']//div[text()='${optionText}']`
        );
    }

    /**
     * Advanced Color Picker Helpers
     * Can be used by any page object once button for element has been clicked
     */
    get advancedColorPicker() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted') and contains(@class, 'mstrmojo-ColorPickerBtn') and not(contains(@style, 'display: none'))]//div[contains(@class, 'mstrmojo-ui-AdvColorPickerPopup')]`
        );
    }

    get advancedColorSwatchButton() {
        return this.advancedColorPicker.$(`.//div[contains(@class, 'acpSwatchBtn')]`);
    }

    get advancedColorPaletteButton() {
        return this.advancedColorPicker.$(`.//div[contains(@class, 'acpPaletteBtn')]`);
    }

    get advancedColorSwatchNoFill() {
        return this.advancedColorPicker.$(`.//div[contains(@class, 'noFill')]`);
    }

    /**
     * By name in built-in color pop up
     * @param {*} color
     */
    getAdvancedColorSwatchBuiltInByName(color) {
        return this.advancedColorPicker.$(`.//div[@title='${color}']`);
    }

    /**
     * By idx in built-in color pop up
     * @param {*} idx
     */
    getAdvancedColorSwatchBuiltInByIdx(idx) {
        return this.advancedColorPicker.$(`(.//div[@idx='${idx}'])[1]`);
    }

    getAdvancedColorSwatchThemeByIdx(idx) {
        return this.advancedColorPicker.$(`.//div[@idx='${idx}' and @title='']`);
    }

    /**
     * Functions below are for the palette
     */
    get advancedColorPalettePulldown() {
        return this.advancedColorPicker.$(
            `.//div[contains(@class, 'mstrmojo-ui-Pulldown') and not(contains(@class, 'mstrmojo-ui-Pulldown-text'))]`
        );
    }

    get advancedColorPaletteColorFill() {
        return this.advancedColorPalettePulldown.$(`.//div[@idx='0']`);
    }

    get advancedColorPaletteNoFill() {
        return this.advancedColorPalettePulldown.$(`.//div[@idx='1']`);
    }

    get advancedColorPaletteHexInput() {
        return this.advancedColorPicker.$(
            `.//div[contains(@class, 'mstrmojo-TextBoxWithLabel') and contains(@style, 'display: block')]/child::input[contains(@class, 'mstrmojo-TextBox')]`
        );
    }

    get advancedColorPaletteWheel() {
        return this.advancedColorPicker.$(`.//div[contains(@class, 'mstrmojo-ui-ColorWheel')]`);
    }

    get advancedColorPaletteOK() {
        return this.advancedColorPicker.$(`.//div[contains(@class, 'mstrmojo-Button') and contains(@class, 'hot')]`);
    }

    get advancedColorPaletteCancel() {
        return this.advancedColorPicker.$(
            `.//div[contains(@class, 'acpButtons')]//div[contains(@class, 'mstrmojo-WebButton') and not(contains(@class, 'hot'))]//div[contains(@class, 'mstrmojo-Button-text')]`
        );
    }
    // End advanced color picker helpers

    // Element localtor for dossier formatting properities (FORMAT --> Dossier Formatting...)
    get backgroundColor() {
        return this.$(
            `(//div[contains(@class, 'DashboardStyles')]//div[contains(@class, 'mstrmojo-ColorPickerBtn')])[1]`
        );
    }

    get containerTitleFillColorButton() {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-ui-EditContainer')]//div[contains(@class, 'mstrmojo-ColorPickerBtn')])[2]`
        );
    }

    get containerBodyFillColorButton() {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-ui-EditContainer')]//div[contains(@class, 'mstrmojo-ColorPickerBtn')])[3]`
        );
    }

    get ContainerTitleFillColorOpacityInput() {
        return this.$(
            `(//div[contains(@class,'mstrmojo-Editor') and contains(@style,'display: block')]//div[contains(@class, 'vi-col1')]//descendant::input)[1]`
        );
    }

    get ContainerBodyFillColorOpacityInput() {
        return this.$(
            `(//div[contains(@class,'mstrmojo-Editor') and contains(@style,'display: block')]//div[contains(@class, 'vi-col1')]//descendant::input)[3]`
        );
    }

    get titleFillColorButton() {
        return this.TitleBarSection.$(
            `.//div[contains(@class, 'mstrmojo-ui-EditContainer')]//div[contains(@class, 'mstrmojo-ColorPickerBtn')]`
        );
    }

    async toggleFormatPanelFromToolbar() {
        await this.click({ elem: this.formatPanelToggleButton });
    }

    async switchToFormatPanelByClickingOnIcon() {
        await this.click({ elem: this.formatPanelTab });
    }

    async selectTarget(menuOption) {
        await this.click({ elem: await this.targetPulldown });

        // Make sure the pulldown is open before continuing
        const elMenuOption = await this.getTargetSelectOption(menuOption);
        await this.waitForElementVisible(elMenuOption);
        await this.click({ elem: elMenuOption });
    }

    async renameByDoubleClickOnFormatPanel(newName) {
        let title = await this.formatPanelTitle;
        await this.doubleClickOnElement(title);
        await this.clear(title);
        await title.addValue(newName);
        await browser.keys(Key.Enter);
    }

    async renameByFormatPanelContextMenu(newName) {
        await this.click({ elem: this.formatPanelContextMenu });
        let renameOption = await this.common.getContextMenuItem('Rename');
        await this.click({ elem: renameOption });
        await this.clear(title);
        await title.addValue(newName);
        await browser.keys(Key.Enter);
    }

    async openHelpLink() {
        await this.click({ elem: this.formatPanelContextMenu });
        let helpOption = this.common.getContextMenuItem('Help');
        await this.click({ elem: helpOption });
    }

    // Container related actions
    async selectContainerFillColorButton() {
        await this.click({ elem: this.containerFillColorButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async selectContainerTitleBarFillColorButton() {
        await this.click({ elem: this.containerTitleBarFillColorButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async ChangeContainerFillColorOpacity(opacity) {
        let OpacityInputEl = await this.ContainerFillColorOpacityInput;
        await this.enter();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    //For grid only: color opacity input box in Column Headers, Row Headers and Values sections
    async ChangeGridFillColorOpacity(opacity) {
        let OpacityInputEl = await this.GridFillColorOpacityInput;
        await this.enter();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async verifyGridCellOpacity(opacity) {
        let el = await this.GridFillColorOpacityInput;
        let value = await this.getBrowserData('return arguments[0].value', el);
        return value;
    }

    async selectTitleFillColorButton() {
        await this.click({ elem: this.titleFillColorButton });
    }

    async ChangeTitleBarFillColorOpacity(opacity) {
        let OpacityInputEl = await this.TitleBarFillColorOpacityInput;
        await this.enter();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTitleAlignment(alignment) {
        await this.click({ elem: this.getTitleAlignButton(alignment.toLowerCase()) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async selectContainerBorderStyleButton() {
        await this.click({ elem: this.containerBorderStylePulldown });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async selectContainerBorderStyle(style) {
        if (style === 'None') {
            style = '';
        }

        const elBorderOption = this.getContainerBorderStyleOption(style);
        await this.waitForElementVisible(elBorderOption);
        await this.click({ elem: elBorderOption });

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async selectContainerBorderColorButton() {
        await this.click({ elem: this.containerBorderColorPulldown });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async selectRowsAndColumnsFillColorButton() {
        await this.click({ elem: this.RowsAndColumnsFillColorButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changeRowsAndColumnsFillColorOpacity(opacity) {
        let OpacityInputEl = await this.RowsAndColumnsOpacityInput;
        await this.enter();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectRowsOrColumns(menuOption) {
        await this.click({ elem: await this.RowsAndColumnsPulldown });

        // Make sure the pulldown is open before continuing
        const elMenuOption = await this.getRowsColumnsSelectOption(menuOption);
        await this.waitForElementVisible(elMenuOption);
        await this.click({ elem: elMenuOption });
    }

    // Advanced Color Picker Actions
    async selectAdvancedColorSwatchMenu() {
        // Make sure the popup is ready before continuing
        const elSwatchBtn = await this.advancedColorSwatchButton;
        await this.waitForElementVisible(elSwatchBtn);
        await this.click({ elem: elSwatchBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async selectAdvancedColorPaletteMenu() {
        // Make sure the popup is ready before continuing
        const elPaletteBtn = await this.advancedColorPaletteButton;
        await this.waitForElementVisible(elPaletteBtn);
        await this.click({ elem: elPaletteBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async selectAdvancedColorSwatchNoFill() {
        await this.click({ elem: this.advancedColorSwatchNoFill });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    /**
     * Selects one of the 40 built-in colors within the Advanced
     * Color Picker's swatch menu. The color are identified by
     * their name/title, which can be viewed by hovering.
     *
     * @param {string} color Name of the color to select
     * @memberof BaseFormatPanel
     */
    async selectAdvancedColorBuiltInSwatch(color) {
        // No Fill can't be selected with the same xpath as the other
        // color swatches, so handle it as a special case.
        if (color.toLowerCase() === 'no fill') {
            await this.click({ elem: await this.advancedColorSwatchNoFill });
        } else {
            await this.click({ elem: await this.getAdvancedColorSwatchBuiltInByName(color) });
        }

        let colorPicker = await this.advancedColorPicker;
        await colorPicker.waitForDisplayed({ reverse: true, timeout: 5000 });
        await this.waitForElementInvisible(await this.advancedColorPicker);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    /**
     * Selects one of the colors from the built in swatch.
     * Selection is index based
     *
     * @param {int} idx 0-based position of swatch
     * @memberof BaseFormatPanel
     */
    async selectAdvancedColorBuiltInSwatchByPosition(idx) {
        await this.click({ elem: this.getAdvancedColorSwatchBuiltInByIdx(idx) });

        await this.waitForElementInvisible(this.advancedColorPicker);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    /**
     * Selects one of the colors from the currently selected
     * color palette. Selection is index based, starting at 1.
     *
     * @param {int} idx 1-based position of swatch
     * @memberof BaseFormatPanel
     */
    async selectAdvancedColorThemeSwatchByPosition(idx) {
        await this.click({ elem: this.getAdvancedColorSwatchThemeByIdx(idx) });

        await this.waitForElementInvisible(this.advancedColorPicker);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async selectAdvancedColorPaletteColorFill() {
        await this.click({ elem: this.advancedColorPalettePulldown });

        // Make sure the pulldown is open before continuing
        const elColorFill = this.advancedColorPaletteColorFill;
        await this.waitForElementVisible(elColorFill);
        await this.click({ elem: elColorFill });
    }

    async setAdvancedColorPaletteHex(hex) {
        const elHexInput = await this.advancedColorPaletteHexInput;
        await this.doubleClickOnElement(elHexInput);
        await elHexInput.clear();
        await this.setValue(hex, elHexInput);
    }

    /**
     * Rudimentary method of controlling the color wheel in
     * the Advanced Color Picker. Uses a position relative
     * to the top-left corner of the wheel.
     *
     * @param {int} x
     * @param {int} y
     * @memberof BaseFormatPanel
     */
    async setAdvancedColorPaletteWheel(x, y) {
        const elColorWheel = this.advancedColorPaletteWheel,
            targetPos = { x: parseInt(x), y: parseInt(y) };

        await browser.actions().mouseMove(elColorWheel, targetPos).perform();
        await browser.actions().click().perform();
    }

    async selectAdvancedColorPaletteNoFill() {
        await this.click({ elem: this.advancedColorPalettePulldown });

        // Make sure the pulldown is open before continuing
        const elNoFill = this.advancedColorPaletteNoFill;
        await this.waitForElementVisible(elNoFill);
        await this.click({ elem: elNoFill });
    }

    async confirmAdvancedColorPalette() {
        await this.click({ elem: this.advancedColorPaletteOK });

        await this.waitForElementInvisible(this.advancedColorPicker);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async cancelAdvancedColorPalette() {
        await this.click({ elem: this.advancedColorPaletteCancel });
        await this.waitForElementInvisible(this.advancedColorPicker);
    }

    // dossier formatting properties
    async changeBackgroundColorInDossierFormat(color) {
        await this.click({ elem: await this.backgroundColor });
        await this.selectAdvancedColorBuiltInSwatch(color);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async selectContainerTitleFillColorButton() {
        await this.click({ elem: await this.containerTitleFillColorButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async selectContainerBodyFillColorButton() {
        await this.click({ elem: await this.containerBodyFillColorButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async clearAndSetValue(el, value) {
        await el.click();
        await browser.keys([Key.Ctrl, 'a']);
        await browser.keys([Key.Backspace]);
        await el.addValue(value);
        await browser.keys([Key.Enter]);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async ChangeContainerTitleFillColorOpacity(opacity) {
        let el = await this.ContainerTitleFillColorOpacityInput;
        await this.clearAndSetValue(el, opacity);
    }

    async ChangeContainerBodyFillColorOpacity(opacity) {
        let el = await this.ContainerBodyFillColorOpacityInput;
        await this.clearAndSetValue(el, opacity);
    }

    // --------------- Checkbox, Dropdown ---------------------
    async clickOnCheckBox(label) {
        let el = this.getCheckboxWithLabel(label);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changeDropdown(fromOption, toOption) {
        let el1 = this.getPullDownWithCurrentSelection(fromOption);
        await this.click({ elem: el1 });
        let el2 = this.getOptionFromPullDownList(toOption);
        await this.waitForElementVisible(el2);
        await this.click({ elem: el2 });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changeDropdownWithTitle(title, toOption) {
        let el1 = this.getPullDownWithTitle(title);
        await this.click({ elem: el1 });
        let el2 = this.getOptionFromPullDownList(toOption);
        await this.waitForElementVisible(el2);
        await this.click({ elem: el2 });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    get fontPickerForTitle() {
        return this.$(
            `//div[@aria-label='Title Bar']/following-sibling::div[contains(@class, 'mstrmojo-ui-EditCharacter')]//div[contains(@class, 'mstrmojo-FontPickerContainer')]`
        );
    }

    get fontPickerForAllFonts() {
        return this.$(
            `//div[@aria-label='All Fonts']/parent::div/following-sibling::div/div[contains(@class, 'mstrmojo-ui-EditCharacter')]//div[contains(@class, 'mstrmojo-FontPickerContainer')]`
        );
    }

    // open font picker for "ALL Fonts"
    async openFontPickerForAllFonts() {
        await this.click({ elem: this.fontPickerForAllFonts });
        await browser.pause(3000);
    }

    // open font picker for Title
    async openFontPickerForTitle() {
        await this.click({ elem: this.fontPickerForTitle });
        await browser.pause(3000);
    }

    //#endregion Action Helpers
}
