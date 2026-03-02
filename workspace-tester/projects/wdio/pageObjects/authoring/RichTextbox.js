import BaseContainer from './BaseContainer.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import Common from './Common.js';
import KeyboardSupport from './KeyboardControl.js';
import { Key } from 'webdriverio';

export default class RichTextBox extends BaseContainer {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
        this.keyboardSupport = new KeyboardSupport();
    }

    //To get padding...
    getRichTextContainer(containerName) {
        return this.getContainer(containerName).$('.mstrmojo-DocQuillTextfield'); 
    }

    getRichTextField(containerName) {
        return this.getRichTextContainer(containerName).$('.mstrmojo-DocTextfield-valueNode');
    }

    // Elements are seperated by space or different text formattings
    getElementByText(text){
        return this.getRichTextContainer().$(`.//div[contains(@class, 'mstrmojo-DocTextfield-valueNode')]//p//*[text()='${text}']`);
    }

    // If there are duplicated text content in a rich textbox, return the second element by text
    getElementByText2(text){
        return this.getRichTextContainer().$(`(.//div[contains(@class, 'mstrmojo-DocTextfield-valueNode')]//p//*[text()='${text}'])[2]`);
    }

    getPclassByText(text){
        return this.getRichTextContainer().$(`.//div[contains(@class, 'mstrmojo-DocTextfield-valueNode')]//p//*[contains(text(), '${text}')]/ancestor::p`);
    }

    getRichTextHeader1(containerName) {
        return this.getRichTextContainer(containerName).$$('//h1'); 
    }

    getRichTextHeader1Strong(containerName) {
        return this.getRichTextContainer(containerName).$$('//h1/strong'); 
    }

    getRichTextHeader2(containerName) {
        return this.getRichTextContainer(containerName).$$('//h2'); 
    }

    getRichTextHeader2Strong(containerName) {
        return this.getRichTextContainer(containerName).$$('//h2/strong'); 
    }

    getRichTextHeader3(containerName) {
        return this.getRichTextContainer(containerName).$$('//h3'); 
    }

    getRichTextHeader3Strong(containerName) {
        return this.getRichTextContainer(containerName).$$('//h3/strong'); 
    }

    getRichTextParagraph(containerName) {
        return this.getRichTextContainer(containerName).$('//p'); 
    }

    getRichTextOrderedList(containerName) {
        return this.getRichTextContainer(containerName).$('//ol'); 
    }

    getRichTextBulletedList(containerName) {
        return this.getRichTextContainer(containerName).$('//ul'); 
    }

    // Once apply the line through, there will be a <s></s>
    getLineThroughClass(containerName){
        return this.getRichTextField(containerName).$(`.//s`);
    }

    // Once apply the line through, there will be a <u></u>
    getUnderLineClass(containerName){
        return this.getRichTextField(containerName).$(`.//u`);
    }

    getVerticalScrollbarInRichText(containerName) {
        return this.getRichTextContainer(containerName).$('.mstrmojo-scrollbar.vertical[style]');
    }

    getHorizontalScrollbarInRichText(containerName) {
        return this.getRichTextContainer(containerName).$('.mstrmojo-scrollbar.horizontal[style]'); 
    }

    getSelectedVerticakAlignButton(){
        return this.$(`//span[contains(@class,'ant-radio-button-checked')]/following-sibling::span//div[contains(@class, 'vertical-align')]`); 
    }


    async InputPlainText(inputText,RichTextbox) {
        let txtContainer = await this.getRichTextField(RichTextbox);
        await this.doubleClickOnElement(txtContainer);
        await browser.pause(1000);
        await txtContainer.addValue(inputText);
        await browser.pause(1000);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async DoubleClickRichTextbox(RichTextbox){
        let txtContainer = await this.getRichTextField(RichTextbox);
        //await browser.waitUntil(EC.presenceOf(txtContainer));
        await this.doubleClickOnElement(txtContainer);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async pressArrowKeyToMoveCursor(key, times) {
        let arrowKey = this.keyboardSupport.getKey(key);
        for (var i = 0; i < times; i++) {
            await browser.keys([arrowKey]);
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async pressShiftAndArrowKeyToHighlightText(key, times) {
        let arrowKey = this.keyboardSupport.getKey(key);
        for (var i = 0; i < times; i++) {
            await browser.keys(['Shift', arrowKey]); 
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async pressCtrlAndCtoCopyText() {
        await browser.keys([Key.Ctrl, 'c'])
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async pressCtrlAndVtoPasteText() {
        await browser.keys([Key.Ctrl, 'v'])
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async verifyVeriticalAlignment(expectedType) {
        let el = await this.getRichTextField()
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