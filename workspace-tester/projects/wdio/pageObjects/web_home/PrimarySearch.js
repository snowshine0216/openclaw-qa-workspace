import BaseComponent from '../base/BaseComponent.js';
import CustomGroupDialog from './CustomGroupDialog.js';
import MetricDialog from './MetricDialog.js';


export default class PrimarySearch extends BaseComponent {
    // Element locators
    constructor() {
        super(null, '.mstrmojo-Search-editor', 'The Primary Search component');
        this.customGroupDialog = new CustomGroupDialog();
        this.metricDialog = new MetricDialog();
    }

    getSearchEntranceButton() {
        return this.$('.mstrmojo-SearchButton');
    }

    getSearchField() {
        return this.getElement().$('.searchPattern');
    }

    getSearchSpinner() {
        return this.getElement().$('.mstrmojo-Search-btnSpinner');
    }

    getSearchButton() {
        return this.getElement().$('.mstrmojo-Search-btnSearch');
    }

    getGeneralSearchSettings() {
        return this.getElement().$('.mstrmojo-Search-settings1');
    }

    getSearchFolder() {
        return this.getGeneralSearchSettings().$('.mstrmojo-ui-Pulldown:first-child');
    }

    getSearchType() {
        return this.getGeneralSearchSettings().$('.mstrmojo-ui-Pulldown:last-child');
    }

    getResultContainer() {
        return this.getElement().$('.mstrmojo-SearchResults');
    }

    getResultGrid() {
        return this.getResultContainer().$('.mstrmojo-Search-GridView');
    }

