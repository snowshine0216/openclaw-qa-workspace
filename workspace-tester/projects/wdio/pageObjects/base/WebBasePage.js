import { buildEventUrl } from '../../utils/index.js';
import BasePage from '../base/BasePage.js';

export default class WebBasePage extends BasePage {
    // Element locaters
    getFolderContainer() {
        return $('#folderAllModes');
    }

    getPathText() {
        return $('.mstrPathText:not(.hidden), .pathText');
    }

    getBackButton() {
        return $('.pathNavigationRight .tbBack0, #tbBack0');
    }

    getFolderContextMenu() {
        return $('#folderAllModes_cmm1');
    }

    // The back arrow next to 'M' icon
    getBackArrow() {
        return $('#tbBack #tbBack0');
    }

    getMstrLogo() {
        return this.$('#mstrLogo');
    }

    getMstrSectionView() {
        return $('#dktpSectionView');
    }

    getProjectHeader() {
        return $('.mstrProjectHeader');
    }

    getPathAccount() {
        return $('#mstrPathAccount');
    }

    getPathAncestors() {
        return $('.mstrPathAncestors');
    }

    getLicenseMessage() {
        return $('#licenseMsg0');
    }

    getLicenseButtons() {
        return this.getLicenseMessage().$$('.mstrButton');
    }

    getSecondLicenseButtons() {
        return $$('#licenseMsg1 .mstrButton');
    }

    getLicenseContinue() {
        return $$('#continue .mstrButton');
    }

    getProjectStatus() {
        return $('.mstrProjectStatus');
    }

    // Assertion helpers
    async waitForAlertAppear() {
        return this.waitForElementVisible(this.getErrorMessage());
    }

    async getAccountName() {
        const pathAccount = this.getPathAccount().$('span');
        return pathAccount.getText();
    }

    async getFolderItem(itemName) {
        const className = await $('#tbListView').getAttribute('class');

        if (className.indexOf('selected') >= 0) {
            return this.getFolderContainer().$(`.mstrListViewNameInfo a[title="${itemName}"]`);
        }

        const items = await this.getFolderContainer().$$('.mstrLargeIconViewItem');
        for (const item of items) {
            const count = await item.$$(`a[title="${itemName}"]`).length;
            if (count > 0) {
                return item.$('.mstrLargeIconViewItemLink');
            }
        }

        throw new Error(`Folder item not found for ${itemName}`);
    }


    // Action helper

    openFolderByID(folderID) {
        return browser.url(buildEventUrl(2001, { folderID }));
    }

    openSharedReports() {
        return browser.url(buildEventUrl(3002));
    }

    openMyReports() {
        return browser.url(buildEventUrl(3003));
    }

    open() {
        throw new Error('This method should be implemented in sub-class.');
    }

    async openHomePage() {
        await browser.url(buildEventUrl(3010));
        await this.waitForCurtainDisappear();
    }

    async continueLicenseWarning() {
        const licenseBtns = this.getLicenseButtons();
        let continueBtn = await licenseBtns.length;
        if (continueBtn) {
            await this.click({ elem: licenseBtns[0] });
        }
        const secondlicenseBtns = this.getSecondLicenseButtons();
        continueBtn = await secondlicenseBtns.length;
        if (continueBtn) {
            await this.click({ elem: secondlicenseBtns[0] });
        }
        const continueBtns = this.getLicenseContinue();
        continueBtn = await continueBtns.length;
        if (continueBtn) {
            await this.click({ elem: continueBtns[0] });
        }
    }

    /**
     * Open a page using folder browsing.
     * @param {string} path The full path of a report
     */
    async openByPath(path) {
        const pathSegments = Array.isArray(path) ? path : path.split('>');
        const parentFolder = pathSegments[1];

        if (parentFolder === 'Shared Reports') {
            await this.openSharedReports();
            await this._openAll(pathSegments.slice(2));
        } else if (parentFolder === 'My Reports') {
            await this.openMyReports();
            await this._openAll(pathSegments.slice(2));
        } else {
            throw new Error(`Folder path: ${path} is not supported.`);
        }

        await this.waitForCurtainDisappear();
    }

    async _openAll(folders) {
        for (const folder of folders) {
            await this.click({ elem: await this.getFolderItem(folder) });
        }
    }

    async webMovetoElement(el, offset = { x: 0, y: 0 }) {
        await this.sleep(2000);
        const location = await this.getElementPositionOfScreen(el, offset);
        await browser.action('pointer').move(location).perform();
    }

