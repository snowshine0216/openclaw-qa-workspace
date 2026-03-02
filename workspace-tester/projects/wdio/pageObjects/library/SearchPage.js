import BasePage from '../base/BasePage.js';
import InfoWindow from '../library/InfoWindow.js';
import LibrarySort from '../common/LibrarySort.js';
import SearchBox from '../common/SearchBox.js';
import { getInputValue } from '../../utils/getAttributeValue.js';

export default class SearchPage extends BasePage {
    constructor() {
        super();
        this.infoWindow = new InfoWindow();
        this.librarySort = new LibrarySort();
        this.searchBox = new SearchBox();
    }

    // Element locator
    getFilterOption(option) {
        option = option.toLowerCase();
        if (option === 'owner') {
            option = 'user';
        }
        return this.$(`#searchFilterOption_${option}`);
    }

    getEmptyResult() {
        return this.$('.mstrd-NoSearchResults-inner');
    }

    getScrollableContainer() {
        return this.$('.mstrd-SearchResultsListContainer');
    }

    getResultListContainer() {
        return this.$('.mstrd-SearchResultsListContainer-content');
    }

    getResultList() {
        return this.getResultListContainer().$$('.mstrd-SearchResultListItem');
    }

    getResultItem(title) {
        return this.getResultList().filter(async (elem) => {
            const elemText = await elem.$('.mstrd-SearchResultListItem-titleIcon').getText();
            return elemText === title;
        })[0];
    }

    getGlobalSearchResult() {
        return this.getResultListContainer().$$('.mstrd-GlobalSearchResultListItem');
    }

    getGlobalResultItem(title) {
        return this.getGlobalSearchResult().filter(async (elem) => {
            const elemText = await elem.$('.mstrd-GlobalSearchResultListItem-titleIcon').getText();
            return elemText === title;
        })[0];
    }

    getResultItemContent(title) {
        return this.getResultItem(title).$('.mstrd-SearchResultListItem-content');
    }

    getInfoIcon(title) {
        return this.getResultItem(title).$('.mstrd-DossierInfoIcon');
    }

    getGlobalResultItemInfoIcon(title) {
        return this.getGlobalResultItem(title).$('.mstrd-DossierInfoIcon');
    }

    getItemOwner(title) {
        return this.getResultItemContent(title).$('.mstrd-DossierItemSharedByInfo-user');
    }

    getDossierName(title) {
        return this.getResultItemContent(title).$('.icon-dossier15');
    }

    getChapterName(title) {
        return this.getResultItemContent(title).$('.icon-chapter12');
    }

    getPageName(title) {
        return this.getResultItemContent(title).$('.icon-page12');
    }

    getVizDetailObjects(title) {
        return this.getResultItemContent(title).$('.mstrd-SearchResultListItem-vizDetails');
    }

    getVisualizations(title) {
        return this.getVizDetailObjects(title).$$('.icon-viz');
    }

    getAttributes(title) {
        return this.getVizDetailObjects(title).$$('.icon-attribute');
    }

    getMetrics(title) {
        return this.getVizDetailObjects(title).$$('.icon-metric');
    }

    parseObject({ title, object, objectIndex = 0 }) {
        let elem = '';
        object = object.toLowerCase();
        switch (object) {
            case 'title':
                elem = this.getItemTitle(title);
                break;
            case 'owner':
                elem = this.getItemOwner(title);
                break;
            case 'dossier':
                elem = this.getDossierName(title);
                break;
            case 'chapter':
                elem = this.getChapterName(title);
                break;
            case 'page':
                elem = this.getPageName(title);
                break;
            case 'visualization':
                elem = this.getVisualizations(title)[objectIndex];
                break;
            case 'attribute':
                elem = this.getAttributes(title)[objectIndex];
                break;
            case 'metric':
                elem = this.getMetrics(title)[objectIndex];
                break;
            default:
                break;
        }
        return elem;
    }

    // Action helper
    async goToLibrary() {
        await this.$('.mstrd-LibraryNavItem-link').click();
        return this.waitForItemLoading();
    }

    async browseAllDossiers() {
        await this.$('.mstrd-NoSearchResults-link').click();
        return this.waitForItemLoading();
    }

    async scrollToBottom() {
        const offset = (await this.getScrollableContainer().getCSSProperty('height')).split('p')[0];
        await this.scrollDown({ elem: this.getScrollableContainer(), offset });
        // wait for animation to be completed
        return this.sleep(1000);
    }

    async switchToOption(option) {
        await this.getFilterOption(option).click();
        // wait for animation to be completed
        return this.sleep(1000);
    }

