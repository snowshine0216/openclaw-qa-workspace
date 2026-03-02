import BaseLibrary from '../base/BaseLibrary.js';
import DossierPage from '../dossier/DossierPage.js';
import LibraryPage from './LibraryPage.js';

export const ascendingSortClasses = ['icon-sort_a-z', 'icon-sort_ascending'];
export const ascendingTxt = 'ascending';
export const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;

// for old List View implementation (still used in mobile)
// info window objects for list view (new and old) are also written on this page
export default class ListView extends BaseLibrary {
    constructor() {
        super();
        this.libraryPage = new LibraryPage();
        this.dossierPage = new DossierPage();
    }

    // Element locator
    getLibraryViewContainer() {
        return this.$('.mstrd-LibraryViewContainer');
    }

    getViewModeSwitch() {
        return this.$('.mstrd-NavBarViewModeSwitch-segmentedControl');
    }

    getViewModeSwitchGridViewOption() {
        return this.getViewModeSwitch().$('.icon-view_grid');
    }

    getViewModeSwitchListViewOption() {
        return this.getViewModeSwitch().$('.icon-view_list');
    }

    getListViewButtonForMobile() {
        return this.$('.mstrd-NavBarViewModeSwitch .icon-tb_resp_listview');
    }

    getGridViewButtonForMobile() {
        return this.$('.mstrd-NavBarViewModeSwitch .icon-tb_resp_gridview');
    }

    getDossiersListViewContainer() {
        // This is the only locator I found that can get the list view container for library home, mobile view and content discovery pane at the same time
        return this.$('#mstrd-Root .mstrd-DossiersListContainer');
    }

    getMoreOptionInIW() {
        return this.$('.icon-group_options.mstr-menu-icon');
    }

    getEditOptionInIW() {
        return this.$('.mstrd-WebEditIcon.icon-info_edit');
    }

    getMoreOptiobDropDownInIW() {
        return this.$('.mstrd-ExtraButtonsDropdown-popover');
    }

    getItemsInMoreDropdown() {
        return this.getMoreOptiobDropDownInIW().$$('.mstr-menu-icon');
    }

    getItem(name, isMobileView = false) {
        return this.getItems(isMobileView).filter(async (elem) => {
            const dossierItem = elem.$(isMobileView ? '.mstrd-DossierItem-name' : '.mstrd-DossierItemRow-name');
            const dossierName = await dossierItem.getText();
            return dossierName.includes(name);
        })[0];
    }

    getDossierItem(name, isMobileView = false) {
        return this.getItem(name, isMobileView).$(
            isMobileView ? '.mstrd-DossierItem-name' : '.mstrd-DossierItemRow-name'
        );
    }

    getItems(isMobileView = false) {
        return this.getDossiersListViewContainer()
            .$$(isMobileView ? '.mstrd-DossierItem' : '.ag-row')
            .filter(async (elem) => {
                const dossierItem = elem.$(isMobileView ? '.mstrd-DossierItem-name' : '.mstrd-DossierItemRow-name');
                const isItemPresent = await dossierItem.isDisplayed();
                return isItemPresent;
            });
    }

    getItemRowActionBar(name) {
        return this.getItem(name).$('.mstrd-DossierRowActionBar');
    }

    getSingleSelectCheckbox(name) {
        return this.getItem(name).$('.ag-checkbox-input');
    }

    getSelectAllCheckbox() {
        return this.getDossiersListViewContainer().$('.ag-header-select-all:not(.ag-hidden)');
    }

    getDossierEditIcon(name, isMobileView = false) {
        return this.getItem(name, isMobileView).$('.mstrd-WebEditIcon');
    }

    getDossierShareIcon(name, isMobileView = false) {
        return this.getItem(name, isMobileView).$('.icon-info_share');
    }

    getDossierDownloadIcon(name, isMobileView = false) {
        return this.getItem(name, isMobileView).$('.icon-info_pdf');
    }

    getDossierResetIcon(name, isMobileView = false) {
        return this.getItem(name, isMobileView).$('.mstrd-SliderConfirmDialog');
    }

    getDossierFavoriteIcon(name, isMobileView = false) {
        return this.getItem(name, isMobileView).$('.icon-mstrd_home_favorite_i');
    }

