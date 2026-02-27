import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import InCanvasSelector_Authoring from './InCanvasSelector_Authoring.js';
import LayersPanel from '../dossierEditor/LayerPanel.ts';

/** 
 * Class represing the Panel Selector
 * @extends InCanvasSelector_Authoring
 */

export default class PanelSelector extends InCanvasSelector_Authoring {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.layersPanel = new LayersPanel();
    }

    getPanelSelctor(selectorTitle){
        return  this.$$(`//div[contains(@class,'mstrmojo-PanelSelectorBox') and descendant::div[text()='${selectorTitle}']]`)[0]; 
    }

    getElementFromLinkBarPanelSelector(selectorTitle, elementName){
        return this.getPanelSelctor(selectorTitle).$(`.//div[text() = '${elementName}']`); 
    }

    getAdjancentElementFromLinkBarPanelSelector(selectorTitle, elementName1, elementName2){
        return this.getPanelSelctor(selectorTitle).$(`.//div[text() = '${elementName1}']/ancestor::div[contains(@class, 'item') and contains(@class, 'equal-width')]/following-sibling::div//div[text() = '${elementName2}']`); 
    }

    getElementBackgroundFromLinkBarPanelSelector(selectorTitle, elementName){
        return this.getPanelSelctor(selectorTitle).$(`.//div[contains(@class, 'item ') and descendant::div[text() = '${elementName}']]`); 
    }

    getCurrentSelectionFromLinkBarPanelSelector(selectorTitle){
        return this.getPanelSelctor(selectorTitle).$('.item.selected .item-text'); 
    }

    getPanelSelctorDropdown(selectorTitle){
        return this.getPanelSelctor(selectorTitle).$('.mstrmojo-ui-Pulldown-text'); 
    }


    // select one or more panel stacks as target for panel selector 
    async selectTargetPanelStackFromWithinSelector(panelStacks, selectorTitle){
        let el = await this.getSelectTargetButton(selectorTitle);
        await this.clickOnElement(el); 
        let trgtVizList = panelStacks.split(",");
        for (let target of trgtVizList) {
            await this.clickOnElement(this.getContainer(target)); 
        }
        let applyButton = await this.applyButtonFromFilterBoxDialog;
        await browser.waitUntil(EC.presenceOf(applyButton), 3 * 1000);
        await this.clickOnElement(applyButton);
        await this.checkNonPresenceOfDynamicSelIcon(selectorTitle);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTargetPanelStackFromLayersPanel(panelStacks, selectorTitle){
        let el = await this.getSelectTargetButton(selectorTitle);
        await this.clickOnElement(el); 
        let trgtVizList = panelStacks.split(",");
        for (let target of trgtVizList) {
            await this.clickOnElement(await this.layersPanel.getContainerFromLayersPanel(target));
        }
        let applyButton = await this.applyButtonFromFilterBoxDialog;
        await this.clickOnElement(applyButton);
        await this.checkNonPresenceOfDynamicSelIcon(selectorTitle);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }   

    async selectorCMAction(selector, cmOption){
        await this.openContextMenu(selector); 
        await this.selectContextMenuOption(cmOption); 
    }

    async linkBarPanelSelector(selectorTitle, elementName) {
        let el = await this.getElementFromLinkBarPanelSelector(selectorTitle, elementName);
        await this.click( {elem: el} );
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async dropdownPanelSelector(selectorTitle, elementName) {
        let el = await this.getPanelSelctorDropdown(selectorTitle); 
        await this.clickOnElement(el); 
        let el2 = await this.getSingleDropdownElement(elementName); 
        await browser.waitUntil(EC.presenceOf(el2)); 
        await this.clickOnElement(el2); 
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

}