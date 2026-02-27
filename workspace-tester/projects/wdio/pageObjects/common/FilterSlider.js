import BasePage from '../base/BasePage.js';
import FilterPanel from './FilterPanel.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

export default class FilterSlider extends BasePage {
    constructor() {
        super();
        this.filterPanel = new FilterPanel();
    }

    // Element locator
    getSlider(filterElementFinder) {
        return filterElementFinder.$('.mstrd-AttrSlider, .mstrd-MetricSlider, .mstrd-ParameterSlider');
    }

    getUpperSliderHandle(filterElementFinder) {
        return this.getSlider(filterElementFinder).$('.rc-slider-handle-2');
    }

    getSliderHandle(filterElementFinder) {
        return this.getSlider(filterElementFinder).$('.rc-slider-handle');
    }

    getLowerSliderHandle(filterElementFinder) {
        return this.getSlider(filterElementFinder).$('.rc-slider-handle-1');
    }

    getMinValue(filterElementFinder) {
        return this.getSlider(filterElementFinder).$(`[class*='min-value-tag']`);
    }

    getMaxValue(filterElementFinder) {
        return this.getSlider(filterElementFinder).$(`[class*='max-value-tag']`);
    }

    getLowerSliderInput(filterElementFinder) {
        return this.getSummary(filterElementFinder).$('input.mstrd-SliderSummary-left-input');
    }

    getUpperSliderInput(filterElementFinder) {
        return this.getSummary(filterElementFinder).$('input.mstrd-SliderSummary-right-input');
    }

    getSummaryInputBox(filterElementFinder) {
        return this.getSummary(filterElementFinder).$$('input');
    }

    getSummary(filterElementFinder) {
        return filterElementFinder.$(`[class*='summary-label']`);
    }

    getClearSlider(filterElementFinder) {
        return this.getSummary(filterElementFinder).$(
            '.mstrd-FilterCapsule-filterSummaryIcon.icon-pnl_delete-capsule, .mstrd-SliderSummary-icon.icon-pnl_delete-capsule'
        );
    }

    getSliderTooltipContainer() {
        return this.$('.ant-tooltip-inner');
    }
    // Action helper

    async clickLowerHandle(filterElementFinder) {
        await this.getLowerSliderHandle(filterElementFinder).click();
        return this.filterPanel.waitForGDDE();
    }

    async clickUpperHandle(filterElementFinder) {
        await this.getUpperSliderHandle(filterElementFinder).click();
        return this.filterPanel.waitForGDDE();
    }

    async clickHandle(filterElementFinder) {
        await this.getSliderHandle(filterElementFinder).click();
        return this.filterPanel.waitForGDDE();
    }

    async dragAndDropHandle(filterElementFinder, pos) {
        await this.dragAndDrop({
            fromElem: this.getSliderHandle(filterElementFinder),
            toElem: this.getSliderHandle(filterElementFinder),
            toOffset: { x: pos, y: 0 },
        });
        return this.filterPanel.waitForGDDE();
    }

    async dragAndDropLowerHandle(filterElementFinder, pos) {
        await this.dragAndDrop({
            fromElem: this.getLowerSliderHandle(filterElementFinder),
            toElem: this.getLowerSliderHandle(filterElementFinder),
            toOffset: { x: pos, y: 0 },
        });
        return this.filterPanel.waitForGDDE();
    }

    async dragAndDropUpperHandle(filterElementFinder, pos) {
        await this.dragAndDrop({
            fromElem: this.getUpperSliderHandle(filterElementFinder),
            toElem: this.getUpperSliderHandle(filterElementFinder),
            toOffset: { x: pos, y: 0 },
        });
        return this.filterPanel.waitForGDDE();
    }

    async hoverOnUpperHandle(filterElementFinder) {
        await this.hover({ elem: this.getUpperSliderHandle(filterElementFinder) });
        return this.waitForElementVisible(this.getSliderTooltipContainer(), {
            timeout: 1000,
            msg: 'Tooltip took too long to display',
        });
    }

    async hoverOnLowerHandle(filterElementFinder) {
        await this.hover({ elem: this.getLowerSliderHandle(filterElementFinder) });
        return this.waitForElementVisible(this.getSliderTooltipContainer(), {
            timeout: 1000,
            msg: 'Tooltip took too long to display',
        });
    }

