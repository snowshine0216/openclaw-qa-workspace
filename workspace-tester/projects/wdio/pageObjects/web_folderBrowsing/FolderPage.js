import WebBasePage from '../base/WebBasePage.js';
import FolderTreeView from '../web_home/FolderTreeView.js';
import RightFolderPanel from '../web_home/RightFolderPanel.js';
import NewFolderEditor from '../web_home/NewFolderEditor.js';
import ExplorerDialog from '../web_home/ExplorerDialog.js';
import MsgBox from '../web_home/MsgBox.js';
import RecentsPanel from '../web_home/RecentsPanel.js';
import MSTRLogoMenu from '../web_home/MSTRLogoMenu.js';
import LeftToolbar from '../web_home/LeftToolbar.js';
import ShareDialog from '../web_home/ShareDialog.js';
import Alert  from '../common/Alert.js';
import { scrollElementToTop } from '../../utils/scroll.js';

/**
 * This object is used to handle all folder manipulations
 *
 * All left folder navigation manipulations(like view switch) are handled in this object
 * All fright folder manipulations are handled in 'this.rightFolder'
 * Click 'New Folder', all manipulations to popup dialog are handled in 'this.newFolderEditor'
 * Click 'Copy'/'Move'/'Create Shortcut'...,  all manipulations to popup dialog are handled in 'this.explorerDialog'
 */
export default class FolderPage extends WebBasePage {
    constructor() {
        super();
        this.treeView = new FolderTreeView();
        this.alert = new Alert();
        this.rightFolder = new RightFolderPanel();
        this.newFolderEditor = new NewFolderEditor();
        this.explorerDialog = new ExplorerDialog();
        this.msgBox = new MsgBox();
        this.mstrLogoMenu = new MSTRLogoMenu();
        this.leftToolBar = new LeftToolbar();
        this.recentsPanel = new RecentsPanel();
    }

    // Locator

    getMenuSection() {
        return this.$('.mstrMenuSection div.mstrMenuContent');
    }

    getEntryItem(entryPath) {
        return this.getMenuSection().$(`.mstrLink[title="${entryPath}"]`);
    }

    getObjectByName(name) {
        return this.$('.mstrListView tbody').$$('.mstrListViewNameInfo').filter(async (elem) => (await elem.getText()).includes(name))[0];
    }

    async getObjectDescription(name) {
        const el = this.getParent(this.getObjectByName(name)).$('.desc');
        return el.getText();
    }

    async getRename() {
        const renameElement = this.$('.rename');
        await this.waitForElementVisible(renameElement);
        return renameElement;
    }

    async getHeaderFolderLink(targetPath) {
        const pathText = await this.getPathText();
        await this.waitForElementVisible(pathText);
        return await pathText.$$('.mstrLink').filter(async (elem) => {
            const text = await elem.getText();
            return text === targetPath;
        })[0];
    }

    async getFolderPullArrow(targetPath) {
        const folderLink = await this.getHeaderFolderLink(targetPath);
        return folderLink.$('../..').$('.mstrPathBreadCrumbsPullArrow');
    }

    getCompressedMenu() {
        return this.$('.mstrPathBreadCrumbsAncestors');
    }

    getPathInCompressedMenu(targetPath) {
        return this.getCompressedMenu().$$('.mstrLink').filter(async (elem) => (await elem.getText()) === targetPath)[0];
    }

    async findShareDialog() {
        const shareDialog = new ShareDialog();
        await this.waitForElementVisible(shareDialog.locator);
        return shareDialog;
    }

    // Action helper

    async switchToIconView() {
        await this.click({ elem: $('#tbLargeIcons') });
    }

    async switchToListView() {
        return this.click({ elem: $('#tbListView') });
    }

    async openByTreeView(paths) {
        await this.openHomePage();
        const [entryPath] = paths;
        const entryItem = this.getMenuSection().$(`.mstrLink[title="${entryPath}"]`);
        await this.click({ elem: entryItem });
        return this.treeView.open(paths);
    }

    async openByPath(path) {
        await super.openByPath(path);
        // add sleep here to wait to alert display
        await this.sleep(2000);
        const flag = await this.alert.isAlertDisplay();
        if (flag) {
            console.log('find alert');
            await this.alert.clickRepublishButton();
        }
        await this.waitForWebCurtainDisappear();
        await this.waitForElementInvisible(this.$('#waitBox .mstrmojo-Editor-curtain'));
    }

    async navigateByHeaderPath(targetPath) {
        const link = await this.getHeaderFolderLink(targetPath);
        return this.click({ elem: link });
    }

    async openCompressedMenu(targetPath) {
        await this.click({ elem: await this.getFolderPullArrow(targetPath) });
    }

    async navigateByCompressedMenu(targetPath) {
        const link = await this.getPathInCompressedMenu(targetPath);
        await this.click({ elem: link });
    }

    /**
     * Click an item in left panel to trigger arrow icons added to items in left panel
     * @param {String} entryPath item in left panel on Home Page with initial status
     */
    async clickTreeEntryItem(entryPath) {
        await this.click({ elem: this.getEntryItem(entryPath) });
    }

    async clickNewFolder() {
        await this.click({ elem: $('#tbNewFolder') });
        await this.waitForElementVisible($('div[scriptclass="mstrCreateFolderImpl"]'));
    }

    async inputRename(newName) {
        const renameInput = await this.getRename().$('input');
        await this.clear({ elem: renameInput});
        await renameInput.setValue(newName);
    }

    async applyRename() {
        await this.click({ elem: (await this.getRename()).$('img[title="Apply"]') });
    }

    async cancelRename() {
        await this.click({ elem: (await this.getRename()).$('img[title="Cancel"]') });
    }

    // Assersion Helper
}
