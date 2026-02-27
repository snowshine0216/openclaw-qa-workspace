import { getAttributeValue, getRowText } from '../../utils/getAttributeValue.js';
import BaseVisualization from '../base/BaseVisualization.js';
import Legend from '../common/Legend.js';

export default class LineChart extends BaseVisualization {
    constructor() {
        super();
        this.legend = new Legend();
    }

    getElemByOrder({ vizName, index }) {
        return this.getContainerByTitle(vizName).$$('.gm-shape-scircle')[index];
    }

    getYAxisElemList(vizName) {
        return this.getYAxis(vizName).$$('text');
    }
    getYAxis(vizName) {
        if (this.isSafari()) {
            // we can't process following action like right click with '.gm-yaxis' on safari,
            // so return its child here.
            return this.getContainerByTitle(vizName).$$('.gm-yaxis-cell')[0];
        }
        return this.getContainerByTitle(vizName).$$('.gm-yaxis')[0];
    }

    getXAxis(vizName) {
        if (this.isSafari()) {
            // we can't process following action like right click with '.gm-xaxis' on safari,
            // so return its child here.
            return this.getContainerByTitle(vizName).$$('.gm-xaxis-cell')[0];
        }
        return this.getContainerByTitle(vizName).$$('.gm-xaxis')[0];
    }

    getXAxisElemList(vizName) {
        return this.getXAxis(vizName).$$('text');
    }

    getAxisLabel(name) {
        return this.$$('.gm-text-body-nowrap').filter(async (elem) => {
            const elemName = await elem.getText();
            return elemName === name;
        })[0];
    }

    getReplaceWithOptions(optionname) {
        return this.$$('.item.unit').filter(async (elem) => {
            const name = await elem.getText();
            return name === optionname;
        })[0];
    }

    getDataValueForElem({ vizName, index }) {
        return this.getContainerByTitle(vizName).$$('.gm-chart').$$('text')[index];
    }

    getConstantBox() {
        return this.$('.me-content').$('.mstrmojo-TextBox');
    }

    getConfirmConstant() {
        return this.$$('.mstrmojo-Button-text').filter(async (elem) => {
            const text = await elem.getText();
            return text === 'OK';
        })[0];
    }

    async getElemByLine({ vizName, lineName, index }) {
        const lineIndex = await this.getLineIndex({ vizName, lineName });
        return this.$$('g')[lineIndex].$$('.gm-shape-scircle')[index];
    }

    async getlegendColor({ vizName, lineName }) {
        return this.legend.getlegendColor({ elementFinder: this.getContainerByTitle(vizName), element: lineName });
    }

    async getLineIndex({ vizName, lineName }) {
        let color = 0;
        let lineIndex = 0;
        let legendColor = await this.getlegendColor({ vizName, lineName });
        let legendColorText = legendColor.replaceAll(' ', '');
        try {
            await this.$$('g').forEach(async (elem, index) => {
                color = (await elem.$('polyline').getCSSProperty('stroke')).value;
                if (legendColorText.includes(color)) {
                    lineIndex = index;
                    throw new Error();
                }
            }, Promise.resolve());
        } catch (e) {}
        return lineIndex;
    }
    // Action Helper
    async composeElementName(textNode) {
        let name = await textNode.$$('tspan').reduce(async (acc, tspan) => {
            let text = await tspan.getText();
            if (browsers.params.browser && browsers.params.browser.browserName == 'msedge') {
                text = await getRowText(tspan);
            }
            await acc.push(text);
            return acc;
        }, Promise.resolve([]));
        return name.join(' ');
    }

    async elemIndexInYAxis({ vizName, eleName }) {
        let theIndex = -1;
        await this.getYAxisElemList(vizName).forEach(async (elem, index) => {
            const composedName = await this.composeElementName(elem);
            if (composedName === eleName) {
                theIndex = index;
            }
        }, Promise.resolve());
        return theIndex;
    }

    async elemIndexInXAxis({ vizName, eleName }) {
        let theIndex = -1;
        await this.getXAxisElemList(vizName).filter(async (elem, index) => {
            const composedName = await this.composeElementName(elem);
            if (composedName === eleName) {
                theIndex = index;
            }
        });
        return theIndex;
    }

    //Action methods for Chart context menus
    async selectChartContextMenuOption({ vizName, firstOption, secondOption, thirdOption }) {
        await this.selectContextMenuOptions({
            elem: this.getTitleBox(vizName),
            offset: { x: 200, y: 60 },
            firstOption,
            secondOption,
            thirdOption,
        });
    }

    async enabletrendline(vizName) {
        await this.selectChartContextMenuOption({ vizName, firstOption: 'Enable trendline' });
    }

    async showMajorandMinorGridLines(vizName) {
        await this.selectChartContextMenuOption({
            vizName,
            firstOption: 'Grid Lines',
            secondOption: 'Show Major and Minor',
        });
    }

