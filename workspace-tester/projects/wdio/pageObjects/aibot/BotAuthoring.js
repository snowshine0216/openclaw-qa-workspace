import BasePage from '../base/BasePage.js';
import GeneralSettings from './GeneralSettings.js';
import BotAppearance from './BotAppearance.js';
import AIBotChatPanel from './AIBotChatPanel.js';
import AIBotDatasetPanel from './AIBotDatasetPanel.js';
import BotCustomInstruction from './BotCustomInstructions.js';
import WarningDialog from './WarningDialog.js';
import SaveAsEditor from '../common/SaveAsEditor.js';
import { scrollHorizontally } from '../../utils/scroll.js';
import { languageIdMap, newDIUILabels } from '../../constants/bot.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import LibraryAuthoringPage from '../library/LibraryAuthoringPage.js';

export default class BotAuthoring extends BasePage {
    constructor() {
        super();
        this.generalSettings = new GeneralSettings();
        this.botAppearance = new BotAppearance(this);
        this.aibotChatPanel = new AIBotChatPanel();
        this.aibotDatasetPanel = new AIBotDatasetPanel();
        this.confirmWarningDialog = new WarningDialog();
        this.saveAsEditor = new SaveAsEditor();
        this.custommizationPanel = new BotCustomInstruction();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.libraryAuthoringPage = new LibraryAuthoringPage();
    }

    getAIBotEditLoading() {
        return this.$('.mstr-ai-chatbot-LoadingIcon-content--visible');
    }

    // Element locator
    getAIBotToolbar() {
        return this.$('.mstrd-DossierViewNavBarContainer');
    }

    getAIBotPanel() {
        return this.$('.mstrd-AIBotPanelWrapper-main');
    }

    getBotAuthoringContainer() {
        return this.$('.mstr-ai-chatbot-EditingLayout');
    }

    getBotConfigContainer() {
        return this.$('.mstr-ai-chatbot-ConfigTabs-root');
    }

    getConfigTabsHeaderContainer() {
        return this.$('.mstr-ai-chatbot-ConfigTabs-list');
    }

    getMessageBoxContainer() {
        return this.$('.mstrd-MessageBox-main.mstrd-MessageBox-main--modal');
    }

    getActionButtonsInMessageBox() {
        return this.getMessageBoxContainer().$$('.mstrd-ActionLinkContainer');
    }

    getOkButtonInMessageBox() {
        return this.getActionButtonsInMessageBox()[0];
    }

    getSendEmailButtonInMessageBox() {
        return this.getActionButtonsInMessageBox()[1];
    }

    // name = general / appearance / custom instruction / dataset / prompt / rules
    getConfigTabByName(name) {
        const locator = name.replace(/\s/g, '-').toLowerCase();
        const elems = this.getConfigTabsHeaderContainer()
            .$$('.mstr-ai-chatbot-ConfigTabs-trigger')
            .filter(async (elem) => {
                const text = await elem.getAttribute('id');
                return text.includes(locator);
            });
        return elems[0];
    }

    getConfigTabByIndex(index) {
        return this.getConfigTabsHeaderContainer().$$('.mstr-ai-chatbot-ConfigTabs-trigger')[index];
    }

    getConfigTabContainerByName(name) {
        const locator = name.replace(/\s/g, '-').toLowerCase();
        const elems = this.$$('.mstr-ai-chatbot-ConfigTabs-content').filter(async (elem) => {
            const text = await elem.getAttribute('id');
            return text.includes(locator);
        });
        return elems[0];
    }

    getConfigTabContainerByIndex(index) {
        return this.$$('.mstr-ai-chatbot-ConfigTabs-content')[index];
    }

    getSaveButton() {
        return this.$('.SaveNavItem div.mstr-nav-icon');
    }

    getArrowDownOnSave() {
        return this.$('.mstrd-SaveNavItemContainer .mstrd-ContextMenu-trigger');
    }

    getSaveBotDropDown() {
        return this.$('.mstrd-NavIconContextMenu-menu');
    }

    getSaveMenuOptions() {
        return this.getSaveBotDropDown().$$('.mstrd-ContextMenu-item');
    }

