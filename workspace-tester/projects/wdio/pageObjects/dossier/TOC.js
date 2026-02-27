import BasePage from '../base/BasePage.js';
import DossierPage from './DossierPage.js';
import { takeScreenshotByElement } from '../../utils/TakeScreenshot.js';

export default class TOC extends BasePage {
    constructor() {
        super();
        this.dossierPage = new DossierPage();
    }
    // Element locator
    getTOCIcon() {
        return this.$('.mstr-nav-icon[class*=icon-tb_toc]');
    }

    getMobileTOC() {
        return this.$('.mstrd-MobileDossierNavBarTitle');
    }

    getTOCPanel() {
        return this.$('.mstrd-DropdownMenu-main');
    }

    getTocInfo() {
        return this.$('.mstrd-ToCDropdownMenuContainer-headerInfo');
    }

    getTocTimestampInfo() {
        return this.getTocInfo().$$('div')[1];
    }

    async getMenuContainer() {
        const browserSize = await browser.getWindowSize();
        if (browserSize.width < 600) {
            return this.$('.mstrd-MobileDossierNavBarToc-menu');
        } else {
            return this.$('.mstrd-ToCDropdownMenuContainer .mstrd-DropdownMenu');
            // return this.$("//*[@class='mstrd-ToCDropdownMenuContainer']//*[contains(@class,'mstrd-DropdownMenu ')]");
        }
    }

    getCloseIcon() {
        return this.$('.mstrd-DropdownMenu-headerIcon.icon-pnl_close.visible');
    }

    async getPage({ chapterName, pageName }) {
        let currentChapter = '';
        const tocContainer = await this.getMenuContainer();
        await this.waitForElementVisible(tocContainer);
        if (this.isSafari()) {
            // the filter in else is asynchronous , the first page menu may complete before the chapter menu, then no element will be filtered out.
            // here use for loop to avoid asynchronous on safari.
            const menus = await tocContainer.$$('li');
            for (let i = 0; i < menus.length; i++) {
                const elem = menus[i];
                let elemText = await elem.getText();
                elemText = this.trimStringForSafari(elemText);
                const className = await elem.getAttribute('class');
                if (className.includes('mstrd-ToCDropdownMenuContainer-menuLevel1')) {
                    currentChapter = elemText;
                }
                if (pageName) {
                    if (currentChapter === chapterName && elemText === pageName) {
                        return elem;
                    }
                } else {
                    if (currentChapter === chapterName) {
                        return elem;
                    }
                }
            }
        } else {
            const els = await tocContainer.$$('li');
            for (let i = 0; i < els.length; i++) {
                const elem = els[i];
                let elemText = await elem.getText();

                elemText = this.trimStringForSafari(elemText);
                const className = await elem.getAttribute('class');
                if (className.includes('mstrd-ToCDropdownMenuContainer-menuLevel1')) {
                    currentChapter = elemText;
                }

                if (pageName) {
                    if (currentChapter === chapterName && elemText === pageName) {
                        return elem;
                    }
                } else {
                    if (currentChapter === chapterName) {
                        return elem;
                    }
                }
            }
        }
    }

    getTOCTitleName() {
        return this.$('div.mstrd-DropdownMenu-headerTitle');
    }

    async getTOCPin() {
        const tocContainer = await this.getMenuContainer();
        return tocContainer.$('.mstrd-DropdownMenu-headerIcon.icon-pin');
    }

    async getTOCUnpin() {
        const tocContainer = await this.getMenuContainer();
        return tocContainer.$('.mstrd-DropdownMenu-headerIcon.icon-unpin');
    }
    async getFavoritesIcon() {
        const tocContainer = await this.getMenuContainer();
        return tocContainer.$('.mstrd-ToCDropdownMenuContainer-favIconCustomize');
    }

    getDossierTitleInMobileView() {
        return this.$('.mstrd-MobileDossierNavBarTitle');
    }

    getTocHeader() {
        return this.$('.mstrd-ToCDropdownMenuContainer-headerInfo');
    }

    getSelectedFavoritesIcon() {
        return this.$('.mstrd-FavoriteIconButton--selected');
    }

    getConsumptionHorizontalTOCBar() {
        return this.$('.mstrd-DossierMenuBarToCContainer-ToC.mstr-toc');
    }

    // Action helper
    async isFavoritesIconSelected() {
        return this.getSelectedFavoritesIcon().isDisplayed();
    }

