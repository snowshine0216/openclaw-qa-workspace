import BasePage from '../base/BasePage.js';
import LibraryFilter from '../common/LibraryFilter.js';
import LibrarySort from '../common/LibrarySort.js';

export default class SnapshotsToolbar extends BasePage {
    constructor() {
        super();
        this.snapshotFilter = new LibraryFilter();
        this.snapshotSort = new LibrarySort();
    }

    getLibraryFilterItem(type) {
        return this.snapshotFilter
            .getFilterContainer()
            .$$('.mstrd-BaseFilterItem')
            .filter(async (elem) => {
                const filterTitle = await elem.getText();
                if (filterTitle === type) {
                    return elem;
                }
            })[0];
    }

    async openFilterDetailPanel(type) {
        await this.waitForElementVisible(this.snapshotFilter.getFilterContainer());
        await this.click({ elem: this.getLibraryFilterItem(type) });
        return this.sleep(1000); // wait filter detail panel to render
    }

    // Helper method to ensure filter panel is open
    async ensureFilterPanelOpen() {
        const isOpen = await this.snapshotFilter.isFilterOpen();
        if (!isOpen) {
            await this.snapshotFilter.clickFilterIcon();
        }
    }

    // Generic filterBy function using FP principles
    async filterBy({ filterType, items, apply = true, clearAll = true }) {
        await this.ensureFilterPanelOpen();
        if (clearAll) {
            if (await this.snapshotFilter.getFilterClearAllButton().isClickable()) {
                await this.click({ elem: this.snapshotFilter.getFilterClearAllButton() });
                await this.ensureFilterPanelOpen();
            }
        }
        await this.openFilterDetailPanel(filterType); // override the method in LibraryFilter, to do exact match

        const selectAll = items.includes('all');
        const selectItems = async () => {
            await Promise.all(items.map((item) => this.snapshotFilter.selectFilterDetailsPanelItem(item)));
        };

        if (selectAll) {
            await this.snapshotFilter.clickFilterDetailsPanelButton('Select All');
        } else {
            await selectItems();
        }

        if (apply) await this.snapshotFilter.clickApplyButton();
    }

    // Filter by project with array of project names
    async filterByProject(items, apply = true, clearAll = true) {
        return this.filterBy({ filterType: 'Project', items, apply, clearAll });
    }

    // Filter by content type with array of content types
    async filterByContentType(items, apply = true, clearAll = true) {
        return this.filterBy({ filterType: 'Content Type', items, apply, clearAll });
    }

    // Filter by content with array of content names
    async filterByContent(items, apply = true, clearAll = true) {
        return this.filterBy({ filterType: 'Content', items, apply, clearAll });
    }

    async clearAllFilters() {
        await this.ensureFilterPanelOpen();
        await this.click({ elem: this.snapshotFilter.getFilterClearAllButton() });
    }

    // Compose function to pass in update function for custom filtering behavior
    async composeFilter(updateFn, apply = false) {
        await this.ensureFilterPanelOpen();

        if (typeof updateFn === 'function') {
            await updateFn(this.snapshotFilter);
        }

        if (apply) {
            await this.snapshotFilter.clickApplyButton();
        }
    }

    // async updateSort(func, option) {
    //     if (!(await this.isSortMenuOpen())) {
    //         await this.openSortMenu();
    //     }
    //     await func(this.snapshotSort, option);
    // }

    async selectSortOption(option) {
        if (!(await this.isSortMenuOpen())) {
            await this.openSortMenu();
        }
        await this.snapshotSort.selectSortOption(option);
    }

    async selectSortOrder(order) {
        if (!(await this.isSortMenuOpen())) {
            await this.openSortMenu();
        }
        await this.snapshotSort.selectSortOrder(order);
    }

    async currentSortOption() {
        return await this.snapshotSort.currentSortOption();
    }

    async currentSortOrder() {
        return await this.snapshotSort.currentSortOrder();
    }

    async openSortMenu() {
        await this.snapshotSort.openSortMenu();
    }

    async isSortMenuOpen() {
        return await this.snapshotSort.isSortMenuOpen();
    }

    async currentSortStatus() {
        if (!(await this.isSortMenuOpen())) {
            await this.openSortMenu();
        }
        return await this.snapshotSort.currentSortStatus();
    }

    async isSortDisplayed() {
        return await this.snapshotSort.isSortDisplay();
    }

    async isFilterIconDisplayed() {
        return await this.snapshotFilter.getFilterIcon().isDisplayed();
    }
}
