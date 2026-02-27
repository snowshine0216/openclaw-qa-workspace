import BasePage from '../base/BasePage.js';
import MDXSourceSelector from '../report/reportEditor/MDXSourceSelector.js';
import { Locales, ReportCreatorStringLabels } from '../../constants/report.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class DossierCreator extends BasePage {
    constructor() {
        super();
        this.mdxSourceSelector = new MDXSourceSelector();
    }
    // Element locators

    getLibraryNavigationBar() {
        return this.$('.mstrd-NavBarWrapper');
    }

    getCreateNewDossier() {
        return this.$(
            '//li[contains(@class,"mstrd-MenuItem mstrd-CreateDossierDropdownMenuContainer-create-dossier")]'
        );
    }

    getNoDataOverlay() {
        return this.$('.ag-overlay-no-rows-wrapper .mstr-rc-screen-with-icon');
    }

    getCreateNewReport() {
        return this.$('//li[contains(@class,"mstrd-MenuItem mstrd-CreateDossierDropdownMenuContainer-create-report")]');
    }

    getCreateNewDossierLoadingBtn() {
        return this.$('//div[contains(@class, "mstr-rc-loading-dot-icon")]');
    }

    getSwitchProjectLoadingBtn() {
        return this.$('.mstr-rc-loading-dot-icon');
    }

    getCreateNewDossierPanel() {
        return this.$('.ant-modal-content');
    }

    getActiveTab() {
        return this.getCreateNewDossierPanel().$('.ant-tabs-tabpane-active');
    }

    getActiveTabName() {
        return this.getCreateNewDossierPanel().$('.tab-view-tab.active');
    }

    getCreateNewDossierTitleBar() {
        return this.getCreateNewDossierPanel().$('.ant-modal-title');
    }

    getErrorContainer() {
        return this.$('.dossier-creator-err-container');
    }

    getProjectPicker() {
        return this.$('.projectPicker');
    }

    getDossierCreatorErrorMessage() {
        return this.$('.dossier-creator-err-msg').getText();
    }

    getCurrentProject() {
        return this.getProjectPicker().$('.ant-select-selection-item div');
    }

    getCreateNewDossierPanelFooter() {
        return this.$('.template-info-footer');
    }

    getCreateNewDossierConfirmationDialog() {
        return this.$('.confirmation-dialog');
    }

    getCreateNewDossierPanelBlankDossierBtn() {
        return this.$('.template-info-footer //button[contains(@class,"blank-dossier-btn")]');
    }

    getCreateNewDossierPanelCancelBtn() {
        return this.$('//div[@class="footer library-theme"]//button[contains(@class,"cancel-btn")]');
    }

    getCreateNewDossierPanelCreateBtn() {
        return this.$('.footer.library-theme .create-btn');
    }

    getCreateNewAgentPanelCreateBtn() {
        return this.$(
            '//div[@class="footer library-theme"]//button[@data-feature-id="dossier-creator-bottom-button-create"]'
        );
    }

    getCreateNewDossierPanelCloseBtn() {
        return this.$('//div[@class="ant-modal-content"]//span[contains(@class, "ant-modal-close-x")]');
    }

    getCreateNewDossierProjectDropdownBtn() {
        return this.$(
            '//div[contains(@class,"projectPicker library-theme")]//div[contains(@class,"project-selector")]'
        );
    }

    getCreateNewDossierProjectDropdown() {
        return this.$('//div[contains(@class,"ant-select-item-option-content")]');
    }

    getCreateNewDossierProjectDropdownOption(name) {
        return this.$(`//div[contains(@class,"ant-select-item-option-content")]//div[text()="${name}"]`);
    }

    getConfirmSwitchProjectPopup() {
        return this.$(`.mstr-react-dossier-creator-confirmation-dialog.confirmation-dialog.library-theme`);
    }

    getCreateNewDossierProjectCancelBtn() {
        return this.$('//button[contains(@class, "confirmation-dialog-cancel-button")]');
    }

    getCreateNewDossierProjectOkBtn() {
        return this.$('//button[contains(@class, "confirmation-dialog-action-button")]');
    }

    getCreateNewDossierProjectList() {
        return this.$('.rc-virtual-list-holder-inner');
    }

    getCreateNewDossierTabs() {
        return this.$('.tab-view-container').$$('.tab-view-tab');
    }

    async getCreateDossierTabNames() {
        const tabNames = [];
        const tabs = await this.getCreateNewDossierTabs();
        for (const tab of tabs) {
            tabNames.push(await tab.getText());
        }
        return tabNames;
    }

    getCreateNewDossierTabViewer(tab) {
        return this.$(`//div[contains(@class,"tab-view-container")]//div[text()="${tab}"]`);
    }

    getSearchBox(type) {
        return this.$(`//div[contains(@class,"template-${type}")]//input[contains(@class,"mstr-rc-input")]`);
    }

    async getCreateNewDossierSearchBoxData() {
        const mstrRcInput = this.$('.mstr-rc-input');
        const isDisplayed = await mstrRcInput.isDisplayed();

        if (isDisplayed) {
            return mstrRcInput;
        }

        return this.$('.ant-input');
    }

    // Returns the clear search button - either the aria-label="Clear" button or the mstr-filter-search-input-clear element
    async getClearSearchTextBtn() {
        // First try the button with aria-label="Clear"
        const clearButton = this.$('button[aria-label="Clear"]');
        if (await clearButton.isDisplayed()) {
            return clearButton;
        }

        // If not found, try the mstr-filter-search-input-clear element
        const clearInputElement = this.$('.mstr-filter-search-input-clear');
        if (await clearInputElement.isDisplayed()) {
            return clearInputElement;
        }

        // Return null if neither is displayed
        return null;
    }

    getCreateNewDossierSearchBoxTemplate() {
        return this.$('//div[contains(@class,"template-gallery")]//input[contains(@class,"mstr-rc-input")]');
    }

    getCreateNewDossierDataCertifiedToggleBtn() {
        return this.$('//div[contains(@class,"object-selector-header-certified-control")]//button');
    }

    getCertifiedControl() {
        return this.$('.object-selector-header-certified-control');
    }

    getCreateNewDossierTemplateCertifiedToggleBtn() {
        return this.$('//div[contains(@class,"certified-control library-theme")]//button');
    }

    getCreateNewDossierAddData(tname) {
        return this.$(`//div[contains(@class,"smart-explorer")]//span[text()="${tname}"]`);
    }

    getCreateNewDossierAddDataDataset() {
        return this.$('//div[contains(@class,"smart-explorer")]//span[text()="Dataset"]');
    }

    getCreateNewDossierAddDataReport() {
        return this.$('//div[contains(@class,"smart-explorer")]//span[text()="Report"]');
    }

    getCreateNewDossierAddDataSmartMode() {
        return this.$('//div[contains(@class,"mode-switcher")]/div[contains(@class,"smart-mode-icon")]');
    }

    getCreateNewDossierAddDataTreeMode() {
        return this.$('.browsing-mode-icon.template-library-theme');
    }

    getCreateNewDossierAddDataCheckbox(dname) {
        return this.$(
            `//*[text()="${dname}"]//ancestor::div[contains(@class,"ag-cell-wrapper")]//div[contains(@class,"ag-selection-checkbox")]`
        );
    }

    getDataGridContainer() {
        return this.$('.ag-root-wrapper');
    }

    getCreateNewDossierAddDataItem(dname) {
        return this.$(`//*[text()="${dname}"]//ancestor::div[contains(@class,"ag-cell ")]`);
    }

    getCreateNewDossierAddDataSort(hname) {
        return this.$(`//div[contains(@class,"ag-header-cell-label")]//span[text()="${hname}"]`);
    }

    getAddAllDatasetsCheckbox() {
        return this.$('.ag-header-select-all:not(.ag-hidden)');
    }

    getDataModifiedGridCells() {
        return this.$$('.dateModified-column');
    }

    getCreateNewDossierAddDataBody() {
        return this.$('//div[contains(@class, "ag-body-viewport")]');
    }

    getCreateNewDossierAddDataTreeView() {
        return this.$('//div[@class="ant-tree-list-holder"]');
    }

    getCreateNewDossierSelectTemplateSort(hname) {
        return this.$(`(//div[contains(@class,"ag-header-cell-label")]//span[text()="${hname}"])[2]`);
    }

    getCreateNewDossierSelectTemplate(tname) {
        return this.$(
            `//div[contains(@class,"template-gallery library-theme")]//*[contains(@class,"name") and text()="${tname}"]`
        );
    }

    getCreateNewDossierSelectTemplateGridView() {
        return this.$('//div[contains(@class,"template-view-switch")]//div[contains(@class,"grid-view-button")]');
    }

    getCreateNewDossierSelectTemplateListView() {
        return this.$('//div[contains(@class,"template-view-switch")]//div[contains(@class,"list-view-button")]');
    }

    getSelectedListViewButton() {
        return this.getCreateNewDossierPanel().$('.list-view-button.selected');
    }

    getTemplateInListView(name) {
        return this.getCreateNewDossierPanel()
            .$$('.template-name')
            .filter(async (elem) => {
                const text = await elem.getText();
                return text === name;
            })[0];
    }

    getNoResultWarning() {
        return this.getCreateNewDossierPanel().$(
            '.no-item-warning,.single-icon-illustrations-no-content-no-data-returned'
        );
    }

    getCreateNewDossierSelectTemplateInfoPanel() {
        return this.$('.main-info-container');
    }

    getCreateNewDossierSelectTemplateInfoItemList() {
        return this.$('//div[@class="info-item-list general-info"]');
    }

    getCreateNewDossierSelectTemplateInfoIcon(tname) {
        return this.$(`//div[text()="${tname}"]/..//span[contains(@class, "info-icon")]`);
    }

    getCreateNewDossierSelectTemplateInfoAuthorIcon() {
        return this.$('//div[@class="main-info-container"]//span[@class="author-icon"]');
    }

    getCreateNewDossierSelectTemplateInfoCloseIcon() {
        return this.$(
            '//div[@class="main-info-container"]//span[contains(@class,"mstr-icons-lib-icon") and contains(@style, "position")]'
        );
    }

    getCreateNewDossierSelectTemplateInfoUpdateTimestamp() {
        return this.$('.updated-icon ~div .info-string');
    }

    getCreateNewDossierSelectTemplateInfoDatasetString() {
        return this.$('//div[@class="main-info-container"]//div[contains(@class,"dataset-string")]');
    }

    getCreateNewDossierSelectTemplateInfoCreateDate() {
        return this.$('//div[contains(@class, "creator-infoitem")]//span[contains(text(), "Create")]/../..');
    }

    getCreateNewDossierSelectBlankTemplate() {
        return this.$(
            '//div[contains(@class,"template-gallery library-theme")]//div[contains(@class,"blank-dossier")]'
        );
    }

    getViewModeSelector() {
        return this.getCreateNewDossierPanel().$('.view-mode-selector');
    }

    getViewModeSelectorOptions() {
        return this.getAntDropdown().$$('.view-mode-selector-option');
    }

    getCreateNewDossierBlankDossierBtn() {
        return this.$('//button[contains(@class,"blank-dossier-btn")]');
    }

    getCreateNewDossierBlankDossierDontShowMeAgain() {
        return this.$('//div[contains(@class, "contentWrapper")]//span[contains(@class, "mstrmojo-CheckBox")]');
    }

    getCreateNewDossierFolderInTreeView(fname) {
        return this.$(`//div[contains(@class, "ant-tree-list")]//span[@title="${fname}"]`);
    }

    getCreateNewDossierFolderIconInTreeView(fname) {
        return this.$(`//span[@title="${fname}"]/..//span[contains(@class, "ant-tree-switcher-icon")]`);
    }

    getCreateNewDossierFolderInAgGrid(fname) {
        return this.$(`//div[contains(@class, "ag-center-cols-container")]//*[text()="${fname}"]`);
    }

    getCreateNewDossierAutoResize() {
        return this.$('//span[text()="Auto Resize"]');
    }

    getCreateNewDossierColumns() {
        return this.$('//span[@class="ag-side-button-label" and text()="Columns"]');
    }

    getCreateNewDossierColumnsItem(cname) {
        return this.$(`//div[contains(@class, "ag-column-select-column")]//span[text()="${cname}"]`);
    }

    getCreateNewDossierItemTooltip() {
        return this.$('//div[contains(@class, "ag-tooltip ag-ltr ag-popup-child ag-keyboard-focus")]');
    }

    getCreateNewDossierFooter() {
        return this.$('//footer[@class="template-info-footer"]');
    }

    getCreateNewDossierAuthoringViToolbarTitle() {
        return this.$('//div[contains(@class,"item mstr-macro-texts")]');
    }

    getCreateNewDossierConsumptionViToolbarTitle() {
        return this.$('//div[contains(@class,"mstrd-DossierTitle")]');
    }

    getLibraryHomeDossierContent(name) {
        return this.$(
            `//div[@class="mstrd-DossierItem-name-text" and text()="${name}"]//ancestor::div[contains(@class,"mstrd-DossiersListContainer-dossierPositioner")]/div/div`
        );
    }

    getLibraryHomeDossierContentTemplateIcon() {
        return this.$('//div[@class="mstrd-TemplateIcon"]');
    }

    getLibraryHomeDossierContentTemplateIconHoverTooltip() {
        return this.$('//div[@class="ant-tooltip-inner" and contains(text(),"Set as Dossier Template")]');
    }

    getLibraryHomeDossierContentRecommendationsMainInfo() {
        return this.$('//div[@class="mstrd-RecommendationsMainInfo-top"]');
    }

    getLibraryHomeDossierContentRecommendationsInfoIcon() {
        return this.$('//div[contains(@class,"mstrd-DossierInfoIcon")]');
    }

    getLibraryHomeSearchDossierContent(name) {
        return this.$(`//span[text()="${name}"]//ancestor::div[contains(@class,"mstrd-SearchResultListItem-inner")]`);
    }

    getLibraryHomeSearchDossierContentRecommendationsInfoIcon() {
        return this.$('//span[@class="mstrd-DossierInfoIcon-icon"]');
    }

    getLibraryHomeSearchDossierContentRecommendationsMainInfo() {
        return this.$('//div[@class="mstrd-RecommendationsMainInfo-top"]');
    }

    getLibraryHomeServerErrorOkBtn() {
        return this.$('//div[@class="mstrd-ActionLinkContainer-text" and text()="OK"]');
    }

    getLibraryHomeShareBtn() {
        return this.$('//div[@class="mstr-nav-icon icon-tb_share_n"]');
    }

    getLibraryHomeShareMenu(menu) {
        return this.$(`//span[@class="mstr-menu-content" and text()="${menu}"]`);
    }

    getLibraryHomeShareDossierTemplateCoverImage() {
        return this.$('//div[@class="mstrd-ShareDossierContainer-imageHolder"]');
    }

    getLibraryHomeShareDossierPanel() {
        return this.$('//div[@class="mstrd-ShareDossierContainer-main"]');
    }

    getLibraryHomeShareDossierPanelCloseBtn() {
        return this.$('//span[@class="icon-pnl_close"]');
    }

    getDefaultTemplateWarningMessageCancelBtn() {
        return this.$('//div[contains(@class,"unset-cancel-btn")]');
    }

    getDefaultTemplateWarningMessageOkBtn() {
        return this.$('//div[contains(@class,"unset-ok-btn")]');
    }

    getLibraryDossierEditIcon() {
        return this.$('//div[contains(@class, "icon-info_edit")]');
    }

    getLibraryDossierResetIcon() {
        return this.$('//div[contains(@class, "mstrd-SliderConfirmDialog-icon")]');
    }

    getLibraryDossierResetIconYes() {
        return this.$('//button[contains(@class, "mstrd-ConfirmationDialog-button") and (text()="Yes")]');
    }

    getLibraryDossierFirstElement() {
        return this.$('(//div[@class="mstrd-DossierItem"])[1]');
    }

    getLibraryDossierContextMenu() {
        return this.$('(//*[contains(@class, "ContextMenu-menu")])[1]');
    }

    getLibraryDossierContextMenuFavorite() {
        return this.$('(//*[contains(@class, "ContextMenu-item")]//*[contains(text(), "Favorite")])[1]');
    }

    getLibraryDossierContextMenuItem() {
        return this.$('.ant-dropdown-menu-title-content');
    }

    getLibraryToolbarTooltip(num) {
        return this.$(`(//*[contains(@class, "mstrd-Tooltip")])[${num}]`);
    }

    getLibraryToolbarHome() {
        return this.$('//a[contains(@class, "LibraryNavItem")]');
    }

    getLibraryToolbarPulldown() {
        return this.$('//div[contains(@class, "mstrd-SortContainer-content")]');
    }

    getLibraryToolbarPulldownList() {
        return this.$('//div[contains(@class, "mstrd-SortDropdown")]');
    }

    getLibraryToolbarPulldownOption(text) {
        return this.$(`//div[contains(@class, "mstrd-SortDropdown")]//*[text()="${text}"]`);
    }

    getLibraryToolbarFilter() {
        return this.$('//*[contains(@class, "icon-tb_filter")]');
    }

    getLibraryToolbarSearchBox() {
        return this.$('//*[contains(@class, "mstrd-SearchBox")]');
    }

    getLibraryToolbarMultiSelect() {
        return this.$('//div[contains(@class, "SelectionModeNavItemContainer-icon")]');
    }

    getLibraryToolbarAccount() {
        return this.$('//li[contains(@class, "AccountNavItemContainer")]');
    }

    getAddButton() {
        return this.$('//div[contains(@class,"mstrd-CreateDossierNavItemContainer-ico")]');
    }

    async getAddButtonCSSProperty(property) {
        const propertyResult = await this.getAddButton().getCSSProperty(property);
        return propertyResult.value;
    }

    async getAddButtonColor() {
        return await this.getAddButtonCSSProperty('color');
    }

    getToolbarButton(text) {
        return this.$(`//div[@class='btn']//*[text()="${text}"]/..`);
    }

    getToolbarMenu(text) {
        return this.$(`//div[@class='mtxt' and contains(text(), "${text}")]`);
    }

    getDefaultTemplateWarningMessage() {
        return this.$("//div[contains(@class,'unset-project-default-template-warning')]");
    }

    getAuthoringFileMenu() {
        return this.$("//div[contains(@class,'mstrmojo-ListBase mstrmojo-ui-Menu unselectable  vi-toolbarMenu')]");
    }

    getAuthoringDossierVIToolbarTitle() {
        return this.$("//div[contains(@class,'item mstr-macro-texts')]");
    }

    getTemplateItemNameElementInGridView(index) {
        return this.$(`.template-item:nth-child(${index + 1}) .name`);
    }

    async getTemplateItemNameInGridView(index) {
        return await this.getTemplateItemNameElementInGridView(index).getText();
    }

    // get row data in Add Data tab -> Report
    async getDataGridRow(index) {
        return await this.$(`.ag-center-cols-container .ag-row:nth-child(${index + 1})`);
    }
    // get row data in Select a Template tab -> List View
    async getTemplateListRow(index) {
        return await this.$(`.template-gallery .ag-center-cols-container .ag-row:nth-child(${index + 1})`);
    }

    getWarningMessageElement() {
        return this.$('.unset-warning-popup-text');
    }

    async getWarningMessageText() {
        return await this.getWarningMessageElement().getText();
    }

    // Locators for Cubes tab in Report Creator

    getCubeFlatGrid() {
        return this.getActiveTab().$('.ag-center-cols-viewport');
    }

    getCubeGridNameCells() {
        return this.getCubeFlatGrid().$$('.ag-cell[col-id="name"]');
    }

    getCubeGridNameCell({ name, index = 0 }) {
        if (name) {
            return this.getCubeGridNameCells().filter(async (elem) => {
                const text = await elem.getText();
                return text === name;
            })[index];
        }
        return this.getCubeGridNameCells()[index];
    }

    getCubeGridRows() {
        return this.getCubeFlatGrid().$$('.ag-row');
    }

    getCubeGridRow({ name, index = 0 }) {
        if (name) {
            return this.getCubeGridRows().filter(async (elem) => {
                const text = await elem.$('.ag-cell[col-id="name"]').getText();
                return text === name;
            })[index];
        }
        return this.getCubeGridRows()[index];
    }

    async switchToTemplateTab(language = Locales.English) {
        await this.switchTabViewer(ReportCreatorStringLabels[language].TemplateTabHeader);
    }

    // Report MDX Source related

    async switchToMdxSourceTab(language = Locales.English) {
        await this.switchTabViewer(ReportCreatorStringLabels[language].MDXSourceTabHeader);
        await this.sleep(500);
        await this.mdxSourceSelector.waitForLoading();
    }

    // Report Cubes related

    async switchToCubesTab(language = Locales.English) {
        await this.switchTabViewer(ReportCreatorStringLabels[language].CubesTabHeader);
        await this.sleep(500);
        await this.waitForElementInvisible(this.getSwitchProjectLoadingBtn());
    }

    async selectReportCube({ name, index = 0, isWait = true }) {
        const isSelectedPrev = await this.isAiraSelected(this.getCubeGridRow({ name, index }));
        await this.click({ elem: await this.getCubeGridNameCell({ name, index }) });
        if (!isWait) return;
        await this.waitForCondition(async () => {
            const isSelected = await this.isAiraSelected(this.getCubeGridRow({ name, index }));
            return isSelectedPrev !== isSelected;
        });
        await this.sleep(1000);
    }

    // Tempelate Panel Actions
    async waitTemplateLoading() {
        await this.waitForElementInvisible(this.getCreateNewDossierLoadingBtn());
    }

    async createNewDossier() {
        await this.click({ elem: this.getAddButton() });
        await this.click({ elem: this.getCreateNewDossier() });
        await this.waitTemplateLoading();
    }

    async createNewReport() {
        await this.click({ elem: this.getAddButton() });
        await this.click({ elem: this.getCreateNewReport() });
        await this.waitTemplateLoading();
    }

    async searchData(inputText) {
        await this.clearSearchData();
        const searchBox = await this.getCreateNewDossierSearchBoxData();
        await searchBox.addValue(inputText);
        await this.waitForTextPresentInElementValue(searchBox, inputText);
        await this.sleep(2000); // wait for search results to refresh
    }

    async clearSearchData() {
        const clearBtn = await this.getClearSearchTextBtn();
        if (clearBtn) {
            await this.click({ elem: clearBtn });
        }
        const searchBox = await this.getCreateNewDossierSearchBoxData();
        await this.waitForTextPresentInElementValue(searchBox, '');
    }

    async searchTemplate(inputText) {
        await this.searchData(inputText);
    }

    async clearSearchTemplate() {
        await this.clearSearchData();
    }

    async clickDatasetCheckbox(datasetArray) {
        for (const dataset of datasetArray) {
            await this.sleep(1000);
            await this.click({ elem: this.getCreateNewDossierAddDataCheckbox(dataset) });
        }
    }
    async searchSelectAndCreateDossier(datasetArray) {
        for (const dataset of datasetArray) {
            await this.searchData(dataset);
            // await this.sleep(1000); // add sleep to ensure the dataset can be selected successfully
            const checkbox = this.getCreateNewDossierAddDataCheckbox(dataset);
            await checkbox.waitForClickable({ timeout: 5000 }); // wait for the checkbox to be clickable
            await this.clickDatasetCheckbox([dataset]);
        }
        await this.clearSearchData();
        await this.clickCreateButton();
    }

    async switchToDatasetTab() {
        await this.click({ elem: this.getCreateNewDossierAddDataDataset() });
    }

    async switchProjectByName(projectName) {
        await this.click({ elem: this.getCreateNewDossierProjectDropdownBtn() });
        await this.hover({ elem: this.getCreateNewDossierTitleBar() });
        await this.sleep(500); // wait for tooltip disappear
        await this.click({ elem: this.getCreateNewDossierProjectDropdownOption(projectName) });
    }

    async cancelSwitchProject() {
        console.log('Cancel switch project');
        await this.click({ elem: this.getCreateNewDossierProjectCancelBtn() });
    }

    async confirmSwitchProject() {
        console.log('Confirm switch project');
        await this.click({ elem: this.getCreateNewDossierProjectOkBtn() });
        await this.waitForElementInvisible(this.getSwitchProjectLoadingBtn());
    }

    async switchTabViewer(type) {
        console.log('Add Data or Select a Template');
        await this.click({ elem: this.getCreateNewDossierTabViewer(type) });
    }

    async switchToReportTab() {
        console.log('Switch to Add Report tab');
        await this.click({ elem: this.getCreateNewDossierAddDataReport() });
        await this.waitTemplateLoading();
    }

    async switchAddDataTab(tab) {
        console.log('Switch tab');
        await this.click({ elem: this.getCreateNewDossierAddData(tab) });
        await this.waitTemplateLoading();
    }

    async toggleCertifiedOnlyForData() {
        console.log('Toggle Certified Only');
        await this.click({ elem: this.getCreateNewDossierDataCertifiedToggleBtn() });
        await this.sleep(1000);
    }

    async toggleCertifiedOnlyForTemplate() {
        console.log('Toggle Certified Only');
        await this.click({ elem: this.getCreateNewDossierTemplateCertifiedToggleBtn() });
    }

    async switchToSmartMode() {
        console.log('Switch to smart mode');
        await this.click({ elem: this.getCreateNewDossierAddDataSmartMode() });
    }

    async switchToTreeMode() {
        console.log('Switch to tree mode');
        await this.click({ elem: this.getCreateNewDossierAddDataTreeMode() });
    }

    async expandTreeView(folderName, nextLevelFolder) {
        console.log('Expand the folder in tree view and wait for the next level folder show up');
        await scrollIntoView(this.getCreateNewDossierFolderInTreeView(folderName));
        await this.click({ elem: this.getCreateNewDossierFolderIconInTreeView(folderName) });
        await this.waitForElementVisible(this.getCreateNewDossierFolderInTreeView(nextLevelFolder));
        await this.waitTemplateLoading();
    }

    async doubleClickOnTreeView(folderName) {
        console.log('Double click on the folder in tree view');
        await scrollIntoView(this.getCreateNewDossierFolderInTreeView(folderName));
        await this.doubleClick({ elem: this.getCreateNewDossierFolderInTreeView(folderName) });
        await this.waitTemplateLoading();
    }

    async doubleClickOnAgGrid(folderName) {
        console.log('Double click on the folder in ag grid');
        await this.doubleClick({ elem: this.getCreateNewDossierFolderInAgGrid(folderName) });
        await this.waitTemplateLoading();
        // await this.sleep(1000);
        await this.waitForElementInvisible(this.getCreateNewDossierFolderInAgGrid(folderName));
    }

    async clickNameCheckbox() {
        console.log('Check all datasets in the folder');
        await this.click({ elem: this.getAddAllDatasetsCheckbox() });
    }

    async sortDataByHeaderName(headerName) {
        console.log('Sort the data by header name');
        await this.click({ elem: this.getCreateNewDossierAddDataSort(headerName) });
    }

    async sortTemplateByHeaderName(headerName) {
        console.log('Sort the template by header name');
        await this.click({ elem: this.getCreateNewDossierSelectTemplateSort(headerName) });
    }

    async selectTemplate(templateName) {
        console.log('Select template');
        const isListView = await this.getSelectedListViewButton().isDisplayed();
        if (!isListView) {
            await this.click({ elem: this.getCreateNewDossierSelectTemplate(templateName) });
            return;
        }
        await this.click({ elem: this.getTemplateInListView(templateName) });
    }

    async selectViewMode(isPauseMode = true) {
        await this.dismissTooltipsByClickTitle();
        await this.click({ elem: this.getViewModeSelector() });
        await this.hover({ elem: this.getCreateNewDossierTitleBar() });
        await this.sleep(500); // wait for tooltip disappear
        if (isPauseMode) {
            await this.click({ elem: this.getViewModeSelectorOptions()[0] });
        } else {
            await this.click({ elem: this.getViewModeSelectorOptions()[1] });
        }
        await this.waitForElementInvisible(this.getAntDropdown());
        await this.sleep(500);
    }

    async selectPauseMode() {
        await this.selectViewMode(true);
    }

    async selectExecutionMode() {
        await this.selectViewMode(false);
    }

    async clickCreateButton() {
        await this.click({ elem: this.getCreateNewDossierPanelCreateBtn() });
        await this.waitForElementInvisible(this.getCreateNewDossierPanel());
    }

    async clickCreateButtonInNewAgentPanel() {
        await this.click({ elem: this.getCreateNewAgentPanelCreateBtn() });
        await this.waitForElementInvisible(this.getCreateNewDossierPanel());
    }

    async cancelCreateButton() {
        console.log('Cancel create dossier');
        await this.click({ elem: this.getCreateNewDossierPanelCancelBtn() });
        await this.waitForElementInvisible(this.getCreateNewDossierPanel());
    }

    async closeNewDossierPanel() {
        await this.click({ elem: this.getCreateNewDossierPanelCloseBtn() });
        await this.waitForElementInvisible(this.getCreateNewDossierPanel());
    }

    async createBlankTemplate() {
        console.log('Create Blank Template');
        await this.click({ elem: this.getCreateNewDossierSelectBlankTemplate() });
    }

    async clickBlankDossierBtn() {
        console.log('Create Blank Dossier');
        await this.click({ elem: this.getCreateNewDossierBlankDossierBtn() });
        const isDisplayed = await this.getCreateNewDossierPanel().isDisplayed();
        if (!isDisplayed) return;
        await this.click({ elem: this.getCreateNewDossierBlankDossierDontShowMeAgain() });
    }

    async checkTemplateInfo(templateName) {
        await this.click({ elem: this.getCreateNewDossierSelectTemplateInfoIcon(templateName) });
        await this.sleep(2000);
        await this.waitForElementVisible(this.getCreateNewDossierSelectTemplateInfoAuthorIcon());
    }

    async closeTemplateInfo() {
        await this.click({ elem: this.getCreateNewDossierSelectTemplateInfoCloseIcon() });
        await this.waitForElementInvisible(this.getCreateNewDossierSelectTemplateInfoPanel());
    }

    async switchToGridView() {
        console.log('Switch to grid view');
        await this.click({ elem: this.getCreateNewDossierSelectTemplateGridView() });
    }

    async switchToListView() {
        console.log('Switch to list view');
        await this.click({ elem: this.getCreateNewDossierSelectTemplateListView() });
    }

    async autoResize() {
        await this.click({ elem: this.getCreateNewDossierAutoResize() });
    }

    async ShowOrHideColumns(columnNames) {
        await this.click({ elem: this.getCreateNewDossierColumns() });
        for (const columnName of columnNames) {
            await this.click({ elem: this.getCreateNewDossierColumnsItem(columnName) });
        }
    }

    async ShowOrHideColumnsSetting() {
        await this.click({ elem: this.getCreateNewDossierColumns() });
    }

    async fakeUpdateTimestamp() {
        await this.fakeElementText(this.getCreateNewDossierSelectTemplateInfoUpdateTimestamp());
    }

    async fakeDateModifiedColumns() {
        await this.getDataModifiedGridCells().map(async (gridCell) => {
            await this.fakeElementText(gridCell);
        });
    }

    // Tempelate in dashboard Actions
    async clickOnToolMenu(name) {
        await this.click({ elem: this.getToolbarButton(name) });
    }

    async clickOnToolSubMenu(name) {
        await this.click({ elem: this.getToolbarMenu(name) });
    }

    async cancelDefaultTemplate() {
        await this.click({ elem: this.getDefaultTemplateWarningMessageCancelBtn() });
    }

    async dismissTooltipsByClickTitle() {
        await this.hover({ elem: this.getCreateNewDossierTitleBar() });
        await this.sleep(1000);
    }

    async resetLocalStorage() {
        await this.executeScript(() => {
            localStorage.removeItem('/MicroStrategyLibrary/mstrProjectSelection');
            localStorage.removeItem('/MicroStrategyLibrary/mstrDossierCreateSourceTab');
            localStorage.removeItem('/MicroStrategyLibrary/mstrReportCreateSourceTab');
            localStorage.removeItem('/MicroStrategyLibrary/mstrReportViewMode');
        });
    }

    /**
     * Checks if the blank template is currently selected
     * @returns {Promise<boolean>} - Returns true if the blank template is selected
     */
    async isBlankTemplateSelected() {
        // Check if we're on the template selection tab
        const selectedTemplateElement = await this.$('.template-item.selected');
        if (!selectedTemplateElement) {
            return false;
        }

        // Method 1: Check if the blank template image is in the selected template
        const hasBlankDossierClass = await selectedTemplateElement.$('.blank-dossier').isExisting();
        if (hasBlankDossierClass) {
            return true;
        }

        // Method 2: Check if the name is "Blank"
        const nameElement = await selectedTemplateElement.$('.name');
        if (nameElement) {
            const templateName = await nameElement.getText();
            return templateName === 'Blank';
        }

        return false;
    }

    async getTemplateNamesInGridView() {
        const templateNames = [];
        const templateElements = await this.getTemplateItemsInGridView();
        for (const templateElement of templateElements) {
            const nameElement = await templateElement.$('.name');
            if (nameElement) {
                const templateName = await nameElement.getText();
                templateNames.push(templateName);
            }
        }
        return templateNames;
    }

    /**
     * Gets the name of the currently selected template
     * @returns {Promise<string>} - Returns the name of the selected template or null if none is selected
     */
    async getSelectedTemplateNameInGridView() {
        const selectedTemplateElement = await this.$('.template-item.selected');
        if (!selectedTemplateElement) {
            return null;
        }

        // Try to get the name from the data-itemname attribute first
        const nameElement = await selectedTemplateElement.$('.name');
        if (nameElement) {
            try {
                // Method 1: Get from data-itemname attribute (most reliable)
                const dataItemName = await nameElement.getAttribute('data-itemname');
                if (dataItemName) {
                    return dataItemName;
                }

                // Method 2: Get from the text content
                const templateName = await nameElement.getText();
                if (templateName) {
                    return templateName;
                }
            } catch (error) {
                console.log('Error getting template name:', error);
            }
        }

        // If we couldn't get the name, return null
        return null;
    }

    /**
     * Checks if a specific template is selected by name
     * @param {string} templateName - The name of the template to check
     * @returns {Promise<boolean>} - Returns true if the specified template is selected
     */
    async isTemplateSelectedInGridView(templateName) {
        const currentlySelectedTemplate = await this.getSelectedTemplateNameInGridView();
        return currentlySelectedTemplate === templateName;
    }

    /**
     * Checks if all datasets are selected in the dataset grid
     * @returns {Promise<boolean>} - Returns true if all datasets are selected
     */
    async isAllDatasetChecked() {
        // Get the "Name" header checkbox (Select All checkbox)
        const selectAllCheckbox = await this.getAddAllDatasetsCheckbox();
        if (!selectAllCheckbox) {
            return false;
        }

        // Check if the checkbox wrapper has the "ag-checked" class
        const checkboxWrapper = await selectAllCheckbox.$('.ag-checkbox-input-wrapper');
        if (!checkboxWrapper) {
            return false;
        }

        // If the wrapper has the "ag-checked" class, all datasets are selected
        const classAttribute = await checkboxWrapper.getAttribute('class');
        return classAttribute.includes('ag-checked');
    }

    /**
     * Gets the selection count text from the footer
     * @returns {Promise<string>} - The selection count text from the footer
     */
    async getSelectionCountText() {
        const selectionCountElement = await this.$('.template-info-selection-count');
        if (selectionCountElement) {
            return await selectionCountElement.getText();
        }
        return '';
    }

    /**
     * Gets the count of all datasets from the selection count text
     * @returns {Promise<number>} - The number of selected datasets
     */
    async getSelectedDatasetsCount() {
        const selectionText = await this.getSelectionCountText();
        // Extract the number from text like "148 selected"
        const match = selectionText.match(/(\d+)/);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
        return 0;
    }

    /**
     * Checks if datasets are ordered by date created in ascending order
     * @returns {Promise<boolean>} - Returns true if datasets are ordered by date created in ascending order
     */
    async isDataSetsOrderedByDateCreatedAscending() {
        // Check if the Date Created column has the ascending sort indicator
        const dateCreatedHeader = await this.$(
            '//div[contains(@class,"ag-header-cell")][.//span[text()="Date Created"]]'
        );
        if (!dateCreatedHeader) {
            return false;
        }

        // Check if the header has the ascending sort class
        const sortContainer = await dateCreatedHeader.$('.ag-header-cell-sorted-asc');
        return await sortContainer.isExisting();
    }

    /**
     * Gets the column headers from the template list grid
     * @returns {Promise<string[]>} Array of header names
     */
    async getTemplateListHeaders() {
        // Find all header cell text elements
        const headerElements = await this.$$('.ag-header-cell-text');
        const headers = [];

        // Extract text from each header element
        for (const headerElement of headerElements) {
            const headerText = await headerElement.getText();
            if (headerText) {
                headers.push(headerText);
            }
        }

        return headers;
    }

    async getRowCountInTemplateList() {
        const rowCount = await this.$$('.ag-center-cols-container').length;
        return rowCount;
    }

    async getRowDataInListView(index, functionName) {
        const row = await functionName(index);
        if (!row) {
            return [];
        }

        // Get all cells in this row
        const cells = await row.$$('.ag-cell');
        const cellValues = [];

        // Extract text from each cell
        for (const cell of cells) {
            // For certified column, check if it has the certified icon
            const certifiedIcon = await cell.$('.object-selector-icon');
            if (certifiedIcon && (await certifiedIcon.isExisting())) {
                cellValues.push('Certified');
                continue;
            }

            // For all other cells, get the text directly
            const text = await cell.getText();
            if (text) {
                cellValues.push(text);
            }
        }

        return cellValues;
    }

    /**
     * Gets the text values from a specific row in the template list grid by iterating all columns
     * @param {number} index The zero-based index of the row to get text from
     * @returns {Promise<string[]>} Array of cell text values from the row
     */
    async getRowDataInTemplateListView(index) {
        // Get the row at the specified index
        // const row = await this.$(
        //     `(//div[contains(@class,"ag-center-cols-container")]//div[contains(@class, "ag-row")])[${index + 1}]`
        // );
        return await this.getRowDataInListView(index, (i) => this.getTemplateListRow(i));
    }

    async getRowDataInAddDataTab(index) {
        return await this.getRowDataInListView(index, (i) => this.getDataGridRow(i));
    }

    /**
     * Gets all template items in the grid
     * @returns {Promise<WebdriverIO.ElementArray>} Array of template item elements
     */
    getTemplateItemsInGridView() {
        return this.$$('.template-item');
    }

    /**
     * Gets the count of template items in the grid
     * @returns {Promise<number>} Count of template items
     */
    async getTemplateItemsCntInGridView() {
        const items = await this.getTemplateItemsInGridView();
        return items.length;
    }
    /**
     * Checks if all templates in the gallery are certified
     * @returns {Promise<boolean>} True if all templates are certified, false otherwise
     */
    async isAllTemplateCertified() {
        // Get all template items in the gallery
        const templateItems = await this.getTemplateItemsInGridView();
        if (!templateItems || templateItems.length === 0) {
            return false;
        }

        // Check each template item for the certification icon
        for (const templateItem of templateItems) {
            // Look for the certification icon within this template item
            const certifiedIcon = await templateItem.$('.single-icon-common-certify-certified-orange');

            // If any template doesn't have a certification icon or it's not visible, return false
            if (!certifiedIcon || !(await certifiedIcon.isExisting())) {
                return false;
            }
        }

        // All templates are certified
        return true;
    }

    async isNoDataDisplayed() {
        const noDataText = await this.getNoDataOverlay().getText();
        return noDataText === 'No Data';
    }

    /**
     * Checks if a specific row in the data grid is selected
     * @param {number} index The zero-based index of the row to check
     * @returns {Promise<boolean>} True if the row is selected, false otherwise
     */
    async isDataSelected(index) {
        // Get the row at the specified index using CSS selector
        const row = await this.getDataGridRow(index);
        if (!row) {
            return false;
        }
        // Check if the row has the selected class
        const classAttribute = await row.getAttribute('class');
        const hasSelectedClass = classAttribute.includes('ag-row-selected');
        if (!hasSelectedClass) {
            return false;
        }
        // Check if the row has the aria-selected attribute set to true
        const ariaSelected = await row.getAttribute('aria-selected');
        return ariaSelected === 'true';
    }

    async getTemplateInfoData() {
        return {
            author: await this.$('.main-info-container .author-icon ~ div .info-string').getText(),
            updateTime: await this.$('.main-info-container .updated-icon ~ div .info-string').getText(),
            createDate: await this.$('.main-info-container .icon-misc-created-light ~ div .info-string').getText(),
            dataset: await this.$('.main-info-container .dataset-icon ~ div .info-string').getText(),
            sectionInfo: await this.$(
                '.main-info-container .detail-info .mstr-icons-lib-icon ~ div .info-string'
            ).getText(),
        };
    }

    async isTemplateHasCoverImageInListView(templateName) {
        // Find the template row by name
        const templateRow = await this.$(
            `//div[contains(@class,"ag-center-cols-container")]//span[contains(@class,"template-name") and text()="${templateName}"]//ancestor::div[contains(@class,"ag-row")]`
        );
        // Check for custom image (img element with template-image class)
        const customImage = await templateRow.$('.cover-image-container img.template-image');
        const hasCustomImage = await customImage.isExisting();

        if (hasCustomImage) {
            return true;
        }

        return false;
    }

    async isTemplateHasCoverImageInGridView(templateName) {
        // Find the template item by name in grid view
        const templateItem = await this.$(
            `//div[contains(@class,"template-item")]//div[contains(@class,"name") and text()="${templateName}"]//ancestor::div[contains(@class,"template-item")]`
        );
        // Check for custom image (img element with template-image class)
        const customImage = await templateItem.$('.img-container img.template-image');
        const hasCustomImage = await customImage.isExisting();

        if (hasCustomImage) {
            return true;
        }

        return false;
    }

    async isCreateButtonEnabled() {
        const isEnabled = await this.getCreateNewDossierPanelCreateBtn().isEnabled();
        return isEnabled;
    }

    async isConfirmSwitchProjectPopupDisplayed() {
        const isDisplayed = await this.getConfirmSwitchProjectPopup().isDisplayed();
        return isDisplayed;
    }

    async getActiveTabHeaderText() {
        const text = await this.getActiveTabName().getText();
        return text;
    }
}
