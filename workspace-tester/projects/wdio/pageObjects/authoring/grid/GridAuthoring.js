/**
 * GridAuthoring.js - Modular Grid Page Object
 *
 * This class serves as the main entry point for grid-related operations,
 * utilizing all the modular components created during the VizPanelForGrid refactoring.
 *
 * It provides a clean, organized interface for grid interactions while maintaining
 * separation of concerns through the modular architecture.
 */

import BaseContainer from '../BaseContainer.js';
import LoadingDialog from '../../dossierEditor/components/LoadingDialog.js';
import DatasetPanel from '../DatasetPanel.js';
import Common from '../Common.js';

// Import Selector Modules
import GridSelectors from './selectors/GridSelectors.js';
import ContextMenuSelectors from './selectors/ContextMenuSelectors.js';
import NumberFormatSelectors from './selectors/NumberFormatSelectors.js';

// Import Operation Modules
import GridCellOperations from './operations/GridCellOperations.js';
import SortOperations from './operations/SortOperations.js';
import ContextMenuOperations from './operations/ContextMenuOperations.js';
import NumberFormatOperations from './operations/NumberFormatOperations.js';
import DragDropOperations from './operations/DragDropOperations.js';
import OutlineOperations from './operations/OutlineOperations.js';
import GroupOperations from './operations/GroupOperations.js';
import ColumnSetOperations from './operations/ColumnSetOperations.js';

// Import Validator Modules
import GridValidators from './validators/GridValidators.js';

/**
 * Main Grid class that orchestrates all grid-related functionality
 * @extends BaseContainer
 */
export default class GridAuthoring extends BaseContainer {
    constructor() {
        super();

        // Initialize base dependencies
        this.loadingDialog = new LoadingDialog();
        this.datasetPanel = new DatasetPanel();
        this.common = new Common();

        // Initialize selector modules
        this.selectors = new GridSelectors();
        this.contextMenuSelectors = new ContextMenuSelectors();
        this.numberFormatSelectors = new NumberFormatSelectors();

        // Initialize operation modules
        this.gridCellOperations = new GridCellOperations(this.selectors);
        this.sortOperations = new SortOperations(this.selectors);
        this.contextMenuOperations = new ContextMenuOperations(this.selectors, this.contextMenuSelectors);
        this.numberFormatOperations = new NumberFormatOperations(this.selectors, this.numberFormatSelectors);
        this.dragDropOperations = new DragDropOperations(this.selectors);
        this.outlineOperations = new OutlineOperations(this.selectors);
        this.groupOperations = new GroupOperations(this.selectors);
        this.columnSetOperations = new ColumnSetOperations(this.selectors);

        // Initialize validator modules
        this.validators = new GridValidators(this.selectors);
    }

    //#region Public Interface - Delegate to appropriate modules

    // ===== ELEMENT SELECTORS =====
    /**
     * Get grid object element
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     * @returns {WebElement} Grid object element
     */
    getGridObject(objectName, visualizationName) {
        return this.selectors.getGridObject(objectName, visualizationName);
    }

    /**
     * Get grid object header element
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     * @returns {WebElement} Grid object header element
     */
    getGridObjectHeader(objectName, visualizationName) {
        return this.selectors.getGridObjectHeader(objectName, visualizationName);
    }

    /**
     * Get grid element by text
     * @param {string} elementName - Name of the element
     * @param {string} visualizationName - Name of the visualization
     * @returns {WebElement} Grid element
     */
    getGridElement(elementName, visualizationName) {
        return this.selectors.getGridElement(elementName, visualizationName);
    }

    /**
     * Get drop zone element
     * @param {string} zoneName - Name of the drop zone
     * @returns {WebElement} Drop zone element
     */
    getDropZone(zoneName) {
        return this.selectors.getDropZone(zoneName);
    }

    /**
     * Get grid container element
     * @param {string} visualizationName - Name of the visualization
     * @returns {WebElement} Grid container element
     */
    getGridContainer(visualizationName = 'Visualization 1') {
        return this.selectors.getGridContainer(visualizationName);
    }

