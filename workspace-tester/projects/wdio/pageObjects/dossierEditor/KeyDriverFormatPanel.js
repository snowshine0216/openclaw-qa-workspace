import FormatPanel from '../dossierEditor/FormatPanel.js';
import Alert from '../common/Alert.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import LoadingDialog from './components/LoadingDialog.js';

export default class KeyDriverFormatPanel extends FormatPanel {
    constructor() {
        super();
        this.alert = new Alert();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.loadingDialog = new LoadingDialog();
    }

    // Element Locator
    getColorPickerToolbar() {
        return this.$(`//div[@class = "color-picker-toolbar"]`);
    }

    getColorButton(btnName) {
        return this.$(`//div[@class = "color-grid"]//button[contains(@title, "${btnName}")]`);
    }

    getIncreaseFactorColor() {
        return this.$(
            `//div[@class = 'mstr-editor-horizontal-layout' and contains(string(), 'Increase')]//div[@class = 'button-dropdown']`
        );
    }

    getDecreaseFactorColor() {
        return this.$(
            `//div[@class = 'mstr-editor-horizontal-layout' and contains(string(), 'Decrease')]//div[@class = 'button-dropdown']`
        );
    }

    // Action Methods
    async changeIncreaseFactorColor(colorName) {
        await this.click({ elem: this.getIncreaseFactorColor() });
        await this.waitForElementVisible(this.getColorPickerToolbar());
        await this.click({ elem: this.getColorButton(colorName) });
        await this.dossierAuthoringPage.clickToDismissPopups();
    }

    async changeDecreaseFactorColor(colorName) {
        await this.click({ elem: this.getDecreaseFactorColor() });
        await this.waitForElementVisible(this.getColorPickerToolbar());
        await this.click({ elem: this.getColorButton(colorName) });
        await this.dossierAuthoringPage.clickToDismissPopups();
    }
}
