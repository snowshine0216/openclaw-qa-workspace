import BasePage from '../base/BasePage.js';
import PromptEditor from '../common/PromptEditor.js';
import UserAccount from '../common/UserAccount.js';
import Alert from '../common/Alert.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';
import {
    checkElementByImageComparison,
    takeScreenshotByElement,
    takeScreenshotAndAttachToAllure,
} from '../../utils/TakeScreenshot.js';

export default class DossierPage extends BasePage {
    constructor() {
        super();
        this.userAccount = new UserAccount();
        this.promptEditor = new PromptEditor();
        this.alert = new Alert();
    }

    _normalizeMessage(message, defaultMessage) {
        if (typeof message === 'string') {
            return message;
        }
        return defaultMessage;
    }

    _normalizeTimeout(timeout) {
        if (typeof timeout === 'number') {
            return timeout * 1000;
        }
        return this.DEFAULT_WAIT_TIMEOUT * 1000;
    }

    // Element locator
    getHamburgerIcon() {
        return this.$('.mstrd-HamburgerIconContainer-icon');
    }

    getLeftNavBar() {
        return this.$('.mstrd-NavBar.mstrd-NavBar-left');
    }

    getPageLoadingIcon() {
        return this.$('.mstrd-LoadingIcon-loader');
    }

    getPageTitle() {
        return this.$('.mstrd-NavBarTitle-item.mstrd-NavBarTitle-item-active').$('.mstrd-DossierTitle');
    }

    getLibraryIcon() {
        return this.$('.mstr-nav-icon.icon-library,.mstrd-LibraryNavItem-link');
    }

    getSaaSLibraryIcon() {
        return this.$('.mstrd-LibraryNavItem-link');
    }

    getActivePageContainer() {
        return this.$('.mstrd-Page.activePage');
    }

    getScrollBox() {
        return this.getActivePageContainer().$('.hasVertical.mstrmojo-scrollNode');
    }

    getPageIndicator() {
        return this.$('.mstrd-DossierPageIndicator');
    }

    getShowPageIndicator() {
        return this.$('.mstrd-DossierPageIndicator.mstrd-show');
    }

    getDossierLinkNav() {
        return this.$('.mstrd-BackNavItem, .icon-backarrow');
    }

    getDossierView() {
        return this.$('.mstrd-DossierViewContainer-main');
    }

    getVizView() {
        return this.$('.gm-main-container');
    }

    getVizGroup() {
        return this.getDossierView().$$('.mstrmojo-GroupContainer')[1];
    }

    getDisplayedPage() {
        return this.$$('.mstrd-Page-content').filter(async (item) => item.isDisplayed())[0];
    }

    getNavigationBar() {
        return this.$('.mstrd-NavBarWrapper');
    }

    getNavigationBarLeft() {
        return this.getNavigationBar().$('.mstrd-NavBar-left');
    }

    getNavigationBarRight() {
        return this.getNavigationBar().$('.mstrd-NavBar-right');
    }

    getNavigationBarCollapsedIcon() {
        return this.$('.mstrd-NavBarTriggerWrapper');
    }

    getHomeIcon() {
        return this.$('.mstr-nav-icon[class*=icon-tb_home]');
    }

    getFavoriteIcon() {
        return this.$('.mstrd-FavoriteIconButton');
    }

    getUndoIcon() {
        return this.$('.mstrd-UndoNavItem .icon-tb_undo');
    }

    getRedoIcon() {
        return this.$('.mstrd-RedoNavItem .icon-tb_redo');
    }

    getShareIcon() {
        return this.$('.mstrd-ShareNavItemContainer [class*=" icon-tb_share"]');
    }

    getShareIconDisabled() {
        return this.$('.mstrd-ShareNavItemContainer [class*=" icon-tb_share"][disabled]');
    }

    getSharePanel() {
        return this.$('.mstrd-ShareDropdownMenuContainer');
    }

    getCommentsIcon() {
        return this.$('.mstrd-CommentIcon');
    }

    getTitle_Dossier() {
        return this.getPageTitle().$('.mstrd-DossierTitle-segment--dossierName');
    }

    getTitle_Chapter() {
        return this.getPageTitle().$('.mstrd-DossierTitle-segment--chapterName');
    }

