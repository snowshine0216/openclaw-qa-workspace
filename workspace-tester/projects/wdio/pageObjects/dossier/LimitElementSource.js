import AuthoringFilters from '../common/AuthoringFilters.js';
import BasePage from '../base/BasePage.js';
import DossierAuthoringPage from './DossierAuthoringPage.js';
import TOCMenu from '../common/TOCMenu.js';

export default class LimitElementSource extends BasePage {
    constructor() {
        super();
        this.authoringFilters = new AuthoringFilters();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.tocMenu = new TOCMenu();

        this.limitElementSourceMenuItemName = 'Limit Element Source';
    }

    async openLimitElementSourceMenu(attributesMetricsName) {
        await this.clickAndNoWait({ elem: this.authoringFilters.getFilterContextMenuButton(attributesMetricsName) });
        await this.click({ elem: this.dossierAuthoringPage.getMenuItem(this.limitElementSourceMenuItemName) });
    }

    async selectElementSource(attributesMetricsName, source) {
        await this.openLimitElementSourceMenu(attributesMetricsName);
        await this.click({ elem: this.dossierAuthoringPage.getMenuItem(source) });
    }

    async clickOutside() {
        await this.click({ elem: this.tocMenu.getTocFieldToRightClick() });
    }

    async clickOutsideElementSourceSelection(attributesMetricsName) {
        await this.openLimitElementSourceMenu(attributesMetricsName);
        await browser.pause(1000);
        await this.clickOutside();
    }

    async openLimitElementSourceMenuInCanvas(attributesMetricsName) {
        await this.hover({ elem: this.authoringFilters.getInCanvasUnitContainerWithLabel(attributesMetricsName) });
        await this.clickAndNoWait({ elem: this.authoringFilters.getThreeDotsButtonInFilterInCanvas() });
        await this.clickAndNoWait({ elem: this.dossierAuthoringPage.getMenuItem(this.limitElementSourceMenuItemName) });
    }

    async selectElementSourceInFilterInCanvas(attributesMetricsName, source) {
        await this.openLimitElementSourceMenuInCanvas(attributesMetricsName);
        await this.click({ elem: this.dossierAuthoringPage.getMenuItem(source) });
        await this.dossierAuthoringPage.getMenuItem(source).waitForExist({ reverse: true });
        await browser.pause(2000);
    }
}
