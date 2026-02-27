import BasePage from '../../base/BasePage.js';
import LoadingDialog from '../../dossierEditor/components/LoadingDialog.js';
import NgmEditorPanel from './ngmEditorPanel.js';
import NgmVisualizationPanel from './ngmVisualizationPanel.js';
import Common from '../Common.js';

export default class NgmContextMenu extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.ngmEditorPanel = new NgmEditorPanel();
        this.ngmVisualizationPanel = new NgmVisualizationPanel();
        this.common = new Common();
    }

    getxpath4AxisTitle(objName) {
        return this.$(
            `//*[local-name()='svg']//*[local-name()='g']//*[local-name()='text' and contains(@class, 'title') and contains(string(),'${objName}')]`
        );
    }

    // ------------------------------ Editor Panel ----------------------------

    async clickOnContextMenuOptionFromEditorPanel(objectName, objectZone, objectFunction) {
        const el = await this.ngmEditorPanel.getObjectInDropZone(objectName, objectZone);
        await this.clickOnContextMenuOption(el, objectFunction);
    }

    async clickOnSecondaryContextMenuOptionFromEditorPanel(objectName, objectZone, objectFunction1, objectFunction2) {
        const el = await this.ngmEditorPanel.getObjectInDropZone(objectName, objectZone);
        await this.clickOnSecondaryContextMenuOption(el, objectFunction1, objectFunction2);
    }

    async openContextMenuFromEditorPanel(objectName, objectZone) {
        const el = await this.ngmEditorPanel.getObjectInDropZone(objectName, objectZone);
        await this.rightMouseClickOnElement(el);
    }

    async ctrlSelectAndCreateCalculation(objectName1, objectName2, objectZone, objectFunction) {
        const el1 = await this.ngmEditorPanel.getObjectInDropZone(objectName1, objectZone);
        await el1.waitForExist();
        const el2 = await this.ngmEditorPanel.getObjectInDropZone(objectName2, objectZone);
        await el2.waitForExist();
        const els = [el1, el2];
        await this.multiSelectElementsUsingCommandOrControl(els);
        await this.clickOnSecondaryContextMenuOption(el1, 'Calculation', objectFunction);
    }

    async ctrlSelectAndRemove(objectName1, objectName2, objectZone) {
        const el1 = await this.ngmEditorPanel.getObjectInDropZone(objectName1, objectZone);
        await el1.waitForExist();
        const el2 = await this.ngmEditorPanel.getObjectInDropZone(objectName2, objectZone);
        await el2.waitForExist();
        const els = [el1, el2];
        await this.multiSelectElementsUsingCommandOrControl(els);
        await this.clickOnContextMenuOption(el1, 'Remove');
    }

    // ------------------------------ Axis Title ----------------------------
    async clickOnContextMenuOptionFromAxis(objectName, objectFunction) {
        const elpath = (await this.ngmVisualizationPanel.getCurrentPanel()) + this.getxpath4AxisTitle(objectName);
        const el = await this.$(elpath);
        await this.clickOnContextMenuOption(el, objectFunction);
    }

    async clickOnSecondaryContextMenuOptionFromAxis(objectName, objectFunction1, objectFunction2) {
        const elpath = (await this.ngmVisualizationPanel.getCurrentPanel()) + this.getxpath4AxisTitle(objectName);
        const el = await this.$(elpath);
        await this.clickOnSecondaryContextMenuOption(el, objectFunction1, objectFunction2);
    }

    async openContextMenuFromAxis(objectName) {
        const elpath = (await this.ngmVisualizationPanel.getCurrentPanel()) + this.getxpath4AxisTitle(objectName);
        const el = await this.$(elpath);
        await this.rightMouseClickOnElement(el);
    }

    // ------------------------------ Graph Data Points ----------------------------
    async selectElementAndclickOnContextMenuOption(chartType, index, objectFunction) {
        await this.ngmVisualizationPanel.selectElement(chartType, index);
        const xpath = await this.ngmVisualizationPanel.getElementPathByIndex(index, chartType);
        const el = await this.$(xpath);
        await this.clickOnContextMenuOption(el, objectFunction);
    }

    async selectElementAndclickOnSecondaryContextMenuOption(chartType, index, objectFunction1, objectFunction2) {
        await this.ngmVisualizationPanel.selectElement(chartType, index);
        const xpath = await this.ngmVisualizationPanel.getElementPathByIndex(index, chartType);
        const el = await this.$(xpath);
        await this.clickOnSecondaryContextMenuOption(el, objectFunction1, objectFunction2);
    }

    async clickOnContextMenuOptionFromElement(chartType, index, objectFunction) {
        const xpath = await this.ngmVisualizationPanel.getElementPathByIndex(index, chartType);
        const el = await this.$(xpath);
        await this.clickOnContextMenuOption(el, objectFunction);
    }

    async clickOnSecondaryContextMenuOptionFromElement(chartType, index, objectFunction1, objectFunction2) {
        const xpath = await this.ngmVisualizationPanel.getElementPathByIndex(index, chartType);
        const el = await this.$(xpath);
        await this.clickOnSecondaryContextMenuOption(el, objectFunction1, objectFunction2);
    }

    async ctrlSelectElementsAndclickOnContextMenuOption(chartType, indexArray, objectFunction) {
        await this.ngmVisualizationPanel.multiSelectElementsUsingCmndOrCtrl(indexArray, chartType);
        const xpath = await this.ngmVisualizationPanel.getElementPathByIndex(indexArray[0], chartType);
        const el = await this.$(xpath);
        await this.clickOnContextMenuOption(el, objectFunction);
    }

    async ctrlSelectElementsAndclickOnSecondaryContextMenuOption(
        chartType,
        indexArray,
        objectFunction1,
        objectFunction2
    ) {
        await this.ngmVisualizationPanel.multiSelectElementsUsingCmndOrCtrl(indexArray, chartType);
        const xpath = await this.ngmVisualizationPanel.getElementPathByIndex(indexArray[0], chartType);
        const el = await this.$(xpath);
        await this.clickOnSecondaryContextMenuOption(el, objectFunction1, objectFunction2);
    }

    async openContextMenuFromElement(chartType, index) {
        const xpath = await this.ngmVisualizationPanel.getElementPathByIndex(index, chartType);
        const el = await this.$(xpath);
        await this.rightMouseClickOnElement(el);
    }

    // --------------------- basic function -----------------------
    async clickOnContextMenuOption(webel, objectFunction) {
        await this.rightMouseClickOnElement(webel);
        const tem = await this.common.getContextMenuItem(objectFunction);
        await this.clickOnElement(tem);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async clickOnSecondaryContextMenuOption(webel, objectFunction1, objectFunction2) {
        await this.rightMouseClickOnElement(webel);
        const tem1 = await this.common.getContextMenuItem(objectFunction1);
        await tem1.waitForExist();
        await this.hoverMouseOnElement(tem1);
        const tem2 = await this.common.getSecondaryContextMenu(objectFunction2);
        await tem2.waitForExist();
        // await this.clickOnElement(tem2);
        await browser.execute('arguments[0].click()', tem2);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async closeContextMenu() {
        try {
            // 0.3s
            await browser.pause(300);
            await this.moveAndClickByOffset(-2, 0);
        } catch (err) {
            console.log(err.message);
        }
    }
}
