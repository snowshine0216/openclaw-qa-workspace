import BaseComponent from '../base/BaseComponent.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';
import TitleBar from './TitleBar.js';
import DossierPage from '../dossier/DossierPage.js';
import { loadingDialog } from '../dossierEditor/components/LoadingDialog.js';

export default class PanelStack extends BaseComponent {
    constructor(locator = '.mstrmojo-DocPanelStack') {
        super(null, locator);
        this.dossierPage = new DossierPage();
    }

    create(name) {
        return new PanelStack(`div[nm="${name}"]`);
    }

    getTitle() {
        const locator = this.getElement().$('.mstrmojo-portlet-titlebar');
        return new TitleBar(this.brwsr, locator);
    }

    getPanelStack() {
        return this.getElement();
    }

    getPanelByKey(key) {
        return this.locator.$(`.mstrmojo-DocPanel[k="${key}"]`);
    }

    getPanelContentNodeByKey(key) {
        return this.getPanelByKey(key).$('.mstrmojo-DocSubPanel-content');
    }

    getContent() {
        return this.$('.mstrmojo-DocSubPanel-content');
    }

    getCloseIcon() {
        return this.$('.mstrmojo-portlet-slot-toolbar .mstrmojo-ToolBar-outercell');
    }

    getCloseBtn() {
        return this.$$('.mstrmojo-DocInfoWindow-close').filter((item) => item.isDisplayed())[0];
    }

    getPanelStackContextMenu() {
        return this.$('.mstrmojo-ui-Menu');
    }

    getPanelStackContextMenuItem(itemName) {
        return this.getPanelStackContextMenu().$(`//div[text()='${itemName}']`);
    }

    //action helper
    async closeInfoWindow() {
        return this.click({ elem: this.getCloseBtn() });
    }

    async hoverOnPanelstack() {
        return this.hover({ elem: this.getPanelStack() });
    }

    //assertion
    /**
     * Returns if the panel with specified key has scroll bar
     * @param {String} key panel key
     */
    async hasPanelScrollBar(key) {
        const node = this.getPanelContentNodeByKey(key);
        const scrollHeight = await getAttributeValue(node, 'scrollHeight');
        const offsetHeight = await getAttributeValue(node, 'offsetHeight');
        // Wait for panel stack to compute if show scroll bar
        await this.sleep(2000);
        const overflow = (await node.getCSSProperty('overflow')).value;
        return scrollHeight > offsetHeight && overflow === 'auto';
    }

    async isPanelPresent() {
        return this.locator.isDisplayed();
    }

    async close() {
        await this.click({ elem: this.getCloseIcon() });
    }

    async clickPanelStackContextMenuItem(panelName, itemName) {
        await this.dossierPage.clickDossierPanelStackSwitchTab(panelName);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.rightClick({ elem: this.dossierPage.getDossierPanelStackSwitchTabbyName(panelName) });
        const item = await this.getPanelStackContextMenuItem(itemName);
        await item.waitForClickable();
        await this.hover({ elem: item });
        await item.click();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
}
