
import WebBasePage from '../base/WebBasePage.js';
import { buildEventUrl } from '../../utils/index.js';
import DossierMenu from '../web_dossier/DossierMenu.js';
import LeftToolbar from '../web_home/LeftToolbar.js';
import ListView from '../web_home/ListView.js';
import Alert from '../common/Alert.js';
import ShareDialog from '../web_home/ShareDialog.js';
import DossierToolbar from '../web_dossier/DossierToolbar.js';
import { getFileSize } from '../../config/folderManagement.js';



export default class WebDossierPage extends WebBasePage {
    constructor() {
        super();
        this.listView = new ListView();
        this.dossierMenu = new DossierMenu();
        this.dossierToolbar = new DossierToolbar();
        this.alert = new Alert();
    }

    getDossierViewer() {
        return this.$$('.mstrmojo-RootView').filter((item) => item.isDisplayed())
            [0];
    }

    getListViewItem(name) {
        return this.listView.getListItem(name);
    }

    getPromptRunButton() {
        return this.$('.mstrButton[value*="Run"]');
    }

    getRePromptButton() {
        return this.$('.item.btn.reprompt');
    }

    getCloseButton() {
        return this.$('.item.btn.close');
    }

    getLaunchInLibraryButton() {
        return this.$('.mstrmojo-Button.share-link-bar-launch-button');
    }

    getShareLinkBar() {
        return this.$('.mstrmojo-ShareLinkBar ');
    }

    // get content in the n-th visualization in dossier page, n starts from 1
    async getNthVisualizationContent(n) {
        await this.waitForElementVisible($$('.mstrmojo-UnitContainer-SplitterHost')[n - 1]);
        return this.$$('.mstrmojo-UnitContainer-content').filter((item) => item.isDisplayed())
            [n - 1];
    }

    // Action helper

    async findShareDialog() {
        const shareDialog = new ShareDialog();
        await this.waitForElementVisible(shareDialog.locator);
        return shareDialog;
    }

    /**
     * Open a Dossier by ID
     * @param {string} documentID The Dossier ID
     */
    async open(documentID) {
        await browser.url(buildEventUrl(3140, { documentID }));
        await this.waitForDossierCurtainDisappear();
        await this.sleep(2000);// wait for images to load
    }

    async openWithPromptPage(documentID) {
        await browser.url(buildEventUrl(3140, { documentID }));
        await this.waitForCurtainDisappear();
    }

    async openRunWithPrompt(documentID) {
        await this.openWithPromptPage(documentID);
        await this.click({ elem: this.getPromptRunButton() });
    }

    async openDossierInListView(name) {
        const item = await this.getListViewItem(name);
        const href = await item.getAttribute('href');
        await browser[href];
        await this.waitForDossierCurtainDisappear();
    }

    async deleteUploadDossier(name) {
        const item = await this.getListViewItem(name);
        await this.rightClick({ elem: item });
        await this.click({ elem: element(by.cssContainingText('.menu-item', 'Delete...')) });
        await this.click({ elem: $('.mstrDialogButtonBar input[name="ok"]') });
    }

    async uploadMstrFile(path) {
        const leftBar = new LeftToolbar();
        await leftBar.uploadMstrFile(path);
    }

    async waitForUploadComplete() {
        const uploadMstr = this.$('#uploadResultEditor');
        const confirmDialog = this.$('#ImportNameConflictDialog');
        await browser.waitUntil(async () => {
            let uploadPresent = await uploadMstr.isDisplayed();
            let needsActionPresent = await confirmDialog.isDisplayed();
            return uploadPresent || needsActionPresent;
        },
        {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            timeoutMsg: 'upload mstr file timeout',
        })

        // Click the replace confirm dialog
        if (await confirmDialog.isDisplayed()) {
            await confirmDialog.$('.mstrmojo-Editor-buttons td:first-child .mstrmojo-Button').click();
            await this.waitForElementVisible(uploadMstr);
        }

        const uploadOK = uploadMstr.$$('.mstrmojo-Button')[0];
        await uploadOK.click();
        await this.waitForCurtainDisappear();
    }

    async rePrompt() {
        await this.click({ elem: this.getRePromptButton() });
    }

    async closeDossier() {
        await this.click({ elem: this.getCloseButton() });
    }

    async launchInLibrary() {
        await this.click({ elem: this.getLaunchInLibraryButton() });
    }

    async waitForDossierCurtainDisappear() {
        const dossierCurtain = this.$('.mstrWaitBox');
        // await this.waitForElementAppear(dossierCurtain);
        return this.waitForElementInvisible(dossierCurtain);
    }

    // Assertion helper

    async isFileNotEmpty(name) {
        // Due to the limitations in IE11, we cannot download file
        // So always return true to skip the check.
        if (browser.isIE) {
            return true;
        }

        const fileSize = await getFileSize(name);
        return fileSize > 0;
    }

    async isShareLinkBarPresent() {
        try {
            await this.waitForElementVisible(this.getShareLinkBar());
            return true;
        } catch (e) {
            return false;
        }
    }
}