    getResultMessage() {
        return this.getResultContainer()
            .$$('.mstrmojo-SearchResults-list .mstrmojo-Label')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('returned no results');
            })[0];
    }

    getRefine() {
        return this.getElement().$('.mstrmojo-Search-btnSettings');
    }

    getSearchSettingsContainer() {
        return this.getElement().$('.mstrmojo-SearchSettings-container');
    }

    getObjectType() {
        return this.getSearchSettingsContainer().$('.objectTypePanel .mstrmojo-ui-Pulldown');
    }

    getOwner() {
        return this.getSearchSettingsContainer().$('.ownerPanel .mstrmojo-ui-Pulldown');
    }

    getDate() {
        return this.getSearchSettingsContainer().$('.datepanel');
    }

    getDatePulldown() {
        return this.getDate().$('.mstrmojo-SearchSettings-date-pulldown');
    }

    getCalendarPopup() {
        return this.getDate().$('.mstrmojo-SearchSettings-dates-popupWidget');
    }

    getDescription() {
        return this.getElement().$('.descriptionPanel textarea');
    }

    getIconViewButton() {
        return this.getElement().$('.item.iconView');
    }

    getGridViewButton() {
        return this.getElement().$('.item.gridView');
    }

    getResultRowByID(id) {
        return this.getElement().$$('.mstrmojo-DataRow')[id];
    }

    getResultGridIcon() {
        return this.getResultRowByID(0).$('.mstrmojo-ListIcon');
    }

    getResultItemByID(id) {
        return this.getElement().$$('.mstrmojo-SearchIconItem')[id];
    }

    getResultItemIcon() {
        return this.getResultItemByID(0).$('.mstrIcon-lg');
    }

    // get result in grid view
    async getResultRowByName(name) {
        return this.getElement()
            .$$('.mstrmojo-DataRow')
            .filter(async (item) => {
                const text = await item.$('.mstrmojo-Search-GridViewItem').getText();
                return text === name;
            })[0];
    }

    async getShortcutByName(name) {
        return this.getElement().$$('.mstrmojo-ListIcon.isc').filter(async (item) => (await this.getParent(item).getText()) === name)[0];
    }

    

    // get result in icon view
    async getResultItemByName(name) {
        return this.getElement().$$('.mstrmojo-SearchIconItem').filter(async (item) => (await item.$('.ttl').getText()) === name)[0];
    }

   

    /**
     * This element contains components of page navigation for the search results
     * @returns {ElementFinder[]} the elements
     */
    getInFetchGroups() {
        return this.$('.mstrmojo-IncFetch-content');
    }

    getPageFirst() {
        return this.getInFetchGroups().$('.mstrmojo-Button.arrow.f');
    }

    getPagePrevious() {
        return this.getInFetchGroups().$('.mstrmojo-Button.arrow.p');
    }

    getPageLast() {
        return this.getInFetchGroups().$('.mstrmojo-Button.arrow.l');
    }

    getPageNext() {
        return this.getInFetchGroups().$('.mstrmojo-Button.arrow.n');
    }

    getPages() {
        return this.getInFetchGroups().$$('.mstrmojo-Button.pg');
    }

    getPageWithNumber(pageNumber) {
        return this.getPages()[pageNumber - 1];
    }

    getCurrentPageNumber() {
        return this.getInFetchGroups().$('.mstrmojo-Button.pg.on');
    }

    // Action helpers

    async switchPage(el) {
        await this.click({ elem: el });
        return this.waitForSearchResults();
    }

    async switchPageTo(pageNumber) {
        const cnt = await this.getPages().length;
        if (cnt > 0) {
            await this.switchPage(await this.getPageWithNumber(pageNumber));
        } else {
            await since('There is no pages, check your web server, there might be issues')
                .expect(cnt > 0)
                .toBe(true);
        }
    }

    async switchPageToFirst() {
        return this.switchPage(this.getPageFirst());
    }

    async switchPageToPrevious() {
        return this.switchPage(this.getPagePrevious());
    }

    async switchPageToLast() {
        return this.switchPage(this.getPageLast());
    }

    async switchPageToNext() {
        return this.switchPage(this.getPageNext());
    }

    async open() {
        await this.click({ elem: this.getSearchEntranceButton() });
        await this.waitForElementVisible(this.getElement());
    }

    async waitForSearchResults() {
        await this.sleep(2000);
        await this.waitForElementInvisible(this.getSearchSpinner());
        // TODO Find a way to remove the sleep here
        await this.sleep(1000);
    }

    async search(keyword) {
        await this.getSearchField().click();
        await this.clear({ elem: this.getSearchField() });
        await this.getSearchField().setValue(keyword);
        await this.sleep(1000); // Wait for animation to complete
        await this.click({ elem: this.getSearchButton() });
        await this.waitForSearchResults();
    }

    async selectPulldown(el, value) {
        await el.click();
        // const target = await el.element(by.cssContainingText('.container .item', value));
        const target = await this.$$('.container .item').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === value;
        })[0];
        await target.click();
    }

    async selectMultiPulldown(el, values) {
        await el.click();

        const items = await el.$$('.container .item');

        for (const item of items) {
            const itemText = await item.getText();
            const isSelected = (await item.getAttribute('class')).indexOf('selected') >= 0;
            if ((values.includes(itemText) && !isSelected) || (!values.includes(itemText) && isSelected)) {
                await item.click();
            }
        }

        const okBtn = await this.$$('.mstrmojo-Button').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === 'OK';
        })[0];
        await okBtn.click();
    }

    async setFolder(folderName) {
        const searchFolder = await this.getSearchFolder();
        await this.selectPulldown(searchFolder, folderName);
        await this.waitForSearchResults();
    }

    async setSearchType(type) {
        const searchType = await this.getSearchType();
        await this.selectPulldown(searchType, type);
        await this.waitForSearchResults();
    }

    toggleRefine() {
        return this.getRefine().click();
    }

    async setObjectType(types) {
        const pulldown = await this.getObjectType();
        await this.selectMultiPulldown(pulldown, types);
        await this.waitForSearchResults();
    }

    async setOwner(owner) {
        const pulldown = await this.getOwner();
        await this.selectPulldown(pulldown, owner);
        await this.waitForSearchResults();
    }

    async setDate(dateOption, options) {
        const pulldown = await this.getDatePulldown();
        await this.selectPulldown(pulldown, dateOption);

        if (options) {
            const calendarPopup = await this.getCalendarPopup();
            const radioList = calendarPopup.$('.mstrmojo-ui-CheckList');
            const { type, value, unit, start, end } = options;

            if (type === 'last') {
                await radioList.$('.item:first-child').click();
                await calendarPopup.$('.mstrmojo-TextBox').setValue(value);
                const unitPulldown = await calendarPopup.$('.mstrmojo-ui-Pulldown');
                await this.selectPulldown(unitPulldown, unit);
            } else if (type === 'between') {
                await radioList.$('.item:last-child').click();

                const startDate = await calendarPopup.$('.startDate .mstrmojo-DateTextBox-input');
                await this.clear({ elem: startDate });
                await startDate.setValue(start);

                const endDate = await calendarPopup.$('.endDate .mstrmojo-DateTextBox-input');
                await this.clear({ elem: endDate });
                await endDate.setValue(end);
            }
            const okBtn = await calendarPopup.$$('.mstrmojo-Button').filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === 'OK';
            })[0];
            await okBtn.click();
        }

        await this.waitForSearchResults();
    }

    async setDescription(value) {
        await this.clear({ elem: this.getDescription() });
        await this.getDescription().setValue(value);
        await this.waitForSearchResults();
    }

    // Close suggesiton popup by click the black area of the search pupup
    async closeSuggestionPopup() {
        return this.click($('.mstrmojo-Editor-title-container'), { x: 5, y: 5 });
    }

    async switchToIconView() {
        return this.click({ elem: this.getIconViewButton() });
    }

    async switchToGridView() {
        return this.click({ elem: this.getGridViewButton() });
    }

    async openObjectByNameInGridView(name) {
        const dataRow = await this.getResultRowByName(name);
        await this.click({ elem: dataRow.$('.mstrmojo-Search-GridViewItem') });
    }

    async openShortcutByNameInGridView(name) {
        const shortcut = await this.getShortcutByName(name);
        await this.click({ elem: shortcut });
    }

    async openObjectByNameInIconView(name) {
        const resultItem = await this.getResultItemByName(name);
        await this.click({ elem: resultItem.$('.ttl') });
    }

    async expandOrCollapsePath(name) {
        const dataRow = await this.getResultRowByName(name);
        await this.click({ elem: dataRow.$('.mstrmojo-Label.toggle') });
    }

    async openFolderByName(objectName, folderName) {
        const dataRow = await this.getResultRowByName(objectName);
        const folder = dataRow.$$('td:last-child .item').filter(async (item) => (await item.getText()) === folderName)[0];
        return this.click({ elem: folder });
    }

    /**
     * Open folder in file list
     * @param {String[]} paths path array of the folder
     */
    async navigateTo(paths) {
        for (const folderText of paths) {
            // This will only return folder link
            const folder = this.getFileList().element(by.cssContainingText('.mstrSmallIconView a', folderText));
            await this.click({ elem: folder });
        }
    }

    async close() {
        await this.waitForCurtainDisappear();
        const els = this.$$('.edt-title-btn.mstrmojo-Editor-close');
        const len = await els.length;
        const el = els[len - 1];
        return this.click({ elem: el });
    }

    // Assertion helpers
    async isSearchEditorOpen() {
        return this.getElement().isDisplayed();
    }

    async getResultRecordByName(name) {
        await this.waitForElementVisible(this.getElement());
        await this.sleep(2000);
        const dataRow = await this.getResultRowByName(name);
        return {
            name,
            owner: await dataRow.$('.owner').getText(),
            location: await dataRow.$$('td:last-child .item').map((item) => item.getText()),
        };
    }

    async isResultEmpty() {
        return this.getResultMessage().isDisplayed();
    }

    async resultCount() {
        return this.getResultGrid().$$('.mstrmojo-itemwrap').length;
    }

    async selectedObjectType() {
        return this.getObjectType().$('.mstrmojo-ui-Pulldown-text').getText();
    }

    async currentFolder() {
        return this.getSearchFolder().getText();
    }

    async currentPageNumber() {
        const text = await this.getCurrentPageNumber().getText();
        return text.toString();
    }
}
