"user strict";

import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import { scrollIntoView } from '../../utils/scroll.js';


export default class ExistingObjectsDialog extends BasePage{
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        // this.dossierEditorUtility = new DossierEditorUtility();
    }
    
    get existingObjectDialog () {
        return this.$('.mstrmojo-Editor mstrmojo-VIDatasetEditor modal');
    }

    get dataAccessModePulldown() {
        return this.ActiveEditor.$(`//div[contains(@class,'mstrmojo-Editor-buttons')]//div[contains(@class,'dataModeContainer')]//div[contains(@class,'mstrmojo-ui-Pulldown')]//div[contains(@class, 'mstrmojo-ui-Pulldown-text')]`);
    }
    
    getConnectLiveItem() {
        return this.$(`//div[contains(@class, 'mstrmojo-Editor-buttons')]//div[contains(@class,'dataModeContainer')]//div[contains(@class,'live-mode-pulldown')]//div[contains(@class, 'mstrmojo-popupList-scrollBar')]//div[contains(@class, 'item') and text()='Connect Live']`);
    }

    getInMemeoryItem() {
        return this.$(`//div[contains(@class, 'mstrmojo-Editor-buttons')]//div[contains(@class,'dataModeContainer')]//div[contains(@class,'live-mode-pulldown')]//div[contains(@class, 'mstrmojo-popupList-scrollBar')]//div[contains(@class, 'item') and text()='In-Memory']`);
    }

    getLiveDatasetLabel(){
        return this.$(`//div[contains(@class, 'mstrmojo-VIDatasetObjects')]//div[contains(@class, 'mstrmojo-VIPanelContents')]//div[contains(@class, 'mstrmojo-Label dataset-type') and text()='Live']`);
    } 

    getInMemDatasetLabel(){
        return this.$(`//div[contains(@class, 'mstrmojo-VIDatasetObjects')]//div[contains(@class, 'mstrmojo-VIPanelContents')]//div[contains(@class, 'mstrmojo-Label dataset-type') and text()='In memory']`);
    } 

    attributeTimeFolder () {
        
        //return element(by.xpath(`//*[@id='mstr380']//div[@class='mstrmojo-TreeNode-div']//span[@class='mstrmojo-TreeNode-text folder']`));
        return this.$(`//div[@class='mstrmojo-Editor-content']//div[@class='mstrmojo-VIPanel-contentContainer']//span[text()='Time']`);
    }

    getdataAccessModeLabel() {
        return this.$(`(//div[contains(@class,'dataModeContainer')]//div[contains(@class,'live-mode-pulldown-label')]//div[contains(@class,'mstrmojo-Label')])[2]`);
    }

    getdataAccessModepulldown() {
        return this.$(`(//div[contains(@class,'dataModeContainer')]//div[contains(@class,'live-mode-pulldown')]/div[contains(@class,'mstrmojo-ui-Pulldown')])[2]`);
    }

    getDragObjectsPlaceholder() {
        return this.$(`//div[contains(@class,'mstrmojo-Editor mstrmojo-VIDatasetEditor') and contains(@style,'display: block')]//div[contains(@class, 'dragObjectMsg')]`);
    }

    // -------------- fsuo: Add below basic steps/functions --------------------
    // The select exsting objects dialog still exists in dom when you close it. 
    // So when you open the dialog agian, there would be two dialogs in dom. 
    // Use diaplay style to get the active edtior 
    get ActiveEditor(){
        return this.$(`//div[contains(@class,'mstrmojo-Editor mstrmojo-VIDatasetEditor') and contains(@style,'display: block')]`); 
    }

    getMetricsFromObjectBrowserPulldown (){
       return this.ActiveEditor.$(`.//div[contains(@class, 'mstrmojo-PopupList')]//div[contains(@class, 'item') and text()='Metrics']`);
    } 

    get objectBrowserPulldownText (){
       return this.ActiveEditor.$(`(.//div[contains(@class, 'mstrmojo-Editor-content')]//div[contains(@class, 'mstrmojo-VIDatasetEditorContents')]//div[contains(@class, 'objbrowserContainer')]//div[contains(@class, 'filter')]//div[contains(@class, 'mstrmojo-ui-Pulldown')])[1]`);
    }

    get spinIconInMDBrowser() {
        return this.$(`//div[@class='mstrmojo-ListBase2 mstrmojo-TreeBrowser loading' and contains(@style,'display: block')]`);
    }

    getDatasetErrorInViz(){
        return this.$(`//div[contains(@class, 'mstrmojo-VIPanel ')]//div[contains(@class, 'mstrmojo-VIVizPanel-content')]//div[contains(@class,'mstrmojo-UnitContainer-ContentBox')]//div[contains(@class,'error-content')]`);
    }
  
    /**
     * get cartesian join dropdown menu in the existing objects editor
     */
    get CartesianJoinDropdownMenu() {
        return this.$(`//div[contains(@class,'mstrmojo-Editor mstrmojo-VIDatasetEditor') and contains(@style,'display: block')]//div[@class='cartesianBox']//div[@class='mstrmojo-ui-Pulldown']`);
    }

    /**
     * get cartesian join warning button in the existing objects editor
     */
    get CartesianJoinWarningButton() {
        return this.$(`.mstrmojo-VIDatasetEditor[style*='display: block'] .cartesianBox .warningTooltipBtn`); 
    }

    /**
     * get cartesian join options in the existing objects editor
     * @param {String} optionName
     */
    getCartesianJoinOption(optionName) {
        return this.$(`//div[contains(@class,'mstrmojo-Editor mstrmojo-VIDatasetEditor') and contains(@style,'display: block')]//div[@class='cartesianBox']//div[@class='container']//div[text()='${optionName}']`);
    }

    // Applicable to folder, attribute, metric ... in the object browse container 
    getObjectFromObjectBrowseContainer(obj){
        let objRename = obj.replace(/ /g, '\u00a0'); 
        return this.$(`//div[contains(@class,'mstrmojo-Editor mstrmojo-VIDatasetEditor') and contains(@style,'display: block')]//div[contains(@class,'mstrmojo-TreeNode-div') and child::span[contains(@class, 'mstrmojo-TreeNode-text') and text() = '${objRename}']]`);   
    }

    getObjectTextFromObjectBrowseContainer(obj){
        let objRename = obj.replace(/ /g, '\u00a0'); 
        return this.ActiveEditor.$(`.//span[contains(@class,'mstrmojo-TreeNode-text') and text()= '${objRename}']`); 
    }

    get loadingTextFromObjectBrowserContainer() {
        return this.$(`//div[@class='mstrmojo-TreeNode-itemsContainer' and contains(@style,'display: block')]//div[@class='mstrmojo-TreeNode-div']//span[@class='mstrmojo-TreeNode-text loading' and text()='Loading...']`);
    }

    // Get the object from the dataset editor on the right side 
    getObjectFromDatasetContainer(obj){
        let objRename = obj.replace(/ /g, '\u00a0'); 
        return this.$(`//div[contains(@class,'mstrmojo-Editor mstrmojo-VIDatasetEditor') and contains(@style,'display: block')]//div[contains(@class,'datasetEditorContainer')]//div[contains(@class,'mstrmojo-ListBase')]//div[contains(@class,'item')]//span[text() = '${objRename}']`); 
    }

    async getContexMenu(objName, menuItem){
        let el = await this.getObjectFromDatasetContainer(objName);
        await this.rightMouseClickOnElement(el);
        return this.$(`//div[contains(@class, 'mstrmojo-ListBase')]//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]//div[contains(@class, 'mtxt')] and text()='${menuItem}]`);
    }

    get objectDeleteOption(){
        return  this.$(`(//div[contains(@class, 'mstrmojo-ListBase')]//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]//div[contains(@class,'mtxt')])[1]`);
    }
    
    async deleteObjectFromDatasetContainer(object){
        let el = await this.getObjectFromDatasetContainer(object);
        await this.waitForElementVisible(el);
        await this.rightMouseClickOnElement(el);
        await this.sleep(1)
        let deleteOpt = await this.objectDeleteOption;
       
        await this.clickOnElement(deleteOpt);
        await this.sleep(1);
    }

    getButtonFromExistingObjectsDialog(obj){
        return this.$(`//div[contains(@class,'mstrmojo-Editor mstrmojo-VIDatasetEditor') and contains(@style,'display: block')]//div[contains(@class,'mstrmojo-Editor-button') and not (contains(@class,'disabled')) and child::div[text()='${obj}']]`); 
    }

    //Former dropdown for existing objects --> Attrbutes
    getObjectDropDownForExistingObjects(options){
        return this.$(`//div[contains(@class,'mstrmojo-Editor mstrmojo-VIDatasetEditor') and contains(@class,'modal')]//div[@class='mstrmojo-VIDatasetEditorContents']//div[@class='objbrowserContainer']//div[contains(@class,'mstrmojo-ui-Pulldown') and text()='${options}']`);
    }

    //Later dropdown for existing objects dropedown -->Either Metric, Public objects, My personal objects.
    getOptionFromPullDownListForExistingObjects(options){
        return this.$(`//div[contains(@class,'mstrmojo-Editor mstrmojo-VIDatasetEditor') and contains(@class,'modal')]//div[@class='mstrmojo-VIDatasetEditorContents']//div[@class='objbrowserContainer']//div[@class='mstrmojo-ui-Pulldown']//div[@class='mstrmojo-popupList-scrollBar mstrmojo-scrollNode']//div[text()='${options}']`);
    }

    getWarningButton(){
        return this.$(`//div[@class='mstrmojo-Button mstrmojo-WebButton warningTooltipBtn mstrmojo-Editor-button']`);
    }

    getWarningMessageText(){
        let a = this.$(`//div[contains(@class,'mstrmojo-Tooltip-content')]//div[contains(@class,'name')]`);
        return a.getText();
    }

     get SearchInputBoxOnAddExistingObjectsDialog() {
        return this.$(`//div[contains(@class,'mstrmojo-Editor mstrmojo-VIDatasetEditor')]//div[@class='mstrmojo-VIDatasetEditorContents']//div[@class='objbrowserContainer']//div[@class='search-box']//input`);
    }

    getVerticleScrollbarOnEditor(orientation) {
        orientation = orientation.toLowerCase();
        return this.$(`//div[@class='mstrmojo-VIPanel mstrmojo-VIAllObjectsBrowser datasetEditorobjbrowser']//div[contains(@class,'mstrmojo-VIPanel-content mstrmojo-scrollNode hasVertical')]/following-sibling::div[contains(@class,'scrolltrack')]/div[@class='mstrmojo-scrollbar ${orientation}']`);

    }

    getTextofPanelContainer(){
        return this.ActiveEditor. $(`.//div[contains(@class,'mstrmojo-TreeNode-div') and child::span[contains(@class, 'mstrmojo-TreeNode-text')]]`).last();  

    }

    get addFilterBtn() {
        return  this.ActiveEditor.$(`.//div[contains(@class,'datasetEditorContainer')]//div[text()='Add Filter...']`);
    }

    get editFilterBtn() {
        return  this.ActiveEditor.$(`.//div[contains(@class,'datasetEditorContainer')]//div[text()='Edit Filter...']`);
    }

    get createParameterBtn() {
        return  this.ActiveEditor.$(`.//div[contains(@class,'datasetEditorContainer')]//div[@class='addParameterLink']//div[text()='Create Parameter']`);
    }

    get clearAllBtn() {
        return this.ActiveEditor.$(`.//div[contains(@class,'datasetEditorContainer')]//div[contains(text(),'Clear All')]`);
    }

    getCreateParameterTypeLabel(type) {
        return this.$(`//div[contains(@class,'mnu--vi-create-parameter') and contains(@class,'visible')]//a[contains(@class,'mstrmojo-ui-Menu-item')]/div[text()='${type}']`)
    }

    get MDObjectBrowserPopup() {
        return this.$(`.ObjectBrowserPopup .mstrmojo-TreeBrowser[style*='display: block']`); 
    }

    getFolderFromMDBrowser(folder){
        return this.MDObjectBrowserPopup.$(`.//div[contains(@class,'mstrmojo-TreeNode-div') and child::span[text()='${folder}']]/img[contains(@class, 'mstrmojo-TreeNode-state')]`);
    }

    getObjectFromMDBrowser(obj){
        obj = obj.replace(/ /g, '\u00a0'); 
        return this.MDObjectBrowserPopup.$(`.//div[contains(@class,'mstrmojo-TreeNode-div') and child::span[contains(@class, 'mstrmojo-TreeNode-text') and text() = '${obj}']]`);
    }

    getInfoIcon(){
        return this.$(`(//div[@class='mstrmojo-Label info-icon'])[2]`);
    }

    // expand a folder
    async expandFolder(title){
        let elParent = await this.getObjectFromObjectBrowseContainer(title); 
        await elParent.waitForDisplayed();
        await scrollIntoView(elParent);
        let el = await this.getObjectTextFromObjectBrowseContainer(title);
        await this.clickOnElement(el); 
        let loadingText = await this.loadingTextFromObjectBrowserContainer;
        if(await loadingText.isDisplayed()) {
            await this.waitForElementInvisible(loadingText);
        }
        await this.sleep(1); 
    }

    // double click to add an object
    async doubleClickOnObject(objName){
        let el = await this.getObjectFromObjectBrowseContainer(objName); 
        await scrollIntoView(el);
        await this.sleep(0.5);
        await this.doubleClickOnElement(el); 
        await this.sleep(1); 
    }
    
    async selectMetricsFromDropdown(){
        let el = await this.objectBrowserPulldownText; 
        await this.clickOnElement(el); 

        let el2 = await this.getMetricsFromObjectBrowserPulldown();
        await this.clickOnElement(el2);

        let spinIcon = await this.spinIconInMDBrowser;
        if(await spinIcon.isDisplayed()){
            await this.waitForElementInvisible(spinIcon, {timeout: 120 * 1000}); 
        }

        await this.sleep(2);
    }

    async selectAccessModeFromDropdown(buttonName){
        let pulldown = await this.dataAccessModePulldown; 
        await this.clickOnElement(pulldown); 
        await this.sleep(1);

        let option;
        if (buttonName === 'Connect Live') {
            option = await this.getConnectLiveItem();
        } else {
            option = await this.getInMemeoryItem();
        }

        this.clickOnElementBySettingMouseOver(option); 
       
        await this.sleep(3);
    }

    async clickOnBtn(btnText){
        let el = await this.getButtonFromExistingObjectsDialog(btnText); 
        await el.waitForDisplayed(); 
        await this.clickOnElement(el); 
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(180);
    }
    // --------------------------------------------------------------------------

    get editorDropZone() {
        return this.$(`//*[@class='datasetEditorContainer']//div[@class='mstrmojo-scrollNode']//div[@class='mstrmojo-Box datasetEditorUnitlistContainer']`); 
    }

    get editorDropZoneAttributeList() {
        return this.$(`//*[@class='datasetEditorContainer']//div[@class='datasetEditorContent mstrmojo-scrollbar-host']//div[@class='mstrmojo-scrollNode']//div[@class='mstrmojo-Box datasetEditorUnitlistContainer']//div[@class='mstrmojo-ListBase attUnitlist mstrmojo-VIUnitList']`); 
    }

    get editorDropZoneMetricList() {
       return this.$(`//*[@class='datasetEditorContainer']//div[@class='datasetEditorContent mstrmojo-scrollbar-host']//div[@class='mstrmojo-scrollNode']//div[@class='mstrmojo-Box datasetEditorUnitlistContainer']//div[@class='mstrmojo-ListBase mxUnitlist mstrmojo-VIUnitList']`);
    }

    getEditorDropZoneParameterListPath() {
        return `//*[@class='datasetEditorContainer']//div[@class='datasetEditorContent mstrmojo-scrollbar-host']//div[@class='mstrmojo-scrollNode']//div[@class='mstrmojo-Box datasetEditorUnitlistContainer']//div[@class='mstrmojo-ListBase prmUnitlist mstrmojo-VIUnitList']`;
    }

    get editorDropZoneParameterList() {
        return this.$(this.getEditorDropZoneParameterListPath());
    }

    getAttributeInDropzone(objectName) {
        return this.editorDropZoneAttributeList.$(`.//span[text()='${objectName.replace(/ /g, '\u00a0')}']`);
    }

    getMetricInDropzone(objectName) {
        return this.editorDropZoneMetricList.$(`.//span[text()='${objectName.replace(/ /g, '\u00a0')}']`);
    }

    getParameterInDropzone(objectName) {
        return this.$(`//div[contains(@class, 'mstrmojo-VIDatasetEditor enablePushDownFilter') and not(contains(@style, 'display: none'))]${this.getEditorDropZoneParameterListPath()}//span[text()='${objectName.replace(/ /g, '\u00a0')}']`);
        // return this.editorDropZoneParameterList.$(`.//span[text()='${objectName.replace(/ /g, '\u00a0')}']`);
    }

    getContextMenuItem(menuItem) {
        return this.$(`//div[contains(@class, 'mstrmojo-ListBase')]//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]//div[contains(@class, 'mtxt') and text()='${menuItem}']`);
    }

    /**
     * Get the option button inside notification for "Clear All" in dataset editor
     * @param {string} buttonName the button name inside the notification window
     * @returns {Promise<ElementFinder>} Option selected on notification
     */
    getOptionsFromClearAllNotification(buttonName){
        return this.$(`//div[@class='mstrmojo-Editor  mstrmojo-alert modal']//div[@class='mstrmojo-Editor-buttons']//table[@class='mstrmojo-HBox ']//td//div[text()='${buttonName}']`)
    }

    async confirmYearInDropzone() {
        let year = await this.$(`//body[contains(@class,'Red mstrDHTML mstrFullScreen mstr-page-Html5Vi mstr-chrome workstation')]/div[@id='mstr329']/div[contains(@class,'mstrmojo-Editor mstrmojo-VIDatasetEditor modal')]/div[contains(@class,'mstrmojo-Editor-content')]/div[contains(@class,'mstrmojo-VIDatasetEditorContents')]/div[contains(@class,'datasetEditorContainer')]/div[contains(@class,'datasetEditorContent mstrmojo-scrollbar-host')]/div[contains(@class,'mstrmojo-scrollNode')]/div[@id='mstr347']/div[@id='mstr351']/div/div[1]`)
        await browser.waitUntil(EC.presenceOf(year));
        browser.pause(5000); 
    }
    
    async getAttributeFromFolder(objectName) {
        return this.$(`//*[@id='mstr380']//div[@class='mstrmojo-TreeNode-itemsContainer']//span[contains(text(),'ic${objectName}')]`);
    }
    
    async dragAttToDropzone (objectName) {
        let attr = await this.getObjectFromObjectBrowseContainer(objectName);
        let dropArea = await this.editorDropZone;
        await browser.waitUntil(EC.presenceOf(attr));
        await browser.waitUntil(EC.presenceOf(dropArea));
        await this.dragAndDrop({
            fromElem: attr,
            toElem: dropArea,
            toOffset: { x: 0, y: 0 },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async confirmExistingObjDialog() {
        await browser.wait(EC.presenceOf(this.existingObjectDialog), 5000);
        //presenceOf()
    }

   async  attributeTimeFolder() {
        return this.$(`//div[@class='mstrmojo-Editor-content']//div[@class='mstrmojo-VIPanel-contentContainer']//span[text()='Time']`);
    }

    async getAttributeFolder(folderName){
        return this.$(`//div[@class='mstrmojo-Editor-content']//div[@class='mstrmojo-VIPanel-contentContainer']//span[text()=${folderName}]`);
    }

    async getYearAttribute() {
        return this.$(`//div[@id='mstr387']//span[contains(@class,'mstrmojo-TreeNode-text attribute')][contains(text(),'Year')]`);
    }

    async getAttribute(attributeName) {
        //return element(by.xpath(`//div[@id='mstr387']//span[contains(@class,'mstrmojo-TreeNode-text attribute')][contains(text(),${attributeName})]`))
        return this.$(`//div[@id='mstr387']//span[@class='mstrmojo-TreeNode-text attribute'][contains(text(),${attributeName})]`)
    }

    get monthAttribute() {
        return this.$(`//div[@id='mstr387']//span[contains(@class,'mstrmojo-TreeNode-text attribute')][contains(text(),'Month')]`)
    }

    async expandTimeFolder (){
        const elementz = await this.attributeTimeFolder();
        try{
            await browser.waitUntil(EC.presenceOf(elementz));
            browser.pause(5000);
            elementz.click();
            //console.log('element is:', elementz);
        }catch(er){
            console.log('catching error:', er);
        }
        
        console.log('just clicked')
        browser.pause(5000);
        
    }

    
    /*
     * @param {string} objName Object Name
     */ 
    async timeFolderElements () {
        let dayAttr = this.$(`//div[@class='mstrmojo-Editor-content']//div[@class='mstrmojo-VIPanel-contentContainer']//div[@class='mstrmojo-itemwrap']//span[text()='Time']`);
        //return element (by.xpath(`//div[@class='mstrmojo-Editor-content']//div[@class='mstrmojo-VIPanel-contentContainer']//span[text()='Time']`))
        browser.waitUntil(EC.presenceOf(dayAttr));
        console.log('day attribute is:', dayAttr);
        //return dayAttr;

    }

    async addAttributeToDropzone(attrName){
        console.log('at add attribute to dropzone');
        const attr = await this.getAttribute(attrName);
        //await browser.wait(EC.presenceOf(attr));
        //console.log('after checking for presence of attribute: ', basePage);
        //await this.doubleClickOnElement(attr);
        await browser.pause(5000);
        await this.doubleClickOnElement(attr);
        await browser.pause(5000);
    }

    async addYearToDropzone() {
        console.log('at add attribute to dropzone');
        const attr = await this.getYearAttribute();
        //await browser.wait(EC.presenceOf(attr));
        //console.log('after checking for presence of attribute: ', basePage);
        //await this.doubleClickOnElement(attr);
        await browser.pause(5000);
        await this.doubleClickOnElement(attr);
        await browser.pause(5000);
    }

    async dragAndDropObjectAndWait(movingElement,targetElement){
        let dndInnerTime = (.4 * 1000); // Allow DND animation work properly
        await browser.driver.executeScript('mstrmojo.dom.isIE9 = true;');
        try {
            await browser.actions().mouseMove(movingElement).perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseDown().perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseMove({ x: 0, y: 1 }).perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseMove({ x: 1, y: 0 }).perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseMove({ x: 1, y: 0 }).perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseMove(targetElement).perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseUp().perform();
            await browser.pause(dndInnerTime);
            } catch (err) {
                console.log(err.message);
            }
        await browser.driver.executeScript('mstrmojo.dom.isIE9 = false;');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async changeExistingObejctsDropdown(object, option){
        let object1 = await this.getObjectDropDownForExistingObjects(object);
        await this.waitForElementClickable(object1);
        await this.clickOnElement(object1);
        let object2 = await this.getOptionFromPullDownListForExistingObjects(option);
        await this.waitForElementClickable(object2);
        await this.clickOnElement(object2);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async searchForObjectOnExistingObjectsDialog(keywords) {
        await this.sleep(0.3); 
        let el = await this.SearchInputBoxOnAddExistingObjectsDialog; 
        await el.setValue(keywords + '\uE007');
    }

    async moveExistingObjectsEditorScrollBar(direction, pixels) {
        let orientation = direction === "left" || direction === "right" ? "horizontal" : "vertical",
            scrollbar = await this.getVerticleScrollbarOnEditor(orientation),
            numOfPixels = direction === "left" || direction === "top" ? -pixels : pixels;
        await this.dragAndDropByPixel(scrollbar, orientation === "horizontal" ? numOfPixels : 0, orientation === "vertical" ? numOfPixels : 0, true);
    }
    
    async openFilterEditor() {
        await this.clickOnElement(this.addFilterBtn);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async editFilterEditor() {
        await this.clickOnElement(this.editFilterBtn);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async browseMDObject(obj, folder) {
        await this.sleep(1);
        let f = await this.getFolderFromMDBrowser(folder); 
        await browser.waitUntil(EC.visibilityOf(f), 60 * 1000);
        await this.hoverMouseAndClickOnElement(f); 
        await this.sleep(1);
        let el = await this.getObjectFromMDBrowser(obj); 
        await browser.waitUntil(EC.visibilityOf(el), 60 * 1000);
        await this.scrollIntoView(el, {
            block: 'nearest', 
            inline: 'nearest'
        });
        await this.hoverMouseOnElement(el);
        await this.doubleClickOnElement(el); 
    }

    //Parameter actions
    async clickCreateParameterBtn() {
        await this.clickOnElement(this.createParameterBtn);
    }
    
    async selectCreateParameterType(type) {
        await this.clickOnElement(this.getCreateParameterTypeLabel(type));
    }

    async clickClearAllBtn() {
        await this.clickOnElement(this.clearAllBtn);
    }

    async clickButtonInClearAllPopup(buttonName) {
        const el = await this.getOptionsFromClearAllNotification(buttonName);
        await this.clickOnElement(el);
    }

    async selectItemInParameterContextMenu(menuItem, parameterName) {
        const el = await this.getParameterInDropzone(parameterName);
        await this.rightMouseClickOnElement(el);
        const menuItemEl = await this.getContextMenuItem(menuItem);
        await this.clickOnElement(menuItemEl);
    }  

    async isObjectDisplayedinDSContainer(objectName) {
        const el = await this.getObjectFromDatasetContainer(objectName); 
        return await el.isDisplayed();
    }
}
