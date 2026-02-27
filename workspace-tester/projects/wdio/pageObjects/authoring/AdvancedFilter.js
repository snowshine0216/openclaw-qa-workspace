import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import BaseContainer from './BaseContainer.js';
const attributeLogicalOperatorItem = {
    EQUALS: 'Equals',
    DOES_NOT_EQUAL: 'Does not equal',
    GREATER_THAN: 'Greater than',
    GREATER_THAN_OR_EQUAL_TO: 'Greater than or equal to',
    LESS_THAN: 'Less than',
    LESS_THAN_OR_EQUAL_TO: 'Less than or equal to',
    BETWEEN: 'Between',
    NOT_BETWEEN: 'Not between',
    CONTAINS: 'Contains',
    DOES_NOT_CONTAIN: 'Does not contain',
    BEGINS_WITH: 'Begins with',
    DOES_NOT_BEGIN_WITH: 'Does not begin with',
    ENDS_WITH: 'Ends with',
    DOES_NOT_END_WITH: 'Does not end with',
    LIKE: 'Like',
    NOT_LIKE: 'Not Like',
    IS_NULL: 'Is Null',
    IS_NOT_NULL: 'Is Not Null',
    IN: 'In',
    NOT_IN: 'Not In',
};

const metricLogicalOperatorItemByValue = {
    EQUALS: 'Equals',
    DOES_NOT_EQUAL: 'Does not equal',
    GREATER_THAN: 'Greater than',
    GREATER_THAN_OR_EQUAL_TO: 'Greater than or equal to',
    LESS_THAN: 'Less than',
    LESS_THAN_OR_EQUAL_TO: 'Less than or equal to',
    BETWEEN: 'Between',
    NOT_BETWEEN: 'Not between',
    IS_NULL: 'Is Null',
    IS_NOT_NULL: 'Is Not Null',
};

const metricLogicalOperatorItemByRank = {
    HIGHEST: 'Highest',
    LOWEST: 'Lowest',
    HIGHEST_PERCENTAGE: 'Highest %',
    LOWEST_PERCENTAGE: 'Lowest%',
    RANK_BETWEEN_HIGHEST: 'Rank between highest',
    EXCLUDE_HIGHEST: 'Exclude highest',
    RANK_BETWEEN_LOWEST: 'Rank between lowest',
    EXCLUDE_LOWEST: 'Exclude lowest',
    BETWEEN_HIGHEST_PERCENTAGE: 'Between highest%',
    EXCLUDE_HIGHEST_PERCENTAGE: 'Exclude highest%',
    BETWEEN_LOWEST_PERCENTAGE: 'Between lowest%',
    EXCLUDE_LOWEST_PERCENTAGE: 'Exclude lowest%',
};

/**
 * Page representing the Advanced Filter
 * @extends BasePage
 * @author: Jiefu Liang<jiefuliang@microstrategy.com>
 */
