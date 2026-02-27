import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import Common from './Common.js';
import ContentsPanel from '../dossierEditor/ContentsPanel.js';

/**
 * Page represing the Contents Panel
 * @extends BasePage
 * @author Tingjun Ma <tinma@microstrategy.com>
 * @author Sulochana Singh <ssingh@microstrategy.com>
 */
export default class TOCcontentsPanel extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
        this.contentsPanel = new ContentsPanel();
    }

    // Element locators

    get TOC() {
        return this.$('.mstrmojo-TableOfContents');
    }

    get changeViewContextMenu() {
        return this.TOC.$$('.item.mnu')[0];
    }

    // position: Top or Bottom
    getTabView(position) {
        switch (position.toUpperCase()) {
            case 'TOP':
                return this.$(`//div[@class ='mstrmojo-VITabStrip mstrmojo-LayoutTabStrip alignLeft alignTop']`);
            case 'BOTTOM':
                return this.$(`//div[@class ='mstrmojo-VITabStrip mstrmojo-LayoutTabStrip alignLeft']`);
            default:
                throw 'Invalid position';
        }
    }

    /**
     * Return the element of Cover Image div
     */
    get coverImageBtn() {
        return this.$('.image-and-btn');
    }

    /**
     * Return the URL box for the pop up change cover image window
     */
    get coverImageUrlBox() {
        return this.$('.mstrmojo-vi-ui-editors-CoverPageEditor input');
    }

    getCoverIamgeWithURL(url) {
        return this.$(`//img[@class='mstrmojo-coverpage-image' and @src='${url}']`);
    }

    getCoverIamge(url) {
        return this.$(`//img[@class='mstrmojo-coverpage-image']`);
    }

    /**
     * Obtain the sample cover image by given image order (index)
     * @param {string} sampleImageOrder
     */
    getCoverSampleImage(sampleImageOrder) {
        return this.$(`(//img[contains(@class, 'coverPageItem')])[${sampleImageOrder}]`);
    }

    /**
     *  Obtain the white spaces (wrapper) where chapter/page menu locates
     *  Always get the lower wrapper of the first chapter to avoid other chapters blocking the TableOfContents wrapper
     *  Inspired by VI Java Xpath library
     *  @returns {Promise<ElementFinder>} HTML<div> Contents Panel chapter/page wrapper
     */
    get chapterWrapper() {
        return this.TOC.$$('.reorder-dropzone')[0];
    }

    /**
     * Obtain the empty drop zone below the chapter by given chapter order index
     * @param {string} chapterIndex
     */
    getChapterField(chapterIndex) {
        return this.TOC.$(`(.//div[contains(@class, 'reorder-dropzone')])[${chapterIndex}]`);
    }

    /**
     *  Obtain Contexts Panel chapter title
     *  @param {string} chapterTitle chapterTitle
     *  @returns {Promise<ElementFinder>} HTML<div> The title text section of a chapter
     */
    getChapterByName(chapterTitle) {
        return this.TOC.$(`//div[contains(@class, 'title-text')]//div[text()='${chapterTitle}']`);
    }

    /**
     * Obtain the context menu clickable icon (three vertical dots on the right of the chapter) by given chapter name
     * @param {string} chapterTitle
     */
    getChapterTitleContextMenu(chapterTitle) {
        return this.$(
            `//div[contains(@class, 'title-text') and child::div[text() = '${chapterTitle}']]/following-sibling::div[contains(@class,'right-toolbar')]//div[contains(@class,'item mnu')]`
        );
    }

    // expand/collapse chapter icon
    getChapterLeftToolbar(chapterTitle) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-TableOfContents')]//div[contains(@class, 'title-text')]//div[text()='${chapterTitle}']/../..//div[contains(@class, 'left-toolbar')]`
        );
    }

    // Get the chapter panel which holds the pages (can be used to verify whether the chapter is collapsed  by checking the display style)
    getChapterContentPanel(chapterTitle) {
        return this.$(
            `//div[text()='${chapterTitle}']/ancestor::div[@class='mstrmojo-VIPanel-titlebar']/parent::div/div[@class='mstrmojo-VIPanel-content']`
        );
    }

    // Get the highest level of div for each chapter, can be used to verify the sequence of the chapter by comparing the id
    getChapterVIPanelPortlet(chapterTitle) {
        return this.$(`//div[text()='${chapterTitle}']/ancestor::div[@class='mstrmojo-VIPanel-titlebar']/..`);
    }

    /**
     * Obtain page editable text (page name) by chapter title and page title
     * @param {string} chapterTitle
     * @param {string} pageTitle
     */
    getPageTitleText(chapterTitle, pageTitle) {
        return this.$(
            `//div[@class='mstrmojo-VIPanel-titlebar']//child::*[text()='${chapterTitle}']/../..//parent::*[@class='mstrmojo-VIPanel-titlebar']//parent::*[contains(@class, 'mstrmojo-VIPanel')]//child::*[@class='mstrmojo-VIPanel-content']//div[contains(@class, 'item unit ic')]//child::*[text()='${pageTitle}']`
        );
    }

    getCurrentPage(pageTitle, chapterTitle) {
        return this.$(
            `//div[@class='mstrmojo-VIPanel-titlebar']//child::*[text()='${chapterTitle}']/../..//parent::*[@class='mstrmojo-VIPanel-titlebar']//parent::*[contains(@class, 'mstrmojo-VIPanel')]//child::*[@class='mstrmojo-VIPanel-content']//div[contains(@class,'item unit icundefined') and contains(@class,'current-display')]//span[text()='${pageTitle}']`
        );
    }

    getPagesInChapter(chapterTitle) {
        return this.$$(
            `//div[@class='mstrmojo-VIPanel-titlebar']//child::*[text()='${chapterTitle}']/../..//parent::*[@class='mstrmojo-VIPanel-titlebar']//parent::*[contains(@class, 'mstrmojo-VIPanel')]//child::*[@class='mstrmojo-VIPanel-content']//div[contains(@class,'item unit icundefined')]`
        );
    }

    // Get the "idx" for page, can be used to verify the sequence of pages in chapter (index starts from 0)
    getPageIndex(chapterTitle, pageTitle) {
        return this.$(
            `//div[@class='mstrmojo-VIPanel-titlebar']//child::*[text()='${chapterTitle}']/../..//parent::*[@class='mstrmojo-VIPanel-titlebar']//parent::*[contains(@class, 'mstrmojo-VIPanel')]//child::*[@class='mstrmojo-VIPanel-content']//div[contains(@class, 'item unit ic')]//child::*[text()='${pageTitle}']/..`
        );
    }

    // Get the vertical scrollbar in list view
    get verticalScrollbar() {
        return this.TOC.$('.mstrmojo-scrollbar.vertical');
    }

    //Get the vertical scrollbar node in list view on WS
    get verticalScrollbarWS() {
        return this.TOC.$('.mstrmojo-sb-show-default');
    }

    get coverImageWarningTooltip() {
        return this.$(
            `//div[contains(@class,'mstrmojo-Tooltip') and contains(@style,'display: block;')]//div[contains(@class,'mstrmojo-Tooltip-content')]//div[contains(@class,'mstrmojo-scrollNode')]`
        );
    }

    get coverImageCancelBtn() {
        return this.$(
            `//div[contains(@class,'CoverPageEditor')]/div[contains(@class, 'mstrmojo-Editor-buttons')]//div[contains(@class, 'mstrmojo-Button-text') and text()='Cancel']`
        );
    }

    get splitter() {
        return this.TOC.$('.mstrmojo-VIPanel-handle.splitter');
    }

    async changePanelWidthByPixel(offsetX) {
        const splitterEl = await this.splitter;
        await this.dragAndDropByPixel(splitterEl, offsetX, 0);
    }

    // Action Helpers

    /**
     * change content panel view using context menu
     * @param {string} contentsPanelView
     */
    async changeView(contentsPanelView) {
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
        await this.clickOnElement(this.changeViewContextMenu);
        await this.clickOnElement(this.common.getContextMenuItem(contentsPanelView));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // expand or collapse the chapter by clicking on the left arrow
    async toggleChapter(chapterTitle) {
        await this.contentsPanel.switchContentsTab();
        await this.clickOnElement(this.getChapterLeftToolbar(chapterTitle));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickOnChapter(chapterTitle) {
        await this.contentsPanel.switchContentsTab();
        await this.clickOnElement(this.getChapterByName(chapterTitle));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickOnPage(chapterTitle, pageTitle) {
        await this.contentsPanel.switchContentsTab();
        let el = await this.getPageTitleText(chapterTitle, pageTitle);
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(240);
    }

    /**
     * RMC on TOC empty zone to insert new chapter/page
     */
    async actionOnPanel(option) {
        await this.contentsPanel.switchContentsTab();
        await this.rightMouseClickOnElement(this.chapterWrapper);
        await this.clickOnElement(this.common.getContextMenuItem(option));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // RMC on chapter and click on '@option'
    async contextMenuOnChapter(chapterTitle, option) {
        await this.contentsPanel.switchContentsTab();
        await this.rightMouseClickOnElement(this.getChapterByName(chapterTitle));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.clickOnElement(this.common.getContextMenuItem(option));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Rename chapter by double click on chapter title
     * @param {string} chapterTitle
     * @param {string} newChapterTitle
     */
    async renameChapterByDoubleClickFromChapterTitle(chapterTitle, newChapterTitle) {
        await this.contentsPanel.switchContentsTab();
        let el = await this.getChapterByName(chapterTitle);
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Allow transition time to double click to rename
        await browser.pause(0.5 * 1000);
        await this.clickOnElement(el);
        await this.renameTextField(newChapterTitle);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * RMC on chapter title to rename chapter
     * @param {string} chapterTitle
     * @param {string} newChapterTitle
     */
    async renameChapterFromChapterTitle(chapterTitle, newChapterTitle) {
        await this.contentsPanel.switchContentsTab();
        // Click rename option
        await this.rightMouseClickOnElement(this.getChapterByName(chapterTitle));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.clickOnElement(this.common.getContextMenuItem('Rename'));
        await this.renameTextField(newChapterTitle);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * RMC on chater title to delete chapter
     * @param {string} chapterTitle
     */
    async deleteChapterFromChapterTitle(chapterTitle) {
        await this.contentsPanel.switchContentsTab();
        // Click delete option
        await this.rightMouseClickOnElement(this.getChapterByName(chapterTitle));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
        await this.clickOnElement(this.common.getContextMenuItem('Delete'));
        // Confirm deletion in popup alert window
        await this.clickOnElement(this.common.getPopupAlertWindowButton('Delete'));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // click on the menu of chapter *** and click on '@option'
    async MenuOnChapter(chapterTitle, option) {
        await this.contentsPanel.switchContentsTab();
        await this.clickOnElement(this.getChapterTitleContextMenu(chapterTitle));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.clickOnElement(this.common.getContextMenuItem(option));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * delete chapter using context menu of chapter
     * @param {string} chapterTitle
     */
    async deleteChapterFromContextMenu(chapterTitle) {
        await this.contentsPanel.switchContentsTab();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
        await this.clickOnElement(this.getChapterTitleContextMenu(chapterTitle));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.clickOnElement(this.common.getContextMenuItem('Delete'));
        // Confirm deletion in popup alert window
        await this.clickOnElement(this.common.getPopupAlertWindowButton('Delete'));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * rename chapter from context menu of chapter
     * @param {string} chapterTitle
     * @param {string} newChapterTitle
     */
    async renameChapterFromContextMenu(chapterTitle, newChapterTitle) {
        await this.contentsPanel.switchContentsTab();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.clickOnElement(this.getChapterTitleContextMenu(chapterTitle));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.clickOnElement(this.common.getContextMenuItem('Rename'));
        await this.renameTextField(newChapterTitle);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // Right mouse click on title and select '@option'
    async contextMenuOnPage(pageTitle, chapterTitle, option) {
        await this.contentsPanel.switchContentsTab();
        await this.rightMouseClickOnElement(this.getPageTitleText(chapterTitle, pageTitle));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
        await this.clickOnElement(this.common.getContextMenuItem(option));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
    }

    /**
     * delete chapter using RMC on page title when there is only one page in that chapter
     * @param {string} pageTitle
     * @param {string} chapterTitle
     */
    async deleteChapterFromPageTitle(pageTitle, chapterTitle) {
        await this.contentsPanel.switchContentsTab();
        await this.rightMouseClickOnElement(this.getPageTitleText(chapterTitle, pageTitle));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
        await this.clickOnElement(this.common.getContextMenuItem(`Delete Chapter "${chapterTitle}"`));
        await this.clickOnElement(this.common.getPopupAlertWindowButton('Delete'));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * rename page using RMC on page title
     * @param {string} pageTitle
     * @param {string} chapterTitle
     * @param {string} newPageTitle
     */
    async renamePageFromPageTitle(pageTitle, chapterTitle, newPageTitle) {
        await this.contentsPanel.switchContentsTab();
        // Click rename option
        await this.rightMouseClickOnElement(this.getPageTitleText(chapterTitle, pageTitle));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.clickOnElement(this.common.getContextMenuItem('Rename'));
        await this.renameTextField(newPageTitle);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Rename page by double click on page title specified by chapter name
     * @param {string} pageTitle
     * @param {string} newPageTitle
     * @param {string} chapterTitle
     */
    async renamePageByDoubleClickFromPageTitle(pageTitle, newPageTitle, chapterTitle) {
        await this.contentsPanel.switchContentsTab();
        let el = this.getPageTitleText(chapterTitle, pageTitle);
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
        // Allow transition time to double click to rename
        await browser.pause(0.5 * 1000);
        await this.clickOnElement(el);
        await this.renameTextField(newPageTitle);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * drag and drop chapter to a different index - not implemented in steps
     * @param {string} chapterTitle
     * @param {int} chapterIndex
     */
    async dragNdropChapter(chapterTitle, chapterIndex) {
        await this.contentsPanel.switchContentsTab();
        let el1 = await this.getChapterByName(chapterTitle);
        let el2 = await this.getChapterField(chapterIndex);
        await this.dragAndDropObject(el1, el2);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    // drag and drop source page to the top/bottom of the target page
    async dragNdropToMovePage(srcPage, srcChapter, desPage, desChapter, relativePosition) {
        await this.contentsPanel.switchContentsTab();
        let src = await this.getPageTitleText(srcChapter, srcPage);
        let tar = await this.getPageTitleText(desChapter, desPage);
        let moveX = 0;
        let moveY = 0;
        switch (relativePosition) {
            case 'bottom':
                moveY = 13;
                break;
            case 'top':
                moveY = -5;
                break;
        }
        await this.dragAndDropObjectWithExtraMove(src, tar, moveX, moveY, true);
    }

    //drag and drop page to the dropzone between chapters and create a new chapter (chapter index starts from 1)
    async dragPageAndDropToCreateNewChapter(pageName, chapterName, chapterIndex) {
        await this.contentsPanel.switchContentsTab();
        let el1 = await this.getPageTitleText(pageName, chapterName);
        let el2 = await this.getChapterField(chapterIndex);
        await this.dragAndDropObject(el1, el2);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async moveVerticalScrollbar(moveY) {
        let el = await this.verticalScrollbar;
        if (moveY.indexOf('%') != -1) {
            let canvasEl = await this.Canvas;
            let canvasRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', canvasEl);
            moveY = (canvasRect.height * parseFloat(moveY)) / 100;
        } else if (moveY.includes('px')) {
            // Strip "px" and parse as float for pixel-based input
            moveY = parseFloat(moveY.replace('px', ''));
        }

        moveY = Math.round(moveY);
        await this.dragAndDropByPixel(el, 0, moveY);
    }

    /**
     * function to change cover image on contents panel using existing sample
     * @param {int} sampleImageOrder
     */
    async changeCoverImageBySample(sampleImageOrder) {
        await this.contentsPanel.switchContentsTab();
        // Click on the cover image
        await this.clickOnElement(this.coverImageBtn);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
        // Click on the sample image
        await this.clickOnElement(this.getCoverSampleImage(sampleImageOrder));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
        // Click on the save button to confirm image change
        await this.clickOnElement(this.common.getButton('Save'));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * function to change cover image on contents panel using url provided
     * @param {string} imageUrl
     */
    async changeCoverImageByUrl(imageUrl) {
        await this.contentsPanel.switchContentsTab();
        // Click on the cover image
        let el = await this.coverImageBtn;
        await browser.waitUntil(EC.visibilityOf(el));
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
        // send image URL
        let el2 = await this.coverImageUrlBox;
        await browser.waitUntil(EC.visibilityOf(el2));
        await this.clickOnElement(el2);
        await el2.clearValue();
        await el2.setValue(imageUrl);
        // Click on the save button to confirm image change
        let el3 = await this.common.getButton('Save');
        await this.clickOnElement(el3);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Select multiple pages using either CMD/CTRL or SHIFT then RMC to (mostly) delete pages
     * @param {string} key of COMMAND (Mac) or CONTROL (Win) or SHIFT
     * @param {string} pageList pages separated with commas
     * @param {string} chapterTitle where those pages locates
     * @param {string} contextMenuOption e.g. Delete * Pages, Delete Chapter "Chapter *"
     */
    async selectMultiplePagesUsingControlOrShiftToDoOperation(key, pageList, chapterTitle, contextMenuOption) {
        // Convert the comma-separated page list into an array of page elements
        let arrayOfPagesString = pageList.split(',').map((page) => page.trim());
        let getPageTitleText = this.getPageTitleText.bind(this);
        let arrayOfPagesLocator = await Promise.all(
            arrayOfPagesString.map((page) => getPageTitleText(chapterTitle, page))
        );

        // Multi-select pages based on the key
        if (['command', 'control', 'cmd', 'ctrl'].includes(key.toLowerCase())) {
            await this.multiSelectElementsUsingCommandOrControl(arrayOfPagesLocator);
        } else if (key.toLowerCase() === 'shift') {
            await this.multiSelectElementsUsingShift(arrayOfPagesLocator[0], arrayOfPagesLocator[1]);
        } else {
            throw new Error(`Unsupported key "${key}". Use "Control", "Command", or "Shift".`);
        }

        // Perform right-click and select context menu option
        await this.rightMouseClickOnElement(arrayOfPagesLocator[0]);
        await this.clickOnElement(await this.common.getContextMenuItem(contextMenuOption));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async clickCoverImageCancelBtn() {
        let el = await this.coverImageCancelBtn;
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async isCurrentPageDisplayed(pageTitle, chapterTitle) {
        await this.contentsPanel.switchContentsTab();
        const page = await this.getCurrentPage(pageTitle, chapterTitle);
        return page.isDisplayed();
    }
}