    getSaveMenuOptionByName(name) {
        return this.getSaveMenuOptions().filter(async (elem) => {
            const text = await elem.getText();
            return text === name;
        })[0];
    }

    getSavingModalView() {
        return this.$('.saving-in-progress.modal');
    }

    getSaveSuccessMessageBox() {
        return this.$('.ant-message-notice');
    }

    getCloseButtonOnSaveSuccessMessageBox() {
        return this.getSaveSuccessMessageBox().$('.mstrd-Message-closeButton');
    }

    getEditorCurtainMask() {
        return this.$('#waitBox .mstrmojo-Editor-curtain');
    }

    getSaveAsEditor() {
        return this.$('.mstrmojo-SaveAsEditor');
    }

    getSaveButtonOnSaveAsEditor() {
        return this.getSaveAsEditor().$('.okButton');
    }

    getCloseButton() {
        return this.$('.icon-pnl_close');
    }

    getConfirmSaveDialog() {
        return this.$('.mstrmojo-Editor.mstrmojo-ConfirmSave-Editor');
    }

    getSaveButtonInConfirmSaveDialog() {
        return this.getConfirmSaveDialog().$(`//div[@role='button' and @aria-label='Save']`);
    }

    getCancelButtonInConfirmSaveDialog() {
        return this.getConfirmSaveDialog().$(`//div[@role='button' and @aria-label='Cancel']`);
    }

    getNoSaveButtonInConfirmSaveDialog() {
        return this.getConfirmSaveDialog().$('.mstrmojo-Button.mstrmojo-WebButton.nosave');
    }

    getNameInputBoxOnSaveAsEditor() {
        return this.getSaveAsEditor().$('input.mstrmojo-SaveAsEditor-nameInput');
    }

    getConfirmOverrideDialog() {
        return this.$('.mstrmojo-Editor.mstrmojo-alert.modal');
    }

    getConfirmOverrideButton() {
        return this.getConfirmOverrideDialog().$$('.mstrmojo-Button-text')[0];
    }

    getAlert() {
        return this.$('.mstrmojo-Box.alert-content');
    }

    getAlertContent() {
        return this.getAlert().$('.mstrmojo-Label').getComputedLabel();
    }

    getConfirmButtonInNoPermissionAlert() {
        return this.getConfirmOverrideButton();
    }

    getInActiveBanner() {
        return this.$('.mstrd-PageNotification-msg--inactive');
    }

    getTooltip() {
        return this.$('.mstr-ai-chatbot-Tooltip');
    }

    getSaveAndCertifyButton() {
        return this.getButtonByDataMenuIdInButtonMenu('save_certify');
    }

    getCertifyIcon() {
        return this.$('.mstrd-CertifiedIcon.mstrd-CertifiedIcon--expanded');
    }

    getSaveDialog() {
        return this.$('.mstrmojo-SaveAsEditor');
    }

    getSaveInFolderSelectionDropdown() {
        return this.getSaveDialog().$('.mstrmojo-DropDownButton-boxNode');
    }

    getSaveInFolderDropdownOption(folderName) {
        return this.$$('.mstrmojo-TreeNode-div').filter(async (elem) => {
            const elemText = await elem.$('.mstrmojo-TreeNode-text ').getText();
            return elemText === folderName;
        })[0];
    }

    getEditorBtnsWithSaveBtn() {
        return this.$('.mstrmojo-Editor-buttons');
    }

    getSuccessToast() {
        return this.$('.mstrmojo-Label.mstrWaitMsg');
    }

    getCertifyTooltip() {
        return this.$('.ant-tooltip-inner');
    }

    getSaveAsButton() {
        return this.getButtonByDataMenuIdInButtonMenu('save_as');
    }

    getCacheManagerIcon() {
        return this.$('div[data-feature-id="navbar-authoring-bot-cache-edit"]');
    }

    getCacheManagerPage() {
        return this.$('.mstr-ai-chatbot-EditingLayout-agentCache');
    }

    async getCertifyInfo() {
        const isCertifyTooltipVisible = await this.getCertifyTooltip().isDisplayed();
        if (!isCertifyTooltipVisible) {
            await this.hoverCertifyIcon();
        }
        return this.$('.ant-tooltip-inner div').getText();
    }

