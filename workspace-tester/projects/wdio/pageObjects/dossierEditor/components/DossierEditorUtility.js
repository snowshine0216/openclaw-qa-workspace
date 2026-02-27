import BasePage from '../../base/BasePage.js';
import LoadingDialog from './LoadingDialog.js';
import {
    checkElementByImageComparison,
    takeScreenshotByElement,
    takeScreenshotAndAttachToAllure,
} from '../../../utils/TakeScreenshot.js';

export default class DossierEditorUtility extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
    }
    getRootViewContent() {
        return this.$('#rootView .mstrmojo-RootView-content');
    }
    // Edit/Format Panel + Vis Layout
    getVIDoclayout() {
        return this.$('.mstrmojo-VIDocLayoutViewer');
    }
    // Viz Layout
    getVIVizPanel() {
        return this.$('.mstrmojo-VIVizPanel-content');
    }
    // Eidt/Format/Filter Panel
    getVIBoxPanel() {
        return this.getVIDoclayout().$('.mstrmojo-VIBoxPanelContainer');
    }
    //Layer/Theme panel
    getVizControlPanel() {
        return this.$('.mstrmojo-VizControl ');
    }

    getRootViewPathbar() {
        return this.$('.mstrmojo-RootView-pathbar');
    }
    // Action Methods
    async clickOnElementThenWaitLoadingData(element) {
        await this.click({ elem: element });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async doubleClickOnElementThenWaitLoadingData(element) {
        await this.doubleClick({ elem: element });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // Edit/Format Panel + Vis Layout
    async checkVIDoclayout(testCase, imageName) {
        await this.waitForElementVisible(this.getVIDoclayout());
        await this.sleep(200);
        await takeScreenshotAndAttachToAllure(this.getVIDoclayout(), testCase, imageName);
    }

    async takeScreenshotByVIDoclayout(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getVIDoclayout());
        await takeScreenshotByElement(this.getVIDoclayout(), testCase, imageName, tolerance);
    }

    // Viz Layout
    async checkVIVizPanel(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getVIVizPanel());
        await this.sleep(200);
        await checkElementByImageComparison(this.getVIVizPanel(), testCase, imageName, tolerance);
    }

    async takeScreenshotByVIVizPanel(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getVIVizPanel());
        await takeScreenshotByElement(this.getVIVizPanel(), testCase, imageName, tolerance);
    }

    // Edit/Format/Filter Panel
    async checkVIBoxPanel(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getVIBoxPanel());
        await checkElementByImageComparison(this.getVIBoxPanel(), testCase, imageName, tolerance);
    }

    async takeScreenshotByVIBoxPanel(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getVIBoxPanel());
        await takeScreenshotByElement(this.getVIBoxPanel(), testCase, imageName, tolerance);
    }

    // Layer/Theme panel
    async checkVizControlPanel(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getVizControlPanel());
        await takeScreenshotByElement(this.getVizControlPanel(), testCase, imageName, tolerance);
    }

    async clickToDismissPopups() {
        await this.clickByPresence({ elem: this.getRootViewPathbar() });
    }
}
