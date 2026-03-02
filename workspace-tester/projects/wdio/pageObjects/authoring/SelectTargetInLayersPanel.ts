import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import BaseContainer from './BaseContainer.js';

const baseContainer = new BaseContainer();
const loadingDialog = new LoadingDialog();

export class SelectTargetInLayersPanel extends BasePage {
    getAMselectorList() {
        return this.$(`//div[@class='candidate-picker-curtain']//div[@class='mstrmojo-ui-Pulldown-text default']`);
    }

    /**
     * get AMselectorList within Visualization by viz name
     * @type {Promise<ElementFinder>}
     */
    getAMselectorListByName(VizName) {
        return this.$(
            `${baseContainer.getContainerPath(
                VizName
            )}//div[@class='candidate-picker-curtain']//div[@class='mstrmojo-ui-Pulldown-text default']`
        );
    }

    getDropDownList(ObjectName) {
        const path = `//div[@class='mstrmojo-popupList-scrollBar mstrmojo-scrollNode']//div[contains(@class,'item ic') and text()='${ObjectName}']`;
        return this.$(path);
    }

    getCurrentDropDownList(ObjectName) {
        const path = `//div[contains(@class, 'ctrl-popup-list') and not(contains(@style, 'display: none;'))]//div[contains(@class,'item ic') and text()='${ObjectName}']`;
        return this.$(path);
    }

    /**
     * get select target button When selecting targets
     * @type {Promise<ElementFinder>}
     */
    getSelectTargetApplyButton() {
        return this.$(`//div[@class='win mstrmojo-bar']//div[@class='mstrmojo-bar-buttons']//div[text()='Apply']`);
    }

    /**
     * get cancel button When selecting targets
     * @type {Promise<ElementFinder>}
     */
    getSelectTargetCancelButton() {
        return this.$(`//div[@class='win mstrmojo-bar']//div[@class='mstrmojo-bar-buttons']//div[text()='Cancel']`);
    }

    /**
     * get select target button within Visualization having one selector
     * @type {Promise<ElementFinder>}
     */
    getSelectTargetButton(selectorTitle) {
        return this.$(`${baseContainer.getContainerPath(selectorTitle)}//div[contains(@class,'btn-select-targets')]`);
    }

    /**
     * get Icon for select target in layers panel
     * VisualizationName - Name of the visualization within layers panel
     * @type {Promise<ElementFinder>}
     */
    getIconForSelectTargetInLayersPanel(VisualizationName) {
        return this.$('.mstrmojo-layersPanel').$(
            `.//span[text()='${VisualizationName}']/ancestor::span[@class='ant-tree-title']//div[contains(@class, 'action-icon target with-default')]`
        );
    }

    /**
     * get objects for select target in layers panel
     * Element name - Name of the Element of particular viuz within layers panel
     * @type {Promise<ElementFinder>}
     */
    getObjectInLayersPanelForSelectTarget(elementName) {
        const path = `//div[@class='mstrmojo-layersPanel-content mstrmojo-scrollNode']//div[@class='pcl-ui-Menu-item-container candiLayerPicker']//span[text()='${elementName}']`;
        return this.$(path);
    }

    /**
     * get objects to replcae dialog for select target in layers panel within a group
     *  ContainerName - Name of the visualization within layers panel
     * @type {Promise<ElementFinder>}
     */
    getObjectToReplaceDialogForMultipleVizInAGroup(containerName) {
        return this.$(
            `//div[@class='mstrmojo-UnitContainer-titlebar']//div[@class='title-text']//div[text()='${containerName}']/parent::div[@class='title-text']/parent::div[@class='mstrmojo-VITitleBar ']//parent::div[@class='mstrmojo-UnitContainer-titlebar']//parent::div[@class='mstrmojo-UnitContainer-ContentBox']/parent::div[@class='mstrmojo-UnitContainer-SplitterHost']/following-sibling::div[@class='mstrmojo-hasTgt']/child::*[@class='candidate-picker-curtain']//div[@class='mstrmojo-ui-Pulldown-text default']`
        );
    }

    /**
     * get Elements for select target in object to replace dialogue
     * Element name - Name of the Element of particular viuz within layers panel
     * @type {Promise<ElementFinder>}
     */
    getElementInObjectToReplaceDialogInAGroup(elementName) {
        return this.$(
            `//div[@class='mstrmojo-popup-widget-hosted mstrmojo-ui-Pulldown candiPickerPulldown mojo-theme-light' and not(contains(@style, 'display: none'))]//div[contains(@class,'item ic12') and text()="${elementName}"] `
        );
    }

