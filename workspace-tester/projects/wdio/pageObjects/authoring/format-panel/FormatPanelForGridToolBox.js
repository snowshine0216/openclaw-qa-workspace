import BasePage from '../../base/BasePage.js';
import LoadingDialog from '../../dossierEditor/components/LoadingDialog.js';
import FontPicker from '../../common/FontPicker.js';

export default class FormatPanelForGridToolBox extends BasePage {
    /**
     * element
     */
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.fontPicker = new FontPicker('.mstrmojo-ui-ToolbarPopup .mstrmojo-FontPickerContainer ');
    }

    get toolBoxRoot() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Box mstrmojo-ui-ToolbarPopup') and contains(@style,'display: block;')]`
        );
    }

    get textFormatRoot() {
        return this.toolBoxRoot;
    }

    getTextAlignOption(option) {
        return this.toolBoxRoot.$(`.//div[contains(@class, 'txtAlign')]//div[contains(@class, '${option}')]`);
    }

    /** Action method */

    async selectTextAlign(align) {
        await this.click({ elem: this.getTextAlignOption(align) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }
}