    getDossierAddToLibraryIcon(name, isMobileView = false) {
        return this.getItem(name, isMobileView).$('.icon-add-to-library');
    }

    getDossierInfoWindowButton(name, isMobileView = false) {
        return this.getItem(name, isMobileView).$('.mstrd-DossierInfoIcon');
    }

    getDossierInfoWindowIcon(name, isMobileView = false) {
        return this.getItem(name, isMobileView).$('.mstrd-DossierInfoIcon-icon');
    }

    getEnabledForAIIndicator(name) {
        return this.getItem(name).$('.mstrd-AIEnabledStatusCellRenderer>div');
    }

    getSortBar() {
        return this.$('.mstrd-SortTypeHeaderBar');
    }

    getSortBarColumnElement(columnType) {
        switch (columnType) {
            case 'name': {
                return this.getSortBar().$('.mstrd-SortTypeHeaderBar-tab--name');
            }
            case 'owner': {
                return this.getSortBar().$('.mstrd-SortTypeHeaderBar-tab--owner');
            }
            case 'date': {
                return this.getSortBar().$('.mstrd-SortTypeHeaderBar-tab--date');
            }
            case 'description': {
                return this.getSortBar().$('.mstrd-SortTypeHeaderBar-tab--desc');
            }
            default: {
                console.error(`ERROR: Finding sort bar column failed. Was looking for ${columnType}`);
                return null;
            }
        }
    }

    getSortBarIconElement(columnType) {
        return this.getSortBarColumnElement(columnType).$('.mstrd-sort-icon');
    }

    getFirstDossierName() {
        return this.getDossiersListViewContainer().$$('.mstrd-DossierItem .mstrd-DossierItem-name')[0];
    }

    async getLastDossierName() {
        const elements = await this.getDossiersListViewContainer().$$('.mstrd-DossierItemRow-name');
        return elements[elements.length - 1];
    }

    getFirstDossierOwner() {
        return this.getDossiersListViewContainer().$$('.mstrd-DossierItem .mstrd-DossierItem-username')[0];
    }

    async getLastDossierOwner() {
        const elements = await this.getDossiersListViewContainer().$$('div[col-id=createdByUserName] .ag-cell-value');
        return elements[elements.length - 1];
    }

    getFirstDossierDate() {
        return this.getDossiersListViewContainer().$$('.mstrd-DossierItem .mstrd-DossierItem-timestamp')[0];
    }

    getFirstDossierDescription() {
        return this.getDossiersListViewContainer().$$('.mstrd-DossierItem .mstrd-DossierItem-description')[0];
    }

    // filters dossiers with standard date pattern (e.g. 11/04/2022)
    getDossiersWithStandardDatePattern() {
        return this.$$('.mstrd-DossierItem').filter(async (elem) => {
            // Filter out empty item containers
            const dateLocator = elem.$('.mstrd-DossierItem-timestamp');
            const isItemPresent = await dateLocator.isDisplayed();
            if (isItemPresent) {
                return (await dateLocator.getText()).match(datePattern);
            }
        });
    }

    getFirstDossierDetailContainer() {
        return this.$$('.mstrd-DossierItem-detailContainer')[0];
    }

    getListViewInfoWindow() {
        return this.$('.mstrd-InfoPanelSidebarContainer-content');
    }

    getListViewInfoWindowMainPanel() {
        return this.$('.mstrd-RecommendationsMainInfo');
    }

    getListViewInfoWindowTop() {
        return this.$('.mstrd-RecommendationsMainInfo-top');
    }

    getListViewInfoWindowContainerForMobile() {
        return this.$('.mstrd-InfoPanelSidebarContainer-drawer');
    }

    getDossierTitle() {
        return this.getListViewInfoWindow().$('.mstrd-RecommendationsMainInfo-name');
    }

    getObjectTypeIconInListView(name, isMobileView = false) {
        return this.getItem(name, isMobileView).$('.mstrd-ObjectTypeIcon');
    }

    getObjectTypeIconInListViewInfoWindow() {
        return this.getListViewInfoWindow().$('.mstr-menu-icon');
    }

    getCertifiedIcon() {
        return this.getListViewInfoWindow().$('.mstrd-CertifiedIcon');
    }

    getCertifiedText() {
        return this.getListViewInfoWindow().$('.mstrd-RecommendationsMainInfo-certifiedText').getText();
    }

