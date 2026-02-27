import BasePage from '../base/BasePage.js';
import { scrollIntoView, scrollElementToBottom, scrollElementToTop } from '../../utils/scroll.js';

export default class CopyMoveWindow extends BasePage {
    // Element locators
    getCopyMoveWindow() {
        return this.$('.mstrd-operation-dialog');
    }

    getCopyMoveContent() {
        return this.getCopyMoveWindow().$('.ant-modal-content');
    }

    getFolderPanelTree() {
        return this.getCopyMoveWindow().$('mstrd-folderPanel-tree');
    }

    getFolderPanelTreeScrollable() {
        return this.getCopyMoveWindow().$('.mstrd-folderPanel-treeScrollable');
    }

    getCloseButton() {
        return this.getCopyMoveWindow().$('.ant-modal-close-x');
    }

    getCancelButton() {
        return this.getCopyMoveWindow().$('.mstrd-cancel-btn');
    }

    getCreateButton() {
        return this.getCopyMoveWindow().$('.mstrd-create-btn');
    }

    getCreateNewFolderButton() {
        return this.getCopyMoveWindow().$('.mstrd-create-new-folder-btn');
    }

    getNameTextbox() {
        return this.$('.mstr-rc-input[type="text"]');
    }

    getSearchBox() {
        return this.$('.mstr-rc-input[type="search"]');
    }

    getPerformSearchButton() {
        return this.$('.mstr-icons.icon-common-search-big');
    }

    getClearSearchBoxButton() {
        return this.$('.mstr-rc-icon-button');
    }

    getFolderItem(folderName) {
        return this.getCopyMoveWindow()
            .$$('.mstrd-FolderTreeRow')
            .filter(async (elm) => {
                const text = await elm.$('.mstrd-FolderTreeRow-name').getText();
                return text === folderName;
            })[0];
    }

    getFolderItemName(folderName) {
        const elem = this.getFolderItem(folderName);
        return elem.$('.mstrd-FolderTreeRow-name');
    }

    getFolderItemArrow(folderName) {
        const elem = this.getFolderItem(folderName);
        return elem.$('.mstrd-FolderTreeRow-button');
    }

    getRenameTextbox() {
        return this.$('.mstr-rc-input[type="text"]');
    }

    getProject() {
        return this.$('.mstrd-tree-section-header').getText();
    }

    getTreeSkeleton() {
        return this.getCopyMoveWindow().$('.mstrd-folderPanel-treeSkeleton');
    }

    getLoadingSpinner() {
        return this.getFolderPanelTree().$('.mstrd-Spinner');
    }

    getLoadingRow() {
        return this.getCopyMoveWindow().$('.mstrd-FolderTreeRow--loadingRow');
    }

    // Action helpers
    async closeWindow() {
        await this.click({ elem: this.getCloseButton() });
    }

    async clickCancel() {
        await this.click({ elem: this.getCancelButton() });
    }

    async clickCreateAndWaitForProcessor() {
        await this.click({ elem: this.getCreateButton() });
        await this.waitForProcessorDisappear();
    }

    async clickCreate() {
        await this.waitForElementVisible(this.getCreateButton());
        await this.waitForElementClickable(this.getCreateButton());
        await this.getCreateButton().click();
        await this.waitForElementStaleness(this.getProgressBar());
        await this.waitForCurtainDisappear();
    }

    async clickCreateNewFolder() {
        await this.click({ elem: this.getCreateNewFolderButton() });
    }

    async moveFolderIntoView(folderName) {
        const folderElement = await this.getFolderItem(folderName);
        await scrollIntoView(folderElement);
        await this.waitForElementStaleness(this.getTreeSkeleton());
    }

    async scrollToTopFolderTree() {
        await scrollElementToTop(this.getFolderPanelTreeScrollable());
        await this.waitForElementStaleness(this.getTreeSkeleton());
    }

    async scrollToBottomFolderTree() {
        await scrollElementToBottom(this.getFolderPanelTreeScrollable());
        await this.waitForElementStaleness(this.getTreeSkeleton());
    }

    async expandFolderPath(folderPath) {
        for (const folder of folderPath) {
            await this.moveFolderIntoView(folder);

            // if the folder is closed, click the arrow to expand the folder
            const expanded = await this.getFolderItem(folder).getAttribute('aria-expanded');
            if (expanded === 'false') {
                await this.click({ elem: this.getFolderItemArrow(folder) });
                await this.waitForElementStaleness(this.getLoadingSpinner());
                await this.waitForElementStaleness(this.getLoadingRow());
            }
        }
    }

    async openFolder(folderName) {
        await this.click({ elem: this.getFolderItemName(folderName) });
    }

    async openFolderByPath(folderPath) {
        for (const folder of folderPath) {
            await this.moveFolderIntoView(folder);
            await this.click({ elem: this.getFolderItemName(folder) });
        }
    }

    async renameDossier(newName) {
        const renameTextbox = this.getRenameTextbox();
        await renameTextbox.click();
        await this.clear({ elem: renameTextbox });
        await renameTextbox.setValue(newName);
    }

    // Assertion helpers

    async isRenameTextboxDisplayed() {
        return await this.getRenameTextbox().isDisplayed();
    }

    async isCreateButtonEnabled() {
        return (await this.getCreateButton()).isEnabled();
    }

    async isWindowPrensent() {
        return await this.getCopyMoveWindow().isDisplayed();
    }
}
