import WebBasePage from '../base/WebBasePage.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';
// import { getAttributeValue } from '../../utils/getAttributeValue.js';

export default class PromptEditor extends WebBasePage {
    /************************************************
     * Element locator
     ************************************************/

    //--------------------Reprompt-----------------------------
    getRepromptIcon() {
        return this.$('.mstr-nav-icon.icon-tb_prompt');
    }

    //--------------------Prompt Editor-----------------------------
    getPromptEditor() {
        return this.$('#mstrdossierPromptEditor, .mstrPromptEditor');
    }

    getPromptContainer() {
        return this.$('.mstrd-PromptEditorContainer-overlay');
    }

    getEditorHeader() {
        return this.getPromptEditor().$('.mstrd-PromptEditor-header');
    }

    getPromptLoading() {
        return this.getPromptEditor().$('.mstrd-LoadingIcon-loader');
    }

    //--------------------Prompt Index-----------------------------
    getIndexTable() {
        return this.getPromptEditor().$('.mstrPromptTOCListTable');
    }

    getSelectedPrompt() {
        return this.getPromptEditor().$('.mstrPromptTOCListTable').$('.mstrPromptTOCListItemSelected');
    }

    getCloseIndexIcon() {
        return this.$('.mstrPromptEditorCellTOC').$('.mstrPromptTOCHeaderCellRight>span');
    }

    getOpenIndexIcon() {
        return this.$('.mstrPromptEditorCellTOC').$('.mstrPromptTOCOpener');
    }

    getTOCListItemByTitle(title) {
        return this.getIndexTable()
            .$$('.mstrPromptTOCListItemTitle')
            .filter(async (elem) => {
                const itemTitle = await elem.getText();
                return itemTitle === title;
            })[0];
    }

    getPromptTitleByName(title) {
        return this.$(`//div[@class='mstrPromptQuestionTitleBar' and contains(@aria-label, '${title}')]`);
    }

    //--------------------Prompt Container-----------------------------
    getPromptContainer() {
        return this.getPromptEditor().$('.mstrPromptEditorCellBook').$('.mstrPromptEditorBookContainer');
    }

    //--------------------ToolBar-----------------------------
    getBottomToolBar() {
        return this.getPromptEditor().$('.mstrPromptEditorCellNavToolbar');
    }

    getRunButton() {
        return this.getBottomToolBar().$('.mstrPromptEditorButtons').$('.mstrPromptEditorButtonRun');
    }

    getCancelButton() {
        return this.getBottomToolBar().$('.mstrPromptEditorButtons').$('.mstrPromptEditorButtonCancel');
    }

    getEditorCloseIcon() {
        return this.getEditorHeader().$('.icon-pnl_close');
    }

    getButtonByName(name) {
        return this.getBottomToolBar()
            .$$('.mstrPromptEditorButtonRun')
            .filter(async (elem) => {
                const buttonName = await elem.getText();
                return buttonName === name;
            })[0];
    }

    //--------------------WebToolBarButtons-----------------------------

    getWebRunButton() {
        return this.getBottomToolBar().$('.mstrButton[value*="Run"]');
    }

    getWebCancelButton() {
        return this.getBottomToolBar().$('.mstrButton[value*="Cancel"]');
    }

    getWebBackButton() {
        return this.getBottomToolBar().$('.mstrButton[value*="Back to Prompt"]');
    }

    getMsgNameInputOnWeb() {
        return this.$('.mstrPromptEditorCellRenameMsgToolbar').$('.mstrTextBoxInput>input');
    }

    getPageStartInput() {
        return this.$('.mstrPopupOpaqueContainer').$('.mstrTextBoxInput>input');
    }

    //--------------------Message Box-----------------------------
    getMessageBox() {
        return this.$('.mstrd-MessageBox').$('.mstrd-MessageBox-main');
    }

    //--------------------Prompt Summary-----------------------------
    getSwitchSummaryButton() {
        return this.getPromptEditor().$('.mstrPromptEditorSwitchSummary');
    }

    getToggleViewSummary() {
        return this.getSwitchSummaryButton().$('label');
    }

    getSummaryContainer() {
        return this.getPromptContainer().$('.mstrPromptSummaryBook');
    }

    getListSummaryText(promptSummaryFinder) {
        return promptSummaryFinder.$('.mstrPromptQuestionSummarySimpleAnswerView').$('.mstrListTextDivValue');
    }

    getQualSummaryText(promptSummaryFinder) {
        return promptSummaryFinder.$('.mstrExprBase');
    }

    getQualSummaryTextOfDefault(promptSummaryFinder) {
        return promptSummaryFinder.$('.mstrPromptQuestionSummaryComplexAnswerView');
    }