    async showMajorLinesOnly(vizName) {
        await this.selectChartContextMenuOption({
            vizName,
            firstOption: 'Grid Lines',
            secondOption: 'Show Major Only',
        });
        await this.sleep(1000);
        await this.waitForElementInvisible(this.getVizLoadingSpinner());
    }

    async hideLines(vizName) {
        await this.selectChartContextMenuOption({ vizName, firstOption: 'Grid Lines', secondOption: 'Hide' });
        await this.sleep(1000);
        await this.waitForElementInvisible(this.getVizLoadingSpinner());
    }

    async selectAutomaticGridLinesOption(vizName) {
        await this.selectChartContextMenuOption({ vizName, firstOption: 'Grid Lines', secondOption: 'Automatic' });
        await this.sleep(1000);
        await this.waitForElementInvisible(this.getVizLoadingSpinner());
    }

    async addMaximumReferenceLine(vizName) {
        await this.selectChartContextMenuOption({
            vizName,
            firstOption: 'Add Reference Line',
            secondOption: 'Maximum',
        });
        await this.sleep(1000);
        await this.waitForElementInvisible(this.getVizLoadingSpinner());
    }

    async addMinimumReferenceLine(vizName) {
        await this.selectChartContextMenuOption({
            vizName,
            firstOption: 'Add Reference Line',
            secondOption: 'Minimum',
        });
        await this.sleep(1000);
        await this.waitForElementInvisible(this.getVizLoadingSpinner());
    }

    async addAverageReferenceLine(vizName) {
        await this.selectChartContextMenuOption({
            vizName,
            firstOption: 'Add Reference Line',
            secondOption: 'Average',
        });
    }

    async addMedianReferenceLine(vizName) {
        await this.selectChartContextMenuOption({ vizName, firstOption: 'Add Reference Line', secondOption: 'Median' });
    }

    async addFirstReferenceLine(vizName) {
        await this.selectChartContextMenuOption({ vizName, firstOption: 'Add Reference Line', secondOption: 'First' });
    }

    async addLastReferenceLine(vizName) {
        await this.selectChartContextMenuOption({ vizName, firstOption: 'Add Reference Line', secondOption: 'Last' });
    }

    async addConstantReferenceLine({ vizName, value }) {
        await this.selectChartContextMenuOption({
            vizName,
            firstOption: 'Add Reference Line',
            secondOption: 'Constant',
        });
        await this.getConstantBox().setValue(value);
        await this.getConfirmConstant().click();
        return this.dossierPage.waitForPageLoading();
    }

    async selectYAxisContextMenuOption({ vizName, firstOption, secondOption, thirdOption }) {
        return this.selectContextMenuOptions({ elem: this.getYAxis(vizName), firstOption, secondOption, thirdOption });
    }

    async selectXAxisContextMenuOption({ vizName, firstOption, secondOption, thirdOption }) {
        return this.selectContextMenuOptions({ elem: this.getXAxis(vizName), firstOption, secondOption, thirdOption });
    }

    async clickOnYAxis(vizName) {
        const item = this.getYAxis(vizName);
        await item.click();
    }

    async clickElemInYAxis({ vizName, eleName }) {
        const index = await this.elemIndexInYAxis({ vizName, eleName });
        const circleElement = await this.getElemByOrder({ vizName, index });
        return this.clickElmAndWait(circleElement);
    }

    //attribute name context menu options
    async replaceWith({ name, elemName }) {
        await this.selectAxisContextMenuOption({ name, firstOption: 'Replace With', secondOption: elemName });
    }

    async selectAxisContextMenuOption({ name, firstOption, secondOption }) {
        await this.selectContextMenuOptions({ elem: this.getAxisLabel(name), firstOption });
        await this.waitForElementVisible(this.getReplaceWithOptions(secondOption), {
            timeout: 3000,
            msg: 'The second level context menu did not open.',
        });
        await this.sleep(500);
        await this.getReplaceWithOptions(secondOption).click();
        return this.dossierPage.waitForPageLoading();
    }

    async clickElement({ vizName, eleName, lineName }) {
        const index = await this.elemIndexInXAxis({ vizName, eleName });
        const element = await this.getElemByLine({ vizName, lineName, index });
        try {
            await element.waitForClickable({ timeout: 5000 });
            await this.click({ elem: element });
        } catch (error) {
            console.warn('Using Action API to click:', error.message);
            await browser
                .action('pointer')
                .move({ origin: element, x: 0, y: 0 })
                .down({ button: 0 })
                .pause(50)
                .up({ button: 0 })
                .perform();
        }
        await this.dossierPage.waitForPageLoading();
    }

    //element context menu options
    async selectElementContextMenuOption({ vizName, eleName, lineName, firstOption, secondOption, thirdOption }) {
        const index = await this.elemIndexInXAxis({ vizName, eleName });
        const el = await this.getElemByLine({ vizName, lineName, index });
        await this.selectContextMenuOptions({
            elem: el,
            firstOption,
            secondOption,
            thirdOption,
        });
        return this.sleep(500);
    }

