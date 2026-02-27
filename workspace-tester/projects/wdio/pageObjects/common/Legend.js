import BasePage from '../base/BasePage.js';

export default class Legend extends BasePage {

    // Element locator
    // get the legend expand or collapse button
    getLegendElement(elementFinder, expanded) {
        if (expanded) {
            return elementFinder.$('.gm-legend-tri-button');
        } else {
            return elementFinder.$('.gm-legend-tri-button-collapsed');
        }
    }

    // This method closes/hides the legend box from the page
    getCloseButton(elementFinder) {
        return elementFinder.$('.gm-legend-close-button');
    }

    getLegends(elementFinder) {
        return elementFinder.$$('.gm-legend-tr');
    }

    async getlegendColor({ elementFinder, element }) {
        let color = 0;
        await this.getLegends(elementFinder).forEach(async (elem) => {
            const elemName = await elem.$('.gm-legend-textcell').getText();
            if (elemName === element) {
                color = await elem.$('.gm-legend-colorbox-div').getAttribute('style');
            }
        });
        return color;
    }

    //Action Helpers

    // This method collapses the legend
    async collapseLegendBox(elementFinder) {
        //await this.waitForElementVisible(elementFinder);
        const el = elementFinder.$('.gm-legend-title');
        await this.waitForElementVisible(el);
        const collapseButton = this.getLegendElement(elementFinder, true);
        await this.hover({ elem: el });
        await collapseButton.click();
        await this.waitForElementStaleness(this.getLegendElement(elementFinder, true), {timeout: 5000, msg: 'Legend is not collapsed.'});
    }

    // This method expands the legend
    async expandLegendBox(elementFinder) {
        const expandButton = this.getLegendElement(elementFinder, false);
        await this.hover({ elem: expandButton });
        await expandButton.click();
        const el = elementFinder.$('.gm-legend-title');
        await this.waitForElementVisible(el, {timeout: 5000, msg: 'Legend is not expanded.'});
    }

    // This method hides the legend box
    async hideLegendBox(elementFinder) {
        const el = elementFinder.$('.gm-legend-title');
        const closeButton = this.getCloseButton(elementFinder);
        await this.hover({ elem: el });
        await closeButton.click();
        await this.waitForElementStaleness(el, {timeout: 5000, msg: 'Legend is not closed.'});
    }

    // Assertion helper

    async isLegendMinimized(elementFinder) {
        const value = await elementFinder.$('.gm-legend-title').isDisplayed();
        return !value;
    }

    async isLegendPresent(elementFinder) {
        return elementFinder.$('.gm-legend-table').isDisplayed();
    }
}