    /**
     * get Elements present for select target in object to replace dialogue
     * Element name - Name of the Element of particular viuz within layers panel
     * @type {Promise<ElementFinder>}
     */
    getPresentElementInObjectToReplace(elementName) {
        return this.$(
            `//div[@class='candidate-picker-curtain' and not(contains(@style, 'display:block'))]//div[contains(@class,'mstrmojo-ui-Pulldown-text') and text()='${elementName}']`
        );
    }

    /**
     * get select source button within visualization
     * containerName is VisualizationName
     * @type {Promise<ElementFinder>}
     */
    getSourceButton(containerName) {
        return this.$(
            `${baseContainer.getContainerPath(
                containerName
            )}//following-sibling::div[@class='mstrmojo-hasTgt sourced']//div[text()='Source']`
        );
    }

    /**
     * get select target button within visualization
     * containerName is VisualizationName
     * @param {string} containerName visualization name
     */
    getTargetButton(containerName) {
        return this.$(
            `${baseContainer.getContainerPath(
                containerName
            )}//following-sibling::div[@class='mstrmojo-hasTgt']//div[text()='Target']`
        );
    }

    getTargetButtonIconPlaceHolder(containerName) {
        return this.$(
            `${baseContainer.getContainerPath(
                containerName
            )}//following-sibling::div[@class='mstrmojo-hasTgt']//div[@class='tgt']//div[@class='icon-placeholder']`
        );
    }

    async getTargetButtonImageURL(containerName) {
        const url = await this.getTargetButtonIconPlaceHolder(containerName).getCSSProperty('background-image');
        return url.value;
    }
    /**
     * get source icon in layers panel
     * containerName is VisualizationName
     * @type {Promise<ElementFinder>}
     */
    getSourceIconInLayersPanel(containerName) {
        return this.$(
            `//div[contains(@class,'ant-tree-treenode')]//span[text()='${containerName}']/parent::div[contains(@class,'Label disabled')]/parent::div/parent::span[contains(@class,'ant-tree-title')]//div[contains(@class,'action-icon source')]`
        );
    }

    /**
     * get target icon in layers panel
     * containerName is VisualizationName
     * @type {Promise<ElementFinder>}
     */
    getTargetIconInLayersPanel(containerName) {
        return this.$(
            `//div[contains(@class,'ant-tree-treenode')]//span[text()='${containerName}']/parent::div[contains(@class,'Label')]/parent::div/parent::span[contains(@class,'ant-tree-title')]//div[contains(@class,'action-icon target ')]`
        );
    }

    /**
     * get target icon without default in layers panel
     * containerName is VisualizationName
     * @type {Promise<ElementFinder>}
     */
    getTargetIconWithoutDefault(containerName) {
        return this.$(
            `//div[contains(@class,'ant-tree-treenode ant-tree-treenode-selected')]//span[text()='${containerName}']/parent::div[contains(@class,'Label')]/parent::div/parent::span[contains(@class,'ant-tree-title')]//div[contains(@class,'action-icon target without-default ')]`
        );
    }

    /**
     * get target icon witho default in layers panel
     * containerName is VisualizationName
     * @type {Promise<ElementFinder>}
     */
    getTargetIconWithDefault(containerName) {
        return this.$(
            `//div[contains(@class,'ant-tree-treenode ant-tree-treenode-selected')]//span[text()='${containerName}']/parent::div[@class='Label']/parent::div/parent::span[@class='ant-tree-title']//div[@class='action-icon target with-default ']`
        );
    }

    /**
     * get blue dot for select container in layers panel
     * VisualizationName - Name of the visualization within layers panel
     * @type {Promise<ElementFinder>}
     */
    getBlueDotInLayersPanel(VisualizationName) {
        return this.$('.mstrmojo-layersPanel').$(
            `.//span[text()='${VisualizationName}']/ancestor::span[@class='ant-tree-title']//div[@class = 'action-icon contain-targets collapsed']`
        );
    }

    /**
     * get DDIC candidate picker xpath string in visualization
     * @param {String} containerName container name
     */
    getDDICCandidatePickerPath(containerName) {
        return `${baseContainer.getContainerPath(containerName)}//div[@class ='ddic-candidate-picker']`;
    }

    /**
     * get DDIC candidate picker in visualization
     * @param {String} containerName container name
     */
    getDDICcandidatePicker(containerName) {
        return this.$(this.getDDICCandidatePickerPath(containerName));
    }

    /**
     * get DDIC candidate picker selected items text
     * @param {String} containerName container name
     */
    async getDDICPullDownText(containerName) {
        const el = await this.$(
            `${this.getDDICCandidatePickerPath(
                containerName
            )}//div[@class = 'mstrmojo-ui-Pulldown-text  hasEditableText']`
        );
        return el.getText();
    }

