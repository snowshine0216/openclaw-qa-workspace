import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import NewGalleryPanel from './NewGalleryPanel.js';
import DossierMojoEditor from './DossierMojoEditor.js';
import Common from './Common.js';
import { scrollIntoView } from '../../utils/scroll.js';

const contextMenuItems = {
    FORMAT: 'Format',
    EDIT: 'Edit',
    DELETE: 'Delete',
    DUPLICATE: 'Duplicate',
    COPYTO: 'Copy to',
    MOVETO: 'Move to',
    SWAP: 'Swap',
    SELECTTARGETVISUALIZATIONS: 'Select Target Visualizations',
    EDITTARGETVISUALIZATIONS: 'Edit Target Visualizations',
    EDITORFILTER: 'Edit Filter...',
};

/**
 * Page representing the Container (can also be used by visualizations with/without title bars)
 *
 * @extends BasePage
 * @author Patricia Soriano <psoriano@microstrategy.com>
 */
export default class BaseContainer extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
        this.newGalleryPanel = new NewGalleryPanel();
        this.dossierMojoEditor = new DossierMojoEditor();
        this.containerNameMatchMethod = 'contains';
    }

    // the xpath can be used in both authoring and consumption mode
    get canvasPath() {
        // element before /div/div is to get current panel node
        return `//div[contains(@class,'mojo-theme-light') and not(contains(@style,'display: none'))]//div[contains(@class, 'mstrmojo-VIDocLayoutViewer')]//div[contains(@class,'mstrmojo-DocPanel-wrapper') and contains(@style,'display: block;') and ./parent::div[not(contains(@class, 'mstrmojo-DocPanelStack-content'))]]/div/div`;
    }

    get Canvas() {
        return this.$$(this.canvasPath)[0];
    }

    get FreeformLayoutNode() {
        return this.$(`(//div[contains(@class,'mojo-theme-light') and not(contains(@style,'display: none'))]//div[contains(@class, 'mstrmojo-VIDocLayoutViewer')]//div[contains(@class,'mstrmojo-DocPanel-wrapper') and contains(@style,'display: block;') and ./parent::div[not(contains(@class, 'mstrmojo-DocPanelStack-content'))]]/div/div//div[@class='GroupLayerNode']/div)[1]`);
    }

    getContainerPath(containerName) {
        if (containerName) {
            if (this.containerNameMatchMethod === 'exact') {
                return `${this.canvasPath}//div[text()='${containerName}']/ancestor::div[contains(@class, 'mstrmojo-UnitContainer-SplitterHost')][position() = 1]/parent::div[1]`;
            } else {
                return `${this.canvasPath}//div[contains(.//text(), '${containerName}')]/ancestor::div[contains(@class, 'mstrmojo-UnitContainer-SplitterHost')][position() = 1]/parent::div[1]`;
            }
        }
        return `//div[contains(@class, 'mstrmojo-UnitContainer') and contains(@class, 'selected')][1]`;
    }

    getContainerPathExact(containerName) {
        return `${this.canvasPath}//div[text()='${containerName}']/ancestor::div[contains(@class, 'mstrmojo-UnitContainer-SplitterHost')][position() = 1]/parent::div[1]`;
    }

    getSelectedContainer(containerName) {
        return this.$(
            `//div[@class='mstrmojo-RootView-content']//div[contains(@class, 'mstrmojo-UnitContainer') and contains(@class, 'selected')]//div[text()='${containerName}']`
        );
    }

    /**
     * Visualizations or other widgets with no title bar
     * @param {string} Container title optional
     * @type {Promise<ElementFinder>}
     * */
    getContainer(containerName) {
        return this.$(this.getContainerPath(containerName));
    }

    getContainerExact(containerName) {
        return this.$(this.getContainerPathExact(containerName));
    }

    getContainerTitlebarPath(containerName) {
        if (containerName) {
            return `${this.canvasPath}//div[@class='mstrmojo-UnitContainer-titlebar' and child::div/child::div/child::div[text()='${containerName}']]`;
        }
        return `//div[contains(@class, 'mstrmojo-UnitContainer') and contains(@class, 'selected')]//div[contains(@class, 'mstrmojo-VITitleBar')]/..`;
    }

    getContainerTitlebar(containerName) {
        return this.$(this.getContainerTitlebarPath(containerName));
    }

    getVisualizationRowHeader() {
        return this.$(`//div[contains(@class, 'gm-rowheader')]//div[contains(@class, 'gm-rowheader-lv2')]`);
    }

    getVisualizationColumnHeader() {
        return this.$(`(//div[contains(@class, 'gm-colheader')]//div[contains(@class, 'gm-colheader-lv2')])[1]`);
    }

    /**
     * content of Visualizations
     * @param {string} Container title optional
     * @type {Promise<ElementFinder>}
     * */
    getContainerContent(containerName) {
        return this.getContainer(containerName).$(
            `./descendant::div[contains(@class, 'mstrmojo-UnitContainer-content')]`
        );
    }

    /**
     * Returns the ghost image (no data) or freezing image (pause mode) for the container when no title bar is present
     * @param {string} containerName the title of the container whose context menu button you want
     * @param {string} mode Ghost or Freezing
     * @returns {Promise<ElementFinder>} ghost image or freezing image div when present
     */
    getContainerImgOverlay(mode, containerName) {
        mode = mode === 'Freezing' ? 'freezing' : mode;
        return this.$(
            this.getContainerPath(containerName) + `//div[contains(@class, 'mstrmojo-vi-ui-rw-${mode}ImageContainer')]`
        );
    }

    /**
     * Returns the div for "No data returned for this view. This might be because the applied filter excludes all data."
     * @param {*} containerName
     */
    getContainerErrorMessage(containerName) {
        return this.$(this.getContainerPath(containerName) + `//div[contains(@class, 'error-content')]`);
    }

    /**
     * Returns the context menu button for the container when no title bar is present
     * @param {string} containerName the title of the container whose context menu button you want
     * @returns {Promise<ElementFinder>} context menu button for visualization vizTitle
     */
    getContainerContextMenuButton(containerName) {
        return this.$(this.getContainerPath(containerName) + `/div[contains(@class, 'hover-menu-btn')][1]`);
    }

    getContainerMaximizeRestoreButton(containerName) {
        return this.$(this.getContainerPath(containerName) + `//div[contains(@class, 'hover-max-restore-btn')]`);
    }

    getContainerDragIcon(containerName) {
        return this.getContainer(containerName).$(`.//div[@class='hover-drag-icon-btn visible']`);
    }

    get rootViewNode() {
        return this.$(`//div[@id='rootView']`);
    }

    /**
     * Return warning icon on top left of container
     * @param {String}} containerName
     */
    getContainerWarningIcon(containerName) {
        return this.getContainer(containerName).$(
            `.//div[contains(@class, 'hover-txnWarning-btn') and contains(@class, 'visible')]`
        );
    }

    /** Select visualization/containers without title bar */
    async clickContainerByScript(containerName) {
        let element = await this.getContainer(containerName);
        await scrollIntoView(element);
        await element.waitForClickable();
        await this.clickOnElementByInjectingScript(element);
    }

    async clickContainer(containerName) {
        let element = await this.getContainer(containerName);
        // await scrollIntoView(element);
        await this.waitForElementClickable(element);
        await this.click({ elem: element });
    }

    /** Hover on a specific visualization panel
     * @param {String} visualization title
     * @author Jiefu Liang <jiefuliang@microstrategy.com>
     */
    async hoverOnVisualizationContainer(visualizationName) {
        let element = await this.getContainer(visualizationName);
        await this.waitForElementVisible(element);
        await this.hover({ elem: element });
    }

    async hoverOnContainerAndClick(containerName) {
        let element = await this.getContainer(containerName);
        await this.waitForElementVisible(element);
        await this.hover({ elem: element });
        await element.click();
        await this.sleep(0.3);
    }

    async hoverOnContainerTitlebarAndClick(containerName) {
        let el = await this.getContainerTitlebar(containerName);
        await this.waitForElementVisible(el);
        await this.hover({ elem: el });
        await el.click();
        await this.sleep(0.3);
    }

    /** Click on container title or drag icon
     * @param {String} containerName
     * @author Fang Suo <fsuo@microstrategy.com>
     */
    async clickOnContainerTitle(containerName) {
        let srcT = await this.getContainerTitlebar(containerName);
        // if titlebarHeight = 0, then we need to click on drag icon to select it
        // otherwise click on the titlebar
        let titleHeight = await srcT.getCSSProperty('height');
        if (titleHeight.value == '0px') {
            let src = await this.getContainer(containerName);
            await this.hoverMouseOnElement(src);
            srcT = await this.getContainerDragIcon(containerName);
            await this.waitForElementVisible(srcT);
        }
        await this.waitForElementClickable(srcT);
        await this.click({ elem: srcT });
    }

    async openContextMenu(containerName) {
        let contextMenu = await this.getContainerContextMenuButton(containerName);
        await this.hoverOnVisualizationContainer(containerName);
        await this.clickOnElementByInjectingScript(contextMenu);
    }

    //use clickonElement to open context menu instead ofy using script
    async openContextMenu2(containerName) {
        let contextMenu = await this.getContainerContextMenuButton(containerName);
        await this.click({ elem: contextMenu });
    }

    // openContextMenu() would not get refershed info window list for reuse-info-window non-first page as the updating list function is caught in mousedown event
    // openContextMenu2() won't work as other element would receive the click event
    async openContextMenu3(containerName) {
        let contextMenu = await this.getContainerContextMenuButton(containerName);
        await browser.execute(
            "var clickEvent = document.createEvent('MouseEvents');clickEvent.initEvent('mousedown', true, true);arguments[0].dispatchEvent (clickEvent);",
            contextMenu
        );
        await browser.execute(
            "var clickEvent = document.createEvent('MouseEvents');clickEvent.initEvent('mouseup', true, true);arguments[0].dispatchEvent (clickEvent);",
            contextMenu
        );
        await this.clickOnElementByInjectingScript(contextMenu);
    }

    async selectContextMenuOption(option) {
        const optionEl = await this.common.getContextMenuItem(option);
        await this.waitForElementVisible(optionEl, 3 * 1000);
        await this.click({ elem: optionEl });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    getContextMenuOption(option) {
        // assumed context menu is already opened
        // already called await this.openContextMenu();
        return this.common.getContextMenuItem(option);
    }

    async changeViz(newViz, containerName, preventPopup = true) {
        await this.openContextMenu(containerName);
        await this.selectContextMenuOption('Change Visualization...');
        await this.newGalleryPanel.selectViz(newViz);
        // change viz from compound gird ---> alert dialog
        let el = this.dossierMojoEditor.getAlertEditorWithTitle('Change Visualization');
        let status = (await el.isDisplayed()) && (await el.isDisplayed());
        if (status) {
            if (preventPopup) {
                const preventPopupInput = await this.dossierMojoEditor.ActiveEditor.$(
                    `.//span[contains(@class, 'dont-show-popup-chkbox')]/input`
                );
                await this.dossierMojoEditor.clickOnElementByInjectingScript(preventPopupInput);
            }

            await this.dossierMojoEditor.clickBtnOnMojoEditor('Continue');
        }
        // await this.newGalleryPanel.closeChangeViz();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectSecondaryContextMenuOption(subOption) {
        const subOp = await this.common.getSecondaryContextMenu(subOption);
        await this.waitForElementVisible(subOp);
        await this.click({ elem: subOp });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(60);
    }

    async clickOnMaximizeRestoreButton(containerName) {
        let element = await this.getContainerMaximizeRestoreButton(containerName);
        await this.clickOnElementByInjectingScript(element);
    }

    getMaximizeBtn() {
        return $('.hover-btn.hover-max-restore-btn.visible[aria-label="Maximize"]');
    }

    getRestoreBtn() {
        return $('.hover-btn.hover-max-restore-btn.visible[aria-label="Restore"]');
    }
    /**
     * Click Maximize button
     */
    async clickMaximizeBtn() {
        const maximizeBtn = await this.getMaximizeBtn();
        await maximizeBtn.waitForDisplayed({ timeout: 5000 });
        await maximizeBtn.waitForClickable({ timeout: 5000 });
        await this.click({ elem: maximizeBtn });
    }

    async hoverOnMaximizeBtn() {
        await this.hover({ elem: await this.getMaximizeBtn() });
    }

    async hoverOnRestoreBtn() {
        await this.hover({ elem: await this.getRestoreBtn() });
    }

    async swapContainer(containerName) {
        await this.openContextMenu(containerName);
        await this.selectContextMenuOption(contextMenuItems.SWAP);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    async openAdvancedFilterEditor(containerName) {
        await this.openContextMenu(containerName);
        await this.selectContextMenuOption(contextMenuItems.EDITORFILTER);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTargetVisualizations(containerName) {
        await this.openContextMenu(containerName);
        await this.selectContextMenuOption(contextMenuItems.SELECTTARGETVISUALIZATIONS);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    async editTargetVisualizations(containerName) {
        await this.openContextMenu(containerName);
        await this.selectContextMenuOption(contextMenuItems.EDITTARGETVISUALIZATIONS);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    async showFormatPanel() {
        await this.openContextMenu();
        await this.selectContextMenuOption(contextMenuItems.FORMAT);
    }

    async editTextArea(containerName) {
        await this.openContextMenu(containerName);
        await this.selectContextMenuOption(contextMenuItems.EDIT);
    }

    async deleteContainer(container) {
        await this.openContextMenu(container);
        await this.selectContextMenuOption(contextMenuItems.DELETE);
    }

    async duplicateContainer(containerName) {
        await this.openContextMenu(containerName);
        await this.selectContextMenuOption(contextMenuItems.DUPLICATE);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    async copytoContainer(containerName, locationName) {
        await this.copymoveContainer(containerName, 'Copy to', locationName);
    }

    async movetoContainer(containerName, locationName) {
        await this.copymoveContainer(containerName, 'Move to', locationName);
    }

    async copymoveContainer(containerName, actionName, locationName) {
        await this.openContextMenu(containerName);
        let optionEl;
        switch (actionName) {
            case 'Move to':
                optionEl = await this.common.getContextMenuItem(contextMenuItems.MOVETO);
                break;
            case 'Copy to':
                optionEl = await this.common.getContextMenuItem(contextMenuItems.COPYTO);
                break;
            default:
                throw 'Wrong Action';
        }
        await this.waitForElementVisible(optionEl);
        await this.waitForElementClickable(optionEl);
        await this.click({ elem: optionEl });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
        await this.sleep(0.5);
        let el = await this.common.getSecondaryContextMenu(locationName);
        await this.waitForElementVisible(el);
        await this.waitForElementClickable(el);
        await this.click({ elem: el });

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async moveContainerToTargetPosition(containerName, direction, targetValue) {
        let elT = await this.getContainerTitlebar(containerName);
        let elRect = await this.calculateContainerRect(containerName);
        let canvasEl = await this.Canvas;
        let canvasRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', canvasEl);

        let moveX = 0,
            moveY = 0;
        if (direction.indexOf('top') != -1) {
            if (targetValue.indexOf('px') != -1) {
                moveY = canvasRect.y + parseInt(targetValue, 10) - elRect.y;
            } else {
                moveY = canvasRect.y + (canvasRect.height * parseFloat(targetValue)) / 100 - elRect.y;
            }
        }
        if (direction.indexOf('bottom') != -1) {
            if (targetValue.indexOf('px') != -1) {
                moveY = canvasRect.y + canvasRect.height - parseInt(targetValue, 10) - elRect.y;
            } else {
                moveY = canvasRect.y + (canvasRect.height * (100 - parseFloat(targetValue))) / 100 - elRect.y;
            }
        }
        if (direction.indexOf('left') != -1) {
            if (targetValue.indexOf('px') != -1) {
                moveX = canvasRect.x + parseInt(targetValue, 10) - elRect.x;
            } else {
                moveX = canvasRect.x + (canvasRect.width * parseFloat(targetValue)) / 100 - elRect.x;
            }
        }
        if (direction.indexOf('right') != -1) {
            if (targetValue.indexOf('px') != -1) {
                moveX = canvasRect.x + canvasRect.width - parseInt(targetValue, 10) - elRect.x;
            } else {
                moveX = canvasRect.x + (canvasRect.width * (100 - parseFloat(targetValue))) / 100 - elRect.x;
            }
        }

        await this.dragAndDropByPixel(elT, moveX, moveY);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // move container by specific pixels or percentage of whole canvas size
    async moveContainerByOffset(containerName, moveX, moveY) {
        let src = await this.getContainer(containerName);
        let srcT = await this.getContainerTitlebar(containerName);
        // if titlebarHeight = 0, then we need to mouse over the visualization to get the drag icon
        // otherwise drag the titlebar
        let titleHeight = await srcT.getCSSProperty('height');
        let titleHeightValue = titleHeight.value;
        if (titleHeightValue == '0px' || isNaN(parseInt(titleHeightValue))) {
            await this.hoverMouseOnElement(src);
            srcT = await this.getContainerDragIcon(containerName);
            await this.waitForElementVisible(srcT);
        }

        if (moveX.indexOf('%') != -1 || moveY.indexOf('%') != -1) {
            let canvasEl = await this.Canvas;
            let canvasRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', canvasEl);
            moveX = (canvasRect.width * parseFloat(moveX)) / 100;
            moveY = (canvasRect.height * parseFloat(moveY)) / 100;
        }

        moveX = Math.round(parseFloat(moveX));
        moveY = Math.round(parseFloat(moveY));

        await this.dragAndDropByPixel(srcT, moveX, moveY, true);
    }

    // move contianer to the relative position of target container
    async moveContainerByPosition(sourceContainer, targetContainer, relativePosition) {
        let src = await this.getContainer(sourceContainer);
        let srcT = await this.getContainerTitlebar(sourceContainer);
        let tar = await this.getContainer(targetContainer);

        // if titlebarHeight = 0, then we need to mouse over the visualization to get the drag icon
        // otherwise drag the titlebar
        let titleHeight = await srcT.getCSSProperty('height');
        let titleHeightValue = titleHeight.value;

        if (parseInt(titleHeightValue) == 0 || isNaN(parseInt(titleHeightValue))) {
            await this.hoverMouseOnElement(src);
            srcT = await this.getContainerDragIcon(sourceContainer);
            await this.waitForElementVisible(srcT);
        }

        let moveX = 0;
        let moveY = 0;
        let tarRect = await this.calculateContainerRect(targetContainer);

        switch (relativePosition.toLowerCase()) {
            case 'left':
                moveX = -(tarRect.width / 3);
                break;
            case 'right':
                moveX = tarRect.width / 3 + 30;
                break;
            case 'bottom':
                moveY = tarRect.height / 3;
                break;
            case 'top':
                moveY = -(tarRect.height / 3);
                break;
        }

        await this.dragAndDrop({ fromElem: srcT, toElem: tar, toOffset: { x: moveX, y: moveY } });
    }

    async dragAndDrop({ fromElem, fromOffset = { x: 0, y: 0 }, toElem, toOffset = { x: 0, y: 0 } }) {
        const srcPos = await this.getElementPositionOfScreen(fromElem, fromOffset);
        const tarPos = await this.getElementPositionOfScreen(toElem, toOffset);

        await browser
            .action('pointer')
            .move({ duration: 1000, x: srcPos.x, y: srcPos.y })
            .down({ button: 0 })
            .pause(1000)
            .move({ duration: 1000, x: 0, y: 1 })
            .pause(0.3 * 1000)
            .move({ duration: 1000, x: 1, y: 0 })
            .pause(0.3 * 1000)
            .move({ duration: 1000, x: 1, y: 0 })
            .pause(0.3 * 1000)
            .move({ duration: 2000, x: tarPos.x, y: tarPos.y })
            .up({ button: 0 })
            .perform();
    }

    // This function is used to check two containers relative positioning
    // Function returns a number and in the verification step we will expect this number to be positive
    // @param {String} relativePositoin: 'left', 'right', 'top','bottom'
    async containerRelativePosition(containerName1, containerName2, relativePosition) {
        let container1Rect = await this.calculateContainerRect(containerName1);
        let container2Rect = await this.calculateContainerRect(containerName2);

        switch (relativePosition) {
            case 'left':
                return container1Rect.right - container2Rect.left;
            case 'right':
                return container2Rect.left - container1Rect.right;
            case 'top':
                return container1Rect.top - container2Rect.bottom;
            case 'bottom':
                return container2Rect.top - container1Rect.bottom;
            default:
                return 0;
        }
    }

    // This function is used to check whether containers are aligned
    // Function returns a number and in the verification step we will expect this number to be 0 (or < 1)
    // @param {String} position: 'left', 'right', 'top','bottom'
    async containerAlignment(containerName1, containerName2, position) {
        let el1 = await this.getContainer(containerName1);
        let container1Rect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', el1);
        let el2 = await this.getContainer(containerName2);
        let container2Rect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', el2);
        let n = container1Rect[position] - container2Rect[position];
        return n;
    }

    async calculateContainerRect(containerName) {
        let el = await this.getContainerExact(containerName);
        let isExist = await el.isExisting();
        if(!isExist) {
            el = await this.getContainer(containerName);
        }
        let elRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', el);
        return elRect;
    }

    async resizeContainer(containerName, direction, percentChangeH, percentChangeW = percentChangeH) {
        await this.resizeContainerAndHoldMouse(containerName, direction, percentChangeH, percentChangeW);
        // release the mouse
        await browser.performActions([
            {
                type: 'pointer',
                id: 'mouse1',
                parameters: { pointerType: 'mouse' },
                actions: [{ type: 'pointerUp', button: 0 }],
            },
        ]);
        await browser.pause(1000);
    }

    // resize the container and not mouse up
    async resizeContainerAndHoldMouse(containerName, direction, percentChangeH, percentChangeW = percentChangeH) {
        let el = await this.getContainerExact(containerName);
        let isExist = await el.isExisting();
        if(!isExist) {
            el = await this.getContainer(containerName);
        }
        let elRect = await this.calculateContainerRect(containerName);
        let canvasEl = await this.Canvas;
        let canvasRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', canvasEl);

        // use below element to verify whether it's auto layout or freeform layout
        let layEl = await this.FreeformLayoutNode;
        let isLayoutExist = await layEl.isExisting();
        let freeLayout = false;
        if (isLayoutExist) {
            await layEl.waitForDisplayed();
            freeLayout = await layEl.isDisplayed();
        }

        let borderX = 0,
            borderY = 0,
            moveX = 0,
            moveY = 0;
        if (direction.indexOf('top') != -1) {
            borderY = -parseInt(elRect.height / 2);
            // Need to add a few more pixels for auto layout to reach the splitter
            if (!freeLayout) {
                borderY -= 8;
            }
            if (percentChangeH.indexOf('px') != -1) {
                moveY = -parseInt(percentChangeH);
            } else {
                moveY = -parseInt((canvasRect.height * parseFloat(percentChangeH)) / 100);
            }
        }
        if (direction.indexOf('bottom') != -1) {
            borderY = parseInt(elRect.height / 2);
            if (!freeLayout) {
                borderY += 3;
            }
            if (percentChangeH.indexOf('px') != -1) {
                moveY = parseInt(percentChangeH);
            } else {
                moveY = parseInt((canvasRect.height * parseFloat(percentChangeH)) / 100);
            }
        }
        if (direction.indexOf('left') != -1) {
            borderX = -parseInt(elRect.width / 2);
            if (!freeLayout) {
                borderX -= 8;
            }
            if (percentChangeH.indexOf('px') != -1) {
                moveX = -parseInt(percentChangeW);
            } else {
                moveX = -parseInt((canvasRect.width * parseFloat(percentChangeW)) / 100);
            }
        }
        if (direction.indexOf('right') != -1) {
            borderX = parseInt(elRect.width / 2);
            if (!freeLayout) {
                borderX += 3;
            }
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

    // Verify container size
    async verifyContainerSize(containerName, percent, direction) {
        let elRect = await this.calculateContainerRect(containerName);
        let canvasEl = await this.Canvas;
        let canvasRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', canvasEl);
        let result = 0;
        switch (direction) {
            case 'width':
                result = elRect.width / canvasRect.width - parseFloat(percent) / 100;
                break;
            case 'height':
                result = elRect.height / canvasRect.height - parseFloat(percent) / 100;
                break;
            default:
                throw 'Invalid parameter';
        }
        return result;
    }

    /** Verify the maximize/restore button of visualization in high contrast mode**/
    async verifyMaximizeBtnInHighContrast(visualizationName) {
        let el = await this.getContainerMaximizeRestoreButton(visualizationName);
        let x = await el.getCSSProperty('background-position-x');
        let y = await el.getCSSProperty('background-position-y');
        await expect(x == '-842px' && y == '-121px').to.equal(true);
    }

    async verifyRestoreBtnInHighContrast(visualizationName) {
        let el = await this.getContainerMaximizeRestoreButton(visualizationName);
        let x = await el.getCSSProperty('background-position-x');
        let y = await el.getCSSProperty('background-position-y');
        await expect(x == '-962px' && y == '-121px').to.equal(true);
    }

    // click on the container top border when resize cursor appears
    async clickOnContainerTopBorder(containerName) {
        let el = await this.getContainer(containerName);
        let elRect = await this.calculateContainerRect(containerName);

        let borderY = -parseInt(elRect.height / 2);

        await browser.performActions([
            {
                type: 'pointer',
                id: 'mouse',
                parameters: { pointerType: 'mouse' },
                actions: [
                    // Move to the center of the container
                    { type: 'pointerMove', origin: el, x: 0, y: 0 },

                    // Move to the top border of the container
                    { type: 'pointerMove', origin: 'pointer', x: 0, y: borderY },

                    // Perform a single click
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerUp', button: 0 },
                ],
            },
        ]);
    }

    async moveMouse(x, y) {
        await browser.performActions([
            {
                type: 'pointer',
                id: 'mouse',
                parameters: { pointerType: 'mouse' },
                actions: [
                    { type: 'pointerMove', duration: 0, origin: 'pointer', x: x, y: y }, // Move 10 pixels to the right
                ],
            },
        ]);
        await browser.releaseActions();
    }

    /**
     * JavaScript-based right-click method for elements that may not be traditionally clickable
     * @param {WebdriverIO.Element} element - Element to right-click on
     * @param {number} offsetX - X offset from center (default: 0)
     * @param {number} offsetY - Y offset from center (default: 0)
     * @returns {Promise<void>}
     */
    async rightClickWithJavaScript(element, offsetX = 0, offsetY = 0) {
        await this.sleep(3000);
        await browser.execute(
            (el, oX, oY) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2 + oX;
                const centerY = rect.top + rect.height / 2 + oY;

                // Create and dispatch contextmenu event
                const contextMenuEvent = new MouseEvent('contextmenu', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 2,
                    buttons: 2,
                    clientX: centerX,
                    clientY: centerY,
                });

                // Ensure element is visible and focused
                el.scrollIntoView({ behavior: 'instant', block: 'center' });
                el.focus();

                // Dispatch the event
                el.dispatchEvent(contextMenuEvent);
            },
            element,
            offsetX,
            offsetY
        );
    }

    /**
     * Method to multiselect elements using command (mac) or control(windows)
     * @param {Array<WebdriverIO.Element>} elements array of webelements to multiselect
     * @param {Boolean} waitForLoadingDialog true if should wait before clicking next element
     */
    async multiSelectElementsUsingCommandOrControl(elements, waitLoadingDialog = false) {
        for (const element of elements) {
            try {
                await this.safeCtrlClickElement(element);
            } catch (error) {
                console.log('Error clicking element:', error);
                continue;
            }
            if (waitLoadingDialog) {
                await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
            }
        }
    }

    /**
     * Safely click an element with fallback strategies to handle click intercepted errors
     * @param {WebdriverIO.Element} element the element to click
     */
    async safeCtrlClickElement(element) {
        await element.scrollIntoView({ behavior: 'instant', block: 'center' });
        await element.waitForClickable({ timeout: 5000 });
        await this.ctrlClick({ elem: element });
    }

    async verifyCheckedSecondaryContextMenu(secondaryOption) {
        let el = this.common.getCheckedSecondaryContextMenu(secondaryOption);
        await expect(el.isDisplayed()).become(true);
    }

    async clickContainerButton() {
        await this.click({ elem: this.getContainerButton() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickContainerOption(option) {
        await this.click({ elem: this.getContainerOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickContainerApplyButton() {
        await this.click({ elem: this.getContainerApplyButton() });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickContainerCancelButton() {
        await this.click({ elem: this.getContainerCancelButton() });
    }

    async selectContainerLayout(layout) {
        await this.click({ elem: this.getContainerLayout(layout) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectContainerAlignment(alignment) {
        await this.click({ elem: this.getContainerAlignment(alignment) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Retries an async function a specified number of times with a delay.
     * @private
     * @param {Function} fn The async function to retry.
     * @param {number} retries Number of retries.
     * @param {number} delay Delay between retries in ms.
     * @returns {Promise<any>}
     */
    async retry(fn, retries = 3, delay = 100) {
        let lastError;
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                // eslint-disable-next-line no-console
                console.warn(`Attempt ${i + 1} of ${retries} failed. Retrying in ${delay}ms...`);
                if (i < retries - 1) {
                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
            }
        }
        // eslint-disable-next-line no-console
        console.error('All retry attempts failed.');
        throw lastError;
    }
}
