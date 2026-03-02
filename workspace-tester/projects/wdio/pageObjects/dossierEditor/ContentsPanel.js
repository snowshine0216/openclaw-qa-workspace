import BasePage from '../base/BasePage.js';
import Alert from '../common/Alert.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import AutoNarratives from '../visualization/AutoNarratives.js';
import EditorPanel from '../dossierEditor/EditorPanel.js';

export const ContentsPanelMenuOptions = Object.freeze({
    LIST_VIEW: 'List View',
    TAB_VIEW_TOP: 'Tab View - Top',
    TAB_VIEW_BOTTOM: 'Tab View - Bottom',
    APPLY_TO_CONSUMPTION: 'Apply to Consumption Mode',
    EXPAND_ALL: 'Expand All',
    COLLAPSE_ALL: 'Collapse All',
    HELP: 'Help',
});

export default class ContentsPanel extends BasePage {
    constructor() {
        super();
        this.alert = new Alert();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.autoNarratives = new AutoNarratives();
        this.editorPanel = new EditorPanel();
    }

    // Element Locator
    getContentsPanel() {
        return this.$('#rootView .mstrmojo-RootView-toc');
    }

    getContentsTab(){
        return this.$(`//div[contains(@class, 'mstrmojo-TableOfContents') and contains(@style,'display: block')]`);
    }

    getSwitchContentsButton() { 
        return this.$('.mstrmojo-RootView-datasets .mstrmojo-switchTabBtn');
    }

    getChapterMenuIcon(chapterName) {
        return this.getContentsPanel().$(`//div[@aria-label="${chapterName}"]//div[@class="right-toolbar"]`);
    }

    getChapterMenuOption(optionName) {
        return this.$(
            `//div[@class="mstrmojo-ui-Menu-item-container"]//div[@class='mtxt' and contains(string(), "${optionName}")]`
        );
    }

    getContentsPanelRightToolbar() {
        return this.getContentsPanel().$('div.right-toolbar');
    }

    getContentsPanelSettingsMenu() {
        return this.$('.mstrmojo-ui-Menu-item-container');
    }

    getContentsPanelMenuItem(optionName) {
        return this.getContentsPanelSettingsMenu().$(
            `.//div[@class='mtxt' and contains(normalize-space(.), "${optionName}")]/ancestor::a[contains(@class,'mstrmojo-ui-Menu-item')]`
        );
    }

    getHorizontalTOCChapterSelector() {
        return this.$('.mstrmojo-VIDocument-top-selector');
    }

    getHorizontalTOCMenuButton() {
        return this.getHorizontalTOCChapterSelector().$('.mstrmojo-VITabStrip-menuButton');
    }

    getHorizontalTOCAddChapterButton() {
        return this.getHorizontalTOCChapterSelector().$('.mstrmojo-VITabStrip-addBtn-Img');
    }

    getHorizontalTOCPageSelector() {
        return this.$('.mstrmojo-VIVizPanel-top-selector');
    }

    getHorizontalTOCAddPageButton() {
        return this.getHorizontalTOCPageSelector().$('.mstrmojo-VITabStrip-addBtn-Img');
    }

    async getPage({ chapterName, pageName }) {
        await this.switchContentsTab();
        let chapterPath = `//div[contains(@class,'mstrmojo-EditableLabel') and contains(string(), "${chapterName}")]`;
        if (pageName) {
            return this.$(
                `${chapterPath}//ancestor::div[contains(@class,'mstrmojo-VIPanelPortlet')][1]//span[contains(@class,'txt') and contains(string(), "${pageName}")]`
            );
        }
        return this.$(`${chapterPath}`);
    }

    getCurrentPage(pageTitle, chapterTitle){
        return this.$(
            `//div[@class='mstrmojo-VIPanel-titlebar']//child::*[text()='${chapterTitle}']/../..//parent::*[@class='mstrmojo-VIPanel-titlebar']//parent::*[contains(@class, 'mstrmojo-VIPanel')]//child::*[@class='mstrmojo-VIPanel-content']//div[contains(@class,'item unit icundefined') and contains(@class,'current-display')]//span[text()='${pageTitle}']`
        );
    }

    getCurrentChapterEL(){
        return this.$(
            `//div[contains(@class,'item unit icundefined') and contains(@class,'current-display')]//ancestor::div[@class='mstrmojo-VIPanel mstrmojo-VIPanelPortlet']`
        );
    }

    getAllPagesInCurrentChapterEL(){
        return this.getCurrentChapterEL().$$(
            `.//div[contains(@class,'item unit ic')]`
        );
    }

