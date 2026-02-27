import BaseReportPanel from './BaseReportPanel.js';

export default class ReportObjectsPanel extends BaseReportPanel {
    // Locator
    getListItem(item) {
        return this.getReportObjectPanel()
            .$('.mstrTree')
            .element(by.cssContainingText('.mstrTreeClosed,.mstrTreeOpen', item));
    }

    // get  attribut/metric name, attribute form name(ID, DESC)
    getListItemText(item, text = item) {
        return this.getListItem(item).$(`span[ds=${text}]`);
    }

    getContextMenu() {
        return this.$('.mstrContextMenuRight');
    }

    getContextMenuItem(level, item) {
        return this.$('#ReportObjB' + level).element(
            by.cssContainingText('.menu-item,.menu-item-with-separator', new RegExp(`^${this.escapeRegExp(item)}\\s*$`))
        );
    }

    // Action helper
    async openContextMenu(item) {
        await this.click({ elem: this.getListItemText(item) }); // need click first
        await browser.actions().click(this.getListItemText(item), Button.RIGHT).perform();
        await this.waitForElementVisible(this.getContextMenu());
    }

    async selectContextMenu(menuPaths) {
        for (const [level, item] of menuPaths.entries()) {
            await this.click({ elem: this.getContextMenuItem(level + 1, item) });
        }
    }

    async expandItem(item) {
        return this.click(this.getListItem(item));
    }

    // Assertion helper
    async isDerivedMetric(name) {
        let isDerivedMetric = true;
        const metric = this.getElement().$(`.mstrTreeStrong[ds="${name}"]`);
        const metricTitle = await metric.getAttribute('title');
        if (metricTitle !== 'Derived Metric: ' + name) {
            isDerivedMetric = false;
        }
        const imageSrc = await metric.$('img').getAttribute('src');
        const imageSrcArray = imageSrc.split('/');
        if (imageSrcArray[imageSrcArray.length - 1] !== 'DerivedMetric.png') {
            isDerivedMetric = false;
        }
        return isDerivedMetric;
    }

    async isDerivedAttribute(name) {
        const attributeIcon = this.getElement().$(`.mstrTreeStrong[ds="${name}"] img`);
        const imageSrc = await attributeIcon.getAttribute('src');
        const imageSrcArray = imageSrc.split('/');
        return imageSrcArray[imageSrcArray.length - 1] === 'AttWithDE.gif';
    }

    async isItemPresent(item) {
        return this.getListItem(item).isDisplayed();
    }

    async isItemAttrFormPresent(item, attrForm) {
        return this.getListItemText(item, attrForm).isDisplayed();
    }
}
