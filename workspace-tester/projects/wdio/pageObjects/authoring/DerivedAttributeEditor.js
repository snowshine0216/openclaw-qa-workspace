'use strict';

import BasePage from '../base/BasePage.js';
import Common from './Common.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';

export default class DerivedAttributeEditor extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
    }

    /**
     * Get the derived attribute editor once it is opened
     * @returns {Promise<boolean>}
     */
    get derivedAttributeEditor() {
        return this.$(`//div[@id='mstrDerivedAttrIDE']//div[contains(@class,'mstrmojo-DA-IDE')]`);
    }

    /**
     * Get the required panel within the editor
     */
    getEditorPanel(panelType) {
        return this[panelType + 'Panel'];
    }

    get simpleAttributePanel() {
        return this.$(`//div[@id='mstrDerivedAttrIDE']//div[contains(@class,'mstrmojo-DA-IDE simple')]`);
    }

    /**
     * Get the functions section of the derived attribute editor
     */
    get functionsPanel() {
        return this.$(
            `//div[contains(@class,'mstrmojo-FunctionSelector')]//div[contains(@class, 'mstrmojo-Editor-content')]`
        );
    }

    /**
     * Get the search box for functions available for creating derived elements
     */
    get functionsSearchBox() {
        return this.functionsPanel.$(`.//input[contains(@class,'mstrmojo-SearchBox-input')]`);
    }

    get objectSearchBox() {
        return this.derivedAttributeEditor.$(
            `.//div[contains(@class, 'mstrmojo-DatasetSearchWrapper')]//input[contains(@class,'mstrmojo-SearchBox-input')]`
        );
    }

    /**
     * Search for function using function name
     */
    async setFunctionsSearchKey(fnString) {
        let el = this.functionsSearchBox;
        await browser.waitUntil(EC.elementToBeClickable(el), browsers.params.timeout.waitDOMNodePresentTimeout60);
        await this.clickOnElement(el);
        await this.clear(el);
        await el.addValue(fnString);
    }

    /**
     * Get the list of functions available for creating derived elements
     */
    get functionsList() {
        return this.functionsPanel.$(
            `.//div[contains(@class,'mstrmojo-FE-functionList')]//div[contains(@class,'mstrmojo-ListBase2-itemsContainer')]`
        );
    }

    /**
     * Get the pulldown of the functions type list in derived attribute editor
     */
    get functionsTypePullDown() {
        return this.functionsPanel.$(
            `.//div[contains(@class,'mstrmojo-DropDownButton-boxNode mstrmojo-ME-Pulldown-boxNode')]`
        );
    }

    /**
     * Get the functions type list in derived attribute editor
     */
    get functionsTypeList() {
        return this.functionsPanel.$(
            `.//div[contains(@class,'mstrmojo-Pulldown-Popup')]//div[contains(@class,'mstrmojo-ListBase2-itemsContainer')]`
        );
    }

    /**
     * Get the function type from popup list in the derived element editor
     * @param {string} functionType
     */
    getFunctionTypeinPopupList(functionType) {
        var identifier = functionType.split(' ', 1)[0];
        return this.functionsPanel.$(
            `.//div[contains(@class,'mstrmojo-Pulldown-listItem')]//div[contains(string(),'${identifier}')]`
        );
    }

    /**
     * Get the function from list
     */
    getFunctionInList(functionName) {
        return this.functionsList.$(`.//div[contains(@class,'mstrmojo-suggest-text fn') and text()='${functionName}']`);
    }

    /**
     * Get the function suggestion from list
     */
    getFunctionSuggestionInList(functionName) {
        return this.functionsList.$(
            `.//div[contains(@class,'mstrmojo-suggest-text fn')]//em[text()='${functionName}']`
        );
    }

    /**
     * Get the input content box
     */
    get inputBox() {
        return this.$(
            `//div[contains(@class,'mstrmojo-MEBox ')]//div[contains(@class, "mstrmojo-TokenInputBox-edit")]`
        );
    }

    /**
     * Add a function to the attribute definition through double click
     * @param {string} functionName - name of function
     */
    async addFunctionByDoubleClick(functionName) {
        let el = await this.getFunctionInList(functionName);
        await this.doubleClickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Get the objects section of the derived attribute editor
     */
    get objectsPanel() {
        return this.derivedAttributeEditor.$(
            `//div[contains(@class,'mstrmojo-StackContainer')]//div[contains(@class, 'mstrmojo-VIDatasetObjects')]`
        );
    }

    /*
    getDatasetIcon(datasetName) {
        return this.objectsPanel.$(`//div[contains(@class,'docdataset-unitlist-portlet') and descendant::div[text()='${datasetName}']]//div[@class='left-toolbar']`);
    }
    */

    /**
     * Get the pulldown of the objects type list in derived attribute editor
     */
    get objectsTypePullDown() {
        return this.objectsPanel.$(
            `.//div[contains(@class,'mstrmojo-ui-Pulldown') and contains(@style, 'display: block')]`
        );
    }

    /**
     * Get the list of dataset objects type available for creating derived elements
     */
    get objectsTypeList() {
        return this.objectsPanel.$(
            `.//div[contains(@class,'mstrmojo-ui-Pulldown')]//div[contains(@class, 'mstrmojo-PopupList')]`
        );
    }

    /**
     * Get the object type from popup list in the derived element editor
     * @param {string} objectType
     */
    getObjectTypeinPopupList(objectType) {
        // All, Attributes, Metrics
        return this.objectsPanel.$(
            `.//div[contains(@class,'mstrmojo-PopupList')]//div[contains(@class,'item') and contains(string(),'${objectType}')]`
        );
    }

    /**
     * Get the list of dataset objects available for creating derived elements
     */
    get objectsList() {
        return this.objectsPanel.$$(
            `.//div[contains(@class,'docdataset-unitlist-portlet')]//div[contains(@class,'ListBase mstrmojo-VIUnitList')]`
        )[0];
    }

    /**
     * Get the dataset object from list
     */
    getObjectInList(objectName) {
        return this.objectsList.$(`.//div[contains(@class,'item')]//span[text()='${objectName}']/parent::*`);
    }

    getSearchedObjectInList(objectName) {
        //const path = `${this.objectsList}//div[contains(@class,'item')]//em[text()='${objectName}']/ancestor::div`;
        //const el = this.$$(path);
        //return el.last();

        return this.objectsList.$(`(//div[contains(@class,'item')]//em[text()='${objectName}']/ancestor::div)[last()]`);
    }

    async setObjectSearchKey(pattern) {
        let el = await this.objectSearchBox;
        await this.waitForElementClickable(el);
        await this.click({ elem: el });
        await this.clear({ elem: el });
        await el.addValue(pattern);
    }

    /**
     * Add an object to the attribute definition through double click
     */
    async addObjectByDoubleClick(objectName) {
        let newObj = objectName.replace(/ /g, '\u00a0');
        let el = await this.getObjectInList(newObj);
        await this.waitForElementClickable(el);
        await this.doubleClickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async addSearchedObjectByDoubleClick(objectName) {
        let newObj = objectName.replace(/ /g, '\u00a0');
        let el = await this.getSearchedObjectInList(newObj);
        await this.waitForElementClickable(el);
        await this.doubleClickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Get the attribute info section of the derived attribute editor
     */
    get attributePanel() {
        return this.$(`//div[contains(@class,'mstrmojo-DAEditor')]`);
    }

    /**
     * Get the new attribute name
     */
    get attributeName() {
        return this.attributePanel.$(`.//input[contains(@class,'mstrmojo-ME-nameInput')]`);
    }

    /**
     * Get the new attribute description
     */
    get attributeDesc() {
        return this.attributePanel.$(`.//textarea[contains(@class,'mstrmojo-TextArea')]`);
    }

    /**
     * Get the new attribute definition
     */
    get attributeDefn() {
        return this.attributePanel.$$(`.//div[contains(@class,'mstrmojo-TokenInputBox-edit')]`)[0];
    }

    /**
     * Get the new attribute definition input
     */
    async getAttributeFormDefinition() {
        var tokenStringArr = this.$$(
            `//div[contains(@class,'mstrmojo-DAEditor')]//div[contains(@class,'mstrmojo-TokenInputBox-edit')]//span[contains(@class,'mstrmojo-token')]`
        );
        var tokenCount;

        await tokenStringArr.length.then(function (count) {
            tokenCount = count;
        });
        var tokenStr = '';
        for (var i = 0; i < tokenCount; i++) {
            await tokenStringArr[i].getText().then(function (tokenName) {
                tokenStr += tokenName;
            });
        }

        return tokenStr;
    }

    /**
     * Set the new attribute name
     */
    async setAttributeName(newName) {
        let nameField = await this.attributeName;
        await this.click({ elem: nameField });
        await this.clear({ elem: nameField });
        await nameField.setValue(newName);
        //await this.enter();
    }

    /**
     * Set the new attribute description
     */
    async setAttributeDesc(newDesc) {
        await this.attributeDesc.clear();
        await browser.keys([newDesc, this.attributeDesc]);
    }

    /**
     * Set the new attribute definition
     */
    async setAttributeFormDefinition(formula) {
        let el = await this.attributeDefn;
        await this.waitForElementVisible(el);
        await this.clear({ elem: el });
        await el.addValue(formula);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Get the attribute form tab strip
     */
    get attrFormTabStrip() {
        return this.attributePanel.$(`.//div[contains(@class,'mstrmojo-AEB-TabStrip')]`);
    }

    /**
     * Get the attribute form tabs
     */
    get attrFormTabs() {
        return this.attrFormTabStrip.$(`.//div[contains(@class,'mstrmojo-AEB-Tab')]`);
    }

    /**
     * Get the attribute form tabs close button
     * @param {Number} index
     * Index starts from 1.
     * Index 1, 2, 3... correspond tabs ID, DESC, DESC1...
     */
    getAttrFormTabsCloseButton(index) {
        return this.$(
            `//div[contains(@class,'mstrmojo-AEB-TabStrip')]//div[contains(@class,'mstrmojo-AEB-Tab')][${index}]//div[@class='mstrmojo-VITab-menu']`
        );
    }

    /**
     * Get the attribute form from current forms
     */
    getAttributeForm(formName) {
        return this.attrFormTabStrip.$(`.//div[text()='${formName}']`);
    }

    /**
     * Get the currently selected attribute form
     */
    get selectedAttrFormText() {
        return this.attrFormTabStrip.$(
            `//div[contains(@class,'selected')]//div[contains(@class,'mstrmojo-VITab-tab')]//div`
        );
    }

    /**
     * Click on an attribute form
     */
    async selectAttributeForm(formName) {
        let form = await this.getAttributeForm(formName);
        await this.clickOnElement(form);
    }

    /**
     * Select an attribute form from dropdown
     */
    async selectFormFromDropdown(formName) {
        let item = await this.getAttributeFormInList(formName);
        await this.clickOnElement(item);
    }

    /**
     * Rename an attribute form
     */
    async renameAttributeForm(formNewName) {
        await this.renameTextField(formNewName);
    }

    /**
     * Get the add attribute form button
     */
    get addAttrFormBtn() {
        return this.attributePanel.$(
            `.//div[@class = 'mstrmojo-VITabStrip-addBtn']//div[@class='mstrmojo-VITabStrip-addBtn-Img']`
        );
    }

    /**
     * Get the attribute definition clear button
     */
    get attrClearBtn() {
        return this.attributePanel.$(`.//div[contains(@class,'mstrmojo-AEB-clearAll')]`);
    }

    /**
     * Get the attribute forms dropdown list
     */
    get attrFormsList() {
        return this.$(`//div[contains(@class,'mstrmojo-ListBase mstrmojo-scrollable-suggestlist')]`);
    }

    /**
     * Get the attribute form from dropdown list
     */
    getAttributeFormInList(formName) {
        return this.attrFormsList.$(`.//div[contains(@class,'mstrmojo-suggest-text afm') and text()='${formName}']`);
    }

    /**
     * Add a new blank attribute form
     */
    async addBlankAttrForm() {
        await this.clickByForce({ elem: this.addAttrFormBtn });
    }

    /**
     * Add an attribute form to the attribute definition through click
     * @param {string} formName - name of attribute form
     */
    async addAttrFormByName(formName) {
        let el = this.getAttributeFormInList(formName);
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Clear the current attribute form
     */
    async clearAttrForm() {
        let el = this.attrClearBtn;
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    getWarningTooltipByText(warningText) {
        return this.$(`//div[contains(@class, 'mstrmojo-Tooltip')]//*[text()='${warningText}']`);
    }

    /**
     * Get the attribute form data type pulldown
     */
    get dataTypePulldown() {
        return this.attributePanel.$(`.//div[contains(@class,'mstrmojo-ui-Pulldown-text')]`);
    }

    /**
     * Get the attribute form data type popup list
     */
    get dataTypeList() {
        return this.attributePanel.$(`.//div[contains(@class,'mstrmojo-PopupList')]`);
    }

    /**
     * Get the attribute data type from popup list in the derived element editor
     * @param {string} dataType
     */
    getDataTypeInPopupList(dataType) {
        return this.attributePanel.$(
            `.//div[contains(@class,'mstrmojo-PopupList')]//div[contains(@class,'item') and contains(string(),'${dataType}')]`
        );
    }

    /**
     * Get the attribute validation status
     */
    get validateStatusLabel() {
        return this.attributePanel.$(
            `.//div[contains(@class,'mstrmojo-AEBox-status')]//div[contains(@class,'mstrmojo-AEBox-infoLabel')]`
        );
    }

    /**
     * Get the attribute validation status text
     */
    get validationStatusText() {
        return this.validateStatusLabel.getText();
    }

    /**
     * Get the attribute validate button
     */
    get validateBtn() {
        return this.attributePanel.$(
            `.//div[contains(@class,'mstrmojo-AEBox-status')]//div[contains(@class,'mstrmojo-WebHoverButton')]`
        );
    }

    /**
     * Get the save attribute button
     */
    get saveBtn() {
        return this.attributePanel.$(`.//div[contains(@class,'mstrmojo-WebButton hot')]`);
    }

    /**
     * Get the cancel attribute button
     */
    get cancelBtn() {
        return this.attributePanel.$(`.//div[@class='mstrmojo-Button mstrmojo-WebButton']`);
    }

    /**
     * Get the save attribute button
     */
    get switchToFormulaEditorBtn() {
        return this.$(
            `//div[@class='mstrmojo-Editor-buttons' and not(contains(@style, 'visibility: hidden'))]//div[contains(@class,'mstrmojo-ME-switch') ]`
        );
        // return element(by.xpath(`//div[@class='mstrmojo-Editor-buttons' and not(contains(@style, 'visibility: hidden'))]//div[contains(@class,'mstrmojo-Button-text') and text()='Switch to Formula Editor']`));
    }

    /**
     * Validate the attribute form
     */
    async validateForm() {
        let el = await this.validateBtn;
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(100);
    }

    /**
     * Save the derived attribute
     */
    async saveAttribute() {
        let el = this.saveBtn;
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * cancel the derived attribute
     */
    async cancelAttribute() {
        let el = this.cancelBtn;
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Switch to Formula Editor
     */
    async switchFormulaEditor() {
        let el = this.switchToFormulaEditorBtn;
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async createDerivedAttribute({ objectNames, derivedAttributeName }) {
        for (let i = 0; i < objectNames.length; i++) {
            await this.addObjectByDoubleClick(objectNames[i]);
            if (i < objectNames.length - 1) {
                await this.addBlankAttrForm();
            }
        }
        await this.setAttributeName(derivedAttributeName);
        await this.saveAttribute();
    }
}
