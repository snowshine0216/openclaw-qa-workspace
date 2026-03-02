import AIBotChatPanel from '../aibot/AIBotChatPanel.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import LibraryAuthoringPage from '../library/LibraryAuthoringPage.js';
import Alert from '../common/Alert.js';
import { checkElementByImageComparison } from '../../utils/TakeScreenshot.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const AUTO_DASH_IMAGE_DIR = path.resolve(
    __dirname,
    '../../specs/regression/autoDashboard2/autoDash2UploadImage'
);

export default class AutoDashboard extends AIBotChatPanel {
    constructor() {
        super();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.alert = new Alert();
        this.libraryAuthoringPage = new LibraryAuthoringPage();
    }
    // Element Locator
    getAutoDashboard() {
        return this.$('#rootView .mstrmojo-RootView-vizControl .mstrmojo-VizControl');
    }

    getAnswers() {
        return this.$$('.mstrd-ChatPanelVisualization,.mstrd-ChatPanelContainer-markdown-error-container');
    }

    getAnswerByIndex(index = 0) {
        return this.getAnswers()[index];
    }

    getAiSuggestionButton(text) {
        return this.$$('.mstrd-Recommendations-content .mstrd-RecommendationItem').filter(async (elem) => {
            const stringOnButton = await elem.getText();
            return stringOnButton.includes(text);
        })[0];
    }

    getAiWelcomeImage() {
        return this.$('.mstrd-ChatPanelContainer-welcome');
    }

    async getPageRecommendationByIndex(index) {
        const answers = await this.getAnswerList().$$('.left');
        const lastAnswer = answers[answers.length - 1];
        return await lastAnswer.$$('.mstrd-ChatPanelAnalyses-item')[index];
    }

    getQuestionRecommendationByIndex(index) {
        return this.getAutoDashboard().$$('.mstrd-RecommendationItem')[index];
    }

    getLoadingChatBubble() {
        return this.getAnswerList().$('.single-loading-spinner');
    }

    getAiWelcomePopup() {
        return this.$('.ai-assistant-tooltip');
    }

    getDontShowPopupCheckbox() {
        return this.$$('.mstrmojo-Popup-content .mstrmojo-CheckBox.dont-show-me-again').at(-1);
    }

    getDontShowPopupCheckboxInput() {
        return this.getDontShowPopupCheckbox().$$('//input')[0];
    }

    getInputBox() {
        return this.$('.mstr-chatbot-chat-input__textarea');
    }
    getAutoDash2InputBox() {
        return this.$('.mstr-chatbot-chat-input-inline__textarea');
    }

    getSendIcon() {
        return this.$('.mstr-chatbot-chat-input__send-btn');
    }
    getAutoDash2SendIcon() {
        return this.$('.mstr-chatbot-chat-input-inline__send-btn');
    }
    getAutoDash2ErrorContent() {
        return this.$('.mstr-ai-chatbot-ChatPanel-error-container');
    }
    getAutoDash2waitbox() {
        return this.$('.mstr-autodash-v2-wait');
    }
    getInputBoxHintText() {
        return this.getInputBox().getAttribute('placeholder');
    }

    // datasetsPanel.getDIButtonByName('Cancel') somehow is not working
    getDICancelButton() {
        return this.$(`//div[@id='DIContainer']//div[@class="mstrmojo-Button-text " and text()="Cancel"]`);
    }

    getClearBtn() {
        return this.$('.icon-mstrd_ai_clear');
    }

    getClearHistoryConfirmBtn(optionName) {
        return this.$(`//button[text()='${optionName}']`);
    }

    getVizByIndex(index = 0) {
        return this.$$('.mstrmojo-RootView-vizControl .mstrmojo-VIBox ')[index];
    }

    getChatPanelAnalysesitem(name) {
        return this.$$('.mstrd-ChatPanelAnalyses-item').filter(async (elem) => {
            const elemText = await elem.$('.mstrd-ChatPanelAnalyses-name').getText();
            return elemText === name;
        })[0];
    }