    // Action Methods
    async switchContentsTab() {
        const isContentsTabVisible = await this.getContentsTab().isDisplayed();
        if (!isContentsTabVisible) {
            await this.click({ elem: this.getSwitchContentsButton() });
            await this.waitForElementVisible(this.getContentsTab());
        }
    }

    async clickOptionOnChapterMenu(chapterName, optionName) {
        await this.switchContentsTab();
        await this.click({ elem: this.getChapterMenuIcon(chapterName) });
        await this.sleep(200);
        await this.click({ elem: this.getChapterMenuOption(optionName) });
        await this.sleep(200);
        // Confirm delete if there is a notification popup
        if (await this.alert.getTextButtonByName('Delete').isDisplayed()) {
            await this.alert.clickOnButtonByName('Delete', 500);
        }
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async goToPage({ chapterName, pageName }) {
        await this.switchContentsTab();
        const page = await this.getPage({
            chapterName,
            pageName,
        });
        await this.click({ elem: page });
        await this.sleep(300); // Time buffer to show the loading
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async rightClickPage({ chapterName, pageName }) {
        await this.switchContentsTab();
        const page = await this.getPage({
            chapterName,
            pageName,
        });
        await this.rightClick({ elem: page });
        await this.sleep(300); // Time buffer to show the loading
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async clickOptionAfterOpenMenu(optionName) {
        await this.click({elem: await this.getChapterMenuOption(optionName) });
    }

    async switchPageFromContents({ chapterName, pageName }) {
        const page = await this.getPage({
            chapterName,
            pageName,
        });
        await this.click({ elem: page });
        await this.sleep(300); // Time buffer to show the loading
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async goToPageWithNLG({ chapterName, pageName }) {
        await this.switchContentsTab();
        const page = await this.getPage({
            chapterName,
            pageName,
        });
        await this.click({ elem: page });
        await this.sleep(300); // Time buffer to show the loading
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
        await this.waitForElementInvisible(this.autoNarratives.getNLGLoadingInEditor());
        await this.waitForElementVisible(this.autoNarratives.getNLGRefreshIcon());
    }

    async goToPageAndRefreshNLG({ chapterName, pageName }) {
        await this.switchContentsTab();
        const page = await this.getPage({
            chapterName,
            pageName,
        });
        await this.click({ elem: page });
        await this.sleep(300); // Time buffer to show the loading
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
        await this.editorPanel.switchToEditorPanel();
        await this.autoNarratives.clickGenerate();
        await this.autoNarratives.clickRefreshIcon();
    }

    async getPagesCount() {
        await this.switchContentsTab();
        const pages = await this.$$(`//div[contains(@class, 'item unit icundefined')]`);
        return pages.length;
    }

    async getChapterCount() {
        await this.switchContentsTab();
        const chapters = await this.getContentsPanel().$$('.mstrmojo-VITitleBar.small');
        return chapters.length;
    }

    async validatePageSummaryText(pageDetails, expectedStrings) {
        await this.goToPageAndRefreshNLG(pageDetails);
        const summaryText = await this.autoNarratives.getSummaryTextByIndex();
        await this.autoNarratives.validateSummaryTextContains(summaryText, expectedStrings);
    }

    async getCurrentPageName() {
        await this.switchContentsTab();
        const currentPageName = await this.$(`//div[contains(@class, 'item unit icundefined current-display')]//span`);
        return await currentPageName.getText();
    }

    async openContentsPanelSettings() {
        await this.switchContentsTab();
        const settingsButton = await this.getContentsPanelRightToolbar();
        await this.click({ elem: settingsButton });
    }

    async clickContentsPanelMenuOption(optionName) {
        const menuItem = await this.getContentsPanelMenuItem(optionName);
        await this.waitForElementVisible(menuItem);
        await this.click({ elem: menuItem });
        await this.sleep(300);
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async clickHorizontalTOCMenuButton() {
        const menuButton = await this.getHorizontalTOCMenuButton();
        await this.click({ elem: menuButton });
        await this.sleep(300);
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async clickHorizontalTOCAddChapterButton() {
        const addButton = await this.getHorizontalTOCAddChapterButton();
        await this.click({ elem: addButton });
        await this.sleep(300);
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }

    async clickHorizontalTOCAddPageButton() {
        const addButton = await this.getHorizontalTOCAddPageButton();
        await this.click({ elem: addButton });
        await this.sleep(300);
        await this.waitForElementInvisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
    }
}