    getTagsContainer() {
        return this.getListViewInfoWindow().$('.mstrd-UnstructuredDataTags');
    }

    getItemShare() {
        return this.getListViewInfoWindow().$('.mstrd-RecommendationsMainInfo-share');
    }

    getInfoWindowActions() {
        return this.getItemShare().$$('.mstr-menu-icon');
    }

    getOwnerIcon() {
        return this.getListViewInfoWindow().$('.icon-person');
    }

    getOwnerText() {
        return this.$('.mstrd-RecommendationsMainInfo-information').$$('.mstr-menu-icon')[1].getText();
    }

    getUpdatedIcon() {
        return this.getListViewInfoWindow().$('.icon-info_updated');
    }

    getUpdatedText() {
        return this.$('.mstrd-RecommendationsMainInfo-information').$$('.mstr-menu-icon')[2].getText();
    }

    getObjectIdIcon() {
        return this.getListViewInfoWindow().$('.icon-info_object_id');
    }

    getDossierPathIcon() {
        return this.getListViewInfoWindow().$$('.content-type-icon-container')[1];
    }

    getExportPDFIcon() {
        return this.getListViewInfoWindow().$('.icon-info_pdf');
    }

    getAddToLibraryIcon() {
        return this.getListViewInfoWindow().$('.icon-add-to-library');
    }

    getFavoriteIcon() {
        return this.getListViewInfoWindow().$('.icon-mstrd_home_favorite_i');
    }

    getShareIcon() {
        return this.getListViewInfoWindow().$('.icon-info_share');
    }

    getEditIcon() {
        return this.getListViewInfoWindow().$('.icon-info_edit');
    }

    getSubscriptionIcon() {
        return this.getListViewInfoWindow().$('.icon-group_recents');
    }

    getExportExcelIcon() {
        return this.getListViewInfoWindow().$('.icon-share_excel');
    }

    getReportLinkInExcelExportWindow() {
        return this.getListViewInfoWindow().$('.mstrd-InfoWindowWithImageSection-imageHolder');
    }

    getDownloadIcon() {
        return this.getListViewInfoWindow().$('.icon-info_download');
    }

    getResetIcon() {
        return this.getListViewInfoWindow().$('.icon-info_reset');
    }

    getRemoveIcon() {
        return this.getListViewInfoWindow().$('.icon-info_delete');
    }

    getMoreMenuIcon() {
        return this.getListViewInfoWindow().$('.icon-group_options');
    }

    getRenameIcon() {
        return this.getListViewInfoWindow().$('.icon-mstrd_rename');
    }

    getCopyIcon() {
        return this.getListViewInfoWindow().$('.icon-mstrd_ai_copy');
    }

    getMoveIcon() {
        return this.getListViewInfoWindow().$('.icon-mstrd_move');
    }

    getCreateShortcutIcon() {
        return this.getListViewInfoWindow().$('.icon-mstrd_create_shortcut');
    }

    getCreateBotIcon() {
        return this.getListViewInfoWindow().$('.mstrd-RecommendationsMainInfo-createBot');
    }

    getCreateADCIcon() {
        return this.getListViewInfoWindow().$('.mstr-menu-icon-create-adc-icon');
    }

    getManageAccessIcon() {
        return this.getListViewInfoWindow().$('.icon-mstrd_manage_access');
    }

    getManageAccessDialog() {
        return this.$('.mstrd-ManageAccessContainer');
    }

    getRecommendationList() {
        return this.getListViewInfoWindow().$('.mstrd-RecommendationsList');
    }

    getBackArrow() {
        return this.getListViewInfoWindow().$('.icon-chevron-left');
    }

    getCloseIcon() {
        return this.getListViewInfoWindow().$('.icon-pnl_close');
    }

    getEmbeddedBotIcon() {
        return this.getListViewInfoWindow().$('.icon-mstrd_embed');
    }

    getBotActiveSwitch() {
        return this.getListViewInfoWindow().$('.mstrd-RecommendationsMainInfo-activeSwitch').$('.mstrd-Switch');
    }

    getCoverImageOnInfoWindow() {
        return this.getListViewInfoWindow().$('.mstrd-DefaultDataModelCoverPage');
    }

