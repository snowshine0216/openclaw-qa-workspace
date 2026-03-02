import LoadingDialog from '../../../dossierEditor/components/LoadingDialog.js';
import BaseContainer from '../../BaseContainer.js';

/**
 * Grid cell operations - handles all grid cell interactions
 */
export default class GridCellOperations extends BaseContainer {
    constructor(selectors) {
        super();
        this.selectors = selectors;
        this.loadingDialog = new LoadingDialog();
    }

    /**
     * Click on a grid element
     * @param {string} objectName - Name of the element
     * @param {string} visualizationName - Name of the visualization
     */
    async clickOnGridElement(objectName, visualizationName) {
        let objectElement = await this.selectors.getGridObject(objectName, visualizationName);
        await this.selectors.click({ elem: objectElement });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickOnGridElementWithoutLoading(objectName, visualizationName) {
        let objectElement = await this.selectors.getGridObject(objectName, visualizationName);
        await this.selectors.click({ elem: objectElement });
    }

    async rightClickOnGridElement(objectName, visualizationName) {
        let objectElement = await this.selectors.getGridObject(objectName, visualizationName);
        await this.selectors.rightClick({ elem: objectElement });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async hoverOnGridElement(objectName, visualizationName) {
        let objectElement = await this.selectors.getGridObject(objectName, visualizationName);
        await this.selectors.hover({ elem: objectElement });
    }

    /**
     * Mouse over grid cell by position
     */
    async mouseOverGridCellByPosition(row, col, visualization) {
        let cell = await this.selectors.getGridCellByPosition(row, col, visualization);
        await browser.pause(1000);
        await this.selectors.hover({ elem: cell });
    }

    /**
     * Select multiple elements in grid
     * @param {string} elements - comma separated list of elements
     * @param {string} objectName - object name
     * @param {string} visualizationName - visualization name
     */
    async selectMultipleElements(elements, visualizationName) {
        let arrElements = [];
        for (const element of elements) {
            arrElements.push(await this.selectors.getGridElement(element, visualizationName));
        }
        await this.multiSelectElementsUsingCommandOrControl(arrElements);
        return arrElements;
    }

    /**
     * Select multiple grid cells
     */
    async selectMultipleGridCells(elements, visualizationName) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            arrElements.push(this.selectors.getGridElement(arrString[i], visualizationName));
        }
        await this.multiSelectElementsUsingCommandOrControl(arrElements);
    }

    /**
     * Select elements using shift key
     */
    async selectElementsUsingShift(elements_1, elements_2, visualizationName) {
        let obj1 = await this.selectors.getGridElement(elements_1, visualizationName);
        let obj2 = await this.selectors.getGridElement(elements_2, visualizationName);
        await this.selectors.multiSelectElementsUsingShift(obj1, obj2);
    }

    /**
     * Scroll to a specific grid cell
     */
    async scrollToGridCell(visualizationName, elementName) {
        let el = this.selectors.getGridElement(elementName, visualizationName);
        await this.selectors.scrollIntoView(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Move scroll bar in a specific direction
     */
    async moveScrollBar(direction, pixels, vizName) {
        let orientation = direction === 'left' || direction === 'right' ? 'horizontal' : 'vertical',
            scrollbar = await this.selectors.getGridScrollBar(orientation, vizName),
            numOfPixels = direction === 'left' || direction === 'top' ? -pixels : pixels;

        await this.selectors.dragAndDropByPixel(
            scrollbar,
            orientation === 'horizontal' ? numOfPixels : 0,
            orientation === 'vertical' ? numOfPixels : 0,
            true
        );
    }

    /**
     * Resize column by moving border
     */
    async resizeColumnByMovingBorder(colNum, pixels, direction, vizName) {
        let columnBorder = await this.selectors.getColumnBorder(colNum, vizName),
            numOfPixels = direction.toLowerCase() === 'left' ? -pixels : pixels;
        await this.selectors.dragAndDropByPixel(columnBorder, numOfPixels, 0, true);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Get grid cell count
     */
    getAllGridObjectCount(visualizationName) {
        return this.selectors.getAllGridObject(visualizationName).length;
    }

    /**
     * Check if element is present
     */
    async isElementPresent(element, objectName, visualizationName) {
        let objectElement = await this.selectors.getGridObject(visualizationName, element);
        await this.selectors.waitForElementVisible(objectElement);
        return objectElement.isDisplayed();
    }
}
