import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import Common from './Common.js';
import { Key } from 'webdriverio';

/**
 * Page representing the Group Editor
 * @extends BasePage
 * @author Chuanhao Ma <chuanhaoma@microstrategy.com>
 */
export default class GroupEditor extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
    }
    // element locations
    getGroupEditor() {
        return this.$('.mstrmojo-DerivedElementsEditor');
    }

    getAttributeInEditorPanel(attributeName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIBoxPanel mstrmojo-VIVizEditor')]//span[text()='${attributeName}']/../../..`
        );
    }

    getAttributeColumnHeader(attributeName) {
        return this.$(`(//div[contains(@class, 'mstrmojo-UnitContainer-content')]//td[text()='${attributeName}'])[2]`);
    }

    // ----- Group level element -------
    getElementEditPanel() {
        return this.getGroupEditor().$('.mstrmojo-DerivedElementPanel');
    }

    getAvailableAttributeElementByName(elementName) {
        const el = elementName.replace(/ /g, '\u00a0');
        return this.$(`//div[contains(@class, 'mstrmojo-ListBase mstrmojo-AvailableElements')]//div[text()='${el}']`);
    }

    // index starts from 0
    getAvailableAttributeElementByIndex(index) {
        return this.$(`//div[contains(@class, 'mstrmojo-ListBase mstrmojo-AvailableElements')]//div[@idx='${index}']`);
    }

    getSelectedAttributeElementByName(elementName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ListBase mstrmojo-SelectedElements')]//div[text()='${elementName}']`
        );
    }

    getSelectedAttributeElementByIndex(index) {
        return this.$(`//div[contains(@class, 'mstrmojo-ListBase mstrmojo-SelectedElements')]//div[@idx='${index}']`);
    }

    get groupNameDivForGroup() {
        return this.$(`//div[contains(@class, 'mstrmojo-EditableLabel mstrmojo-new-DEName hasEditableText')]`);
    }

    get clearButtonForGroup() {
        return this.getGroupEditor().$('.title-area .clear-btn');
    }

    get okButtonForGroup() {
        return this.getGroupEditor().$('.okBtn');
    }

    get cancelButtonForGroup() {
        return this.getGroupEditor().$('.cancelBtn');
    }

    get searchInputForGroup() {
        return this.getGroupEditor().$('.title-area .mstrmojo-SearchBox-input');
    }

    get clearSearchInputButtonForGroup() {
        return this.getGroupEditor().$('.title-area .mstrmojo-SearchBox-search.clear');
    }

    get selectedArea() {
        return this.getGroupEditor().$(
            `//table[@class='mstrmojo-HBox cart-table']//td[4]//div[contains(@class, 'mstrmojo-SelectedElements')]`
        );
    }

    getAttributeElementInSelectedArea(name) {
        return this.selectedArea.$(`//div[text()='${name}']`);
    }

    // --------- Group Editor level element ------------
    // Save or Cancel
    getBtnForGroupEditor(btn) {
        return this.getGroupEditor().$(`//div[contains(@class, 'mstrmojo-WebButton')]//div[text()='${btn}']`);
    }

    get exitButtonForEditor() {
        return this.getGroupEditor().$('.mstrmojo-Editor-close');
    }

    get NDENameInputForEditor() {
        return this.$(`//div[contains(@class, 'attrNameEdit')]//input`);
    }

    get addGroupButtonForEditor() {
        return this.getGroupEditor().$(`//div[text()='Add a Group']`);
    }

    get allOtherElementDisplayDropdown() {
        return this.getGroupEditor().$('.mstrmojo-others-rule');
    }

    get editableGroupNameInputLabel() {
        return this.$(`//div[contains(@class, 'mstrmojo-EditableLabel mstrmojo-edit-DEName')]`);
    }

    // Hint: The name of group can be the same
    getGroupByNameFromEditor(groupName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ListBase mstrmojo-VIGroupDEList')]//div[text()='${groupName}']`
        );
    }

    getGroupDeleteFromEditor(groupName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ListBase mstrmojo-VIGroupDEList')]//div[text()='${groupName}']/../../div[contains(@class, 'mstrmojo-group-delete')]`
        );
    }

    async multiSelectAndDnDtoSelectedArea(attributeName1, attributeName2) {
        await browser.keys([Key.Shift]);
        const attribute1 = this.getAvailableAttributeElementByName(attributeName1);
        const attribute2 = this.getAvailableAttributeElementByName(attributeName2);
        await this.clickOnElement(attribute1);
        await this.clickOnElement(attribute2);
        await browser.keys([Key.Shift]);
        const targetArea = this.selectedArea;
        await this.dragAndDropObjectWithExtraMove(attribute1, targetArea, 0, 0, true);
    }

    async moveGroupByPosition(sourceGroupName, targetGroupName, relativePosition) {
        const sGroup = this.getGroupByNameFromEditor(sourceGroupName);
        const tGroup = this.getGroupByNameFromEditor(targetGroupName);
        let moveX = 0;
        let moveY = 0;
        switch (relativePosition) {
            //case 'left': moveX = -10; break;
            //case 'right': moveX = 10; break;
            case 'bottom':
                moveY = 10;
                break;
            case 'up':
                moveY = -10;
                break;
        }
        await this.dragAndDropObjectWithExtraMove(sGroup, tGroup, moveX, moveY, true);
    }

    async calculateGroupRect(groupName) {
        //const el = await this.getContainer(containerName);
        const el = await this.getGroupByNameFromEditor(groupName);
        const elRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', el);
        return elRect;
    }

    async groupRelativePosition(groupName1, groupName2, relativePosition) {
        const container1Rect = await this.calculateGroupRect(groupName1);
        const container2Rect = await this.calculateGroupRect(groupName2);
        switch (relativePosition) {
            case 'left':
                return container1Rect.left - container2Rect.right;
            case 'right':
                return container2Rect.left - container1Rect.right;
            case 'up':
                return container1Rect.top - container2Rect.bottom;
            case 'bottom':
                return container2Rect.top - container1Rect.bottom;
            default:
                return 0;
        }
    }

    // Group level operation function
    async openGroupEditor({ isFromGrid, isCreate, attributeName }) {
        const attribute = isFromGrid
            ? await this.getAttributeColumnHeader(attributeName)
            : await this.getAttributeInEditorPanel(attributeName);
        await this.rightMouseClickOnElement(attribute);
        const subMenu = isCreate
            ? await this.common.getContextMenuItemRevamp('Create Groups...')
            : await this.common.getContextMenuItemRevamp('Edit Groups...');
        await this.clickOnElementByInjectingScript(subMenu);
        await this.waitForElementVisible(this.getGroupEditor());
    }

    async renameGroup(newName) {
        await this.replaceTextByClickingOnElement(this.groupNameDivForGroup, newName + Key.Enter);
    }

    async selectElement(reference) {
        let el;
        if (typeof reference === 'string') {
            el = this.getAvailableAttributeElementByName(reference);
        } else {
            el = this.getAvailableAttributeElementByIndex(reference);
        }
        await this.waitForElementPresence(el);
        await this.clickOnElementByInjectingScript(el);
        await this.doubleClickOnElement(el);
    }

    /**
     * Select elements to create a group in group editor
     * @param {Array} references
     */
    async selectElements(references) {
        for (const element of references) {
            // if the element is a string, then it is a name
            let el;
            if (typeof element === 'string') {
                el = this.getAvailableAttributeElementByName(element);
            } else {
                el = this.getAvailableAttributeElementByIndex(element);
            }
            await this.waitForElementPresence(el, { timeout: 60000 });
            // await this.clickOnElementByInjectingScript(el);
            await this.click({ elem: el });
            await this.doubleClickOnElement(el);
        }
    }

    async deSelectElement(reference) {
        if (typeof reference === 'string') {
            await this.clickOnElementByInjectingScript(this.getSelectedAttributeElementByName(reference));
            await this.doubleClickOnElement(this.getSelectedAttributeElementByName(reference));
        } else {
            await this.clickOnElementByInjectingScript(this.getSelectedAttributeElementByIndex(reference));
            await this.doubleClickOnElement(this.getSelectedAttributeElementByIndex(reference));
        }
    }

    async typeSearchKey(searchKey) {
        await this.replaceTextByClickingOnElement(this.searchInputForGroup, searchKey + Key.Enter);
    }

    // Editor level operation function
    async renameNDE(newName) {
        await this.replaceTextByClickingOnElement(this.NDENameInputForEditor, newName + Key.Enter);
    }

    async clickElementAndWait(element) {
        await this.clickOnElement(element);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async renameGroupFromEditor(oldName, newName) {
        // Double Click on the group name label does not work in firefox, so we have to have a workaround for it
        // TODO: fix the double click for firefox
        const browserName = (await browser.getCapabilities()).browserName?.toLowerCase();
        if (browserName === 'firefox') {
            await this.clickOnElement(this.getGroupByNameFromEditor(oldName));
            await this.renameGroup(newName);
            await this.clickOnElement(this.okButtonForGroup);
        } else {
            await this.doubleClickOnElement(this.getGroupByNameFromEditor(oldName));
            const label = this.editableGroupNameInputLabel;
            await this.replaceTextByClickingOnElement(label, newName + Key.Enter);
        }
    }

    async deleteGroupFromEditor(name) {
        await this.clickOnElement(this.getGroupDeleteFromEditor(name));
    }

    async editGroupFromEditor(name) {
        await this.clickOnElement(this.getGroupByNameFromEditor(name));
    }

    async displayAllOtherElementByItems() {
        await this.clickOnElement(this.allOtherElementDisplayDropdown);
        await this.clickOnElement(this.common.getPopupListItem('individual items'));
    }

    async displayAllOtherElementByGroup() {
        await this.clickOnElement(this.allOtherElementDisplayDropdown);
        await this.clickOnElement(this.common.getPopupListItem('a consolidated group'));
    }

    async createGroups({ groupElements, groupNames }) {
        for (let i = 0; i < groupElements.length; i++) {
            await this.selectElements(groupElements[i]);
            if (groupNames && groupNames[i]) {
                await this.renameGroup(groupNames[i]);
            }
            await this.click({ elem: this.okButtonForGroup });
            if (i < groupElements.length - 1) {
                await this.click({ elem: this.addGroupButtonForEditor });
            } else {
                await this.click({ elem: this.getBtnForGroupEditor('Save') });
            }
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async createGroupsFromEditorPanel({ attributeName, groupElements, groupNames }) {
        await this.openGroupEditor({ isFromGrid: false, isCreate: true, attributeName });
        await this.createGroups({ groupElements, groupNames });
    }
}
