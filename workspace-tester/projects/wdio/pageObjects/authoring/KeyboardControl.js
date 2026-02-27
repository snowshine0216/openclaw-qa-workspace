import BaseContainer from './BaseContainer.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';

export default class Keyboard {
    constructor() {
        this.loadingDialog = new LoadingDialog();
        this.baseContainer = new BaseContainer();
    }

    //key: left, right, up, down
    getKey(key) {
        switch (key.toLowerCase()) {
            case 'left':
                return '\uE012'; // ArrowLeft
            case 'right':
                return '\uE014'; // ArrowRight
            case 'up':
                return '\uE013'; // ArrowUp
            case 'down':
                return '\uE015'; // ArrowDown
            case 'control':
                if ((process.platform).includes('darwin')) {
                    return '\uE03D'; //on macOS
                } else if ((process.platform).includes('win32')) {
                    return '\uE009'; //on windows
                }
            case 'shift':
                return '\uE008'; // Shift
            case 'alt':
                return '\uE00A'; // Alt
            default:
                throw 'Invalid key';
        }
    }

    //index to lines
    getSnapGuideLineByIndex(index) {
        return $(`//div[contains(@class, "snap-guide")]//div[contains(@class, "line")][${index}]`);
    }

    async pressArrowKeyForTimes(containerName, key, times) {
        let el = await baseContainer.getContainer(containerName);
        let arrowKey = this.getKey(key);
        for (let i = 0; i < times; i++) {
            await browser.keys([arrowKey])
            await browser.pause(300);
        }
        await browser.keys(Key.NULL); // Release all keys
        await LoadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async pressShiftAndArrowKeyForTimes(containerName, key, times) {
        let el = await baseContainer.getContainer(containerName);
        let arrowKey = this.getKey(key);

        for (let i = 0; i < times; i++) {
            await browser.keys([Key.Shift,arrowKey]);
            await LoadingDialog.waitLoadingDataPopUpIsNotDisplayed();
            await browser.pause(300);
        }
        await browser.keys(Key.NULL); // Release all keys
        await LoadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async PressDeleteKeyForContainer(containerName){
        let el = await baseContainer.getContainer(containerName);
        await browser.keys(Key.Delete)
        await LoadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async pressSingleKeyAndHoldOn(keyName) {
        let keyButton = this.getKey(keyName);
        await browser.performActions([
            {
                type: 'key',
                id: 'keyboard',
                actions: [
                    { type: 'keyDown', value: keyButton }, // Press and hold the key
                ],
            },
        ]);                           
    }

    async releaseSingleKey(keyName) {
        let keyButton = this.getKey(keyName);
        await browser.performActions([
            {
                type: 'key',
                id: 'keyboard',
                actions: [
                    { type: 'keyUp', value: keyButton }, // release the key
                ],
            },
        ]);
    }

    async dragAndDropAndHoldOnMouse(element, xPixels = 0, yPixels = 0) {
        let dndInnerTime = (500);

        // Move to the element (hover)
        await browser.performActions([{
            type: 'pointer',
            id: 'mouse1',
            parameters: { pointerType: 'mouse' },
            actions: [
                { type: 'pointerMove', origin: element, x: 0, y: 0 },
                { type: 'pause', duration: dndInnerTime },
                { type: 'pointerDown', button: 0 }, // Click to hold the element
                { type: 'pause', duration: dndInnerTime },
    
                // Small moves to adjust position
                { type: 'pointerMove', origin: 'pointer', x: 5, y: 0 },
                { type: 'pause', duration: dndInnerTime },
                { type: 'pointerMove', origin: 'pointer', x: 0, y: 5 },
                { type: 'pause', duration: dndInnerTime },
                { type: 'pointerMove', origin: 'pointer', x: -5, y: -5 },
                { type: 'pause', duration: dndInnerTime },
    
                // Actual move to the new position, split the movement into 2 steps
                { type: 'pointerMove', origin: 'pointer', x: Math.floor(xPixels * 0.5), y: Math.floor(yPixels * 0.5) },
                { type: 'pause', duration: dndInnerTime },
                { type: 'pointerMove', origin: 'pointer', x: Math.ceil(xPixels * 0.5), y: Math.ceil(yPixels * 0.5) }, // Move the remaining half
                { type: 'pause', duration: dndInnerTime },
            ]
        }]);
        await browser.pause(dndInnerTime);
    }

    async verifySnapGuide(lines, status) {
        let arrLines = lines.split(',');
        let index = 1; 
        for (let i = 0; i < arrLines.length; i++) {
            switch(arrLines[i].trim()){
                case "left": index = 1; break; 
                case "right": index = 2; break; 
                case "center": index = 3; break; 
                case "top": index = 4; break; 
                case "bottom": index = 5; break; 
                case "middle": index = 6; break;
                default: 
                    throw "Invalid line name";
            }
        let line = await this.getSnapGuideLineByIndex(index);
        if (status === "present") {
            await expect(line.getAttribute('class')).to.eventually.equals('line active');
        } else if (status === "not present") {
            await expect(line.getAttribute('class')).to.eventually.equals('line');
        }
        }
        
    }

    async moveContainerByOffsetAndHoldOnMouse(containerName, moveX, moveY) {
        let src = await baseContainer.getContainer(containerName);
        let srcT = await baseContainer.getContainerTitlebar(containerName);
        // if titlebarHeight = 0, then we need to mouse over the visualization to get the drag icon
        // otherwise drag the titlebar
        let titleHeight = await srcT.getCSSProperty('height');
        let tValue = titleHeight.value;
        if (tValue == "0px"){
            await baseContainer.hoverMouseOnElement(src);
            srcT = await baseContainer.getContainerDragIcon(containerName);
            await browser.waitUntil(async () => srcT.isExisting());
        }

        if (moveX.includes("%") || moveY.includes("%")){
            let canvasEl = await baseContainer.Canvas;
            let canvasRect = await baseContainer.getBrowserData('return arguments[0].getBoundingClientRect()', canvasEl);
            moveX = moveX.includes("%") 
            ? Math.round(canvasRect.width * parseFloat(moveX) / 100) 
            : parseInt(moveX);

            moveY = moveY.includes("%") 
            ? Math.round(canvasRect.height * parseFloat(moveY) / 100) 
            : parseInt(moveY);
        } else {
            moveX = parseInt(moveX);
            moveY = parseInt(moveY);
    }
        await this.dragAndDropAndHoldOnMouse(srcT,moveX, moveY);
    }

    async moveSelectedGroupByOffsetAndHoldOn(containerName, moveX, moveY){
        let canvasEl = await baseContainer.Canvas;
        let canvasRect = await baseContainer.getBrowserData('return arguments[0].getBoundingClientRect()', canvasEl);
        moveX = await canvasRect.width * parseFloat(moveX) / 100;
        moveY = await canvasRect.height * parseFloat(moveY) / 100;
        let container = await baseContainer.getContainer(containerName);
        await basePage.hoverMouseOnElement(container);
        let el = await openCanvas.HoverDragIcon;
        await browser.waitUntil(EC.visibilityOf(el))
        await this.dragAndDropAndHoldOnMouse(el, moveX, moveY);
    }

    async releaseMouse() {

        let dndInnerTime = 1000;
        await browser.performActions([
            {
                type: 'pointer',
                id: 'mouse',
                parameters: { pointerType: 'mouse' },
                actions: [
                    { type: 'pause', duration: dndInnerTime }, // Pause briefly
                    { type: 'pointerUp', button: 0 }, // Release mouse
                ],
            },
        ]);
        await browser.pause(dndInnerTime);
        await LoadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // store container position in window.localstorage
    async storeContainerRect(containerNames) {
        let pos = await baseContainer.calculateContainerRect(containerNames); 
        await browser.execute((name, position) => {
            window.localStorage.setItem(name, position);
        }, containerNames, JSON.stringify(pos)); 
    }

    async PressTabKeyForTimes(times){
        for (var i = 0; i < times; i++) {
            await browser.keys(['Tab']);
        }
    }

    async PressEnterKeyForTimes(times){
        for (var i = 0; i < times; i++) {
            await browser.keys(['Enter'])
        }
    }

    async PressUpArrowkeyForTimes(times){
        for (var i = 0; i < times; i++) {
            await browser.keys(['ArrowUp']);
        }
    }

    async PressDownArrowkeyForTimes(times){
        for (var i = 0; i < times; i++) {
            await browser.keys(['ArrowDown']);
        }
    }

    async PressRightArrowkeyForTimes(times){
        for (var i = 0; i < times; i++) {
            await browser.keys(['ArrowRight']);
        }
    }

    async PressLeftArrowkeyForTimes(times){
        for (var i = 0; i < times; i++) {
            await browser.keys(['ArrowLeft']);
        }
    }

    async PressEscKey(){
       await browser.keys(['Escape']);
    }

    async pressAltAndEnterKeyForTimes(times) {
        for (var i = 0; i < times; i++) {
            await browser.keys(['Alt', 'Enter'])
        }
    }
    
}