    async backToFolder() {
        const backTriangle = $('.tbBack1, #tbBack1');
        await this.webMovetoElement(backTriangle);
        await this.click({ elem: backTriangle });
        const backTo = $('#mojoPathPickerMenu a:first-child, #backHistoryPicker span:first-child');
        const backToText = await backTo.getText();
        await this.click({ elem: backTo });
        await this.waitForCurtainDisappear();
        await this.sleep(2000);
    }

    async clickBackArrow() {
        await this.click(this.getBackArrow());
        return this.waitForCurtainDisappear();
    }

    async backToHomePage() {
        await this.waitForCurtainDisappear();
        await this.click(this.getMstrLogo());
        await this.waitForElementAppear(this.getMstrSectionView());
        await this.waitForCurtainDisappear();
    }

    async closeAppPopupsByClickBlankPath() {
        const el = $('.mojoPath-path');
        return this.click(el, { x: 1, y: 1 });
    }

    /**
     * Click header path to navigate to parent folder
     * @example
     * The paths might be Microstrategy Tutorial > Shared Reports > Inner Folder > ...
     * you can navigate to 'Shared Reports' by calling clickPath('Shared Reports')
     * @param {String} path parent path(folder) name
     */
    async clickPath(path) {
        const pathLink = this.getPathAncestors().element(by.cssContainingText('a', path));
        await this.click(pathLink);
    }

    // Assertion helper

    /** Get the page title */
    async title() {
        await this.waitForCurtainDisappear();
        return browser.getTitle();
    }

    /**
     * Get the paths of the path bar
     * @returns {Promise<string[]>} The paths Promise
     */
    async paths() {
        await this.waitForCurtainDisappear();
        // add sleep here to wait for license warning loaded if needed
        await this.sleep(2000);
        await this.waitForElementVisible(this.getPathText());
        const paths = await this.getPathText()
            .$$('a, .mstrPathLast, .pathCurrent')
            .map((path) => path.getText());
        return paths.filter((p) => !!p);
    }


    getDocLayoutViewer() {
        return this.$$('.mstrmojo-DocLayoutViewer').filter((item) => item.isDisplayed())[0];
    }

    async scrollWebPageToBottom() {
        await browser.execute('window.scrollTo(0, document.body.scrollHeight)');
    }

    getWebWaitCurtain() {
        return this.$('#mstrWeb_waitCurtain');
    }

    getWebPageLoadingWaitBox() {
        return this.$$('#pageLoadingWaitBox').filter((el) => el.isDisplayed())[0];
    }

    async waitForWebCurtainDisappear() {
        await this.waitForElementInvisible(this.getWebWaitCurtain());
        await this.waitForElementInvisible(this.getWebPageLoadingWaitBox());
        await this.waitForElementInvisible(this.$('#waitBox .mstrWaitBox'));
        // In some scenarios the wait box id is 'mstrWeb_wait'
        await this.waitForElementInvisible(this.$('#mstrWeb_wait .mstrWaitBox'));
        await this.waitForElementInvisible(this.$$('.mstrmojo-Editor.mstrWaitBox.modal')[0]);
        // RSD loading curtain
        await this.waitForElementInvisible(this.$('#waitBox .mstrmojo-Editor-curtain'));
    }

    async waitAllToBeLoaded() {
        await this.waitPageLoading();
        await this.waitForElementVisible(this.getDocLayoutViewer().$('.mstrmojo-DocLayout'), 'waitContentLoading');
        await this.waitForWebCurtainDisappear();
    }

    /**
     * Whether export PDF/Excel/Html status page present
     * @returns {Promise<boolean>} wether page present
     */
    async isExportStatusPagePresent() {
        const exportStatus = $('.mstrContent');
        return this.isPresent(exportStatus);
    }

    /**
     * If it's a folder, return current folder name
     * If it's an file, return current file name
     */
    async getCurrentPageName() {
        const currentPathLocator = $('.mstrPathTextCurrent');
        await this.waitForElementAppear(currentPathLocator);
        return currentPathLocator.getText();
    }

    async getAlertTitle() {
        return $('.mstrAlertTitle').getText();
    }

    async isAlertDisplayed() {
        const alert = $('.mstrAlertTitle');
        return alert.isDisplayed();
    }

    async is404Page() {
        const text404 = await $('body').getText();
        return text404.includes('HTTP Status 404');
    }

    async projectStatus() {
        return this.getProjectStatus().getText();
    }

    async hoverOnMSTRLogo() {
        await this.hover({ elem: this.getMstrLogo() });
    }

    isContainer() {
        const container = browsers.params.isContainerEnv;
        console.log('Container: ', container);
        if (container === 'true') {
            return true;
        } else {
            return browser.options.baseUrl.includes('hypernow');
        }
    }
}