    async openMenu() {
        const browserSize = await browser.getWindowSize();
        await this.dossierPage.waitForDossierLoading();
        let tocIcon;
        if (browserSize.width < 600) {
            tocIcon = this.getMobileTOC();
        } else {
            tocIcon = this.getTOCIcon();
        }

        for (let times = 0; times < 3; times++) {
            // await this.click({ elem: this.getTOCIcon() });
            await this.click({ elem: tocIcon });
            await this.waitForElementVisible(await this.getMenuContainer());
            let flag = await (await this.getMenuContainer()).isDisplayed();
            if (flag) {
                break;
            } else {
                // await this.click({ elem: this.getTOCIcon() });
                await this.click({ elem: tocIcon });
            }
            await this.sleep(1000);
        }
        return this.waitForElementVisible(await this.getMenuContainer(), {
            msg: 'TOC menu was not open after 3 times click',
        });
    }

    async openMenuNoCheck() {
        await this.dossierPage.waitForDossierLoading();
        // wait TOC icon visible
        const tocIcon = this.getTOCIcon();
        await this.waitForElementVisible(tocIcon);
        await this.click({ elem: tocIcon });
    }

    async closeMenu({ icon = 'toc' }) {
        await this.closeMenuWithoutWait({ icon: icon });
        // return this.wait(this.EC.stalenessOf(await this.getMenuContainer()), 5000, 'TOC menu was not closed.');
        await this.waitForElementStaleness(await this.getMenuContainer(), {
            timeout: 5000,
            msg: 'TOC menu was not closed.',
        });
    }

    async closeMenuWithoutWait({ icon = 'toc' }) {
        if (icon === 'close') {
            await this.getCloseIcon().click();
        } else {
            await this.getTOCIcon().click();
        }
    }

    async goToPage({ chapterName, pageName }) {
        const page = await this.getPage({
            chapterName,
            pageName,
        });
        const pageUrl = await page.$('.focusable').getAttribute('href');
        const pageKey = pageUrl.substr(1 + pageUrl.lastIndexOf('/'));
        await this.click({ elem: page });
        await this.waitForItemLoading();
        return pageKey;
    }

    async goToPageWait({ chapterName, pageName }) {
        const page = await this.getPage({
            chapterName,
            pageName,
        });
        const pageUrl = await page.$('.focusable').getAttribute('href');
        const pageKey = pageUrl.substr(1 + pageUrl.lastIndexOf('/'));
        await this.click({ elem: page });
        await this.waitForItemLoading();
        await this.waitForPageIndicatorInvisible();
        return pageKey;
    }

    async goToPagenoWait({ chapterName, pageName }) {
        const page = await this.getPage({
            chapterName,
            pageName,
        });
        const pageUrl = await page.$('.focusable').getAttribute('href');
        const pageKey = pageUrl.substr(1 + pageUrl.lastIndexOf('/'));
        await page.click();
        return pageKey;
    }

    async openPageFromTocMenu({ chapterName, pageName }) {
        await this.openMenu();
        return this.goToPage({ chapterName, pageName });
    }

    async openPageFromTocMenuWait({ chapterName, pageName }) {
        await this.openMenu();
        return this.goToPageWait({ chapterName, pageName });
    }

    async openPageFromTocMenunoWait({ chapterName, pageName }) {
        await this.openMenu();
        return this.goToPagenoWait({ chapterName, pageName });
    }

    async hoverOnTocItem({ chapterName, pageName }) {
        await this.hover({ elem: await this.getPage({ chapterName, pageName }) });
        return this.sleep(1000);
    }

    async tocTitleName() {
        return this.getTOCTitleName().getText();
    }

    async pinTOC() {
        return this.click({ elem: await this.getTOCPin() });
    }

    async unpinTOC() {
        return this.click({ elem: await this.getTOCUnpin() });
    }

    async clickFavoritesIcon() {
        return this.click({ elem: await this.getFavoritesIcon() });
    }

    async favoriteByTOC() {
        if (!(await this.isFavoritesIconSelected())) {
            await this.clickFavoritesIcon();
        }
    }

    async removeFavoriteByTOC() {
        if (await this.isFavoritesIconSelected()) {
            await this.clickFavoritesIcon();
        }
    }

