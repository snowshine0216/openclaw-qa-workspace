import BasePage from './BasePage.js';
import LibraryItem from '../common/LibraryItem.js';
import LibrarySort from '../common/LibrarySort.js';
import LibraryFilter from '../common/LibraryFilter.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

const maxLoadUntilRenderedAttempts = 3;

export default class BaseLibrary extends BasePage {
    constructor() {
        super();
        this.libraryItem = new LibraryItem();
        this.librarySort = new LibrarySort();
        this.libraryFilter = new LibraryFilter();
    }

    // Element locator
    getItem(name, owner = null) {
        const item = this.libraryItem.getItem(name, owner);
        return item;
    }

    getItemMenuTrigger(name) {
        return this.libraryItem.getItemMenuTrigger(name);
    }

    getAllItems() {
        return this.$$('.mstrd-DossierItem-name');
    }

    async getItemsCount() {
        return (await this.getAllItems()).length;
    }

    async getLastItem() {
        let item_count = (await this.getAllItems().length) - 1;
        return this.getAllItems()[item_count];
    }

    getDossierListContainer() {
        return this.$('.ReactVirtualized__Grid');
    }

    getDossierListContainerHeight() {
        return this.$('.ReactVirtualized__Grid__innerScrollContainer');
    }

    getSortMenu() {
        return this.librarySort.getSortMenu();
    }

    getFilterContainer() {
        return this.libraryFilter.getFilterContainer();
    }

    getDossierImageContainer(name) {
        return this.getItem(name).$('.mstrd-DossierItemIcon-imgContainer');
    }

    getFavoriteIcon(name) {
        return this.libraryItem.getFavoriteIcon(name);
    }

    getListTitle(title) {
        return this.$$('.mstrd-DossiersListContainer-title').filter(async (elem) => {
            const elemText = await elem.getText();
            return this.escapeRegExp(elemText).includes(this.escapeRegExp(title));
        })[0];
    }

    getDossierContextMenu() {
        return this.$('.mstrd-ContextMenu');
    }

    getContextMenuDropdown() {
        return this.$('.ant-popover-inner-content');
    }

    getDossierContextMenuMobile() {
        return this.$('.mstrd-ContextMenu-menu');
    }

    getDossierSecondaryContextMenu() {
        return this.$('.ant-dropdown-menu.ant-dropdown-menu-sub');
    }

