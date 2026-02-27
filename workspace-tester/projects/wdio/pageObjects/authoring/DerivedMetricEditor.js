'use strict';

import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';

/**
 * Page representing the derived metric editor
 * @extends BasePage
 */

export default class DerivedMetricEditor extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
    }

    /**
     * Get the derived metric editor once it is opened
     * @returns {Promise<boolean>}
     */
    get derivedMetricEditor() {
        return this.$(`//div[@id='mstrMetricIDE']//div[contains(@class, 'mstrmojo-MetricIDE dme modal')]`);
    }

    /**
     * Get the required panel within the editor
     */
    getEditorPanel(panelType) {
        return this[panelType + 'Panel'];
    }

    /**
     * Get the functions selection section of the derived metric editor
     */
    get functionsPanel() {
        return this.$(
            `//div[contains(@class,'mstrmojo-FunctionSelector')]//div[contains(@class, 'mstrmojo-Editor-content')]`
        );
    }

    /**
     * Get the simple metric editor section of the derived metric editor
     */
    get simpleMetricPanel() {
        return this.$(`//div[contains(@class,'mstrmojo-SimpleMetricEditor')]`);
    }

    /**
     * Get the simple metric editor when user opens the derived metric editor from existing DM
     */
    get simpleMetricPanelOpenFromEdit() {
        return this.$(`//div[contains(@class,'mstrmojo-Editor mstrmojo-MetricIDE dme modal simple')]`);
    }

    /**
     * Get save button in the simple metric editor when user opens the derived metric editor from existing DM
     */
    get saveBtnfromSimpleMetricPanelOpenFromEdit() {
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor mstrmojo-MetricIDE dme modal simple')]//div[contains(@class,'mstrmojo-WebButton hot')]`
        );
    }

    get switchBtninSimplifiedMetricPanel() {
        return this.$(
            `(//div[contains(@class,'mstrmojo-Editor mstrmojo-MetricIDE dme modal simple')]//div[contains(@class,'mstrmojo-ME-switch')]//div[contains(@class,'mstrmojo-Button-text')])[2]`
        );
    }

    /**
     * Get the search box for functions available for creating derived elements
     */
    get functionsSearchBox() {
        return this.functionsPanel.$(`.//input[contains(@class,'mstrmojo-SearchBox-input')]`);
    }

    get ignoreFilterCheckBox() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-MetricIDE')]//div[@class='mstrmojo-Editor-content']//table[contains(@class, 'mstrmojo-ME-LCT')]//span[contains(@class,'ignoreFilterCheckBox')]`
        );
    }

    /**
     * Get the check box in function/formula editor
     */
    get setHTMLcontentCheckBoxFormula() {
        return this.$$(
            `//div[contains(@class, 'mstrmojo-Label') and contains(text(),'Set as HTML content')]/../div[contains(@class,'mstrmojo-ui-Checkbox')]`
        )[0];
    }

    get setHTMLcontentCheckBoxFunction() {
        return this.$$(
            `//div[contains(@class, 'mstrmojo-Label') and contains(text(),'Set as HTML content')]/../div[contains(@class,'mstrmojo-ui-Checkbox')]`
        )[1];
    }

    /**
     * Get the check box in simple metric editor when user opens the derived metric editor from existing DM
     */
    get HTMLcheckboxINsimpleMetricPanelOpenFromEdit() {
        return this.simpleMetricPanelOpenFromEdit.$(`.//div[contains(@class,'mstrmojo-ui-Checkbox')]`);
    }

    get HTMLcheckboxINformulaMetricPanelOpenFromEdit() {
        return this.$(
            `//div[contains(@class,'mstrmojo-MetricEditor dme mstrmojo-MetricIDE-editor')]//div[contains(@class,'mstrmojo-ui-Checkbox')]`
        );
    }

    get metricOptionsBtn() {
        return this.$(
            `//div[contains(@class,'MetricEditor') and contains(@style,'block;')]//div[text()='Metric Options']`
        );
    }

    get metricOptionsDropDownButton() {
        return this.$(
            `//table[contains(@class,'mstrmojo-DerivedMetricOptions-aggBox')]//div[contains(@class,'ME-Pulldown-boxNode')]`
        );
    }

    getMetricOptionsPulldownItem(item) {
        return this.$(
            `//table[contains(@class,'mstrmojo-DerivedMetricOptions-aggBox')]//div[contains(@class,'ME-Pulldown-popupNode')]//div[text()='${item}']`
        );
    }

    get metricOptionsOKBtn() {
        return this.$(`//div[contains(@class,'mstrmojo-DerivedMetricOptions')]//div[text()='OK']`);
    }

    get metricOptionsCancelBtn() {
        return this.$(`//div[contains(@class,'mstrmojo-DerivedMetricOptions')]//div[text()='Cancel']`);
    }

    get loadingIndicator() { 
        return this.$(`//div[contains(@class,'mstrmojo-suggest-text wait')]`);
    }

    /**
     * Search for function using function name
     */
    async setFunctionsSearchKey(fnString) {
        let el = this.functionsSearchBox;
        await browser.waitUntil(EC.elementToBeClickable(el), browsers.params.timeout.waitDOMNodePresentTimeout60);
        await this.clickOnElement(el);
        await el.clear();
        await el.setValue(fnString);
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
     * Get the pulldown of the functions type list in derived metric editor
     */
    get functionsTypePullDown() {
        return this.functionsPanel.$(
            `.//div[contains(@class,'mstrmojo-DropDownButton-boxNode mstrmojo-ME-Pulldown-boxNode')]`
        );
    }

    /**
     * Get the functions type list in derived metric editor
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
        // var identifier = functionType.split(" ", 1)[0];
        var identifier = functionType.replace(/ /g, '\u00a0');
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
     * Add a function to the metric definition through double click
     * @param {string} functionName - name of function
     */
    async addFunctionByDoubleClick(functionName) {
        let el = await this.getFunctionInList(functionName);
        await this.doubleClickOnElement(el);
    }

    /**
     * Get the pulldown of the functions selection list in derived metric editor
     */
    get functionsSelectionPullDown() {
        return this.simpleMetricPanel.$(
            `.//div[contains(@class,'mstrmojo-SME-funcs-pulldown mstrmojo-ME-Pulldown-boxNode')]`
        );
    }

    /**
     * Get the functions selection list in derived metric editor
     */
    get functionsSelectionList() {
        return this.$(
            `.//div[contains(@class,'mstrmojo-Pulldown-Popup') and contains(@style, 'display: block')]//div[contains(@class,'mstrmojo-ListBase2-itemsContainer')]`
        );
    }

    /**
     * Get the function selection from popup list in the derived element editor
     * @param {string} functionSelection
     */
    getFunctionSelectioninPopupList(functionSelection) {
        return this.functionsSelectionList.$(
            `.//div[contains(@class,'mstrmojo-Pulldown-listItem')]//div[contains(string(),'${functionSelection}')]`
        );
    }

    /**
     * Get the function selection from list
     */
    getFunctionSelectionInList(functionName) {
        return this.$(`//div[contains(@class,'mstrmojo-suggest-text fn') and text()='${functionName}']`);
    }

    /**
     * Get the pulldown of the objects selection list in derived metric editor
     */
    get objectsSelectionPullDown() {
        return this.simpleMetricPanel.$(
            `.//div[contains(@class,'mstrmojo-SME-ObjectInputBox-param')]//div[contains(@class,'VALID')]//div[contains(@class,'mstrmojo-ObjectItem-down')]`
        );
    }

    /**
     * Get the objects selection list in derived metric editor
     */
    get objectsSelectionList() {
        return this.$(
            `.//div[contains(@class,'mstrmojo-ME-ObjectInputBox-suggest')]//div[contains(@class,'items-container')]`
        );
    }

    /**
     * Get the object selection from popup list in the derived element editor
     * @param {string} object
     */
    getObjectSelectioninPopupList(object) {
        return this.objectsSelectionList.$$(
            `.//div[contains(@class,'mstrmojo-suggest-text') and string() = '${object}']`
        )[0];
    }

    /**
     * Get the pulldown of the level selection list in derived metric editor
     */
    get levelSelectionPullDown() {
        return this.simpleMetricPanel.$(
            `.//div[contains(@class,'mstrmojo-ME-ObjectInputBox-level')]//div[contains(@class,'mstrmojo-ObjectItem VALID')]//div[contains(@class,'mstrmojo-ObjectItem-down')]`
        );
    }

    /**
     * Get the level selection list in derived metric editor
     */
    get levelSelectionList() {
        return this.$(
            `.//div[contains(@class,'mstrmojo-ME-ObjectInputBox-suggest')]//div[contains(@class,'items-container')]`
        );
    }

    /**
     * Get the level selection from popup list in the derived element editor
     * @param {string} object
     */
    getLevelSelectioninPopupList(object) {
        return this.levelSelectionList.$$(
            `.//div[contains(@class,'mstrmojo-suggest-text') and contains(string(),'${object}')]`
        )[0];
    }

    /**
     * Get the New Qualification popup in the derived element editor
     */
    get filterPopup() {
        return this.$(`//div[contains(@class,'mstrmojo-vi-ui-ConditionEditor')]`);
    }

    /**
     * Get the pulldown of the filter based on list in derived metric editor
     */
    get filterObjectPullDown() {
        return this.filterPopup.$(`.//div[contains(@class,'conditionWalk-target mstrmojo-ui-SearchablePulldown')]`);
    }

    /**
     * Get the filter object selection list in derived metric editor
     */
    get filterSelectionList() {
        return this.filterObjectPullDown.$(`.//div[contains(@class,'mstrmojo-PopupList ctrl-popup-list')]`);
    }

    /**
     * Get the filter selection from popup list in the derived element editor
     * @param {string} object
     */
    getFilterSelectioninPopupList(object) {
        return this.filterSelectionList.$(`.//div[contains(@class,'item unit') and contains(string(),'${object}')]`);
    }

    /**
     * Get the filter object elements list in derived metric editor
     */
    get filterElementsList() {
        return this.filterPopup.$(`.//div[contains(@class,'elementsList')]`);
    }

    /**
     * Select the given elements from elements list in the derived element editor
     * @param {string} elementsList
     */
    async setElementsSelectioninPopupList(elementsList) {
        var elements = elementsList.split(',');
        for (let element of elements) {
            let listElement = this.filterElementsList.$(
                `.//div[contains(@class,'item') and contains(string(),'${element}')]`
            );
            await this.clickOnElement(listElement);
        }
    }

    /**
     * Get the objects section of the derived metric editor
     */
    get objectsPanel() {
        return this.$(
            `//div[contains(@class,'mstrmojo-MetricIDE-browsers-container')]//div[contains(@class, 'mstrmojo-VIDatasetObjects')]`
        );
    }

    /**
     * Get the pulldown of the objects type list in derived metric editor
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
        return this.objectsPanel.$(
            `.//div[contains(@class,'docdataset-unitlist-portlet')]//div[contains(@class,'ListBase mstrmojo-VIUnitList')]`
        );
    }

    /**
     * Get the dataset object from list
     */
    getObjectInList(objectName) {
        return this.objectsList.$(`.//div[contains(@class,'item')]//span[text()='${objectName}']/parent::*`);
    }

    /**
     * Get the ValueList Dropdown
     */
    getValueListDropdown(label) {
        return this.objectsList.$(
            `//div[@class='mstrmojo-DataGrid-itemsContainer']//div[contains(@class,'VALID')]//span[text()='${label}']/ancestor::div[contains(@class,'mstrmojo-ListBase2-itemsContainer')]//div[contains(@class,'mstrmojo-ObjectItem-down')]`
        );
    }

    /**
     * Get the ValueList
     */
    getValueList(list) {
        return this.objectsList.$(
            `//div[contains(@class,'mstrmojo-Popup mstrmojo-ObjectInputBox-suggest mstrmojo-ME-ObjectInputBox-suggest')]//div[contains(@class,'items-container ')]//div[text()='${list}']`
        );
    }

    /**
     * Dropdown of ValueList
     */

    async clickOnDropdownOfValueList(label) {
        let el = await this.getValueListDropdown(label);
        await browser.waitUntil(EC.elementToBeClickable(el));
        await el.click();
    }

    /**
     * List of values available in dropdown
     */

    async selectValueList(list) {
        let el = await this.getValueList(list);
        await browser.waitUntil(EC.elementToBeClickable(el));
        await el.click();
    }

    /**
     * Add an object to the metric definition through double click
     */
    async addObjectByDoubleClick(objectName) {
        let el = await this.getObjectInList(objectName);
        await this.waitForElementClickable(el);
        await el.click();
        await this.doubleClickOnElement(el);
    }

    /**
     * Get the metric info section of the derived metric editor
     */
    get metricPanel() {
        return this.$(`//div[contains(@class,'mstrmojo-MetricEditor')]`);
    }

    /**
     * Get the currently visible metric editor panel, based on mode
     */
    get displayedMetricPanel() {
        if (this.currentStatus == 'Formula') {
            return this.metricPanel;
        } else {
            // default status is "Function"
            return this.simpleMetricPanel;
        }
    }

    /**
     * Get the new metric name
     */
    get metricName() {
        return this.displayedMetricPanel.$(
            `//div[contains(@class,'mstrmojo-Box mstrmojo-ME-nameEditBox') and not(contains(@style,'display: none;'))]//input[contains(@class,'mstrmojo-ME-nameInput')]`
        );
    }

    get formulaMetricName() {
        return this.metricPanel.$(`.//input[contains(@class,'mstrmojo-ME-nameInput')]`);
    }

    get metricNameOpenFromEdit() {
        return this.simpleMetricPanelOpenFromEdit.$(`.//input[contains(@class,'mstrmojo-ME-nameInput')]`);
    }

    /**
     * Get the new metric description
     */
    get metricDesc() {
        return this.displayedMetricPanel.$(`.//textarea[contains(@class,'mstrmojo-TextArea')]`);
    }

    /**
     * Get the new metric definition
     */
    get metricDefn() {
        return this.metricPanel.$(`.//div[contains(@class,'mstrmojo-TokenInputBox-edit')]`);
    }

    /**
     * Get the tokens from metric definition
     */
    get metricTokens() {
        return this.metricDefn.$$(`.//span[contains(@class,'mstrmojo-token')]`);
    }

    /**
     * Get the new metric definition input
     */
    async getMetricDefinition() {
        const tokenStringArr = await this.metricTokens;
        const tokenCount = await tokenStringArr.length;

        let tokenStr = '';
        for (let i = 0; i < tokenCount; i++) {
            const tokenName = await tokenStringArr[i].getText();
            tokenStr += tokenName;
        }
        return tokenStr;
    }

    /**
     * Set the new metric name
     */
    async setMetricName(newName) {
        let name = await this.metricName;
        await this.click({ elem: name });
        await this.clear({ elem: name });
        await name.setValue(newName);
    }

    async setFormulaMetricName(newName) {
        let el = this.formulaMetricName;
        await this.clickOnElement(el);
        await this.clear({ elem: el });
        // \uE007 = Enter
        await el.setValue(newName + '\uE007');
    }

    async setMetricNameOpenFromEdit(newName) {
        let el = await this.metricNameOpenFromEdit;
        await this.clickOnElement(el);
        await this.clear({ elem: el });
        // \uE007 = Enter
        await el.setValue(newName + '\uE007');
    }

    /**
     * Set the new metric description
     */
    async setMetricDesc(newDesc) {
        let el = this.metricDesc;
        await el.clear();
        await el.setValue(newDesc);
    }

    /**
     * Set the new metric definition
     */
    async setMetricDefinition(formula) {
        let el = this.metricDefn;
        //await this.metricDefn.clear();
        await this.clickOnElement(el);
        await this.clear({ elem: el });
        await el.setValue(formula);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // async setAttributeFormDefinition(formula) {
    //     let el = await this.attributeDefn;
    //     await this.waitForElementVisible(el);
    //     await this.clear({ elem: el });
    //     await el.addValue(formula);
    //     await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    // }

    /**
     * Verify if a token is present in the metric definition
     */
    async presentInMetricDefinition(newToken) {
        var tokenStringArr = this.metricTokens;
        var tokenCount;
        await tokenStringArr.length.then(function (count) {
            tokenCount = count;
        });

        var hasMatch = false;
        for (var i = 0; i < tokenCount; i++) {
            await tokenStringArr[i].getAttribute('textContent').then(function (tokenName) {
                if (tokenName == newToken) {
                    hasMatch = true;
                }
            });
            if (hasMatch) {
                break;
            }
        }
        return hasMatch;
    }

    /**
     * Get the metric definition clear button
     */
    get metricClearBtn() {
        return this.metricPanel.$(`.//div[contains(@class,'mstrmojo-WebHoverButton clear')]`);
    }

    /**
     * Clear the current metric
     */
    async clearMetric() {
        let el = await this.metricClearBtn;
        await el.waitForDisplayed();
        await this.clickOnElement(el);
    }

    /**
     * Get the warning tooltip on metric name
     */
    get warningTooltip() {
        return this.$(`//div[contains(@class, 'me-tooltip-content')]//div//span`);
    }

    /**
     * Get the metric validation status
     */
    get validateStatusLabel() {
        return this.metricPanel.$(
            `.//div[contains(@class,'mstrmojo-MEBox-status')]//div[contains(@class,'mstrmojo-MEBox-vStatus')]`
        );
    }

    /**
     * Get the metric validation status text
     */
    get validationStatusText() {
        return this.validateStatusLabel.getText();
    }

    /**
     * Get the metric validate button
     */
    get validateBtn() {
        return this.metricPanel.$(
            `.//div[contains(@class,'mstrmojo-MEBox-status')]//div[contains(@class,'mstrmojo-WebHoverButton')]`
        );
    }

    /**
     * Get the save metric button
     */
    get saveBtn() {
        return this.displayedMetricPanel.$(`.//div[contains(@class,'mstrmojo-WebButton hot')]`);
    }

    get formulaSaveBtn() {
        return this.metricPanel.$(`.//div[contains(@class,'mstrmojo-WebButton hot')]`);
    }

    /**
     * Get the add filter button
     */
    get filterBtn() {
        return this.simpleMetricPanel.$(`.//div[contains(@class,'btnAddFilter')]`);
    }

    /**
     * Get the clear filter button
     */
    get clearFilterBtn() {
        return this.simpleMetricPanel.$(`.//div[contains(@class,'btnClearFilter')]`);
    }

    /**
     * Get the save qualification button
     */
    get saveQualificationBtn() {
        return this.filterPopup.$(`.//div[contains(@class,'mstrmojo-Button-text') and text()='OK']`);
    }

    /**
     * Get the save filter button
     */
    get saveFilterBtn() {
        return this.$('.mstrmojo-FE .mstrmojo-Button.mstrmojo-WebButton.hot');
        // return this.$(`//div[contains(@class,'mstrmojo-FE')]//div[contains(@class,'mstrmojo-Button-text') and text()='Save']`);
    }

    /**
     * Get the add/show filter button's status
     */
    get filterBtnStatus() {
        return this.filterBtn.$(`.//div[contains(@class,'mstrmojo-Button-text')]`);
    }

    /**
     * Get the switch editor mode button
     */
    getSwitchBtn(modeName) {
        if (modeName == 'Formula') {
            return this.simpleMetricPanel.$(
                `.//div[contains(@class,'mstrmojo-ME-switch')]//div[contains(@class,'mstrmojo-Button-text')]`
            );
        } else if (modeName == 'Function') {
            return this.metricPanel.$(
                `.//div[contains(@class,'mstrmojo-ME-switch')]//div[contains(@class,'mstrmojo-Button-text')]`
            );
        }
    }

    /**
     * Validate the metric
     */
    async validateMetric() {
        let el = await this.validateBtn;
        await el.waitForDisplayed();
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Save the derived metric
     */
    async saveMetric() {
        let el = await this.saveBtn;
        await el.waitForDisplayed();
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    async saveFormulaMetric() {
        let el = await this.formulaSaveBtn;
        await el.waitForDisplayed();
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    /**
     * Save the derived metric when DM editor is opened from editing an existing DM, and the interface is the simple function editor interface
     */
    async saveMetricEditorOpenFromEdit() {
        let el = this.saveBtnfromSimpleMetricPanelOpenFromEdit;
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Add a filter condition to the DM
     */
    async addFilter() {
        let el = this.filterBtn;
        await this.clickOnElement(el);
    }

    /**
     * Clear a filter condition on the DM
     */
    async clearFilter() {
        let el = this.clearFilterBtn;
        await this.clickOnElement(el);
    }

    /**
     * Save a filter qualification
     */
    async saveQualification() {
        let el = this.saveQualificationBtn;
        await browser.waitUntil(EC.elementToBeClickable(el));
        await this.clickOnElement(el);
    }

    /**
     * Save a filter condition on the DM
     */
    async saveFilter() {
        let el = this.saveFilterBtn;
        await browser.waitUntil(EC.elementToBeClickable(el));
        await this.clickOnElement(el);
    }

    /**
     * Switch the editor mode of the DM
     */
    async switchMode(modeName) {
        let el = await this.getSwitchBtn(modeName);
        await this.waitForElementVisible(el);
        await this.clickOnElement(el);

        if (modeName == 'Formula') {
            this.currentStatus = 'Formula';
        } else if (modeName == 'Function') {
            this.currentStatus = 'Function';
        }
    }

    async switchModeInSimpleMetricEditor(modeName) {
        let el = this.switchBtninSimplifiedMetricPanel;
        await this.clickOnElement(el);
        if (modeName == 'Formula') {
            this.currentStatus = 'Formula';
        } else if (modeName == 'Function') {
            this.currentStatus = 'Function';
        }
    }

    async openMetricOptionsDialog() {
        await this.clickOnElement(this.metricOptionsBtn);
    }

    async openAFBPullDown() {
        await this.clickOnElement(this.metricOptionsDropDownButton);
    }

    async chooseAFB(afBehavior) {
        await this.clickOnElement(this.getMetricOptionsPulldownItem(afBehavior));
    }

    async saveAFB() {
        await this.clickOnElement(this.metricOptionsOKBtn);
    }

    async cancelAFB() {
        await this.clickOnElement(this.metricOptionsCancelBtn);
    }

    async createDerivedMetricUsingFormula({ metricName, metricDefinition }) {
        await this.waitForElementVisible(this.simpleMetricPanel);
        await this.switchMode('Formula');
        await this.setMetricName(metricName);
        await this.setMetricDefinition(metricDefinition);
        await this.saveMetric();
    }

    async waitForLoadingFinish() {
        await this.waitForElementInvisible(this.loadingIndicator);
        await browser.pause(1000);
    }
}