    getTitle_Page() {
        return this.getPageTitle().$('.mstrd-DossierTitle-segment--pageName');
    }

    getTxtTitle_Dossier() {
        return this.getPageTitle().$('.mstrd-DossierTitle-segment--dossierName').getText();
    }

    getTxtTitle_Chapter() {
        return this.getPageTitle().$('.mstrd-DossierTitle-segment--chapterName').getText();
    }

    getDossierPanelStackSwitchTabbyName(text) {
        return this.$$('.mstrmojo-VITab-tab').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getDossierPanelStackRightSwitchArrow() {
        return this.$("//div[@class='mstrmojo-VITabStrip-rightBtn' and contains(@style, 'block')]");
    }
    getDossierPanelStackLeftSwitchArrow() {
        return this.$("//div[@class='mstrmojo-VITabStrip-leftBtn' and contains(@style, 'block')]");
    }

    getDossierViewModeIcon() {
        return this.$('.mstrd-ViewModeNavItemContainer');
    }

    getDossierViewModeOptions(itemName) {
        return this.$(`//span[text()='${itemName}']`);
    }

    async hoverOnVizGroup() {
        await this.hover({ elem: this.getVizGroup() });
    }

    getRevertFilter() {
        return this.$('.mstrd-Button.mstrd-Button--primary');
    }

    getVisualizationMenuButton() {
        return this.$('.hover-menu-btn');
    }

    async openShareDropDown() {
        await this.waitForCurtainDisappear();
        await this.clickAndNoWait({ elem: this.getShareIcon() });
        await this.waitForElementVisible(this.getSharePanel());
        return this.sleep(1000);
    }

    async favorite() {
        const isFavoriteSelected = await this.isSelected(this.getFavoriteIcon());
        if (!isFavoriteSelected) {
            await this.click({ elem: this.getFavoriteIcon() });
        }
    }

    async removeFavorite() {
        const isFavoriteSelected = await this.isSelected(this.getFavoriteIcon());
        if (isFavoriteSelected) {
            await this.click({ elem: this.getFavoriteIcon() });
        }
    }

    async closeShareDropDown() {
        await this.clickAndNoWait({ elem: this.getShareIcon() });
        await this.waitForElementInvisible(this.getSharePanel());
        return this.sleep(1000);
    }

    getAddToLibrary() {
        return this.$('.mstrd-PublishButton');
    }

    getAddToLibraryButton() {
        return this.getAddToLibrary();
    }

    getAddToLibraryCancelButton() {
        return this.getAddToLibrary().$('.icon-close');
    }

    getSnapshotBannerContainer() {
        return this.$(`//span[@id='snapshot-msg']//ancestor::div[@class='mstrd-DossierViewContainer-notifications']`);
    }

    getMessageContainerInSnapshotBanner() {
        return this.getSnapshotBannerContainer().$('.mstrd-PageNotification-msg');
    }

    getOpenDashboardInSnapshotBanner() {
        return this.getSnapshotBannerContainer().$('.mstrd-Button--primary');
    }

    getSnapshotBannerCloseButton() {
        return this.getSnapshotBannerContainer().$('.icon-close');
    }

    getInfoWindowLoadingIcon() {
        return this.$('mstrd-CursorSpinner--visible');
    }

    getRunInBackgroundButton() {
        return this.$('.mstrd-AddToHistoryButton');
    }

    getCurrentPage(pageKey) {
        return this.$(`//*[@data-k[contains(., '${pageKey}')]]`);
    }

    getCancelExecutionButton() {
        return this.$('.mstrd-CancelExecutionButton');
    }

    getCancelExecutionButtonByPage(pageKey) {
        return this.getCurrentPage(pageKey).$('.mstrd-CancelExecutionButton');
    }

    async reload() {
        await browser.refresh();
        await this.waitForDossierLoading();
        return this.waitForPageLoading();
    }

    async goBack() {
        await browser.back();
        await this.waitForDossierLoading();
    }

    getEditIcon() {
        return this.$('.icon-info_edit');
    }

    getRightNavBar() {
        return this.$('.mstrd-NavBar.mstrd-NavBar-right');
    }

    findImage() {
        return this.$('.mstrmojo-DocImage');
    }

    findShape() {
        return this.$('.mstrmojo-DocShape');
    }

    getDuplicateButton() {
        return this.$('.mstrd-DuplicateNavItem');
    }

    getTooltip() {
        return this.$('.ant-tooltip:not(.ant-tooltip-hidden)');
    }

    getResetIcon() {
        return this.$('.icon-tb_reset');
    }

    getConfirmResetButton() {
        return this.$('.mstrd-ConfirmationDialog-button');
    }

    getTemplateIcon() {
        return this.$('.mstrd-DossierTitle .mstrd-TemplateIcon');
    }

    getCertifiedIcon() {
        return this.$('.mstrd-DossierTitle .mstrd-CertifiedIcon');
    }

    getDossierPageNotLoadIndicator() {
        return this.$('.mstrd-DossierPageNotLoadIndicator');
    }

    async getNavigationBarBackgroundColor() {
        const backgroundColor = await this.getNavigationBar().getCSSProperty('background-color');
        return backgroundColor.value;
    }

    async getCurrentPageByKey() {
        const url = await browser.getUrl();
        const urlParts = url.split('/');
        const key = urlParts[urlParts.length - 1];
        return this.$(`.mstrd-Page[data-k="${key}"]`);
    }

    // Action helper

    async pageTitle() {
        await this.waitForElementVisible(this.getPageTitle());
        let res = [];
        let elem = await this.getPageTitle().$$('span');
        let len = elem.length;
        for (let i = 0; i < len; i++) {
            res.push(await elem[i].getText());
        }
        return res;
    }

    async clickPageTitle() {
        return this.click({ elem: this.getPageTitle() });
    }

    async clickSaaSLibraryIcon() {
        return this.click({ elem: this.getSaaSLibraryIcon() });
    }

    findButtonByText(text) {
        return this.$(`.mstrmojo-DocButton-Container*=${text}`);
    }

    findTextfieldByText(text) {
        return this.$$('.mstrmojo-DocTextfield .mstrmojo-DocTextfield-valueNode').filter(async (elem) => {
            const isDisplayed = this.getParent(elem).isDisplayed();
            const elemText = await elem.getText();
            return elemText === text && isDisplayed;
        })[0];
    }

    findImageByTitle(text) {
        return this.$(`.mstrmojo-DocImage[title="${text}"]`);
    }

    async clickBtnByTitle(text) {
        await this.waitForElementVisible(this.findButtonByText(text));
        // catch no click method exception on safari, use js to click if need
        await this.clickForSafari(this.findButtonByText(text));
        await this.waitForDossierLoading();
    }

    async clickTextfieldByTitle(text) {
        await this.waitForElementVisible(this.findTextfieldByText(text));
        await this.findTextfieldByText(text).click();
        await this.waitForDossierLoading();
    }

    async hoverOnTextfieldByTitle(text) {
        return this.hover({ elem: this.findTextfieldByText(text) });
    }

    async clickImage() {
        await this.waitForElementVisible(this.findImage());
        await this.findImage().click();
        await this.waitForDossierLoading();
    }

    async clickShape() {
        await this.waitForElementVisible(this.findShape());
        await this.findShape().click();
        await this.waitForDossierLoading();
    }

    async clickImageLinkByTitle(text) {
        await this.waitForElementVisible(this.findImageByTitle(text));
        await this.findImageByTitle(text).click();
        await this.waitForDossierLoading();
    }

    getContextMenuIcon(buttonElement) {
        return buttonElement.$('.mstrmojo-Button-text');
    }

    getContextMenuItem(menuItemText) {
        return this.$$('.mstrmojo-Popup.mstrmojo-Menu .mstrmojo-ListBox-cell').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === menuItemText;
        })[0];
    }

    async selectLinkFromContextMenu(btnText, menuItemText) {
        const buttonElement = this.findButtonByText(btnText);
        await this.rightClick({ elem: buttonElement });
        await this.getContextMenuItem(menuItemText).click();
    }

    async clickHamburgerMenu() {
        return this.clickAndNoWait({ elem: this.getHamburgerIcon() });
    }

    // Dossier level loading
    async waitForDossierLoading() {
        // dynamic loading icon will appear firstly so wait for dynamic loading icon disappear firstly
        await this.waitForDynamicElementLoading();
        await this.sleep(1000);
        await this.waitForPageLoading();
        await this.sleep(1000);
    }

    // Page level loading
    async waitForPageLoading() {
        await this.sleep(1000);
        await browser.waitUntil(
            async () => {
                let promptEditor = await this.promptEditor.getPromptEditor().isDisplayed();
                let pageLoadingIcon = await this.getPageLoadingIcon().isDisplayed();

                // Workaround for the issue that the page loading icon state is not updated in **headless** mode.
                // The reason why the workaround works is unclear but it works.
                // I found this workaround because I wanted to take screenshot to debug the issue aforementioned,
                // and found that the issue is gone after I added the take screenshot code.
                await browser.saveScreenshot(`./reports/waitForPageLoading.png`);

                return promptEditor || !pageLoadingIcon;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Loading a dossier page takes too long.',
            }
        );
        return this.sleep(1000);
    }

    async waitForPageLoadingMoreWaitTime(waitTime) {
        await this.waitForPageLoading();
        await this.sleep(waitTime);
    }

    // Info window loading
    async waitForInfoWindowLoading() {
        await this.sleep(1000);
        const infoWindowLoadingIcon = await this.getInfoWindowLoadingIcon();
        await this.waitForElementInvisible(infoWindowLoadingIcon, {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Loading info window takes too long.',
        });
        await this.sleep(1000);
    }

    async goToLibrary() {
        // Handle unexpected Library/Mojo errors
        const isErrorPresent = await this.isErrorPresent();
        const ispromptEditorOpen = await this.promptEditor.isEditorOpen();
        if (isErrorPresent) {
            const errorMsg = await this.errorMsg();
            errorLog(`ERROR: Unexpected error dialogue has been triggered: "${errorMsg}"`);
            await this.dismissError();

            if (ispromptEditorOpen) {
                await this.promptEditor.cancelEditor();
            } else {
                await this.waitForItemLoading();
            }
        } else if (ispromptEditorOpen) {
            await this.promptEditor.cancelEditor();
        } else if (await this.isLibraryIconPresent()) {
            if (this.isSafari()) {
                //element not interactable in safari
                await this.executeScript('arguments[0].click();', await this.getLibraryIcon());
            } else {
                await this.click({ elem: this.getLibraryIcon() });
            }
            await this.waitForLibraryLoading();
        }

        const isMojoErrorPresent = await this.isMojoErrorPresent();
        if (isMojoErrorPresent) {
            const mojoErrorMsg = this.mojoErrorMsg();
            errorLog(`ERROR: Unexpected mojo error dialogue has been triggered: "${mojoErrorMsg}"`);
            await this.dismissMojoError();
            await this.waitForItemLoading();
        }
        return this.sleep(100);
    }

    async switchPageByKey(direction, delay) {
        switch (direction) {
            case 'right':
                await this.arrowRight();
                break;
            case 'left':
                await this.arrowLeft();
                break;
            default:
                break;
        }
        if (delay !== 0) {
            await this.sleep(delay);
            await this.waitForPageLoading();
            await this.sleep(delay);
        }
        return this.sleep(100);
    }

    async goBackFromDossierLink() {
        await this.waitForDossierLoading();
        const elem = this.getDossierLinkNav();
        await this.waitForElementVisible(elem);
        await this.waitForElementClickable(elem);
        await this.getDossierLinkNav().click();
        return this.waitForPageLoading();
    }

    async openUserAccountMenu() {
        return this.userAccount.openUserAccountMenu();
    }

    async closeUserAccountMenu() {
        return this.userAccount.closeUserAccountMenu();
    }

    async clickDuplicateButton() {
        await this.click({ elem: this.getDuplicateButton() });
        return this.waitForItemLoading();
    }

    async logout(options = {}) {
        return this.userAccount.logout(options);
    }

    async addToLibrary() {
        await this.waitForElementVisible(this.getAddToLibrary());
        await this.click({ elem: this.getAddToLibraryButton() });
        return this.waitForElementInvisible(this.getAddToLibrary());
    }

    async cancelAddToLibrary() {
        await this.waitForElementVisible(this.getAddToLibraryCancelButton());
        await this.waitForElementEnabled(this.getAddToLibraryCancelButton());
        await this.clickAndNoWait({ elem: this.getAddToLibraryCancelButton() });
        return this.waitForElementInvisible(this.getAddToLibrary());
    }

    async clickUndo() {
        await this.click({ elem: this.getUndoIcon() });
        return this.waitForItemLoading();
    }

    async clickOpenDashboardOnSnapshotBanner() {
        await this.click({ elem: this.getOpenDashboardInSnapshotBanner() });
        return this.waitForItemLoading();
    }

    async dismissSnapshotBanner() {
        await this.click({ elem: this.getSnapshotBannerCloseButton() });
        await this.waitForElementInvisible(this.getSnapshotBannerContainer());
    }

    async clickUndoInDossier() {
        await this.click({
            elem: this.$(`//div[contains(@class, 'mstrmojo-VIToolbar')]//div[contains(@class, 'undo')]`),
        });
        return this.waitForItemLoading();
    }

    async clickRedo() {
        await this.click({ elem: this.getRedoIcon() });
        return this.waitForItemLoading();
    }

    async clickRedoInDossier() {
        await this.click({
            elem: this.$(`//div[contains(@class, 'mstrmojo-VIToolbar')]//div[contains(@class, 'redo')]`),
        });
        return this.waitForItemLoading();
    }

    async resetDossier() {
        await this.click({ elem: this.getResetIcon() });
        await browser.pause(2000);
        await this.click({ elem: this.getConfirmResetButton() });
        await this.waitForDossierLoading();
        return this.waitForItemLoading();
    }

    async resetDossierNoWait() {
        await this.click({ elem: this.getResetIcon() });
        await this.clickAndNoWait({ elem: this.getConfirmResetButton() });
    }

    async resetDossierIfPossible() {
        // Additional wait for stability
        await browser.pause(5000);
        await this.waitForCurtainDisappear();
        if (!(await (await this.getResetIcon()).getAttribute('aria-label')).includes('disabled')) {
            await this.resetDossier();
        }
    }

    async waitForPageIndicatorDisappear() {
        await this.waitForElementStaleness(this.getShowPageIndicator());
    }

    async hidePageIndicator() {
        if (await this.getShowPageIndicator().isDisplayed()) {
            await this.hideElement(this.getShowPageIndicator());
        }
    }

    async clickHomeIcon() {
        await this.click({ elem: this.getHomeIcon() });
    }

    // Assertion helper

    async isLibraryIconPresent() {
        return this.getLibraryIcon().isDisplayed();
    }

    async isBackIconPresent() {
        return this.$('.icon-backarrow_rsd').isDisplayed();
    }

    async isNavigationBarPresent() {
        return this.$('.mstrd-DossierViewNavBarContainer').isDisplayed();
    }

    async isPageTitlePresent() {
        return this.getPageTitle().isDisplayed();
    }

    async isAccountIconPresent() {
        return this.userAccount.getUserAccount().isDisplayed();
    }

    async isAccountDividerPresent() {
        return this.userAccount.getAccountDivider().isDisplayed();
    }

    async isAccountOptionPresent(text) {
        return this.userAccount.getAccountMenuOption(text).isDisplayed();
    }

    async isLogoutPresent() {
        return this.userAccount.getLogoutButton().isDisplayed();
    }

    async isAddToLibraryDisplayed() {
        // add wait here to wait for add to library button shown
        await this.sleep(1000);
        return this.getAddToLibrary().isDisplayed();
    }

    async isNavigationBarCollapsedIconPresent() {
        return this.getNavigationBarCollapsedIcon().isDisplayed();
    }

    async title() {
        await this.waitForCurtainDisappear();
        await this.waitForElementVisible(this.getPageTitle(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Dossier title is not displayed.',
        });
        return this.pageTitle();
    }

    async currentPageIndicator() {
        const el = await this.getPageIndicator();
        const value = await getAttributeValue(el, 'innerText');
        return value;
    }

    async isOnDossierPage() {
        return this.getActivePageContainer().isDisplayed();
    }

    async isRevertFilterDisplayed() {
        return this.getRevertFilter().isDisplayed();
    }

    async clickAddToLibraryButton() {
        await this.click({ elem: this.getAddToLibraryButton() });
        return this.waitForItemLoading();
    }

    async clickDossierPanelStackSwitchTab(text) {
        await this.click({ elem: this.getDossierPanelStackSwitchTabbyName(text) });
        return this.waitForPageLoading();
    }

    async clickDossierPanelStackRightSwitchArrow() {
        return this.click({ elem: this.getDossierPanelStackRightSwitchArrow() });
    }

    async clickDossierPanelStackLeftSwitchArrow() {
        return this.click({ elem: this.getDossierPanelStackLeftSwitchArrow() });
    }

    async closePopupsByClickBlankPathinRsd() {
        return this.click({ elem: this.getDocView(), offset: { x: 1, y: 1 } });
    }

    async expandCollapsedNavBar() {
        await this.click({ elem: this.getNavigationBarCollapsedIcon() });
        return this.sleep(500);
    }

    async hoverOnCertifiedIcon() {
        await this.hover({ elem: this.getCertifiedIcon() });
        await this.waitForElementVisible(await this.getTooltip());
    }

    async hoverOnTemplateIcon() {
        await this.hover({ elem: this.getTemplateIcon() });
        await this.waitForElementVisible(await this.getTooltip());
    }

    async isButtonConntextMenuPresent(btnText) {
        const buttonElement = await this.findButtonByText(btnText);
        return (await buttonElement.isDisplayed()) ? this.getContextMenuIcon(buttonElement).isDisplayed() : false;
    }

    async hoverOnLibraryIcon() {
        return this.hover({ elem: this.getLibraryIcon() });
    }

    async isImagePresent(text) {
        return this.findImageByTitle(text).isDisplayed();
    }

    async isHomeIconPresent() {
        return this.isHomeIconPresent().isDisplayed();
    }

    async isFavoriteSelected() {
        const isFavoriteSelected = await this.isSelected(this.getFavoriteIcon());
        return isFavoriteSelected;
    }

    async getDossierChapterTooltip() {
        const times = 10;
        await this.hover({ elem: this.getTitle_Chapter() });
        let flag = await this.getTooltipContainer().isDisplayed();
        for (let i = 1; i < times && !flag; i++) {
            await this.hover({ elem: this.getTitle_Chapter() });
            flag = await this.getTooltipContainer().isDisplayed();
        }
        const toolTipString = await this.getTooltipContainer().getText();
        return toolTipString.trim();
    }

    async getDossierPageTooltip() {
        const times = 10;
        await this.hover({ elem: this.getTitle_Page() });
        let flag = await this.getTooltipContainer().isDisplayed();
        for (let i = 1; i < times && !flag; i++) {
            await this.hover({ elem: this.getTitle_Page() });
            flag = await this.getTooltipContainer().isDisplayed();
        }
        const toolTipString = await this.getTooltipContainer().getText();
        return toolTipString.trim();
    }

    async isEditIconPresent() {
        return this.getEditIcon().isDisplayed();
    }

    async clickEditIcon() {
        await this.waitForElementVisible(this.getEditIcon(), {
            msg: 'Edit icon is not displayed.',
        });
        await this.click({ elem: this.getEditIcon() });
        return this.waitForItemLoading();
    }

    async clickCloseBtn() {
        const closeBtn = $('div.mstrmojo-Button-text=Close');
        await this.waitForElementVisible(closeBtn, {
            msg: 'Close button is not displayed.',
        });
        await this.click({ elem: closeBtn });
    }

    async clickVisibleButtonByAriaLabel(labelText = 'Cancel') {
        const allButtons = await $$(`div[role="button"][aria-label="${labelText}"]`);
        for (const btn of allButtons) {
            if (await btn.isDisplayed()) {
                await btn.click();
                return;
            }
        }
        throw new Error(`No visible button found with aria-label="${labelText}"`);
    }

    async isUndoEnabled() {
        return (
            (await this.getUndoIcon().isDisplayed()) &&
            (await this.getUndoIcon().getAttribute('aria-disabled')) === 'false'
        );
    }

    async isRedoEnabled() {
        return (
            (await this.getRedoIcon().isDisplayed()) &&
            (await this.getRedoIcon().getAttribute('aria-disabled')) === 'false'
        );
    }
    async waitForDossierPageNotLoadIndicator() {
        await this.waitForElementVisible(this.getDossierPageNotLoadIndicator(), {
            msg: 'Dossier page not load indicator is not displayed.',
        });
    }

    async getLibraryHomeTooltipText() {
        await this.hover({ elem: this.getLibraryIcon() });
        await this.waitForElementVisible(await this.getTooltip());
        return this.getTooltip().getText();
    }

    async checkImageCompareForDocView(testCase, imageName) {
        await this.waitForElementVisible(this.getDisplayedPage());
        await takeScreenshotAndAttachToAllure(this.getDisplayedPage(), testCase, imageName);
    }

    async takeScreenshotByDocView(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getDisplayedPage());
        await takeScreenshotByElement(this.getDisplayedPage(), testCase, imageName, tolerance);
    }

    async doesMstrRootHaveErrorClass() {
        const cls = await this.getMstrRoot().getAttribute('class');
        return !!cls && cls.includes('hasError');
    }

    async isDuplicateButtonDisplayed() {
        return this.getDuplicateButton().isDisplayed();
    }

    async switchViewMode(viewMode) {
        await this.waitForElementVisible(this.getDossierViewModeIcon(), {
            msg: 'Dossier view mode icon is not displayed.',
        });
        await this.click({ elem: this.getDossierViewModeIcon() });
        await this.click({ elem: this.getDossierViewModeOptions(viewMode) });
        await this.waitForPageLoading();
    }

    async getFavoriteTooltipText() {
        await this.hover({ elem: this.getFavoriteIcon() });
        await this.waitForElementVisible(await this.getTooltip());
        return this.getTooltip().getText();
    }

    async closeInfoWindow() {
        const closeBtn = $(`//div[@class='hover-btn close-btn accessible visible']`);
        await this.waitForElementVisible(closeBtn, {
            msg: 'Close button is not displayed.',
        });
        await this.click({ elem: closeBtn });
    }

    async clickRunInBackgroundButton() {
        await this.waitForElementVisible(this.getRunInBackgroundButton(), { timeout: 3 * 60 * 1000 });
        // await this.click({ elem: this.getRunInBackgroundButton() });
        try {
            await this.getRunInBackgroundButton().click();
        } catch (error) {
            // Handle error if needed
            console.error('Error clicking Run in Background button:', error);
            await browser.execute((el) => el.click(), await this.getRunInBackgroundButton());
        }

        await this.waitForElementInvisible(this.getRunInBackgroundButton());
    }

    async isRunInBackgroundButtonDisplayed() {
        try {
            await this.waitForElementVisible(this.getRunInBackgroundButton(), {
                timeout: 30 * 1000, // 15 seconds to account for 10-second delay + buffer
                msg: 'Run in background button did not appear within expected time.',
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async getMessageContainerInSnapshotBannerText() {
        return this.getMessageContainerInSnapshotBanner().getText();
    }

    async clickCancelExecutionButton(option) {
        const { isWait = false } = option || {};
        const el = this.getCancelExecutionButton();
        await this.clickByForce({ elem: el });
        if (isWait) {
            await this.waitForCurtainDisappear();
        }
    }

    async clickCancelExecutionButtonInCurrentPage(option) {
        const { isWait = false } = option || {};
        const url = await browser.getUrl();
        const pageKey = url.substring(url.lastIndexOf('/') + 1);
        const el = this.getCancelExecutionButtonByPage(pageKey);
        await this.clickByForce({ elem: el });

        if (isWait) {
            await this.waitForCurtainDisappear();
        }
    }

    async isCancelButtonDisplayed() {
        try {
            await this.waitForElementVisible(this.getCancelExecutionButton(), {
                timeout: 60 * 1000, // 60 seconds to account for 10-second delay + buffer
                msg: 'Cancel execution button did not appear within expected time.',
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async hoverOnSwiperPage() {
        const elem = await this.$('.mstrd-SwiperPage');
        await this.hover({ elem });
    }

    async hoverOnVisualizationMenuButton() {
        const elem = await this.getVisualizationMenuButton();
        await browser.execute(el => {
            el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        }, elem);
    }

    async unhoverOnVisualizationMenuButton() {
        const elem = await this.getVisualizationMenuButton();
        await browser.execute(el => {
            el.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
            el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        }, elem);
    }

}
