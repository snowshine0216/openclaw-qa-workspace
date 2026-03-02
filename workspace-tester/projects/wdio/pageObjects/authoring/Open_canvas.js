import BasePage from '../base/BasePage.js';
import BaseContainer from './BaseContainer.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import Common from './Common.js';
import { scrollIntoView } from '../../utils/scroll.js';

//let freeformPositionAndSize = new (require('./FreeformPositionAndSize.js'))();


/** 
 * Page represing the freeform layout
 * @extends BasePage
 */

export default class Open_Canvas extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
        this.baseContainer = new BaseContainer();
    }

    get DocPanel(){
        return this.$(`.mstrmojo-DocPanel-wrapper[style*='display: block']`); 
    }

    get ContainerArea(){
        return this.DocPanel.$$('./div/div')[0];
    }

    get FormatPanelContent(){
        return this.$(`.mstrmojo-vi-PropEditor .mstrmojo-VIPanelContents .mstrmojo-Box`); 
    }
    
    get AutoCavasButtonFromToolbar(){
        return this.$('.mstrmojo-VIToolbar .toggleManualMode.on'); 
    }

    get OpenCavasButtonFromToolbar(){
        return this.$('.mstrmojo-VIToolbar .toggleManualMode'); 
    }

    get HoverDragIcon(){
        return this.$('.hover-drag-icon-btn.visible'); 
    }

    get SelectedGroup(){
        return this.$('.mstrmojo-GroupContainer.selected')
    }

    get HoverMenuButtonForSelectedGroup(){
        return this.selectedGroup.$('.hover-menu-btn.visible')
    }

    // If group is not selected, we have to locate the group through its child 
    // Even if it's renamed, we cannot lcoate the group by its name as name is only available in layers panel 
    getGroupwithChild(containerName){
        return this.baseContainer.getContainerExact(containerName).$(`./parent::div[contains(@class,'mstrmojo-GroupContainer')]`);
    }

    getHoverMenuButtonForSpecificGroup(containerName){
        return this.getGroupwithChild(containerName).$$('.hover-menu-btn')[0];
    }


    async clickOnOpenCanvasButton(){
        let openCanvas = await this.OpenCavasButtonFromToolbar; 
        await this.clickOnElement(openCanvas);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();   
    }

    async clickOnAutoCanvasButton(){
        let autoCanvas = await this.AutoCavasButtonFromToolbar; 
        await this.clickOnElement(autoCanvas);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // click on canvas to deselect all containers 
    // De-select containers is triggered in mouse-up event 
    async clickOnCanvas(){
        let el =  await this.ContainerArea; 
        await browser.execute(function(element) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            element.dispatchEvent(clickEvent);
        }, el);
    
        await browser.execute(function(element) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mouseup', true, true);
            element.dispatchEvent(clickEvent);
        }, el);
    }

    // fsuo 02/20/2020: Cannot work if containers are overlapped with each other 
    /* Multi-select containers and select "cmOptions" from the context menu
    * @param {string} containerNameList: container names separated by comma
    * @param {string} cmOption: the option from the context menu, like 'Group'
    */
    async multiSelectContainerAndTakeCMOption(containerNameList,cmOption){
        let containerArray = containerNameList.split(",");
        containerArray[0] = await this.baseContainer.getContainerExact(containerArray[0].trim());
        await this.clickOnElement(containerArray[0]);
        for (let i=1; i < containerArray.length;i++){
            containerArray[i] = await this.baseContainer.getContainerExact(containerArray[i].trim());
            await this.ctrlClick({ elem: containerArray[i], checkClickable: false });
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();     
        }
       //await this.baseContainer.multiSelectElementsUsingCommandOrControl(containerArray);
        await this.rightMouseClickOnElement(containerArray[0]);
        await this.clickOnElement(this.common.getContextMenuItem(cmOption));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openAndTakeContextMenuByRMC(containerName, cmOption) {
        let container = await this.baseContainer.getContainerExact(containerName);
        await this.rightMouseClickOnElement(container);
        await this.clickOnElement(this.common.getContextMenuItem(cmOption));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openAndTakeContextMenuByRMCTitle(containerName, cmOption) {
        let container = await this.baseContainer.getContainerTitlebar(containerName);
        await this.rightMouseClickOnElement(container);
        await this.clickOnElement(this.common.getContextMenuItem(cmOption));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openContextMenuByRMC(containerName) {
        let container = await this.baseContainer.getContainerExact(containerName);
        await this.rightMouseClickOnElement(container);
    }

   async multiSelectContainersFromCanvas(containerList){
        let containerArray = containerList.split(",");
        for (let i = 0; i < containerArray.length; i++) {
            let containerName = containerArray[i].trim();
            // Calculate container position
            let pos = await this.baseContainer.calculateContainerRect(containerName);
            // Store position in localStorage
            await browser.execute((name, position) => {
                window.localStorage.setItem(name, JSON.stringify(position));
            }, containerName, pos);
            // Update containerArray with container elements
            containerArray[i] = await this.baseContainer.getContainerExact(containerName);
        }
        await this.baseContainer.multiSelectElementsUsingCommandOrControl(containerArray);
    }
    

    /* Move by selected group by pixel/percentage 
    * @param {string} moveX: move to "100" px right
    * @param {string} moveY: move to "100" px down
    */
   async moveSelectedGroup(moveX, moveY){
       let el = await this.HoverDragIcon;
       await el.waitForDisplayed(); 
       if (moveX.includes("%") || moveY.includes("%")){
            let canvasEl = await this.ContainerArea; 
            let canvasRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', canvasEl); 
            moveX = canvasRect.width * parseFloat(moveX) / 100; 
            moveY = canvasRect.height * parseFloat(moveY) / 100;
        }
        moveX = Math.round(parseFloat(moveX));
        moveY = Math.round(parseFloat(moveY));

        await this.dragAndDropByPixel(el,moveX, moveY); 
   }


   /* fsuo 02/27/2020: click on the context menu of currently selected group and select "cmOption" from context menu
    * @param {string} cmOption: the option from the context menu, like 'Bring to Front', 'Ungroup'
    */
   async selectedGroupContextMenuAction(cmOption){
       let btn = await this.HoverMenuButtonForSelectedGroup;
       await this.clickOnElementByInjectingScript(btn);
       let el = await this.common.getContextMenuItem(cmOption);
       await browser.waitUntil(EC.presenceOf(el));
       await this.clickOnElement(el);
   }

   /* fsuo 02/27/2020: click on the context menu of a group which container "containerName" and select "cmOption" from context menu
    * If group is not selected, we have to locate the group through its child 
    * @param {string} containerName: the name of visualziation container or any other fieldbox inside a group
    * @param {string} cmOption: the option from the context menu, like 'Bring to Front', 'Ungroup'
    */
   async GroupContextMenuAction(containerName, cmOption){
        let group = await this.getGroupwithChild(containerName);
        await this.hover({elem: group});
        let btn = await this.getHoverMenuButtonForSpecificGroup(containerName);
        await this.hoverMouseOnElement(btn);
        await this.clickOnElement(btn);  
        let el = await this.common.getContextMenuItem(cmOption);
        await el.waitForDisplayed();
        await this.clickOnElement(el);
    }


    /* fsuo 02/27/2020: double click on container “containerName” to select it from a group 
    * @param {string} containerName: the name of visualziation container or any other fieldbox
    */
   async doubleClickContainer(containerName) {
        let element = await this.baseContainer.getContainerExact(containerName);
        let isExist = await element.isExisting();
        if(!isExist) {
            element = await this.baseContainer.getContainer(containerName);
        }
        await scrollIntoView(element);
        await this.hover({elem: element});
        await this.doubleClickOnElement(element);
    }

    /* fsuo 02/27/2020: right click on container “containerName” and select “cmOption” from the context menu
    * @param {string} containerName: the name of visualziation container or any other fieldbox
    * @param {string} cmOption: the option from the context menu, like ‘Align Top’, ‘Distribute Horizontally’
    */
    async rightClickContainerAndDoCMAction(containerName, cmOption) {
        let element = await this.baseContainer.getContainer(containerName);
        await this.rightMouseClickOnElement(element);
        let el = await this.common.getContextMenuItem(cmOption);
        await this.clickOnElement(el);
    }



    /* fsuo: Calculation the container Size/location based on the width/height/x/y from format panel and compare with the actual width/height/x/y we got from dom node 
    * @param {string}: containerName
    */
    async calculateContainerSizeAndLocation(containerName) {
        // Get Canvas Rect
        let canvasEl = await this.ContainerArea; 
        let canvasRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', canvasEl); 
     
        // Get container Rect 
        let containerEl = await this.baseContainer.getContainer(containerName); 
        let containerRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', containerEl); 

        // Size: Height and Width 
        let elW = await freeformPositionAndSize.getWidthInput(); 
        let w = await this.getBrowserData('return arguments[0].value', elW); 
        w = parseFloat(w) / 100; 
        let elH = await freeformPositionAndSize.getHeightInput(); 
        let h = await this.getBrowserData('return arguments[0].value', elH); 
        h = parseFloat(h) / 100; 
        expect(Math.abs(containerRect.height / canvasRect.height - h)< 0.01).to.equal(true);  
        expect(Math.abs(containerRect.width / canvasRect.width - w)< 0.01).to.equal(true);          

        // Location: X and Y 
        let elX = await freeformPositionAndSize.getXPositionInput(); 
        let x = await this.getBrowserData('return arguments[0].value', elX); 
        x = parseFloat(x) / 100; 
        let elY = await freeformPositionAndSize.getYPositionInput(); 
        let y = await this.getBrowserData('return arguments[0].value', elY); 
        y = parseFloat(y) / 100; 
        expect(Math.abs((containerRect.x - canvasRect.x)/ canvasRect.width - x)< 0.01).to.equal(true);  
        expect(Math.abs((containerRect.y - canvasRect.y)/ canvasRect.height - y)< 0.01).to.equal(true); 
    }

    /* fsuo: Verify whether containers are aligned  
    * @param {string}: containerNameList, separate by comma
    * @param {string}: alignOption: 'Left', 'Right', 'Center', 'Top', 'Bottom', 'Middle' 
    */
    async verifyAlignment(containerNameList, alignOption){
        alignOption = alignOption.toLowerCase().trim(); 
        let containerArray = containerNameList.split(",");
        let containerRect = '';
        let actualV; 
        let baseV; 
        for (let i = 0; i < containerArray.length; i++){
            containerArray[i] = await this.baseContainer.getContainer(containerArray[i].trim());
            containerRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', containerArray[i]); 
    
            if (alignOption == "left" || alignOption == "right" || alignOption == "top" || alignOption == "bottom" ){
                actualV = containerRect[alignOption];    
            } else if (alignOption == "center"){
                actualV = containerRect.left + containerRect.width / 2; 
            } else if (alignOption == "middle"){
                actualV = containerRect.top + containerRect.height / 2; 
            } else {
                return false;
            }

            if (i == 0){
                baseV = actualV; 
            }else{
                // await expect(Math.round(actualV) == Math.round(baseV)).to.equal(true); 
                await expect (Math.abs(actualV - baseV) < 1).to.equal(true); 
            }
        }
    }


    /* fsuo: Verify whether containers are distributed correctly   
    * @param {string}: containerNameList, separate by comma
    * @param {string}: distributeOption: 'Horizontally', 'Vertically' 
    */
    async verifyDistribute(containerNameList, distributeOption){
        distributeOption = distributeOption.toLowerCase().trim(); 
        let containerArray = containerNameList.split(",");
        let containerRect = '';
        let arrA = []; 
        let arrB = [];
        for (let i = 0; i < containerArray.length; i++){
            containerArray[i] = await this.baseContainer.getContainer(containerArray[i].trim());
            containerRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', containerArray[i]); 

            if (distributeOption == "vertically" ){
                arrA.push(containerRect.top); 
                arrB.push(containerRect.bottom); 
            } else if (distributeOption == "horizontally"){
                arrA.push(containerRect.left);  
                arrB.push(containerRect.right); 
            } else {
                return false;
            }
        }
        arrA.sort((a, b) => a - b); 
        arrB.sort((a, b) => a - b); 

        let baseV = arrA[1] - arrB[0]; 
        for (let i = 2; i < arrA.length; i++){
            await expect (Math.abs(arrA[i] - arrB[i-1] - baseV) < 2).to.equal(true); 
        }
    }

    // verify whether group has same border as specific container
    // @position: 'left', 'right', 'top', 'bottom' or 'left, right'....
    async verifyGroupPosition(position, containerName){
        position = position.toLowerCase().trim(); 
        let groupEl = await this.getGroupwithChild(containerName);
        let groupRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', groupEl); 

        let containerEl = await this.baseContainer.getContainer(containerName); 
        let containerRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', containerEl); 

        let positionArr = position.split(",");
        for (let i = 0; i < positionArr.length; i++){
            expect(Math.abs(groupRect[positionArr[i].trim()] - containerRect[positionArr[i].trim()]) < 1).to.equal(true);
        }
    }


    // Lasso select on canvas 
    async lassoSelect(fromCordinates, toCordinates){
        let fromArray = fromCordinates.split(','); 
        let toArray = toCordinates.split(',');
        for (let i = 0; i < fromArray.length; i++){
            fromArray[i] = parseFloat(fromArray[i]) / 100; 
        }
        for (let j = 0; j < fromArray.length; j++){
            toArray[j] = parseFloat(toArray[j]) / 100; 
        }        

        let el = await this.DocPanel; 
        let elRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', el); 
        // 4px is the padding 
        let x1 = parseInt((elRect.width - 4) * (fromArray[0] - 0.5)); 
        let y1 = parseInt((elRect.height - 4) * (fromArray[1] - 0.5));    
        let x2 = parseInt(elRect.width * (toArray[0] - fromArray[0])); 
        let y2= parseInt(elRect.height * (toArray[1] - fromArray[1])); 
        
        let dndInnerTime = (.3 * 1000);
      
        // Perform lasso selection
        await browser.performActions([
            {
                type: 'pointer',
                id: 'mouse1',
                parameters: { pointerType: 'mouse' },
                actions: [
                    { type: 'pointerMove', origin: el, x: x1, y: y1, duration: dndInnerTime },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerMove', origin: 'pointer', x: x2, y: y2, duration: dndInnerTime },
                    { type: 'pointerUp', button: 0 }
                ]
            }
        ]);
        await browser.pause(dndInnerTime);
        await browser.releaseActions();

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();     
    }

    async resizeGroup(groupChildContainerName, direction, percentChangeH, percentChangeW = percentChangeH) {
        await this.resizeGroupAndHoldMouse(groupChildContainerName, direction, percentChangeH, percentChangeW);
        // release the mouse
        await browser.performActions([
            {
                type: 'pointer',
                id: 'mouse1',
                parameters: { pointerType: 'mouse' },
                actions: [{ type: 'pointerUp', button: 0 }],
            },
        ]);
        await browser.pause(300);
    }

    async calculateGroupRect(groupContainerChildName) {
        let el = await this.getGroupwithChild(groupContainerChildName);
        let elRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', el);
        return elRect;
    }

    async resizeGroupAndHoldMouse(groupChildContainerName, direction, percentChangeH, percentChangeW = percentChangeH) {
        let el = await this.getGroupwithChild(groupChildContainerName);
        await this.hover({elem: el});
        let elRect = await this.calculateGroupRect(groupChildContainerName);
        let canvasEl = await this.baseContainer.Canvas;
        let canvasRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', canvasEl);

        // use below element to verify whether it's auto layout or freeform layout
        /*let layEl = await this.FreeformLayoutNode;
        let freeLayout = false;
        if (layEl) {
            await layEl.waitForDisplayed();
            freeLayout = await layEl.isDisplayed();
        }*/

        let borderX = 0,
            borderY = 0,
            moveX = 0,
            moveY = 0;
        if (direction.indexOf('top') != -1) {
            borderY = -parseInt(elRect.height / 2);
            // Need to add a few more pixels for auto layout to reach the splitter
            if (percentChangeH.indexOf('px') != -1) {
                moveY = -parseInt(percentChangeH);
            } else {
                moveY = -parseInt((canvasRect.height * parseFloat(percentChangeH)) / 100);
            }
        }
        if (direction.indexOf('bottom') != -1) {
            borderY = parseInt(elRect.height / 2);
            if (percentChangeH.indexOf('px') != -1) {
                moveY = parseInt(percentChangeH);
            } else {
                moveY = parseInt((canvasRect.height * parseFloat(percentChangeH)) / 100);
            }
        }
        if (direction.indexOf('left') != -1) {
            borderX = -parseInt(elRect.width / 2);
            if (percentChangeH.indexOf('px') != -1) {
                moveX = -parseInt(percentChangeW);
            } else {
                moveX = -parseInt((canvasRect.width * parseFloat(percentChangeW)) / 100);
            }
        }
        if (direction.indexOf('right') != -1) {
            borderX = parseInt(elRect.width / 2);
            if (percentChangeH.indexOf('px') != -1) {
                moveX = parseInt(percentChangeW);
            } else {
                moveX = parseInt((canvasRect.width * parseFloat(percentChangeW)) / 100);
            }
        }
        //change the dndInnerTime shorter to simulate resizing in a very short time
        let dndInnerTime = 300;
        await browser.performActions([
            {
                type: 'pointer',
                id: 'mouse1',
                parameters: { pointerType: 'mouse' },
                actions: [
                    { type: 'pointerMove', origin: el, x: 0, y: 0, duration: dndInnerTime },
                    { type: 'pointerMove', origin: el, x: borderX, y: borderY, duration: dndInnerTime },
                    { type: 'pointerDown', button: 0 }, // Hold down the mouse button
                    { type: 'pointerMove', origin: 'pointer', x: moveX, y: moveY, duration: dndInnerTime },
                ],
            },
        ]);
    }


}
