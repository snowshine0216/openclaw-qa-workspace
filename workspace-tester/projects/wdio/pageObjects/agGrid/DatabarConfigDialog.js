import Utils from '../authoring/Utils.js';
import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';

export default class DatabarConfigDialog extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        // this.dossierEditorUtility = new DossierEditorUtility();
    }

    get dataBarEditor() {
        return $(`//div[contains(@class, 'mstrmojo-BarChartEditor') and contains(@style, 'display: block')]`);
    }

    getdataBarEditorTitle(title) {
        return this.dataBarEditor.$(`.//div[@class = 'mstrmojo-Editor-title' and text()='${title.replace(
            / /g,
            '\u00a0'
        )}']`);
    }

    //label: Apply to; Bar direction
    getPulldownWithLabel(label) {
        return this.dataBarEditor.$(
            `.//div[@class = 'mstrmojo-Label' and text() ='${label}']/parent::div//div[contains(@class, 'mstrmojo-ui-Pulldown-text')]`
        );
    }

    getPulldownCurrSelectionWithLabel(label, option) {
        return this.dataBarEditor.$(
            `.//div[@class = 'mstrmojo-Label' and text() ='${label}']/parent::div//div[contains(@class, 'mstrmojo-ui-Pulldown-text') and text() = '${option}']`
        );
    }

    get pullDownList() {
        return $(`//div[contains(@class, 'mstrmojo-PopupList ctrl-popup-list') and contains (@style, 'display: block')]`);
    }

    getPullDownListOption(option) {
        return this.pullDownList.$(
            `.//div[contains(@class, 'item') and text()='${option}']`);
    }

    getCheckboxbyLabel(label){
        return this.dataBarEditor.$(`.//div[contains(@class, 'mstrmojo-ui-Checkbox') and @aria-label = '${label}']`);
    }

    getMinMaxInput(minORmax) {
        let index = minORmax.toLowerCase() === 'min' ? 1 : 2;
        return this.dataBarEditor.$(`(.//input[contains(@class, 'min-max-input')])[${index}]`);
    }
    
    // Apply, OK, Cancel
    getBtnOnEditor(btnTxt) {
        return this.dataBarEditor.$(`.//div[contains(@class,'mstrmojo-Button-text') and text()='${btnTxt}']`);
    }

    getColorPicker(positiveORnegative) {
        let index = positiveORnegative.toLowerCase() === 'positive' ? 1 : 2;
        return this.dataBarEditor.$(`(.//div[contains(@class, 'mstrmojo-ColorPickerBtn')])[${index}]`);
    }    

    // function helper
    async isDatabarDialogOpened() {
        return (await this.dataBarEditor).isExisting();
    }

    async dataBarDialogTitleIsDisplayed(title) {
        return (await this.getdataBarEditorTitle(title)).isDisplayed();
    }

    async changeDropdown(label, newOption) {
        // click on dropdown
        let el = await this.getPulldownWithLabel(label);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        //pull down list appear
        let el2 = await this.pullDownList;
        await this.waitForElementVisible(el2);
        // clikc on new option
        let el3 = await this.getPullDownListOption(newOption);
        await this.click({ elem: el3 });
        // pull down list closed
        await this.waitForElementInvisible(el2);
    }

    async clickBtn(btnTxt) {
        await this.click({ elem: await this.getBtnOnEditor(btnTxt) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async isMinMaxInputDisabled(minORmax) {
        let inputElement = await this.getMinMaxInput(minORmax);
        let classAttribute = await inputElement.getAttribute('class');
        return classAttribute.includes('disabled');
    }

    async isMinMaxInputInvalid(minORmax) {
        let inputElement = await this.getMinMaxInput(minORmax);
        let classAttribute = await inputElement.getAttribute('class');
        return classAttribute.includes('invalid');
    }

    async typeMinMaxValue(minORmax, value) {
        let inputElement = await this.getMinMaxInput(minORmax);
        await this.waitForElementVisible(inputElement);
        await this.click({ elem: inputElement });
        await inputElement.addValue(value)
    }

    async clickColorPicker(positiveORnegative) {
        let colorPicker = await this.getColorPicker(positiveORnegative);
        await this.click({ elem: colorPicker });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async verfiyPulldownCurrSelection(label, option) {
        return (await this.getPulldownCurrSelectionWithLabel(label, option)).isDisplayed();
    }

    async clickCheckboxbyLabel(label) {
        let el = await this.getCheckboxbyLabel(label);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await browser.pause(300);
    }

    async isCheckboxchecked(label) {
        let el = await this.getCheckboxbyLabel(label);
        let classAttribute = await el.getAttribute('class');
        return classAttribute.includes('checked');
    }
}