    /**
     * Checks if the DDIC candidate picker exists within the specified container.
     * @param {string} containerName - The name of the container to search within.
     * @returns {Promise<boolean>} - Returns true if the DDIC candidate picker is found, otherwise false.
     */
    async hasDDICcandidatePicker(containerName) {
        const els = await $$(this.getDDICCandidatePickerPath(containerName));
        return els.length !== 0;
    }

    /**
     * get DDIC candidate picker pulldown in visualization
     * @param {String} containerName container name
     */
    getDDICcandidatePickerPullDown(containerName) {
        return this.getDDICcandidatePicker(containerName).$(`.//div[contains(@class, 'mstrmojo-ui-Pulldown-text')]`);
    }

    /**
     * get DDIC candidate picker pulldown option
     * @param {String} option Attribute name in the dropdown list
     */
    getDDICcandidatePickerPullDownOption(option) {
        return this.$(
            `//div[@class= 'mstrmojo-ui-PopupWidget'and contains(@style, 'display: block')]//div[contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class, 'item') and descendant::span[text() = '${option}']]`
        );
    }

    getSelectedDDICcandidatePickerPullDownOption(option) {
        return this.$(
            `//div[@class= 'mstrmojo-ui-PopupWidget'and contains(@style, 'display: block')]//div[contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class, 'item selected') and descendant::span[text() = '${option}']]`
        );
    }

    /**
     * get OK button in candidate picker dropdown panel.
     */
    getOKButtonInDropDown(idx) {
        if (idx === undefined) {
            idx = 0;
        }
        return this.$(
            `(//div[@class= 'mstrmojo-ui-PopupWidget']//div[@class= 'mstrmojo-Button mstrmojo-WebButton hot' and @aria-label='OK'])[${idx}]`
        );
    }

    /**
     * get Cancel button in candidate picker dropdown panel.
     */
    getCancelButtonInDropDown(idx) {
        if (idx === undefined) {
            idx = 0;
        }
        return this.$(
            `//div[@class= 'mstrmojo-ui-PopupWidget']//div[@class= 'mstrmojo-Button mstrmojo-WebButton' and @aria-label='Cancel'][${idx}]`
        );
    }

    /**
     * get DDIC candidate picker pulldown option
     * @param {String} btn Button name
     */
    getDDICcandidatePickerPullDownBtn(btn) {
        return this.$(
            `//div[@class = 'mstrmojo-ui-PopupWidget' and contains(@style, 'display: block')]//div[contains(@class, 'mstrmojo-Buttons')]//div[@class='mstrmojo-Button-text ' and text()='${btn}']`
        );
    }

    /**
     * @returns Map layer selection button
     */
    getLayerSelectionButton() {
        return this.$(`//div[@id = 'mstrmojo-RootView-inlineDialog']//div[@class = 'mstrmojo-ui-Pulldown-text ']`);
    }

    /**
     * @returns Layer item
     */
    getLayerItem(idx) {
        return this.$(
            `//div[@id = 'mstrmojo-RootView-inlineDialog']//div[@class = 'mstrmojo-PopupList ctrl-popup-list mstrmojo-scrollbar-host']//div[@class='item ' and @idx='${idx}']`
        );
    }

    /**
     * Open map layer selection.
     */
    async openLayerSelection() {
        const el = await this.getLayerSelectionButton();
        await this.clickOnElement(el);
    }

    /**
     * Select new layer
     */
    async selectNewLayer(idx) {
        const el = await this.getLayerItem(idx);
        await this.clickOnElement(el);
    }

