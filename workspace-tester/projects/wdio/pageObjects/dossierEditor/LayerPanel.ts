import BasePage from '../base/BasePage.js';
import { Key } from 'webdriverio';
import LoadingDialog from './components/LoadingDialog.js';
import BaseContainer from '../authoring/BaseContainer.js';
import { getKey } from '../../utils/KeyboardUtils.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class LayersPanel extends BasePage {
    loadingDialog: LoadingDialog;
    baseContainer: BaseContainer;
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.baseContainer = new BaseContainer();
    }

    get LayersPanel() {
        return this.$('.mstrmojo-layersPanel');
    }

    get LayersPanelContent() {
        return this.$('.mstrmojo-layersPanel-content.mstrmojo-scrollNode');
    }

    // --------------------- To be updated ------------------------------
    get LayersPanelMask() {
        return this.$('.mstrmojo-layersPanel .mstrmojo-VIDND-mask.masked');
    }

    get ContainerCountOnLayersPanel() {
        return this.LayersPanel.$$('.ant-tree-title').length;
    }

    get DisabledContainerCountOnLayersPanel() {
        return this.LayersPanel.$$('.ant-tree-treenode-disabled').length;
    }

    // container or group
    getLayersPanel() {
        return this.$('.mstrmojo-layersPanel');
    }

    getContainerFromLayersPanel(containerName) {
        return this.LayersPanel.$$(`.//span[text()='${containerName}']`)[0];
    }

    getDisabledContainerFromLayersPanel(containerName) {
        return this.LayersPanel.$(
            `.//div[contains(@class, 'ant-tree-treenode-disabled')]//span[text()='${containerName}']`
        );
    }

    getContainerDraggableFromLayersPanel(containerName) {
        return this.getContainerFromLayersPanel(containerName).$(
            `./ancestor:: div[contains(@class,'ant-tree-treenode-draggable')]`
        );
    }

    getBoxInsidePSOfPanel(box, panel, ps) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-layersPanel-content mstrmojo-scrollNode')]//div[@id='antd']//span[text()='${ps}']/parent::div/../parent::span/../../following-sibling::div[contains(@class,'ant-tree-treenode')]//span[text()='${panel}']/parent::div/../parent::span/../../following-sibling::div[contains(@class,'ant-tree-treenode')]//span[text()='${box}']`
        );
    }

    getSelectedContainerFromLayersPanel(containerName) {
        if (containerName) {
            return this.LayersPanel.$(
                `.//div[contains(@class,'ant-tree-treenode-selected')]//span[text()='${containerName}']`
            );
        } else {
            return this.LayersPanel.$('.ant-tree-treenode-selected');
        }
    }

    getInputForContainerFromLayersPanel(containerName) {
        return this.LayersPanel.$(`.//input[@placeholder='${containerName}']`);
    }

    get ContextMenuFromLayersPanel() {
        return this.LayersPanel.$('.pcl-ui-Menu-item-container');
    }

    getContextMenuOptionFromLayersPanel(cmOption) {
        return this.ContextMenuFromLayersPanel.$(`.//span[text()='${cmOption}']`);
    }

    // check whether the element class name contains 'disabled'
    getContextMenuOptionStatus(cmOption) {
        return this.getContextMenuOptionFromLayersPanel(cmOption).$(`./ancestor::a`);
    }

    getExpandedGroupIcon(groupName) {
        return this.getContainerFromLayersPanel(groupName).$(
            `./ancestor::div[contains(@class,'ant-tree-treenode-switcher-open')]//span[contains(@class,'ant-tree-switcher_open')]`
        );
    }

    getCollapsedGroupIcon(groupName) {
        return this.getContainerFromLayersPanel(groupName).$(
            `./ancestor::div[contains(@class,'ant-tree-treenode-switcher-close')]//span[contains(@class,'ant-tree-switcher_close')]`
        );
    }

    // --------------- To be Updated -----------------------------------
    getContainerInGroup(groupName, containerName) {
        return this.getContainerFromLayersPanel(groupName).$(
            `./ancestor::li[contains(@class,'ant-tree-treenode-switcher-open')]//span[text()='${containerName}']`
        );
    }

    // --------------- To be Updated -----------------------------------
    getContainersInGroup(groupName) {
        return this.LayersPanel.$$(
            `.//span[text()='${groupName}']/ancestor::li[contains(@class,'ant-tree-treenode-switcher-open')]//span[@class='ant-tree-title']`
        );
    }

    getHiddenIcon(containerName) {
        return this.getContainerFromLayersPanel(containerName).$(
            `./ancestor::span[@class='ant-tree-title']//div[contains(@class,'hidden-icon')]`
        );
    }

    // click to show layers panel
    async clickOnLayersPanel() {
        const el = await this.LayersPanelContent;
        await this.clickOnElement(el);
    }

    // click to dismiss the context menu
    async clickonLayersPanelContent() {
        const el = await this.LayersPanelContent;
        await this.clickOnElement(el);
    }

    // click/select a container/group from layers panel
    async clickOnContainerFromLayersPanel(containerName) {
        const el = await this.getContainerFromLayersPanel(containerName);
        await scrollIntoView(el);
        await this.click({ elem: el });
    }

    // rename container/group from layers panel by double click
    async renameContainerFromLayersPanel(containerName, newName) {
        const el = await this.getContainerFromLayersPanel(containerName);
        await this.scrollIntoView(el);
        await this.doubleClick({ elem: el });
        const inputBox = await this.getInputForContainerFromLayersPanel(containerName);
        await inputBox.waitForExist();

        await browser.keys([Key.Backspace]);
        await inputBox.addValue(newName);
        await browser.keys([Key.Enter]);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // Press backspace when renaming layer's name
    async renameContainerUsingDeleteKeyFromLayersPanel(containerName, newName) {
        const el = await this.getContainerFromLayersPanel(containerName);
        await this.scrollIntoView(el);
        await this.doubleClickOnElement(el);
        const inputBox = await this.getInputForContainerFromLayersPanel(containerName);
        await browser.keys([Key.Backspace]);
        await inputBox.addValue(newName);
        await browser.keys([Key.Backspace]);
        await browser.keys([Key.Enter]);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async doubleClickOnElement(el) {
        await this.doubleClick({ elem: el });
    }

    // right click on a contianer/group from layers panel
    async rightClickOnContainerFromLayersPanel(containerName, isScrollIntoView = true) {
        const el = this.getContainerFromLayersPanel(containerName);
        if (isScrollIntoView) {
            await scrollIntoView(el);
        }
        await this.rightMouseClickOnElement(el);
    }

    // select 'cmOption' from the context menu
    async contextMenuActionFromLayersPanel(cmOption) {
        const cm = await this.ContextMenuFromLayersPanel;
        await cm.waitForExist();
        const el = await this.getContextMenuOptionFromLayersPanel(cmOption);
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async duplicateContainerFromLayersPanel(containerName) {
        await this.rightClickOnContainerFromLayersPanel(containerName);
        await this.contextMenuActionFromLayersPanel('Duplicate');
    }

    async deleteContainerFromLayersPanel(containerName) {
        await this.rightClickOnContainerFromLayersPanel(containerName);
        await this.contextMenuActionFromLayersPanel('Delete');
    }

    // ctrl/cmd select containers
    async multiSelectContainers(containerNames) {
        const containerArray = containerNames.split(',');
        for (let i = 0; i < containerArray.length; i++) {
            const pos = await this.baseContainer.calculateContainerRect(containerArray[i].trim());
            await browser.execute(
                'window.localStorage.setItem(arguments[0], arguments[1]);',
                containerArray[i].trim(),
                JSON.stringify(pos)
            );
            containerArray[i] = this.getContainerFromLayersPanel(containerArray[i].trim());
        }
        await this.baseContainer.multiSelectElementsUsingCommandOrControl(containerArray);
    }

    // press ctrl/cmd and then click on one container, this could be used to de-select
    async multiSelectContainer(containerName) {
        const container = await this.getContainerFromLayersPanel(containerName);
        if (!container) {
            throw new Error(`Container ${containerName} not found`);
        }
        const key = getKey('control');
        await browser.performActions([{ type: 'key', id: 'keyboard', actions: [{ type: 'keyDown', value: key }] }]);
        await container.click();
        await browser.performActions([{ type: 'key', id: 'keyboard', actions: [{ type: 'keyUp', value: key }] }]);
    }

    // ctrl/cmd select containers and Group
    async groupContainers(containerNames) {
        const containerArray = containerNames.split(',');
        containerArray[0] = await this.getContainerFromLayersPanel(containerArray[0].trim());
        await this.clickOnElement(containerArray[0]);

        for (let i = 1; i < containerArray.length; i++) {
            containerArray[i] = await this.getContainerFromLayersPanel(containerArray[i].trim());
            await this.ctrlClick({ elem: containerArray[i], checkClickable: false });
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();     
        }
        await this.rightMouseClickOnElement(containerArray[0]);
        const cm = await this.ContextMenuFromLayersPanel;
        await cm.waitForExist();
        const el = await this.getContextMenuOptionFromLayersPanel('Group');
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

    }

    multiSelectElementsUsingCommandOrControl(containerArray) {
        throw new Error('Method not implemented.');
    }

    // expand or collapse a group
    async expandORCollapseGroup(groupName, actionName) {
        let el;
        switch (actionName) {
            case 'Expand':
                el = this.getCollapsedGroupIcon(groupName);
                break;
            case 'Collapse':
                el = this.getExpandedGroupIcon(groupName);
                break;
            default:
                throw `Invalid parameter`;
        }
        await this.waitForElementExsiting(el);
        await this.clickOnElement(el);
        await this.sleep(1);
    }

    // store container position in window.localstorage.
    // This is mainly for keyboard move
    async storeContainerRectForGroup(groupName) {
        const el = await this.getExpandedGroupIcon(groupName);
        const status = await el.isDisplayed();
        if (status) {
            // getContainerInGroup may not work since 11.3.4 due to the introduction of layers panel tree structure
            // new step is added into keyboardControl
            const arr = await this.getContainersInGroup(groupName);
            // let b = await arr.getText();
            for (let i = 0; i < arr.length; i++) {
                const contName = await arr[i].getText();
                const pos = await this.baseContainer.calculateContainerRect(contName);
                await browser.execute(
                    (name, position) => {
                        window.localStorage.setItem(name, position);
                    },
                    contName,
                    JSON.stringify(pos)
                );
            }
        }
    }

    // // drag source container/group and drop it above/below target container/group
    // async dragAndDropOnLayersPanel(source, target, position){
    //     let src = this.getContainerDraggableFromLayersPanel(source);
    //     await browser.wait(EC.presenceOf(src));
    //     let tar = this.getContainerDraggableFromLayersPanel(target);
    //     await browser.wait(EC.presenceOf(tar));
    //     let temp;
    //     switch(position){
    //         case "above": temp = -10; break;
    //         case "below": temp = 10; break;
    //         default:
    //             temp = 0;
    //     }
    //     try {
    //         await browser.executeScript(dragAndDrop, src, tar);
    //     } catch (err) {
    //         console.log(err.message);
    //     }
    // }

    async dragNdropToMoveBox(srcBox, desPanel) {
        const src = await this.getContainerDraggableFromLayersPanel(srcBox);
        const tar = await this.getContainerDraggableFromLayersPanel(desPanel);

        await src.waitForDisplayed();
        await tar.waitForDisplayed();

        await src.click();
        await browser.pause(500);

        // Perform drag-and-drop using actions
        await browser.performActions([
            {
                type: 'pointer',
                id: 'mouse',
                parameters: { pointerType: 'mouse' },
                actions: [
                    { type: 'pointerMove', origin: src, x: 0, y: 0 }, // Move to source
                    { type: 'pointerDown', button: 0 }, // Press and hold
                    { type: 'pause', duration: 300 }, // Pause for a moment
                    { type: 'pointerMove', origin: tar, x: 0, y: 0 }, // Move to target
                    { type: 'pointerUp', button: 0 }, // Release mouse
                ],
            },
        ]);
        await browser.pause(2000);
    }

    async shiftToRangeSelection(containerName1, containerName2) {
        const startElement = await this.getContainerFromLayersPanel(containerName1);
        const endElement = await this.getContainerFromLayersPanel(containerName2);
        if (!startElement) {
            throw new Error(`Start element with name ${containerName1} not found`);
        }
        if (!endElement) {
            throw new Error(`End element with name ${containerName2} not found`);
        }

        // click on first container on layers panel
        await startElement.click();
        await browser.pause(500);
        // press Shift key and hold on
        await browser.performActions([
            {
                type: 'key',
                id: 'keyboard',
                actions: [{ type: 'keyDown', value: '\uE008' }], // Press Shift
            },
        ]);

        await browser.pause(500);
        // click on second container on layers panel
        await endElement.click();
        // release the shift key
        await browser.performActions([
            {
                type: 'key',
                id: 'keyboard',
                actions: [{ type: 'keyUp', value: '\uE008' }], // Release Shift
            },
        ]);
    }

    async getContextMenuOptionsList() {
        const contextMenu = this.ContextMenuFromLayersPanel;
        await contextMenu.waitForExist();
        const menuItems = await contextMenu.$$('.//span[parent::*[contains(@class, "pcl-ui-Menu-item")]]');
        const optionTexts = [];
        for (const item of menuItems) {
            if (await item.isDisplayed()) {
                const text = await item.getText();
                if (text.trim()) {
                    optionTexts.push(text.trim());
                }
            }
        }
        return optionTexts;
    }
}

export const layersPanel = new LayersPanel();
