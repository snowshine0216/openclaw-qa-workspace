import LoadingDialog from '../../../dossierEditor/components/LoadingDialog.js';
import Common from '../../Common.js';
import GridCellOperations from './GridCellOperations.js';
import BasePage from '../../../base/BasePage.js';

/**
 * Group operations for grid elements
 */
export default class GroupOperations extends BasePage {
    constructor(selectors) {
        super();
        this.selectors = selectors;
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
        this.gridCellOperations = new GridCellOperations(selectors);
    }

    /**
     * Create a group with the selected elements
     * @param {Array} elements      the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName        the group name
     */
    async groupElements(elements, objectName, visualizationName, groupName) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.selectors.getGridElement(arrString[i], visualizationName));
        }
        await this.groupElementsHelper(arrElements, groupName);
    }

    /**
     * Create a group for RA-MDX
     * @param {Array} elements      the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName        the group name
     */
    async groupElements2(elements, objectName, visualizationName, groupName) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.selectors.getGridElement2(arrString[i], visualizationName));
        }
        await this.groupElementsHelper(arrElements, groupName);
    }

    /**
     * Helper function for grouping that can also be used by agGrid
     * @param {*} arrElements Array of elements (cells) to group
     * @param {*} groupName default is Group 1 if none passed
     */
    async groupElementsHelper(arrElements, groupName) {
        await this.selectors.moveAndClickByOffsetFromMultiElements({ elements: arrElements });
        await this.selectors.rightClick({ elem: arrElements[0] });
        let group = this.common.getContextMenuItem('Group');
        await this.selectors.waitForElementVisible(group);
        await this.selectors.click({ elem: group });
        await this.inputFieldRenameHelper(groupName);
    }

    /**
     * Input a value in the rename editor
     * @param {*} newName new name. Otherwise, just use the default
     */
    async inputFieldRenameHelper(newName) {
        // rename if given, else use default
        if (newName) {
            let el = await this.selectors.inputFieldFromRenameEditor;
            await this.selectors.renameTextField(newName);
        }
        let saveBtn = this.selectors.saveButtonFromRenameEditor;
        await this.selectors.click({ elem: saveBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Create a group with the selected elements by partial value
     * @param {Array} elements      the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName        the group name
     */
    async groupElementsByPartialValue(elementPartialValue, objectName, visualizationName, groupName) {
        let obj1 = await this.selectors.getElementByPartialValueByViz(visualizationName, elementPartialValue);
        await this.selectors.multiSelectElementsUsingCommandOrControl(obj1);
        await this.selectors.rightClick({ elem: obj1[0] });
        await this.selectors.click({ elem: this.selectors.getContextMenuOption('Group') });
        await this.selectors.inputFieldFromRenameEditor.clearValue();
        await this.selectors.setValue(groupName, this.selectors.inputFieldFromRenameEditor);
        await this.selectors.click({ elem: this.selectors.saveButtonFromRenameEditor });
    }

    /**
     * Ungroup elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName        the group name
     */
    async ungroupElements(objectName, visualizationName, groupName) {
        let selectElementGroup = await this.selectors.getGridObject(groupName, visualizationName);
        await this.selectors.rightClick({ elem: selectElementGroup });
        await this.selectors.click({ elem: this.selectors.getContextMenuOption('Ungroup') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Upgroup a group that is in outline mode (group for RA-MDX)
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName        the group name
     */
    async ungroupElements2(objectName, visualizationName, groupName) {
        let selectElementGroup = await this.selectors.getGridElement2(groupName, visualizationName);
        await this.selectors.rightClick({ elem: selectElementGroup });
        await this.selectors.click({ elem: this.selectors.getContextMenuOption('Ungroup') });
    }

    /**
     * Create a group with the selected elements for calculations
     * @param {Array} elements      the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName        the group name
     * @param {string} calculationMenu Calculation menu for "add, average, greatest, least"
     */
    async groupElementsForCalculation(elements, visualizationName, groupName, calculationMenu) {
        // let arrString = elements.split(', ');
        // let arrElements = [];
        // for (const element of elements) {
        //     arrElements.push(await this.selectors.getGridElement(element, visualizationName));
        // }
        // await this.selectors.multiSelectElementsUsingCommandOrControl(arrElements);
        const arrElements = await this.gridCellOperations.selectMultipleElements(elements, visualizationName);
        await this.selectors.rightClick({ elem: arrElements[0] });
        await this.selectors.click({ elem: this.selectors.getContextMenuOption('Calculation') });
        await this.selectors.click({ elem: this.common.getSecondaryContextMenu(calculationMenu) });
        let inputField = await this.selectors.inputFieldFromRenameEditor;
        await this.setValueByJavaScript({ element: inputField, value: groupName });
        // await inputField.clearValue();
        // await inputField.setValue(groupName);
        await this.selectors.click({ elem: this.selectors.saveButtonFromRenameEditor });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async addElementsToExistingGroup(elements, visualizationName, groupName) {
        // let arrString = elements.split(', ');
        let arrElements = [];
        for (const element of elements) {
            arrElements.push(await this.selectors.getGridElement(element, visualizationName));
        }
        await this.selectors.multiSelectElementsUsingCommandOrControl(arrElements);
        await this.selectors.rightClick({ elem: arrElements[0] });
        await this.selectors.click({ elem: this.selectors.getContextMenuOption('Add to Group') });
        await this.selectors.click({ elem: this.common.getSecondaryContextMenu(groupName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * edits a calculation group by changing the operation type, this is for calculation groups made under attributes not metrics
     * @param {string} newCalculation the new calculation to be used for the calculation group
     * @param {string} groupName the name of the group/object that is going to be edited
     * @param {string} visualizationName name of the visualization that contains the group
     * @author Eduardo Alcazar-Bustillos <ebustillos@microstrategy.com>
     */
    async editCalculationGroup({ newCalculation, groupName, visualizationName }) {
        await this.selectors.rightClick({ elem: this.selectors.getGridObject(groupName, visualizationName) });
        await this.selectors.click({ elem: this.common.getContextMenuItem('Edit Calculation') });
        await this.selectors.click({ elem: this.common.getSecondaryContextMenu(newCalculation) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * delete a calculation group , this is for calculation groups made under attributes not metrics
     * @param {string} groupName the name of the group/object that is going to be edited
     * @param {string} visualizationName name of the visualization that contains the group
     * @author fsuo
     */
    async deleteCalculationGroup(groupName, visualizationName) {
        await this.selectors.rightClick({ elem: this.selectors.getGridObject(groupName, visualizationName) });
        await this.selectors.click({ elem: this.common.getContextMenuItem('Delete Calculation') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    /**
     * edits an attribute group by opening the group editor for a single group in the grid
     * @param {string} groupName the name of the group/object that is going to be edited
     * @param {string} visualizationName name of the visualization that contains the group
     * @author Eduardo Alcazar-Bustillos <ebustillos@microstrategy.com>
     */
    async editGroup(groupName, visualizationName) {
        await this.selectors.rightClick({ elem: this.selectors.getGridObject(groupName, visualizationName) });
        await this.selectors.click({ elem: this.common.getContextMenuItem('Edit Group...') });
    }

    /**
     * rename a group from the grid
     * @param {string} groupName name of the group you want to rename
     * @param {string} visualizationName name of the visualization that contains the group
     * @param {string} newGroupName new name for the group
     */
    async renameGroup(groupName, visualizationName, newGroupName) {
        await this.selectors.rightClick({ elem: this.selectors.getGridObject(groupName, visualizationName) });
        await this.selectors.click({ elem: this.common.getContextMenuItem('Rename...') });
        let txtBox = this.selectors.$(
            `//div[@id='mstrmojo-renameDerivedElement']//div[@class='mstrmojo-vi-TwoColumnProp']//input[@title='']`
        );
        await this.selectors.click({ elem: txtBox });
        for (let i = 0; i < groupName.length; i++) {
            await browser.keys(Key.Backspace);
        }
        await txtBox.setValue(newGroupName);
        await this.selectors.click({
            elem: this.selectors.$(`//div[@id='mstrmojo-renameDerivedElement']//div[@title='']/div[.='Save']`),
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async groupElementsToAverageCalculation({ elements, visualizationName, groupName }) {
        await this.groupElementsForCalculation(elements, visualizationName, groupName, 'Average');
    }

    async groupElementsToSumCalculation(elements, visualizationName, groupName) {
        await this.groupElementsForCalculation(elements, visualizationName, groupName, 'Add');
    }
}