    getCertifiedIconInInfoWindow() {
        return this.getListViewInfoWindow().$('.mstrd-RecommendationsMainInfo-certifiedInfo');
    }

    getContentItemUpdatedTime(name, isMobileView = false) {
        return this.getItem(name, isMobileView).$('div[col-id*="updatedTimeFormatted"]');
    }

    getContentItemProject(name, isMobileView = false) {
        return this.getItem(name, isMobileView).$('div[col-id*="projectDisplayName"]');
    }

    getContentItemPath(name, isMobileView = false) {
        return this.getItem(name, isMobileView).$('div[col-id*="path"]');
    }

    getToggleAllSelectionCheckbox() {
        const child = this.getDossiersListViewContainer().$('.ag-input-field-input.ag-checkbox-input');
        return this.getParent(child);
    }

    getExtraButtonsDropdown() {
        return this.$('.mstrd-ExtraButtonsDropdown-popover');
    }

    getListViewGrid() {
        return this.$('.mstrd-DossiersListAGGridList');
    }

    getRemoveConfirmationDialog() {
        return this.$('.mstrd-ConfirmationDialog');
    }

    getRemoveConfirmationMessage() {
        return this.getRemoveConfirmationDialog().$('.mstrd-ConfirmationDialog-msg');
    }

    getRemoveConfirmationButton(name) {
        return this.getRemoveConfirmationDialog()
            .$$('.mstrd-ConfirmationDialog-button')
            .filter(async (elem) => {
                const buttonText = await elem.getText();
                return buttonText === name;
            })[0];
    }

    getMoreIconInMobileView(name) {
        return this.$(
            `div[aria-label="Open recommendations ${name} Dashboard"],div[aria-label="Open recommendations ${name} Data Model"] .mstrd-DossierRowMoreOptionsOpener`
        );
    }

    getListViewMoreIcon(name) {
        return this.getItem(name).$('.mstrd-DossierRowMoreOptionsOpener');
    }

    getHiddenMoreOptiobDropDownInIW() {
        return this.$(
            '.ant-popover.mstrd-ExtraButtonsDropdown-popover.ant-popover-placement-bottom.ant-popover-hidden'
        );
    }

    getInfoIconOnMobileView(name) {
        return this.$(`//div[contains(@aria-label, "Open info window for ${name}")]`);
    }

    getEnableForAIStatusContainer() {
        return this.getListViewInfoWindow().$('.mstrd-RecommendationsMainInfo-aiStatusContainer');
    }

    getEnabledForAIStatusText() {
        return this.getEnableForAIStatusContainer().$('span.mstrd-RecommendationsMainInfo-aiEnabledStatusText');
    }

    getEnableForAIIcon() {
        return this.getListViewInfoWindow().$('.mstrd-RecommendationsMainInfo-enableForAI');
    }

    getEnableForAIProcessIcon() {
        return this.getListViewInfoWindow().$('.mstrd-AgentCubeStatusIcon-ai-processing');
    }

    // Action helper

    async selectListViewMode() {
        await this.click({ elem: this.getViewModeSwitchListViewOption() });
        await this.waitForElementVisible(this.getDossiersListViewContainer());
        await this.waitForElementVisible(this.getListViewGrid());
    }

    async deselectListViewMode() {
        if (await this.isListViewModeSelected()) {
            await this.click({ elem: this.getViewModeSwitchGridViewOption() });
        }
    }

    async selectListViewModeMobile() {
        await this.click({ elem: this.getListViewButtonForMobile() });
    }

    async deselectListViewModeMobile() {
        await this.click({ elem: this.getGridViewButtonForMobile() });
    }

    async clickSortBarColumn(columnType, sortOrder) {
        if (!(await this.isSortBarColumnActive(columnType))) {
            await this.click({ elem: this.getSortBarColumnElement(columnType) });
        }

        // click again if sort order does not match the one specified in input
        if ((await this.isSortBarColumnAscending(columnType)) !== (sortOrder === ascendingTxt)) {
            await this.click({ elem: this.getSortBarColumnElement(columnType) });
        }
    }

    async clickExportPDFIcon() {
        await this.click({ elem: this.getExportPDFIcon() });
    }

    async clickBackArrow() {
        await this.click({ elem: this.getBackArrow() });
    }

