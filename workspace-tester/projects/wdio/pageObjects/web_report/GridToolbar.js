import BasePage from '../base/BasePage.js';

export default class GridToolbar extends BasePage {
    constructor() {
        super('#report_toolbar', 'Report Toolbar component');
    }

    getToolbar() {
        return this.$('#report_toolbar');
    }

    async getDataRows() {
        const el = await this.$$('.toolbar-static-text').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes('Data rows');
        })[0];
        let text = await el.getText();
        text = text.replace('Data rows:', '');
        const ofIndex = text.indexOf('of');
        if (ofIndex >= 0) {
            text = text.substr(ofIndex + 2);
        }
        return text.trim();
    }

    async getDataColumns() {
        const el = await this.$$('.toolbar-static-text').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes('Data columns');
        })[0];
        return el.getText();
    }

    getNextButtonInToolbar() {
        return this.getToolbar().$('.mstrFetchNext');
    }

    async switchToNextPage() {
        await this.sleep(1000);
        await this.getNextButtonInToolbar().click();
        await this.waitForCurtainDisappear();
    }

    async switchToNextColumnPage() {
        const index = await this.getToolbar().$$('img[title="More columns"]').length;
        return this.click({ elem: this.getToolbar().$$('img[title="More columns"]')[index - 1] });
    }

    async isReportBarPresent() {
        return this.getElement().isDisplayed();
    }
}
