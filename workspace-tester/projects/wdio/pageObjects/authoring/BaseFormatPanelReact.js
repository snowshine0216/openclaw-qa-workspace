'use strict';

import { Key } from 'webdriverio';
import BaseFormatPanel from './BaseFormatPanel.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
/**
 * Base Format Panel page object (to be used by all containers in Dossier)
 * @extends BaseFormatPanel
 * @author Fang Suo <fsuo@microstrategy.com>
 */
export default class BaseFormatPanelReact extends BaseFormatPanel {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
    }

    get FormatPanelContent() {
        return this.$('.mstrmojo-VIBoxPanel.mstrmojo-vi-PropEditor');
    }

    /**
     * Returns element for first tab (General Settings for each Viz)
     */
    get generalSettingVizTab() {
        return this.$(
            this.formatPanelPath +
                `//div[contains(@class, 'ant-radio-group')]//div[@aria-label='Visualization Options']/div[contains(@class, 'segment-control-icons')]`
        );
    }

    getSection(sec) {
        let str;
        switch (sec.toLowerCase()) {
            case 'panel stack':
                str = '.panel-stack';
                break;
            case 'info window options':
                str = '.info-window';
                break;
            case 'text and form':
                str = '.text-format';
                break;
            case 'title and container':
                str = '.title-container';
                break;
            case 'html container':
                str = '.html-container';
                break;
            case 'image':
                str = '.image';
                break;
            case 'text box':
                str = '.textbox';
                break;
            case 'transaction options':
                str = '.transactions';
                break;
            case 'microcharts':
                str = '.microcharts';
                break;
            case 'textbox options':
                str = '.textbox';
                break;
            default:
                throw 'Section not found';
        }
        return this.FormatPanelContent.$(`.segment-control-icons${str}`);
    }

    /**
     * Segment control dropdown, different from Select Pulldown
     * @param {*} currentText
     * @returns
     */
    getSegmentControlDropDownByCurrentSelection(currentText) {
        return this.$(
            this.formatPanelPath + `//div[contains(@class, 'dropdown-menu-control-box')]//span[text()='${currentText}']`
        );
    }

    /**
     * @returns option from the Segment Control Dropdown List
     */
    getSegmentControlOption(option) {
        return this.$(
            this.formatPanelPath + `//div[contains(@class, 'dropdown-menu-option')]//span[text()='${option}']`
        );
    }

    getPropDropdown(prop) {
        return this.FormatPanelContent.$(
            `.mstr-select-container .mstr-select-container__mstr-select[aria-label = '${prop}']`
        );
    }

    getPullDownWithCurrentSelectionReact(fromOption) {
        return this.FormatPanelContent.$(
            `//div[@class='ant-select-selector']//span[@class='ant-select-selection-item']//span[text()='${fromOption}']`
        );
    }

    getOptionFromPullDownListReact(option) {
        return this.FormatPanelContent.$(
            `//div[contains(@class, 'ant-select-dropdown')]//div[@class = 'ant-select-item-option-content' and descendant::span[text() = '${option}']]`
        );
    }

    get ColorPicker() {
        return this.$('.ant-popover-content .color-picker-dropdown');
    }

    get ButtonFormatPopup() {
        return this.$(`//div[@class='ant-popover-content']//div[contains(@class,'button-popover-content')]`);
    }

    getColorInColorPicker(color) {
        if (color.toLowerCase() == 'no fill') {
            return this.ColorPicker.$(`button[aria-label = 'transparent']`);
        } else if (color[0] !== '#') {
            return this.ColorPicker.$(`button[aria-label = '${this.getHexForColor(color)}']`);
        } else {
            return this.ColorPicker.$(`button[aria-label = '${color}']`);
        }
    }

    getHexForColor(color) {
        const ColorMAP = {
            Black: '#000000',
            'Dark Red': '#800000',
            Red: '#FF0000',
            Green: '#008000',
            Orange: '#FF6600',
            'Light Orange': '#FF9900',
            Blue: '#0000FF',
            Yellow: '#FFFF00',
        };
        if (!(color in ColorMAP)) {
            throw 'Incorrect color';
        }
        return ColorMAP[color];
    }

    // ------------ Title and Container getters ------------------
    get ContainerSection() {
        return this.FormatPanelContent.$('.container-layout');
    }

    get ContainerFillColor() {
        return this.ContainerSection.$$('.mstr-color-picker-dropdown')[0];
    }

    get ContainerFillColorOpacity() {
        return this.ContainerSection.$(`.ant-input-number input`);
    }

    get ContainerBorderStyle() {
        return this.ContainerSection.$('.ant-select-selector .ant-select-selection-item');
    }

    get ContainerBorderColor() {
        return this.ContainerSection.$$('.mstr-color-picker-dropdown')[1];
    }

    get ContainerTitleFillColorBtn() {
        return this.FormatPanelContent.$(
            '.horizontal-flex-space-between._2item-1vs2-stretch .mstr-color-picker-dropdown'
        );
    }

    get ContainerTitleFillColorOpacity() {
        return this.FormatPanelContent.$('.horizontal-flex-space-between._2item-1vs2-stretch .ant-input-number input');
    }

    // ------------Matrix section for NGM ---------------
    get NgmMatrixFillColor() {
        return this.FormatPanelContent.$('.color-picker-opacity-layout .mstr-color-picker-dropdown');
    }

    get NgmMatrixFillColorOpacity() {
        return this.FormatPanelContent.$('.color-picker-opacity-layout .ant-input-number input');
    }

    // ------------ Checkbox  ------------------
    getCheckboxWithLabelReact(label) {
        return this.FormatPanelContent.$(
            `//label[contains(@class, 'ant-checkbox-wrapper') and child::span/p[text() = '${label}']]`
        );
    }

    // ------------ Transaction options  ------------------
    getTxnTypeBtn(label) {
        return this.FormatPanelContent.$(`.//span[text()= '${label}']/parent::button`);
    }

    getTxnTypeLabel(label) {
        return this.FormatPanelContent.$(`.//div[contains(@class, 'switch-label') and text()='${label}']`);
    }

    getTxnTypeToggleBtn(label) {
        return this.getTxnTypeLabel(label).$(
            `./../../parent::li/preceding-sibling::li//div[@class ='mstr-switch-container']//div[contains(@class,'mstr-switch')]`
        );
    }

    getPythonTxnToggleBtn(label) {
        return this.getTxnTypeLabel(label).$(`./../preceding-sibling::button[contains(@class,'switch')]`);
    }

    /**
     * Return partial enabled warning icon for python txn action
     * @param {String} label
     */
    getPythonTxnWarningIcon(label) {
        return this.getTxnTypeLabel(label).$(
            `./../../following-sibling::span[contains(@class,'mstr-editor-icon-button')]//div[@class='warning']`
        );
    }

    getTxnTypeClearOrAddBtn(btn, label) {
        let btName = btn.toLowerCase();
        return this.getTxnTypeLabel(label).$(
            `./ancestor::li[@class='horizontal-list-items']/following-sibling::li//div[@class='${btName}']`
        );
    }

    /**
     * Get Delete Python Transaction button
     * @param {String} btn
     * @param {String} label
     */
    getPythonTxnTypeDeleteBtn(btn, label) {
        let btName = btn.toLowerCase();
        return this.getTxnTypeLabel(label).$(
            `./ancestor::li[@class='vertical-list-items'][1]//div[@class='${btName}']`
        );
    }

    get TxnContextMenu() {
        return this.FormatPanelContent.$(`.//div[@class='context-menu' and @role ='button']`);
    }

    getTxnContextMenuOption(option) {
        return this.$(`//li[contains(@class, 'txn-options-context-menu-title')]//span[text()='${option}']`);
    }

    getTxnContextMenuOptionParentNode(option) {
        return this.getTxnContextMenuOption(option).$(`.//ancestor::li`);
    }

    /**
     * Get Add new Python Transaction plus button
     * @param {String} header Transaction header in React Format panel
     */
    getAddPythonTxnButton(headerText = 'Transaction') {
        return this.FormatPanelContent.$(
            `.//div[contains(@class, 'section-header-text')]/span['text()= ${headerText}']/ancestor::li[1]/following-sibling::li//div[@class='add'][@role='button']`
        );
    }

    get afterSubmissionContainer() {
        return this.$(`//div[contains(@class, 'ant-dropdown-menu-submenu')]//div[@class='after-submission-container']`);
    }

    /**
     * Get require confirmation label in after submission container
     */
    getAfterSubmissionRequireConfirmationLabel() {
        return this.afterSubmissionContainer.$(`.//div[contains(@class, 'after-submission-checkbox-text')]`);
    }

    /**
     * Get subsequent action label in after submission container
     */
    getAfterSubmissionSubsequentActionLabel() {
        return this.afterSubmissionContainer.$(`.//div[contains(@class, 'subsequent-action-title')]//span`);
    }

    /**
     * Get selected subsequent action label in after submission container
     */
    getAfterSubmissionSubsequentActionSelectionLabel() {
        return this.afterSubmissionContainer.$(
            `.//div[contains(@class, 'after-submission-select')]//span[contains(@class, 'ant-select-selection-item')]`
        );
    }

    /**
     * Get show confirmation after submit label in after submission container
     */
    getAfterSubmissionDisplayMessageLabel() {
        return this.afterSubmissionContainer.$(
            `.//label[contains(@class, 'show-msg')]//div[contains(@class, 'after-submission-checkbox-text')]`
        );
    }

    getAfterSubmissionCheckbox(label) {
        return this.afterSubmissionContainer.$(
            `.//div[contains(@class, 'after-submission-checkbox') and text() ='${label}']/../preceding-sibling::span`
        );
    }

    getAfterSubmissionDropdownCurrentSelection(text) {
        return this.afterSubmissionContainer.$(`.//span[contains(@class, 'selection-item') and text()='${text}']`);
    }

    getAfterSubmissionDropdownOption(option) {
        return this.$(
            `//div[contains(@class, 'ant-select-dropdown')]//div[contains(@class,'ant-select-item') and @title='${option}']`
        );
    }

    getAfterSubmissionBtn(btnName) {
        return this.afterSubmissionContainer.$(`.//li//button//span[text()='${btnName}']`);
    }

    getAfterSubmissionInputMessage(text) {
        return this.afterSubmissionContainer.$(`.//li//input[@class='ant-input' and @value='${text}']`);
    }

    get afterSubmissionInput() {
        return this.afterSubmissionContainer.$(`.//li//input[contains(@class,'ant-input')]`);
    }

    getWarningTooltip(tooltip) {
        return this.$(
            `//div[contains(@class, 'mstr-tooltip-overlay') and not(contains(@style, 'display: none')) and not(contains(@class, 'hidden'))]//div[contains(text(), "${tooltip}")]`
        );
    }

    getPythonTxnDeleteBtnStatus(label) {
        return this.getTxnTypeLabel(label).$(
            `./ancestor::div[@class='toggle-label']/following-sibling::span//div[@class='delete']/..`
        );
    }

    getFormatPanelWarningText(txt) {
        return this.FormatPanelContent.$(
            `//div[contains(@class, 'segment-control')]//div[@class = 'mstr-editor-text']//span[contains(@class, 'typography') and text() ='${txt}']`
        );
    }

    // ------------ Action Functions ------------------
    async switchSection(sec) {
        await this.sleep(1);
        let el = await this.getSection(sec);
        await this.click({ elem: el });
        // to dismiss tooltip
        await this.moveToPosition({ x: 0, y: 0 });
    }

    async switchToGeneralSettingsTab() {
        await this.click({ elem: this.generalSettingVizTab });
    }

    async changeDropdownReact(fromOption, toOption) {
        await this.sleep(1);
        let el1 = await this.getPullDownWithCurrentSelectionReact(fromOption);
        await this.waitForElementVisible(el1, 20 * 1000);
        await this.click({ elem: el1 });
        await this.sleep(1);
        await this.selectFromDropdownReact(toOption);
    }

    async changePropDropdownReact(prop, toOption) {
        let el1 = this.getPropDropdown(prop);
        await this.click({ elem: el1 });
        await this.sleep(1);
        await this.selectFromDropdownReact(toOption);
        await this.sleep(1);
    }

    async selectFromDropdownReact(option) {
        let el = await this.getOptionFromPullDownListReact(option);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // select a color from color picker
    // color can be 'no fill', 'red', or hex value '#FF00000'
    async selectAdvancedColorBuiltInSwatchReact(color) {
        await this.sleep(1);
        await this.click({ elem: await this.getColorInColorPicker(color) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
    }

    async dismissColorPicker() {
        let el = await $('body');
        //Execute JavaScript to dispatch a 'mousedown' event on the body element
        await browser.execute(function (element) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            element.dispatchEvent(clickEvent);
        }, el);

        // Wait until the ColorPicker element becomes invisible
        let colorPicker = await this.ColorPicker;
        await colorPicker.waitForDisplayed({ reverse: true, timeout: 5000 });
    }

    async dismissButtonFormatPopup() {
        let el = await $('body');
        //Execute JavaScript to dispatch a 'mousedown' event on the body element
        await browser.execute(function (element) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            element.dispatchEvent(clickEvent);
        }, el);

        // Wait until the ButtonFormatPopup element becomes invisible
        let buttonFormatPopup = await this.ButtonFormatPopup;
        await buttonFormatPopup.waitForDisplayed({ reverse: true, timeout: 5000 });
    }

    // ------------ Title and Container ------------------
    async changeContainerFillColor({ color, dismissColorPicker = true }) {
        let el = this.ContainerFillColor;
        await this.click({ elem: el });
        await this.selectAdvancedColorBuiltInSwatchReact(color);
        if (dismissColorPicker) {
            await this.dismissColorPicker();
        }
    }

    async focusELAndReplaceInputValue(el, value) {
        await el.waitForDisplayed({ timeout: 5000 });

        // Programmatically focus the input element
        await browser.execute(function (el) {
            el.focus();
        }, el);
        await browser.pause(500);
        await browser.keys([Key.Ctrl, 'a']);
        await browser.pause(500);
        await browser.keys([Key.Backspace]);
        await browser.pause(500);

        await el.addValue(value);
        await browser.keys([Key.Enter]);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
    }

    async changeContainerFillColorOpacity(opacity) {
        await browser.pause(1000);
        let el = await this.ContainerFillColorOpacity;
        await this.focusELAndReplaceInputValue(el, opacity);
    }

    async changeContainerTitleFillColor({ color, dismissColorPicker = true }) {
        let el = this.ContainerTitleFillColorBtn;
        await this.click({ elem: el });
        await this.selectAdvancedColorBuiltInSwatchReact(color);
        if (dismissColorPicker) {
            await this.dismissColorPicker();
        }
    }

    async changeContainerTitleFillColorOpacity(opacity) {
        await browser.pause(1000);
        let el = await this.ContainerTitleFillColorOpacity;
        await this.focusELAndReplaceInputValue(el, opacity);
    }

    // option: None, dotted, dashed, solid
    async changeContainerBorder(option) {
        let el = await this.ContainerBorderStyle;
        await this.click({ elem: el });
        await this.selectFromDropdownReact(option);
    }

    async changeContainerBorderColor(color) {
        let el = this.ContainerBorderColor;
        await this.click({ elem: el });
        await this.selectAdvancedColorBuiltInSwatchReact(color);
    }

    // ------------ Segment Control Dropdown ------------------
    async changeSegmentControl(fromOption, toOption) {
        let el1 = await this.getSegmentControlDropDownByCurrentSelection(fromOption);
        await this.click({ elem: el1 });
        let el2 = this.getSegmentControlOption(toOption);
        await this.waitForElementVisible(el2, 3 * 1000);
        await this.click({ elem: el2 });
    }

    // ------------ Checkbox ------------------
    async clickOnCheckboxReact(label) {
        let el = this.getCheckboxWithLabelReact(label);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // --------------NGM Matrix Section-----------
    async changeNgmMatrixFillColor(color) {
        let el = this.NgmMatrixFillColor;
        await this.click({ elem: el });
        await this.selectAdvancedColorBuiltInSwatchReact(color);
    }

    async changeNgmMatrixFillColorOpacity(opacity) {
        let el = await this.NgmMatrixFillColorOpacity;
        await this.focusELAndReplaceInputValue(el, opacity);
    }

    // ------------ Transaction options  ------------------
    /**
     * click the txn mode on format panel to define transaction configuration dialog
     * @param {*} label use SQL/use Python
     */
    async clickTxnTypeOnFormatPanel(label) {
        let el = this.getTxnTypeBtn(label);
        await this.click({ elem: el });
    }
    /**
     * click the txn mode on format panel to define transaction configuration dialog
     * @param {*} label use SQL/use Python
     */
    async hoverTxnTypeBtn(label) {
        let el = this.getTxnTypeBtn(label);
        await this.hoverMouseOnElement(el);
    }

    /**
     * click the txn type label on format panel to open the transaction configuration dialog
     * @param {*} label Update Data/ Insert Data/ Delete Data
     */
    async clickTxnTypeLabelOnFormatPanel(label) {
        let el = this.getTxnTypeLabel(label);
        await this.click({ elem: el });
    }

    /**
     * click the toggle button on format panel to pause/unpause the txn action
     * @param {*} label Update Data/ Insert Data/ Delete Data
     * @param {*} isPause
     */
    async toggleTxnTypeOnFormatPanel(label, isPause) {
        let el = this.getTxnTypeToggleBtn(label);
        await el.isSelected().then(async function (status) {
            if (status !== isPause) {
                await el.click();
            }
        });
    }

    /**
     * click delete or add button for txn type to delete or open the txn config dialog
     * @param {*} btn delete/add
     * @param {*} label Update Data/ Insert Data/ Delete Data
     */
    async clickTxnTypeRightBtnOnFormatPanel(btn, label) {
        let el = this.getTxnTypeClearOrAddBtn(btn, label);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Click Delete Python Transaction button
     * @param {String} btn
     * @param {String} label
     */
    async clickPythonTxnTypeDeleteBtn(btn, label) {
        let el = this.getPythonTxnTypeDeleteBtn(btn, label);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * click to open the Transaction context menu on format panel
     */
    async clickTxnContextMenuIconOnFormatPanel() {
        let el = this.TxnContextMenu;
        await this.click({ elem: el });
    }

    /**
     * click to select the context menu option for txn on format panel
     * @param {*} option Clear Transactions/After Submission
     */
    async selectTxnContextMenuOption(option) {
        // assumed context menu is already opened
        let optionEl = this.getTxnContextMenuOptionParentNode(option);
        await this.click({ elem: optionEl });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * click to check/uncheck on after submission container
     * @param {*} label
     */
    async clickTxnAfterSubmissionCheckbox(label) {
        let el = this.getAfterSubmissionCheckbox(label);
        await this.click({ elem: el });
    }

    /**
     * click to change the subsequence action dropdown on after submission container
     * @param {*} fromOption
     * @param {*} toOption
     */
    async changeAfterSubmissionDropdown(fromOption, toOption) {
        let el1 = await this.getAfterSubmissionDropdownCurrentSelection(fromOption);
        await this.click({ elem: el1 });
        let el2 = this.getAfterSubmissionDropdownOption(toOption);
        await this.waitForElementVisible(el2, 3 * 1000);
        await this.click({ elem: el2 });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * click Ok or Cancel button on after submission container
     * @param {*} btnName
     */
    async clickAfterSubmissionBtn(btnName) {
        let el = this.getAfterSubmissionBtn(btnName);
        await this.click({ elem: el });
    }

    /**
     * type the display message after submission on after submission container
     * @param {*} value new message
     */
    async setAfterSubmissionMessage(value) {
        let el = this.afterSubmissionInput;
        await this.waitForElementVisible(el, 3 * 1000);
        await this.replaceTextByClickingOnElement(el, value);
    }

    async switchToTextAndFormSection() {
        await this.switchSection('Text and Form');
    }

    async switchToTitleAndContainerSection() {
        await this.switchSection('Title and Container');
    }

    async switchToTransactionOptionsSection() {
        await this.switchSection('Transaction Options');
    }
}
