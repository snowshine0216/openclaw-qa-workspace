import BaseContainer from '../../BaseContainer.js';

/**
 * Grid validation methods
 * @extends BaseContainer
 */
export default class GridValidators extends BaseContainer {
    constructor(selectors) {
        super();
        this.selectors = selectors;
    }
    async isSaveDisabledForHeaderRename() {
        let saveButton = this.$(
            `//body/div[@class='mstrmojo-Editor-wrapper mojo-theme-light']/div[@class='mstrmojo-Editor mstrmojo-rename-editor modal']/div[@class='mstrmojo-Editor-buttons']//div[@class='mstrmojo-Button mstrmojo-WebButton hot mstrmojo-Editor-button mstrmojo-Editor-button disabled']`
        );
        await this.waitForElementVisible(saveButton);
        return saveButton.isDisplayed();
    }

    /**
     * verifies if the group editor is open
     * @returns {Promise<boolean>} true if the group editor is present on screen
     * @author Eduardo Alcazar-Bustillos <ebustillos@microstrategy.com>
     */
    async isGroupEditorOpen() {
        let groupEditor = this.$(
            `//div[@id='mstrmojo-derivedElements']//div[@class='mstrmojo-Editor-title-container']//div[contains(text(), 'Group') and contains(text(), 'Editor')]/../..//div[@class='mstrmojo-VIGroupDERow new']`
        );
        await this.waitForElementVisible(groupEditor);
        return groupEditor.isDisplayed();
    }

    /**
     * verifies if the group editor is open for a specific group
     * As in, if you right click a group in the grid and select "Edit Group"
     * or if you opened the group editor from the header then selected a specific group
     * @param {string} groupName name of the group you want the editor to be open for
     * @returns {Promise<boolean>} true if the editor is opened for the specific group
     * @author Eduardo Alcazar-Bustills <ebustillos@microstrategy.com>
     */
    async isGroupEditorOpenForSpecificGroup(groupName) {
        let groupEditor = this.$(
            `//div[@id='mstrmojo-derivedElements']/div[@class='mstrmojo-Editor mstrmojo-DerivedElementsEditor modal' and contains(@style, 'display: block')]//div[starts-with(@class, 'mstrmojo-VIGroupDERow new') and contains(@class,'isEdit')]//div[@class='mstrmojo-EditableLabel mstrmojo-new-DEName hasEditableText' and text()='${groupName}']`
        );
        await this.waitForElementVisible(groupEditor);
        return groupEditor.isDisplayed();
    }

    /**
     * verifies that a header has no thresholds applied
     * @param {string} headerName header you want to verify has no thresholds
     * @param {string} visualizationName visualization that contains the header you're checking
     * @returns {Promise<boolean>} should return false because if there are no thresholds applied then "Clear Thresholds" shouldn't appear in the header menu
     */
    async noThresholdsPresentOnObject(headerName, visualizationName) {
        await this.selectors.rightClickOnHeader(headerName, visualizationName);
        await this.selectors.sleep(1.5);
        return this.selectors.getContextMenuItem('Clear Thresholds').isDisplayed();
    }

    /**
     * check whether the object is on the Grid Visualization
     * @param {string} objectName - MSTR object name
     * @param {string} visualizationName - visualization Name
     */
    async existObjectByName(objectName, visualizationName) {
        let objectElement = await this.selectors.getGridObjectHeader(objectName, visualizationName);
        await this.waitForElementVisible(objectElement);
        return objectElement.isDisplayed();
    }

    /**
     * Check whether there is Replace with option present on the Grid object
     * @param {string} objectName
     * @param {string} visualizationName - Name of the visualization
     * @param {String} targetObject - Whether the target object present or not
     * @returns {boolean}
     */
    async existReplaceByOption(objectName, visualizationName, targetObject) {
        let el = await this.selectors.getObjectHeader(objectName, visualizationName);
        let cntxt = await this.selectors.getSecondaryContextMenu(targetObject);
        await this.selectors.rightClick({ elem: el });
        await this.selectors.click({ elem: this.selectors.getContextMenuOption('Replace With') });
        await this.waitForElementVisible(cntxt);
        return cntxt.isDisplayed();
    }

    /**
     * Check whether there Drill option present on the Grid object
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     * @param {String} targetObject - Whether the target object present or not
     * @returns {boolean}
     */
    async existDrillOption(objectName, visualizationName, targetObject) {
        let el = await this.selectors.getObjectHeader(objectName, visualizationName);
        let cntxt = await this.selectors.getSecondaryContextMenu(targetObject);
        await this.selectors.rightClick({ elem: el });
        await this.selectors.click({ elem: this.selectors.getContextMenuOption('Drill') });
        await this.waitForElementVisible(cntxt);
        return cntxt.isDisplayed();
    }

    /**
     * To check whether element is present or not
     * @param {string} elements     the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @returns {Promise<boolean>}
     */
    async isElementPresent(element, objectName, visualizationName) {
        let objectElement = await this.selectors.getGridObject(visualizationName, element);
        await this.waitForElementVisible(objectElement);
        return objectElement.isDisplayed();
    }

    async getAllGridObjectCount(visualizationName) {
        return this.selectors.getAllGridObject(visualizationName).length;
    }

    // to check whether header is locked (rendered twice) or not
    getObjectHeaderToVerifyLock(objectName, visualizationName) {
        let path = `${this.selectors.getContainerPath(
            visualizationName
        )}//div[contains(@class,'mstrmojo-XtabZone')]//td[text()='${objectName}']`;
        return this.$(path).length;
    }

    async getGridCellCSSPropertyByPosition(row, col, visualizationName, property) {
        let cell = await this.selectors.getGridCellByPosition(row, col, visualizationName);
        return cell.getCSSProperty(property);
    }

    async isOutlinePresentForGridObject(objectName, visualizationName) {
        let outline = await this.selectors.getGridObjectOutline(objectName, visualizationName);
        // await this.waitForElementVisible(outline);
        return outline.isDisplayed();
    }

    async getGridCellTextByPosition(row, col, visualizationName) {
        //div[contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class, 'mstrmojo-XtabZone')]//tbody[not(@n)]//tr[${row}]//td[${col}]
        let cell = this.selectors.getGridCellByPosition(row, col, visualizationName);
        // await cell.scrollIntoView();
        let text = await cell.getText();
        return text;
    }
}
