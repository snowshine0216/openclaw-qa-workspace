import BasePage from '../../base/BasePage.js';
import LoadingDialog from '../../dossierEditor/components/LoadingDialog.js';
import DatasetsPanel from '../../dossierEditor/DatasetsPanel.js';

export default class NgmEditorPanel extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.datasetsPanel = new DatasetsPanel();
    }

    // To-Do: add to xpath library later ???

    getDropZone(zone) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIVizEditor')]/descendant::div[text()='${zone}']/ancestor::div[@class='mstrmojo-VIPanel-titlebar']/following-sibling::div[@class='mstrmojo-VIPanel-content']/div/div`
        );
    }

    getObjectInDropZone(object, zone) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIVizEditor')]/descendant::div[text()='${zone}']/ancestor::div[@class='mstrmojo-VIPanel-titlebar']/following-sibling::div[@class='mstrmojo-VIPanel-content']/div/div/descendant::span[text()='${object}']`
        );
    }

    get datasetPanel() {
        return this.$(`//div[contains(@class,'mstrmojo-VIDatasetObjects')]`);
    }

    getXpath4class(className) {
        return this.$(`//div[contains(@class, '${className}')]`);
    }

    // ---------------- 1. Add object from dataset panel---------------------------
    // drag object from dataset panel and drop to blank drop zone 'desZone'
    async dragDSObjectToBlankDZ(objectName, objectTypeName, datasetName, desZone) {
        const srcElement = await this.datasetsPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await srcElement.waitForExist();
        const desElement = await this.getDropZone(desZone);
        await desElement.waitForExist();
        await this.dragAndDropObjectAndWait(srcElement, desElement);
    }

    // drag object from dataset panel to 'desZone' and drop it 'desPosition' (above or below) 'desObject' 'desObject'
    async dragDSObjectToDZ(objectName, objectTypeName, datasetName, desZone, desPosition, desObject) {
        const srcElement = await this.datasetsPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await srcElement.waitForExist();
        const desElement = await this.getObjectInDropZone(desObject, desZone);
        await desElement.waitForExist();
        await this.moveToSpecificLocationAndWait(desPosition, srcElement, desElement);
    }

    // drag object from dataset panel and drop to 'desZone' to replace object 'desObj'
    async dragDSObjectToDZReplace(objectName, objectTypeName, datasetName, desObject, desZone) {
        const srcElement = await this.datasetsPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await srcElement.waitForExist();
        const desElement = await this.getObjectInDropZone(desObject, desZone);
        await desElement.waitForExist();
        await this.dragAndDropObjectAndWait(srcElement, desElement);
    }

    // --------------------  2. Move Object -------------------------------
    // move object 'srcObject' from 'srcZone' drop it 'desPosition' (above or below) 'desObject' in 'desZone'
    async moveObject(srcObject, srcZone, desZone, desPosition, desObject) {
        const srcElement = await this.getObjectInDropZone(srcObject, srcZone);
        await srcElement.waitForExist();
        const desElement = await this.getObjectInDropZone(desObject, desZone);
        await desElement.waitForExist();
        await this.moveToSpecificLocationAndWait(desPosition, srcElement, desElement);
    }

    // move object 'srcObject' from 'srcZone' to 'desZone'
    async moveObjectToBlankDZ(srcObject, srcZone, desZone) {
        const srcElement = await this.getObjectInDropZone(srcObject, srcZone);
        await srcElement.waitForExist();
        const desElement = await this.getDropZone(desZone);
        await desElement.waitForExist();
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: srcElement,
            toElem: desElement,
            toOffset: { x: 0, y: 0 },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // move object 'srcObject' from 'srcZone' to replace 'desObject' in 'desZone'
    async moveObjectToReplace(srcObject, srcZone, desObject, desZone) {
        const srcElement = await this.getObjectInDropZone(srcObject, srcZone);
        await srcElement.waitForExist();
        const desElement = await this.getObjectInDropZone(desObject, desZone);
        await desElement.waitForExist();
        await this.dragAndDropObjectAndWait(srcElement, desElement);
    }

    // ----------------------- 3. Remove Object -----------------------------
    // remove object from drop zone 'srcZone'
    async removeObjectFromDropZone(srcObject, srcZone) {
        const srcElement = await this.getObjectInDropZone(srcObject, srcZone);
        await srcElement.waitForExist();
        const desElement = await this.datasetPanel;
        await desElement.waitForExist();
        await this.dragAndDropObjectAndWait(srcElement, desElement);
    }

    // ------------------------ 4. Swap/Clear All ---------------------------
    async editorPanelShortcutFunction(funName) {
        const el = await this.getXpath4class(funName);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(240);
    }

    // ------------------- Basic Action -----------------------
    // drag an element(movingElement) to target location(targetElement)
    async dragAndDropObjectAndWait(movingElement, targetElement) {
        const dndInnerTime = 0.3 * 1000; // Allow DND animation work properly
        await browser.execute('mstrmojo.dom.isIE9 = true;');
        try {
            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'mouse',
                    actions: [
                        { type: 'pointerMove', origin: movingElement, duration: dndInnerTime },
                        { type: 'pause', duration: dndInnerTime },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: dndInnerTime },
                        { type: 'pointerMove', x: 0, y: 1, duration: dndInnerTime },
                        { type: 'pause', duration: dndInnerTime },
                        { type: 'pointerMove', x: 1, y: 0, duration: dndInnerTime },
                        { type: 'pause', duration: dndInnerTime },
                        { type: 'pointerMove', x: 1, y: 0, duration: dndInnerTime },
                        { type: 'pause', duration: dndInnerTime },
                        { type: 'pointerMove', origin: targetElement, duration: dndInnerTime },
                        { type: 'pause', duration: dndInnerTime },
                        { type: 'pointerUp', button: 0 },
                        { type: 'pause', duration: dndInnerTime },
                    ],
                },
            ]);
        } catch (err) {
            console.log(err.message);
        }
        await browser.execute('mstrmojo.dom.isIE9 = false;');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    async moveToSpecificLocationAndWait(desPosition, srcElement, desElement) {
        if (desPosition === 'above') {
            await this.dragAndDropForAuthoringWithOffset({
                fromElem: srcElement,
                toElem: desElement,
                toOffset: { x: 0, y: -10 },
            });
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        } else if (desPosition === 'below') {
            await this.dragAndDropForAuthoringWithOffset({
                fromElem: srcElement,
                toElem: desElement,
                toOffset: { x: 0, y: 10 },
            });
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        } else {
            throw new Error('Wrong location of the moving object');
        }
    }
}
