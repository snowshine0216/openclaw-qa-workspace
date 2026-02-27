import BasePage from '../base/BasePage.js';
import Panel from '../common/Panel.js';
import DossierPage from '../dossier/DossierPage.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

export default class TOCMenu extends BasePage {
    constructor() {
        super();
        this.panel = new Panel();
        this.dossierPage = new DossierPage();
        this.dossierAuthoringPage = new DossierAuthoringPage();
    }

    // Element locator

    getTOCIcon() {
        return this.$('.mstr-nav-icon[class*=icon-tb_toc]');
    }

    getMenuContainer() {
        return this.$('.mstrd-ToCDropdownMenuContainer');
    }

    getMenuContent() {
        return this.getMenuContainer().$('.mstrd-ToCDropdownMenuContainer-content');
    }

    getDockIcon() {
        return this.basePanel.getDockIcon(this.getMenuContainer());
    }

    getUndockIcon() {
        return this.basePanel.getUndockIcon(this.getMenuContainer());
    }

    getDockPanel() {
        return this.basePanel.getDockPanel(this.getMenuContainer());
    }

    getTOCCloseIcon() {
        return this.basePanel.getCloseIcon(this.getMenuContainer());
    }

    getMenuList() {
        return this.getMenuContainer().$('ul');
    }

    getSelectedPage() {
        return this.getMenuContainer()
            .$('.mstrd-ToCDropdownMenuContainer-menuLevel2.mstrd-selected')
            .$('.mstrd-ToCDropdownMenuContainer-menuText');
    }

    getDossierName() {
        return this.$('.mstrd-DropdownMenu-headerTitle');
    }

    getPageByName(pageName) {
        return this.$$('.mstrd-ToCDropdownMenuContainer-menuLevel2').filter(async (elem) => {
            const name = await elem.getText();
            return name === pageName;
        });
    }

    getPageByNameByChapter(chapterName, pageName) {
        return this.$(
            `//li[contains(@class, 'mstrd-ToCDropdownMenuContainer-menuLevel1')][./a[./*[@class='mstrd-ToCDropdownMenuContainer-menuText'][text()='${chapterName}']]]/following-sibling::li[contains(@class, 'mstrd-ToCDropdownMenuContainer-menuLevel2')][./a[./*[@class='mstrd-ToCDropdownMenuContainer-menuText'][text()='${pageName}']]]`
        );
    }

    getChapterName(chapterName) {
        return this.$(
            `//li[contains(@class, 'mstrd-ToCDropdownMenuContainer-menuLevel1')][./a[./*[@class='mstrd-ToCDropdownMenuContainer-menuText'][text()='${chapterName}']]]`
        );
    }

    getChapterByName(chapterName) {
        return this.$$('.mstrd-ToCDropdownMenuContainer-menuLevel1').filter(async (elem) => {
            const name = await elem.getText();
            return name === chapterName;
        })[0];
    }

    getTocFieldToRightClick() {
        return this.$('//div[div[@class = "chapter-dnd-indicator"]]');
    }

    getContentsPanel() {
        return this.$('#rootView .mstrmojo-RootView-toc');
    }

    getPageMenuByName(pageName) {
        return this.getContentsPanel().$(`//span[text()="${pageName}"]`);
    }

    getChapterMenuIcon(chapterName) {
        return this.getContentsPanel().$(`//div[@aria-label="${chapterName}"]//div[@class="right-toolbar"]`);
    }

    // Action helper

    async openMenu() {
        await this.getTOCIcon().click();
        await this.waitForElementClickable(this.getMenuContainer(), { timeout: 5000, msg: 'TOC menu was not open.' });
    }

    async closeMenu() {
        return this.panel.closePanel(this.getMenuContainer());
    }

    async dockTOCMenu() {
        return this.panel.dockPanel(this.getMenuContainer());
    }

    async undockTOCMenu() {
        return this.panel.undockPanel(this.getMenuContainer());
    }

    async goToPage(chapterName, pageName) {
        await this.getPageByNameByChapter(chapterName, pageName).click();
        await this.sleep(1000);
        return this.dossierPage.waitForPageLoading();
    }