    async hoverOnHandle(filterElementFinder) {
        await this.hover({ elem: this.getSliderHandle(filterElementFinder) });
        return this.waitForElementVisible(this.getSliderTooltipContainer(), {
            timeout: 1000,
            msg: 'Tooltip took too long to display',
        });
    }

    async hoverOnSummaryLabel(filterElementFinder) {
        await this.hover({ elem: this.getSummary(filterElementFinder) });
        return this.waitForElementVisible(this.getTooltipContainer(), {
            timeout: 1000,
            msg: 'Tooltip took too long to display',
        });
    }

    async hoverOnMinValue(filterElementFinder) {
        await this.hover({ elem: this.getMinValue(filterElementFinder) });
        return this.waitForElementVisible(this.getTooltipContainer(), {
            timeout: 1000,
            msg: 'Tooltip took too long to display',
        });
    }

    async hoverOnMaxValue(filterElementFinder) {
        await this.hover({ elem: this.getMaxValue(filterElementFinder) });
        return this.waitForElementVisible(this.getTooltipContainer(), {
            timeout: 1000,
            msg: 'Tooltip took too long to display',
        });
    }

    async dragToSamePosition(filterElementFinder) {
        await this.dragAndDrop({
            fromElem: this.getLowerSliderHandle(filterElementFinder),
            toElem: this.getUpperSliderHandle(filterElementFinder),
        });
        return this.filterPanel.waitForGDDE();
    }

    async updateLowerInput(filterElementFinder, value) {
        const el = this.getLowerSliderInput(filterElementFinder);
        const boxValue = await this.lowerInput(filterElementFinder);
        await el.click();
        if (this.isSafari()) {
            for (let i = 0; i < boxValue.length; i++) {
                await this.arrowRight();
                await this.delete();
            }
            await el.clearValue();
            await el.setValue(value.toString());
        } else {
            await this.clear({ elem: el });
            await browser.keys(value.toString());
        }
        await this.waitForTextPresentInElementValue(this.getLowerSliderInput(filterElementFinder), value, {
            timeout: 5000,
            msg: 'Input box does not display the provided value. expect: ' + value + ', actual: ' + boxValue,
        });
        await this.enter();
        return this.sleep(1000);
    }

    async updateUpperInput(filterElementFinder, value) {
        await this.getUpperSliderInput(filterElementFinder).click();
        const el = await this.getUpperSliderInput(filterElementFinder);
        await this.clear({ elem: el });
        await browser.keys(value.toString());
        await this.waitForTextPresentInElementValue(this.getUpperSliderInput(filterElementFinder), value, {
            timeout: 5000,
            msg: 'Input box does not display the provided value.',
        });
        await this.enter();
        return this.sleep(1000);
    }

    async clearSlider(filterElementFinder) {
        await this.getClearSlider(filterElementFinder).click();
        return this.filterPanel.waitForGDDE();
    }

    // Assertion helper

    async minValue(filterElementFinder) {
        return this.getMinValue(filterElementFinder).getText();
    }

    async maxValue(filterElementFinder) {
        return this.getMaxValue(filterElementFinder).getText();
    }

    async summary(filterElementFinder) {
        return this.getSummary(filterElementFinder).getText();
    }

    async lowerInput(filterElementFinder) {
        const value = await getAttributeValue(this.getLowerSliderInput(filterElementFinder), 'value');
        return value;
    }

    async upperInput(filterElementFinder) {
        const value = await getAttributeValue(this.getUpperSliderInput(filterElementFinder), 'value');
        return value;
    }

    async isSummaryPresent(filterElementFinder) {
        const classAtt = await getAttributeValue(this.getSummary(filterElementFinder), 'className');
        return !classAtt.includes('shouldNotRender');
    }

    async isSummaryInExcludeMode(name) {
        const textDecoCss = await this.getSummary(name).getCSSProperty('text-decoration');
        return textDecoCss.value.includes('line-through');
    }

    async isSummaryInputInExcludeMode(name) {
        return this.getSummaryInputBox(name).reduce(async (result, input) => {
            const textDecoCss = await input.getCSSProperty('text-decoration');
            return result && textDecoCss.value.includes('line-through');
        }, true);
    }

    async sliderTooltip() {
        await this.sleep(1000); // Sometimes more than 1 tooltip will be displayed or the old one is unmounting before the tooltip we want is ready, lets wait for the old one to be removed
        const toolTipString = await this.getSliderTooltipContainer().getText();
        return toolTipString.trim();
    }
}
