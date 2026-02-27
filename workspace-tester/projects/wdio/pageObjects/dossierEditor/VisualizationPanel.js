// This page is used to get and validate visualizations and layout that created by AI in dossier editor
import BaseVisualization from '../base/BaseVisualization.js';
import { checkElementByImageComparison, takeScreenshotByElement } from '../../utils/TakeScreenshot.js';

export default class VisualizationPanel extends BaseVisualization {
    // Element Locator
    getVizPanel() {
        return this.$('#rootView .mstrmojo-RootView-content');
    }

    getVIDoclayout() {
        return this.$('.mstrmojo-VIDocLayout');
    }

    // Get the page that is currently displayed
    getDisplayedPage() {
        return this.$('//div[contains(@class, "mstrmojo-DocPanel-wrapper") and contains(@style,"display: block;")]');
    }

    getDisplayedPageInConsumtpion() {
        return this.$(
            '//div[contains(@class, "mojo-theme-light") and not(contains(@style,"display: none;"))]//div[contains(@class, "mstrmojo-DocPanel-wrapper") and contains(@style,"display: block;")]'
        );
    }

    getAllTextBox() {
        return this.getDisplayedPage().$$('.mstrmojo-VITextBox');
    }

    getFirstTextBox() {
        return this.getDisplayedPage().$$('.mstrmojo-VITextBox')[0];
    }

    getTextBoxInTeams(text) {
        // return this.$$('.vi-doc-tf-value-text').filter(async (elem) => {
        //     const elemText = await elem.getText();
        //     return elemText === text;
        // })[0];
        return this.$(`//div[text()='${text}' and contains(@class,'vi-doc-tf-value-text')]`);
    }

    getPageTitle() {
        return this.getFirstTextBox().$('.mstrmojo-DocTextfield .vi-doc-tf-value-text');
    }

    getAllVizContainer() {
        return this.getDisplayedPage().$$('.mstrmojo-VIBox');
    }

    getAllKPIViz() {
        return this.getDisplayedPage().$$('.mstrmojo-VIBox .MultiMetricKPI');
    }

    getFirstKPIContainer() {
        return this.$('//div[contains(@class, "MultiMetricKPI")]//ancestor::div[contains(@class,"mstrmojo-VIBox")][1]');
    }

    getAllTitlesOnPage() {
        return this.getDisplayedPage().$$('.mstrmojo-VIBox .mstrmojo-VITitleBar');
    }

    getAllDisplayedTitles() {
        return this.getDisplayedPage().$$(
            '//div[contains(@class, "mstrmojo-UnitContainer-root mstrmojo-VIBox")]//div[contains(@class, "mstrmojo-VITitleBar") and contains(@style,"display: block;")]'
        );
    }

    getVizTypeNameByTitle(title) {
        return this.getVizByMatchFullTitle(title).$('.ghost-vis-name').getText();
    }

    getVizImgByTitle(title) {
        return this.getVizByMatchFullTitle(title).$('.mstrmojo-ghostImgDiv');
    }

    getSelectedVizContainer() {
        return this.$('.mstrmojo-VIBox.selected');
    }

    // Action Methods
    async clickTitleBar(title) {
        const titleBar = await this.getVizByMatchFullTitle(title).$('.mstrmojo-VITitleBar');
        await this.click({ elem: titleBar });
        await this.sleep(500);
    }

    async getTitleForEachVisulization() {
        // Get titles for each visualization and return an array of titles
        const titleBars = await this.getAllDisplayedTitles();
        let titleArray = [];
        for (const titleBar of titleBars) {
            titleArray.push(await titleBar.getText());
        }
        return titleArray;
    }

    async hoverTitleBar(title) {
        const titleBar = await this.getVizByMatchFullTitle(title).$('.mstrmojo-VITitleBar');
        await this.hover({ elem: titleBar });
        await this.sleep(500);
    }

    // Match full title instead of partial title to avoid getting wrong visualization
    getVizByMatchFullTitle(title) {
        return this.$$(`.mstrmojo-VIBox`).filter(async (elem) => {
            let elemText = await elem.$('.title-text').getText();
            if (elemText === '' || elemText === null) {
                // .getText() cannot always get the real text,in this case try java script
                elemText = await this.getInnerText(elem.$('.title-text'));
            }
            const value = await elem.isDisplayed();
            return elemText === title && value;
        })[0];
    }

    async maximizeVizByContainerElem(vizContainer) {
        await this.hover({ elem: vizContainer });
        const maximizeIcon = await vizContainer.$('.hover-max-restore-btn.visible');
        await this.click({ elem: maximizeIcon });
        return await this.dossierPage.waitForPageLoading();
    }

    async restoreVizByFullTitle(title) {
        await this.executeScript(
            'arguments[0].click();',
            await this.getVizByMatchFullTitle(title).$('.hover-max-restore-btn.restore')
        );
        return await this.dossierPage.waitForPageLoading();
    }

    async restoreVizByContainerElem(vizContainer) {
        await this.executeScript('arguments[0].click();', await vizContainer.$('.hover-max-restore-btn.restore'));
        return await this.dossierPage.waitForPageLoading();
    }

    async checkVizByTitle(testCase, imageName, title, tolerance = 0.5) {
        await this.waitForElementVisible(this.getVizPanel());
        await this.sleep(200);
        await checkElementByImageComparison(this.getVizByMatchFullTitle(title), testCase, imageName, tolerance);
    }

    async takeScreenshotByVizTitle(testCase, imageName, title, tolerance = 0.5) {
        await this.waitForElementVisible(this.getVizPanel());
        await this.sleep(200);
        await takeScreenshotByElement(this.getVizByMatchFullTitle(title), testCase, imageName, tolerance);
    }

    async takeScreenshotBySelectedViz(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getVizPanel());
        await this.sleep(200);
        await takeScreenshotByElement(this.getSelectedVizContainer(), testCase, imageName, tolerance);
    }

    async checkSelectedViz(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getVizPanel());
        await this.sleep(200);
        await checkElementByImageComparison(this.getSelectedVizContainer(), testCase, imageName, tolerance);
    }

    async selectCopyToOnVisualizationMenu({ vizTitle, copyOption = 'New Page' }) {
        await this.hover({ elem: this.getVisualizationMenuButton(vizTitle) });
        await this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(vizTitle),
            firstOption: 'Copy to',
            secondOption: copyOption,
        });
        await this.waitForElementInvisible(this.getMojoLoadingIndicator());
    }

    async selectDeleteOnVisualizationMenu(vizTitle) {
        await this.hover({ elem: this.getVisualizationMenuButton(vizTitle) });
        await this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(vizTitle),
            firstOption: 'Delete',
        });
        await this.waitForElementInvisible(this.getMojoLoadingIndicator());
    }
}