    async clickCloseIcon() {
        await this.click({ elem: this.getCloseIcon() });
    }

    async hoverDossier(name, isMobileView = false) {
        await this.waitForElementVisible(this.getItem(name, isMobileView));
        await this.hover({ elem: this.getItem(name, isMobileView) });
    }

    async openDossier(name, isMobileView = false) {
        await this.waitForElementVisible(this.getItem(name, isMobileView));
        await this.click({ elem: this.getDossierItem(name, isMobileView), checkClickable: false });
        return this.libraryPage.handleError();
    }

    async rightClickToOpenContextMenu({ name, isMobileView = false, isWaitCtxMenu = true }) {
        await this.waitForElementVisible(this.getDossiersListViewContainer());
        await this.rightClick({ elem: this.getItem(name, isMobileView) });
        if (isWaitCtxMenu) {
            await this.waitForElementVisible(this.getDossierContextMenu());
        }
    }

    async openInfoWindowFromListView(name) {
        await this.hoverDossier(name);
        await this.click({ elem: this.getDossierInfoWindowIcon(name) });
        await this.waitForElementVisible(this.getDossierTitle());
    }

    async openShareFromListView(name) {
        await this.hoverDossier(name);
        await this.click({ elem: this.getDossierShareIcon(name) });
        await this.waitForElementVisible(this.$('.mstrd-ShareDossierContainer-main'));
    }

    async openInfoWindowFromMobileView(name) {
        await this.click({ elem: this.getInfoIconOnMobileView(name) });
        await this.waitForElementVisible(this.getDossierTitle());
    }

    async clickExportExcelFromIW() {
        await this.waitForElementVisible(this.getExportExcelIcon());
        await this.click({ elem: this.getExportExcelIcon() });
    }

    async openContextMenu(name) {
        await this.click({ elem: this.getListViewMoreIcon(name) });
        return this.waitForElementVisible(this.getDossierContextMenu());
    }

    // The following function can be removed once its available on "ExcelExportPanel.js" file
    async clickExportButtonOnExcelPanel() {
        const exportBtn = await this.$('.mstrd-Button--primary');
        if (await exportBtn.isDisplayed()) {
            await this.click({ elem: exportBtn });
        }
    }

    async clickEmbedBotFromIW() {
        await this.waitForElementVisible(this.getEmbeddedBotIcon());
        await this.click({ elem: this.getEmbeddedBotIcon() });
    }

    async clickDownloadDossierFromIW() {
        await this.click({ elem: this.getMoreMenuIcon() });
        await this.waitForElementVisible(this.getDownloadIcon());
        await this.click({ elem: this.getDownloadIcon() });
    }

    async clickReportLinkInExcelExportWindow() {
        await this.waitForElementVisible(this.getReportLinkInExcelExportWindow());
        await this.click({ elem: this.getReportLinkInExcelExportWindow() });
    }

    async selectItemInListView(name) {
        if (!(await this.isSingleSelectionCheckboxChecked(name))) {
            await this.click({ elem: this.getParent(this.getSingleSelectCheckbox(name)) });
        }
    }

    async deselectItemInListView(name) {
        if (await this.isSingleSelectionCheckboxChecked(name)) {
            await this.click({ elem: this.getParent(this.getSingleSelectCheckbox(name)) });
        }
    }

    async clickSelectAllFromListView() {
        const isChecked = await this.isAllSelectionCheckboxChecked();
        await this.click({ elem: this.getToggleAllSelectionCheckbox() });
        await browser.waitUntil(
            async () => {
                const currentStatus = await this.isAllSelectionCheckboxChecked();
                return currentStatus !== isChecked;
            },
            { timeout: 5000, timeoutMsg: 'Click select all did not have effect' }
        );
    }

    async clickRemoveFromInfoWindow(name) {
        await this.click({ elem: this.getMoreMenuIcon() });
        await this.waitForElementVisible(this.getRemoveIcon());
        await this.click({ elem: this.getRemoveIcon() });
        const confirmBtn = await this.$('.mstrd-Button--round.mstrd-ConfirmationDialog-button');
        await this.waitForElementVisible(confirmBtn);
        await this.click({ elem: confirmBtn });
        await this.waitForElementInvisible(this.getItem(name));
    }