    async switchPageTo(pageName, delay) {
        await this.getPageByName(pageName).click();
        if (delay !== 0) {
            await this.sleep(delay);
            await this.dossierPage.waitForPageLoading();
            await this.sleep(delay);
        }
    }

    async goToChapter(chapterName, specType) {
        await this.getChapterByName(chapterName).click();
        await this.sleep(1000);
        return this.dossierPage.waitForPageLoading(specType);
    }

    async scrollToBottom() {
        let offsetHeight = await this.getMenuContainer().getCSSProperty('height');
        offsetHeight = offsetHeight.split('p')[0];
        await this.executeScript(
            'arguments[0].scrollTop = arguments[1];',
            this.getMenuList().getWebElement(),
            offsetHeight
        );
        return this.sleep(1000);
    }

    // Assertion helper
    async isTOCIconPresent() {
        return this.getTOCIcon().isDisplayed();
    }

    async isPanelCloseIconDisplayed() {
        return this.panel.isPanelCloseIconDisplayed(this.getMenuContainer());
    }

    async isDockIconDisplayed() {
        return this.panel.isDockIconDisplayed(this.getMenuContainer());
    }

    async isUndockIconDisplayed() {
        return this.panel.isUndockIconDisplayed(this.getMenuContainer());
    }

    async isLeftDocked() {
        return this.panel.isLeftDocked(this.getMenuContainer());
    }

    async isRightDocked() {
        return this.panel.isRightDocked(this.getMenuContainer());
    }

    async isTOCLightTheme() {
        return this.getMenuContainer().$('.mstrd-DropdownMenu--theme-light').isDisplayed();
    }

    async assertDossierName() {
        return this.getDossierName().getText();
    }

    async getSelectedPageName() {
        return this.getSelectedPage().getText();
    }

    async getMenuContainerWidth() {
        const eleSize = await this.getMenuContainer().$('.mstrd-DropdownMenu').getSize();
        return eleSize.width;
    }

    async getMenuListHeight() {
        const eleSize = await this.getMenuList().getSize();
        return eleSize.height;
    }

    async getMenuListScrollHeight() {
        const scrollHeight = await this.getMenuList().getAttribute('scrollHeight');
        return parseInt(scrollHeight);
    }

    async getMenuContentHeight() {
        const eleSize = await this.getMenuContent().getSize();
        return eleSize.height;
    }

    async getMenuContentScrollHeight() {
        const elem = this.getMenuContent().$('.mstr-ArrowNavigableList');
        const scrollHeight = await getAttributeValue(elem, 'scrollHeight');
        return parseInt(scrollHeight);
    }

    async hoverOverPage(chapterName, pageName) {
        await this.hover({ elem: this.getPageByNameByChapter(chapterName, pageName) });
        return this.sleep(1500);
    }

    async hoverOverChapter(chapterName) {
        await this.hover({ elem: this.getChapterName(chapterName) });
        return this.sleep(1500);
    }

    async createNewPage() {
        await this.rightClick({ elem: this.getTocFieldToRightClick() });
        await this.click({ elem: this.dossierAuthoringPage.getMenuItem("Insert Page") });
    }

    async createNewChapter() {
        await this.rightClick({ elem: this.getTocFieldToRightClick() });
        await this.click({ elem: this.dossierAuthoringPage.getMenuItem("Insert Chapter") });
    }

    async duplicatePage(pageName) {
        await this.rightClick({ elem: this.getPageMenuByName(pageName) });
        await this.click({ elem: this.dossierAuthoringPage.getMenuItem("Duplicate Page") });
        // this click is added to remove toltip that is shown after element under "Duplicate Page" button is no longer overlayed by that button
        await this.clickAndNoWait({ elem: this.getTocFieldToRightClick() });
    }

    async duplicateChapter(chapterName) {
        await this.rightClick({ elem: this.getChapterMenuIcon(chapterName) });
        await this.click({ elem: this.dossierAuthoringPage.getMenuItem("Duplicate Chapter") });
        // this click is added to remove toltip that is shown after element under "Duplicate Chapter" button is no longer overlayed by that button
        await this.clickAndNoWait({ elem: this.getTocFieldToRightClick() });
    }
}
