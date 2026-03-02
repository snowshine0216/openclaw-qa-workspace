import BaseContainer from '../../BaseContainer.js';
import Utils from '../../Utils.js';

/**
 * Grid element selectors
 * Contains all element locator methods for grid interactions
 * @extends BaseContainer
 */
export default class GridSelectors extends BaseContainer {
    constructor() {
        super();
    }

    //#region Basic Element Locators
    get documentBody() {
        return this.$('body');
    }
    getObject(objectName, objectType) {
        let objectTypeName = Utils.objectTypeIdExtended(objectType.toLowerCase(), '');
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIVizEditor')]//*[contains(@class,'${objectTypeName}')]//*[text()='${objectName}']`
        );
    }

    get metricSortClearIcon() {
        return this.$('.mstrmojo-ui-Menu-item-container .item.xt.btn.clr.mstrmojo-ui-Menu-item .micn');
    }

    get metricSortAscendingIcon() {
        return this.$('.mstrmojo-ui-Menu-item-container .item.xt.btn.asc.mstrmojo-ui-Menu-item .micn');
    }

    get metricSortDescendingIcon() {
        return this.$('.mstrmojo-ui-Menu-item-container .item.xt.btn.desc.mstrmojo-ui-Menu-item .micn');
    }

    getSortWithinAttribute(sortAttribute) {
        return this.$(
            `//a[contains(@class,'item xt') and contains(@class, 'mstrmojo-ui-Menu-item')]//*[text()='${sortAttribute}']`
        );
    }

    getVisualizationTitleBarTextArea(visualizationName) {
        return this.$(
            this.canvasPath +
                `//div[contains(@class,'mstrmojo-UnitContainer') and contains(@class, 'mstrmojo-VIBox')]//div[contains(@class, 'title-text') and contains(@style, 'width')]//div[text() = '${visualizationName}']`
        );
    }

    getVisualizationTitleBarRoot(visualizationName) {
        return this.getVisualizationTitleBarTextArea(visualizationName).$(
            `./ancestor::div[contains(@class, 'mstrmojo-UnitContainer-titlebar')]`
        );
    }

    getVisualizationSubTitleBarRoot(visualizationName) {
        return this.getVisualizationTitleBarTextArea(visualizationName).$(
            `./ancestor::div[contains(@class, 'mstrmojo-UnitContainer-subtitlebar')]`
        );
    }

    getTitleButton(visualizationName, btnType) {
        return this.getVisualizationTitleBarTextArea(visualizationName).$(
            `./ancestor::div[contains(@class,'mstrmojo-UnitContainer-titleBarContainer')]//div[contains(@class,'mstrmojo-UnitContainer-titleButtonsContainer')]//div[@aria-label='${btnType}']/parent::div`
        );
    }
  
    getVisualizationTitleBarContainer(visualizationName) {
        return this.getVisualizationTitleBarTextArea(visualizationName).$(
            `./ancestor::div[contains(@class, 'mstrmojo-UnitContainer-titleBarContainer')]`
        );
    }

    getGridContainer(visualizationName) {
        return this.$(
            `//div[@class='mstrmojo-DocSubPanel-content']//div[@class='mstrmojo-VIVizPanel-content']//div[@class='title-text']/div[text()='${visualizationName}']/ancestor::div[contains(@class, 'mstrmojo-UnitContainer') and contains(@class, 'mstrmojo-VIBox')]`
        );
    }

    getGridScrollNode(visualizationName) {
        return this.getContainer(visualizationName).$('.mstrmojo-scrollNode');
    }

    /**
     * @param {string} orientation "vertical" or "horizontal"
     * @param {string} visualizationName
     */
    getGridScrollBar(orientation, visualizationName) {
        orientation = orientation.toLowerCase();
        return this.getContainer(visualizationName).$(`.//div[@class = 'mstrmojo-scrollbar ${orientation}']`);
    }

    /**
     * Gets div between columns for resizing
     * @param {*} colNum is zero based
     * @param {*} visualizationName
     */
    getColumnBorder(colNum, visualizationName) {
        return this.getGridContainer(visualizationName).$(`(//div[@class='xrsz' and @idx=${colNum - 1}])[1]`);
    }

    /**
     * Gets object (column) header using CSS selectors for better performance
     * @param {string} objectName - The header text to find (e.g., "Area", "Issue Category (Defect)")
     * @param {string} visualizationName - The name of the visualization container
     * @returns {Promise<ElementFinder>} Column header element
     */
    async getObjectHeader(objectName, visualizationName) {
        const container = this.getGridContainer(visualizationName);

        // Find all header cells and return the one with matching text
        const headerCells = await container.$$('.mstrmojo-scrollNode .mstrmojo-XtabZone table tbody tr:first-child td');

        for (const cell of headerCells) {
            const cellText = await cell.getText();
            if (cellText === objectName) {
                return cell;
            }
        }

        // Fallback: use XPath if CSS selector approach doesn't find the element
        return container.$(`//td[text()='${objectName}'][1]`);
    }

    /**
     * Gets all header cells in the grid using CSS selectors
     * @param {string} visualizationName - The name of the visualization container
     * @returns {Promise<ElementFinder[]>} Array of header cell elements
     */
    async getAllObjectHeaders(visualizationName) {
        const container = this.getGridContainer(visualizationName);
        return await container.$$('.mstrmojo-scrollNode .mstrmojo-XtabZone table tbody tr:first-child td');
    }

    /**
     * Gets header cell by column index using CSS selectors
     * @param {number} columnIndex - Zero-based column index
     * @param {string} visualizationName - The name of the visualization container
     * @returns {Promise<ElementFinder>} Header cell element at specified index
     */
    async getObjectHeaderByIndex(columnIndex, visualizationName) {
        const container = this.getGridContainer(visualizationName);
        return await container.$(
            `.mstrmojo-scrollNode .mstrmojo-XtabZone table tbody tr:first-child td:nth-child(${columnIndex + 1})`
        );
    }

    /**
     * Checks if a header exists in the grid
     * @param {string} objectName - The header text to check
     * @param {string} visualizationName - The name of the visualization container
     * @returns {Promise<boolean>} True if header exists, false otherwise
     */
    async isObjectHeaderExists(objectName, visualizationName) {
        try {
            const header = await this.getObjectHeader(objectName, visualizationName);
            return await header.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    // to check whether header is locked (rendered twice) or not
    getObjectHeaderToVerifyLock(objectName, visualizationName) {
        let path = `${this.getContainerPath(
            visualizationName
        )}//div[contains(@class,'mstrmojo-XtabZone')]//td[text()='${objectName}']`;
        return this.$(path).length;
    }

    /** Gets object of the grid
     * @param {string} visualizationName visualization name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridObject(objectName, visualizationName) {
        // Use a step-by-step approach: container -> grid zone -> table -> specific cell
        // This avoids the complex xpath that makes elements unclickable
        const container = this.getContainerContent(visualizationName);
        return container
            .$('.mstrmojo-XtabZone')
            .$('table[role="grid"]')
            .$(`//td[@role="gridcell" and text()="${objectName}"]`);
    }

    getSelectedGridObject(objectName, visualizationName) {
        // Use the same improved approach for selected grid objects
        const container = this.getContainerContent(visualizationName);
        return container
            .$('.mstrmojo-XtabZone')
            .$('table[role="grid"]')
            .$(`//td[@role="gridcell" and contains(@class, "xtabSel") and text()="${objectName}"]`);
    }

    /** Gets object of the grid with hyper link
     * @param {string} visualizationName visualization name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridObjectWithHyperLink(objectName, visualizationName) {
        // Use the same improved approach for hyperlinked grid objects
        const container = this.getContainerContent(visualizationName);
        return container
            .$('.mstrmojo-XtabZone')
            .$('table[role="grid"]')
            .$(`//td[@role="gridcell"]//a[text()="${objectName}"]`);
    }

    getAllGridObject(visualizationName) {
        // Use the improved approach to get all grid rows
        const container = this.getContainerContent(visualizationName);
        return container.$('.mstrmojo-XtabZone').$('table[role="grid"]').$$('tbody tr');
    }

    getAllGridObjectCount(visualizationName) {
        return this.getAllGridObject(visualizationName).length;
    }

    /** Gets outline mode collapse/expand icon from object in the grid
     *
     * @param {string} visualizationName visualization name
     * @param {string} objectName - Name of the object
     *
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridObjectOutline(objectName, visualizationName) {
        return this.getGridObject(objectName, visualizationName).$(`./span[contains(@class, 'icon-outline-span')]`);
    }

    /**
     * Gets outline mode expand button from object of the grid
     * @param {string} visualizationName visualization name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridObjectExpand(objectName, visualizationName) {
        return this.getGridObject(objectName, visualizationName).$(`.//span[contains(@class, 'outline-expand')]`);
    }

    /**
     * Gets outline mode collapse button from object of the grid
     * @param {string} visualizationName visualization name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridObjectCollapse(objectName, visualizationName) {
        return this.getGridObject(objectName, visualizationName).$(`.//span[contains(@class, 'outline-collapse')]`);
    }

    /**
     * Gets outline mode expand button from element of the grid
     * @param {string} elementName element name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridElementExpand(elementName, visualizationName) {
        return this.getGridElement(elementName, visualizationName).$(`.//span[contains(@class, 'outline-expand')]`);
    }

    /**
     * Gets outline mode collapse button from element of the grid
     * @param {string} elementName element name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridElementCollapse(elementName, visualizationName) {
        return this.getGridElement(elementName, visualizationName).$(`.//span[contains(@class, 'outline-collapse')]`);
    }

    /**
     * @param {string} visualizationName visualization name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridObjectHeader(objectName, visualizationName) {
        return this.$(
            `//div[@class='mstrmojo-UnitContainer-titlebar']//child::*[text()='${visualizationName}']//parent::*//parent::*//parent::*//following-sibling::*[@class='mstrmojo-UnitContainer-content']//child::*[@class='mstrmojo-Xtab-content ']//child::*[text()='${objectName}'][@title]`
        );
    }

    /** Get first grid element
     * @param {string} visualizationName visualization name
     * @param {string} elementName Name of the Element
     * @returns {Promise<ElementFinder>} VisualizationName
     */
    getGridElement(elementName, visualizationName) {
        // Use the improved approach to get grid element
        const container = this.getContainerContent(visualizationName);
        return container.$('.mstrmojo-XtabZone').$('table[role="grid"]').$(`//td[text()="${elementName}"]`);
    }

    /** Get grid element for MDX-RA (Attribute in outline mode)
     * @param {string} visualizationName visualization name
     * @param {string} elementName Name of the Element
     * @returns {Promise<ElementFinder>} VisualizationName
     */
    getGridElementForMDXRA(elementName, visualizationName) {
        let path = `.//child::div[contains(@class, 'mstrmojo-scrollNode')]/div[contains(@class, 'mstrmojo-XtabZone')]//td//span[contains(text(),'${elementName}')]/../..`;
        return this.getContainerContent(visualizationName).$$(path)[0];
    }

    /** Get first grid element with hyper link
     * @param {string} visualizationName visualization name
     * @param {string} elementName Name of the Element
     * @returns {Promise<ElementFinder>} VisualizationName
     */
    getGridElementWithHyperLink(elementName, visualizationName) {
        // Use the improved approach to get grid element with hyperlink
        const container = this.getContainerContent(visualizationName);
        return container.$('.mstrmojo-XtabZone').$('table[role="grid"]').$(`//a[text()="${elementName}"]`);
    }

    getEncodedGridCell(cellValue, visualizationName) {
        // Use the improved approach to get encoded grid cell
        const container = this.getContainerContent(visualizationName);
        return container.$('.mstrmojo-XtabZone').$('table[role="grid"]').$(`//td/span[text()="${cellValue}"]`);
    }

    /**
     * Get grid cell at specific row/column position
     *
     * @param {int} row Row
     * @param {int} col Column
     * @param {string} visualizationName Visualization name
     *
     * @returns {Promise<ElementFinder>} Cell
     */
    getGridCellByPosition(row, col, visualizationName) {
        // Note: tbody[not(@n)] is necessary for selections made in "outline mode"
        let path = `${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class, 'mstrmojo-XtabZone')]//tbody[not(@n)]//tr[${row}]//td[${col}]`;
        return this.$(path);
    }

    getGridCellByPositioRegardlessFetchBlocks(row, col, visualizationName) {
        let path = `(${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class, 'mstrmojo-XtabZone')]//tbody//td[@r='${row}'])[${col}]`;
        return this.$(path);
    }

    /**
     * Get the text of the grid cell with link at specific row/column position
     *
     * @param {int} row Row
     * @param {int} col Column
     * @param {string} visualizationName Visualization name
     *
     * @returns {Promise<ElementFinder>} Cell
     */
    getGridCellTextWithLinkByPosition(row, col, visualizationName) {
        // Note: tbody[not(@n)] is necessary for selections made in "outline mode"
        let path = `${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class, 'mstrmojo-XtabZone')]//tbody[not(@n)]//tr[${row}]//td[${col}]/a`;
        return this.$(path);
    }

    getGridCellChildByPosition(row, col, visualizationName) {
        return this.getGridCellByPosition(row, col, visualizationName).$('./a');
    }

    getGridCellChildsvgByPosition(row, col, visualizationName) {
        return this.getGridCellByPosition(row, col, visualizationName).$('.//*[name() = "svg"]');
    }

    getGridCellChildWarningIconByPosition(row, col, visualizationName) {
        return this.getGridCellByPosition(row, col, visualizationName).$('.//span[@class="htmlEnc"]');
    }

    //#endregion

    //#region Column Set Selectors
    getColumnSetDropZone(columnSetName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${columnSetName}']/ancestor::div[contains(@class, 'mstrmojo-ColumnSetList-portlet') and contains(@style,'block')]//div[contains(@class,'content')]/div[@class='mstrmojo-ListBase mstrmojo-VIUnitList']/div`
        );
    }

    getColumnSetEndInEditorPanel(columnSetName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${columnSetName}']/ancestor::div[(contains(@class, 'mstrmojo-ColumnSetList') or contains(@class, 'mstrmojo-MicroChartList')) and contains(@class,'mstrmojo-VIPanelPortlet') and contains(@style,'display: block;')]/div[contains(@class,'mstrmojo-VIPanel-handle splitter v')]`
        );
    }

    getColumnSetInEditorPanel(columnSetName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${columnSetName}']/ancestor::div[(contains(@class, 'mstrmojo-ColumnSetList') or contains(@class, 'mstrmojo-MicroChartList') or contains(@class, 'mstrmojo-ActionButton-portlet')) and contains(@class,'mstrmojo-VIPanelPortlet') and contains(@style,'display: block;')]`
        );
    }

    getColumnSetItemInEditorPanel(columnSetName, itemName) {
        return this.getColumnSetInEditorPanel(columnSetName).$(
            `.//div[contains(@class, 'item unit action-button')]//span[text()='${itemName}']`
        );
    }

    getColumnsSectionTileBar() {
        return this.$(
            `//div[@class='title-text']/div[text()='Columns']/ancestor::div[contains(@class, 'mstrmojo-VITitleBar')]`
        );
    }

    getColumnsSectionSplitter() {
        return this.$(
            `//div[@class='title-text']/div[text()='Columns']/ancestor::div[contains(@class, 'mstrmojo-VIPanelPortlet') and contains(@style,'display: block;')]/div[contains(@class,'mstrmojo-VIPanel-handle splitter v')]`
        );
    }

    getColumnSetDragArea(columnSetName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${columnSetName}']/ancestor::div[contains(@class, 'mstrmojo-VITitleBar')]`
        );
    }

    getColumnSetExpandCollapse(columnSetName) {
        return this.getColumnSetDragArea(columnSetName).$(
            `./div[@class='left-toolbar']//div[contains(@class, 'mstrmojo-Image')]`
        );
    }

    getColumnSetTitleAtPos(columnSetPosition) {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-ColumnSetList-portlet')])[${columnSetPosition}]//div[contains(@class, 'mstrmojo-EditableLabel')]`
        );
    }

    getColumnSetDeleteButton(columnSetName) {
        return this.getColumnSetDragArea(columnSetName).$(
            `./div[@class='right-toolbar']//div[contains(@class, 'cls')]`
        );
    }

    getMicrochartEditButton(setName, microchartName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${setName}']/ancestor::div[contains(@class, 'mstrmojo-MicroChartList-portlet')]//span[text()='${microchartName}']/../div[contains(@class, 'edit')]`
        );
    }

    getDropZone(zone) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIVizEditor')]/descendant::div[text()='${zone}']/ancestor::div[@class='mstrmojo-VIPanel-titlebar']/following-sibling::div[@class='mstrmojo-VIPanel-content']/div/div`
        );
    }

    getObjectInColumnSetDropZone(desObject, columnSetName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${columnSetName}']/ancestor::div[contains(@class, 'mstrmojo-ColumnSetList-portlet') and contains(@style,'block')]//div[contains(@class,'content')]/div[@class='mstrmojo-ListBase mstrmojo-VIUnitList']/div//span[text()='${desObject}']`
        );
    }

    getObjectInColumnSetDropZone2(desObject, columnSetName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${columnSetName}']/ancestor::div[contains(@class, 'mstrmojo-ColumnSetList-portlet') and contains(@style,'block')]//div[contains(@class,'content')]/div[@class='mstrmojo-ListBase mstrmojo-VIUnitList']/div//span[text()='${desObject}']/ancestor::div[contains(@class,'item unit')]`
        );
    }

    getMicrochartDropZone(microchartName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${microchartName}']/ancestor::div[contains(@class, 'mstrmojo-MicroChartList-portlet') and contains(@style,'block')]//div[contains(@class,'content')]/div[@class='mstrmojo-ListBase mstrmojo-VIUnitList']/div`
        );
    }

    getObjectInMicrochartDropZone(desObject, microchartName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${microchartName}']/ancestor::div[contains(@class, 'mstrmojo-MicroChartList-portlet') and contains(@style,'block')]//div[contains(@class,'content')]/div[@class='mstrmojo-ListBase mstrmojo-VIUnitList']/div//span[text()='${desObject}']`
        );
    }

    getObjectInDropZone(desObject, zone) {
        return $(
            `//div[contains(@class, 'mstrmojo-VIVizEditor')]/descendant::div[text()='${zone}']/ancestor::div[@class='mstrmojo-VIPanel-titlebar']/following-sibling::div[@class='mstrmojo-VIPanel-content']/div/div/descendant::span[text()='${desObject}']`
        );
    }

    get editorPanelTab() {
        return this.$("//div[contains(@class, 'edt')]/div[contains(text(),'Editor')]");
    }

    get editorPanelVizTitle() {
        return this.$(
            `//*[contains(@class,"mstrmojo-VIVizEditor")]//div[contains(@class,"mstrmojo-VIBoxPanel-control")]//div[contains(@class,"mstrmojo-VITitleBar")]//div[contains(@class,"title-text")]//div[contains(@class,"mstrmojo-EditableLabel")]`
        );
    }

    get editorPanelVizTitleMenu() {
        return this.$(
            `//div[contains(@class,"mstrmojo-VIBoxPanelContainer-content")]//div[contains(@class,"mstrmojo-VIVizEditor")]//div[contains(@class,"mstrmojo-VIBoxPanel-control")]//div[contains(@class,"mstrmojo-VITitleBar")]//*[contains(@class,"right-toolbar")]//div[contains(@class,"mstrmojo-ListBase mstrmojo-VIToolbar mstrmojo-VITitleToolbar")]`
        );
    }

    get toolBox() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted')]/div[contains(@class, 'mstrmojo-ui-ToolbarPopup') and contains(@class, 'mstrmojo-ui-EditCharacter') and contains(@style, 'display: block')]`
        );
    }

    get currentDossierContextLinkBtn() {
        return this.$(
            `//div[contains(@class, 'contextual-link-editor')]//span[contains(@class, 'mstrmojo-TabButton') and position() = 1]`
        );
    }

    get addColumnSetIcon() {
        return this.$("//div[@class='item mstrmojo-multixtab-addcolumnset']//div[@class='icn']");
    }

    getWarningTooltips(tooltips) {
        const parts = tooltips.split(/<br>/);
        let newTooltips = `contains(text(), '${parts[0]}')`;
        for (let i = 1; i < parts.length; i++) {
            newTooltips += ` and contains(., '${parts[i]}')`;
        }
        const path =
            `//div[contains(@class,'mstrmojo-Tooltip') and contains(@style,'display: block;')]//div[contains(@class,'mstrmojo-Tooltip-content') and ` +
            newTooltips +
            `]`;
        return this.$(path);
    }

    getNewVisLinkTooltips(tooltips) {
        const parts = tooltips.split(/<br>/);
        let newTooltips = `contains(text(), '${parts[0]}')`;
        for (let i = 1; i < parts.length; i++) {
            newTooltips += ` and contains(., '${parts[i]}')`;
        }
        const path =
            `//div[contains(@class,'new-vis-tooltip') and contains(@style,'display: block;')]//div[contains(@class,'new-vis-tooltip-link') and ` +
            newTooltips +
            `]`;
        return this.$(path);
    }

    getButtonInWarningDialog(buttonName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-warning  mstrmojo-alert')]//div[contains(@class,'mstrmojo-Button-text') and text()='${buttonName}']`
        );
    }
    //#endregion

    //#region Dialog and Editor Selectors
    /** @type {Promise<ElementFinder>} */
    get renameEditor() {
        return this.$(
            `//div[@class='mstrmojo-Editor mstrmojo-rename-editor modal' and contains(@style,'display: block')]`
        );
    }

    /** @type {Promise<ElementFinder>} */
    get inputFieldFromRenameEditor() {
        return this.renameEditor.$(`.//input[contains(@class, 'mstrmojo-TextBox')]`);
    }

    /** @type {Promise<ElementFinder>} */
    get saveButtonFromRenameEditor() {
        return this.renameEditor.$(`.//div[contains(@class, 'mstrmojo-Button-text') and text()='Save']`);
    }

    get advancedSortWindow() {
        return this.$(
            `//div[contains(@class,'mstrmojo-AdvancedSortEditor')]//child::*[contains(text(),'Advance') and contains(text(),'Sort')]`
        );
    }

    get customSortWindow() {
        return this.$(`//div[contains(@class,'mstrmojo-CustomSortDisplayPanel')]`);
    }

    async getLinkFromGridCell(row, col, visualizationName) {
        return await this.getGridCellChildByPosition(row, col, visualizationName).getAttribute('href');
    }
}
