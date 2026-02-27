import BaseAuthoring from '../base/BaseAuthoring.js';
import LibraryPage from './LibraryPage.js';
import AIBotChatPanel from '../aibot/AIBotChatPanel.js';
import HamburgerMenu from '../common/HamburgerMenu.js';
import DossierPage from '../dossier/DossierPage.js';
import CopyMoveWindow from './CopyMoveWindow.js';

export default class LibraryAuthoringPage extends BaseAuthoring {
    constructor() {
        super();
        this.hamburgerMenu = new HamburgerMenu();
        this.libraryPage = new LibraryPage();
        this.aibotChatPanel = new AIBotChatPanel();
        this.dossierPage = new DossierPage();
        this.copyMoveWindow = new CopyMoveWindow();
    }

    // Element locator
    getLibraryLoading() {
        return this.$('.mstrd-LoadingIcon-content');
    }

    getloadingDataPopUpNotDisplayed() {
        // return element(by.xpath(`//div[contains(@class, 'mstrWaitBox')][contains(@style, 'display: none')]`));
        return this.$("//div[contains(@class, 'mstrWaitBox')][contains(@style, 'display: none')]");
    }

    // Library Authoring
    getNewDossierIcon() {
        return this.$('.mstrd-CreateDossierNavItemContainer-icon');
    }

    getProjectSelectionWindow() {
        return this.$('.ant-modal-wrap');
    }

    getSearchInputBox() {
        return this.getProjectSelectionWindow().$(`input[class*='mstrd-ProjectSearchBox-search-box']`);
    }

    getNewDossierButton() {
        // return element(by.xpath(`//li[contains(@class,'mstrd-MenuItem mstrd-CreateDossierDropdownMenuContainer-create-dossier')]`));
        return this.$("//li[@class='mstrd-MenuItem mstrd-CreateDossierDropdownMenuContainer-create-dossier']");
    }

    getNewBotButton() {
        return this.$(
            "//li[contains(@class,'mstrd-MenuItem mstrd-CreateDossierDropdownMenuContainer-create-dossier create-bot')]"
        );
    }

