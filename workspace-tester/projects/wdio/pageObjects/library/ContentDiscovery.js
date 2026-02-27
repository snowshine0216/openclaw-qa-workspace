import BaseLibrary from '../base/BaseLibrary.js';
import Sidebar from '../group/Sidebar.js';
import {
    scrollIntoView,
    scrollElementToTop,
    scrollElementToBottom,
    scrollElementToNextSlice,
} from '../../utils/scroll.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

export default class ContentDiscovery extends BaseLibrary {
    constructor() {
        super();
        this.sidebar = new Sidebar();
    }
    // Element locator
    // folder panel
    getFolderPanel() {
        return this.$('.mstrd-folderPanel');
    }

    getFolderPanelBorder() {
        const parent = this.getParent(this.getFolderPanel());
        return parent.$('.mstrd-resizable-handler');
    }

    getCloseButton() {
        return this.$('.mstrd-folderPanel-closeButton');
    }

    getProjectBox() {
        return this.getFolderPanel().$('.mstrd-folderPanel-projectSelect');
    }

    getProjectDropdown() {
        return this.$('.mstrd-DropDown-content');
    }

    getProjectHeader() {
        return this.$('.mstrd-folderPanel-header');
    }

    getProjectSelector() {
        return this.getProjectHeader().$('.mstrd-searchComboBoxSelect-toggleDropdownIcon');
    }

    getProjectSearch() {
        return this.$('.mstrd-searchComboBoxSelect-inputContainer');
    }

    getSearchSelector() {
        return this.$('.mstrd-searchComboBoxSelect-inputContainer input');
    }

    getEmptyList() {
        return this.$('.mstrd-searchComboBoxSelectDropdown-noData');
    }

    getTreeSkeleton() {
        return this.$('.mstrd-folderPanel-treeSkeleton');
    }