    async browseloop(testcase) {
        if ((await this.isTOCMenuOpen()) == false) {
            await this.openMenu();
            await this.pinTOC();
        }
        let currentChapter = '';
        let pageName = '';
        const tocContainer = await this.getMenuContainer();
        const menus = await tocContainer.$$('li');
        for (let i = 0; i < menus.length; i++) {
            const elem = menus[i];
            const className = await elem.getAttribute('class');
            const elemText = await elem.getText();
            if (className.includes('mstrd-ToCDropdownMenuContainer-menuLevel1')) {
                currentChapter = elemText;
            }
            if (className.includes('mstrd-ToCDropdownMenuContainer-menuLevel2')) {
                await this.click({ elem: elem });
                await this.waitForItemLoading();
                pageName = elemText;
                await this.dossierPage.hidePageIndicator();
                await takeScreenshotByElement(
                    this.dossierPage.getDossierView(),
                    testcase,
                    currentChapter + ':' + pageName
                );
            }
        }
        await this.unpinTOC();
        await this.closeMenu({ icon: 'toc menu' });
    }

    async openTocInMobileView() {
        await this.click({ elem: this.getDossierTitleInMobileView() });
    }

    // Assertion helper

    async isTOCMenuOpen() {
        const tocContainer = await this.getMenuContainer();
        return tocContainer.isDisplayed();
    }

    async isTOCDocked() {
        const tocContainer = await this.getMenuContainer();
        const className = await tocContainer.getAttribute('class');
        return className.includes('mstrd-DropdownMenu--docked');
    }

    async isFavoritesIconPresent() {
        const el = await this.getFavoritesIcon();
        return el.isDisplayed();
    }

    async hideTocTimeStamp() {
        await this.hideElement(this.getTocTimestampInfo());
    }

    async showTocTimeStamp() {
        await this.showElement(this.getTocTimestampInfo());
    }

    async clickLeftArrow() {
        const leftArrow = await this.$('.mstr-toc-scrollArrow.mstr-toc-leftArrow');
        await this.waitForElementVisible(leftArrow);
        await this.click({ elem: leftArrow });
        await browser.pause(2000); // wait bar scroll complete
    }

    async clickRightArrow() {
        const rightArrow = await this.$('.mstr-toc-scrollArrow.mstr-toc-rightArrow');
        await this.waitForElementVisible(rightArrow);
        await this.click({ elem: rightArrow });
        await browser.pause(2000); // wait bar scroll complete
    }

    async getHorizontalTocButton(pageName) {
        const tocBar = await this.getConsumptionHorizontalTOCBar();
        await this.waitForElementVisible(tocBar);

        const findPageButton = async () => {
            const triggers = await tocBar.$$('.mstr-toc-menuBarTrigger, .mstr-toc-menuBarMenuItem');
            for (const trigger of triggers) {
                const dataName = await trigger.getAttribute('data-name');
                const dataLabel = await trigger.getAttribute('data-label');
                const textLabel = await trigger.getText();
                if ([dataName, dataLabel, textLabel].includes(pageName)) {
                    return trigger;
                }
            }
        };

        const button = await findPageButton();

        return button;
    }

    async clickHorizontalTocMenu(pageName) {
        const button = await this.getHorizontalTocButton(pageName);
        await this.click({ elem: button });
        await this.waitForItemLoading();
    }

    async hoverHorizontalTocMenu(pageName) {
        let button = await this.getHorizontalTocButton(pageName);
        await this.hover({ elem: button });
        await this.sleep(1000);
    }

    // Return the horizontal TOC bar content container for further item queries.
    getHorizontalTocMenuContent() {
        return this.$('.mstr-toc-menuBarContent');
    }

    async clickPageInHorizontalTocMenu(pageName) {
        const tocContent = await this.getHorizontalTocMenuContent();
        await this.waitForElementVisible(tocContent);
        const button = await tocContent.$(`button[data-name="${pageName}"]`);
        await this.waitForElementVisible(button);
        await this.click({ elem: button });
        await this.waitForItemLoading();
    }
    // hover on page in horizontal TOC menu
    async hoverPageInHorizontalTocMenu(pageName) {
        const tocContent = await this.getHorizontalTocMenuContent();
        await this.waitForElementVisible(tocContent);
        const button = await tocContent.$(`button[data-name="${pageName}"]`);
        await this.waitForElementVisible(button);
        await this.hover({ elem: button });
        await this.sleep(1000);
    }
}
