import { $ } from '@wdio/globals';

import { DossierInfo, UnitInfo, UnitType } from './utils/model.js';

import LibraryPage from './library.page.js';
import ConditionalFormatEditor from './conditionalFormat.editor.js';
import BasePage from '../../base/BasePage.js';

const OPEN_DODOSSIER_TIMEOUT = 5 * 60 * 1000;

class LibraryAuthoringPage extends BasePage {
    public get libraryIcon() {
        return this.$('.library.btn.item');
    }

    public async getUnit(unitInfo: UnitInfo) {
        const { type, nodeKey } = unitInfo;

        switch (type) {
            case UnitType.TEXT:
                return this.$(`.mstrmojo-DocTextfield[id*="${nodeKey}"]`);
            case UnitType.RICHTEXT:
                return this.$(`.mstrmojo-DocQuillTextfield[id*="${nodeKey}"]`);
            case UnitType.HTML:
                return this.$(`.mstrmojo-DocTextfield[id*="${nodeKey}"]`);
            case UnitType.IMAGE:
                return this.$(`.mstrmojo-DocImage[id*="${nodeKey}"]`);
            case UnitType.SHAPE:
                return this.$(`.mstrmojo-DocShape[id*="${nodeKey}"]`);
            default:
                break;
        }
    }

    public async openContextMenu(unitInfo: UnitInfo) {
        let unit = await this.getUnit(unitInfo);

        if (!unit) {
            return;
        }

        await unit.click({ button: 'right' });
    }

    // Open context menu in layer panel by right click on element name
    public async openContextMenuInLayerPanel(elementName: string) {
        let element = this.$(`span[aria-label = '${elementName}']`);
        await element.click({ button: 'right' });
    }

    public async openContextMenuByThreeDots(element: string) {
        const conditionalFormatElement = await this.getConditionalFormatElement(element);
        await conditionalFormatElement.click();
        const threeDots = conditionalFormatElement.$('.hover-btn.hover-menu-btn');
        await threeDots.click();
    }

    public async getConditionalFormatElement(element: string) {
        return this.$(`[aria-label = '${element}']`);
    }


    public async getContextMenu() {
        return this.$('.mstrmojo-ui-Menu.mstrmojo-unit-container-menu');
    }

    public async getConditionalDisplayWarningIcon() {
        return this.$('.warning-item');
    }

    public async getContextMenuInLayerPanel() {
        return this.$('.pcl-ui-Menu-item-container ');
    }

    public async getContextMenuInThreeDots() {
        return this.$('.mstrmojo-ListBase.mstrmojo-ui-Menu.mnu--vi-container');
    }
    /**
     * Start: Conditional Format
     */
    public async getConditionalDisplayMenuItem(menuElement: any) {
        const menus = await menuElement.$$('.mtxt');

        for (const menu of menus) {
            if (await menu.getText() === 'Conditional Display...') {
                return menu;
            }
        }
    }

    public async getLayersPanel() {
        return this.$('.mstrmojo-layersPanel-content');
    }

    public async getLayersPanelElement(elementName: string) {
        return this.$(`span[aria-label = '${elementName}']`);
    }

    public async clickConditionalDisplayMenuItem(menuElement: any) {
        const cfMenuItem = await this.getConditionalDisplayMenuItem(menuElement);

        if (cfMenuItem) {
            await cfMenuItem.click();
        }
    }

    public async clickConditionalDisplayMenuItemInLayerPanel(elementName: string) {
        let element = this.$(`[aria-label = '${elementName}']`);
        await element.click();
    }

    public async getConditionalFormatEditor() {
        const editorElement = await this.$('#mstrmojo-conditional-format-editor').$('.cf-editor');
        return new ConditionalFormatEditor(editorElement);
    }

    public async getLayersPanelTree() {
        return this.$('.mstrmojo-layersPanel .ant-tree-list');
    }

    public async saveDossier() {
        const saveButton = await this.$('.item.mb.save-dropdown .btn');
        await saveButton.click();
        const saveButtonDropdown = await this.$('.item.save1.mstrmojo-ui-Menu-item');
        await saveButtonDropdown.click();
        await this.$('.mstrWaitBox').waitForDisplayed();
        await this.$('.mstrWaitBox').waitForDisplayed({
            reverse: true,
            timeout: 60 * 1000,
            timeoutMsg: 'timeout on saving dashboard',
        });
    }

    public async clickHideOnExcelExportItem() {
        const elem = await this.$('span[aria-label="Hide on Excel Export"]');
        await elem.click();
    }

    public async clickShowOnExcelExportItem() {
        const elem = await this.$('span[aria-label="Show on Excel Export"]');
        await elem.click();
    }

    public async reactCtrlClick(...elements: any[]) {
        await browser.performActions([{
            type: 'key',
            id: 'keyboard',
            actions: [{ type: 'keyDown', value: '\uE009' }]
        }]);

        for (const el of elements) {
            await el.click();
            await browser.pause(100);
        }

        await browser.performActions([{
            type: 'key',
            id: 'keyboard',
            actions: [{ type: 'keyUp', value: '\uE009' }]
        }]);

        await browser.releaseActions();

    }


    public async reactCtrlRightClick(...elements: (string | WebdriverIO.Element | Promise<WebdriverIO.Element>)[]) {
        const resolved: WebdriverIO.Element[] = [];

        for (const el of elements.flat()) {
            if (typeof el === 'string') {
                resolved.push(await $(el));
            } else {
                resolved.push(await el);
            }
        }

        if (!resolved.length) {
            throw new Error('No elements provided');
        }

        await browser.performActions([{
            type: 'key',
            id: 'keyboard',
            actions: [{ type: 'keyDown', value: '\uE009' }]
        }]);

        for (const el of resolved) {
            await el.click();
            await browser.pause(100);
        }

        await browser.performActions([{
            type: 'key',
            id: 'keyboard',
            actions: [{ type: 'keyUp', value: '\uE009' }]
        }]);

        await browser.releaseActions();

        const lastEl = resolved[resolved.length - 1];
        const location = await lastEl.getLocation();
        const size = await lastEl.getSize();
        const centerX = Math.floor(location.x + size.width / 2);
        const centerY = Math.floor(location.y + size.height / 2);

        await browser.performActions([{
            type: 'pointer',
            id: 'mouse',
            parameters: { pointerType: 'mouse' },
            actions: [
                { type: 'pointerMove', duration: 0, origin: 'viewport', x: centerX, y: centerY },
                { type: 'pointerDown', button: 2 },
                { type: 'pointerUp', button: 2 }
            ]
        }]);

        await browser.releaseActions();
    }

}

export default new LibraryAuthoringPage();