    async selectElementContextMenuOptionOnSingleLine({ vizName, eleName, firstOption, secondOption, thirdOption }) {
        const index = await this.elemIndexInXAxis({ vizName, eleName });
        await this.selectContextMenuOptions({
            elem: this.$$('.gm-shape-scircle')[index],
            firstOption,
            secondOption,
            thirdOption,
        });
        return this.sleep(500);
    }

    async keepOnly({ vizName, eleName, lineName }) {
        await this.selectElementContextMenuOption({ vizName, eleName, lineName, firstOption: 'Keep Only' });
    }

    async exclude({ vizName, eleName, lineName }) {
        await this.selectElementContextMenuOption({ vizName, eleName, lineName, firstOption: 'Exclude' });
    }

    async showOnlyValueLabels({ vizName, eleName, lineName }) {
        await this.selectElementContextMenuOption({
            vizName,
            eleName,
            lineName,
            firstOption: 'Data Labels',
            secondOption: 'Values',
        });
    }

    async hideLabels({ vizName, eleName, lineName }) {
        await this.selectElementContextMenuOption({
            vizName,
            eleName,
            lineName,
            firstOption: 'Data Labels',
            secondOption: 'None',
        });
    }

    async drill({ vizName, eleName, lineName, drillOption }) {
        await this.selectElementContextMenuOption({
            vizName,
            eleName,
            lineName,
            firstOption: 'Drill',
            secondOption: drillOption,
        });
    }

    async dataLabel({ vizName, index }) {
        const valueString = await this.getDataValueForElem({ vizName, index }).getText();
        return Number(valueString.replace(/[^0-9\.]+/g, ''));
    }

    //Action methods for legend
    async expandLegend(vizName) {
        return this.legend.expandLegendBox(this.getContainerByTitle(vizName));
    }

    async collapseLegend(vizName) {
        return this.legend.collapseLegendBox(this.getContainerByTitle(vizName));
    }

    async hideLegend(vizName) {
        return this.legend.hideLegendBox(this.getContainerByTitle(vizName));
    }

    async showLegend(vizName) {
        return this.selectContextMenuOptions({
            elem: this.getTitleBox(vizName),
            offset: { x: 50, y: 50 },
            firstOption: 'Show Legend',
        });
    }

    async hoverOnElementByXAxis({ vizName, eleName, lineName }) {
        const index = await this.elemIndexInXAxis({ vizName, eleName });
        await this.hover({ elem: await this.getElemByLine({ vizName, lineName, index }) });
        await this.waitForElementVisible(this.getVizTooltipContainer(), {
            timeout: 3000,
            msg: 'Tooltip is not displayed.',
        });
    }

    // Assertion
    async isTrendLineDisplayed(vizName) {
        const value = await this.getContainerByTitle(vizName).$$('.gm-set-trendline')[0].isDisplayed();
        return this.getContainerByTitle(vizName).$$('.gm-set-trendline')[0].isDisplayed();
    }

    //used when changing from 'show minor' to 'not show minor'
    async isMinorLineDisplayed(vizName) {
        const value = await this.getContainerByTitle(vizName).$$('.gm-grid-line-minor')[0].isDisplayed();
        return this.getContainerByTitle(vizName).$$('.gm-grid-line-minor')[0].isDisplayed();
    }

    async isMajorLineDisplayed(vizName) {
        const value = await this.getContainerByTitle(vizName).$$('.gm-grid-line-major')[0].isDisplayed();
        return this.getContainerByTitle(vizName).$$('.gm-grid-line-major')[0].isDisplayed();
    }

    async isReferenceValueDisplayed({ vizName, value }) {
        const el = this.getContainerByTitle(vizName)
            .$$('.gm-tspan')
            .filter(async (elem) => {
                const referenceValue = await elem.getText();
                return referenceValue === value;
            })[0];
        const value1 = await el.isDisplayed();
        return this.getContainerByTitle(vizName)
            .$$('.gm-tspan')
            .filter(async (elem) => {
                const referenceValue = await elem.getText();
                return referenceValue === value;
            })[0]
            .isDisplayed();
    }

    async isAttributeOrMetricName(name) {
        const text = await this.getAxisLabel(name).getText();
        return name === text;
    }

    async isElementPresent({ vizName, eleName }) {
        const index = await this.elemIndexInXAxis({ vizName, eleName });
        return index !== -1;
    }

    async isLegendMinimized(vizName) {
        return this.legend.isLegendMinimized(this.getContainerByTitle(vizName));
    }

    async isLegendPresent(vizName) {
        return this.legend.isLegendPresent(this.getContainerByTitle(vizName));
    }

    async legendCount(vizName) {
        return this.legend.getLegends(this.getContainerByTitle(vizName)).length;
    }

    async legendData({ vizName, index }) {
        return this.legend.getLegends(this.getContainerByTitle(vizName))[index].getText();
    }
}