    /** Returns the select target button within the selector
     * @param {string} selectorTitle selector's title
     * @returns {Promise<ElementFinder>}
     */
    async selectTargetButton(selectorTitle) {
        const selectTarget = await this.getSelectTargetButton(selectorTitle);
        await this.clickOnElement(selectTarget);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Returns the object to replace dialog box for a particular visualization
     * @param {string} ObjectName Get current object and of object to replace dialog
     * @returns {Promise<ElementFinder>} the element from the returned result list
     */
    async objectToReplace(ObjectName) {
        const objects = await this.getAMselectorList();
        await this.clickOnElement(objects);
        await this.clickOnElement(this.getDropDownList(ObjectName));
    }

    async selectAMSelectorListObject(vizName, ObjectName) {
        const objects = await this.getAMselectorListByName(vizName);
        await this.clickOnElement(objects);
        await this.clickOnElement(this.getCurrentDropDownList(ObjectName));
    } 

    /** Returns the apply button on top toolbar
     * @returns {Promise<ElementFinder>} the element from the returned result list
     */
    async applyButtonForSelectTarget() {
        const Apply = await this.getSelectTargetApplyButton();
        await this.clickOnElement(Apply);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Returns the cancel button on top toolbar
     * @returns {Promise<ElementFinder>} the element from the returned result list
     */
    async cancelButtonForSelectTarget() {
        const cancel = await this.getSelectTargetCancelButton();
        await this.clickOnElement(cancel);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Dropdown for visualization in layers panel to select another element
     * @param {string} VisualizationName
     * @param {string} elementName
     */
    async dropDownForVisualizationInLayersPanelToSelectAnotherElement(VisualizationName, elementName) {
        const dropDown = await this.getIconForSelectTargetInLayersPanel(VisualizationName);
        await this.rightClick({ elem: dropDown });
        await this.clickOnElement(this.getObjectInLayersPanelForSelectTarget(elementName));
    }

    /**
     * Object to replace dialogue box in a group for a particular visualization
     * containerName is VisualizationName
     * @type {Promise<ElementFinder>}
     */
    async ObjectToReplaceForInAGroup(containerName) {
        const btn = this.getObjectToReplaceDialogForMultipleVizInAGroup(containerName);
        await this.clickOnElement(btn);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Object to replace dialogue box in a group for elements
     * elementName is name of the element to replace
     * @type {Promise<ElementFinder>}
     */
    async ObjectToReplaceElementsInAGroup(elementName) {
        const btn = this.getElementInObjectToReplaceDialogInAGroup(elementName);
        await this.clickOnElement(btn);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * To check whether that element is present or not
     * elementName is name of the element to replace
     * @type {Promise<ElementFinder>}
     */
    async ElementUpdate(elementName) {
        const btn = await this.getPresentElementInObjectToReplace(elementName);
        await this.clickOnElement(btn);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * To check whether the taregt with default icon is present or not
     * elementName is name of the element to replace
     * @type {Promise<ElementFinder>}
     */
    async clickOnTargetWithDefaultIconForContainerFromLayersPanel(containerName) {
        const el = await this.getTargetIconInLayersPanel(containerName);
        await this.scrollIntoView(el);
        await this.rightMouseClickOnElement(el);
    }

    /**
     * Click to open the DDIC candidate picker dropdown
     * @param {string} containerName Visualization name
     */
    async openDDICdropdown(containerName) {
        const el = await this.getDDICcandidatePickerPullDown(containerName);
        await this.clickOnElement(el);
    }

    /**
     * select elements under DDIC candidate picker dropdown
     * @param {string} options element name
     */
    async checkElementUnderDDICdropdown(options) {
        for (const option of options) {
            const el = this.getDDICcandidatePickerPullDownOption(option);
            await el.waitForClickable();
            await this.clickOnElement(await el);
            await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async selectDDICitems(containerName, options, index = 1) {
        await this.openDDICdropdown(containerName);
        await this.checkElementUnderDDICdropdown(options);
        await this.clickOKButtonInDropdown(index);
    }

    async isDDICdropdownItemSelected(options) {
        for (const option of options) {
            const el = this.getSelectedDDICcandidatePickerPullDownOption(option);
            await el.waitForDisplayed();
            const isSelected = await el.isDisplayed();
            if (!isSelected) {
                return false;
            }
        }
        return true;
    }

    /**
     * Clicks the OK button in the DDIC candidate picker dropdown.
     */
    async clickOKButtonInDropdown(idx) {
        if (idx === undefined) {
            idx = 1;
        }
        const el = this.getOKButtonInDropDown(idx);
        await el.waitForDisplayed();
        await this.clickOnElement(await el);
    }

    /**
     * Click DDIC candidate picker dropdown button
     * @param {string} btn Button name
     */
    async clickDDICdropdownBtn(btn) {
        const el = await this.getDDICcandidatePickerPullDownBtn(btn);
        await this.clickOnElement(el);
    }

    /**
     * get Select Target Visualization Filter Type pulldown option
     * @param {String} Type -- Filter / Highlight
     */
    getFilterTypeDropDown(Type) {
        return this.$(
            `//div[@class='mstrmojo-hasTgt']//div[contains(@class,'mstrmojo-ui-Pulldown-text ') and text()='${Type}']`
        );
    }

    getFilterTypeDropDownItem(ObjectName) {
        return this.$(
            `//div[@class='mstrmojo-hasTgt']//div[@class='mstrmojo-popupList-scrollBar mstrmojo-scrollNode']//div[text()='${ObjectName}']`
        );
    }
    async changeFilterType(currentType, newType) {
        const el = this.getFilterTypeDropDown(currentType);
        await this.clickOnElement(el);
        const el1 = this.getFilterTypeDropDownItem(newType);
        await this.waitForElementVisible(el1);
        await this.clickOnElement(el1);
    }
}
