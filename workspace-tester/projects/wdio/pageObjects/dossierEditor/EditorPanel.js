import BasePage from '../base/BasePage.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

export default class EditorPanel extends BasePage {
    // Element Locator
    getEditorPanel() {
        return this.$("//div[contains(@class,'selected') and contains(@class,'edt')]");
    }
    getEditorPanelHeader() {
        return this.$('.mstrmojo-VIBoxPanelContainer .edt');
    }
    // .mstrmojo-VIPanel-content .item.unit.ic4
    /**
     * Get MSTR object type from MSTR object name
     * @param {string} objectTypeName
     * @returns {number} MSTR Object type number.
     * @author Daniel Hernandez <lhernandez@microstrategy.com>
     */
    getObjectTypeId(objectTypeName) {
        switch (objectTypeName) {
            case 'attribute':
                return 12;
            case 'derived attribute':
                return '12d';
            case 'derived element':
                return '12de';
            case 'metric':
                return 4;
            case 'derived metric':
                return '4d';
            case 'consolidation':
                return 47;
            case 'custom group':
                return 1;
            case 'new derived element':
                return '47 st12033';
            case 'hierarchy object':
                return 14;
            default:
                return 0;
        }
    }

    /**
     * @param {string} objectName MSTR Object name
     * @param {string} objectType Object type in numeric (4 metric, 12 attribute)
     * @param {string} sectionName section to be obtaiined (rows, columns, header etc.)
     * @returns {Promise<ElementFinder>} MSTR Object
     */

    getObjectsByTypeFromEditor(objectTypeName) {
        let objectType = this.getObjectTypeId(objectTypeName.toLowerCase());
        return this.getEditorPanel().$$(
            `//div[contains(@class,'mstrmojo-VIBoxPanelContainer')]//div[contains(@class,'ic${objectType}')]`
        );
    }

    getObjectFromEditor(objectName, objectType) {
        return this.$(
            `//*[child::div/child::div/child::div/child::div/child::div[contains(@class,'selected') and contains(@class,'edt')]]//div[contains(@class,'mstrmojo-VIPanelPortlet')]//div[contains(@class,'ic${objectType}') and child::div/child::div/child::span[contains(string(),'${objectName}')]]`
        );
    }

    getObjectFromSection(objectName, objectType, sectionName) {
        return this.$(
            `//*[child::div/child::div/child::div/child::div/child::div[contains(@class,'selected') and contains(@class,'edt')]]//div[contains(@class,'mstrmojo-VIPanelPortlet') and child::div/child::div/child::div/child::div[text()='${sectionName}']]//div[contains(@class,'ic${objectType}') and child::div/child::div/child::span[text()='${objectName}']]`
        );
    }

    getDropZone(name) {
        return this.$(
            `//div[@class='mstrmojo-EditableLabel unselectable hasEditableText' and contains(string(),"${name}")]`
        );
    }

    getTooltipContent() {
        return this.$(`//div[@class='mstrmojo-Tooltip-content mstrmojo-scrollNode']`);
    }

    getInsightsTooltipContent() {
        return this.$(`//div[@class='mstrmojo-Tooltip-content mstrmojo-scrollNode regular-unitlist-tooltips']`);
    }

    getSwitchEditorButton() { 
        return this.$('.item.editPanel');
    }

    getTooltip() {
        return this.$(`//div[@class='mstrmojo-Tooltip vi-regular vi-tooltip-C mojo-theme-light']`);
    }

    // Action Methods
    async switchToEditorPanel() {
        if (!(await this.getEditorPanel().isDisplayed())) {
            await this.click({ elem: this.getEditorPanelHeader() });
            await this.waitForElementVisible(this.getEditorPanel());
        }
    }

    async enableEditorPanel () {
        const isEditorPanelEnabled = await this.getEditorPanelHeader().isDisplayed();
        if (!isEditorPanelEnabled) {
            await this.click({ elem: this.getSwitchEditorButton() });
            await this.waitForElementVisible(this.getEditorPanelHeader());
        }
    }

    async disableEditorPanel () {
        const isEditorPanelEnabled = await this.getEditorPanelHeader().isDisplayed();
        if (isEditorPanelEnabled) {
            await this.click({ elem: this.getSwitchEditorButton() });
            await this.waitForElementInvisible(this.getEditorPanelHeader());
        }
    }

    async clickEditorPanel() {
        if (!(await this.getEditorPanel().isDisplayed())) {
            await this.click({ elem: this.getEditorPanelHeader() });
        }
    }

    async getDropZoneTooltip(name) {
        await this.getDropZone(name).moveTo();
        await this.waitForElementVisible(this.getTooltipContent());
        return this.getTooltipContent().getText();
    }

    async getDropZoneAttMetricTooltip(name) {
        await this.getAttMetricDropZone(name).moveTo();
        await this.waitForElementVisible(this.getInsightsTooltipContent());
        await this.getInsightsTooltipContent().getText();
    }

    // Assertion Helper

    async isObjectVisibleOnEditorPanel(objectName, objectTypeName) {
        let objectType = this.getObjectTypeId(objectTypeName.toLowerCase());
        let elem = await this.getObjectFromEditor(objectName, objectType);
        return await elem.isDisplayed();
    }

    async isObjectVisibleInSection(objectName, objectTypeName, sectionName) {
        let objectType = this.getObjectTypeId(objectTypeName.toLowerCase());
        let elem = await this.getObjectFromSection(objectName, objectType, sectionName);
        return await elem.isDisplayed();
    }

    // Action Methods
    async switchToFormatPanel() {
        await this.waitForElementVisible(this.getEditorPanelHeader());
        await this.click({ elem: this.getEditorPanelHeader() });
        await this.waitForElementVisible(this.getEditorPanel());
        await this.moveToTopLeftCorner();
    }

    async getElementByXPathText(xPath, innerText) {
        let elems = await this.$$(xPath);
        if (elems && Array.isArray(elems)) {
            for (let i = 0; i < elems.length; ++i) {
                let elem = elems[i];
                if (elem) {
                    let text = await getAttributeValue(elem, 'innerText');
                    if (text === innerText) {
                        return elem;
                    }
                }
            }
        }
    }

    async getNthElementsByXPath(xPath, index) {
        let elems = await this.$$(xPath);
        if (elems && Array.isArray(elems) && elems.length > index) {
            return elems[index];
        }
    }

    async getLastElementByXPath(xPath) {
        let elems = await this.$$(xPath);
        if (elems && Array.isArray(elems)) {
            return elems[elems.length - 1];
        }
    }

    async getElementByXPath(xPath) {
        return this.$(xPath);
    }
}
