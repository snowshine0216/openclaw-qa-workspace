// import BaseFormatPanelReact from '../../BaseFormatPanelReact.js';
// import LoadingDialog from './../../components/LoadingDialog.js';
// import BaseFormatPanel from '../../BaseFormatPanel.js';
import { Key } from 'webdriverio';
import Common from '../Common.js';
import BasePage from '../../base/BasePage.js';
import LoadingDialog from '../../dossierEditor/components/LoadingDialog.js';
import BaseFormatPanel from '../BaseFormatPanel.js';
import FontPicker from '../../common/FontPicker.js';
import { ReportEditorStringLabels, Locales } from '../../../constants/report.js';
import { scrollIntoView } from '../../../utils/scroll.js';

export default class NewFormatPanelForGrid extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
        this.baseFormatPanel = new BaseFormatPanel();
        this.fontPicker = new FontPicker('.mstr-editor-font-select');
    }
    getFormatTab(tabName) {
        return this.$(
            `//div[contains(@class,'switch')]//div[contains(@class,'segment-control-icons') and contains(@class,'${tabName}')]`
        );
    }

    getSectionTitle(sectionName) {
        return this.$(`//span[contains(@class,'ant-dropdown-trigger') and text()='${sectionName}']`);
    }

    getSectionTitleStatusNode(sectionName) {
        return this.$(
            `//span[contains(@class,'ant-dropdown-trigger') and text()='${sectionName}']//ancestor::span[contains(@class, 'hideable-layout-title-container')]`
        );
    }

    getCheckBox(checkBoxName) {
        return this.$$(
            `//p[text()='${checkBoxName}']/ancestor::div[contains(@class,'checkbox')]//span[contains(@class,'ant-checkbox')]`
        )[0];
    }

    getCheckedCheckbox(checkBoxName) {
        return this.$$(
            `//p[text()='${checkBoxName}']/ancestor::div[contains(@class,'checkbox')]//span[contains(@class,'ant-checkbox') and contains(@class, 'ant-checkbox-checked')]`
        )[0];
    }

    getUncheckedCheckbox(checkBoxName) {
        return this.$$(
            `//p[text()='${checkBoxName}']/ancestor::div[contains(@class,'checkbox')]//span[contains(@class,'ant-checkbox') and not(contains(@class, 'ant-checkbox-checked'))]`
        )[0];
    }

    getDisabledCheckbox(checkBoxName) {
        return this.$$(
            `//p[text()='${checkBoxName}']/ancestor::div[contains(@class,'checkbox')]//span[contains(@class,'ant-checkbox') and contains(@class, 'ant-checkbox-disabled')]`
        )[0];
    }

    getCheckboxTooltip(tooltipMsg) {
        return this.$(
            `//div[contains(@class, 'mstr-tooltip-overlay') and not(contains(@style, 'display: none'))]//div[contains(text(), '${tooltipMsg}')]`
        );
    }

    getGridTemplateColor(color) {
        return this.$(`//div[text()='Color']/following-sibling::div//span[@aria-label = '${color}']`);
    }

    getGridTemplateStyle(style) {
        return this.$(`//div[text()='Style']/following-sibling::div//div[contains(@class,'${style}')]`);
    }

    get showHeadersToggleButton() {
        return this.$(
            `//div[contains(@class,'grid-layout')]//div[contains(@class,'mstrrsd-horizontal-container')]//div[@class = 'toggle-button']`
        );
    }

    get gridElementDropdown() {
        return this.$(
            `(//div[contains(@class,'grid-layout') or contains(@class,'microcharts-layout')]//div[contains(@class,'dropdown-menu-control-box')])[1]`
        );
    }

    getGridElementOption(option) {
        return this.$(
            `//div[contains(@class,'grid-layout') or contains(@class,'microcharts-layout')]//div[contains(@class,'dropdown-menu-option-list')]//span[text() = '${option}']`
        );
    }

    get gridColumnSetDropdown() {
        return this.$(
            `(//div[contains(@class,'grid-layout') or contains(@class,'microcharts-layout')]//div[contains(@class,'dropdown-menu-control-box')])[2]`
        );
    }

    get gridSegmentDropDown() {
        return this.$(
            `(//div[contains(@class,'editor-segment') and descendant::div[contains(@class,'text-format')]]//div[@class='dropdown-menu-control-box'])[1]`
        );
    }

    getGridSegmentOrBorderOrientationFromDropDown(option) {
        return this.$(
            `//div[contains(@class,'editor-segment') and descendant::div[contains(@class,'text-format')]]//span[@class='dropdown-menu-option-display-name' and text()='${option}']`
        );
    }

    get gridColumnsDropDown() {
        return this.$(
            `(//div[contains(@class,'editor-segment') and descendant::div[contains(@class,'text-format')]]//div[@class='dropdown-menu-control-box'])[2]`
        );
    }

    get FormatPanelContent() {
        return this.$(`//*[@id="reactFormatPanel"]//div[contains(@class, 'content')]`);
    }

    get FormatPanel() {
        return this.$(`//*[@id="reactFormatPanel"]`);
    }

    get cellsSection() {
        return this.FormatPanelContent.$('.cells-layout');
    }

    get fontSection() {
        return this.FormatPanelContent.$('.font-layout');
    }

    getSectionByName(name) {
        return this.FormatPanelContent.$(
            `.//div[contains(@class, 'section-header-text')]/span[text()='${name}']//ancestor::div[contains(@class,'mstrrsd-vertical-container')][1]`
        );
    }

    get cellFillColorBtn() {
        return this.cellsSection.$(
            `//div[contains(@class,'_2item-1vs2-stretch')]//div[contains(@class,'color-picker-arrow-button')]`
        );
    }

    get gridCellBorderOrienDropDown1() {
        return this.$(
            `(//div[contains(@class,'editor-segment') and descendant::div[contains(@class,'text-format')]]//div[@class='dropdown-menu-control-box'])[2]`
        );
    }

    get gridCellBorderOrienDropDown2() {
        return this.$(
            `(//div[contains(@class,'editor-segment') and descendant::div[contains(@class,'text-format')]]//div[@class='dropdown-menu-control-box'])[3]`
        );
    }

    get gridCellBorderStyleDropDown() {
        return this.$(
            `(//span[text()='Border']/ancestor::li[@class='vertical-list-items'])[5]/following-sibling::li//div[contains(@class,'select-selector')]`
        );
    }

    get gridCellBorderStyleDropDown2() {
        return this.$(
            `(//span[text()='Border']/ancestor::li[@class='vertical-list-items'])[4]/following-sibling::li//div[contains(@class,'select-selector')]`
        );
    }

    get gridCellBorderStyleDropDown3() {
        return this.$(
            `(//span[text()='Border']/ancestor::li[@class='vertical-list-items'])[6]/following-sibling::li//div[contains(@class,'select-selector')]`
        );
    }

    getGridCellBorderStyleDropDownByPos(pos) {
        return this.$(
            `//div[contains(@class,'editor-segment') and descendant::div[contains(@class,'text-format')]]//div[contains(@class,'border-style-and-color') and descendant::div[contains(@class,'${pos}')]]//div[contains(@class,'ant-select-show-arrow')]`
        );
    }

    getCellBorderStyle(style) {
        return this.$(
            `//div[contains(@class,'select-dropdown') and not(contains(@class,'hidden'))]//span[contains(@class,'${style}')]/ancestor::div[contains(@class,'select-option')]`
        );
    }

    get gridCellBorderColorBtn1() {
        return this.$(
            `(//span[text()='Border']/ancestor::li[@class='vertical-list-items'])[5]/following-sibling::li//div[contains(@class,'color-picker-arrow-button')]`
        );
    }

    get gridCellBorderColorBtn2() {
        return this.$(
            `(//span[text()='Border']/ancestor::li[@class='vertical-list-items'])[4]/following-sibling::li//div[contains(@class,'color-picker-arrow-button')]`
        );
    }

    get gridCellBorderColorBtn3() {
        return this.$(
            `(//span[text()='Border']/ancestor::li[@class='vertical-list-items'])[6]/following-sibling::li//div[contains(@class,'color-picker-arrow-button')]`
        );
    }

    getGridCellBorderColorBtnByPos(pos) {
        return this.$(
            `//div[contains(@class,'editor-segment') and descendant::div[contains(@class,'text-format')]]//div[contains(@class,'border-style-and-color') and descendant::div[contains(@class,'${pos}')]]//div[contains(@class,'button-dropdown')]`
        );
    }

    get fontSelector() {
        return this.$(`//div[contains(@class,'select-font-name')]`);
    }

    get titleSelector() {
        return this.$(
            `//div[contains(@class,'title-font-content')]//div[contains(@class,'dropdown-menu-control-box')]`
        );
    }

    getTextFontOption(font) {
        return this.$(
            `//div[contains(@class,'ant-select-dropdown')]//div[contains(@class,'list')]//div[text()='${font}']`
        );
    }

    getFontStyleTab(style) {
        return this.$(`//span[contains(@class,'font-style') and contains(@class,'${style}')]`);
    }

    getTitleOption(style) {
        return this.$(
            `//div[contains(@class,'title-font-content')]//div[contains(@class, 'dropdown-menu-option-list')]//span[contains(@class,'dropdown-menu-option-display-name') and text()='${style}']`
        );
    }

    getButtonLabelOption(label) {
        return this.$(
            `//div[contains(@class,'ant-select-dropdown-placement-bottomLeft') and not(contains(@class, 'ant-select-dropdown-hidden'))]//span[text()='${label}']`
        );
    }

    get textFontSizeInput() {
        return this.$(`//div[contains(@class,'size-and-color')]//input[contains(@class,'ant-input-number-input')]`);
    }

    get fontColorBtn() {
        return this.$(`//div[contains(@class,'font-layout')]//div[contains(@class,'color-picker-arrow-button')]`);
    }

    get fillTitleBackgroundBtn() {
        return this.$(
            `//div[contains(@class,'_2item-1vs2-stretch')]//div[contains(@class,'color-picker-arrow-button')]`
        );
    }

    get fillColor() {
        return this.cellsSection.$$('.mstr-color-picker-dropdown .button-dropdown')[0];
    }

    get containerFillColorBtn() {
        return this.$(
            `//div[contains(@class,'container-fill-opacity-layout')]//div[contains(@class,'color-picker-arrow-button')]`
        );
    }

    get borderColorBtn() {
        return this.$(
            `(//span[text()='Border']/ancestor::li[@class='vertical-list-items'])[2]/following-sibling::li//div[contains(@class,'color-picker-arrow-button')]`
        );
    }

    getColorPickerModeBtn(mode) {
        return this.$(`//div[contains(@class,'color-picker-toolbar')]//label[contains(@class,'${mode}')]`);
    }

    getBuiltInColor(color) {
        return this.$(`//div[contains(@class,'color-picker-dropdown')]//button[@aria-label='${color}']`);
    }

    get colorPaletteHexInput() {
        return this.$(`//div[contains(@class,'palette-picker')]//div[@class='hex-input']//input`);
    }

    get colorPaletteRInput() {
        return this.$$(`.rgba-input input`)[0];
    }

    get colorPaletteGInput() {
        return this.$$(`.rgba-input input`)[1];
    }

    get colorPaletteBInput() {
        return this.$$(`.rgba-input input`)[2];
    }

    get colorPaletteAInput() {
        return this.$$(`.rgba-input input`)[3];
    }

    get noFillColorButton() {
        return this.$(`//div[@class='no-fill-text-container']/button[@title='No Fill']`);
    }

    getFontAlign(align) {
        return this.$(`//div[contains(@class,'font-style-icons') and contains(@class,'${align}')]`);
    }

    getFontAlignButton(align) {
        return this.$(
            `//div[contains(@class,'font-style-icons') and contains(@class,'${align}')]//parent::span//preceding-sibling::span`
        );
    }

    getVerticalAlign(align) {
        return this.$(`//div[contains(@class,'vertical-align-icons') and contains(@class,'${align}')]`);
    }

    getCellPadding(padding) {
        return this.$(`//div[contains(@class,'cell-padding-icons') and contains(@class,'${padding}')]`);
    }

    getCellPaddingButton(padding) {
        return this.$(
            `//div[contains(@class,'cell-padding-icons') and contains(@class,'${padding}')]//parent::span//preceding-sibling::span`
        );
    }

    getSizeDropDown() {
        return this.$(`//div[contains(@class,'select-dropdown')]`);
    }

    getColumnSizeBtn(isAgGrid) {
        let path = `(//div[contains(@class,'grid-layout')]//div[contains(@class,'format-select')])[1]`;
        if (isAgGrid) {
            path = `//div[contains(@aria-label, 'Column width')]//div[contains(@class,'ant-select-selector')]`;
        }
        return this.$(path);
    }

    getArrangementBtn() {
        return this.$(
            `//div[contains(@class,'element select format-select')]//div[contains(@class,'ant-select-selector')]`
        );
    }

    getSectionFormatItem(sectionName, label) {
        return this.getSectionByName(sectionName).$(
            `.//div[contains(@class,'mstr-editor-text')]//span[text()='${label}']//ancestor::li[contains(@class,'vertical-list-items')][1]`
        );
    }

    getColorArrowInSectionItem(sectionName, label) {
        return this.getSectionFormatItem(sectionName, label).$(`.//div[contains(@class,'color-picker-arrow-button')]`);
    }

    getColorInSectionItem(sectionName, label) {
        return this.getSectionFormatItem(sectionName, label).$(
            `.//div[contains(@class, 'mstr-color-picker-dropdown')]//div[contains(@class, 'button-dropdown')]`
        );
    }

    getNumberInputInSectionItem(sectionName, label) {
        return this.getSectionFormatItem(sectionName, label).$(
            `.//div[contains(@class, 'mstr-number-input-container')]//input[contains(@class, 'ant-input-number-input')]`
        );
    }

    getSelectorInSectionItem(sectionName, label) {
        return this.getSectionFormatItem(sectionName, label).$(
            `.//div[contains(@class, 'ant-select-selector')]//span[contains(@class, 'ant-select-selection-item')]//span[contains(@class, 'mstr-editor-select')]`
        );
    }

    getSelectorArrowInSectionItem(sectionName, label) {
        return this.getSectionFormatItem(sectionName, label).$(`.//span[contains(@class, 'ant-select-arrow')]`);
    }

    getSelectorOptionInSectionItem(style) {
        return this.$(
            `//div[contains(@class,'select-dropdown') and not(contains(@class,'hidden'))]//span[contains(@class,'${style}')]/ancestor::div[contains(@class,'select-option')]`
        );
    }

    getRadiusOptionInSectionItem(sectionName, label, option) {
        return this.getSectionFormatItem(sectionName, label).$(
            `./following-sibling::li//div[contains(@class, 'mstr-editor-radio')]//div[contains(@id,'radio-option') and @aria-label='${option}']`
        );
    }

    getItemLabelInSection(sectionName, label) {
        return this.getSectionByName(sectionName).$(
            `.//div[contains(@class,'mstr-editor-text')]//span[text()='${label}']`
        );
    }

    getSelectedRadiusOptionInSectionItem(sectionName, label, option) {
        return this.getRadiusOptionInSectionItem(sectionName, label, option).$(
            `.//ancestor::label[contains(@class, 'ant-radio-button-wrapper-checked')][1]`
        );
    }

    getAlignmentOptionInSectionItem(sectionName, label, option) {
        return this.getSectionFormatItem(sectionName, label).$(
            `./following-sibling::li//div[contains(@class, 'mstr-editor-radio')]//div[contains(@id,'radio-option')]//div[contains(@class,'font-style-icons align-${option.toLowerCase()}')]`
        );
    }

    getSelectedAlignmentOptionInSectionItem(sectionName, label, option) {
        return this.getAlignmentOptionInSectionItem(sectionName, label, option).$(
            `.//ancestor::label[contains(@class, 'ant-radio-button-wrapper-checked')][1]`
        );
    }

    getArrangementOption(option) {
        return this.$(`//div[contains(@class,'select-dropdown')]//span[text()='${option}']`);
    }

    getColumnSizeFitOption(fit) {
        return this.$(`//div[contains(@class,'select-dropdown')]//span[text()='${fit}']`);
    }

    getCurrentColumnSizeFit(fit) {
        return this.$(
            `//span[text()='Column width']/parent::div/../parent::li//following-sibling::li//span[contains(@class, 'grid-fit')]//following-sibling::span[text()='${fit}']`
        );
    }

    get columnSizeTargetBtn() {
        return this.$(`//div[contains(@class,'column-select')]`);
    }

    getColumnSizeTarget(target) {
        return this.$(`//div[contains(@class,'select-dropdown')]//span[text()='${target}']`);
    }

    get columnSizeFixedInput() {
        return this.$(`.column-height-input input`);
    }

    getRowSizeBtn(isAgGrid) {
        let path = `(//div[contains(@class,'grid-layout')]//div[contains(@class,'format-select')])[2]`;
        if (isAgGrid) {
            path = `//div[contains(@aria-label, 'Row size')]//div[contains(@class,'ant-select-selector')]`;
        }
        return this.$(path);
    }

    getRowSizeFitOption(fit) {
        return this.$(`(//div[contains(@class,'select-dropdown')])[2]//span[text()='${fit}']`);
    }

    get rowSizeFixedInput() {
        return this.$(`.row-height-input input`);
    }

    get titleBarToggleButton() {
        return this.$(`//div[contains(@class,'title-and-container')]//div[@class='toggle-button']`);
    }

    get titleButtonsToggleButton() {
        return this.$(`//div[contains(@class,'title-button-section')]//div[@class='toggle-button']`);
    }

    get containerBorderBox() {
        return this.$(
            `(//span[text()='Border']/ancestor::li[@class='vertical-list-items'])[2]/following-sibling::li//div[contains(@class,'select-selector')]`
        );
    }

    getContainerBorderStyle(style) {
        return this.$(
            `//div[contains(@class,'select-dropdown')]//span[contains(@class,'${style}')]/ancestor::div[contains(@class,'select-option')]`
        );
    }

    getButtonRadius(option) {
        return this.$(
            `//div[contains(@class,'title-button-section')]//div[contains(@class, 'toggle-button-radio')]//div[@aria-label="${option}"]`
        );
    }

    getButtonSize(size) {
        return this.$(
            `//div[contains(@class,'title-button-section')]//div[contains(@class, 'toggle-button-radio')]//div[@aria-label="${size}"]`
        );
    }

    getButtonFormatIcon(buttonName) {
        return this.$(
            `//div[contains(@class,'title-button-section')]//span[text()='${buttonName}']/ancestor::div[contains(@class,'title-button-layout')]//div[@class='format']`
        );
    }

    getButtonVisibleIcon(buttonName) {
        return this.$(
            `//div[contains(@class,'title-button-section')]//span[text()='${buttonName}']/ancestor::div[contains(@class,'title-button-layout')]//div[contains(@class,'button')]`
        );
    }

    getButtonFormatPopup() {
        return this.$(
            `//div[contains(@class,'action-btn-popover') and not(contains(@style,'none'))]//div[contains(@class,'ant-popover-content')]`
        );
    }

    get fillColorOpacity() {
        return this.$(
            `//div[contains(@class, '_2item-1vs2-stretch')]//div[@class='mstr-number-input-container']//input`
        );
    }

    get containerFillColorOpacity() {
        return this.$(
            `//div[contains(@class, 'container-fill-opacity-layout')]//div[@class='mstr-number-input-container']//input`
        );
    }

    get emptyTabContent() {
        return this.$(
            `//span[contains(@class, 'ant-typography') and text()='Add objects to the container to start formatting.']`
        );
    }

    get microChartLayout() {
        return this.$(`//div[@class='mstr-editor-hideable-layout ' and descendant::span[text()='Microcharts']]`);
    }

    get microChartHeightSliderHandle() {
        return this.$(
            `(//li[@class='vertical-list-items' and descendant::span[text()='Chart height']])[3]/following-sibling::li//div[@class='ant-slider-handle']`
        );
    }

    getMicroChartVerticalAlign(align) {
        return this.$(
            `//div[@class='mstr-editor-hideable-layout ' and descendant::span[text()='Microcharts']]//div[contains(@class,'vertical-align-icons') and contains(@class,'${align}')]`
        );
    }

    get microChartDPToggleBtn() {
        return this.$(
            `//div[@class='mstr-editor-hideable-layout ' and descendant::span[text()='Microcharts']]//div[@class = 'toggle-button']`
        );
    }

    get microChartDPSelectorArrow() {
        return this.$(
            `//div[@class='mstr-editor-hideable-layout ' and descendant::span[text()='Microcharts']]//div[contains(@class,'ant-select-show-arrow')]`
        );
    }

    getMicroChartDPSelection(selection) {
        return this.$(`//div[contains(@class,'ant-select-dropdown')]//span[text()='${selection}']`);
    }

    getMicroChartDPKeyDPOption(option) {
        return this.$(`//div[@class='microchart-data-points']//span[@role='${option}']`);
    }

    getActionButtonDisplayMsgInput() {
        return this.$(`//div[contains(@class, 'mstr-editor-input')]//input[@class='ant-input']`);
    }

    async switchToTab(tabName, waitLoading = true) {
        await this.click({ elem: this.getFormatTab(tabName) });
        if (waitLoading) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async clickSectionTitle(sectionName) {
        await this.click({ elem: await this.getSectionTitle(sectionName) });
    }

    async selectGridTemplateColor(color) {
        await this.click({ elem: this.getGridTemplateColor(color) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async selectGridTemplateStyle(style) {
        await this.click({ elem: this.getGridTemplateStyle(style) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    /**
     * Layout section
     */
    async clickCheckBox(checkBoxName) {
        await this.click({ elem: await this.getCheckBox(checkBoxName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    /**
     * Spacing section
     */
    async selectCellPadding(padding) {
        await this.click({ elem: this.getCellPadding(padding) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickColumnSizeBtn(isAgGrid) {
        await this.clickByForce({ elem: this.getColumnSizeBtn(isAgGrid) });
    }

    async clickArrangementBtn() {
        await this.click({ elem: this.getArrangementBtn() });
    }

    async clickColumnSizeFitOption(fit, isAgGrid = true) {
        await this.scrollIntoView(this.getColumnSizeBtn(isAgGrid));
        if (!(await this.getSizeDropDown().isDisplayed())) {
            await this.clickColumnSizeBtn(isAgGrid);
        }
        await this.click({ elem: this.getColumnSizeFitOption(fit) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickColumnSizeTargetBtn() {
        await this.click({ elem: this.columnSizeTargetBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickColumnSizeTargetOption(target) {
        await this.click({ elem: this.getColumnSizeTarget(target) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setFixedInches(inches, elInchesInput) {
        const el = await elInchesInput;
        await el.waitForDisplayed({ timeout: 5000 });
        await browser.execute((el) => el.focus(), el);
        await browser.pause(500);
        await browser.keys([Key.Ctrl, 'a']);
        await browser.keys([Key.Backspace]);
        await el.addValue(inches);
        await browser.keys([Key.Enter]);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setColumnSizeFixedInches(inches) {
        await this.setFixedInches(inches, this.columnSizeFixedInput);
    }

    async setRowSizeFixedInches(inches) {
        await this.setFixedInches(inches, this.rowSizeFixedInput);
    }

    async clickRowSizeBtn(isAgGrid) {
        await this.click({ elem: this.getRowSizeBtn(isAgGrid) });
    }

    async clickRowSizeFitOption(fit) {
        await this.click({ elem: this.getRowSizeFitOption(fit) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Text format tab
     */
    async selectGridSegment(option) {
        await this.moveToPosition({ x: 0, y: 0 });
        await this.click({ elem: this.gridSegmentDropDown });
        await this.click({ elem: this.getGridSegmentOrBorderOrientationFromDropDown(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectGridColumns(columnSet) {
        await this.click({ elem: this.gridColumnsDropDown });
        await this.click({ elem: this.getGridSegmentOrBorderOrientationFromDropDown(columnSet) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changeGridElement(option) {
        await this.click({ elem: await this.gridElementDropdown });
        await this.selectFromGridELDropdownReact(option);
    }

    async changeColumnSet(option) {
        await this.click({ elem: this.gridColumnSetDropdown });
        await this.selectFromGridELDropdownReact(option);
    }

    async selectFromGridELDropdownReact(option) {
        const el = await this.getGridElementOption(option);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTextFont(font) {
        await this.clickOnElement(this.fontSelector);
        const elFontOption = await this.getTextFontOption(font);
        await this.click({ elem: elFontOption });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectFontStyle(style) {
        await this.click({ elem: this.getFontStyleTab(style) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTitleOption(option) {
        await this.clickOnElement(this.titleSelector);
        await this.click({ elem: this.getTitleOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setTextFontSize(size) {
        const elFontSizeInput = await this.textFontSizeInput;
        await this.baseFormatPanel.clearAndSetValue(elFontSizeInput, size);
    }

    async clickFontColorBtn() {
        await this.click({ elem: await this.fontColorBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickColorPickerModeBtn(mode) {
        await this.click({ elem: this.getColorPickerModeBtn(mode) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(240);
    }

    async clickBuiltInColor(color) {
        await this.sleep(1);
        await this.click({ elem: await this.getBuiltInColor(color) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(240);
    }

    async setColorPaletteHex(hex) {
        const hexInput = await this.colorPaletteHexInput;
        await this.baseFormatPanel.clearAndSetValue(hexInput, hex);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setColorPaletteRGB(r, g, b, a = null) {
        const rInput = await this.colorPaletteRInput;
        const gInput = await this.colorPaletteGInput;
        const bInput = await this.colorPaletteBInput;
        await this.setValueByJavaScript({ element: rInput, value: r });
        await this.setValueByJavaScript({ element: gInput, value: g });
        await this.setValueByJavaScript({ element: bInput, value: b });
        if (a) {
            const aInput = await this.colorPaletteAInput;
            await this.setValueByJavaScript({ element: aInput, value: a });
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setNoFillColor() {
        await this.click({ elem: this.noFillColorButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectFontAlign(align) {
        await this.click({ elem: await this.getFontAlign(align) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(6000);
    }

    async clickCellFillColorBtn() {
        await this.click({ elem: this.cellFillColorBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changeCellsFillColor(color) {
        const el = await this.cellFillColorBtn;
        await this.click({ elem: el });
        await this.clickBuiltInColor(color);
    }

    async changeCellFillColorOpacity(opacity) {
        await this.sleep(1);
        const el = await this.fillColorOpacity;
        await el.waitForDisplayed({ timeout: 5000 });
        await browser.execute((el) => el.focus(), el);
        await browser.pause(500);
        await browser.keys([Key.Ctrl, 'a']);
        await browser.keys([Key.Backspace]);
        await el.addValue(opacity);
        await browser.keys([Key.Enter]);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async getCellOpacityOnReactPanel() {
        const el = await this.fillColorOpacity;
        const value = await this.getBrowserData('return arguments[0].value', el);
        return value;
    }

    async selectVerticalAlign(align) {
        await this.click({ elem: await this.getVerticalAlign(align) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Grid Cell Border
     */
    async selectCellBorderOrientation(option) {
        let ori = await this.gridCellBorderOrienDropDown2;
        let present = await ori.isDisplayed();
        if (!present) {
            ori = await this.gridCellBorderOrienDropDown1;
            present = await ori.isDisplayed();
        }
        await this.click({ elem: ori });
        await this.click({ elem: this.getGridSegmentOrBorderOrientationFromDropDown(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openCellBorderStyleDropDown() {
        let pd = await this.gridCellBorderStyleDropDown;
        let present = await pd.isDisplayed();
        if (!present) {
            pd = await this.gridCellBorderStyleDropDown2;
            present = await pd.isDisplayed();
        }
        if (!present) {
            pd = await this.gridCellBorderStyleDropDown3;
        }
        await this.click({ elem: pd });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openCellBorderStyleDropDownByPos(pos) {
        const pd = await this.getGridCellBorderStyleDropDownByPos(pos);
        await this.click({ elem: pd });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectCellBorderStyle(style) {
        const borderStyle = await this.getCellBorderStyle(style);
        await this.click({ elem: borderStyle });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickCellBorderColorBtn() {
        let btn = await this.gridCellBorderColorBtn1;
        let present = await btn.isDisplayed();
        if (!present) {
            btn = await this.gridCellBorderColorBtn2;
            present = await btn.isDisplayed();
        }
        if (!present) {
            btn = await this.gridCellBorderColorBtn3;
        }
        await this.click({ elem: btn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickCellBorderColorBtnByPos(pos) {
        const btn = await this.getGridCellBorderColorBtnByPos(pos);
        await this.click({ elem: btn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Text and Format -> Action Button
     */
    async setColorInSectionItem(sectionName, label, color) {
        const el = await this.getColorArrowInSectionItem(sectionName, label);
        await this.click({ elem: el });
        await this.selectAdvancedColorBuiltInSwatchReact(color);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setNumberInputInSectionItem(sectionName, label, value) {
        const el = await this.getNumberInputInSectionItem(sectionName, label);
        await this.clear(el, { x: -10 });
        await browser.keys(value);
        await browser.keys(Key.Enter);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setSelectorOptionInSectionItem(sectionName, label, style) {
        const el = await this.getSelectorArrowInSectionItem(sectionName, label);
        await el.click({ x: -2 });
        const option = await this.getSelectorOptionInSectionItem(style);
        await this.click({ elem: option });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setRadiusInSectionItem(sectionName, label, option) {
        const el = await this.getRadiusOptionInSectionItem(sectionName, label, option);
        await this.click({ elem: el });
        const itemLabel = await this.getItemLabelInSection(sectionName, label);
        await this.click({ elem: itemLabel });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setAlignmentInSectionItem(sectionName, label, option) {
        const el = await this.getAlignmentOptionInSectionItem(sectionName, label, option);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setArrangement(option) {
        if (!(await this.getArrangementOption(option).isDisplayed())) {
            await this.clickArrangementBtn();
        }
        await this.click({ elem: this.getArrangementOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
    /**
     * Title and Container tab
     */
    async toggleShowHeaders() {
        await this.click({ elem: this.showHeadersToggleButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async toggleTitleBar() {
        await this.click({ elem: await this.titleBarToggleButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async toggleTitles() {
        await this.click({
            elem: this.$(`(//div[contains(@class,'title-and-container')]//div[@class='toggle-button'])[2]`),
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async toggleTitleButtons() {
        await this.click({ elem: this.titleButtonsToggleButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickTitleBackgroundColorBtn() {
        await this.click({ elem: this.fillTitleBackgroundBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickContainerFillColorBtn() {
        await this.click({ elem: this.containerFillColorBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openContainerBorderPullDown() {
        await this.click({ elem: this.containerBorderBox });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectBorderStyle(style) {
        await this.click({ elem: this.getContainerBorderStyle(style) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickContainerBorderColorBtn() {
        await this.click({ elem: this.borderColorBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changeContainerFillColorOpacity(opacity) {
        await this.sleep(1);
        const el = await this.containerFillColorOpacity;
        await this.doubleClickOnElement(el);
        await this.clear(el);
        await el.setValue(opacity + '\n');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async enableBanding() {
        await this.clickCheckBox('Enable banding');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectButtonRadius(option) {
        await this.click({ elem: this.getButtonRadius(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectButtonSize(size) {
        await this.click({ elem: this.getButtonSize(size) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickButtonFormatIcon(buttonName) {
        await this.click({ elem: this.getButtonFormatIcon(buttonName) });
        await this.waitForElementVisible(this.getButtonFormatPopup());
    }

    async clickButtonVisibleIcon(buttonName) {
        await this.click({ elem: this.getButtonVisibleIcon(buttonName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async isButtonVisible(buttonName) {
        const el = await this.getButtonVisibleIcon(buttonName);
        const classes = await el.getAttribute('class');
        if (classes == 'button-visible') {
            return true;
        } else if (classes == 'button-invisible') {
            return false;
        }
        return null;
    }

    /**
     * Button Format Popup
     */
    async setButtonAlias(alias) {
        const el = await this.getButtonFormatPopup();
        const input = await el.$(`.//span[text()='Alias']/ancestor::div[contains(@class,'button-alias')]//input`);
        await this.baseFormatPanel.clearAndSetValue(input, alias);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setButtonLabelOption(option) {
        const el = await this.getButtonFormatPopup();
        const label = await el.$(`.//div[contains(@class,'title-button-label-type')]`);
        await this.clickOnElement(label);
        await this.click({ elem: this.getButtonLabelOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setExportButtonOption(option) {
        const el = await this.getButtonFormatPopup();
        const exportOption = await el.$(`.//div[contains(@class,'export-button-options')]`);
        await this.clickOnElement(exportOption);
        await this.click({ elem: this.getButtonLabelOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectButtonTextFont(font) {
        const el = await this.getButtonFormatPopup();
        const fontSelector = await el.$(`.//div[contains(@class,'select-font-name')]`);
        await this.clickOnElement(fontSelector);
        const elFontOption = await this.getTextFontOption(font);
        await this.click({ elem: elFontOption });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectButtonTextFontStyle(style) {
        const el = await this.getButtonFormatPopup();
        const styleTab = await el.$(`.//span[contains(@class,'font-style') and contains(@class,'${style}')]`);
        await this.click({ elem: styleTab });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickButtonTextFontColorBtn() {
        const el = await this.getButtonFormatPopup();
        const fontColorBtn = await el.$(
            `.//div[contains(@class,'font-layout')]//div[contains(@class,'color-picker-arrow-button')]`
        );
        await this.click({ elem: fontColorBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickButtonIconColorBtn() {
        const el = await this.getButtonFormatPopup();
        const iconColorBtn = await el.$(
            `.//span[text()="Icon"]/ancestor::div[contains(@class,'mstr-editor-horizontal-layout')]//div[contains(@class,'color-picker-arrow-button')]`
        );
        await this.click({ elem: iconColorBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickButtonBackgroundColorBtn() {
        const el = await this.getButtonFormatPopup();
        const fillTitleBackgroundBtn = await el.$(
            `.//div[contains(@class,'color-picker-opacity-layout')]//div[contains(@class,'color-picker-arrow-button')]`
        );
        await this.click({ elem: fillTitleBackgroundBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openButtonBorderPullDown() {
        const el = await this.getButtonFormatPopup();
        const containerBorderBox = await el.$(
            `.//span[text()='Border']/ancestor::li[@class='vertical-list-items']//div[@aria-label="Border"]//div[contains(@class,'select-selector')]`
        );
        await this.click({ elem: containerBorderBox });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectButtonBorderStyle(style) {
        const el = await this.$(
            `.//div[contains(@class,'select-dropdown') and not(contains(@class,'ant-select-dropdown-hidden'))]//span[contains(@class,'${style}')]/ancestor::div[contains(@class,'select-option')]`
        );
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickButtonBorderColorBtn() {
        const el = await this.getButtonFormatPopup();
        const borderColorBtn = await el.$(
            `.//span[text()='Border']/ancestor::li[@class='vertical-list-items']//div[contains(@class,'color-picker-arrow-button')]`
        );
        await this.click({ elem: borderColorBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changeButtonFillColorOpacity(opacity) {
        await this.sleep(1);
        const formatpopup = await this.getButtonFormatPopup();
        const el = await formatpopup.$(
            `.//div[contains(@class, '_2item-1vs2-stretch')]//div[@class='mstr-number-input-container']//input`
        );
        await el.waitForDisplayed({ timeout: 5000 });
        await browser.execute((el) => el.focus(), el);
        await browser.pause(500);
        await browser.keys([Key.Ctrl, 'a']);
        await browser.keys([Key.Backspace]);
        await el.addValue(opacity);
        await browser.keys([Key.Enter]);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * MicroCharts
     */
    async changeMicroChartAlign(align) {
        await this.click({ elem: this.getMicroChartVerticalAlign(align) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async toggleDPSpots() {
        await this.click({ elem: this.microChartDPToggleBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changeDPSelection(selection) {
        await this.click({ elem: this.microChartDPSelectorArrow });
        await this.click({ elem: this.getMicroChartDPSelection(selection) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectKeyDPOption(option) {
        await this.click({ elem: this.getMicroChartDPKeyDPOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async moveChartHeightSlider(direction, pixels) {
        direction = direction.toLowerCase();
        const sliderHandle = await this.microChartHeightSliderHandle;
        const numOfPixels = direction === 'left' ? -pixels : pixels;
        await this.dragAndDropByPixel(sliderHandle, numOfPixels, 0, true);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async expandLayoutSection(languageOption = Locales.English) {
        await this.clickSectionTitle(ReportEditorStringLabels[languageOption].Layout);
    }

    async expandSpacingSection(languageOption = Locales.English) {
        await this.clickSectionTitle(ReportEditorStringLabels[languageOption].Spacing);
    }

    async expandTemplateSection(languageOption = Locales.English) {
        await this.clickSectionTitle(ReportEditorStringLabels[languageOption].Template);
    }

    async switchToGridTab() {
        await this.switchToTab('grid', false);
    }

    async switchToTextFormatTab() {
        await this.switchToTab('text-format', false);
        // dismiss tooltip
        await this.moveToPosition({ x: 0, y: 0 });
    }

    async switchToTitleContainerTab() {
        await this.switchToTab('title-container', false);
    }

    async enableWrapText() {
        if (!(await this.isCheckBoxChecked('Wrap text'))) {
            await this.clickCheckBox('Wrap text');
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async disableWrapText() {
        if (await this.isCheckBoxChecked('Wrap text')) {
            await this.clickCheckBox('Wrap text');
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async enableOutline() {
        await this.clickCheckBox('Enable outline');
    }

    async textFontSizeInputValue() {
        const el = await this.textFontSizeInput;
        return await el.getValue();
    }

    async isFontAlignButtonSelected(align) {
        const el = await this.getFontAlignButton(align);
        const classes = await el.getAttribute('class');
        return classes.includes('ant-radio-button-checked');
    }

    async isFontAlignButtonDisabled(align) {
        const el = await this.getFontAlignButton(align);
        const classes = await el.getAttribute('class');
        return classes.includes('ant-radio-button-disabled');
    }

    async isCheckBoxChecked(checkBoxName) {
        const checkbox = await this.getCheckBox(checkBoxName);
        const classes = await checkbox.getAttribute('class');
        return classes.includes('ant-checkbox-checked');
    }
}
