import BaseComponent from '../base/BaseComponent.js';
import { fixChromeDownloadDirectory } from '../../config/folderManagement.js';


export default class DossierMenu extends BaseComponent {
    constructor() {
        super(null, '.mstrmojo-RootView-menubar', 'Dossier Menu component');
    }

    getDownloadButton() {
        return this.locator.$('.download');
    }

    getFileMenuButton() {
        return this.locator.$('.item.mb.file');
    }

    getMenuBar(name) {

        return this.locator.$$('.item.mb').filter( async (item) => (await item.getText()).toLowerCase().includes(name.toLowerCase()))[0];
    }

    getMenuDropDown() {
        return this.$('.mstrmojo-ui-Menu-item-container');
    }
    getMenuItem(name) {
        return this.$$(`.mstrmojo-ui-Menu-item`).filter(async item => (await item.getText()).includes(name))[0];
    }

    getConfirmSaveDialog() {
        return this.$('.mstrmojo-ConfirmSave-Editor');
    }

    getCancelSaveButton(name) {
        return this.$$(`.mstrmojo-ConfirmSave-Editor .mstrmojo-WebButton`).filter(async item => (await item.getText()).includes(name))[0];
    }

    async openFile() {
        const fileMenu = this.getFileMenuButton();
        await this.click({ elem: fileMenu });
        await this.waitForElementVisible(this.getMenuDropDown());
    }

    async downLoadDossier() {
        const downloadButton = this.getDownloadButton();
        await this.click({ elem: downloadButton });

        await fixChromeDownloadDirectory();
    }

    async openMenu(tab, menuPaths) {
        // add sleep here to wait for view cache loaded when back from switch window
        await this.click({ elem: this.getMenuBar(tab) });
        const flag = await this.getMenuDropDown().isDisplayed();
        if (flag === false) {
            // need to click menu bar twice for same cases in dossier page due to issues
            await this.click({ elem: this.getMenuBar(tab) }); 
        }
        for (const menuItem of menuPaths) {
            try {
                const el = this.getMenuItem(menuItem);
                await this.click({ elem: el });
            } catch (e) {
                throw new Error(e);
            }
        }
    }

    async isMenuItemPresent(item) {
        return this.getMenuItem(item).isDisplayed();
    }

    async closeDossier() {
        await this.openFile();
        await this.click({ elem: this.getMenuItem('Close') });
        await this.waitForElementInvisible(this.getMenuDropDown());
        const flag = await this.getConfirmSaveDialog().isDisplayed();
        if (flag) {
            console.log('cancel to save changes when close dossier');
            await this.click({ elem: this.getCancelSaveButton("Don't Save") });
        }

    }
}
