import BasePage from '../base/BasePage.js';

export default class ReportPageBy extends BasePage {
    getReportPageBy() {
        return this.$('#pbb_PageByStyle');
    }

    getAttribute(attr) {
        return this.$('.mstrPanelTitleBar-inlineBody')
            .$$('span')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(attr);
            })[0];
    }

    getItemList(attr) {
        return this.getAttribute(attr).$$('#elemKey>option');
    }

    getItem(attr, item) {
        // return this.getAttribute(attr).element(by.cssContainingText('#elemKey>option', item));
        return this.getAttribute(attr)
            .$('#elemKey')
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(item);
            })[0];
    }

    getDummySearchBox() {
        return this.getElement().$('.dummy-searchbox');
    }

    getSearchboxContainer() {
        return this.getElement().$('#ReportQuickSearchBox');
    }

    getSearchboxInput() {
        return this.getSearchboxContainer().$('#ReportQuickSearchBoxsbInput');
    }

    getSearchResultsList() {
        return this.$('.mstrmojo-ReportQuickSearch-Suggest');
    }

    getSearchResultsListItems() {
        return this.getSearchResultsList().$$('.mstrmojo-List-item');
    }

    getClearIcon() {
        return this.getSearchboxContainer().$('#ReportQuickSearchBoxsbClear');
    }

    getCloseBtn() {
        return this.getElement().$('.mstrIcon-btn.mstrIcon-btnClose');
    }

    // Action helper

    /**
     * Update the grid data using page-by.
     * @param {string}  attr The attribute to page-by
     * @param {string}  item The item of the attibute to page-by
     */
    async pageBy(attr, item) {
        const el = await this.getAttribute(attr).$('#elemKey');
        // await this.click({ elem: el, checkClickable: false });
        await el.click();
        // await this.click({ elem: this.getItem(attr, item), checkClickable: false });
        await this.getItem(attr, item).click();
    }

    async search(text) {
        await this.click({ elem: this.getDummySearchBox() });
        await this.getSearchboxInput().clear().setValue(text);
        await this.waitForElementVisible(this.getSearchResultsList());
    }

    async clearSearch() {
        await this.click({ elem: this.getClearIcon() });
        await this.waitForElementDisappear(this.getSearchResultsList());
    }

    async close() {
        await this.click({ elem: this.getCloseBtn() });
        return this.waitForElementDisappear(this.getElement());
    }

    // Assertion helper
    async isPageByDisplayed() {
        return this.getElement().isDisplayed();
    }

    async getSearchResultCount() {
        return this.getSearchResultsListItems().length;
    }

    async isItemSelected(attr, item) {
        return this.getItem(attr, item).isSelected();
    }
}