    getProjectItem(projectName) {
        return this.getProjectDropdown()
            .$$('.mstrd-searchComboBoxSelect-projectSelectOption')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === projectName;
            })[0];
    }

    getFolderPanelTree() {
        return this.$('.mstrd-folderPanel-tree');
    }

    getFolderPanelTreeScrollable() {
        return this.$('.mstrd-folderPanel-treeScrollable');
    }

    getFolderItem(folderName) {
        return this.$$('.mstrd-FolderTreeRow').filter(async (elm) => {
            const text = await elm.$('.mstrd-FolderTreeRow-name').getText();
            return text === folderName;
        })[0];
    }

    getFolderToggleIcon(folderName) {
        return this.getFolderItem(folderName).$('.mstrd-FolderTreeRow-toggleIcon');
    }

    getFolderContextMenu() {
        return this.$('.mstrd-ContextMenu-menu');
    }

    getItemInFolderContextMenu(item) {
        return this.getFolderContextMenu()
            .$$('.mstrd-ContextMenu-item .ant-dropdown-menu-title-content')
            .filter(async (elm) => {
                const text = await elm.getText();
                return text === item;
            })[0];
    }

    getFolderContextMenuItems() {
        return this.getFolderContextMenu().$$('.mstrd-ContextMenu-item');
    }

    getFolderItemName(folderName) {
        const elem = this.getFolderItem(folderName);
        return elem.$('.mstrd-FolderTreeRow-name');
    }

    getLoadingSpinner() {
        return this.getFolderPanelTree().$('.mstrd-Spinner');
    }

    getSelectedFolderItem() {
        return this.getFolderPanelTree().$('.mstrd-FolderTreeRow[aria-selected="true"]');
    }

    getShortcutIcon(folderName) {
        return this.getFolderItem(folderName).$('.mstrd-FolderTreeRow-shortcutMark');
    }

    getLoadingRow() {
        return this.$('.mstrd-FolderTreeRow.mstrd-FolderTreeRow--loadingRow');
    }

    getBackArrowInMobileView() {
        return this.$('.icon-backarrow');
    }

    getFolderRenameTextbox() {
        return this.$('.mstrd-FolderTreeRow .mstr-rc-input');
    }

    //content discovery panel
    getContentDiscoveryPanelDetailPanel() {
        return this.$('.mstrd-content-discovery-detail-panel');
    }

    getEmptyContentPage() {
        return this.$('.mstrd-EmptyLibrary-content');
    }

    getFolderPath() {
        return this.$('ol.mstrd-folderPath');
    }

    getFolderInFolderPath(folderName) {
        return this.getFolderPath()
            .$$('.mstrd-folderPath-clickable')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === folderName;
            })[0];
    }

    getDotsInFolderPath() {
        return this.getFolderPath().$('.mstrd-navigationMenu-trigger');
    }

    getFolderPathDropdownMenu() {
        return this.$('.mstrd-navigationMenu-content');
    }

    getFolderPathDropdownMenuItem(folderName) {
        return this.getFolderPathDropdownMenu()
            .$$('.mstrd-navigationMenu-listItem')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === folderName;
            })[0];
    }

    getContentDiscoveryTitle() {
        return this.$('.mstrd-content-discovery-detail-panel-title');
    }

    getContextMenu() {
        return this.$('.mstrd-DossierContextMenu-menu');
    }

    getInfoWindow() {
        return this.$('.mstrd-RecommendationsMainInfo-top');
    }
    getFavoriteButtonInInfoWindow() {
        return this.getInfoWindow().$('.mstrd-in-RecommendationsMainInfo.mstrd-FavoriteIconButton');
    }

    getShareButtonInInfoWindow() {
        return this.getInfoWindow().$('.mstr-menu-icon.icon-info_share');
    }

    getEmbeddedBotButtonInInfoWindow() {
        return this.getInfoWindow().$('.icon-mstrd_embed');
    }

    getBotActiveSwitchInInfoWindow() {
        return this.getInfoWindow().$('.mstrd-RecommendationsMainInfo-activeSwitch').$('.mstrd-Switch');
    }

    getEditButtonInInfoWindow() {
        return this.getInfoWindow().$('.icon-info_edit');
    }

    getManageAccessButtonInInfoWindow() {
        return this.getInfoWindow().$('.mstr-menu-icon.icon-mstrd_manage_access');
    }

    getObjectInContentDiscovery(objectName) {
        return this.$$('.mstrd-DossierItemRow-nameContainer').filter(async (elem) => {
            const elemText = await elem.$(`div[class='mstrd-DossierItemRow-name']`).getText();
            return elemText === objectName;
        })[0];
    }

    // action helper
    async dragFolderPanelWidth(offset) {
        return this.dragAndDrop({
            fromElem: this.getFolderPanelBorder(),
            toElem: this.getFolderPanelBorder(),
            toOffset: { x: offset, y: 0 },
        });
    }

    async openProjectList() {
        if (this.isSafari()) {
            await this.clickByForce({ elem: this.getProjectSearch() });
            await this.sleep(1000);
        } else {
            await this.clickByForce({ elem: this.getProjectSelector() });
            await this.sleep(1000);
            let isProjectListOpen = await this.getProjectDropdown().isDisplayed();
            for (let i = 0; i < 3 && !isProjectListOpen; i++) {
                await this.clickByForce({ elem: this.getProjectSelector() });
                await this.sleep(1000);
                isProjectListOpen = await this.getProjectDropdown().isDisplayed();
                await console.log('Project list is not open' + i + 'times.');
            }
        }
        await this.waitForCurtainDisappear();
        await this.waitForLibraryLoading();
    }

    async searchProject(text) {
        await this.getSearchSelector().setValue(text);
        // wait for content to be populated
        return this.sleep(1000);
    }

    async selectProject(projectName) {
        await this.click({ elem: this.getProjectItem(projectName) });
        await this.waitForElementStaleness(this.getProjectDropdown(), { msg: 'Project dropdown is not closed.' });
        await this.waitForElementStaleness(this.getTreeSkeleton());
    }


    async moveFolderIntoViewPort(folder) {
        let folderElement = this.getFolderItem(folder);
        const folderTree = this.getFolderPanelTreeScrollable();
        const offsetHeight = await folderTree.getSize('height');
        const scrollHeight = await getAttributeValue(folderTree, 'scrollHeight');
        let count = 1;
        let flag = await folderElement.isDisplayed();
        while (!flag && count * offsetHeight < scrollHeight) {
            await scrollElementToNextSlice(folderTree, (count + 0.1));
            folderElement = this.getFolderItem(folder);
            flag = await folderElement.isDisplayed();
            count++;
            await this.sleep(500);
        }
        // await browser.execute((element) => {
        //     element.scrollIntoView();
        // }, folderElement);
    }

    async openFolderByPath(folderPath) {
        await this.waitForElementStaleness(this.getTreeSkeleton());
        for (const folder of folderPath) {
            await this.moveFolderIntoViewPort(folder);
            await this.clickWithOffset({ elem: this.getFolderItemName(folder) }, { x: 0, y: -3 });
            await this.waitForElementStaleness(this.getLoadingSpinner());
            await this.waitForElementStaleness(this.getLoadingRow());
            await this.sleep(500); // wait for folder to be opened
        }
    }

    async expandFolderByPath(folderPath) {
        for (const folder of folderPath) {
            await this.moveFolderIntoViewPort(folder);
            if (!(await this.isFolderExpanded(folder))) {
                await this.click({ elem: this.getFolderToggleIcon(folder) });
                await this.waitForElementStaleness(this.getLoadingSpinner());
                await this.waitForElementStaleness(this.getLoadingRow());
            }
        }
    }

    async collapseFolder(folderName) {
        await this.moveFolderIntoViewPort(folderName);
        if (await this.isFolderExpanded(folderName)) {
            await this.click({ elem: this.getFolderToggleIcon(folderName) });
        }
    }

    async closeFolderPanel() {
        await this.click({ elem: this.getCloseButton() });
        await this.waitForElementInvisible(this.getFolderPanel(), { msg: 'Folder Panel is not closed.' });
    }

    async openFolderPanel() {
        if (!(await this.isFolderPanelOpened())) {
            return this.sidebar.clickPredefinedSection('Browse Folders');
        }
    }

    async hoverDotsInFolderPath() {
        await this.hover({ elem: this.getDotsInFolderPath() });
        await this.waitForElementVisible(this.getFolderPathDropdownMenu());
    }

    async clickFolderInDropdownList(folderName) {
        await this.click({ elem: this.getFolderPathDropdownMenuItem(folderName) });
    }

    async openFolderFromFolderPath(folderName) {
        await this.click({ elem: this.getFolderInFolderPath(folderName) });
    }

    async clickBackButtonInMobileView() {
        await this.click({ elem: this.getBackArrowInMobileView() });
        await this.waitForCurtainDisappear();
        await this.waitForLibraryLoading();
    }

    async rightClickToOpenContextMenu(folderName, isWaitCtxMenu = true) {
        await this.moveFolderIntoViewPort(folderName);
        await this.rightClick({ elem: this.getFolderItem(folderName)});
        if (isWaitCtxMenu) {
            await this.waitForElementVisible(this.getFolderContextMenu());
        }
    }

    async dismissContextMenu() {
        // dismiss the context menu by clicking on the Content Discovery title
        await this.click({ elem: this.getContentDiscoveryTitle() });
    }

    async openFromContextMenuForFloder(folderName, item) {
        await this.rightClickToOpenContextMenu(folderName);
        await this.click({ elem: this.getItemInFolderContextMenu(item) });
    }

    async renameFolder(newName) {
        const renameTextbox = this.getFolderRenameTextbox();
        await this.delete();
        await renameTextbox.setValue(newName);
        await this.enter();
        await this.sleep(500); // wait for new name to appear
    }

    async scrollToTopFolderTree() {
        await scrollElementToTop(this.getFolderPanelTreeScrollable());
        await this.waitForElementStaleness(this.getTreeSkeleton());
    }

    async scrollToBottomFolderTree() {
        await scrollElementToBottom(this.getFolderPanelTreeScrollable());
        await this.waitForElementStaleness(this.getTreeSkeleton());
    }

    // assertion helper
    async isFolderPanelOpened() {
        return this.getFolderPanel().isDisplayed();
    }

    async selectedProject() {
        return this.$('.mstrd-InputWithButtons-input').getAttribute('placeholder');
    }

    async isEmptyListPresent() {
        return this.getEmptyList().isDisplayed();
    }

    async folderPath() {
        const folderNames = await this.getFolderPath().$$('li');
        let fullPath = '';
        for (let i = 0; i < folderNames.length; i++) {
            const spans = await folderNames[i].$$('span');
            for (const span of spans) {
                fullPath += await span.getText();
            }
        }
        return fullPath;
    }

    async selectedFolder() {
        return this.getSelectedFolderItem().$('.mstrd-FolderTreeRow-name').getText();
    }

    async isProjectGrayedOut() {
        const color = await this.$('.mstrd-searchComboBoxSelect-inputContainer').getCSSProperty('background-color');
        return color.value === 'rgba(242,243,245,1)';
    }

    async isFolderExpanded(folderName) {
        await this.moveFolderIntoViewPort(folderName);
        const expanded = await this.getFolderItem(folderName).getAttribute('aria-expanded');
        return expanded === 'true';
    }

    async folderPanelWidth() {
        const folderPanelSize = await this.getFolderPanel().getSize();
        const width = Math.round(folderPanelSize.width / 10) * 10;
        return width;
    }

    async isEmptyContent() {
        return this.getEmptyContentPage().isDisplayed();
    }

    async isShortcutFolder(folderName) {
        return this.getShortcutIcon(folderName).isDisplayed();
    }

    async isFolderExist(folderName) {
        return this.getFolderItem(folderName).isDisplayed();
    }

    async isFolderContextMenuItemExisted(item) {
        const el = await this.getFolderContextMenuItems();
        return this.isExisted(item, el, 'text');
    }

    async isFolderContextMenuExisted() {
        return this.getFolderContextMenu().isDisplayed();
    }

    async openContextMenu(objectName) {
        await this.click({ elem: this.getItem(objectName).$('.mstrd-DossierRowMoreOptionsOpener') });
    }

    async openInfoWindowInTeams(objectName) {
        const object = await this.getObjectInContentDiscovery(objectName);
        await this.hover({ elem: object });
        //await this.click({ elem: this.getItem(objectName).$('.mstrd-DossierRowMoreOptionsOpener') });
        await this.click({
            elem: this.$('.mstrd-DossierRowActionBar--actionBarVisible').$('.mstrd-DossierInfoIcon-icon'),
        });
    }
}
