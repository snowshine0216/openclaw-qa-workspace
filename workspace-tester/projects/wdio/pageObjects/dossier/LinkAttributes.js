import BasePage from '../base/BasePage.js';
import LibraryAuthoringPage from '../library/LibraryAuthoringPage.js';
import DossierPage from './DossierPage.js';
import DossierAuthoringPage from './DossierAuthoringPage.js';
import DatasetsPanel from '../dossierEditor/DatasetsPanel.js';

export default class LinkAttributes extends BasePage {
    constructor() {
        super();
        this.dossierPage = new DossierPage();
        this.libraryAuthoringPage = new LibraryAuthoringPage();
        this.datasetsPanel = new DatasetsPanel();
        this.dossierAuthoringPage = new DossierAuthoringPage();
    }

    // Element locator
    getLinkToOtherDatasetButton() {
        return this.$(`//div[text()='Link to Other Dataset...']`);
    }

    getSelectAnAttributeButton() {
        return this.$('//div[text()="Select an attribute"]');
    }

    getAttributeFromList(itemName) {
        return this.$(`//div[contains(@class,'lv1 dim item')][text()='${itemName}']`);
    }

    getOkButton() {
        return this.$(`//div[contains(@class,'mstrmojo-Button-text')][text()='OK']`);
    }

    // Action helper
    async linkToOtherDataset(datasetName, itemName, attributeToLinkTo) {
        expect(await this.dossierAuthoringPage.getDatasetByName(datasetName).isExisting()).toBe(true);
        await this.rightClick({ elem: this.dossierAuthoringPage.getDatasetItem(datasetName, itemName) });
        await this.click({ elem: this.getLinkToOtherDatasetButton() });
        await this.clickAndNoWait({ elem: this.getSelectAnAttributeButton() });
        await this.clickAndNoWait({ elem: this.getAttributeFromList(attributeToLinkTo) });
        await this.click({ elem: this.getOkButton() });
        await browser.pause(2000);
    };
}
