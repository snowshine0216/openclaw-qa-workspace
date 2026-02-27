import BasePage from '../base/BasePage.js';

export default class LibrarySort extends BasePage {
    // Element locator

    getSortBox() {
        return this.$('.mstrd-SortBox-content');
    }

    getCombinedModeSortBox() {
        return this.$('.mstrd-SortBox-sortbycontent');
    }

    getSortMenu() {
        return this.$('.mstrd-SortContainer');
    }

    getSortDropdown() {
        return this.getSortMenu().$('.mstrd-SortDropdown');
    }

    getSortOption() {
        return this.$('.mstrd-SortBox-selected');
    }

    getAllSortOptions() {
        return this.getSortDropdown().$$('li');
    }

    getSortOptionList(option) {
        return this.getSortDropdown()
            .$$('li') // Use 'li' here instead of '.mstrd-SortDropdown-option' because the latter cannot locate elements like "A-Z", "Oldest on Top" etc.
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === option;
            })[0];
        //return this.getSortDropdown().element(by.cssContainingText('li', `${option}`));
    }

    getSortOrderList(order) {
        return this.getSortOptionList(order);
        //return this.getSortDropdown().element(by.cssContainingText('li', `${order}`));
    }

    getSelectedSortOption() {
        return this.getSortMenu().$('.mstrd-SortBox-selected');
    }

    getSelectedSortOrder() {
        return this.$(`ul[aria-label='sort directions'] > .mstrd-SortDropdown-direction--selected`);
    }

    getSortArrow() {
        return this.$('.mstrd-SortArrow');
    }

    getCurtain() {
        return this.$('.mstrd-LibraryViewCurtain--transparent');
    }

    // Action helper

    async openSortMenu() {
        for (let n = 0; n < 3; n++) {
            if (!(await this.isSortMenuOpen())) {
                await this.click({ elem: this.getSortBox() });
            } else {
                break;
            }
        }
    }

    async openCombinedModeSortMenu() {
        await this.click({ elem: this.getCombinedModeSortBox() });
    }

    async selectSortOption(option) {
        await this.sleep(1000);
        await this.click({ elem: this.getSortOptionList(option) });
        await this.waitForElementStaleness(this.getSortDropdown(), { msg: 'Sort dropdown is not closed.' });
    }

    async selectSortOrder(order) {
        await this.sleep(500);
        await this.click({ elem: this.getSortOrderList(order) });
        await this.waitForElementInvisible(this.getSortDropdown(), { msg: 'Sort dropdown is not closed.' });
        // await this.waitForElementStaleness(this.getSortDropdown(), { msg: 'Sort dropdown is not closed.' });
    }

    async quickSort() {
        await this.getSortArrow().click();
        return this.sleep(1000); // Wait for animation to complete
    }

    async closeSortMenu() {
        if (await this.isSortMenuOpen()) {
            await this.click({ elem: this.getSortBox() });
        }
        await this.waitForElementStaleness(this.getSortDropdown(), { msg: 'Sort dropdown is not closed.' });
    }

    async hoverQuickSort() {
        await this.hover({ elem: this.getSortArrow() });
        await this.waitForElementVisible(this.getTooltipContainer(), { msg: 'Tooltip is not displayed.' });
        return this.sleep(1000); // Wait for animation to complete
    }

    // Assertion helper

    async currentSortOption() {
        return this.getSortOption().getText();
    }

    async currentSortStatus() {
        const sortOption = await this.getSelectedSortOption().getText();
        const sortOrderText = await this.getSelectedSortOrder().getText();
        let sortOrder = (await sortOrderText.includes('A-Z' || 'Oldest on Top')) ? 'asc' : 'dsc';
        return [sortOption, sortOrder];
    }

    async currentSortOrder() {
        return this.getSelectedSortOrder().getText();
    }

    async isSortMenuOpen() {
        return this.getSortDropdown().isDisplayed();
    }

    async isSortOptionTabFocused(option) {
        const elem = this.getSortOptionList(option);
        const cls = await elem.getAttribute('class');
        return cls.includes('focus-visible');
    }

    async isSortOptionExist(option) {
        try {
            const element = this.getSortOptionList(option);
            return (await element.isExisting()) && (await element.isDisplayed());
        } catch (e) {
            return false;
        }
    }

    async getSortOptionFont() {
        return this.getFontFamily(this.getSortOption());
    }

    async isSortDisplay() {
        return this.getSortBox().isDisplayed();
    }

    async getAllSortOptionsText() {
        const options = this.getAllSortOptions();
        const texts = await options.map(async (option) => await option.getText());
        return texts;
    }
}