    getNewReportButton() {
        return this.$$('.mstrd-CreateDossierDropdownMenuContainer-text-wrapper').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === 'Report';
        })[0];
    }

    getNewDocumentButton() {
        return this.$('.mstrd-CreateDossierDropdownMenuContainer-create-document');
    }

    getCreateNewMenuItems() {
        return this.$$('.mstrd-DropdownMenu-main .mstrd-MenuItem');
    }

    getDropdownMenu() {
        return this.$('.mstrd-DropdownMenu-main');
    }

    getNewDossierProjectSelection(projectName) {
        // return this.getProjectSelectionWindow().element(by.xpath(`//label[text()= '${projectName}']/parent::span`));
        return this.getProjectSelectionWindow().$(`//label[text()= '${projectName}']/parent::span`);
    }

    getProjectItem(projectName) {
        return this.getProjectSelectionWindow()
            .$$('.mstrd-RadioButton')
            .filter(async (elem) => {
                const elemText = await elem.$('.mstrd-RadioButton-label').getText();
                return elemText === projectName;
            })[0];
    }

    getProjectRadioButton(projectName) {
        return this.getProjectItem(projectName).$('.mstrd-RadioButton-radioShape');
    }

    getProjectSelector() {
        return this.getProjectSelectionWindow().$('.projectPicker').$('.mstr-select-container__enabled');
    }

    getNewDossierProjectSelectionDropdownList() {
        return this.$('.mstr-select-container__menu');
    }

    getNewDossierProjectSelectionDropdownOption(projectName) {
        return this.getNewDossierProjectSelectionDropdownList().$(
            `//div[@class='truncated-label'][text()='${projectName}']`
        );
    }

    getNewDossierWindowCertifiedSwitch() {
        return this.getProjectSelectionWindow().$('.object-selector-header-certified-control .mstr-rc-switch');
    }

    getNewDossierWindowSearch() {
        return this.getProjectSelectionWindow().$('.object-selector-header-search-input');
    }

    getNewDossierWindowSearchClearAllButton() {
        return this.getNewDossierWindowSearch().$('.mstr-filter-search-input-btn');
    }

    getNewDossierWindowSearchInput() {
        return this.getNewDossierWindowSearch().$('.ant-input');
    }

    getNewDossierWindowSearchInputWithKeyword(keywoard) {
        return this.getNewDossierWindowSearch().$(`.ant-input[value='${keywoard}'`);
    }

    getNewDossierWindowNoDataScreen() {
        return this.getProjectSelectionWindow().$('//span[contains(text(), "No Data")]');
    }

    getNewDossierWindowSmartModeIcon() {
        return this.getProjectSelectionWindow().$('.smart-mode-icon');
    }

    getNewDossierWindowBrowsingModeIcon() {
        return this.getProjectSelectionWindow().$('.browsing-mode-icon');
    }

    getSmartModeSideMenu() {
        return this.getProjectSelectionWindow().$(`//div[contains(@class, 'smart-explorer')]/parent::div`);
    }

    getBrowsingModeSideMenu() {
        return this.getProjectSelectionWindow().$(`//div[contains(@class, 'browsing-explorer')]/parent::div`);
    }

    getDatasetListLoadingSpinner() {
        return this.getProjectSelectionWindow().$('.mstr-rc-loading-dot-icon');
    }

    getDatasetList() {
        return this.getProjectSelectionWindow().$('.ag-center-cols-viewport');
    }

    getDataseListContainer() {
        return this.getProjectSelectionWindow().$('.ag-body-viewport.ag-layout-normal.ag-row-no-animation');
    }

    getDataSetByName(datasetName) {
        return this.getDatasetList().$(
            `//span[contains(@class, 'ws-object-name-text')][contains(., '${datasetName}')]`
        );
    }

    getConfirmationDialog() {
        return this.$('.mstr-react-dossier-creator-confirmation-dialog');
    }

    async getConfirmationDialogMessage() {
        return this.getConfirmationDialog().$('.confirmation-dialog-summary').getText();
    }

    getConfirmationDialogOkButton() {
        return this.getConfirmationDialog().$('button*=OK');
    }

    getConfirmationDialogCancelButton() {
        return this.getConfirmationDialog().$('button*=Cancel');
    }

    getObjectPathPreview() {
        return this.getProjectSelectionWindow().$('.object-path-preview');
    }

    getSelectedDataCount() {
        return this.getProjectSelectionWindow().$(`//div[@class='template-info-selection-count'][text()='0 selected']`);
    }

    getSelectedDataCountText() {
        return this.getProjectSelectionWindow().$(`//div[@class='template-info-selection-count']`).getText();
    }

    async getObjectNameInPathPreview() {
        return this.getObjectPathPreview().$('.object-path-segment__object-name').getText();
    }

    getChangeProject() {
        return this.$('.ant-select-selection-item');
    }

    getProjectSelectionPreloader() {
        return this.$('.mstr-react-dossier-creator-preloader');
    }

    getProject(projectName) {
        return this.$$('.ant-select-item-option-content').filter(async (elem) => {
            const elemText = await elem.$('.truncated-label').getText();
            return elemText.includes(projectName);
        })[0];
    }

    getSelectTemplateTab() {
        // return this.getProjectSelectionWindow().element(by.cssContainingText('.tab-view-tab', 'Select Template'));
        return this.getProjectSelectionWindow().$('.tab-view-tab*=Select Template');
    }

    getCreateButton() {
        // return this.getProjectSelectionWindow().element(by.cssContainingText('button', 'Create'));\
        return this.getProjectSelectionWindow().$('button=Create');
    }

    getAddButtonFromADC() {
        return this.getNewDatasetSelectorDiag().$('button=Add');
    }

    getAddButtonInAddDataDialog() {
        return this.getProjectSelectionWindow().$('button=Add');
    }

    getContinueButton() {
        return this.getProjectSelectionWindow().$('button=Continue');
    }

    getPreviewButton() {
        return this.getProjectSelectionWindow().$('button=Preview');
    }

    getBlankDashboardButton() {
        return this.getProjectSelectionWindow().$('button=Blank Dashboard');
    }

    getBotCreateWithNewDataButton(text = 'Create with New Data') {
        return this.getProjectSelectionWindow().$(`button*=${text}`);
    }

    getDataImportDialog() {
        return this.$('.mstrmojo-di-popup');
    }

    getDataImportDialogCloseButton() {
        return this.getDataImportDialog().$('.mstrmojo-di-close');
    }

    getDataImportDialogSourceGroup(group) {
        return this.getDataImportDialog().$(`//span[@class='group-row-name'][text()='${group}']`);
    }

    getDataImportDialogDataSource(dataSource) {
        return this.getDataImportDialog().$(`//span[text()='${dataSource}']`);
    }

    getDataImportDialogPrepareDataButton() {
        return this.getDataImportDialog().$(`//div[@aria-label='Prepare Data']`);
    }

    getDataImportDialogCancelButton() {
        return this.getDataImportDialog().$(`//div[@aria-label='Cancel']`);
    }

    getDataImportDialogCreateButton() {
        return this.getDataImportDialog().$(`//div[@aria-label='Finish']`).$(`//div[text()='Create']`);
    }

    getDataImportDialogImportButton() {
        return this.getDataImportDialog().$(`//div[@aria-label='Finish']`).$(`//div[text()='Import']`);
    }

    getDataImportViewSampleFilesDialog() {
        return this.getDataImportDialog().$('.mstrmojo-DataGrid.mstrmojo-di-samplefiles');
    }

    getSampleFileSelectionCheckboxByIndex(index) {
        return this.getDataImportViewSampleFilesDialog()
            .$('.mstrmojo-DataGrid-itemsContainer')
            .$$('.mstrmojo-CheckBox.mstrmojo-ImageCheckBox')[index];
    }

    getDatabaseTablePanel() {
        return this.getDataImportDialog().$('.mstrmojo-di-DBTablePanel');
    }

    getDataPreviewContainer() {
        return this.getDataImportDialog().$('.di-preview-container');
    }

    getHomeIcon() {
        return this.$('.mstr-nav-icon.icon-library');
    }

    getRemeberProjectSelection() {
        return this.getProjectSelectionWindow().$('mstrd-Checkbox');
    }

    getNewDossierProjectSelectionOkBtn() {
        return this.getProjectSelectionWindow().$('.ant-modal-footer .mstrd-Button--hot');
    }

    getEditBtnOnLibraryToolbar() {
        return this.$('.mstr-nav-icon.icon-info_edit');
    }

    async getProjectSelectionWindowTitle() {
        return this.$('.ant-modal-title').getText();
    }

    getCancelButton() {
        return this.getProjectSelectionWindow().$('.cancel-btn');
    }

    getCloseButton() {
        return this.getProjectSelectionWindow().$('.ant-modal-close-x');
    }

    getCreateNewPanelContent() {
        return this.$('.mstrd-DropdownMenu-main');
    }

    getBotDataset(dataset) {
        // return this.$(`//div[text()='${dataset}']//ancestor::div[@class='ag-cell-wrapper']`);
        return this.$$('.object-selector-container .ws-object-name-cell').filter(async (elem) => {
            const elemText = await elem.$('.ws-object-name-text').getText();
            return elemText === dataset;
        })[0];
    }

    getOkButtonForDashboardProperties() {
        return this.$(
            `//div[contains(@class, 'DashboardStyles')]//div[contains(@class, 'mstrmojo-Button-text ') and text()='OK']`
        );
    }

    getLayerPanel() {
        return this.$('.mstrmojo-RootView-vizControl');
    }

    getComponentFromLayerPanel(componentName) {
        return this.getLayerPanel().$(
            `//span[contains(@aria-label, '${componentName}') and text()='${componentName}']`
        );
    }

    async getRowOfBotDataset(dataset) {
        const rows = await this.$$('.ag-center-cols-viewport .ag-row');
        for (const row of rows) {
            const nameElement = await row.$('.ws-object-name-text');
            if (!nameElement || !(await nameElement.isExisting())) {
                continue;
            }

            const elemText = await nameElement.getText();
            if (elemText === dataset) {
                return row;
            }
        }
        return null;
    }

    async getCheckboxOfBotDataset(dataset) {
        const row = await this.getRowOfBotDataset(dataset);
        if (row) {
            return await row.$('.ag-input-field');
        }
        return null;
    }

    async getDatasetNameCheckbox(dataset) {
        const row = await this.getRowOfBotDataset(dataset);
        if (row) {
            return row.$('.name-column .ag-selection-checkbox');
        }
        return null;
    }

    getSearchDataSetInputBox() {
        return this.$('.object-selector-header-search-input input');
    }

    getDataSetLoadingIndicatorAfterSelectProject() {
        return this.$('.mstr-rc-loading-dot-icon');
    }

    getCreateWithNewDataButton() {
        return this.$('.blank-dossier-btn');
    }

    getCreateNewBotButton() {
        return this.$('.mstrd-CreateDossierDropdownMenuContainer-text-wrapper.icon-mstrd_custom_bot_normal');
    }

    getNewDatasetDialog() {
        return this.$('.mstrmojo-di-view-popup.new-dataset');
    }

    getCreateDossierDropdownMenu() {
        return this.$('.mstrd-CreateDossierDropdownMenuContainer');
    }

    getFocusedCreateNewDropdownMenuOption() {
        return this.getCreateDossierDropdownMenu().$(
            '.mstrd-CreateDossierDropdownMenuContainer-text-wrapper.focus-visible'
        );
    }

    getFileButton() {
        return this.$('.item.mb.file');
    }

    getDashboardPropertiesButton() {
        return this.$('.item.docProps.mstrmojo-ui-Menu-item');
    }

    getExportToPDFTab() {
        return this.$(`//button[text()='Export to PDF']`);
    }

    getExportToExcelTab() {
        return this.$(`//button[text()='Export to Excel']`);
    }

    getDashboardPropertiesExportToPDFDialog() {
        return this.$('.mstr-docprops-container');
    }

    getDashboardPropertiesExportToExcelDialog() {
        return this.$('.mstr-docprops-container');
    }

    getSaveButton() {
        return this.$(`//div[contains(@class, 'item mb save-dropdown')]`);
    }

    getDirectSaveButton() {
        return this.$('.item.btn.save .btn');
    }

    getSaveAsButton() {
        return this.$(`//a[contains(@class, 'item saveAs')]`);
    }

    getSaveAsNameInput() {
        return this.$(`//input[contains(@class, 'mstrmojo-SaveAsEditor-nameInput')]`);
    }

    getSaveAsEditor() {
        return this.$(`//div[contains(@class, 'mstrmojo-SaveAsEditor')]`);
    }

    getNewDatasetSelectorDiag() {
        return this.$('.mstrmojo-vi-ui-editors-NewDatasetSelectorContainer');
    }

    getObjectBrowsingListItemByName(name) {
        return this.$$(`.mstrmojo-OBList .mstrmojo-OBListItem td .mstrmojo-OBListItemText`).filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === name;
        })[0];
    }

    getSaveInFolderSelectionDropdown() {
        return this.getSaveAsEditor().$('.mstrmojo-DropDownButton-boxNode');
    }

    getSavedInFolderDropdown() {
        return this.$('.mstrmojo-Popup-content.mstrmojo-OBNavigatorPopup');
    }

    getSaveInFolderDropdownOption(folderName) {
        return this.$$('.mstrmojo-TreeNode-div').filter(async (elem) => {
            const elemText = await elem.$('.mstrmojo-TreeNode-text ').getText();
            return this.escapeRegExp(elemText) === this.escapeRegExp(folderName);
        })[0];
    }

    getPromptOptionsInSaveAsEditor() {
        return this.getSaveAsEditor().$(`.mstrmojo-advancedPromptOptions`);
    }

    getSaveInFolderDropdownOptions() {
        return this.$$('.mstrmojo-TreeNode-div');
    }

    getNewFolderButton() {
        return this.getSaveAsEditor().$(`.mstrmojo-WebButton.mstrmojo-createfolder`);
    }

    getSaveAsEditoSaveButton() {
        return this.getSaveAsEditor().$(`//div[contains(@class, 'okButton')]`);
    }

    getSaveAsEditorCancelButton() {
        return this.getSaveAsEditor().$(`//div[contains(text(), 'Cancel')]`);
    }

    getSaveOverwriteConfirmation() {
        return this.$('.mstrmojo-alert.modal');
    }

    getSaveOverWriteConfirmationYesButton() {
        return this.$(`//div[contains(@class, 'mstrmojo-alert modal')]//div[text()='Yes']`);
    }

    getLibraryHomeIconButton() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ListBase mstrmojo-VIToolbar')]//div[contains(@class, 'item btn library')]`
        );
    }

    getLibrarySaveNotification() {
        return this.$(`//div[contains(@class, 'mstrmojo-Editor mstrmojo-ConfirmSave-Editor')]`);
    }

    getLibrarySaveNotificationButton(buttonName) {
        return this.getLibrarySaveNotification().$(`.//div[contains(text(), "${buttonName}")]`);
    }

    getCreateNewMenuItem(text) {
        return this.getCreateNewMenuItems().filter(async (elem) => {
            return (await elem.getText()) === text;
        })[0];
    }

    getCreateNewDataModel() {
        return this.getCreateNewMenuItem('Data Model');
    }

    getCreateNewADC() {
        return this.getCreateNewMenuItem('AI Data Collection');
    }

    getCreateNewBot() {
        return this.getCreateNewMenuItem('Agent');
    }

    getProjectSelectionWindowSideMenu() {
        return this.getProjectSelectionWindow().$(`.selector-sider-menu`);
    }

    getProjectSelectionWindowMenuContents() {
        return this.getProjectSelectionWindowSideMenu().$$(`.ant-menu-title-content`);
    }

    getMenuItemInDatasetDialog(text) {
        return this.getProjectSelectionWindowMenuContents().filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getNewDatasetSelectorDiagMenuContents() {
        return this.getNewDatasetSelectorDiag().$$('.ant-menu-title-content');
    }

    getMenuItemInAddDataDialog(text) {
        return this.getNewDatasetSelectorDiagMenuContents().filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getClearInputButtonInDatasetPanel() {
        return this.$('.mstr-filter-search-input-btn');
    }

    getBrowsingFolder(folderName) {
        return this.$$('.ant-tree-node-content-wrapper').filter(async (elem) => {
            const elemText = await elem.$('.ant-tree-title').getText();
            return elemText.includes(folderName);
        })[0];
    }

    getFormatButton() {
        return this.$('.item.mb.style');
    }

    getDashboardFormattingButton() {
        return this.$('.item.dashboardStyles.mstrmojo-ui-Menu-item');
    }

    getLockPageSizeCheckBox() {
        return this.$('.mstrmojo-CheckBox.pageSize');
    }

    getLockPageSizeHelperIcon() {
        return this.$('.mstrmojo-Box.helpIcon');
    }

    getCurrentSelectionByName(name) {
        return this.$(
            `//div[contains(@class,'mstrmojo-Label') and text()='${name}']/parent::div//following-sibling::div//div[contains(@class,'mstrmojo-ui-Pulldown-text')]`
        );
    }

    getDashboardFormattingPopUp() {
        return this.$('.mstrmojo-Editor.DashboardStyles.modal');
    }

    getLoadingInSaveEditor() {
        return this.$('.mstrmojo-BookletLoader');
    }

    getHiddenLoadingInSaveEditor() {
        return this.$(".mstrmojo-BookletLoader[style='left: -100%;']");
    }

    getFormatCheckbox(format) {
        return this.$(`//label[contains(text(),'${format}')]/ancestor::*[1]//input`);
    }

    getOKButton() {
        return this.$(`//button[text()='OK']`);
    }

    getVizDoc() {
        return this.$('.mstrmojo-VIDocLayout');
    }

    getContentsPanel() {
        return this.$('.mstrmojo-TableOfContents');
    }

    getUploadBtn() {
        return this.$('.upload-button');
    }

    // 2 options: browse files and folders
    getUploadLinkByText(text) {
        return $(`//span[@class='mstrd-UnstructuredDataUploadDialog-link' and normalize-space(text())="${text}"]`);
    }

    getUnstructuredFileInput() {
        return this.$('input[type="file"]:not([webkitdirectory])');
    }

    getUnstructuredFolderInput() {
        return this.$('input[type="file"][webkitdirectory]');
    }

    getUnstructuredFilelist() {
        return this.$('.mstrd-UnstructuredDataUploadDialog-fileList');
    }

    getUnstructuredFileItemByName(filename) {
        const fileItem = this.getUnstructuredFilelist().$(
            `.mstrd-UnstructuredDataUploadDialog-fileName[title="${filename}"]`
        );
        return fileItem.parentElement();
    }

    getUnstructuredFileItemDeleteButton(filename) {
        return this.getUnstructuredFileItemByName(filename).$('.mstrd-UnstructuredDataUploadDialog-removeIcon');
    }

    getAddButtonInUnstructuredDataPanel() {
        return this.$('.mstrd-UnstructuredDataUploadDialog-uploadBtn');
    }

    getTextForAddBtnInUnstructuredDataPanel() {
        return this.getAddButtonInUnstructuredDataPanel().$('span').getText();
    }

    getAddUnstructuredDataDialog() {
        return this.$('.ant-modal-content:has([aria-label="Add Unstructured Data"])');
    }

    getLoadingSpinnerOfUnstructuredFile(filename) {
        return this.getRowOfBotDataset(filename).$('.loading-spinner');
    }

    getAllLoadingSpinnersOfUnstructuredFiles() {
        return this.getProjectSelectionWindow().$$('.loading-spinner');
    }

    getWarningMessageInAddUnstructuredDataDialog() {
        return this.getAddUnstructuredDataDialog().$('.mstrd-UnstructuredDataUploadDialog-fileFilterWarning');
    }

    getWarningMessageTextInAddUnstructuredDataDialog() {
        return this.getWarningMessageInAddUnstructuredDataDialog().getText();
    }

    // Action helper

    async openFileMenu() {
        await this.click({ elem: this.getFileButton() });
    }

    async openFormatMenu() {
        await this.click({ elem: this.getFormatButton() });
    }

    async openDashboardPropertiesMenu() {
        await this.click({ elem: this.getDashboardPropertiesButton() });
    }

    async openDashboardFormattingMenu() {
        await this.click({ elem: this.getDashboardFormattingButton() });
    }

    async openDashboardFormatting() {
        await this.openFormatMenu();
        await this.openDashboardFormattingMenu();
    }

    async clickLockPageSizeCheckBox() {
        await this.waitForElementVisible(this.getLockPageSizeCheckBox());
        await this.click({ elem: this.getLockPageSizeCheckBox() });
    }

    async clickLockPageSizeHelperIcon() {
        await this.waitForElementVisible(this.getLockPageSizeHelperIcon());
        await this.click({ elem: this.getLockPageSizeHelperIcon() });
    }

    async saveDashboardProperties() {
        await this.waitForElementVisible(this.getOkButtonForDashboardProperties());
        await this.click({ elem: this.getOkButtonForDashboardProperties() });
    }

    async clickComponentFromLayerPanel(componentName) {
        await this.waitForElementVisible(this.getComponentFromLayerPanel(componentName));
        await this.click({ elem: this.getComponentFromLayerPanel(componentName) });
    }

    async openDefaultZoomDropDown() {
        //click on current selection to open all selections, then click on the selection in drop down list
        let el = this.getCurrentSelectionByName('Default zoom in Library');
        await this.clickOnElement(el);
    }

    async clickExportToPDFTab() {
        await this.click({ elem: this.getExportToPDFTab() });
    }

    async clickExportToExcelTab() {
        await this.click({ elem: this.getExportToExcelTab() });
    }

    async clickNewDossierIcon() {
        await this.click({ elem: this.getNewDossierIcon() });
        //await this.waitForElementPresent(this.getProjectSelectionWindow(), 5000, 'Project selection window does not show up.');
    }

    async clickNewBotButton() {
        await this.click({ elem: this.getNewBotButton() });
        await this.waitForElementInvisible(this.getDatasetListLoadingSpinner());
        await this.waitForElementVisible(this.getNewDatasetDialog());
    }

    async clickNewDossierButton(waitForDataset = true) {
        await this.click({ elem: this.getNewDossierButton() });
        if (waitForDataset) {
            await this.waitForElementInvisible(this.getDatasetListLoadingSpinner());
            await this.waitForElementVisible(this.getNewDatasetDialog());
        } else {
            await this.waitForElementVisible(this.getProjectSelectionWindow());
        }
    }

    async clickNewReportButton() {
        await this.click({ elem: this.getNewReportButton() });
        await this.waitForElementInvisible(this.getDatasetListLoadingSpinner());
        await this.waitForElementVisible(this.getProjectSelectionWindow());
    }

    async clickCreateButtonForPendo() {
        await this.click({ elem: this.getCreateNewBotButton() });
        await this.waitForElementInvisible(this.getDatasetListLoadingSpinner());
        await this.waitForElementVisible(this.getNewDatasetDialog());
    }

    async openCreateNewBotDialog() {
        await this.click({ elem: this.getNewBotButton() });
        await this.waitForElementInvisible(this.getDatasetListLoadingSpinner());
        await this.waitForElementVisible(this.getProjectSelectionWindow());
        await this.waitForItemLoading();
        await this.waitForElementClickable(this.getCancelButton());
        await this.waitForElementInvisible(this.getDatasetListLoadingSpinner());
    }

    async clickNewDataModelButton() {
        await this.click({ elem: this.getCreateNewDataModel() });
        await this.waitForElementVisible(this.getProjectSelectionWindow());
    }

    async clickNewADCButton() {
        await this.click({ elem: this.getCreateNewADC() });
        await this.waitForElementVisible(this.getProjectSelectionWindow());
    }

    async clickNewBot2Button() {
        await this.click({ elem: this.getCreateNewBot() });
        await this.waitForElementVisible(this.getProjectSelectionWindow());
    }

    async toggleNewDossierCertifiedSwitch() {
        const elem = this.getNewDossierWindowCertifiedSwitch();
        await this.waitForElementClickable(elem);
        await this.click({ elem });
    }

    async clickCancelButton() {
        await this.click({ elem: this.getCancelButton() });
    }

    async clickPreviewButton() {
        await this.click({ elem: this.getPreviewButton() });
    }

    async clickDatasetCheckbox(dataset) {
        await this.click({ elem: await this.getCheckboxOfBotDataset(dataset) });
    }

    async clickCreateButton() {
        await this.click({ elem: this.getCreateButton() });
    }

    async clickCloseButtonIfVisible() {
        if (await this.isCloseButtonVisible()) {
            await this.click({ elem: this.getCloseButton() });
        }
    }

    async editDossierFromLibrary() {
        await this.waitForItemLoading();
        //const size = await this.getEditBtnOnLibraryToolbar().getSize();
        //console.log("size", size.height, size.width)
        await this.click({ elem: this.getEditBtnOnLibraryToolbar() });
        await this.waitForItemLoading();
    }

    async editDossierFromLibraryWithNoWait() {
        await this.getEditBtnOnLibraryToolbar().click();
    }

    async createDossierFromLibrary() {
        await this.click({ elem: this.getNewDossierIcon() });
        // await this.sleep(1);
        if (await (await this.getNewDossierButton()).isDisplayed()) {
            await this.click({ elem: this.getNewDossierButton() });
        }
        // await this.sleep(3);
        let prowin = await this.getProjectSelectionWindow();
        let status = await prowin.isDisplayed();
        if (status) {
            // let pro = this.getNewDossierProjectSelection(projectName);
            // await this.click({elem: pro});
            // let okbtn = this.getNewDossierProjectSelectionOkBtn();
            let okbtn = this.getCreateButton();
            await this.click({ elem: okbtn });
        }
        await this.waitLibraryLoadingIsNotDisplayed(60);
    }

    async createReportFromLibrary(projectName = 'MicroStrategy Tutorial') {
        await this.clickNewDossierIcon();
        await this.clickNewReportButton();
        await this.searchForProject(projectName);
        await this.selectProject(projectName);
        await this.saveProjectSelection();
        await this.waitLibraryLoadingIsNotDisplayed(60);
        await this.sleep(2000);
    }

    async createBlankDashboardFromLibrary() {
        await this.click({ elem: this.getNewDossierIcon() });
        // await this.sleep(1);
        if (await (await this.getNewDossierButton()).isDisplayed()) {
            await this.click({ elem: this.getNewDossierButton() });
        }
        // await this.sleep(3);
        let prowin = await this.getProjectSelectionWindow();
        let status = await prowin.isDisplayed();
        if (status) {
            let btn = this.getBlankDashboardButton();
            await this.click({ elem: btn });
        }
        await this.waitLibraryLoadingIsNotDisplayed(60);
    }

    async createBlankDashboardFromSaaSLibrary() {
        await this.click({ elem: this.getNewDossierIcon() });
        if (await (await this.getNewDossierButton()).isDisplayed()) {
            await this.click({ elem: this.getNewDossierButton() });
        }
        await this.waitForElementVisible(this.getNewDatasetDialog());
    }

    async createBlankDashboard() {
        const url = await browser.getUrl();
        if (url.includes('saas')) {
            await this.createBlankDashboardFromSaaSLibrary();
        } else {
            await this.createBlankDashboardFromLibrary();
        }
    }

    async createDocumentFromLibrary(projectName) {
        await this.clickNewDossierIcon();

        await this.click({ elem: this.getNewDocumentButton() });
        await this.waitForElementVisible(this.getProjectSelectionWindow());

        await this.searchForProject(projectName);
        await this.selectProject(projectName);
        await this.saveProjectSelection();

        await this.waitLibraryLoadingIsNotDisplayed(60);
        await this.sleep(2000);
    }

    async clickCreateBotOption() {
        if (await (await this.getNewBotButton()).isDisplayed()) {
            await this.click({ elem: this.getNewBotButton() });
        }
    }

    async switchToProject(newProjectName) {
        const dropdownSelector = this.getProjectSelector();
        await this.waitForElementClickable(dropdownSelector);
        await this.click({ elem: dropdownSelector });
        await this.waitForElementVisible(this.getNewDossierProjectSelectionDropdownList());
        const projectOption = this.getNewDossierProjectSelectionDropdownOption(newProjectName);
        await this.click({ elem: projectOption });
        await this.waitForElementInvisible(this.getDatasetListLoadingSpinner());
    }

    async searchDataSet(string) {
        await this.click({ elem: this.getNewDossierWindowSearchInput() });
        await this.typeKeyboard(string);
        await this.waitForElementVisible(this.getNewDossierWindowSearchInputWithKeyword(string), {
            timeout: 5000,
            msg: 'Rendering search keyword takes too long.',
        });
    }

    async clearSearch() {
        await this.click({ elem: this.getNewDossierWindowSearchClearAllButton() });
    }

    async switchToSmarkMode() {
        await this.click({ elem: this.getNewDossierWindowSmartModeIcon() });
    }

    async switchToBrowsingMode() {
        await this.click({ elem: this.getNewDossierWindowBrowsingModeIcon() });
        await this.waitForDynamicElementLoading();
    }

    async selectDataSetByName(datasetName) {
        // Cannot select the dataset by clicking the row, need to click the checkbox
        const datasetRowXpath = this.getCSSContainingText('ag-cell-wrapper', datasetName);
        const datasetCheckbox = this.$(`${datasetRowXpath}`).$('.ag-checkbox');
        await this.waitForElementVisible(datasetCheckbox);
        await this.click({ elem: datasetCheckbox });
    }

    async clickConfirmationDialogOkButton() {
        await this.click({ elem: this.getConfirmationDialogOkButton() });
        await this.waitForElementInvisible(this.getDatasetListLoadingSpinner());
    }

    async clickCreateWithNewDataButton() {
        await this.click({ elem: this.getBotCreateWithNewDataButton() });
        await this.waitForElementVisible(this.getDataImportDialog());
        await this.waitForElementVisible(this.getDataImportDialogSourceGroup('GENERAL'));
    }

    async clickDataImportDialogCancelButton() {
        await this.click({ elem: this.getDataImportDialogCancelButton() });
    }

    async clickDataImportDialogCreateButton() {
        await this.click({ elem: this.getDataImportDialogCreateButton() });
        await this.waitForElementInvisible(this.$('.mstrWaitBox'));
        await this.waitForElementInvisible(this.$('.mstrmojo-DIEditor-curtain'));
        return this.sleep(500); // wait for rendering
    }

    async clickDataImportDialogImportButton() {
        await this.click({ elem: this.getDataImportDialogImportButton() });
        await this.waitForElementVisible(this.getDataImportDialogPrepareDataButton());
    }

    async clickDataImportDialogPrepareDataButton() {
        await this.click({ elem: this.getDataImportDialogPrepareDataButton() });
        await this.waitForElementVisible(this.getDatabaseTablePanel());
        await this.waitForElementVisible(this.getDataPreviewContainer());
    }

    async clickDataImportDialogSampleFiles() {
        await this.click({ elem: this.getDataImportDialogDataSource('Sample Files') });
        await this.waitForElementVisible(this.getDataImportViewSampleFilesDialog());
    }

    async clickHomeIcon() {
        await this.click({ elem: this.getHomeIcon() });
    }

    async selectSampleFileByIndex(index) {
        await this.click({ elem: this.getSampleFileSelectionCheckboxByIndex(index) });
    }

    async closeDataImportDialog() {
        const dialogPresent = await this.getDataImportDialog().isDisplayed();
        if (dialogPresent === true) {
            await this.click({ elem: this.getDataImportDialogCloseButton() });
        }
    }

    async selectProject(projectName) {
        await this.click({ elem: this.getProjectRadioButton(projectName) });
    }

    async saveProjectSelection() {
        await this.click({ elem: this.getNewDossierProjectSelectionOkBtn() });
    }

    // Assertion helper
    async waitLoadingDataPopUpIsNotDisplayed(seconds = 10) {
        let libraryLoadingPresent =
            (await this.getLibraryLoading()).isDisplayed() && (await this.getLibraryLoading()).isDisplayed();
        if (libraryLoadingPresent) {
            await this.waitForElementStaleness(this.getLibraryLoading(), {
                timeout: seconds * 1000,
                msg: `Loading Data pop up still displayed after ${seconds} seconds`,
            });
            // await this.wait(this.EC.stalenessOf(this.getLibraryLoading()), seconds * 1000, `Loading Data pop up still displayed after ${seconds} seconds`);
        } else {
            await this.waitForElementStaleness(this.getloadingDataPopUpNotDisplayed(), {
                timeout: seconds * 1000,
                msg: `Loading Data pop up still displayed after ${seconds} seconds`,
            });
            // await this.wait(this.EC.presenceOf(this.getloadingDataPopUpNotDisplayed()), seconds * 1000, `Loading Data pop up still displayed after ${seconds} seconds`);
        }
        // Allow fraction for animation
        await this.sleep(0.2);
    }

    async waitLibraryLoadingIsNotDisplayed(seconds = 10) {
        await this.waitForElementStaleness(this.getLibraryLoading(), {
            timeout: seconds * 1000,
            msg: `Loading Data pop up still displayed after ${seconds} seconds`,
        });
        // await this.wait(
        //     this.EC.stalenessOf(this.getLibraryLoading()),
        //     seconds * 1000,
        //     `Loading Data pop up still displayed after ${seconds} seconds`
        // );
        // Allow fraction for animation
        await this.sleep(0.2);
    }

    async waitLibraryLoadingDisplayedAndThenNotDisplayed(seconds = 10) {
        await this.waitForElementVisible(this.getLibraryLoading(), {
            timeout: seconds * 1000,
            msg: `Loading Data pop up still displayed after ${seconds} seconds`,
        });
        await this.waitForElementStaleness(this.getLibraryLoading(), {
            timeout: seconds * 1000,
            msg: `Loading Data pop up still displayed after ${seconds} seconds`,
        });
        await this.sleep(0.2);
        await this.waitForElementInvisible(this.getLibraryLoading(), {
            timeout: seconds * 1000,
            msg: `Loading Data pop up still displayed after ${seconds} seconds`,
        });
    }

    async scrollDatasetListsToBottom() {
        let offsetHeight = await this.getDatasetList().getCSSProperty('height');
        offsetHeight = offsetHeight.value.split('p')[0];
        await this.executeScript(
            (element, scrollAmount) => {
                element.scrollTop = scrollAmount;
            },
            await this.getDataseListContainer(),
            offsetHeight
        );
        return this.sleep(300);
    }

    async isDatasetDisplayedInViewport(datasetName) {
        return this.getDataSetByName(datasetName).isDisplayedInViewport();
    }

    async isBotDatasetDisplayedInViewport(datasetName) {
        return this.getBotDataset(datasetName).isDisplayedInViewport();
    }

    async isProjectSelectionWindowPresent() {
        return this.getProjectSelectionWindow().isDisplayed();
    }

    async isNewDossierWindowCertifiedEnabled() {
        const elem = this.getNewDossierWindowCertifiedSwitch();
        return (await elem.getAttribute('aria-checked')) === 'true';
    }

    async isNoDataScreenPresent() {
        return this.getNewDossierWindowNoDataScreen().isDisplayed();
    }

    async isBrowingExplorerDisplayed() {
        return this.getBrowsingModeSideMenu().isDisplayed();
    }

    async isSmartExplorerDisplayed() {
        return this.getSmartModeSideMenu().isDisplayed();
    }

    async isConfirmationDialogDisplay() {
        return this.getConfirmationDialog().isDisplayed();
    }

    async isSaveOverwriteConfirmation() {
        return this.getSaveOverwriteConfirmation().isDisplayed();
    }

    async hasASelectedDataSource() {
        return !(await this.getSelectedDataCount().isDisplayed());
    }

    async isDataImportDialogPrepareDataButtonDisabled() {
        return this.isDisabled(this.getDataImportDialogPrepareDataButton());
    }

    async isHomeIconPresent() {
        return this.getHomeIcon().isDisplayed();
    }

    async isDataImportDialogPresent() {
        return this.getDataImportDialog().isDisplayed();
    }

    async isEditIconPresent() {
        return (await this.getEditBtnOnLibraryToolbar()).isDisplayed();
    }

    async isCreateBotOptionPresent() {
        return this.getCreateNewBot().isDisplayed();
    }

    async isCreateADCOptionPresent() {
        return this.getCreateNewADC().isDisplayed();
    }

    async getCreateBotText() {
        return this.getNewBotButton().getText();
    }

    async isProjectSelectionWindowVisible() {
        return this.getProjectSelectionWindow().isDisplayed();
    }

    async isCloseButtonVisible() {
        const projectWindowVisible = await this.isProjectSelectionWindowVisible();
        if (projectWindowVisible) {
            return await this.getCloseButton().isDisplayed();
        }
        return false;
    }

    async isBotCreateWithNewDataButtonVisible(text = 'Create with New Data') {
        return this.getBotCreateWithNewDataButton(text).isDisplayed();
    }

    async changeProjectTo(project) {
        await this.click({ elem: this.getChangeProject() });
        await browser.performActions([
            {
                type: 'pointer',
                id: 'mouse1',
                parameters: { pointerType: 'mouse' },
                actions: [
                    { type: 'pointerMove', origin: 'pointer', x: 250, y: 0 },
                    { type: 'pause', duration: 100 },
                ],
            },
        ]);
        await browser.releaseActions();
        await this.waitForElementClickable(this.getProject(project));
        await this.click({ elem: this.getProject(project) });
        await this.waitForElementStaleness(this.getDatasetListLoadingSpinner());
    }

    async waitForProjectSelectionWindowAppear() {
        await this.waitForElementVisible(this.getProjectSelectionWindow());
        await this.waitForElementStaleness(this.getProjectSelectionPreloader());
        await this.waitForElementStaleness(this.getDatasetListLoadingSpinner());
        await this.waitForElementVisible(this.getProjectSelectionWindowMenuContents()[0]);
        return this.sleep(500);
    }

    async waitForAddDataSelectionWindowAppear() {
        await this.waitForElementStaleness(this.getDatasetListLoadingSpinner());
        await this.waitForElementVisible(this.getNewDatasetSelectorDiag());
        await this.waitForElementVisible(this.getNewDatasetSelectorDiagMenuContents()[0]);
        return this.sleep(500);
    }

    async waitForDataPreviewWindowAppear() {
        await this.waitForElementVisible(this.getDataImportDialog());
        return this.sleep(500);
    }

    async selectProjectAndDataset(project, dataset) {
        await this.waitForProjectSelectionWindowAppear();
        await this.waitForElementClickable(this.getChangeProject());
        await this.changeProjectTo(project);
        await this.searchForDataByName(dataset);
        await this.click({ elem: await this.getCheckboxOfBotDataset(dataset) });
        await this.click({ elem: await this.getCreateButton() });
    }

    async selectDatasets(datasets, create = false) {
        await this.waitForProjectSelectionWindowAppear();
        for (const dataset of datasets) {
            await this.searchForDataByName(dataset);
            await this.click({ elem: await this.getCheckboxOfBotDataset(dataset) });
        }
        if (create) {
            await this.click({ elem: await this.getCreateButton() });
        }
    }

    async selectDatasetAfterSelectBotTemplate(dataset) {
        await this.searchForDataByName(dataset);
        await this.click({ elem: await this.getRowOfBotDataset(dataset) });
        await this.click({ elem: await this.getCreateButton() });
    }

    async selectProjectAndReport(project, report) {
        await this.waitForElementClickable(this.getChangeProject());
        await this.waitForElementInvisible(this.getDataSetLoadingIndicatorAfterSelectProject());
        await this.changeProjectTo(project);
        await this.clickDatasetTypeInDatasetPanel('Report');
        await this.searchForDataByName(report);
        await this.click({ elem: await this.getCheckboxOfBotDataset(report) });
        await this.click({ elem: await this.getCreateButton() });
    }

    async selectProjectAndADCAndDataset(project, dataset, preview = false) {
        await this.waitForProjectSelectionWindowAppear();
        await this.changeProjectTo(project);
        await this.clickDatasetTypeInDatasetPanel('AI Data Collection');
        await this.searchForDataByName(dataset);
        await this.click({ elem: this.getBotDataset(dataset) });
        if (preview) {
            await this.click({ elem: this.getPreviewButton() });
        } else {
            await this.click({ elem: this.getContinueButton() });
        }
    }

    async selectProjectAndUnstructuredDataPanel(project) {
        await this.waitForProjectSelectionWindowAppear();
        await this.changeProjectTo(project);
        await this.clickDatasetTypeInDatasetPanel('Unstructured Data');
    }

    async selectProjectAndUnstructuredData(project, unstructuredData) {
        await this.selectProjectAndUnstructuredDataPanel(project);
        await this.searchForDataByName(unstructuredData);
        await this.sleep(500);
        await this.click({ elem: await this.getCheckboxOfBotDataset(unstructuredData) });
        await this.sleep(1000);
        await this.click({ elem: this.getCreateButton() });
    }

    async selectUnstructuredData(unstructuredData) {
        await this.waitForAddDataSelectionWindowAppear();
        await this.clickDatasetTypeInAddDataPanel('Unstructured Data');
        await this.searchForDataByName(unstructuredData);
        await this.sleep(500);
        await this.click({ elem: await this.getCheckboxOfBotDataset(unstructuredData) });
        await this.click({ elem: this.getAddButtonFromADC() });
    }

    async clickUploadButton() {
        await this.click({ elem: this.getUploadBtn() });
    }

    async waitForAddUnstructuredDataDialogAppear() {
        await this.waitForElementVisible(this.getAddUnstructuredDataDialog());
    }

    async uploadUnstructuredFileFromDisk(filePath) {
        const fileInput = await this.getUnstructuredFileInput();
        await fileInput.waitForExist();
        // The input element has "hidden" attribute, so we need to remove it before using 'setValue' function
        await browser.execute((el) => el.removeAttribute('hidden'), fileInput);
        const remoteFilePath = await browser.uploadFile(filePath);
        await fileInput.setValue(remoteFilePath);
    }

    async uploadUnstructuredData(filePaths) {
        if (!Array.isArray(filePaths)) {
            filePaths = [filePaths];
        }
        for (const filePath of filePaths) {
            await this.uploadUnstructuredFileFromDisk(filePath);
        }
    }

    async deleteUnstructuredDataInUploadDialog(filename) {
        await this.hover({ elem: this.getUnstructuredFileItemByName(filename) });
        await this.click({ elem: this.getUnstructuredFileItemDeleteButton(filename) });
    }

    async saveUnstructuredDataToMD(path) {
        await this.click({ elem: this.getAddButtonInUnstructuredDataPanel() });
        await this.copyMoveWindow.openFolderByPath(path);
        await this.copyMoveWindow.clickCreate();
    }

    async waitForUnstructuredFileUploadComplete(filename, timeout = 180000) {
        const loadingSpinner = this.getLoadingSpinnerOfUnstructuredFile(filename);
        await this.waitForElementStaleness(loadingSpinner, { timeout });
    }

    async waitForAllUnstructuredFileUploadComplete(timeout = 180000) {
        await this.waitForElementInvisible(this.getAddUnstructuredDataDialog());
        await browser.waitUntil(
            async () => {
                const spinners = await this.getAllLoadingSpinnersOfUnstructuredFiles();
                return spinners.length === 0;
            },
            {
                timeout,
                timeoutMsg: 'Some files are still uploading!',
            }
        );
    }

    async selectProjectAndAIBots(project, datasets, skipProject = false) {
        await this.waitForProjectSelectionWindowAppear();
        // if add new bot from universal bot data panel, skip the select project step
        if (!skipProject) {
            await this.changeProjectTo(project);
            await this.clickDatasetTypeInDatasetPanel('Agent');
        }
        for (const dataset of datasets) {
            await this.searchForDataByName(dataset);
            await this.click({ elem: await this.getCheckboxOfBotDataset(dataset) });
            await this.sleep(500);
        }
        if (await this.getCreateButton().isDisplayed()) {
            await this.click({ elem: this.getCreateButton() });
        } else {
            await this.click({ elem: this.getAddButtonInAddDataDialog() });
        }
        await this.waitForElementVisible(this.aibotChatPanel.getWelcomePage());
    }

    async selectSubBotInUnversalBot(subbots) {
        await this.waitForProjectSelectionWindowAppear();
        for (const subbot of subbots) {
            await this.searchForDataByName(subbot);
            await this.click({ elem: await this.getCheckboxOfBotDataset(subbot) });
            await this.sleep(500);
        }
        await this.click({ elem: this.getAddButtonInAddDataDialog() });
    }

    async createDashboardWithDataset({ project = 'MicroStrategy Tutorial', dataset }) {
        await this.clickNewDossierIcon();
        await this.waitForElementVisible(this.getNewDossierButton());
        await this.waitForElementClickable(this.getNewDossierButton());
        await this.click({ elem: this.getNewDossierButton() });
        await this.selectProjectAndDataset(project, dataset);
        await this.waitLibraryLoadingIsNotDisplayed(60);
    }

    async createDashboardWithReport({ project = 'MicroStrategy Tutorial', report }) {
        await this.clickNewDossierIcon();
        await this.waitForElementVisible(this.getNewDossierButton());
        await this.waitForElementClickable(this.getNewDossierButton());
        await this.click({ elem: this.getNewDossierButton() });
        await this.selectProjectAndReport(project, report);
        await this.waitLibraryLoadingIsNotDisplayed(60);
    }

    async createBotWithDataset({ project = 'MicroStrategy Tutorial', dataset }) {
        await this.clickNewDossierIcon();
        await this.waitForElementVisible(this.getNewBotButton());
        await this.waitForElementClickable(this.getNewBotButton());
        await this.click({ elem: this.getNewBotButton() });
        await this.selectProjectAndDataset(project, dataset);
        await this.waitForElementVisible(this.aibotChatPanel.getWelcomePage());
    }

    async createBotWithADC({ project = 'MicroStrategy Tutorial', aiDataCollection }) {
        await this.clickNewDossierIcon();
        await this.waitForElementVisible(this.getNewBotButton());
        await this.waitForElementClickable(this.getNewBotButton());
        await this.click({ elem: this.getNewBotButton() });
        await this.waitForElementClickable(this.getChangeProject());
        await this.waitForElementInvisible(this.getDataSetLoadingIndicatorAfterSelectProject());
        await this.changeProjectTo(project);
        await this.clickDatasetTypeInDatasetPanel('AI Data Collection');
        await this.waitForElementInvisible(this.getDatasetListLoadingSpinner());
        await this.searchForDataByName(aiDataCollection);
        await this.waitForElementInvisible(this.getDatasetListLoadingSpinner());
        await this.click({ elem: this.getBotDataset(aiDataCollection) });
        await this.click({ elem: this.getContinueButton() });

        await this.waitForElementVisible(this.aibotChatPanel.getWelcomePage());
    }

    async createADCWithDataset({ project = 'MicroStrategy Tutorial', dataset }) {
        await this.clickNewDossierIcon();
        await this.clickNewADCButton();
        await this.selectProjectAndDataset(project, dataset);
        await this.waitForElementVisible(this.getDirectSaveButton());
        await this.sleep(1000);
    }

    async createADCWithUnstructuredData({ project = 'MicroStrategy Tutorial', unstructuredData }) {
        await this.clickNewDossierIcon();
        await this.clickNewADCButton();
        await this.selectProjectAndUnstructuredData(project, unstructuredData);
        await this.waitForElementVisible(this.getDirectSaveButton());
        await this.sleep(1000);
    }

    async createBotWithNewData({ project = 'MicroStrategy Tutorial' }) {
        await this.clickNewDossierIcon();
        await this.waitForElementClickable(this.getNewBotButton());
        await this.click({ elem: this.getNewBotButton() });
        if (project) {
            await this.waitForElementClickable(this.getChangeProject());
            await this.waitForElementInvisible(this.getDataSetLoadingIndicatorAfterSelectProject());
            await this.changeProjectTo(project);
            await this.getCreateWithNewDataButton().click();
        }
    }

    async createBotWithNewDataInDefaultProject() {
        await this.createBotWithNewData({ project: '' });
        await this.getCreateWithNewDataButton().click();
        await this.waitForElementVisible(this.getDataImportDialog());
    }

    async createBotWithReports({ project = 'MicroStrategy Tutorial', reports = [] }) {
        if (reports.length == 0) {
            return;
        }
        await this.clickNewDossierIcon();
        await this.waitForElementVisible(this.getNewBotButton());
        await this.waitForElementClickable(this.getNewBotButton());
        await this.click({ elem: this.getNewBotButton() });
        await this.waitForElementClickable(this.getChangeProject());
        await this.waitForElementInvisible(this.getDataSetLoadingIndicatorAfterSelectProject());
        await this.changeProjectTo(project);
        await this.clickDatasetTypeInDatasetPanel('Report');
        await this.waitForElementInvisible(this.getDatasetListLoadingSpinner());
        for (let i = 0; i < reports.length; i++) {
            let report = reports[i];
            await this.searchForDataByName(report);
            await this.waitForElementInvisible(this.getDatasetListLoadingSpinner());
            await this.waitForElementVisible(this.getCheckboxOfBotDataset(report));
            await this.clickAndNoWait({ elem: this.getCheckboxOfBotDataset(report) });
            await this.sleep(500);
            if (await this.getClearInputButtonInDatasetPanel().isDisplayed()) {
                await this.getClearInputButtonInDatasetPanel().click();
            }
        }
        await this.click({ elem: this.getCreateButton() });
        await this.waitForElementVisible(this.aibotChatPanel.getWelcomePage());
    }

    async clickDatasetTypeInDatasetPanel(datasetType) {
        await this.getMenuItemInDatasetDialog(datasetType).click();
    }

    // Add dataset in ADC
    async clickDatasetTypeInAddDataPanel(datasetType) {
        await this.getMenuItemInAddDataDialog(datasetType).click();
    }

    async searchForDataByName(name) {
        await this.waitForElementVisible(this.getSearchDataSetInputBox());
        await this.clear({ elem: this.getSearchDataSetInputBox() });
        await this.getSearchDataSetInputBox().setValue(name);
        await this.enter();
        await this.sleep(1000); // Wait for the list to be updated
    }

    async getCreateNewMenuItemsText() {
        return this.getCreateNewMenuItems().map(async (elem) => {
            return elem.getText();
        });
    }

    async isCreateNewButtonPresent() {
        return (await this.getNewDossierIcon()).isDisplayed();
    }

    async isNewBotButtonPresent() {
        return await this.getNewBotButton().isDisplayed();
    }

    async isCreateNewDropdownOpen() {
        return this.getCreateNewPanelContent().isDisplayed();
    }

    async getFocusedMenuOptionLabel() {
        const focusedElem = this.getFocusedCreateNewDropdownMenuOption();
        return focusedElem.getAttribute('aria-label');
    }

    async simpleSaveDashboard() {
        await this.waitForElementClickable(this.getSaveButton());
        await this.click({ elem: this.getSaveButton() });
        await this.click({ elem: this.getMenuOption('Save') });
        await this.waitForDynamicElementLoading();
        await this.sleep(1000);
    }

    async saveDashboard(dashboardName) {
        await this.simpleSaveDashboard();
        await this.click({ elem: this.getSaveAsNameInput() });
        await this.getSaveAsNameInput().clearValue();
        await this.sleep(2000);
        await this.getSaveAsNameInput().click();
        await this.typeKeyboard(dashboardName);
        await this.getSaveAsEditoSaveButton().click();

        if ((await this.getSaveOverwriteConfirmation()).isExisting()) {
            await this.getSaveOverWriteConfirmationYesButton().click();
        }
        await this.getloadingDataPopUpNotDisplayed();
        await this.waitLibraryLoadingIsNotDisplayed(60);
    }

    async saveDashboardInMyReports(dashboardName) {
        await this.simpleSaveDashboard();
        await this.click({ elem: this.getSaveAsNameInput() });
        await this.getSaveAsNameInput().clearValue();
        await this.sleep(2000);
        await this.getSaveAsNameInput().click();
        await this.typeKeyboard(dashboardName);
        await this.getSaveInFolderSelectionDropdown().click();
        await this.getSaveInFolderDropdownOption('My Reports').click();
        await this.getSaveAsEditoSaveButton().click();
        if (await this.isSaveOverwriteConfirmation()) {
            await this.getSaveOverWriteConfirmationYesButton().click();
        }
        await this.getloadingDataPopUpNotDisplayed();
        await this.waitLibraryLoadingIsNotDisplayed(60);
    }

    async saveInMyReport(name, path) {
        await this.click({ elem: this.getSaveAsNameInput() });
        await this.clear({ elem: this.getSaveAsNameInput() });
        await this.getSaveAsNameInput().setValue(name);
        if (path) {
            for (const folder of path) {
                await this.click({ elem: this.getObjectBrowsingListItemByName(folder) });
                await this.sleep(500);
            }
        }
        await this.sleep(1000);
        await this.click({ elem: this.getSaveAsEditoSaveButton() });
        //pause 2s for animation
        await this.sleep(2000);
        if (await this.isSaveOverwriteConfirmation()) {
            await this.getSaveOverWriteConfirmationYesButton().click();
        }
        await this.waitForElementInvisible(this.getSaveAsEditor());
        await this.dossierPage.waitForDossierLoading();
    }

    // select either Shared Reports or My Reports
    async saveToFolder(name, path, parentFolder = 'Shared Reports') {
        await this.waitForElementVisible(this.getSaveAsEditor());
        // The loading indicator is always in dom tree, so find the hidden selector
        await this.waitForElementVisible(this.getHiddenLoadingInSaveEditor());
        const defaultFolder = await this.getSaveInFolderSelectionText();
        if (this.escapeRegExp(defaultFolder) !== this.escapeRegExp(parentFolder)) {
            await this.click({ elem: this.getSaveInFolderSelectionDropdown() });
            await this.waitForElementVisible(this.getSavedInFolderDropdown());
            await this.click({ elem: this.getSaveInFolderDropdownOption(parentFolder) });
        }
        await this.saveInMyReport(name, path);
    }

    async cancelSaveAs() {
        await this.click({ elem: this.getSaveAsEditorCancelButton() });
        await this.waitForElementInvisible(this.getSaveAsEditor());
    }

    async saveAsDashboard(dashboardName) {
        await this.click({ elem: this.getSaveAsButton() });
        await this.click({ elem: this.getSaveAsNameInput() });
        await this.getSaveAsNameInput().clearValue();
        await this.sleep(2000);
        await this.getSaveAsNameInput().click();
        await this.typeKeyboard(dashboardName);
        await this.getSaveAsEditoSaveButton().click();
        await this.sleep(2000);
        const confirmationYesButton = await this.getSaveOverWriteConfirmationYesButton();
        const confirmationYesButtonIsDisplayed = await confirmationYesButton.isDisplayed();
        if (confirmationYesButtonIsDisplayed) {
            await this.getSaveOverWriteConfirmationYesButton().click();
        }
        await this.waitLibraryLoadingIsNotDisplayed(60);
    }

    async goToHome() {
        const consumptionHomeIcon = this.$(`//div[@data-feature-id='navbar-go-to-home']`);
        const isAuthoringHomeIconExisting = await this.getLibraryHomeIconButton().isExisting();

        const isInConsumption = await consumptionHomeIcon.isExisting();

        // Already in home or no home icon found - just skip this step
        if (!isAuthoringHomeIconExisting && !isInConsumption) {
            return;
        }

        if (isInConsumption) {
            await this.click({ elem: consumptionHomeIcon });
            return;
        }

        await this.click({ elem: this.getLibraryHomeIconButton() });
        const saveNotification = await this.getLibrarySaveNotification();
        if (await saveNotification.isExisting()) {
            const saveButton = await this.getLibrarySaveNotificationButton("Don't Save");
            if (await saveButton.isExisting()) {
                await saveButton.click();
            } else {
                console.error('Save button not found within the save notification');
            }
        }
    }

    async searchForProject(projectName) {
        await this.click({ elem: this.getSearchInputBox() });
        await this.getSearchInputBox().setValue(projectName);
        await this.enter();
    }

    // Assertion Helper

    async isCreateDataModelBtnPresent() {
        return this.getCreateNewDataModel().isDisplayed();
    }

    async isCreateDashboardBtnPresent() {
        return this.getCreateNewMenuItem('Dashboard').isDisplayed();
    }

    async isBrowsingFolderPresent(folderName) {
        return this.getBrowsingFolder(folderName).isDisplayed();
    }

    async getSaveInFolderSelectionText() {
        await this.waitForElementVisible(this.getSaveAsEditor());
        return this.getSaveInFolderSelectionDropdown().getText();
    }

    async getSaveInFolderDropdownOptionsText() {
        await this.click({ elem: this.getSaveInFolderSelectionDropdown() });
        return this.getSaveInFolderDropdownOptions().map(async (elem) => {
            return elem.getText();
        });
    }

    async isNewFolderButtonDisplayed() {
        return this.getNewFolderButton().isDisplayed();
    }

    async isPromptOptionsInSaveAsEditorDisplayed() {
        return this.getPromptOptionsInSaveAsEditor().isDisplayed();
    }

    async isDatasetExistedInDatasetPanel(dataset) {
        const ele = await this.getRowOfBotDataset(dataset);
        return !!ele;
    }

    async isDatasetDisabledInDatasetPanel(dataset) {
        const ele = await this.getDatasetNameCheckbox(dataset);
        const clsName = await ele.getAttribute('class');
        return clsName.includes('ag-invisible');
    }

    async isProjectGrayedOut() {
        const color = await this.$('.ant-select-selector').getCSSProperty('background-color');
        return color.value === 'rgba(242,243,245,1)';
    }

    async isUploadBtnDisplayed() {
        return this.getUploadBtn().isDisplayed();
    }

    async clickFormatCheckbox(format) {
        await this.click({ elem: this.getFormatCheckbox(format) });
    }

    async clickOKButton() {
        await this.click({ elem: this.getOKButton() });
    }

    // New Maximize visualization option in 26.02
    async getMaximizeVisualizationRow() {
        const selector =
            "//div[@role='group' and contains(@class, 'mstr-docprops-row') and .//div[contains(@aria-label,'Maximize')]]";

        await browser.waitUntil(async () => (await $$(selector)).length > 0, {
            timeout: 10000,
            timeoutMsg: 'Maximize Visualization row not found',
        });
        return await $(selector);
    }

    async getMaximizeVisualizationSelectColumn() {
        const row = await this.getMaximizeVisualizationRow();
        return row.$('.mstr-docprops-select-col');
    }

    getMaximizeVisualizationDropdownList() {
        return this.$('.mstr-docprops-select-dropdown__dropdown-list');
    }

    getMaximizeVisualizationOption(optionLabel) {
        return this.getMaximizeVisualizationDropdownList().$(
            `.//span[normalize-space()="${optionLabel}"]/ancestor::div[contains(@class, 'mstr-docprops-select-dropdown__option')]`
        );
    }

    async clickMaximizeVisualizationSelectColumn() {
        const selectColumn = await this.getMaximizeVisualizationSelectColumn();
        await this.waitForElementClickable(selectColumn);
        await this.click({ elem: selectColumn });
    }

    async clickMaximizeVisualizationOption(optionLabel) {
        const option = this.getMaximizeVisualizationOption(optionLabel);
        await this.waitForElementClickable(option);
        await this.click({ elem: option });
    }

    async selectMaximizeVisualizationMode(optionLabel) {
        await this.clickMaximizeVisualizationSelectColumn();
        await this.clickMaximizeVisualizationOption(optionLabel);
    }

    async selectMaximizeVisualizationEntireDashboard() {
        await this.selectMaximizeVisualizationMode('Maximize to entire dashboard');
    }

    async selectMaximizeVisualizationCurrentPanel() {
        await this.selectMaximizeVisualizationMode('Maximize to current panel (Web only)');
    }

    getDocPropsButtonByAria(label) {
        const normalizedLabel = label.trim().toLowerCase();
        return this.$(
            `//div[contains(@class,'mstr-docprops-buttonBar')]//button[translate(@aria-label,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='${normalizedLabel}']`
        );
    }

    async clickDashboardPropertiesOkButton() {
        const okButton = this.getDocPropsButtonByAria('OK');
        await this.waitForElementClickable(okButton);
        await this.click({ elem: okButton });
    }
}