    async clickMoreMenuFromIW() {
        await this.waitForElementVisible(this.getMoreMenuIcon());
        await this.click({ elem: this.getMoreMenuIcon() });
    }

    async clickExportPDFIconFromIW() {
        await this.clickMoreMenuFromIW();
        await this.click({ elem: this.getExportPDFIcon() });
    }

    async clickCreateBotFromIW() {
        await this.waitForElementVisible(this.getCreateBotIcon());
        await this.click({ elem: this.getCreateBotIcon() });
    }

    async clickCreateADCFromIW() {
        await this.click({ elem: this.getCreateADCIcon() });
    }

    async clickManageAccessFromIW() {
        if (await this.isManageAccessIconPresentInInfoWindow()) {
            await this.click({ elem: this.getManageAccessIcon() });
        } else {
            await this.clickMoreMenuFromIW();
            await this.waitForElementVisible(this.getManageAccessIcon());
            await this.click({ elem: this.getManageAccessIcon() });
        }
    }

    async clickShareFromIW() {
        await this.waitForElementVisible(this.getShareIcon());
        await this.click({ elem: this.getShareIcon() });
    }

    async clickRenameFromIW() {
        await this.waitForElementVisible(this.getRenameIcon());
        await this.click({ elem: this.getRenameIcon() });
    }

    async clickCopyFromIW() {
        await this.waitForElementVisible(this.getCopyIcon());
        await this.click({ elem: this.getCopyIcon() });
    }

    async clickMoveFromIW() {
        await this.waitForElementVisible(this.getMoveIcon());
        await this.click({ elem: this.getMoveIcon() });
    }

    async cancelRemoveFromInfoWindow() {
        await this.click({ elem: this.getRemoveConfirmationButton('No') });
    }

    async clickDeleteFromIW() {
        await this.waitForElementVisible(this.getRemoveIcon());
        await this.click({ elem: this.getRemoveIcon() });
    }

    async clickCreateShortcutFromIW() {
        await this.waitForElementVisible(this.getCreateShortcutIcon());
        await this.click({ elem: this.getCreateShortcutIcon() });
    }

    async clickDossierEditIcon(name, isMobileView = false) {
        await this.click({ elem: this.getDossierEditIcon(name, isMobileView) });
    }

    async clickContextMenuItem(item) {
        return this.libraryPage.clickDossierContextMenuItem(item);
    }

    async clickCoverImageOnInfoWindow() {
        await this.click({ elem: this.getCoverImageOnInfoWindow() });
        return this.dossierPage.waitForDossierLoading();
    }

    async enableForAI() {
        const el = this.getEnableForAIIcon();
        const featureId = await el.getAttribute('data-feature-id');
        if (featureId == 'library-item-info-enable-for-ai') {
            console.log('Enabling for AI...');
            if (await this.isEnabledForAIIconInactive()) {
                await this.waitForElementInvisible(this.getEnableForAIProcessIcon());
            }
            await this.click({ elem: this.getEnableForAIIcon() });
            await this.waitForElementAppearAndGone(this.getEnableForAIProcessIcon());
            await this.sleep(100); // wait for status update
        }
    }

    async disableForAI() {
        const el = this.getEnableForAIIcon();
        const featureId = await el.getAttribute('data-feature-id');
        if (featureId == 'library-item-info-disable-for-ai') {
            console.log('Disabling for AI...');
            if (await this.isEnabledForAIIconInactive()) {
                await this.waitForElementInvisible(this.getEnableForAIProcessIcon());
            }
            await this.click({ elem: this.getEnableForAIIcon() });
            await this.waitForElementInvisible(this.getEnableForAIStatusContainer());
        }
    }

    async hoverEnabledForAIIndicator(name) {
        await this.hover({ elem: this.getEnabledForAIIndicator(name) });
        return this.sleep(500); // wait for tooltip to appear
    }

    // Assertion helper

    async isListViewInfoWindowPresent() {
        return this.getListViewInfoWindow().isDisplayed();
    }

    async isViewModeSwitchPresent() {
        return this.getViewModeSwitch().isDisplayed();
    }

    async isListViewModeSelected() {
        await this.waitForElementVisible(this.getViewModeSwitchListViewOption());
        const attr = await this.getViewModeSwitchListViewOption().getAttribute('data-active');
        return attr === 'true';
    }

