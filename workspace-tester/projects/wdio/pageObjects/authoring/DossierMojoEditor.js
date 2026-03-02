import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import path from 'path';
import {
    scrollIntoView,
    scrollElement,
    scrollHorizontally,
    scrollElementToBottom,
    scrollElementToMiddle,
    scrollElementToNextSlice,
    scrollHorizontallyToNextSlice,
} from '../../utils/scroll.js';

/**
 * Created this mojoEditor page to consolidate the common actions on popup editors
 * like the alert window when convert to auto/freeform layout, the pdf export editor,
 * derived attribute editor, derived metric editor, etc...
 * @extends BasePage
 * @author Fang Suo <fsuo@microstrategy.com>
 */

export default class DossierMojoEditor extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
    }

    // Change compound grid to other viz, Apply Theme,TXN
    getAlertEditorWithTitle(title) {
        return this.$(
            `//div[contains(@class,'mstrmojo-alert') and contains(@style, 'display: block')]//div[contains(@class,'mstrmojo-Editor-title') and text()='${title.replace(
                / /g,
                '\u00a0'
            )}']`
        );
    }

    getAlertEditorWithTitle3(title) {
        return this.$(
            `//div[contains(@class,'mstrmojo-alert')]//div[contains(@class,'mstrmojo-Editor-title') and text()='${title.replace(
                / /g,
                '\u00a0'
            )}']`
        );
    }

    // Copy/move container
    getAlertWarningEditorWithTitle(title) {
        return this.$(
            `//div[contains(@class,'mstrmojo-warning  mstrmojo-alert')]//div[contains(@class,'mstrmojo-Editor-title') and text()='${title.replace(
                / /g,
                '\u00a0'
            )}']`
        );
    }

    getLabelOnAlertEdtior(label) {
        return this.$(
            `//div[contains(@class,'mstrmojo-alert') and contains(@style, 'display: block')]//div[contains(@class,'mstrmojo-Label')]//*[contains(text(),'${label}')]`
        );
    }

    getAddtoPageLabelOnAlertEditor(label) {
        return this.$(
            `//div[contains(@class,'mstrmojo-alert')]//div[contains(@class,'mstrmojo-Label') and contains(text(),"${label}")]`
        );
    }

    getMojoEditorWithTitle(title) {
        if (title.startsWith('Share: ') || title.startsWith('Refresh ')) {
            let num = title.indexOf(' ');
            // Do not replace the first space for Share dossier/Refresh dataset dialog
            title = title.substring(0, num + 1) + title.substring(num + 1).replace(/ /g, '\u00a0');
        } else {
            title = title.replace(/ /g, '\u00a0');
        }
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor ') and not(contains(@style,'display: none')) and .//div[contains(@class,'mstrmojo-Editor-title') and text()='${title}']]`
        );
    }

    getMojoEdtiorText(txt) {
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor ') and not(contains(@style,'display: none'))]//div[contains(@class,'mstrmojo-error-content')]//*[text() = '${txt}']`
        );
    }

    /**
     * Get Mojo error popup content node
     */
    getMojoEdtiorErrorContent() {
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor ') and not(contains(@style,'display: none'))]//div[contains(@class,'mstrmojo-error-content')]`
        );
    }

    getBtnOnEditor(btnTxt) {
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor ') and not(contains(@style,'display: none'))]//div[contains(@class,'mstrmojo-Button-text') and text()="${btnTxt}"]`
        );
    }

    get CloseButton() {
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor ') and not(contains(@style,'display: none'))]//div[contains(@class,'mstrmojo-Editor-close')]`
        );
    }

    get ShowDetails() {
        return this.$('.mstrmojo-Editor .toggle-details-link');
    }

    getBtnOnAlert(btnTxt) {
        return this.$(
            `//div[contains(@class,'mstrmojo-alert') and not(contains(@style,'display: none'))]//div[contains(@class,'mstrmojo-Button-text') and text()="${btnTxt}"]`
        );
    }

    getHotBtnOnEditor() {
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor ') and not(contains(@style,'display: none'))]//div[contains(@class,'mstrmojo-WebButton hot')]`
        );
    }

    getSearchBoxOnEditor() {
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor') and contains(@style,'display: block')]//input[contains(@class,'mstrmojo-SearchBox-input')]`
        );
    }

    getSearchBoxClearOnEditor() {
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor') and contains(@style,'display: block')]//div[contains(@class,'mstrmojo-SearchBox-search clear')]`
        );
    }

    getObjectFromSearchResult(objectName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor') and contains(@style,'display: block')]//div[@class='mstrmojo-OBListItemText' and text()='${objectName}']`
        );
    }

    getFolderDropdownOnEditor() {
        return this.$$(
            '.mstrmojo-Editor[style*="display: block"] .mstrmojo-ObjectBrowser .mstrmojo-DropDownButton-iconNode'
        )[0];
    }

    getFolderFromDropdownOnEditor(folderName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-Editor') and contains(@style,'display: block')]//div[contains(@class,'mstrmojo-ObjectBrowser')]//div[contains(@class,'mstrmojo-Popup-content')]//span[contains(@class,'mstrmojo-TreeNode-text') and text()='${folderName.replace(
                / /g,
                '\u00a0'
            )}']`
        );
    }

    get ActiveEditor() {
        return this.$(`.mstrmojo-Editor[style*='display: block']`);
    }

    getCheckboxWithTitle(title) {
        return this.ActiveEditor.$(
            `.//div[@class = 'mstrmojo-Label' and text() ='${title}']/ancestor::tr//div[contains(@class,'mstrmojo-ui-Checkbox')]`
        );
    }

    getCheckboxWithLabel(label) {
        return this.ActiveEditor.$(
            `.//div[contains(@class, 'mstrmojo-Label') and contains(text(),'${label}')]/ancestor::tr//div[contains(@class,'mstrmojo-ui-Checkbox')]`
        );
    }

    // The following 4 xpath is used to find the checkbox in Export to PDF dialog
    getCheckBoxLabelForExport(label) {
        let labelName = label.replace(/ /g, '\u00a0');
        return this.ActiveEditor.$(`.//div[contains(@class, 'mstrmojo-Box content')]//label[text()='${labelName}']`);
    }

    getCheckBoxForExport(label) {
        let labelName = label.replace(/ /g, '\u00a0');
        return this.ActiveEditor.$(
            `.//div[contains(@class, 'mstrmojo-Box content')]//label[text()='${labelName}']/preceding-sibling::input[@type='checkbox']`
        );
    }

    getPDFeditorPortrait() {
        return this.ActiveEditor.$(
            `.//div[contains(@class, 'mstrmojo-Box content')]//div[contains(@class, 'portrait')]`
        );
    }

    getPDFeditorLandscape() {
        return this.ActiveEditor.$(
            `.//div[contains(@class, 'mstrmojo-Box content')]//div[contains(@class, 'landscape')]`
        );
    }

    getInputWithTitle(title) {
        return this.ActiveEditor.$(`.//div[@class = 'mstrmojo-Label' and text() ='${title}']/ancestor::tr//input`);
    }

    getDropdownWithTitle(title) {
        return this.ActiveEditor.$(
            `.//div[@class = 'mstrmojo-Label' and text() ='${title}']/ancestor::tr//div[@class='mstrmojo-ui-Pulldown-text ']`
        );
    }

    getPulldownListWithTitle(title) {
        return this.ActiveEditor.$(
            `.//div[@class = 'mstrmojo-Label' and text() ='${title}']/ancestor::tr//div[contains(@class, 'mstrmojo-popupList')]`
        );
    }

    getPulldownOptionWithTitle(title, option) {
        return this.ActiveEditor.$(
            `.//div[@class = 'mstrmojo-Label' and text() ='${title}']/ancestor::tr//div[contains(@class, 'item') and text()='${option}']`
        );
    }

    // The following 3 xpath is used to find the dropdown in Export to PDF dialog
    getDropdownForExport(title) {
        return this.ActiveEditor.$(
            `.//div[contains(@class, 'mstrmojo-Label') and text() ='${title}']/..//div[@class='mstrmojo-ui-Pulldown-text ']`
        );
    }

    getPulldownListForExport(title) {
        return this.ActiveEditor.$(
            `.//div[contains(@class, 'mstrmojo-Label') and text() ='${title}']/..//div[contains(@class, 'mstrmojo-popupList')]`
        );
    }

    getPulldownOptionForExport(title, option) {
        return this.ActiveEditor.$(
            `.//div[contains(@class, 'mstrmojo-Label') and text() ='${title}']/..//div[contains(@class, 'item') and text()='${option}']`
        );
    }

    getRadioButton(label) {
        return this.ActiveEditor.$(`.//div[contains(@class, 'item') and contains(@aria-label, '${label}')]`);
    }

    //get pop up error window
    get ErrorPopUp() {
        return this.$(`//div[@class = 'mstrmojo-Editor  mstrmojo-alert modal']`);
    }

    getErrorPopUpText(txt) {
        return this.ErrorPopUp.$(
            `.//div[contains(@class,'alert-content')]//div[@class='mstrmojo-Label' and contains(text(), '${txt}')]`
        );
    }

    getErrorButton(btnTxt) {
        return this.ErrorPopUp.$(`.//div[contains(@class,'mstrmojo-Button-text') and text()='${btnTxt}']`);
    }

    //<------------------Ai related feature (custom instructions)------------------------>
    getCustomInstructionsTextArea(id) {
        return this.ActiveEditor.$(
            `.//div[contains(@class, 'mstrmojo-ui-TextAreaCharacterCount') and contains(@id, '${id}')]//textarea`
        );
    }

    //<------------------Ai related feature (knowledge assets)------------------------>
    getLeftTab(tabName) {
        return this.ActiveEditor.$(
            `.//div[contains(@class, 'mstrmojo-DocProps-Editor-Tabs')]//div[contains(@class, 'item') and text()='${tabName}']`
        );
    }

    getCurrentTabEditor(tabName) {
        return this.ActiveEditor.$(
            `.//div[contains(@class, 'mstrmojo-Box')]//div[contains(@class, '${tabName}') and contains(@style, 'display: block')]`
        );
    }

    get knowledgeAssetContainer() {
        return this.ActiveEditor.$(`.//div[@class='mstr-ai-chatbot-knowledge-container']`);
    }

    getknowledgeAssetDescription(msg) {
        return this.knowledgeAssetContainer.$(`.//div[contains(@class,'description') and text()='${msg}']`);
    }

    get knowledgeAssetUploadFileIcon() {
        return this.knowledgeAssetContainer.$(
            `.//div[contains(@class,'FileUploader-icon')]//span[contains(@class,'FileUploader-large-excel')]`
        );
    }

    get knowledgeAssetUploadFileInput() {
        return this.knowledgeAssetContainer.$(`.//div[contains(@class,'FileUploader')]//input`);
    }

    get knowledgeAssetBrowseFileBtn() {
        return this.knowledgeAssetContainer.$(
            `.//div[contains(@class,'FileUploader-details')]//button[text()='Browse files']`
        );
    }

    getknowledgeAssetUploadFile(filename) {
        return this.knowledgeAssetContainer.$(
            `.//div[contains(@class,'OverflowText-container')]//span[text()='${filename}']`
        );
    }

    get knowledgeAssetDeleteFileIcon() {
        return this.knowledgeAssetContainer.$(
            `.//div[contains(@class,'delete')]//span[contains(@class, 'container-delete-icon')]`
        );
    }

    get knowledgeAssetDeleteConfirmYesBtn() {
        return this.knowledgeAssetContainer.$(
            `.//div[contains(@class,'delete')]//div[contains(@class, 'ConfirmationDialog-button')]//span[text()='Yes']/..`
        );
    }

    getknowledgeAssetProgressBar(label) {
        return this.knowledgeAssetContainer.$(
            `.//div[contains(@class,'container-summary')]//div[contains(@class,  'progress-container')]//div[@class='progress-text' and text()='${label}']`
        );
    }

    getknowledgeAssetUploadSummary(txt) {
        return this.knowledgeAssetContainer.$(
            `.//div[contains(@class,'container-summary')]//div[contains(@class,'item') and text()='${txt}']`
        );
    }

    getknowledgeAssetUploadError(errorMsg) {
        return this.knowledgeAssetContainer.$(
            `.//div[contains(@class,'container-summary')]//div[contains(@class,'item')]//span[contains(@class,'error-text') and text()='${errorMsg}']`
        );
    }

    // click on buttons
    async clickBtnOnMojoEditor(btnTxt) {
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        const el = btnTxt ? await this.getBtnOnEditor(btnTxt) : await this.getHotBtnOnEditor();
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async closeEditor() {
        let el = this.CloseButton;
        await this.click({ elem: el });
    }

    // click on 'Show Details"
    async clickShowDetails() {
        let el = this.ShowDetails;
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
    }

    async clickHtBtnOnAlert(btnTxt) {
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(60);
        let el = this.getBtnOnAlert(btnTxt);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        if (this.isWeb()) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(60);
        }
    }

    // change folder path
    // Applicable to File >> Open..., File >> Import Dossier
    async changeFolderPath(folderName) {
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(60);
        let el = await this.getFolderDropdownOnEditor();
        await this.waitForElementVisible(el);
        let currentFolder = await el.getText();
        if (currentFolder.indexOf(folderName) == -1) {
            await this.click({ elem: el });
            await browser.pause(2000);

            let el2 = await this.getFolderFromDropdownOnEditor(folderName);
            await this.waitForElementVisible(el2);
            await this.click({ elem: el2 });
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(60);
        }
    }

    // search object
    async searchObject(objectName) {
        let el = await this.getSearchBoxOnEditor();
        await this.waitForElementVisible(el, 30 * 1000);
        await this.sleep(1);
        let clearBtn = this.getSearchBoxClearOnEditor();
        let status = await clearBtn.isDisplayed();
        if (status) {
            await this.click({ elem: clearBtn });
            await this.sleep(0.2);
        }
        await this.enter();
        await this.sleep(0.3);
        await this.typeParameterToInputField(el, objectName);
        await this.sleep(0.3);
        await this.confirmInputTextByPressingEnterKeyOn(el);
        await this.loadingDialog.waitBooketLoaderIsNotDisplayed(120);
    }

    async searchAndSelect(objectName) {
        await this.searchObject(objectName);
        let dt = this.getObjectFromSearchResult(objectName);
        await this.waitForElementVisible(dt, 120 * 1000);
        await this.click({ elem: dt });
    }

    async selectObject(ObjectName) {
        let el = await this.getObjectFromSearchResult(ObjectName);
        await scrollIntoView(el);
        await this.waitForElementVisible(el);
        await this.sleep(0.3);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changeDropdown(title, newMode) {
        // click on dropdown
        let el = await this.getDropdownWithTitle(title);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        //pull down list appear
        let el2 = await this.getPulldownListWithTitle(title);
        await this.waitForElementVisible(el2);
        // clikc on newMode
        let el3 = await this.getPulldownOptionWithTitle(title, newMode);
        await this.click({ elem: el3 });
        // pull down list closed
        await this.waitForElementInvisible(el2);
    }

    async clickOnCheckboxWithTitle(title) {
        let el = await this.getCheckboxWithTitle(title);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
    }

    async clickOnCheckboxWithLabel(label) {
        let el = await this.getCheckboxWithLabel(label);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
    }

    // Used to change dropdown options in Export to PDF dialog
    async changeDropdownForExport(title, newMode) {
        // click on dropdown
        let el = await this.getDropdownForExport(title);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        //pull down list appear
        let el2 = await this.getPulldownListForExport(title);
        await this.waitForElementVisible(el2);
        // clikc on newMode
        let el3 = await this.getPulldownOptionForExport(title, newMode);
        await this.click({ elem: el3 });
        // pull down list closed
        await this.waitForElementInvisible(el2);
    }

    // Used to click checkbox in Export to PDF dialog
    async clickOnCheckboxLabelForExport(label) {
        let el = await this.getCheckBoxLabelForExport(label);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
    }

    // Used to click radio button in Export to PDF dialog
    async clickOnRadioButton(label) {
        let el = await this.getRadioButton(label);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
    }

    // Used to click portratit orientation in Export to PDF dialog
    async clickOnPortraitBtn() {
        let el = await this.getPDFeditorPortrait();
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
    }

    // Used to click landscape orientation in Export to PDF dialog
    async clickOnLandscapeBtn() {
        let el = await this.getPDFeditorLandscape();
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
    }

    //download pdf to test-data/DossierPDF folder
    //https://stackoverflow.com/questions/42436784/save-pdf-to-file-with-protractor
    async downloadPDF() {
        let pdfUrl = await browser.getUrl();
        await browser.execute(
            `var a = document.createElement('a');
                                        a.href = arguments[0];
                                        a.id='downloadPdf';
                                        a.download = 'abc.pdf';
                                        a.text='DOWNLOAD';
                                        a.style='width:200px;height:200px;'
                                        var b = document.getElementsByTagName('body')[0];
                                        b.insertBefore(a, b.firstChild);`,
            pdfUrl
        );
        let el2 = this.$('#downloadPdf');
        await this.clickOnElementByClickEvent(el2);
    }

    /**
     * Check if Mojo error popup contains the text
     * @param {String} txt error message
     */
    async hasMojoEdtiorErrorText(txt) {
        let el = this.getMojoEdtiorErrorContent();
        await this.waitForElementVisible(el, browsers.params.timeout.waitDOMNodePresentTimeout10);
        let errorText = await el.getText();
        return errorText.indexOf(txt) > -1;
    }

    //<------------------Ai related feature (custom instructions)------------------------>
    async setCustomInstructionsText(id, txt) {
        let el = await this.getCustomInstructionsTextArea(id);
        await el.clearValue(txt);
        await el.addValue(txt);
    }

    //<------------------Ai related feature (knowledge assets)------------------------>
    async clickOnLeftTab(tabName) {
        let el = await this.getLeftTab(tabName);
        await el.waitForDisplayed();
        await this.click({ elem: el });
    }

    async addFileFromDisk(filename) {
        let el = this.knowledgeAssetUploadFileInput;
        await el.waitForExist();
        let absFilename = path.resolve(process.cwd(), 'test-data', 'file-from-disk', filename);
        // The input element has "hidden" attribute, so we need to remove it before using 'setValue' function
        await browser.execute(function () {
            document.getElementById('ai-chatbot-file-uploader').removeAttribute('hidden');
        });
        let remoteFilePath = await browser.uploadFile(absFilename);
        await el.setValue(remoteFilePath);
    }

    async clickDeleteFileIcon() {
        let el = await this.knowledgeAssetDeleteFileIcon;
        await el.waitForDisplayed();
        await this.click({ elem: el });
    }

    async clickYesOnDeleteConfirm() {
        let el = await this.knowledgeAssetDeleteConfirmYesBtn;
        await el.waitForDisplayed();
        await this.click({ elem: el });
    }

    async clickErrorButton(btnTxt) {
        return this.click({ elem: this.getErrorButton(btnTxt) });
    }

    async isAlertMessageDisplayed(txt) {
        const el = await this.getErrorPopUpText(txt);
        return await el.isDisplayed();
    }

    async isMoJoEditorWithTitleDisplayed(title) {
        const el = await this.getMojoEditorWithTitle(title); 
        return await el.isDisplayed();
    }
   
}
