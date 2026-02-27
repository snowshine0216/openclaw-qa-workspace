import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import VizPanelForGrid from './VizPanelForGrid.js';
import AdvancedFilter from './AdvancedFilter.js';
import Common from './Common.js';
import Grid from '../visualization/Grid.js';
import FontPicker from '../common/FontPicker.js';
import { Key } from 'webdriverio';
const ADVANCED_THRESHOLD = 'advanced';

/**
 * Page represing the threshold editor
 * @extends BasePage
 * @author Yanping Chen <yanpchen@microstrategy.com>
 */
export default class ThresholdEditor extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
        this.vizPanelForGrid = new VizPanelForGrid();
        this.advancedFilter = new AdvancedFilter();
        this.grid = new Grid();
        this.fontPicker = new FontPicker('.format.mstrmojo-vi-PropEditor');
    }

    //ELEMENT LOCATORS

    /**
     * Get the rever botton which can revert the sequence of colors/images in the color band or image band
     */
    get simpleThresholdColorRevertButton() {
        return this.$(
            "//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//div[contains(@class,'mstrmojo-Box row') and contains(@style,'block')]//div[contains(@class,'reverse-btn')]//div[@class='mstrmojo-Button-text ']"
        );
    }

    /**
     * Get the pulldown of the color band in the simple threshold editor
     */
    get getColorBandPullDown() {
        return this.$(
            "//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//div[contains(@class,'mstrmojo-Box row')]//div[contains(@class,'mstrmojo-ui-Pulldown color-pulldown')]"
        );
    }

    /**
     * Get the pulldown of the image band in the simple threshold editor
     */
    get getImageBandPullDown() {
        return this.$(
            "//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//div[contains(@class,'mstrmojo-Box row')]//div[contains(@class,'mstrmojo-ui-Pulldown image-pulldown')]"
        );
    }

    /**
     * Get the based on object pulldown in the simple threshold editor
     */
    get simpleThresholdBasedonObjectPullDown() {
        return this.$(
            "//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//div[contains(@class,'mstrmojo-Box row')]//div[contains(@class,'left-pulldown')]"
        );
    }

    /**
     * Get the based on option pulldown in the simple threshold editor
     */
    get simpleThresholdBasedonOptionPullDown() {
        return this.$(
            "//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//div[contains(@class,'mstrmojo-Box row')]//div[contains(@class,'right-pulldown')]"
        );
    }

    /**
     * Get the break by object pulldown in the simple threshold editor
     */
    get simpleThresholdBreakByPullDown() {
        return this.$(
            "//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//div[contains(@class,'mstrmojo-Box row')]//div[contains(@class,'mstrmojo-Label') and text()='Break By:']/following-sibling::div[contains(@class,'Pulldown')]"
        );
    }

    /**
     * Get the new condition button in the advanced threshold editor
     */
    get addNewThresholdConditionButton() {
        return this.$("//div[contains(@class,'adv-threshold')]//div[text()='New Threshold']");
    }

    getAddNewThresholdConditionButtonI18N(name) {
        return this.$(`//div[contains(@class,'adv-threshold')]//div[text()='${name}']`);
    }

    /**
     * get the dialog for the advanced threshold editor
     */
    get advancedThresholdEditor() {
        return this.$(
            ".//div[contains(@id, 'mstrmojo-advanced-threshold-editor')]//div[contains(@class, 'adv-threshold')]"
        );
    }

    getSimpleThresholdEditor() {
        return this.$(
            "//div[contains(@class, 'mstrmojo-SimpleThresholdEditor')]"
        );
    }

    /**
     * Get the button in simple threshold editor, including "Apply","OK" and "Cancel"
     * @param {string} buttonName
     */
    getSimThresEditorButton(buttonName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//div[contains(@class,'mstrmojo-Button-text') and text()='${buttonName}']`
        );
    }

    /**
     * Get the simple threshold type
     * @param {string} thresholdType    Color or Image
     */
    getSimpleThresholdsType(thresholdType) {
        return this.$(`//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//span[text()='${thresholdType}']`);
    }

    /**
     * Get the color band from the popup list in the simple threshold editor
     * @param {string} colorBandName
     */
    getColorBandinPopupList(colorBandName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//div[contains(@class,'mstrmojo-Box row')]//div[contains(@class,'mstrmojo-PopupList')]//div[text()='${colorBandName}']`
        );
    }

    /**
     * Get the based on object from the popup list in the simple threshold editor
     * @param {string} objectName
     */
    getSimThresholdBasedonObjectFromPopupList(objectName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//div[contains(@class,'mstrmojo-Box row')]//div[contains(@class,'left-pulldown')]//div[contains(@class,'popupList')]//div[text()='${objectName}']`
        );
    }

    /**
     * Get threshold conditions in the advanced thresholds editor
     * @param {Number} orderNum
     */
    getThresholdConditionByOrderNumber(orderNum) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-thresholdRow') and contains(@class, 'cf')][${orderNum}]//span[contains(@class, 'mstrmojo-cond-text') and contains(@class, 'mstrmojo-textset')]`
        );
    }

    /**
     * Get the format preview button in the advanced thresholds editor
     * @param {Number} orderNum
     */
    getFormatPreviewPanelByOrderNumber(orderNum) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-thresholdRow') and contains(@class, 'cf')][${orderNum}]//div[contains(@class, 'previewWrap')]`
        );
    }

    /** Returns attribute elements from right column container in the Edit Condition editor
     */
    getAttributeElementFromColumnContainer(elementName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-fm2')]//div[contains(@class, 'item') and child::span[contains(@class,'text') and text()='${elementName}']]`
        );
    }

    /**
     * Get the based on option from the popup list in the simple threshold editor
     * @param {string} optionName
     */
    getSimThresholdBasedonOptionFromPopupList(optionName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//div[contains(@class,'mstrmojo-Box row')]//div[contains(@class,'right-pulldown')]//div[contains(@class,'popupList')]//div[text()='${optionName}']`
        );
    }

    /**
     * Get the break by object from the popup list in the simple threshold editor
     * @param {string} objectName
     */
    getSimThresholdBreakByObjectFromPopupList(objectName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//div[contains(@class,'mstrmojo-Box row')]//div[contains(@class,'mstrmojo-Label') and text()='Break By:']/following-sibling::div[contains(@class,'Pulldown')]//div[text()='${objectName}']`
        );
    }

    /**
     * Get the link to switch between simple and advanced threshold editor
     * @param {string} simOrAdv    "Advanced" or "Quick"
     */
    getThresholdSwitchButton(simOrAdv) {
        return this.$(
            `//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//div[contains(@class,'mstrmojo-Editor-buttons')]//div[text()='${simOrAdv}` +
                ` Thresholds Editor...']`
        );
    }

    /**
     * Get new threshold condition item by index
     * @param {Number} index - item index
     */
    getThresholdConditionItemByIndex(index) {
        return this.$(`(//div[contains(@class,'mstrmojo-thresholdRow cf ')])[${index}]`);
    }

    getThresholdConditionAttrByIndex(index, textStr) {
        return this.getThresholdConditionItemByIndex(index).this.$(
            `.//span[contains(@class,'attr') and text() = '${textStr}']`
        );
    }

    getThresholdConditionAttrFormByIndex(index, textStr) {
        return this.getThresholdConditionItemByIndex(index).this.$(
            `.//span[contains(@class,'form') and text() = '${textStr}']`
        );
    }

    getThresholdConditionFunctionByIndex(index, textStr) {
        return this.getThresholdConditionItemByIndex(index).this.$(
            `.//span[contains(@class,'fn') and text() = '${textStr}']`
        );
    }

    getThresholdConditionElementByIndex(index, textStr) {
        return this.getThresholdConditionItemByIndex(index).this.$(
            `.//span[contains(@class,'mstrmojo-text mstrmojo-elem') and text() = '${textStr}']`
        );
    }

    getThresholdQualificationByIndex(index, textStr) {
        return this.getThresholdConditionItemByIndex(index).this.$(
            `.//span[contains(@class,'mstrmojo-text mstrmojo-c1') and text() = '${textStr}']`
        );
    }

    /**
     * Get the button in the warning dialog which will show up when switch from simple threshold editor to advanced threshold editor, or vice versa
     * @param {string} buttonName
     */
    getThresholdWarningButton(buttonName) {
        return this.$(`//div[contains(@class,'save-threshold-warning')]//div[text()='${buttonName}']`);
    }

    /**
     * Get the marker area for adding a random handler in the simple thresholds editor
     */
    getMarkersArea() {
        return this.$(`//div[contains(@class, 'mstrmojo-Editor-content')]//div[contains(@class, 'markers')]`);
    }

    /**
     * Get the fill color panel in the format preview panel
     */
    getFillColorPanel() {
        return this.$(
            `//div[contains(@class, 'border')]//div[contains(@class, 'mstrmojo-vi-TwoColumnProp')]//div[@class='mstrmojo-ui-PreviewButton mstrmojo-ColorPickerBtn']`
        );
    }

    /**
     * Select a fill color in the format preview panel by colorName
     * @param {String} colorName
     */
    getFillColorByColorName(colorName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-PreviewButton')]//div[contains(@class,'mstrmojo-ui-AdvColorPickerPopup') and contains(@style, 'display: block;')]//div[@title = '${colorName}']`
        );
    }

    getFillColorOpacityInput() {
        return this.$(
            `//div[contains(@class,'mstrmojo-threshold-PropertyPanel')]//input[contains(@class,'TextBox') and contains(@class,'right')]`
        );
    }

    /**
     * Get the checkMark button in the format preview panel
     */
    getCheckMark() {
        let path = `//div[contains(@class, 'scroll-container mstrmojo-scrollNode')]//div[contains(@class, 'mstrmojo-threshold-PropertyPanel')]//div[contains(@class, 'mstrmojo-Button okBtn')]`;
        //if(browsers.params.environment.npmMode === "mac workstation"){
        //  path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default')
        //}
        return this.$(path);
    }

    /**
     * Get the cancel button in the format preview panel
     */
    getCancelMark() {
        let path = `//div[contains(@class, 'scroll-container mstrmojo-scrollNode')]//div[contains(@class, 'mstrmojo-threshold-PropertyPanel')]//div[contains(@class, 'mstrmojo-Button cancelBtn')]`;
        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }
        return this.$(path);
    }

    /**
     * Get OK button in the advanced thresholds editor
     */
    getOKButtonFromAdvancedThresholdsEditor() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Editor') and contains(@class, 'adv-threshold modal')]//div[contains(@class, 'mstrmojo-Button mstrmojo-WebButton hot')][1]`
        );
    }

    /**
     * Get marker area by the index number
     */
    getMarkerByIndexNum(indexNum) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Editor-content')]//div[contains(@class, 'markers')]//div[contains(@class, 'marker')][${indexNum}]`
        );
    }

    /**
     * Get current editable bubble
     */
    getEditableBubble() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-EditableLabel') and contains(@class, 'editable-bubble') and contains(@class, 'hasEditableText')][1]`
        );
    }

    /**
     * Get the color band by the index number
     */
    getColorBandByIndexNumber(indexNum) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-color-slider ')]//div[contains(@class, 'color-band') and contains(@class, 'mstrmojo-ui-PreviewButton') and contains(@class, 'mstrmojo-ColorPickerBtn')][${indexNum}]`
        );
    }

    /**
     * Get color band option by option name
     */
    getColorBandOptionByOptionName(optionName) {
        return this.$(`//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]//div[text()='${optionName}']`);
    }

    /**
     * Get color for color band by the color name
     */
    getColorForColorBand(colorName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-PreviewButton mstrmojo-ColorPickerBtn mojo-theme-light')]//div[contains(@class, 'mstrmojo-ui-AdvColorPicker mstrmojo-ui-AdvColorPickerPopup')]//div[contains(@class,'acpContent')]//div[contains(@title, '${colorName}')]`
        );
    }

    /**
     * Get Enable Data Replace Checkbox
     */
    getEnableDataReplaceCheckBox() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-vi-PropEditor') and contains(@class, 'format')]//div[contains(@class, 'text')]//div[contains(@class, 'vi-col1')]`
        );
    }

    /**
     * Get the data replace drop down menu in the threshold format editor
     */
    getDataReplaceDropDownMenu() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-vi-PropEditor') and contains(@class, 'format')]//div[contains(@class, 'text')]//div[contains(@class, 'mstrmojo-Box')]//div[@class='mstrmojo-ui-Pulldown'][1]`
        );
    }

    /**
     * Get the option from the data replace drop menu by the option name
     */
    getDataReplaceOptionFromDropDownMenu(optionName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-vi-PropEditor') and contains(@class, 'format')]//div[contains(@class, 'text')]//div[contains(@class, 'mstrmojo-PopupList')]//div[text()='${optionName}']`
        );
    }

    /**
     * Get the text box for "Replace Text" and "Replace With Image" option
     */
    getTextBoxInFormatEditor() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-vi-PropEditor') and contains(@class, 'format')]//div[contains(@class, 'text')]//input[contains(@class, 'mstrmojo-TextBox')]`
        );
    }

    /**
     * Get the button bar option in the format editor: bold, italic, underline and strikeout
     */
    getButtonBarOptionInFormatEditor(optionName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-vi-EditorGroup') and contains(@class, 'font')]//div[contains(@class, '${optionName}')]`
        );
    }

    /**
     * get three dots menu by the order number
     * @param {Number}orderNum
     */
    getThreeDotsMenuByOrderNumber(orderNum) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-thresholdRow') and contains(@class, 'cf')][${orderNum}]//div[contains(@class, 'menu')]`
        );
    }

    /**
     * get delete button for each threshold condition by its order number
     * @param {Number}orderNum
     */
    getDeleteButtonForThresholdConditionByOrderNumber(orderNum) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-thresholdRow') and contains(@class, 'cf')][${orderNum}]//div[contains(@class, 'delete')]`
        );
    }

    /**
     * get the option from the secondary menu "Apply to" by option name
     * @param {String} optionName
     */
    getApplyToOptionByOptionName(optionName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-scrollNode')]//div[text()='${optionName}']`
        );
    }

    /**
     * get the option from three dots menu by option name
     * @param {String} optionName
     */
    getOptionFromThreeDotsMenu(optionName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]//div[text() = '${optionName}']`
        );
    }

    /**
     * get the Quick Symbol drop down menu
     */
    getQuickSymbolDropDownMenu() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-vi-PropEditor') and contains(@class, 'format')]//div[contains(@class, 'text')]//div[contains(@class, 'mstrmojo-Box')]//div[@class='mstrmojo-ui-Pulldown'][2]`
        );
    }

    /**
     * get quick symbol by the index number
     * @param {Number} index
     */
    getQuickSymbolWithIndexNumber(index) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'ctrl-popup-list')]//div[@idx='${index}']`
        );
    }

    /**
     * get font family dropdown menu
     */
    getFontFamilyDropdownMenu() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-vi-EditorGroup') and contains(@class, 'font')]//div[contains(@class, 'mstrmojo-ui-EditCharacter')]//div[@class='mstrmojo-FontPicker']`
        );
    }

    /**
     * get font by font name
     * @param {String} fontName
     */
    getFontSelectionByFontName(fontName) {
        return this.$(
            `(//div[contains(@class, 'mstr-rc-font-selector__dropdown')]//div[contains(@class, 'ant-select-item-option-content')]//div[text()='${fontName}'])[last()]`
        );
    }

    getFontSelectorDropdown() {
        return this.$(`(//div[contains(@class, 'mstr-rc-font-selector__dropdown')])[last()]`);
    }

    /**
     * get font size dropdown menu button
     */
    getFontSizeDropdownMenuBtn() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-vi-TwoColumnProp')]//div[contains(@class, 'mstrmojo-ui-ComboBox') and contains(@class, 'mstrmojo-ui-PreviewButton')]//div[contains(@class, 'btn')]`
        );
    }

    /**
     * get font size by font size number
     */
    getFontSizeBySizeNumber(sizeNum) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'ctrl-popup-list')]//div[text() = '${sizeNum}']`
        );
    }

    /**
     * get font color dropdown menu button
     *
     */
    getFontColorDropdownMenuBtn() {
        return this.$(
            `//div[contains(@class, 'font')]//div[contains(@class, 'mstrmojo-vi-TwoColumnProp')]//div[contains(@class, 'mstrmojo-ColorPickerBtn')]//div[contains(@class, 'btn')]`
        );
    }

    /**
     * get font color by color name
     */
    getFontColorByColorName(colorName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-ui-AdvColorPickerPopup')]//div[@title='${colorName}']`
        );
    }

    /**
     * get outer border line style dropdown menu
     */
    getOuterBorderDropdownMenu() {
        return this.$(
            `//div[contains(@class, 'border')]//div[contains(@class, 'mstrmojo-ui-LineStyle')]//div[contains(@class, 'btn')]`
        );
    }

    /**
     * get outer border color dropdown menu
     */
    getOuterBorderColorDropdownMenu() {
        return this.$(
            `//div[contains(@class, 'border')]//div[contains(@class, 'mstrmojo-vi-TwoColumnProp')][2]//div[contains(@class, 'mstrmojo-ColorPickerBtn')]`
        );
    }

    /**
     * get outer border line style option by index number
     * @param {Number} indexNum
     */
    getOuterBorderOptionByIndexNumber(indexNum) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted') and contains(@class, 'mstrmojo-ui-LineStyle')]//div[contains(@class, 'mstrmojo-PopupList')]//div[@idx='${indexNum}']`
        );
    }

    /**
     * get outer border color by color name
     * @param {String} colorName
     */
    getOuterBorderColorByColorName(colorName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted') and contains(@class, 'disabled')]//div[@title='${colorName}']`
        );
    }

    get columnSetPullDownTextField() {
        return this.$(
            `//div[contains(@class,'mstrmojo-columnset-pulldown')]//div[contains(@class,'mstrmojo-ui-Pulldown-text')]`
        );
    }

    getColumnSetPullDownItem(item) {
        return this.$(
            `//div[contains(@class,'mstrmojo-columnset-pulldown')]//div[contains(@class,'mstrmojo-popupList-scrollBar')]//div[@role='menuitem' and text()='${item}']`
        );
    }

    get microchartFillColorPanel() {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-ui-ToolBarFillGroup')]//div[@class='mstrmojo-ui-PreviewButton mstrmojo-ColorPickerBtn'])[last()]`
        );
    }

    getEnableAllowUsersCheckBox(item) {
        let path =
            "//div[contains(@class,'mstrmojo-SimpleThresholdEditor')]//div[contains(@class, 'allowThresholdCheckbox')]//div[contains(@class, 'mstrmojo-ui-Checkbox')]";
        if (item === ADVANCED_THRESHOLD) {
            path = path.replace('mstrmojo-SimpleThresholdEditor', 'adv-threshold');
        }
        return this.$(path);
    }

    getAttributeByAttributeName(item) {
        return this.$(
            `//div[contains(@class,'mstrmojo-vi-ui-ConditionEditor')]//div[contains(@class,'mstrmojo-ui-ColumnContainer lastStage')]//div[contains(@class,'mstrmojo-ui-CheckList')]//span[text()='${item}']/parent::div`
        );
    }

    get optionSample() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-thresholdRow') and contains(@class, 'cf')]//div[text()='Sample']`
        );
    }

    get opacityInput() {
        return this.$(
            `//div[contains(@class, 'border')]//div[contains(@class, 'mstrmojo-vi-TwoColumnProp')]//div[contains(@class, 'mstrmojo-vi-TwoColumnProp')]//div[contains(@class, 'vi-col1')]//input`
        );
    }

    getOptionAttributeFromDropdown(elementName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-PopupList') and contains(@style,'display: block;')]//div[contains(@class, 'mstrmojo-popupList-scrollBar') and contains(@class, 'mstrmojo-scrollNode')]//div//div[contains(@class, 'item unit') and text()='${elementName}']`
        );
    }

    get formatPreviewPanelOkButton() {
        return this.$(
            `//div[contains(@class, 'scroll-container mstrmojo-scrollNode')]//div[contains(@class, 'mstrmojo-threshold-PropertyPanel')]//div[contains(@class, 'mstrmojo-Button okBtn')]`
        );
    }

    getCloseBtn() {
        return this.$('.edt-title-btn.mstrmojo-Editor-close');
    }

    /**
     * delete one threshold condition by its order number
     * @param {Number}orderNum
     */
    async deleteThresholdConditionByOrderNumber(orderNum) {
        await this.click({ elem: this.getDeleteButtonForThresholdConditionByOrderNumber(orderNum) });
    }

    /**
     * open outer border line style dropdown menu
     */
    async openOuterBorderDropdownMenu() {
        await this.click({ elem: this.getOuterBorderDropdownMenu() });
    }

    /**
     * open outer border color dropdown menu
     */
    async openOuterBorderColorPickerDropdownMenu() {
        await this.click({ elem: this.getOuterBorderColorDropdownMenu() });
    }

    /**
     * select outer border line style by index number, which is zero-based
     * @param {Number} indexNum
     */
    async selectOuterBorderOptionByIndexNumber(indexNum) {
        await this.click({ elem: this.getOuterBorderOptionByIndexNumber(indexNum) });
    }

    /**
     * select outer border color by color name
     * @param {String} colorName
     */
    async selectOuterBorderColorByColorName(colorName) {
        await this.click({ elem: this.getOuterBorderColorByColorName(colorName) });
    }

    /**
     * open font size dropdown menu
     */
    async openFontSizeDropdownMenu() {
        await this.click({ elem: this.getFontSizeDropdownMenuBtn() });
    }

    /**
     * select font size by size number
     * @param {Number} sizeNum
     */
    async selectFontSizeBySizeNumber(sizeNum) {
        await this.click({ elem: this.getFontSizeBySizeNumber(sizeNum) });
    }

    /**
     * open font color dropdown menu
     */
    async openFontColorDropdownMenu() {
        await this.click({ elem: this.getFontColorDropdownMenuBtn() });
    }

    /**
     * select font color by color name
     * @param {String} colorName
     */
    async selectFontColorByColorName(colorName) {
        await this.click({ elem: this.getFontColorByColorName(colorName) });
    }

    /**
     * select font by font name
     * @param {String} fontName
     */
    async selectFontByFontName(fontName) {
        await this.click({ elem: this.getFontSelectionByFontName(fontName) });
    }

    /**
     * open font family dropdown menu
     */
    async openFontFamilyDropdownMenu() {
        await this.click({ elem: this.getFontFamilyDropdownMenu() });
    }

    /**
     * select quick symbol by the index number
     * @param {Number} index
     */
    async selectQuickSymbolByIndexNumber(index) {
        await this.click({ elem: this.getQuickSymbolWithIndexNumber(index) });
    }

    /**
     * Open Quick Symbol Dropdown Menu
     */
    async openQuickSymbolDropDownMenu() {
        await this.click({ elem: this.getQuickSymbolDropDownMenu() });
    }

    /**
     *Input text into an empty text box (this case is different from rename, which requires deletion first and then type new name)
     * @param {String} message
     */
    async inputInTextBox(message) {
        const textbox = await this.getTextBoxInFormatEditor();
        await this.hoverMouseAndClickOnElement(textbox);
        await this.input(message);
        await this.enter();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    /**
     *Replace text into an text box in format preview editor
     * @param {String} message
     */
    async replaceInTextBox(message) {
        const textbox = this.getTextBoxInFormatEditor();
        await this.hoverMouseAndClickOnElement(textbox);
        await this.clear({ elem: textbox });
        await this.input(message);
        await this.enter();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    /**
     * Select option from the secondary menu "Apply to" in three dots menu
     * @param {String} optionName
     * @param {Number} orderNum
     */
    async selectApplyToOptionFromThreeDotsMenu(optionName, orderNum) {
        const menu = this.getThreeDotsMenuByOrderNumber(orderNum);
        await this.click({ elem: menu });
        await this.click({ elem: this.getOptionFromThreeDotsMenu('Apply to') });
        await this.click({ elem: this.getApplyToOptionByOptionName(optionName) });
    }

    /**
     * Select  secondary option from the three dots menu for threshold conditions
     * @param {String} optionName
     * @param {Number} orderNum
     */
    async selectSecondaryOptionInMenuForThresholdConditions(secondaryOp, orderNum) {
        const menu = this.getThreeDotsMenuByOrderNumber(orderNum);
        await this.click({ elem: menu });
        await this.click({ elem: this.getOptionFromThreeDotsMenu(secondaryOp) });
    }

    /**
     * Select option from "Replace Data" drop down menu
     * @param {String} optionName
     */
    async clickOnOptionOnTheFontButtonBar(optionName) {
        await this.click({ elem: this.getButtonBarOptionInFormatEditor(optionName) });
    }

    /**
     * Select option from "Replace Data" drop down menu
     */
    async selectOptionFromDataReplaceDropdownMenu(optionName) {
        await this.click({ elem: this.getDataReplaceDropDownMenu() });
        await this.click({ elem: this.getDataReplaceOptionFromDropDownMenu(optionName) });
    }

    /**
     * Click the Enable Data Replace check box
     */
    async clickOnEnableDataReplaceCheckBox() {
        await this.click({ elem: this.getEnableDataReplaceCheckBox() });
    }

    /**
     * Add a color band by RMC a color band by index number
     * @param {Number} indexNum
     */
    async addColorBandByRMCColorBand(indexNum) {
        const colorBand = this.getColorBandByIndexNumber(indexNum);
        await this.rightMouseClickOnElement(colorBand);
        const addOption = this.getColorBandOptionByOptionName('Add Color Band');
        await this.click({ elem: addOption });
    }

    /**
     * Get the current editable bubble and change its value
     * @param {Number} indexNum
     * @param {Number} value
     */
    async getMarkerAndChangeValue(indexNum, value) {
        let marker = await this.getMarkerByIndexNum(indexNum);
        await this.hoverMouseAndClickOnElement(marker);
        await this.click({ elem: await this.getEditableBubble() });
        let elEditingTextField = await this.common.editingTextField;
        await this.hoverMouseAndClickOnElement(elEditingTextField);
        await this.clear({ elem: elEditingTextField });
        await this.input(value);
        await this.enter();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Change color for the selected color band
     * @param {Number} indexNum
     * @param {String} colorName
     */
    async changeColorForColorBand(colorName, indexNum) {
        const colorBand = this.getColorBandByIndexNumber(indexNum);
        await this.rightMouseClickOnElement(colorBand);
        const changeColorOption = this.getColorBandOptionByOptionName('Change Color');
        await this.click({ elem: changeColorOption });
        await this.click({ elem: this.getColorForColorBand(colorName) });
    }

    /**
     * Delete color band by index number
     * @param {Number} indexNum
     */
    async deletColorBandByIndexNumber(indexNum) {
        const colorBand = this.getColorBandByIndexNumber(indexNum);
        await this.rightMouseClickOnElement(colorBand);
        const changeColorOption = this.getColorBandOptionByOptionName('Delete');
        await this.click({ elem: changeColorOption });
    }

    /**
     * Add a random handler in the simple threshold editor
     */
    async addHandlerInTheMiddleArea() {
        await this.click({ elem: this.getMarkersArea() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * drag and move a marker to the middle area
     * @param {Number} indexNum
     */
    async dragAndMoveMarker(indexNum) {
        const markerElement = this.getMarkerByIndexNum(indexNum);
        const markerArea = this.getMarkersArea();
        await this.dragAndDrop(markerElement, { x: 0, y: 0 }, markerArea, { x: 0, y: 0 });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Open the format preview panel by order number
     * @param {Number} orderNum
     */
    async openFormatPreviewPanelByOrderNumber(orderNum) {
        await this.click({ elem: this.getFormatPreviewPanelByOrderNumber(orderNum) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Open threshold condition by order number
     * @param {Number} orderNum
     */
    async openThresholdConditionByOrderNumber(orderNum) {
        await this.click({ elem: this.getThresholdConditionByOrderNumber(orderNum) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * select and set a fill color in the format preview panel by the colorName
     * @param {String} colorName
     */
    async setFillColor(colorName) {
        await this.click({ elem: this.getFillColorPanel() });
        await this.click({ elem: this.getFillColorByColorName(colorName) });
    }

    async setFillColorOpacity(opacity) {
        let el = await this.getFillColorOpacityInput();
        await this.doubleClickOnElement(el);
        await browser.keys([Key.Backspace]);
        await el.setValue(opacity + '\n');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Click the check mark in the format preview panel to save change
     */
    async clickOnCheckMarkOnFormatPreviewPanel() {
        await this.click({ elem: this.getCheckMark() });
    }

    /**
     * Click the cancel mark in the format preview panel to save change
     */
    async clickOnCancelMarkOnFormatPreviewPanel() {
        await this.click({ elem: this.getCancelMark() });
    }

    /** Select attribute elements from the column container
     * @param {String} elementNames - Attribute element names
     */
    async selectAttributeElementFromColumnContainer(elementName) {
        const attrEle = this.getAttributeElementFromColumnContainer(elementName);
        await this.click({ elem: attrEle });
    }

    /**
     * Click OK button in the advanced thresholds editor
     */
    async saveAndCloseAdvancedThresholdEditor() {
        await this.click({ elem: this.getOKButtonFromAdvancedThresholdsEditor() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Save and close simple threshold editor
     */
    async saveAndCloseSimThresholdEditor() {
        await this.click({ elem: this.getSimThresEditorButton('OK') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * open threshold editor from the object in visualization
     * @param {string} objectName - name of object to open the threshold editor
     * @param {string} visualizationName - name of the visualization
     */
    async openThresholdEditorFromViz(objectName, visualizationName) {
        await this.grid.openGridElmContextMenu({ title: visualizationName, headerName: objectName });
        let option = await this.vizPanelForGrid.getContextMenuOption('Thresholds...');
        const isPresent = await option.isDisplayed();
        if (!isPresent) {
            option = await this.vizPanelForGrid.getContextMenuOption('Edit Thresholds...');
        }
        await this.click({ elem: option });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Clear the thresholds setting for an object in a visualization
     * @param {String} objectName
     * @param {String} visualizationName
     */
    async clearThresholdFromViz(objectName, visualizationName) {
        await this.grid.openGridElmContextMenu({ title: visualizationName, headerName: objectName });
        await this.click({ elem: this.vizPanelForGrid.getContextMenuOption('Clear Thresholds') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * open threshold editor from the object in certain column set in the compound grid from the dropzone
     * @param {string} columnSet
     * @param {string} objectName
     */
    async openThresholdEditorFromCompoundGridDropzone(objectName, columnSet) {
        let objectElement;
        if (columnSet) {
            objectElement = await this.vizPanelForGrid.getObjectInColumnSetDropZone(objectName, columnSet);
        } else {
            objectElement = await this.vizPanelForGrid.getObjectInDropZone(objectName, 'Rows');
        }

        await this.rightMouseClickOnElement(objectElement);
        let option = await this.vizPanelForGrid.getContextMenuOption('Thresholds...');
        const isPresent = await option.isDisplayed();
        if (!isPresent) {
            option = await this.vizPanelForGrid.getContextMenuOption('Edit Thresholds...');
        }
        await this.click({ elem: option });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    /**
     * Clears the thresholds on a header by right clicking the header in the grid
     * @param {string} headerName name of the header you want to clear the thresholds
     * @param {string} visualizationName name of the visualization that contains the header
     * @author Eduardo Alcazar-Bustillos <ebustillos@microstrategy.com>
     */
    async clearThresholds(headerName, visualizationName) {
        await this.rightClickOnHeader(headerName, visualizationName);
        await this.click({ elem: this.common.getContextMenuItem('Clear Thresholds') });
    }

    /**
     * Switch between color-based and image-based
     * @param {string} thresholdsType    "color" or "image"
     */
    async switchSimpleThresholdsType(thresholdsType) {
        const type = thresholdsType.toLowerCase();
        if (type === 'color') {
            await this.click({ elem: this.getSimpleThresholdsType('Color-based') });
        } else if (type === 'image') {
            await this.click({ elem: this.getSimpleThresholdsType('Image-based') });
        }
    }

    async switchSimpleThresholdsTypeI18N(thresholdsType) {
        await this.click({ elem: this.getSimpleThresholdsType(thresholdsType) });
        await browser.pause(500);
    }

    /**
     * Click the revert button to revert the color/image sequence of the color band/image band
     */
    async revertThresholdColorBand() {
        await this.click({ elem: this.simpleThresholdColorRevertButton });
    }

    /**
     * Open the color band drop down menu
     */
    async openSimpleThresholdColorBandDropDownMenu() {
        await this.click({ elem: this.getColorBandPullDown });
        await browser.pause(500);
    }

    /**
     * Select the color band from the pulldown list
     * @param {string} colorBandName
     */
    async selectSimpleThresholdColorBand(colorBandName) {
        await this.click({ elem: this.getColorBandinPopupList(colorBandName) });
    }

    /**
     * Open the simple threshold image band drop down menu
     */
    async openSimpleThresholdImageBandDropDownMenu() {
        await this.click({ elem: this.getImageBandPullDown });
        await browser.pause(500);
    }

    async openAndSelectSimpleThresholdColorBand(colorBandName) {
        await this.openSimpleThresholdColorBandDropDownMenu();
        await this.selectSimpleThresholdColorBand(colorBandName);
    }

    /**
     * Select the image band from the pulldown list
     * @param {string} imageBandName
     */
    async selectSimpleThresholdImageBand(imageBandName) {
        await this.click({ elem: this.getColorBandinPopupList(imageBandName) });
    }

    /**
     * Select the object to based on for the simple threshold
     * @param {string} objectName
     */
    async selectSimpleThresholdBasedOnObject(objectName) {
        await this.click({ elem: this.simpleThresholdBasedonObjectPullDown });
        await this.click({ elem: this.getSimThresholdBasedonObjectFromPopupList(objectName) });
    }

    /**
     * Select the based on option for the simple threshold
     * @param {string} optionName    "Highest","Lowest","Higest 100%" or "Lowest 100%"
     */
    async selectSimpleThresholdBasedOnOption(optionName) {
        await this.click({ elem: this.simpleThresholdBasedonOptionPullDown });
        await this.click({ elem: this.getSimThresholdBasedonOptionFromPopupList(optionName) });
    }

    /**
     * Select the break by object for the simple threshold
     * @param {string} objectName
     */
    async selectSimpleThresholdBreakByObject(objectName) {
        await this.click({ elem: this.simpleThresholdBreakByPullDown });
        await this.click({ elem: this.getSimThresholdBreakByObjectFromPopupList(objectName) });
    }

    /**
     * Apply the existing threshold when switching from simple threshold editor to advanced threshold editor
     */
    async switchSimToAdvThresholdWithApply() {
        await this.click({ elem: this.getThresholdSwitchButton('Advanced') });
        await this.click({ elem: this.getThresholdWarningButton('Apply') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Don't apply the existing threshold when switching from simple threshold editor to advanced threshold editor
     * */
    async switchSimToAdvThresholdWithClear() {
        await this.click({ elem: this.getThresholdSwitchButton('Advanced') });
        await this.click({ elem: this.getThresholdWarningButton('Clear') });
    }

    /**
     * Apply the existing threshold when switching from advanced threshold editor to simple threshold editor
     */
    async switchAdvToSimThresholdWithApply() {
        await this.click({ elem: this.getThresholdSwitchButton('Quick') });
        await this.click({ elem: this.getThresholdWarningButton('Apply') });
    }

    /**
     *Don't Apply the existing threshold when switching from advanced threshold editor to simple threshold editor
     */
    async switchAdvToSimThresholdWithClear() {
        await this.click({ elem: this.getThresholdSwitchButton('Quick') });
        await this.click({ elem: this.getThresholdWarningButton('Clear') });
    }

    /**
     * Open the new threshold condition editor in advanced threshold editor, by clicking on the "New Threshold" button
     */
    async openNewThresholdCondition() {
        await this.click({ elem: this.addNewThresholdConditionButton });
    }

    async openNewThresholdConditionI18N(name) {
        await this.click({ elem: this.getAddNewThresholdConditionButtonI18N(name) });
    }

    /** Click "OK" button on New Condition Editor
     */
    async clickOnNewConditionEditorOkButton() {
        await this.advancedFilter.clickOnNewQualificationEditorOkButton();
    }

    /** Check new threshold condition item is created by index
     * @param {Number} index
     */
    async checkThresholdConditionByIndex(index) {
        let element = await this.getThresholdConditionItemByIndex(index);
        return await element.isDisplayed();
    }

    async clickThresholdConditionByIndex(index) {
        let element = await this.getThresholdConditionItemByIndex(index);
        await this.click({ elem: element });
    }

    async openColumnSetPullDown() {
        await this.click({ elem: this.columnSetPullDownTextField });
    }

    async selectColumnSet(columnSet) {
        await this.click({ elem: this.getColumnSetPullDownItem(columnSet) });
    }

    async openThresholdEditorFromMicroChart(microchartName) {
        await this.rightMouseClickOnElement(this.vizPanelForGrid.getMicrochartDropZone(microchartName));
        let option = await this.vizPanelForGrid.getContextMenuOption('Thresholds...');
        const isPresent = await option.isDisplayed();
        if (!isPresent) {
            option = await this.vizPanelForGrid.getContextMenuOption('Edit Thresholds...');
        }
        await this.click({ elem: option });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openMicrochartFillColor() {
        await this.click({ elem: this.microchartFillColorPanel });
    }

    async setMicrochartFillColor(colorName) {
        await this.click({ elem: this.microchartFillColorPanel });
        await this.click({ elem: this.getFillColorByColorName(colorName) });
        let okBtn = this.$(
            `(//div[contains(@class,'mstrmojo-Button') and contains(@style,'display: inline-block')]/div[contains(@class, 'mstrmojo-Button-text') and text()='OK'])[last()]`
        );
        await this.click({ elem: okBtn });
    }

    async clickOnEnableAllowUsersCheckBox(item) {
        await this.click({ elem: this.getEnableAllowUsersCheckBox(item) });
    }

    async checkAttributeName(item) {
        await this.click({ elem: this.getAttributeByAttributeName(item) });
    }

    async selectOptionSample() {
        await this.click({ elem: this.optionSample });
    }

    async setOpacityPercentage(value) {
        const opacityInput = await this.opacityInput;
        await this.click({ elem: opacityInput });
        await this.clear({ elem: opacityInput });
        await this.doubleClick({ elem: opacityInput });
        await opacityInput.setValue(value);
    }

    async selectOptionAttributeFromDropdown(elementName) {
        await this.click({ elem: this.getOptionAttributeFromDropdown(elementName) });
    }

    async clickFormatPreviewPanelOkButton() {
        await this.click({ elem: this.formatPreviewPanelOkButton });
    }

    /**
     * close thresholds editor
     */
    async closeThresholdEditor() {
        await this.click({ elem: this.getCloseBtn() });
    }
}
