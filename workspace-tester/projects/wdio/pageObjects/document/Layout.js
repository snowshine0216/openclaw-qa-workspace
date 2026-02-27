import BasePage from '../base/BasePage.js';

export default class Layout extends BasePage {
    constructor() {
        super('.mstrmojo-tabcontainer-tabs', 'Presentation Mode Layout component');
    }

    getLayoutTab(name) {
        return this.$$('.mstrmojo-TabButton').filter(async (elem) => {
            const elemName = await elem.getText();
            return elemName.includes(name);
        })[0];
    }

    async selectLayout(name, sleep = 2000) {
        await this.click({ elem: this.getLayoutTab(name) });
        await this.sleep(sleep);
    }

    async getSelectedLayout() {
        return this.getElement().$('.mstrmojo-TabButton.selected').getText();
    }
}
