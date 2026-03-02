import BaseFilter from '../base/BaseFilter.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

export default class VisualizationFilter extends BaseFilter {
    constructor() {
        super();
    }

    getVizFilterContainer(name) {
        return this.$$('.mstrd-FilterItemContainer').filter(async (elem) => {
            const filterName = await elem
                .$('.mstrd-FilterItemTitle-filterTitle.mstrd-FilterItemTitle-filterTitle--isVisFilter')
                .getText();
            return filterName === name;
        })[0];
        // old e2e
        // return this.element(by.xpath(`//*[contains(@class, 'mstrd-FilterItemContainer')][.//span[@class='mstrd-FilterItemTitle-filterTitle mstrd-FilterItemTitle-filterTitle--isVisFilter'][text()='${name}']]`));
    }

    getVizFilterHeader() {
        return this.$('.mstrd-VisFilterHeader');
    }

    getVizFilterDetails() {
        return this.getVizFilterHeader().$('.mstrd-VisFilterDetailsPanel-Body');
    }

    getVizFilterDetialsBody() {
        return this.$('.mstrd-VisFilterDetailsPanel-Body');
    }

    getClearAll() {
        return this.$('.mstrd-VisFilterHeader-ClearAll');
    }

    getVizFilterLockMessage() {
        return this.$('.mstrd-VisFilterHeader-lockedMsg');
    }

    getVizFilterContextMenuDots(name) {
        return this.getVizFilterContainer(name).$('.mstrd-FilterItemContextMenu-dots.icon-pnl_more-options');
    }

    async openVizSecondaryPanel(filterName) {
        await this.getVizFilterContainer(filterName).click();
        await this.waitForElementVisible(this.getSecondaryPanel(), {
            timeout: 5000,
            msg: 'Filter Secondary Panel is not clickable.',
        });
        await this.sleep(3000);
    }

    async closeVizSecondaryPanel(filterName) {
        await this.getVizFilterContainer(filterName).click();
        await this.wait(
            this.EC.not(
                this.EC.presenceOf(super.getSecondaryPanel()),
                5000,
                'Filter Secondary Panel is still displayed after close.'
            )
        );
    }

    async openVizFilterContextMenu(filterName) {
        await this.waitForElementVisible(this.getVizFilterContextMenuDots(filterName), {timeout: 5000, msg: 'Context menu dots is not displayed'});
        await this.sleep(1000); // Wait for animation to complete
        await this.getVizFilterContextMenuDots(filterName).click();
        await this.waitForElementVisible(super.getContextMenu(), {
            timeout: 5000,
            msg: 'Context menu is not displayed',
        });
        await this.sleep(2000); // Wait for animation to complete
        await this.filterPanel.waitForGDDE();
    }

    async selectVizFilterContextMenuOption(filterName, menuName) {
        await super.getContextMenuOption(menuName).click();
        const className = await this.getVizFilterContainer(filterName).getAttribute('class');
        if (className.indexOf('filterSelected') === -1) {
            await this.wait(
                this.EC.not(this.EC.presenceOf(super.getContextMenu())),
                5000,
                'Context Menu is not dismissed.'
            );
        }
        await this.sleep(1000); // Wait for animation to complete
    }

    async clearAll() {
        await this.getClearAll().click();
    }

    //Assertion methods

    async vizFilterSelectionInfo(name) {
        return this.getVizFilterContainer(name).$('.mstrd-FilterItemTitle-filterSelectionInfo').getText();
    }

    async vizFilterHeaderSelectedInfo() {
        return this.getVizFilterHeader().$('.mstrd-VisFilterHeader-SelcetedInfo').getText();
    }

    async hideVizFilterDetailsBody() {
        await this.hideElement(this.getVizFilterDetialsBody());
    }

    async showVizFilterDetailsBody() {
        await this.showElement(this.getVizFilterDetialsBody());
    }

    async isClearAllDisabled() {
        await this.waitForElementVisible(this.getClearAll());
        const className = await getAttributeValue(this.getClearAll(), 'className');
        return className.includes('disabled');
    }

    async getVizFilterLockMessageText() {
        return this.getVizFilterLockMessage().getText();
    }
}
