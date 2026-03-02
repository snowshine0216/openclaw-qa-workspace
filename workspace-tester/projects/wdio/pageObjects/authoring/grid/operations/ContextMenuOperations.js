import LoadingDialog from '../../../dossierEditor/components/LoadingDialog.js';
import Common from '../../Common.js';
import DatasetPanel from '../../DatasetPanel.js';
import BaseContainer from '../../BaseContainer.js';
import { scrollIntoView } from '../../../../utils/scroll.js';
/**
 * Context menu operations for grid interactions
 */
export default class ContextMenuOperations extends BaseContainer {
    constructor(selectors, contextMenuSelectors) {
        super();
        this.selectors = selectors;
        this.contextMenuSelectors = contextMenuSelectors;
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
        this.datasetPanel = new DatasetPanel();
    }
    /**
     * Check if a context menu item exists
     * @param option
     */
    async existContextMenuItemByName(option) {
        let objectElement = await this.selectors.getContextMenuOption(option);
        let isPresent = await objectElement.isDisplayed();
        return isPresent;
    }

    /**
     * Selects option from context menu after RMC on a single element/header in grid
     * Enhanced to properly handle both header cells and data cells with JavaScript fallback
     * @param {string} objectName - Name of the object header or element
     * @param {string} option - Format, Number Format, Etc.
     * @param {string} visualizationName - Name of the visualization
     */
    async selectContextMenuOptionFromElement({ objectName, option, visualizationName }) {
        let el;

        // First try to get header cell (for column headers like "Avg Delay (min)")
        el = await this.selectors.getGridObject(objectName, visualizationName);
        // await scrollIntoView(el);
        // right click by javascript will trigger wrong context menu
        await this.selectors.rightClick({ elem: el, checkClickable: false });

        // try {
        //     // Use JavaScript-based approach for better reliability
        //     await this.rightClickWithJavaScript(el);
        // } catch (jsError) {
        //     console.warn('JavaScript right-click failed for element, using WebDriver fallback:', jsError.message);
        //     await this.selectors.rightClick({ elem: el, checkClickable: false });
        // }
        const updateContextMenu = async () => {
            await this.selectors.waitForElementVisible(this.contextMenuSelectors.contextMenu, { timeout: 1000 });
            await this.selectors.click({ elem: this.contextMenuSelectors.getContextMenuOption(option) });
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        };

        try {
            await updateContextMenu();
        } catch (error) {
            console.warn('First context menu attempt failed:', error.message);
            try {
                // If the element is not in the header row, try to get it as a data cell
                // should dismiss incorrect context menu firstly
                await this.dismissContextMenu();
                await this.selectors.rightClick({ elem: el, checkClickable: false });
                await updateContextMenu();
            } catch (retryError) {
                console.error('Context menu retry also failed:', retryError.message);
                throw new Error(
                    `Failed to select context menu option "${option}" after retry. Original error: ${error.message}, Retry error: ${retryError.message}`
                );
            }
        }
    }

    /**
     * Specifically for right-clicking on header cells (column headers)
     * Enhanced with JavaScript-based workaround for non-clickable headers
     * @param {string} objectName - Name of the header (e.g., "Avg Delay (min)")
     * @param {string} option - Context menu option to select
     * @param {string} visualizationName - Name of the visualization
     */
    async selectContextMenuOptionFromHeader({ objectName, option, visualizationName }) {
        return this.retry(async () => {
            const headerEl = await this.selectors.getObjectHeader(objectName, visualizationName);

            // Enhanced approach: Use JavaScript to trigger context menu event
            // This ensures the context menu is triggered correctly even for non-clickable elements
            try {
                await this.rightClickWithJavaScript(headerEl);
            } catch (jsError) {
                // Fallback to original right-click method if JavaScript approach fails
                // eslint-disable-next-line no-console
                console.warn(
                    'JavaScript context menu approach failed, falling back to standard right-click:',
                    jsError.message
                );
                await this.selectors.rightClick({ elem: headerEl, checkClickable: false });
            }

            const clickOnContextMenu = async () => {
                await this.selectors.waitForElementVisible(this.common.contextMenu, { timeout: 1000 });
                await this.selectors.click({ elem: this.getContextMenuOption(option) });
                await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
            };

            try {
                await clickOnContextMenu();
            } catch (error) {
                console.warn('Failed to click on context menu by click with javascript:', error.message);
                await this.dismissContextMenu();
                await this.selectors.rightClick({ elem: headerEl, checkClickable: false });
                await clickOnContextMenu();
            }
        });
    }