    getDynamicSummaryText(promptSummaryFinder) {
        return promptSummaryFinder.$('.mstrPromptQuestionSummaryCONSTANT');
    }

    getMutipleQualSummaryText(promptSummaryFinder) {
        return promptSummaryFinder.$('.mstrExprEditorBranchQualContent');
    }

    getTextSummaryText(promptSummaryFinder) {
        return promptSummaryFinder.$('.mstrPromptQuestionSummarySimpleAnswerView').$('.mstrTextDivValue');
    }

    getNoSummaryText(promptSummaryFinder) {
        return promptSummaryFinder.$('.mstrPromptQuestionSummaryEmptyAnswerView');
    }

    getSummaryTitleBar() {
        return this.$$('.mstrPromptQuestionSummaryTitleBar');
    }

    getSummaryTitleIndex(promptSummaryFinder) {
        return promptSummaryFinder.$('.mstrPromptQuestionSummaryTitleBarIndex');
    }

    getSummaryTitle(promptSummaryFinder) {
        return promptSummaryFinder.$('.mstrPromptQuestionSummaryTitleBarTitle');
    }

    getAllPromptSummary() {
        return this.getSummaryContainer().$$('div[class=mstrPromptQuestionSummary]');
    }

    getSummaryByName(name) {
        return this.getAllPromptSummary().filter(async (elem) => {
            const promptName = await this.getSummaryTitle(elem).getText();
            return promptName === name;
        })[0];
    }

    getSummaryByIndex(index) {
        return this.getAllPromptSummary()[index];
    }

    getWebPromptSummary() {
        return this.$('.mstrPromptTOCSummaryButton');
    }

    getDocumentContent() {
        //return this.$('mstrmojo-OIVMPage');
        return this.$('[class*=mstrd-ViDocRenderer]');
    }

    getDossierContent() {
        return this.$('[class*=mstrmojo-VIDocument]');
    }

    getComplexAnswer() {
        return this.$$('.mstrPromptQuestionSummaryComplexAnswerCaption');
    }

    getComplexAnswerValue() {
        return this.$$('.mstrPromptQuestionSummaryComplexAnswerValue');
    }

    getCancelExecutionButton() {
        return this.getPromptEditor().$('.mstrd-CancelExecutionButton');
    }

    /************************************************
     * Action helper
     ************************************************/

    async reprompt() {
        await this.click({ elem: this.getRepromptIcon() });
        return this.waitForRepromptLoading();
    }

    async clickPromptIndexByTitle(title) {
        await this.waitForElementVisible(this.getIndexTable());
        await this.click({ elem: this.getTOCListItemByTitle(title) });
    }

    async clickPromptIndexByTitleWithNoWait(title) {
        await this.waitForElementVisible(this.getIndexTable());
        await this.getTOCListItemByTitle(title).click();
        return this.waitForDynamicElementLoading();
    }

    async closeEditor() {
        await this.click({ elem: this.getEditorCloseIcon() });
        // return this.waitForEditorClose();
    }

    async cancelEditor() {
        if (!this.isWeb()) {
            await this.click({ elem: this.getCancelButton() });
            return this.waitForEditorClose();
        } else {
            await this.click({ elem: this.getWebCancelButton() });
            await this.waitDocumentToBeLoaded();
            await this.waitForWebCurtainDisappear();
        }
    }

    async run() {
        if (!this.isWeb()) {
            await this.waitForEditor();
            await this.waitForElementVisible(this.getRunButton());
            await this.waitForElementClickable(this.getRunButton());
            await this.getRunButton().click();
            await this.waitForPromptLoading();
            await this.sleep(2000);
        } else {
            await this.click({ elem: this.getWebRunButton() });
            if (wait) {
                await this.waitDocumentToBeLoaded();
                await this.waitForWebCurtainDisappear();
            }
        }
    }

    async cancelResolvePrompt() {
        await this.clickByForce({ elem: this.getCancelExecutionButton() });
        await this.waitForElementInvisible(this.getPromptLoading());
        return this.sleep(1000);
    }

    async clickButtonByNameAndNoWait(name) {
        await this.waitForEditor();
        await this.waitForElementVisible(this.getButtonByName(name));
        await this.waitForElementClickable(this.getButtonByName(name));
        await this.getButtonByName(name).click();
    }

    async waitForError() {
        await this.sleep(1000);
        await this.waitForElementVisible(this.getErrorDialogue());
    }

    async clickButtonByName(name) {
        await this.click({ elem: this.getButtonByName(name) });
    }

    async renameReportMsgOnWeb(newName) {
        await this.waitForElementVisible(this.getMsgNameInputOnWeb());
        await this.clear({ elem: this.getMsgNameInputOnWeb() });
        await this.getMsgNameInputOnWeb().setValue(newName);
    }

