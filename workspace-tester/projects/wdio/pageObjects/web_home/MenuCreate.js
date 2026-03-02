import BaseComponent from '../base/BaseComponent.js';
import { getFileSize, fullPath } from '../../config/folderManagement.js';

export default class MenuCreate extends BaseComponent {
    constructor() {
        super(null, '#mscld-create', 'Create Menu component');
    }
    getMenuCreate() {
        return this.$('#mscld-create');
    }

    getMenuPanel() {
        return this.$('#mscld-create-menuList');
    }

    getUploadButton() {
        return this.$('#myFile');
    }


    getMenuItem(item) {
        return this.getMenuPanel().$$('.mstrmojo-ui-Menu-item').filter(async (el) => {
            const itemText = await el.getText();
            return itemText.includes(item);
        })[0];
    }

    getUploadResultEditor() {
        return this.$('#uploadResultEditor');
    }

    getConfirmDialog() {
        return this.$('.mstrmojo-Editor.mstrmojo-alert.modal');
    }

    getYesButtonInConfirmDialog() {
        return this.getConfirmDialog()
            .$$('.mstrmojo-Button-text ')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === 'Yes';
            })[0];
    }

    getOkButtonInConfirmDialog() {
        return this.getUploadResultEditor()
            .$$('.mstrmojo-Button-text ')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === 'OK';
            })[0];
    }


    findMenuItem(menuItem) {
        return this.$$(`.mstrmojo-ui-Menu-item`).filter(async (el) => (await el.getText()).includes(menuItem))[0];
    }


    async openMenuPanel() {
        await this.click({ elem: this.getMenuCreate() });
        await this.waitForElementVisible(this.getMenuPanel());
    }

    async openMenu(menuPaths) {
        await this.openMenuPanel();
        for (const menuItem of menuPaths) {
            try {
                const el = this.findMenuItem(menuItem);
                await this.click({ elem: el });
            } catch (e) {
                throw new Error(e);
            }
        }
    }

    async isFileNotEmpty(name) {
        const fileSize = await getFileSize(name);
        return fileSize > 0;
    }


    async closeMenuPanel() {
        const offset = { x: 100, y: 0 };
        await this.clickWithOffset({ elem: this.getMenuCreate(), offset });
        await this.waitForElementInvisible(this.getMenuPanel());
    }

    async uploadMstrFile(path) {
        await this.sleep(1000);
        await this.openMenuPanel();
        await this.sleep(1000);
        const upload = this.getUploadButton();
        // upload input is not displayed
        await this.executeScript("arguments[0].setAttribute('style', 'visibility:visible')", await upload);
        await upload.addValue(fullPath(path));
    }

    
    async waitForUploadComplete() {
        await browser.waitUntil(
            async () => {
                const isUploadMstrDisplayed = await this.getUploadResultEditor().isDisplayed();
                const isConfirmDialogDisplayed = await this.getConfirmDialog().isDisplayed();
                return isUploadMstrDisplayed || isConfirmDialogDisplayed;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT || 5000,
                timeoutMsg: 'Upload mstr file timeout',
            }
        );

        // Click the replace confirm dialog
        if (await (await this.getConfirmDialog()).isDisplayed()) {
            await this.click({ elem: this.getYesButtonInConfirmDialog() });
            await this.waitForElementVisible(this.getUploadResultEditor());
        }
        await this.click({ elem: this.getOkButtonInConfirmDialog() });
        await this.waitForCurtainDisappear();
    }

    async isMenuItemDisplay(item) {
        return this.getMenuItem(item).isDisplayed();
    }
}
