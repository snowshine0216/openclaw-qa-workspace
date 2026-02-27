import LoadingDialog from '../../../dossierEditor/components/LoadingDialog.js';
import DatasetPanel from '../../DatasetPanel.js';

/**
 * Drag and drop operations for grid
 */
export default class DragDropOperations {
    constructor(selectors) {
        this.selectors = selectors;
        this.loadingDialog = new LoadingDialog();
        this.datasetPanel = new DatasetPanel();
    }

    /**
     * Drag and drop object from dataset to grid container
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} vizName - name of visualization
     */
    async dragDSObjectToGridContainer(objectName, objectTypeName, datasetName, vizName) {
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.selectors.waitForElementVisible(srcel);
        let desel = await this.selectors.getGridContainer(vizName);
        await this.selectors.waitForElementVisible(desel);
        await this.selectors.dragAndDropForAuthoringWithOffset({
            fromElem: srcel,
            toElem: desel,
            toOffset: { x: 0, y: 0 },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Drag and drop object from dataset to grid dropzone
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} desZone - name of dropzone, e.g. Rows, Columns...
     */
    async dragDSObjectToGridDZ(objectName, objectTypeName, datasetName, desZone) {
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.selectors.waitForElementVisible(srcel);
        let desel = await this.selectors.getDropZone(desZone);
        await this.selectors.waitForElementVisible(desel);
        await this.selectors.dragAndDropForAuthoringWithOffset({
            fromElem: srcel,
            toElem: desel,
            toOffset: { x: 0, y: 0 },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Drag and drop object from dataset to compound grid column set dropzone
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} columnSetName - name of column set
     */
    async dragDSObjectToGridColumnSetDZ(objectName, objectTypeName, datasetName, columnSetName) {
        let srcEl = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.selectors.waitForElementVisible(srcEl);
        let desEl = await this.selectors.getColumnSetDropZone(columnSetName);
        await this.selectors.waitForElementVisible(desEl);
        await this.selectors.dragAndDropForAuthoringWithOffset({
            fromElem: srcEl,
            toElem: desEl,
            toOffset: { x: 0, y: 0 },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    /**
     * Drag and drop object from dataset to any visualization drop zone, and put the object "above" or "below" existing object
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} zone - name of drop zone
     * @param {string} desPosition - "above" or "below" or "replace"
     * @param {string} desObject - the existing object in the column set which is used as an reference of the relative position
     */
    async dragDSObjectToDZWithPosition(
        objectName,
        objectTypeName,
        datasetName,
        zone,
        desPosition,
        desObject,
        offsetX = 0,
        offsetY = 10
    ) {
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.selectors.waitForElementVisible(srcel, { timeout: 5000 });
        let desel = await this.selectors.getObjectInDropZone(desObject, zone);
        await this.selectors.waitForElementVisible(desel, { timeout: 5000 });
        await this.moveToSpecificLocationAndWait(desPosition, srcel, desel, offsetX, offsetY);
    }

    /**
     * Used to move multiple objects from dataset panel to grid drop zone
     * @param {*} datasetName
     * @param {*} objOneType attribute/metric of head el
     * @param {*} objOneName head el
     * @param {*} objTwoType attribute/metric of tail el
     * @param {*} objTwoName tail el
     * @param {*} destZone
     */
    async multiselectAndDragDSObjectsToDZ(datasetName, objOneType, objOneName, objTwoType, objTwoName, desZone) {
        let headEl = await this.datasetPanel.getObjectFromDataset(objOneName, objOneType, datasetName);
        await this.selectors.waitForElementVisible(headEl);

        let tailEl = await this.datasetPanel.getObjectFromDataset(objTwoName, objTwoType, datasetName);
        await this.selectors.waitForElementVisible(tailEl);

        let desEl = await this.selectors.getDropZone(desZone);
        await this.selectors.waitForElementVisible(desEl);

        // multiselect by shift
        await this.selectors.multiSelectElementsUsingShift(headEl, tailEl);
        await this.selectors.dragAndDrop({
            fromElem: headEl,
            toElem: desEl,
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Drag object from grid to another visualization
     * @param {*} objectName
     * @param {*} srcViz
     * @param {*} destViz
     */
    async dragObjectToOtherViz(objectName, srcViz, destViz) {
        let srcEl = await this.selectors.getGridElement(objectName, srcViz),
            destEl = await this.selectors.getGridContainer(destViz);
        await this.selectors.dragAndDropForAuthoringWithOffset({
            fromElem: srcEl,
            toElem: destEl,
            toOffset: { x: 0, y: 0 },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * remove an object - drag the object out of grid visualization to dataset panel zone
     * @param objectName
     * @param vizName
     * @return {Promise<void>}
     */
    async removeObjectFromGrid(objectName, vizName) {
        let srcEl = await this.selectors.getGridElement(objectName, vizName),
            invalidDZ = await this.datasetPanel.datasetPanel;

        await this.baseDragFunction(srcEl, invalidDZ);
    }

    /**
     * Resize column by moving border
     * @param {*} colNum
     * @param {*} pixels
     * @param {*} direction
     * @param {*} vizName
     */
    async resizeColumnByMovingBorder(colNum, pixels, direction, vizName) {
        let columnBorder = await this.selectors.getColumnBorder(colNum, vizName),
            numOfPixels = direction.toLowerCase() === 'left' ? -pixels : pixels;
        await this.selectors.dragAndDropByPixel(columnBorder, numOfPixels, 0, true);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Should I move this to BasePage or refractor DnD function in ngmEditorPanel.js ?
     * This function does NOT assume element to move will be dropped to target element.
     * @param {*} targetElement element to drag
     * @param {*} xOffset optional param
     * @param {*} yOffset optional param
     * @param {*} doMouseUp optional param
     * @param {*} waitforLoadingDialog optional param
     */
    async baseDragFunction(movingElement, targetElement, xOffset = 0, yOffset = 0, doMouseUp, waitforLoadingDialog) {
        let dndInnerTime = 0.3 * 1000; // Allow DND animation work properly

        try {
            await browser.actions().mouseMove(movingElement).perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseDown().perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseMove({ x: 0, y: 1 }).perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseMove({ x: 1, y: 0 }).perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseMove({ x: 1, y: 0 }).perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseMove(targetElement).perform();
            await browser.pause(dndInnerTime);

            if (xOffset > 0 || yOffset > 0) {
                await browser
                    .actions()
                    .mouseMove({ x: parseInt(xOffset), y: parseInt(yOffset) })
                    .perform();
                await browser.pause(dndInnerTime);
            }

            if (doMouseUp) {
                await browser.actions().mouseUp().perform();
                await browser.pause(dndInnerTime);
            }
        } catch (err) {
            console.log(err.message);
        }

        if (waitforLoadingDialog) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
        }
    }

    async moveToSpecificLocationAndWait(desPosition, srcElement, desElement, offsetX = 0, offsetY = 10) {
        await this.selectors.waitForElementVisible(srcElement);
        await this.selectors.hover({ elem: srcElement });
        if (desPosition == 'above') {
            offsetY = -Math.abs(offsetY);
            await this.selectors.dragAndDropForAuthoringWithOffset({
                fromElem: srcElement,
                toElem: desElement,
                toOffset: { x: offsetX, y: offsetY },
            });
        } else if (desPosition == 'below') {
            offsetY = Math.abs(offsetY);
            await this.selectors.dragAndDropForAuthoringWithOffset({
                fromElem: srcElement,
                toElem: desElement,
                toOffset: { x: offsetX, y: offsetY },
            });
        } else if (desPosition == 'replace') {
            await this.selectors.dragAndDropForAuthoringWithOffset({
                fromElem: srcElement,
                toElem: desElement,
                toOffset: { x: offsetX, y: 0 },
            });
        } else {
            throw 'Wrong location of the moving object';
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    /**
     * Drag and drop object from dataset to compound grid column set dropzone
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} columnSetName - name of column set
     */
    async dragAttributeToGridColumnSetDZ({ objectName, datasetName, columnSetName }) {
        await this.dragDSObjectToGridColumnSetDZ(objectName, 'attribute', datasetName, columnSetName);
    }

    async dragMetricToGridColumnSetDZ({ objectName, datasetName, columnSetName }) {
        await this.dragDSObjectToGridColumnSetDZ(objectName, 'metric', datasetName, columnSetName);
    }

    async dragMetricToDropZoneBelowObject({ objectName, datasetName, dropZone, belowObject }) {
        await this.dragDSObjectToDZWithPosition(objectName, 'metric', datasetName, dropZone, 'below', belowObject);
    }

    async dragAttributeToRows({ objectName, datasetName }) {
        await this.dragDSObjectToGridDZ(objectName, 'attribute', datasetName, 'Rows');
    }

    async dragMetricToRows({ objectName, datasetName }) {
        await this.dragDSObjectToGridDZ(objectName, 'metric', datasetName, 'Rows');
    }

    async dragAttributeToColumns({ objectName, datasetName }) {
        await this.dragDSObjectToGridDZ(objectName, 'attribute', datasetName, 'Columns');
    }

    async dragMetricToColumns({ objectName, datasetName }) {
        await this.dragDSObjectToGridDZ(objectName, 'metric', datasetName, 'Columns');
    }

    async dragAttributeToRowsBelowObject({ objectName, datasetName, belowObject }) {
        await this.dragDSObjectToDZWithPosition(objectName, 'attribute', datasetName, 'Rows', 'below', belowObject);
    }

    async dragMetricToRowsBelowObject({ objectName, datasetName, belowObject }) {
        await this.dragDSObjectToDZWithPosition(objectName, 'metric', datasetName, 'Rows', 'below', belowObject);
    }
}