    getDecertifyButton() {
        return this.$('.mstrd-CertifiedIcon-decertify');
    }

    getConfirmWarningDialog() {
        return this.$('.mstrmojo-Editor.mstrmojo-ConfirmSave-Editor.modal');
    }

    getButtonByDataMenuIdInButtonMenu(dataMenuIdStr) {
        return this.getSaveMenuOptions().filter(async (elem) => {
            const dataMenuId = await elem.getAttribute('data-menu-id');
            return dataMenuId.includes(dataMenuIdStr);
        })[0];
    }

    getEditingIconInAuthoringBotToolbar() {
        return this.$('.icon-info_edit');
    }

    // Action helper

    async waitForPageLoading() {
        await this.sleep(1000);

        await browser.waitUntil(
            async () => {
                let pageLoadingIcon = await this.getPageLoading().isDisplayed();
                const aiBotEditLoadingIcon = await this.getAIBotEditLoading().isDisplayed();
                return !pageLoadingIcon && !aiBotEditLoadingIcon;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Loading bot authoring panel takes too long.',
            }
        );
        return this.sleep(1000);
    }

    async clickSaveButton() {
        await this.waitForElementClickable(this.getSaveButton());
        await this.getSaveButton().click();
    }

    async clickSaveAsButton() {
        await this.waitForElementClickable(this.getSaveAsButton());
        await this.getSaveAsButton().click();
    }

    async clickArrowDownOnSave() {
        await this.waitForElementClickable(this.getArrowDownOnSave());
        await this.sleep(500);
        await this.getArrowDownOnSave().click();
    }

    async waitForSaveAsButtonClickable() {
        await this.sleep(200);
        await browser.waitUntil(
            async () => {
                return !(await this.isDisabled(this.getArrowDownOnSave()));
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: `Save as button is not enabled after ${this.DEFAULT_LOADING_TIMEOUT / 1000}s`,
            }
        );
        await this.sleep(100);
    }

    async openButtonMenu() {
        const isButtonMenuExpanded = await this.getSaveBotDropDown().isDisplayed();
        if (!isButtonMenuExpanded) {
            await this.clickArrowDownOnSave();
            await this.waitForElementVisible(this.getSaveBotDropDown());
        }
    }

    async selectBotConfigTabByName(name) {
        await this.waitForElementVisible(this.getConfigTabsHeaderContainer());
        await this.getConfigTabByName(name).click();
        await this.waitForElementVisible(this.getConfigTabContainerByName(name));
    }

    async selectBotConfigTabByIndex(index) {
        await this.waitForElementVisible(this.getConfigTabsHeaderContainer());
        await this.getConfigTabByIndex(index).click();
        await this.waitForElementVisible(this.getConfigTabContainerByIndex(index));
    }

    getBotConfigDatasetDescription() {
        return this.$('.mstr-ai-chatbot-Datasets-description');
    }

    getBotConfigDatasetDescriptionInputText() {
        return this.getBotConfigDatasetDescription().$('textarea.mstr-ai-chatbot-Datasets-description');
    }

    async clickBotConfigDatasetDescription() {
        return this.click({ elem: this.getBotConfigDatasetDescription() });
    }

    async saveBot({ skipClosingToast = true, expectSuccess = true }) {
        await this.sleep(500); // wait for annimation to avoid flaky cases save button is clicked but toast is not shown
        await this.click({ elem: this.getSaveButton() });
        await this.waitForElementInvisible(this.getSavingModalView());
        if (!expectSuccess) return;
        // await this.waitForElementVisible(this.getSaveSuccessMessageBox());
        if (!skipClosingToast) {
            await this.click({ elem: this.getCloseButtonOnSaveSuccessMessageBox() });
        }
        // await this.waitForElementStaleness(this.getSaveSuccessMessageBox());
        await this.waitForElementInvisible(this.getEditorCurtainMask());
        await this.waitForElementStaleness(this.getPageLoading());
    }

    async saveExistingBotV2() {
        await this.sleep(500); // wait for annimation to avoid flaky cases save button is clicked but toast is not shown
        await this.click({ elem: this.getSaveButton() });
        // wait until Save as arrow icon is enabled.
        await this.waitForSaveAsButtonClickable();
        return this.sleep(500); // wait for the save to complete
    }