    /**
     * Helper method to check if an element is in the header row
     * @param {ElementFinder} element - Element to check
     * @param {string} visualizationName - Name of the visualization
     * @returns {Promise<boolean>} True if element is in header row
     */
    async isElementInHeaderRow(element, visualizationName) {
        try {
            const container = this.selectors.getGridContainer(visualizationName);
            const headerCells = await container.$$(
                '.mstrmojo-scrollNode .mstrmojo-XtabZone table tbody tr:first-child td'
            );

            for (const headerCell of headerCells) {
                if (await element.isEqual(headerCell)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    async selectContextMenuOptionFromElementByIndex(rowIndex, colIndex, option, visualizationName) {
        let el = this.selectors.getGridCellByPosition(rowIndex, colIndex, visualizationName);
        await this.selectors.rightClick({ elem: el });
        await this.selectors.waitForElementVisible(this.contextMenuSelectors.contextMenu);
        await this.selectors.click({ elem: this.contextMenuSelectors.getContextMenuOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Selects option from context menu after RMC on a single element/header with hyper link in grid
     * @param {string} objectName - Name of the object header or element
     * @param {string} option - Format, Number Format, Etc.
     * @param {string} visualizationName - Name of the visualization
     */
    async selectContextMenuOptionFromElementWithHyperLink(objectName, option, visualizationName) {
        await this.selectors.rightClick({
            elem: await this.selectors.getGridObjectWithHyperLink(objectName, visualizationName),
        });
        await this.selectors.waitForElementVisible(this.contextMenuSelectors.contextMenu);
        await this.selectors.click({ elem: this.contextMenuSelectors.getContextMenuOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Selects option from context menu after RMC on a single object in dropzone
     * @param {string} objectName - Name of the object header
     * @param {string} desZone - dropzone
     * @param {string} option - Format, Number Format, Etc.
     */
    async selectContextMenuOptionFromObjectinDZ(objectName, desZone, option) {
        await this.selectors.rightClick({ elem: await this.selectors.getObjectInDropZone(objectName, desZone) });
        await this.selectors.waitForElementVisible(this.contextMenuSelectors.contextMenu);
        await this.selectors.click({ elem: this.contextMenuSelectors.getContextMenuOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Click any of the generic buttons in opened context menu
     * @param {*} button OK or Cancel
     */
    async clickContextMenuButton(button) {
        await this.selectors.clickOnElementByInjectingScript(await this.common.getContextMenuButton(button));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Open a speicific context menu item for grid cells
     * @param {string} gridCellNames - Names of the grid cells
     * @param {string} visualizationName - Name of the visualization
     */
    async openContextMenuItemForGridCells(gridCellNames, menuItemName, visualizationName) {
        let arrString = gridCellNames.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.selectors.getGridObject(arrString[i], visualizationName));
        }

        await this.selectors.rightClicks(arrElements);
        await this.selectors.waitForElementVisible(this.contextMenuSelectors.contextMenu);
        await this.selectors.click({ elem: this.contextMenuSelectors.getContextMenuOption(menuItemName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    async openContextMenuItemForGridCellByPosition(row, col, menuItemName, visualizationName) {
        let cell = this.selectors.getGridCellByPosition(row, col, visualizationName);
        await this.selectors.rightClick({ elem: cell });
        await this.selectors.waitForElementVisible(this.contextMenuSelectors.contextMenu);
        await this.selectors.click({ elem: this.contextMenuSelectors.getContextMenuOption(menuItemName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Open a speicific context menu item for grid cells by applying the offset when RMC click on the grid cells,
     * usually needed when selecting the cells in column headers, or selection the grid cells in both rows and columns
     * @param {string} gridCellNames - Names of the grid cells
     * @param {string} visualizationName - Name of the visualization
     */
    async openContextMenuItemForGridCellsByOffSet(
        gridCellNames,
        menuItemName,
        visualizationName,
        offsetX = 1,
        offsetY = 1
    ) {
        let arrString = gridCellNames.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(await this.selectors.getGridObject(arrString[i], visualizationName));
        }

        await this.selectors.rightClicksbyOffSet(arrElements, offsetX, offsetY);
        await this.selectors.waitForElementVisible(this.contextMenuSelectors.contextMenu);
        await this.selectors.click({ elem: this.contextMenuSelectors.getContextMenuOption(menuItemName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * RMC on the selected header - Enhanced with JavaScript fallback
     * @param {string} objectName - Name of the header (e.g., "Avg Delay (min)")
     * @param {string} visualizationName - Name of the visualization
     * @param {number} offsetX - X offset for more precise clicking (default: 0)
     * @param {number} offsetY - Y offset for more precise clicking (default: 0)
     */
    async rightClickOnHeader(objectName, visualizationName, offsetX = 0, offsetY = 0) {
        const headerElement = await this.selectors.getObjectHeader(objectName, visualizationName);

        try {
            // First try JavaScript-based approach for better reliability
            await this.rightClickWithJavaScript(headerElement, offsetX, offsetY);
        } catch (jsError) {
            console.warn('JavaScript right-click failed, trying WebDriver right-click:', jsError.message);

            // Fallback to WebDriver right-click
            if (offsetX !== 0 || offsetY !== 0) {
                await this.selectors.rightClickByOffset({
                    elem: headerElement,
                    offsetX,
                    offsetY,
                    checkClickable: false,
                });
            } else {
                await this.selectors.rightClick({ elem: headerElement, checkClickable: false });
            }
        }
    }

    async isContextMenuOptionPresentInHeaderCell(menuOption, cellText, visualizationName) {
        // Locate the cell by its text
        const cell = await this.selectors.getObjectHeader(cellText, visualizationName);

        // Right-click on the cell to open the context menu
        await cell.click({ button: 'right' });

        // Check if the context menu option exists
        const menuOptionElement = await this.contextMenuSelectors.getContextMenuOption(menuOption);
        return await menuOptionElement.isExisting();
    }

    async dismissContextMenu() {
        let el = await this.selectors.documentBody;
        await browser.execute(
            "var clickEvent = document.createEvent('MouseEvents');clickEvent.initEvent('mousedown', true, true);arguments[0].dispatchEvent (clickEvent);",
            el
        );
    }

    async openNumberFormatContextMenu(objectName, visualizationName) {
        await this.selectContextMenuOptionFromElement(objectName, 'Number Format', visualizationName);
    }

    async saveContextMenuOption() {
        await this.clickContextMenuButton('OK');
    }

    async updateAndSaveNumberFormat(objectName, visualizationName, updateNumberFormatFunction, datasetName) {
        if (datasetName) {
            await this.datasetPanel.actionOnObjectFromDataset(
                objectName,
                visualizationName,
                datasetName,
                'Number Format'
            );
        } else if (['Metrics', 'Rows'].includes(visualizationName)) {
            await this.selectContextMenuOptionFromObjectinDZ(objectName, visualizationName, 'Number Format');
        } else {
            await this.selectContextMenuOptionFromElement({ objectName, option: 'Number Format', visualizationName });
        }
        await updateNumberFormatFunction();
        await this.saveContextMenuOption();
    }

    /**
     * Helper method to get the correct context menu based on header vs data cell
     * @param {string} objectName - Name of the object or header
     * @param {string} visualizationName - Name of the visualization
     * @returns {Promise<string>} "header" or "data" indicating the type of cell
     */
    async getCellType(objectName, visualizationName) {
        try {
            const headerEl = await this.selectors.getObjectHeader(objectName, visualizationName);
            const isHeader = await this.isElementInHeaderRow(headerEl, visualizationName);
            return isHeader ? 'header' : 'data';
        } catch (error) {
            return 'data';
        }
    }

    /**
     * Enhanced method for opening Format context menu with better header detection
     * @param {string} objectName - Name of the object or header
     * @param {string} visualizationName - Name of the visualization
     */
    async openFormatContextMenu(objectName, visualizationName) {
        await this.selectContextMenuOptionFromElement({
            objectName,
            option: 'Format',
            visualizationName,
        });
    }

    /**
     * Enhanced method for opening any context menu option with better header detection
     * @param {string} objectName - Name of the object or header
     * @param {string} option - Context menu option (e.g., "Format", "Copy Formatting")
     * @param {string} visualizationName - Name of the visualization
     */
    async openContextMenuOption(objectName, option, visualizationName) {
        await this.selectContextMenuOptionFromElement({
            objectName,
            option,
            visualizationName,
        });
    }
}
