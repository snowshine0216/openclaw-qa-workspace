import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import { scrollIntoView, scrollElementToTop, scrollElementToBottom } from '../../utils/scroll.js';

/**
 * This is the base class for object browser components used in report editor / replace cube selector / report creator, etc.
 * - Common functionalities for object browser are implemented here.
 * - Specific locators and actions need to be implemented in child classes respectively.
 * - Child classes need to implement getDatasetSelectContainer() to return the root container of the object browser.
 * - Child classes include: ReportObjectBrowser, ReportCubeBrowser, MDXSourceSelector
 */
export default class BaseObjectBrowser extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
    }
    // element locator
    getDatasetSelectContainer() {
        // To be overridden in child classes
        throw new Error('getDatasetSelectContainer() must be implemented in child classes');
    }

    getTitle() {
        return this.getDatasetSelectContainer().$('.mstr-rc-dialog-title');
    }

    getContent() {
        return this.getDatasetSelectContainer().$('.mstr-rc-dialog-content');
    }

    getFolderBrowserPopoverTreeSelector() {
        return this.getDatasetSelectContainer().$('.ant-tree-select');
    }

    getFolderBrowserTreePopover() {
        return this.$('.mstr-folder-tree-style:not(.ant-select-dropdown-hidden) .ant-select-tree-list-holder');
    }

    getTreeElementInFolderBrowserPopoverByName(name) {
        return this.$(
            `//div[contains(@class, 'mstr-folder-tree-style') and not(contains(@class, 'ant-select-dropdown-hidden'))]//div[@class='ant-select-tree-list-holder']//span[@class='ant-select-tree-title']//div[@class='object-tooltip-children-container']//span[text()='${name}']`
        );
    }

    getObjectListFlatView() {
        return this.getDatasetSelectContainer().$('.mstr-object-browser-object-list');
    }

    getObjectCountLabel() {
        return this.getObjectListFlatView().$('.object-count-text');
    }

    getItemInObjectBrowserFlatViewByName(name) {
        return this.getObjectListFlatView()
            .$$('.object-item-text')
            .filter(async (elem) => {
                const text = await elem.getText();
                return text === name;
            })[0];
    }

    getSearchInputBox() {
        return this.getDatasetSelectContainer().$('.mstr-object-browser-search input');
    }

    getFolderUpButton() {
        return this.getDatasetSelectContainer().$('.icon-objects-folder-up');
    }

    getSearchLoadingIcon() {
        return this.$('.search-loading-spinner');
    }

    getTooltipContainer() {
        return this.$('.ant-tooltip.object-tooltip-container');
    }

    // action buttons in footer
    getFooter() {
        return this.getDatasetSelectContainer().$('.mstr-rc-dialog-footer');
    }

    getPrimaryButton() {
        return this.getFooter().$('.ant-btn-primary');
    }

    getDefaultButton() {
        return this.getFooter().$('.ant-btn-default');
    }

    getContextMenu() {
        return this.$('.mstr-context-menu:not(.ant-dropdown-hidden)');
    }

    // actions
    async scrollObjectBrowserPopoverToTop() {
        await scrollElementToTop(this.getFolderBrowserTreePopover());
        await this.sleep(500);
    }

    async openFolderBrowserPopover() {
        await this.click({ elem: this.getFolderBrowserPopoverTreeSelector() });
        await this.waitForElementVisible(this.getFolderBrowserTreePopover());
        await this.sleep(1000); // wait for animation finished
    }

    async scrollToBottomInTreePopover() {
        await scrollElementToBottom(this.getFolderBrowserTreePopover());
        await this.sleep(1000);
    }

    async scrollToTopInTreePopover() {
        await scrollElementToTop(this.getFolderBrowserTreePopover());
        await this.sleep(1000);
    }

    async hoverOnCurrentFolderSelector() {
        await this.hover({ elem: this.getFolderBrowserPopoverTreeSelector() });
        await this.waitForTooltipVisible();
        await this.sleep(500);
    }

    async waitForTooltipVisible() {
        await this.waitForElementVisible(this.getTooltipContainer());
    }

    async waitForLoading() {
        await this.waitForElementInvisible(this.getSearchLoadingIcon());
    }

    async navigateInObjectBrowserPopover(paths) {
        for (const name of paths) {
            await scrollIntoView(this.getTreeElementInFolderBrowserPopoverByName(name));
            await this.waitForElementVisible(this.getTreeElementInFolderBrowserPopoverByName(name));
            await this.click({ elem: this.getTreeElementInFolderBrowserPopoverByName(name) });
            await this.waitForLoading();
        }
    }

    async searchObject(name, option = {}) {
        const { isValid = true } = option;
        await this.clearSearchBox();
        await this.input(name);
        await this.enter();
        await this.waitForLoading();
        if (isValid) {
            await this.waitForElementVisible(this.getItemInObjectBrowserFlatViewByName(name));
        }
    }

    async clearSearchBox() {
        await this.waitForElementVisible(this.getSearchInputBox());
        await this.click({ elem: this.getSearchInputBox() });
        await this.clear({ elem: this.getSearchInputBox() });
    }

    async clickFolderUpButton() {
        await this.click({ elem: this.getFolderUpButton() });
        await this.waitForLoading();
        await this.sleep(1000);
    }

    async selectObjectInFlatView(name) {
        await this.waitForElementVisible(this.getObjectListFlatView());
        await this.click({ elem: this.getItemInObjectBrowserFlatViewByName(name) }).catch((error) => {
            console.error(`Error clicking on object "${name}":`, error);
            throw error;
        });
        await this.waitForLoading();
        await this.sleep(500);
    }

    async doubleClickObject(objectName) {
        await this.waitForElementVisible(this.getObjectListFlatView());
        await this.waitForElementVisible(this.getItemInObjectBrowserFlatViewByName(objectName));
        await this.doubleClickOnElement(this.getItemInObjectBrowserFlatViewByName(objectName));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async navigateInObjectBrowserFlatView(paths) {
        for (const name of paths) {
            await this.selectObjectInFlatView(name);
        }
    }

    async clickDoneButton() {
        await this.click({ elem: this.getPrimaryButton() });
        await this.waitForElementInvisible(this.getDatasetSelectContainer());
    }

    async openContextMenuOnObject({ name, isWait = true }) {
        await this.waitForElementVisible(this.getItemInObjectBrowserFlatViewByName(name));
        await this.rightClick({ elem: this.getItemInObjectBrowserFlatViewByName(name) });
        if (isWait) {
            await this.waitForElementVisible(this.getContextMenu());
        }
        await this.sleep(500);
    }

    // action helpers
    async isFolderUpButtonDisabled() {
        return await this.isAriaDisabled(this.getFolderUpButton());
    }

    async getCurrentSelectedFolder() {
        return await this.getFolderBrowserPopoverTreeSelector().getText();
    }

    async getTooltipText() {
        return await this.getTooltipContainer().getText();
    }

    async isObjectPresentInFlatView(name) {
        const isDisplayed = await this.getItemInObjectBrowserFlatViewByName(name).isDisplayed();
        return isDisplayed;
    }

    /**
     * Description: Get total object count in current folder, by parsing the label text or counting the item elements.
     * The label text is like "29 Objects", we can extract the number from it.
     * @param {*} isByLabel - whether to get the count by parsing the label text. If false, will get the count by counting the item elements in the flat view. Default is true.
     * @returns {Promise<number>} total object count
     */
    async getTotalObjectCount(isByLabel = true) {
        if (isByLabel) {
            const titleText = await this.getObjectCountLabel().getText();
            const match = titleText.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
        }
        const countElements = await this.getObjectListFlatView().$$('.object-item-text');
        return countElements.length;
    }
}