    async isListViewModeSelectedMobile() {
        return this.getGridViewButtonForMobile().isDisplayed();
    }

    async isDossiersListViewContainerPresent() {
        return this.$('.mstrd-DossiersListContainer--isListView').isDisplayed();
    }

    async isDossierEditIconPresent(name, isMobileView = false) {
        await this.hoverDossier(name, isMobileView);
        return this.getDossierEditIcon(name, isMobileView).isDisplayed();
    }

    async isDossierShareIconPresent(name, isMobileView = false) {
        await this.hoverDossier(name, isMobileView);
        return this.getDossierShareIcon(name, isMobileView).isDisplayed();
    }

    async isDossierShareIconDisabled(name, isMobileView = false) {
        await this.hoverDossier(name, isMobileView);
        return this.isAriaDisabled(this.getDossierShareIcon(name, isMobileView));
    }

    async isDossierDownloadIconPresent(name, isMobileView = false) {
        await this.hoverDossier(name, isMobileView);
        return this.getDossierDownloadIcon(name, isMobileView).isDisplayed();
    }

    async isDossierResetIconPresent(name, isMobileView = false) {
        await this.hoverDossier(name, isMobileView);
        return this.getDossierResetIcon(name, isMobileView).isDisplayed();
    }

    async isFavoritesIconPresent(name, isMobileView = false) {
        await this.hoverDossier(name, isMobileView);
        return this.getDossierFavoriteIcon(name, isMobileView).isDisplayed();
    }

    async isAddToLibraryIconPresent(name, isMobileView = false) {
        await this.hoverDossier(name, isMobileView);
        return this.getDossierAddToLibraryIcon(name, isMobileView).isDisplayed();
    }

    async isSortBarPresent() {
        return this.getSortBar().isDisplayed();
    }

    async isSortBarColumnActive(columnType) {
        const elementClasses = await this.getSortBarColumnElement(columnType).getAttribute('class');
        return elementClasses.includes('mstrd-SortTypeHeaderBar-tab--active');
    }

    async isSortBarColumnAscending(columnType) {
        const elementClass = await this.getSortBarIconElement(columnType).getAttribute('class');
        return ascendingSortClasses.some((ascendingSortClass) => elementClass.includes(ascendingSortClass));
    }

    async isNameColumnSorted(sortOrder) {
        const firstDossierName = await this.getFirstDossierName().getText();
        const lastDossierName = await (await this.getLastDossierName()).getText();
        const comparison = firstDossierName.localeCompare(lastDossierName);
        return sortOrder === ascendingTxt ? comparison <= 0 : comparison >= 0;
    }

    async isOwnerColumnSorted(sortOrder) {
        const firstDossierOwner = await this.getFirstDossierOwner().getText();
        const lastDossierOwner = await (await this.getLastDossierOwner()).getText();
        const comparison = firstDossierOwner.localeCompare(lastDossierOwner);
        return sortOrder === ascendingTxt ? comparison <= 0 : comparison >= 0;
    }

    async isDateColumnSorted(sortOrder) {
        const dossiers = await this.getDossiersWithStandardDatePattern(); // dossiers with format such as 11/04/2022
        const firstDossierDate = await dossiers[0].getText();
        const lastDossierDate = await dossiers[dossiers.length - 1].getText();
        const comparison = Date.parse(firstDossierDate) - Date.parse(lastDossierDate);
        return sortOrder === ascendingTxt ? comparison <= 0 : comparison >= 0;
    }

    async isOnOriginalInfoWindowPage() {
        return await this.getListViewInfoWindow().$('.mstrd-RecommendationsMainInfo').isDisplayed();
    }

    async isMobileInfoWindowOpened() {
        return await this.getListViewInfoWindowContainerForMobile().isDisplayed();
    }

    async contentUpdatedTime(name, isMobileView = false) {
        return this.getContentItemUpdatedTime(name, isMobileView).getText();
    }

    async contentProject(name, isMobileView = false) {
        return this.getContentItemProject(name, isMobileView).getText();
    }

    async contentPath(name, isMobileView = false) {
        return this.getContentItemPath(name, isMobileView).getText();
    }

    async isAllSelectionCheckboxChecked() {
        return await this.isChecked(this.getToggleAllSelectionCheckbox());
    }