    async setPageStartIndex(index) {
        await this.waitForElementVisible(this.getPageStartInput());
        await this.clear({ elem: this.getPageStartInput() });
        await this.getPageStartInput().setValue(index);
    }

    async runPromptInPrompt() {
        await this.getRunButton().click();
        await this.waitForPromptLoading();
        await this.sleep(2000);
        await this.waitForEditor();
    }

    async runNoWait() {
        if (!this.isWeb()) {
            await this.getRunButton().click();
        } else {
            await this.getWebRunButton().click();
        }
    }

    async runWithPIP() {
        if (!this.isWeb()) {
            await this.getRunButton().click();
            await this.waitForElementInvisible(this.getCancelExecutionButton());
            await this.waitForElementVisible(this.getPromptEditor());
        } else {
            await this.getWebRunButton().click();     
        }
    }

     async runWithWaitForCancel() {
        if (!this.isWeb()) {
            await this.getRunButton().click();
            await this.waitForElementInvisible(this.getPromptEditor());
        } else {
            await this.getWebRunButton().click();
        }
    }


    async runWithERR() {
        await this.click({ elem: this.getRunButton() });
        await this.waitForElementVisible(this.getPromptContainer());
    }

    async waitForEditor() {
        await this.sleep(2000);
        let isEditorVisible = await this.isEditorOpen();
        for (let i = 0; i < 3 && !isEditorVisible; i++) {
            await this.sleep(1000);
            isEditorVisible = await this.isEditorOpen();
        }
        await this.waitForElementVisible(this.getPromptContainer(), { msg: 'PromptEditor was not displayed.' });
    }

    async waitForEditorClose() {
        await this.sleep(1000);
        await this.waitForElementInvisible(this.getPromptContainer(), { msg: 'PromptEditor was not closed.' });
        // await this.waitForElementStaleness(this.getPromptContainer(), { msg: 'PromptEditor was not closed.' });
    }

    async waitForRepromptLoading() {
        await this.sleep(1000);
        await this.waitForElementStaleness(this.getPromptLoading());
        await this.waitForElementVisible(this.getPromptContainer(), { msg: 'PromptEditor was not displayed.' });
    }

    async waitForPromptLoading() {
        await this.sleep(1000);
        const el = this.getPromptLoading();
        // log the el display status every 1 second till it disappears
        let isDisplayed = await el.isDisplayed().catch(() => false);
        for (let i = 0; i < 60 && isDisplayed; i++) {
            console.log(`Prompt loading is still displayed...` + isDisplayed);
            await this.sleep(1000);
            isDisplayed = await el.isDisplayed().catch(() => false);
        }
        await this.waitForElementInvisible(this.getPromptLoading(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Running prompt answer loading takes too long.',
        });
        console.log('prompt loading disappeared');
    }

    async waitForMessageBox() {
        await this.sleep(1000);
        return this.waitForElementVisible(this.getErrorDialogue());
    }

    async toggleViewSummary() {
        await this.waitForElementVisible(this.getSwitchSummaryButton());
        await this.getSwitchSummaryButton().$('label').click();
        return this.sleep(1000);
    }

    async waitForSummaryItem(promptName) {
        await this.waitForElementVisible(this.getSummaryByName(promptName));
        return this.sleep(1000);
    }

    async clickWebPromptSummary() {
        return this.getWebPromptSummary().click();
    }

    async backPrompt() {
        return this.getWebBackButton().click();
    }

    async scrollEditorToBottom() {
        let offsetHeight = await this.getPromptContainer().getCSSProperty('height');
        offsetHeight = offsetHeight.value.split('p')[0];
        await this.executeScript(
            (element, scrollAmount) => {
                element.scrollTop = scrollAmount;
            },
            await this.$('.mstrViewRoll'),
            offsetHeight
        );
        return this.sleep(1000);
    }

    async scrollEditorToTop() {
        //await this.executeScript('arguments[0].scrollTop = arguments[1];', this.$('.mstrViewRoll').getWebElement(), 0);
        // await this.execute('arguments[0].scrollTop = arguments[1];', this.$('.mstrViewRoll'), 0);
        await this.executeScript(
            (element, scrollAmount) => {
                element.scrollTop = scrollAmount;
            },
            await this.$('.mstrViewRoll'),
            0
        );
        return this.sleep(1000);
    }

    async scrollWindowToRightmost() {
        let offsetHeight = await this.getPromptContainer().getCSSProperty('width');
        offsetHeight = offsetHeight.value.split('p')[0];
        await this.executeScript(
            (element, scrollAmount) => {
                element.scrollLeft = scrollAmount;
            },
            await this.$('.mstrViewRoll'),
            offsetHeight
        );
        return this.sleep(1000);
    }

    /************************************************
     * Assertion helper
     ************************************************/