    /**
     * Get grid cell by position
     * @param {number} row - Row index (1-based)
     * @param {number} col - Column index (1-based)
     * @param {string} visualizationName - Name of the visualization
     * @returns {WebElement} Grid cell element
     */
    getGridCellByPosition(row, col, visualizationName) {
        return this.selectors.getGridCellByPosition(row, col, visualizationName);
    }

    // ===== CELL OPERATIONS =====
    /**
     * Click on a grid element
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     */
    async clickOnGridElement(objectName, visualizationName) {
        return this.gridCellOperations.clickOnGridElement(objectName, visualizationName);
    }

    /**
     * Right click on a grid element
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     */
    async rightClickOnGridElement(objectName, visualizationName) {
        return this.gridCellOperations.rightClickOnGridElement(objectName, visualizationName);
    }

    // ===== SORTING OPERATIONS =====
    /**
     * Sort in ascending order
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     */
    async sortAscending(objectName, visualizationName) {
        return this.sortOperations.sortAscending(objectName, visualizationName);
    }

    /**
     * Sort in descending order
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     */
    async sortDescending(objectName, visualizationName) {
        return this.sortOperations.sortDescending(objectName, visualizationName);
    }

    /**
     * Clear sorting
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     */
    async clearSorting(objectName, visualizationName) {
        return this.sortOperations.clearSorting(objectName, visualizationName);
    }

    /**
     * Sort within attribute
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     * @param {string} sortAttribute - Attribute to sort within
     */
    async sortWithinAttribute(objectName, visualizationName, sortAttribute) {
        return this.sortOperations.sortWithinAttribute(objectName, visualizationName, sortAttribute);
    }

    // ===== CONTEXT MENU OPERATIONS =====
    /**
     * Check if context menu item exists
     * @param {string} option - Menu option name
     * @returns {boolean} True if exists
     */
    async existContextMenuItemByName(option) {
        return this.contextMenuOperations.existContextMenuItemByName(option);
    }

    /**
     * Select context menu option
     * @param {string} option - Menu option name
     */
    async selectContextMenuOptionByName(option) {
        return this.contextMenuOperations.selectContextMenuOptionByName(option);
    }

    /**
     * Right click on header
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     */
    async rightClickOnHeader(objectName, visualizationName) {
        return this.contextMenuOperations.rightClickOnHeader(objectName, visualizationName);
    }

    // ===== DRAG AND DROP OPERATIONS =====
    /**
     * Drag dataset object to grid container
     * @param {string} objectName - Name of the object
     * @param {string} objectTypeName - Type of object (attribute/metric)
     * @param {string} datasetName - Name of the dataset
     * @param {string} vizName - Name of the visualization
     */
    async dragDSObjectToGridContainer(objectName, objectTypeName, datasetName, vizName) {
        return this.dragDropOperations.dragDSObjectToGridContainer(objectName, objectTypeName, datasetName, vizName);
    }

    /**
     * Drag dataset object to grid drop zone
     * @param {string} objectName - Name of the object
     * @param {string} objectTypeName - Type of object (attribute/metric)
     * @param {string} datasetName - Name of the dataset
     * @param {string} desZone - Name of destination zone
     */
    async dragDSObjectToGridDZ(objectName, objectTypeName, datasetName, desZone) {
        return this.dragDropOperations.dragDSObjectToGridDZ(objectName, objectTypeName, datasetName, desZone);
    }

    /**
     * Remove object from grid
     * @param {string} objectName - Name of the object
     * @param {string} vizName - Name of the visualization
     */
    async removeObjectFromGrid(objectName, vizName) {
        return this.dragDropOperations.removeObjectFromGrid(objectName, vizName);
    }

    // ===== OUTLINE OPERATIONS =====
    /**
     * Expand outline from column header
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     */
    async expandOutlineFromColumnHeader(objectName, visualizationName) {
        return this.outlineOperations.expandOutlineFromColumnHeader(objectName, visualizationName);
    }

    /**
     * Collapse outline from column header
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     */
    async collapseOutlineFromColumnHeader(objectName, visualizationName) {
        return this.outlineOperations.collapseOutlineFromColumnHeader(objectName, visualizationName);
    }

