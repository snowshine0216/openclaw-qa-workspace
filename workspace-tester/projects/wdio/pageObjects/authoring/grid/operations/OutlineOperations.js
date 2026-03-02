import LoadingDialog from '../../../dossierEditor/components/LoadingDialog.js';

/**
 * Outline operations for grid
 */
export default class OutlineOperations {
    constructor(selectors) {
        this.selectors = selectors;
        this.loadingDialog = new LoadingDialog();
    }

    async expandOutlineFromColumnHeader(objectName, visualizationName) {
        const objectElement = await this.selectors.getGridObjectExpand(objectName, visualizationName);
        await this.selectors.waitForElementVisible(objectElement);
        // We can't use a direct clickOnElement here due to the
        // use of a pseudo-selector on the expand icon
        await this.selectors.clickOnElementByInjectingScript(objectElement);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    async collapseOutlineFromColumnHeader(objectName, visualizationName) {
        const objectElement = await this.selectors.getGridObjectCollapse(objectName, visualizationName);
        await this.selectors.waitForElementVisible(objectElement);
        // We can't use a direct clickOnElement here due to the
        // use of a pseudo-selector on the collapse icon
        await this.selectors.clickOnElementByInjectingScript(objectElement);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async confirmOutlineGridCollapsed(objectName, visualizationName) {
        let collapsedIcon = await this.selectors.getGridObjectExpand(objectName, visualizationName);
        return await collapsedIcon.isDisplayed();
    }

    async confirmOutlineGridExpanded(objectName, visualizationName) {
        let expandedIcon = await this.selectors.getGridObjectCollapse(objectName, visualizationName);
        return await expandedIcon.isDisplayed();
    }

    async expandOutlineFromElement(elementName, visualizationName) {
        const objectElement = await this.selectors.getGridElementExpand(elementName, visualizationName);
        // We can't use a direct clickOnElement here due to the
        // use of a pseudo-selector on the expand icon
        await this.selectors.click({ elem: objectElement });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async collapseOutlineFromElement(elementName, visualizationName) {
        const objectElement = await this.selectors.getGridElementCollapse(elementName, visualizationName);
        // We can't use a direct clickOnElement here due to the
        // use of a pseudo-selector on the collapse icon
        await this.selectors.click({ elem: objectElement });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }
} 