    async isRepromptIconPresent() {
        return this.getRepromptIcon().isDisplayed();
    }

    async isEditorOpen() {
        return this.getPromptEditor().isDisplayed();
    }

    async isViewSummaryEnabled() {
        return this.getSwitchSummaryButton().$('input:checked').isDisplayed();
    }

    async checkEmptySummary(promptName) {
        return this.getNoSummaryText(this.getSummaryByName(promptName)).getText();
    }

    async checkEmptySummaryByIndex(index) {
        return this.getNoSummaryText(this.getSummaryByIndex(index)).getText();
    }

    async checkListSummary(promptName) {
        return this.getListSummaryText(this.getSummaryByName(promptName)).getText();
    }

    async checkListSummaryByIndex(index) {
        return this.getListSummaryText(this.getSummaryByIndex(index)).getText();
    }

    async checkQualSummary(promptName) {
        return this.getQualSummaryText(this.getSummaryByName(promptName)).getText();
    }

    // AQ: the locator of summary is different when there is 'The default selection is:' options
    async checkQualSummaryOfDefault(promptName) {
        return this.getQualSummaryTextOfDefault(this.getSummaryByName(promptName)).getText();
    }

    async checkDynamicSummary(promptName) {
        return this.getDynamicSummaryText(this.getSummaryByName(promptName)).getText();
    }

    async checkMultiQualSummary(promptName) {
        return this.getMutipleQualSummaryText(this.getSummaryByName(promptName)).getText();
    }

    async checkTextSummary(promptName) {
        return this.getTextSummaryText(this.getSummaryByName(promptName)).getText();
    }

    async getPromptCountInViewSummary() {
        return this.getAllPromptSummary().length;
    }

    async getSummaryText(promptName) {
        const value = await getAttributeValue(this.getListSummaryText(promptName), 'textContent');
        return value;
    }

    // URL Generator
    getPromprtEditorSelectableMode() {
        return this.$('.mstrd-PromptEditor.mstrd-PromptEditor--selectableMode');
    }

    getPromptByNameInSelectableMode(promptName) {
        return this.$$('.mstrPromptQuestionSummary').filter(async (elem) => {
            const name = await elem.$('.mstrPromptQuestionSummaryTitleBarTitle').getText();
            return name.includes(promptName);
        })[0];
    }

    getPromptSelectableContainerByName(promptName) {
        return this.getPromptByNameInSelectableMode(promptName).$('.mstrPromptQuestionSummarySelectableContainer');
    }

    getPromptSwitchDynamicByName(promptName) {
        return this.getPromptByNameInSelectableMode(promptName).$('.mstrPromptQuestionSummarySwitchDynamic');
    }

    async selectPromptByName(promptName) {
        await this.click({ elem: this.getPromptByNameInSelectableMode(promptName) });
    }

    async selectPromptItems(promptList) {
        for (let prompt of promptList) {
            await this.selectPromptByName(prompt);
        }
    }

    async switchDynamicByName(promptName) {
        await this.click({ elem: this.getPromptSwitchDynamicByName(promptName) });
    }

    async switchDynamicItems(promptList) {
        for (let prompt of promptList) {
            await this.switchDynamicByName(prompt);
        }
    }

    async findPrompt(title) {
        await this.waitForElementVisible(this.getPromptEditor());
        await this.waitForElementVisible(this.getPromptTitleByName(title)).catch(() => {
            console.log(`Prompt with title "${title}" is not found.`);
        });
        return this.$$(`.mstrPromptQuestion`).filter(
            async (item) => (await item.$('.mstrPromptQuestionTitleBarTitle').getText()) === title
        )[0];
    }

    getSelectButton() {
        return this.getPromprtEditorSelectableMode().$('.mstrPromptEditorButtonSelect');
    }

    async clickSelectButton() {
        await this.click({ elem: this.getSelectButton() });
    }

    async isEditorSelectableModeOpen() {
        return this.getPromprtEditorSelectableMode().isDisplayed();
    }

    async waitForEditorSelectableMode() {
        await this.sleep(2000);
        let isEditorVisible = await this.isEditorSelectableModeOpen();
        for (let i = 0; i < 3 && !isEditorVisible; i++) {
            await this.sleep(this.DEFAULT_LOADING_TIMEOUT);
            isEditorVisible = await this.isEditorSelectableModeOpen();
        }
        await this.waitForElementVisible(this.getPromptContainer(), { msg: 'PromptEditor was not displayed.' });
    }

    async closeIndex() {
        return this.getCloseIndexIcon().click();
    }

    async openIndex() {
        return this.getOpenIndexIcon().click();
    }

    async isRenameBoxPresent() {
        return this.getMsgNameInputOnWeb().isDisplayed();
    }
}