    // ===== GROUP OPERATIONS =====
    /**
     * Group elements
     * @param {string} elements - Comma-separated list of elements
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName - Name for the group
     */
    async groupElements(elements, objectName, visualizationName, groupName) {
        return this.groupOperations.groupElements(elements, objectName, visualizationName, groupName);
    }

    /**
     * Ungroup elements
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName - Name of the group
     */
    async ungroupElements(objectName, visualizationName, groupName) {
        return this.groupOperations.ungroupElements(objectName, visualizationName, groupName);
    }

    /**
     * Group elements for calculation
     * @param {string} elements - Comma-separated list of elements
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName - Name for the group
     * @param {string} calculationMenu - Calculation type
     */
    async groupElementsForCalculation(elements, objectName, visualizationName, groupName, calculationMenu) {
        return this.groupOperations.groupElementsForCalculation(
            elements,
            objectName,
            visualizationName,
            groupName,
            calculationMenu
        );
    }

    // ===== COLUMN SET OPERATIONS =====
    /**
     * Add column set
     */
    async addColumnSet() {
        return this.columnSetOperations.addColumnSet();
    }

    /**
     * Delete column set
     * @param {string} columnSetName - Name of the column set
     */
    async deleteColumnSet(columnSetName) {
        return this.columnSetOperations.deleteColumnSet(columnSetName);
    }

    /**
     * Rename column set
     * @param {number} columnSetPosition - Position of the column set
     * @param {string} newColumnSetName - New name for the column set
     */
    async renameColumnSet(columnSetPosition, newColumnSetName) {
        return this.columnSetOperations.renameColumnSet(columnSetPosition, newColumnSetName);
    }

    // ===== NUMBER FORMAT OPERATIONS =====
    /**
     * Click number format shortcut icon
     * @param {string} shortcut - Shortcut type (fixed/currency/percentage)
     */
    async clickNfShortcutIcon(shortcut) {
        return this.numberFormatOperations.clickNfShortcutIcon(shortcut);
    }

    // ===== VALIDATION OPERATIONS =====
    /**
     * Check if object exists by name
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     * @returns {boolean} True if object exists
     */
    async existObjectByName(objectName, visualizationName) {
        return this.validators.existObjectByName(objectName, visualizationName);
    }

    /**
     * Check if element is present
     * @param {string} element - Element to check
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     * @returns {boolean} True if element is present
     */
    async isElementPresent(element, objectName, visualizationName) {
        return this.validators.isElementPresent(element, objectName, visualizationName);
    }

    /**
     * Get count of all grid objects
     * @param {string} visualizationName - Name of the visualization
     * @returns {number} Count of grid objects
     */
    async getAllGridObjectCount(visualizationName) {
        return this.validators.getAllGridObjectCount(visualizationName);
    }

    //#endregion

    //#region Module Access - For advanced usage

    /**
     * Get direct access to selector modules
     * @returns {Object} Object containing all selector modules
     */
    getSelectors() {
        return {
            grid: this.selectors,
            contextMenu: this.contextMenuSelectors,
            numberFormat: this.numberFormatSelectors,
        };
    }

    /**
     * Get direct access to operation modules
     * @returns {Object} Object containing all operation modules
     */
    getOperations() {
        return {
            cell: this.gridCellOperations,
            sort: this.sortOperations,
            contextMenu: this.contextMenuOperations,
            numberFormat: this.numberFormatOperations,
            dragDrop: this.dragDropOperations,
            outline: this.outlineOperations,
            group: this.groupOperations,
            columnSet: this.columnSetOperations,
        };
    }

    /**
     * Get direct access to validator modules
     * @returns {GridValidators} Grid validators instance
     */
    getValidators() {
        return this.validators;
    }

    /**
     * Change visualization to Compound Grid
     * @param {string} containerName - Name of the container
     */
    async changeVizToCompoundGrid(containerName) {
        await this.changeViz('Compound Grid', containerName, false);
    }
    async switchToEditorPanel() {
        await this.selectors.click({ elem: this.selectors.editorPanelTab });
    }
}
