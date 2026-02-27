import DossierPage from '../dossier/DossierPage.js';
import PromptEditor from '../common/PromptEditor.js';
import InfoWindow from '../library/InfoWindow.js';
import BaseSearch from './BaseSearch.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class FullSearch extends BaseSearch {
    constructor() {
        super();
        this.dossierPage = new DossierPage();
        this.promptEditor = new PromptEditor();
        this.infoWindow = new InfoWindow();
    }

    // Element locator

    getSearchResultsContainer() {
        return this.$('.mstrd-SearchResultsListContainer');
    }

    getBackIcon() {
        return this.$('.mstr-nav-icon.icon-back-lib');
    }

    getSearchResultsListContainerHead() {
        return this.$('.mstrd-SearchResultsListContainer-headContent');
    }

    getSearchSortContainer() {
        return this.$('.mstrd-SearchSortContainer');
    }

    getSearchSortBox() {
        return this.$('.mstrd-SearchSortBox');
    }

    getSearchSortSelected() {
        return this.getSearchSortBox().$('.mstrd-SearchSortBox-selected');
    }

    getRecommendationContainer() {
        return this.$('.mstrd-RecommendationsContainer-content');
    }

    getTabList() {
        return this.getSearchResultsContainer().$$('.mstrd-SearchResultsListContainer-headContent li[role="tab"]');
    }

    getTabByName(name) {
        return this.getTabList().filter(async (elem) => {
            const text = await elem.getText();
            return text.includes(name);
        })[0];
    }

    getMyLibraryTab() {
        return this.getSearchResultsContainer().$('#searchFilterOption_dossier');
    }

    getSearchSortDropdown() {
        return this.getSearchResultsContainer().$('.mstrd-SearchSortDropdown');
    }

    getAllTab() {
        return this.getSearchResultsContainer().$('#searchFilterOption_all');
    }

    getSearchResultList() {
        return this.getSearchResultsContainer().$('.mstrd-SearchResultsList');
    }

    async getSearchResultListItems() {
        return this.getSearchResultList().$$('.mstrd-SearchResultListItem,.mstrd-GlobalSearchResultListItem');
    }

    getRecommendationMainInfoButtons() {
        return this.getRecommendationContainer().$('.mstrd-RecommendationsMainInfo-share').$$('.mstr-menu-icon');
    }

    getResultItemByName(name) {
        return this.$(
            `//div[@class='mstrd-GlobalSearchResultListItem-content' or @class='mstrd-SearchResultListItem-content']//span[contains(@class,'mstrd-Highlight') and @aria-label='${name}']//ancestor::li`
        );
    }

    getResultItemLinkByName(name) {
        return this.$(
            `//div[@class='mstrd-GlobalSearchResultListItem-content' or @class='mstrd-SearchResultListItem-content']//a[@aria-label='${name}']`
        );
    }

    getMatchContentInfo(name) {
        return this.getResultItemByName(name).$('.mstrd-SearchResultListItem-matchInfo');
    }

    getMatchedContentIcon(name) {
        return this.getMatchContentInfo(name).$('.icon-menu-arrow');
    }

    getMatchedContentDetails(name) {
        return this.getMatchContentInfo(name).$$('.mstrd-SearchResultListItem-matchDetails>a');
    }

    getDossierInfoIcon(name) {
        return this.getResultItemByName(name).$('.mstrd-DossierInfoIcon');
    }

    getMatchedContentTitle(name) {
        return this.getMatchContentInfo(name).$('.mstrd-SearchResultListItem-matchTitleText').getText();
    }

    getHightlightTexts(name) {
        return this.getResultItemByName(name).$$('.mstrd-Highlight-text');
    }

    getMatchedContentText(name, text) {
        return this.getMatchedContentDetails(name).filter(async (elem) => {
            const content = await elem.$('div>span').getAttribute('aria-label');
            return content.includes(text);
        })[0];
    }

    getDossierSharedByInfo(name) {
        return this.getResultItemByName(name).$('.mstrd-SearchResultItemMetadata');
    }

    getObjectTypeIconInSearchResults(name) {
        return this.getResultItemByName(name).$('.mstrd-ObjectTypeIcon .mstr-icons-lib-icon');
    }

    getRunAsExcelIconInSearchResults(name) {
        return this.getResultItemByName(name).$('.mstrd-RunAsIcon.icon-share_excel');
    }

    getRunAsPDFIconInSearchResults(name) {
        return this.getResultItemByName(name).$('.mstrd-RunAsIcon.icon-share_pdf');
    }

    getDossierSharedByInfoTime(name) {
        return this.getDossierSharedByInfo(name).$('.mstrd-SearchResultItemMetadata-time');
    }

    getDossierSharedByInfoOwner(name) {
        return this.getDossierSharedByInfo(name).$('.mstrd-SearchResultItemMetadata-userName');
    }

    getDossierSharedBySortText(name) {
        return this.getParent(this.getDossierSharedByInfoTime(name)).getText();
    }

    getBrowserAllDossierLink() {
        return this.$('.mstrd-NoSearchResults-link>button');
    }

    getNoSearchResultContainer() {
        return this.$('.mstrd-NoSearchResults');
    }

    getSortOptions() {
        return this.getSearchSortDropdown().$$('.mstrd-SearchSortDropdown-option');
    }

    getSortOption(option) {
        return this.getSearchSortDropdown()
            .$$('.mstrd-SearchSortDropdown-option')
            .filter(async (elem) => {
                const text = await elem.getText();
                return text.includes(option);
            })[0];
    }

    getCertifiedIcon(name) {
        return this.getResultItemByName(name).$('.mstrd-CertifiedIcon');
    }

    getIDMatch(name) {
        return this.getResultItemByName(name).$('.mstrd-IDMatch-idMatch');
    }

    getTemplateIcon(name) {
        return this.getResultItemByName(name).$('.mstrd-TemplateIcon');
    }

    getTooltip() {
        return this.$('.ant-tooltip:not(.ant-tooltip-hidden)');
    }

    async getTooltipText() {
        const el = await this.getTooltip();
        return el.$('.ant-tooltip-inner').getText();
    }

    async getSearchResultLoadingIcon() {
        return this.getSearchResultsContainer().$('.mstrd-Spinner');
    }

    async getSearchResultWaitingAnimation() {
        return this.$('.mstrd-WaitGlobalSearchResults');
    }

    // Action  helper

    async backToLibrary() {
        await this.click({ elem: this.getBackIcon() });
        const el = this.$('.mstrd-DossiersListContainer');
        const isSidebarVisible = await el.isDisplayed();
        if (!isSidebarVisible) {
            await this.sleep(500);
            await this.click({ elem: this.getBackIcon() });
            return this.waitForElementVisible(el);
        }
    }

    async openSearchSortBox() {
        if (!(await this.isSortDropdownPresent())) {
            await this.click({ elem: this.getSearchSortBox() });
            await this.waitForElementVisible(this.getSearchSortDropdown());
        }
        await this.sleep(800);
    }

    async closeSearchSortBox() {
        if (await this.isSortDropdownPresent()) {
            await this.click({ elem: this.getSearchSortBox() });
            await this.waitForElementInvisible(this.getSearchSortDropdown());
        }
    }

    async clickNthOptionInSortDropdown(index) {
        const option = this.getSortOptions()[index - 1];
        await this.click({ elem: option });
        return this.waitForElementInvisible(this.getSearchSortDropdown());
    }

    async clickSortOption(option) {
        await this.click({ elem: this.getSortOption(option) });
        await this.waitForElementInvisible(this.getSearchSortDropdown());
    }

    async clickMyLibraryTab() {
        await this.waitForSearchLoading();
        await this.click({ elem: this.getMyLibraryTab() });
        // check my library tab is selected
        const myLibraryTabIsSelected = await this.isSelected(this.getMyLibraryTab());
        if (!myLibraryTabIsSelected) {
            // add static wait to wait for all tab element ready
            await this.sleep(500);
            await this.click({ elem: this.getMyLibraryTab() });
        }
        await this.waitForElementVisible((await this.getSearchResultListItems())[0]);
        await this.waitForDynamicElementLoading();
        await this.sleep(500); // wait for cover image rendering
    }

    async clickAllTab() {
        await this.waitForSearchLoading();
        await this.click({ elem: this.getAllTab() });
        await this.waitForElementVisible((await this.getSearchResultListItems())[0]);
        await this.waitForDynamicElementLoading();
        await this.sleep(1000); // wait for cover image rendering
    }

    async clickTabByName(name) {
        await this.waitForSearchLoading();
        await this.click({ elem: this.getTabByName(name) });
        await this.waitForDynamicElementLoading();
        await this.sleep(1000); // wait for cover image rendering
    }

    async openDossierFromSearchResults(name) {
        await this.waitForElementVisible(this.getResultItemLinkByName(name), { timeout: this.searchTimeout });
        const resultItem = this.getResultItemLinkByName(name);
        await this.clickByForce({ elem: resultItem });

        if (!(await this.promptEditor.isEditorOpen())) {
            await this.dossierPage.waitForDossierLoading();
            return this.dossierPage.waitForPageLoading();
        }
    }

    async openDossierFromSearchResultsInNewTab(name) {
        await this.openDossierFromSearchResults(name);
        await this.switchToNewWindow();
        await this.closeAllTabs();
    }

    async clickMatchedContentIcon(name) {
        await this.click({ elem: this.getMatchedContentIcon(name) });
        await this.waitForElementVisible(this.getMatchedContentDetails(name)[0]);
    }

    async openDossierFromMatchedContent(name, index = 0) {
        await this.click({ elem: this.getMatchedContentDetails(name)[index] });
        return this.dossierPage.waitForDossierLoading();
    }

    async clickMatchedContentText(name, text) {
        await this.waitForElementVisible(this.getMatchedContentDetails(name)[0]);
        const el = await this.getMatchedContentText(name, text);
        await el.click();
        await this.dossierPage.waitForDossierLoading();
    }

    async clickMatchedContentTextInNewTab(name, text) {
        await this.clickMatchedContentText(name, text);
        await this.switchToNewWindow();
    }

    async openInfoWindow(name) {
        const el = this.getDossierInfoIcon(name);
        await scrollIntoView(el);
        await this.click({ elem: el });
        await this.dossierPage.waitForInfoWindowLoading();
        let flag = await this.infoWindow.getInfoWindow().isDisplayed();
        for (let i = 1; i < 3 && !flag; i++) {
            await this.click({ elem: el });
            flag = await this.infoWindow.getInfoWindow().isDisplayed();
        }
        return this.waitForElementVisible(this.infoWindow.getInfoWindow());
    }

    async browserAllDossiers() {
        await this.click({ elem: this.getBrowserAllDossierLink() });
    }

    async hoverOnCertifiedIcon(name) {
        await this.hover({ elem: this.getCertifiedIcon(name) });
        await this.waitForElementVisible(this.getTooltip());
    }

    async hoverOnTemplateIcon(name) {
        await this.hover({ elem: this.getTemplateIcon(name) });
        await this.waitForElementVisible(this.getTooltip());
    }

    // Assertion helper

    // After triggering Search, wait the search response.
    async waitForSearchLoading() {
        await this.waitForDynamicElementLoading();
        // wait the search loading in my library tab
        const librayTab = this.getMyLibraryTab();
        await this.waitForElementVisible(librayTab);
        let loadingDots = librayTab.$('.mstrd-Spinner');
        if (await loadingDots.isDisplayed()) {
            await this.waitForElementStaleness(loadingDots);
        }
        // wait the search loading in all tab
        const allTab = this.getAllTab();
        await this.waitForElementVisible(allTab);
        loadingDots = allTab.$('.mstrd-Spinner');
        if (await loadingDots.isDisplayed()) {
            await this.waitForElementStaleness(loadingDots);
        }
    }
    async getMyLibraryCount() {
        const el = await this.getMyLibraryTab().getText();
        return Number(el.match(/\d+/g));
    }

    async getAllTabCount() {
        const el = await this.getAllTab().getText();
        return Number(el.match(/\d+/g));
    }

    async getTabCountByName(name) {
        const el = await this.getTabByName(name).getText();
        return Number(el.match(/\d+/g));
    }

    async getMatchContentCount(name) {
        const el = await this.getMatchedContentTitle(name);
        return Number(el.match(/\d+/g));
    }

    async isMatchedContentExisted(name, item) {
        let attributeValue, isExisted;
        await this.waitForElementVisible(this.getMatchedContentDetails(name)[0]);
        const els = await this.getMatchedContentDetails(name);
        for (let i = 0; i < els.length; i++) {
            attributeValue = await els[i].$('.mstrd-Highlight').getAttribute('aria-label');
            if (attributeValue.includes(item)) {
                isExisted = true;
            }
        }
        return isExisted;
    }

    async isSortDisabled() {
        return this.isDisabled(this.getSearchSortContainer());
    }

    async isSortDisplay() {
        return this.getSearchSortContainer().isDisplayed();
    }

    async isAllTabPresent() {
        return this.getAllTab().isDisplayed();
    }

    async isMyLibraryTabPresent() {
        return this.getMyLibraryTab().isDisplayed();
    }
    async isSortDropdownPresent() {
        return this.getSearchSortDropdown().isDisplayed();
    }

    async getFirstResultItemTitle() {
        const el = (await this.getSearchResultListItems())[0];
        await this.waitForElementVisible(el);
        const value = await el
            .$('.mstrd-SearchResultListItem-titleIcon,.mstrd-GlobalSearchResultListItem-titleIcon')
            .getText();
        return value;
    }

    async setUpdateTime(name, time) {
        await this.executeScript(
            "arguments[0].setAttribute('aria-label', arguments[1])",
            await this.getParent(this.getDossierSharedByInfoTime(name)),
            time
        );
    }

    async getSortOptionCount() {
        return this.getSortOptions().length;
    }

    async isSortOptionPresent(option) {
        return this.getSortOption(option).isDisplayed();
    }

    async isDossierTimePresent() {
        return this.getDossierSharedByInfoTime().isDisplayed();
    }

    async isDossierOwnerPresent() {
        return this.getDossierSharedByInfoOwner().isDisplayed();
    }

    async isBackButtonPresent() {
        return this.getBackIcon().isDisplayed();
    }

    async getSearchSortSelectedText() {
        return this.getSearchSortSelected().getText();
    }

    async isNoResultPagePresent() {
        return await this.getNoSearchResultContainer().isDisplayed();
    }

    async closeInfoWindow() {
        await this.click({ elem: this.$('[data-feature-id="library-item-info-close"]') });
    }

    async isObjectTypeIconInSearchResultsDisplayed(name) {
        return this.getObjectTypeIconInSearchResults(name).isDisplayed();
    }

    async isRunAsExcelIconPresentInSearchResults(name) {
        return this.getRunAsExcelIconInSearchResults(name).isDisplayed();
    }

    async isRunAsPDFIconPresentInSearchResults(name) {
        return this.getRunAsPDFIconInSearchResults(name).isDisplayed();
    }

    async getSearchTabNames() {
        await this.waitForSearchLoading();
        const tabs = this.getTabList();
        return tabs.map(async (tab) => tab.getText());
    }

    async getIDMatchText(name) {
        return this.getIDMatch(name).getText();
    }
}
