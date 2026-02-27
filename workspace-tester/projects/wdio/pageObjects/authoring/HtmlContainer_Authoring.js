import BaseContainer from './BaseContainer.js';
import BaseFormatPanelReact from './BaseFormatPanelReact.js';
import BaseFormatPanel from './BaseFormatPanel.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';

/**
 * Page representing the HTML Container
 * @extends BaseContainer
 */

export default class HtmlContainer_Authoring extends BaseContainer {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.baseFormatPanelReact = new BaseFormatPanelReact();
        this.baseFormatPanel= new BaseFormatPanel();
    }

    // Box inside Elements
    get htmlBoxPath() { 
        return this.getContainerPath(); 
    }

    get htmlBox() {
        return this.$(this.htmlBoxPath);
    }

    get boxOkButton() {
        return this.$(this.htmlBoxPath + `//div[contains(@class,'mstrmojo-Button mstrmojo-WebButton')]`);
    }

    get IFrameButton() {
        return this.$(this.htmlBoxPath + `//div[contains(@class, 'mstrmojo-ListBase htmlTypeBtn')]//div[@idx='0']`);
    }

    get HtmlTextButton() {
        return this.$(this.htmlBoxPath + `//div[contains(@class, 'mstrmojo-ListBase htmlTypeBtn')]//div[@idx='1']`);
    }

    get textInputArea() {
        return this.$(this.htmlBoxPath + `//textarea[contains(@class, 'mstrmojo-TextArea htmlText')]`);
    }

    // get the parsed value 
    getHtmlTextValue(containerName){
        return this.getContainer(containerName).$(`.//div[contains(@class, 'mstrmojo-DocTextfield-valueNode')]/*`); 
    }

    // Format Panel Elements
    get formatPanelIFrameButton() {
        return this.baseFormatPanelReact.FormatPanelContent.$('#radio-option-0'); 
    }

    get formatPanelHtmlTextButton() {
        return this.baseFormatPanelReact.FormatPanelContent.$('#radio-option-1'); 
    }

    get formatPanelTextInputArea() {
        return this.baseFormatPanelReact.FormatPanelContent.$('textarea'); 
    }

    get formatPanelTextInputAreaClass() {
        return this.baseFormatPanelReact.FormatPanelContent.$(`//textarea/../..`);
    }

    get formatPanelOkButton() {
        return this.baseFormatPanelReact.FormatPanelContent.$('button'); 
    }

    get htmlContainerOKButton() {
        return this.$(`//div[@aria-label='HTML container:']//following-sibling::div[@aria-label='OK']`);
    }

    // Server setting to disbale HTML container, shoud display only warning message
    getHTMLwarningText(containerName) {
        return this.$(this.getContainerPath(containerName) + `//div[contains(@class, 'warning-text')]`); 
    }

    getHTMLwarningIcon(containerName) {
        return this.$(this.getContainerPath(containerName) + `//div[contains(@class, 'warning-text')]//div[contains(@class, 'warning-icon')]`); 
    }

    // Operation Function
    async clickHtmlContainerOkButton() {
        let button = await this.boxOkButton;
        await button.waitForClickable({ timeout: 5000 });
        await this.click( {elem: button});
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async clickFormatPanelOkButton() {
        let el = await this.formatPanelOkButton;
        await el.waitForClickable(); 
        await this.click( {elem: el} );
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async switchToIFrameByEdit(inputText) {
        await this.editTextArea();
        let el = await this.IFrameButton;
        await el.waitForClickable();
        await this.clickOnElement(el);
        let inputArea = await this.textInputArea;
        if (inputText) {
            await this.click( {elem: inputArea} );
            await this.clear( {elem: inputArea} );
            await inputArea.setValue(inputText);
            await this.clickHtmlContainerOkButton();
        }
    }

    async switchToIFrameByFormatPanel(inputText) {
        await this.showFormatPanel();
        let el = this.formatPanelIFrameButton;
        await el.waitForClickable(); 
        await this.clickOnElement(el);
        let inputArea = await this.formatPanelTextInputArea;
        if (inputText) {
            await this.click( {elem: inputArea} );
            await this.clear(inputArea);
            await inputArea.setValue(inputText);
            await this.clickFormatPanelOkButton();
        }
    }

    async switchToHtmlTextByEdit(inputText) {
        await this.editTextArea(); 
        await this.switchToHtmlTextAndInput(inputText); 
    }

    async switchToHtmlTextAndInput(inputText){
        let el = await this.textInputArea; 
        await el.waitForDisplayed();
        let bn = await this.HtmlTextButton; 
        await bn.waitForClickable();
        await this.clickOnElement(bn);
        if (inputText) {
            await this.click( {elem: el} );
            await this.clear( {elem: el} );
            await el.setValue(inputText);
            await this.clickHtmlContainerOkButton();
        }
    }

    async switchToHtmlTextByFormatPanel(inputText) {
        await this.showFormatPanel();
        let el = await this.formatPanelHtmlTextButton;
        await el.waitForClickable();
        await this.clickOnElement(el);
        let inputArea = await this.formatPanelTextInputArea;
        if (inputText) {
            await this.click( {elem: inputArea} );
            await this.clear( {elem: inputArea} );
            await inputArea.setValue(inputText);
            await this.clickFormatPanelOkButton();
        }
    }

}