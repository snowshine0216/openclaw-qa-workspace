import BaseContainer from './BaseContainer.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import Common from './Common.js';

/**
 * Class represing the Panel Stack
 * @extends BasePage
 */
export default class PanelStack extends BaseContainer {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
    }

    getPanelStack(name) {
        return this.$(
            `${this.canvasPath}//div[text() = '${name}']/ancestor::div[contains(@class, 'mstrmojo-PanelStackBox')][position() = 1]`
        );
    }

    getPanelStackContextMenuBtn(name) {
        return this.getPanelStack(name).$(`./div[contains(@class, 'hover-menu-btn')]`);
    }

    getPanelStackViewFilterBtn(name) {
        return this.getPanelStack(name).$(`./div[contains(@class, 'hover-filter-btn')]`);
    }

    // AddPanelBtn
    getAddPanelBtn(name) {
        return this.getPanelStack(name).$$(`.//div[@class = 'mstrmojo-VITabStrip-addBtn-Img'][position() = 1]`)[0];
    }

    getPanelTabStrip(name) {
        return this.getPanelStack(name).$$('.mstrmojo-PanelTabStrip')[0];
    }

    getPanelCount(stack) {
        return this.getPanelTabStrip(stack).$$('.mstrmojo-VITab-tab').length;
    }

    getPanelInPanelStack(panel, stack) {
        return this.getPanelStack(stack).$(`.//div[text() = '${panel}']`);
    }

    getAdjancentPanelInPanelStack(panel1, panel2, stack) {
        // panel1 in front of panel 2
        return this.getPanelStack(stack).$(
            `//div[text() = '${panel1}']/ancestor::div[contains(@class, 'mstrmojo-VITab ')]/following-sibling::div//div[text()= '${panel2}']`
        );
    }

    getPanelContextMenu(panel, stack) {
        return this.getPanelInPanelStack(panel, stack).$(
            `./parent::div[@class= 'mstrmojo-VITab-tab']/following-sibling::div[@class= 'mstrmojo-VITab-menu']`
        );
    }

    getVerticalScrollBarInPanel(stack) {
        return this.getPanelStack(stack).$(
            `.//div[@class ='mstrmojo-DocPanel-wrapper mstrmojo-scrollbar-host hasVertical' and contains(@style, 'display: block;')]/div[@class = 'mstrmojo-scrolltrack vertical']/div[@class = 'mstrmojo-scrollbar vertical']`
        );
    }

    getPanelSwitchArrowInPanelStack(arrow, stack) {
        return this.getPanelStack(stack).$(`.${arrow}-arrow-btn`);
    }

    // get the selected panel in panel tab
    getCurrentPanelInPanelStack(stack) {
        return this.getPanelStack(stack).$$('.mstrmojo-VITab.selected .mstrmojo-EditableLabel')[0];
    }

    // To get the background css
    getCurrentPanelSectionInPanelStack(stack) {
        return this.getPanelStack(stack).$(
            `./div/div/div/div/div/div[contains(@class, 'mstrmojo-DocPanel-wrapper') and contains(@style, 'display: block')]//div[@class = 'mstrmojo-DocSubPanel-backgroundNode']`
        );
    }

    // To get the canvas height
    getCurrentPanelCanvasInPanelStack(stack) {
        return this.getPanelStack(stack).$(
            `./div/div/div/div/div/div[contains(@class, 'mstrmojo-DocPanel-wrapper') and contains(@style, 'display: block')]//div[@class = 'mstrmojo-DocSubPanel-content']`
        );
    }

    getContainerInCurrentPanelOfPanelStack(viz, stack) {
        return this.getPanelStack(stack).$(
            `.//div[contains(@class,'mstrmojo-DocPanel-wrapper') and contains(@style,'display: block;')]/div/div//div[text() = '${viz}']//ancestor::div[contains(@class, 'mstrmojo-UnitContainer ')][position() = 1]`
        );
    }

    getContainerContextMenuBtn(viz, stack) {
        return this.getContainerInCurrentPanelOfPanelStack(viz, stack).$(`//div[contains(@class, 'hover-menu-btn')]`);
    }

    getContextMenuByPartialText(menuItemName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]//*[contains(text(), '${menuItemName}')]`
        );
    }

    async openPanelStackCM(name) {
        let el = await this.getPanelStackContextMenuBtn(name);
        await browser.waitUntil(EC.presenceOf(el));
        await this.hoverMouseOnElement(el);
        await this.clickOnElementByClickEvent(el);
    }

    async panelStackCMAction(name, cmOption) {
        await this.openPanelStackCM(name);
        await this.selectContextMenuOption(cmOption);
    }

    async clearAllFilterOnPS(ps) {
        let el = await this.getPanelStackViewFilterBtn(ps);
        let panelStack = await this.getPanelStack(ps);
        await this.hoverMouseOnElement(panelStack);
        await el.waitForDisplayed();
        await this.clickOnElement(el);
        await this.selectContextMenuOption('Clear All');
    }

    async clearFilterOnPS(ps, condition) {
        let el = await this.getPanelStackViewFilterBtn(ps);
        await this.clickOnElementByClickEvent(el);
        let optionEl = await common.getContextMenuItemByPartialText(condition);
        await browser.waitUntil(EC.presenceOf(optionEl));
        await this.clickOnElementByInjectingScript(optionEl);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async addPanel(stack) {
        let el = await this.getAddPanelBtn(stack);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async switchPanel(panel, stack){
        let el = await this.getPanelInPanelStack(panel, stack); 
        await this.click({ elem: el }); 
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30); 
    }

    async switchPanelByArrow(arrow, stack) {
        let el = await this.getPanelSwitchArrowInPanelStack(arrow.toLowerCase(), stack);
        await this.hoverMouseOnElement(el);
        await this.clickOnElementByClickEvent(el);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async doubleClickOnPanel(panel, stack) {
        let el = await this.getPanelInPanelStack(panel, stack);
        await this.doubleClickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async panelCMAction(panel, stack, cmOption) {
        let p = await this.getPanelInPanelStack(panel, stack);
        let el = await this.getPanelContextMenu(panel, stack);
        await p.waitForDisplayed();
        await this.hoverMouseOnElement(p);
        await this.waitForElementVisible(el);
        // Use click event here, sometimes the context menu will overlap with the panel dnd icon
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.selectContextMenuOption(cmOption);
    }

    async moveVerticalScrollbarInPanel(stack, moveY) {
        let el = await this.getVerticalScrollBarInPanel(stack);
        if (moveY.indexOf('%') != -1) {
            let canvasEl = await this.getCurrentPanelCanvasInPanelStack(stack);
            let canvasHeight = await canvasEl.getCSSProperty('height');
            moveY = (parseFloat(canvasHeight.value) * parseFloat(moveY)) / 100;
        }
        await this.dragAndDropByPixel(el, 0, moveY, true);
    }

    async renamePanel(panel, stack, newPanel) {
        let el = await this.getPanelInPanelStack(panel, stack);
        await this.doubleClickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.inputToRename(newPanel);
    }

    async inputToRename(newName) {
        await this.renameTextField(newName);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickContainerInStack(viz, stack) {
        let el = await this.getContainerInCurrentPanelOfPanelStack(viz, stack);
        await browser.waitUntil(EC.presenceOf(el));
        await this.clickOnElementByClickEvent(el);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async containerCMAction(viz, stack, cmOption) {
        let el = await this.getContainerContextMenuBtn(viz, stack);
        await browser.waitUntil(EC.presenceOf(el));
        await this.clickOnElementByInjectingScript(el);
        await this.selectContextMenuOption(cmOption);
    }

    // apply/cancel button
    getPanelByID(partialId) {
        return this.$(`div[id*="${partialId}"].mstrmojo-DocPanelStack`);
    }

    getGhostImageContainerByIndex(index) {
        return this.$$('.mstrmojo-vi-ui-rw-GhostImageContainer')[index];
    }

    getButtonByName(id, name) {
        return this.getPanelByID(id)
            .$$('.mstrmojo-ButtonBox')
            .filter(async (el) => {
                const text = await el.getText();
                return text === name;
            })[0];
    }

    async clickButtonByName(id, name) {
        await this.click({ elem: await this.getButtonByName(id, name) });
    }

    async hoverOnButton(id, name) {
        await this.hover({ elem: await this.getButtonByName(id, name) });
    }

    async buttonStyle(id, name, style) {
        const cssProperty = await this.getButtonByName(id, name).getCSSProperty(style);
        return cssProperty.value.toString();
    }

    async isButtonDisabled(id, name) {
        const cssProperty = await this.getButtonByName(id, name).getAttribute('class');
        return cssProperty.includes('clickDisabled');
    }

    async getPanelPadding(id, style) {
        const elem = await this.getPanelByID(id).$('.mstrmojo-DocPanel-wrapper.mstrmojo-scrollbar-host');
        const cssProperty = await elem.getCSSProperty(style);
        return cssProperty.value.toString();
    }
}
