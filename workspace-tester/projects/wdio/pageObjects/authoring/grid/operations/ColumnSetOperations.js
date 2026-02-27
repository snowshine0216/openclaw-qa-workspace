import LoadingDialog from '../../../dossierEditor/components/LoadingDialog.js';

/**
 * Column set operations for compound grids
 */
export default class ColumnSetOperations {
    constructor(selectors) {
        this.selectors = selectors;
        this.loadingDialog = new LoadingDialog();
    }

    async addColumnSet() {
        await this.selectors.click({ elem: this.selectors.addColumnSetIcon });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async deleteColumnSet(columnSetName) {
        await this.selectors.hover({ elem: await this.selectors.getColumnSetInEditorPanel(columnSetName) });
        await this.selectors.click({ elem: await this.selectors.getColumnSetDeleteButton(columnSetName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async reorderColumnSet(columnSetName, desPosition, relColumnSetName, offsetX = 0, offsetY = 10) {
        const curSet = await this.selectors.getColumnSetDragArea(columnSetName);
        const relSet = await this.selectors.getColumnSetDragArea(relColumnSetName);
        await this.moveToSpecificLocationAndWait(desPosition, curSet, relSet, offsetX, offsetY);
    }

    async renameColumnSet(columnSetPosition, newColumnSetName) {
        const elColumnSetTitle = await this.selectors.getColumnSetTitleAtPos(columnSetPosition);
        await this.selectors.doubleClickOnElement(elColumnSetTitle);
        await this.selectors.clear(elColumnSetTitle);
        await elColumnSetTitle.addValue(newColumnSetName + '\uE007');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async expandCollapseColumnSet(columnSetName) {
        await this.selectors.click({ elem: this.selectors.getColumnSetExpandCollapse(columnSetName) });
    }

    async editMicrochart(setName, microchartName) {
        await this.selectors.hover({ elem: await this.selectors.getColumnSetInEditorPanel(setName) });
        await this.selectors.click({ elem: await this.selectors.getMicrochartEditButton(setName, microchartName) });
    }

    async clickOnColumnSet(columnSetName) {
        let columnSet = await this.selectors.getColumnSetInEditorPanel(columnSetName);
        await this.selectors.waitForElementClickable(columnSet);
        await browser.pause(1 * 1000);
        await this.selectors.click({ elem: columnSet });
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

    async reOrderObjectsInColumnSet({ objectName1, columnSet1, objectName2, columnSet2, desPosition }) {
        let srcel = await this.selectors.getObjectInColumnSetDropZone(objectName1, columnSet1);
        await this.selectors.waitForElementVisible(srcel);
        let desel = await this.selectors.getObjectInColumnSetDropZone(objectName2, columnSet2);
        await this.selectors.waitForElementVisible(desel);
        await this.moveToSpecificLocationAndWait(desPosition, srcel, desel);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
}