    getDossierContextMenuItem(item, isMobile = false) {
        return (isMobile ? this.getDossierContextMenuMobile() : this.getDossierContextMenu())
            .$$('.mstrd-ContextMenu-item,.mstrd-ContextMenu-submenu')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return this.escapeRegExp(elemText).includes(this.escapeRegExp(item));
            })[0];
    }

    getDossierSecondaryContextMenuTitle(item) {
        return this.getDossierContextMenu()
            .$$('.ant-dropdown-menu-submenu-title')
            .filter(async (elem) => {
                return (await elem.isDisplayed()) && (await elem.getText()) === item;
            })[0];
    }

    getDossierContextMenuItems() {
        return this.getDossierContextMenu().$$('.mstrd-ContextMenu-item,.mstrd-ContextMenu-submenu');
    }

    getDossierSecondaryContextMenuItem(item) {
        return this.getDossierSecondaryContextMenu()
            .$$('.mstrd-ContextMenu-item')
            .filter(async (elem) => {
                return (await elem.isDisplayed()) && (await elem.getText()) === item;
            })[0];
    }

    getDossierSecondaryContextMenuItems() {
        return this.getDossierSecondaryContextMenu()
            .$$('.mstrd-ContextMenu-item')
            .filter(async (elem) => {
                return elem.isDisplayed();
            });
    }

    getMultiSelectButton() {
        return this.$('.mstrd-SelectionModeNavItemContainer-icon');
    }

    getEmptyLibrary() {
        return this.$('.mstrd-EmptyLibrary');
    }

    get EmptyContent() {
        return this.$('.mstrd-EmptyContent');
    }

    getEmptyLibraryMessage() {
        return this.getEmptyLibrary().$('.mstrd-EmptyContent-message').getText();
    }

    getClearFilterButton() {
        return this.$('.mstrd-EmptyLibraryFromFilter-clear');
    }

    getEmptyLibraryMessageTitle() {
        return this.getEmptyLibrary().$('.mstrd-EmptyLibrary-title').getText();
    }

    getDeleteConfirmationWindow() {
        return this.$('.mstrd-MessageBox-main');
    }

    getActionButtonFromDeleteDialogue(text) {
        return this.getDeleteConfirmationWindow()
            .$$('.mstrd-ActionLinkContainer-text')
            .filter(async (elem) => {
                const buttonName = await elem.getText();
                return buttonName === text;
            })[0];
    }

    getTitleElement() {
        return this.$('.mstrd-NavBarTitle > .mstrd-NavBarTitle-item.mstrd-NavBarTitle-item-active');
    }
    async moveDossierIntoViewPort(name, owner = null) {
        await this.loadUntilRendered({ name, owner });
    }

    async renderNextBlock(count) {
        let viewHeight = await (await this.getDossierListContainer()).getCSSProperty('height');
        viewHeight = viewHeight.value.split('p')[0];
        await this.executeScript(
            'arguments[0].scrollTop = arguments[1];',
            await this.getDossierListContainer(),
            Math.ceil(viewHeight * count)
        );
        return browser.pause(200);
    }

    async loadUntilRendered({ name, count = 0, attempt = 1, owner = null }) {
        // Calculate the height of the view in library page and the height of the entire library page
        const dossierContainer = this.getDossierListContainerHeight();
        await this.waitForElementVisible(dossierContainer);
        let offsetHeight = await dossierContainer.getCSSProperty('height');
        offsetHeight = offsetHeight.value.split('p')[0];
        let viewHeight = await this.getDossierListContainer().getCSSProperty('height');
        viewHeight = viewHeight.value.split('p')[0];
        // Incrementally load the next block if the current view does not have the dossier/document
        if (viewHeight * count < offsetHeight) {
            let nextCount = count + 1 / attempt;
            const viewable = await this.isItemViewable(name, owner);
            if (!viewable) {
                await this.renderNextBlock(nextCount);
                return this.loadUntilRendered({ name, count: nextCount, attempt, owner });
            } else {
                const item = this.getItem(name, owner);
                const result = await item.isDisplayedInViewport();
                const isInViewport = await this.isDossierItemElementInViewport(this.getItem(name, owner));
                if (isInViewport) {
                    return true;
                    //return this.sleep(500);
                } else {
                    await this.renderNextBlock(nextCount);
                    return this.loadUntilRendered({ name, count: nextCount, attempt, owner });
                }
            }
        } else if (attempt < maxLoadUntilRenderedAttempts) {
            console.log(
                `Unable to find dossier/document: ${name} on attempt: ${attempt}. Attempting to find the dossier again`
            );
            await this.scrollToTop();
            return this.loadUntilRendered({ name, count: 0, attempt: attempt + 1, owner });
        } else {
            // Exit when the dossier/document is not found until scrolling to the bottom
            console.log(`For some reason, the dossier/document '${name}' was not found.`);
            return false;
            //return this.sleep(500);
        }
    }
    async scrollToBottom() {
        let offsetHeight = await this.getDossierListContainerHeight().getCSSProperty('height');
        offsetHeight = offsetHeight.parsed.value;
        await this.executeScript(
            'arguments[0].scrollTop = arguments[1];',
            await this.getDossierListContainer(),
            offsetHeight
        );
        return browser.pause(200);
    }

    async scrollToTop() {
        await this.executeScript('arguments[0].scrollTop = arguments[1];', await this.getDossierListContainer(), 0);
        return browser.pause(200);
    }

    async isDossierItemElementInViewport(dossierItemElem) {
        const result = await dossierItemElem.isDisplayedInViewport();
        return result;
    }

    async openSortMenu() {
        return this.librarySort.openSortMenu();
    }

    async openCombinedModeSortMenu() {
        return this.librarySort.openCombinedModeSortMenu();
    }

    async quickSort() {
        return this.librarySort.quickSort();
    }

    async closeSortMenu() {
        return this.librarySort.closeSortMenu();
    }

    async selectSortOption(option = 'Content Name') {
        return this.librarySort.selectSortOption(option);
    }

    async selectSortOrder(order) {
        return this.librarySort.selectSortOrder(order);
    }

    async hoverQuickSort() {
        return this.librarySort.hoverQuickSort();
    }

    async hoverFilter() {
        return this.libraryFilter.hoverFilter();
    }

    async clickFilterIcon() {
        return this.libraryFilter.clickFilterIcon();
    }

    async closeFilterPanel() {
        return this.libraryFilter.closeFilterPanel();
    }

    async selectFilterOptionButton(option) {
        return this.libraryFilter.selectFilterOptionButton(option);
    }

    async clickFilterApply() {
        return this.libraryFilter.clickApplyButton();
    }

    async clickFilterClearAll() {
        return this.libraryFilter.clickClearAllButton();
    }

    async clearFilters() {
        await this.click({ elem: this.getClearFilterButton() });
        await this.waitForCurtainDisappear();
    }

    async isItemViewable(name, owner = null) {
        return this.libraryItem.isItemViewable(name, owner);
    }

    async currentSortOption() {
        return this.librarySort.currentSortOption();
    }

    async hoverOnDossierName(dossierName) {
        const dossierTitle = await this.getItem(dossierName).$('.mstrd-DossierItem-name');
        return this.hover({ elem: dossierTitle });
    }

    async confirmDelete() {
        await this.click({ elem: this.getActionButtonFromDeleteDialogue('Delete') });
    }

    async cancelDelete() {
        await this.click({ elem: this.getActionButtonFromDeleteDialogue('Cancel') });
    }

    // Assertion helper
    async title() {
        return this.getTitleElement().getText();
    }

    async itemInfo(name) {
        return this.libraryItem.itemInfo(name);
    }

    async itemSharedByTimeInfo(name) {
        return this.libraryItem.itemSharedByTimeInfo(name);
    }

    async isItemCertified(name) {
        return this.libraryItem.isItemCertified(name);
    }

    async isItemDocument(name) {
        return this.libraryItem.isItemDocument(name);
    }

    async isCommentCountDisplayed(name) {
        return this.libraryItem.isCommentCountDisplayed(name);
    }

    async currentSortStatus() {
        return this.librarySort.currentSortStatus();
    }

    async currentSortOrder() {
        return this.librarySort.currentSortOrder();
    }

    async isSortMenuOpen() {
        return this.librarySort.isSortMenuOpen();
    }

    async isDossierSelected() {
        return this.libraryFilter.isDossierSelected();
    }

    async isEditIconDisplayedInContextMenu() {
        return this.getDossierContextMenuItem('Edit').isDisplayed();
    }

    async isItemDisplayedInContextMenu(item) {
        return this.getDossierContextMenuItem(item).isDisplayed();
    }

    async allItemList() {
        await this.waitForCurtainDisappear();
        const items = await this.getAllItems();
        let list = [];
        for (let i = 0; i < items.length; i++) {
            const el = items[i];
            let text = await getAttributeValue(el, 'innerText');
            list.push(text.trim());
        }
        return list;
    }

    async lastItem() {
        await this.waitForCurtainDisappear();
        const el = await this.getLastItem();
        const value = await getAttributeValue(el, 'innerText');
        return value;
    }

    async firstTwoItems() {
        await this.waitForCurtainDisappear();
        const items = await this.getAllItems();
        let list = [];
        for (let i = 0; i < 2; i++) {
            const el = items[i];
            let text = await getAttributeValue(el, 'innerText');
            list.push(text);
        }
        return list;
    }

    async isDeleteWindowPresent() {
        return this.getDeleteConfirmationWindow().isDisplayed();
    }

    async titleFont() {
        return this.getFontFamily(this.getTitleElement());
    }

    async getContextMenuList(isMobile = false) {
        const menu = isMobile ? this.getDossierContextMenuMobile() : this.getDossierContextMenu();
        const items = await menu.$$('.mstrd-ContextMenu-item,.mstrd-ContextMenu-submenu');
        const visibleItems = [];
        for (const item of items) {
            if (await item.isDisplayed()) {
                visibleItems.push(await item.getText());
            }
        }
        return visibleItems;
    }
}
