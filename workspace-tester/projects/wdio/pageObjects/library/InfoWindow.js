import { waitForFileToExist } from '../../config/folderManagement.js';
import BasePage from '../base/BasePage.js';
import PromptEditor from '../common/PromptEditor.js';
import Conversation from '../teams/Coversation.js';
import MainTeams from '../teams/MainTeams.js';
import InfoWindowSnapshot from './InfoWindowSnapshot.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class InfoWindow extends BasePage {
    constructor() {
        super();
        this.promptEditor = new PromptEditor();
        this.mainTeams = new MainTeams();
        this.conversation = new Conversation();
        this.snapshot = new InfoWindowSnapshot();
    }

    // Element locators
    getInfoIcon(dossierName) {
        return this.getDossierByName(dossierName).$('.mstrd-DossierInfoIcon');
    }

    getDossierByName(name) {
        return this.$$('.mstrd-DossierItem').filter(async (elem) => {
            // Filter out empty dossier containers
            const nameLocator = elem.$('.mstrd-DossierItem-name');
            const isPresent = await nameLocator.isDisplayed();
            if (isPresent) {
                const dossierName = await nameLocator.getText();
                return name === dossierName;
            }
        })[0];
    }

    getInfoWindow() {
        return this.$('.mstrd-RecommendationsContainer-main');
    }

    getMainInfo() {
        return this.getInfoWindow().$('.mstrd-RecommendationsMainInfo');
    }

    getMainInfoTop() {
        return this.getInfoWindow().$('.mstrd-RecommendationsMainInfo-top');
    }

    getInfoWindowExportDetails() {
        return this.getInfoWindow().$('.mstrd-ExportDetailsPanelInLibrary-options');
    }

    getDossierTitle() {
        return this.getMainInfo().$('.mstrd-RecommendationsMainInfo-name');
    }

    getTagsContainer() {
        return this.getInfoWindow().$('.mstrd-UnstructuredDataTags');
    }

    getAddTagBtn() {
        return this.getTagsContainer().$('.mstr-icons-lib-icon');
    }

    getTagTable() {
        return this.getTagsContainer().$('.mstrd-UnstructuredDataTags-tags-table');
    }

    getTagKeyHeader() {
        return this.getTagTable().$('.mstrd-UnstructuredDataTags-tags-header-key');
    }

    getTagRows() {
        return this.getTagsContainer().$$('.mstrd-UnstructuredDataTags-tags-row');
    }

    getTagRowByKey(key) {
        return this.getTagRows().filter(async (elem) => {
            const rowKey = await elem.$('.mstrd-UnstructuredDataTags-tags-row-key>input').getAttribute('value');
            return this.escapeRegExp(rowKey) === this.escapeRegExp(key);
        })[0];
    }

    getTagValuesByKey(key) {
        return this.getTagRowByKey(key).$$('.mstr-ai-chatbot-TagsPreview-capsule');
    }

    getTagValueByKey(key, value) {
        return this.getTagValuesByKey(key).filter(async (elem) => {
            const val = (await elem.getText()).trim();
            return this.escapeRegExp(val).includes(this.escapeRegExp(value));
        })[0];
    }

    getTagValueDeleteIcon(key, value) {
        return this.getTagValueByKey(key, value).$('.mstr-icons-lib-icon');
    }

    getTagKeyDeleteIcon(key) {
        return this.getTagRowByKey(key).$('.mstrd-UnstructuredDataTags-tags-row-remove');
    }

    getTagRowKey(index = 0) {
        return this.getTagRows()[index].$('.mstrd-UnstructuredDataTags-tags-row-key');
    }

    getTagRowValue(index = 0) {
        return this.getTagRows()[index].$('.mstrd-UnstructuredDataTags-tags-row-value');
    }

    getTagActionBtn(text) {
        return this.getTagsContainer()
            .$$('.mstrd-Button')
            .filter(async (elem) => {
                const btnText = await elem.getText();
                return btnText === text;
            })[0];
    }

    getActionIcons() {
        return this.getMainInfo().$('.mstrd-RecommendationsMainInfo-share');
    }

    getActionButtonsCount() {
        return this.getActionIcons().$$('.mstr-menu-icon').length;
    }

    getActionButtons() {
        return this.getActionIcons().$$('.mstr-menu-icon');
    }

    getShareButton() {
        return this.getMainInfo().$('.mstr-menu-icon.icon-info_share');
    }

    getManageAccessButton() {
        return this.getMainInfo().$('.mstr-menu-icon.icon-mstrd_manage_access');
    }

    getCommentsInfo() {
        return this.getMainInfo().$('.mstr-menu-icon.icon-comments11');
    }

    getExportPDFButton() {
        return this.getActionIcons().$('.mstr-menu-icon.icon-info_pdf');
    }

    getExportExcelButton() {
        return this.getActionIcons().$('.mstr-menu-icon.icon-share_excel');
    }

    getExportGoogleSheetsButton() {
        return this.$('.mstr-menu-icon.icon-share_google_sheets');
    }

    getExportCSVButton() {
        return this.getActionIcons().$('.mstr-menu-icon.icon-share_csv');
    }

    getExportPDFSpinner() {
        return this.getActionIcons().$('.mstrd-RecommendationsMainInfo-pdfSpin');
    }

    getManageSubscriptionsButton() {
        return this.getActionIcons().$('.mstr-menu-icon.icon-group_recents');
    }

    getCoverImage() {
        return this.getInfoWindow().$('.mstrd-RecommendationsMainInfo-imageHolder');
    }

    getActiveToggleButton() {
        return this.getMainInfo().$('.mstrd-RecommendationsMainInfo-activeSwitch.mstr-menu-icon button');
    }

    getNoSubscriptionsButton() {
        return this.getActionIcons().$('.mstr-menu-icon.icon-group_recents.inactive');
    }

    getExportExcelSpinner() {
        return this.getActionIcons().$('.mstrd-RecommendationsMainInfo-excelSpin');
    }

    getDownloadDossierButton() {
        return this.getActionIcons().$('.mstr-menu-icon.icon-info_download');
    }

    getFavoriteButton() {
        return this.getActionIcons().$('.mstrd-in-RecommendationsMainInfo.mstrd-FavoriteIconButton');
    }

    getSeletedFavoriteButton() {
        return this.getActionIcons().$('.mstrd-in-RecommendationsMainInfo.mstrd-FavoriteIconButton--selected');
    }

    getDownloadDossierSpinner() {
        return this.getActionIcons().$('.mstrd-Spinner.mstr-spin');
    }

    getCloseButton() {
        return this.getInfoWindow().$('.icon-clearsearch');
    }

    getResetButton() {
        return this.getActionIcons().$('.icon-info_reset.mstr-menu-icon');
    }

    getRemoveButton() {
        return this.getActionIcons().$('.mstrd-RecommendationsMainInfo-deleteIcon');
    }

    getConfirmButton() {
        return this.getActionIcons().$('.mstrd-SliderConfirmDialog-slider').$('.mstrd-Button--round');
    }

    getConfirmMessage() {
        return this.getActionIcons().$('.mstrd-SliderConfirmDialog-slider').$('.mstrd-ConfirmationDialog-msg');
    }

    getCancelButton() {
        return this.getActionIcons().$('.mstrd-SliderConfirmDialog-slider').$('.mstrd-Button--clear');
    }

    getRemoveCancelButton() {
        return $('.mstrd-RecommendationsMainInfo-deleteDialog.mstrd-SliderConfirmDialog')
            .$('.mstrd-SliderConfirmDialog-slider')
            .$('.mstrd-Button--clear');
    }

    getRemoveConfirmButton() {
        return $('.mstrd-RecommendationsMainInfo-deleteDialog.mstrd-SliderConfirmDialog')
            .$('.mstrd-SliderConfirmDialog-slider')
            .$('.mstrd-Button--round');
    }

    getResetButtonDisabled() {
        return this.getActionIcons().$('.mstrd-SliderConfirmDialog[disabled]');
    }

    getEmbeddedBotButton() {
        return this.getActionIcons().$('.icon-mstrd_embed');
    }

    getBotActiveSwitch() {
        return this.$('.mstrd-RecommendationsMainInfo-activeSwitch').$('.mstrd-Switch');
    }

    getExportMSTRFileFromInfoWindow() {
        return this.$('.icon-info_download.mstr-menu-icon');
    }

    getExportToPDFFromInfoWindow() {
        return this.$('.icon-info_pdf.mstr-menu-icon');
    }

    getItemShare() {
        return this.$('.mstrd-RecommendationsMainInfo-share');
    }

    getEditButton() {
        return this.$('.icon-info_edit');
    }

    getInfoActionButtonByFeatureId(featureId) {
        return this.$(`[data-feature-id="${featureId}"]`);
    }

    getPrimaryConfirmationButton() {
        return this.$('[data-feature-id="library-item-info-delete-confirm"]');
    }

    getRecommendationsList() {
        return this.$('.mstrd-RecommendationsList');
    }

    getRelatedContentTitle() {
        return this.getRecommendationsList().$('.mstrd-RecommendationsList-title');
    }

    getViewMoreButton() {
        return this.getRecommendationsList().$('.mstrd-RecommendationsList-viewAll');
    }

    getInfoWindowUserName() {
        return this.$('.icon-person.mstr-menu-icon');
    }

    getEnableForAIIcon() {
        return this.getActionIcons().$('.mstrd-RecommendationsMainInfo-enableForAI');
    }

    getEnableForAIProcessIcon() {
        return this.getMainInfo().$('.mstrd-AgentCubeStatusIcon-ai-processing');
    }

    getEnableForAIStatusContainer() {
        return this.getMainInfo().$('.mstrd-RecommendationsMainInfo-aiEnabledStatus');
    }

    async getDossierInRecommendationsListContainer({ name = '', index = 0 }) {
        if (index !== 0) {
            const dossierList = await this.getRecommendationsList().$$('.mstrd-RecommendedItem-link');
            return dossierList[index - 1];
        }
        return this.getRecommendationsList()
            .$$('.mstrd-RecommendedItem-link')
            .filter(async (elem) => {
                const elemText = await elem.getAttribute('aria-label');
                return elemText === name;
            })[0];
    }

    getRelatedContentContainer() {
        return this.$('.mstrd-RecommendationsList-container');
    }

    getRelatedContentItems() {
        return this.getRecommendationsList().$$('.mstrd-RecommendedItem-link');
    }

    getRecommendationSpinner() {
        return this.getRecommendationsList().$('.mstrd-Spinner');
    }

    getCertifiedDetails() {
        return this.$('.mstrd-RecommendationsMainInfo-certifiedText');
    }

    getInfoWindowTimeStamp() {
        return this.$('.mstr-menu-icon .icon-info_updated');
    }

    // timestamp text container which does not include prefix, e.g. <4d ago> from <Updated 4d ago>
    getInfoWindowTimeStampTextContainer() {
        return this.$(`.mstr-menu-icon:has(.icon-info_updated) span:not(.mstrd-RecommendationsMainInfo-prefix)`);
    }

    getObjectId() {
        return this.$('.icon-info_object_id');
    }

    getPathInfo() {
        return this.$('.icon-info_folder.mstr-menu-icon');
    }

    getCertifiedIcon() {
        return this.getInfoWindow().$('.mstrd-CertifiedIcon');
    }

    getTemplateIcon() {
        return this.getInfoWindow().$('.mstrd-TemplateIcon');
    }

    getTooltip() {
        return this.$('.ant-tooltip:not(.ant-tooltip-hidden)');
    }

    getDossierNameInactiveSubstring() {
        return this.$('.mstrd-RecommendationsMainInfo-name-inactive');
    }

    getRecommendationLoadingIcon() {
        return this.$('.mstrd-RecommendationsList-loading');
    }

    getCreateDashboardBtn() {
        return this.$('.mstrd-RecommendationsMainInfo-createDashboard');
    }

    getCreateBotBtn() {
        return this.$('.mstrd-RecommendationsMainInfo-createBot');
    }

    getCreateADCBtn() {
        return this.$('.mstr-menu-icon-create-adc-icon');
    }

    getDownloadButton() {
        return this.$('.mstr-menu-icon-download-icon');
    }

    getReplaceButton() {
        return this.$('.mstr-menu-icon-replace-icon');
    }

    getSecurityFilterBtn() {
        return this.$('.icon-mstrd_security_filter');
    }

    getFolderPath() {
        return this.getInfoWindow().$('.mstrd-shrinkableFolderPath');
    }

    getInfoWindowObjectTypeIcon() {
        const icon = this.$('.mstrd-RecommendationsMainInfo-information').$('.mstrd-ObjectTypeIcon');
        return this.getParent(this.getParent(icon));
    }

    getCertifiedInfo() {
        return this.getInfoWindow().$('.mstrd-RecommendationsMainInfo-certifiedInfo');
    }

    async getIdInInfoWindow() {
        const child = await this.$('.icon-info_object_id.object-type-icon-container');
        const parent = await this.getParent(child);
        return parent.$('span');
    }

    getPathInInfoWindow() {
        return this.$('.mstrd-shrinkableFolderPath');
    }

    getLoadingButton() {
        return this.$('.mstrd-Spinner-blade');
    }

    getDoNotUseAsReference() {
        return this.getInfoWindow().$('.mstrd-Checkbox-main');
    }

    getDoNotUseAsReferenceCheckbox() {
        return this.getDoNotUseAsReference().$('.icon-checkmark');
    }

    // Action helpers

    async expand(dossierName) {
        await this.libraryPage.moveDossierIntoViewPort(dossierName);
        for (let i = 0; i < 3; i++) {
            if (!(await this.isOpen())) {
                await this.click({ elem: this.getInfoIcon(dossierName) });
                await this.waitForElementVisible(this.getInfoWindow(), { msg: 'Expanding info window takes too long' });
                await this.waitForDynamicElementLoading();
                await this.waitForElementInvisible(this.getRecommendationLoadingIcon());
            }
        }
        return this.sleep(500); // Wait for jquery animation to complete
    }

    async shareDossier() {
        await scrollIntoView(this.getShareButton());
        await this.click({ elem: this.getShareButton() });
        await this.waitForElementVisible(this.$('.mstrd-ShareDossierContainer-main'));
    }

    async openManageAccessDialog() {
        await this.click({ elem: this.getManageAccessButton() });
        await this.waitForElementVisible(this.$('.mstrd-ManageAccessContainer-main'));
    }

    async openExportPDFSettingsWindow() {
        await this.waitForElementVisible(this.getExportPDFButton(), { msg: 'Cannot find export button.' });
        await this.getExportPDFButton().click();
        return this.waitForElementVisible(this.getInfoWindow(), { msg: 'Export PDF Settings panel did not open.' });
    }

    async clickExportExcelButton() {
        await this.waitForElementVisible(this.getExportExcelButton(), { msg: 'Cannot find export button.' });
        await this.getExportExcelButton().click();
    }

    async clickExportGoogleSheetsButton() {
        await this.waitForElementVisible(this.getExportGoogleSheetsButton(), { msg: 'Cannot find export button.' });
        await this.getExportGoogleSheetsButton().click();
    }

    async clickExportCSVButton() {
        await this.waitForElementVisible(this.getExportCSVButton(), { msg: 'Cannot find export button.' });
        await this.getExportCSVButton().click();
    }

    async clickManageSubscriptionsButton() {
        await this.waitForElementVisible(this.getManageSubscriptionsButton(), {
            msg: 'Cannot find subscription button.',
        });
        await this.waitForCondition(async () => {
            const classAttr = await this.getManageSubscriptionsButton().getAttribute('class');
            const isInactive = classAttr.includes('inactive');
            return !isInactive;
        });
        await this.getManageSubscriptionsButton().click();
    }

    async exportRSD() {
        await this.waitForElementVisible(this.getExportPDFButton(), { msg: 'Cannot find export button.' });
        await this.getExportPDFButton().click();
        return this.waitForElementStaleness(this.getExportPDFSpinner(), { msg: 'Export PDF takes too long' });
    }

    async downloadDossier() {
        return this.getDownloadDossierButton().click();
    }

    async clickFavoriteIcon() {
        await this.click({ elem: this.getFavoriteButton() });
    }

    async favoriteWithoutScroll() {
        if (!(await this.isFavoritesBtnSelected())) {
            console.log('click favorite button');
            await this.click({ elem: this.getFavoriteButton() });
            await this.sleep(500); // wait for animation to complete
            await this.waitForElementInvisible(this.getInfoWindow());
            await this.sleep(500); // wait for homepage static rendering
        }
    }

    async favorite() {
        await scrollIntoView(this.getResetButton());
        return this.favoriteWithoutScroll();
    }

    async favoriteData() {
        return this.favoriteWithoutScroll();
    }

    async favoriteDossier(dossierName) {
        await this.favorite();
        // to keep old behavior, re-open the info-window again
        return this.expand(dossierName);
    }

    async removeFavorite() {
        let flag = await this.isFavoritesBtnSelected();
        let maxRetryTime = 3;
        while (maxRetryTime && flag) {
            console.log('click remove favorite button ' + (4 - maxRetryTime) + ' times');
            await this.click({ elem: this.getFavoriteButton() });
            await this.waitForElementInvisible(this.getInfoWindow());
            await this.sleep(500); // wait for homepage static rendering
            flag = (await this.isOpen()) && (await this.isFavoritesBtnSelected());
            maxRetryTime--;
        }
    }

    async removeFavoriteDossier(dossierName) {
        await this.removeFavorite();
        // to keep old behavior, re-open the info-window again
        return this.expand(dossierName);
    }

    async close() {
        const closeIcon = this.getCloseButton();
        await this.click({ elem: closeIcon });
        return this.waitForElementStaleness(this.getInfoWindow());
    }

    async isExportExcelButtonPresent() {
        return this.getExportExcelButton().isDisplayed();
    }

    async showTooltipOfExportPDFIcon() {
        await this.hover({ elem: this.getExportPDFButton() });
        return this.tooltip();
    }

    async waitForDownloadComplete({ name, fileType }) {
        if (!name || !fileType) {
            return new Error('The name and/or fileType object parameters must be provided.');
        }

        if (fileType === '.pdf') {
            await this.waitForElementStaleness(this.getExportPDFSpinner(), {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                msg: `Export PDF takes too long`,
            });
        } else if (fileType === '.mstr') {
            await this.sleep(1000);
            await this.waitForElementStaleness(this.getDownloadDossierSpinner(), {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                msg: `Downloading mstr file takes too long`,
            });
        } else if (fileType === '.xlsx') {
            await this.waitForElementStaleness(this.getExportExcelSpinner(), {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                msg: `Export Excel takes too long`,
            });
        } else {
            return new Error('The provided fileType object parameter is not supported.');
        }

        // Wait the file to be completely generated after the download spinner disappears
        return waitForFileToExist({ name, fileType });
    }

    async showIconTooltip({ option }) {
        switch (option) {
            case 'ExportToPDF':
                await this.hover({ elem: this.getExportPDFButton() });
                break;
            case 'Download':
                await this.hover({ elem: this.getDownloadDossierButton() });
                break;
            case 'Reset':
                await this.hover({ elem: this.getResetButton() });
                break;
            case 'Remove':
                await this.hover({ elem: this.getRemoveButton() });
                break;
            case 'Edit':
                await this.hover({ elem: this.getEditButton() });
                break;
            case 'Favorite':
                await this.hover({ elem: this.getFavoriteButton() });
                break;
            case 'Share':
                await this.hover({ elem: this.getShareButton() });
                break;
            case 'Embed':
                await this.hover({ elem: this.getEmbeddedBotButton() });
                break;
            case 'ManageAccess':
                await this.hover({ elem: this.getManageAccessButton() });
                break;
        }
        return this.tooltip();
    }

    async selectReset() {
        await this.click({ elem: this.getResetButton() });
        await this.waitForDynamicElementLoading();
        await this.sleep(2000); //wait for animation complete
    }

    async confirmReset() {
        return this.click({ elem: this.getConfirmButton() });
    }

    async resetFromInfoWindow(wait = true) {
        await this.selectReset();
        if (wait) {
            await this.confirmReset();
        } else {
            await this.getConfirmButton().click();
        }
    }

    async cancelReset() {
        await this.click({ elem: this.getCancelButton() });
        await this.waitForDynamicElementLoading();
        await this.sleep(2000); //wait for animation complete
    }

    async confirmResetWithPrompt() {
        const elem = this.getConfirmButton();
        await this.waitForElementClickable(elem);
        await elem.click();
    }

    async clickEditButton() {
        return this.click({ elem: this.getEditButton() });
    }

    async clickInfoActionButtonByFeatureId(featureId, actionName = 'Info action button') {
        const button = this.getInfoActionButtonByFeatureId(featureId);
        await this.waitForElementVisible(button, {
            msg: `${actionName} was not displayed.`,
        });
        await this.waitForElementClickable(button, {
            msg: `${actionName} was not clickable.`,
        });
        // Opening authoring triggers page transition; avoid generic post-click curtain waits here.
        await this.clickAndNoWait({ elem: button });
    }

    async openItemInAuthoring() {
        await this.clickInfoActionButtonByFeatureId('library-item-info-authoring-enter', 'Open in authoring button');
    }

    async selectRemove() {
        return this.click({ elem: this.getRemoveButton() });
    }

    async deleteItemFromInfoWindow() {
        await this.waitForElementVisible(this.getRemoveButton(), {
            msg: 'Delete icon was not displayed in info window.',
        });
        await this.waitForElementClickable(this.getRemoveButton(), {
            msg: 'Delete icon was not clickable in info window.',
        });
        await this.click({ elem: this.getRemoveButton() });
        await this.waitForElementVisible(this.getPrimaryConfirmationButton(), {
            msg: 'Delete confirmation button was not displayed.',
        });
        await this.waitForElementClickable(this.getPrimaryConfirmationButton(), {
            msg: 'Delete confirmation button was not clickable.',
        });
        await this.click({ elem: this.getPrimaryConfirmationButton() });
        await this.waitForElementInvisible(this.getInfoWindow(), { msg: 'Info window was not closed after deletion.' });
    }

    async confirmRemove() {
        await this.click({ elem: this.getConfirmButton() });
        return this.waitForElementInvisible(this.getInfoWindow());
    }

    async cancelRemove() {
        await this.click({ elem: this.getCancelButton() });
    }

    async clickViewMoreButton() {
        await this.click({ elem: this.getViewMoreButton() });
        return this.waitForElementInvisible(this.getRecommendationSpinner());
    }

    async openDossierFromRecommendationsList(dossierName) {
        await this.click({ elem: await this.getDossierInRecommendationsListContainer({ name: dossierName }) });
        return this.dossierPage.waitForDossierLoading();
    }

    async openDossierFromRecommendationsListByIndex(index) {
        const elm = await this.getDossierInRecommendationsListContainer({ index });
        await this.waitForElementVisible(elm);
        await this.waitForElementClickable(elm);
        await elm.click();
        await this.sleep(1000); //wait for prompt editor shows
        const ispromptEditorOpen = await this.promptEditor.isEditorOpen();
        if (ispromptEditorOpen) {
            await this.promptEditor.run();
        }
        return this.dossierPage.waitForDossierLoading();
    }

    async hideRelatedContentItem() {
        const count = await this.getRelatedContentItems().length;
        for (let i = 0; i < count; i++) {
            let el = await this.getRelatedContentItems()[i];
            await this.executeScript("arguments[0].setAttribute('style', 'visibility:hidden')", await el);
        }
    }

    async hideRelatedContentContainer() {
        return this.hideElement(this.getRelatedContentContainer());
    }

    async hoverOnCertifiedIcon(name) {
        await this.hover({ elem: this.getCertifiedIcon(name) });
        await this.waitForElementVisible(await this.getTooltip());
    }

    async hoverOnTemplateIcon(name) {
        await this.hover({ elem: this.getTemplateIcon(name) });
        await this.waitForElementVisible(await this.getTooltip());
    }

    async clickCoverImage() {
        await this.click({ elem: this.getCoverImage() });
        return this.dossierPage.waitForDossierLoading();
    }

    async clickCreateDashboardButton() {
        await this.click({ elem: this.getCreateDashboardBtn() });
    }

    async clickCreateBotButton() {
        await this.click({ elem: this.getCreateBotBtn() });
    }

    async clickCreateADCButton() {
        await this.click({ elem: this.getCreateADCBtn() });
    }

    async clickDownloadButton() {
        await this.click({ elem: this.getDownloadButton() });
    }

    async clickReplaceButton() {
        await this.click({ elem: this.getReplaceButton() });
    }

    async clickSecurityFilterButton() {
        await this.click({ elem: this.getSecurityFilterBtn() });
    }

    // Snapshot-related action methods (delegated to InfoWindowSnapshot)
    async getSnapshotTitleText({ name, index = 0 }) {
        return this.snapshot.getSnapshotTitleText({ name, index });
    }

    async hoverOnSnapshotItem({ name, index = 0 }) {
        return this.snapshot.hoverOnSnapshotItem({ name, index });
    }

    async clickSnapshotCancelButton({ name, index = 0 }) {
        return this.snapshot.clickSnapshotCancelButton({ name, index });
    }

    async clickSnapshotDoneButton({ name, index = 0 }) {
        return this.snapshot.clickSnapshotDoneButton({ name, index });
    }

    async editSnapshotName({ name, index = 0, text = '', save = true }) {
        return this.snapshot.editSnapshotName({ name, index, text, save });
    }

    async deleteSnapshot({ name, index = 0 }) {
        return this.snapshot.deleteSnapshot({ name, index });
    }

    async openSnapshotFromInfoWindow({ name, index = 0 }) {
        await this.snapshot.openSnapshotFromInfoWindow({ name, index });
        // await this.dossierPage.waitForDossierLoading();
    }

    async scrollSnapshotPanelToTop() {
        return this.snapshot.scrollSnapshotPanelToTop();
    }

    async scrollSnapshotPanelToBottom() {
        return this.snapshot.scrollSnapshotPanelToBottom();
    }

    async hideCertifiedDetailsText() {
        const isDisplayed = await this.getCertifiedDetails().isDisplayed();
        if (!isDisplayed) return;
        await this.hideElement(this.getCertifiedDetails());
    }

    async fakeTimestamp() {
        const isDisplayed = await this.getInfoWindowTimeStampTextContainer().isDisplayed();
        if (!isDisplayed) return;
        await this.fakeElementText(this.getInfoWindowTimeStampTextContainer());
    }

    async activeBot() {
        if (!(await this.isBotActive())) {
            await this.click({ elem: this.getBotActiveSwitch() });
            await this.waitForElementInvisible(this.getDossierNameInactiveSubstring());
        }
    }

    async inactiveBot() {
        if (await this.isBotActive()) {
            await this.click({ elem: this.getBotActiveSwitch() });
            await this.waitForElementPresence(this.getDossierNameInactiveSubstring());
        }
    }

    async enableForAI(skipWaiting = false, timeout = this.DEFAULT_LOADING_TIMEOUT) {
        const el = this.getEnableForAIIcon();
        const featureId = await el.getAttribute('data-feature-id');
        if (featureId == 'library-item-info-enable-for-ai') {
            console.log('Enabling for AI....');
            if (await this.isEnabledForAIIconInactive()) {
                await this.waitForElementInvisible(this.getEnableForAIProcessIcon());
            }
            await this.click({ elem: this.getEnableForAIIcon() });
            if (!skipWaiting) {
                await this.waitForElementVisible(this.getEnableForAIProcessIcon(), { timeout: 2000 });
                await browser.waitUntil(
                    async () => {
                        return !(await this.isEnabledForAIIconInactive());
                    },
                    {
                        timeout,
                        timeoutMsg: 'Enable for AI icon is still inactive after timeout',
                    }
                );
            }
            await this.sleep(500); // wait for status update
        }
    }

    async disableForAI() {
        const el = this.getEnableForAIIcon();
        const featureId = await el.getAttribute('data-feature-id');
        if (featureId == 'library-item-info-disable-for-ai') {
            console.log('Disabling for AI....');
            if (await this.isEnabledForAIIconInactive()) {
                await this.waitForElementInvisible(this.getEnableForAIProcessIcon());
            }
            await this.click({ elem: this.getEnableForAIIcon() });
            await this.waitForElementInvisible(this.getEnableForAIStatusContainer());
        }
    }

    async moveTagIntoViewPort() {
        const tagTable = await this.getTagTable();
        await browser.execute((element) => {
            void element.scrollIntoView();
        }, tagTable);
    }

    async addTag(key, values) {
        await this.moveTagIntoViewPort();
        await this.click({ elem: this.getAddTagBtn() });
        await this.click({ elem: this.getTagRowKey() });
        await this.input(key);
        await this.click({ elem: this.getTagKeyHeader() }); // click outside to save the key
        for (const value of values) {
            await this.click({ elem: this.getTagRowValue() });
            await this.input(value);
            await this.enter();
        }
        await this.sleep(500); // wait for tag addition animation
    }

    async deleteTagValue(key, value) {
        await this.click({ elem: this.getTagValueDeleteIcon(key, value) });
    }

    async deleteTagKey(key) {
        await this.click({ elem: this.getTagKeyDeleteIcon(key) });
    }

    async saveTags() {
        await this.click({ elem: this.getTagActionBtn('Save') });
    }

    async cancelTags() {
        await this.click({ elem: this.getTagActionBtn('Cancel') });
    }

    // Assertion helpers

    async isExportPDFEnabled() {
        return this.getExportPDFButton().isDisplayed();
    }

    async isExportCSVEnabled() {
        return this.getExportCSVButton().isDisplayed();
    }

    async isExportExcelEnabled() {
        return this.getExportExcelButton().isDisplayed();
    }

    async isExportGoogleSheetsEnabled() {
        return this.getExportGoogleSheetsButton().isDisplayed();
    }

    async isDownloadDossierEnabled() {
        return this.getDownloadDossierButton().isDisplayed();
    }

    async isOpen() {
        return this.getInfoWindow().isDisplayed();
    }

    async isResetDisabled() {
        return this.getResetButtonDisabled().isDisplayed();
    }

    async isDownloadDossierPresent() {
        return this.getExportMSTRFileFromInfoWindow().isDisplayed();
    }

    async isExportPDFPresent() {
        return this.getExportToPDFFromInfoWindow().isDisplayed();
    }

    async isEditIconPresent() {
        return this.getEditButton().isDisplayed();
    }

    async isFavoritesBtnPresent() {
        return this.getFavoriteButton().isDisplayed();
    }

    async isFavoritesBtnSelected() {
        return this.getSeletedFavoriteButton().isDisplayed();
    }

    async isSharePresent() {
        return this.getShareButton().isDisplayed();
    }

    async isShareDisabled() {
        return this.isAriaDisabled(this.getShareButton());
    }

    async isManageAccessPresent() {
        return this.getManageAccessButton().isDisplayed();
    }

    async isManageAccessEnabled() {
        return this.getManageAccessButton().isEnabled();
    }

    async isResetPresent() {
        return this.getResetButton().isDisplayed();
    }

    async isRemovePresent() {
        return this.getRemoveButton().isDisplayed();
    }

    async isEmbeddedBotPresent() {
        return this.getEmbeddedBotButton().isDisplayed();
    }

    async isRelatedContentTitlePresent() {
        return this.getRelatedContentTitle().isDisplayed();
    }

    async isCreateDashboardPresent() {
        return this.getCreateDashboardBtn().isDisplayed();
    }

    async isCreateBotPresent() {
        return this.getCreateBotBtn().isDisplayed();
    }

    async isSecurityFilterPresent() {
        return this.getSecurityFilterBtn().isDisplayed();
    }

    async isEnabledForAIIconInactive() {
        const el = this.getEnableForAIIcon();
        const clsName = await el.getAttribute('class');
        return clsName.includes('inactive');
    }

    async isEnableForAIDisplayed() {
        return this.getEnableForAIIcon().isDisplayed();
    }

    async isAIEnabled() {
        return this.getEnableForAIStatusContainer().isDisplayed();
    }

    async isTagsDisplayed() {
        return this.getTagsContainer().isDisplayed();
    }

    async isCreateADCButtonDisplayed() {
        return this.getCreateADCBtn().isDisplayed();
    }

    async getTagsCount() {
        const values = this.getTagRows();
        return values ? values.length : 0;
    }

    async getTagKeyValuesCount(key) {
        return this.getTagValuesByKey(key).length;
    }

    async removeDossier() {
        await this.click({ elem: this.getRemoveButton() });
        await this.click({ elem: this.getConfirmButton() });
        return this.waitForElementInvisible(this.getInfoWindow());
    }

    async certifiedDetails() {
        return this.getCertifiedDetails().getText();
    }

    async waitForNoSubscriptionButton() {
        return this.waitForElementVisible(this.getNoSubscriptionsButton());
    }

    async isBotActive() {
        const checked = await this.getBotActiveSwitch().$('.ant-switch').getAttribute('aria-checked');
        return checked === 'true';
    }

    async botActiveSwitchText() {
        return this.getActionIcons().$('.mstrd-RecommendationsMainInfo-activeSwitch').getText();
    }

    async isDossierNameInactiveSubstringPresent() {
        return this.getDossierNameInactiveSubstring().isDisplayed();
    }

    async getDossierNameInactiveSubstringText() {
        return (await (await this.getDossierNameInactiveSubstring()).getText()).trim();
    }

    async getActionButtonsName() {
        return this.getActionButtons().map(async (elem) => {
            let text = await elem.getAttribute('aria-label');
            if (text === null) {
                text = await elem.getText();
            }
            return text;
        });
    }

    async getConfirmMessageText() {
        return this.getConfirmMessage().getText();
    }

    async isObjectIDPresentInInfoWindow() {
        return this.getObjectId().isDisplayed();
    }

    async isRecommendationListPresentInInfoWindow() {
        return this.getRecommendationsList().isDisplayed();
    }

    async waitForInfoIconAppear() {
        await browser.waitUntil(
            async () => {
                let frames = await this.$$('iframe');
                let id = await frames[0].getAttribute('id');
                console.log(id);
                return frames.length === 1 && id.includes('cacheable-iframe');
            },
            {
                timeout: 100000,
                timeoutMsg: 'Expected to find library iframe within the timeout period',
            }
        );
        await browser.switchToFrame(await this.$('iframe'));
        console.log('Switch to library iframe');
        await browser.waitUntil(
            async () => {
                let infoIcon = await this.$$('.mstrd-DossierInfoIcon')[0].isDisplayed();
                return infoIcon;
            },
            {
                timeout: 100000,
                timeoutMsg: 'Expected to find exactly one iframe within the timeout period',
            }
        );
        console.log('Info icon has appeared!');
    }

    async isActiveToggleButtonOn() {
        await this.waitForElementVisible(this.getActiveToggleButton());
        const isChecked = await this.getActiveToggleButton().getAttribute('aria-checked');
        return isChecked === 'true';
    }

    async isFolderPathTruncated() {
        const pathSegments = await this.getFolderPath().$$('li');
        for (const segment of pathSegments) {
            const text = await segment.getText();
            if (text === '... >') {
                return true;
            }
        }
        return false;
    }

    async objectTypeInInfoWindow() {
        return this.getInfoWindowObjectTypeIcon().getText();
    }

    async isObjectTypeInInfoWindowPresent() {
        return this.getInfoWindowObjectTypeIcon().isDisplayed();
    }

    async isCertifiedPresent() {
        return this.getCertifiedIcon().isDisplayed();
    }

    async hideIdInInfoWindow() {
        await this.hideElement(this.getIdInInfoWindow());
    }

    async pathInInfoWindow() {
        return this.getPathInInfoWindow().getText();
    }

    // Snapshot-related assertion methods (delegated to InfoWindowSnapshot)
    async isSnapshotContentSectionPresent() {
        return this.snapshot.isSnapshotContentSectionPresent();
    }

    async waitForSnapshotSection() {
        return this.snapshot.waitForSnapshotSection();
    }

    /**
     * Gets the snapshots header text (e.g., "Snapshots (1)")
     * @returns {Promise<string>} The snapshots header text
     */
    async getSnapshotsHeader() {
        return this.snapshot.getSnapshotsHeader();
    }

    /**
     * Gets the count of snapshot items
     * @returns {Promise<number>} The number of snapshot items
     */
    async getSnapshotItemCount() {
        return this.snapshot.getSnapshotItemCount();
    }

    /**
     * Gets the date and time of a specific snapshot
     * @param {number} index The zero-based index of the snapshot
     * @returns {Promise<string>} The date and time of the snapshot
     */
    async getSnapshotDateTime(index = 0) {
        return this.snapshot.getSnapshotDateTime(index);
    }

    async getSnapshotItems() {
        return this.snapshot.getSnapshotItems();
    }

    async getSnapshotName({ name, index = 0 }) {
        return this.snapshot.getSnapshotName({ name, index });
    }

    async getSnapshotSection() {
        return this.snapshot.getSnapshotSection();
    }

    async getSnapshotErrorText() {
        return this.snapshot.getSnapshotErrorText();
    }

    async getSnapshotSectionBackgroundColor() {
        return this.snapshot.getSnapshotSectionBackgroundColor();
    }

    async waitForExportLoadingButtonToDisappear(timeout = 60000) {
        return this.snapshot.waitForExportLoadingButtonToDisappear(timeout);
    }
}
