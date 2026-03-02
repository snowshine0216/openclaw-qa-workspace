import BasePage from '../base/BasePage.js';

export default class PersonalViewDialog extends BasePage {
    constructor() {
        super('#mstrPVD', 'PersonalViewDialog');
    }

    // element locator
    getPersonalViewDialog() {
        return this.$('#mstrPVD');
    }

    getTextButtonByName(name) {
        return this.getPersonalViewDialog()
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === name;
            })[0];
    }

    async clickOnButtonByName(name) {
        const el = this.getTextButtonByName(name);
        await this.click({ elem: el });
        await this.waitForCurtainDisappear();
    }
}
