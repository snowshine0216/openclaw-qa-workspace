import BasePage from '../base/BasePage.js';
import BaseContainer from './BaseContainer.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import Common from './Common.js';

/** 
 * Page representing the Responsive Grouping Editor
 * @extends BasePage
 */

//let path = require('path');

export default class ResponsiveGroupingEditor extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
        this.baseContainer = new BaseContainer();
    }

    /**
     * Gets the grouping editor toolbar
     */
    get groupingToolbar(){
        return this.$(`//div[@id='mstrmojo-RootView-inlineDialog']//div[contains(@class,'mstrmojo-grouping')]`);
    }

    get messageFromGroupingToolbar(){
        return this.groupingToolbar.$(`.//div[@class='mstrmojo-Label' and text()='Multi-select containers to group for the responsive view (width ≤ 768px).']`)
    }

    /**
     * Gets the responsive preview button on grouping editor toolbar
     */
    get toolbarPreviewButton(){
        return this.groupingToolbar.$(`.//div[contains(@class,'buttons')]//div[contains(@class,'previewBtn')]`);
    }

    /**
     * Gets the grouping save or cancel button on grouping editor toolbar
     */
    getToolbarSaveCancelButton(txt){
        return this.groupingToolbar.$(`.//div[contains(@class,'buttons')]//div[text()='${txt}']`);
    }

    /**
     * Gets the list of selected boxes of the currently selected group
     */
    get selectedBoxes(){
        return  this.$(`//div[contains(@class,'mstrmojo-UnitContainer')]//div[contains(@class,'highlight')]`);
    }

    /**
     * Gets the given group's toolbar button on grouping editor toolbar
     */
    getGroupButtonFromToolbar(groupName){
        return this.groupingToolbar.$(`.//div[contains(@class,'mstrmojo-VITab-tab')]//div[text()='${groupName}']`);
    }

    /**
     * Gets the given group's remove button on grouping editor toolbar
     */
    getGroupRemoveButton(groupName){
        return this.getGroupButtonFromToolbar(groupName).$$(`./ancestor::div[contains(@class,'mstrmojo-VITab')]//div[contains(@class,'mstrmojo-VITab-menu')]`)[0];
    }

    /**
     * Gets the given box container's group button
     */
    getBoxGroupButton(boxName){
        return this.baseContainer.getContainer(boxName).$(`.//div[contains(@class,'btnGroup')]`);
    }

    /**
     * Gets the selected status of a box
     */
    getIsBoxSelected(boxName){
        return this.baseContainergetContainer(boxName).$(`.//div[contains(@class,'highlight')]`);
    }

    /**
     * Gets the given box container's context menu
     */
    getContainerMenuButton(box){
        return box.$(`.//div[contains(@class,'btnMenu')]`);
    }

    /**
     * Group the list of containers given
     */
    async groupContainers(boxNames){
        let boxList = boxNames.split(',');
        for (var i = 0; i < boxList.length; i++) {
            let container = await this.baseContainer.getContainerExact(boxList[i].trim()); 
            await this.clickOnElement(container);
        }

        let groupButton = await this.getBoxGroupButton(boxList[i-1].trim()); // last box
        //await browser.waitUntil(EC.presenceOf(groupButton));
        await this.clickOnElement(groupButton);
    }

    // Click on container context menu and select @cmOption
    // Pre-condition: you might need to click on container to select it first if it's not selected 
    async actionFromContainerMenu(containerName, cmOption){
        let el = await this.baseContainergetContainer(containerName); 
        await this.hoverMouseOnElement(el); 
        let contextMenu = await this.getContainerMenuButton(el);
        await this.clickOnElement(contextMenu); 
        let cm = await common.getContextMenuItem(cmOption); 
        await browser.waitUntil(EC.presenceOf(cm));
        await this.clickOnElement(cm); 
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed(); 
    }

    // right click on container and select @cmOption
    // Pre-condition: you might need to click on container to select it first if it's not selected yet
    async actionFromContainerContextMenu(containerName, cmOption){
        let el = await this.baseContainergetContainer(containerName); 
        await this.rightMouseClickOnElement(el); 
        let cm = await this.common.getContextMenuItem(cmOption); 
        await this.clickOnElement(cm); 
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(); 
    }

    /**
     * Delete a given group via toolbar button
     */
    async deleteGroupFromToolbar(groupName){
        await this.clickOnElement(await this.getGroupRemoveButton(groupName));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }


    // /**
    //  * Merge two groups
    //  */
    // async mergeGroups(srcGroupName,dstGroupName){
    //     let boxes = await this.selectGroupAndGetBoxes(srcGroupName);
    //     for (let box of boxes) {
    //         await this.clickOnElement(box); // Select each box one by one to populate valid context menu options
    //         let menuButton = await this.getContextMenu(box);
    //         await this.clickOnElement(menuButton);

    //         let moveOption = this.getBoxContextMenuOption("Move to " + dstGroupName);
    //         let addOption = this.getBoxContextMenuOption("Add to " + dstGroupName);
    //         let canMove = await moveOption.isPresent();
    //         if (canMove) { // Move to option is present on src group's containers as long as src group has not been deleted
    //             await this.clickOnElement(moveOption);
    //         }
    //         else { // Move to option is absent on src group's last container because the src group has just been deleted
    //             await this.clickOnElement(addOption);
    //         }
    //     }
    // }


    /**
     * Select the given group from the group's toolbar button 
     */
    async selectGroup(groupName){
        await this.clickOnElement(this.getGroupButtonFromToolbar(groupName));
    }

    async clickSaveCancelBotton(buttonName) {
        let button = await this.getToolbarSaveCancelButton(buttonName);
        await this.clickOnElement(button);
    }

}