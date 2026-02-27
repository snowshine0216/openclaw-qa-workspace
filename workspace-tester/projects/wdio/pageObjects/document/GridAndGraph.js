import BaseComponent from '../base/BaseComponent.js';
import RsdGrid from './RsdGrid.js';

/**
 * This element is for GridAndGraph widget
 * 1. All manipulations for quick switch is handled here
 * 2. All grid manipulation is handled in this.grid
 * 3. All grah manipulation is handled here
 *
 * How to use this component?
 * Use createByName(*) to create a instance and then call functions
 */
export default class GridAndGraph extends BaseComponent {
    constructor(locator) {
        super(null, locator, 'Create GridAndGraph');
        this.grid = new RsdGrid(null, '.mstrmojo-Xtab');
        this.grid.setContainer(this.getElement());
    }

    static createByName(name) {
        return new GridAndGraph(`.mstrmojo-portlet[nm="${name}"]`);
    }

    static createByNameHasBorder(name) {
        return new GridAndGraph(`.mstrmojo-portlet.has-border[nm="${name}"]`);
    }

    /**
     * Return the component of quick witch
     * including: Quick switch icon ; Quick switch arrow for menu
     * @returns {ElementFinder} The element locator
     */
    getQuickSwitchToolbar() {
        return this.$('.mstrmojo-portlet-titlebar.floating.visible');
    }

    getTitleBar() {
        return this.$$('.mstrmojo-portlet-titlebar')[0];
    }

    getGraph() {
        return this.getElement().$$('.mstrmojo-DocXtabGraph')[0];
    }

    getGridGraph() {
        return this.getElement().$$('.mstrmojo-DocGridGraph-container')[0];
    }

    /**
     * Use this fucntion to click grid/graph icon in quick switch toolbar to switch the mode
     * @param {String} modeName mode name
     * @param {boolean} fromFixedTitleBar true if from fixed titlebar, false if from floating visible titlebar
     */
    async switchMode(modeName, fromFixedTitleBar) {
        let titleBar;
        if (fromFixedTitleBar) {
            titleBar = this.getTitleBar();
        } else {
            titleBar = this.getQuickSwitchToolbar();
        }
        const button = titleBar.$(`.mstrmojo-Button.mstrmojo-oivmSprite[title="${modeName}"]`);
        const buttonStatus = await button.isDisplayed();
        if (buttonStatus) {
            await this.click({ elem: button });
        }
        await this.waitForCurtainDisappear();
    }

    async titleBarHasQuickSwitch() {
        const titleBar = this.getTitleBar();
        const buttons = await titleBar.$$('.mstrmojo-Button.mstrmojo-oivmSprite[title="View: Grid"]');
        return buttons.length > 0;
    }

    /**
     * @param {boolean} fromFixedTitleBar true if from fixed titlebar, false if from floating visible titlebar
     */
    async switchModeToGrid(fromFixedTitleBar) {
        return this.switchMode('View: Grid', fromFixedTitleBar);
    }

    /**
     * @param {boolean} fromFixedTitleBar true if from fixed titlebar, false if from floating visible titlebar
     */
    async switchModeToGraph(fromFixedTitleBar) {
        return this.switchMode('View: Graph', fromFixedTitleBar);
    }

    /**
     * Hover to the widget to show the quick switch toolbar
     */
    async showQuickSwitch() {
        await this.moveToElement(this.getGridGraph(), { x: 10, y: 10 });
        await this.waitForElementVisible(this.getQuickSwitchToolbar());
    }

    /**
     * 1. Open quick switch menu list
     * 2. Click menuItem in the list
     * @param {String} menuItem menu item in the list
     * @param {boolean} fromFixedTitleBar true if from fixed titlebar, false if from floating visible titlebar
     */
    async openQuickSwitchMenu(menuItem, fromFixedTitleBar) {
        let titleBar;
        if (fromFixedTitleBar) {
            titleBar = this.getTitleBar();
        } else {
            titleBar = this.getQuickSwitchToolbar();
        }
        // Open menu list
        await this.click({ elem: titleBar.$('.mstrmojo-Button.mstrmojo-oivmSprite.tbDown') });
        // Click menuItem in the list
        const contextMenu = this.$$('.mstrmojo-ContextMenu').filter((menu) => menu.isDisplayed())[0];
        const item = contextMenu.$$('.mstrmojo-CMI-text').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === menuItem;
        })[0];
        await this.click({ elem: item });
    }
}
