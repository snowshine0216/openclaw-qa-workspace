import BasePage from '../base/BasePage.js';
import BaseFormatPanelReact from './BaseFormatPanelReact.js';
import BaseFormatPanel from './BaseFormatPanel.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';

/**
 * Page representing the actions moving and resizing unit containers in Open Canvas by using the Format Panel
 * @extends BasePage
 * @author Mohaimin Al Aoun <malaoun@microstrategy.com>
 */

export default class FreeformPositionAndSize extends BasePage {
    constructor() {
        super();

        this.baseFormatPanelReact = new BaseFormatPanelReact();
        this.bseFormatPanel = new BaseFormatPanel();
        this.loadingDialog = new LoadingDialog();
    }

    get PositionAndSizeSection(){
        return this.baseFormatPanelReact.FormatPanelContent.$(`.position-and-size-layout`)
    }

    get SelectedInput(){
        return this.PositionAndSizeSection.$('.ant-input-number-focused input'); 
    }

    getXPositionInput() {
        return this.PositionAndSizeSection.$$('.ant-input-number-input-wrap input')[0]; 
    }
    getYPositionInput() {
        return this.PositionAndSizeSection.$$('.ant-input-number-input-wrap input')[1]; 
    }
    getWidthInput() {
        return this.PositionAndSizeSection.$$('.mstr-editor-vertical-layout')[1].$$('input')[0]; 
    }
    getHeightInput() {
        return this.PositionAndSizeSection.$$('.mstr-editor-vertical-layout')[1].$$('input')[1];
    }

    getXText(){
        return this.PositionAndSizeSection.$(`.//span[@class= 'ant-typography' and text()='X']`);
    }

   
    async ClickOnXPositionInput() {
        let btn = await this.getXPositionInput();
        await this.clickOnElement(btn);
    }

    async TypePositionInFormatPanel(number) {
        // let keyboardInput = browser.actions().sendKeys(number);
        // await keyboardInput.perform();
        // await browser.actions().sendKeys(protractor.Key.ENTER).perform();
        let el = await this.SelectedInput; 
        await this.clearTextByBackSpace(el, 4); 
        await browser.keys([number]) 
        await this.enter();
    }

    async ClickOnYPositionInput() {
        let btn = await this.getYPositionInput();
        await this.clickOnElement(btn);
    }

    async ClickOnWidthInputBoxInFormatPanel() {
        let btn = await this.getWidthInput();
        await this.clickOnElement(btn);
    }

    async ClickOnHeightInputBoxInFormatPanel() {
        let btn = await this.getHeightInput();
        await this.clickOnElement(btn);
    }

    async ReplaceWidthInputBoxInReactPanel(Width) {
        let el = await this.getWidthInput();
        await this.clear({elem: el});
        await el.setValue(Width + '\n');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async ReplaceHeightInputBoxInReactPanel(height) {
        let el = await this.getHeightInput();
        await this.clear({elem: el});
        await el.setValue(height + '\n');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async ReplaceXInputBoxInReactPanel(x) {
        let el = await this.getXPositionInput();
        await this.clear({elem: el});
        await el.setValue(x + '\n');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async ReplaceYInputBoxInReactPanel(y) {
        let el = await this.getYPositionInput();
        await this.clear({elem: el});
        await el.setValue(y + '\n');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async verifyHeightAndWidth() {
        let result = []; 
        let elW = await this.getWidthInput(); 
        let value = await this.getBrowserData('return arguments[0].value', elW);
        result.push(parseFloat(value)); 
        let elH = await this.getHeightInput(); 
        value = await this.getBrowserData('return arguments[0].value', elH);
        result.push(parseFloat(value));
        return result; 
    }

    async verifyXAndY() {
        let result = []; 
        let elX = await this.getXPositionInput(); 
        let value = await this.getBrowserData('return arguments[0].value', elX);
        result.push(parseFloat(value)); 
        let elY = await this.getYPositionInput(); 
        value = await this.getBrowserData('return arguments[0].value', elY);
        result.push(parseFloat(value));   
        return result; 
    }

}