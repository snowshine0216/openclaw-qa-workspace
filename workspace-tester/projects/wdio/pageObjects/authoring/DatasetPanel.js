import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import DossierMojoEditor from './DossierMojoEditor.js';
import SaveAsEditor from '../common/SaveAsEditor.js';
import CalculationMetric from './CalculationMetric.js';
import Common from './Common.js';
import Utils from './Utils.js';
import DossierEditorUtility from '../dossierEditor/components/DossierEditorUtility.js';

/**
 * Class representing the Dataset panel
 * @extends BasePage
 * @author  Chengqian Wu <cwu@microstrategy.com>
 * @author  Tingjun Ma <tinma@microstrategy.com>
 */

export default class DatasetPanel extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
        this.dossierMojoEditor = new DossierMojoEditor();
        this.calculationMetric = new CalculationMetric();
        this.dossierEditorUtility = new DossierEditorUtility();
    }

    // Element locators
    get datasetsPanel() {
        return this.$(`//div[contains(@class, 'mstrmojo-RootView-datasets')]`);
    }

    get datasetsTab(){
        return this.$(`//div[contains(@class, 'mstrmojo-VIDatasetObjects') and contains(@style,'display: block')]`);
    }

    get switchTabButton(){
        return this.$('.mstrmojo-TableOfContents .mstrmojo-switchTabBtn');
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
        return this.$(`//div[contains(@class,'mstrmojo-RootView-datasets')]//div[@class='mstrmojo-Label' and text()='Add Data']`);
    }
    // return existing objects button in datasets panel
    get existingObjecstLableOnEmptyDatasetPanel() {
        return this.$(
            `//div[contains(@class,'mstrmojo-RootView-datasets')]//div[@class='mstrmojo-Label' and text()='Existing Objects']`
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
            `//div[contains(@class,'mstrmojo-RootView-datasets')]//div[@class='mstrmojo-VITitleBar']//div[@class='right-toolbar']/descendant::div[@class='icn']`
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
            `//*[text()='${datasetName}'][ancestor::div[@class='mstrmojo-VIPanel docdataset-unitlist-portlet mstrmojo-VIPanelPortlet']]`
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
            `//div[contains(@class,'mstrmojo-RootView-datasets')]//div[@class='mstrmojo-Button-text ' and text()='${addDataOption}']`
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

    getHighlightedObjectFromDataset(objectName, objectTypeName, datasetName, keyword) {
        let objectType = Utils.objectTypeIdExtended(objectTypeName.toLowerCase(), '');
        let rebuiltObject = this.buildStringFinderForElementListSearch(keyword,objectName);
    
        return this.$(
            `//*[contains(@class,'mstrmojo-VIPanel docdataset-unitlist-portlet')]/div[@class='mstrmojo-VIPanel-content']//div[contains(@class,'ic${objectType}') and descendant::*[${rebuiltObject}] and ancestor::div[child::div[@class='mstrmojo-VIPanel-titlebar' and  child::div/child::div[@class='title-text']/child::div[text()='${datasetName}']]]]`
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

    getSaveAsEditor() {
        return this.$('.mstrmojo-SaveAsEditor');
    }

    getNameInputBoxOnSaveAsEditor() {
        return this.getSaveAsEditor().$('.mstrmojo-SaveAsEditor-nameInput');
    }
    /**
     * Get the notification for dataset in case of Edit dataset, Keep changes local and cancel
     * @param titleText the title text of the notification window
     * @returns {Promise<ElementFinder>} Option selected on notification
     */
    getOptionsFromEditDatasetNotification(itemText) {
        return this.$(
            `//div[@class='mstrmojo-Editor  mstrmojo-warning  mstrmojo-alert modal']//div[@class='mstrmojo-Editor-buttons']//table[@class='mstrmojo-HBox ']//td//div[text()='${itemText}']`
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

    getCreateObjectsBtnFromDataset(datasetName) {
        return this.$(
            `//div[text()='${datasetName}'][ancestor::div[@class='mstrmojo-VIPanel docdataset-unitlist-portlet mstrmojo-VIPanelPortlet']]/ancestor::div[contains(@class, 'mstrmojo-VIPanel-titlebar')]/following-sibling::div[@class='mstrmojo-VIPanel-content']//div[contains(@class, 'createobjects')]/span`
        );
    }

    get CreateObjectsMenu() {
        return this.$(`//div[contains(@class, 'dsCreateObjectsMenu')]`);
    }

    get DataImportDialog() {
        return this.$('.mstrmojo-di-popup');
    }

    get DIContainer() {
        return this.$('#DIContainer');
    }

    getObjectInPreviewTable(obj, table){
        return this.$(`//div[contains(@class, 'mstrmojo-di-TableView') and .//span[text() = '${table}']]//span[text() = '${obj}']`); 
    }

    getDIButtonByName(name) {
        return this.DIContainer.$(
            `//div[contains(@class, 'mstrmojo-di-button')]/div[contains(@class, 'mstrmojo-Button-text') and text()='${name}']`
        );
    }

    // Actions
    async switchDatasetsTab(){
        const isDatasetsTabVisible = await this.datasetsTab.isDisplayed();
        if (!isDatasetsTabVisible){
            await this.clickOnElement(this.switchTabButton);
        }
        await this.waitForElementVisible(this.datasetsTab);
    }

    /**
     * Click on add data button based on add data option
     * @param {string} addDataOption
     */
    async addDataFromDatasetsPanel(addDataOption) {
        await this.switchDatasetsTab();
        await this.click({ elem: this.getAddDataOptionButton(addDataOption) });
    }

    /**
     * add object to the current Viz by double click on it
     * @param {string} datasetName
     * @param {string} objectName
     * @param {string} objectTypeName
     */
    async addObjectToVizByDoubleClick(objectName, objectTypeName, datasetName) {
        await this.switchDatasetsTab();
        let el = await this.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementClickable(el);
        await el.click();
        await this.dossierEditorUtility.doubleClickOnElementThenWaitLoadingData(el);
        // to dismiss tooltip
        await this.moveToPosition({ x: 0, y: 0 });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async addObjectFromDSFolderToVizByDoubleClick(objectName, objectTypeName, datasetName, folderName) {
        let el = await this.getObjectFromDatasetFolder(objectName, objectTypeName, datasetName, folderName);
        await this.waitForElementClickable(el);
        await el.click();
        await this.dossierEditorUtility.doubleClickOnElementThenWaitLoadingData(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * add the object to filter through RMC context menu
     * @param {string} datasetName
     * @param {string} objectName
     * @param {string} objectTypeName
     */
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

    /**
     * add object from search list to the current Viz by double click on it
     * @param {string} datasetName
     * @param {string} objectName
     * @param {string} objectTypeName
     */
    async addObjectFromSearchListToVizByDoubleClick(objectName, objectTypeName, datasetName) {
        let el = await this.getObjectFromDatasetAfterSearch(objectName, objectTypeName, datasetName);
        await this.waitForElementClickable(el);
        await el.click();
        await this.dossierEditorUtility.doubleClickOnElementThenWaitLoadingData(el);
    }

    // RMC on any object(attribute/metric...) from dataset panel and select '@menuOtion'
    async actionOnObjectFromDataset(objectName, objectTypeName, datasetName, menuOption) {
        let obj = await this.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(obj);
        await this.rightMouseClickOnElement(obj);
        // await this.rightMouseClickByInjectingScript(obj);
        await this.waitForElementVisible(await this.common.contextMenu);
        let el = this.common.getContextMenuItem(menuOption);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.sleep(0.2);
    }

    // fsuo: RMC on any object(attribute/metric...) from dataset panel and select '@firstMenu' -- '@secondaryMenu'
    async secondaryCMOnObjectFromDataset(objectName, objectTypeName, datasetName, firstMenu, secondaryMenu) {
        await this.actionOnObjectFromDataset(objectName, objectTypeName, datasetName, firstMenu);
        let el = await this.common.getSecondaryContextMenu(secondaryMenu);
        await this.waitForElementVisible(el, 3 * 1000);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // fsuo: RMC on any object(metric/derived metric) from dataset panel and select '@Calculation' -- '@calculationType and @calculationMetric'
    async createCalculationFromDataset(objectName, objectTypeName, datasetName, calculationType, secondObject) {
        let el = await this.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(el);
        await this.rightMouseClickByInjectingScript(el);
        await calculationMetric.createCalculation(secondObject, calculationType);
    }

    /**
     * Edit derived attribute or metric from datasets panel through RMC context menu
     * @param {string} datasetName
     * @param {string} objectName
     * @param {string} objectTypeName
     */
    async openEditObjectEditor(objectName, objectTypeName, datasetName) {
        await this.rightMouseClickOnElement(this.getObjectFromDataset(objectName, objectTypeName, datasetName));
        if (objectTypeName == 'attribute' || objectTypeName == 'metric') {
            await this.click({ elem: this.common.getContextMenuItem('Edit...') });
        } else {
            throw `incorrect object type of ${objectTypeName}`;
        }
    }

    /**
     * operations on the dastasets panel context menu
     * @param {string} menuItemName
     */
    async selectFromDatasetsPanelContextMenu(menuItemName) {
        await this.click({ elem: this.datasetsPanelConextMenuButton });
        await this.click({ elem: this.common.getContextMenuItem(menuItemName) });
    }

    /**
     * search on datasets panel
     * @param {string} keywrods
     */
    async searchOnDatasetsPanel(keywords) {
        let el = await this.datasetsPanelSearchBox;
        await el.waitForExist();
        await el.waitForDisplayed();
        await this.click({ elem: el });
        await el.clearValue();
        await el.setValue(keywords);
    }

    /**
     * clear the search on datasets panel
     * @param {string} datasetName
     */
    async clearSearch() {
        await this.click({ elem: this.clearSearchButton });
    }

    /**
     * change the pulldown selection in the search widget
     * @param {string} item
     * Fang Suo<fsuo@microstrategy.com>
     */
    async selectFromSearchPulldown(item) {
        let el = await this.datasetsPanelSearchPulldown;
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        let isListBasePresent = await this.$('.mstrmojo-DatasetSearchWrapper .mstrmojo-ListBase').isDisplayed();
        let el2 = await this.getSelectionFromDatasetsSearchPulldownList(item, isListBasePresent);
        await this.waitForElementVisible(el2);
        await this.click({ elem: el2 });
    }

    /**
     * collapase the dataset
     * @param {string} datasetName
     */
    async collapseDataset(datasetName) {
        await this.click({ elem: this.getExpandedIconByDataset(datasetName) });
    }

    /**
     * expand the dataset
     * @param {string} datasetName
     */
    async expandDataset(datasetName) {
        await this.click({ elem: this.getCollapsedIconByDataset(datasetName) });
    }

    /**
     * collapase the folder under dataset
     * @param {string} folderName
     * @param {string} datasetName
     */
    async collapseFolderUnderDataset(folderName, datasetName) {
        await this.click({ elem: this.getExpandedIconByFolderInDataset(folderName, datasetName) });
    }

    /**
     * expand the folder under dataset
     * @param {string} folderName
     * @param {string} datasetName
     */
    async expandFolderUnderDataset(folderName, datasetName) {
        await this.click({ elem: this.getCollapsedIconByFolderInDataset(folderName, datasetName) });
    }

    /**
     * delete the dataset
     * @param {string} datasetName
     */
    async deleteDataset(datasetName) {
        let el = await this.getDatasetElement(datasetName);
        await this.rightMouseClickOnElement(el);
        await this.click({ elem: this.common.getContextMenuItem('Delete') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
    }

    /**
     * rename the object
     * @param {string} objectName
     * @param {string} objectTypeName
     * @param {string} datasetName
     * @param {string} newObjectName
     */
    async renameObject(objectName, objectTypeName, datasetName, newObjectName) {
        await this.rightMouseClickOnElement(this.getObjectFromDataset(objectName, objectTypeName, datasetName));
        let el = await this.common.getContextMenuItem('Rename');
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

    /**
     * clear the object alias from datasets panel
     * @param {string} objectName
     * @param {string} objectTypeName
     * @param {string} datasetName
     */
    async clearObjectAlias(objectName, objectTypeName, datasetName) {
        await this.rightMouseClickOnElement(this.getObjectFromDataset(objectName, objectTypeName, datasetName));
        await this.click({ elem: this.common.getContextMenuItem('Rename') });
        let elEditingTextField = this.common.editingTextField;
        await this.clearTextFromBox(elEditingTextField);
        await this.confirmInputTextByPressingEnterKeyOn(elEditingTextField);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    /**
     * duplicate as a different object type
     * @param {string} objectName
     * @param {string} objectTypeName
     * @param {string} datasetName
     * @param {string} newObjectTypeName
     */
    async duplicateObjectAs(objectName, objectTypeName, datasetName, newObjectTypeName) {
        let obj = this.getObjectFromDataset(objectName, objectTypeName, datasetName);
        // Some other object name tooltips may obscure the context menu (i.e. on Firefox). Click on the element first to solve it.
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
        // For auto model dataset, parameter is the only option in current design
        if (newObjectTypeName.toLocaleLowerCase() == 'parameter') {
            await this.click({ elem: this.common.getContextMenuItem('Duplicate as Parameter') });
        } else {
            throw `incorrect object type of ${newObjectTypeName}`;
        }
    }

    /**
     * fsuo: multi-select objects from datasets and take context menu action
     * @param {string} objectList A collection of objects in string format, where each object is separated by comma
     * @param {string} datasetName
     * @param {string} firstMenu, ex. Hide, Add to Filter
     * @example objectList = "Year, Month, Origin Airport, Number of Flights"
     */
    async multiSelectObjectsAndTakeCMAction(objectList, datasetName, firstMenu) {
        // Convert string of object list to array of object elements
        let arrayOfObjectsString = objectList.split(',').map((obj) => obj.trim());
        let arrayOfObjectsLocator = await Promise.all(
            arrayOfObjectsString.map(async (obj) => {
                return await this.getObjectFromDataset(obj, '', datasetName);
            })
        );
        // multi-select and RMC on the first element to open context menu
        await this.multiSelectElementsUsingCommandOrControl(arrayOfObjectsLocator);
        await this.rightMouseClickOnElement(arrayOfObjectsLocator[0]);
        // click on context menu
        await this.waitForElementVisible(this.common.contextMenu);
        await this.click({ elem: this.common.getContextMenuItem(firstMenu) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * fsuo: multi-select objects from datasets and take secondary context menu action
     * @param {string} objectList A collection of objects in string format, where each object is separated by comma
     * @param {string} datasetName
     * @param {string} firstMenu "Calculation"
     * @param {string} secondaryMenu "Add", "Average"....
     * @example objectList = "Year, Month, Origin Airport, Number of Flights"
     */
    async multiSelectObjectsAndTakeSecondaryCM(objectList, datasetName, firstMenu, secondaryMenu) {
        await this.multiSelectObjectsAndTakeCMAction(objectList, datasetName, firstMenu);
        await this.sleep(0.2);
        let el = await this.common.getSecondaryContextMenu(secondaryMenu);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Rename dataset
     * @param {string} datasetName
     * @param {string} newDatasetName
     */
    async renameDataset(datasetName, newDatasetName) {
        // RMC on dataset name
        let elDatasetName = this.getDatasetElement(datasetName);
        await this.rightMouseClickOnElement(elDatasetName);
        await this.click({ elem: this.common.getContextMenuItem('Rename') });
        await this.renameTextField(newDatasetName);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    /**
     * Show one single hidden object from datasets context menu based on given object name and object type
     * @param {string} objectName
     * @param {string} objectType
     */
    async showHiddenObject(objectName, objectType) {
        await this.click({ elem: this.datasetsPanelConextMenuButton });
        await this.click({ elem: this.common.getContextMenuItem('Show Hidden Objects') });
        // wait for second level context menu to pop up
        await browser.pause(0.5 * 1000);
        let objectTypeName = Utils.objectTypeIdExtended(objectType.toLowerCase(), '');
        await this.click({ elem: this.getHiddenObject(objectName, objectTypeName) });
        await this.click({ elem: this.common.getContextMenuButton('OK') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    /**
     * Show hidden objects from datasets context menu based on given object name
     * @param {string} objectNameList
     */
    async showHiddenObjects(objectNameList) {
        await this.click({ elem: this.datasetsPanelConextMenuButton });
        await this.click({ elem: this.common.getContextMenuItem('Show Hidden Objects') });
        // wait for second level context menu to pop up
        await browser.pause(0.5 * 1000);
        let arrayOfObjectsString = await objectNameList.split(',').map(function (obj) {
            return obj.trim();
        });
        for (var obj of arrayOfObjectsString) {
            await this.click({ elem: this.getHiddenObject(obj, '') });
        }
        await this.click({ elem: this.common.getContextMenuButton('OK') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    /** Click on the option in the context menu from specific dataset in dataset panel
     * For "Join Behavior" or "Replace Dataset With", there is a second level sub option menu. Use '->' to separate the second level option
     * @param {string} datasetName the dataset that should operate on
     * @param {string} option context menu option. e.g. Edit Dataset..., Replace Dataset With -> New Data...
     */
    async chooseDatasetContextMenuOption(datasetName, option) {
        await this.sleep(1);
        let dsName = await this.getDatasetElement(datasetName);
        await this.waitForElementVisible(dsName);
        await dsName.waitForClickable({ timeout: 20000 });
        await this.rightMouseClickOnElement(dsName);
        // Join Behavior or Replace Dataset With has second level context menu
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

    /** Right click on specific dataset
     * @param {string} datasetName the dataset that should operate on
     */
    async rightClickOnDataset(datasetName) {
        await this.rightMouseClickOnElement(this.getDatasetElement(datasetName));
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

    /**
     * Open the show data panel for an object through dataset panel entry point
     * @param objectName
     * @param datasetName
     */
    async showDataForSelectedDatasetAndObject(objectName, datasetName) {
        await this.chooseDatasetContextMenuOption(datasetName, 'Show Data');
        let objectElement = await this.getShowDataObject(objectName);
        await this.waitForElementVisible(objectElement);
        await this.click({ elem: objectElement });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // When there is only one pull down in the secondary context menu
    // click on the pull down and change option
    async changePullDown(fromOption, toOption) {
        await this.sleep(0.2);
        let el = this.getPullDownwithCurrentSelection(fromOption);
        await this.waitForElementVisible(el, 3 * 1000);
        await this.click({ elem: el });
        let pulldownOption = this.common.getPopupListItem(toOption);
        await this.waitForElementVisible(pulldownOption, 3 * 1000);
        await this.click({ elem: pulldownOption });
    }

    // When there are multiple pull down boxes in the secondary context menu
    // click on the pulldown and change option
    async changePullDownwithTitle(pullDownTitle, fromOption, toOption) {
        await this.sleep(0.2);
        let el = this.getPullDownwithTitle(pullDownTitle, fromOption);
        await this.waitForElementVisible(el, 3 * 1000);
        await this.click({ elem: el });
        let pulldownOption = this.common.getPopupListItem(toOption);
        await this.waitForElementVisible(pulldownOption, 3 * 1000);
        await this.click({ elem: pulldownOption });
    }

    // Mouse over attribute form in Data Type menu for XSS testing
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
        // Show Attirbute Form
        let el = await this.ShowAttForm;
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.sleep(0.3);
        // Source Attribute Form
        let el1 = await this.LinkFromAttForm;
        await this.waitForElementVisible(el1);
        await this.click({ elem: el1 });
        let el2 = await this.getOptionFromLinkAttributePullDown(sourForm);
        await this.waitForElementVisible(el2);
        await this.click(el2);
        await this.sleep(0.3);
        // To Attribute
        let el3 = await this.LinkToAtt;
        await this.waitForElementVisible(el3);
        await this.click({ elem: el3 });
        let el4 = await this.getOptionFromLinkAttributePullDown(tarAttr);
        await el4.waitForClickable();
        await this.click({ elem: el4 });
        await this.sleep(0.3);
        // To Attribute Form
        let el5 = await this.LinkToAttForm;
        await this.waitForElementVisible(el5);
        await this.click({ elem: el5 });
        let el6 = await this.getOptionFromLinkAttributePullDown(tarAttrForm);
        await this.waitForElementVisible(el6);
        await this.click({ elem: el6 });
        await this.sleep(0.3);
    }

    // Input text in the dataset save as editor
    async inputNameInatasetSaveAs(name) {
        let el = await this.datasetSaveAsTextInput;
        await this.clearTextByBackSpace(el);
        await el.setValue(name);
    }

    async changeNameInDatasetSaveAsDialog(name) {
        await this.waitForElementVisible(this.getNameInputBoxOnSaveAsEditor());
        await this.getNameInputBoxOnSaveAsEditor().clearValue();
        //wait for name input is cleared
        await this.waitForTextPresentInElementValue(this.getNameInputBoxOnSaveAsEditor(), '');
        await this.enter();
        await this.getNameInputBoxOnSaveAsEditor().setValue(name);
        //wait for name input change to expected value
        await this.waitForTextPresentInElementValue(this.getNameInputBoxOnSaveAsEditor(), name);
        await this.enter();
    }

    // Input text in the dataset save as editor
    async saveDataset() {
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
        let el = await this.dossierMojoEditor.getBtnOnEditor('Save');
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        let el2 = await this.dossierMojoEditor.getBtnOnEditor('Yes');
        let el2Present = el2.isDisplayed();
        if (el2Present) {
            await this.click(el2);
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
        }
    }

    async saveAsDataset() {
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
        await this.SaveAsEditor.clickSaveButtonInSaveAsDialog();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        let el = await this.dossierMojoEditor.getBtnOnEditor('Yes');
        let elPresent = el.isDisplayed();
        if (elPresent) {
            await this.click(el);
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
        }
    }

    // Create Time or Geo  Attribute
    // @contextOption: "Create Time Attributes" or "Define Geography"
    async createTimeOrGeoAttribute(newType, objName, datasetName, contextOption) {
        await this.actionOnObjectFromDataset(objName, 'attribute', datasetName, contextOption);
        // Cannot use common.getSecondaryContextMenu for GEO attribute since there would be more than one elements returned
        let el = await this.getOptionFromCheckList(newType);
        await this.waitForElementClickable(el);
        await this.click({ elem: el });
        await this.click({ elem: this.common.getContextMenuButton('OK') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    //option for edit dataset notifications.
    async editDatasetNotification(itemText) {
        let item = this.getOptionsFromEditDatasetNotification(itemText);
        await this.click({ elem: item });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changeNewObjectInReplaceObjectsEditor(oriObject, newObject) {
        let el = this.getPullDownForObjectInReplaceObjectsEditor(oriObject);
        await this.click({ elem: el });
        let el2 = this.common.getPopupListItem(newObject);
        await this.click({ elem: el2 });
    }

    async searchAndSelectNewObjectInReplaceObjectsEditor(searchKey, oriObject, newObject) {
        // open the dropdown
        let el = this.getPullDownForObjectInReplaceObjectsEditor(oriObject);
        await this.click({ elem: el });
        await this.dossierEditorUtility.doubleClickOnElementThenWaitLoadingData(el);
        // search
        let elEditingTextField = this.common.editingTextField;
        await this.clearTextByBackSpace(elEditingTextField);
        await browser.keys(searchKey, elEditingTextField);
        // select
        let num = newObject.indexOf(searchKey);
        if (num == 0) {
            newObject = newObject.substring(searchKey.length);
        } else {
            newObject = newObject.substring(0, num);
        }
        let el2 = this.common.getPopupListItem(newObject);
        await this.waitForElementVisible(el2);
        await this.click(el2);
    }

    async getIndexForObjectinDS(datasetName, index, objectName){
        const el = await this.getIndexOfObjectInDataset(datasetName, index, objectName);
        return parseInt(await el.getAttribute("idx"));
    }

    async switchToInReportTab() {
        await this.click({ elem: this.getInReportTab() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async switchToAllObjectsTab() {
        await this.click({ elem: this.getAllObjectsTab() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async switchToSearchTab() {
        await this.click({ elem: this.getSearchTab() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async expandAttributeFolder() {
        await this.click({ elem: this.getAttributeFolder() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async expandMetricFolder() {
        await this.click({ elem: this.getMetricFolder() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async expandCustomGroupFolder() {
        await this.click({ elem: this.getCustomGroupFolder() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async expandConsolidationFolder() {
        await this.click({ elem: this.getConsolidationFolder() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async expandDimensionFolder() {
        await this.click({ elem: this.getDimensionFolder() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async expandHierarchyFolder() {
        await this.click({ elem: this.getHierarchyFolder() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async expandTransformationFolder() {
        await this.click({ elem: this.getTransformationFolder() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async expandFilterFolder() {
        await this.click({ elem: this.getFilterFolder() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async expandTemplateFolder() {
        await this.click({ elem: this.getTemplateFolder() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
    
    // --------- Create objects to create DM/DA ---------------
    async createDMorDA(datasetName, option) {
        const createobjBtn = await this.getCreateObjectsBtnFromDataset(datasetName)
        await this.waitForElementVisible(createobjBtn);
        await this.click({ elem: createobjBtn });

        const createobjMenu = await this.CreateObjectsMenu
        await this.waitForElementVisible(createobjMenu);

        const el = await this.common.getContextMenuItem(option);
        await el.waitForClickable({ timeout: 20000 });
        await this.click({ elem: el });
    }
    
    async isDatasetDisplayed(dsName){
        const el = await this.getDatasetElement(dsName);
        if (!(await el.isExisting())) return false;

        await el.waitForDisplayed({ timeout: 20000 });
        return await el.isDisplayed();
    }

    async isObjectFromDSdisplayed(objectName, objectTypeName, datasetName){
        const el = await this.getObjectFromDataset(objectName, objectTypeName, datasetName);
        return await el.isDisplayed();
    }

    buildStringFinderForElementListSearch(keyword, str) {
        const lowerText = str.toLowerCase();
        const lowerKeyword = keyword.toLowerCase();
        const indices = [];
        let index = lowerText.indexOf(lowerKeyword);
        while (index !== -1) {
            indices.push(index);
            index = lowerText.indexOf(lowerKeyword, index + lowerKeyword.length);
        }

        const parts = [];
        let lastIndex = 0;
        indices.forEach((idx) => {
            parts.push(str.slice(lastIndex, idx));
            lastIndex = idx + lowerKeyword.length;
        });
        parts.push(str.slice(lastIndex));

        const selectors = [];
        selectors.push(`contains(text(), '${parts[0].replace(/ /g, '\u00a0')}')`);

        for (let i = 1; i < parts.length; i++) {
            selectors.push(`contains(., '${parts[i].replace(/ /g, '\u00a0')}')`);
        }

        return selectors.join(' and ');
    }

    async isHighlightedObjectFromDSdisplayed(objectName, objectTypeName, datasetName, keyword){
        const el = await this.getHighlightedObjectFromDataset(objectName, objectTypeName, datasetName, keyword);
        return await el.isDisplayed();
    }

    async currentCheckedItemFromCM(){
        const el = await this.getCheckedItemFromCM();
        return await el.getText()
    }

    async renameTextField(newName) {
        let elEditingTextField = await this.common.editingTextField;
        await this.clear({ elem: elEditingTextField });
        await this.input(newName);
        await this.enter();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async isLinkedObjectDSdisplayed (objectName, datasetName){
        const el = await this.getLinkAttributeFromDataset(objectName, datasetName);
        return await el.isDisplayed();
    }

    async isSelectExistingDatasetDialogDisplayed() {
        const el = await this.selectExistingDatasetDialog;
        return await el.isDisplayed();
    }

    async isAttributeLinked(objectName, datasetName) {
        const el = await this.getLinkAttributeFromDataset(objectName,datasetName); 
        return await el.isDisplayed();
    }

    async unmapAttribute(objectName, objectTypeName, datasetName) {
        let obj = await this.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(obj);
        await this.rightMouseClickOnElement(obj);
        // await this.rightMouseClickByInjectingScript(obj);
        await this.waitForElementVisible(await this.common.contextMenu);
        let el = this.common.getContextMenuItem('Unmap Attributes...');
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.waitForElementVisible(this.DIContainer, { timeout: 100000 });
    }

    // In Preview Page, right click on attribute from dataset and select ** from context menu
    async actionOnObjectFromPreview(obj, dataset, cmOption) {
        let el = this.getObjectInPreviewTable(obj, dataset);
        await this.waitForElementVisible(el);
        await this.rightMouseClickOnElement(el);
        let el2 = this.common.getContextMenuItem(cmOption);
        await this.clickOnElement(el2);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // Click Update Dataset from Preview Page
    async updateDatasetFromPreview() {
        await this.waitForElementVisible(this.DIContainer);
        return this.click({ elem: this.getDIButtonByName('Update Dataset') });
    }
}
