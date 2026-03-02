import BaseLibrary from '../base/BaseLibrary.js';
import UserPreference from '../common/UserPreference.js';
import UserAccount from '../common/UserAccount.js';
import { errorLog } from '../../config/consoleFormat.js';
import PromptEditor from '../common/PromptEditor.js';
import LoginPage from '../auth/LoginPage.js';
import HamburgerMenu from '../common/HamburgerMenu.js';
import DossierPage from '../dossier/DossierPage.js';
import featureData from '../../config/FeatureData.js';
import InfoWindow from './InfoWindow.js';
import Sidebar from '../group/Sidebar.js';
import allureReporter from '@wdio/allure-reporter';
import MissingNuggetsDialog from './MissingNuggetsDialog.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import removeDossierFromUserLibraryHome from '../../api/removeDossierFromUserLibraryHome.js';
import urlParser from '../../api/urlParser.js';

export default class LibraryPage extends BaseLibrary {
    constructor() {
        super();
        this.hamburgerMenu = new HamburgerMenu();
        this.userPreference = new UserPreference();
        this.userAccount = new UserAccount();
        this.promptEditor = new PromptEditor();
        this.loginPage = new LoginPage();
        this.dossierPage = new DossierPage();
        this.infoWindow = new InfoWindow();
        this.sidebar = new Sidebar();
        this.missingNuggetsDialog = new MissingNuggetsDialog();
        this.loadingDialog = new LoadingDialog();
    }

    async reload() {
        await browser.refresh();
        await this.waitForLibraryLoading();
        return this.waitForItemLoading();
    }

    // Element locator
    getViewContainer() {
        return this.$('.mstrd-LibraryViewContainer');
    }

    getDossierInfoButton(dossierName) {
        return this.getItem(dossierName).$('.mstrd-DossierInfoIcon');
    }

    getDossierCommentCountIcon(dossierName) {
        return this.getItem(dossierName).$('.mstrd-CommentCountIcon');
    }

    getRecommendationLoadingIcon() {
        return this.$('.mstrd-RecommendationsList-loading');
    }

    getAuthoringCloseBtn() {
        return this.$('.mstrmojo-RootView-menubar .item.btn.close');
    }

    getLibraryIcon() {
        return this.$('.mstr-nav-icon.icon-library,.mstrd-LibraryNavItem-link');
    }

    getLibraryCurtain() {
        return this.$('.mstrd-LibraryViewCurtain');
    }

    getNavigationBar() {
        return this.$('.mstrd-NavBarWrapper');
    }

    getHamburgerIcon() {
        return this.$('.mstrd-HamburgerIconContainer');
    }

    getNotificationIcon() {
        return this.$('.mstrd-NotificationIcon');
    }

    getDossiersListContainer() {
        return this.$('.mstrd-DossiersListContainer');
    }

    getTrialWrapper() {
        return this.$('.mstrd-ContentListContainer-trialWrapper');
    }

    getUpgradeButtonInSiderSection() {
        return this.$('.mstrd-SaasPlaceholder-description .mstrd-SaasUpgradeButton-button');
    }

    getInstructionTitleInSiderSection() {
        return this.$('.mstrd-SaasPlaceholder-description').$(
            '.mstrd-SaasPlaceholder-description h2.mstrd-Text--variant-primary'
        );
    }

    getTitle() {
        return this.$('.mstrd-NavBarTitle > .mstrd-NavBarTitle-item.mstrd-NavBarTitle-item-active');
    }

    getTrialBanner() {
        return this.getTrialWrapper().$('.mstrd-TrialNotificationBar');
    }

    getUpdateButtonInTrialBanner() {
        return this.getTrialBanner().$('.mstrd-SaasUpgradeButton-button');
    }

    getTrialBannerMessage() {
        return this.getTrialBanner().$('.mstrd-TrialNotificationBar-text');
    }

    getEmptyLibraryFromFilter() {
        return this.$('.mstrd-EmptyLibraryFromFilter-content');
    }

    getNavigationBarCollapsedIcon() {
        return this.$('.mstrd-NavBarTriggerIcon');
    }

    getLibraryContentContainer() {
        return this.$('.mstrd-ContentListContainer');
    }

    getMultiSelectionToolbar() {
        return this.$('.mstrd-MultiSelectionToolbar');
    }

    getListContainerHeader() {
        return this.$('.mstrd-DossiersListContainer-header');
    }

    getDossierNameInput() {
        return this.$('.mstrd-DossierItem-nameInput,.mstrd-DossierItemRow-renameInput');
    }