    async isSingleSelectionCheckboxChecked(name) {
        const checkbox = this.getParent(this.getSingleSelectCheckbox(name));
        return await this.isChecked(checkbox);
    }

    async isBotInInfoWindowActive() {
        const checked = await this.getBotActiveSwitch().$('.ant-switch').getAttribute('aria-checked');
        return checked === 'true';
    }

    async isShareDisabled() {
        const disabled = await this.getShareIcon().getAttribute('aria-disabled');
        return disabled === 'true';
    }

    async objectTypeInListMobileViewDisplayed(name, isMobileView = true) {
        return this.getObjectTypeIconInListView(name, isMobileView).isDisplayed();
    }

    async objectTypeInListViewIndoWindow() {
        return this.getObjectTypeIconInListViewInfoWindow().getText();
    }

    async isRenameIconPresentInInfoWindow() {
        return this.getRenameIcon().isDisplayed();
    }

    async isCopyIconPresentInInfoWindow() {
        return this.getCopyIcon().isDisplayed();
    }

    async isMoveIconPresentInInfoWindow() {
        return this.getMoveIcon().isDisplayed();
    }

    async isDeleteIconPresentInInfoWindow() {
        return this.getRemoveIcon().isDisplayed();
    }

    async getDeleteIconTooltipInInfoWindow() {
        await this.hover({ elem: this.getRemoveIcon() });
        await this.sleep(1000);
        const el = this.$('.ant-tooltip-inner');
        await this.waitForElementVisible(el);
        return el.getText();
    }

    async isCreateShortcutIconPresentInInfoWindow() {
        return this.getCreateShortcutIcon().isDisplayed();
    }

    async isMoreMenuIconPresentInInfoWindow() {
        return this.getMoreMenuIcon().isDisplayed();
    }

    async isEditButtonPresentInIW() {
        const isMoreOptionPresent = await this.getMoreOptionInIW().isDisplayed();
        if (isMoreOptionPresent) {
            await this.click({ elem: this.getMoreOptionInIW() });
            console.log('click more option in list view IW');
            let isMoreOptionPresent = !(await this.getHiddenMoreOptiobDropDownInIW()).isDisplayed();
            for (let i = 0; i < 3; i++) {
                if (!isMoreOptionPresent) {
                    console.log(
                        'more option dropdown is not opened, click more option in list view IW' + (i + 2) + ' times'
                    );
                    await this.click({ elem: this.getMoreOptionInIW() });
                    await this.sleep(1000);
                    isMoreOptionPresent = await this.getMoreOptiobDropDownInIW().isDisplayed();
                }
            }
            await this.waitForElementVisible(
                this.getMoreOptiobDropDownInIW(),
                'More option dropdown is not opened after 3 clicks'
            );
        }
        return this.getEditIcon().isDisplayed();
    }

    async getRemoveConfirmationMessageText() {
        return this.getRemoveConfirmationMessage().getText();
    }

    async isShareIconPresentInInfoWindow() {
        return this.getManageAccessIcon().isDisplayed();
    }

    async isManageAccessIconPresentInInfoWindow() {
        return this.getManageAccessIcon().isDisplayed();
    }

    async getInfoWindowActionCount() {
        return this.getInfoWindowActions().length;
    }

    async getInfoWindowMorActionAcount() {
        return this.getItemsInMoreDropdown().length;
    }

    async isCertifiedPresentInInfoWindow() {
        return this.getCertifiedIcon().isDisplayed();
    }

    async pathInListViewInfoWindow() {
        return this.getDossierPathIcon().getText();
    }

    async isEnabledForAIIconInactive() {
        const el = this.getEnableForAIIcon();
        const clsName = await el.getAttribute('class');
        return clsName.includes('inactive');
    }

    async isAIEnabledInInfoWindow() {
        return this.getEnableForAIStatusContainer().isDisplayed();
    }

    async isAIEnabledInListColumn(name) {
        const el = await this.getEnabledForAIIndicator(name);
        const className = await el.getAttribute('class');
        if (className.includes('mstrd-AgentCubeStatusIcon-ai-enabled')) {
            return true;
        }
        return false;
    }

    async isTagsDisplayed() {
        return this.getTagsContainer().isDisplayed();
    }
}
