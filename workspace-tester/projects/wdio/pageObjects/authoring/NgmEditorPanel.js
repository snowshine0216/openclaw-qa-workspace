import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import CalculationMetric from './CalculationMetric.js';
import DossierMojoEditor from './DossierMojoEditor.js';
import Common from './Common.js';

/**
 * Class representing the Dataset panel
 * @extends BasePage
 * @author  Chengqian Wu <cwu@microstrategy.com>
 * @author  Tingjun Ma <tinma@microstrategy.com>
 */
export default class DatasetsPanel extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
        this.calculationMetric = new CalculationMetric();
        this.dossierMojoEditor = new DossierMojoEditor();
    }

    //#region Element Locators
    get datasetsPanel() {
        return this.$(`//div[contains(@class, 'mstrmojo-RootView-datasets')]`);
    }

    // the search panel on datasets panel
    get datasetsPanelSearchPanel() {
        return this.$(`//div[@class='mstrmojo-VIPanel-search']`);
    }

    // the pulldown within search panel on datasets panel
    get datasetsPanelSearchPulldown() {
        return this.$(`//div[@class='mstrmojo-DatasetSearchWrapper']//div[@class='mstrmojo-ui-Pulldown']`);
    }

    // get the @option from the pulldown within search panel on datasets panel
    getSelectionFromDatasetsSearchPulldownList(item, isListBasePresent) {
        if (isListBasePresent) {
            // Starting from 11.3 we have listbase for Filtering.
            return this.$(
                `//div[@class ='mstrmojo-DatasetSearchWrapper']//div[contains(@class, 'mstrmojo-ListBase')]//a[contains(@class, 'item') and .//div[contains(@class, 'mtxt') and text()='${item}']]`
            );
        } else {
            // Till 11.2.2 we were supporting Filter by All, Attributes and metrics
            return this.$(
                `//div[@class ='mstrmojo-DatasetSearchWrapper']//div[contains(@class, 'mstrmojo-PopupList')]//a[contains(@class, 'item') and .//div[contains(@class, 'mtxt') and text()='${item}']]`
            );
        }
    }

    // the search box on datasets panel
    get datasetsPanelSearchBox() {
        return this.$(`//div[contains(@class, 'mstrmojo-DatasetSearchWrapper')]//input`);
    }

    get clearSearchButton() {
        return this.$(`//div[@class='mstrmojo-DatasetSearchWrapper']//div[@class='mstrmojo-SearchBox-search clear']`);
    }

    get addDataLableOnEmptyDatasetPanel() {
        return this.$(`//div[contains(@class, 'mstrmojo-RootView-datasets')]//div[@class='mstrmojo-Label' and text()='Add Data']`);
    }
    // return existing objects button in datasets panel
    get existingObjecstLableOnEmptyDatasetPanel() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-RootView-datasets')]//div[@class='mstrmojo-Label' and text()='Existing Objects']`
        );
    }

    get matchedObjects() {
        return this.$$(
            `//div[contains(@class,'mstrmojo-VIPanelPortlet') and contains(@style,'display: block')]//span[./em]`
        );
    }

    // Add existing dataset dialog
    get selectExistingDatasetDialog() {
        return this.$(
            `//div[@class='mstrmojo-Editor mstrmojo-vi-dataset-picker modal' and contains(@style,'display: block')]`
        );
    }

    /**
     * return the dataset element denoted as the data source
     */
    get dataSourceDatasetElement() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIDatasetObjects mstrmojo-VIDocDatasetObjects')]//div[contains(@class,'mstrmojo-VITitleBar') and .//div[@class = 'item default-set']]//div[contains(@class,'mstrmojo-EditableLabe')]`
        );
    }

    get datasetsPanelConextMenuButton() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-RootView-datasets')]//div[@class='mstrmojo-VITitleBar']//div[@class='right-toolbar']/descendant::div[@class='icn']`
        );
    }

    /**
     * return the conext menu editor for calculation
     */
    get calculationMenuEditor() {
        return this.$(`//div[contains(@class, 'mstrmojo-ui-MenuPopup Calculation-MenuEditor')]`);
    }

    /**
     * Obtain dataset by name
     * @param {string} datasetName  Name of dataset
     * @returns {Promise<ElementFinder>} Dataset element
     */
    getDatasetElement(datasetName) {
        return this.$(
            `//div[text()='${datasetName}'][ancestor::div[@class='mstrmojo-VIPanel docdataset-unitlist-portlet mstrmojo-VIPanelPortlet']]`
        );
    }

    /**
     * Obtain dataset section by name to verify whether the dataset is displayed or hidden
     * @param {string} datasetName  Name of dataset
     * @returns {Promise<ElementFinder>} Dataset element
     */
    getDatasetSection(datasetName) {
        return this.$(
            `//div[text()='${datasetName}']/ancestor::div[@class='mstrmojo-VIPanel docdataset-unitlist-portlet mstrmojo-VIPanelPortlet']`
        );
    }

    /**
     * return show data object item from dataset context menu
     * @param objectName
     * @returns {Promise<ElementFinder>} Object Item for Show Data
     */
    getShowDataObject(objectName) {
        return this.$(`//div[contains(@class, 'mtxt') and text()="${objectName}"]`);
    }

    /**
     * Obtain add data button by option
     * @param {string} addDataOption - Add data option
     * @returns {Promise<ElementFinder>} add data option button
     */
    getAddDataOptionButton(addDataOption) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-RootView-datasets')]//div[@class='mstrmojo-Button-text ' and text()='${addDataOption}']`
        );
    }

    // fsuo: get the panel which holds the attribute/metric
    // can be used to verify whether the dataset is collapsed  by checking the display style
    getDatasetObjectsPanel(dtName) {
        return this.$(
            `//div[text()='${dtName}']/ancestor::div[@class='mstrmojo-VIPanel-titlebar']/parent::div/div[@class='mstrmojo-VIPanel-content']`
        );
    }

    getFolderContentPanelFromDataset(folderName, datasetName) {
        return this.$(
            `//*[contains(@class,'mstrmojo-VIPanel docdataset-unitlist-portlet') and descendant::div[text()='${datasetName}']]//*[contains(@class,'mstrmojo-VIPanel mstrmojo-VIPanelPortlet') and descendant::div[text()='${folderName}']]/div[@class='mstrmojo-VIPanel-content']`
        );
    }

    getFolderFromDatasetByIndex(index, datasetName) {
        return this.$(
            `(//*[contains(@class,'mstrmojo-VIPanel docdataset-unitlist-portlet') and descendant::div[text()='${datasetName}']]//*[contains(@class,'mstrmojo-VIPanel mstrmojo-VIPanelPortlet')]//*[contains(@class,'mstrmojo-VITitleBar small')])[${index}]`
        );
    }

    /**
     * Obtain object by name and type
     * @param {string} datasetName - Dataset name
     * @param {string} objectName  - Object name
     * @param {string} objectTypeName  - MSTR object type name, eg. attribute, metric
     * @returns {Promise<ElementFinder>} MSTR Object from dataset as Promise to ElementFinder
     */
    getObjectFromDataset(objectName, objectTypeName, datasetName) {
        let objectType = Utils.objectTypeIdExtended(objectTypeName.toLowerCase(), '');
        return this.$(
            `//*[contains(@class,'mstrmojo-VIPanel docdataset-unitlist-portlet')]/div[@class='mstrmojo-VIPanel-content']//div[contains(@class,'ic${objectType}') and child::*[text()='${objectName.replace(
                / /g,
                '\u00a0'
            )}'] and ancestor::div[child::div[@class='mstrmojo-VIPanel-titlebar' and  child::div/child::div[@class='title-text']/child::div[text()='${datasetName}']]]]`
        );
    }

    getObjectFromDatasetFolder(objectName, objectTypeName, datasetName, folderName) {
        let objectType = Utils.objectTypeIdExtended(objectTypeName.toLowerCase(), '');
        let formattedObjectName = objectName.replace(/ /g, '\u00a0');
        return this.$(
            `//*[contains(@class,'mstrmojo-VIPanel docdataset-unitlist-portlet') and descendant::div[text()='${datasetName}']]//*[contains(@class,'mstrmojo-VIPanel mstrmojo-VIPanelPortlet') and descendant::div[text()='${folderName}']]/div[@class='mstrmojo-VIPanel-content']//div[contains(@class,'ic${objectType}') and descendant::span[contains(normalize-space(.),'${formattedObjectName}')]]`
        );
    }

    getObjectFromDatasetFolderByIndex(index, datasetName, folderName) {
        return this.$(
            `//*[contains(@class,'mstrmojo-VIPanel docdataset-unitlist-portlet') and descendant::div[text()='${datasetName}']]//*[contains(@class,'mstrmojo-VIPanel mstrmojo-VIPanelPortlet') and descendant::div[text()='${folderName}']]/div[@class='mstrmojo-VIPanel-content']//div[contains(@class,'item') and @idx='${index}']`
        );
    }

    // Work for object after search in the dataset (need to improve later, only work for object without space)
    getObjectFromDatasetAfterSearch(objectName, objectTypeName, datasetName) {
        let objectType = Utils.objectTypeIdExtended(objectTypeName.toLowerCase(), '');
        let formattedObjectName = objectName.replace(/ /g, '\u00a0');
        return this.$(
            `//*[contains(@class,'mstrmojo-VIPanel docdataset-unitlist-portlet') and descendant::div[text()='${datasetName}']]/div[@class='mstrmojo-VIPanel-content']//div[contains(@class,'ic${objectType}') and descendant::span[contains(normalize-space(.),'${formattedObjectName}')]]`
        );
    }

    getSelectedObjectFromDataset(objectTypeName, datasetName) {
        let objectType = Utils.objectTypeIdExtended(objectTypeName.toLowerCase(), '');
        return this.$(
            `//*[contains(@class,'mstrmojo-VIPanel docdataset-unitlist-portlet') and descendant::div[text()='${datasetName}']]/div[@class='mstrmojo-VIPanel-content']//div[contains(@class,'ic${objectType}') and contains(@class,'selected')]`
        );
    }

    getObjectsCountFromDataset(datasetName) {
        return this.$$(
            `//div[@class='title-text']/child::div[text()='${datasetName}']//ancestor::div[contains(@class, 'mstrmojo-VIPanelPortlet')]//span`
        ).length;
    }

    getLinkAttributeFromDataset(objectName, datasetName) {
        return this.$(
            `//*[contains(@class,'mstrmojo-VIPanel docdataset-unitlist-portlet')]/div[@class='mstrmojo-VIPanel-content']//div[contains(@class,'isAttrLink') and child::*[text()='${objectName.replace(
                / /g,
                '\u00a0'
            )}'] and ancestor::div[child::div[@class='mstrmojo-VIPanel-titlebar' and  child::div/child::div[@class='title-text']/child::div[text()='${datasetName}']]]]`
        );
    }

    getUnusedObjectFromDataset(objectName, objectTypeName, datasetName) {
        let objectType = Utils.objectTypeIdExtended(objectTypeName.toLowerCase(), '');
        return this.$(
            `//*[contains(@class,'mstrmojo-VIPanel docdataset-unitlist-portlet')]/div[@class='mstrmojo-VIPanel-content']/div/div/div[contains(@class,'ic${objectType}') and contains(@class,'unused') and child::*[text()='${objectName.replace(
                / /g,
                '\u00a0'
            )}'] and parent::div/parent::div/parent::div/parent::div[child::div[@class='mstrmojo-VIPanel-titlebar' and  child::div/child::div[@class='title-text']/child::div[text()='${datasetName}']]]]`
        );
    }

    // Get the item which is checked from context menu
    // ex. join behavior
    getCheckedItemFromCM() {
        return this.$$('.mstrmojo-ui-Menu-item.on .mtxt')[0];
    }

    // Get the item which is checked from secondary context menu of context menu
    // ex - Retail sample dataset.
    getCheckedItemFromSCM(dataset) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-Menu-item')]//a[contains(@class, 'item  on') and .//div[contains(@class, 'mtxt') and text()='${dataset}']]`
        );
    }

    /**
     * Obtain object name field (to rename an object) by name and type
     * @param {string} datasetName - Dataset name
     * @param {string} objectName  - Object name
     * @param {string} objectTypeName  - MSTR object type name, eg. attribute, metric
     * @returns {Promise<ElementFinder>} MSTR Object from dataset as Promise to ElementFinder
     */
    getObjectNameFieldFromDataset(objectName, objectTypeName, datasetName) {
        // chaining xpath not works in protractor, concat xpath string instead
        let objElXpath = this.getObjectFromDataset(objectName, objectTypeName, datasetName).locator().value;
        return this.$(`${objElXpath}//*[text() = '${objectName.replace(/ /g, '\u00a0')}']`);
    }

    /**
     * rename the table element by dataset name and table name
     * @param {string} datasetName - Dataset name
     * @param {string} tableName  - Table name
     * @returns {Promise<ElementFinder>} table element
     */
    getTableFromDataset(datasetName, tableName) {
        return this.$(
            `//div[@class='mstrmojo-VIPanel docdataset-unitlist-portlet mstrmojo-VIPanelPortlet' and //div[text()='${datasetName}']]//div[@class='mstrmojo-VIPanel mstrmojo-VIPanelPortlet']//div[text()='${tableName}']`
        );
    }

    /**
     * Get expanded icon besides the dataset title by dataset name
     * @param datasetName
     * @returns {Promise<ElementFinder>} Collpased icon for the dataset
     */
    getCollapsedIconByDataset(datasetName) {
        return this.$(
            `//div[@class = 'mstrmojo-VITitleBar small collapsed' and .//div[text()='${datasetName}']]//div[@class='mstrmojo-Image']`
        );
    }

    /**
     * Get expanded icon besides the dataset title by dataset name
     * @param datasetName
     * @returns {Promise<ElementFinder>} Expanded icon for the dataset
     */
    getExpandedIconByDataset(datasetName) {
        return this.$(
            `//div[@class = 'mstrmojo-VITitleBar small' and .//div[text()='${datasetName}']]//div[@class='mstrmojo-Image']`
        );
    }

    getCollapsedIconByFolderInDataset(folderName, datasetName) {
        return this.$(
            `//div[@class='mstrmojo-VIPanel docdataset-unitlist-portlet mstrmojo-VIPanelPortlet' and //div[text()='${datasetName}']]//div[@class = 'mstrmojo-VITitleBar small collapsed' and .//div[text()='${folderName}']]//div[@class='mstrmojo-Image']`
        );
    }

    getExpandedIconByFolderInDataset(folderName, datasetName) {
        return this.$(
            `//div[@class='mstrmojo-VIPanel docdataset-unitlist-portlet mstrmojo-VIPanelPortlet' and //div[text()='${datasetName}']]//div[@class = 'mstrmojo-VITitleBar small' and .//div[text()='${folderName}']]//div[@class='mstrmojo-Image']`
        );
    }

    /**
     * Return the row of the link by attribute name within "Link Attributes Editor"
     * TODO: should consider to move to a seperate class!!
     *       currently do not support multiple link rows for same attribute
     * @param {*} attributeName
     */
    getAttributeLinkRow(attributeName) {
        return this.$(
            `//div[@class='mstrmojo-Editor mstrmojo-att-link modal']//div[@class='mstrmojo-Label mstrmojo-attName'][text()= ${attributeName}]`
        );
    }

    /**
     * Get the hidden object based on given object name and object type
     * @param objectName Be aware that spaces within the object name must be handled
     * @param objectTypeName must already been encoded into MSTR object type string, e.g. 'item ic12'
     * @returns {Promise<ElementFinder>} Hidden object elemenet
     */
    getHiddenObject(objectName, objectTypeName) {
        let path = `//div[contains(@class,'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class, '${objectTypeName}')]/span[text()='${objectName.replace(
            / /g,
            '\u00a0'
        )}']`;
        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }
        return this.$(path);
    }

    /**
     * Get the pull down based on current selection
     * @param titleText Current selection for the pull down
     * @returns {Promise<ElementFinder>} Hidden object elemenet
     */
    getPullDownwithCurrentSelection(text) {
        return this.$(`//div[contains(@class,'mstrmojo-ui-Pulldown-text ') and text()='${text}']`);
    }

    /**
     * Get the specific pull down with title
     * @param titleText the title text of the pulldown
     * @param currentSelection
     * @returns {Promise<ElementFinder>} Hidden object elemenet
     */
    getPullDownwithTitle(titleText, currentSelection) {
        return this.$(
            `//div[@class='mstrmojo-Label' and text()="${titleText}"]//ancestor::table[contains(@class,'mstrmojo-HBox')]//div[contains(@class,'mstrmojo-ui-Pulldown-text') and text()='${currentSelection}']`
        );
    }

    // Get the attribute form text in Data Type menu
    getMojoLabel(titleText) {
        return this.$(`//div[@class='mstrmojo-Label' and text()="${titleText}"]`);
    }

    // Link to other dataset
    get LinkAttributePullDown() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-att-link')]//div[contains(@class, 'mstrmojo-ui-Pulldown-text') and text()='Select an attribute']`
        );
    }

    get AddLink() {
        return this.$('.mstrmojo-att-link .mstrmojo-addLink');
    }

    get ShowAttForm() {
        return this.$('.mstrmojo-att-link .mstrmojo-showForms');
    }

    get LinkFromAttForm() {
        return this.$('.mstrmojo-att-link .mstrmojo-linkFormFromPD');
    }

    get LinkToAtt() {
        return this.$('.mstrmojo-att-link .mstrmojo-linkToAtt');
    }

    get LinkToAttForm() {
        return this.$('.mstrmojo-att-link .mstrmojo-linkFormToPD');
    }

    getOptionFromLinkAttributePullDown(item) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-PopupList') and contains(@style, 'display: block')]//div[contains(@class, 'item') and text()='${item}']`
        );
    }

    getOptionFromCheckList(item) {
        return this.$(
            `//div[contains(@class,'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-ui-CheckList')]//child::*[text()='${item}']`
        );
    }
    /**
     * Get the notification for dataset in case of Edit dataset, Keep changes local and cancel
     * @param titleText the title text of the notification window
     * @returns {Promise<ElementFinder>} Option selected on notification
     */
    getOptionsFromEditDatasetNotification(itemText) {
        return this.$(
            `//div[@class='mstrmojo-Editor mstrmojo-warning-ConfirmEditDataset mstrmojo-warning  mstrmojo-alert modal']//div[@class='mstrmojo-Editor-buttons']//table[@class='mstrmojo-HBox ']//td//div[text()='${itemText}']`
        );
    }

    get datasetSaveAsTextInput() {
        return this.$('.mstrmojo-SaveAsEditor-nameInput');
    }

    get OBList() {
        return this.$(`//div[contains(@class,'mstrmojo-ListBase2 mstrmojo-OBList mstrmojo-IF-OBList')]`);
    }

    //Get the index of object in particular dataset
    getIndexOfObjectInDataset(datasetName, index, objectName) {
        let objectNameSample = objectName.replace(/ /g, '\u00a0');
        return this.$(
            `//div[@class='mstrmojo-VIPanel docdataset-unitlist-portlet mstrmojo-VIPanelPortlet']//div[@class='title-text']//div[text()='${datasetName}']/../../../../div[@class='mstrmojo-VIPanel-content']//div[contains(@class,'mstrmojo-ListBase')]//div[contains(@class,'item unit') and @idx='${index}']//span[text()='${objectNameSample}']/..`
        );
    }

    // --------  Replace objects dialog -----------------
    getPullDownForObjectInReplaceObjectsEditor(originalObject) {
        return this.$(
            `//div[contains(@class, 'ReplaceObjectUnit-icon') and text()='${originalObject}']//ancestor::tr[contains(@class, 'mstrmojo-DataRow')]//div[contains(@class, 'mstrmojo-ui-Pulldown-text')]`
        );
    }
    //#endregion

    //#region Actions
    async addDataFromDatasetsPanel(addDataOption) {
        await this.click({ elem: this.getAddDataOptionButton(addDataOption) });
    }

    async addObjectToVizByDoubleClick(objectName, objectTypeName, datasetName) {
        let el = await this.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementClickable(el);
        await el.click();
        await this.doubleClickOnElement(el);
    }

    async addObjectFromDSFolderToVizByDoubleClick(objectName, objectTypeName, datasetName, folderName) {
        let el = await this.getObjectFromDatasetFolder(objectName, objectTypeName, datasetName, folderName);
        await this.waitForElementClickable(el);
        await el.click();
        await this.doubleClickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async addObjectToFilter(objectName, objectTypeName, datasetName) {
        await this.rightMouseClickOnElement(this.getObjectFromDataset(objectName, objectTypeName, datasetName));
        await this.click({ elem: this.common.getContextMenuItem('Add to Filter') });
    }

    async addObjectFromFolderToFilter(objectName, objectTypeName, datasetName, folderName) {
        let el = await this.getObjectFromDatasetFolder(objectName, objectTypeName, datasetName, folderName);
        await this.waitForElementClickable(el);
        await this.rightMouseClickOnElement(el);
        await this.click({ elem: this.common.getContextMenuItem('Add to Filter') });
    }

    async addObjectFromSearchListToVizByDoubleClick(objectName, objectTypeName, datasetName) {
        let el = await this.getObjectFromDatasetAfterSearch(objectName, objectTypeName, datasetName);
        await this.waitForElementClickable(el);
        await el.click();
        await this.doubleClickOnElement(el);
    }

    async actionOnObjectFromDataset(objectName, objectTypeName, datasetName, menuOption) {
        let obj = await this.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(obj);
        await this.rightMouseClickOnElement(obj);
        await this.waitForElementVisible(await this.common.contextMenu);
        let el = this.common.getContextMenuItem(menuOption);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.sleep(0.2);
    }

    async secondaryCMOnObjectFromDataset(objectName, objectTypeName, datasetName, firstMenu, secondaryMenu) {
        await this.actionOnObjectFromDataset(objectName, objectTypeName, datasetName, firstMenu);
        let el = this.common.getSecondaryContextMenu(secondaryMenu);
        await this.waitForElementVisible(el, 3 * 1000);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async createCalculationFromDataset(objectName, objectTypeName, datasetName, calculationType, secondObject) {
        let el = await this.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(el);
        await this.rightMouseClickByInjectingScript(el);
        await this.calculationMetric.createCalculation(secondObject, calculationType);
    }

    async openEditObjectEditor(objectName, objectTypeName, datasetName) {
        await this.rightMouseClickOnElement(this.getObjectFromDataset(objectName, objectTypeName, datasetName));
        if (objectTypeName == 'attribute' || objectTypeName == 'metric') {
            await this.click({ elem: this.common.getContextMenuItem('Edit...') });
        } else {
            throw `incorrect object type of ${objectTypeName}`;
        }
    }

    async selectFromDatasetsPanelContextMenu(menuItemName) {
        await this.click({ elem: this.datasetsPanelConextMenuButton });
        await this.click({ elem: this.common.getContextMenuItem(menuItemName) });
    }

    async searchOnDatasetsPanel(keywords) {
        let el = await this.datasetsPanelSearchBox;
        await el.waitForExist();
        await el.waitForDisplayed();
        await this.click({ elem: el });
        await el.clearValue();
        await el.setValue(keywords);
    }

    async clearSearch() {
        await this.click({ elem: this.clearSearchButton });
    }

    async selectFromSearchPulldown(item) {
        let el = await this.datasetsPanelSearchPulldown;
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        let isListBasePresent = await this.$('.mstrmojo-DatasetSearchWrapper .mstrmojo-ListBase').isDisplayed();
        let el2 = await this.getSelectionFromDatasetsSearchPulldownList(item, isListBasePresent);
        await this.waitForElementVisible(el2);
        await this.click({ elem: el2 });
    }

    async collapseDataset(datasetName) {
        await this.click({ elem: this.getExpandedIconByDataset(datasetName) });
    }

    async expandDataset(datasetName) {
        await this.click({ elem: this.getCollapsedIconByDataset(datasetName) });
    }

    async collapseFolderUnderDataset(folderName, datasetName) {
        await this.click({ elem: this.getExpandedIconByFolderInDataset(folderName, datasetName) });
    }

    async expandFolderUnderDataset(folderName, datasetName) {
        await this.click({ elem: this.getCollapsedIconByFolderInDataset(folderName, datasetName) });
    }

    async deleteDataset(datasetName) {
        let el = await this.getDatasetElement(datasetName);
        await this.rightMouseClickByInjectingScript(el);
        await this.click({ elem: this.common.getContextMenuItem('Delete') });
    }

    async renameObject(objectName, objectTypeName, datasetName, newObjectName) {
        await this.rightMouseClickOnElement(this.getObjectFromDataset(objectName, objectTypeName, datasetName));
        let el = this.common.getContextMenuItem('Rename');
        await this.waitForElementClickable(el);
        await this.click({ elem: el });
        await this.renameTextField(newObjectName);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    async editObject(objectName, objectTypeName, datasetName) {
        await this.rightMouseClickOnElement(this.getObjectFromDataset(objectName, objectTypeName, datasetName));
        let el = this.common.getContextMenuItem('Edit');
        await this.waitForElementClickable(el);
        await this.click({ elem: el });
    }

    async clearObjectAlias(objectName, objectTypeName, datasetName) {
        await this.rightMouseClickOnElement(this.getObjectFromDataset(objectName, objectTypeName, datasetName));
        await this.click({ elem: this.common.getContextMenuItem('Rename') });
        let elEditingTextField = this.common.editingTextField;
        await this.clearTextFromBox(elEditingTextField);
        await this.confirmInputTextByPressingEnterKeyOn(elEditingTextField);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async duplicateObjectAs(objectName, objectTypeName, datasetName, newObjectTypeName) {
        let obj = this.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.click({ elem: obj });
        await this.rightMouseClickOnElement(obj);
        if (newObjectTypeName.toLocaleLowerCase() == 'attribute') {
            await this.click({ elem: this.common.getContextMenuItem('Duplicate as Attribute') });
        } else if (newObjectTypeName.toLocaleLowerCase() == 'metric') {
            await this.click({ elem: this.common.getContextMenuItem('Duplicate as Metric') });
        } else if (newObjectTypeName.toLocaleLowerCase() == 'parameter') {
            await this.click({ elem: this.common.getContextMenuItem('Duplicate as Parameter') });
        } else {
            throw `incorrect object type of ${newObjectTypeName}`;
        }
    }

    async duplicateObjectInFolderAs(objectName, objectTypeName, folderName, datasetName, newObjectTypeName) {
        let obj = await this.getObjectFromDatasetFolder(objectName, objectTypeName, datasetName, folderName);
        await this.waitForElementClickable(obj);
        await this.click({ elem: obj });
        await this.rightMouseClickOnElement(obj);
        if (newObjectTypeName.toLocaleLowerCase() == 'parameter') {
            await this.click({ elem: this.common.getContextMenuItem('Duplicate as Parameter') });
        } else {
            throw `incorrect object type of ${newObjectTypeName}`;
        }
    }

    async multiSelectObjectsAndTakeCMAction(objectList, datasetName, firstMenu) {
        let arrayOfObjectsString = objectList.split(',').map((obj) => obj.trim());
        let arrayOfObjectsLocator = await Promise.all(
            arrayOfObjectsString.map(async (obj) => {
                return await this.getObjectFromDataset(obj, '', datasetName);
            })
        );
        await this.multiSelectElementsUsingCommandOrControl(arrayOfObjectsLocator);
        await this.rightMouseClickOnElement(arrayOfObjectsLocator[0]);
        await this.waitForElementVisible(this.common.contextMenu);
        await this.click({ elem: this.common.getContextMenuItem(firstMenu) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async multiSelectObjectsAndTakeSecondaryCM(objectList, datasetName, firstMenu, secondaryMenu) {
        await this.multiSelectObjectsAndTakeCMAction(objectList, datasetName, firstMenu);
        await this.sleep(0.2);
        let el = await this.common.getSecondaryContextMenu(secondaryMenu);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async renameDataset(datasetName, newDatasetName) {
        let elDatasetName = await this.getDatasetElement(datasetName);
        await this.rightMouseClickOnElement(elDatasetName);
        await this.click({ elem: this.common.getContextMenuItem('Rename') });
        await this.renameTextField(newDatasetName);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async showHiddenObject(objectName, objectType) {
        await this.click({ elem: this.datasetsPanelConextMenuButton });
        await this.click({ elem: this.common.getContextMenuItem('Show Hidden Objects') });
        await browser.pause(0.5 * 1000);
        let objectTypeName = Utils.objectTypeIdExtended(objectType.toLowerCase(), '');
        await this.click({ elem: await this.getHiddenObject(objectName, objectTypeName) });
        await this.click({ elem: this.common.getContextMenuButton('OK') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async showHiddenObjects(objectNameList) {
        await this.click({ elem: this.datasetsPanelConextMenuButton });
        await this.click({ elem: this.common.getContextMenuItem('Show Hidden Objects') });
        await browser.pause(0.5 * 1000);
        let arrayOfObjectsString = await objectNameList.split(',').map(function (obj) {
            return obj.trim();
        });
        for (var obj of arrayOfObjectsString) {
            await this.click({ elem: await this.getHiddenObject(obj, '') });
        }
        await this.click({ elem: this.common.getContextMenuButton('OK') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async chooseDatasetContextMenuOption(datasetName, option) {
        await this.sleep(1);
        let dsName = await this.getDatasetElement(datasetName);
        await this.waitForElementVisible(dsName);
        await dsName.waitForClickable({ timeout: 20000 });
        await this.rightMouseClickOnElement(dsName);
        if (option.toLowerCase().includes('->')) {
            let el1 = await this.common.getContextMenuItem(option.split('->')[0].trim());
            await el1.waitForClickable({ timeout: 20000 });
            await this.click({ elem: el1 });
            await this.sleep(0.5);
            let el2 = await this.common.getContextMenuItem(option.split('->')[1].trim());
            await el2.waitForClickable({ timeout: 20000 });
            await this.click({ elem: el2 });
        } else {
            let el = await this.common.getContextMenuItem(option);
            await el.waitForClickable({ timeout: 20000 });
            await this.click({ elem: el });
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(60);
    }

    async rightClickOnDataset(datasetName) {
        await this.rightMouseClickOnElement(await this.getDatasetElement(datasetName));
    }

    async searchAndAddExistingDataset(datasetName) {
        await this.sleep(0.5);
        await this.loadingDialog.waitBooketLoaderIsNotDisplayed(120);
        let OBList = await this.OBList;
        await this.waitForElementVisible(OBList, 120 * 1000);
        await this.dossierMojoEditor.searchAndSelect(datasetName);
        await this.sleep(0.5);
        await this.dossierMojoEditor.clickBtnOnMojoEditor();
    }

    async showDataForSelectedDatasetAndObject(objectName, datasetName) {
        await this.chooseDatasetContextMenuOption(datasetName, 'Show Data');
        let objectElement = await this.getShowDataObject(objectName);
        await this.waitForElementVisible(objectElement);
        await this.click({ elem: objectElement });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changePullDown(fromOption, toOption) {
        await this.sleep(0.2);
        let el = await this.getPullDownwithCurrentSelection(fromOption);
        await this.waitForElementVisible(el, 3 * 1000);
        await this.click({ elem: el });
        let pulldownOption = this.common.getPopupListItem(toOption);
        await this.waitForElementVisible(pulldownOption, 3 * 1000);
        await this.click({ elem: pulldownOption });
    }

    async changePullDownwithTitle(pullDownTitle, fromOption, toOption) {
        await this.sleep(0.2);
        let el = await this.getPullDownwithTitle(pullDownTitle, fromOption);
        await this.waitForElementVisible(el, 3 * 1000);
        await this.click({ elem: el });
        let pulldownOption = this.common.getPopupListItem(toOption);
        await this.waitForElementVisible(pulldownOption, 3 * 1000);
        await this.click({ elem: pulldownOption });
    }

    async hoverAttributeFormInDataTypeMenu(formName) {
        let el = await this.getMojoLabel(formName);
        await this.waitForElementVisible(el);
        await this.hoverMouseOnElement(el);
    }

    async linkAttribute(tarAttribute) {
        let el = await this.LinkAttributePullDown;
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        let el2 = await this.getOptionFromLinkAttributePullDown(tarAttribute);
        await this.waitForElementVisible(el2);
        await this.click({ elem: el2 });
    }

    async linkAttributeForm(sourForm, tarAttr, tarAttrForm) {
        // Show Attribute Form
        const el = await this.ShowAttForm;
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.sleep(0.3);

        // Source Attribute Form
        const el1 = await this.LinkFromAttForm;
        await this.waitForElementVisible(el1);
        await this.click({ elem: el1 });
        const el2 = await this.getOptionFromLinkAttributePullDown(sourForm);
        await this.waitForElementVisible(el2);
        await this.click({ elem: el2 });
        await this.sleep(0.3);

        // To Attribute
        const el3 = await this.LinkToAtt;
        await this.waitForElementVisible(el3);
        await this.click({ elem: el3 });
        const el4 = await this.getOptionFromLinkAttributePullDown(tarAttr);
        await el4.waitForClickable();
        await this.click({ elem: el4 });
        await this.sleep(0.3);

        // To Attribute Form
        const el5 = await this.LinkToAttForm;
        await this.waitForElementVisible(el5);
        await this.click({ elem: el5 });
        const el6 = await this.getOptionFromLinkAttributePullDown(tarAttrForm);
        await this.waitForElementVisible(el6);
        await this.click({ elem: el6 });
        await this.sleep(0.3);
    }

    async inputNameInatasetSaveAs(name) {
        let el = await this.datasetSaveAsTextInput;
        await this.clearTextByBackSpace(el);
        await el.setValue(name);
    }

    async saveDataset() {
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
        let el = await this.dossierMojoEditor.getBtnOnEditor('Save');
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        let el2 = await this.dossierMojoEditor.getBtnOnEditor('Yes');
        let el2Present = el2.isDisplayed();
        if (el2Present) {
            await this.click({ elem: el2 });
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
        }
    }

    async createTimeOrGeoAttribute(newType, objName, datasetName, contextOption) {
        await this.actionOnObjectFromDataset(objName, 'attribute', datasetName, contextOption);
        let el = await this.getOptionFromCheckList(newType);
        await this.waitForElementClickable(el);
        await this.click({ elem: el });
        await this.click({ elem: this.common.getContextMenuButton('OK') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async editDatasetNotification(itemText) {
        let item = await this.getOptionsFromEditDatasetNotification(itemText);
        await this.click({ elem: item });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changeNewObjectInReplaceObjectsEditor(oriObject, newObject) {
        let el = await this.getPullDownForObjectInReplaceObjectsEditor(oriObject);
        await this.click({ elem: el });
        let el2 = this.common.getPopupListItem(newObject);
        await this.waitForElementVisible(el2);
        await this.click({ elem: el2 });
    }

    async searchAndSelectNewObjectInReplaceObjectsEditor(searchKey, oriObject, newObject) {
        let el = await this.getPullDownForObjectInReplaceObjectsEditor(oriObject);
        await this.click({ elem: el });
        await this.doubleClickOnElement(el);
        let elEditingTextField = this.common.editingTextField;
        await this.clearTextByBackSpace(elEditingTextField);
        await browser.keys(searchKey, elEditingTextField);
        let num = newObject.indexOf(searchKey);
        if (num == 0) {
            newObject = newObject.substring(searchKey.length);
        } else {
            newObject = newObject.substring(0, num);
        }
        let el2 = this.common.getPopupListItem(newObject);
        await this.waitForElementVisible(el2);
        await this.click({ elem: el2 });
    }
    //#endregion
}
