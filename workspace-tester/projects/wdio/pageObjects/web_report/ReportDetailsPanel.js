import BasePage from '../base/BasePage.js';

export default class ReportDetailsPanel extends BasePage {
    constructor() {
        super('#reportDetails_ReportDetailsPanelStyle', 'Report Details Component');
    }

    panelBody() {
        return this.$('#reportDetails_ReportDetailsPanelStyle').$('.mstrPanelBody');
    }

    getCloseBtn() {
        return this.getElement().$('.mstrIcon-btn.mstrIcon-btnClose');
    }

    async getFilterText() {
        await this.waitForElementVisible(this.locator);
        const filtersContainer = await this.locator.element(
            by.cssContainingText('.mstrPanelBody > div', 'Report Filter:')
        );
        const filterText = await filtersContainer.getText();
        return filterText.replace('Report Filter:', '').trim();
    }

    async getViewFilterText() {
        const filtersContainer = await this.locator.element(
            by.cssContainingText('.mstrPanelBody > div', 'View Filter:')
        );
        const filterText = await filtersContainer.getText();
        return filterText.replace('View Filter:', '').trim();
    }

    /**
     * @returns {Promise<boolean>} Whether the filter is empty
     */
    async filterIsEmpty() {
        const filterText = await this.getFilterText();
        return filterText.indexOf('Empty Filter') >= 0;
    }

    async close() {
        return this.click(this.getCloseBtn());
    }

    async isDetailsPanelPresent() {
        return this.getElement().isDisplayed();
    }
}