    getShowErrorMessage() {
        const elements = this.$$('.mstr-design-collapse-header__title');
        if (elements.length > 0) {
            return elements[elements.length - 1];
        }
        return null;
    }

    async getShowErrorMessage2() {
        const elements = await this.$$('.mstr-design-collapse__header');
        if (elements.length > 0) {
            return elements[elements.length - 1];
        }
        return null;
    }

    getAutoDashSuggestionList() {
        return this.$$('.mstr-ai-chatbot-RecommendationItem-text');
    }
    async clickShowErrorDetails() {
        const errorMessageElement = this.getShowErrorMessage();
        if (errorMessageElement) {
            await errorMessageElement.isDisplayed();
            await this.click({ elem: errorMessageElement });
        }
    }

    async clickShowErrorDetails2() {
        const errorMessageElement = await this.getShowErrorMessage2();
        if (errorMessageElement) {
            await errorMessageElement.isDisplayed();
            await errorMessageElement.waitForClickable({ timeout: 3000 });
            await this.click({ elem: errorMessageElement });
        }
    }

    async getAddToPageButton() {
        const answers = await this.getAnswerList().$$('.left');
        const lastAnswer = answers[answers.length - 1];
        return await lastAnswer.$('.mstrd-ChatPanelVisualization-ChatPanelVisualizationCopyIcon');
    }

    getAIDiagIcon() {
        return this.$$('.mstr-ai-chatbot-DiagnosticsButton, .mstr-ai-chatbot-AnswerActions-diagnostics');
    }

    getAIDiagDownloadIcon() {
        return this.$('.mstr-ai-chatbot-DiagnosticsTab-btns');
    }

    getAIDiagCloseIcon() {
        return this.$('.mstr-ai-chatbot-DiagnosticsCloseIcon');
    }

    getAutoDash2ToggleBtn() {
        return this.$('.item.chatPanel');
    }

    getAutoDash2BeautyModeButton() {
        return this.$('.mstrd-AutoDashTitlebar-beautyModeButton');
    }

    getCurrentAutoDash2BeautyMode(BeautyMode) {
        return this.$(
            `//span[text()="${BeautyMode}"]//ancestor::div[@class="mstrd-AutoDashTitlebar-beautyModeButton"]`
        );
    }

    getAutoDash2BeautyModesDialog() {
        return this.$('.mstrd-ChatPanelAutoDashStyleModes');
    }

    getAutoDash2BeautyModesOption(optionName) {
        return this.getAutoDash2BeautyModesDialog().$(
            `.mstrd-ChatPanelAutoDashStyleModes-style-image-container[aria-label*="${optionName}"]`
        );
    }

    // OK; Cancel
    getAutoDash2BeautyModeDialogBtn(buttonName) {
        return this.getAutoDash2BeautyModesDialog().$(`.mstrd-Button[aria-label='${buttonName}']`);
    }

    getAutoDash2ImageUploadBtn() {
        return this.$(`.mstr-ai-chatbot-AddImageButton`);
    }

    getAutoDash2ImageUploadInput() {
        return this.$(`//div[contains(@class, 'mstr-ai-chatbot-AddImageButton')]//input[@type='file']`);
    }

    getPageLockSizeApplyNowBtn() {
        return this.$("//div[contains(@class, 'mstr-ai-chatbot-LockPageSizeHint')]//button[text()='Apply Now']");
    }

    // Action Methods
    async openAutoDashboard(isDatasetAdded = false) {
        if (await this.getAutoDashboard().isDisplayed()) {
            return;
        }
        const button = await this.dossierAuthoringPage.getToolbarBtnByName('Auto Dashboard');
        await this.click({ elem: button });
        await this.waitForElementVisible(this.getAutoDashboard());
        if (isDatasetAdded) {
            await this.waitForElementVisible(this.getAiSuggestionButton('Create a page for'));
        }
    }