export default class AdvancedFilter extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.baseContainer = new BaseContainer();
    }

    // ELEMENT LOCATORS
    // Get active editor in case there are multiple ones in DOM
    get AdvancedFilterEditor() {
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor mstrmojo-charcoalboxe mstrmojo-FE mstrmojo-vi-ui-FE modal') and contains(@style, 'display: block')]`
        );
    }

    /** Returns "New Qualification" editor
     */
    get addNewQualificationButton() {
        return this.AdvancedFilterEditor.$(`.//div[@aria-label= 'Add New Qualification']`);
    }

    /** Returns an element to help close dropdown
     */
    get closeAllDropDownLabel() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Label') and contains(@class, 'baseOn') and contains(@style, 'display: block;') and ancestor::div[ancestor::div[contains(@class, 'mstrmojo-ui-ColumnContainer')]]]`
        );
    }

    // Get active editor in case there are multiple ones in DOM
    get NewQualificationPopup() {
        return this.$(
            `//div[contains(@class,'mstrmojo-vi-ui-ConditionEditor modal') and contains(@style, 'display: block')]`
        );
    }

    /** Returns option item from "Based On" dropdown
     */
    get basedOnDropdown() {
        return this.NewQualificationPopup.$('.mstrmojo-ui-Pulldown-text.hasEditableText');
    }

    /** Returns "Choose elements by" dropdown
     */
    get chooseElementsByDropdown() {
        return this.NewQualificationPopup.$(
            `.//div[text()='Choose elements by']//following-sibling::div[contains(@class, 'mstrmojo-ui-Pulldown') and contains(@style, 'display: block;')]`
        );
    }

    getChooseElementsByDropdownI18N(optionName) {
        return this.NewQualificationPopup.$(
            `.//div[text()='${optionName}']//following-sibling::div[contains(@class, 'mstrmojo-ui-Pulldown') and contains(@style, 'display: block;')]`
        );
    }

    /** Returns "Value" textbox
     */
    get valueTextBox() {
        return this.$(
            `(//input[contains(@class, 'mstrmojo-TextBox') and ancestor::div[contains(@class, 'mstrmojo-Box') and preceding-sibling::div[contains(@class, 'mstrmojo-Label baseOn')]]])[1]`
        );
    }

    /** Returns "and" textbox
     */
    get andTextBox() {
        return this.$(
            `(//input[contains(@class, 'mstrmojo-TextBox') and ancestor::div[contains(@class, 'mstrmojo-Box') and preceding-sibling::div[contains(@class, 'mstrmojo-Label baseOn')]]])[2]`
        );
    }

    get dateValueTextBox() {
        return this.$(
            `(//input[contains(@class, 'mstrmojo-DateTextBox-input') and ancestor::div[contains(@class, 'mstrmojo-Box') and preceding-sibling::div[contains(@class, 'mstrmojo-Label baseOn')]]])[1]`
        );
    }

    get parameterTextBox() {
        //return this.$(`//div[contains(@class,'mstrmojo-Box') and contains(@style, "display: block;")]//div[contains(@class, 'conditionWalk-parameterPulldown')]/div`);
        return this.$(
            `//div[contains(@class,'mstrmojo-vi-ui-ConditionEditor') and contains(@style,'display: block;')]//div[contains(@class,'mstrmojo-Box') and contains(@style,'display: block;')]//div[contains(@class, 'conditionWalk-parameterPulldown') and contains(@style, 'display: block;')]/div[@class='mstrmojo-ui-Pulldown-text ']`
        );
    }

    getParameterfromPulldown(parameterObject) {
        return this.$(
            `//div[contains(@class,'mstrmojo-Box') and contains(@style, "display: block;")]//div[contains(@class, 'conditionWalk-parameterPulldown')]/div[@class='container']//div[contains(@class,'mstrmojo-PopupList') and contains(@style,'display: block;')]//div[text()='${parameterObject}']`
        );
    }

    /** Returns "Attribute" dropdown
     */
    get attributeDropdown() {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-ui-Pulldown-text') and ancestor::div[contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'conditionWalk-attMxPd')]])[1]`
        );
    }

    /** Returns "Metric" dropdown
     */
    get metricDropdown() {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-ui-Pulldown-text') and ancestor::div[contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'conditionWalk-attMxPd')]])[1]`
        );
    }

    /** Returns "OK" button on "New Qualification" editor
     */
    get newQualificationOkButton() {
        //return this.$(`//div[contains(@class, 'mstrmojo-Button-text') and ancestor::div[contains(@class, 'mstrmojo-Button') and contains(@class, 'mstrmojo-WebButton') and contains(@class, 'hot') and contains(@class, 'mstrmojo-Editor-button')]]`))
        return this.$(
            `//div[contains(@class, 'mstrmojo-Editor mstrmojo-vi-ui-ConditionEditor modal') and contains(@style,'display: block')]//div[contains(@class, 'mstrmojo-WebButton') and contains(@class, 'hot') and contains(@class, 'mstrmojo-Editor-button')]`
        );
    }

    /** Returns "Cancel" button on "New Qualification" editor
     */
    get newQualificationCancelButton() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Editor mstrmojo-vi-ui-ConditionEditor modal') and contains(@style,'display: block')]//div[contains(@class, 'mstrmojo-WebButton') and contains(@aria-label, 'Cancel')]`
        );
    }

    /** Returns "Save" button on advanced filter editor
     */
    get advancedFilterEditorSaveButton() {
        //return this.$(`(//div[contains(@class,'mstrmojo-Editor mstrmojo-charcoalboxe mstrmojo-FE mstrmojo-vi-ui-FE modal') and contains(@style, 'display: block')]//div[contains(@class, 'mstrmojo-Button-text')])[2]`);
        return this
            .$(`(//div[contains(@class,'mstrmojo-Editor mstrmojo-charcoalboxe mstrmojo-FE mstrmojo-vi-ui-FE modal') and contains(@style, 'display: block')]/div[contains(@class,'mstrmojo-Editor-content')]/following-sibling::div[contains(@class,'mstrmojo-Editor-buttons')]//div[contains(@class, 'mstrmojo-Button-text')])[1]
`);
    }

    /** Returns "Cancel" button on advanced filter editor
     */
    get advancedFilterEditorCancelButton() {
        return this.AdvancedFilterEditor.$(`.//div[@class= 'mstrmojo-Button-text ' and text() = 'Cancel']`);
    }

    /** Returns "Output Level" label after selecting metric
     */
    get outputLevelDropDown() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-Pulldown-text') and ancestor::div[preceding-sibling::div[text()='Output Level']]]`
        );
    }

    /** Returns "Operator" dropdown
     */
    get operatorDropdown() {
        //return this.$(`//div[contains(@class, 'mstrmojo-ui-Pulldown-text') and text()='By Value']`);
        return this.$(
            `//div[contains(@class,'mstrmojo-vi-ui-ConditionEditor') and contains(@style,'display: block;')]//div[contains(@class,'mstrmojo-ui-Pulldown-text') and text()='By Value']`
        );
    }

    /** Returns "New Qualification" editor attribute element search box
     */
    get newQualificationEditorELementSearchBox() {
        return this.$(`//input[contains(@class,'mstrmojo-TextBox') and contains(@class, 'eb-searchBox')]`);
    }

    /** Returns all attribute elements
     */
    get allFilteredAttributeElements() {
        return this.$$(
            `//span[contains(@class, 'text') and ancestor::div[contains(@class, 'icn') and contains(@class, 'disableSelected')]]`
        );
    }

    /** Returns View Selected button
     */
    get viewSelectedButton() {
        return this.$(`//div[contains(@class,'slider round')]`);
    }

    /** Returns Clear All button
     */
    get clearAllButton() {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-Button-text') and ancestor::div[contains(@class, 'mstrmojo-Button eb-clearAll')]])[1]`
        );
    }

    /** Returns hover filter icon
     */
    get hoverFilterIcon() {
        return this.$(
            `//div[contains(@class, 'hover-filter-btn') and contains(@class, 'hover-btn') and contains(@class,'visible')]`
        );
    }

    getVFItem(item) {
        return this.$(`//div[contains(@class,'viz-fe-menu') and contains(@class,'visible')]//div[text()='${item}']`);
    }

    /** Returns "Advanced Qualification" button
     */
    get advancedQualificationButton() {
        return this.$(
            `//div[contains(@class, 'mtxt') and ancestor::a[contains(@class, 'item') and contains(@class, 'mstrmojo-ui-Menu-item')]]`
        );
    }

    /** Returns "Create a Set" "OK" button
     */
    get createASetOKButton() {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-Button-text') and ancestor::div[contains(@class, 'mstrmojo-Editor') and contains(@class, 'VI-CreateSet-Editor') and contains(@class, 'modal')]])[1]`
        );
    }

    /** Returns "+" button for compound grid advanced filter editor
     */
    get plusButtonToOpenColumnSetAdvancedFilterEditor() {
        return this.$(`//div[contains(@class, 'mstrmojo-VITabStrip-addBtn-Text')]`);
    }

    /** Returns a specific filter item by index
     * @param {Number} index - index for an advanced filter
     */
    getFilterItemByIndex(index) {
        return this.$(
            `(//div[contains(@class,'mstrmojo-Editor') and contains(@style, 'display: block;')]//div[contains(@class, 'mstrmojo-onhoverparent mstrmojo-cond-contents')])[${index}]`
        );
    }

    getConditionObject(index, objectType, objectName) {
        return this.$(
            `(//div[contains(@class,'mstrmojo-Editor') and contains(@style,'display: block;')]//div[contains(@class, 'ConditionNode')])[${index}]//span[contains(@class,'mstrmojo-${objectType}') and text()='${objectName}']`
        );
    }

    getSetObject(index, objectName) {
        return this.$(
            `(//div[contains(@class, 'ConditionNode')])[${index}]//ancestor::div[contains(@class,'relationNode')]//div[contains(@class,'textset')]/span[text()='${objectName}']`
        );
    }

    /** Returns "Create a Set" button by index
     * @param {Number} index - index for "Create a Set" button
     * @return {Promise<ElementFinder>} corresponding button item
     */
    getCreateASetByIndex(index) {
        return this.$(
            `(//span[contains(@class, 'mstrmojo-textset') and contains(@class, 'mstrmojo-create-set-text') and ancestor::div[contains(@class, 'mstrmojo-onhoverparent mstrmojo-cond-contents')]])[${index}]`
        );
    }

    /** Returns "x" button by index
     * @param {Number} index - index for "Create a Set" button
     * @return {Promise<ElementFinder>} corresponding button item
     */
    getDeleteButtonByIndex(index) {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-onhoverparent mstrmojo-cond-contents')])[${index}]//img[contains(@class,'mstrmojo-del')]`
        );
    }

    /** Returns option item from "Create a Set" attribute list
     * @param {String} optionName - option name
     * @return {Promise<ElementFinder>} corresponding option item
     */
    getOptionFromCreateASetAttributeList(optionName) {
        return this.$(
            `//div[contains(@class,'VI-CreateSet-Editor') and contains(@style,'display: block;')]//div[contains(@class, 'item  t12')]/span[text()='${optionName}']`
        );
    }

    /** Returns "AND" logical operator button by index
     * @param {Number} index - index for logical operator dialog
     * @param {String} currOperator - current operator
     * @return {Promise<ElementFinder>}corresponding button item
     */
    getLogicalOperatorButtonBetweenFiltersByIndex(index, currOperator) {
        return this.$(
            `(//span[contains(@class, 'mstrmojo-text') and contains(@class, 'mstrmojo-andor') and text() = '${currOperator}' and ancestor::div[contains(@class, 'mstrmojo-cond') and contains(@class, 'mstrmojo-ConditionNode')]])[${index}]`
        );
    }

    /** Change logical operators between filters
     * @param {String} newOperator - new operator
     */
    getLogicalOpertorsItemFromContextMenu(newOperator) {
        return this.$(`//div[contains(@class, 'dial-item') and text()='${newOperator}']`);
    }

    // Element locators for New Qualification editor

    /** Returns options from "Based On" dropdown
     */
    getOptionFromBasedOnDropdown(elementName) {
        const path = `//div[contains(@class,'mstrmojo-PopupList') and contains(@style,'display: block;')]//div[contains(@class, 'mstrmojo-popupList-scrollBar') and contains(@class, 'mstrmojo-scrollNode')]//div//div[contains(@class, 'item unit') and text()='${elementName}']`;
        return this.$(path);
    }

    getParameterFromBasedOnDropdown(elementName) {
        const path = `//div[contains(@class,'mstrmojo-PopupList') and contains(@style,'display: block;')]//div[contains(@class, 'mstrmojo-popupList-scrollBar') and contains(@class, 'mstrmojo-scrollNode')]//div//div[contains(@class, 'item unit ic10prm') and text()='${elementName}']`;
        return this.$(path);
    }

    /** Returns option item from Choose elements by dropdown
     */
    getOptionFromChooseByElementsDropDown(optionName) {
        const path = `.//div[contains(@class, 'mstrmojo-popupList-scrollBar') and contains(@class, 'mstrmojo-scrollNode')]//div[text()='${optionName}']`;
        return this.NewQualificationPopup.$(path);
    }

    /** Returns "New Qualification" editor title
     */
    getNewQualificationEditorTitle(titleName) {
        return this.$(
            `//span[contains(@class, 'mstrmojo-text') and contains(@class, 'mstrmojo-attr') and text()='${titleName}']`
        );
    }

    /** Returns attribute elements
     */
    getAttributeElement(elementName) {
        return this.$(
            `//div[contains(@class, 'item') and child::span[contains(@class,'text') and text()='${elementName}']]`
        );
    }

    /** Returns deselected attribute element
     */
    getDeselectedAttributeElement(elementName) {
        return this.$(
            `//div[contains(@class, 'item') and child::span[contains(@class, 'text') and text()='${elementName}']]`
        );
    }

    /** Returns selected attribute element
     */
    getSelectedAttributeElement(elementName) {
        return this.$(
            `//div[contains(@class, 'item') and contains(@class, 'selected') and child::span[contains(@class, 'text') and text()='${elementName}']]`
        );
    }

    /** Returns attribute filter operator
     */
    getAttributeFilterOperator(operatorName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-vi-ui-ConditionEditor') and contains(@style,'display: block;')]//div[contains(@class, 'item') and child::span[text()='${operatorName}']]`
        );
    }

    /** Retruns metric filter operator
     */
    getMetricFilterOperator(operatorName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-vi-ui-ConditionEditor') and contains(@style,'display: block;')]//div[contains(@class, 'item') and child::span[text()='${operatorName}']]`
        );
    }

    /** Returns "Attribute" dropdown option item
     */
    getOptionOnAttributeDropdown(attName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'conditionWalk-attMxPd')]//div//div[contains(@class, 'item unit') and text()='${attName}']`
        );
    }

    /** Returns "Metric" dropdown option item
     */
    getOptionMetricDropdown(metricName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'conditionWalk-attMxPd')]//div//div[contains(@class, 'item unit') and text()='${metricName}']`
        );
    }

    /** Returns "In List" "Not In List" radio button
     * @return {Promise<ElementFinder>} corresponding radio button element
     * @param {String} buttonName - "In List" "Not In List"
     */
    getSelectingInListRadioButton(buttonName) {
        //TODO: find a more general way to locate "In List" radio button
        return this.$(
            `//div[contains(@class,'mstrmojo-vi-ui-ConditionEditor') and contains(@style,'display: block;')]//div[contains(@class, 'item') and child::span[text()='${buttonName}']]`
        );
    }

    /** Returns option item on "Output Level" dropdown
     */
    getOptionFromOutputLevelDropdown(optionName) {
        return this.$(`//div[contains(@class, 'item') and text()='${optionName}']`);
    }

    /** Returns option item fron "Operator" dropdown
     * @param {String} optionName - option name
     */
    getOptionFromOperatorDropdown(optionName) {
        //return this.$(`//div[contains(@class, 'item') and text()='${optionName}']`);
        return this.$(
            `//div[contains(@class,'mstrmojo-vi-ui-ConditionEditor') and contains(@style,'display: block;')]//div[contains(@class, 'item') and text()='${optionName}']`
        );
    }

    /** Returns Compound grid "Column Set XX" button
     * @param {String} columnSet - column set name
     * @return {Promise<ElementFinder>>} corresponding "Column Set X" button
     */
    getAdvancedFilterEditorColumnSetButton(columnSet) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-EditableLabel') and contains(@class, 'hasEditableText') and text()='${columnSet}' and ancestor::div[contains(@class, 'mstrmojo-VITab-tab')]]`
        );
    }

    /** Returns Close compound grid column set advanced filter editor button
     * @param {String} columnSet - column set name
     * @return {Promise<ElementFinder>} corresponding button
     */
    getColumnSetCloseButton(columnSet) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VITab-menu') and preceding-sibling::div[contains(@class, 'mstrmojo-VITab-tab') and child::div[text()='${columnSet}']]]`
        );
    }

    /** Returns column set options from "+" context menu
     * @param {String} columnSet - column set name
     */
    getColumnSetOptionsFromPlusButtonContextMenu(columnSet) {
        return this.$(
            `//a[contains(@class, 'item') and contains(@class, 'mstrmojo-ui-Menu-item') and child::div[text()='${columnSet}']]`
        );
    }

    getErrorPopUp(titleName) {
        const newTitle = titleName.replace(/ /g, '\u00A0');
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor') and contains(@class,'mstrmojo-alert modal')]//div[contains(@class,'mstrmojo-Editor-title') and text()='${newTitle}']`
        );
    }

    getErrorMsg(msg) {
        //console.log(`//div[contains(@class,'mstrmojo-Editor') and contains(@class,'mstrmojo-alert modal')]//div[contains(@class,'mstrmojo-error-content')]//div[text()='${msg}']`);
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor mstrmojo-alert modal')]//div[contains(@class,'mstrmojo-error-content')]//div[text()='${msg}']`
        );
    }

    getButtonInErrorPopUp(buttonName) {
        return this.$(`//div[contains(@class,'mstrmojo-Button-text') and text()='${buttonName}']`);
    }

    /**
     * @param {*} index
     * @returns The span class which contains the filter summary, @title ="{Category}(DESC) Begins with Text User Input"
     */
    getFilterSummaryContent(index) {
        return this.getFilterItemByIndex(index).$(`.//span[contains(@class, 'mstrmojo-textset mstrmojo-cond-text')]`);
    }

    //Actions
    /** Open Visualization context menu and open "advanced filter editor" editor
     * @param {String} VisualizationTitle - visualization title
     */
    async openAdvancedFilterEditor(VisualizationTitle) {
        const visualizationContextMenuButton =
            await this.baseContainer.getContainerContextMenuButton(VisualizationTitle);
        await visualizationContextMenuButton.waitForExist();
        await visualizationContextMenuButton.waitForDisplayed();
        await this.clickOnElement(visualizationContextMenuButton);
        const editFilterButton = await this.baseContainer.getContextMenuOption('Edit Filter...');
        await editFilterButton.waitForExist();
        await editFilterButton.waitForDisplayed();
        await this.click({ elem: editFilterButton });
    }

    /** Open "New Qualification" editor
     */
    async openNewQualificationEditor() {
        const element = await this.addNewQualificationButton;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.hoverMouseAndClickOnElement(element);
    }

    /** Open "Based on" dropdown
     */
    async openBasedOnDropDown() {
        const element = await this.basedOnDropdown;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: this.basedOnDropdown });
    }

    /** Helper function to close dropdown
     */
    async closeAllDropDown() {
        const element = await this.closeAllDropDownLabel;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Select an attribute or metric as filter target
     * @param {String} elementName - element name
     */
    async selectObjectFromBasedOnDropdown(elementName) {
        const element = await this.getOptionFromBasedOnDropdown(elementName);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Select an attribute or metric as filter target
     * @param {String} elementName - element name
     */
    async selectParameterFromBasedOnDropdown(elementName) {
        const element = await this.getParameterFromBasedOnDropdown(elementName);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Open "Choose elements by" dropdown
     */
    async openChooseElementsByDropDown() {
        const element = await this.chooseElementsByDropdown;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    async openChooseElementsByDropDownI18N(optionName) {
        const element = await this.getChooseElementsByDropdownI18N(optionName);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Helper function to check whether "Choose elements by" dropdown exists
     */
    async checkChooseElementsByDropdown() {
        const element = await this.chooseElementsByDropdown;
        await element.waitForExist();
        await element.waitForDisplayed();
        await expect(await element.isDisplayed()).toBeTrue();
    }

    /** Select "Selecting in list" or "Qualification on" for attribute filter
     * @param {String} typeName - filter type
     */
    async doSelectionOnChooseElementsByDropdown(typeName) {
        const element = await this.getOptionFromChooseByElementsDropDown(typeName);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Check "New Qualification" editor title
     * @param {String} titleName - title name
     */
    async checkNewQualificationTitle(titleName) {
        const element = await this.getNewQualificationEditorTitle(titleName);
        await element.waitForExist();
        await element.waitForDisplayed();
        await expect(await element.isExisting()).toBe(true);
    }

    /** Select elements "In list" or "Not in list" for attribute filter
     * @param {String[]} elementNames - element names
     */
    async doElementSelectionForAttributeFilter(elementNames) {
        for (const elementName of elementNames) {
            const element = await this.getAttributeElement(elementName);
            await element.waitForExist();
            await element.waitForDisplayed();
            await this.click({ elem: element });
        }
    }

    /** Click "OK" button to create a new attribute filter item
     */
    async clickOnNewQualificationEditorOkButton() {
        const element = await this.newQualificationOkButton;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Click "Cancel" button to create a new attribute filter item
     */
    async clickOnNewQualificationEditorCancelButton() {
        const element = await this.newQualificationCancelButton;
        await element.waitForExist();
        await element.waitForDisplayed();
        // Force-click since sometimes the button will be overlappied with tooltip
        await browser.execute(async (el) => {
            await el.click();
        }, element);
    }

    /** Click "Save" button to apply current advanced filters
     */
    async applyAdvancedFilterItem() {
        const element = await this.advancedFilterEditorSaveButton;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Check whether a new advanced attribute filter is successfully created
     * @param {Number} index - index for an advanced filter
     */
    async checkAdvancedFilterByIndex(index) {
        const element = this.getFilterItemByIndex(index);
        await this.waitForElementVisible(element);
        await expect(await element.isDisplayed()).toBeTrue();
    }

    /** Check whether a new advanced attribute filter is not created
     * @param {Number} index - index for an advanced filter
     */
    async checkAdvancedFilterByIndexNotExist(index) {
        const element = await this.getFilterItemByIndex(index);
        await expect(await element.isExisting()).toBeFalse();
    }

    /** Do selection "In List" or "Not In List" for advanced attribute filter
     * @param {String} buttonName - "In List" "Not In List"
     */
    async selectInListOrNotInList(buttonName) {
        const element = await this.getSelectingInListRadioButton(buttonName);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Type on "Value" textbox
     * @param {String} text -  input value
     */
    async typeValueInput(text) {
        const valueTextBoxField = await this.valueTextBox;
        await valueTextBoxField.waitForExist();
        await valueTextBoxField.waitForDisplayed();
        await this.click({ elem: valueTextBoxField });
        await this.clear({ elem: valueTextBoxField });
        await valueTextBoxField.setValue(text);
    }

    /** Clear "Value" textbox
     */
    async clearValueInput() {
        const valueTextBoxField = await this.valueTextBox;
        await valueTextBoxField.waitForExist();
        await valueTextBoxField.waitForDisplayed();
        await this.clear({ elem: valueTextBoxField });
    }

    /** Type on "Value" textbox for date
     * @param {String} text -  input value
     */
    async typeDateValueInput(date) {
        const dateValueTextBoxField = await this.dateValueTextBox;
        await dateValueTextBoxField.waitForExist();
        await dateValueTextBoxField.waitForDisplayed();
        await dateValueTextBoxField.sendKeys(date);
    }

    /** Clear "Value" textbox for date
     */
    async clearDateValueInput() {
        const dateValueTextBoxField = await this.dateValueTextBox;
        await dateValueTextBoxField.waitForExist();
        await dateValueTextBoxField.waitForDisplayed();
        await this.clear({ elem: dateValueTextBoxField });
    }

    /** Open "Attribute" dropdown
     */
    async openAttributeDropdown() {
        const element = await this.attributeDropdown;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Do selection on "Attribute" dropdown
     * @param {String} attName - the attribute name
     */
    async doSelectionOnAttributeDropdown(attName) {
        const element = await this.getOptionOnAttributeDropdown(attName);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Type on "and" textbox
     * @param {String} text - input value
     */
    async typeAndInput(text) {
        const element = await this.andTextBox;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.clear({ elem: element });
        await element.setValue(text);
    }

    /** Open "Output Level" dropdown
     */
    async openOutputLevelDropdown() {
        const element = await this.outputLevelDropDown;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Do selection from "Output Level" dropdown
     * @param {String} optionName - option name
     */
    async doSelectionOnOutputLevelDropDown(optionName) {
        const element = await this.getOptionFromOutputLevelDropdown(optionName);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Open "Operator" dropDown
     */
    async openOperatorDropDown() {
        const element = await this.operatorDropdown;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Do selection on "Operator" dropdown
     * @param {String} optionName - option name
     */
    async doSelectionOnOperatorDropdown(optionName) {
        const element = await this.getOptionFromOperatorDropdown(optionName);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Open "Metric" dropdown
     */
    async openMetricDropdown() {
        const element = await this.metricDropdown;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Do selection on "Metric" dropdown
     * @param {String} metricName - metric name
     */
    async doSelectionOnMetricDropdown(metricName) {
        const element = await this.getOptionMetricDropdown(metricName);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Type on search box
     * @param {String} text to be typed on search box
     */
    async typeOnSearchBox(text) {
        const element = await this.newQualificationEditorELementSearchBox;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.clear({ elem: element });
        await element.setValue(text);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Clear search box
     */
    async clearSearchBox() {
        const element = await this.newQualificationEditorELementSearchBox;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.clear({ elem: element });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Check whether displayed attribute elements contain a certain text
     * @param {String} text to be tested
     */
    async checkAttributeElement(text) {
        const elementArray = await this.allFilteredAttributeElements;
        for (let i = 0; i < elementArray.length; i++) {
            const elementText = await elementArray[i].getText();
            await expect(elementText.toLowerCase().includes(text)).toBeTrue();
        }
    }

    /** Toggle "View Selected"
     */
    async toggleViewSelected() {
        const element = await this.viewSelectedButton;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Click "Clear All" button
     */
    async clickClearAllButton() {
        const element = await this.clearAllButton;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Check an attribute element is deselected
     * @param {String} elementName - element name
     */
    async checkDeselectedAttributeElement(elementName) {
        const element = this.getDeselectedAttributeElement(elementName);
        await this.waitForElementVisible(element);
        await expect(await element.isDisplayed()).toBeTrue();
    }

    /** Click "Save" on advanced filter editor
     */
    async clickSaveOnAdvancedFilterEditor() {
        const element = await this.advancedFilterEditorSaveButton;
        await element.waitForExist();
        await element.waitForDisplayed();
        // Force-click since sometimes the button will be overlappied with tooltip
        await browser.execute(async (el) => {
            await el.click();
        }, element);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Click "Cancel" on advanced filter editor
     */
    async clickCancelOnAdvancedFilterEditor() {
        const element = await this.advancedFilterEditorCancelButton;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Hover on and click the visible filter icon
     */
    async hoverAndClickFilterIcon() {
        const element = await this.hoverFilterIcon;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.hoverMouseAndClickOnElement(element);
    }

    /** Click "Advanced Qualification" Button
     */
    async clickAdvancedQualificationButton() {
        const element = await this.advancedQualificationButton;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Hover on an advanced filter by index
     * @param {Number} index for the filter item
     */
    async hoverOnFilterItemByIndex(index) {
        const element = await this.getFilterItemByIndex(index);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.hover({ elem: element });
    }

    /** Click "Create a Set" button for a specific filter item
     * @param {Number} index for "Create a Set" button
     */
    async clickCreateASetButtonByIndex(index) {
        const element = await this.getCreateASetByIndex(index);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Select/Deselect an attribute on "Create a Set" attribute list
     * @param {String} attributeName - attribute name
     */
    async clickAttributeOnCreateASetAttributeList(attributeName) {
        const element = await this.getOptionFromCreateASetAttributeList(attributeName);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Click "OK" to create a set
     */
    async createASet() {
        const element = await this.createASetOKButton;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Click "x" button for a specific filter item to delete it
     * @param {Number} index for "Create a Set" button
     */
    async clickDeleteButtonByIndex(index) {
        const element = await this.getDeleteButtonByIndex(index);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Drag visualization level metric filter area to dataset level metric filter area
     * @param {Promise<ElementFinder>} movingElement - moving element
     * @param {Promise<ElementFinder>} targetElement -  target element
     */
    async dragFilterAndWait(movingElement, targetElement) {
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: movingElement,
            toElem: targetElement,
            toOffset: { x: 0, y: 0 },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Click an advanced filter to edit it by index
     * @param {Number} index for an advanced filter
     */
    async editAdvancedFilter(index) {
        const element = await this.getFilterItemByIndex(index);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Click "AND" to open logical operator dialog by index
     * @param {Number} index - index for logical operator dialog
     * @param {String} currOperator - current operator
     */
    async openLogicalOperatorDialog(index, currOperator) {
        const element = await this.getLogicalOperatorButtonBetweenFiltersByIndex(index, currOperator);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Change logical operator between two filters
     * @param {String} newOperator - New Operator
     */
    async changeLogicalOperatorBetweenFilters(newOperator) {
        const element = await this.getLogicalOpertorsItemFromContextMenu(newOperator);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Close a specific column set advanced filter editor
     * @param {String} columnSet - column set name
     */
    async closeColumnSetAdvancedFilterEditor(columnSet) {
        const element = await this.getColumnSetCloseButton(columnSet);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Check "+" button appear
     */
    async checkPlusButtonAppear() {
        const element = await this.plusButtonToOpenColumnSetAdvancedFilterEditor;
        await element.waitForExist();
        await element.waitForDisplayed();
        await expect(await element.isExisting()).toBeTrue();
    }

    /** Click "+" button to open column set context menu
     */
    async openColumnSetContextMenu() {
        const element = await this.plusButtonToOpenColumnSetAdvancedFilterEditor;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Do selection on "+" button context menu
     * @param {String} columnSet - column set name
     */
    async doSelectionOnPlusButtonContextMenu(columnSet) {
        const element = await this.getColumnSetOptionsFromPlusButtonContextMenu(columnSet);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Click "Column Set X" to transition to its advanced filter editor
     * @param {String} columnSet - column set name
     */
    async changeToAnotherColumnSetAdvancedFilterEditor(columnSet) {
        const element = this.getAdvancedFilterEditorColumnSetButton(columnSet);
        await this.waitForElementVisible(element);
        await this.click({ elem: await element });
    }

    /**
     * Do operator selection for advanced attribute filter
     * @param {String} operatorName - operator name
     */
    async selectAttributeFilterOperator(operatorName) {
        //let operator = attributeLogicalOperatorItem.EQUALS;
        let operator = operatorName;
        switch (operatorName.toLowerCase()) {
            case 'equals':
                operator = attributeLogicalOperatorItem.EQUALS;
                break;
            case 'does not equal':
                operator = attributeLogicalOperatorItem.DOES_NOT_EQUAL;
                break;
            case 'greater than':
                operator = attributeLogicalOperatorItem.GREATER_THAN;
                break;
            case 'greater than or equal to':
                operator = attributeLogicalOperatorItem.GREATER_THAN_OR_EQUAL_TO;
                break;
            case 'less than':
                operator = attributeLogicalOperatorItem.LESS_THAN;
                break;
            case 'less than or equal to':
                operator = attributeLogicalOperatorItem.LESS_THAN_OR_EQUAL_TO;
                break;
            case 'between':
                operator = attributeLogicalOperatorItem.BETWEEN;
                break;
            case 'not between':
                operator = attributeLogicalOperatorItem.NOT_BETWEEN;
                break;
            case 'contains':
                operator = attributeLogicalOperatorItem.CONTAINS;
                break;
            case 'does not contain':
                operator = attributeLogicalOperatorItem.DOES_NOT_CONTAIN;
                break;
            case 'begins with':
                operator = attributeLogicalOperatorItem.BEGINS_WITH;
                break;
            case 'does not begin with':
                operator = attributeLogicalOperatorItem.DOES_NOT_BEGIN_WITH;
                break;
            case 'ends with':
                operator = attributeLogicalOperatorItem.ENDS_WITH;
                break;
            case 'does not end with':
                operator = attributeLogicalOperatorItem.DOES_NOT_END_WITH;
                break;
            case 'like':
                operator = attributeLogicalOperatorItem.LIKE;
                break;
            case 'not like':
                operator = attributeLogicalOperatorItem.NOT_LIKE;
                break;
            case 'is null':
                operator = attributeLogicalOperatorItem.IS_NULL;
                break;
            case 'is not null':
                operator = attributeLogicalOperatorItem.IS_NOT_NULL;
                break;
            case 'in':
                operator = attributeLogicalOperatorItem.IN;
                break;
            case 'not in':
                operator = attributeLogicalOperatorItem.NOT_IN;
                break;
        }
        const element = await this.getAttributeFilterOperator(operator);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Do operator selection for advanced metric filter by value
     * @param {String} operatorName - operator name
     */
    async selectMetricFilterOperatorByValue(operatorName) {
        let operator = metricLogicalOperatorItemByValue.EQUALS;
        switch (operatorName.toLowerCase()) {
            case 'equals':
                operator = metricLogicalOperatorItemByValue.EQUALS;
                break;
            case 'does not equal':
                operator = metricLogicalOperatorItemByValue.DOES_NOT_EQUAL;
                break;
            case 'greater than':
                operator = metricLogicalOperatorItemByValue.GREATER_THAN;
                break;
            case 'greater than or equal to':
                operator = metricLogicalOperatorItemByValue.GREATER_THAN_OR_EQUAL_TO;
                break;
            case 'less than':
                operator = metricLogicalOperatorItemByValue.LESS_THAN;
                break;
            case 'less than or equal to':
                operator = metricLogicalOperatorItemByValue.LESS_THAN_OR_EQUAL_TO;
                break;
            case 'between':
                operator = metricLogicalOperatorItemByValue.BETWEEN;
                break;
            case 'not between':
                operator = metricLogicalOperatorItemByValue.NOT_BETWEEN;
                break;
            case 'is null':
                operator = metricLogicalOperatorItemByValue.IS_NULL;
                break;
            case 'is not null':
                operator = metricLogicalOperatorItemByValue.IS_NOT_NULL;
                break;
        }
        const element = await this.getMetricFilterOperator(operator);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    /** Do operator selection for advanced metric filter by rank
     * @param {String} operatorName - operator name
     */
    async selectMetricFilterOperatorByRank(operatorName) {
        let operator = metricLogicalOperatorItemByRank.HIGHEST;
        switch (operatorName.toLowerCase()) {
            case 'highest':
                operator = metricLogicalOperatorItemByRank.HIGHEST;
                break;
            case 'lowest':
                operator = metricLogicalOperatorItemByRank.LOWEST;
                break;
            case 'highest %':
                operator = metricLogicalOperatorItemByRank.HIGHEST_PERCENTAGE;
                break;
            case 'lowest%':
                operator = metricLogicalOperatorItemByRank.LOWEST_PERCENTAGE;
                break;
            case 'rank between highest':
                operator = metricLogicalOperatorItemByRank.RANK_BETWEEN_HIGHEST;
                break;
            case 'exclude highest':
                operator = metricLogicalOperatorItemByRank.EXCLUDE_HIGHEST;
                break;
            case 'rank between lowest':
                operator = metricLogicalOperatorItemByRank.RANK_BETWEEN_LOWEST;
                break;
            case 'exclude lowest':
                operator = metricLogicalOperatorItemByRank.EXCLUDE_LOWEST;
                break;
        }
        const element = await this.getMetricFilterOperator(operator);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    async clickButtonInErrorPopUp(buttonName) {
        const element = this.getButtonInErrorPopUp(buttonName);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickParameterTextBox() {
        const element = this.parameterTextBox;
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: this.parameterTextBox });
    }

    async selectParameterObjectFromPullDown(parameterObject) {
        const element = this.getParameterfromPulldown(parameterObject);
        await element.waitForExist();
        await element.waitForDisplayed();
        await this.click({ elem: element });
    }

    async clickAdvancedFilterButton() {
        await this.click({ elem: this.getAdvancedFilterButton() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickAdvancedFilterApplyButton() {
        await this.click({ elem: this.getAdvancedFilterApplyButton() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickAdvancedFilterCancelButton() {
        await this.click({ elem: this.getAdvancedFilterCancelButton() });
    }

    async clickAdvancedFilterClearButton() {
        await this.click({ elem: this.getAdvancedFilterClearButton() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectFilterOption(option) {
        await this.click({ elem: this.getFilterOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectFilterOperator(operator) {
        await this.click({ elem: this.getFilterOperator(operator) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
}
