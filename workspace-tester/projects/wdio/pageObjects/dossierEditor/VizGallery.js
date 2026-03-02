import BasePage from '../base/BasePage.js';
import LoadingDialog from './components/LoadingDialog.js';
import DossierEditorUtility from './components/DossierEditorUtility.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import Toolbar from './Toolbar.js';
import { takeScreenshotByElement } from '../../utils/TakeScreenshot.js';

export default class VizGallery extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.toolbar = new Toolbar();
        this.dossierEditorUtility = new DossierEditorUtility();
    }

    // Element locators
    getGallery() {
        return this.$('.mstrmojo-galleryPanel-new');
    }

    getVizCategory(categoryName) {
        return this.getGallery().$(`//div[contains(@class,'category ${categoryName}')]`);
    }

    getVizName(visualizationName) {
        return this.getGallery().$(`//div[@class='mstrmojo-VIGallery']//div[@data-vizname='${visualizationName}']/div`);
    }

    getVizDescriptionTitle(text) {
        return this.$$('.name').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    // Action Helpers
    // click on gallery panel to open it
    async clickOnInsertVI(iconName = 'Visualization') {
        await this.toolbar.clickButtonFromToolbar(iconName);
        await this.waitForElementVisible(this.getGallery());
    }

    async clickOnVizCategory(categoryName) {
        let el = await this.getVizCategory(categoryName);
        await this.click({ elem: el });
    }

    async clickOnViz(vizName) {
        let el = await this.getVizName(vizName);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changeVizType(categoryName, vizName) {
        await this.clickOnVizCategory(categoryName);
        await this.clickOnViz(vizName);
    }

    async hoverOnViz(vizName) {
        let el = await this.getVizName(vizName);
        await this.hover({ elem: el });
        await this.waitForElementVisible(this.getVizDescriptionTitle(vizName));
    }

    async checkGallery(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getGallery());
        await takeScreenshotByElement(this.getGallery(), testCase, imageName, tolerance);
    }
}