    async closeAutoDashboard() {
        if (await this.getAutoDashboard().isDisplayed()) {
            const button = await this.dossierAuthoringPage.getToolbarBtnByName('Auto Dashboard');
            await this.click({ elem: button });
            await this.waitForElementInvisible(this.getAutoDashboard());
        }
    }

    async toggleAutoDashboard2() {
        const autodash2Panel = await this.getAutoDashboard();
        const btn = await this.getAutoDash2ToggleBtn();
        const isDisplayed = await autodash2Panel.isDisplayed();

        await this.click({ elem: btn });

        if (isDisplayed) {
            await this.waitForElementInvisible(autodash2Panel);
        } else {
            await this.waitForElementVisible(autodash2Panel);
        }
    }

    async clickCreateAPageSuggetion() {
        await this.click({ elem: this.getAiSuggestionButton('Create a page for') });
        await this.waitForElementVisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async clickPageCreationRecommendations() {
        await this.click({ elem: this.getAiSuggestionButton('ecommendation') });
        await this.waitForElementInvisible(this.getLoadingChatBubble());
        await this.sleep(500);
        await this.waitForElementVisible(await this.getPageRecommendationByIndex(0));
    }

    async clickRecommendationByIndex(index) {
        await this.click({ elem: await this.getPageRecommendationByIndex(index) });
        await this.waitForElementInvisible(this.getLoadingChatBubble());
        await this.sleep(500); // Time buffer for loading
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async sendPrompt(text) {
        await this.click({ elem: this.getInputBox() });
        await this.typeKeyboard(text);
        await this.click({ elem: this.getSendIcon() });
    }

    async sendPromptInAutoDash2(text) {
        await this.click({ elem: this.getAutoDash2InputBox() });
        await this.typeKeyboard(text);
        await this.click({ elem: this.getAutoDash2SendIcon() });
        await this.waitAutoDash2Process();
        await this.waitForAnswerLoading();
    }

    async waitAutoDash2Process() {
        await this.waitForElementVisible(this.getAutoDash2waitbox(), { timeout: 2000 });
        await this.waitForElementInvisible(this.getAutoDash2waitbox(), { timeout: 120000 });
    }

    async autoPageCreationByChat(pagePrompt) {
        await this.sendPrompt(pagePrompt);
        // Wait for a new page to be generated
        await this.waitForElementVisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    // ----- selection viz creation question from list or ask questions -----
    async clickVizCreationRecommendationByIndex(index) {
        // index should be 0 or 1 to selete viz creation question
        await this.click({ elem: await this.getQuestionRecommendationByIndex(index) });
        await this.waitForElementVisible(this.getLoadingChatBubble());
        await this.waitForElementInvisible(this.getLoadingChatBubble());
    }

    async vizCreationByChat(pagePrompt) {
        await this.sendPrompt(pagePrompt);
        await this.waitForElementInvisible(this.getLoadingChatBubble());
    }

    async clearHistoryVizCreationByChat(pagePrompt) {
        await this.clearHistory();
        await this.vizCreationByChat(pagePrompt);
    }

    async addLastVizToPage() {
        const el = await this.getAddToPageButton();
        // might not in viewport, use script here
        await this.executeScript('arguments[0].click();', el);
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    // create SAAS spefic method to create dossier as the library loading may still exist after opening new dossier
    async createDossierFromSAASLibrary() {
        await this.clickAndNoWait({ elem: this.libraryAuthoringPage.getNewDossierIcon() });
        await this.clickAndNoWait({ elem: this.libraryAuthoringPage.getNewDossierButton() });
    }

    // Add this new method to save dossier as the one on dossierAuthoringPage takes too long to wait for
    async saveDossierAndCloseEditMode() {
        await this.click({ elem: this.dossierAuthoringPage.getSaveDossierButton() });
        await this.waitForElementVisible(this.dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
        await this.waitForElementInvisible(this.dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
        await this.click({ elem: this.dossierAuthoringPage.getCloseDossierButton() });
        await this.waitForItemLoading();
        return this.sleep(2000); // Time buffer for elements to be fully loaded
    }

    // Close dossier edit mode without saving
    async closeEditWithoutSaving() {
        await this.click({ elem: this.dossierAuthoringPage.getCloseDossierButton() });
        if (await this.alert.getTextButtonByName("Don't Save").isDisplayed()) {
            await this.click({ elem: this.alert.getTextButtonByName("Don't Save") });
            // await this.waitForElementVisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
        }
        await this.sleep(2000);
        await this.waitForItemLoading();
    }

    // ----------- Quota related methods -----------
    async storeQuota() {
        let txt = await this.getInputBoxHintText();
        let count = parseInt(txt.substring(txt.indexOf(':') + 1));
        await this.executeScript(`localStorage.setItem('aiQuota', ${count})`);
    }

    async getRemoteQuota() {
        let count = await this.executeScript(`return localStorage.getItem('aiQuota')`);
        return count;
    }

    async getQuota() {
        let txt = await this.getInputBoxHintText();
        let count = parseInt(txt.substring(txt.indexOf(':') + 1));
        return count;
    }

    async checkVizInAutoDashboard(index, testCase, imageName, tolerance = 0.5) {
        const vizElement = this.getVizByIndex(index);
        if (await vizElement.isDisplayed()) {
            await checkElementByImageComparison(vizElement, testCase, imageName, tolerance);
        } else {
            await this.clickShowErrorDetails();
            const answerElement = this.getAnswerByIndex(index);
            if (await answerElement.isDisplayed()) {
                await checkElementByImageComparison(answerElement, testCase, imageName, tolerance);
            }
        }
    }

    async clearHistory() {
        await this.click({ elem: this.getClearBtn() });
        if (await this.getClearHistoryConfirmBtn('Yes').isDisplayed()) {
            await this.click({ elem: this.getClearHistoryConfirmBtn('Yes') });
            await this.waitForElementVisible(this.getAiWelcomeImage());
        }
    }

    async clickChatPanelAnalysesByName(name) {
        await this.click({ elem: this.getChatPanelAnalysesitem(name) });
        await this.waitForElementInvisible(this.getLoadingChatBubble(), { timeout: 300 * 1000 });
        await this.sleep(500); // Time buffer for loading
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async clickDontShowPopupCheckboxInput() {
        await this.waitForElementClickable(this.getDontShowPopupCheckboxInput());
        await this.getDontShowPopupCheckboxInput().click();
    }
    async openLatestAIDiag() {
        const diagBtn = await this.getAIDiagIcon();
        if (diagBtn.length > 0) {
            await browser.execute((element) => element.click(), diagBtn[diagBtn.length - 1]);
        }
    }

    async getLastSummaryText() {
        await this.sleep(2000);
        const processingMsg = this.$('.mstrmojo-Label.mstrWaitMsg');
        await this.waitForElementInvisible(processingMsg);
        const bubbles = await $$('.chat-bubble.Bubble.text.streaming');
        await browser.execute(
            (el) => el && el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })),
            bubbles[bubbles.length - 1]
        );
        return bubbles[bubbles.length - 1].getText();
    }
    async downloadAIDiag() {
        const downloadBtn = await this.getAIDiagDownloadIcon();
        await this.waitForElementVisible(downloadBtn);
        await browser.execute((element) => element.click(), downloadBtn);
    }
    async closeAIDiag() {
        const closeBtn = await this.getAIDiagCloseIcon();
        await this.waitForElementVisible(closeBtn);
        await this.click({ elem: closeBtn });
    }

    async showDetailsIfError() {
        if (await this.getAutoDash2ErrorContent().isDisplayed()) {
            await this.clickShowErrorDetails();
        }
    }

    async showErrorDetailsAndFail() {
        const errorEL = await this.getAutoDash2ErrorContent();

        if ((await errorEL.isExisting()) && (await errorEL.isDisplayed())) {
            await this.clickShowErrorDetails2();
            await this.sleep(2000);

            // Explicitly fail the test
            throw new Error(`Auto Dashboard user prompt error out`);
        }
    }

    async waitForSuggestionReady() {
        await this.waitForElementVisible(this.getAutoDashSuggestionList()[0], { timeout: 120000 });
        const suggestions = await this.getAutoDashSuggestionList();
        //assert 3 suggestions are displayed
        if (suggestions.length < 3) {
            throw new Error('Less than 3 suggestions are displayed');
        }
    }

    async sendPromptInAutoDash2NoWaitManipulation(Prompt) {
        await this.sendPromptInAutoDash2(Prompt);
        await this.waitAutoDash2Process();
    }

    async processAILogFromBotStream(botstream) {
        const calls = botstream.calls;
        const lastCall = calls[calls.length - 1];
        const result = {};
        if (lastCall && lastCall.body) {
            const lines = lastCall.body.split('\n');
            const lastDataLine = lines.reverse().find((line) => line.trim().startsWith('data:'));
            if (lastDataLine) {
                const jsonStr = lastDataLine.replace(/^data:\s*/, '');
                try {
                    const dataObj = JSON.parse(jsonStr);
                    const answer = dataObj.answers && dataObj.answers[0];
                    result.text = answer?.text || null;
                    result.type = answer?.type || null;
                    result.detailError = answer?.detailError || null;
                    result.diagnostics = null;
                    //extract answers.diag
                    const diag = answer?.diagnosticsData;
                    const errordiag = answer?.errorDiagnosticsData;

                    // diag, errordiag the not null one as real diag
                    const realDiag = diag || errordiag;
                    if (realDiag) {
                        result.diagnostics = realDiag;
                        //parser string as json, save dump content to json file,
                    }
                    return result;
                } catch (err) {
                    console.log('Failed to parse JSON from last data line:', jsonStr);
                    return null;
                }
            } else {
                console.log('No data line found in lastCall.body');
                return null;
            }
        } else {
            console.log('No body found in lastCall');
            return null;
        }
    }

    async getAutoDash2LatestAnswerText() {
        const elements = await $$("//div[contains(@class, 'mstr-chatbot-markdown')]");
        const lastEl = elements[elements.length - 1];
        return await lastEl.getText();
    }

    async clickLockPageSizeApplyNowButton() {
        const applyNowBtn = await this.getPageLockSizeApplyNowBtn();
        await this.click({ elem: applyNowBtn });
    }

    async switchAutoDash2BeautificationMode(newModeName) {
        // Open Beautification mode dialog
        await this.click({ elem: this.getAutoDash2BeautyModeButton() });
        await this.waitForElementVisible(this.getAutoDash2BeautyModesDialog());

        // Select new mode
        await this.click({ elem: this.getAutoDash2BeautyModesOption(newModeName) });
        await this.click({ elem: this.getAutoDash2BeautyModeDialogBtn('OK') });

        // verify the new mode
        const currentModeEl = await this.getCurrentAutoDash2BeautyMode(newModeName);
        await currentModeEl.waitForDisplayed({
            timeout: 5000,
            timeoutMsg: `Beautification mode "${newModeName}" was not applied`,
        });
    }

    async uploadAutoDashImage(imageName) {
        const imagePath = path.resolve(AUTO_DASH_IMAGE_DIR, imageName);
        const sendBtn = await this.getAutoDash2SendIcon();

        if (!fs.existsSync(imagePath)) {
            throw new Error(`Upload image not found in repo: ${imagePath}`);
        }

        const input = await this.getAutoDash2ImageUploadInput();
        await input.waitForExist({ timeout: 5000 });
        // make the hidden element visible
        await browser.execute((el) => {
            el.removeAttribute('hidden');
            el.style.display = 'block';
            el.style.visibility = 'visible';
        }, input);

        await input.setValue(imagePath);
        await this.click({ elem: sendBtn });
        await this.waitAutoDash2Process();
        await this.waitForAnswerLoading();
    }

    // Assertion Methods

    async isUploadImageBtnDisplayed() {
        return this.getAutoDash2ImageUploadBtn().isDisplayed();
    }
}