    async clearSearch() {
        return this.searchBox.clearSearch();
    }

    async search(text) {
        await this.searchBox.search(text);
        await browser.waitUntil(
            async () => {
                let isResultList = await this.getResultList()[0].isDisplayed();
                let emptyList = await this.getEmptyResult().isDisplayed();
                return isResultList || emptyList;
            },
            {
                timeoutMsg: 'Result does not show up.',
            }
        );
        // wait for content to be populated when necessary
        return !(await this.isResultEmpty()) && this.sleep(2000);
    }

    async openInfoWindow(title) {
        await this.getInfoIcon(title).click();
        await this.waitForElementVisible(this.infoWindow.getInfoWindow(), { msg: 'Info window was not open.' });
        await this.waitForDynamicElementLoading();
        return this.sleep(1000); // Wait for jquery animation to complete
    }

    async closeInfoWindow() {
        await this.infoWindow.getInfoWindow().$('.icon-clearsearch').click();
        await this.waitForElementStaleness(this.infoWindow.getInfoWindow(), { msg: 'Info window was not closed.' });
        return this.sleep(1000); // Wait for jquery animation to complete
    }

    async openGlobalResultInfoWindow(title) {
        await this.waitForElementVisible(this.getGlobalResultItemInfoIcon(title), { msg: 'info icon is visible.' });
        await this.getGlobalResultItemInfoIcon(title).click()
        await this.waitForElementVisible(this.infoWindow.getInfoWindow(), { msg: 'Info window was not open.' });
        await this.waitForDynamicElementLoading();
        return this.sleep(1000); // Wait for jquery animation to complete
    }

    async executeResultItem(title) {
        const icon = this.getResultItem(title).$('.mstrd-SearchResultListItem-link');
        await this.waitForElementVisible(icon);
        await this.clickByForce({ elem: icon });
        // return this.dossierPage.waitForDossierLoading();
    }

    async executeGlobalResultItem(title) {
        const icon = this.getGlobalResultItem(title).$('.mstrd-GlobalSearchResultListItem-link');
        await this.clickForSafari(icon);
    }

    async hoverOnObject({ title, object, objectIndex = 0 }) {
        await this.hover({ elem: this.parseObject({ title, object, objectIndex }) });
        await this.waitForElementVisible(this.getTooltipContainer(), { msg: 'Tooltip did not show up.' });
        // wait for animation to be completed
        return this.sleep(500);
    }

    // Assertion Helper
    async searchString() {
        const value = await getInputValue(this.searchBox.getInputBox());
        return value;
    }

    async isFilterOptionSelected(option) {
        return this.getFilterOption(option).isSelected();
    }

    async matchCount(option) {
        const text = await this.getFilterOption(option).getText();
        return text.split('(')[1].split(')')[0];
    }

    async sortOption() {
        return (await this.librarySort.currentSortStatus())[0];
    }

    async switchSortOrder() {
        return this.librarySort.quickSort();
    }

    async isResultEmpty() {
        return this.getEmptyResult().isDisplayed();
    }

    async isItemDisplayed(title) {
        return this.getResultItem(title).isDisplayed();
    }

    async isItemCertified(title) {
        const className = await this.getResultItemContent(title).$('p').getAttribute('class');
        return className.includes('isCertified');
    }

    async isDossierImageDisplayed(title) {
        return this.getResultItem(title).$('.mstrd-DefaultDossierCoverPage').isDisplayed();
    }

    async isRSDImageDisplayed(title) {
        return this.getResultItem(title).$('.mstrd-DefaultRSDCoverPage').isDisplayed();
    }

    async isCustomImageDisplayed(title) {
        return this.getResultItem(title).$('.mstrd-SearchResultListItem-cover').isDisplayed();
    }

    async isTimestampDisplayed(title) {
        return this.getResultItemContent(title).$('.mstrd-DossierItemSharedByInfo-time').isDisplayed();
    }

    async isInfoIconDisplayed(title) {
        return this.getInfoIcon(title).isDisplayed();
    }

    async isInfoWindowOpen() {
        return this.infoWindow.isOpen();
    }

    async visualizationCount(title) {
        return this.getVisualizations(title).length;
    }

    async attributeCount(title) {
        return this.getAttributes(title).length;
    }

    async metricCount(title) {
        return this.getMetrics(title).length;
    }

    async objectNameInResultItem({ title, object, objectIndex = 0 }) {
        return this.parseObject({ title, object, objectIndex }).getAttribute('innerText');
    }

    async isInfoIconFocused(title) {
        const elem = this.getInfoIcon(title);
        return (await elem.getAttribute('data-focus-visible-added')) === '';
    }
}