    getMessageBoxContainer() {
        return this.$('.mstrd-MessageBox-main.mstrd-MessageBox-main--modal');
    }

    getBlurredAppContainer() {
        return this.$('.mstrd-AppContainer-mainContent--blur');
    }

    getFirstBot() {
        return this.$$('.mstr-icons-lib-icon[aria-label="Bot"]')[0];
    }

    getRecommendationSuggestionSkeleton() {
        return this.$$('.mstr-ai-chatbot-RecommendationSkeleton')[0];
    }

    getMissingFontPopup() {
        return this.$('.win.mstrmojo-Editor');
    }

    getOKButton() {
        return this.$('.ok-button');
    }

    getHomeCardAIProgressIcon(name) {
        return this.getItem(name).$('.mstrd-AgentCubeStatusIcon-ai-processing');
    }

    getHomeCardAIEnabledIcon(name) {
        return this.getItem(name).$('.mstrd-AgentCubeStatusIcon-ai-enabled');
    }

    getHomeCardAIDisabledIcon(name) {
        return this.getItem(name).$('.mstrd-AgentCubeStatusIcon-ai-disabled');
    }

    getHomeCardAIWarningIcon(name) {
        return this.getItem(name).$('.mstrd-AgentCubeStatusIcon-ai-error');
    }

    // Action helper

    async refresh() {
        // await browser.driver.navigate().refresh();
        await browser.refresh();
        await this.sleep(3000);
        return this.waitForLibraryLoading();
    }

    async getTitleText() {
        const title = await this.getTitle();
        return await title.getText();
    }

    async handleError() {
        // Handle unexpected Library/Mojo errors
        const isErrorPresent = await this.isErrorPresent();
        if (isErrorPresent) {
            const errorMsg = await this.errorMsg();
            errorLog(`ERROR: Unexpected error dialogue has been triggered: ${errorMsg}`);
            return this.dismissError();
        } else {
            await this.dossierPage.waitForDossierLoading();
            const isMojoErrorPresent = await this.isMojoErrorPresent();
            if (isMojoErrorPresent) {
                const mojoErrorMsg = await this.errorMsg();
                errorLog(`ERROR: Unexpected mojo error dialogue has been triggered: ${mojoErrorMsg}`);
                return this.dismissMojoError();
            } else {
                return this.dossierPage.waitForDossierLoading();
            }
        }
    }

    async openDossier(name, owner = null) {
        await this.openDossierNoWait(name, owner);
        allureReporter.addStep(`openDossier ${name}`);
        return this.handleError();
    }

    async openDossierNoWait(name, owner = null) {
        await this.moveDossierIntoViewPort(name, owner);
        return this.getItem(name, owner).click();
        // await this.click({ elem: this.getItem(name) });
    }

    async openBotByUrl(url, handleError = true) {
        await browser.url(url);
        allureReporter.addStep(`openBotByUrl ${url}`);
        if (handleError) {
            await this.handleError();
        } else {
            await this.waitForElementPresence(this.getErrorDialogue()); //wait for error dialogue render
        }
        await this.waitForElementStaleness(this.getRecommendationSuggestionSkeleton());
    }

    async openBotById({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29',
        projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        botId,
        handleError = true,
        useDefaultApp = false,
    }) {
        const pathname = useDefaultApp ? `app/${projectId}/${botId}` : `app/config/${appId}/${projectId}/${botId}`;
        const url = new URL(pathname, urlParser(browser.options.baseUrl));
        await this.openBotByUrl(url.toString(), handleError);
    }

    async openBotByIdAndWait({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29',
        projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        botId,
    }) {
        await this.openBotById({
            appId: appId,
            projectId: projectId,
            botId: botId,
        });
        await this.dossierPage.waitForDossierLoading();
    }

    async openBotNoWait(name) {
        return this.openDossierNoWait(name);
    }

    async openBot(name) {
        await this.openBotNoWait(name);
        await this.dossierPage.waitForDossierLoading();
        await this.waitForCurtainDisappear();
        await this.waitForElementStaleness(this.getRecommendationSuggestionSkeleton());
    }

    async openFirstBot() {
        await this.waitForCurtainDisappear();
        await this.getFirstBot().click();
        await this.dossierPage.waitForDossierLoading();
    }

