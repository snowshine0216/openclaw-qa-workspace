'use strict';

import BasePage from '../../base/BasePage.js';
import LoadingDialog from '../../dossierEditor/components/LoadingDialog.js';
import Common from '../Common.js';
export default class NgmVisualizationPanel extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
    }

    //ELEMENT LOCATORS

    /** @type {Promise<ElementFinder>} */
    get xpath4NGMElementBar() {
        return "//*[@class='cartesianlayer']//*[contains(@class,'subplot')]//*[contains(@class,'trace bars')]//*[local-name()='path']";
    }

    /** @type {Promise<ElementFinder>} */
    get xpath4NGMElementWaterfall() {
        return "//*[@class='cartesianlayer']//*[contains(@class,'subplot')]//*[contains(@class,'trace bars')][2]//*[local-name()='path']";
    }

    /** @type {Promise<ElementFinder>} */
    get xpath4NGMElementBoxPlot() {
        return "//*[@class='cartesianlayer']//*[contains(@class,'subplot')]//*[contains(@class,'trace boxes')]";
    }

    /** @type {Promise<ElementFinder>} */
    get xpath4NGMElementLineArea() {
        return "//*[@class='cartesianlayer']//*[contains(@class,'subplot')]//*[@class = 'points']//*[local-name()='path']";
    }

    /** @type {Promise<ElementFinder>} */
    get xpath4NGMElementScatter() {
        return "//*[@class='cartesianlayer']//*[contains(@class,'subplot')]//*[local-name()='g' and contains(@class,'trace scatter')]";
    }

    /** @type {Promise<ElementFinder>} */
    get NGMTooltip() {
        return this.$(
            "//div[@class='ngm-tooltip' and contains(@style,'visible')]//div[contains(@class,'ngm-vis-tooltip-container')]/table[contains(@class,'ngm-vis-tooltip-table')]"
        );
    }

    xpath4EditorMenuItem(menuItem) {
        // menuItem = menuItem.replace(" ", "\u00a0");
        const xpath =
            "//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]/a[contains(@class, 'mstrmojo-ui-Menu-item')]/div[text()='$menu']";
        return xpath.replace('$menu', menuItem);
    }

    xpath4EditorReplaceWith(itemName) {
        // Update xpath due to 10.9 change
        const xpath = "//div[contains(@class,'mstrmojo-ui-MenuPopup replaceReference')]//span[text()='$itemName']";
        return xpath.replace('$itemName', itemName);
    }

    // Return the xpath for current panel (for dashboard which has several panels)
    async getCurrentPanel() {
        const elementPanel = await this.$("//div[@class='mstrmojo-VIVizPanel-content']/div[contains(@style,'block')]");
        await elementPanel.waitForExist();
        const idString = await elementPanel.getAttribute('id');
        const xpath4CurrentPanel = `//div[@id= '${idString}']`;
        console.log('xpath4CurrentPanel:', xpath4CurrentPanel);
        return xpath4CurrentPanel;
    }

    // get element xpath by chartType and index
    // Designed for single cell. If there are multiple cells, it would get the data point with the index in the left bottom corner.
    /**
     * @param {string} chartType
     */
    async getELementPath(chartType) {
        let elementPath = null;
        switch (chartType) {
            case 'bar':
            case 'histogram':
                elementPath = (await this.getCurrentPanel()) + this.xpath4NGMElementBar;
                break;
            case 'waterfall':
                elementPath = (await this.getCurrentPanel()) + this.xpath4NGMElementWaterfall;
                break;
            case 'boxplot':
                elementPath = (await this.getCurrentPanel()) + this.xpath4NGMElementBoxPlot;
                break;
            case 'line':
            case 'area':
            case 'bubblegrid':
                elementPath = (await this.getCurrentPanel()) + this.xpath4NGMElementLineArea;
                break;
            case 'scatter':
                elementPath = (await this.getCurrentPanel()) + this.xpath4NGMElementScatter;
                break;
        }
        return elementPath;
    }

    /**
     * @param {int} index
     * @param {string} chartType
     */
    async getElementPathByIndex(index, chartType) {
        let elementPath = null;
        if (chartType === 'scatter') {
            elementPath = `${await this.getELementPath(chartType)}[${index}]//*[local-name()='path']`;
            return elementPath;
        } else {
            elementPath = `${await this.getELementPath(chartType)}[${index}]`;
            return elementPath;
        }
    }

    //	------------------------------------------- Tooltip -----------------------------------------------------------
    // Hover selected element and get tooltip
    /**
     * @param {int} index
     * @param {string} chartType
     */
    async getELementTooltip(index, chartType) {
        const vizPath = await this.getElementPathByIndex(index, chartType);
        console.log('vizPath:', vizPath);
        const vizElement = await this.$(vizPath);
        console.log('vizElement:');
        await this.hoverMouseOnElement(vizElement);
        console.log('hover done');
        const tooltipElement = this.NGMTooltip;
        await tooltipElement.waitForExist();
        return tooltipElement;
    }

    //----------------------------------- Selection --------------------------------------------------
    // Single select data points by LMC
    /**
     * @param {int} index
     * @param {string} chartType
     */
    async selectElement(chartType, index) {
        const xpath = await this.getElementPathByIndex(index, chartType);
        console.log('ele xpath: ', xpath);
        const ele = await this.$(xpath);
        await ele.waitForClickable();
        // await this.hoverMouseAndClickOnElement(ele);
        await this.moveAndClickByOffsetFromElement(ele, 0, 0);
        console.log('click element done.');
    }

    // Ctrl select one data point
    async ctrlSelectElement(chartType, index) {
        await browser.performActions([
            {
                type: 'key',
                id: 'keyboard',
                actions: [{ type: 'keyDown', value: 'Control' }],
            },
        ]);
        await this.selectElement(chartType, index);
        await browser.performActions([
            {
                type: 'key',
                id: 'keyboard',
                actions: [{ type: 'keyUp', value: 'Control' }],
            },
        ]);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // Multi select data points
    async multiSelectElementsUsingCmndOrCtrl(indexArray, chartType) {
        const xpathArray = [];
        for (const index of indexArray) {
            const xpath = await this.getElementPathByIndex(index, chartType);
            console.log('ele xpath: ', xpath);
            xpathArray.push(xpath);
        }
        await this.multiSelectElementsUsingCommandOrControlNGM(xpathArray);
    }

    /**
     * Copied from BasePage.js for Boxplot specific
     * Method to multiselect elements using command (mac) or control(windows)
     * @param {Array of <WebElement>} elements array of webelements to multiselect
     */
    async multiSelectElementsUsingCommandOrControlNGM(xpaths) {
        let elements = [];
        for (let i = 0; i < xpaths.length; i++) {
            elements[i] = await this.$(xpaths[i]);
        }
        switch (browser.capabilities.browserName) {
            case 'chrome':
            case 'MicrosoftEdge':
            case 'Safari':
                if (process.platform.includes('darwin')) {
                    await browser.performActions([
                        {
                            type: 'key',
                            id: 'keyboard',
                            actions: [{ type: 'keyDown', value: 'Meta' }],
                        },
                    ]);
                    for (let i = 0; i < elements.length; i++) {
                        await this.clickOnElement(elements[i]);
                    }
                    await browser.performActions([
                        {
                            type: 'key',
                            id: 'keyboard',
                            actions: [{ type: 'keyUp', value: 'Meta' }],
                        },
                    ]);
                } else if (process.platform.includes('win32')) {
                    await browser.performActions([
                        {
                            type: 'key',
                            id: 'keyboard',
                            actions: [{ type: 'keyDown', value: 'Control' }],
                        },
                    ]);
                    console.log('key down');
                    for (let i = 0; i < elements.length; i++) {
                        await elements[i].moveTo();
                        await browser.pause(3 * 1000); // wait until the previous tooltip disappear
                        await elements[i].click();
                        console.log('click on element: ', i);
                    }
                    await browser.performActions([
                        {
                            type: 'key',
                            id: 'keyboard',
                            actions: [{ type: 'keyUp', value: 'Control' }],
                        },
                    ]);
                    console.log('key up');
                }
                break;
            case 'firefox': {
                let elLocation = null;
                let scriptToExecInBrowser = '';
                for (let i = 0; i < elements.length; i++) {
                    elLocation = await elements[i].getLocation();
                    scriptToExecInBrowser = `
                let domele1 = document.evaluate("${
                    elements[i].selector
                }", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                let clickEvent = document.createEvent('MouseEvents');
                clickEvent.initMouseEvent('click', true, true, window, 1,  ${elLocation.x + elLocation.width / 2}, ${
                    elLocation.y + elLocation.height / 2
                }, ${elLocation.x + elLocation.width / 2}, ${
                    elLocation.y + elLocation.height / 2
                }, ${process.platform.includes('win32')}, false, false, ${process.platform.includes(
                    'darwin'
                )}, 0, null); 
                domele1.dispatchEvent(clickEvent);`;
                    await browser.execute(scriptToExecInBrowser);
                }
                break;
            }
            default:
                throw new Error(
                    ` page.multiSelectElementsUsingCommandOrControl not implemented for browser.capabilities.browserName=${browser.capabilities.browserName}`
                );
        }
    }

    async clearVizHover() {
        let ele = await this.$("//div[contains(@class,'mstrmojo-UnitContainer mstrmojo-VIBox')]");
        // console.log("toolbar ele: ", ele);
        await this.moveAndClickByOffsetFromElement(ele, 0, 0);
    }

    // ----------------------------------------- Element Count -------------------------------------------------------------
    // return the count of data points in current visualization
    async getElementCount(chartType) {
        let countNum = await this.$$(this.getELementPath(chartType)).length;
        return countNum;
    }
}
