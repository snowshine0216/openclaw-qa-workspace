import BaseContainer from './BaseContainer.js';
import BaseFormatPanelReact from './BaseFormatPanelReact.js';
import BaseFormatPanel from './BaseFormatPanel.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';

/** 
 * Page represing the Image Container.
 * @extends BasePage
 */

const WAIT_TYPE = {
    None: 0,
    LoadingDialog: 1,
    NewPage: 2
};

export default class ImageContainer_Authoring extends BaseContainer {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.baseFormatPanelReact = new BaseFormatPanelReact();
        this.baseFormatPanel= new BaseFormatPanel();
    }
    
    // ELEMENT LOCATORS

    /** Returns the Image Container Visualization titled visualizationName
     * @param {string} visualizationName the title of the visualization
     * @returns {Promise<ElementFinder>} Image Container Element
     */
    getImageContainer(visualizationName){
        return this.getContainer(visualizationName);
    }

    getImageContainerWithURL(visualizationName, url){
        return this.getImageContainer(visualizationName).$(`/descendant::img[@src='${url}']`);
    }

    getImageContainerURL(visualizationName){
        return this.$(`//div[@class='mstrmojo-VIDocLayout']//div[contains(@class, 'mstrmojo-VITitleBar') and .//div[text()='${visualizationName}']]//..//../descendant::img`);
    }
    
    /** Returns the ImageBoxOverlay inside Image Container
     * @returns {Promise<ElementFinder>} Image Container Element
     */
    getImageBoxOverlay(visualizationName) {
        return this.getImageContainer(visualizationName).$(`./descendant::div[contains(@class,'mstrmojo-ImageBoxOverlay') or (contains(@class, 'mstrmojo-DocImage') and contains(@style, 'display: block;'))]`);
    }

    getImageContainerTextbox(visualizationName) {
       return this.getImageContainer(visualizationName).$(`.//input[contains(@class, 'mstrmojo-TextBox')]`);
    }

    getImageContainerOkButton(visualizationName) {
        return this.getImageBoxOverlay(visualizationName).$(`.//div[contains(@class, 'okBtn')]/div`);
    }

    getImageContainerBrowseButton(visualizationName) {
            return this.getImageBoxOverlay(visualizationName).$(`.//div[contains(@class, 'okBtn')]/div`);
    }

    get ImageInputInFormat(){
        return this.baseFormatPanelReact.FormatPanelContent.$('.mstr-input-container input'); 
    }

    get ImageBrowseBtnInFormat(){
        return this.baseFormatPanelReact.FormatPanelContent.$('.mstr-editor-file-upload'); 
    }

    get ImageOKBtnInFormat(){
        return this.baseFormatPanelReact.FormatPanelContent.$$('.mstr-editor-button')[1]; 
    }

    get XInputInFormat(){
        return this.baseFormatPanelReact.FormatPanelContent.$$('.ant-input-number-input-wrap input')[0]; 
    }

    get YInputInFormat(){
        return this.baseFormatPanelReact.FormatPanelContent.$$('.ant-input-number-input-wrap input')[1]; 
    }

    get RestoreSizeInFormat(){
        return this.baseFormatPanelReact.FormatPanelContent.$('.revert-to-default'); 
    }

    getFedRampImageContainerOkButton(visualizationName) {
            return this.getImageBoxOverlay(visualizationName).$(`.//div[contains(@class, 'btn')]/div`);
    }

    getImageSrc(visualizationName) {
        return this.getImageContainer(visualizationName).$(`.//div[contains(@class, 'img-cntr')]//div`);
     }

    //ACTIONS
    
    /** Changes URL of Image Container
     * @param {string}  visualizationName the title of the visualization you want to change shape
     * @param {string} url 
    */
    async editURL(visualizationName, url){
        let inputEl = await this.getImageContainerTextbox(visualizationName); 
        //delete previous url and enter new url
        await this.clear({ elem: inputEl });
        await this.sleep(1000);
        await inputEl.setValue(url);

        let okButton = await this.getImageContainerOkButton(visualizationName); 
        await this.clickOnElement(okButton);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

     /** Changes URL of Image Container on FedRamp env
     * @param {string}  visualizationName the title of the visualization you want to change shape
     * @param {string} url 
    */
    async editURLonFedRamp(visualizationName, url){
        let inputEl = await this.getImageContainerTextbox(visualizationName); 
        await browser.waitUntil(EC.visibilityOf(inputEl));
        //delete previous url and enter new url
        await inputEl.setValue('');
        await inputEl.setValue(url);

        let okButton = await this.getFedRampImageContainerOkButton(visualizationName); 
        await this.clickOnElement(okButton);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Edit the x and y value for size option in format panel
     * @param {string} x: fixed width value
     * @param {string} y: fixed height value
    */
    async setXAndY(x, y){
        await this.sleep(1)
        let xInputEl = await this.XInputInFormat; 
        await this.baseFormatPanel.clearAndSetValue(xInputEl,x);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.sleep(1)
        let yInputEl = await this.YInputInFormat; 
        await this.baseFormatPanel.clearAndSetValue(yInputEl,y);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** turn on retore the original size in format panel
     * @param {string} visualizationName the title of the visualization you want to change the size option for
    */
    async restoreToOriginalSizeByFormatPanel() {
        let el = await this.RestoreSizeInFormat; 
        await this.click( {elem: el} );
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // Single clicks on the Image container. If a link is present, one of two things will happen:
    // In presentation mode, the link will be opened
    // In editor mode, a popup will appear with an option to "Go To *Link*"
    async singleClickOnImageContainer(waitType, visualizationName) {
        this.clickOnElement(this.getImageBoxOverlay(visualizationName));
        if (waitType == WAIT_TYPE.loadingDialog) {
            await loadingDialog.waitLoadingDataPopUpIsNotDisplayed(5);
        } else if (waitType === WAIT_TYPE.NewPage) {
            await browser.pause(1000);
        }
    }

    async setImageContainersPicture(imageUrl, visualizationName) {
        let imageContTextbox = await this.getImageContainerTextbox(visualizationName);
        await this.doubleClickOnElement(imageContTextbox);
        await imageContTextbox.setValue('');
        await imageContTextbox.setValue(imageUrl);
        let btn = await this.getImageContainerOkButton(visualizationName);
        await this.clickOnElement(btn);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
 

    //Upload image from local folder
    async addImageFromDisk(visualizationName, filename) {
        let imageInput = await this.$(`//div[@class='mstrmojo-VIDocLayout']//div[contains(@class, 'mstrmojo-VITitleBar') and .//div[text()='${visualizationName}']]/../..//input[@class='mstrmojo-imageBoxOverlayEmbeded-file' and @type='file']`);
        await browser.waitUntil(EC.visibilityOf(imageInput));
        await imageInput.addValue(filename);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }


    async editURLFromFormat(url){
        let el = await this.ImageInputInFormat; 
        await this.clear(el)
        await el.addValue(url)
        await browser.keys(Key.Enter);
        let okButton = await this.ImageOKBtnInFormat; 
        await this.clickOnElement(okButton);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed(60);
    }

    async clickOnImageSrc(visualizationName) {
        let el = await this.getImageSrc(visualizationName);
        await this.clickOnElement(el);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    
    }
    
}