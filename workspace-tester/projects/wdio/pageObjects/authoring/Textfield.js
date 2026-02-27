import { Key } from 'webdriverio';

import BaseContainer from './BaseContainer.js';
import LoadingDialog, { loadingDialog } from '../dossierEditor/components/LoadingDialog.js';
import DatasetsPanel from './DatasetPanel.js';
import VisualizationPanelForGrid from './VizPanelForGrid.js';
import BaseFormatPanel from './BaseFormatPanel.js';


/**
 * Page representing the Texbox
 * @extends BasePage
 */

const WAIT_TYPE = {
    None: 0,
    LoadingDialog: 1,
    NewPage: 2
};

export default class Textfield extends BaseContainer {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.datasetsPanel = new DatasetsPanel();
        this.visualizationForGrid = new VisualizationPanelForGrid();
        this.baseFormatPanel = new BaseFormatPanel();
    }

    getTextContainer(containerName) {
        return this.getContainer(containerName).$(`.//div[contains(@class,'vi-doc-tf-value-text hasEditableText')]`);
    }

    getVerticalScrollbarInTextContainer(containerName) {
        return this.getContainer(containerName).$('.mstrmojo-scrollbar.vertical[style]');
        // return this.getContainer(containerName).element(by.xpath(`.//div[@class = 'mstrmojo-scrollbar vertical' and contains(@style, 'height')]`)); 
    }

    getHorizontalScrollbarInTextContainer(containerName) {
        return this.getContainer(containerName).$('.mstrmojo-scrollbar.horizontal[style]'); 
    }

    // To get the css value
    getTextContainerParent(containerName) {
        return this.getTextContainer(containerName).$(`./..`);
    }

    getTextContainerInitLabel(containerName){
        return this.getContainer(containerName).$(`.//div[contains(@class,'mstrmojo-Label init-label') and text()='Type directly or drag objects here.']`);
    }

    getFontStyleButtonFromFormatPanel(type) {
        return this.$(`//div[@class='mstr-editor-multiselect']//div[@aria-label='${type}']`);
    }

    getFontSizeIncreaseBtn() {
        return this.$(`//div[@class='ant-input-number-handler-wrap']//span[contains(@aria-label, 'Increase')]`);
    }

    getFontSizeDecreaseBtn() {
        return this.$(`//div[@class='ant-input-number-handler-wrap']//span[contains(@aria-label, 'Decrease')]`);
    }

    getFontSizeBox(){
        return this.$(`//div[@class='ant-input-number-input-wrap']//input`); 
    }

    getFontSizeBoxDisabled(){
        return this.$(`//div[@class='ant-input-number-input-wrap']//input[@disabled]`); 
    }

    getFontSizeFromReactPanel(size) {
        return this.$(`//div[@class='ant-input-number-input-wrap']//input[contains(@aria-valuenow,'${size}')]`);
    }

    getFontColorPickerDropDown() {
        return this.$(`//div[@class='mstr-color-picker-dropdown']//div[@class='color-picker-arrow-button']`);
    }

    getSelectedPaddingButton(){
        return this.$(`//span[contains(@class,'ant-radio-button-checked')]/following-sibling::span//div[contains(@class, 'padding')]`); 
    }

    getAlignOrPaddingButton(option){
        return this.$(`//div[contains(@class,'ant-radio-group-outline')]//div[contains(@class,'${option}')]`);
    }

    // e.g. get current selection for Direction and Overflow
    getCurrentDropdownSelectionByTitle(title){
        return this.$(`(//span[contains(text(), '${title}')]//ancestor::ul[@class='horizontal-list']//li)[2]//span[contains(@class,'mstr-editor-select')]/following-sibling::span`);
    }

    getButtonFromToolbar(buttonName) {
        return this.$(`.mstrmojo-RootView-toolbar .item${buttonName}`); 
    }

    async InputSimpleText(text,textContainer) {
        let txtContainer = await this.getTextContainer(textContainer);
        await this.clickOnElementByInjectingScript(txtContainer);
        await txtContainer.addValue(text);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async insertTextField(buttonName) {
        let el = await this.getButtonFromToolbar(buttonName);
        await this.click({ elem: el });
    }


    async addDatasetObjectByDragAndDrop(objectTypeName, objectName, datasetName,containerName){
        let textbox = await this.getContainer(containerName);
        //await browser.waitUntil(EC.visibilityOf(textbox));
        let datasetObject = await this.datasetsPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        //await browser.waitUntil(EC.visibilityOf(datasetObject));
        await this.dragAndDropForAuthoringWithOffset({ fromElem: datasetObject, toElem: textbox }); 
        //await this.dragAndDropObject(datasetObject, textbox); 

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async replaceTextboxText(textboxText) {
        let textContainer = await this.getTextContainer();
        await this.doubleClickOnElement(textContainer);
        await browser.keys([Key.Backspace]);
        await textContainer.addValue(textboxText);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async pasteTextboxText(containerTitle) {
        const textContainer = await this.getTextContainer(containerTitle);
        await this.doubleClickOnElement(textContainer);
        await this.replaceTextByPastingOnElement(textContainer);
        await textContainer.click();
       // await browser.keys(Key.ArrowDown);
       // await browser.keys(Key.Enter);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // // Single clicks on the Text container. If a link is present, one of two things will happen:
    // // In presentation mode, the link will be opened
    // // In editor mode, a popup will appear with an option to "Go To *Link*"
    // async singleClickOnTextContainer(waitType) {
    //     await this.clickOnElement(this.getTextContainer());
    //     if (waitType === WAIT_TYPE.loadingDialog) {
    //         await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    //     } else if (waitType === WAIT_TYPE.NewPage) {
    //         await browser.pause(2000);
    //     }
    // }

    // Single clicks on the Text container. If a link is present, one of two things will happen:
    // In presentation mode, the link will be opened
    // In editor mode, a popup will appear with an option to "Go To *Link*"
    async singleClickOnTextContainer(waitType, containerName) {
        await this.clickOnElement(this.getTextContainer(containerName));
        if (waitType === WAIT_TYPE.loadingDialog) {
            await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        } else if (waitType === WAIT_TYPE.NewPage) {
            await browser.pause(2000);
        }
    }

    async ClickOnFontStyleButtonInPanel(type) {
        let formatBtn = await this.getFontStyleButtonFromFormatPanel(type);
        await this.clickOnElement(formatBtn);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed(240);
    }

    async ClickFontSizeIncreaseBtnForTimes(times) {
        let increaseBtn = await this.getFontSizeIncreaseBtn();
        for (var i = 0; i < times; i++) {
            await this.clickOnElement(increaseBtn);
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(240);
    }

    async ClickFontSizeDecreaseBtnForTimes(times) {
        let decreaseBtn = this.getFontSizeDecreaseBtn();
        for (var i = 0; i < times; i++) {
            await this.clickOnElement(decreaseBtn);
        }
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async replaceFontSizeText(fontSize) {
        let fontSizeInput = await this.getFontSizeBox();
        await this.baseFormatPanel.clearAndSetValue(fontSizeInput, fontSize)
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async ClickOnFontColorDropdown() {
        let dropDown = await this.getFontColorPickerDropDown();
        await this.clickOnElement(dropDown);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async ClickOnAlignOrPaddingButton(option) {
        let Btn = this.getAlignOrPaddingButton(option);
        await this.clickOnElement(Btn);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    
    async changeNumberFormat(type) {
        await this.openContextMenu();
        await this.selectContextMenuOption("Number Format"); 
        await this.visualizationForGrid.selectNumberFormatFromDropdown(type); 
        await this.visualizationForGrid.clickContextMenuButton("OK"); 
    }

    async verifyTextBoxVeriticalAlignment(expectedType) {
            let el = await this.getTextContainer();
            await browser.waitUntil(EC.presenceOf(el));
            let css = await el.getCSSProperty('justify-content')
            switch(expectedType){
                case "top":
                    expect(await css.value.toString()).to.equal('normal');
                    break;
                case "middle":
                    expect(await css.value.toString()).to.equal('center');
                    break;
                case "bottom":
                    expect(await css.value.toString()).to.equal('flex-end');
                    break;
            }
    }

}