    async saveBotWithName(name, path) {
        await this.sleep(500); // wait for annimation to avoid flaky cases save button is clicked but toast is not shown
        await this.waitForCurtainDisappear();
        await this.aibotChatPanel.waitForRecommendationSkeletonDisappear();
        if (await this.aibotChatPanel.isRecommendationPanelPresent()) {
            await this.aibotChatPanel.waitForRecommendationLoading();
        }
        await this.waitForElementPresence(this.getSaveButton());
        await this.click({ elem: this.getSaveButton() });
        if (path) {
            await this.libraryAuthoringPage.saveToFolder(name, path);
        } else {
            await this.saveAsEditor.changeInputBotNameInSaveAsDialog(name);
            await this.saveBotBySaveDialog();
        }
        await this.waitForElementStaleness(this.dossierAuthoringPage.getSaveInProgressBox());
        await this.waitForElementStaleness(this.dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
    }

    async saveBotWithConfirm() {
        await this.click({ elem: this.getSaveButton() });
        await this.waitForElementInvisible(this.getSavingModalView());
        await this.waitForElementInvisible(this.getEditorCurtainMask());
        await this.waitForElementStaleness(this.getPageLoading());
    }

    async saveAsBot({ name, path }) {
        await this.openButtonMenu();
        await this.getSaveMenuOptions()[0].click();
        await this.waitForElementVisible(this.getSaveDialog());
        if (name) {
            await this.saveAsEditor.changeInputBotNameInSaveAsDialog(name);
        }
        await this.saveBotBySaveDialog();
    }

    async saveAsBotInMyReports(name) {
        await this.openButtonMenu();
        await this.getSaveMenuOptions()[0].click();
        await this.waitForElementVisible(this.getSaveDialog());
        if (name) {
            await this.saveAsEditor.changeInputBotNameInSaveAsDialog(name);
        }
        await this.getSaveInFolderSelectionDropdown().click();
        await this.getSaveInFolderDropdownOption('My Reports').click();
        await this.saveBotBySaveDialog();
    }

    async saveBotBySaveDialog(expSuccess = true) {
        await this.waitForElementClickable(this.saveAsEditor.getSaveButtonOnSaveAsEditor());
        await this.saveAsEditor.clickSaveButtonInSaveAsDialog();
        await this.waitForElementInvisible(this.getSavingModalView());
        const isConfirmOverrideDialogVisible = await this.getConfirmOverrideDialog().isDisplayed();
        if (isConfirmOverrideDialogVisible) {
            await this.click({ elem: this.getConfirmOverrideButton() });
        }
        if (expSuccess) {
            await this.waitForElementInvisible(this.getSavingModalView());
            await this.waitForElementStaleness(this.getPageLoading());
        }
    }

    async saveAsBotOverwrite() {
        await this.waitForElementClickable(this.getArrowDownOnSave());
        await this.getArrowDownOnSave().click();
        await this.waitForElementVisible(this.getSaveBotDropDown());
        await this.waitForElementClickable(this.getSaveBotDropDown());
        await this.getSaveMenuOptions()[0].click();
        await this.waitForElementVisible(this.getSaveDialog());
        await this.waitForElementStaleness(this.saveAsEditor.getFolderLoadIndicatorOnSaveAsEditor());
        await this.waitForElementClickable(this.saveAsEditor.getSaveButtonOnSaveAsEditor());
        await this.saveAsEditor.clickSaveButtonInSaveAsDialog();
        await this.waitForElementInvisible(this.getSavingModalView());
        await this.waitForElementVisible(this.getConfirmOverrideDialog());
        await this.click({ elem: this.getConfirmOverrideButton() });
        await this.waitForElementInvisible(this.getSavingModalView());
        await this.waitForElementStaleness(this.getPageLoading());
    }

    async exitBotAuthoring() {
        await this.getCloseButton().click();
        const isConfirmSaveDialogVisible = await this.getConfirmSaveDialog().isDisplayed();
        if (isConfirmSaveDialogVisible) {
            await this.waitForElementVisible(this.getSaveButtonInConfirmSaveDialog());
            await this.click({ elem: this.getSaveButtonInConfirmSaveDialog() });
            await this.waitForElementInvisible(this.getSavingModalView());
            await this.waitForElementInvisible(this.getEditorCurtainMask());
            await this.waitForElementStaleness(this.getPageLoading());
        }
        await this.waitForElementStaleness(this.getPageLoading());
    }

    async exitBotAuthoringWithoutSave() {
        await this.getCloseButton().click();
        const isConfirmSaveDialogVisible = await this.getConfirmSaveDialog().isDisplayed();
        if (isConfirmSaveDialogVisible) {
            await this.waitForElementVisible(this.getSaveButtonInConfirmSaveDialog());
            await this.click({ elem: this.getNoSaveButtonInConfirmSaveDialog() });
            await this.waitForElementInvisible(this.getConfirmSaveDialog());
        }
        await this.waitForLibraryLoading();
    }

    async getBotIdFromUrl() {
        const url = await this.currentURL();
        const botId = url.replace('/edit', '').split('/').pop();
        return botId;
    }

    async getDossierIdFromUrl() {
        const url = await this.currentURL();
        const parts = url.split('/');
        const dossierId = parts[parts.indexOf('app') + 2];
        return dossierId;
    }

    async getProjectIdFromUrl() {
        const url = await this.currentURL();
        const parts = url.split('/');
        const projectId = parts[parts.indexOf('app') + 1];
        return projectId;
    }

    async scrollBotPanelHorizontally(toPosition) {
        return scrollHorizontally(this.getAIBotPanel(), toPosition);
    }

    async clickCloseButton() {
        await this.waitForElementClickable(this.getCloseButton());
        await this.getCloseButton().click();
    }

    async saveAndCertifyBot() {
        await this.openButtonMenu();
        await this.getSaveMenuOptionByName('Save and Certify').click();
        await this.waitForElementInvisible(this.getSavingModalView());
        await this.waitForElementStaleness(this.getPageLoading());
        await this.waitForElementVisible(this.getCertifyIcon());
    }

    async decertifyBotInTooltip() {
        const isCertifyTooltipVisible = await this.getCertifyTooltip().isDisplayed();
        if (!isCertifyTooltipVisible) {
            await this.hover({ elem: this.getCertifyIcon() });
            await this.waitForElementClickable(this.getDecertifyButton());
        }
        await this.getDecertifyButton().click();
        await this.waitForElementStaleness(this.getCertifyIcon());
    }

    async clickConfirmButtonInNoPermissionAlert() {
        await this.waitForElementVisible(this.getConfirmButtonInNoPermissionAlert());
        await this.click({ elem: this.getConfirmButtonInNoPermissionAlert() });
        await this.waitForElementInvisible(this.getConfirmButtonInNoPermissionAlert());
    }

    async createBotBySampleData(languageID, isSaaS = false) {
        const newDILabel = this.getNewDataSetTexts(languageID);
        await this.aibotDatasetPanel.chooseDataType(newDILabel.sampleFileDataSource);
        await this.aibotDatasetPanel.waitForFileSamplePageLoading(newDILabel.dataSourceTitle);
        await this.aibotDatasetPanel.chooseFileInNewDI(
            isSaaS ? newDILabel.airlineSampleDataOnSaaS : newDILabel.airlineSampleData,
            newDILabel.dataSourceTitle
        );
        await this.aibotDatasetPanel.clickMojoPageButton(newDILabel.import);
        await this.aibotDatasetPanel.waitForNewDIPageLoading();
        await this.aibotDatasetPanel.clickMojoPageButton(newDILabel.create);
        await this.aibotDatasetPanel.waitForNewDIClose();
        const datasetName = isSaaS
            ? newDIUILabels.English.airlineSampleDataFileNameOnSaaS
            : newDIUILabels.English.airlineSampleDataFileName;
        await this.waitForTextAppearInElement(this.aibotDatasetPanel.getDatasetNameContainer(), datasetName);
    }

    async addSampleData(languageID, sampleFileName = 'Airline Sample Data') {
        const newDILabel = this.getNewDataSetTexts(languageID);
        await this.aibotDatasetPanel.chooseDataType(newDILabel.sampleFileDataSource);
        await this.aibotDatasetPanel.waitForFileSamplePageLoading(newDILabel.dataSourceTitle);
        await this.aibotDatasetPanel.chooseFileInNewDI(sampleFileName);
        await this.aibotDatasetPanel.clickMojoPageButton(newDILabel.import);
        await this.aibotDatasetPanel.waitForNewDIPageLoading();
        await this.aibotDatasetPanel.clickMojoPageButton(newDILabel.create);
        await this.aibotDatasetPanel.waitForNewDIClose();
        // const datasetName = isSaaS
        //     ? newDIUILabels.English.airlineSampleDataFileNameOnSaaS
        //     : newDIUILabels.English.airlineSampleDataFileName;
        // await this.waitForTextAppearInElement(this.aibotDatasetPanel.getDatasetNameContainer(), datasetName);
    }

    getNewDataSetTexts(languageID) {
        if (languageID === languageIdMap.ChineseSimplified) {
            return newDIUILabels.Chinese;
        } else if (
            languageID === languageIdMap.EnglishUnitedStates ||
            languageID === languageIdMap.EnglishUnitedKindom
        ) {
            return newDIUILabels.English;
        } else {
            throw new Error(`Language ID ${languageID} is not supported to find valid UI Labels.`);
        }
    }

    async waitForMessageBoxDisplay() {
        await this.waitForElementVisible(this.getMessageBoxContainer());
    }

    async dismissErrorMessageBoxByClickOkButton() {
        await this.click({ elem: this.getOkButtonInMessageBox() });
    }

    async hoverCertifyIcon() {
        await this.hover({ elem: this.getCertifyIcon() });
        await this.waitForElementVisible(this.getCertifyTooltip());
    }

    // Assertion helper

    async isConfigTabSelected(name) {
        const selection = await this.getConfigTabByName(name).isDisplayed();
        const content = await this.getConfigTabContainerByName(name).isDisplayed();
        return selection && content;
    }

    async isInActiveBannerDisplayed() {
        return await this.getInActiveBanner().isDisplayed();
    }

    async isAIDisabledBannerDisplayed() {
        return (
            (await this.getInActiveBanner().isDisplayed()) &&
            (await this.getInActiveBanner().getText()).includes('Dataset is disabled for AI')
        );
    }

    async getInactiveBannerText() {
        return await this.getInActiveBanner().getText();
    }

    async isSaveAndCertifyButtonPresent() {
        const isSaveDropDownVisible = await this.getSaveBotDropDown().isDisplayed();
        if (!isSaveDropDownVisible) {
            await this.clickArrowDownOnSave();
            await this.waitForElementVisible(this.getSaveBotDropDown());
        }
        return await this.getSaveAndCertifyButton().isDisplayed();
    }

    async isSaveAsButtonPresent() {
        const isSaveDropDownVisible = await this.getSaveBotDropDown().isDisplayed();
        if (!isSaveDropDownVisible) {
            await this.clickArrowDownOnSave();
            await this.waitForElementVisible(this.getSaveBotDropDown());
        }
        return await this.getSaveAsButton().isDisplayed();
    }

    async isBotCertified() {
        return await this.getCertifyIcon().isDisplayed();
    }

    async isSaveDialogPresent() {
        return await this.getSaveDialog().isDisplayed();
    }

    async isConfirmWarningDialogPresent() {
        return await this.getConfirmWarningDialog().isDisplayed();
    }

    async isDecertifyButtonPresent() {
        return await this.getDecertifyButton().isDisplayed();
    }

    async isAiBotToolbarPresent() {
        return await this.getAIBotToolbar().isDisplayed();
    }

    async isSaveButtonEnabled() {
        return !(await this.isDisabled(this.getSaveButton()));
    }

    async dismissTooltip() {
        await this.click({ elem: this.aibotChatPanel.getTitleBarBotName() });
        await this.waitForElementInvisible(this.getTooltip());
    }

    async openCacheManager() {
        await this.click({ elem: this.getCacheManagerIcon() });
        await this.waitForElementVisible(this.getCacheManagerPage());
        await this.waitForPageLoading();
        return this.sleep(1000);
    }
}
