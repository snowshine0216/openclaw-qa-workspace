import AIBotChatPanel from '../aibot/AIBotChatPanel.js';
import AIBotDatasetPanel from '../aibot/AIBotDatasetPanel.js';
import BasePage from '../base/BasePage.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import LibraryAuthoringPage from '../library/LibraryAuthoringPage.js';
import LibraryPage from '../library/LibraryPage.js';
import MetricDialog from '../web_home/MetricDialog.js';

export default class ADC extends BasePage {
    constructor() {
        super();
        this.libraryPage = new LibraryPage();
        this.metricDialog = new MetricDialog();
        this.libraryAuthoringPage = new LibraryAuthoringPage();
        this.aiBotChatPanel = new AIBotChatPanel();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.aiBotDatasetPanel = new AIBotDatasetPanel();
        this.loadingDialog = new LoadingDialog();
    }

    // Locator
    getADCToolbar() {
        return this.$('.mstrmojo-RootView-menutoolbar.aibotAdvancedMode');
    }

    getToolbarBtnByName(name) {
        return this.getADCToolbar()
            .$$('.item.btn')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === name;
            })[0];
    }

    getNewDatasetSelectorDiag() {
        return this.$('.mstrmojo-vi-ui-editors-NewDatasetSelectorContainer');
    }

    getDatasetTitleBar() {
        return this.$('.mstrmojo-RootView-datasets .mstrmojo-VIPanel-content-wrapper .mstrmojo-VITitleBar');
    }

    getCancelBtnInNewDatasetSelectorDiag() {
        return this.getNewDatasetSelectorDiag().$('.cancel-btn');
    }

    // can use for both "Add" and "Replace"
    getCreateBtnInNewDatasetSelectorDiag() {
        return this.getNewDatasetSelectorDiag().$('.mstr-rc-button--primary');
    }

    getSavebtnInSaveChangeConfirmDialog() {
        return this.$('.mstrd-AIBotAdvancedModeWarnDialog-save-button');
    }

    getDuplicatebtnInSaveChangeConfirmDialog() {
        return this.$('.mstrd-AIBotAdvancedModeWarnDialog-dont-save-button');
    }

    getCancelBtn() {
        return this.$('.item.btn.cancel .btn');
    }

    getSaveInProgressBox() {
        return this.$('.mstrmojo-Editor.mstrWaitBox.saving-in-progress');
    }

    getEmptyContent() {
        return this.$('.mstrd-EmptyContent');
    }

    get saveBtn() {
        return this.$('.item.btn.save');
    }

    get saveAsDropdown() {
        return this.$('.item.saveMore');
    }

    get saveAsDropdownFromBot() {
        return this.$('.item.saveMoreForADCFromBot');
    }
    get saveAsBtn() {
        return this.$('.item.saveAs');
    }

    get duplicateBtn() {
        return this.$('.item.duplicate');
    }

    getWarningIconsCount() {
        return this.$$('.mstrmojo-RootView-datasets .metricAskWarn').length;
    }

    // Action

    // save adc will go to bot create page directly
    async save(name = '') {
        await this.waitForCurtainDisappear();
        await this.dossierAuthoringPage.saveNewADC(name);
        await this.click({ elem: this.getCancelBtn() });
        return this.sleep(1000);
    }

    async saveToPath(name, path, parentFolder = 'Shared Reports') {
        await this.waitForCurtainDisappear();
        await this.clickSaveBtn();
        await this.libraryAuthoringPage.saveToFolder(name, path, parentFolder);
        await this.waitForElementStaleness(this.dossierAuthoringPage.getSaveInProgressBox());
        await this.waitForElementStaleness(this.dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
    }

    async apply() {
        await this.dossierAuthoringPage.actionOnToolbar('Apply');
    }

    async cancel() {
        await this.click({ elem: this.getCancelBtn() });
    }

    async saveChanges({ saveConfirm = true, jumpToBotAuthoring = true } = {}) {
        await this.click({ elem: this.dossierAuthoringPage.getDirectSaveDossierButton() });
        if (saveConfirm) {
            await this.click({ elem: this.getSavebtnInSaveChangeConfirmDialog() });
        }
        await this.waitForElementStaleness(this.dossierAuthoringPage.getSaveInProgressBox());
        await this.waitForElementStaleness(this.dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
        if (jumpToBotAuthoring) {
            await this.sleep(1000); // switch to bot authoring page
            await this.aiBotDatasetPanel.waitForCoverSpinnerDismiss();
            await this.waitForElementPresence(this.aiBotChatPanel.getMainView());
            await this.aiBotChatPanel.waitForRecommendationSkeletonDisappear();
            await this.sleep(5000); // wait for the page to be fully loaded
        }
    }

    async clickSaveBtn() {
        await this.click({ elem: this.saveBtn });
    }

    async clickSaveAsBtn() {
        await this.click({ elem: this.saveAsDropdownFromBot });
        const btn = await this.saveAsBtn;
        await this.waitForElementVisible(btn);
        await this.click({ elem: btn });
    }

    async clickSaveAsDropdown() {
        await this.click({ elem: this.saveAsDropdown });
    }

    async clickSaveAsDropdownFromBot() {
        await this.click({ elem: this.saveAsDropdownFromBot });
    }

    async clickDuplicateBtn() {
        await this.click({ elem: this.saveAsDropdownFromBot });
        const btn = await this.duplicateBtn;
        await this.waitForElementVisible(btn);
        await this.click({ elem: btn });
    }

    async saveAsADC(adcName) {
        await this.clickSaveAsBtn();
        await this.libraryAuthoringPage.getSaveAsNameInput().clearValue();
        await this.libraryAuthoringPage.getSaveAsNameInput().click();
        await this.libraryAuthoringPage.getSaveAsNameInput().setValue(adcName);
        await this.libraryAuthoringPage.getSaveAsEditoSaveButton().click();

        const confirmationYesButton = await this.libraryAuthoringPage.getSaveOverWriteConfirmationYesButton();
        const confirmationYesButtonIsDisplayed = await confirmationYesButton.isDisplayed();
        if (confirmationYesButtonIsDisplayed) {
            await this.libraryAuthoringPage.getSaveOverWriteConfirmationYesButton().click();
        }
        await this.libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(60);
    }

    async duplicateAndApply(name, path, parentFolder = 'Shared Reports') {
        await this.clickSaveBtn();
        await this.click({ elem: this.getDuplicatebtnInSaveChangeConfirmDialog() });
        await this.libraryAuthoringPage.saveToFolder(name, path, parentFolder);
        await this.waitForElementStaleness(this.dossierAuthoringPage.getSaveInProgressBox());
        await this.waitForElementStaleness(this.dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
    }

    async selectDatasetAddReplace(dataset) {
        await this.libraryAuthoringPage.searchForDataByName(dataset);
        const checkbox = await this.libraryAuthoringPage.getCheckboxOfBotDataset(dataset);
        if (checkbox && (await checkbox.isDisplayed())) {
            await this.click({ elem: checkbox });
        } else {
            const row = await this.libraryAuthoringPage.getRowOfBotDataset(dataset);
            await this.click({ elem: row });
        }
        await this.click({ elem: await this.getCreateBtnInNewDatasetSelectorDiag() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
    }

    // Assertion
    async isADCToolbarPresent() {
        return this.getADCToolbar().isDisplayed();
    }

    async isEmptyContentPresent() {
        return this.getEmptyContent().isDisplayed();
    }

    async isDatasetTitleBarDisabled(name) {
        return (await this.getDatasetTitleBar().getAttribute('class')).includes('disabled');
    }

    async isDuplicateAndApplyBtnDisplayed() {
        return this.duplicateBtn.isDisplayed();
    }
}
