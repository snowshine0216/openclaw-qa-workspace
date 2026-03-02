import SelectorObject from '../selector/SelectorObject.js';
import RsdFilterPanel from './RsdFilterPanel.js';
import RsdGrid from './RsdGrid.js';
import PanelStack from './PanelStack.js';
import GridAndGraph from './GridAndGraph.js';
import RsdGraph from './RsdGraph.js';
import TextField from './TextField.js';
import GroupBy from './GroupBy.js';
import RSDMenu from '../document/RSDMenu.js';
import BaseGrid from '../base/BaseGrid.js';
import ViewFilterEditor from '../document/ViewFilterEditor.js';
import PersonalViewDialog from '../web_personalView/PersonalViewDialog.js';
import PanelSelector from '../document/PanelSelector.js';
import Layout from '../document/Layout.js';
import RsdInfoWindow from '../document/RsdInfoWindow.js';
import ShareDialog from '../web_home/ShareDialog.js';
import { buildEventUrl } from '../../utils/index.js';
import DocumentToolbar from './DocumentToolbar.js';
import WebBasePage from '../base/WebBasePage.js';

export default class DocumentPage extends WebBasePage {
    constructor() {
        super();
        this.selector = new SelectorObject();
        this.panelStack = new PanelStack();
        this.graph = new RsdGraph();
        this.textField = new TextField();
        this.groupBy = new GroupBy();
        this.rsdMenu = new RSDMenu();
        this.baseGrid = new BaseGrid();
        this.viewFilterEditor = new ViewFilterEditor();
        this.personalViewDialog = new PersonalViewDialog();
        this.panelSelector = new PanelSelector();
        this.layout = new Layout();
        this.infoWindow = new RsdInfoWindow();
        this.toolbar = new DocumentToolbar();
    }

    getDocLayoutViewer() {
        return this.$$('.mstrmojo-DocLayoutViewer').filter((item) => item.isDisplayed())[0];
    }

    getShareDocumentButton() {
        return this.$(`//span[@class="mstr-menu-content"][text()="Share Document"]`);
    }

    getLibraryIcon() {
        return this.$('.mstr-nav-icon.icon-library');
    }

    getPromptRunButton() {
        return this.$('.mstrButton[value*="Run"]');
    }

    /** Action method */

    async goToLibrary() {
        await this.click({ elem: this.getLibraryIcon() });
        await this.waitForItemLoading();
    }

    /**
     * Find selector by 'nm' attribute of the selector
     * @param {String} name 'nm' attribute of the selector
     * @returns {SelectorObject} The selector
     */
    findSelectorByName(name) {
        return SelectorObject.createByName(name);
    }

    findSelectorByKey(key) {
        return SelectorObject.create(key);
    }

    /**
     * Find a Grid in the RSD page.
     * @param {string} id The grid id
     * @returns {RsdGrid} The grid
     */
    findGridById(id) {
        // Find the valid table
        return RsdGrid.create(id);
    }

    /**
     * Find all the Grid related: when document is converted from dossier,there will be 2 grid table.
     * @param {string} key The grid key
     * @returns {RsdGrid} The grid
     */
    findGridByIdOnly(key) {
        // Find the valid table
        return RsdGrid.createByKeyOnly(key);
    }

    findFilterPanelByName(name) {
        return RsdFilterPanel.createbyName(name);
    }

    findPanelStackByName(name) {
        return this.panelStack.create(name);
    }

    findGridAndGraphByName(name) {
        return GridAndGraph.createByName(name);
    }

    findButtonByText(text) {
        return this.$$('.mstrmojo-DocButton').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    async findShareDialog() {
        const shareDialog = new ShareDialog();
        await this.waitForElementVisible(shareDialog.locator);
        return shareDialog;
    }

    findGridZoneById(key) {
        return RsdGrid.createByKey(key);
    }

    /**
     * Find a Grid related all elements in the RSD page.
     * @param {string} key The grid key
     * @returns {RsdGrid} The grid
     */
    findGridByKey(key) {
        return RsdGrid.createByKey(key);
    }

    async open(projectID, documentID, libraryUrl = browser.options.baseUrl) {
        const url = new URL(`app/${projectID}/${documentID}`, libraryUrl);
        await browser.url(url.toString(), this.DEFAULT_LOADING_TIMEOUT);
    }

    async openDocument(documentID) {
        await browser.url(buildEventUrl(2048001, { documentID }));
        await this.sleep(1000); // wait for the curtain to appear
        await this.waitForCurtainDisappear();
        await this.waitPageLoading();
    }

    async openRunWithPrompt(documentID) {
        await this.openDocument(documentID);
        await this.runWithPrompt();
    }

    async runWithPrompt() {
        const runDocument = this.getPromptRunButton();
        await this.click({ elem: runDocument });
    }

    async waitAllToBeLoaded() {
        // await this.waitPageLoading();
        await this.waitForElementVisible(this.getDocLayoutViewer().$('.mstrmojo-DocLayout'), 'waitContentLoading');
        await this.waitForCurtainDisappear();
    }

    async backToFolder(sleep = 2000) {
        const backTriangle = this.$('.tbBack0,#tbBack0');
        await this.click({ elem: backTriangle });
        await this.waitForCurtainDisappear();
        await this.sleep(sleep);
    }

    // wait for new page loaded in linkdrill
    async waitNewPageLoadByTitle(title) {
        await this.waitForPageLoadByTitle(title);
    }

    /**
     * select a tab in Layout by its tab name
     * @param tabName
     */
    async selectLayout(tabName) {
        await this.layout.selectLayout(tabName);
        await this.waitAllToBeLoaded();
        await this.waitForCurtainDisappear();
    }

    async runWithPrompt() {
        const runDocument = this.getPromptRunButton();
        await this.click({ elem: runDocument });
    }

    /**
     * Click a button find by its text
     * @param text
     */
    async clickBtnByText(text) {
        // wait the render process in browser client, which would not be influenced by network environment
        await this.click({ elem: this.findButtonByText(text) });
    }

    async isDocContentPresent() {
        try {
            await this.waitForElementVisible(this.getDocLayoutViewer());
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Click the widget selection checkbox for a specific widget
     * @param {string} widgetKey - The widget key (e.g., 'W89')
     */
    async clickWidgetSelectionCheckbox(widgetKey) {
        const widgetCheckbox = await this.$(
            `//div[@k="${widgetKey}"]//div[@class="mstrmojo-DocWidget-checkbox" and @data-feature-id="document-widget-selection-checkbox"]`
        );
        await widgetCheckbox.waitForClickable({ timeout: 10000 });
        await widgetCheckbox.click();
    }
}