    async editBotByUrl(
        { appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', botId },
        handleError = true
    ) {
        const url = new URL(`app/config/${appId}/${projectId}/${botId}/edit`, urlParser(browser.options.baseUrl));
        await this.openBotByUrl(url.toString(), handleError);
    }

    async openSnapshotById({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29',
        projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        objectId,
        messageId,
        handleError = true,
        useDefaultApp = true,
    }) {
        const url = this.getSnapshotUrl({ appId, projectId, objectId, messageId, useDefaultApp });
        await this.openSnapshotByUrl(url.toString(), handleError);
    }

    getSnapshotUrl({ appId, projectId, objectId, messageId, useDefaultApp }) {
        const path = `${projectId}/${objectId}?dossier.instance=%7B%22mid%22%3A%22${messageId}%22%2C%22viewMode%22%3A%22snapshot%22%7D`;
        const pathname = useDefaultApp ? `app/${path}` : `app/config/${appId}/${path}`;
        return new URL(pathname, browser.options.baseUrl);
    }

    async openSnapshotByUrl(url, handleError = true) {
        await browser.url(url);
        allureReporter.addStep(`openSnapshotByUrl ${url}`);
        if (handleError) {
            await this.handleError();
        }
    }

    async dismissMissingFontPopup() {
        const isDisplayed = await this.getMissingFontPopup().isDisplayed();
        if (!isDisplayed) return;
        await this.click({ elem: this.getOKButton() });
        await this.waitForElementInvisible(this.getMissingFontPopup());
    }

    async openDossierByUrl(url, handleError = true) {
        await browser.url(url);
        allureReporter.addStep(`openDashboardByUrl ${url}`);
        if (handleError) {
            await this.handleError();
            await this.dismissMissingFontPopup();
        }
    }

    async openDossierById({ projectId, dossierId, applicationId = null }, handleError = true) {
        let url;
        if (applicationId) {
            url = new URL(`app/config/${applicationId}/${projectId}/${dossierId}`, browser.options.baseUrl);
        } else {
            url = new URL(`app/${projectId}/${dossierId}`, browser.options.baseUrl);
        }
        await this.openDossierByUrl(url.toString(), handleError);
        //   await browser.pause(2000);
        //   await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(60);
    }

    async editDossierByUrl({ projectId, dossierId }, handleError = true) {
        const url = new URL(`app/${projectId}/${dossierId}/edit`, browser.options.baseUrl);
        await this.openDossierByUrl(url.toString(), handleError);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // temp workaround for enable react integration
        await this.enableReactIntegration();
    }

    async enableReactIntegration() {
        try {
            await browser.waitUntil(
                async () => {
                    return await browser.execute(() => {
                        return !!(
                            window.mstrmojo &&
                            window.mstrmojo.vi &&
                            window.mstrmojo.vi.enums &&
                            window.mstrmojo.vi.enums.DefaultFeatureValues
                        );
                    });
                },
                {
                    timeout: 30000,
                    interval: 500,
                    timeoutMsg: 'mstrmojo.vi.enums.DefaultFeatureValues is not available'
                }
            );
    
            const result = await browser.execute(() => {
                const defs = mstrmojo.vi.enums.DefaultFeatureValues;
                const key = "features.react-integration-enabled";
                const oldValue = defs[key];
                if (oldValue !== true) {
                    defs[key] = true;
                }
                return { oldValue, newValue: defs[key] };
            });
            console.log('[ReactIntegration] flag changed:', result);
        } catch (err) {
            console.error('[ReactIntegration] failed to enable:', err);
        }
    }

    async editDossierByUrlwithMissingFont({ projectId, dossierId }, handleError = true) {
        const url = new URL(`app/${projectId}/${dossierId}/edit`, browser.options.baseUrl);
        await browser.url(url.toString());
        allureReporter.addStep(`openDashboardByUrl ${url}`);
        if (handleError) {
            await this.handleError();
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async createNewReportByUrl({ projectId = 'B628A31F11E7BD953EAE0080EF0583BD' }, handleError = true) {
        const url = new URL(
            `app/${projectId}/05B202B9999F4C1AB960DA6208CADF3D/K53--K46/edit?isNew=true&continue`,
            browser.options.baseUrl
        );
        await this.openDossierByUrl(url.toString(), handleError);
        await this.loadingDialog.waitForObjectBrowserContainerLoadingIsNotDisplayed();
        await this.handleError();
    }

    async createNewDashboardByUrl({ projectId = 'B628A31F11E7BD953EAE0080EF0583BD' }, handleError = true) {
        const url = new URL(
            `app/${projectId}/4802DE4C4C18F434C75BFA84EC8A5E4B/K53--K46/edit?isNew=true&continue`,
            browser.options.baseUrl
        );
        await this.openDossierByUrl(url.toString(), handleError);
    }

    async editDossierByUrlwithPrompt({ projectId, dossierId }, handleError = false) {
        const url = new URL(`app/${projectId}/${dossierId}/edit`, browser.options.baseUrl);
        await this.openDossierByUrl(url.toString(), handleError);
    }

    async editDossierWithPageKeyByUrl({ projectId, dossierId, pageKey }, handleError = true) {
        const url = new URL(`app/${projectId}/${dossierId}/${pageKey}/edit`, browser.options.baseUrl);
        await this.openDossierByUrl(url.toString(), handleError);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openDossierWithKeyboard(name) {
        const dossierContainer = this.getItem(name);
        await this.tabToElement(dossierContainer.$('.mstrd-DossierItem-content'));
        await this.enter();

        // Handle unexpected Library/Mojo errors
        const isErrorPresent = await this.isErrorPresent();
        if (isErrorPresent) {
            const errorMsg = await this.errorMsg();
            errorLog(`ERROR: Unexpected error dialogue has been triggered: ${errorMsg}`);
            return this.dismissError();
        } else {
            await this.dossierPage.waitForDossierLoading();
            const isMojoErrorPresent = await this.isMojoErrorPresent();
            if (isMojoErrorPresent) {
                const mojoErrorMsg = await this.errorMsg();
                errorLog(`ERROR: Unexpected mojo error dialogue has been triggered: ${mojoErrorMsg}`);
                return this.dismissMojoError();
            } else {
                return this.dossierPage.waitForDossierLoading();
            }
        }
    }

    async openUrl(projectID, documentID, libraryUrl = browser.options.baseUrl, handleError = true) {
        const url = new URL(`app/${projectID}/${documentID}`, libraryUrl);
        allureReporter.addStep(`openDashboardByUrl ${url}`);
        await browser.url(url.toString(), this.DEFAULT_LOADING_TIMEOUT);
        if (handleError) {
            await this.handleError();
        }
    }

    async openUrlWithPage(projectID, documentID, pageID, libraryUrl = browser.options.baseUrl) {
        const url = this.formUrl(projectID, documentID, pageID, libraryUrl);
        await browser.url(url, this.DEFAULT_LOADING_TIMEOUT);
        return this.handleError();
    }

    formUrl(projectID, documentID, pageID, libraryUrl = browser.options.baseUrl) {
        if (!libraryUrl.endsWith('/')) {
            libraryUrl = libraryUrl + '/';
        }
        const url = new URL(`app/${projectID}/${documentID}/${pageID}`, libraryUrl);
        return url.toString();
    }
    async editReportByUrl({ projectId, dossierId }, handleError = true) {
        const url = new URL(`app/${projectId}/${dossierId}/edit`, browser.options.baseUrl);
        await this.openDossierByUrl(url.toString(), handleError);
        await this.loadingDialog.waitForObjectBrowserContainerLoadingIsNotDisplayed();
        await this.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await this.handleError();
    }

    async openReportByUrl({ projectId, documentId, prompt = false, noWait = false }) {
        await this.openUrl(projectId, documentId, browser.options.baseUrl, !noWait);
        if (noWait) {
            return;
        }
        if (!prompt) {
            await this.loadingDialog.waitForReportLoadingIsNotDisplayed();
        }
    }

    async openDossierAndRunPrompt(name) {
        await this.openDossier(name);
        await this.promptEditor.waitForEditor();
        await this.promptEditor.run();
    }

    async openReportNoWait(name) {
        return this.openDossierNoWait(name);
    }

    async openDocumentNoWait(name) {
        return this.openDossierNoWait(name);
    }

    async openUserAccountMenu() {
        await this.waitForElementVisible(this.userAccount.getUserAccount());
        return this.userAccount.openUserAccountMenu();
    }

    async clickAccountOption(text) {
        return this.userAccount.clickAccountOption(text);
    }

    async logout(options = {}) {
        return this.userAccount.logout(options);
    }

    async openPreferencePanel() {
        return this.userAccount.openPreferencePanel();
    }

    async closeUserAccountMenu() {
        return this.userAccount.closeUserAccountMenu();
    }

    async switchUser(credentials) {
        const isLoginPageDisplay = await this.loginPage.isLoginPageDisplayed();
        if (isLoginPageDisplay === false) {
            console.log('---------start logout-----------');
            await this.userAccount.openUserAccountMenu();
            await this.userAccount.logout();
        }
        if (credentials.username == 'Guest') {
            await this.loginPage.loginAsGuest();
        } else {
            console.log('------start login-----------');
            await this.loginPage.login(credentials);
        }
        return this.sleep(1000);
    }

    async dismissQuickSearch() {
        return this.click({ elem: this.getTitle() });
    }

    async dissmissPopup() {
        return this.click({ elem: this.getTitle() });
    }

    // Used for test case that needs to clear browser cache
    async logoutClearCacheAndLogin(credentials, skipOpenAccountMenu = false) {
        !skipOpenAccountMenu && (await this.userAccount.openUserAccountMenu());
        await this.userAccount.logout();
        await this.executeScript('window.localStorage.clear();');
        await this.loginPage.login(credentials);
    }

    async removeDossierFromLibrary(usercredentials, targetDossier, flag = true, isLogout = true) {
        // check wheher dossier has been added in library
        await removeDossierFromUserLibraryHome({ credentials: usercredentials, dossier: targetDossier, flag });
    }

    async hoverDossier(name) {
        await this.hover({ elem: this.getItem(name) });
    }

    async clickDossierFavoriteIcon(name) {
        await this.waitForElementVisible(this.getItem(name));
        await this.hover({ elem: this.getItem(name) });
        await this.click({ elem: this.getFavoriteIcon(name) });
        await this.sleep(500); // wait for homepage refresh
    }

    async clickFavoriteByImageIcon(name, selected = true) {
        await this.hover({ elem: this.getItem(name) });
        if (selected) {
            await this.click({ elem: this.getFavoriteIcon(name) });
            await this.sleep(500); // wait for homepage refresh
        }
    }

    async favoriteByImageIcon(name) {
        const selected = await this.isFavoritesIconSelected(name);
        await this.clickFavoriteByImageIcon(name, !selected);
        return this.sleep(500); // wait for homepage refresh
    }

    async removeFavoriteByImageIcon(name) {
        const selected = await this.isFavoritesIconSelected(name);
        return this.clickFavoriteByImageIcon(name, selected);
    }

    async isFavoriteIconPresent(name) {
        await this.hover({ elem: this.getItem(name), useBrowserActionForSafari: true });
        return this.getFavoriteIcon(name).isDisplayed();
    }

    async getGroupCountFromTitle(group) {
        await this.waitForCurtainDisappear();
        let newGroup = group;
        if (group === 'All') {
            newGroup = 'Home';
        }
        const locator = this.getListTitle(newGroup);
        await this.waitForElementVisible(locator);
        const el = await locator.getText();
        return Number(el.match(/\((\d+)\)/)[1]); //change this page object to handle group name with number case
    }

    async getFavoritesCountFromTitle() {
        await this.scrollToTop();
        if (await this.isFavoritesPresent()) {
            return this.getGroupCountFromTitle('Favorites');
        } else {
            return 0;
        }
    }

    async getAllCountFromTitle() {
        return this.getGroupCountFromTitle('Home');
    }

    async getDataModelCountFromTitle() {
        return this.getGroupCountFromTitle('Data');
    }

    async openDossierContextMenuNoWait(name) {
        await this.moveDossierIntoViewPort(name);
        let dossierItem = this.getItemMenuTrigger(name);
        await this.rightClick({ elem: dossierItem, checkClickable: false });
    }

    async openDossierContextMenu(name, isMobile = false) {
        await this.openDossierContextMenuNoWait(name);
        await this.waitForElementVisible(isMobile ? this.getDossierContextMenuMobile() : this.getDossierContextMenu());
        await this.sleep(2000); //wait for Context Menu full display
    }

    async clickDossierContextMenuItem(item1, item2 = '', isMobile = false) {
        await this.click({ elem: this.getDossierContextMenuItem(item1, isMobile) });
        if (item2 !== '') {
            await this.click({ elem: this.getDossierSecondaryContextMenuItem(item2) });
        }
        await this.sleep(this.DEFAULT_API_TIMEOUT); //wait response returned
        //return this.reload();
    }

    async clickDossierContextMenuItemNoWait(item) {
        return this.getDossierContextMenuItem(item).click();
    }

    async clickDossierSecondaryMenuItem(item) {
        await this.click({ elem: this.getDossierSecondaryContextMenuItem(item) });
        //await this.reload();
        return this.sleep(this.DEFAULT_API_TIMEOUT); //wait response returned
    }

    async clickLibraryIcon() {
        if (this.isSafari()) {
            //element not interactive in safari
            await this.executeScript('arguments[0].click();', await this.getLibraryIcon());
        } else {
            await this.click({ elem: this.getLibraryIcon() });
        }
        await this.sleep(600); // wait homepage to render again
    }

    async openSidebarOnly() {
        for (let n = 0; n < 3; n++) {
            if (!(await this.isSidebarOpened())) {
                await this.clickLibraryIcon();
            } else {
                break;
            }
        }
    }

    async openSidebar(hasSubmenu = false) {
        await this.openSidebarOnly();
        // if has Submenu, set flag to be true
        await this.sidebar.openAllSectionList(hasSubmenu); // to dismiss sidebar tooltip, therefore reduce screenshot fail ratio
    }

    async closeSidebar() {
        for (let n = 0; n < 3; n++) {
            if (await this.isSidebarOpened()) {
                await this.clickLibraryIcon();
            } else {
                break;
            }
        }
    }

    async clickMultiSelectBtn() {
        await this.click({ elem: this.getMultiSelectButton() });
        return this.waitForElementVisible(this.getMultiSelectionToolbar());
    }

    async selectDossier(name) {
        await this.moveDossierIntoViewPort(name);
        return this.click({ elem: this.getItem(name) });
    }

    async openHamburgerMenu() {
        await this.clickAndNoWait({ elem: this.hamburgerMenu.getHamburgerIcon() });
        return this.waitForElementVisible(this.hamburgerMenu.getSliderMenuContainer());
    }

    async clickAuthoringCloseBtn() {
        await this.click({ elem: this.getAuthoringCloseBtn() });
    }

    async hoverOnShare() {
        await this.hover({ elem: this.getDossierContextMenuItem('Share') });
    }

    // Move this to base
    async openDossierInfoWindow(dossierName) {
        await this.moveDossierIntoViewPort(dossierName);
        await this.waitForElementClickable(this.getDossierInfoButton(dossierName));
        await this.getDossierInfoButton(dossierName).click();
        await this.waitForElementVisible(this.infoWindow.getInfoWindow(), { msg: 'Info window was not open.' });
        await this.waitForDynamicElementLoading();
        await this.waitForElementInvisible(this.getRecommendationLoadingIcon());
        return this.sleep(1000); // Wait for jquery animation to complete
    }

    async openInvalidUrl(suffix, libraryUrl = browser.options.baseUrl) {
        const url = new URL(`${suffix}`, libraryUrl);
        return browser.url(url.toString(), this.DEFAULT_LOADING_TIMEOUT);
    }

    async renameDossier(newName) {
        await this.waitForElementVisible(this.getDossierNameInput());
        await browser.keys('Delete');
        await browser.keys(newName);
        //await this.getDossierNameInput().setValue(newName);
        await this.enter();
        return this.sleep(1000);
    }

    async clickUpgradeButtonInSiderSection() {
        await this.click({ elem: this.getUpgradeButtonInSiderSection() });
    }

    async clickUpgradeButtonInTrialBanner() {
        await this.click({ elem: this.getUpdateButtonInTrialBanner() });
    }

    async resetToLibraryHome() {
        await browser.url(browser.options.baseUrl);
        await this.waitForLibraryLoading();
        return browser.pause(1000);
    }

    // process performance data
    async performanceData(actionList) {
        //await this.sleep(5000); //wait for log
        try {
            const rawData = await browser.execute(() => {
                return window.mstrdossier.Performance.stats();
            });
            await featureData(rawData.dossier, actionList);
            await browser.execute(() => {
                window.mstrdossier.Performance.clear();
            });
            console.log('clear log');
        } catch (e) {
            console.log('performanceDataError', e);
        }
    }

    async waitForProgressBarGone() {
        await this.waitForElementAppearAndGone(this.getProgressBar());
    }

    async hoverHomeCardAIDisabledIcon(name) {
        await this.hover({ elem: this.getHomeCardAIDisabledIcon(name) });
    }

    async hoverHomeCardAIEnabledIcon(name) {
        await this.hover({ elem: this.getHomeCardAIEnabledIcon(name) });
    }

    async waitForEnableAIReady(name) {
        await this.waitForElementAppearAndGone(this.getHomeCardAIProgressIcon(name));
        return this.sleep(100);
    }

    // Assertion helper

    async isAccountIconPresent() {
        return this.userAccount.getUserAccount().isDisplayed();
    }

    async isAccountOptionPresent(text) {
        return this.userAccount.getAccountMenuOption(text).isDisplayed();
    }

    async isLogoutPresent() {
        return this.userAccount.getLogoutButton().isDisplayed();
    }

    async isViewCurtainPresent() {
        return this.getLibraryCurtain().isDisplayed();
    }

    async isFavoritesPresent() {
        return this.getListTitle('Favorites').isDisplayed();
    }

    async isFavoritesIconSelected(name) {
        await this.moveDossierIntoViewPort(name);
        return this.isSelected(this.getFavoriteIcon(name));
    }

    async isDossierContextMenuItemExisted(item) {
        const el = await this.getDossierContextMenuItems();
        return this.isExisted(item, el, 'text');
    }

    async isSecondaryContextMenuItemExisted(name) {
        const el = await this.getDossierSecondaryContextMenuItems();
        return this.isExisted(name, el, 'text');
    }

    async isSecondaryContextMenuItemDisabled(name) {
        return this.isAriaDisabled(this.getDossierSecondaryContextMenuItem(name));
    }

    async isMultiSelectBtnActive() {
        const el = await this.getMultiSelectButton();
        return this.isActive(el);
    }

    async isLibraryEmpty() {
        return this.getEmptyLibrary().isDisplayed();
    }

    async getFirstDossierName() {
        return this.$$('.mstrd-DossierItem .mstrd-DossierItem-nameText')[0].getText();
    }

    async getDossierCount() {
        await this.waitForLibraryLoading();
        const statusBarText = await this.$$('.mstrd-DossiersListContainer-dossierPositioner');
        return statusBarText.length - 1;
    }

    async waitForLibraryLoading() {
        await this.sleep(1000); // Time buffer for loading icon to appear
        await this.waitForElementStaleness(this.getLoadingLabel(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Library Page Loading takes too long',
        });
        await this.waitForItemLoading();
        return this.sleep(1000);
    }

    async expandCollapsedNavBar() {
        await this.getNavigationBarCollapsedIcon().click();
        return this.sleep(500);
    }

    async clickNarvigationBar() {
        return this.click({ elem: this.getNavigationBar() });
    }

    async isCodeCoverageEnabled() {
        const args = process.argv.slice(2);
        console.log('args', args);
        return args.includes('--CODE_COVERAGE=1');
    }

    async openDebugMode(debugBundles) {
        let codeCoverageEnabled = await this.isCodeCoverageEnabled();
        console.log('codeCoverageEnabled: ', codeCoverageEnabled);
        if (codeCoverageEnabled) {
            console.log('Open debug mode');
            try {
                await this.executeScript('window.localStorage.setItem("debugMojo", true)');
                await this.executeScript(`window.localStorage.setItem("debugMojoBundles", "${debugBundles}")`);
            } catch (error) {
                console.error('Error executing script:', error);
            }
        }
    }

    async collectLineCoverageInfo(outputFolderString, testName) {
        let codeCoverageEnabled = await this.isCodeCoverageEnabled();
        console.log('codeCoverageEnabled: ', codeCoverageEnabled);
        if (codeCoverageEnabled) {
            console.log('Collect line coverage info');
            let coverageInfo = await this.executeScript('return window.__coverage__;');
            if (!fs.existsSync(outputFolderString)) {
                fs.mkdirSync(outputFolderString, { recursive: true });
            }
            let outputPath = path.join(outputFolderString, `${testName}_coverage-library.json`);
            if (!fs.existsSync(outputPath)) {
                fs.closeSync(fs.openSync(outputPath, 'w'));
            }
            fs.writeFileSync(outputPath, JSON.stringify(coverageInfo, null, 2), 'utf8');
        }
    }

    async isDossierInLibrary(dossier) {
        return this.loadUntilRendered({ name: dossier.name });
    }

    async isLibraryIconPresent() {
        return this.getLibraryIcon().isDisplayed();
    }

    async isNavigationBarPresent() {
        return this.getNavigationBar().isDisplayed();
    }

    async isSidebarOpened() {
        await this.waitForElementVisible(this.getLibraryContentContainer());
        const name = await this.getLibraryContentContainer().getAttribute('class');
        return name.includes('mstrd-ContentListContainer--hasSidebar');
    }

    async isNotificationIconPresent() {
        return this.getNotificationIcon().isDisplayed();
    }

    async isMultiSelectBtnPresent() {
        return this.getMultiSelectBtn().isDisplayed();
    }

    async isNavBarExpandBtnPresent() {
        return this.getNavigationBarCollapsedIcon().isDisplayed();
    }

    async isTitleDisaplayed() {
        return this.getTitle().isDisplayed();
    }
    async getListContainerHeaderText() {
        await this.sleep(2000);
        return this.getListContainerHeader().getText();
    }

    async getTrialBannerMessageText() {
        await this.waitForElementVisible(this.getTrialWrapper());
        return this.getTrialBannerMessage().getText();
    }

    async getInstructionTitleInSiderSectionText() {
        return this.getInstructionTitleInSiderSection().getText();
    }

    async isUpgradeButtonInSiderSectionPresent() {
        return this.getUpgradeButtonInSiderSection().isDisplayed();
    }

    async isUpgradeButtonInTrialBannerPresent() {
        return this.getUpdateButtonInTrialBanner().isDisplayed();
    }

    async isSelectedSidebarItem(item) {
        if (!(await this.isSidebarOpened())) {
            await this.openSidebarOnly();
        }
        if (item === 'All') {
            return (await this.sidebar.getAllSection().getAttribute('aria-selected')) === 'true';
        } else {
            return (await this.sidebar.getPredefinedSectionItem(item).getAttribute('aria-selected')) === 'true';
        }
    }

    async getBotCount() {
        return this.getDossierCount();
    }

    async getMenuContextItemCount() {
        return this.getDossierContextMenuItems().length;
    }

    async isLibraryEmptyFromFilter() {
        return this.getEmptyLibraryFromFilter().isDisplayed();
    }

    async hideDossierListContainer() {
        return this.hideElement(this.getDossiersListContainer());
    }

    async showDossierListContainer() {
        return this.showElement(this.getDossiersListContainer());
    }

    async isSessionTimeoutAlertDisplayed() {
        return this.getMessageBoxContainer().isDisplayed();
    }

    async isBackgroundBlurred() {
        return this.getBlurredAppContainer().isDisplayed();
    }

    async getItemsCount(name, owner = null) {
        await this.moveDossierIntoViewPort(name, owner);
        const items = this.libraryItem.getItems(name, owner);
        // await this.click({ elem: this.getItem(name) });
        return items.length;
    }

    async getListContainerHeaderFont() {
        return this.getFontFamily(this.getListContainerHeader());
    }

    async isAuthoringCloseButtonDisplayed() {
        try {
            await this.waitForElementVisible(this.getAuthoringCloseBtn());
        } catch (error) {
            return false;
        }
        return true;
    }

    // system status
    getSystemStatusBar(index) {
        return this.$$('.mstrd-SystemStatusBar')[index];
    }

    getSystemStatusCloseBtn(index) {
        return this.getSystemStatusBar(index).$('.mstrd-SystemStatusBar-close');
    }

    async closeSystemStatusBar(index) {
        await this.click({ elem: this.getSystemStatusCloseBtn(index) });
    }

    async isSystemStatusBarDisplayed(index) {
        return this.getSystemStatusBar(index).isDisplayed();
    }

    async isSystemStatusCloseBtnDisplayed(index) {
        return this.getSystemStatusCloseBtn(index).isDisplayed();
    }

    /**
     * Check if a dossier is present in the library
     * @param {string} dossierName - Name of the dossier
     * @returns {Promise<boolean>} - True if dossier is present
     */
    async isDossierPresent(dossierName) {
        const dossierElement = await this.$(`[data-itemname="${dossierName}"]`);
        return await dossierElement.isExisting();
    }

    /**
     * Check if a dossier is inactive
     * @param {string} dossierName - Name of the dossier
     * @returns {Promise<boolean>} - True if dossier is inactive
     */
    async isDossierInactive(dossierName) {
        const inactiveElement = await this.$(`[data-itemname="${dossierName}"] .mstrd-DossierItem-name-inactive`);
        return await inactiveElement.isExisting();
    }

    /**
     * Check if a dossier is deprecated (contains "(Deprecated)" text)
     * @param {string} dossierName - Name of the dossier
     * @returns {Promise<boolean>} - True if dossier is deprecated
     */
    async isDossierDeprecated(dossierName) {
        const deprecatedElement = await this.$(`[data-itemname="${dossierName}"] .mstrd-DossierItem-name-inactive`);
        if (await deprecatedElement.isExisting()) {
            const text = await deprecatedElement.getText();
            return text.includes('(Deprecated)');
        }
        return false;
    }

    /**
     * Check if a dossier icon is grayscale
     * @param {string} dossierName - Name of the dossier
     * @returns {Promise<boolean>} - True if dossier icon is grayscale
     */
    async isDossierIconGrayscale(dossierName) {
        // Find the dossier item container first
        const dossierItemContainer = await this.$(`[data-itemname="${dossierName}"]`).parentElement();
        // Look for the grayscale class in the icon container
        const grayscaleElement = await dossierItemContainer.$('.mstrd-DossierItemIcon-imgContainer--grayscale');
        return await grayscaleElement.isExisting();
    }

    async isAIEnabled(name) {
        return this.getHomeCardAIEnabledIcon(name).isDisplayed();
    }
}
